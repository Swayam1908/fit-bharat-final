"use client"

import React from "react"
import { motion } from "framer-motion"
import { PlantInstance } from "@/store/useGardenStore"

interface GardenWidgetProps {
  growthStage: number // 0-4
  consistencyScore: number // 0-100
  waterLevel: number // 0-100
  plants: PlantInstance[]
  interactive?: boolean
  onPlantClick?: (plant: PlantInstance) => void
}

export const GardenWidget: React.FC<GardenWidgetProps> = ({
  growthStage,
  consistencyScore,
  waterLevel,
  plants,
  interactive = false,
  onPlantClick
}) => {
  const isHealthy = consistencyScore >= 80
  const isDry = waterLevel < 40
  const isRaining = waterLevel >= 80

  const renderCentralTree = () => {
    const stages = [
      // Stage 0: Seed in dirt
      <g key="stage0" className="origin-bottom scale-90 translate-y-2">
        <circle cx="100" cy="140" r="4" fill="#8B5A2B" />
        <line x1="100" y1="140" x2="100" y2="144" stroke="#5C3A21" strokeWidth="2" />
        <ellipse cx="100" cy="145" rx="14" ry="4" fill="#5C3A21" opacity="0.35" />
      </g>,
      // Stage 1: Sprout
      <g key="stage1" className="origin-bottom animate-sway">
        <path d="M100,145 Q98,130 95,122" fill="none" stroke="#7BAE7F" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M95,122 Q86,118 84,124 Q92,126 95,122 Z" fill="#A8C5AA" />
        <path d="M95,122 Q104,118 106,124 Q98,126 95,122 Z" fill="#7BAE7F" />
        <ellipse cx="100" cy="146" rx="18" ry="5" fill="#5C3A21" opacity="0.4" />
      </g>,
      // Stage 2: Small Seedling
      <g key="stage2" className="origin-bottom animate-sway">
        <path d="M100,145 Q100,120 96,105" fill="none" stroke="#8B5A2B" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="94" cy="98" r="12" fill="#7BAE7F" />
        <circle cx="104" cy="102" r="10" fill="#A8C5AA" />
        <ellipse cx="100" cy="146" rx="22" ry="6" fill="#5C3A21" opacity="0.4" />
      </g>,
      // Stage 3: Growing Plant
      <g key="stage3" className="origin-bottom animate-sway">
        <path d="M100,145 Q100,110 96,90" fill="none" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
        <path d="M98,115 Q86,108 80,102" fill="none" stroke="#8B5A2B" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M99,105 Q110,98 116,92" fill="none" stroke="#8B5A2B" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="96" cy="82" r="18" fill="#4A7A5A" />
        <circle cx="78" cy="98" r="14" fill="#7BAE7F" />
        <circle cx="116" cy="88" r="14" fill="#7BAE7F" />
        <circle cx="102" cy="74" r="12" fill="#A8C5AA" />
        <ellipse cx="100" cy="146" rx="28" ry="7" fill="#5C3A21" opacity="0.4" />
      </g>,
      // Stage 4: Mature Consistency Tree
      <g key="stage4" className="origin-bottom animate-sway">
        <path d="M100,145 C100,125 94,95 96,75" fill="none" stroke="#7A5435" strokeWidth="8" strokeLinecap="round" />
        <path d="M98,112 C88,102 74,98 70,88" fill="none" stroke="#7A5435" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M97,100 C108,92 118,88 126,80" fill="none" stroke="#7A5435" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="96" cy="62" r="24" fill="#4A7A5A" />
        <circle cx="72" cy="82" r="18" fill="#7BAE7F" />
        <circle cx="124" cy="74" r="18" fill="#7BAE7F" />
        <circle cx="108" cy="50" r="16" fill="#A8C5AA" />
        <circle cx="86" cy="52" r="15" fill="#4A7A5A" />
        <circle cx="86" cy="72" r="4.5" fill="#F2994A" />
        <circle cx="114" cy="68" r="4.5" fill="#F2994A" />
        <circle cx="98" cy="50" r="4" fill="#A8C5AA" />
        <circle cx="74" cy="84" r="3.5" fill="#A8C5AA" />
        <ellipse cx="100" cy="146" rx="34" ry="8" fill="#5C3A21" opacity="0.4" />
      </g>
    ]

    return stages[Math.min(4, Math.max(0, growthStage))]
  }

  const renderPlantInstance = (plant: PlantInstance) => {
    const isSage = plant.plantId === "plant-sage"
    const isFern = plant.plantId === "plant-fern"
    const color = isSage ? "#7BAE7F" : isFern ? "#4A7A5A" : "#F2994A"
    
    return (
      <g
        key={plant.id}
        className={`${interactive ? "cursor-pointer" : ""} origin-bottom animate-sway`}
        style={{ animationDelay: `${plant.x * 20}ms` }}
        onClick={() => onPlantClick?.(plant)}
      >
        <ellipse cx={plant.x * 2} cy={plant.y * 2} rx="8" ry="2.5" fill="#5C3A21" opacity="0.3" />
        {plant.stage >= 2 ? (
          <path
            d={`M${plant.x * 2},${plant.y * 2} Q${plant.x * 2 - 4},${plant.y * 2 - 12} ${plant.x * 2 - 6},${plant.y * 2 - 18} M${plant.x * 2},${plant.y * 2} Q${plant.x * 2 + 4},${plant.y * 2 - 10} ${plant.x * 2 + 8},${plant.y * 2 - 16}`}
            stroke={color}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <circle cx={plant.x * 2} cy={plant.y * 2 - 3} r="3.5" fill={color} />
        )}
      </g>
    )
  }

  return (
    <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border border-border bg-gradient-to-b from-[#112415] via-[#162E1D] to-[#0D1512] shadow-glow">
      <div className="absolute inset-0 pointer-events-none z-10">
        {isHealthy ? (
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-6 left-8 w-14 h-14 rounded-full bg-gradient-to-br from-peach to-orange shadow-[0_0_40px_rgba(242,153,74,0.5)]"
          />
        ) : (
          <div className="absolute top-8 left-8 w-16 h-8 rounded-full bg-white/20 blur-[2px]" />
        )}

        {isRaining && (
          <div className="absolute inset-0 bg-blue/5 overflow-hidden">
            <div className="w-full h-full opacity-60 flex flex-wrap gap-6 justify-around animate-pulse">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[1.8px] h-7 bg-gradient-to-b from-blue to-transparent transform rotate-[12deg]"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {isDry && (
          <div className="absolute inset-0 bg-orange/5 mix-blend-multiply pointer-events-none" />
        )}

        <div className="absolute inset-0 overflow-hidden opacity-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/60 blur-[0.5px] animate-particle"
              style={{
                left: `${15 + i * 11}%`,
                bottom: `${20 + (i % 3) * 15}%`,
                animationDelay: `${i * 300}ms`,
                animationDuration: `${6 + (i % 4) * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <svg viewBox="0 0 200 150" className="w-full h-full relative z-0">
        <path d="M0,122 Q100,112 200,122 L200,150 L0,150 Z" fill="#4A7A5A" opacity="0.85" />
        <path d="M0,127 Q100,120 200,127 L200,150 L0,150 Z" fill="#203D26" opacity="0.4" />
        {renderCentralTree()}
        {plants.map((plant) => renderPlantInstance(plant))}
      </svg>

      <div className="absolute bottom-4 left-4 right-4 bg-bg-secondary/95 backdrop-blur-xl rounded-sm p-3.5 flex justify-between items-center border border-white/5 shadow-md z-20">
        <div>
          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Ecosystem State</span>
          <span className="font-syne text-sm font-bold text-text-primary capitalize mt-0.5 block">
            {growthStage === 0 ? "Sprout Seed" : growthStage === 1 ? "Baby Sprout" : growthStage === 2 ? "Seedling" : growthStage === 3 ? "Young Shrub" : "Ancient Tree"}
          </span>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-[9px] font-bold text-text-muted block uppercase">Consistency</span>
            <span className="text-xs font-bold text-success">{consistencyScore}%</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-text-muted block uppercase">Hydration</span>
            <span className="text-xs font-bold text-info">{waterLevel}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default GardenWidget

