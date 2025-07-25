import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ItemPage from './pages/ItemPage';
import MainLayout from './layouts/MainLayouts';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/items/:id" element={<ItemPage />} />
      </Route>
    </Routes>
  );
}

export default App;