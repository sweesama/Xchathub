/**
 * build-images.mjs — 构建时把 SVG 转换成 PNG
 *
 * 生成的文件：
 *   public/og-image.png       1200×630  社交分享预览图（Facebook/LinkedIn/微信兼容）
 *   public/icon-192.png        192×192  PWA 标准图标
 *   public/icon-512.png        512×512  PWA 大图标（启动画面）
 *   public/apple-touch-icon.png 180×180  iOS 添加到主屏幕图标
 *
 * 原理：用 Rust 写的 resvg 把 SVG 光栅化为 PNG（纯 Rust，无 node-gyp 坑）
 * 每次 `npm run build` 都会重新生成，零维护。
 */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

/** 把 SVG 文件渲染为 PNG */
function svgToPng(svgPath, outPath, width) {
  const svg = readFileSync(svgPath, 'utf-8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'rgba(0, 0, 0, 0)', // 透明背景（favicon 自身带圆角黑色背景）
  });
  const pngBuffer = resvg.render().asPng();
  // 确保输出目录存在
  const outDir = dirname(outPath);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, pngBuffer);
  console.log(`  ✓ ${outPath.replace(PUBLIC, 'public')}  (${width}px)`);
}

console.log('\n[build-images] Rendering PNG assets from SVG sources...');

// 1) 社交分享图：1200×630（Open Graph 标准）
svgToPng(
  join(PUBLIC, 'og-image.svg'),
  join(PUBLIC, 'og-image.png'),
  1200,
);

// 1b) Groups 目录专用 OG 卡
svgToPng(
  join(PUBLIC, 'og-groups.svg'),
  join(PUBLIC, 'og-groups.png'),
  1200,
);

// 2) PWA 图标（从 favicon.svg 生成）
svgToPng(join(PUBLIC, 'favicon.svg'), join(PUBLIC, 'icon-192.png'), 192);
svgToPng(join(PUBLIC, 'favicon.svg'), join(PUBLIC, 'icon-512.png'), 512);
svgToPng(join(PUBLIC, 'favicon.svg'), join(PUBLIC, 'apple-touch-icon.png'), 180);

console.log('[build-images] Done.\n');
