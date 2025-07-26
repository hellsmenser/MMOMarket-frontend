import { AutoComplete } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ItemOut } from '../types/item';
import { searchItems, fetchCoinPrice } from '../services/items';
import { formatAutocompleteLabel } from '../utils/autocomplite';

import '../styles/components/HeaderBar.css';

type ExtendedOption = {
  value: string;
  label: React.ReactNode;
  item?: ItemOut;
  isShowAll?: boolean;
};

export default function HeaderBar() {
  const [searchOptions, setSearchOptions] = useState<ExtendedOption[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [coinPrice, setCoinPrice] = useState<number | null>(null);
  const fullOptionList = useRef<ExtendedOption[]>([]);

  const navigate = useNavigate();
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Получаем цену монеты при маунте
  useEffect(() => {
    fetchCoinPrice()
      .then(data => {
        // Если API возвращает объект с price
        console.log('Coin price data:', data);
        if (typeof data === 'object' && data !== null && 'coin_price' in data) {
          setCoinPrice(Number(data.coin_price));
        } else {
          setCoinPrice(Number(data));
        }
      })
      .catch(() => setCoinPrice(null));
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = window.setTimeout(async () => {
      if (!value) {
        setSearchOptions([]);
        return;
      }

      const results = await searchItems(value, 1, 5);

      const fullOptions: ExtendedOption[] = results.map((item) => ({
        value: item.name,
        item,
        label: formatAutocompleteLabel(item),
      }));

      if (results.length === 5) {
        fullOptions.push({
          value: '',
          isShowAll: true,
          label: (
            <div style={{ textAlign: 'center', color: '#00ff8f' }}>
              Показать все результаты
            </div>
          ),
        });
      }

      fullOptionList.current = fullOptions;
      setSearchOptions(fullOptions.map(({ value, label }) => ({ value, label })));
    }, 300);
  };

  const handleSelect = (value: string) => {
    const selected = fullOptionList.current.find((opt) => opt.value === value);
    if (!selected) return;

    if (selected.isShowAll) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    } else if (selected.item) {
      navigate(`/items/${selected.item.id}`);
    }
  };

  return (
    <div className="header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, minHeight: 48, minWidth: 48 }}>
        <img src="/logo.svg" alt="MMO Market Logo" style={{ height: 48, width: 'auto', display: 'block', objectFit: 'contain' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontSize: 15, color: '#00ff8f', fontWeight: 500, display: 'inline-block', minWidth: '210px' }}>
          Цена монеты: <span style={{ color: '#fff', fontWeight: 600, letterSpacing: '2px', display: 'inline-block', minWidth: '110px', textAlign: 'right' }}>
            {coinPrice !== null ? coinPrice.toLocaleString() : <>&lt;нет данных&gt;</>}
          </span>
        </span>
        <div className="header-controls">
          <AutoComplete
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Поиск по названию"
            className="search-input"
            allowClear
          >
            {searchOptions.map((option) => (
              <AutoComplete.Option key={option.value} value={option.value}>
                {option.label}
              </AutoComplete.Option>
            ))}
          </AutoComplete>
        </div>
      </div>
    </div>
  );
}
