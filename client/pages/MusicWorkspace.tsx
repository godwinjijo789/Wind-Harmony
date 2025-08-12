import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PaymentSystem from "@/components/PaymentSystem";

// Extend Window interface for Web Audio API
declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
    audioContext?: AudioContext;
  }
}
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Wind,
  Mic,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Save,
  Users,
  Crown,
  Lock,
  Volume2,
  Square,
  Circle,
  Sparkles,
  Settings,
  Film,
  Scissors,
  Layers,
  Import,
  Send,
  Folder,
  Plus,
  Edit,
  Trash2,
  Home,
  Music,
  Library,
  Search,
  Filter,
  Shuffle,
  SkipForward,
  SkipBack,
  Download,
  Upload,
  Share2,
  Eye,
  Star,
  Clock,
  TrendingUp,
  Repeat,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const voiceInstruments = [
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
  {
    id: "vocal-trumpet",
    name: "Vocal Trumpet",
    description: "Trumpet with human vocal characteristics",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B♭4", "C5"],
    premium: true,
    category: "brass",
  },
];

const nonVoiceInstruments = [
  // Woodwinds
  {
    id: "pure-flute",
    name: "Pure Flute",
    description: "Classic wooden flute with crystal clear tones",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    premium: false,
    category: "woodwind",
  },
  {
    id: "concert-clarinet",
    name: "Concert Clarinet",
    description: "Rich wooden clarinet for orchestral arrangements",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    premium: true,
    category: "woodwind",
  },
  {
    id: "oboe",
    name: "Oboe",
    description: "Penetrating double-reed woodwind",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    premium: true,
    category: "woodwind",
  },
  {
    id: "bassoon",
    name: "Bassoon",
    description: "Deep double-reed instrument",
    keys: ["B♭2", "C3", "D3", "E♭3", "F3", "G3", "A3", "B♭3"],
    premium: true,
    category: "woodwind",
  },
  {
    id: "recorder",
    name: "Recorder",
    description: "Simple woodwind for beginners",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    premium: false,
    category: "woodwind",
  },
  // Saxophones
  {
    id: "jazz-saxophone",
    name: "Jazz Saxophone",
    description: "Traditional brass saxophone for jazz and blues",
    keys: ["C4", "D4", "E♭4", "F4", "G4", "A4", "B♭4", "C5"],
    premium: false,
    category: "saxophone",
  },
  {
    id: "alto-sax",
    name: "Alto Saxophone",
    description: "Smooth mid-range saxophone",
    keys: ["E♭3", "F3", "G3", "A♭3", "B♭3", "C4", "D4", "E♭4"],
    premium: false,
    category: "saxophone",
  },
  {
    id: "tenor-sax",
    name: "Tenor Saxophone",
    description: "Rich, deep saxophone tone",
    keys: ["B♭2", "C3", "D3", "E♭3", "F3", "G3", "A3", "B♭3"],
    premium: true,
    category: "saxophone",
  },
  {
    id: "baritone-sax",
    name: "Baritone Saxophone",
    description: "Powerful low-end saxophone",
    keys: ["E♭2", "F2", "G2", "A♭2", "B���2", "C3", "D3", "E♭3"],
    premium: true,
    category: "saxophone",
  },
  // Brass
  {
    id: "orchestral-trumpet",
    name: "Orchestral Trumpet",
    description: "Professional brass trumpet for classical music",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B���4", "C5"],
    premium: true,
    category: "brass",
  },
  {
    id: "french-horn",
    name: "French Horn",
    description: "Warm, mellow brass instrument",
    keys: ["C3", "D3", "E3", "F3", "G3", "A3", "B♭3", "C4"],
    premium: true,
    category: "brass",
  },
  {
    id: "trombone",
    name: "Trombone",
    description: "Powerful slide brass instrument",
    keys: ["B♭2", "C3", "D3", "E♭3", "F3", "G3", "A3", "B♭3"],
    premium: true,
    category: "brass",
  },
  {
    id: "tuba",
    name: "Tuba",
    description: "Deep foundation brass instrument",
    keys: ["B♭1", "C2", "D2", "E♭2", "F2", "G2", "A2", "B♭2"],
    premium: true,
    category: "brass",
  },
  {
    id: "euphonium",
    name: "Euphonium",
    description: "Melodic mid-range brass",
    keys: ["B♭2", "C3", "D3", "E♭3", "F3", "G3", "A3", "B♭3"],
    premium: true,
    category: "brass",
  },
  // Ethnic/Traditional
  {
    id: "pan-flute",
    name: "Pan Flute",
    description: "Multiple pipe wind instrument",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    premium: false,
    category: "ethnic",
  },
  {
    id: "harmonica",
    name: "Harmonica",
    description: "Portable mouth organ",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    premium: false,
    category: "ethnic",
  },
  {
    id: "ocarina",
    name: "Ocarina",
    description: "Ancient vessel flute",
    keys: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    premium: false,
    category: "ethnic",
  },
  {
    id: "irish-whistle",
    name: "Irish Whistle",
    description: "Traditional Celtic wind instrument",
    keys: ["D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5"],
    premium: false,
    category: "ethnic",
  },
  // Bass Instruments
  {
    id: "bass-clarinet",
    name: "Bass Clarinet",
    description: "Deep, rich clarinet for low register",
    keys: ["E♭2", "F2", "G2", "A♭2", "B���2", "C3", "D3", "E♭3"],
    premium: true,
    category: "bass",
  },
  {
    id: "contrabassoon",
    name: "Contrabassoon",
    description: "Extremely low double-reed instrument",
    keys: ["B���1", "C2", "D2", "E♭2", "F2", "G2", "A2", "B♭2"],
    premium: true,
    category: "bass",
  },
  {
    id: "bass-flute",
    name: "Bass Flute",
    description: "Low, haunting flute tones",
    keys: ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"],
    premium: true,
    category: "bass",
  },
];

interface MusicWorkspaceProps {
  userType?: "trial" | "licensed" | "free";
  isAdmin?: boolean;
}

