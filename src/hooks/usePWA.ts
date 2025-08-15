import { useState, useEffect } from 'react';

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

export const usePWA = () => {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isIOS: false,
    platform: 'unknown'
  });

  useEffect(() => {
    const detectPlatform = (): 'ios' | 'android' | 'desktop' | 'unknown' => {
      const userAgent = navigator.userAgent;
      
      if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
      if (/Android/.test(userAgent)) return 'android';
      if (/Windows|Mac|Linux/.test(userAgent)) return 'desktop';
      return 'unknown';
    };

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const platform = detectPlatform();

    // PWAとしてインストール済みか判定
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    // インストール済み判定
    const isInstalled = isStandalone || 
      localStorage.getItem('pwa-installed') === 'true';

    setPwaStatus({
      isInstallable: false, // beforeinstallpromptで更新
      isInstalled,
      isStandalone,
      isIOS,
      platform
    });

    // インストール可能イベントのリスナー
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaStatus(prev => ({
        ...prev,
        isInstallable: true
      }));
    };

    // インストール完了イベントのリスナー
    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setPwaStatus(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // display-modeの変更を監視
    const standaloneMedia = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setPwaStatus(prev => ({
        ...prev,
        isStandalone: e.matches
      }));
    };

    if (standaloneMedia.addEventListener) {
      standaloneMedia.addEventListener('change', handleDisplayModeChange);
    } else {
      // Safari用のfallback
      standaloneMedia.addListener(handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      
      if (standaloneMedia.removeEventListener) {
        standaloneMedia.removeEventListener('change', handleDisplayModeChange);
      } else {
        standaloneMedia.removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  return pwaStatus;
};

// PWAの状態をCSSクラスとして適用するhook
export const usePWAStyles = () => {
  const pwaStatus = usePWA();

  useEffect(() => {
    const body = document.body;
    
    // 既存のPWAクラスを削除
    body.classList.remove('pwa-standalone', 'pwa-browser', 'pwa-ios', 'pwa-android');

    // 現在の状態に応じてクラスを追加
    if (pwaStatus.isStandalone) {
      body.classList.add('pwa-standalone');
    } else {
      body.classList.add('pwa-browser');
    }

    if (pwaStatus.isIOS) {
      body.classList.add('pwa-ios');
    }

    if (pwaStatus.platform === 'android') {
      body.classList.add('pwa-android');
    }

    return () => {
      body.classList.remove('pwa-standalone', 'pwa-browser', 'pwa-ios', 'pwa-android');
    };
  }, [pwaStatus]);

  return pwaStatus;
};