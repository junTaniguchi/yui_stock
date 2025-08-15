import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログインに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🌸 ゆいちゃんの</h1>
          <h2>保育園準備アプリ</h2>
          <p>毎日の持ち物管理をお手伝い 🎒</p>
        </div>
        
        <div className="login-illustration">
          <div className="illustration">👶 🏫 👗 🧸</div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="google-login-btn"
        >
          <span className="google-icon">🔐</span>
          Googleでログイン
        </button>
        
        <p className="login-footer">
          安全にデータを保護します 💕
        </p>
      </div>
    </div>
  );
};

export default Login;