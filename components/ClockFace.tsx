import React, { useMemo, useRef, useState } from 'react';

interface ClockFaceProps {
  totalMinutes: number;
  onTimeChange?: (minutes: number) => void;
  isInteractive?: boolean;
}

export const ClockFace: React.FC<ClockFaceProps> = ({ totalMinutes, onTimeChange, isInteractive = true }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingHand, setDraggingHand] = useState<'hour' | 'minute' | null>(null);
  const lastAngleRef = useRef<number>(0);

  // Time calculations
  const normalizedMinutes = totalMinutes % (24 * 60);
  const hours = normalizedMinutes / 60; // Float
  const minutes = normalizedMinutes % 60;

  // Angles
  // Hour hand: 12h = 360deg -> 1h = 30deg.
  const hourAngle = (hours % 12) * 30;
  // Minute hand: 60m = 360deg -> 1m = 6deg.
  const minuteAngle = minutes * 6;

  const getPointerAngle = (clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    
    // atan2 returns angle from -PI to PI, 0 is at 3 o'clock
    let rad = Math.atan2(dy, dx);
    let deg = rad * (180 / Math.PI);
    
    // Convert to clock coordinates: 0 at 12 o'clock, clockwise
    let clockDeg = deg + 90;
    if (clockDeg < 0) clockDeg += 360;
    return clockDeg;
  };

  const handlePointerDown = (e: React.PointerEvent, handType: 'hour' | 'minute' | 'bg') => {
    if (!isInteractive || !onTimeChange) return;
    
    e.preventDefault();
    e.stopPropagation();

    const angle = getPointerAngle(e.clientX, e.clientY);
    lastAngleRef.current = angle;
    
    // If background is clicked, default to minute hand (standard clock interaction)
    const targetHand = handType === 'bg' ? 'minute' : handType;
    setDraggingHand(targetHand);
    
    // Capture pointer to track movement even if cursor leaves the element
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingHand || !onTimeChange) return;
    e.preventDefault();

    const currentAngle = getPointerAngle(e.clientX, e.clientY);
    let delta = currentAngle - lastAngleRef.current;

    // Handle wrapping across 0/360 boundary
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // Update last angle
    lastAngleRef.current = currentAngle;

    let minuteChange = 0;
    if (draggingHand === 'minute') {
        // Minute hand: 360 deg = 60 min -> 6 deg = 1 min
        minuteChange = delta / 6;
    } else {
        // Hour hand: 360 deg = 12 hours = 720 min -> 30 deg = 60 min -> 0.5 deg = 1 min
        // Wait: delta is in degrees.
        // If I move 1 degree on hour hand...
        // 30 degrees = 60 minutes
        // 1 degree = 2 minutes
        minuteChange = delta * 2;
    }
    
    onTimeChange(totalMinutes + minuteChange);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingHand && onTimeChange) {
        // Optional: snap to nearest minute on release
        onTimeChange(Math.round(totalMinutes));
    }
    setDraggingHand(null);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  // Generate ticks
  const ticks = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const isHour = i % 5 === 0;
      const angle = i * 6;
      return (
        <line
          key={i}
          x1="100"
          y1={isHour ? 10 : 12}
          x2="100"
          y2={isHour ? 22 : 18}
          transform={`rotate(${angle} 100 100)`}
          stroke={isHour ? '#334155' : '#94a3b8'}
          strokeWidth={isHour ? 3 : 1.5}
          strokeLinecap="round"
        />
      );
    });
  }, []);

  // Numbers 1-12
  const numbers = useMemo(() => {
    return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
      const angle = num * 30; 
      const r = 72; // Radius for numbers
      const rad = (angle - 90) * (Math.PI / 180);
      const x = 100 + r * Math.cos(rad);
      const y = 100 + r * Math.sin(rad);

      return (
        <text
          key={num}
          x={x}
          y={y}
          dy="0.35em"
          textAnchor="middle"
          className="text-xl font-bold fill-slate-700 select-none pointer-events-none"
        >
          {num}
        </text>
      );
    });
  }, []);

  // 24 Hour inner numbers
  const numbers24 = useMemo(() => {
    return [24, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((num) => {
      const displayNum = num === 24 ? '00' : num;
      const angle = (num % 12 || 12) * 30;
      const r = 48; // Smaller radius
      const rad = (angle - 90) * (Math.PI / 180);
      const x = 100 + r * Math.cos(rad);
      const y = 100 + r * Math.sin(rad);

      return (
        <text
          key={num}
          x={x}
          y={y}
          dy="0.35em"
          textAnchor="middle"
          className="text-[10px] font-medium fill-slate-400 select-none pointer-events-none"
        >
          {displayNum}
        </text>
      );
    });
  }, []);

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto drop-shadow-2xl">
      <svg 
        ref={svgRef}
        viewBox="0 0 200 200" 
        className={`w-full h-full bg-white rounded-full border-8 border-slate-800 ${isInteractive ? 'cursor-default' : ''} touch-none`}
        onPointerDown={(e) => handlePointerDown(e, 'bg')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Face Background */}
        <circle cx="100" cy="100" r="95" fill="white" />
        
        {/* Ticks & Numbers */}
        {ticks}
        {numbers}
        {numbers24}

        {/* Hour Hand Group */}
        {/* Use SVG transform attribute directly for best reliability */}
        <g 
            transform={`rotate(${hourAngle} 100 100)`}
            className={`${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onPointerDown={(e) => handlePointerDown(e, 'hour')}
        >
           {/* Invisible hit area (Thicker for easier grabbing) */}
           <path d="M100 100 L100 50" stroke="transparent" strokeWidth="25" strokeLinecap="round" />
           
           {/* Visual Hour Hand (Red, Short, Thick) */}
           <path d="M100 100 L100 55" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
           <path d="M100 100 L100 110" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* Minute Hand Group */}
        <g 
            transform={`rotate(${minuteAngle} 100 100)`} 
            className={`${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onPointerDown={(e) => handlePointerDown(e, 'minute')}
        >
           {/* Invisible hit area (Thicker) */}
           <path d="M100 100 L100 30" stroke="transparent" strokeWidth="25" strokeLinecap="round" />
           
           {/* Visual Minute Hand (Blue, Long, Thin) */}
           <path d="M100 100 L100 30" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
           <path d="M100 100 L100 115" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
           
           {/* Knob */}
           <circle cx="100" cy="40" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
        </g>

        {/* Center Nut */}
        <circle cx="100" cy="100" r="6" fill="#1e293b" pointerEvents="none" />
        <circle cx="100" cy="100" r="2.5" fill="#f8fafc" pointerEvents="none" />

      </svg>
      
      {/* Legend */}
      <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-6 pointer-events-none">
         <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-bold text-red-600">时针</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-bold text-blue-600">分针</span>
         </div>
      </div>
    </div>
  );
};