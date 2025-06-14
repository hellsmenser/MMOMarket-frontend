import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import type { CategoryOut } from '../types/category';
import { fetchCategories } from '../services/items';

interface Props {
  onSearch: (value: string) => void;
  onCategoryChange: (category?: string) => void;
}

const { Option } = Select;

export default function HeaderBar({ onSearch, onCategoryChange }: Props) {
  const [categories, setCategories] = useState<CategoryOut[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Select
        placeholder="Категория"
        style={{ width: 200 }}
        onChange={onCategoryChange}
        allowClear
      >
        {categories.map((cat) => (
          <Option key={cat.id} value={cat.name}>
            {cat.name}
          </Option>
        ))}
      </Select>
      <Input.Search
        placeholder="Поиск по названию"
        onSearch={onSearch}
        allowClear
        style={{ width: 300 }}
      />
    </div>
  );
}
