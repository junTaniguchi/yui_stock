import React, { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { dailyItems, weeklyItems } from '../config/items';
import { useItemSettings } from '../contexts/ItemSettingsContext';
import './Forms.css';

interface MorningCheckProps {
  onComplete: () => void;
  onBack: () => void;
  existingData?: {
    id: string;
    items: Record<string, number>;
    weeklyItems?: Record<string, boolean>;
  };
}

const MorningCheck: React.FC<MorningCheckProps> = ({ onComplete, onBack, existingData }) => {
  const { currentUser } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [weeklyItemsBrought, setWeeklyItemsBrought] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requiredCounts } = useItemSettings();

  // 日本時間での今日の日付を取得
  const getJapanDate = () => {
    const now = new Date();
    const japanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    return japanTime.toISOString().split('T')[0];
  };
  // const today = getJapanDate(); // 使用されていないためコメントアウト
  const formattedRequiredCounts = useMemo(() => {
    const entries: Record<string, string> = {};
    dailyItems.forEach(item => {
      const required = requiredCounts[item.id] ?? item.required;
      const rounded = Math.round(required * 10) / 10;
      entries[item.id] = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    });
    return entries;
  }, [requiredCounts]);

  useEffect(() => {
    if (existingData) {
      setCounts(existingData.items || {});
      setWeeklyItemsBrought(existingData.weeklyItems || {});
    }
  }, [existingData]);

  const handleCountChange = (itemId: string, count: number) => {
    // 毎日持ち帰るアイテムは0か1のみ
    const isRestricted = dailyItems.find(i => i.id === itemId)?.takesHomeDaily;
    let newCount = Math.max(0, count);

    if (isRestricted) {
      newCount = Math.min(1, newCount);
    }

    setCounts(prev => ({
      ...prev,
      [itemId]: newCount,
    }));
  };

  const handleWeeklyItemChange = (itemId: string, brought: boolean) => {
    setWeeklyItemsBrought(prev => ({
      ...prev,
      [itemId]: brought,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      if (existingData?.id) {
        // 既存データの更新
        await updateDoc(doc(db, 'stockChecks', existingData.id), {
          items: counts,
          weeklyItems: weeklyItemsBrought,
          timestamp: new Date(), // 日本時間でタイムスタンプ作成
        });
        alert('朝の在庫確認を更新しました！ 🌅');
      } else {
        // 新規作成
        await addDoc(collection(db, 'stockChecks'), {
          date: getJapanDate(), // 保存時の日本時間日付
          type: 'morning',
          items: counts,
          weeklyItems: weeklyItemsBrought,
          userId: currentUser.uid,
          timestamp: new Date(), // 日本時間でタイムスタンプ作成
        });
        alert('朝の在庫確認を保存しました！ 🌅');
      }

      onComplete();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItemCard = (item: typeof dailyItems[0]) => {
    const requiredValue = requiredCounts[item.id] ?? item.required;
    const shortageValue = Math.max(0, requiredValue - (counts[item.id] || 0));
    const roundedShortage = Math.round(shortageValue * 10) / 10;
    const shortageDisplay = Number.isInteger(roundedShortage)
      ? String(roundedShortage)
      : roundedShortage.toFixed(1);

    return (
      <div key={item.id} className="item-card">
        <div className="item-info">
          <span className="item-icon">{item.icon}</span>
          <div>
            <h3>{item.name}</h3>
            <p>必要数: {formattedRequiredCounts[item.id]}{item.unit}</p>
          </div>
        </div>

        <div className="counter">
          <button
            type="button"
            onClick={() => handleCountChange(item.id, (counts[item.id] || 0) - 1)}
            className="counter-btn minus"
            disabled={isSubmitting}
          >
            -
          </button>

          <input
            type="number"
            min="0"
            max={item.takesHomeDaily ? 1 : undefined}
            value={counts[item.id] || 0}
            onChange={(e) => handleCountChange(item.id, parseInt(e.target.value) || 0)}
            className="counter-input"
            disabled={isSubmitting}
          />

          <button
            type="button"
            onClick={() => handleCountChange(item.id, (counts[item.id] || 0) + 1)}
            className="counter-btn plus"
            disabled={isSubmitting || (item.takesHomeDaily && (counts[item.id] || 0) >= 1)}
          >
            +
          </button>
        </div>

        {counts[item.id] !== undefined && (counts[item.id] || 0) < requiredValue && (
          <div className="shortage-warning">
            ⚠️ {shortageDisplay}{item.unit}不足
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button onClick={onBack} className="back-btn">
          ← 戻る
        </button>
        <h2>🌅 朝の在庫確認</h2>
        <p>{existingData ? '幼稚園にある着替えの枚数を更新してください' : '幼稚園にある着替えの枚数をチェックしてください'}</p>
      </div>

      <form onSubmit={handleSubmit} className="stock-form">
        <div className="items-section">
          <h3 style={{ marginBottom: '15px' }}>🎒 毎日持っていくものなど</h3>
          <div className="items-grid">
            {dailyItems.filter(item => item.group === 'daily_check').map(renderItemCard)}
          </div>
        </div>

        <div className="items-section" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>👕 ロッカー保管</h3>
          <div className="items-grid">
            {dailyItems.filter(item => item.group === 'stock').map(renderItemCard)}
          </div>
        </div>

        {weeklyItems.length > 0 && (
          <div className="weekly-section">
            <h3>📅 今日持参した週単位アイテム</h3>
            <div className="weekly-checklist">
              {weeklyItems.map(item => (
                <div key={item.id} className="weekly-check-item">
                  <label className="weekly-checkbox">
                    <input
                      type="checkbox"
                      checked={weeklyItemsBrought[item.id] || false}
                      onChange={(e) => handleWeeklyItemChange(item.id, e.target.checked)}
                      disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-name">{item.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ?
            (existingData ? '更新中...' : '保存中...') :
            (existingData ? '在庫確認を更新 ✅' : '在庫確認を保存 ✅')
          }
        </button>
      </form>
    </div>
  );
};

export default MorningCheck;
