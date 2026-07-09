"use client"

import React, { useEffect, useState } from "react"

interface ProgressRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 110,
  strokeWidth = 10
}) => {
  const [offset, setOffset] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    const progressOffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference
    setOffset(progressOffset)
  }, [score, circumference])

  // Get color by threshold
  const getColor = () => {
    if (score < 60) return "#D96B6B" // Soft Red
    if (score < 80) return "#E8845A" // Terracotta
    return "#4CAF72" // Emerald
  }

  const color = getColor()

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(123, 174, 127, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Fill circle */}
        <circle
          className="transition-all duration-1000 ease-out"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-serif text-3xl font-bold text-text-primary leading-none">{score}%</span>
        <span className="text-[8px] font-extrabold text-text-muted uppercase tracking-widest mt-1 block">Score</span>
      </div>
    </div>
  )
}
export default ProgressRing

