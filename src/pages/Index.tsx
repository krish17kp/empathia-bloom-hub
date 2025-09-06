import { useState } from "react";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { EQAssessment } from "@/components/EQAssessment";
import { EmotionTracker } from "@/components/EmotionTracker";
import { CameraFeature } from "@/components/CameraFeature";
import { VoiceNotes } from "@/components/VoiceNotes";
import { TextJournal } from "@/components/TextJournal";
import { 
  Brain, 
  Camera, 
  Mic, 
  PenTool, 
  Heart, 
  TrendingUp,
  Users,
  Sparkles 
} from "lucide-react";

type ActiveSection = "hero" | "assessment" | "tracking" | "camera" | "voice" | "journal";

const Index = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "assessment":
        return <EQAssessment />;
      case "tracking":
        return <EmotionTracker />;
      case "camera":
        return <CameraFeature />;
      case "voice":
        return <VoiceNotes />;
      case "journal":
        return <TextJournal />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      {activeSection !== "hero" && (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSection("hero")}
                className="flex items-center gap-2 text-xl font-bold gradient-text"
              >
                <Sparkles className="h-6 w-6 text-primary" />
                EQ Mastery
              </button>
              
              <div className="flex items-center gap-2">
                {[
                  { id: "assessment", label: "Assessment", icon: Brain },
                  { id: "tracking", label: "Tracking", icon: Heart },
                  { id: "camera", label: "Camera", icon: Camera },
                  { id: "voice", label: "Voice", icon: Mic },
                  { id: "journal", label: "Journal", icon: PenTool }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id as ActiveSection)}
                    className={`
                      flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-smooth
                      ${activeSection === id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:block">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      {activeSection === "hero" ? (
        <>
          <Hero />
          
          {/* Features Section */}
          <section className="py-20 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                  Comprehensive EQ Development Tools
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Explore our suite of emotional intelligence tools designed to help you grow, 
                  reflect, and develop stronger emotional awareness.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <FeatureCard
                  title="EQ Assessment"
                  description="Take our comprehensive emotional intelligence quiz to discover your strengths and areas for growth."
                  icon={Brain}
                  buttonText="Start Assessment"
                  variant="default"
                  onAction={() => setActiveSection("assessment")}
                />
                
                <FeatureCard
                  title="Daily Emotion Tracking"
                  description="Log your daily emotions and track patterns over time to build greater self-awareness."
                  icon={Heart}
                  buttonText="Track Emotions"
                  variant="secondary"
                  onAction={() => setActiveSection("tracking")}
                />
                
                <FeatureCard
                  title="Emotion Recognition"
                  description="Use AI-powered camera analysis to understand your current emotional state through facial expressions."
                  icon={Camera}
                  buttonText="Analyze Emotions"
                  variant="tertiary"
                  onAction={() => setActiveSection("camera")}
                />
                
                <FeatureCard
                  title="Voice Reflection"
                  description="Record voice notes about your emotional experiences and receive insights on emotional patterns."
                  icon={Mic}
                  buttonText="Record Thoughts"
                  variant="warm"
                  onAction={() => setActiveSection("voice")}
                />
                
                <FeatureCard
                  title="Emotional Journaling"
                  description="Write about your feelings and experiences while receiving AI-powered insights and suggestions."
                  icon={PenTool}
                  buttonText="Start Journaling"
                  variant="secondary"
                  onAction={() => setActiveSection("journal")}
                />
                
                <FeatureCard
                  title="Progress Dashboard"
                  description="Visualize your emotional intelligence journey with comprehensive analytics and growth tracking."
                  icon={TrendingUp}
                  buttonText="View Progress"
                  variant="default"
                  onAction={() => setActiveSection("tracking")}
                />
              </div>
            </div>
          </section>
        </>
      ) : (
        <main className="container mx-auto px-6 py-12">
          {renderActiveSection()}
        </main>
      )}
    </div>
  );
};

export default Index;
