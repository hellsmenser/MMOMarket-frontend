import { Outlet } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <HeaderBar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}
