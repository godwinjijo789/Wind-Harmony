import { Router, RequestHandler } from "express";
import {
  Project,
  ProjectRequest,
  MusicLayer,
  ApiResponse,
  PaginatedResponse,
} from "@shared/api";

export const router = Router();

// In-memory storage for demo purposes
const projects: Project[] = [
  {
    id: "1",
    userId: "1",
    name: "Symphony in C Major",
    description: "A beautiful classical symphony",
    tracks: 4,
    duration: "5:32",
    genre: "Classical",
    collaborators: 2,
    isPublic: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "2",
    name: "Jazz Evening",
    description: "Smooth jazz composition",
    tracks: 3,
    duration: "4:15",
    genre: "Jazz",
    collaborators: 1,
    isPublic: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const musicLayers: MusicLayer[] = [
  {
    id: "1",
    projectId: "1",
    instrument: "vocal-flute",
    track: ["C4", "D4", "E4", "F4"],
    volume: 75,
    muted: false,
    solo: false,
    createdAt: new Date().toISOString(),
  },
];

// Authentication middleware simulation
const authenticateUser = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Simple token verification (use proper JWT in production)
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }
};

// Get all projects for user
export const getProjects: RequestHandler = (req: any, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.userId;

  const userProjects = projects.filter(
    (p) => p.userId === userId || p.isPublic,
  );
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProjects = userProjects.slice(startIndex, endIndex);

  const response: PaginatedResponse<Project> = {
    data: paginatedProjects,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(userProjects.length / limit),
      totalItems: userProjects.length,
      hasNext: endIndex < userProjects.length,
      hasPrev: page > 1,
    },
  };

  res.json({
    success: true,
    data: response,
    timestamp: new Date().toISOString(),
  } as ApiResponse<PaginatedResponse<Project>>);
};

// Get single project
export const getProject: RequestHandler = (req: any, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const project = projects.find(
    (p) => p.id === id && (p.userId === userId || p.isPublic),
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  res.json({
    success: true,
    data: project,
    timestamp: new Date().toISOString(),
  } as ApiResponse<Project>);
};

// Create new project
export const createProject: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const { name, description, genre, isPublic }: ProjectRequest = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Project name is required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const newProject: Project = {
    id: (projects.length + 1).toString(),
    userId,
    name,
    description: description || "",
    tracks: 0,
    duration: "0:00",
    genre: genre || "Experimental",
    collaborators: 1,
    isPublic: isPublic || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(newProject);

  res.status(201).json({
    success: true,
    data: newProject,
    message: "Project created successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<Project>);
};

// Update project
export const updateProject: RequestHandler = (req: any, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const updates: Partial<ProjectRequest> = req.body;

  const projectIndex = projects.findIndex(
    (p) => p.id === id && p.userId === userId,
  );

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: projects[projectIndex],
    message: "Project updated successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<Project>);
};

// Delete project
export const deleteProject: RequestHandler = (req: any, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const projectIndex = projects.findIndex(
    (p) => p.id === id && p.userId === userId,
  );

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  projects.splice(projectIndex, 1);

  // Also delete associated music layers
  const layerIndices = musicLayers
    .map((layer, index) => (layer.projectId === id ? index : -1))
    .filter((index) => index !== -1)
    .reverse();

  layerIndices.forEach((index) => musicLayers.splice(index, 1));

  res.json({
    success: true,
    message: "Project deleted successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Get project layers
export const getProjectLayers: RequestHandler = (req: any, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const project = projects.find(
    (p) => p.id === id && (p.userId === userId || p.isPublic),
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const layers = musicLayers.filter((l) => l.projectId === id);

  res.json({
    success: true,
    data: layers,
    timestamp: new Date().toISOString(),
  } as ApiResponse<MusicLayer[]>);
};

// Create/Update project layer
export const saveProjectLayer: RequestHandler = (req: any, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const layerData = req.body;

  const project = projects.find((p) => p.id === id && p.userId === userId);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const existingLayerIndex = musicLayers.findIndex(
    (l) => l.projectId === id && l.id === layerData.id,
  );

  if (existingLayerIndex !== -1) {
    // Update existing layer
    musicLayers[existingLayerIndex] = {
      ...musicLayers[existingLayerIndex],
      ...layerData,
      projectId: id,
    };

    res.json({
      success: true,
      data: musicLayers[existingLayerIndex],
      message: "Layer updated successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse<MusicLayer>);
  } else {
    // Create new layer
    const newLayer: MusicLayer = {
      id: (musicLayers.length + 1).toString(),
      projectId: id,
      instrument: layerData.instrument || "vocal-flute",
      track: layerData.track || [],
      volume: layerData.volume || 75,
      muted: layerData.muted || false,
      solo: layerData.solo || false,
      createdAt: new Date().toISOString(),
    };

    musicLayers.push(newLayer);

    res.status(201).json({
      success: true,
      data: newLayer,
      message: "Layer created successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse<MusicLayer>);
  }
};

// Route definitions
router.use(authenticateUser);
router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/:id/layers", getProjectLayers);
router.post("/:id/layers", saveProjectLayer);
