import React from 'react'
import { triggerParticles } from '../game/useParticles'

export default function Shop({state,onUnlock,onHireManager}:{state:any,onUnlock:(id:string)=>void,onHireManager:(name:string,type:'collector'|'foreman',target?:string)=>void}){
  const collectorCost = Math.round(100 + state.managers.length*150)
  const foremanCost = Math.round(100 + state.managers.length*150)

  const handleUnlock = (mineId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    triggerParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'mine')
    onUnlock(mineId)
  }

  const handleHire = (name: string, type: 'collector' | 'foreman') => (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    triggerParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'upgrade')
    onHireManager(name, type)
  }

  return (
    <div style={{marginTop:12}} className="card shop-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <strong>💼 Boutique</strong>
      </div>
      <div style={{marginTop:8}} className="muted">Achetez des managers pour automatiser et débloquez des mines puissantes.</div>
      <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
        <button className="btn hire-btn" onClick={handleHire('Collecteur','collector')} disabled={state.money < collectorCost}>Collecteur ${collectorCost}</button>
        <button className="btn hire-btn" onClick={handleHire('Cadre','foreman')} disabled={state.money < foremanCost}>Cadre ${foremanCost}</button>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontWeight:700}}>Mines à débloquer</div>
        {state.mines.map((m:any)=> (
          <div key={m.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
            <div>
              <div style={{fontWeight:700}}>{m.name}</div>
              <div className="muted">Production: {m.baseProduction} /s</div>
            </div>
            <div style={{textAlign:'right'}}>
              {m.unlocked ? <div className="muted">✓</div> : <button className="btn unlock-btn" onClick={handleUnlock(m.id)} disabled={state.money < m.unlockCost}>${m.unlockCost}</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
