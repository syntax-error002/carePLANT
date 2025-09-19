
'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, Leaf, AlertCircle, Sparkles, Activity } from 'lucide-react';
import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { diagnosePlant, DiagnosePlantOutput } from '@/ai/flows/diagnose-plant-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosePlantOutput | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        // Stop camera stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);


  const handleDiagnose = async () => {
    if (!videoRef.current || !canvasRef.current) {
      toast({
        variant: "destructive",
        title: "Camera not ready",
        description: "Please wait for the camera to load.",
      });
      return;
    }
    
    setIsDiagnosing(true);
    setDiagnosisResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoDataUri = canvas.toDataURL('image/jpeg');

        try {
            const result = await diagnosePlant({
                photoDataUri,
                description: "A photo of a plant captured from a live camera feed.",
            });
            setDiagnosisResult(result);
        } catch (error) {
            console.error("Diagnosis failed:", error);
            toast({
                variant: "destructive",
                title: "Diagnosis Failed",
                description: "An error occurred during the diagnosis. Please try again.",
            });
        } finally {
            setIsDiagnosing(false);
        }
    } else {
        setIsDiagnosing(false);
        toast({
            variant: "destructive",
            title: "Could not capture image",
            description: "Failed to get image from video stream.",
        });
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Live Plant Diagnosis
          </h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Camera className="text-primary"/> Camera Feed</CardTitle>
                <CardDescription>Point your camera at a plant and click scan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access in your browser settings to use this feature. You may need to refresh the page.
                    </AlertDescription>
                    </Alert>
                )}
                <Button onClick={handleDiagnose} disabled={isDiagnosing || hasCameraPermission !== true} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isDiagnosing ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Diagnosing...
                    </>
                ) : (
                    "Scan Plant"
                )}
                </Button>
            </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary"/> AI Diagnosis</CardTitle>
                    <CardDescription>Results from our AI analysis will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isDiagnosing && (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Separator/>
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    )}
                    {diagnosisResult && (
                        <div className="space-y-4">
                            {diagnosisResult.identification.isPlant ? (
                                <div>
                                    <h3 className="text-2xl font-semibold">{diagnosisResult.identification.commonName}</h3>
                                    <p className="text-sm text-muted-foreground italic">
                                    {diagnosisResult.identification.latinName}
                                    </p>
                                </div>
                            ) : (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Not a Plant</AlertTitle>
                                    <AlertDescription>
                                        Our AI could not identify a plant in the image.
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            <Separator />

                            {diagnosisResult.identification.isPlant && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <h4 className="font-semibold">Health Status:</h4>
                                        <Badge variant={diagnosisResult.diagnosis.isHealthy ? 'default' : 'destructive'} className={diagnosisResult.diagnosis.isHealthy ? 'bg-green-600' : ''}>
                                            {diagnosisResult.diagnosis.isHealthy ? 'Healthy' : 'Needs Attention'}
                                        </Badge>
                                    </div>
                                    <Alert>
                                        <Activity className="h-4 w-4" />
                                        <AlertTitle>Assessment</AlertTitle>
                                        <AlertDescription>
                                            {diagnosisResult.diagnosis.diagnosis}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    )}
                    {!isDiagnosing && !diagnosisResult && (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                            <Leaf className="w-10 h-10 mb-4" />
                            <p>Scan a plant to get started.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
