import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">🌸 {title}</h1>
          <div className="user-info">
            <span className="user-name">
              {currentUser?.displayName || 'ユーザー'}さん
            </span>
            <button onClick={handleLogout} className="logout-btn">
              ログアウト
            </button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;