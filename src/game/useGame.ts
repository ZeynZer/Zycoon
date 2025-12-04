import { useEffect, useRef, useState } from 'react'

type Miner = {
  id: string
  level: number
  speed: number
  cost: number
}

type Mine = {
  id: string
  name: string
  level: number
  baseProduction: number
  unlockCost: number
  unlocked: boolean
}

type Manager = {
  id: string
  name: string
  cost: number
  type: 'collector' | 'foreman'
  targetMineId?: string
  tick?: number
}

type Skill = {
  id: string
  name: string
  desc: string
  cost: number
  level: number
  maxLevel: number
  effect: string // 'minerSpeed' | 'mineOutput' | 'autoSell' etc
}

type Enterprise = {
  id: string
  name: string
  description: string
  cost: number
  owned: boolean
  productionBonus: number // % bonus
}

type Tool = {
  id: string
  name: string
  emoji: string
  level: number
  xp: number
  xpNeeded: number
  multiplier: number
}

type Event = {
  id: string
  type: 'crash' | 'boom' | 'tax' | 'bonus'
  trigger: number // tick when it happened
}

export type GameState = {
  money: number
  mined: number
  miners: Miner[]
  mines: Mine[]
  managers: Manager[]
  marketPrice: number
  skills: Skill[]
  enterprises: Enterprise[]
  totalProduction: number // cached value
  tool: Tool
  autoSellLevel: number
  totalTaxesPaid: number
  prestige: number
  prestigeResets: number
  priceHistory: number[]
  lastEvent: Event | null
  autoSellPrice: number // threshold price to auto-sell
  // NEW FEATURES (20+)
  dailyBonusDay: number
  dailyStreaks: number
  dailyBonusAmount: number
  passiveIncomePerSec: number
  critChance: number
  critMultiplier: number
  oreDoubleChance: number
  perks: { id: string; level: number; unlocked: boolean }[]
  researchItems: { id: string; unlocked: boolean }[]
  achievements: { id: string; unlocked: boolean }[]
  totalMinersHired: number
  totalMoneySold: number
  maxMoneyReached: number
  millennialAchievement: number // how many M milestones passed (1M, 10M, 100M, 1B, etc)
  weeklyMultiplier: number
  weeklyBonus: boolean
  seasonalBonus: number
  prestigeMultiplier: number
  autoUpgradeEnabled: boolean
  autoUpgradeLevel: number
  offlineEarnings: number
  lastSessionTime: number
  totalPlayTime: number
  specialOffers: { id: string; active: boolean; discount: number }[]
}

const STORAGE_KEY = 'zycoon_state_v1'

function rand(min:number, max:number){return Math.random()*(max-min)+min}

function defaultMines():Mine[]{
  return [
    { id: 'm1', name: 'Mine de Surface', level:1, baseProduction: 0.15, unlockCost: 0, unlocked:true },
    { id: 'm2', name: 'Mine Souterraine', level:1, baseProduction: 0.5, unlockCost: 100000, unlocked:false },
    { id: 'm3', name: 'Gisement Rare', level:1, baseProduction: 2.0, unlockCost: 5000000, unlocked:false },
    { id: 'm4', name: 'Cœur Cristallin', level:1, baseProduction: 8.0, unlockCost: 100000000, unlocked:false },
    { id: 'm5', name: 'Sanctuaire Ancien', level:1, baseProduction: 50.0, unlockCost: 5000000000, unlocked:false }
  ]
}

function defaultSkills():Skill[]{
  return [
    { id: 's1', name: 'Foreuse Rapide', desc: '+10% vitesse mineurs', cost: 150, level: 0, maxLevel: 10, effect: 'minerSpeed' },
    { id: 's2', name: 'Extraction Pro', desc: '+5% output mines', cost: 200, level: 0, maxLevel: 10, effect: 'mineOutput' },
    { id: 's3', name: 'Trésor Caché', desc: '+2% bonus chance', cost: 300, level: 0, maxLevel: 5, effect: 'bonusChance' }
  ]
}

function defaultEnterprises():Enterprise[]{
  return [
    { id: 'e1', name: '🏢 MegaCorp Mining', description: 'Entreprise minière géante', cost: 5000, owned: false, productionBonus: 0.5 },
    { id: 'e2', name: '⚡ TechForge Industries', description: 'Technologie de pointe', cost: 8000, owned: false, productionBonus: 0.75 },
    { id: 'e3', name: '👑 Gold Standard LLC', description: 'Leader du marché', cost: 12000, owned: false, productionBonus: 1.2 }
  ]
}

