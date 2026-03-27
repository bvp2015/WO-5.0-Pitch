import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  valueColor?: string;
  gradient?: string;
}

export function StatCard({ title, value, subtitle, trend, valueColor = "text-gray-900", gradient }: StatCardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 p-6 ${gradient || 'bg-white'}`}>
      <div className="mb-2">
        <h3 className={`text-sm font-bold ${gradient ? 'text-white/80' : 'text-gray-600'}`}>{title}</h3>
      </div>
      <div className="mb-1">
        <span className={`text-2xl font-bold ${gradient ? 'text-white' : valueColor}`}>{value}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${gradient ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</span>
        {trend && (
          <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}