import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // iOS判定
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // PWAとしてインストール済みか判定
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    // Chromeのインストールプロンプトイベント
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // 前回拒否してから24時間経過しているかチェック
      const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      if (!lastDismissed || now - parseInt(lastDismissed) > oneDayMs) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOSの場合、手動でプロンプトを表示
    if (ios && !standalone) {
      const lastDismissed = localStorage.getItem('ios-install-dismissed');
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      if (!lastDismissed || now - parseInt(lastDismissed) > oneDayMs) {
        setTimeout(() => setShowPrompt(true), 3000); // 3秒後に表示
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'dismissed') {
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    if (isIOS) {
      localStorage.setItem('ios-install-dismissed', Date.now().toString());
    } else {
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }
    setShowPrompt(false);
  };

  // PWAとしてインストール済みの場合は何も表示しない
  if (isStandalone) {
    return null;
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <div className="install-prompt-header">
          <span className="app-icon">🌸</span>
          <h3>アプリをインストール</h3>
        </div>
        
        <div className="install-prompt-body">
          <p>ホーム画面にアプリを追加して、より便利にご利用いただけます</p>
          
          <div className="install-benefits">
            <div className="benefit">
              <span className="benefit-icon">⚡</span>
              <span>高速起動</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">📱</span>
              <span>アプリのような体験</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">🔔</span>
              <span>通知対応</span>
            </div>
          </div>

          {isIOS ? (
            <div className="ios-instructions">
              <p className="instruction-title">📲 インストール方法（iPhone/iPad）:</p>
              <ol>
                <li>画面下部の<strong>共有ボタン</strong> <span className="share-icon">⎋</span> をタップ</li>
                <li><strong>「ホーム画面に追加」</strong>をタップ</li>
                <li><strong>「追加」</strong>をタップして完了</li>
              </ol>
            </div>
          ) : (
            <div className="android-instructions">
              <p>下のボタンをタップしてインストールできます</p>
            </div>
          )}
        </div>

        <div className="install-prompt-actions">
          {!isIOS && deferredPrompt && (
            <button 
              className="install-btn primary"
              onClick={handleInstallClick}
            >
              インストール
            </button>
          )}
          <button 
            className="install-btn secondary"
            onClick={handleDismiss}
          >
            今はしない
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;