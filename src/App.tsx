import React from 'react'
import Game from './components/Game'
import ParticleSystem from './components/ParticleSystem'

export default function App() {
  return (
    <div className="app-root">
      <ParticleSystem />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Game />
      </div>
    </div>
  )
}
