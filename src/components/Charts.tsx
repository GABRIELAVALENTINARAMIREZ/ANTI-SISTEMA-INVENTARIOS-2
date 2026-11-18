import React, { useState } from 'react';
import { formatCOP } from '../utils/formatters';

interface MovementSeriesItem {
  dia: string;
  entradas: number;
  salidas: number;
}

export const MovementsBarChart: React.FC<{ data: MovementSeriesItem[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.flatMap((d) => [d.entradas, d.salidas]), 100000);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-5 text-xs font-medium text-neutral-600 dark:text-neutral-400 print-text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#FF6B35] inline-block" />
            Entradas (Compras)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#E63946] inline-block" />
            Salidas (Consumo / Ventas)
          </span>
        </div>
        {hoveredIdx !== null && (
          <div className="text-xs font-mono tabular-nums text-neutral-700 dark:text-neutral-200">
            {data[hoveredIdx].dia}: +{formatCOP(data[hoveredIdx].entradas)} / -
            {formatCOP(data[hoveredIdx].salidas)}
          </div>
        )}
      </div>

      <div className="relative h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        {/* Horizontal subtle grid lines */}
        <div className="absolute inset-0 top-6 bottom-2 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((line) => (
            <div
              key={line}
              className="w-full border-t border-dashed border-neutral-200/80 dark:border-neutral-800/80"
            />
          ))}
        </div>

        {data.map((item, idx) => {
          const hEnt = Math.max((item.entradas / maxVal) * 100, 4);
          const hSal = Math.max((item.salidas / maxVal) * 100, 4);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.dia}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer z-10"
            >
              {isHovered && (
                <div className="absolute -top-2 bg-[#1D1D1F] dark:bg-neutral-100 text-white dark:text-[#1D1D1F] text-[11px] font-mono tabular-nums px-2 py-1 rounded shadow-md whitespace-nowrap z-20 pointer-events-none">
                  E: {formatCOP(item.entradas)} · S: {formatCOP(item.salidas)}
                </div>
              )}
              <div className="w-full max-w-[44px] h-full flex items-end justify-center gap-1.5">
                <div
                  style={{ height: `${hEnt}%` }}
                  className={`w-1/2 rounded-t transition-opacity duration-150 bg-[#FF6B35] ${
                    hoveredIdx !== null && !isHovered ? 'opacity-45' : 'opacity-100'
                  }`}
                />
                <div
                  style={{ height: `${hSal}%` }}
                  className={`w-1/2 rounded-t transition-opacity duration-150 bg-[#E63946] ${
                    hoveredIdx !== null && !isHovered ? 'opacity-45' : 'opacity-100'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-4 pt-2">
        {data.map((item, idx) => (
          <div
            key={item.dia}
            className={`flex-1 text-center text-xs font-medium transition-colors print-text-muted ${
              hoveredIdx === idx
                ? 'text-[#1D1D1F] dark:text-white font-semibold'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {item.dia}
          </div>
        ))}
      </div>
    </div>
  );
};

export interface DonutSlice {
  id: string;
  label: string;
  value: number;
  color: string;
}

export const CategoryDonutChart: React.FC<{
  slices: DonutSlice[];
  centerLabel?: string;
}> = ({ slices, centerLabel = 'Valor total' }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;
  const activeSlice = slices.find((s) => s.id === activeId);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          {slices.map((slice) => {
            const fraction = slice.value / total;
            const dashLength = fraction * circumference;
            const dashOffset = -cumulativeOffset;
            cumulativeOffset += dashLength;
            const isActive = activeId === slice.id;

            return (
              <circle
                key={slice.id}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isActive ? 24 : 20}
                strokeDasharray={`${Math.max(dashLength - 2, 1)} ${circumference}`}
                strokeDashoffset={dashOffset}
                onMouseEnter={() => setActiveId(slice.id)}
                onMouseLeave={() => setActiveId(null)}
                className="cursor-pointer transition-all duration-150"
                style={{
                  opacity: activeId && !isActive ? 0.35 : 1,
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate max-w-[104px] print-text-muted">
            {activeSlice ? activeSlice.label : centerLabel}
          </span>
          <span className="text-sm font-bold font-mono tabular-nums text-[#1D1D1F] dark:text-white mt-0.5 print-text-main">
            {activeSlice
              ? `${Math.round((activeSlice.value / total) * 100)}%`
              : formatCOP(total)}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {slices.slice(0, 6).map((slice) => {
          const pct = Math.round((slice.value / total) * 100);
          const isActive = activeId === slice.id;
          return (
            <div
              key={slice.id}
              onMouseEnter={() => setActiveId(slice.id)}
              onMouseLeave={() => setActiveId(null)}
              className={`flex items-center justify-between text-xs py-1 px-2 rounded-md cursor-pointer transition-colors ${
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-neutral-700 dark:text-neutral-300 truncate print-text-main">
                  {slice.label}
                </span>
              </div>
              <span className="font-mono tabular-nums text-neutral-600 dark:text-neutral-400 shrink-0 ml-2 print-text-muted">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
