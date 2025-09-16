"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { DISEASES } from '@/lib/data';
import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiseases = DISEASES.filter(
    (disease) =>
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Knowledge Base
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for diseases..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDiseases.map((disease) => (
            <Link key={disease.id} href={`/knowledge-base/${disease.slug}`} passHref>
              <Card className="h-full hover:border-primary transition-all hover:shadow-md cursor-pointer flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <Image
                      src={disease.imageUrl}
                      alt={`Image of ${disease.name}`}
                      data-ai-hint={disease.imageHint}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <div className="p-4 flex flex-col flex-grow">
                  <CardTitle className="font-headline text-lg mb-2">{disease.name}</CardTitle>
                  <CardDescription className="line-clamp-3 text-sm flex-grow">
                    {disease.description}
                  </CardDescription>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {filteredDiseases.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No diseases found for "{searchTerm}".
          </div>
        )}
      </div>
    </MainLayout>
  );
}
