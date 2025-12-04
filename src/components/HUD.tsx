import React from 'react'
import { triggerParticles, spawnEmoji } from '../game/useParticles'
import { formatNumber } from '../game/formatters'

export default function HUD({money,mined,marketPrice,tool,onSell}:{money:number,mined:number,marketPrice:number,tool:any,onSell:()=>void}){
  const handleSell = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    triggerParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'sell')
    spawnEmoji(rect.left + rect.width / 2, rect.top + rect.height / 2, '💵', 8)
    // no animation on game-shell to avoid layout shift
    onSell()
  }

  return (
    <div className="hud card">
      <div>
        <div className="muted">Argent</div>
        <div style={{fontSize:18,fontWeight:700}}>${formatNumber(money)}</div>
      </div>
      <div>
        <div className="muted">Stock</div>
        <div style={{fontSize:18,fontWeight:700}}>{formatNumber(Math.floor(mined))} unités</div>
      </div>
      <div>
        <div className="muted">Outil</div>
        <div style={{fontSize:18,fontWeight:700}}>{tool.emoji} Lvl {tool.level}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
        <button className="btn sell-btn" onClick={handleSell}>Vendre tout</button>
        <div className="muted" style={{fontSize:12}}>+${formatNumber(mined * marketPrice)}</div>
      </div>
    </div>
  )
}
