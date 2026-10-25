import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  Angry, 
  Zap, 
  Calendar,
  TrendingUp
} from "lucide-react";

const emotionIcons = {
  happy: { icon: Smile, color: "text-tertiary", bg: "bg-tertiary/10" },
  sad: { icon: Frown, color: "text-secondary", bg: "bg-secondary/10" },
  angry: { icon: Angry, color: "text-destructive", bg: "bg-destructive/10" },
  neutral: { icon: Meh, color: "text-muted-foreground", bg: "bg-muted" },
  energetic: { icon: Zap, color: "text-warm", bg: "bg-warm/10" },
  anxious: { icon: Heart, color: "text-primary", bg: "bg-primary/10" }
};

const emotions = Object.keys(emotionIcons) as Array<keyof typeof emotionIcons>;

export const EmotionTracker = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<Array<{
    emotion: string;
    intensity: number;
    notes: string;
    timestamp: Date;
  }>>([]);

  const handleLogEmotion = () => {
    if (selectedEmotion) {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const newEntry = {
          emotion: selectedEmotion,
          intensity,
          notes,
          timestamp: new Date()
        };
        setEntries([newEntry, ...entries]);
        setSelectedEmotion(null);
        setIntensity(5);
        setNotes("");
        setIsLoading(false);
      }, 800); // Simulate a delay for processing
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-medium bg-gradient-wellness/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            How are you feeling right now?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Emotion Selection */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {emotions.map((emotion) => {
              const { icon: Icon, color, bg } = emotionIcons[emotion];
              const isSelected = selectedEmotion === emotion;
              
              return (
                <button
                  key={emotion}
                  onClick={() => setSelectedEmotion(emotion)}
                  className={`
                    flex flex-col items-center p-4 rounded-xl border-2 transition-smooth
                    ${isSelected 
                      ? 'border-primary bg-primary/10 shadow-medium' 
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                    }
                  `}
                >
                  <Icon className={`h-8 w-8 mb-2 ${isSelected ? 'text-primary' : color}`} />
                  <span className={`text-xs font-medium capitalize ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {emotion}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Intensity Slider */}
          {selectedEmotion && (
            <div className="space-y-4 animate-fade-in">
              <label className="text-sm font-medium">Intensity: {intensity}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              
              <Textarea
                placeholder="What triggered this emotion? Any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
              
              <Button 
            onClick={handleLogEmotion} 
            variant="default" 
            size="lg" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                Processing...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Log Emotion
              </>
            )}
          </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Dashboard */}
      {entries.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Emotional Progress Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Emotion Distribution */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Emotion Distribution</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {emotions.map(emotion => {
                  const count = entries.filter(e => e.emotion === emotion).length;
                  const percentage = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;
                  const { icon: Icon, color, bg } = emotionIcons[emotion];
                  
                  return (
                    <div key={emotion} className="text-center">
                      <div className={`rounded-full w-12 h-12 mx-auto flex items-center justify-center ${bg}`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                      </div>
                      <div className="mt-1">
                        <div className="text-xs font-medium capitalize">{emotion}</div>
                        <div className="text-xs text-muted-foreground">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Intensity Trends */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Intensity Trends</h3>
              <div className="h-24 flex items-end gap-1">
                {entries.slice(0, 10).reverse().map((entry, idx) => {
                  const { color } = emotionIcons[entry.emotion as keyof typeof emotionIcons];
                  const height = `${entry.intensity * 10}%`;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full ${color.replace('text-', 'bg-')}/70 rounded-t`} 
                        style={{ height }}
                        title={`${entry.emotion} - Intensity: ${entry.intensity}`}
                      />
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {new Date(entry.timestamp).toLocaleDateString(undefined, { day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Recent Entries */}
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Entries</h3>
              <div className="space-y-4">
                {entries.slice(0, 3).map((entry, idx) => {
                  const { icon: Icon, color } = emotionIcons[entry.emotion as keyof typeof emotionIcons];
                  return (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <Icon className={`h-6 w-6 ${color} mt-1`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {entry.emotion}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Intensity: {entry.intensity}/10
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {entry.notes || "No additional notes"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};