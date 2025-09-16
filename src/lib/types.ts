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
