export interface ClothingItem {
  id: string;
  name: string;
  type: 'underwear' | 'short_sleeve' | 'long_sleeve' | 'pants' | 'towel' | 'swimsuit' | 'bed_cover' | 'pillow_towel' | 'contact_book' | 'straw_mug' | 'plastic_bag';
  required: number; // 必要な在庫数
  schedule?: 'daily' | 'weekly_monday' | 'weekly_friday'; // スケジュールタイプ
  icon: string; // アイコン（絵文字）
  unit: string; // 数量の単位（枚、個など）
  group?: string; // グループID（例: 'tops'）
  groupRequired?: number; // グループ全体の必要在庫数
  takesHomeDaily?: boolean; // 毎日持ち帰るアイテムかどうか
}

export interface StockCheck {
  id?: string;
  date: string;
  type: 'morning' | 'evening';
  items: Record<string, number>; // itemId -> count
  weeklyItems?: Record<string, boolean>; // itemId -> brought/taken
  userId: string;
  timestamp: Date;
}

export interface DailyNeed {
  itemId: string;
  itemName: string;
  needToBring: number;
  icon: string;
  unit: string;
  isChecked?: boolean;
}

export interface WeeklyNeed {
  itemId: string;
  itemName: string;
  dayOfWeek: 'monday' | 'friday';
  action: 'bring' | 'take_home';
  description: string;
  icon?: string;
  isChecked?: boolean;
}

export interface WeeklyItemStatus {
  itemId: string;
  lastBroughtDate?: string; // 最後に持参した日付
  lastTakenDate?: string; // 最後に持ち帰った日付
  currentStatus: 'at_home' | 'at_nursery'; // 現在の場所
}

export interface NurseryStock {
  itemId: string;
  itemName: string;
  currentStock: number;
  requiredStock: number;
  icon: string;
  unit: string;
  isGrouped?: boolean;
  groupName?: string;
}