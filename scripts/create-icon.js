const fs = require('fs');
const path = require('path');

// SVGアイコンを作成する関数
function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffeaa7"/>
      <stop offset="70%" style="stop-color:#fab1a0"/>
      <stop offset="100%" style="stop-color:#fd79a8"/>
    </radialGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${size * 0.1}"/>
  
  <!-- カバン本体 -->
  <rect x="${size * 0.3}" y="${size * 0.45}" width="${size * 0.4}" height="${size * 0.35}" fill="#8B4513" rx="${size * 0.02}"/>
  
  <!-- カバンの蓋 -->
  <rect x="${size * 0.28}" y="${size * 0.4}" width="${size * 0.44}" height="${size * 0.15}" fill="#A0522D" rx="${size * 0.02}"/>
  
  <!-- カバンの取っ手 -->
  <path d="M ${size * 0.42} ${size * 0.35} Q ${size * 0.5} ${size * 0.25} ${size * 0.58} ${size * 0.35}" 
        stroke="#654321" stroke-width="${size * 0.02}" fill="none" stroke-linecap="round"/>
  
  <!-- カバンの金具 -->
  <rect x="${size * 0.47}" y="${size * 0.47}" width="${size * 0.06}" height="${size * 0.03}" fill="#FFD700" rx="${size * 0.01}"/>
  
  <!-- 大きな桜の花（メイン） -->
  <g transform="translate(${size * 0.5}, ${size * 0.15})">
    <g transform="rotate(0)">
      <ellipse cx="0" cy="${-size * 0.075}" rx="${size * 0.025}" ry="${size * 0.05}" fill="#FF69B4"/>
    </g>
    <g transform="rotate(72)">
      <ellipse cx="0" cy="${-size * 0.075}" rx="${size * 0.025}" ry="${size * 0.05}" fill="#FF69B4"/>
    </g>
    <g transform="rotate(144)">
      <ellipse cx="0" cy="${-size * 0.075}" rx="${size * 0.025}" ry="${size * 0.05}" fill="#FF69B4"/>
    </g>
    <g transform="rotate(216)">
      <ellipse cx="0" cy="${-size * 0.075}" rx="${size * 0.025}" ry="${size * 0.05}" fill="#FF69B4"/>
    </g>
    <g transform="rotate(288)">
      <ellipse cx="0" cy="${-size * 0.075}" rx="${size * 0.025}" ry="${size * 0.05}" fill="#FF69B4"/>
    </g>
    <circle cx="0" cy="0" r="${size * 0.012}" fill="#FFD700"/>
  </g>
  
  <!-- 小さな桜の花1 -->
  <g transform="translate(${size * 0.2}, ${size * 0.25})">
    <g transform="rotate(0)">
      <ellipse cx="0" cy="${-size * 0.03}" rx="${size * 0.015}" ry="${size * 0.03}" fill="#FFB6C1"/>
    </g>
    <g transform="rotate(72)">
      <ellipse cx="0" cy="${-size * 0.03}" rx="${size * 0.015}" ry="${size * 0.03}" fill="#FFB6C1"/>
    </g>
    <g transform="rotate(144)">
      <ellipse cx="0" cy="${-size * 0.03}" rx="${size * 0.015}" ry="${size * 0.03}" fill="#FFB6C1"/>
    </g>
    <g transform="rotate(216)">
      <ellipse cx="0" cy="${-size * 0.03}" rx="${size * 0.015}" ry="${size * 0.03}" fill="#FFB6C1"/>
    </g>
    <g transform="rotate(288)">
      <ellipse cx="0" cy="${-size * 0.03}" rx="${size * 0.015}" ry="${size * 0.03}" fill="#FFB6C1"/>
    </g>
    <circle cx="0" cy="0" r="${size * 0.008}" fill="#FFD700"/>
  </g>
  
  <!-- 小さな桜の花2 -->
  <g transform="translate(${size * 0.8}, ${size * 0.2})">
    <g transform="rotate(36)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFC0CB"/>
    </g>
    <g transform="rotate(108)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFC0CB"/>
    </g>
    <g transform="rotate(180)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFC0CB"/>
    </g>
    <g transform="rotate(252)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFC0CB"/>
    </g>
    <g transform="rotate(324)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFC0CB"/>
    </g>
    <circle cx="0" cy="0" r="${size * 0.006}" fill="#FFD700"/>
  </g>
  
  <!-- 小さな桜の花3 -->
  <g transform="translate(${size * 0.15}, ${size * 0.75})">
    <g transform="rotate(0)">
      <ellipse cx="0" cy="${-size * 0.02}" rx="${size * 0.01}" ry="${size * 0.02}" fill="#FFCCCB"/>
    </g>
    <g transform="rotate(72)">
      <ellipse cx="0" cy="${-size * 0.02}" rx="${size * 0.01}" ry="${size * 0.02}" fill="#FFCCCB"/>
    </g>
    <g transform="rotate(144)">
      <ellipse cx="0" cy="${-size * 0.02}" rx="${size * 0.01}" ry="${size * 0.02}" fill="#FFCCCB"/>
    </g>
    <g transform="rotate(216)">
      <ellipse cx="0" cy="${-size * 0.02}" rx="${size * 0.01}" ry="${size * 0.02}" fill="#FFCCCB"/>
    </g>
    <g transform="rotate(288)">
      <ellipse cx="0" cy="${-size * 0.02}" rx="${size * 0.01}" ry="${size * 0.02}" fill="#FFCCCB"/>
    </g>
    <circle cx="0" cy="0" r="${size * 0.005}" fill="#FFD700"/>
  </g>
  
  <!-- 小さな桜の花4 -->
  <g transform="translate(${size * 0.85}, ${size * 0.75})">
    <g transform="rotate(18)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFB6C1"/>
    </g>
    <g transform="rotate(90)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFB6C1"/>
    </g>
    <g transform="rotate(162)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFB6C1"/>
    </g>
    <g transform="rotate(234)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFB6C1"/>
    </g>
    <g transform="rotate(306)">
      <ellipse cx="0" cy="${-size * 0.025}" rx="${size * 0.012}" ry="${size * 0.025}" fill="#FFB6C1"/>
    </g>
    <circle cx="0" cy="0" r="${size * 0.006}" fill="#FFD700"/>
  </g>
  
  <!-- 葉っぱ -->
  <ellipse cx="${size * 0.25}" cy="${size * 0.35}" rx="${size * 0.015}" ry="${size * 0.01}" fill="#90EE90" transform="rotate(45 ${size * 0.25} ${size * 0.35})"/>
  <ellipse cx="${size * 0.75}" cy="${size * 0.3}" rx="${size * 0.012}" ry="${size * 0.008}" fill="#90EE90" transform="rotate(-45 ${size * 0.75} ${size * 0.3})"/>
</svg>`;
}

// 各サイズのSVGアイコンを生成
const sizes = [32, 192, 512];
const publicDir = path.join(__dirname, '..', 'public');

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const filename = size === 32 ? 'favicon.svg' : `logo${size}.svg`;
  fs.writeFileSync(path.join(publicDir, filename), svg);
  console.log(`Created ${filename}`);
});

console.log('SVG icons created successfully!');
console.log('Next steps:');
console.log('1. Convert SVG to PNG using online tools or design software');
console.log('2. Replace the existing logo192.png and logo512.png files');
console.log('3. Create a new favicon.ico from the 32x32 version');