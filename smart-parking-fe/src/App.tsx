import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ParkingIn from './pages/ParkingIn';
import ParkingOut from './pages/ParkingOut';
import History from './pages/History';
import FinancialReport from './pages/FinancialReport';
import ActiveParking from './pages/ActiveParking';
import KapasitasPage from './pages/Kapasitas';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/masuk" element={
            <ProtectedRoute>
              <ParkingIn />
            </ProtectedRoute>
          } />
          <Route path="/keluar" element={
            <ProtectedRoute>
              <ParkingOut />
            </ProtectedRoute>
          } />
          <Route path="/riwayat" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/aktif" element={
            <ProtectedRoute>
              <ActiveParking />
            </ProtectedRoute>
          } />
          <Route path="/kapasitas" element={
            <ProtectedRoute>
              <KapasitasPage />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute requiredRole="ADMIN">
              <FinancialReport />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
