import React from 'react'
import { triggerParticles } from '../game/useParticles'
import { formatNumberShort } from '../game/formatters'

const PERKS_DATA = [
  { id: 'p1', name: 'Revenus Passifs', desc: '+0.5% revenu/sec', cost: 5000, maxLevel: 10 },
  { id: 'p2', name: 'Chance Critique', desc: '+5% probabilité critique', cost: 8000, maxLevel: 5 },
  { id: 'p3', name: 'Boost Vitesse', desc: '+10% vitesse mineurs', cost: 6000, maxLevel: 8 },
  { id: 'p4', name: 'Bonus Richesse', desc: '+2% trouvaille argent', cost: 12000, maxLevel: 6 },
  { id: 'p5', name: 'Doubleur Minerai', desc: '5% chance ×2 minerai', cost: 15000, maxLevel: 5 },
]

const RESEARCH_DATA = [
  { id: 'r1', name: 'Tech Mining Avancée', desc: '+20% production', cost: 50000 },
  { id: 'r2', name: 'Prédiction Marché', desc: 'Voir tendances prix', cost: 80000 },
  { id: 'r3', name: 'Extraction Quantique', desc: '+15% efficacité', cost: 120000 },
  { id: 'r4', name: 'Optimisation IA', desc: 'Gestion auto mineurs', cost: 200000 },
  { id: 'r5', name: 'Réacteur Fusion', desc: '+50% output énergie', cost: 500000 },
]

export function PerksUI({perks=[], state, onUnlockPerk}: {perks: any[], state: any, onUnlockPerk?: (id:string)=>void}) {
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
        {PERKS_DATA.map(perk => {
          const unlockedPerk = perks.find(p => p.id === perk.id)
          const cost = Math.round(perk.cost * Math.pow(1.5, unlockedPerk?.level || 0))
          const isMaxed = unlockedPerk && unlockedPerk.level >= perk.maxLevel
          
          return (
            <div key={perk.id} style={{background:'rgba(139,92,246,0.15)',border:'1px solid rgba(139,92,246,0.3)',borderRadius:'8px',padding:'8px',fontSize:'12px'}}>
              <div style={{fontWeight:700}}>{perk.name}</div>
              <div className="muted" style={{fontSize:'11px',marginTop:'4px'}}>{perk.desc}</div>
              <div style={{marginTop:'4px',fontSize:'10px'}}>Lvl {unlockedPerk?.level || 0}/{perk.maxLevel}</div>
              {isMaxed ? (
                <div style={{marginTop:'6px',color:'#34d399',fontSize:'11px',fontWeight:700}}>✓ Max</div>
              ) : (
                <button className="btn upgrade-btn" style={{width:'100%',marginTop:'6px',padding:'4px',fontSize:'10px'}} onClick={(e)=>{triggerParticles(e.currentTarget.getBoundingClientRect().left,e.currentTarget.getBoundingClientRect().top,'upgrade'); onUnlockPerk?.(perk.id)}} disabled={state.money < cost}>
                  ${formatNumberShort(cost)}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ResearchUI({research=[], state, onUnlockResearch}: {research: any[], state: any, onUnlockResearch?: (id:string)=>void}) {
  return (
    <div>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {RESEARCH_DATA.map(item => {
          const isUnlocked = research.find(r => r.id === item.id)
          return (
            <div key={item.id} style={{background:'rgba(251,191,36,0.1)',border:'2px solid rgba(251,191,36,0.3)',borderRadius:'8px',padding:'10px'}}>
              <div style={{fontWeight:700}}>{item.name}</div>
              <div className="muted">{item.desc}</div>
              {isUnlocked ? (
                <div style={{marginTop:'8px',color:'#34d399',fontWeight:700}}>✓ Déverrouillée</div>
              ) : (
                <button className="btn acquire-btn" onClick={(e)=>{triggerParticles(e.currentTarget.getBoundingClientRect().left,e.currentTarget.getBoundingClientRect().top,'mine'); onUnlockResearch?.(item.id)}} disabled={state.money < item.cost} style={{width:'100%',marginTop:'8px'}}>
                  Déverrouiller ${formatNumberShort(item.cost)}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DailyBonusUI({state, onClaimDailyBonus}: {state: any, onClaimDailyBonus?: ()=>void}) {
  const today = new Date().getDate()
  const claimed = state.dailyBonusDay === today
  
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:'48px',marginBottom:'16px'}}>🎁</div>
      <div style={{fontWeight:700,fontSize:'18px',marginBottom:'8px'}}>Bonus Quotidien</div>
      <div style={{background:'rgba(52,211,153,0.2)',borderRadius:'8px',padding:'12px',marginBottom:'16px'}}>
        <div className="muted">Montant disponible:</div>
        <div style={{fontSize:'24px',fontWeight:700,color:'#34d399',marginTop:'4px'}}>${formatNumberShort(state.dailyBonusAmount || 1000)}</div>
      </div>
      <div style={{background:'rgba(59,130,246,0.2)',borderRadius:'8px',padding:'12px',marginBottom:'16px'}}>
        <div className="muted">Streak actuelle:</div>
        <div style={{fontSize:'20px',fontWeight:700,color:'#3b82f6',marginTop:'4px'}}>{state.dailyStreaks} jours 🔥</div>
      </div>
      {claimed ? (
        <div style={{padding:'10px',background:'rgba(52,211,153,0.3)',borderRadius:'8px',color:'#34d399',fontWeight:700}}>
          ✓ Réclamé aujourd'hui
        </div>
      ) : (
        <button className="btn sell-btn" onClick={onClaimDailyBonus} style={{width:'100%',padding:'12px',fontSize:'14px'}}>
          Réclamer Bonus
        </button>
      )}
    </div>
  )
}
