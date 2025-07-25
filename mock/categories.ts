import { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/categories',
    method: 'get',
    response: () => [
      { id: 1, name: 'Оружие' },
      { id: 2, name: 'Доспехи' },
      { id: 3, name: 'Материалы' },
    ],
  },
] as MockMethod[];
