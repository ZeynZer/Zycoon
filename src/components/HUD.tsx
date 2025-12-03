import React from 'react'
import { triggerParticles } from '../game/useParticles'

export default function HUD({money,mined,marketPrice,onSell}:{money:number,mined:number,marketPrice:number,onSell:()=>void}){
  const handleSell = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    triggerParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'sell')
    onSell()
  }

  return (
    <div className="hud card">
      <div>
        <div className="muted">Argent</div>
        <div style={{fontSize:18,fontWeight:700}}>${money.toFixed(2)}</div>
      </div>
      <div>
        <div className="muted">Stock</div>
        <div style={{fontSize:18,fontWeight:700}}>{Math.floor(mined)} unités</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
        <button className="btn sell-btn" onClick={handleSell}>Vendre tout</button>
        <div className="muted" style={{fontSize:12}}>+${(mined * marketPrice).toFixed(2)}</div>
      </div>
    </div>
  )
}
