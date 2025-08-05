import { api } from './api';
import type { ItemActivity, ItemOut } from '../types/item';
import type { PriceHistory } from '../types/price';

export const fetchVolatileItems = async (category_id?: number): Promise<ItemActivity[]> => {
  const res = await api.get('/items/volatility', { params: {category_id: category_id} });
  return res.data;
};

export const searchItems = async (query: string, page: number, page_size: number): Promise<ItemOut[]> => {
  const res = await api.get('/items/search', { params: { query: query, page: page, page_size: page_size } });
  return res.data;
};

export const fetchItemById = async (itemId: number): Promise<ItemOut> => {
  const res = await api.get(`/items/${itemId}`);
  return res.data;
};

export const fetchItemPriceHistory = async (itemId: number, period: number | 'all' , modification: number | null): Promise<PriceHistory[]> => {
  const res = await api.get(`/prices/${itemId}`, { params: { period, modification } });
  return res.data.map((entry: PriceHistory) => ({
    ...entry,
    timestamp: entry.timestamp
      ? new Date(entry.timestamp).toLocaleDateString('ru-RU')
      : entry.timestamp,
  }));
};

export const fetchCoinPrice = async (): Promise<PriceHistory> => {
  const res = await api.get('/prices/coin');
  return res.data ?? 0;
};