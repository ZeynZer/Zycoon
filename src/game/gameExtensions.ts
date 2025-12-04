/**
 * Extended game constants and types for expanded feature set
 */

export type Prestige = {
  level: number
  totalPrestige: number
  multiplier: number // cumulative prestige bonus to income
}

export type DailyBonus = {
  lastClaimDay: number
  streak: number
  nextBonusAmount: number
}

export type Achievement = {
  id: string
  name: string
  desc: string
  unlocked: boolean
  reward: number // bonus money/xp
}

export type PerkTree = {
  id: string
  name: string
  desc: string
  cost: number
  level: number
  maxLevel: number
  effect: string // 'passiveIncome' | 'critChance' | 'speedBoost' | etc
  unlocked: boolean
}

export type ResearchLab = {
  id: string
  name: string
  description: string
  cost: number
  unlocked: boolean
  bonus: number // % or flat bonus
}

export type MiniGame = {
  type: 'mining_frenzy' | 'quick_sell' | 'price_predict'
  active: boolean
  reward: number
  duration: number
}

export type Milestone = {
  moneyReached: number
  unlocked: boolean
}

export const PERKS = [
  { id: 'p1', name: 'Passive Mines', desc: '+0.5% income per sec', effect: 'passiveIncome', baseCost: 5000 },
  { id: 'p2', name: 'Lucky Strike', desc: '+5% crit chance', effect: 'critChance', baseCost: 8000 },
  { id: 'p3', name: 'Speed Boost', desc: '+10% miners speed', effect: 'minerSpeed', baseCost: 6000 },
  { id: 'p4', name: 'Rich Bonus', desc: '+2% money find bonus', effect: 'moneyBonus', baseCost: 12000 },
  { id: 'p5', name: 'Doubler', desc: '5% chance x2 ore', effect: 'oreDoubler', baseCost: 15000 },
]

export const RESEARCH = [
  { id: 'r1', name: 'Advanced Mining Tech', desc: '+20% all production', cost: 50000, bonus: 0.2 },
  { id: 'r2', name: 'Market Prediction', desc: 'See price trends', cost: 80000, bonus: 0 },
  { id: 'r3', name: 'Quantum Extraction', desc: '+15% efficiency', cost: 120000, bonus: 0.15 },
  { id: 'r4', name: 'AI Optimization', desc: 'Auto-manage miners', cost: 200000, bonus: 0 },
  { id: 'r5', name: 'Fusion Reactor', desc: '+50% energy output', cost: 500000, bonus: 0.5 },
]

export const ACHIEVEMENTS = [
  { id: 'a1', name: '💰 Millionaire', desc: 'Reach $1M', threshold: 1000000 },
  { id: 'a2', name: '💎 Billionaire', desc: 'Reach $1B', threshold: 1000000000 },
  { id: 'a3', name: '⛏️ Master Miner', desc: 'Hire 50 miners', threshold: 50 },
  { id: 'a4', name: '🌍 World Domination', desc: 'Unlock all mines', threshold: 3 },
  { id: 'a5', name: '🏆 Power User', desc: 'Reach prestige 10', threshold: 10 },
]
