import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'default' | 'emerald' | 'amber' | 'rose' | 'blue' | 'navy';
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  trend,
  onClick,
}) => {
  const { paletteInfo } = useTheme();

  const iconColorMap = {
    default: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    amber: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    rose: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
    blue: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    navy: 'text-blue-900 bg-blue-100/60 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.positive !== false
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtext && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg border ${iconColorMap[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
