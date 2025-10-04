/**
 * 哈希值生成頭像工具
 * 類似 GitHub 的 identicon 功能
 */

import { createHash } from 'crypto';

export interface HashAvatarOptions {
  size?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  gridSize?: number;
}

export interface HashAvatarResult {
  svg: string;
  dataUrl: string;
  hash: string;
}

/**
 * 生成基於哈希值的 SVG 頭像
 * @param seed 輸入字符串（如用戶名、郵箱等）
 * @param options 配置選項
 * @returns SVG 字符串和數據 URL
 */
export function generateHashAvatar(
  seed: string,
  options: HashAvatarOptions = {}
): HashAvatarResult {
  const {
    size = 64,
    backgroundColor = '#f0f0f0',
    foregroundColor = '#333',
    gridSize = 5
  } = options;

  // 生成哈希值
  const hash = createHash('sha256').update(seed).digest('hex');
  
  // 從哈希值提取顏色
  const color = hashToColor(hash);
  
  // 生成對稱的 5x5 網格圖案
  const pattern = generatePattern(hash, gridSize);
  
  // 生成 SVG
  const svg = generateSVG(pattern, color, backgroundColor, size, gridSize);
  
  // 生成數據 URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
  
  return {
    svg,
    dataUrl,
    hash
  };
}

/**
 * 從哈希值生成顏色
 */
function hashToColor(hash: string): string {
  // 取哈希值的前 6 位作為顏色
  const colorHex = hash.substring(0, 6);
  return `#${colorHex}`;
}

/**
 * 生成對稱的網格圖案
 */
function generatePattern(hash: string, gridSize: number): boolean[][] {
  const pattern: boolean[][] = [];
  
  // 初始化網格
  for (let i = 0; i < gridSize; i++) {
    pattern[i] = new Array(gridSize).fill(false);
  }
  
  // 使用哈希值填充圖案
  const hashBytes = hash.match(/.{2}/g) || [];
  
  for (let y = 0; y < gridSize; y++) {
    const hashByte = parseInt(hashBytes[y % hashBytes.length], 16);
    
    for (let x = 0; x < Math.ceil(gridSize / 2); x++) {
      const bit = (hashByte >> x) & 1;
      if (bit === 1) {
        // 設置左側
        pattern[y][x] = true;
        // 設置右側（對稱）
        pattern[y][gridSize - 1 - x] = true;
      }
    }
  }
  
  return pattern;
}

/**
 * 生成 SVG 字符串
 */
function generateSVG(
  pattern: boolean[][],
  foregroundColor: string,
  backgroundColor: string,
  size: number,
  gridSize: number
): string {
  const cellSize = size / gridSize;
  const svgElements: string[] = [];
  
  // 背景
  svgElements.push(
    `<rect width="${size}" height="${size}" fill="${backgroundColor}" />`
  );
  
  // 圖案
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (pattern[y][x]) {
        const rectX = x * cellSize;
        const rectY = y * cellSize;
        svgElements.push(
          `<rect x="${rectX}" y="${rectY}" width="${cellSize}" height="${cellSize}" fill="${foregroundColor}" />`
        );
      }
    }
  }
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      ${svgElements.join('')}
    </svg>
  `.trim();
}

/**
 * 使用 DiceBear API 生成頭像
 * 這是一個更專業的解決方案
 */
export function generateDiceBearAvatar(
  seed: string,
  style: 'identicon' | 'initials' | 'bottts' | 'avataaars' | 'micah' = 'identicon'
): string {
  const baseUrl = 'https://api.dicebear.com/6.x';
  return `${baseUrl}/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * 使用 Multiavatar 生成頭像
 * 支持多文化頭像生成
 */
export function generateMultiavatar(seed: string): string {
  // 由於 Multiavatar 是客戶端庫，這裡返回 API URL
  // 實際使用時需要安裝 multiavatar 包
  return `https://api.multiavatar.com/${encodeURIComponent(seed)}.svg`;
}

/**
 * 組合函數：智能選擇最佳頭像生成方式
 */
export function generateAvatar(
  seed: string,
  options: HashAvatarOptions & { 
    provider?: 'hash' | 'dicebear' | 'multiavatar';
    style?: string;
  } = {}
): HashAvatarResult | string {
  const { provider = 'hash', style = 'identicon', ...hashOptions } = options;
  
  switch (provider) {
    case 'dicebear':
      return generateDiceBearAvatar(seed, style as any);
    case 'multiavatar':
      return generateMultiavatar(seed);
    case 'hash':
    default:
      return generateHashAvatar(seed, hashOptions);
  }
}
