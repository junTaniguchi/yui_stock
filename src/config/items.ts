import { ClothingItem } from '../types';

export const clothingItems: ClothingItem[] = [
  {
    id: 'underwear',
    name: '肌着',
    type: 'underwear',
    required: 3,
    schedule: 'daily',
    icon: '👕',
    unit: '枚',
  },
  {
    id: 'short_sleeve',
    name: '上着（半袖）',
    type: 'short_sleeve',
    required: 1.5, // 半袖と長袖合わせて3枚
    schedule: 'daily',
    icon: '👚',
    unit: '枚',
  },
  {
    id: 'long_sleeve',
    name: '上着（長袖）',
    type: 'long_sleeve',
    required: 1.5, // 半袖と長袖合わせて3枚
    schedule: 'daily',
    icon: '👔',
    unit: '枚',
  },
  {
    id: 'pants',
    name: 'ズボン',
    type: 'pants',
    required: 3,
    schedule: 'daily',
    icon: '👖',
    unit: '枚',
  },
  {
    id: 'towel',
    name: 'タオル',
    type: 'towel',
    required: 1,
    schedule: 'daily',
    icon: '🛏️',
    unit: '枚',
  },
  {
    id: 'contact_book',
    name: '連絡帳',
    type: 'contact_book',
    required: 1,
    schedule: 'daily',
    icon: '📝',
    unit: '個',
  },
  {
    id: 'straw_mug',
    name: 'ストローマグ',
    type: 'straw_mug',
    required: 1,
    schedule: 'daily',
    icon: '🥤',
    unit: '個',
  },
  {
    id: 'swimsuit',
    name: '水着',
    type: 'swimsuit',
    required: 1,
    schedule: 'weekly_monday',
    icon: '👙',
    unit: '枚',
  },
  {
    id: 'bed_cover',
    name: '敷布団カバー',
    type: 'bed_cover',
    required: 1,
    schedule: 'weekly_friday',
    icon: '🛌',
    unit: '枚',
  },
  {
    id: 'pillow_towel',
    name: '枕用タオル',
    type: 'pillow_towel',
    required: 1,
    schedule: 'weekly_friday',
    icon: '🧺',
    unit: '枚',
  },
];

// 毎日必要なアイテム
export const dailyItems = clothingItems.filter(item => 
  ['underwear', 'short_sleeve', 'long_sleeve', 'pants', 'towel', 'contact_book', 'straw_mug'].includes(item.id)
);

// 週次アイテム
export const weeklyItems = clothingItems.filter(item => 
  ['swimsuit', 'bed_cover', 'pillow_towel'].includes(item.id)
);