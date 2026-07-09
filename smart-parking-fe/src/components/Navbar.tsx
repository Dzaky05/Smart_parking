import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, showBack = false }) => {
  const [time, setTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const formatDate = (d: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              {showBack ? (
                <Link to="/" className="flex items-center bg-brand-orange hover:bg-orange-600 text-white transition-colors mr-4 px-4 py-2 rounded-lg font-medium shadow-sm">
                  <span className="text-xl mr-2">←</span> 
                  <span className="hidden sm:inline">Kembali ke Dashboard</span>
                </Link>
              ) : (
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-orange-600 transition-colors">
                    P
                  </div>
                  <h1 className="font-bold text-xl text-gray-900 tracking-tight">
                    {title || (
                      <>Smart<span className="text-brand-orange">Parking</span></>
                    )}
                  </h1>
                </Link>
              )}
              
              {title && showBack && (
                <h1 className="font-bold text-xl text-gray-900 ml-2">{title}</h1>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Clock */}
              <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <span className="mr-2"><FontAwesomeIcon icon={faClock} /></span>
                <span className="mr-2 hidden sm:inline">{formatDate(time)}</span>
                <span className="font-bold text-brand-orange">{formatTime(time)}</span>
              </div>

              {/* Hamburger Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-brand-orange transition-all"
                title="Menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
