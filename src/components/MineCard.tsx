import React from 'react'

export default function MineCard({mine,onUnlock}:{mine:any,onUnlock?:()=>void}){
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} className="card">
      <div>
        <div style={{fontWeight:700}}>⛰️ {mine.name}</div>
        <div className="muted">Base: {mine.baseProduction} /s · Niveau {mine.level}</div>
      </div>
      <div style={{textAlign:'right'}}>
        {mine.unlocked ? <div className="muted">✓ Débloqué</div> : <button className="btn" onClick={onUnlock}>Débloquer ${mine.unlockCost}</button>}
      </div>
    </div>
  )
}
