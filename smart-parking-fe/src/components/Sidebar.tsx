import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faMoneyBillWave, faClipboardList, faArrowRightFromBracket, faArrowRightToBracket, faChartSimple, faUser, faDoorOpen, faShieldHalved, faTicket, faSquareParking } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const path = location.pathname;

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [path]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FontAwesomeIcon icon={faChartSimple} className="text-orange-500" />, always: true },
    { path: '/masuk', label: 'Parkir Masuk', icon: <FontAwesomeIcon icon={faArrowRightToBracket} className="text-green-500" />, always: true },
    { path: '/keluar', label: 'Parkir Keluar', icon: <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-red-500" />, always: true },
    { path: '/aktif', label: 'Kendaraan Aktif', icon: <FontAwesomeIcon icon={faCarSide} className="text-blue-500" />, always: true },
    { path: '/kapasitas', label: 'Kapasitas', icon: <FontAwesomeIcon icon={faSquareParking} className="text-indigo-500" />, always: true },
    { path: '/riwayat', label: 'Riwayat Parkir', icon: <FontAwesomeIcon icon={faClipboardList} className="text-purple-500" />, always: true },
    { path: '/report', label: 'Report Keuangan', icon: <FontAwesomeIcon icon={faMoneyBillWave} className="text-teal-500" />, always: false, adminOnly: true },
  ];

  const filteredMenu = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'ADMIN') return false;
    return true;
  });

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 pb-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl backdrop-blur-sm">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <p className="text-white font-bold text-base">{user?.nama || 'User'}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium text-white/90 backdrop-blur-sm">
                {user?.role === 'ADMIN' ? <><FontAwesomeIcon icon={faShieldHalved} /> Admin</> : <><FontAwesomeIcon icon={faTicket} /> Petugas</>}
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="py-3 px-3 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu</p>
          <nav className="space-y-1">
            {filteredMenu.map((item) => {
              const isActive = path === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-50 text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`text-lg flex-shrink-0 w-6 text-center ${isActive ? '' : 'opacity-80 grayscale-[30%]'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <span className="text-lg"><FontAwesomeIcon icon={faDoorOpen} /></span>
            <span>Keluar / Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
