import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { DIAGNOSIS_HISTORY } from '@/lib/data';
import MainLayout from '@/components/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HistoryPage() {
  const history = DIAGNOSIS_HISTORY;

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Submission History
          </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Past Diagnoses</CardTitle>
            <CardDescription>Review your previous submissions and results.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Submitted image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={item.imageUrl}
                        data-ai-hint={item.imageHint}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.diseaseName}</TableCell>
                    <TableCell>
                      <Badge variant={item.confidence > 90 ? 'default' : 'secondary'} className={item.confidence > 90 ? 'bg-primary/90' : ''}>
                        {item.confidence}%
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(item.date), 'PPP')}
                    </TableCell>
                    <TableCell>
                      <Link href={`/diagnosis/${item.id}`} passHref>
                        <Button asChild variant="outline" size="sm">
                          <a>View Details</a>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {history.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                You have no submission history yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
