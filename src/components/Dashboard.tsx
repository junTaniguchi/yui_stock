import React, { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
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
import './Dashboard.css';

type ViewType = 'home' | 'morning' | 'evening';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [todayMorningCheck, setTodayMorningCheck] = useState<StockCheck | null>(null);
  const [todayEveningCheck, setTodayEveningCheck] = useState<StockCheck | null>(null);
  const [yesterdayEveningCheck, setYesterdayEveningCheck] = useState<StockCheck | null>(null);
  const [tomorrowNeeds, setTomorrowNeeds] = useState<DailyNeed[]>([]);
  const [weeklyNeeds, setWeeklyNeeds] = useState<WeeklyNeed[]>([]);
  const [weeklyItemStatuses, setWeeklyItemStatuses] = useState<Record<string, WeeklyItemStatus>>({});
  const [nurseryStocks, setNurseryStocks] = useState<NurseryStock[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    if (currentUser) {
      loadTodayData();
      loadWeeklyItemStatuses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    calculateTomorrowNeeds();
    calculateWeeklyNeeds();
    calculateNurseryStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayMorningCheck, todayEveningCheck, yesterdayEveningCheck, weeklyItemStatuses]);

  const loadTodayData = async () => {
    if (!currentUser) return;

    try {
      // 今日の朝のチェックを取得
      const morningQuery = query(
        collection(db, 'stockChecks'),
        where('userId', '==', currentUser.uid),
        where('date', '==', today),
        where('type', '==', 'morning'),
        limit(1)
      );
      
      const morningSnapshot = await getDocs(morningQuery);
      if (!morningSnapshot.empty) {
        const doc = morningSnapshot.docs[0];
        setTodayMorningCheck({ id: doc.id, ...doc.data() } as StockCheck);
      } else {
        setTodayMorningCheck(null);
      }

      // 今日の夕方のチェックを取得
      const todayEveningQuery = query(
        collection(db, 'stockChecks'),
        where('userId', '==', currentUser.uid),
        where('date', '==', today),
        where('type', '==', 'evening'),
        limit(1)
      );
      
      const todayEveningSnapshot = await getDocs(todayEveningQuery);
      if (!todayEveningSnapshot.empty) {
        const doc = todayEveningSnapshot.docs[0];
        setTodayEveningCheck({ id: doc.id, ...doc.data() } as StockCheck);
      } else {
        setTodayEveningCheck(null);
      }

      // 昨日の夕方のチェックを取得
      const eveningQuery = query(
        collection(db, 'stockChecks'),
        where('userId', '==', currentUser.uid),
        where('date', '==', yesterday),
        where('type', '==', 'evening'),
        limit(1)
      );
      
      const eveningSnapshot = await getDocs(eveningQuery);
      if (!eveningSnapshot.empty) {
        const doc = eveningSnapshot.docs[0];
        setYesterdayEveningCheck({ id: doc.id, ...doc.data() } as StockCheck);
      }
    } catch (error) {
      console.error('データ読み込みエラー:', error);
    }
  };

  const loadWeeklyItemStatuses = async () => {
    if (!currentUser) return;

    try {
      // 一時的にシンプルなクエリのみ使用してインデックスエラーを回避
      const weeklyQuery = query(
        collection(db, 'stockChecks'),
        where('userId', '==', currentUser.uid)
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
      const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

      // データを日付でフィルタしてから日付順に処理して最新の状態を判断
      const filteredDocs = querySnapshot.docs
        .filter(doc => {
          const data = doc.data() as StockCheck;
          return data.date >= twoWeeksAgoStr;
        })
        .sort((a, b) => {
          const aData = a.data() as StockCheck;
          const bData = b.data() as StockCheck;
          // 日付で降順ソート、同じ日付なら timestamp で降順ソート
          if (aData.date !== bData.date) {
            return bData.date.localeCompare(aData.date);
          }
          const aTime = aData.timestamp ? 
            ((aData.timestamp as any).toMillis ? (aData.timestamp as any).toMillis() : (aData.timestamp as Date).getTime()) : 0;
          const bTime = bData.timestamp ? 
            ((bData.timestamp as any).toMillis ? (bData.timestamp as any).toMillis() : (bData.timestamp as Date).getTime()) : 0;
          return bTime - aTime;
        });

      filteredDocs.forEach(doc => {
        const data = doc.data() as StockCheck;
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
    const processedGroups = new Set<string>();
    
    clothingItems.forEach(item => {
      // 日常アイテムのみ対象
      if (item.schedule === 'daily') {
        // グループアイテムの場合（上着）
        if (item.group && item.groupRequired && !processedGroups.has(item.group)) {
          processedGroups.add(item.group);
          
          // グループの全アイテムを取得
          const groupItems = clothingItems.filter(i => i.group === item.group);
          let totalMorningStock = 0;
          let totalTakenHomeToday = 0;

          groupItems.forEach(groupItem => {
            if (todayMorningCheck) {
              totalMorningStock += todayMorningCheck.items[groupItem.id] || 0;
            }
            if (todayEveningCheck) {
              totalTakenHomeToday += todayEveningCheck.items[groupItem.id] || 0;
            }
          });

          // 保育園在庫 = 朝の在庫 - 今日持ち帰った数
          const nurseryStock = Math.max(0, totalMorningStock - totalTakenHomeToday);
          // 上着の場合: 翌日持っていく在庫 = 3 - SUM(保育園在庫の半袖、保育園在庫の長袖)
          const needToBring = Math.max(0, 3 - nurseryStock);

          if (needToBring > 0) {
            needs.push({
              itemId: item.group,
              itemName: `上着（半袖・長袖）`,
              needToBring: Math.ceil(needToBring),
              icon: '👔',
              unit: item.unit,
              isChecked: false,
            });
          }
        }
        // 単独アイテムの場合
        else if (!item.group) {
          let morningStock = 0;
          let takenHomeToday = 0;

          if (todayMorningCheck) {
            morningStock = todayMorningCheck.items[item.id] || 0;
          }

          if (todayEveningCheck) {
            takenHomeToday = todayEveningCheck.items[item.id] || 0;
          }

          // 保育園在庫 = 朝の在庫 - 今日持ち帰った数
          const nurseryStock = Math.max(0, morningStock - takenHomeToday);
          
          let needToBring = 0;
          
          // 肌着、ズボンの場合: 翌日持っていく在庫 = 3 - 保育園在庫
          if (item.type === 'underwear' || item.type === 'pants') {
            needToBring = Math.max(0, 3 - nurseryStock);
          }
          // その他（連絡帳、ストローマグ、タオル、ビニール袋）の場合: 1
          else if (item.type === 'contact_book' || item.type === 'straw_mug' || item.type === 'towel' || item.type === 'plastic_bag') {
            needToBring = 1;
          }

          if (needToBring > 0) {
            needs.push({
              itemId: item.id,
              itemName: item.name,
              needToBring: Math.ceil(needToBring),
              icon: item.icon,
              unit: item.unit,
              isChecked: false,
            });
          }
        }
      }
    });

    setTomorrowNeeds(needs);
  };

  const calculateNurseryStocks = () => {
    const stocks: NurseryStock[] = [];
    
    clothingItems.forEach(item => {
      if (item.schedule === 'daily') {
        let morningStock = 0;
        let takenHomeToday = 0;

        if (todayMorningCheck) {
          morningStock = todayMorningCheck.items[item.id] || 0;
        }

        if (todayEveningCheck) {
          takenHomeToday = todayEveningCheck.items[item.id] || 0;
        }

        // 保育園在庫 = 朝の在庫 - 今日持ち帰った数
        const currentStock = Math.max(0, morningStock - takenHomeToday);
        
        stocks.push({
          itemId: item.id,
          itemName: item.name,
          currentStock,
          requiredStock: item.required,
          icon: item.icon,
          unit: item.unit
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
        // 水着: 明日が月曜日で家にある状態なら持参を提案
        if (tomorrowDayOfWeek === 1 && status.currentStatus === 'at_home') {
          needs.push({
            itemId: item.id,
            itemName: item.name,
            dayOfWeek: 'monday',
            action: 'bring',
            description: '明日は月曜日！新しい水着を持参（金曜日まで保育園で保管）',
            icon: item.icon,
            isChecked: false,
          });
        }
        // 保育園にある状態で金曜日なら持ち帰りを提案
        else if (status.currentStatus === 'at_nursery' && tomorrowDayOfWeek === 5) {
          needs.push({
            itemId: 'swimsuit_return',
            itemName: item.name,
            dayOfWeek: 'friday',
            action: 'take_home',
            description: '今週使った水着を持ち帰り',
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

      // 今週まだ持参していない水着があれば平日（月曜日以外）に提案
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
              description: '今週まだ持参していない水着（いつでも持参可能）',
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
    if (!todayMorningCheck) {
      console.log('朝のチェック: データなし');
      return false;
    }
    
    // 今日の日付かどうかを確認
    const today = new Date().toISOString().split('T')[0];
    console.log('今日の日付:', today, '、データの日付:', todayMorningCheck.date);
    
    if (todayMorningCheck.date !== today) {
      console.log('朝のチェック: 古いデータのため未完了扱い');
      return false;
    }
    
    // 日常アイテムが1つでも入力されているかチェック
    console.log('朝のチェックデータ:', todayMorningCheck.items);
    console.log('朝のチェック作成日時:', todayMorningCheck.timestamp);
    console.log('朝のチェックID:', todayMorningCheck.id);
    const hasAnyDailyInput = dailyItems.some(item => {
      const count = todayMorningCheck.items[item.id] || 0;
      console.log(`${item.name}(${item.id}): ${count}`);
      return count > 0;
    });
    
    console.log('完了判定結果:', hasAnyDailyInput);
    return hasAnyDailyInput;
  };

  const renderHomeView = () => (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h2>こんにちは！今日も一日お疲れ様 💕</h2>
        <p>保育園の準備はバッチリですか？</p>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => setCurrentView('morning')}
          className="action-btn morning-btn"
        >
          <span className="btn-icon">🌅</span>
          <div>
            <h3>朝の在庫確認</h3>
            <p>{isMorningCheckComplete() ? '✅ 完了済み（再編集可能）' : '保育園の在庫をチェック'}</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('evening')}
          className="action-btn evening-btn"
        >
          <span className="btn-icon">🌙</span>
          <div>
            <h3>夕方の記録</h3>
            <p>{todayEveningCheck ? '✅ 完了済み（再編集可能）' : '使った枚数を記録'}</p>
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

  const handleDataUpdate = () => {
    loadTodayData();
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
            existingData={todayMorningCheck ? {
              id: todayMorningCheck.id!,
              items: todayMorningCheck.items,
              weeklyItems: todayMorningCheck.weeklyItems
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
            existingData={todayEveningCheck ? {
              id: todayEveningCheck.id!,
              items: todayEveningCheck.items,
              weeklyItems: todayEveningCheck.weeklyItems
            } : undefined}
          />
        </Layout>
      );
    
    default:
      return (
        <Layout title="ゆいちゃんの保育園準備">
          {renderHomeView()}
        </Layout>
      );
  }
};

export default Dashboard;