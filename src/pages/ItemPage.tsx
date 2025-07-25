import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Tabs, Typography, Spin, Table, Radio, Button } from 'antd';
import { fetchItemById, fetchItemPriceHistory } from '../services/items';
import type { ItemOut } from '../types/item';
import '../styles/pages/ItemPage.css';
import PriceChart from '../components/PriceChart';
import type { PriceHistory } from '../types/price';

const { Title } = Typography;
const { Option } = Select;

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState<ItemOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMod, setSelectedMod] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState<'adena' | 'coin'>('adena');
  const [aggregation, setAggregation] = useState<'avg' | 'min'>('avg');
  const [period, setperiod] = useState<number | 'all'>(30);
  const [history, setHistory] = useState<PriceHistory[] | null>(null);


  useEffect(() => {
    fetchItemById(Number(id))
      .then(setItem)
      .catch(err => {
        if (err?.response?.status === 404) {
          setItem(null);
          setLoading(false);
        }
      });
  }, [id]);

  useEffect(() => {
    if (item?.modifications && item.modifications.length > 0) {
      const minMod = [...item.modifications].sort()[0];
      setSelectedMod(minMod);
    }
  }, [item]);

  useEffect(() => {
    setLoading(true);
    let modArg: number | null = null;
    if (selectedMod !== undefined && selectedMod !== null) {
      modArg = Number(selectedMod);
    }
    fetchItemPriceHistory(Number(id), period, modArg, aggregation)
      .then(data => {
        setHistory(data);
        console.log('Price history:', data);
        setLoading(false);
      })
      .catch(err => {
        if (err?.response?.status === 404) {
          setHistory(null);
          setLoading(false);
        }
      });
  }, [id, period, selectedMod, aggregation]);


  const adenaChartData = useMemo(() => {
    if (!history) return [];
    return history
      .filter(entry => entry.adena != null)
      .map(entry => ({
        date: entry.timestamp,
        value: entry.adena,
        coin_price: entry.coin_price,
      }));
  }, [history]);

  const coinChartData = useMemo(() => {
    if (!history) return [];
    return history
      .filter(entry => entry.coin != null)
      .map(entry => ({
        date: entry.timestamp,
        value: entry.coin,
        coin_price: entry.coin_price,
      }));
  }, [history]);

  const isRare = useMemo(() => {
    if (!history) return false;
    const totalPoints = history.length;
    const days = period === 'all' ? totalPoints : period;
    return (totalPoints / days) < (1 / 7);
  }, [history, period]);


  if (loading) return <Spin />;
  if (!item) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40, color: '#ff4d4f', fontSize: 18 }}>
        Предмет не найден или был удалён.
      </div>
    );
  }

  // ...рендер основной страницы...

  return (
    <div className="item-page">
      <div className="item-header">
        <Title level={2} className="item-title">{item?.name ?? ''}</Title>
        {item && item.modifications && item.modifications.length > 0 && (
          <>
            {item.modifications.length > 1 && (
              <div style={{ marginBottom: 8, color: '#ff9800', fontSize: 13 }}>
                Обратите внимание: для предметов с несколькими модификациями их определение производится автоматически, поэтому реальная модификация может отличаться от отображаемой.
              </div>
            )}
            <Select
              className="modification-select"
              value={selectedMod}
              onChange={setSelectedMod}
              placeholder="Выберите модификацию"
              allowClear
              size="middle"
            >
              {item.modifications.map((mod) => (
                <Option key={mod} value={mod}>{mod}</Option>
              ))}
            </Select>
          </>
        )}
      </div>

      <div className="period-selector" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <Radio.Group value={period} onChange={(e) => setperiod(e.target.value)}>
          <Radio.Button value={7}>7д</Radio.Button>
          <Radio.Button value={30}>30д</Radio.Button>
          <Radio.Button value={60}>60д</Radio.Button>
          <Radio.Button value={90}>90д</Radio.Button>
        </Radio.Group>
        <Radio.Group value={aggregation} onChange={e => setAggregation(e.target.value)}>
          <Radio.Button value="avg">Среднее</Radio.Button>
          <Radio.Button value="min">Минимальное</Radio.Button>
        </Radio.Group>
      </div>

      {!history || history.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '32px 0', color: '#ff9800', fontSize: 16 }}>
          Для выбранных параметров не найдено истории продаж.
        </div>
      ) : (
        <Tabs
          defaultActiveKey="adena"
          onChange={(key) => setCurrency(key as 'adena' | 'coin')}
          className="currency-tabs"
          items={[
            {
              label: 'Адена',
              key: 'adena',
              children: isRare ? (
                <Table
                  columns={[
                    { title: 'Дата', dataIndex: 'date', key: 'date' },
                    { title: 'Цена', dataIndex: 'value', key: 'value', render: v => v.toLocaleString() },
                  ]}
                  dataSource={adenaChartData.map((d, i) => ({ ...d, key: i }))}
                  pagination={false}
                />
              ) : (
                <PriceChart data={adenaChartData} currency="adena" />
              ),
            },
            {
              label: 'Монета',
              key: 'coin',
              children: isRare ? (
                <Table
                  columns={[
                    { title: 'Дата', dataIndex: 'date', key: 'date' },
                    { title: 'Цена', dataIndex: 'value', key: 'value', render: v => v.toLocaleString() },
                  ]}
                  dataSource={coinChartData.map((d, i) => ({ ...d, key: i }))}
                  pagination={false}
                />
              ) : (
                <PriceChart data={coinChartData} currency="coin" />
              ),
            },
          ]}
        />
      )}
    </div>
  );

  return (
    <div className="item-page">
      <div className="item-header">
        <Title level={2} className="item-title">{item.name}</Title>
        {item.modifications?.length > 0 && (
          <>
            {item.modifications.length > 1 && (
              <div style={{ marginBottom: 8, color: '#ff9800', fontSize: 13 }}>
                Обратите внимание: для предметов с несколькими модификациями их определение производится автоматически, поэтому реальная модификация может отличаться от отображаемой.
              </div>
            )}
            <Select
              className="modification-select"
              value={selectedMod}
              onChange={setSelectedMod}
              placeholder="Выберите модификацию"
              allowClear
              size="middle"
            >
              {item.modifications.map((mod) => (
                <Option key={mod} value={mod}>{mod}</Option>
              ))}
            </Select>
          </>
        )}
      </div>

      <div className="period-selector" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <Radio.Group value={period} onChange={(e) => setperiod(e.target.value)}>
          <Radio.Button value={7}>7д</Radio.Button>
          <Radio.Button value={30}>30д</Radio.Button>
          <Radio.Button value={60}>60д</Radio.Button>
          <Radio.Button value={90}>90д</Radio.Button>
        </Radio.Group>
        <Radio.Group value={aggregation} onChange={e => setAggregation(e.target.value)}>
          <Radio.Button value="avg">Среднее</Radio.Button>
          <Radio.Button value="min">Минимальное</Radio.Button>
        </Radio.Group>
      </div>

      <Tabs
        defaultActiveKey="adena"
        onChange={(key) => setCurrency(key as 'adena' | 'coin')}
        className="currency-tabs"
        items={[
          {
            label: 'Адена',
            key: 'adena',
            children: isRare ? (
              <Table
                columns={[
                  { title: 'Дата', dataIndex: 'date', key: 'date' },
                  { title: 'Цена', dataIndex: 'value', key: 'value', render: v => v.toLocaleString() },
                ]}
                dataSource={adenaChartData.map((d, i) => ({ ...d, key: i }))}
                pagination={false}
              />
            ) : (
              <PriceChart data={adenaChartData} currency="adena" />
            ),
          },
          {
            label: 'Монета',
            key: 'coin',
            children: isRare ? (
              <Table
                columns={[
                  { title: 'Дата', dataIndex: 'date', key: 'date' },
                  { title: 'Цена', dataIndex: 'value', key: 'value', render: v => v.toLocaleString() },
                ]}
                dataSource={coinChartData.map((d, i) => ({ ...d, key: i }))}
                pagination={false}
              />
            ) : (
              <PriceChart data={coinChartData} currency="coin" />
            ),
          },
        ]}
      />
    </div>
  );
}
