import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppContext';

export default function MainLayout() {
  const { theme } = useAppContext();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <div className={`pointer-events-none fixed inset-x-0 top-0 h-36 bg-gradient-to-b ${isLight ? 'from-sky-200/70 to-transparent' : 'from-sky-500/10 to-transparent'}`} />
      <Navbar />
      <main className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
