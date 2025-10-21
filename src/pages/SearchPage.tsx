import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Pagination, Spin, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { searchItems } from '../services/items';
import type { ItemOut } from '../types/item';
import SearchResultsTable from '../components/SearchResultsTable';
import '../styles/pages/SearchPage.css';

const { Title } = Typography;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [inputValue, setInputValue] = useState('');
  
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 20;

  useEffect(() => {
    document.title = query ? `Поиск: ${query} - MMO Market` : 'Поиск - MMO Market';
    return () => {
      document.title = 'MMO Market';
    };
  }, [query]);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setItems([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    searchItems(query, currentPage, pageSize)
      .then(response => {
        setItems(response.Items);
        setTotal(response.Total);
      })
      .catch(err => {
        console.error('Search error:', err);
        setItems([]);
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    
    const newParams = new URLSearchParams();
    newParams.set('q', value.trim());
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // Если поле очищено, очищаем результаты
    if (!e.target.value && query) {
      navigate('/search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue);
    }
  };

  return (
    <div className="search-page">
      <div className="search-input-container">
        <Input.Search
          placeholder="Поиск по названию предмета..."
          enterButton={<SearchOutlined />}
          size="large"
          value={inputValue}
          onChange={handleInputChange}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
          allowClear
          onClear={() => {
            setInputValue('');
            if (query) {
              navigate('/search');
            }
          }}
          style={{ maxWidth: 600 }}
        />
      </div>

      {!query ? (
        <div style={{ marginTop: 60 }}>
          <Title level={3} style={{ color: '#888' }}>
            Введите поисковый запрос выше
          </Title>
        </div>
      ) : (
        <>
          <div className="search-results-header">
            <Title level={3} style={{ margin: 0 }}>
              Результаты поиска: "{query}"
            </Title>
            {!loading && (
              <div className="search-results-count">
                Найдено {total} {total === 1 ? 'результат' : total < 5 ? 'результата' : 'результатов'}
              </div>
            )}
          </div>

          {loading ? (
            <div className="search-loading">
              <Spin size="large" />
            </div>
          ) : items.length === 0 ? (
            <div className="search-no-results">
              По запросу "{query}" ничего не найдено
            </div>
          ) : (
            <>
              <SearchResultsTable 
                items={items} 
                loading={loading}
              />
              
              {total > pageSize && (
                <div className="search-pagination">
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} из ${total} результатов`
                    }
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}