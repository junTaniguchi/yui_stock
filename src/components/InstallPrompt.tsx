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
  const [isInstalling, setIsInstalling] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

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
      console.log('beforeinstallprompt イベント発火');
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
      
      // 前回拒否してから24時間経過しているかチェック
      const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      if (!lastDismissed || now - parseInt(lastDismissed) > oneDayMs) {
        // 少し遅延してプロンプトを表示（UXの向上）
        setTimeout(() => {
          console.log('PWAインストールプロンプト表示');
          setShowPrompt(true);
        }, 2000);
      }
    };

    // アプリがインストールされたときのイベント
    const handleAppInstalled = () => {
      console.log('PWAインストール完了');
      setShowPrompt(false);
      setDeferredPrompt(null);
      setCanInstall(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

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
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && !isInstalling) {
      try {
        console.log('インストールボタンクリック - インストール開始');
        setIsInstalling(true);
        
        // Chrome/Androidのインストールプロンプトを表示
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('ユーザーの選択:', outcome);
        
        if (outcome === 'accepted') {
          console.log('インストール承認 - 完了を待機中');
          // インストール完了まで少し待つ
          setTimeout(() => {
            setShowPrompt(false);
            setCanInstall(false);
          }, 1000);
        } else if (outcome === 'dismissed') {
          console.log('インストール拒否 - プロンプト非表示設定');
          localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
          setShowPrompt(false);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error('インストールプロンプトエラー:', error);
        setShowPrompt(false);
      } finally {
        setIsInstalling(false);
      }
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
              <p className="instruction-title">📲 ホーム画面に追加する手順:</p>
              <ol>
                <li>画面下部の<strong>共有ボタン</strong> <span className="share-icon">⎋</span> をタップ</li>
                <li>下にスクロールして<strong>「ホーム画面に追加」</strong>を見つけてタップ</li>
                <li>右上の<strong>「追加」</strong>をタップして完了!</li>
              </ol>
              <p style={{fontSize: '0.8rem', color: '#1565c0', marginTop: '0.5rem', textAlign: 'center'}}>
                ✨ アプリのようにサクサク使えるようになります
              </p>
            </div>
          ) : (
            <div className="android-instructions">
              <p>下のボタンを押すと、ホーム画面にアプリを追加できます！</p>
              <p style={{fontSize: '0.8rem', color: '#4caf50', marginTop: '0.5rem'}}>
                ✨ ブラウザなしで直接開けるようになります
              </p>
            </div>
          )}
        </div>

        <div className="install-prompt-actions">
          {!isIOS && deferredPrompt && (
            <button 
              className="install-btn primary"
              onClick={handleInstallClick}
              disabled={isInstalling}
            >
              {isInstalling ? '📱 インストール中...' : '📱 ホーム画面に追加'}
            </button>
          )}
          <button 
            className="install-btn secondary"
            onClick={handleDismiss}
            disabled={isInstalling}
          >
            今はしない
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;