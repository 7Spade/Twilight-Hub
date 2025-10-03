import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TODO: [P2] PERF next.config.ts - 實現 Next.js 15 性能優化配置
  // 問題：未充分利用 Next.js 15 的性能優化特性
  // 影響：圖片載入性能差、bundle 大小過大
  // 建議：
  // 1) 啟用 optimizePackageImports 減少 bundle 大小
  // 2) 配置 bundlePagesRouterDependencies 優化依賴打包
  // 3) 添加 experimental.turbo 配置提升開發體驗
  // 4) 配置適當的圖片優化參數
  // @assignee performance-team
  // @deadline 2025-02-01
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
