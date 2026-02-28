import { ProductWithCategory } from "./product";

export interface CheckoutItem {
  id: string;
  quantity: number;
  price: number;
  costPrice: number;
}

export interface CartItem extends ProductWithCategory {
  quantity: number;
}
