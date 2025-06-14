import { api } from './api';
import type { ItemOut } from '../types/item';
import type { CategoryOut } from '../types/category';

export const fetchVolatileItems = async (category?: string, search?: string): Promise<ItemOut[]> => {
  const params: any = {};
  if (category) params.category = category;
  if (search) params.search = search;
  const res = await api.get('/volatile-items', { params });
  return res.data;
};

export const fetchCategories = async (): Promise<CategoryOut[]> => {
  const res = await api.get('/categories');
  return res.data;
};
