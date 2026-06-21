import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon?: React.ReactNode;
  progress?: number;
  color?: 'teal' | 'blue' | 'pink' | 'purple' | 'orange';
}

const colorMap = {
  teal: 'from-teal-400 to-teal-300 shadow-teal-500/30',
  blue: 'from-blue-400 to-blue-300 shadow-blue-500/30',
  pink: 'from-pink-400 to-pink-300 shadow-pink-500/30',
  purple: 'from-purple-400 to-purple-300 shadow-purple-500/30',
  orange: 'from-orange-500 to-orange-400 shadow-orange-500/30'
};

const StatCard: React.FC<StatCardProps> = ({ label, value, subLabel, icon, progress, color = 'blue' }) => {
  const gradientClass = colorMap[color];

  return (
    <div className={`bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg p-6 flex flex-col relative overflow-hidden text-white`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white/90 font-medium text-sm md:text-base">{label}</h3>
        {icon && <div className="text-3xl opacity-80">{icon}</div>}
      </div>
      <div className="text-4xl font-bold mb-2">{value}</div>
      {subLabel && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold w-max mt-2">
          {subLabel}
        </div>
      )}
      
      {progress !== undefined && (
        <div className="w-full bg-white/20 rounded-full h-1.5 mt-4">
          <div 
            className="bg-white h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
