import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Download,
  Volume2,
  MessageSquare
} from "lucide-react";

interface VoiceNote {
  id: string;
  timestamp: Date;
  duration: number;
  audioUrl: string;
  transcript?: string;
  emotions?: string[];
}

export const VoiceNotes = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newNote: VoiceNote = {
          id: Date.now().toString(),
          timestamp: new Date(),
          duration: recordingTime,
          audioUrl,
          transcript: "Transcription will be available soon...", // Placeholder
          emotions: ["reflective", "thoughtful"] // Placeholder
        };
        
        setVoiceNotes(prev => [newNote, ...prev]);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const togglePlayback = (noteId: string, audioUrl: string) => {
    if (playingId === noteId) {
      setPlayingId(null);
      // In a real app, pause the audio
    } else {
      setPlayingId(noteId);
      // In a real app, play the audio
      setTimeout(() => setPlayingId(null), 3000); // Simulate playback
    }
  };

  const deleteNote = (noteId: string) => {
    setVoiceNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Recording Interface */}
      <Card className="shadow-medium bg-gradient-warm/5 border-warm/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-6 w-6 text-warm" />
            Voice Emotional Journal
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Record your thoughts and feelings. We'll analyze the emotional tone.
          </p>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          {/* Recording Visualization */}
          <div className="relative">
            <div className={`
              w-32 h-32 rounded-full mx-auto flex items-center justify-center border-4 transition-smooth
              ${isRecording 
                ? 'border-warm bg-warm/10 animate-pulse' 
                : 'border-warm/30 bg-warm/5 hover:bg-warm/10'
              }
            `}>
              {isRecording ? (
                <div className="flex items-center flex-col">
                  <Square className="h-8 w-8 text-warm mb-2" />
                  <span className="text-sm font-mono text-warm">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              ) : (
                <Mic className="h-12 w-12 text-warm" />
              )}
            </div>
            
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-warm/20 animate-ping" />
            )}
          </div>
          
          {/* Recording Controls */}
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <Button onClick={startRecording} variant="warm" size="xl" className="animate-glow-pulse">
                <Mic className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="destructive" size="xl">
                <Square className="mr-2 h-5 w-5" />
                Stop Recording
              </Button>
            )}
          </div>
          
          {isRecording && (
            <p className="text-sm text-muted-foreground animate-fade-in">
              Speak naturally about your emotions and thoughts...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Voice Notes List */}
      {voiceNotes.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Recent Voice Notes ({voiceNotes.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {voiceNotes.map((note) => (
              <div key={note.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => togglePlayback(note.id, note.audioUrl)}
                    >
                      {playingId === note.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <div>
                      <p className="text-sm font-medium">
                        Duration: {formatTime(note.duration)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {note.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                {/* Emotions Detected */}
                {note.emotions && (
                  <div className="flex flex-wrap gap-2">
                    {note.emotions.map((emotion) => (
                      <Badge key={emotion} variant="outline" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Transcript Preview */}
                {note.transcript && (
                  <div className="bg-muted/50 rounded p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        {note.transcript}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};