/**
 * @fileoverview A presentational component that renders an area chart for activity overview.
 * It uses Recharts to display time-series data and adapts its colors based on the current theme.
 * It expects a `data` prop containing an array of { date, count } objects.
 */

'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from 'next-themes';

interface ActivityData {
    date: string;
    count: number;
}

interface ActivityOverviewChartProps {
    data: ActivityData[];
}

export function ActivityOverviewChart({ data }: ActivityOverviewChartProps) {
    const { theme } = useTheme();

    const chartColor = theme === 'dark' ? '#34d399' : '#10b981'; // emerald-400 and emerald-500
    const gradientStartColor = theme === 'dark' ? '#10b981' : '#6ee7b7'; // emerald-500 and emerald-300
    
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={gradientStartColor} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={gradientStartColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis 
                        dataKey="date" 
                        tickFormatter={(str) => {
                            const date = new Date(str);
                             if (date.getDate() === 1) {
                                return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
                            }
                            return '';
                        }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))'
                        }}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area type="monotone" dataKey="count" stroke={chartColor} fill="url(#colorActivity)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
