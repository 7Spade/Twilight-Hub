/**
 * @fileoverview A GitHub-style contribution heat map component.
 * It visualizes time-series data, showing activity levels over the past year.
 * Each day is represented by a colored square, with color intensity indicating
 * the activity count. It includes tooltips for detailed information on hover.
 */

'use client';

import React from 'react';
import { format, startOfWeek, addDays, differenceInDays, startOfDay } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface HeatMapData {
  date: Date;
  count: number;
}

interface HeatMapProps {
  data: HeatMapData[];
  endDate?: Date;
  numDays?: number;
}

const getColorClass = (count: number): string => {
  if (count === 0) return 'bg-muted/50';
  if (count <= 2) return 'bg-primary/20';
  if (count <= 5) return 'bg-primary/40';
  if (count <= 8) return 'bg-primary/70';
  return 'bg-primary';
};

const _weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// TODO: [P2] REFACTOR src/components/github-heat-map.tsx:39 - 清理未使用的變數
// 問題：'weekDays' 已定義但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的變數或添加下劃線前綴表示有意未使用
// @assignee frontend-team

export const GitHubHeatMap: React.FC<HeatMapProps> = ({
  data,
  endDate = new Date(),
  numDays = 365,
}) => {
  const startDate = addDays(endDate, -numDays + 1);
  const firstDay = startOfWeek(startDate);

  const days = Array.from({ length: numDays }, (_, i) => addDays(startDate, i));

  const dataMap = new Map<string, number>();
  data.forEach(item => {
    dataMap.set(format(startOfDay(item.date), 'yyyy-MM-dd'), item.count);
  });
  
  const totalWeeks = Math.ceil(differenceInDays(endDate, firstDay) / 7);

  const grid = Array.from({ length: 7 }, () => Array(totalWeeks).fill(null));
  
  days.forEach(day => {
      const weekIndex = Math.floor(differenceInDays(day, firstDay) / 7);
      const dayIndex = day.getDay();
      if(dayIndex < 7 && weekIndex < totalWeeks) {
          const dateString = format(day, 'yyyy-MM-dd');
          grid[dayIndex][weekIndex] = {
              date: day,
              count: dataMap.get(dateString) || 0,
          };
      }
  });

  const monthLabels = grid[0].reduce((acc: { label: string; index: number }[], week, index) => {
    if (week && week.date.getDate() <= 7) {
      const monthLabel = format(week.date, 'MMM');
      // Prevent duplicate month labels close to each other
      if (!acc.length || (acc[acc.length - 1].label !== monthLabel && index - acc[acc.length - 1].index > 3)) {
        acc.push({ label: monthLabel, index });
      }
    }
    return acc;
  }, []);

  return (
    <TooltipProvider>
      <div className="p-4 border rounded-lg bg-card text-card-foreground">
        <div className="flex flex-col gap-2">
            {/* Month Labels */}
             <div className="flex justify-start" style={{ paddingLeft: '2.5rem' }}>
                {monthLabels.map(({ label, index }) => (
                    <div
                    key={label}
                    className="text-xs text-muted-foreground"
                    style={{
                        position: 'absolute',
                        transform: `translateX(${index * 14}px)`,
                    }}
                    >
                    {label}
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                {/* Day Labels */}
                <div className="flex flex-col justify-between text-xs text-muted-foreground pt-3 pb-1">
                    <span className="h-3.5"></span> {/* Spacer */}
                    <span className="h-3.5">Mon</span>
                    <span className="h-3.5"></span> {/* Spacer */}
                    <span className="h-3.5">Wed</span>
                    <span className="h-3.5"></span> {/* Spacer */}
                    <span className="h-3.5">Fri</span>
                    <span className="h-3.5"></span> {/* Spacer */}
                </div>

                {/* Grid */}
                <div className="flex gap-0.5 overflow-x-auto">
                    {grid[0].map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-0.5">
                        {grid.map((dayRow, dayIndex) => {
                        const cell = dayRow[weekIndex];
                        if (!cell) {
                            return <div key={dayIndex} className="w-3 h-3 rounded-sm bg-transparent" />;
                        }
                        return (
                            <Tooltip key={dayIndex}>
                            <TooltipTrigger asChild>
                                <div
                                className={cn('w-3 h-3 rounded-sm', getColorClass(cell.count))}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{cell.count} contributions on {format(cell.date, 'PPP')}</p>
                            </TooltipContent>
                            </Tooltip>
                        );
                        })}
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
