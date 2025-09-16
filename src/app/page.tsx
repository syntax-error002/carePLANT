"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import MainLayout from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { diagnosePlant } from "@/ai/flows/diagnose-plant-flow";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDiagnose = async () => {
    if (!file || !preview) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image to diagnose.",
      });
      return;
    }
    setIsDiagnosing(true);

    try {
      // Store image in local storage to pass to next page
      localStorage.setItem("userUploadedImage", preview);

      const diagnosisResult = await diagnosePlant({
        photoDataUri: preview,
        description: "A photo of a plant leaf.",
      });
      
      // Store result to pass to next page
      localStorage.setItem("diagnosisResult", JSON.stringify(diagnosisResult));
      
      // Navigate to a dynamic results page. We'll use a placeholder ID for now.
      router.push("/diagnosis/result");

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
  };
  
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setIsDiagnosing(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    if (!isDiagnosing) {
      fileInputRef.current?.click();
    }
  }

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Crop Disease Diagnosis
          </h1>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Upload Crop Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors
                ${isDiagnosing ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${preview ? 'border-primary' : 'border-border hover:border-primary/50'}`}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={openFilePicker}
            >
              {preview ? (
                <>
                  <Image src={preview} alt="Selected crop" fill style={{ objectFit: 'contain' }} className="p-2 rounded-lg" />
                  {!isDiagnosing && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center text-muted-foreground">
                  <UploadCloud className="w-10 h-10 mb-4" />
                  <p className="mb-2 text-sm">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs">PNG, JPG, or WEBP (MAX. 10MB)</p>
                </div>
              )}
               <input
                ref={fileInputRef}
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                disabled={isDiagnosing}
              />
            </div>
            
            <Button onClick={handleDiagnose} disabled={!file || isDiagnosing} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isDiagnosing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Diagnosing...
                </>
              ) : (
                "Diagnose Plant"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
