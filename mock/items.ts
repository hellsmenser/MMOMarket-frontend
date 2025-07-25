import { MockMethod } from 'vite-plugin-mock';

function randomCurrency() {
  return Math.random() > 0.5 ? 'adena' : 'coin';
}

export default [
  {
    url: '/api/volatile-items',
    method: 'get',
    response: ({ query }) => {
      const categories = [
        { id: 1, name: 'Оружие' },
        { id: 2, name: 'Доспехи' },
        { id: 3, name: 'Бижутерия' },
      ];
      function getCategoryByName(name: string) {
        return categories.find(c => c.name === name) || categories[0];
      }
      function randomActivity() {
        return Math.floor(Math.random() * 100) + 1;
      }
      const items = [
        {
          id: 1,
          name: 'Кристалл Души Шилен - Ур. 8',
          category: getCategoryByName('Оружие'),
          price: 325000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 2,
          name: 'Кристалл Души Эйнхасад - Ур. 5',
          category: getCategoryByName('Оружие'),
          price: 210000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 3,
          name: 'Кристалл Души Терси - Ур. 3',
          category: getCategoryByName('Доспехи'),
          price: 97000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 4,
          name: 'Кристалл Души Гиганта - Ур. 2',
          category: getCategoryByName('Доспехи'),
          price: 88000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 5,
          name: 'Кристалл Души Фреи - Ур. 4',
          category: getCategoryByName('Бижутерия'),
          price: 120000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 6,
          name: 'Кристалл Души Орфена - Ур. 1',
          category: getCategoryByName('Бижутерия'),
          price: 45000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 7,
          name: 'Кристалл Души Закена - Ур. 2',
          category: getCategoryByName('Бижутерия'),
          price: 67000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 8,
          name: 'Кристалл Души Антараса - Ур. 6',
          category: getCategoryByName('Оружие'),
          price: 410000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 9,
          name: 'Кристалл Души Баюма - Ур. 3',
          category: getCategoryByName('Бижутерия'),
          price: 99000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 10,
          name: 'Кристалл Души Лилит - Ур. 2',
          category: getCategoryByName('Доспехи'),
          price: 78000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
        {
          id: 11,
          name: 'Кристалл Души Фафуриона - Ур. 7',
          category: getCategoryByName('Оружие'),
          price: 390000000,
          currency: randomCurrency(),
          activity: randomActivity(),
        },
      ];

      return items.filter((i) => {
        const cat = query.category;
        const search = query.search?.toLowerCase();
        return (!cat || i.category.name === cat) &&
               (!search || i.name.toLowerCase().includes(search));
      });
    },
  },
{
  url: '/api/search',
  method: 'get',
  response: ({ query }) => {
    const allItems = [
      {
        id: 1,
        name: 'Кристалл Души Шилен - Ур. 8',
        category: 'Оружие',
        price: 325000000,
        price_change_1d: +4.5,
        price_change_7d: +10.2,
        volatility: 14.1,
      },
      {
        id: 2,
        name: 'Кристалл Души Терси - Ур. 3',
        category: 'Доспехи',
        price: 96000000,
        price_change_1d: -2.1,
        price_change_7d: -5.4,
        volatility: 7.6,
      },
      {
        id: 3,
        name: 'Кристалл Души Орфена - Ур. 1',
        category: 'Бижутерия',
        price: 45000000,
        price_change_1d: -0.9,
        price_change_7d: -2.3,
        volatility: 5.7,
      },
      {
        id: 4,
        name: 'Кристалл Души Антараса - Ур. 6',
        category: 'Оружие',
        price: 410000000,
        price_change_1d: 5.8,
        price_change_7d: 12.4,
        volatility: 15.6,
      },
      {
        id: 5,
        name: 'Кристалл Души Лилит - Ур. 2',
        category: 'Доспехи',
        price: 78000000,
        price_change_1d: -1.2,
        price_change_7d: -3.5,
        volatility: 4.9,
      }
    ];

    const q = (query.q || '').toLowerCase();
    return allItems.filter(item => item.name.toLowerCase().includes(q));
  },
},
{
  url: '/api/items/1/history',
  method: 'get',
  response: ({ query, params }) => {
    return {
      date: [...Array(14)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        return date.toISOString().slice(0, 10);
      }),
      adena: [300,310,305,320,null,325,null,345,335,360,370,365,375,380],
      coin:  [10,10.1,10.2,10.3,10.4,10.3,10.5,10.6,10.4,10.8,11,10.9,11.1,11.2]
    };
  },
},
{
  url: '/api/items/2/history',
  method: 'get',
  response: () => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate());
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    return {
      date: [
        twoWeeksAgo.toISOString().slice(0, 10),
        weekAgo.toISOString().slice(0, 10),
      ],
      adena: [null, null],
      coin: [6.7, 7.1],
    };
  },
},
{
  url: '/api/items/:id',
  method: 'get',
  response: ({ params, query }) => {
    const items = [
      {
        id: 1,
        name: 'Кристалл Души Шилен - Ур. 8',
        category: 'Оружие',
        price: 325000000,
        price_change_1d: 4.5,
        price_change_7d: 10.2,
        volatility: 14.1,
        currency: 'adena',
        modification: [0, 3, 5],
      },
      {
        id: 2,
        name: 'Кристалл Души Эйнхасад - Ур. 5',
        category: 'Оружие',
        price: 210000000,
        price_change_1d: 2.3,
        price_change_7d: 6.7,
        volatility: 9.8,
        currency: 'coin',
      },
      {
        id: 3,
        name: 'Кристалл Души Терси - Ур. 3',
        category: 'Доспехи',
        price: 97000000,
        price_change_1d: -1.7,
        price_change_7d: -4.2,
        volatility: 8.1,
        currency: 'coin',
      },
      {
        id: 4,
        name: 'Кристалл Души Гиганта - Ур. 2',
        category: 'Доспехи',
        price: 88000000,
        price_change_1d: 0.5,
        price_change_7d: 1.2,
        volatility: 3.4,
        currency: 'coin',
      },
      {
        id: 5,
        name: 'Кристалл Души Фреи - Ур. 4',
        category: 'Бижутерия',
        price: 120000000,
        price_change_1d: 3.2,
        price_change_7d: 7.1,
        volatility: 11.2,
        currency: 'coin',
      },
      {
        id: 6,
        name: 'Кристалл Души Орфена - Ур. 1',
        category: 'Бижутерия',
        price: 45000000,
        price_change_1d: -0.9,
        price_change_7d: -2.3,
        volatility: 5.7,
        currency: 'adena',
      },
      {
        id: 7,
        name: 'Кристалл Души Закена - Ур. 2',
        category: 'Бижутерия',
        price: 67000000,
        price_change_1d: 1.1,
        price_change_7d: 2.8,
        volatility: 6.3,
        currency: 'adena',
      },
      {
        id: 8,
        name: 'Кристалл Души Антараса - Ур. 6',
        category: 'Оружие',
        price: 410000000,
        price_change_1d: 5.8,
        price_change_7d: 12.4,
        volatility: 15.6,
        currency: 'coin',
      },
      {
        id: 9,
        name: 'Кристалл Души Баюма - Ур. 3',
        category: 'Бижутерия',
        price: 99000000,
        price_change_1d: 0.0,
        price_change_7d: 0.0,
        volatility: 0.0,
        currency: 'adena',
      },
      {
        id: 10,
        name: 'Кристалл Души Лилит - Ур. 2',
        category: 'Доспехи',
        price: 78000000,
        price_change_1d: -1.2,
        price_change_7d: -3.5,
        volatility: 4.9,
        currency: 'coin',
      },
      {
        id: 11,
        name: 'Кристалл Души Фафуриона - Ур. 7',
        category: 'Оружие',
        price: 390000000,
        price_change_1d: 6.3,
        price_change_7d: 13.7,
        volatility: 16.2,
        currency: 'coin',
      },
    ];
    const id = Number(params?.id || query?.id);
    const item = items.find(i => i.id === id);
    if (!item) {
      return { status: 404, message: 'Not found' };
    }
    return item;
  },
}

] as MockMethod[];
