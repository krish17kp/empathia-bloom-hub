import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Save, 
  Trash2, 
  BookOpen, 
  Lightbulb,
  Calendar,
  TrendingUp
} from "lucide-react";

interface JournalEntry {
  id: string;
  content: string;
  timestamp: Date;
  mood: string;
  insights: string[];
  wordCount: number;
}

export const TextJournal = () => {
  const [currentEntry, setCurrentEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  const moods = [
    { name: "Grateful", color: "bg-tertiary/10 text-tertiary" },
    { name: "Anxious", color: "bg-warm/10 text-warm" },
    { name: "Excited", color: "bg-primary/10 text-primary" },
    { name: "Reflective", color: "bg-secondary/10 text-secondary" },
    { name: "Frustrated", color: "bg-destructive/10 text-destructive" },
    { name: "Peaceful", color: "bg-muted text-muted-foreground" }
  ];

  const saveEntry = () => {
    if (currentEntry.trim()) {
      const wordCount = currentEntry.trim().split(/\s+/).length;
      const insights = generateInsights(currentEntry);
      
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: currentEntry,
        timestamp: new Date(),
        mood: selectedMood || "Neutral",
        insights,
        wordCount
      };
      
      setEntries(prev => [newEntry, ...prev]);
      setCurrentEntry("");
      setSelectedMood("");
      setShowInsights(true);
      
      // Hide insights after 5 seconds
      setTimeout(() => setShowInsights(false), 5000);
    }
  };

  const generateInsights = (text: string): string[] => {
    const insights = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('stress') || lowerText.includes('overwhelm')) {
      insights.push("Consider practicing deep breathing exercises");
    }
    if (lowerText.includes('grateful') || lowerText.includes('thankful')) {
      insights.push("Gratitude practice detected - great for mental wellbeing!");
    }
    if (lowerText.includes('goal') || lowerText.includes('plan')) {
      insights.push("Goal-oriented thinking shows strong self-direction");
    }
    if (text.length > 200) {
      insights.push("Detailed reflection shows high self-awareness");
    }
    
    return insights.length > 0 ? insights : ["Regular journaling supports emotional growth"];
  };

  const deleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  return (
    <div className="space-y-6">
      {/* Writing Interface */}
      <Card className="shadow-large bg-gradient-tertiary/5 border-tertiary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-6 w-6 text-tertiary" />
            Emotional Reflection Journal
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Express your thoughts and feelings. We'll provide personalized insights.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current mood:</label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood.name}
                  variant={selectedMood === mood.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMood(mood.name)}
                  className={selectedMood === mood.name ? "" : mood.color}
                >
                  {mood.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Writing Area */}
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Describe your emotions, thoughts, experiences..."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-[200px] text-base leading-relaxed"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {currentEntry.trim() ? currentEntry.trim().split(/\s+/).length : 0} words
              </span>
              
              <Button 
                onClick={saveEntry}
                disabled={!currentEntry.trim()}
                variant="tertiary"
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </div>
          
          {/* Live Insights */}
          {showInsights && entries.length > 0 && (
            <Card className="animate-scale-in bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary mb-2">AI Insights</h4>
                    <ul className="space-y-1">
                      {entries[0].insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Journal Entries */}
      {entries.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Journal Entries ({entries.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {entries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-tertiary/10 text-tertiary">
                      {entry.mood}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {entry.timestamp.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {entry.wordCount} words
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <p className="text-sm leading-relaxed line-clamp-3">
                  {entry.content}
                </p>
                
                {entry.insights.length > 0 && (
                  <div className="bg-muted/50 rounded p-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">Growth Insights:</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.insights[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {entries.length > 3 && (
              <Button variant="outline" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                View All Entries ({entries.length})
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};