import { Router, RequestHandler } from "express";
import { CompositionSettings, ApiResponse } from "@shared/api";

export const router = Router();

// In-memory storage for demo purposes
const userSettings: { [userId: string]: CompositionSettings } = {
  "1": {
    defaultKey: "C",
    timeSignature: "4/4",
    tempo: 120,
    metronomeSound: "click",
    autoHarmonize: true,
    scaleSnapping: true,
    chordSuggestions: true,
  },
};

const recordings: { [userId: string]: any[] } = {};

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

// Get composition settings
export const getCompositionSettings: RequestHandler = (req: any, res) => {
  const userId = req.userId;

  const settings = userSettings[userId] || {
    defaultKey: "C",
    timeSignature: "4/4",
    tempo: 120,
    metronomeSound: "click",
    autoHarmonize: true,
    scaleSnapping: true,
    chordSuggestions: true,
  };

  res.json({
    success: true,
    data: settings,
    timestamp: new Date().toISOString(),
  } as ApiResponse<CompositionSettings>);
};

// Update composition settings
export const updateCompositionSettings: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const settings: CompositionSettings = req.body;

  userSettings[userId] = settings;

  res.json({
    success: true,
    data: settings,
    message: "Settings updated successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<CompositionSettings>);
};

// Save recording
export const saveRecording: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const { title, audioData, duration, instrument } = req.body;

  if (!title || !audioData) {
    return res.status(400).json({
      success: false,
      message: "Title and audio data are required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  if (!recordings[userId]) {
    recordings[userId] = [];
  }

  const recording = {
    id: Date.now().toString(),
    title,
    audioData,
    duration: duration || "0:00",
    instrument: instrument || "unknown",
    createdAt: new Date().toISOString(),
  };

  recordings[userId].push(recording);

  res.status(201).json({
    success: true,
    data: recording,
    message: "Recording saved successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Get user recordings
export const getRecordings: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const userRecordings = recordings[userId] || [];

  res.json({
    success: true,
    data: userRecordings,
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Delete recording
export const deleteRecording: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const { id } = req.params;

  if (!recordings[userId]) {
    return res.status(404).json({
      success: false,
      message: "Recording not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const recordingIndex = recordings[userId].findIndex((r) => r.id === id);

  if (recordingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Recording not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  recordings[userId].splice(recordingIndex, 1);

  res.json({
    success: true,
    message: "Recording deleted successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Get available instruments
export const getInstruments: RequestHandler = (req, res) => {
  const instruments = {
    voice: [
      {
        id: "vocal-flute",
        name: "Vocal Flute",
        description: "Human-like breathy tones with flute characteristics",
        keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
        premium: false,
        category: "woodwind",
      },
      {
        id: "soprano-sax",
        name: "Soprano Voice Sax",
        description: "Saxophone with vocal warmth and expression",
        keys: ["C4", "D4", "E♭4", "F4", "G4", "A4", "B♭4", "C5"],
        premium: true,
        category: "saxophone",
      },
    ],
    nonVoice: [
      {
        id: "pure-flute",
        name: "Pure Flute",
        description: "Classic wooden flute with crystal clear tones",
        keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
        premium: false,
        category: "woodwind",
      },
      {
        id: "jazz-saxophone",
        name: "Jazz Saxophone",
        description: "Smooth saxophone for jazz compositions",
        keys: ["C4", "D4", "E♭4", "F4", "G4", "A4", "B♭4", "C5"],
        premium: true,
        category: "saxophone",
      },
    ],
  };

  res.json({
    success: true,
    data: instruments,
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Export composition
export const exportComposition: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const { projectId, format = "json" } = req.body;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // In a real implementation, this would generate actual audio files
  const composition = {
    projectId,
    format,
    exportedAt: new Date().toISOString(),
    downloadUrl: `/api/music/download/${projectId}`,
    fileSize: "2.5MB",
  };

  res.json({
    success: true,
    data: composition,
    message: "Composition exported successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Route definitions
router.use(authenticateUser);
router.get("/settings", getCompositionSettings);
router.put("/settings", updateCompositionSettings);
router.post("/recordings", saveRecording);
router.get("/recordings", getRecordings);
router.delete("/recordings/:id", deleteRecording);
router.get("/instruments", getInstruments);
router.post("/export", exportComposition);
