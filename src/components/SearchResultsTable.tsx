import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ItemOut } from '../types/item';

interface Props {
  items: ItemOut[];
  loading?: boolean;
}

export default function SearchResultsTable({ items, loading = false }: Props) {
  const navigate = useNavigate();

  return (
    <Table
      dataSource={items}
      rowKey="id"
      loading={loading}
      onRow={(record) => ({
        onClick: () => navigate(`/items/${record.id}`),
        style: { cursor: 'pointer' },
      })}
      columns={[
        { 
          title: 'Название', 
          dataIndex: 'name', 
          key: 'name',
          ellipsis: true,
        },
        { 
          title: 'Категория', 
          dataIndex: ['category', 'name'], 
          key: 'category',
          width: 200,
        },
      ]}
      pagination={false}
    />
  );
}