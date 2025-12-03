import React from 'react'

export default function ManagerCard({mgr,mines,onSetTarget}:{mgr:any,mines:any[],onSetTarget:(id:string|undefined)=>void}){
  return (
    <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div>
        <div style={{fontWeight:700}}>👔 {mgr.name} <span className="muted">({mgr.type==='collector'?'Collecteur':'Cadre'})</span></div>
        <div className="muted">Coût: ${mgr.cost}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
        <select value={mgr.targetMineId || ''} onChange={(e)=> onSetTarget(e.target.value || undefined)} style={{padding:6,borderRadius:8}}>
          <option value="">Aucun</option>
          {mines.filter(m=>m.unlocked).map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
    </div>
  )
}
