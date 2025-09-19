
'use client';

import { useState } from 'react';
import { Upload, Loader2, Leaf, AlertCircle, Sparkles, Activity, X } from 'lucide-react';
import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { diagnosePlant, DiagnosePlantOutput } from '@/ai/flows/diagnose-plant-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function DashboardPage() {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosePlantOutput | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useState<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setDiagnosisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedImage) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please upload an image of a plant to diagnose.',
      });
      return;
    }

    setIsDiagnosing(true);
    setDiagnosisResult(null);

    try {
      const result = await diagnosePlant({
        photoDataUri: selectedImage,
        description: 'A photo of a plant uploaded by a user.',
      });
      setDiagnosisResult(result);
    } catch (error) {
      console.error('Diagnosis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Diagnosis Failed',
        description: 'An error occurred during the diagnosis. Please try again.',
      });
    } finally {
      setIsDiagnosing(false);
    }
  };
  
  const clearImage = () => {
      setSelectedImage(null);
      setDiagnosisResult(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }


  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Plant Diagnosis
          </h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Upload className="text-primary"/> Upload a Photo</CardTitle>
                    <CardDescription>Select a photo of your plant for AI analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                        {selectedImage ? (
                            <>
                                <Image src={selectedImage} alt="Uploaded Plant" layout="fill" objectFit="cover" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={clearImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <Leaf className="mx-auto h-12 w-12" />
                                <p className="mt-2">Image preview will appear here</p>
                            </div>
                        )}
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isDiagnosing}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Choose Image
                        </Button>
                        <Button 
                            onClick={handleDiagnose} 
                            disabled={isDiagnosing || !selectedImage} 
                            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                        {isDiagnosing ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Diagnosing...
                            </>
                        ) : (
                            "Diagnose Plant"
                        )}
                        </Button>
                    </div>
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
                            <p>Upload a plant photo to get started.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
