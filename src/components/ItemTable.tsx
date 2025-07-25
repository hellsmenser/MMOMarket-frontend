import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ItemActivity } from '../types/item';

interface Props {
  items: ItemActivity[];
}

export default function ItemTable({ items }: Props) {
  const navigate = useNavigate();

  return (
    <Table
      dataSource={items}
      rowKey="id"
      onRow={(record) => ({
        onClick: () => navigate(`/items/${record.id}`),
        style: { cursor: 'pointer' },
      })}
      columns={[
        { title: 'Название', dataIndex: 'name', key: 'name' },
        { title: 'Категория', dataIndex: ['category', 'name'], key: 'category' },
        {
          title: 'Цена(средняя за 7 дней)',
          dataIndex: 'price',
          key: 'price',
          render: (v: number) => v.toLocaleString('ru-RU'),
        },
        {
          title: 'Валюта',
          dataIndex: 'currency',
          key: 'currency',
          render: (v: string | undefined) => {
              if (v === 'adena') return 'Адена';
              if (v === 'coin') return 'Золотая Монета Эйнхасад';
              return 'N/A';
          },
        },
        {
          title: 'Активность(7дн)',
          dataIndex: 'activity',
          sorter: (a, b) => a.activity - b.activity,
        },
      ]}
      pagination={false}
    />
  );
}
