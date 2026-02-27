import { Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export interface EditProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    costPrice: number;
    stock: number;
    category?: { name: string } | null;
  };
}
