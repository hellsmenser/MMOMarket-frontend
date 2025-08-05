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
      {p.adena_volume != null && <div>Объём: {p.adena_volume.toLocaleString()}</div>}
      {p.coin_avg != null && <div>Средняя цена: {p.coin_avg.toLocaleString()} монет</div>}
      {p.coin_min != null && <div>Мин. цена: {p.coin_min.toLocaleString()} монет</div>}
      {p.coin_volume != null && <div>Объём: {p.coin_volume.toLocaleString()}</div>}
    </div>
  );
};

export default function PriceChart({ data, currency = 'adena' }: Props) {
  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    const absNum = Math.abs(num);
    if (absNum >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'ккк';
    if (absNum >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'кк';
    if (absNum >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'к';
    return num.toString();
  };
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
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
        <YAxis
          tickLine={false}
          yAxisId="left"
          axisLine={{ stroke: "#ffc048" }}
          tick={{ fill: '#aaa' }}
          domain={yDomain}
          tickCount={5}
          label={{ value: 'Цена', angle: 90, position: 'insideLeft', fill: '#ffc048' }}
        />
        <YAxis
          tickLine={false}
          yAxisId="right"
          orientation="right"
          stroke="#2a3b55"
          axisLine={{ stroke: "#2a3b55" }}
          domain={[0, maxVolume * 1.2]}
          tickCount={5}
          label={{ value: 'Объём', angle: 90, position: 'insideRight', fill: '#2a3b55' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
