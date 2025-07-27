
import { Outlet } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import '../styles/layout.css';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <HeaderBar />
      <div className="page-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
