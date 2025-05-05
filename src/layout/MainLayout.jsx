import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="p-4 container mx-auto">
        <Outlet /> {/* aquí se inyectan las páginas */}
      </main>
    </>
  );
}
