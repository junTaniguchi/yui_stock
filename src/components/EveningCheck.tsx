import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { dailyItems, weeklyItems } from '../config/items';
import './Forms.css';

interface EveningCheckProps {
  onComplete: () => void;
  onBack: () => void;
  existingData?: {
    id: string;
    items: Record<string, number>;
    weeklyItems?: Record<string, boolean>;
  };
}

const EveningCheck: React.FC<EveningCheckProps> = ({ onComplete, onBack, existingData }) => {
  const { currentUser } = useAuth();
  const [usedCounts, setUsedCounts] = useState<Record<string, number>>({});
  const [weeklyItemsTaken, setWeeklyItemsTaken] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 日本時闳での今日の日付を取得
  const getJapanDate = () => {
    const now = new Date();
    const japanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    return japanTime.toISOString().split('T')[0];
  };
  // const today = getJapanDate(); // 使用されていないためコメントアウト

  useEffect(() => {
    if (existingData) {
      setUsedCounts(existingData.items || {});
      setWeeklyItemsTaken(existingData.weeklyItems || {});
    }
  }, [existingData]);

  const handleCountChange = (itemId: string, count: number) => {
    // 毎日持ち帰るアイテムは0か1のみ
    const isRestricted = dailyItems.find(i => i.id === itemId)?.takesHomeDaily;
    let newCount = Math.max(0, count);

    if (isRestricted) {
      newCount = Math.min(1, newCount);
    }

    setUsedCounts(prev => ({
      ...prev,
      [itemId]: newCount,
    }));
  };

  const handleWeeklyItemChange = (itemId: string, taken: boolean) => {
    setWeeklyItemsTaken(prev => ({
      ...prev,
      [itemId]: taken,
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
          items: usedCounts,
          weeklyItems: weeklyItemsTaken,
          timestamp: new Date(), // 日本時間でタイムスタンプ作成
        });
        alert('夕方の記録を更新しました！ 🌙');
      } else {
        // 新規作成
        await addDoc(collection(db, 'stockChecks'), {
          date: getJapanDate(), // 保存時の日本時闳日付
          type: 'evening',
          items: usedCounts,
          weeklyItems: weeklyItemsTaken,
          userId: currentUser.uid,
          timestamp: new Date(), // 日本時間でタイムスタンプ作成
        });
        alert('夕方の記録を保存しました！ 🌙');
      }

      onComplete();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button onClick={onBack} className="back-btn">
          ← 戻る
        </button>
        <h2>🌙 夕方の記録</h2>
        <p>{existingData ? '今日使った着替えの枚数を更新してください' : '今日使った着替えの枚数を記録してください'}</p>
      </div>

      <form onSubmit={handleSubmit} className="stock-form">
        <div className="items-grid">
          {dailyItems.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-info">
                <span className="item-icon">{item.icon}</span>
                <div>
                  <h3>{item.name}</h3>
                  <p>今日使った枚数</p>
                </div>
              </div>

              <div className="counter">
                <button
                  type="button"
                  onClick={() => handleCountChange(item.id, (usedCounts[item.id] || 0) - 1)}
                  className="counter-btn minus"
                  disabled={isSubmitting}
                >
                  -
                </button>

                <input
                  type="number"
                  min="0"
                  max={item.takesHomeDaily ? 1 : undefined}
                  value={usedCounts[item.id] || 0}
                  onChange={(e) => handleCountChange(item.id, parseInt(e.target.value) || 0)}
                  className="counter-input"
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  onClick={() => handleCountChange(item.id, (usedCounts[item.id] || 0) + 1)}
                  className="counter-btn plus"
                  disabled={isSubmitting || (item.takesHomeDaily && (usedCounts[item.id] || 0) >= 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {weeklyItems.length > 0 && (
          <div className="weekly-section">
            <h3>📅 今日持ち帰った週単位アイテム</h3>
            <div className="weekly-checklist">
              {weeklyItems.map(item => (
                <div key={item.id} className="weekly-check-item">
                  <label className="weekly-checkbox">
                    <input
                      type="checkbox"
                      checked={weeklyItemsTaken[item.id] || false}
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

        <div className="form-note">
          <p>💡 ヒント: 通園カバンや水筒などは通常1つ持ち帰ります</p>
        </div>

        <button
          type="submit"
          className="submit-btn evening-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ?
            (existingData ? '更新中...' : '保存中...') :
            (existingData ? '使用記録を更新 📝' : '使用記録を保存 📝')
          }
        </button>
      </form>
    </div>
  );
};

export default EveningCheck;