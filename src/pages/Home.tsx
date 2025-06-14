import { useEffect, useState } from 'react';
import { Layout, Table } from 'antd';
import { fetchVolatileItems } from '../services/items';
import type { ItemOut } from '../types/item';
import HeaderBar from '../components/HeaderBar';

const { Header, Content } = Layout;

export default function Home() {
  const [items, setItems] = useState<ItemOut[]>([]);
  const [category, setCategory] = useState<string>();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchVolatileItems(category, search).then(setItems);
  }, [category, search]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 20px' }}>
        <HeaderBar
          onCategoryChange={setCategory}
          onSearch={setSearch}
        />
      </Header>
      <Content style={{ padding: 24 }}>
        <Table
          dataSource={items}
          rowKey="id"
          columns={[
            { title: 'Название', dataIndex: 'name', key: 'name' },
            { title: 'Категория', dataIndex: 'category', key: 'category' },
            { title: 'Цена', dataIndex: 'price', key: 'price' },
            {
              title: 'Изм. 24ч',
              dataIndex: 'price_change_1d',
              render: (v: number) => `${v > 0 ? '+' : ''}${v}%`,
            },
            {
              title: 'Изм. 7д',
              dataIndex: 'price_change_7d',
              render: (v: number) => `${v > 0 ? '+' : ''}${v}%`,
            },
            {
              title: 'Волатильность',
              dataIndex: 'volatility',
              sorter: (a, b) => a.volatility - b.volatility,
            },
          ]}
        />
      </Content>
    </Layout>
  );
}
