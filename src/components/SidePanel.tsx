import React, { useState } from 'react'
import { triggerParticles } from '../game/useParticles'

type TabType = 'skills' | 'enterprises' | 'stats'

export default function SidePanel({skills=[],enterprises=[],state,onUpgradeSkill,onAcquireEnterprise}:{skills:any[],enterprises:any[],state:any,onUpgradeSkill:(id:string)=>void,onAcquireEnterprise:(id:string)=>void}){
  const [tab, setTab] = useState<TabType>('skills')
  const [isOpen, setIsOpen] = useState(false)

  const handleSkillUpgrade = (skillId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    triggerParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'upgrade')
    onUpgradeSkill(skillId)
  }

  const handleAcquire = (enterpriseId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    triggerParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'mine')
    onAcquireEnterprise(enterpriseId)
  }

  return (
    <>
      <button className="side-panel-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '→'} Avancé
      </button>
      {isOpen && <div className="side-panel-backdrop" onClick={() => setIsOpen(false)} />}
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="side-panel-header">
          <h2>🚀 Avancé</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="side-panel-tabs">
          <button className={`tab-btn ${tab==='skills'?'active':''}`} onClick={()=>setTab('skills')}>🌳 Compétences</button>
          <button className={`tab-btn ${tab==='enterprises'?'active':''}`} onClick={()=>setTab('enterprises')}>🏢 Sociétés</button>
          <button className={`tab-btn ${tab==='stats'?'active':''}`} onClick={()=>setTab('stats')}>📊 Stats</button>
        </div>

        <div className="side-panel-content">
          {tab==='skills' && (
            <div>
              <div className="skill-tree">
                {skills && skills.map(s=> (
                  <div key={s.id} className="skill-card">
                    <div>
                      <div style={{fontWeight:700}}>{s.name}</div>
                      <div className="muted">{s.desc}</div>
                      <div style={{marginTop:6}} className="muted">Lvl {s.level}/{s.maxLevel}</div>
                    </div>
                    <button className="btn upgrade-btn" onClick={handleSkillUpgrade(s.id)} disabled={s.level>=s.maxLevel || state.money < Math.round(s.cost * Math.pow(1.5, s.level))}>
                      ${Math.round(s.cost * Math.pow(1.5, s.level))}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='enterprises' && (
            <div>
              <div className="enterprises-grid">
                {enterprises && enterprises.map(e=> (
                  <div key={e.id} className={`enterprise-card ${e.owned?'owned':''}`}>
                    <div style={{fontWeight:700,fontSize:16}}>{e.name}</div>
                    <div className="muted">{e.description}</div>
                    <div style={{marginTop:8,fontSize:14}}>+{(e.productionBonus*100).toFixed(0)}% production</div>
                    {e.owned ? (
                      <div style={{marginTop:8,color:'#34d399',fontWeight:700}}>✓ Acquise</div>
                    ) : (
                      <button className="btn acquire-btn" onClick={handleAcquire(e.id)} disabled={state.money < e.cost}>
                        Acquérir ${e.cost}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='stats' && (
            <div className="stats-dashboard">
              <div className="stat-box">
                <div className="stat-label">💰 Argent</div>
                <div className="stat-value">${state.money.toFixed(2)}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">📦 Stock</div>
                <div className="stat-value">{Math.floor(state.mined)}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">📈 Production/s</div>
                <div className="stat-value">{state.totalProduction.toFixed(2)}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">💵 Prix Marché</div>
                <div className="stat-value">${state.marketPrice.toFixed(3)}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">⛏️ Mineurs</div>
                <div className="stat-value">{state.miners.length}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">👔 Managers</div>
                <div className="stat-value">{state.managers.length}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">⛰️ Mines</div>
                <div className="stat-value">{state.mines && state.mines.filter((m:any)=>m.unlocked).length || 0}/3</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">🏢 Sociétés</div>
                <div className="stat-value">{state.enterprises && state.enterprises.filter((e:any)=>e.owned).length || 0}/3</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
