import type { CategoryOut } from "./category";

export interface ItemActivity {
  id: number;
  name: string;
  category: CategoryOut;
  price: number;
  сurrency?: string;
  activity: number;
}

export interface ItemOut {
  id: number;
  name: string;
  category: CategoryOut;
  tolerance: number;
  modifications: string[];
}

export interface SearchItemsResponse {
  Items: ItemOut[];
  Total: number;
}