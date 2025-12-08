import React from 'react';
import type { CapacityGrowth, Capacity, GrowthLevel } from '../../types/dashboard';
import { CapacityDescriptions, GrowthLevelNames } from '../../types/dashboard';

interface CapacityRadarProps {
  capacities: CapacityGrowth[];
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  interactive?: boolean;
  onCapacityClick?: (capacity: Capacity) => void;
}

const CapacityRadar: React.FC<CapacityRadarProps> = ({
  capacities,
  size = 'md',
  showLabels = true,
  interactive = false,
  onCapacityClick,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { width: 200, height: 200, labelOffset: 15, fontSize: 10 },
    md: { width: 300, height: 300, labelOffset: 25, fontSize: 12 },
    lg: { width: 400, height: 400, labelOffset: 35, fontSize: 14 },
  };

  const config = sizeConfig[size];
  const centerX = config.width / 2;
  const centerY = config.height / 2;
  const maxRadius = (Math.min(config.width, config.height) / 2) - config.labelOffset - 20;

  // Calculate position for each capacity point
  const getPointPosition = (index: number, level: GrowthLevel) => {
    const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2; // Start from top
    const radius = (level / 5) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Generate radar polygon points
  const capacityOrder: Capacity[] = ['curiosity', 'reasoning', 'focus', 'adaptability', 'collaboration', 'expression'];
  const orderedCapacities = capacityOrder.map(
    cap => capacities.find(c => c.capacity === cap) || { capacity: cap, currentLevel: 1 as GrowthLevel, lastUpdated: '', trend: 'stable' as const }
  );

  const polygonPoints = orderedCapacities
    .map((cap, i) => {
      const pos = getPointPosition(i, cap.currentLevel);
      return `${pos.x},${pos.y}`;
    })
    .join(' ');

  // Generate grid lines
  const gridLevels = [1, 2, 3, 4, 5];

  // Get capacity color
  const getCapacityColor = (capacity: Capacity): string => {
    const colors: Record<Capacity, string> = {
      curiosity: '#8B5CF6',     // Purple
      reasoning: '#3B82F6',     // Blue
      expression: '#EC4899',    // Pink
      focus: '#F59E0B',         // Amber
      collaboration: '#10B981', // Emerald
      adaptability: '#14B8A6',  // Teal
    };
    return colors[capacity];
  };

  // Get trend indicator
  const getTrendIndicator = (trend: 'improving' | 'stable' | 'needs-attention'): React.ReactNode => {
    switch (trend) {
      case 'improving':
        return <span className="text-green-500 ml-1">↑</span>;
      case 'needs-attention':
        return <span className="text-amber-500 ml-1">!</span>;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <svg width={config.width} height={config.height} className="overflow-visible">
        {/* Background grid */}
        <g className="text-gray-200">
          {/* Grid polygons */}
          {gridLevels.map((level) => {
            const points = capacityOrder
              .map((_, i) => {
                const pos = getPointPosition(i, level as GrowthLevel);
                return `${pos.x},${pos.y}`;
              })
              .join(' ');
            return (
              <polygon
                key={level}
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth={level === 5 ? 1.5 : 0.5}
                className={level === 5 ? 'text-gray-300' : 'text-gray-200'}
              />
            );
          })}

          {/* Axis lines */}
          {capacityOrder.map((_, i) => {
            const endPos = getPointPosition(i, 5);
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={endPos.x}
                y2={endPos.y}
                stroke="currentColor"
                strokeWidth={0.5}
              />
            );
          })}
        </g>

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="url(#radarGradient)"
          fillOpacity={0.3}
          stroke="url(#radarStroke)"
          strokeWidth={2.5}
          className="drop-shadow-sm"
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {/* Data points */}
        {orderedCapacities.map((cap, i) => {
          const pos = getPointPosition(i, cap.currentLevel);
          const color = getCapacityColor(cap.capacity);
          return (
            <g key={cap.capacity}>
              {/* Point */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={6}
                fill={color}
                stroke="white"
                strokeWidth={2}
                className={interactive ? 'cursor-pointer hover:r-8 transition-all' : ''}
                onClick={() => interactive && onCapacityClick?.(cap.capacity)}
              />
              {/* Pulse animation for improving */}
              {cap.trend === 'improving' && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={10}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  className="animate-ping opacity-50"
                />
              )}
            </g>
          );
        })}

        {/* Labels */}
        {showLabels && orderedCapacities.map((cap, i) => {
          const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
          const labelRadius = maxRadius + config.labelOffset;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          
          // Adjust text anchor based on position
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (x < centerX - 10) textAnchor = 'end';
          else if (x > centerX + 10) textAnchor = 'start';

          const color = getCapacityColor(cap.capacity);

          return (
            <g key={cap.capacity}>
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className={`font-semibold ${interactive ? 'cursor-pointer hover:opacity-80' : ''}`}
                style={{ fontSize: config.fontSize, fill: color }}
                onClick={() => interactive && onCapacityClick?.(cap.capacity)}
              >
                {CapacityDescriptions[cap.capacity].name}
              </text>
              <text
                x={x}
                y={y + config.fontSize + 2}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="fill-gray-500"
                style={{ fontSize: config.fontSize - 2 }}
              >
                Level {cap.currentLevel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      {showLabels && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {orderedCapacities.map((cap) => (
            <button
              key={cap.capacity}
              onClick={() => interactive && onCapacityClick?.(cap.capacity)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                interactive ? 'hover:opacity-80 cursor-pointer' : ''
              }`}
              style={{
                backgroundColor: `${getCapacityColor(cap.capacity)}15`,
                color: getCapacityColor(cap.capacity),
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getCapacityColor(cap.capacity) }}
              />
              {CapacityDescriptions[cap.capacity].name}
              {getTrendIndicator(cap.trend)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CapacityRadar;
