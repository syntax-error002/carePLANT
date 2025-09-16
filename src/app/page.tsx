"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import MainLayout from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleDiagnose = () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image to diagnose.",
      });
      return;
    }
    setIsUploading(true);
    
    // Simulate upload and analysis
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        // We'll always navigate to a mock diagnosis for this demo
        router.push("/diagnosis/1");
      }, 500);
    }, 2000);
  };
  
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setIsUploading(false);
    setUploadProgress(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
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
              className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${preview ? 'border-primary' : 'border-border hover:border-primary/50'}`}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={openFilePicker}
            >
              {preview ? (
                <>
                  <Image src={preview} alt="Selected crop" fill style={{ objectFit: 'contain' }} className="p-2 rounded-lg" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
                disabled={isUploading}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">Diagnosing... Please wait.</p>
              </div>
            )}

            <Button onClick={handleDiagnose} disabled={!file || isUploading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isUploading ? (
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
