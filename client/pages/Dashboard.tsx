import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wind,
  Play,
  Pause,
  Users,
  Clock,
  Music,
  Folder,
  Settings,
  Crown,
  Calendar,
  TrendingUp,
  BarChart3,
  Activity,
  Star,
  Download,
  Share2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mic,
  Volume2,
  Headphones,
  Award,
  Zap,
  Target,
  BookOpen,
  PlayCircle,
  StopCircle,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const trial = searchParams.get("trial");

  // User state management
  const [userType, setUserType] = useState<"free" | "trial" | "licensed">(
    "free",
  );
  const [user, setUser] = useState({
    name: "Godwin Jijo",
    email: "godwin@example.com",
    avatar: "/placeholder.svg",
    joinDate: "2024-01-15",
    totalProjects: 12,
    totalTracks: 47,
    totalTime: "18:42:33",
    streak: 5,
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Projects data
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "My First Symphony",
      genre: "Classical",
      tracks: 3,
      duration: "4:32",
      created: new Date("2024-01-20"),
      lastModified: new Date("2024-01-22"),
      status: "in-progress",
      collaborators: 2,
      thumbnail: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Jazz Ensemble",
      genre: "Jazz",
      tracks: 5,
      duration: "6:15",
      created: new Date("2024-01-18"),
      lastModified: new Date("2024-01-21"),
      status: "completed",
      collaborators: 3,
      thumbnail: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Wind Quintet",
      genre: "Chamber",
      tracks: 4,
      duration: "3:45",
      created: new Date("2024-01-15"),
      lastModified: new Date("2024-01-20"),
      status: "draft",
      collaborators: 1,
      thumbnail: "/placeholder.svg",
    },
  ]);

  // Recent activity
  const [recentActivity] = useState([
    {
      type: "project",
      action: "created",
      item: "My First Symphony",
      time: "2 hours ago",
    },
    {
      type: "collaboration",
      action: "joined",
      item: "Jazz Ensemble",
      time: "1 day ago",
    },
    {
      type: "recording",
      action: "uploaded",
      item: "Flute Solo",
      time: "2 days ago",
    },
    {
      type: "achievement",
      action: "unlocked",
      item: "First Composition",
      time: "3 days ago",
    },
  ]);

  // Statistics
  const [stats] = useState({
    weeklyProgress: 75,
    monthlyGoal: 85,
    practiceStreak: 5,
    skillLevel: "Intermediate",
    achievements: 8,
    collaborations: 15,
  });

  useEffect(() => {
    // Determine user type
    if (trial) {
      setUserType("trial");
    } else {
      // Check localStorage for user data
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserType(userData.trial ? "trial" : "licensed");
        setUser((prev) => ({ ...prev, ...userData }));
      }
    }
  }, [trial]);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        genre: "Experimental",
        tracks: 0,
        duration: "0:00",
        created: new Date(),
        lastModified: new Date(),
        status: "draft",
        collaborators: 1,
        thumbnail: "/placeholder.svg",
      };
      setProjects((prev) => [newProject, ...prev]);
      setNewProjectName("");
      setShowNewProject(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (
      project &&
      confirm(`Delete "${project.name}"? This cannot be undone.`)
    ) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  const handleDownloadProject = (project: any) => {
    const exportData = {
      ...project,
      exported: new Date().toISOString(),
      format: "WindHarmony v1.0",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTrialTimeRemaining = () => {
    if (userType !== "trial") return null;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.trialEnds) {
        const remaining = userData.trialEnds - Date.now();
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        return hours > 0 ? `${hours} hours` : "Expired";
      }
    }
    return "23 hours"; // Default
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">WindHarmony</h1>
                  <p className="text-sm text-muted-foreground">
                    Music Dashboard
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Trial Status */}
              {userType === "trial" && (
                <Alert className="p-2">
                  <Crown className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Trial: {getTrialTimeRemaining()} remaining
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <Button variant="outline" size="sm" asChild>
                <Link to="/workspace">
                  <Play className="h-4 w-4 mr-2" />
                  Open Workspace
                </Link>
              </Button>

              {userType !== "licensed" && (
                <Button size="sm" asChild>
                  <Link to="/pricing">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade
                  </Link>
                </Button>
              )}

              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-muted-foreground">
            Continue creating beautiful wind instrument music.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Projects
                      </p>
                      <p className="text-3xl font-bold">{projects.length}</p>
                    </div>
                    <Folder className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Tracks
                      </p>
                      <p className="text-3xl font-bold">{user.totalTracks}</p>
                    </div>
                    <Music className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Time Created
                      </p>
                      <p className="text-3xl font-bold">{user.totalTime}</p>
                    </div>
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Streak
                      </p>
                      <p className="text-3xl font-bold">{user.streak} days</p>
                    </div>
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Projects</CardTitle>
                    <Button size="sm" onClick={() => setShowNewProject(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Music className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project.tracks} tracks • {project.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            project.status === "completed"
                              ? "default"
                              : project.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/workspace">
                            <Play className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Progress & Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Weekly Practice Goal
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stats.weeklyProgress}%
                      </span>
                    </div>
                    <Progress value={stats.weeklyProgress} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Monthly Composition Goal
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stats.monthlyGoal}%
                      </span>
                    </div>
                    <Progress value={stats.monthlyGoal} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {stats.achievements}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Achievements
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {stats.collaborations}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Collaborations
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {stats.practiceStreak}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Day Streak
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Your Projects</h3>
                <p className="text-muted-foreground">
                  Manage and organize your musical compositions
                </p>
              </div>
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">
                          {project.name}
                        </h4>
                        <Badge variant="outline" className="mb-2">
                          {project.genre}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Created {project.created.toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log(`Viewing project: ${project.name}`);
                          alert(
                            `Project Details:\n\nName: ${project.name}\nGenre: ${project.genre}\nTracks: ${project.tracks}\nDuration: ${project.duration}\nCollaborators: ${project.collaborators}\nStatus: ${project.status}\nCreated: ${project.created.toLocaleDateString()}`,
                          );
                        }}
                        title="View project details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          {project.tracks} tracks
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {project.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {project.collaborators} collaborators
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            project.status === "completed"
                              ? "default"
                              : project.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1" asChild>
                        <Link to="/workspace">
                          <Play className="h-4 w-4 mr-2" />
                          Open
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadProject(project)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const shareUrl = `${window.location.origin}/shared/${project.id}`;
                          navigator.clipboard
                            .writeText(shareUrl)
                            .then(() => {
                              alert(
                                `Project shared successfully!\n\nShare URL copied to clipboard:\n${shareUrl}\n\nOthers can now access your project using this link.`,
                              );
                            })
                            .catch(() => {
                              // Fallback if clipboard API is not available
                              const textArea =
                                document.createElement("textarea");
                              textArea.value = shareUrl;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand("copy");
                              document.body.removeChild(textArea);
                              alert(
                                `Project shared successfully!\n\nShare URL: ${shareUrl}\n\nLink has been copied to clipboard.`,
                              );
                            });
                          console.log(
                            `Sharing project: ${project.name}, URL: ${shareUrl}`,
                          );
                        }}
                        title="Share project"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Analytics & Insights</h3>
              <p className="text-muted-foreground">
                Track your musical journey and progress
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Practice Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-muted/20 rounded-lg">
                      <h4 className="text-3xl font-bold text-primary">
                        2.5 hours
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Average daily practice
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold">18</p>
                        <p className="text-xs text-muted-foreground">
                          Sessions this week
                        </p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">85%</p>
                        <p className="text-xs text-muted-foreground">
                          Goal completion
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Skill Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Technique</span>
                        <span className="text-sm">Advanced</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Composition</span>
                        <span className="text-sm">Intermediate</span>
                      </div>
                      <Progress value={65} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Collaboration</span>
                        <span className="text-sm">Beginner</span>
                      </div>
                      <Progress value={35} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Music Library</h3>
              <p className="text-muted-foreground">
                Browse your compositions and recordings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-md transition-all"
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted/20 rounded-lg mb-3 flex items-center justify-center">
                      <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold mb-1">{project.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {project.genre}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {project.duration}
                      </span>
                      <Button variant="ghost" size="sm">
                        {isPlaying && currentTrack === project.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Recent Activity</h3>
              <p className="text-muted-foreground">
                Your latest actions and achievements
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        {activity.type === "project" && (
                          <Folder className="h-4 w-4 text-primary" />
                        )}
                        {activity.type === "collaboration" && (
                          <Users className="h-4 w-4 text-primary" />
                        )}
                        {activity.type === "recording" && (
                          <Mic className="h-4 w-4 text-primary" />
                        )}
                        {activity.type === "achievement" && (
                          <Award className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>{" "}
                          {activity.item}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Start a new musical composition project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-genre">Genre</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="chamber">Chamber Music</SelectItem>
                  <SelectItem value="folk">Folk</SelectItem>
                  <SelectItem value="experimental">Experimental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewProject(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
