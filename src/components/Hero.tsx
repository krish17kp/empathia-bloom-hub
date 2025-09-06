import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Users } from "lucide-react";
import heroImage from "@/assets/hero-emotional-intelligence.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Emotional Intelligence Platform"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-tertiary/20 backdrop-blur-[1px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <Badge variant="outline" className="mb-6 bg-white/10 backdrop-blur-md border-white/30 text-white">
            <Brain className="mr-2 h-4 w-4" />
            Personalized Emotional Intelligence Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your{" "}
            <span className="gradient-text bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Emotional Intelligence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover your EQ levels, track daily emotional patterns, and unlock personalized insights 
            to enhance self-awareness, emotional regulation, and interpersonal skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button variant="hero" size="xl" className="group">
              <Heart className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Start Your EQ Journey
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-primary">
              <Users className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-smooth">
              <Brain className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">EQ Assessment</h3>
              <p className="text-white/80 text-sm">Comprehensive evaluation of your emotional intelligence levels</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-smooth">
              <Heart className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Daily Tracking</h3>
              <p className="text-white/80 text-sm">Monitor emotional patterns and growth over time</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-smooth">
              <Users className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Personal Growth</h3>
              <p className="text-white/80 text-sm">Tailored exercises to improve interpersonal skills</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};