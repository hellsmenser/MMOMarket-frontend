import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ItemPage from './pages/ItemPage';
import SearchPage from './pages/SearchPage';
import MainLayout from './layouts/MainLayouts';
import Auth from './pages/Auth';
import { ProtectedRoute } from './utils/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/items/:id" element={<ItemPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
  );
}

export default App;