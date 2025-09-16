'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Leaf, TestTube2, ShieldCheck, AlertCircle } from 'lucide-react';

import MainLayout from '@/components/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getDiagnosisById, getDiseaseById } from '@/lib/data';
import { generateDiseaseSummary, GenerateDiseaseSummaryOutput } from '@/ai/flows/generate-disease-summary';
import { Skeleton } from '@/components/ui/skeleton';

export default function DiagnosisResultPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [userImage, setUserImage] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<GenerateDiseaseSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const diagnosis = getDiagnosisById(id);
  const disease = diagnosis ? getDiseaseById(diagnosis.diseaseId) : null;

  useEffect(() => {
    const storedImage = localStorage.getItem('userUploadedImage');
    setUserImage(storedImage);

    async function fetchSummary() {
      if (disease) {
        try {
          const summary = await generateDiseaseSummary({
            diseaseName: disease.name,
            potentialCauses: disease.causes.join(', '),
            recommendedActions: disease.treatment.organic.join('; '),
          });
          setSummaryData(summary);
        } catch (error) {
          console.error("Error generating summary:", error);
          // Handle error appropriately, maybe set an error state
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, [id, disease]);

  if (!diagnosis || !disease) {
    return notFound();
  }

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
                Disease Identification
              </CardTitle>
              <CardDescription>
                Based on our analysis of the provided image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">{disease.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Confidence Level
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <Progress value={diagnosis.confidence} className="w-full" />
                  <span className="font-bold text-lg text-primary">
                    {diagnosis.confidence}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Potential Causes</h4>
                <div className="flex flex-wrap gap-2">
                  {disease.causes.map((cause) => (
                    <Badge key={cause} variant="secondary">
                      {cause}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline">AI Summary</CardTitle>
              <CardDescription>A concise summary generated by our AI expert.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : summaryData ? (
                 <p className="text-muted-foreground italic">
                  "{summaryData.summary}"
                </p>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Could not load AI summary.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <ShieldCheck className="text-accent" />
                Treatment Recommendations
              </CardTitle>
              <CardDescription>
                Follow these steps to manage the disease. Organic options are
                prioritized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="organic">
                <AccordionItem value="organic">
                  <AccordionTrigger className="text-lg font-semibold text-green-700">
                    Organic Treatments
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      {disease.treatment.organic.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="chemical">
                  <AccordionTrigger className="text-lg font-semibold text-orange-700">
                    Chemical Treatments
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      {disease.treatment.chemical.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
