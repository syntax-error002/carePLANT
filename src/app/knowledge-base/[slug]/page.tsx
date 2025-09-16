import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDiseaseBySlug } from '@/lib/data';
import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

function InfoSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 font-headline text-primary">{title}</h3>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function DiseaseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const disease = getDiseaseBySlug(params.slug);

  if (!disease) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-headline">
            {disease.name}
          </h1>
          <p className="text-lg text-muted-foreground">{disease.description}</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Disease Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <InfoSection title="Common Symptoms" items={disease.symptoms} />
                        <Separator />
                        <InfoSection title="Potential Causes" items={disease.causes} />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                 <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                    <Image
                        src={disease.imageUrl}
                        alt={`Image of ${disease.name}`}
                        data-ai-hint={disease.imageHint}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Management and Prevention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <InfoSection title="Prevention Methods" items={disease.prevention} />
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 font-headline text-primary">Treatment Options</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                          <h4 className="font-semibold mb-2 text-green-700">Organic</h4>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                               {disease.treatment.organic.map((item, index) => (
                                <li key={index}>{item}</li>
                               ))}
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-semibold mb-2 text-orange-700">Chemical</h4>
                           <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                               {disease.treatment.chemical.map((item, index) => (
                                <li key={index}>{item}</li>
                               ))}
                          </ul>
                      </div>
                  </div>
                </div>
            </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}

export async function generateStaticParams() {
    const { DISEASES } = await import('@/lib/data');
    return DISEASES.map((disease) => ({
        slug: disease.slug,
    }));
}
