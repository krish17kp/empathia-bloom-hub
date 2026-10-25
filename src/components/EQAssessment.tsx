import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Brain, ArrowRight } from "lucide-react";

const sampleQuestions = [
  {
    id: 1,
    question: "I can easily identify what emotions I'm feeling in the moment.",
    category: "Self-Awareness"
  },
  {
    id: 2, 
    question: "I remain calm under pressure and don't let emotions overwhelm me.",
    category: "Self-Regulation"
  },
  {
    id: 3,
    question: "I can sense when others are feeling uncomfortable or upset.",
    category: "Social Awareness"
  },
  {
    id: 4,
    question: "I'm skilled at resolving conflicts and managing difficult conversations.",
    category: "Relationship Management"
  },
  {
    id: 5,
    question: "I understand how my emotions affect my decisions and behavior.",
    category: "Self-Awareness"
  },
  {
    id: 6,
    question: "I can adapt my communication style based on who I'm interacting with.",
    category: "Relationship Management"
  },
  {
    id: 7,
    question: "I'm able to recover quickly from setbacks and disappointments.",
    category: "Self-Regulation"
  },
  {
    id: 8,
    question: "I can accurately read the power dynamics in group situations.",
    category: "Social Awareness"
  },
  {
    id: 9,
    question: "I seek feedback from others to improve my self-awareness.",
    category: "Self-Awareness"
  },
  {
    id: 10,
    question: "I can effectively manage and influence others' emotions during difficult situations.",
    category: "Relationship Management"
  }
];

export const EQAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      
      // Simulate API delay for calculating results
      setTimeout(() => {
        setShowResults(true);
        setIsLoading(false);
      }, 1500); // Simulate a 1.5-second delay for analysis
    }
  };

  const averageScore = answers.length > 0 ? Math.round((answers.reduce((a, b) => a + b, 0) / answers.length) * 20) : 0;
  const progressPercentage = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto shadow-large bg-card/80 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <CardTitle className="text-xl font-medium mb-2">Calculating your EQ score...</CardTitle>
          <p className="text-muted-foreground">This will just take a moment</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className="max-w-2xl mx-auto shadow-large bg-gradient-wellness/5 border-primary/20">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-glow">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl gradient-text">Assessment Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{averageScore}/100</div>
            <p className="text-muted-foreground">Your EQ Score</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {["Self-Awareness", "Self-Regulation", "Social Awareness", "Relationship Management"].map((category, idx) => (
              <div key={category} className="text-center">
                <Badge variant="outline" className="mb-2 bg-primary/5">
                  {category}
                </Badge>
                <div className="text-2xl font-semibold text-primary">
                  {Math.round((answers[idx] || 0) * 20)}
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="glow" size="lg" className="w-full md:w-auto">
            <Brain className="mr-2 h-5 w-5" />
            View Detailed Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-large bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Brain className="mr-1 h-3 w-3" />
            {sampleQuestions[currentQuestion].category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {sampleQuestions.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="mb-4" />
        <CardTitle className="text-xl leading-relaxed">
          {sampleQuestions[currentQuestion].question}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {[
            { score: 5, label: "Strongly Agree", variant: "tertiary" as const },
            { score: 4, label: "Agree", variant: "secondary" as const },
            { score: 3, label: "Neutral", variant: "outline" as const },
            { score: 2, label: "Disagree", variant: "warm" as const },
            { score: 1, label: "Strongly Disagree", variant: "destructive" as const }
          ].map(({ score, label, variant }) => (
            <Button
              key={score}
              variant={variant}
              size="lg"
              className="justify-between group"
              onClick={() => handleAnswer(score)}
            >
              <span>{label}</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-smooth" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};