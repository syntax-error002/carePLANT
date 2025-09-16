'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Leaf, AlertCircle, Sparkles, Activity, ShieldCheck } from 'lucide-react';

import MainLayout from '@/components/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { DiagnosePlantOutput } from '@/ai/flows/diagnose-plant-flow';

export default function DiagnosisResultPage() {
  const router = useRouter();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosePlantOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedImage = localStorage.getItem('userUploadedImage');
    const storedResult = localStorage.getItem('diagnosisResult');

    if (!storedImage || !storedResult) {
      // If data is missing, redirect to home to start over
      router.replace('/');
      return;
    }
    
    setUserImage(storedImage);
    try {
      const parsedResult: DiagnosePlantOutput = JSON.parse(storedResult);
      setDiagnosisResult(parsedResult);
    } catch (e) {
      console.error("Failed to parse diagnosis result", e);
      router.replace('/'); // Or show an error
    } finally {
      setIsLoading(false);
    }

  }, [router]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Diagnosis Result
            </h1>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="aspect-video w-full" />
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                 <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
              </Card>
               <Card className="lg:col-span-3">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
              </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!diagnosisResult) {
     return (
      <MainLayout>
        <div className="flex-1 p-4 md:p-8 pt-6">
           <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Could not load diagnosis result. Please try again.
              </AlertDescription>
            </Alert>
        </div>
      </MainLayout>
     )
  }

  const { identification, diagnosis } = diagnosisResult;

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Diagnosis Result
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-headline">Submitted Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative rounded-lg overflow-hidden border">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="User submitted crop image"
                    data-ai-hint="user upload"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <p className="text-muted-foreground">No image found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Leaf className="text-primary" />
                Plant Identification
              </CardTitle>
              <CardDescription>
                Based on our AI analysis of the provided image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {identification.isPlant ? (
                  <div>
                    <h3 className="text-2xl font-semibold">{identification.commonName}</h3>
                    <p className="text-sm text-muted-foreground italic">
                      {identification.latinName}
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
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Sparkles className="text-primary" />
                AI Diagnosis
              </CardTitle>
              <CardDescription>A concise summary generated by our AI expert.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <h4 className="font-semibold">Health Status:</h4>
                    <Badge variant={diagnosis.isHealthy ? 'default' : 'destructive'} className={diagnosis.isHealthy ? 'bg-green-600' : ''}>
                        {diagnosis.isHealthy ? 'Healthy' : 'Needs Attention'}
                    </Badge>
                </div>
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertTitle>Assessment</AlertTitle>
                  <AlertDescription>
                     {diagnosis.diagnosis}
                  </AlertDescription>
                </Alert>
            </CardContent>
          </Card>

        </div>
      </div>
    </MainLayout>
  );
}
