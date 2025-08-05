import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Legend,
} from 'recharts';

import type { PriceHistory } from '../types/price';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipProps } from 'recharts';

interface Props {
  data: PriceHistory[];
  currency?: 'adena' | 'coin';
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  const currency = payload[0].payload.currencyTooltip;
  let priceByRate = null;
  if (p.coin_price != null) {
    if (currency === 'coin' && p.coin_avg != null) {
      priceByRate = `${Math.ceil(p.coin_avg * p.coin_price).toLocaleString()} аден`;
    } else if (currency === 'adena' && p.adena_avg != null) {
      priceByRate = `${Math.ceil(p.adena_avg / p.coin_price).toLocaleString()} монет`;
    }
  }
  return (
    <div style={{
      background: '#1f2d40',
      border: '1px solid #00ff8f',
      padding: '8px 12px',
      borderRadius: 8,
      color: '#eee',
      minWidth: 120,
    }}>
      <div style={{ marginBottom: 4 }}>{label}</div>
      {p.adena_avg != null && <div>Средняя цена: {p.adena_avg.toLocaleString()} аден</div>}
      {p.adena_min != null && <div>Мин. цена: {p.adena_min.toLocaleString()} аден</div>}
      {p.coin_avg != null && <div>Средняя цена: {p.coin_avg.toLocaleString()} монет</div>}
      {p.coin_min != null && <div>Мин. цена: {p.coin_min.toLocaleString()} монет</div>}
      {priceByRate && <div>Цена по курсу: {priceByRate}</div>}
      {p.adena_volume != null && <div>Объём: {p.adena_volume.toLocaleString()}</div>}
      {p.coin_volume != null && <div>Объём: {p.coin_volume.toLocaleString()}</div>}
    </div>
  );
};

export default function PriceChart({ data, currency = 'adena' }: Props) {
  // Форматирование чисел в русскую ккк-нотацию
  function formatK(num: number) {
    if (num == null) return '';
    if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(2) + 'кккк';
    if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'ккк';
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'кк';
    if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + 'к';
    return num.toLocaleString();
  }
  // ...existing code...
  // ...existing code...
  const maxVolume = Math.max(...data.map((d: PriceHistory) => Math.max(d.adena_volume ?? 0, d.coin_volume ?? 0)), 1);

  // вычисляем min/max для цен
  let minPrice = 0, maxPrice = 1;
  if (currency === 'adena') {
    const prices = data.flatMap(d => [d.adena_avg ?? 0, d.adena_min ?? 0]);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  } else if (currency === 'coin') {
    const prices = data.flatMap(d => [d.coin_avg ?? 0, d.coin_min ?? 0]);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }
  // небольшой отступ сверху/снизу
  const priceMargin = Math.max(1, Math.round((maxPrice - minPrice) * 0.1));
  const yDomain = [minPrice - priceMargin, maxPrice + priceMargin];
  // добавляем валюту в данные для тултипа
  const chartData = data.map(d => ({ ...d, currencyTooltip: currency }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#2a3b55" vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: "#2a3b55" }} tick={{ fill: '#aaa' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" align="left" height={36} />
        {currency === 'adena' && (
          <Bar
            radius={[10, 10, 0, 0]}
            dataKey="adena_volume"
            barSize={20}
            fill="#2a3b55"
            yAxisId="right"
            legendType="rect"
            name="Объём (адена)"
          />
        )}
        {currency === 'coin' && (
          <Bar
            radius={[10, 10, 0, 0]}
            dataKey="coin_volume"
            barSize={20}
            fill="#2a3b55"
            yAxisId="right"
            legendType="rect"
            name="Объём (монета)"
          />
        )}
        {currency === 'adena' && (
          <Line
            dot={false}
            strokeWidth={2}
            strokeLinecap="round"
            type="monotone"
            dataKey="adena_avg"
            stroke="#00ff8f"
            yAxisId="left"
            legendType="rect"
            name="Средняя цена (адена)"
          />
        )}
        {currency === 'adena' && (
          <Line
            dot={false}
            strokeWidth={2}
            strokeLinecap="round"
            type="monotone"
            dataKey="adena_min"
            stroke="#00bfa3"
            yAxisId="left"
            legendType="rect"
            name="Мин. цена (адена)"
          />
        )}
        {currency === 'coin' && (
          <Line
            dot={false}
            strokeWidth={2}
            strokeLinecap="round"
            type="monotone"
            dataKey="coin_avg"
            stroke="#00ff8f"
            yAxisId="left"
            legendType="rect"
            name="Средняя цена (монета)"
          />
        )}
        {currency === 'coin' && (
          <Line
            dot={false}
            strokeWidth={2}
            strokeLinecap="round"
            type="monotone"
            dataKey="coin_min"
            stroke="#00bfa3"
            yAxisId="left"
            legendType="rect"
            name="Мин. цена (монета)"
          />
        )}
        {/* ...existing code... */}
        <YAxis
          tickLine={false}
          yAxisId="left"
          axisLine={{ stroke: "#2a3b55" }}
          tick={{ fill: '#aaa' }}
          domain={yDomain}
          tickCount={5}
          tickFormatter={formatK}
        />
        <YAxis
          tickLine={false}
          yAxisId="right"
          orientation="right"
          stroke="#2a3b55"
          axisLine={{ stroke: "#2a3b55" }}
          domain={[0, maxVolume * 1.2]}
          tickCount={5}
          tickFormatter={formatK}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
