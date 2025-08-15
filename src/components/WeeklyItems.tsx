import React, { useState, useEffect } from 'react';
import { WeeklyNeed } from '../types';

interface WeeklyItemsProps {
  needs: WeeklyNeed[];
}

const WeeklyItems: React.FC<WeeklyItemsProps> = ({ needs }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const today = new Date().toISOString().split('T')[0];

  // ローカルストレージからチェック状態を読み込み
  useEffect(() => {
    const savedChecks = localStorage.getItem(`weekly-needs-${today}`);
    if (savedChecks) {
      setCheckedItems(JSON.parse(savedChecks));
    }
  }, [today]);

  // チェック状態をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(`weekly-needs-${today}`, JSON.stringify(checkedItems));
  }, [checkedItems, today]);

  const handleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (needs.length === 0) {
    return null;
  }

  const getDayText = (dayOfWeek: 'monday' | 'friday') => {
    return dayOfWeek === 'monday' ? '月曜日' : '金曜日';
  };

  const getActionIcon = (action: 'bring' | 'take_home') => {
    return action === 'bring' ? '🎒' : '🏠';
  };

  return (
    <div className="weekly-items">
      <h4>📅 週単位での準備</h4>
      <div className="weekly-items-list">
        {needs.map((need) => (
          <div 
            key={need.itemId} 
            className={`weekly-item ${checkedItems[need.itemId] ? 'checked' : ''}`}
            onClick={() => handleCheck(need.itemId)}
          >
            <div className="weekly-checkbox">
              {checkedItems[need.itemId] ? '✅' : '⭕'}
            </div>
            <span className="weekly-action-icon">
              {getActionIcon(need.action)}
            </span>
            <div className="weekly-item-info">
              <strong>{need.itemName}</strong>
              <div className="weekly-item-schedule">
                {getDayText(need.dayOfWeek)}: {need.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyItems;