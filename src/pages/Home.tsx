import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { fetchVolatileItems } from '../services/items';
import { fetchCategories } from '../services/caterogies';
import type { CategoryOut  } from '../types/category';
import type { ItemActivity } from '../types/item';
import '../styles/pages/Home.css';
import Title from 'antd/es/typography/Title';
import ItemTable from '../components/ItemTable';

const { Option } = Select;

export default function Home() {
  const [items, setItems] = useState<ItemActivity[]>([]);
  const [categories, setCategories] = useState<CategoryOut[]>([]);
  const [category, setCategory] = useState<CategoryOut>();

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    fetchVolatileItems(category?.id).then(setItems);
  }, [category]);

  const handleCategoryChange = (value?: string) => {
    setCategory(categories.find(cat => cat.name === value));
  };

  return (
    <div className="home-page">
      <div className="table-header">
        <Title level={3} className="table-title">ТОП предметы</Title>
        <Select
          placeholder="Категория"
          value={category?.name}
          onChange={(value) => handleCategoryChange(value || undefined)}
          allowClear
          className="table-category-select"
        >
          <Option value="">Все категории</Option>
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.name}>{cat.name}</Option>
          ))}
        </Select>
      </div>

      <ItemTable items={items} />
    </div>
  );
}
