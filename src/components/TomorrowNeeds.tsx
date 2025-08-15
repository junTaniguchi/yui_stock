import React, { useState, useEffect } from 'react';
import { DailyNeed } from '../types';
import './TomorrowNeeds.css';

interface TomorrowNeedsProps {
  needs: DailyNeed[];
}

const TomorrowNeeds: React.FC<TomorrowNeedsProps> = ({ needs }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const today = new Date().toISOString().split('T')[0];

  // ローカルストレージからチェック状態を読み込み
  useEffect(() => {
    const savedChecks = localStorage.getItem(`tomorrow-needs-${today}`);
    if (savedChecks) {
      setCheckedItems(JSON.parse(savedChecks));
    }
  }, [today]);

  // チェック状態をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(`tomorrow-needs-${today}`, JSON.stringify(checkedItems));
  }, [checkedItems, today]);

  const handleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (needs.length === 0) {
    return (
      <div className="no-needs">
        <div className="success-icon">✨</div>
        <h3>素晴らしい！</h3>
        <p>明日は追加で持参するものはありません 🎉</p>
      </div>
    );
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = needs.length;

  return (
    <div className="tomorrow-needs">
      <div className="progress-header">
        <div className="progress-text">
          カバンに入れた: {checkedCount}/{totalCount}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(checkedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="needs-list">
        {needs.map((need) => (
          <div 
            key={need.itemId} 
            className={`need-item ${checkedItems[need.itemId] ? 'checked' : ''}`}
            onClick={() => handleCheck(need.itemId)}
          >
            <div className="need-checkbox">
              {checkedItems[need.itemId] ? '✅' : '⭕'}
            </div>
            <div className="need-icon">{need.icon}</div>
            <div className="need-info">
              <span className="need-name">{need.itemName}</span>
              <span className="need-count">{need.needToBring}枚</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="preparation-tips">
        <h4>🌟 準備のコツ</h4>
        <ul>
          <li>前の晩に準備しておくと朝がラクになります</li>
          <li>洗濯物が乾いているか確認しましょう</li>
          <li>予備を多めに持っておくと安心です</li>
        </ul>
      </div>
    </div>
  );
};

export default TomorrowNeeds;