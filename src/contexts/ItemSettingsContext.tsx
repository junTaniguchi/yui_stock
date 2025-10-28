import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { clothingItems } from '../config/items';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

type RequiredCountsMap = Record<string, number>;

interface ItemSettingsContextValue {
  requiredCounts: RequiredCountsMap;
  loading: boolean;
  saving: boolean;
  saveRequiredCounts: (counts?: RequiredCountsMap) => Promise<void>;
  resetToDefaults: () => void;
  defaults: RequiredCountsMap;
}

const ItemSettingsContext = createContext<ItemSettingsContextValue | undefined>(undefined);

const buildDefaultCounts = (): RequiredCountsMap => {
  const defaults: RequiredCountsMap = {};
  clothingItems.forEach(item => {
    defaults[item.id] = item.required;
  });
  return defaults;
};

export const DEFAULT_REQUIRED_COUNTS = buildDefaultCounts();

export const ItemSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [requiredCounts, setRequiredCounts] = useState<RequiredCountsMap>(DEFAULT_REQUIRED_COUNTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaults = useMemo(() => ({ ...DEFAULT_REQUIRED_COUNTS }), []);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      if (!currentUser) {
        if (active) {
          setRequiredCounts(DEFAULT_REQUIRED_COUNTS);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const settingsRef = doc(db, 'itemSettings', currentUser.uid);
        const snapshot = await getDoc(settingsRef);
        if (!active) return;

        const merged = snapshot.exists()
          ? {
              ...DEFAULT_REQUIRED_COUNTS,
              ...((snapshot.data() as { requiredCounts?: RequiredCountsMap })?.requiredCounts || {}),
            }
          : { ...DEFAULT_REQUIRED_COUNTS };
        setRequiredCounts(merged);
      } catch (error) {
        console.error('在庫設定の読み込みに失敗しました:', error);
        setRequiredCounts({ ...DEFAULT_REQUIRED_COUNTS });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, [currentUser]);

  const saveRequiredCounts = async (counts?: RequiredCountsMap) => {
    const newCounts = counts ? { ...counts } : { ...requiredCounts };
    setSaving(true);
    try {
      if (currentUser) {
        const settingsRef = doc(db, 'itemSettings', currentUser.uid);
        await setDoc(
          settingsRef,
          {
            requiredCounts: newCounts,
            updatedAt: new Date().toISOString(),
            userId: currentUser.uid,
          },
          { merge: true }
        );
      }
      setRequiredCounts({
        ...DEFAULT_REQUIRED_COUNTS,
        ...newCounts,
      });
    } catch (error) {
      console.error('在庫設定の保存に失敗しました:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setRequiredCounts({ ...DEFAULT_REQUIRED_COUNTS });
  };

  const value: ItemSettingsContextValue = {
    requiredCounts,
    loading,
    saving,
    saveRequiredCounts,
    resetToDefaults,
    defaults,
  };

  return (
    <ItemSettingsContext.Provider value={value}>
      {children}
    </ItemSettingsContext.Provider>
  );
};

export const useItemSettings = (): ItemSettingsContextValue => {
  const context = useContext(ItemSettingsContext);
  if (!context) {
    throw new Error('useItemSettings must be used within ItemSettingsProvider');
  }
  return context;
};
