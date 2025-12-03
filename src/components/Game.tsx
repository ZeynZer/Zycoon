import React from 'react'
import { useGame } from '../game/useGame'
import HUD from './HUD'
import MinerCard from './MinerCard'
import Shop from './Shop'
import MineCard from './MineCard'
import ManagerCard from './ManagerCard'
import CollapsibleMiners from './CollapsibleMiners'
import SidePanel from './SidePanel'

export default function Game(){
  const { state, hireMiner, fireMiner, upgradeMiner, sellAll, unlockMine, hireManager, setManagerTarget, upgradeSkill, acquireEnterprise } = useGame()

  return (
    <>
    <div className="game-shell card">
      <HUD money={state.money} mined={state.mined} marketPrice={state.marketPrice} onSell={sellAll} />

      <CollapsibleMiners miners={state.miners} onHire={hireMiner} onUpgrade={(id)=>upgradeMiner(id)} onFire={(id)=>fireMiner(id)} />

      <div style={{marginTop:10}} className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <strong>Mines</strong>
        </div>
        <div className="miners">
          {state.mines.map(m=> (
            <MineCard key={m.id} mine={m} onUnlock={()=>unlockMine(m.id)} />
          ))}
        </div>
      </div>

      <div className="card market" style={{marginTop:10}}>
        <div>
          <div className="muted">Prix du marché</div>
          <div style={{fontSize:20}}>{state.marketPrice.toFixed(3)} $ / unité</div>
        </div>
      </div>

      <Shop state={state} onUnlock={(id)=>unlockMine(id)} onHireManager={(name,type,target)=>hireManager(name,type,target)} />

      <div style={{marginTop:10}} className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <strong>Managers</strong>
        </div>
        <div className="miners">
          {state.managers.length===0 && <div className="muted">Aucun manager engagé.</div>}
          {state.managers.map((m:any)=> (
            <ManagerCard key={m.id} mgr={m} mines={state.mines} onSetTarget={(t:any)=>setManagerTarget(m.id, t)} />
          ))}
        </div>
      </div>
    </div>

    <SidePanel skills={state.skills} enterprises={state.enterprises} state={state} onUpgradeSkill={(id)=>upgradeSkill(id)} onAcquireEnterprise={(id)=>acquireEnterprise(id)} />
    </>
  )
}