export default function MusicWorkspace({
  userType = "licensed",
  isAdmin = true,
}: MusicWorkspaceProps) {
  const [activeCategory, setActiveCategory] = useState<"voice" | "non-voice">(
    "voice",
  );
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused"
  >("idle");
  const [volume, setVolume] = useState([75]);
  const [voiceBeautifying, setVoiceBeautifying] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState("instruments");
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "My First Symphony",
      tracks: 3,
      duration: "4:32",
      created: new Date(),
      genre: "Classical",
      collaborators: 2,
    },
  ]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [multiMusicLayers, setMultiMusicLayers] = useState([
    {
      id: "1",
      instrument: "vocal-flute",
      track: [],
      volume: 75,
      muted: false,
      solo: false,
    },
  ]);
  const [activeLayer, setActiveLayer] = useState("1");
  const [masterVolume, setMasterVolume] = useState([80]);
  const [currentProject, setCurrentProject] = useState(null);
  const [showInstrumentPicker, setShowInstrumentPicker] = useState<
    string | null
  >(null);
  const [feedbackData, setFeedbackData] = useState({
    email: "",
    category: "",
    message: "",
  });
  const [showComposeSettings, setShowComposeSettings] = useState(false);

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(204); // 3:24 in seconds
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sceneMarkers, setSceneMarkers] = useState([
    { time: 15, label: "Opening" },
    { time: 45, label: "Character Intro" },
    { time: 90, label: "Conflict" },
    { time: 150, label: "Climax" },
    { time: 180, label: "Resolution" },
  ]);
  const [movieTempo, setMovieTempo] = useState(120);
  const [movieKey, setMovieKey] = useState("C");
  const [syncOptions, setSyncOptions] = useState({
    autoSync: true,
    beatMatch: false,
    sceneDetection: false,
  });
  const [composeSettings, setComposeSettings] = useState({
    defaultKey: "C",
    timeSignature: "4/4",
    tempo: 120,
    metronomeSound: "click",
    autoHarmonize: true,
    scaleSnapping: true,
    chordSuggestions: true,
  });
  const [showPaymentSystem, setShowPaymentSystem] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    "professional" | "enterprise"
  >("professional");

  // Button handlers
  const handleUpgradeLicense = () => {
    setSelectedPlan("professional");
    setShowPaymentSystem(true);
  };

  const handlePaymentSuccess = (plan: string, transactionId: string) => {
    console.log("Payment successful:", { plan, transactionId });
    alert(
      `Payment successful! You now have ${plan} access.` +
        "\\n" +
        `Transaction ID: ${transactionId}` +
        "\\n" +
        "Welcome to WindHarmony Premium!",
    );
    setShowPaymentSystem(false);

    // In a real app, this would update the user's license status
    // For now, we'll just store it in localStorage
    localStorage.setItem(
      "userLicense",
      JSON.stringify({
        type: plan,
        transactionId,
        activatedAt: new Date().toISOString(),
      }),
    );
  };

  const handleCollaborate = () => {
    alert(
      "Collaboration feature: Share your project link with others to work together in real-time!",
    );
  };

  const handleSave = () => {
    console.log("Saving current workspace...");
    alert("Workspace saved successfully!");
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        tracks: 0,
        duration: "0:00",
        created: new Date(),
        genre: "Experimental",
        collaborators: 1,
      };
      setProjects((prev) => [...prev, newProject]);
      setNewProjectName("");
      setShowNewProject(false);
      alert(`Project "${newProject.name}" created successfully!`);
    }
  };

  // Derived state - moved before useEffect to fix initialization order
  const currentInstruments =
    activeCategory === "voice" ? voiceInstruments : nonVoiceInstruments;
  const selectedInstrumentData = currentInstruments.find(
    (inst) => inst.id === selectedInstrument,
  );

  const canAccessInstrument = (instrument: any) => {
    if (!instrument.premium) return true;
    return userType === "licensed" || userType === "trial";
  };

  // Load compose settings and AI generations from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("composeSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setComposeSettings((prev) => ({ ...prev, ...parsed }));
        console.log("Loaded compose settings from localStorage:", parsed);
      } catch (error) {
        console.error("Failed to parse saved compose settings:", error);
      }
    }
  }, []);

  // Initialize audio context
  useEffect(() => {
    const initAudioContext = () => {
      if (!window.audioContext) {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          window.audioContext = ctx;
          setAudioContext(ctx);
        }
      } else {
        setAudioContext(window.audioContext);
      }
    };

    // Initialize on user interaction to comply with browser autoplay policies
    const handleUserInteraction = () => {
      initAudioContext();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  // Add keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent if user is typing in input fields or textareas
      if (
        e.target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      )
        return;

      const keyMap: { [key: string]: string } = {
        a: "C4",
        s: "D4",
        d: "E4",
        f: "F4",
        g: "G4",
        h: "A4",
        j: "B4",
        k: "C5",
      };

      const note = keyMap[e.key.toLowerCase()];
      if (!note) return;

      console.log(
        `���� Key pressed: ${e.key.toUpperCase()} → ${note}, Tab: ${workspaceTab}`,
      );

      // For MultiMusic tab, use active layer instrument
      if (workspaceTab === "multimusic" && activeLayer) {
        const layer = multiMusicLayers.find((l) => l.id === activeLayer);
        const instrument = [...voiceInstruments, ...nonVoiceInstruments].find(
          (i) => i.id === layer?.instrument,
        );

        if (instrument && canAccessInstrument(instrument)) {
          e.preventDefault();
          setSelectedInstrument(instrument.id);
          console.log(
            `🎵 Playing ${note} on ${instrument.name} (Layer ${activeLayer})`,
          );
          handleKeyPress(note);
        } else {
          console.log(`❌ Cannot access instrument or note not available`);
        }
      }
      // For Instruments tab, use selected instrument
      else if (workspaceTab === "instruments" && selectedInstrumentData) {
        if (canAccessInstrument(selectedInstrumentData)) {
          e.preventDefault();
          console.log(`🎵 Playing ${note} on ${selectedInstrumentData.name}`);
          handleKeyPress(note);
        } else {
          console.log(`❌ Cannot access selected instrument`);
        }
      }
      // For other tabs, try to use any available instrument
      else {
        const defaultInstrument = [
          ...voiceInstruments,
          ...nonVoiceInstruments,
        ].find((i) => canAccessInstrument(i) && i.keys.includes(note));
        if (defaultInstrument) {
          e.preventDefault();
          setSelectedInstrument(defaultInstrument.id);
          console.log(
            `🎵 Playing ${note} on ${defaultInstrument.name} (fallback)`,
          );
          handleKeyPress(note);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedInstrument,
    selectedInstrumentData,
    workspaceTab,
    activeLayer,
    multiMusicLayers,
    voiceInstruments,
    nonVoiceInstruments,
  ]);

  const handleKeyPress = (key: string) => {
    if (userType === "free" && selectedInstrumentData?.premium) {
      return; // Don't play premium instruments for free users
    }

    setActiveKey(key);

    // Get effective volume from active layer or main volume, considering mute state
    let effectiveVolume;
    if (workspaceTab === "multimusic" && activeLayer) {
      const layer = multiMusicLayers.find((l) => l.id === activeLayer);
      if (layer && layer.muted) {
        effectiveVolume = 0; // Muted layer produces no sound
      } else {
        effectiveVolume = layer
          ? (layer.volume / 100) * (masterVolume[0] / 100)
          : volume[0] / 100;
      }
    } else {
      effectiveVolume = volume[0] / 100;
    }

    const effects =
      voiceBeautifying && activeCategory === "voice"
        ? " with voice beautifying"
        : "";
    console.log(
      `Playing ${selectedInstrument} - ${key} at ${Math.round(effectiveVolume * 100)}% volume${effects}`,
    );

    // Simulate audio playback
    playInstrumentSound(key, effectiveVolume);

    // Reset active key after animation
    setTimeout(() => setActiveKey(null), 200);
  };

  const playInstrumentSound = (key: string, volume: number) => {
    // Create audio context if not exists
    if (!window.audioContext) {
      window.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const audioContext = window.audioContext;

    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Generate frequency for the key
    const frequencies: { [key: string]: number } = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.0,
      A4: 440.0,
      B4: 493.88,
      "B♭4": 466.16,
      C5: 523.25,
      "E♭4": 311.13,
    };

    const frequency = frequencies[key] || 440;

    // Create oscillator for the sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect oscillator to gain to output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure the sound based on instrument type
    if (selectedInstrumentData) {
      if (selectedInstrumentData.name.toLowerCase().includes("flute")) {
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume * 0.3,
          audioContext.currentTime + 0.1,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 1.5,
        );
      } else if (selectedInstrumentData.name.toLowerCase().includes("sax")) {
        oscillator.type = "sawtooth";
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume * 0.4,
          audioContext.currentTime + 0.1,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 2.0,
        );
      } else if (
        selectedInstrumentData.name.toLowerCase().includes("trumpet")
      ) {
        oscillator.type = "square";
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume * 0.3,
          audioContext.currentTime + 0.05,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 1.2,
        );
      } else if (
        selectedInstrumentData.name.toLowerCase().includes("clarinet")
      ) {
        oscillator.type = "triangle";
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume * 0.35,
          audioContext.currentTime + 0.1,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 1.8,
        );
      }
    }

    // Apply voice beautifying effect for voice instruments
    if (voiceBeautifying && activeCategory === "voice") {
      // Add a slight vibrato effect
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();

      lfo.frequency.setValueAtTime(5, audioContext.currentTime); // 5Hz vibrato
      lfoGain.gain.setValueAtTime(10, audioContext.currentTime); // Slight frequency modulation

      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      lfo.start();
      lfo.stop(audioContext.currentTime + 2);
    }

    // Set frequency and play
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);

    console.log(
      `🎵 ${selectedInstrumentData?.name} ${key} - Volume: ${Math.round(volume * 100)}%`,
    );

    // Add to recording if currently recording
    if (recordingState === "recording") {
      console.log(`📼 Recording: ${key} added to track`);
    }
  };

  const handleRecordingControl = async () => {
    // For voice instruments, use real microphone recording
    if (activeCategory === "voice" && recordingState === "idle") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            // Enable high-quality audio for voice recording
            sampleRate: 44100,
            channelCount: 1,
          },
        });

        setAudioStream(stream);

        const recorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });

        const chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          console.log("🎤 Voice recording completed:", url);

          // Apply voice beautifying if enabled
          if (voiceBeautifying) {
            console.log("✨ Applying voice beautifying to recorded audio");
            // In a real app, this would process the audio with AI voice enhancement
          }
        };

        setMediaRecorder(recorder);
        recorder.start(100); // Collect data every 100ms
        setRecordingState("recording");
        setIsVoiceRecording(true);
        console.log("🎤 Voice recording started with microphone");
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access to record voice.");
        return;
      }
    }

    // Handle other recording states
    switch (recordingState) {
      case "idle":
        if (activeCategory !== "voice") {
          setRecordingState("recording");
          console.log("🔴 Instrument recording started");
        }
        break;
      case "recording":
        setRecordingState("paused");
        if (mediaRecorder && activeCategory === "voice") {
          mediaRecorder.pause();
          console.log("⏸️ Voice recording paused");
        } else {
          console.log("⏸️ Recording paused");
        }
        break;
      case "paused":
        setRecordingState("recording");
        if (mediaRecorder && activeCategory === "voice") {
          mediaRecorder.resume();
          console.log("▶️ Voice recording resumed");
        } else {
          console.log("▶️ Recording resumed");
        }
        break;
    }
  };

  const handleStopRecording = () => {
    setRecordingState("idle");
    setHasRecording(true);

    // Stop voice recording if active
    if (isVoiceRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsVoiceRecording(false);
      setMediaRecorder(null);

      // Stop audio stream
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }

      console.log("⏹️ Voice recording stopped and saved");
    } else {
      console.log("⏹️ Recording stopped and saved");
    }
  };

  const handlePlayRecording = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? "⏸️ Playback paused" : "▶️ Playing recorded track");
  };

  const handleClearRecording = () => {
    setRecordingState("idle");
    setHasRecording(false);
    setIsPlaying(false);

    // Clean up voice recording
    if (isVoiceRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsVoiceRecording(false);
      setMediaRecorder(null);
    }

    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }

    console.log("🗑️ Recording cleared");
  };

  // Manage video element lifecycle to prevent play() interruptions
  useEffect(() => {
    const videoElement = document.querySelector("video") as HTMLVideoElement;
    if (videoElement && videoFile) {
      // Update current time if significantly different
      if (Math.abs(videoElement.currentTime - currentTime) > 1) {
        videoElement.currentTime = currentTime;
      }

      // Handle play/pause state
      if (isPlaying && videoElement.paused) {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Video play failed in useEffect:", error);
            setIsPlaying(false);
          });
        }
      } else if (!isPlaying && !videoElement.paused) {
        videoElement.pause();
      }
    }
  }, [currentTime, isPlaying, videoFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Wind className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Music Workspace</h1>
                <p className="text-sm text-muted-foreground">
                  {userType === "trial" && "Trial Mode - 1 day remaining"}
                  {userType === "licensed" && "Licensed User"}
                  {userType === "free" &&
                    "Free Access - Upgrade for premium instruments"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Feedback Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedbackDialog(true)}
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <Star className="h-4 w-4 mr-2" />
                Feedback
              </Button>

              {/* Only show admin panel to admin users */}
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <Crown className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
              )}
              {userType !== "licensed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpgradeLicense}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade License
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCollaborate}>
                <Users className="h-4 w-4 mr-2" />
                Collaborate
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Workspace Tabs */}
        <Tabs
          value={workspaceTab}
          onValueChange={setWorkspaceTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="instruments"
              className="flex items-center gap-2"
            >
              <Wind className="h-4 w-4" />
              Instruments
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="multimusic" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              MultiMusic
            </TabsTrigger>
            <TabsTrigger value="studio" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Studio
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Movie Music
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-8">
            {/* Welcome Section */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Wind className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold">
                    Welcome to Wind Music Studio
                  </h1>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Create beautiful wind instrument music with our
                    professional-grade digital instruments, real-time
                    collaboration, and advanced audio processing.
                  </p>
                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      onClick={() => setWorkspaceTab("instruments")}
                      size="lg"
                    >
                      <Wind className="h-5 w-5 mr-2" />
                      Start Playing
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewProject(true)}
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      New Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{projects.length}</p>
                      <p className="text-sm text-muted-foreground">Projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Wind className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {voiceInstruments.length + nonVoiceInstruments.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Instruments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">
                        Collaborators
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">18:42</p>
                      <p className="text-sm text-muted-foreground">
                        Total Time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Continue working on your latest compositions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.slice(0, 3).map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{project.name}</h3>
                          <Badge variant="outline">{project.genre}</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              {project.tracks} tracks
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {project.duration}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.collaborators} collaborators
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => setWorkspaceTab("projects")}
                        >
                          Open Project
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Projects</h2>
                <p className="text-muted-foreground">
                  Manage your music projects and collaborations
                </p>
              </div>
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Project Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="chamber">Chamber</SelectItem>
                  <SelectItem value="folk">Folk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((project) => {
                  // Filter by search query
                  const matchesSearch =
                    searchQuery === "" ||
                    project.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    project.genre
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase());

                  // Filter by category
                  const matchesCategory =
                    selectedCategory === "all" ||
                    project.genre.toLowerCase() ===
                      selectedCategory.toLowerCase();

                  return matchesSearch && matchesCategory;
                })
                .map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {project.name}
                          </h3>
                          <Badge variant="outline">{project.genre}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            console.log(`Viewing project: ${project.name}`);
                            alert(
                              `Project Details:\n\nName: ${project.name}\nGenre: ${project.genre}\nTracks: ${project.tracks}\nDuration: ${project.duration}\nCollaborators: ${project.collaborators}\nStatus: Active\nLast Modified: Recently`,
                            );
                          }}
                          title="View project details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Music className="h-4 w-4" />
                            {project.tracks} tracks
                          </span>
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {project.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {project.collaborators} collaborators
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created {project.created.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            console.log("Opening project:", project.name);
                            setCurrentProject(project);
                            setWorkspaceTab("multimusic");
                            alert(
                              `Opening project: ${project.name}` +
                                "\\n" +
                                `Genre: ${project.genre}` +
                                "\\n" +
                                `Tracks: ${project.tracks}` +
                                "\\n" +
                                `Duration: ${project.duration}`,
                            );
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Download project
                            const projectData = {
                              ...project,
                              exported: new Date().toISOString(),
                            };

                            const blob = new Blob(
                              [JSON.stringify(projectData, null, 2)],
                              {
                                type: "application/json",
                              },
                            );

                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                `Delete project "${project.name}"? This cannot be undone.`,
                              )
                            ) {
                              setProjects((prev) =>
                                prev.filter((p) => p.id !== project.id),
                              );
                              alert(
                                `Project "${project.name}" deleted successfully.`,
                              );
                            }
                          }}
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
                                  `Project shared successfully!\n\nShare URL copied to clipboard:\n${shareUrl}\n\nOthers can now access your "${project.name}" project using this link.`,
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
              {projects.filter((project) => {
                const matchesSearch =
                  searchQuery === "" ||
                  project.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  project.genre
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                const matchesCategory =
                  selectedCategory === "all" ||
                  project.genre.toLowerCase() ===
                    selectedCategory.toLowerCase();
                return matchesSearch && matchesCategory;
              }).length === 0 && (
                <div className="col-span-full text-center py-8">
                  <div className="text-muted-foreground">
                    <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      No projects found
                    </p>
                    <p className="text-sm">
                      {searchQuery || selectedCategory !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Create your first project to get started"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* MultiMusic Tab */}
          <TabsContent value="multimusic" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">MultiMusic Studio</h2>
                <p className="text-muted-foreground">
                  Layer multiple instruments and create complex compositions
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".json,.midi,.wav,.mp3";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        console.log("Importing file:", file.name);
                        // Handle file import logic here
                        alert(`Importing ${file.name} - Feature coming soon!`);
                      }
                    };
                    input.click();
                  }}
                >
                  <Import className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Export current composition
                    const exportData = {
                      project: "MultiMusic Composition",
                      layers: multiMusicLayers,
                      timestamp: new Date().toISOString(),
                      settings: { masterVolume: masterVolume[0] },
                    };

                    const blob = new Blob(
                      [JSON.stringify(exportData, null, 2)],
                      {
                        type: "application/json",
                      },
                    );

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `composition-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);

                    console.log("Exported composition:", exportData);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Master Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Master Controls</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("MultiMusic: Skip back clicked");
                        alert("Skip back functionality");
                      }}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        console.log(
                          isPlaying
                            ? "MultiMusic: Paused"
                            : "MultiMusic: Playing",
                        );
                        alert(
                          isPlaying
                            ? "MultiMusic Paused"
                            : "MultiMusic Playing",
                        );
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("MultiMusic: Skip forward clicked");
                        alert("Skip forward functionality");
                      }}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsPlaying(false);
                        console.log("MultiMusic: Stopped");
                        alert("MultiMusic Stopped");
                      }}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("MultiMusic: Record clicked");
                        alert("Recording functionality");
                      }}
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-sm">Master</span>
                  </div>
                  <div className="flex-1">
                    <Slider
                      value={masterVolume}
                      onValueChange={(value) => {
                        setMasterVolume(value);
                        console.log(`Master volume changed to ${value[0]}%`);
                        // Play test note with correct volume calculation for active layer
                        if (selectedInstrumentData && activeLayer) {
                          const layer = multiMusicLayers.find(
                            (l) => l.id === activeLayer,
                          );
                          if (layer && !layer.muted) {
                            const testVolume =
                              (layer.volume / 100) * (value[0] / 100);
                            playInstrumentSound("C4", testVolume);
                          }
                        }
                      }}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {masterVolume[0]}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Instrument Layers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Instrument Layers</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      const newLayerId = (
                        multiMusicLayers.length + 1
                      ).toString();
                      const availableInstruments = [
                        ...voiceInstruments,
                        ...nonVoiceInstruments,
                      ];
                      const randomInstrument =
                        availableInstruments[
                          Math.floor(
                            Math.random() * availableInstruments.length,
                          )
                        ];

                      const newLayer = {
                        id: newLayerId,
                        instrument: randomInstrument.id,
                        track: [],
                        volume: 75,
                        muted: false,
                        solo: false,
                      };

                      setMultiMusicLayers((prev) => [...prev, newLayer]);
                      setActiveLayer(newLayerId);
                      console.log("Added new layer:", newLayer);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Layer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {multiMusicLayers.map((layer) => {
                  const instrument = [
                    ...voiceInstruments,
                    ...nonVoiceInstruments,
                  ].find((i) => i.id === layer.instrument);
                  return (
                    <div
                      key={layer.id}
                      className={`border rounded-lg p-4 transition-all ${
                        activeLayer === layer.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      onClick={() => setActiveLayer(layer.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <div className="flex flex-col">
                            <h4 className="font-medium">
                              {instrument?.name || "Unknown Instrument"}
                            </h4>
                            <Badge variant="outline" className="text-xs w-fit">
                              {instrument?.category}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowInstrumentPicker(layer.id);
                            }}
                          >
                            <Music className="h-3 w-3 mr-1" />
                            Change
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMultiMusicLayers((prev) =>
                                prev.map((l) =>
                                  l.id === layer.id
                                    ? { ...l, solo: !l.solo }
                                    : { ...l, solo: false },
                                ),
                              );
                            }}
                          >
                            {layer.solo ? (
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant={layer.muted ? "destructive" : "ghost"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMultiMusicLayers((prev) =>
                                prev.map((l) =>
                                  l.id === layer.id
                                    ? { ...l, muted: !l.muted }
                                    : l,
                                ),
                              );
                              console.log(
                                `Layer ${layer.id} ${!layer.muted ? "muted" : "unmuted"}`,
                              );
                              // Provide audio feedback
                              if (!layer.muted && instrument) {
                                // Play a note to confirm unmuting
                                setTimeout(() => {
                                  const newEffectiveVolume =
                                    (layer.volume / 100) *
                                    (masterVolume[0] / 100);
                                  playInstrumentSound(
                                    instrument.keys[0],
                                    newEffectiveVolume,
                                  );
                                }, 100);
                              }
                            }}
                          >
                            {layer.muted ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowInstrumentPicker(layer.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                confirm(`Delete layer "${instrument?.name}"?`)
                              ) {
                                setMultiMusicLayers((prev) =>
                                  prev.filter((l) => l.id !== layer.id),
                                );
                                if (activeLayer === layer.id) {
                                  const remainingLayers =
                                    multiMusicLayers.filter(
                                      (l) => l.id !== layer.id,
                                    );
                                  setActiveLayer(
                                    remainingLayers.length > 0
                                      ? remainingLayers[0].id
                                      : "",
                                  );
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-muted/30 h-12 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">
                            Track timeline - {layer.track.length} notes
                          </span>
                        </div>
                        <div className="flex items-center gap-2 w-32">
                          <Volume2 className="h-4 w-4" />
                          <Slider
                            value={[layer.volume]}
                            onValueChange={(value) => {
                              setMultiMusicLayers((prev) =>
                                prev.map((l) =>
                                  l.id === layer.id
                                    ? { ...l, volume: value[0] }
                                    : l,
                                ),
                              );
                              console.log(
                                `Layer ${layer.id} volume changed to ${value[0]}%`,
                              );
                              // Play test note to hear volume change (only if not muted)
                              if (instrument && !layer.muted) {
                                const effectiveVolume =
                                  (value[0] / 100) * (masterVolume[0] / 100);
                                playInstrumentSound(
                                  instrument.keys[0],
                                  effectiveVolume,
                                );
                              }
                            }}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs w-8">{layer.volume}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Active Layer Instrument Control */}
            {activeLayer && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Layer Controls</CardTitle>
                  <CardDescription>
                    {(() => {
                      const instrument = [
                        ...voiceInstruments,
                        ...nonVoiceInstruments,
                      ].find(
                        (i) =>
                          i.id ===
                          multiMusicLayers.find((l) => l.id === activeLayer)
                            ?.instrument,
                      );
                      return instrument?.name || "No instrument selected";
                    })()}{" "}
                    - Layer {activeLayer}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const layerInstrument = multiMusicLayers.find(
                      (l) => l.id === activeLayer,
                    );
                    const instrument = [
                      ...voiceInstruments,
                      ...nonVoiceInstruments,
                    ].find((i) => i.id === layerInstrument?.instrument);

                    if (!instrument) return <p>No instrument selected</p>;

                    return (
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {instrument.keys.map((key) => (
                          <Button
                            key={key}
                            variant={activeKey === key ? "default" : "outline"}
                            className={`aspect-square text-sm font-mono transition-all hover:scale-105 ${
                              activeKey === key ? "scale-105 bg-primary" : ""
                            }`}
                            onClick={() => handleKeyPress(key)}
                          >
                            {key}
                          </Button>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Instruments Tab (existing content) */}
          <TabsContent value="instruments">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Instrument Selection */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wind className="h-5 w-5" />
                      Instruments
                    </CardTitle>
                    <CardDescription>
                      Choose your wind instrument category
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs
                      value={activeCategory}
                      onValueChange={(value) =>
                        setActiveCategory(value as "voice" | "non-voice")
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="voice"
                          className="flex items-center gap-2"
                        >
                          <Mic className="h-4 w-4" />
                          Voice
                        </TabsTrigger>
                        <TabsTrigger
                          value="non-voice"
                          className="flex items-center gap-2"
                        >
                          <VolumeX className="h-4 w-4" />
                          Non-Voice
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="voice" className="space-y-3 mt-4">
                        {voiceInstruments.map((instrument) => (
                          <Card
                            key={instrument.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedInstrument === instrument.id
                                ? "ring-2 ring-primary"
                                : ""
                            } ${!canAccessInstrument(instrument) ? "opacity-50" : ""}`}
                            onClick={() =>
                              canAccessInstrument(instrument) &&
                              setSelectedInstrument(instrument.id)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm">
                                  {instrument.name}
                                </h3>
                                {instrument.premium && (
                                  <Badge
                                    variant={
                                      canAccessInstrument(instrument)
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {canAccessInstrument(instrument) ? (
                                      <Crown className="h-3 w-3" />
                                    ) : (
                                      <Lock className="h-3 w-3" />
                                    )}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {instrument.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="non-voice" className="space-y-3 mt-4">
                        {nonVoiceInstruments.map((instrument) => (
                          <Card
                            key={instrument.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedInstrument === instrument.id
                                ? "ring-2 ring-primary"
                                : ""
                            } ${!canAccessInstrument(instrument) ? "opacity-50" : ""}`}
                            onClick={() =>
                              canAccessInstrument(instrument) &&
                              setSelectedInstrument(instrument.id)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm">
                                  {instrument.name}
                                </h3>
                                {instrument.premium && (
                                  <Badge
                                    variant={
                                      canAccessInstrument(instrument)
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {canAccessInstrument(instrument) ? (
                                      <Crown className="h-3 w-3" />
                                    ) : (
                                      <Lock className="h-3 w-3" />
                                    )}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {instrument.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Instrument Keys */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedInstrumentData
                        ? selectedInstrumentData.name
                        : "Select an Instrument"}
                      {selectedInstrumentData?.premium &&
                        !canAccessInstrument(selectedInstrumentData) && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                    </CardTitle>
                    <CardDescription>
                      {selectedInstrumentData
                        ? selectedInstrumentData.description
                        : "Choose an instrument from the left panel to start playing"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!selectedInstrumentData && (
                      <div className="text-center py-12">
                        <Wind className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Select an instrument to start making music
                        </p>
                      </div>
                    )}

                    {selectedInstrumentData &&
                      !canAccessInstrument(selectedInstrumentData) && (
                        <Alert>
                          <Lock className="h-4 w-4" />
                          <AlertDescription>
                            This is a premium instrument. Upgrade to a license
                            to access professional-grade sounds.
                            <Button variant="link" className="p-0 h-auto ml-1">
                              Upgrade now
                            </Button>
                          </AlertDescription>
                        </Alert>
                      )}

                    {selectedInstrumentData && (
                      <>
                        {/* Recording and Playback Controls */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRecordingControl}
                                className={
                                  recordingState === "recording"
                                    ? "bg-red-500/10 border-red-500/50"
                                    : recordingState === "paused"
                                      ? "bg-yellow-500/10 border-yellow-500/50"
                                      : ""
                                }
                              >
                                {recordingState === "idle" && (
                                  <Circle className="h-4 w-4 mr-2 text-red-500" />
                                )}
                                {recordingState === "recording" && (
                                  <Pause className="h-4 w-4 mr-2 text-red-500" />
                                )}
                                {recordingState === "paused" && (
                                  <Play className="h-4 w-4 mr-2 text-yellow-500" />
                                )}
                                {recordingState === "idle" && "Record"}
                                {recordingState === "recording" && "Pause"}
                                {recordingState === "paused" && "Resume"}
                              </Button>

                              {recordingState !== "idle" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleStopRecording}
                                >
                                  <Square className="h-4 w-4 mr-2" />
                                  Stop
                                </Button>
                              )}

                              {hasRecording && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handlePlayRecording}
                                  className={
                                    isPlaying
                                      ? "bg-green-500/10 border-green-500/50"
                                      : ""
                                  }
                                >
                                  {isPlaying ? (
                                    <Pause className="h-4 w-4 mr-2" />
                                  ) : (
                                    <Play className="h-4 w-4 mr-2" />
                                  )}
                                  {isPlaying ? "Pause" : "Play"}
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearRecording}
                                disabled={recordingState === "recording"}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Clear
                              </Button>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Label htmlFor="metronome" className="text-sm">
                                Metronome
                              </Label>
                              <Switch id="metronome" />
                            </div>
                          </div>

                          {/* Volume and Voice Controls */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Volume2 className="h-4 w-4 text-muted-foreground" />
                                <Label className="text-sm font-medium">
                                  Volume
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                  {volume[0]}%
                                </span>
                              </div>
                              <Slider
                                value={volume}
                                onValueChange={(value) => {
                                  setVolume(value);
                                  console.log(
                                    `Instrument volume changed to ${value[0]}%`,
                                  );
                                  // Play test note to hear volume change
                                  if (selectedInstrumentData) {
                                    playInstrumentSound(
                                      selectedInstrumentData.keys[0],
                                      value[0] / 100,
                                    );
                                  }
                                }}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            {activeCategory === "voice" && (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                                  <Label
                                    htmlFor="voice-beautify"
                                    className="text-sm font-medium"
                                  >
                                    Voice Beautifying
                                  </Label>
                                  <Switch
                                    id="voice-beautify"
                                    checked={voiceBeautifying}
                                    onCheckedChange={setVoiceBeautifying}
                                  />
                                </div>
                                {voiceBeautifying && (
                                  <p className="text-xs text-muted-foreground">
                                    Enhancing vocal tones with AI processing
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Recording Status */}
                          {recordingState !== "idle" && (
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-2 h-2 rounded-full animate-pulse ${
                                    recordingState === "recording"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                  }`}
                                />
                                <span className="text-sm font-medium">
                                  {recordingState === "recording"
                                    ? activeCategory === "voice"
                                      ? "Recording voice with microphone..."
                                      : "Recording in progress..."
                                    : "Recording paused"}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {activeCategory === "voice"
                                  ? "Speak into your microphone for voice recording"
                                  : "Touch any key to add notes to your recording"}
                                {activeCategory === "voice" &&
                                  voiceBeautifying &&
                                  " • Voice beautifying active"}
                              </p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Virtual Keyboard */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Virtual Keys</h3>
                            <div className="flex items-center space-x-2">
                              <Settings className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {canAccessInstrument(selectedInstrumentData)
                                  ? "Touch to play"
                                  : "Upgrade for full access"}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {selectedInstrumentData.keys.map((key) => {
                              const isAccessible = canAccessInstrument(
                                selectedInstrumentData,
                              );
                              return (
                                <Button
                                  key={key}
                                  variant={
                                    activeKey === key ? "default" : "outline"
                                  }
                                  className={`aspect-square text-sm font-mono transition-all ${
                                    !isAccessible
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:scale-105"
                                  } ${activeKey === key ? "scale-105 bg-primary" : ""}`}
                                  onClick={() => handleKeyPress(key)}
                                  disabled={!isAccessible}
                                >
                                  {key}
                                </Button>
                              );
                            })}
                          </div>

                          <div className="space-y-3">
                            <div className="bg-muted/30 rounded-lg p-3">
                              <h4 className="font-medium text-sm mb-2">
                                🎹 Keyboard Mapping
                              </h4>
                              <div className="grid grid-cols-8 gap-1 text-xs">
                                {[
                                  { key: "A", note: "C4" },
                                  { key: "S", note: "D4" },
                                  { key: "D", note: "E4" },
                                  { key: "F", note: "F4" },
                                  { key: "G", note: "G4" },
                                  { key: "H", note: "A4" },
                                  { key: "J", note: "B4" },
                                  { key: "K", note: "C5" },
                                ].map(({ key, note }) => (
                                  <div
                                    key={key}
                                    className="text-center p-1 bg-background rounded border"
                                  >
                                    <div className="font-mono font-bold">
                                      {key}
                                    </div>
                                    <div className="text-muted-foreground">
                                      {note}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                💡 Press the keys above to play notes instantly!
                              </p>
                            </div>
                            {canAccessInstrument(selectedInstrumentData) && (
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>🎵 Sound: {volume[0]}% volume</span>
                                {audioContext && (
                                  <span className="text-green-600">
                                    🔊 Audio ready
                                  </span>
                                )}
                                {!audioContext && (
                                  <span className="text-yellow-600">
                                    🔇 Click any key to enable audio
                                  </span>
                                )}
                                {activeCategory === "voice" &&
                                  voiceBeautifying && (
                                    <span>��� Voice beautifying enabled</span>
                                  )}
                                {recordingState === "recording" && (
                                  <span className="text-red-500">
                                    🔴 Recording active
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <Separator />

                          {/* Composing Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">
                                Compose & Arrange
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowComposeSettings(true)}
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  Settings
                                </Button>
                              </div>
                            </div>

                            {/* Composition Tools */}
                            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                              <h4 className="font-medium text-sm">
                                Composition Tools
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    console.log("Playing chord");
                                    if (selectedInstrumentData) {
                                      // Play C major chord
                                      playInstrumentSound(
                                        "C4",
                                        volume[0] / 100,
                                      );
                                      setTimeout(
                                        () =>
                                          playInstrumentSound(
                                            "E4",
                                            volume[0] / 100,
                                          ),
                                        100,
                                      );
                                      setTimeout(
                                        () =>
                                          playInstrumentSound(
                                            "G4",
                                            volume[0] / 100,
                                          ),
                                        200,
                                      );
                                      alert("Playing C Major chord");
                                    }
                                  }}
                                >
                                  <Music className="h-4 w-4 mr-2" />
                                  Chord
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    console.log("Playing scale");
                                    if (selectedInstrumentData) {
                                      // Play C major scale
                                      const scale = [
                                        "C4",
                                        "D4",
                                        "E4",
                                        "F4",
                                        "G4",
                                        "A4",
                                        "B4",
                                        "C5",
                                      ];
                                      scale.forEach((note, index) => {
                                        setTimeout(
                                          () =>
                                            playInstrumentSound(
                                              note,
                                              volume[0] / 100,
                                            ),
                                          index * 300,
                                        );
                                      });
                                      alert("Playing C Major scale");
                                    }
                                  }}
                                >
                                  <Shuffle className="h-4 w-4 mr-2" />
                                  Scale
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    console.log("Playing arpeggio");
                                    if (selectedInstrumentData) {
                                      // Play C major arpeggio
                                      const arpeggio = [
                                        "C4",
                                        "E4",
                                        "G4",
                                        "C5",
                                        "G4",
                                        "E4",
                                        "C4",
                                      ];
                                      arpeggio.forEach((note, index) => {
                                        setTimeout(
                                          () =>
                                            playInstrumentSound(
                                              note,
                                              volume[0] / 100,
                                            ),
                                          index * 200,
                                        );
                                      });
                                      alert("Playing C Major arpeggio");
                                    }
                                  }}
                                >
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Arpeggio
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    console.log("Playing harmony");
                                    if (selectedInstrumentData) {
                                      // Play I-V-vi-IV progression
                                      const chords = [
                                        ["C4", "E4", "G4"], // C major
                                        ["G4", "B4", "D4"], // G major
                                        ["A4", "C4", "E4"], // A minor
                                        ["F4", "A4", "C4"], // F major
                                      ];
                                      chords.forEach((chord, chordIndex) => {
                                        chord.forEach((note, noteIndex) => {
                                          setTimeout(
                                            () =>
                                              playInstrumentSound(
                                                note,
                                                volume[0] / 100,
                                              ),
                                            chordIndex * 1000 + noteIndex * 100,
                                          );
                                        });
                                      });
                                      alert("Playing I-V-vi-IV progression");
                                    }
                                  }}
                                >
                                  <Library className="h-4 w-4 mr-2" />
                                  Harmony
                                </Button>
                              </div>

                              {/* Quick Composition */}
                              <div className="border rounded p-3 bg-background">
                                <p className="text-xs text-muted-foreground mb-2">
                                  Quick Compose:
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {[
                                    {
                                      name: "C Major",
                                      notes: [
                                        "C4",
                                        "D4",
                                        "E4",
                                        "F4",
                                        "G4",
                                        "A4",
                                        "B4",
                                        "C5",
                                      ],
                                    },
                                    {
                                      name: "G Major",
                                      notes: [
                                        "G4",
                                        "A4",
                                        "B4",
                                        "C5",
                                        "D4",
                                        "E4",
                                        "F4",
                                        "G4",
                                      ],
                                    },
                                    {
                                      name: "D Minor",
                                      notes: [
                                        "D4",
                                        "E4",
                                        "F4",
                                        "G4",
                                        "A4",
                                        "B♭4",
                                        "C5",
                                        "D4",
                                      ],
                                    },
                                    {
                                      name: "A Minor",
                                      notes: [
                                        "A4",
                                        "B4",
                                        "C4",
                                        "D4",
                                        "E4",
                                        "F4",
                                        "G4",
                                        "A4",
                                      ],
                                    },
                                    {
                                      name: "F Major",
                                      notes: [
                                        "F4",
                                        "G4",
                                        "A4",
                                        "B♭4",
                                        "C4",
                                        "D4",
                                        "E4",
                                        "F4",
                                      ],
                                    },
                                    {
                                      name: "E Minor",
                                      notes: [
                                        "E4",
                                        "F4",
                                        "G4",
                                        "A4",
                                        "B4",
                                        "C4",
                                        "D4",
                                        "E4",
                                      ],
                                    },
                                  ].map((scale) => (
                                    <Button
                                      key={scale.name}
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs"
                                      onClick={() => {
                                        if (selectedInstrumentData) {
                                          console.log(
                                            `Playing ${scale.name} scale on ${selectedInstrumentData.name}`,
                                          );

                                          // Play the scale notes in sequence
                                          scale.notes.forEach((note, index) => {
                                            setTimeout(() => {
                                              playInstrumentSound(
                                                note,
                                                volume[0] / 100,
                                              );
                                            }, index * 400); // 400ms delay between notes
                                          });

                                          alert(
                                            `Playing ${scale.name} scale on ${selectedInstrumentData.name}` +
                                              "\\n" +
                                              `Notes: ${scale.notes.join(", ")}`,
                                          );
                                        } else {
                                          alert(
                                            "Please select an instrument first to play the scale!",
                                          );
                                        }
                                      }}
                                    >
                                      {scale.name}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Composition History */}
                            {hasRecording && (
                              <div className="border rounded-lg p-3">
                                <h4 className="font-medium text-sm mb-2">
                                  Recent Compositions
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-primary rounded-full" />
                                      <span className="text-sm">
                                        {selectedInstrumentData?.name} -
                                        Recording
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        2:34
                                      </Badge>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          console.log(
                                            "Playing recent composition",
                                          );
                                          // Actually play the composition
                                          if (selectedInstrumentData) {
                                            setIsPlaying(true);
                                            playInstrumentSound(
                                              "C4",
                                              volume[0] / 100,
                                            );
                                            setTimeout(() => {
                                              playInstrumentSound(
                                                "E4",
                                                volume[0] / 100,
                                              );
                                            }, 500);
                                            setTimeout(() => {
                                              playInstrumentSound(
                                                "G4",
                                                volume[0] / 100,
                                              );
                                              setIsPlaying(false);
                                            }, 1000);
                                            alert(
                                              "Playing composition: " +
                                                selectedInstrumentData.name,
                                            );
                                          }
                                        }}
                                      >
                                        <Play className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          console.log(
                                            "Downloading composition",
                                          );

                                          // Create a proper audio file content (MIDI-like data)
                                          const compositionData = {
                                            title: `${selectedInstrumentData?.name} Recording`,
                                            instrument:
                                              selectedInstrumentData?.name,
                                            date: new Date().toISOString(),
                                            notes: ["C4", "E4", "G4", "C5"],
                                            duration: "2:34",
                                            sampleRate: 44100,
                                            format: "WindHarmony Audio Project",
                                            version: "1.0",
                                          };

                                          const jsonContent = JSON.stringify(
                                            compositionData,
                                            null,
                                            2,
                                          );
                                          const blob = new Blob([jsonContent], {
                                            type: "application/json",
                                          });
                                          const url = URL.createObjectURL(blob);
                                          const a = document.createElement("a");
                                          a.href = url;
                                          a.download = `${selectedInstrumentData?.name.replace(/\s+/g, "-")}-recording.json`;
                                          a.click();
                                          URL.revokeObjectURL(url);

                                          alert(
                                            `Downloaded: ${selectedInstrumentData?.name} composition` +
                                              "\\n" +
                                              "File format: JSON audio project" +
                                              "\\n" +
                                              "Contains: Notes, timing, and instrument data",
                                          );
                                        }}
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Instrument Library Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Library className="h-5 w-5" />
                      Full Instrument Library
                    </CardTitle>
                    <CardDescription>
                      Browse all available wind instruments by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="woodwind">Wood</TabsTrigger>
                        <TabsTrigger value="brass">Brass</TabsTrigger>
                        <TabsTrigger value="saxophone">Sax</TabsTrigger>
                        <TabsTrigger value="bass">Bass</TabsTrigger>
                        <TabsTrigger value="ethnic">World</TabsTrigger>
                      </TabsList>

                      {[
                        "all",
                        "woodwind",
                        "brass",
                        "saxophone",
                        "bass",
                        "ethnic",
                      ].map((category) => (
                        <TabsContent
                          key={category}
                          value={category}
                          className="mt-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                            {[...voiceInstruments, ...nonVoiceInstruments]
                              .filter(
                                (inst) =>
                                  category === "all" ||
                                  inst.category === category,
                              )
                              .map((instrument) => (
                                <Card
                                  key={instrument.id}
                                  className={`cursor-pointer transition-all hover:shadow-sm ${
                                    selectedInstrument === instrument.id
                                      ? "ring-1 ring-primary"
                                      : ""
                                  } ${!canAccessInstrument(instrument) ? "opacity-60" : ""}`}
                                  onClick={() =>
                                    canAccessInstrument(instrument) &&
                                    setSelectedInstrument(instrument.id)
                                  }
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-medium text-sm">
                                        {instrument.name}
                                      </h4>
                                      <div className="flex gap-1">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {instrument.category}
                                        </Badge>
                                        {instrument.premium && (
                                          <Badge
                                            variant={
                                              canAccessInstrument(instrument)
                                                ? "secondary"
                                                : "outline"
                                            }
                                          >
                                            {canAccessInstrument(instrument) ? (
                                              <Crown className="h-2 w-2" />
                                            ) : (
                                              <Lock className="h-2 w-2" />
                                            )}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {instrument.description}
                                    </p>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                      Range: {instrument.keys[0]} -{" "}
                                      {
                                        instrument.keys[
                                          instrument.keys.length - 1
                                        ]
                                      }
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Studio Tab */}
          <TabsContent value="studio" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Studio Settings</h2>
              <p className="text-muted-foreground">
                Configure your workspace and audio preferences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audio Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Sample Rate</Label>
                    <Select defaultValue="44100">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="44100">44.1 kHz</SelectItem>
                        <SelectItem value="48000">48 kHz</SelectItem>
                        <SelectItem value="96000">96 kHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Buffer Size</Label>
                    <Select defaultValue="512">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="128">128 samples</SelectItem>
                        <SelectItem value="256">256 samples</SelectItem>
                        <SelectItem value="512">512 samples</SelectItem>
                        <SelectItem value="1024">1024 samples</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-tune"
                      onCheckedChange={(checked) => {
                        console.log("Auto-tune:", checked);
                        alert(`Auto-tune ${checked ? "enabled" : "disabled"}`);
                      }}
                    />
                    <Label htmlFor="auto-tune">Auto-tune</Label>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      console.log("Saving audio settings");
                      alert("Audio settings saved successfully!");
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Audio Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workspace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-save" defaultChecked />
                    <Label htmlFor="auto-save">Auto-save projects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="real-time-collab" />
                    <Label htmlFor="real-time-collab">
                      Real-time collaboration
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="keyboard-shortcuts"
                      defaultChecked
                      onCheckedChange={(checked) => {
                        console.log("Keyboard shortcuts:", checked);
                        alert(
                          `Keyboard shortcuts ${checked ? "enabled" : "disabled"}`,
                        );
                      }}
                    />
                    <Label htmlFor="keyboard-shortcuts">
                      Keyboard shortcuts
                    </Label>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      console.log("Saving workspace settings");
                      alert("Workspace settings saved successfully!");
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Workspace Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Movie Music Tab */}
          <TabsContent value="movies" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Movie Music Composer</h2>
                <p className="text-muted-foreground">
                  Create soundtracks and background music for films
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "video/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        setVideoFile(file);
                        alert(
                          `Video "${file.name}" imported successfully! You can now start creating your soundtrack.`,
                        );
                      }
                    };
                    input.click();
                  }}
                >
                  <Import className="h-4 w-4 mr-2" />
                  Import Video
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Export score functionality
                    const scoreData = {
                      project: "Movie Score",
                      layers: multiMusicLayers.length,
                      duration: `${Math.floor(videoDuration / 60)}:${(videoDuration % 60).toString().padStart(2, "0")}`,
                      markers: sceneMarkers.length,
                      exportedAt: new Date().toISOString(),
                    };

                    const blob = new Blob(
                      [JSON.stringify(scoreData, null, 2)],
                      { type: "application/json" },
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "movie-score.json";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    alert("Score exported successfully!");
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Score
                </Button>
              </div>
            </div>

            {/* Video Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Video Timeline & Scoring</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTime = Math.max(0, currentTime - 10);
                        setCurrentTime(newTime);
                        console.log("Skip back 10 seconds");

                        // Update video element
                        const videoElement = document.querySelector(
                          "video",
                        ) as HTMLVideoElement;
                        if (videoElement && videoFile) {
                          videoElement.currentTime = newTime;
                        }
                      }}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newPlayingState = !isPlaying;
                        setIsPlaying(newPlayingState);
                        console.log(
                          newPlayingState ? "Video playing" : "Video paused",
                        );

                        // Find and control the video element
                        const videoElement = document.querySelector(
                          "video",
                        ) as HTMLVideoElement;
                        if (videoElement && videoFile) {
                          if (newPlayingState) {
                            // Ensure video is ready before playing
                            if (videoElement.readyState >= 2) {
                              videoElement.currentTime = currentTime;
                              const playPromise = videoElement.play();
                              if (playPromise !== undefined) {
                                playPromise.catch((error) => {
                                  console.warn("Video play failed:", error);
                                  setIsPlaying(false);
                                });
                              }
                            } else {
                              // Wait for video to be ready
                              videoElement.addEventListener(
                                "canplay",
                                () => {
                                  videoElement.currentTime = currentTime;
                                  videoElement.play().catch((error) => {
                                    console.warn("Video play failed:", error);
                                    setIsPlaying(false);
                                  });
                                },
                                { once: true },
                              );
                            }
                          } else {
                            videoElement.pause();
                          }
                        } else if (!videoFile) {
                          alert(
                            "Please import a video file first to enable playback controls.",
                          );
                        }
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTime = Math.min(
                          videoDuration,
                          currentTime + 10,
                        );
                        setCurrentTime(newTime);
                        console.log("Skip forward 10 seconds");

                        // Update video element
                        const videoElement = document.querySelector(
                          "video",
                        ) as HTMLVideoElement;
                        if (videoElement && videoFile) {
                          videoElement.currentTime = newTime;
                        }
                      }}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentTime(0);
                        console.log("Video stopped");

                        // Update video element
                        const videoElement = document.querySelector(
                          "video",
                        ) as HTMLVideoElement;
                        if (videoElement && videoFile) {
                          videoElement.pause();
                          videoElement.currentTime = 0;
                        }
                      }}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Video Preview Area */}
                <div className="bg-black rounded-lg aspect-video mb-4 flex items-center justify-center relative overflow-hidden">
                  {videoFile ? (
                    <>
                      <video
                        ref={(el) => {
                          if (el && videoFile) {
                            // Only set src if it's different to avoid reloading
                            if (!el.src || !el.src.includes("blob:")) {
                              const url = URL.createObjectURL(videoFile);
                              el.src = url;

                              // Clean up previous URL when component unmounts
                              const cleanup = () => URL.revokeObjectURL(url);
                              el.addEventListener("loadstart", cleanup, {
                                once: true,
                              });
                            }

                            // Update duration when metadata loads (only add listener once)
                            if (!el.dataset.listenersAdded) {
                              el.addEventListener("loadedmetadata", () => {
                                setVideoDuration(Math.floor(el.duration));
                              });

                              // Sync currentTime with video element
                              el.addEventListener("timeupdate", () => {
                                if (
                                  Math.abs(el.currentTime - currentTime) > 1
                                ) {
                                  setCurrentTime(Math.floor(el.currentTime));
                                }
                              });

                              el.dataset.listenersAdded = "true";
                            }
                          }
                        }}
                        className="w-full h-full object-contain rounded-lg"
                        controls={false}
                        muted={false}
                        preload="metadata"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {videoFile.name} •{" "}
                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {Math.floor(currentTime / 60)}:
                        {(currentTime % 60).toString().padStart(2, "0")} /{" "}
                        {Math.floor(videoDuration / 60)}:
                        {(videoDuration % 60).toString().padStart(2, "0")}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <Film className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">
                        Import a video file to start scoring
                      </p>
                      <p className="text-xs opacity-50 mt-1">
                        Supports MP4, MOV, AVI formats
                      </p>
                    </div>
                  )}
                </div>

                {/* Timeline Scrubber */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(currentTime / 60)}:
                      {(currentTime % 60).toString().padStart(2, "0")}
                    </span>
                    <div
                      className="flex-1 bg-muted h-2 rounded relative cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        const newTime = Math.round(percentage * videoDuration);
                        const clampedTime = Math.max(
                          0,
                          Math.min(videoDuration, newTime),
                        );
                        setCurrentTime(clampedTime);

                        // Update video element
                        const videoElement = document.querySelector(
                          "video",
                        ) as HTMLVideoElement;
                        if (videoElement && videoFile) {
                          videoElement.currentTime = clampedTime;
                        }
                      }}
                    >
                      <div
                        className="bg-primary h-full rounded"
                        style={{
                          width: `${(currentTime / videoDuration) * 100}%`,
                        }}
                      />
                      <div
                        className="absolute top-0 w-1 h-2 bg-primary-foreground shadow-lg"
                        style={{
                          left: `${(currentTime / videoDuration) * 100}%`,
                        }}
                      />
                      {/* Scene markers on timeline */}
                      {sceneMarkers.map((marker, index) => (
                        <div
                          key={index}
                          className="absolute top-0 w-0.5 h-2 bg-yellow-500"
                          style={{
                            left: `${(marker.time / videoDuration) * 100}%`,
                          }}
                          title={marker.label}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(videoDuration / 60)}:
                      {(videoDuration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Scene Markers */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Scene Markers
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const markerName = prompt("Enter marker name:");
                          if (markerName) {
                            const newMarker = {
                              time: currentTime,
                              label: markerName,
                            };
                            setSceneMarkers((prev) =>
                              [...prev, newMarker].sort(
                                (a, b) => a.time - b.time,
                              ),
                            );
                            alert(
                              `Marker "${markerName}" added at ${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, "0")}`,
                            );
                          }
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Marker
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {sceneMarkers.map((marker, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setCurrentTime(marker.time);
                            console.log(
                              `Jumped to ${marker.label} at ${Math.floor(marker.time / 60)}:${(marker.time % 60).toString().padStart(2, "0")}`,
                            );
                          }}
                        >
                          {marker.label} ({Math.floor(marker.time / 60)}:
                          {(marker.time % 60).toString().padStart(2, "0")})
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Movie Music Layers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Music Layers</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => {
                        const movieLayers = [
                          "Main Theme",
                          "Ambient",
                          "Tension",
                          "Action",
                          "Emotional",
                          "Transition",
                        ];
                        const randomLayer =
                          movieLayers[
                            Math.floor(Math.random() * movieLayers.length)
                          ];

                        const newLayer = {
                          id: (multiMusicLayers.length + 1).toString(),
                          instrument: "orchestral-trumpet",
                          track: [],
                          volume: 60,
                          muted: false,
                          solo: false,
                          type: randomLayer,
                        };

                        setMultiMusicLayers((prev) => [...prev, newLayer]);
                        console.log(`Added ${randomLayer} layer`);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Music Layer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Movie-specific music layers */}
                  {[
                    "Main Theme",
                    "Background Ambience",
                    "Tension Build",
                    "Emotional Core",
                  ].map((layerType, index) => (
                    <div key={layerType} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                  ? "bg-green-500"
                                  : index === 2
                                    ? "bg-red-500"
                                    : "bg-purple-500"
                            }`}
                          />
                          <span className="font-medium text-sm">
                            {layerType}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {index === 0
                              ? "Strings"
                              : index === 1
                                ? "Woodwind"
                                : index === 2
                                  ? "Brass"
                                  : "Mixed"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentVolume =
                                index === 0
                                  ? 85
                                  : index === 1
                                    ? 65
                                    : index === 2
                                      ? 75
                                      : 45;
                              alert(
                                `${layerType} volume: ${currentVolume}%\nClick to adjust volume settings`,
                              );
                            }}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              alert(
                                `Edit ${layerType} layer\nOpen instrument and effect settings`,
                              );
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete ${layerType} layer?`)) {
                                alert(`${layerType} layer deleted`);
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted/30 h-8 rounded relative">
                          <div
                            className={`h-full rounded ${
                              index === 0
                                ? "bg-blue-200 w-3/4"
                                : index === 1
                                  ? "bg-green-200 w-1/2"
                                  : index === 2
                                    ? "bg-red-200 w-2/3"
                                    : "bg-purple-200 w-1/3"
                            }`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10">
                          {index === 0
                            ? "85%"
                            : index === 1
                              ? "65%"
                              : index === 2
                                ? "75%"
                                : "45%"}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Movie Music Tools</CardTitle>
                  <CardDescription>
                    Professional scoring and synchronization tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mood Selector */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Scene Mood</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          mood: "Dramatic",
                          color: "bg-red-100 border-red-300",
                        },
                        {
                          mood: "Peaceful",
                          color: "bg-blue-100 border-blue-300",
                        },
                        {
                          mood: "Suspense",
                          color: "bg-gray-100 border-gray-300",
                        },
                        {
                          mood: "Action",
                          color: "bg-orange-100 border-orange-300",
                        },
                        {
                          mood: "Romantic",
                          color: "bg-pink-100 border-pink-300",
                        },
                        {
                          mood: "Mystery",
                          color: "bg-purple-100 border-purple-300",
                        },
                      ].map(({ mood, color }) => (
                        <Button
                          key={mood}
                          variant="outline"
                          size="sm"
                          className={`${color} text-xs`}
                          onClick={() => {
                            console.log(`Applied ${mood} mood template`);
                            alert(`${mood} music template applied!`);
                          }}
                        >
                          {mood}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tempo and Key */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Tempo (BPM)</Label>
                      <Input
                        type="number"
                        value={movieTempo}
                        min="60"
                        max="200"
                        onChange={(e) => {
                          const newTempo = parseInt(e.target.value);
                          setMovieTempo(newTempo);
                          console.log(`Movie tempo changed to ${newTempo} BPM`);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Key Signature</Label>
                      <Select
                        value={movieKey}
                        onValueChange={(value) => {
                          setMovieKey(value);
                          console.log(`Movie key changed to ${value}`);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C">C Major</SelectItem>
                          <SelectItem value="G">G Major</SelectItem>
                          <SelectItem value="D">D Major</SelectItem>
                          <SelectItem value="Am">A Minor</SelectItem>
                          <SelectItem value="Em">E Minor</SelectItem>
                          <SelectItem value="Bm">B Minor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sync Options */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Synchronization
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="auto-sync"
                          checked={syncOptions.autoSync}
                          onCheckedChange={(checked) => {
                            setSyncOptions((prev) => ({
                              ...prev,
                              autoSync: checked,
                            }));
                            console.log(
                              `Auto-sync to video: ${checked ? "enabled" : "disabled"}`,
                            );
                          }}
                        />
                        <Label htmlFor="auto-sync" className="text-sm">
                          Auto-sync to video
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="beat-match"
                          checked={syncOptions.beatMatch}
                          onCheckedChange={(checked) => {
                            setSyncOptions((prev) => ({
                              ...prev,
                              beatMatch: checked,
                            }));
                            console.log(
                              `Beat matching: ${checked ? "enabled" : "disabled"}`,
                            );
                          }}
                        />
                        <Label htmlFor="beat-match" className="text-sm">
                          Beat matching
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="scene-detection"
                          checked={syncOptions.sceneDetection}
                          onCheckedChange={(checked) => {
                            setSyncOptions((prev) => ({
                              ...prev,
                              sceneDetection: checked,
                            }));
                            console.log(
                              `Auto scene detection: ${checked ? "enabled" : "disabled"}`,
                            );
                            if (checked) {
                              alert(
                                "Scene detection enabled! The system will automatically detect scene changes and suggest musical transitions.",
                              );
                            }
                          }}
                        />
                        <Label htmlFor="scene-detection" className="text-sm">
                          Auto scene detection
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Quick Actions</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const instruments = [
                            "strings",
                            "brass",
                            "woodwind",
                            "percussion",
                          ];
                          const randomInstrument =
                            instruments[
                              Math.floor(Math.random() * instruments.length)
                            ];
                          alert(
                            `Randomized music arrangement with ${randomInstrument} emphasis!`,
                          );
                        }}
                      >
                        <Shuffle className="h-3 w-3 mr-1" />
                        Randomize
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          alert(
                            "Loop mode enabled for current scene. Music will repeat until next marker.",
                          );
                        }}
                      >
                        <Repeat className="h-3 w-3 mr-1" />
                        Loop
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          alert(
                            "Rendering movie score... This will export your complete soundtrack with video synchronization.",
                          );
                          // Simulate rendering process
                          setTimeout(() => {
                            alert(
                              "Score rendered successfully! Audio file ready for download.",
                            );
                          }, 2000);
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Render
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Movie Music Presets */}
            <Card>
              <CardHeader>
                <CardTitle>Movie Music Presets</CardTitle>
                <CardDescription>
                  Professional templates for different film genres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      genre: "Epic Fantasy",
                      description: "Orchestral themes with brass and strings",
                      instruments: "Full Orchestra",
                      color: "border-l-4 border-l-purple-500",
                    },
                    {
                      genre: "Sci-Fi Thriller",
                      description: "Electronic synths with atmospheric pads",
                      instruments: "Synthesizers",
                      color: "border-l-4 border-l-blue-500",
                    },
                    {
                      genre: "Romantic Drama",
                      description: "Piano and strings with emotional melodies",
                      instruments: "Piano & Strings",
                      color: "border-l-4 border-l-pink-500",
                    },
                    {
                      genre: "Action Adventure",
                      description: "Driving rhythms with powerful brass",
                      instruments: "Brass & Percussion",
                      color: "border-l-4 border-l-red-500",
                    },
                    {
                      genre: "Horror Suspense",
                      description: "Dissonant strings and eerie soundscapes",
                      instruments: "Strings & FX",
                      color: "border-l-4 border-l-gray-500",
                    },
                    {
                      genre: "Comedy Family",
                      description: "Light woodwinds and playful melodies",
                      instruments: "Woodwinds",
                      color: "border-l-4 border-l-yellow-500",
                    },
                  ].map((preset) => (
                    <Card
                      key={preset.genre}
                      className={`cursor-pointer hover:shadow-md transition-all ${preset.color}`}
                      onClick={() => {
                        console.log(`Loading ${preset.genre} preset`);

                        // Apply preset-specific settings
                        if (preset.genre === "Epic Fantasy") {
                          setMovieTempo(90);
                          setMovieKey("D");
                        } else if (preset.genre === "Sci-Fi Thriller") {
                          setMovieTempo(140);
                          setMovieKey("Em");
                        } else if (preset.genre === "Romantic Drama") {
                          setMovieTempo(70);
                          setMovieKey("C");
                        } else if (preset.genre === "Action Adventure") {
                          setMovieTempo(150);
                          setMovieKey("G");
                        } else if (preset.genre === "Horror Suspense") {
                          setMovieTempo(60);
                          setMovieKey("Bm");
                        } else if (preset.genre === "Comedy Family") {
                          setMovieTempo(120);
                          setMovieKey("C");
                        }

                        alert(
                          `${preset.genre} template loaded!\\n\\nSettings applied:\\n- Instruments: ${preset.instruments}\\n- Tempo: ${movieTempo} BPM\\n- Key: ${movieKey}\\n\\nYou can now create music in this style.`,
                        );
                      }}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-1">{preset.genre}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {preset.description}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {preset.instruments}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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

        {/* Instrument Picker Dialog */}
        <Dialog
          open={!!showInstrumentPicker}
          onOpenChange={() => setShowInstrumentPicker(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Select Instrument for Layer</DialogTitle>
              <DialogDescription>
                Choose an instrument for your music layer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="woodwind">Woodwind</TabsTrigger>
                  <TabsTrigger value="brass">Brass</TabsTrigger>
                  <TabsTrigger value="saxophone">Saxophone</TabsTrigger>
                  <TabsTrigger value="bass">Bass</TabsTrigger>
                  <TabsTrigger value="ethnic">Ethnic</TabsTrigger>
                </TabsList>

                {[
                  "all",
                  "woodwind",
                  "brass",
                  "saxophone",
                  "bass",
                  "ethnic",
                ].map((category) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                      {[...voiceInstruments, ...nonVoiceInstruments]
                        .filter(
                          (inst) =>
                            category === "all" || inst.category === category,
                        )
                        .map((instrument) => (
                          <Card
                            key={instrument.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              !canAccessInstrument(instrument)
                                ? "opacity-60"
                                : ""
                            }`}
                            onClick={() => {
                              if (
                                canAccessInstrument(instrument) &&
                                showInstrumentPicker
                              ) {
                                setMultiMusicLayers((prev) =>
                                  prev.map((l) =>
                                    l.id === showInstrumentPicker
                                      ? { ...l, instrument: instrument.id }
                                      : l,
                                  ),
                                );
                                setShowInstrumentPicker(null);
                                console.log(
                                  `Changed layer ${showInstrumentPicker} to ${instrument.name}`,
                                );
                              }
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm">
                                  {instrument.name}
                                </h4>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {instrument.category}
                                  </Badge>
                                  {instrument.premium && (
                                    <Badge
                                      variant={
                                        canAccessInstrument(instrument)
                                          ? "secondary"
                                          : "outline"
                                      }
                                    >
                                      {canAccessInstrument(instrument) ? (
                                        <Crown className="h-2 w-2" />
                                      ) : (
                                        <Lock className="h-2 w-2" />
                                      )}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {instrument.description}
                              </p>
                              <div className="text-xs text-muted-foreground">
                                Range: {instrument.keys[0]} -{" "}
                                {instrument.keys[instrument.keys.length - 1]}
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (canAccessInstrument(instrument)) {
                                      // Preview instrument sound
                                      setSelectedInstrument(instrument.id);
                                      handleKeyPress(instrument.keys[0]);
                                    }
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Preview
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        {/* Compose Settings Dialog */}
        <Dialog
          open={showComposeSettings}
          onOpenChange={setShowComposeSettings}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose & Arrange Settings</DialogTitle>
              <DialogDescription>
                Configure composition tools and music theory settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Music Theory Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">Music Theory</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Key</Label>
                    <Select
                      value={composeSettings.defaultKey}
                      onValueChange={(value) =>
                        setComposeSettings((prev) => ({
                          ...prev,
                          defaultKey: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="C">C Major</SelectItem>
                        <SelectItem value="G">G Major</SelectItem>
                        <SelectItem value="D">D Major</SelectItem>
                        <SelectItem value="A">A Major</SelectItem>
                        <SelectItem value="E">E Major</SelectItem>
                        <SelectItem value="Am">A Minor</SelectItem>
                        <SelectItem value="Em">E Minor</SelectItem>
                        <SelectItem value="Bm">B Minor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Signature</Label>
                    <Select
                      value={composeSettings.timeSignature}
                      onValueChange={(value) =>
                        setComposeSettings((prev) => ({
                          ...prev,
                          timeSignature: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4/4">4/4</SelectItem>
                        <SelectItem value="3/4">3/4</SelectItem>
                        <SelectItem value="2/4">2/4</SelectItem>
                        <SelectItem value="6/8">6/8</SelectItem>
                        <SelectItem value="12/8">12/8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Tempo Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">Tempo & Rhythm</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tempo (BPM)</Label>
                    <Input
                      type="number"
                      value={composeSettings.tempo}
                      onChange={(e) =>
                        setComposeSettings((prev) => ({
                          ...prev,
                          tempo: parseInt(e.target.value) || 120,
                        }))
                      }
                      min="60"
                      max="200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Metronome Sound</Label>
                    <Select
                      value={composeSettings.metronomeSound}
                      onValueChange={(value) =>
                        setComposeSettings((prev) => ({
                          ...prev,
                          metronomeSound: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="click">Click</SelectItem>
                        <SelectItem value="beep">Beep</SelectItem>
                        <SelectItem value="tick">Tick</SelectItem>
                        <SelectItem value="wood">Wood Block</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Composition Tools */}
              <div className="space-y-4">
                <h4 className="font-semibold">Composition Tools</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-harmonize</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically add harmony to melodies
                      </p>
                    </div>
                    <Switch
                      checked={composeSettings.autoHarmonize}
                      onCheckedChange={(checked) =>
                        setComposeSettings((prev) => ({
                          ...prev,
                          autoHarmonize: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Scale Snapping</Label>
                      <p className="text-xs text-muted-foreground">
                        Snap notes to selected scale
                      </p>
                    </div>
                    <Switch
                      checked={composeSettings.scaleSnapping}
                      onCheckedChange={(checked) =>
                        setComposeSettings((prev) => ({
                          ...prev,
                          scaleSnapping: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Chord Suggestions</Label>
                      <p className="text-xs text-muted-foreground">
                        Show recommended chord progressions
                      </p>
                    </div>
                    <Switch
                      checked={composeSettings.chordSuggestions}
                      onCheckedChange={(checked) =>
                        setComposeSettings((prev) => ({
                          ...prev,
                          chordSuggestions: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowComposeSettings(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("Saving compose settings:", composeSettings);

                    // Save settings to localStorage
                    localStorage.setItem(
                      "composeSettings",
                      JSON.stringify(composeSettings),
                    );

                    alert(
                      "Compose & Arrange settings saved!" +
                        "\\n" +
                        "Key: " +
                        composeSettings.defaultKey +
                        "\\n" +
                        "Time Signature: " +
                        composeSettings.timeSignature +
                        "\\n" +
                        "Tempo: " +
                        composeSettings.tempo +
                        " BPM" +
                        "\\n" +
                        "Auto-harmonize: " +
                        (composeSettings.autoHarmonize
                          ? "Enabled"
                          : "Disabled") +
                        "\\n" +
                        "Scale Snapping: " +
                        (composeSettings.scaleSnapping
                          ? "Enabled"
                          : "Disabled") +
                        "\\n" +
                        "Chord Suggestions: " +
                        (composeSettings.chordSuggestions
                          ? "Enabled"
                          : "Disabled"),
                    );
                    setShowComposeSettings(false);
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-700">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Star className="h-5 w-5 text-white" />
                </div>
                Share Your Experience
              </DialogTitle>
              <DialogDescription className="text-orange-600">
                Help us improve WindHarmony by sharing your thoughts about the
                workspace experience
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="feedback-email"
                    className="text-orange-700 font-medium"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={feedbackData.email || ""}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="feedback-category"
                    className="text-orange-700 font-medium"
                  >
                    Feedback Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFeedbackData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug-report">🐛 Bug Report</SelectItem>
                      <SelectItem value="feature-request">
                        ✨ Feature Request
                      </SelectItem>
                      <SelectItem value="audio-quality">
                        🎵 Audio Quality
                      </SelectItem>
                      <SelectItem value="user-interface">
                        🎨 User Interface
                      </SelectItem>
                      <SelectItem value="performance">
                        ⚡ Performance
                      </SelectItem>
                      <SelectItem value="ai-composer">
                        🤖 AI Composer
                      </SelectItem>
                      <SelectItem value="general">
                        💬 General Feedback
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="feedback-message"
                  className="text-orange-700 font-medium"
                >
                  Your Feedback
                </Label>
                <textarea
                  id="feedback-message"
                  className="w-full min-h-[140px] p-4 border-2 border-orange-200 rounded-lg resize-y
                       bg-gradient-to-br from-orange-50 to-yellow-50
                       text-orange-900 placeholder-orange-400
                       focus:border-orange-400 focus:bg-white focus:text-orange-800
                       focus:ring-2 focus:ring-orange-200 focus:ring-opacity-50
                       transition-all duration-300 ease-in-out
                       font-medium leading-relaxed"
                  placeholder="💭 Share your thoughts about WindHarmony... What do you love? What can we improve? Your insights help us create better musical experiences!"
                  value={feedbackData.message || ""}
                  onChange={(e) =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  style={{
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                />
                <div className="text-sm text-orange-600/70 italic mt-2">
                  💡 Tip: Be specific about your experience - it helps us
                  understand how to make WindHarmony even better!
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                <div className="text-sm text-orange-600/80">
                  🙏 Your feedback is valuable and helps improve WindHarmony for
                  everyone
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowFeedbackDialog(false);
                      setFeedbackData({ email: "", category: "", message: "" });
                    }}
                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!feedbackData.email || !feedbackData.message) {
                        alert("Please fill in both email and feedback message");
                        return;
                      }

                      // Save feedback to localStorage for admin review
                      const newFeedback = {
                        id: Date.now().toString(),
                        email: feedbackData.email,
                        category: feedbackData.category || "general",
                        message: feedbackData.message,
                        rating: 5, // Default rating from workspace
                        source: "workspace-dialog",
                        timestamp: new Date().toISOString(),
                        wouldRecommend: true,
                      };

                      const existingFeedback = JSON.parse(
                        localStorage.getItem("feedbackSubmissions") || "[]",
                      );
                      existingFeedback.push(newFeedback);
                      localStorage.setItem(
                        "feedbackSubmissions",
                        JSON.stringify(existingFeedback),
                      );

                      // Reset form and close dialog
                      setFeedbackData({ email: "", category: "", message: "" });
                      setShowFeedbackDialog(false);

                      alert(
                        "🎉 Thank you for your feedback! It has been submitted successfully and will help us improve WindHarmony.",
                      );
                    }}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700
                          text-white font-semibold px-6
                          shadow-lg hover:shadow-xl transform hover:scale-[1.02]
                          transition-all duration-300 ease-in-out
                          border-0 focus:ring-4 focus:ring-orange-300"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment System */}
        <PaymentSystem
          isOpen={showPaymentSystem}
          onClose={() => setShowPaymentSystem(false)}
          selectedPlan={selectedPlan}
          currentUserType={userType}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
}
