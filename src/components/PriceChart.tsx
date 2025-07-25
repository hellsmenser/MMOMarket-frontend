import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipProps } from 'recharts';


interface Props {
  data: { date: string; value: number; coin_price?: number | null }[];
  currency: 'adena' | 'coin';
}


const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || !payload.length) return null;
  const { value, coin_price } = payload[0].payload;
  let converted = null;
  if (coin_price && coin_price > 0) {
    if (payload[0].payload && payload[0].payload.value != null) {
      // Если график адены, показываем стоимость в монетах
      // Если график монеты, показываем стоимость в адене
      converted = payload[0].payload.currency === 'adena'
        ? `${Math.round(value / coin_price).toLocaleString()} Монет`
        : `${Math.round(value * coin_price).toLocaleString()} Аден`;
    }
  }
  return (
    <div style={{
      background: '#1f2d40',
      border: '1px solid #00ff8f',
      padding: '8px 12px',
      borderRadius: 8,
      color: '#eee',
    }}>
      <div style={{ marginBottom: 4 }}>{label}</div>
      <div>Цена: {value?.toLocaleString()}</div>
      {converted && <div>По курсу: {converted}</div>}
    </div>
  );
};


export default function PriceChart({ data, currency }: Props) {
  // Форматтер: 1_000 -> 1к, 1_000_000 -> 1кк, 1_000_000_000 -> 1ккк
  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    const absNum = Math.abs(num);
    if (absNum >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'ккк';
    if (absNum >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'кк';
    if (absNum >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'к';
    return num.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.map(d => ({ ...d, currency }))}>
        <CartesianGrid stroke="#2a3b55" strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fill: '#aaa' }} />
        <YAxis tick={{ fill: '#aaa' }} tickFormatter={formatNumber} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={currency === 'adena' ? '#00ff8f' : '#ffc048'}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
