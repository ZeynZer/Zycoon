import React from 'react'
import { triggerParticles } from '../game/useParticles'

export default function MinerCard({miner,onUpgrade}:{miner:any,onUpgrade:()=>void}){
  const handleUpgrade = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    triggerParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'upgrade')
    onUpgrade()
  }

  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} className="card miner-card">
      <div>
        <div style={{fontWeight:700}}>⛏️ Mineur Lvl {miner.level}</div>
        <div className="muted">Production: {Number(miner.speed).toFixed(2)} /s</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
        <button className="btn upgrade-btn" onClick={handleUpgrade}>Améliorer</button>
        <div className="muted" style={{fontSize:12}}>Coût: ${miner.cost}</div>
      </div>
    </div>
  )
}
