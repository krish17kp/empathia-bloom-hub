import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RotateCcw, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CameraFeature = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    dominantEmotion: string;
    confidence: number;
    suggestions: string[];
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Auto-start camera when component mounts
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Only start camera once when component mounts
    if (!initializedRef.current && !capturedImage && !isActive) {
      // Don't auto-start camera, let user click the button
      initializedRef.current = true;
    }
    
    return () => {
      // Clean up camera when component unmounts
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setPermissionError(false);
      
      // First check if we have camera permissions
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      
      if (!hasCamera) {
        throw new Error('No camera detected on this device');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play()
            .then(() => {
              console.log('Video playback started');
              setIsActive(true);
            })
            .catch(err => {
              console.error('Error playing video:', err);
              setPermissionError(true);
              setIsLoading(false);
              toast({
                variant: "destructive",
                title: "Camera Error",
                description: "Could not start video stream. Please check permissions."
              });
            });
        };
        
        videoRef.current.onloadeddata = () => {
          console.log('Video data loaded');
          setIsLoading(false);
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
          setPermissionError(true);
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "Camera Error",
            description: "Could not access your camera. Please check permissions."
          });
        };
        
        // Set a timeout to ensure loading state is cleared even if events don't fire
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermissionError(true);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions."
      });
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
                  muted
                  style={{ 
                    display: 'block',
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    transform: 'scaleX(-1)',
                    backgroundColor: '#000'
                  }}
                />
              ) : permissionError ? (
                <div className="flex items-center justify-center h-full bg-destructive/10">
                  <div className="text-center max-w-md p-6">
                    <div className="bg-destructive/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-destructive">Camera Error</h3>
                    <p className="text-muted-foreground mb-4">Could not access your camera. Please check your browser permissions and make sure you've allowed camera access for this site.</p>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Try these steps:</p>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 text-left">
                        <li>Click the camera icon in your browser's address bar</li>
                        <li>Select "Allow" for camera access</li>
                        <li>Refresh the page after changing permissions</li>
                      </ul>
                    </div>
                    <Button onClick={startCamera} variant="destructive" size="lg" className="mt-4">
                      <Camera className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground mb-4">Initializing camera...</p>
                      </>
                    ) : (
                      <>
                        <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Ready to analyze your emotions</p>
                        <Button onClick={startCamera} variant="secondary" size="lg">
                          <Camera className="mr-2 h-4 w-4" />
                          Start Camera
                        </Button>
                      </>
                    )}
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