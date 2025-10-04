'use client';

import { useState } from 'react';
import { HashAvatar, IdenticonAvatar, InitialsAvatar, BotAvatar, CustomHashAvatar } from '@/components/ui/hash-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AvatarDemo() {
  const [seed, setSeed] = useState('Twilight Hub');
  const [size, setSize] = useState(64);

  const sampleSeeds = [
    'Twilight Hub',
    'user@example.com',
    'John Doe',
    'Alice Smith',
    'Developer',
    'Designer',
    'Manager',
    'Admin'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>哈希值頭像生成器</CardTitle>
          <CardDescription>
            類似 GitHub 的 identicon 功能，根據輸入字符串生成唯一的頭像
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 輸入控制 */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">種子字符串</label>
              <Input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="輸入用戶名、郵箱等..."
                className="mt-1"
              />
            </div>
            <div className="w-32">
              <label className="text-sm font-medium">尺寸</label>
              <Input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min="20"
                max="200"
                className="mt-1"
              />
            </div>
          </div>

          {/* 快速選擇 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">快速選擇</label>
            <div className="flex flex-wrap gap-2">
              {sampleSeeds.map((sampleSeed) => (
                <Button
                  key={sampleSeed}
                  variant={seed === sampleSeed ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSeed(sampleSeed)}
                >
                  {sampleSeed}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 頭像展示 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* DiceBear Identicon */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">DiceBear Identicon</CardTitle>
            <CardDescription>
              類似 GitHub 的經典 identicon 風格
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <IdenticonAvatar 
                seed={seed} 
                size={size}
                className="border-2 border-border"
              />
            </div>
            <Badge variant="secondary">DiceBear API</Badge>
          </CardContent>
        </Card>

        {/* 字母頭像 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">字母頭像</CardTitle>
            <CardDescription>
              基於姓名首字母的簡潔設計
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <InitialsAvatar 
                seed={seed} 
                size={size}
                className="border-2 border-border"
              />
            </div>
            <Badge variant="secondary">DiceBear API</Badge>
          </CardContent>
        </Card>

        {/* 機器人頭像 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">機器人頭像</CardTitle>
            <CardDescription>
              可愛的機器人風格頭像
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <BotAvatar 
                seed={seed} 
                size={size}
                className="border-2 border-border"
              />
            </div>
            <Badge variant="secondary">DiceBear API</Badge>
          </CardContent>
        </Card>

        {/* 自定義哈希頭像 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">自定義哈希頭像</CardTitle>
            <CardDescription>
              完全自定義的哈希值生成頭像
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <CustomHashAvatar 
                seed={seed} 
                size={size}
                className="border-2 border-border"
              />
            </div>
            <Badge variant="outline">本地生成</Badge>
          </CardContent>
        </Card>

        {/* 通用頭像組件 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">通用頭像</CardTitle>
            <CardDescription>
              可配置的多種風格頭像
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <HashAvatar 
                seed={seed} 
                size={size}
                provider="dicebear"
                style="avataaars"
                className="border-2 border-border"
              />
            </div>
            <Badge variant="secondary">Avataaars 風格</Badge>
          </CardContent>
        </Card>

        {/* 多尺寸展示 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">多尺寸展示</CardTitle>
            <CardDescription>
              同一種子在不同尺寸下的效果
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center items-center gap-4">
              <IdenticonAvatar seed={seed} size={32} />
              <IdenticonAvatar seed={seed} size={48} />
              <IdenticonAvatar seed={seed} size={64} />
              <IdenticonAvatar seed={seed} size={80} />
            </div>
            <Badge variant="secondary">響應式設計</Badge>
          </CardContent>
        </Card>
      </div>

      {/* 技術說明 */}
      <Card>
        <CardHeader>
          <CardTitle>技術實現</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">DiceBear API</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 專業的頭像生成服務</li>
                <li>• 多種風格選擇</li>
                <li>• 基於種子的確定性生成</li>
                <li>• 免費使用，無需 API Key</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">自定義哈希生成</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 本地生成，無需外部 API</li>
                <li>• 使用 SHA-256 哈希算法</li>
                <li>• 對稱的 5x5 網格設計</li>
                <li>• 完全可控的顏色和樣式</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
