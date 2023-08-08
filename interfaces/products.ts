export interface Product {
  id: string;
  name: string;
  price: number;
  description: string[];
  image: string;
  unit: string;
  country: string;
  brand?: string;
  category: string;
  discount?: number;
  weight?: number;
}
