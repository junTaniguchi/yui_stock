import { ClothingItem } from '../types';

export const clothingItems: ClothingItem[] = [
  // 🎒 毎日持っていくもの
  { id: 'backpack', name: '通園カバン', type: 'backpack', required: 1, schedule: 'daily', icon: '🎒', unit: '個', takesHomeDaily: true },
  { id: 'hat', name: '帽子', type: 'hat', required: 1, schedule: 'daily', icon: '🧢', unit: '個', takesHomeDaily: true },
  { id: 'cup', name: 'コップ', type: 'cup', required: 1, schedule: 'daily', icon: '🥛', unit: '個', takesHomeDaily: true },
  { id: 'water_bottle', name: '水筒', type: 'water_bottle', required: 1, schedule: 'daily', icon: '🚰', unit: '個', takesHomeDaily: true },
  { id: 'loop_towel', name: 'ループタオル', type: 'loop_towel', required: 1, schedule: 'daily', icon: '🧻', unit: '枚', takesHomeDaily: true },
  { id: 'ic_tag', name: 'ICタグ', type: 'ic_tag', required: 1, schedule: 'daily', icon: '🏷️', unit: '個', takesHomeDaily: true },

  // 🍱 お弁当の日
  { id: 'bento', name: 'お弁当', type: 'bento', required: 1, schedule: 'daily', icon: '🍱', unit: '個', takesHomeDaily: true },
  { id: 'utensils', name: '食具', type: 'utensils', required: 1, schedule: 'daily', icon: '🍴', unit: 'セット', takesHomeDaily: true },

  // 👕 ロッカー保管（着替え一式・袋・靴）
  { id: 'long_sleeve', name: '長袖', type: 'long_sleeve', required: 3, schedule: 'daily', icon: '👔', unit: '枚' },
  { id: 'short_sleeve', name: '半袖', type: 'short_sleeve', required: 3, schedule: 'daily', icon: '👕', unit: '枚' },
  { id: 'underwear', name: '肌着', type: 'underwear', required: 3, schedule: 'daily', icon: '🎽', unit: '枚' },
  { id: 'pants', name: 'ズボン', type: 'pants', required: 3, schedule: 'daily', icon: '👖', unit: '枚' },
  { id: 'plastic_bag', name: '汚れ物袋', type: 'plastic_bag', required: 3, schedule: 'daily', icon: '🛍️', unit: '枚' },
  { id: 'shoes', name: '上履き', type: 'shoes', required: 1, schedule: 'daily', icon: '👟', unit: '足' },

  // 👨‍👩‍👧 親の持ち物
  { id: 'slippers', name: 'スリッパ', type: 'slippers', required: 1, schedule: 'daily', icon: '🩴', unit: '足', takesHomeDaily: true },
  { id: 'security_card', name: '防犯カード', type: 'security_card', required: 1, schedule: 'daily', icon: '💳', unit: '枚', takesHomeDaily: true },
  { id: 'ic_card', name: 'ICカード', type: 'ic_card', required: 1, schedule: 'daily', icon: '💳', unit: '枚', takesHomeDaily: true },
];

export const dailyItems = clothingItems.filter(item => item.schedule === 'daily');
export const weeklyItems = clothingItems.filter(item => item.schedule !== 'daily');
