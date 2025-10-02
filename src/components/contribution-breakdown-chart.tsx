/**
 * @fileoverview A presentational component that renders a radar chart for contribution breakdown.
 * It uses Recharts to display categorical data and adapts its colors based on the current theme.
 * It expects a `data` prop containing an array of { subject, value } objects.
 */

'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContributionData {
    subject: string;
    value: number;
}

interface ContributionBreakdownChartProps {
    data: ContributionData[];
}

export function ContributionBreakdownChart({ data }: ContributionBreakdownChartProps) {
    
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const formattedData = data.map(item => ({
      ...item,
      fullMark: 100, // Assuming percentage based
      value: total > 0 ? (item.value / total) * 100 : 0
  }));


  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
                <defs>
                    <radialGradient id="contributionGradient">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </radialGradient>
                </defs>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                    dataKey="subject" 
                    tick={({ payload, x, y, textAnchor, ...rest }) => {
                        const item = data.find(d => d.subject === payload.value);
                        const percentage = item ? ((item.value / total) * 100).toFixed(0) : 0;
                        return (
                            <text
                                {...rest}
                                y={y + (y - 150) * 0.1} // Adjust position slightly
                                x={x + (x - 150) * 0.1}
                                textAnchor={textAnchor}
                                fill="hsl(var(--muted-foreground))"
                                fontSize="12px"
                            >
                                <tspan x={x} dy="0em">{`${percentage}%`}</tspan>
                                <tspan x={x} dy="1.2em">{payload.value}</tspan>
                            </text>
                        );
                    }}
                />
                <Radar 
                    name="Contributions" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#contributionGradient)"
                    fillOpacity={0.6} 
                />
            </RadarChart>
        </ResponsiveContainer>
    </div>
  );
}
