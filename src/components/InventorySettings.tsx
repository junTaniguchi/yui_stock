import React, { useEffect, useMemo, useState } from 'react';
import { clothingItems } from '../config/items';
import { useItemSettings } from '../contexts/ItemSettingsContext';
import { ClothingItem } from '../types';
import './InventorySettings.css';

interface InventorySettingsProps {
  onBack: () => void;
  onSaved: () => void;
}

type CountsMap = Record<string, number>;

const sanitizeCount = (value: number) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return value < 0 ? 0 : value;
};

const InventorySettings: React.FC<InventorySettingsProps> = ({ onBack, onSaved }) => {
  const { requiredCounts, defaults, loading, saving, saveRequiredCounts } = useItemSettings();
  const [formCounts, setFormCounts] = useState<CountsMap>({});
  const [isDirty, setIsDirty] = useState(false);

  const dailyItems = useMemo(
    () => clothingItems.filter(item => item.schedule === 'daily'),
    []
  );
  const weeklyItems = useMemo(
    () => clothingItems.filter(item => item.schedule !== 'daily'),
    []
  );

  useEffect(() => {
    setFormCounts({ ...requiredCounts });
    setIsDirty(false);
  }, [requiredCounts]);

  const handleCountChange = (itemId: string, value: string) => {
    const parsed = sanitizeCount(parseFloat(value));
    setFormCounts(prev => ({
      ...prev,
      [itemId]: parsed,
    }));
    setIsDirty(true);
  };

  const handleReset = () => {
    setFormCounts({ ...defaults });
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = clothingItems.reduce<CountsMap>((acc, item) => {
      const raw = formCounts[item.id];
      const fallback = defaults[item.id] ?? 0;
      acc[item.id] = sanitizeCount(raw ?? fallback);
      return acc;
    }, {});

    try {
      await saveRequiredCounts(payload);
      alert('在庫の必要枚数を保存しました！ ✅');
      setIsDirty(false);
      onSaved();
    } catch (error) {
      console.error('在庫設定の保存に失敗しました:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    }
  };

  const renderItemRow = (item: ClothingItem) => {
    const value = formCounts[item.id] ?? defaults[item.id] ?? 0;

    return (
      <div key={item.id} className="inventory-settings-item">
        <div className="inventory-settings-item-info">
          <span className="inventory-settings-icon">{item.icon}</span>
          <div>
            <h4>{item.name}</h4>
            <p className="inventory-settings-note">
              {item.group ? '半袖と長袖の合計で調整できます' : '保育園に置いておきたい枚数'}
            </p>
          </div>
        </div>
        <div className="inventory-settings-control">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={value}
            onChange={(e) => handleCountChange(item.id, e.target.value)}
          />
          <span className="inventory-settings-unit">{item.unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="inventory-settings-container">
      <div className="inventory-settings-header">
        <button onClick={onBack} className="back-btn">
          ← 戻る
        </button>
        <h2>⚙️ 在庫の必要枚数</h2>
        <p>保育園に置いておきたい枚数を設定できます</p>
      </div>

      {loading ? (
        <div className="inventory-settings-loading">
          <div className="spinner"></div>
          <p>設定を読み込んでいます...</p>
        </div>
      ) : (
        <form className="inventory-settings-form" onSubmit={handleSubmit}>
          <section className="inventory-settings-section">
            <h3>毎日使うもの</h3>
            <div className="inventory-settings-list">
              {dailyItems.map(item => renderItemRow(item))}
            </div>
          </section>

          {weeklyItems.length > 0 && (
            <section className="inventory-settings-section">
              <h3>週に1度使うもの</h3>
              <div className="inventory-settings-list">
                {weeklyItems.map(item => renderItemRow(item))}
              </div>
            </section>
          )}

          <div className="inventory-settings-actions">
            <button
              type="button"
              className="back-link-btn"
              onClick={onBack}
              disabled={saving}
            >
              ホームに戻る
            </button>
            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
              disabled={saving}
            >
              デフォルトに戻す
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={!isDirty || saving}
            >
              {saving ? '保存中...' : '保存する'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default InventorySettings;
