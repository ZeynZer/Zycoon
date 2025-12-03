import React, { useState } from 'react'
import { triggerParticles, spawnEmoji } from '../game/useParticles'

type TabType = 'skills' | 'enterprises' | 'stats' | 'tool' | 'autosell'

export default function SidePanel({skills=[],enterprises=[],state,onUpgradeSkill,onAcquireEnterprise,onUpgradeAutoSell,onSetAutoSellPrice,onPurchaseToolXP}:{skills:any[],enterprises:any[],state:any,onUpgradeSkill:(id:string)=>void,onAcquireEnterprise:(id:string)=>void,onUpgradeAutoSell:(level:number)=>void,onSetAutoSellPrice:(price:number)=>void,onPurchaseToolXP:(amount?:number)=>void}){
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

  const handlePurchaseXP = (amt:number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    spawnEmoji(rect.left + rect.width / 2, rect.top + rect.height / 2, '💰', 12)
    triggerParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'upgrade')
    onPurchaseToolXP(amt)
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
          <button className={`tab-btn ${tab==='tool'?'active':''}`} onClick={()=>setTab('tool')}>🔧 Outils</button>
          <button className={`tab-btn ${tab==='autosell'?'active':''}`} onClick={()=>setTab('autosell')}>🤖 Vente Auto</button>
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

          {tab==='tool' && (
            <div>
              <div style={{textAlign:'center',padding:'16px',background:'rgba(251,191,36,0.1)',borderRadius:'12px',marginBottom:'16px'}}>
                <div style={{fontSize:48}}>{state.tool.emoji}</div>
                <div style={{fontWeight:700,marginTop:8}}>{state.tool.name} Lvl {state.tool.level}</div>
                <div className="muted" style={{marginTop:4}}>Multiplicateur: {state.tool.multiplier.toFixed(1)}x</div>
                <div className="muted" style={{marginTop:8}}>XP: {state.tool.xp.toFixed(0)}/{state.tool.xpNeeded}</div>
                <div style={{background:'rgba(0,0,0,0.3)',borderRadius:'6px',height:'8px',marginTop:8,overflow:'hidden'}}>
                  <div style={{height:'100%',background:'linear-gradient(90deg,#fbbf24,#f59e0b)',width:`${(state.tool.xp/state.tool.xpNeeded)*100}%`,transition:'width 0.3s'}}/>
                </div>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="btn upgrade-btn" onClick={handlePurchaseXP(100)} disabled={state.money < Math.round(5000 * Math.pow(2, Math.max(0, state.tool.level-1)))}>
                    Acheter 100 XP (${Math.round(5000 * Math.pow(2, Math.max(0, state.tool.level-1)))})
                  </button>
                  <button className="btn upgrade-btn" onClick={handlePurchaseXP(500)} disabled={state.money < Math.round(5000 * Math.pow(2, Math.max(0, state.tool.level-1))) * 5}>
                    Acheter 500 XP (${Math.round(5000 * Math.pow(2, Math.max(0, state.tool.level-1))) * 5})
                  </button>
                </div>
              </div>
              <div className="muted">📈 Chaque niveau d'outil augmente votre production!</div>
            </div>
          )}

          {tab==='autosell' && (
            <div>
              <div style={{background:'rgba(59,130,246,0.1)',padding:'12px',borderRadius:'12px',marginBottom:'16px'}}>
                <div style={{fontWeight:700,marginBottom:8}}>🤖 Vente Automatique</div>
                <div className="muted" style={{marginBottom:12}}>Niveau: {state.autoSellLevel}</div>
                <button 
                  className="btn upgrade-btn" 
                  style={{width:'100%',marginBottom:12}}
                  onClick={()=>onUpgradeAutoSell(state.autoSellLevel)}
                  disabled={state.money < Math.round(500 * Math.pow(1.8, state.autoSellLevel))}
                >
                  Upgrade ${Math.round(500 * Math.pow(1.8, state.autoSellLevel))}
                </button>
                <div className="muted" style={{fontSize:12}}>Vend {state.autoSellLevel * 50} unités/tick au prix fixé</div>
              </div>

              <div style={{background:'rgba(52,211,153,0.1)',padding:'12px',borderRadius:'12px'}}>
                <div style={{fontWeight:700,marginBottom:8}}>💹 Prix de vente auto</div>
                <div className="muted" style={{marginBottom:8}}>Actuellement: ${state.autoSellPrice.toFixed(2)}</div>
                <div style={{display:'flex',gap:6}}>
                  <button className="btn small-btn" onClick={()=>onSetAutoSellPrice(Math.max(0.1, state.autoSellPrice - 0.1))}>-</button>
                  <button className="btn small-btn" onClick={()=>onSetAutoSellPrice(state.autoSellPrice + 0.1)}>+</button>
                </div>
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
              <div className="stat-box">
                <div className="stat-label">💸 Taxes payées</div>
                <div className="stat-value">${state.totalTaxesPaid.toFixed(2)}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">⭐ Prestige</div>
                <div className="stat-value">{state.prestige}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
