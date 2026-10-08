import React from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceFrameProps {
  type: DeviceType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  screenHeight?: string;
  onMaximize?: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  type,
  title,
  subtitle,
  children,
  isActive = false,
  className = '',
  screenHeight,
  onMaximize,
}) => {
  if (type === 'mobile') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {/* Device Shell */}
        <div
          className={`relative w-[340px] sm:w-[360px] h-[720px] bg-[#14181F] rounded-[44px] p-3 shadow-2xl transition-all duration-300 ${
            isActive ? 'ring-4 ring-[var(--brand-600)] scale-[1.01]' : 'ring-1 ring-black/10'
          }`}
        >
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1C1F26] border border-white/10" />
          </div>

          {/* Screen Container */}
          <div className="w-full h-full bg-[var(--bg)] rounded-[36px] overflow-hidden flex flex-col relative">
            {children}
          </div>
        </div>

        {/* Device Label */}
        <div className="mt-3 text-center">
          <div className="text-sm font-bold text-[var(--text)]">{title}</div>
          {subtitle && <div className="text-xs text-[var(--text-muted)]">{subtitle}</div>}
        </div>
      </div>
    );
  }

  if (type === 'tablet') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {/* Tablet Landscape Shell */}
        <div
          className={`relative w-[600px] lg:w-[680px] h-[460px] bg-[#1E222A] rounded-[28px] p-3.5 shadow-2xl transition-all duration-300 ${
            isActive ? 'ring-4 ring-[var(--brand-600)] scale-[1.01]' : 'ring-1 ring-black/10'
          }`}
        >
          {/* Camera Dot */}
          <div className="absolute top-1/2 left-2 -translate-y-1/2 w-2 h-2 rounded-full bg-black/60 border border-white/10 z-20" />

          {/* Screen */}
          <div className="w-full h-full bg-[var(--bg)] rounded-[20px] overflow-hidden flex flex-col relative">
            {children}
          </div>
        </div>

        {/* Device Label */}
        <div className="mt-3 text-center">
          <div className="text-sm font-bold text-[var(--text)]">{title}</div>
          {subtitle && <div className="text-xs text-[var(--text-muted)]">{subtitle}</div>}
        </div>
      </div>
    );
  }

  // Desktop / Monitor
  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      <div
        className={`w-full bg-[#E3E6EB] border border-[var(--border-strong)] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
          isActive ? 'ring-4 ring-[var(--brand-600)]' : ''
        }`}
      >
        {/* Window Chrome Bar */}
        <div className="h-9 bg-[#D5DAE1] px-4 flex items-center justify-between border-b border-[var(--border-strong)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ED6A5E] border border-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#F5BF4F] border border-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#62C554] border border-black/10" />
            <span className="ml-3 text-xs font-mono font-medium text-[var(--text-secondary)]">
              {title}
            </span>
          </div>
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] px-2 py-0.5 rounded cursor-pointer"
            >
              Fokus
            </button>
          )}
        </div>

        {/* Screen */}
        <div className={`w-full ${screenHeight || 'h-[520px]'} bg-[var(--bg)] overflow-auto`}>{children}</div>
      </div>

      {/* Device Label */}
      <div className="mt-2 text-center">
        <div className="text-sm font-bold text-[var(--text)]">{title}</div>
        {subtitle && <div className="text-xs text-[var(--text-muted)]">{subtitle}</div>}
      </div>
    </div>
  );
};
