export type Disease = {
  id: string;
  slug: string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatment: {
    organic: string[];
    chemical: string[];
  };
  imageUrl: string;
  imageHint: string;
};

export type DiagnosisHistory = {
  id: string;
  date: string;
  diseaseName: string;
  confidence: number;
  imageUrl: string;
  imageHint: string;
  diseaseId: string;
};