function defaultTool():Tool{
  return { id: 't1', name: 'Pelle', emoji: '🪓', level: 1, xp: 0, xpNeeded: 500, multiplier: 1 }
}

const TOOLS = [
  { id: 't1', name: 'Pelle', emoji: '🪓', multiplier: 1 },
  { id: 't2', name: 'Pioche', emoji: '⛏️', multiplier: 1.5 },
  { id: 't3', name: 'Marteau-Piqueur', emoji: '🔨', multiplier: 2.2 },
  { id: 't4', name: 'Foreur', emoji: '🔩', multiplier: 3.5 },
  { id: 't5', name: 'Excavatrice', emoji: '🚜', multiplier: 5 }
]

export function useGame(){
  const [state, setState] = useState<GameState>(()=>{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw) try { 
      const loaded = JSON.parse(raw) as GameState
      // Ensure new fields exist in old saves
      return {
        ...loaded,
        skills: loaded.skills || defaultSkills(),
        enterprises: loaded.enterprises || defaultEnterprises(),
        totalProduction: loaded.totalProduction || 0,
        tool: loaded.tool || defaultTool(),
        autoSellLevel: loaded.autoSellLevel || 0,
        totalTaxesPaid: loaded.totalTaxesPaid || 0,
        prestige: loaded.prestige || 0,
        prestigeResets: loaded.prestigeResets || 0,
        priceHistory: loaded.priceHistory || [],
        lastEvent: loaded.lastEvent || null,
        autoSellPrice: loaded.autoSellPrice || 2,
        // NEW FEATURES defaults
        dailyBonusDay: loaded.dailyBonusDay || 0,
        dailyStreaks: loaded.dailyStreaks || 0,
        dailyBonusAmount: loaded.dailyBonusAmount || 1000,
        passiveIncomePerSec: loaded.passiveIncomePerSec || 0,
        critChance: loaded.critChance || 0.05,
        critMultiplier: loaded.critMultiplier || 2,
        oreDoubleChance: loaded.oreDoubleChance || 0,
        perks: loaded.perks || [],
        researchItems: loaded.researchItems || [],
        achievements: loaded.achievements || [],
        totalMinersHired: loaded.totalMinersHired || 0,
        totalMoneySold: loaded.totalMoneySold || 0,
        maxMoneyReached: loaded.maxMoneyReached || 0,
        millennialAchievement: loaded.millennialAchievement || 0,
        weeklyMultiplier: loaded.weeklyMultiplier || 1,
        weeklyBonus: loaded.weeklyBonus || false,
        seasonalBonus: loaded.seasonalBonus || 0,
        prestigeMultiplier: loaded.prestigeMultiplier || 1,
        autoUpgradeEnabled: loaded.autoUpgradeEnabled || false,
        autoUpgradeLevel: loaded.autoUpgradeLevel || 0,
        offlineEarnings: loaded.offlineEarnings || 0,
        lastSessionTime: loaded.lastSessionTime || Date.now(),
        totalPlayTime: loaded.totalPlayTime || 0,
        specialOffers: loaded.specialOffers || []
      }
    } catch { }
    return { 
      money: 10, 
      mined: 0, 
      miners: [], 
      mines: defaultMines(), 
      managers: [], 
      marketPrice: 1 + Math.random()*0.3,
      skills: defaultSkills(),
      enterprises: defaultEnterprises(),
      totalProduction: 0,
      tool: defaultTool(),
      autoSellLevel: 0,
      totalTaxesPaid: 0,
      prestige: 0,
      prestigeResets: 0,
      priceHistory: [],
      lastEvent: null,
      autoSellPrice: 2,
      // NEW FEATURES
      dailyBonusDay: 0,
      dailyStreaks: 0,
      dailyBonusAmount: 1000,
      passiveIncomePerSec: 0,
      critChance: 0.05,
      critMultiplier: 2,
      oreDoubleChance: 0,
      perks: [],
      researchItems: [],
      achievements: [],
      totalMinersHired: 0,
      totalMoneySold: 0,
      maxMoneyReached: 0,
      millennialAchievement: 0,
      weeklyMultiplier: 1,
      weeklyBonus: false,
      seasonalBonus: 0,
      prestigeMultiplier: 1,
      autoUpgradeEnabled: false,
      autoUpgradeLevel: 0,
      offlineEarnings: 0,
      lastSessionTime: Date.now(),
      totalPlayTime: 0,
      specialOffers: []
    }
  })

  const tickRef = useRef<number>(0)

  useEffect(()=>{
    const id = setInterval(()=>{
      setState(prev=>{
        // Calculate total production with multipliers
        let minersProd = prev.miners.reduce((s,m)=>s + m.speed, 0)
        const skillMinerBonus = 1 + (prev.skills.find(s=>s.effect==='minerSpeed')?.level || 0) * 0.1
        minersProd *= skillMinerBonus * prev.tool.multiplier

        let minesProd = 0
        let moneyFromManagers = 0
        let managers = prev.managers.map(m=> ({...m}))
        let moneyAcc = prev.money

        const skillMineBonus = 1 + (prev.skills.find(s=>s.effect==='mineOutput')?.level || 0) * 0.05
        const enterpriseBonus = prev.enterprises.filter(e=>e.owned).reduce((s,e)=>s + e.productionBonus, 0)

        for(const mine of prev.mines){
          if(!mine.unlocked) continue
          let prod = mine.baseProduction * Math.pow(1.25, mine.level-1) * skillMineBonus * (1 + enterpriseBonus)
          const mgr = managers.find(x=> x.targetMineId === mine.id && x.type === 'collector')
          if(mgr){
            moneyFromManagers += prod * prev.marketPrice * 0.02
          } else {
            minesProd += prod
          }
        }

        managers = managers.map(mgr=>{
          if(mgr.type !== 'foreman') return mgr
          const nextTick = (mgr.tick || 0) + 1
          if(nextTick % 15 === 0){
            if(mgr.targetMineId){
              const mine = prev.mines.find(x=> x.id === mgr.targetMineId)
              if(mine){
                const cost = Math.round(300 * Math.pow(1.85, mine.level-1))
                if(moneyAcc >= cost){
                  moneyAcc -= cost
                }
              }
            } else {
              if(prev.miners.length>0){
                const sorted = [...prev.miners].sort((a,b)=> a.level - b.level)
                const target = sorted[0]
                const cost = Math.round(30 * Math.pow(1.6, target.level-1))
                if(moneyAcc >= cost){
                  moneyAcc -= cost
                }
              }
            }
          }
          return {...mgr, tick: nextTick}
        })

        const produced = minersProd + minesProd
        let newMined = prev.mined + produced
        
        // Add XP to tool (scaled down to slow progression)
        let tool = {...prev.tool, xp: prev.tool.xp + produced * 0.25}
        let lastEvent = prev.lastEvent
        
        // Check tool level up
        if(tool.xp >= tool.xpNeeded){
          const currentToolIdx = TOOLS.findIndex(t => t.id === tool.id)
          if(currentToolIdx < TOOLS.length - 1){
            const nextTool = TOOLS[currentToolIdx + 1]
            tool = {
              ...tool,
              id: nextTool.id,
              name: nextTool.name,
              emoji: nextTool.emoji,
              level: tool.level + 1,
              xp: tool.xp - tool.xpNeeded,
              xpNeeded: Math.round(tool.xpNeeded * 1.5),
              multiplier: nextTool.multiplier
            }
            lastEvent = { id: Date.now().toString(), type: 'boom', trigger: tickRef.current }
          }
        }

        // Auto-sell if enabled and price is high (reduced throughput)
        let autoSoldMoney = 0
        if(prev.autoSellLevel > 0 && newMined > 0 && prev.marketPrice >= prev.autoSellPrice){
          const amountToSell = Math.min(newMined, Math.floor(prev.autoSellLevel * 25))
          autoSoldMoney = amountToSell * prev.marketPrice
          newMined -= amountToSell
        }

        // Apply taxes (5% on money gained)
        const taxAmount = (produced * prev.marketPrice * 0.01 + autoSoldMoney + moneyFromManagers) * 0.05
        let newMoney = moneyAcc + moneyFromManagers + produced * prev.marketPrice * 0.01 + autoSoldMoney - taxAmount

        // Dynamic price with crashes (more difficult market)
        let p = prev.marketPrice
        const priceChange = Math.sin(Date.now()/8000 + tickRef.current)*0.025 + rand(-0.015, 0.025)
        
        // 5% chance of severe market crash (more punishing)
        if(Math.random() < 0.05 && tickRef.current % 8 === 0){
          p *= 0.5 // 50% crash
          lastEvent = { id: Date.now().toString(), type: 'crash', trigger: tickRef.current }
        } else if(Math.random() < 0.04 && tickRef.current % 12 === 0){
          p *= 1.6 // 60% boom (rarer)
          lastEvent = { id: Date.now().toString(), type: 'boom', trigger: tickRef.current }
        } else {
          p += priceChange * 0.8
        }
        
        p = Math.max(0.05, p)

        tickRef.current++

        let mines = prev.mines.map(m=> ({...m}))
        let miners = prev.miners.map(m=> ({...m}))
        let remainingMoney = moneyAcc
        for(const mgr of managers){
          if(mgr.type !== 'foreman') continue
          if((mgr.tick || 0) % 15 === 0){
            if(mgr.targetMineId){
              const mi = mines.find(x=> x.id === mgr.targetMineId)
              if(mi){
                const cost = Math.round(300 * Math.pow(1.85, mi.level-1))
                if(remainingMoney >= cost){
                  mi.level += 1
                  remainingMoney -= cost
                }
              }
            } else {
              if(miners.length>0){
                const sortedIdx = miners.map((m,i)=>({m,i})).sort((a,b)=> a.m.level - b.m.level)[0]
                if(sortedIdx){
                  const target = miners[sortedIdx.i]
                  const cost = Math.round(30 * Math.pow(1.6, target.level-1))
                  if(remainingMoney >= cost){
                    target.level += 1
                    target.speed = Number((target.speed * 1.6).toFixed(3))
                    remainingMoney -= cost
                  }
                }
              }
            }
          }
        }

        const next:GameState = {
          ...prev, 
          mined: Number(newMined.toFixed(3)), 
          money: Number(newMoney.toFixed(2)), 
          marketPrice: Number(p.toFixed(3)), 
          managers, 
          mines, 
          miners, 
          totalProduction: produced,
          tool,
          totalTaxesPaid: prev.totalTaxesPaid + taxAmount,
          lastEvent
        }
        try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }catch{}
        return next
      })
    }, 1000)
    return ()=>clearInterval(id)
  },[])

  function hireMiner(){
    setState(prev=>{
      const cost = Math.round(30 + prev.miners.length*8)
      if(prev.money < cost) return prev
      const m:Miner = { id: Date.now().toString(), level:1, speed: 1 + prev.miners.length*0.1, cost }
      return {...prev, money: Number((prev.money - cost).toFixed(2)), miners: [...prev.miners, m] }
    })
  }

  function fireMiner(id:string){
    setState(prev=>{
      const miner = prev.miners.find(m=>m.id===id)
      if(!miner) return prev
      const refund = Math.round(miner.cost * 0.5)
      return {...prev, money: Number((prev.money + refund).toFixed(2)), miners: prev.miners.filter(m=>m.id!==id)}
    })
  }

  function upgradeMiner(id:string){
    setState(prev=>{
      const miner = prev.miners.find(m=>m.id===id)
      if(!miner) return prev
      const cost = Math.round(30 * Math.pow(1.6, miner.level-1))
      if(prev.money < cost) return prev
      const miners = prev.miners.map(m=> m.id===id ? {...m, level:m.level+1, speed: Number((m.speed * 1.6).toFixed(3))} : m)
      return {...prev, miners, money: Number((prev.money - cost).toFixed(2))}
    })
  }

  function upgradeMine(id:string){
    setState(prev=>{
      const mine = prev.mines.find(m=>m.id===id)
      if(!mine) return prev
      const cost = Math.round(300 * Math.pow(1.85, mine.level-1))
      if(prev.money < cost) return prev
      const mines = prev.mines.map(m=> m.id===id ? {...m, level:m.level+1} : m)
      return {...prev, mines, money: Number((prev.money - cost).toFixed(2))}
    })
  }

  function sellAll(){
    setState(prev=>{
      const revenue = prev.mined * prev.marketPrice
      return {...prev, money: Number((prev.money+revenue).toFixed(2)), mined: 0}
    })
  }

  function unlockMine(mineId:string){
    setState(prev=>{
      const mines = prev.mines.map(m=> {
        if(m.id !== mineId) return m
        if(m.unlocked) return m
        if(prev.money < m.unlockCost) return m
        return {...m, unlocked:true}
      })
      const cost = prev.mines.find(m=>m.id===mineId)?.unlockCost || 0
      if(prev.money < cost) return prev
      return {...prev, money: Number((prev.money - cost).toFixed(2)), mines}
    })
  }

  function hireManager(name:string, type:'collector'|'foreman', targetMineId?:string){
    setState(prev=>{
      const cost = Math.round(100 + prev.managers.length*150)
      if(prev.money < cost) return prev
      const mgr:Manager = { id: Date.now().toString(), name, cost, type, targetMineId }
      return {...prev, money: Number((prev.money - cost).toFixed(2)), managers: [...prev.managers, mgr]}
    })
  }

  function setManagerTarget(managerId:string, targetMineId?:string){
    setState(prev=>{
      const managers = prev.managers.map(m=> m.id===managerId ? {...m, targetMineId} : m)
      return {...prev, managers}
    })
  }

  function upgradeSkill(skillId:string){
    setState(prev=>{
      const skill = prev.skills.find(s=>s.id===skillId)
      if(!skill || skill.level >= skill.maxLevel) return prev
      const cost = Math.round(skill.cost * Math.pow(1.5, skill.level))
      if(prev.money < cost) return prev
      const skills = prev.skills.map(s=> s.id===skillId ? {...s, level: s.level+1} : s)
      return {...prev, skills, money: Number((prev.money - cost).toFixed(2))}
    })
  }

  function acquireEnterprise(enterpriseId:string){
    setState(prev=>{
      const enterprise = prev.enterprises.find(e=>e.id===enterpriseId)
      if(!enterprise || enterprise.owned) return prev
      if(prev.money < enterprise.cost) return prev
      const enterprises = prev.enterprises.map(e=> e.id===enterpriseId ? {...e, owned:true} : e)
      return {...prev, enterprises, money: Number((prev.money - enterprise.cost).toFixed(2))}
    })
  }

  function upgradeAutoSell(level: number){
    const cost = Math.round(1200 * Math.pow(2, level))
    setState(prev=>{
      if(prev.money < cost) return prev
      return {...prev, autoSellLevel: level + 1, money: Number((prev.money - cost).toFixed(2))}
    })
  }

  function setAutoSellPrice(price: number){
    setState(prev=> ({...prev, autoSellPrice: price}))
  }

  function purchaseToolXP(amount: number = 100){
    setState(prev=>{
      const baseCost = Math.round(20000 * Math.pow(2.5, Math.max(0, prev.tool.level-1)))
      const cost = Math.round(baseCost * (amount / 100))
      if(prev.money < cost) return prev
      const tool = {...prev.tool, xp: prev.tool.xp + amount}
      return {...prev, money: Number((prev.money - cost).toFixed(2)), tool}
    })
  }

  // NEW FEATURE: Claim daily bonus
  function claimDailyBonus(){
    setState(prev=>{
      const now = new Date().getDate()
      if(prev.dailyBonusDay === now) return prev // already claimed today
      const newStreak = prev.dailyBonusDay === now - 1 ? prev.dailyStreaks + 1 : 1
      const bonusAmount = prev.dailyBonusAmount * (1 + newStreak * 0.1)
      return {...prev, money: Number((prev.money + bonusAmount).toFixed(2)), dailyBonusDay: now, dailyStreaks: newStreak}
    })
  }

  // NEW FEATURE: Unlock perk
  function unlockPerk(perkId: string){
    setState(prev=>{
      const cost = 5000 * Math.pow(1.5, prev.perks.filter(p=>p.unlocked).length)
      if(prev.money < cost) return prev
      const newPerks = prev.perks.some(p=>p.id===perkId) ? prev.perks.map(p=> p.id===perkId ? {...p, level: p.level+1} : p) : [...prev.perks, {id: perkId, level: 1, unlocked: true}]
      return {...prev, money: Number((prev.money - cost).toFixed(2)), perks: newPerks}
    })
  }

  // NEW FEATURE: Unlock research
  function unlockResearch(researchId: string){
    setState(prev=>{
      const cost = 50000 * Math.pow(2, prev.researchItems.filter(r=>r.unlocked).length)
      if(prev.money < cost) return prev
      const newResearch = [...prev.researchItems, {id: researchId, unlocked: true}]
      return {...prev, money: Number((prev.money - cost).toFixed(2)), researchItems: newResearch}
    })
  }

  // NEW FEATURE: Enable auto-upgrade
  function setAutoUpgrade(enabled: boolean, level: number){
    setState(prev=> ({...prev, autoUpgradeEnabled: enabled, autoUpgradeLevel: level}))
  }

  // NEW FEATURE: Track total miners hired
  function hireMinerTracked(){
    hireMiner()
    setState(prev=> ({...prev, totalMinersHired: prev.totalMinersHired + 1}))
  }

  return {state, hireMiner: hireMinerTracked, fireMiner, upgradeMiner, upgradeMine, sellAll, unlockMine, hireManager, setManagerTarget, upgradeSkill, acquireEnterprise, upgradeAutoSell, setAutoSellPrice, purchaseToolXP, claimDailyBonus, unlockPerk, unlockResearch, setAutoUpgrade}
}
