import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

const OverviewPage = lazy(() => import('./pages/OverviewPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const IncidentsPage = lazy(() => import('./pages/IncidentsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const CitizenReportsPage = lazy(() => import('./pages/CitizenReportsPage'));
const ResponseCenterPage = lazy(() => import('./pages/ResponseCenterPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">Loading dashboard…</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/citizen-reports" element={<CitizenReportsPage />} />
              <Route path="/response-center" element={<ResponseCenterPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}
