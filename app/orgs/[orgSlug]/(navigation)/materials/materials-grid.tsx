import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import Image from "next/image";

type Material = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

type MaterialsGridProps = {
  materials: Material[];
};

export function MaterialsGrid({ materials }: MaterialsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => (
        <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative">
            <Image
              src={material.imageUrl}
              alt={material.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle>{material.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography className="text-muted-foreground">
              {material.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 