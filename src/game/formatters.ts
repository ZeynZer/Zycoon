/**
 * Format large numbers: 1000 -> 1k, 1000000 -> 1M, 1000000000 -> 1aa, etc.
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toFixed(0)
  
  const units = ['', 'k', 'M']
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  
  let divisor = 1000
  let unitIndex = 0
  let value = num
  
  // Handle billions (1B = 1aa, 1T = 1ba, etc.)
  if (num >= 1000000000) {
    const billions = Math.floor(num / 1000000000)
    if (billions < 26) {
      return `${(num / 1000000000).toFixed(2)}${letters[billions - 1]}a`
    } else if (billions < 676) {
      // aa-az, ba-bz, etc.
      const first = Math.floor((billions - 1) / 26)
      const second = (billions - 1) % 26
      return `${(num / 1000000000).toFixed(2)}${letters[first]}${letters[second]}`
    }
  }
  
  // Handle millions and thousands
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000
    unitIndex++
  }
  
  return `${value.toFixed(2)}${units[unitIndex]}`
}

/**
 * Shorter format for UI display (1.2k, 5M, etc.)
 */
export function formatNumberShort(num: number): string {
  if (num < 1000) return num.toFixed(0)
  if (num < 1000000) return (num / 1000).toFixed(1) + 'k'
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M'
  
  const billions = num / 1000000000
  if (billions < 26) {
    return `${billions.toFixed(1)}${String.fromCharCode(96 + billions.toFixed(0).length)}a`
  }
  return `${(num / 1000000000).toFixed(2)}B`
}
