import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { dailyItems, weeklyItems } from '../config/items';
import './Forms.css';

interface MorningCheckProps {
  onComplete: () => void;
  onBack: () => void;
}

const MorningCheck: React.FC<MorningCheckProps> = ({ onComplete, onBack }) => {
  const { currentUser } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [weeklyItemsBrought, setWeeklyItemsBrought] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleCountChange = (itemId: string, count: number) => {
    setCounts(prev => ({
      ...prev,
      [itemId]: Math.max(0, count),
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
      await addDoc(collection(db, 'stockChecks'), {
        date: today,
        type: 'morning',
        items: counts,
        weeklyItems: weeklyItemsBrought,
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      alert('朝の在庫確認を保存しました！ 🌅');
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
        <h2>🌅 朝の在庫確認</h2>
        <p>保育園にある着替えの枚数をチェックしてください</p>
      </div>

      <form onSubmit={handleSubmit} className="stock-form">
        <div className="items-grid">
          {dailyItems.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-info">
                <span className="item-icon">{item.icon}</span>
                <div>
                  <h3>{item.name}</h3>
                  <p>必要数: {item.required}枚</p>
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
                  value={counts[item.id] || 0}
                  onChange={(e) => handleCountChange(item.id, parseInt(e.target.value) || 0)}
                  className="counter-input"
                  disabled={isSubmitting}
                />
                
                <button
                  type="button"
                  onClick={() => handleCountChange(item.id, (counts[item.id] || 0) + 1)}
                  className="counter-btn plus"
                  disabled={isSubmitting}
                >
                  +
                </button>
              </div>
              
              {counts[item.id] !== undefined && counts[item.id] < item.required && (
                <div className="shortage-warning">
                  ⚠️ {item.required - counts[item.id]}枚不足
                </div>
              )}
            </div>
          ))}
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
          {isSubmitting ? '保存中...' : '在庫確認を保存 ✅'}
        </button>
      </form>
    </div>
  );
};

export default MorningCheck;