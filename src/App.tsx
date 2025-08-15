import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InstallPrompt from './components/InstallPrompt';
import { usePWAStyles } from './hooks/usePWA';
import './App.css';

function AppContent() {
  const { currentUser, loading } = useAuth();
  usePWAStyles(); // PWAスタイルを適用

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentUser ? <Dashboard /> : <Login />}
      {/* PWAインストールプロンプトを表示（インストール済みの場合は表示されない） */}
      <InstallPrompt />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
