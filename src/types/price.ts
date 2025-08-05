export type PriceHistory = {
  timestamp: string;
  adena_avg?: number | null;
  adena_min?: number | null;
  adena_volume?: number | null;
  coin_avg?: number | null;
  coin_min?: number | null;
  coin_volume?: number | null;
  coin_price?: number | null;
};
