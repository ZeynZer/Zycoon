import React, { useEffect } from 'react'

declare global {
  interface Window {
    __particles?: {
      addParticles: (x: number, y: number, type: 'mine' | 'sell' | 'upgrade') => void
    }
  }
}

export function triggerParticles(x: number, y: number, type: 'mine' | 'sell' | 'upgrade') {
  if (window.__particles) {
    window.__particles.addParticles(x, y, type)
  }
}

export default function useParticles() {
  return { triggerParticles }
}
