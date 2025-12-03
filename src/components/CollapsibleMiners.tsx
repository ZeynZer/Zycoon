import React, { useState } from 'react'

export default function CollapsibleMiners({miners,onHire,onUpgrade,onFire}:{miners:any[],onHire:()=>void,onUpgrade:(id:string)=>void,onFire:(id:string)=>void}){
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="accordion-card">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
          <strong>⛏️ Mineurs ({miners.length})</strong>
          <span className="accordion-icon" style={{transform:isOpen?'rotate(180deg)':'rotate(0deg)'}}>▼</span>
        </div>
      </div>
      {isOpen && (
        <div className="accordion-content">
          <button className="btn mine-btn" onClick={onHire}>+ Engager Mineur</button>
          <div className="miners-list">
            {miners.length===0 ? <div className="muted">Aucun mineur — engagez-en pour commencer !</div> : miners.map(m=> (
              <div key={m.id} className="miner-row">
                <div>
                  <div style={{fontWeight:700}}>Lvl {m.level}</div>
                  <div className="muted">{m.speed.toFixed(2)} /s</div>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button className="btn small-btn" onClick={()=>onUpgrade(m.id)}>↑</button>
                  <button className="btn small-btn danger" onClick={()=>onFire(m.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
