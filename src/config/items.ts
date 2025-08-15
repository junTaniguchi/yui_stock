import { ClothingItem } from '../types';

export const clothingItems: ClothingItem[] = [
  {
    id: 'underwear',
    name: '肌着',
    type: 'underwear',
    required: 3,
    schedule: 'daily',
    icon: '👕',
  },
  {
    id: 'short_sleeve',
    name: '上着（半袖）',
    type: 'short_sleeve',
    required: 1.5, // 半袖と長袖合わせて3枚
    schedule: 'daily',
    icon: '👚',
  },
  {
    id: 'long_sleeve',
    name: '上着（長袖）',
    type: 'long_sleeve',
    required: 1.5, // 半袖と長袖合わせて3枚
    schedule: 'daily',
    icon: '👔',
  },
  {
    id: 'pants',
    name: 'ズボン',
    type: 'pants',
    required: 3,
    schedule: 'daily',
    icon: '👖',
  },
  {
    id: 'towel',
    name: 'タオル',
    type: 'towel',
    required: 1,
    schedule: 'daily',
    icon: '🛏️',
  },
  {
    id: 'contact_book',
    name: '連絡帳',
    type: 'contact_book',
    required: 1,
    schedule: 'daily',
    icon: '📝',
  },
  {
    id: 'swimsuit',
    name: '水着',
    type: 'swimsuit',
    required: 1,
    schedule: 'weekly_monday',
    icon: '👙',
  },
  {
    id: 'bed_cover',
    name: '敷布団カバー',
    type: 'bed_cover',
    required: 1,
    schedule: 'weekly_friday',
    icon: '🛌',
  },
  {
    id: 'pillow_towel',
    name: '枕用タオル',
    type: 'pillow_towel',
    required: 1,
    schedule: 'weekly_friday',
    icon: '🧺',
  },
];

// 毎日必要なアイテム
export const dailyItems = clothingItems.filter(item => 
  ['underwear', 'short_sleeve', 'long_sleeve', 'pants', 'towel', 'contact_book'].includes(item.id)
);

// 週次アイテム
export const weeklyItems = clothingItems.filter(item => 
  ['swimsuit', 'bed_cover', 'pillow_towel'].includes(item.id)
);