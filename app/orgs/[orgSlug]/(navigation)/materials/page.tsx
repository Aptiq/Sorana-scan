import { Typography } from "@/components/ui/typography";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { MaterialsGrid } from "./materials-grid";

const materials = [
  {
    id: 1,
    title: "Acier inoxydable",
    description: "Analyse de la composition de l'acier inoxydable 304",
    imageUrl: "/images/materials/steel.jpg",
  },
  {
    id: 2,
    title: "Alliage d'aluminium",
    description: "Étude des propriétés de l'alliage 6061",
    imageUrl: "/images/materials/aluminum.jpg",
  },
  // Ajoutez d'autres matériaux ici
];

export default function MaterialsPage() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Matériaux analysés</LayoutTitle>
        <Typography variant="large" className="text-muted-foreground">
        </Typography>
      </LayoutHeader>
      <LayoutContent>
        <MaterialsGrid materials={materials} />
      </LayoutContent>
    </Layout>
  );
}
