import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RotateCcw, Download, Sparkles } from "lucide-react";

export const CameraFeature = () => {
  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    dominantEmotion: string;
    confidence: number;
    suggestions: string[];
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        
        // Simulate AI analysis
        setTimeout(() => {
          const emotions = ['happy', 'calm', 'focused', 'stressed', 'excited'];
          const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
          const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
          
          setAnalysis({
            dominantEmotion: randomEmotion,
            confidence,
            suggestions: [
              "Take 3 deep breaths to center yourself",
              "Try a 5-minute mindfulness exercise",
              "Consider taking a short walk outdoors"
            ]
          });
        }, 1500);
        
        stopCamera();
      }
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setAnalysis(null);
  };

  return (
    <Card className="shadow-large bg-gradient-secondary/5 border-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-secondary" />
          Emotion Recognition Camera
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Capture a selfie to analyze your current emotional state
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!capturedImage ? (
          <div className="relative">
            {/* Video Preview */}
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              {isActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Ready to analyze your emotions</p>
                    <Button onClick={startCamera} variant="secondary" size="lg">
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Camera Controls */}
            {isActive && (
              <div className="flex justify-center gap-2 mt-4">
                <Button onClick={capturePhoto} variant="glow" size="lg">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
                <Button onClick={stopCamera} variant="outline" size="lg">
                  Stop
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Captured Image */}
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured emotion"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Analysis Results */}
            {analysis ? (
              <div className="space-y-4 animate-scale-in">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2 bg-secondary/10 text-secondary">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Analysis Complete
                  </Badge>
                  <h3 className="text-2xl font-bold capitalize text-secondary">
                    {analysis.dominantEmotion}
                  </h3>
                  <p className="text-muted-foreground">
                    Confidence: {analysis.confidence}%
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Suggestions:</h4>
                  <ul className="space-y-1">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-secondary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-muted-foreground">Analyzing your emotions...</p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={resetCapture} variant="outline" size="lg" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button variant="secondary" size="lg" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Save Report
              </Button>
            </div>
          </div>
        )}
        
        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};