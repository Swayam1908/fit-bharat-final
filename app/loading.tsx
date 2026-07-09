import React from "react"

export default function LoadingPage() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage to-sage-dark animate-spin flex items-center justify-center text-white shadow-[0_4px_12px_rgba(74,122,90,0.15)]">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <circle className="opacity-25" cx="12" cy="12" r="10" />
          <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <span className="text-[10px] font-extrabold text-sage-dark uppercase tracking-widest">Ecosystem sync in progress...</span>
    </div>
  )
}
