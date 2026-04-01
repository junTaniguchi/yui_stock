import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { StockCheck, DailyNeed, WeeklyNeed, WeeklyItemStatus, NurseryStock } from '../types';
import { clothingItems, weeklyItems, dailyItems } from '../config/items';
import Layout from './Layout';
import MorningCheck from './MorningCheck';
import EveningCheck from './EveningCheck';
import TomorrowNeeds from './TomorrowNeeds';
import WeeklyItems from './WeeklyItems';
import NurseryStockView from './NurseryStockView';
import InventorySettings from './InventorySettings';
import { useItemSettings } from '../contexts/ItemSettingsContext';
import './Dashboard.css';

type ViewType = 'home' | 'morning' | 'evening' | 'settings';

const toSafeDate = (value: any, fallbackDate?: string): Date => {
  if (value) {
    if (value instanceof Date) {
      return value;
    }
    if (typeof value.toDate === 'function') {
      const converted = value.toDate();
      if (!Number.isNaN(converted.getTime())) {
        return converted;
      }
    }
    if (typeof value.seconds === 'number') {
      return new Date(value.seconds * 1000);
    }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  if (fallbackDate) {
    const parsedFallback = new Date(`${fallbackDate}T00:00:00`);
    if (!Number.isNaN(parsedFallback.getTime())) {
      return parsedFallback;
    }
  }

  return new Date();
};

const normalizeStockCheckData = (raw: any): StockCheck => {
  const timestamp = toSafeDate(raw?.timestamp, raw?.date);
  return {
    ...raw,
    timestamp,
  };
};

const getTimestampMillis = (check: StockCheck): number => {
  return check.timestamp ? check.timestamp.getTime() : new Date(`${check.date}T00:00:00`).getTime();
};

const formatCheckTimestamp = (check: StockCheck | null): string | null => {
  if (!check || !check.timestamp) {
    return null;
  }

  try {
    const formatter = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return formatter.format(check.timestamp);
  } catch (error) {
    console.error('タイムスタンプのフォーマットに失敗しました:', error);
    return null;
  }
};

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [latestMorningCheck, setLatestMorningCheck] = useState<StockCheck | null>(null);
  const [latestEveningCheck, setLatestEveningCheck] = useState<StockCheck | null>(null);
  const [yesterdayEveningCheck, setYesterdayEveningCheck] = useState<StockCheck | null>(null);
  const [tomorrowNeeds, setTomorrowNeeds] = useState<DailyNeed[]>([]);
  const [weeklyNeeds, setWeeklyNeeds] = useState<WeeklyNeed[]>([]);
  const [weeklyItemStatuses, setWeeklyItemStatuses] = useState<Record<string, WeeklyItemStatus>>({});
  const [nurseryStocks, setNurseryStocks] = useState<NurseryStock[]>([]);
  const { requiredCounts, loading: settingsLoading } = useItemSettings();

  // 日本時闳での日付を取得
  const getJapanDate = (daysOffset: number = 0) => {
    const now = new Date();
    const japanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    japanTime.setDate(japanTime.getDate() + daysOffset);
    return japanTime.toISOString().split('T')[0];
  };
  const today = getJapanDate();
  const yesterday = getJapanDate(-1);

  useEffect(() => {
    if (currentUser) {
      loadLatestStockData();
      loadWeeklyItemStatuses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (settingsLoading) return;
    calculateTomorrowNeeds();
    calculateWeeklyNeeds();
    calculateNurseryStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestMorningCheck, latestEveningCheck, yesterdayEveningCheck, weeklyItemStatuses, requiredCounts, settingsLoading]);

  const getRequiredCount = useCallback((itemId: string): number => {
    if (requiredCounts[itemId] !== undefined) {
      return requiredCounts[itemId];
    }
    const item = clothingItems.find(i => i.id === itemId);
    return item ? item.required : 0;
  }, [requiredCounts]);

  const getGroupRequiredTotal = useCallback((groupId: string): number => {
    const groupItems = clothingItems.filter(item => item.group === groupId);
    if (groupItems.length === 0) {
      return 0;
    }
    return groupItems.reduce((total, item) => total + getRequiredCount(item.id), 0);
  }, [getRequiredCount]);

  const loadLatestStockData = async () => {
    console.log('最新在庫データ読み込み開始 - currentUser:', currentUser);
    if (!currentUser) {
      console.log('currentUserなし - データ読み込みスキップ');
      return;
    }

    try {
      // 朝の在庫確認データを全て取得してクライアントサイドでソート
      const morningQuery = query(
        collection(db, 'stockChecks'),
        where('type', '==', 'morning')
      );

      const morningSnapshot = await getDocs(morningQuery);

      const normalizedMorningDocs = morningSnapshot.docs.map(doc => {
        const data = normalizeStockCheckData(doc.data());
        return { id: doc.id, ...data };
      });

      // タイムスタンプの降順でソートして最新を取得
      const sortedMorningDocs = normalizedMorningDocs.sort((a, b) => getTimestampMillis(b) - getTimestampMillis(a));
      console.log('朝データ全体クエリ結果:', morningSnapshot.size, '件');
      console.log('ソート後の最新朝データ数:', sortedMorningDocs.length, '件');

      if (sortedMorningDocs.length > 0) {
        const morningData = sortedMorningDocs[0];
        console.log('最新の朝データ:', morningData);
        setLatestMorningCheck(morningData);

        // 最新朝在庫日付以降の最新夕方データを取得
        const eveningQuery = query(
          collection(db, 'stockChecks'),
          where('type', '==', 'evening')
        );

        const eveningSnapshot = await getDocs(eveningQuery);
        console.log('夕方データ全体クエリ結果:', eveningSnapshot.size, '件');

        const normalizedEveningDocs = eveningSnapshot.docs.map(doc => {
          const data = normalizeStockCheckData(doc.data());
          return { id: doc.id, ...data };
        });

        const morningMillis = getTimestampMillis(morningData);

        // 最新朝在庫以降の夕方データをタイムスタンプ降順でソート
        const futureEveningDocs = normalizedEveningDocs
          .filter(doc => getTimestampMillis(doc) >= morningMillis)
          .sort((a, b) => getTimestampMillis(b) - getTimestampMillis(a));

        console.log(`${morningData.date}以降の夕方データ数:`, futureEveningDocs.length, '件');

        if (futureEveningDocs.length > 0) {
          const latestEveningData = futureEveningDocs[0];
          console.log('最新夕方データ:', latestEveningData);
          setLatestEveningCheck(latestEveningData);
        } else {
          console.log('対象期間の夕方データなし');
          setLatestEveningCheck(null);
        }
      } else {
        console.log('朝の在庫データが見つかりません');
        setLatestMorningCheck(null);
        setLatestEveningCheck(null);
      }

      // 昨日の夕方データも取得（翌日計算用）
      const yesterdayEveningQuery = query(
        collection(db, 'stockChecks'),
        where('date', '==', yesterday),
        where('type', '==', 'evening'),
        limit(1)
      );

      const yesterdayEveningSnapshot = await getDocs(yesterdayEveningQuery);
      if (!yesterdayEveningSnapshot.empty) {
        const doc = yesterdayEveningSnapshot.docs[0];
        const data = normalizeStockCheckData(doc.data());
        setYesterdayEveningCheck({ id: doc.id, ...data });
      } else {
        setYesterdayEveningCheck(null);
      }

    } catch (error) {
      console.error('データ読み込みエラー:', error);
      console.error('エラー詳細:', {
        code: (error as any).code,
        message: (error as any).message,
        userId: currentUser?.uid
      });
    }
  };

  const loadWeeklyItemStatuses = async () => {
    if (!currentUser) return;

    try {
      // 全ユーザー共有のため、userIdフィルタを除去
      const weeklyQuery = query(
        collection(db, 'stockChecks')
      );

      const querySnapshot = await getDocs(weeklyQuery);
      const statuses: Record<string, WeeklyItemStatus> = {};

      // 各週単位アイテムの状態を初期化
      weeklyItems.forEach(item => {
        statuses[item.id] = {
          itemId: item.id,
          currentStatus: 'at_home' // デフォルトは家にある状態
        };
      });

      // 過去2週間のデータのみをフィルタして処理
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const thresholdMillis = twoWeeksAgo.getTime();

      const normalizedDocs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...normalizeStockCheckData(doc.data()),
      }));

      // データをタイムスタンプでフィルタしてから降順に並べて処理
      const filteredDocs = normalizedDocs
        .filter(doc => getTimestampMillis(doc) >= thresholdMillis)
        .sort((a, b) => getTimestampMillis(b) - getTimestampMillis(a));

      filteredDocs.forEach(data => {
        if (data.weeklyItems) {
          Object.entries(data.weeklyItems).forEach(([itemId, action]) => {
            if (statuses[itemId] && action) {
              if (data.type === 'morning') {
                // 朝に持参した
                statuses[itemId].lastBroughtDate = data.date;
                statuses[itemId].currentStatus = 'at_nursery';
              } else if (data.type === 'evening') {
                // 夕方に持ち帰った
                statuses[itemId].lastTakenDate = data.date;
                statuses[itemId].currentStatus = 'at_home';
              }
            }
          });
        }
      });

      setWeeklyItemStatuses(statuses);
    } catch (error) {
      console.error('週単位アイテム状態読み込みエラー:', error);
    }
  };

  const calculateTomorrowNeeds = () => {
    const needs: DailyNeed[] = [];

    clothingItems.forEach(item => {
      // 日常アイテムのみ対象
      if (item.schedule === 'daily') {
        let morningStock = 0;
        let takenHomeSameDay = 0;

        if (latestMorningCheck) {
          morningStock = latestMorningCheck.items[item.id] || 0;
        }

        if (latestEveningCheck) {
          takenHomeSameDay = latestEveningCheck.items[item.id] || 0;
        }

        // 幼稚園在庫 = 最新朝の在庫 - 同日夕方持ち帰り数
        const nurseryStock = Math.max(0, morningStock - takenHomeSameDay);

        const requiredCount = getRequiredCount(item.id);
        const needToBring = Math.max(0, requiredCount - nurseryStock);

        if (needToBring > 0) {
          needs.push({
            itemId: item.id,
            itemName: item.name,
            needToBring: Math.ceil(needToBring),
            icon: item.icon,
            unit: item.unit,
            isChecked: false,
            group: item.group,
          });
        }
      }
    });

    setTomorrowNeeds(needs);
  };

  const calculateNurseryStocks = () => {
    const stocks: NurseryStock[] = [];

    console.log('幼稚園在庫計算開始（最新ロジック）');
    console.log('最新朝データ:', latestMorningCheck);
    console.log('最新夕方データ:', latestEveningCheck);

    // データ読み込み中はスキップ
    if (!latestMorningCheck) {
      console.log('朝データ未読み込みのため在庫計算スキップ');
      setNurseryStocks([]);
      return;
    }

    clothingItems.forEach(item => {
      if (item.schedule === 'daily' && item.group === 'stock') {
        let morningStock = 0;
        let takenHomeSameDay = 0;

        // 最新の朝の在庫数
        if (latestMorningCheck) {
          morningStock = latestMorningCheck.items[item.id] || 0;
        }

        // 最新朝在庫日付以降の最新夕方の持ち帰り数
        if (latestEveningCheck) {
          takenHomeSameDay = latestEveningCheck.items[item.id] || 0;
        }

        console.log(`${item.name}: 最新朝在庫=${morningStock}, 最新夕方持ち帰り=${takenHomeSameDay}`);
        console.log(`　朝データ日付: ${latestMorningCheck?.date || 'なし'}, 夕方データ日付: ${latestEveningCheck?.date || 'なし'}`);

        // 幼稚園在庫 = 最新朝の在庫 - 最新夕方の持ち帰り数
        const currentStock = Math.max(0, morningStock - takenHomeSameDay);

        stocks.push({
          itemId: item.id,
          itemName: item.name,
          currentStock,
          requiredStock: getRequiredCount(item.id),
          icon: item.icon,
          unit: item.unit,
          group: item.group
        });
      }
    });

    setNurseryStocks(stocks);
  };

  const calculateWeeklyNeeds = () => {
    const needs: WeeklyNeed[] = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayOfWeek = tomorrow.getDay(); // 0=日曜日, 1=月曜日, ..., 5=金曜日

    weeklyItems.forEach(item => {
      const status = weeklyItemStatuses[item.id];
      if (!status) return;

      if (item.schedule === 'weekly_monday') {
        // 週次（月曜日）アイテム: 明日が月曜日で家にある状態なら持参を提案
        if (tomorrowDayOfWeek === 1 && status.currentStatus === 'at_home') {
          needs.push({
            itemId: item.id,
            itemName: item.name,
            dayOfWeek: 'monday',
            action: 'bring',
            description: `明日は月曜日！新しい${item.name}を持参（金曜日まで幼稚園で保管）`,
            icon: item.icon,
            isChecked: false,
          });
        }
        // 幼稚園にある状態で金曜日なら持ち帰りを提案
        else if (status.currentStatus === 'at_nursery' && tomorrowDayOfWeek === 5) {
          needs.push({
            itemId: `${item.id}_return`,
            itemName: item.name,
            dayOfWeek: 'friday',
            action: 'take_home',
            description: `今週使った${item.name}を持ち帰り`,
            icon: item.icon,
            isChecked: false,
          });
        }
      } else if (item.schedule === 'weekly_friday') {
        // 布団カバー・枕用タオル: 家にある状態で金曜日なら交換を提案
        if (status.currentStatus === 'at_home' && tomorrowDayOfWeek === 5) {
          needs.push({
            itemId: item.id,
            itemName: item.name,
            dayOfWeek: 'friday',
            action: 'bring',
            description: '新しいものを持参し、使用済みを持ち帰り',
            icon: item.icon,
            isChecked: false,
          });
        }
      }
    });

    // 特別な週単位提案ロジック
    const currentWeek = getWeekNumber(tomorrow);

    weeklyItems.forEach(item => {
      const status = weeklyItemStatuses[item.id];
      if (!status) return;

      // 今週まだ持参していない週次（月曜日）アイテムがあれば平日（月曜日以外）に提案
      if (item.schedule === 'weekly_monday' &&
        status.currentStatus === 'at_home' &&
        tomorrowDayOfWeek >= 2 && tomorrowDayOfWeek <= 5) { // 火曜日から金曜日

        const lastBroughtWeek = status.lastBroughtDate ?
          getWeekNumber(new Date(status.lastBroughtDate + 'T00:00:00')) : 0;

        if (lastBroughtWeek < currentWeek) {
          const existingNeed = needs.find(n => n.itemId === item.id);
          if (!existingNeed) {
            needs.push({
              itemId: item.id,
              itemName: item.name,
              dayOfWeek: 'monday',
              action: 'bring',
              description: `今週まだ持参していない${item.name}（いつでも持参可能）`,
              icon: item.icon,
              isChecked: false,
            });
          }
        }
      }
    });

    setWeeklyNeeds(needs);
  };

  // 週番号を取得するヘルパー関数
  const getWeekNumber = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  };

  // 朝の在庫確認が実際に入力されているかチェック
  const isMorningCheckComplete = () => {
    if (!latestMorningCheck) {
      return false;
    }

    // 今日の日付かどうかを確認
    const today = getJapanDate();

    if (latestMorningCheck.date !== today) {
      return false;
    }

    // 日常アイテムが1つでも入力されているかチェック
    const hasAnyDailyInput = dailyItems.some(item => {
      const count = latestMorningCheck.items[item.id] || 0;
      return count > 0;
    });

    return hasAnyDailyInput;
  };

  const renderHomeView = () => {
    const morningCompleted = isMorningCheckComplete();
    const eveningCompleted = latestEveningCheck?.date === today;
    const morningTimestampText = morningCompleted ? formatCheckTimestamp(latestMorningCheck) : null;
    const eveningTimestampText = eveningCompleted ? formatCheckTimestamp(latestEveningCheck) : null;

    return (
      <div className="dashboard-home">
        <div className="welcome-section">
          <h2>こんにちは！今日も一日お疲れ様 💕</h2>
          <p>幼稚園の準備はバッチリですか？</p>
        </div>

        <div className="info-panel" style={{
          backgroundColor: '#fff9e6',
          border: '1px solid #ffe082',
          borderRadius: '12px',
          padding: '15px',
          margin: '0 0 20px 0',
          fontSize: '0.9rem',
          color: '#5d4037',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>📢</span> 大切なお知らせ
          </h3>
          <ul style={{ margin: 0, paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>勤怠連絡は<strong>「出欠申請なび」</strong>で8:00までに申請</li>
            <li>子どもの体調報告は<strong>「ぎゅっとなび」</strong>で8:30までに申請</li>
            <li>預かり保育の最終締め切り(翌日の送り迎えの時刻)は<strong>「出欠申請なび」</strong>で前日の15時までに申請</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button
            onClick={() => setCurrentView('morning')}
            className="action-btn morning-btn"
          >
            <span className="btn-icon">🌅</span>
            <div className="action-btn-text">
              <h3>朝の在庫確認</h3>
              <p>{isMorningCheckComplete() ? '✅ 完了済み（再編集可能）' : '幼稚園の在庫をチェック'}</p>
              {morningTimestampText && (
                <span className="timestamp-label">🕒 記録: {morningTimestampText}</span>
              )}
            </div>
          </button>

          <button
            onClick={() => setCurrentView('evening')}
            className="action-btn evening-btn"
          >
            <span className="btn-icon">🌙</span>
            <div className="action-btn-text">
              <h3>夕方の記録</h3>
              <p>{(latestEveningCheck && latestEveningCheck.date === today) ? '✅ 完了済み（再編集可能）' : '使った枚数を記録'}</p>
              {eveningTimestampText && (
                <span className="timestamp-label">🕒 記録: {eveningTimestampText}</span>
              )}
            </div>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className="action-btn settings-btn"
            disabled={settingsLoading}
          >
            <span className="btn-icon">⚙️</span>
            <div>
              <h3>在庫の設定</h3>
              <p>必要な枚数をカスタマイズ</p>
            </div>
          </button>
        </div>

        {nurseryStocks.length > 0 && (
          <NurseryStockView stocks={nurseryStocks} />
        )}

        {tomorrowNeeds.length > 0 && (
          <div className="tomorrow-preview">
            <h3>📝 明日持参するもの</h3>
            <TomorrowNeeds needs={tomorrowNeeds} />
          </div>
        )}

        {weeklyNeeds.length > 0 && (
          <div className="weekly-preview">
            <WeeklyItems needs={weeklyNeeds} />
          </div>
        )}
      </div>
    );
  };

  const handleDataUpdate = () => {
    loadLatestStockData();
    loadWeeklyItemStatuses(); // 週単位アイテムの状態も更新
    setCurrentView('home');
  };

  switch (currentView) {
    case 'morning':
      return (
        <Layout title="朝の在庫確認">
          <MorningCheck
            onComplete={handleDataUpdate}
            onBack={() => setCurrentView('home')}
            existingData={(latestMorningCheck && latestMorningCheck.date === today) ? {
              id: latestMorningCheck.id!,
              items: latestMorningCheck.items,
              weeklyItems: latestMorningCheck.weeklyItems
            } : undefined}
          />
        </Layout>
      );

    case 'evening':
      return (
        <Layout title="夕方の記録">
          <EveningCheck
            onComplete={handleDataUpdate}
            onBack={() => setCurrentView('home')}
            existingData={(latestEveningCheck && latestEveningCheck.date === today) ? {
              id: latestEveningCheck.id!,
              items: latestEveningCheck.items,
              weeklyItems: latestEveningCheck.weeklyItems
            } : undefined}
          />
        </Layout>
      );

    case 'settings':
      return (
        <Layout title="在庫の設定">
          <InventorySettings
            onBack={() => setCurrentView('home')}
            onSaved={() => setCurrentView('home')}
          />
        </Layout>
      );

    default:
      return (
        <Layout title="ゆいちゃんの幼稚園準備">
          {renderHomeView()}
        </Layout>
      );
  }
};

export default Dashboard;
