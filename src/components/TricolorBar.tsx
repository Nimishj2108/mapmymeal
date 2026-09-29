import React from 'react';

export const TricolorBar: React.FC<{ height?: string; className?: string }> = ({
  height = 'h-1.5',
  className = ''
}) => {
  return (
    <div className={`w-full grid grid-cols-3 ${height} ${className}`} aria-hidden="true">
      <div className="bg-[#FF9933]" />
      <div className="bg-[#FFFFFF]" />
      <div className="bg-[#138808]" />
    </div>
  );
};
