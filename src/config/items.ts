import { ClothingItem } from '../types';

export const clothingItems: ClothingItem[] = [
  // 🎒 毎日持っていくもの
  { id: 'hat', name: '帽子', type: 'hat', required: 1, schedule: 'daily', icon: '🧢', unit: '個', takesHomeDaily: true, group: 'daily_check' },
  { id: 'cup', name: 'コップ', type: 'cup', required: 1, schedule: 'daily', icon: '🥛', unit: '個', takesHomeDaily: true, group: 'daily_check' },
  { id: 'water_bottle', name: '水筒', type: 'water_bottle', required: 1, schedule: 'daily', icon: '🚰', unit: '個', takesHomeDaily: true, group: 'daily_check' },
  { id: 'loop_towel', name: 'ループタオル', type: 'loop_towel', required: 1, schedule: 'daily', icon: '🧣', unit: '枚', takesHomeDaily: true, group: 'daily_check' },

  // 🍱 お弁当の日
  { id: 'bento', name: 'お弁当', type: 'bento', required: 1, schedule: 'daily', icon: '🍱', unit: '個', takesHomeDaily: true, group: 'daily_check' },
  { id: 'utensils', name: '食具', type: 'utensils', required: 1, schedule: 'daily', icon: '🍴', unit: 'セット', takesHomeDaily: true, group: 'daily_check' },

  // 👕 ロッカー保管（着替え一式・袋・靴）
  { id: 'long_sleeve', name: '長袖', type: 'long_sleeve', required: 3, schedule: 'daily', icon: '👔', unit: '枚', group: 'stock' },
  { id: 'short_sleeve', name: '半袖', type: 'short_sleeve', required: 3, schedule: 'daily', icon: '👕', unit: '枚', group: 'stock' },
  { id: 'underwear', name: '肌着', type: 'underwear', required: 3, schedule: 'daily', icon: '🎽', unit: '枚', group: 'stock' },
  { id: 'pants', name: 'ズボン', type: 'pants', required: 3, schedule: 'daily', icon: '👖', unit: '枚', group: 'stock' },
  { id: 'plastic_bag', name: '汚れ物袋', type: 'plastic_bag', required: 3, schedule: 'daily', icon: '🛍️', unit: '枚', group: 'stock' },
  { id: 'shoes', name: '上履き', type: 'shoes', required: 1, schedule: 'daily', icon: '👟', unit: '足', group: 'stock' },

  // 👨‍👩‍👧 親の持ち物
  { id: 'slippers', name: 'スリッパ', type: 'slippers', required: 1, schedule: 'daily', icon: '🩴', unit: '足', takesHomeDaily: true, group: 'parent_check' },
  { id: 'security_card', name: '防犯カード', type: 'security_card', required: 1, schedule: 'daily', icon: '💳', unit: '枚', takesHomeDaily: true, group: 'parent_check' },
  { id: 'ic_card', name: 'ICカード', type: 'ic_card', required: 1, schedule: 'daily', icon: '💳', unit: '枚', takesHomeDaily: true, group: 'parent_check' },
];

export const dailyItems = clothingItems.filter(item => item.schedule === 'daily');
export const weeklyItems = clothingItems.filter(item => item.schedule !== 'daily');
