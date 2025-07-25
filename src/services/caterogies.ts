import { api } from './api';
import type { CategoryOut } from '../types/category';

export const fetchCategories = async (): Promise<CategoryOut[]> => {
  const res = await api.get('/categories/');
  return res.data;
};
