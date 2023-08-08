import { Product } from "./products";

export interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  emirate: string;
  area: string;
  villa_flat_number: string;
  location: string;
  order_status: string;
  order_date: any;
  order_items: OrderItem[];
  total_price: number;
}

interface OrderItem extends Product {
  quantity: number;
}
