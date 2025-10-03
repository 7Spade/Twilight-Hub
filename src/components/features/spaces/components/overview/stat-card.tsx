'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
/* TODO: [P2] [CLEANUP] [UI] [TODO] 清理未使用的導入 - LucideIcon 未使用 */
import { cn } from '@/lib/utils';
import { StatCardProps } from './types';
import { useState, useEffect } from 'react';

/**
 * ?�代?��??��??��?组件
 * ?��??�画?��??��??��?示器?�交互�???
 */
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  color = 'blue',
  format = 'number',
  isLoading = false,
  onClick,
  className
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  // ?�画?��?
  useEffect(() => {
    setIsVisible(true);
    if (typeof value === 'number' && format === 'number') {
      const duration = 1000;
      const steps = 30;
      const stepValue = value / steps;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        setAnimatedValue(Math.min(stepValue * currentStep, value));
        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedValue(value);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setAnimatedValue(value as number);
    }
  }, [value, format]);

  // 颜色主�??�置
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-500'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-500'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-500'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'text-purple-500'
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-950/20',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-800',
      icon: 'text-gray-500'
    }
  };

  const theme = colorConfig[color];

  // ?��??�数?�显�?
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val}%`;
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'number':
        return val.toLocaleString();
      default:
        return val.toString();
    }
  };

  // 趋势?��?
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  if (isLoading) {
    return (
      <Card className={cn("transition-all duration-200", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
          <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "group transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer",
        onClick && "hover:border-primary/50",
        theme.border,
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn("p-2 rounded-lg", theme.bg)}>
            <Icon className={cn("h-4 w-4", theme.icon)} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {format === 'number' && typeof value === 'number' ? animatedValue.toLocaleString() : formatValue(value)}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        )}
        
        {trend && (
          <div className="flex items-center mt-3">
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs px-2 py-1 flex items-center gap-1",
                trend.isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : 
                trend.value === 0 ? "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400" :
                "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              )}
            >
              {getTrendIcon()}
              {trend.value === 0 ? '0%' : `${trend.isPositive ? '+' : ''}${trend.value}%`}
            </Badge>
            <span className="text-xs text-muted-foreground ml-2">
              vs {trend.period || 'last month'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
