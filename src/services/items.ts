import { api } from './api';
import type { ItemActivity, ItemOut, SearchItemsResponse } from '../types/item';
import type { PriceHistory } from '../types/price';

export const fetchVolatileItems = async (category_id?: number): Promise<ItemActivity[]> => {
  const attempt = (url: string) => api.get(url, { params: { category_id }, timeout: 20000 });
  try {
    const res = await attempt('items/volatility');
    return res.data;
  } catch (e: any) {
    const isTimeout = e?.code === 'ECONNABORTED';
    const status = e?.response?.status;
    if (isTimeout || status === 404 || status === 301 || status === 308) {
      const retry = await attempt('items/volatility/');
      return retry.data;
    }
    throw e;
  }
};

export const searchItems = async (query: string, page: number, page_size: number): Promise<SearchItemsResponse> => {
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
  const attempt = async (url: string) => api.get(url, { timeout: 15000 });
  try {
    const res = await attempt('prices/coin');
    return res.data ?? 0;
  } catch (e: any) {
    const isTimeout = e?.code === 'ECONNABORTED';
    const status = e?.response?.status;
    if (isTimeout || status === 404 || status === 301 || status === 308) {
      // Повтор с trailing slash
      const retry = await attempt('prices/coin');
      return retry.data ?? 0;
    }
    throw e;
  }
};