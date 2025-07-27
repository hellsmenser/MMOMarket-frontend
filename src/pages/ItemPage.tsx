import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Tabs, Typography, Spin, Table, Radio } from 'antd';
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
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedMod, setSelectedMod] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'adena' | 'coin'>('adena');
  const [aggregation, setAggregation] = useState<'avg' | 'min'>('avg');
  const [period, setperiod] = useState<number | 'all'>(30);
  const [history, setHistory] = useState<PriceHistory[] | null>(null);


  useEffect(() => {
    setLoadingItem(true);
    fetchItemById(Number(id))
      .then(data => {
        setItem(data);
        setLoadingItem(false);
      })
      .catch(err => {
        if (err?.response?.status === 404) {
          setItem(null);
          setLoadingItem(false);
        }
      });
  }, [id]);

  useEffect(() => {
    if (item?.modifications && item.modifications.length > 0) {
      const minMod = [...item.modifications].sort()[0];
      setSelectedMod(minMod);
    } else {
      setSelectedMod(undefined);
    }
  }, [item]);

  useEffect(() => {
    setLoadingHistory(true);
    let modArg: number | null = null;
    if (selectedMod !== undefined && selectedMod !== null) {
      modArg = Number(selectedMod);
    }
    fetchItemPriceHistory(Number(id), period, modArg, aggregation)
      .then(data => {
        setHistory(data);
        setLoadingHistory(false);
      })
      .catch(err => {
        if (err?.response?.status === 404) {
          setHistory(null);
          setLoadingHistory(false);
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


  // Определяем редкость отдельно для адены и монеты
  const isRareAdena = useMemo(() => {
    if (!history) return false;
    const adenaPoints = history.filter(h => h.adena != null).length;
    const days = period === 'all' ? history.length : period;
    return (adenaPoints / days) < (1 / 7);
  }, [history, period]);

  const isRareCoin = useMemo(() => {
    if (!history) return false;
    const coinPoints = history.filter(h => h.coin != null).length;
    const days = period === 'all' ? history.length : period;
    return (coinPoints / days) < (1 / 7);
  }, [history, period]);



  if (loadingItem) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <Spin size="large" />
    </div>
  );
  if (!item) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40, color: '#ff4d4f', fontSize: 18 }}>
        Предмет не найден или был удалён.
      </div>
    );
  }

  // Вынесенная часть для графика и истории
  function ItemHistoryView() {
    if (loadingHistory) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Spin size="large" />
        </div>
      );
    }
    if (!history || history.length === 0) {
      return (
        <div style={{ textAlign: 'center', margin: '32px 0', color: '#ff9800', fontSize: 16 }}>
          Для выбранных параметров не найдено истории продаж.
        </div>
      );
    }
    return (
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'adena' | 'coin')}
        className="currency-tabs"
        items={[
          {
            label: 'Адена',
            key: 'adena',
            children: isRareAdena ? (
              <Table
                columns={[
                  { title: 'Дата', dataIndex: 'date', key: 'date' },
                  { title: 'Цена', dataIndex: 'value', key: 'value', render: v => v.toLocaleString() },
                  {
                    title: 'По курсу (монета)',
                    dataIndex: 'coin_price',
                    key: 'coin_price',
                    render: (coin_price, row) => {
                      if (!coin_price || !row.value) return '-';
                      return Math.round(row.value / coin_price).toLocaleString();
                    },
                  },
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
            children: isRareCoin ? (
              <Table
                columns={[
                  { title: 'Дата', dataIndex: 'date', key: 'date' },
                  { title: 'Цена', dataIndex: 'value', key: 'value', render: v => v.toLocaleString() },
                  {
                    title: 'По курсу (адена)',
                    dataIndex: 'coin_price',
                    key: 'coin_price',
                    render: (coin_price, row) => {
                      if (!coin_price || !row.value) return '-';
                      return Math.round(row.value * coin_price).toLocaleString();
                    },
                  },
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
    );
  }

  return (
    <div className="item-page">
      <div className="item-header">
        <Title level={2} className="item-title">{item?.name ?? ''}</Title>
        {(item as ItemOut).modifications && (item as ItemOut).modifications.length > 0 && (
          <>
            {(item as ItemOut).modifications.length > 1 && (
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
              {(item as ItemOut).modifications.map((mod) => (
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

      <ItemHistoryView key={String(selectedMod) + String(period) + String(aggregation)} />
    </div>
  );

  return (
    <div className="item-page">
      <div className="item-header">
        <Title level={2} className="item-title">{item?.name ?? ''}</Title>
        {(item as ItemOut).modifications && (item as ItemOut).modifications.length > 0 && (
          <>
            {(item as ItemOut).modifications.length > 1 && (
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
              {(item as ItemOut).modifications.map((mod) => (
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

      {/* Дублирующийся старый return удалён, теперь используется только ItemHistoryView с isRareAdena/isRareCoin */}
    </div>
  );
}
