/**
 * Format large numbers: 1000 -> 1k, 1000000 -> 1M, 1000000000 -> 1aa, etc.
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toFixed(0)
  
  const suffixes = ['k', 'M']
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  
  // Thousands and millions
  if (num < 1000000) return (num / 1000).toFixed(2) + 'k'
  if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M'
  
  // Billions and beyond: aa, ab, ac, ... ba, bb, ... za, zz, aaa, etc.
  let scaled = num / 1000000000
  let suffixIndex = 0
  
  // For billions (aa-zz range: 1-676 billions)
  if (scaled < 1000) {
    const billionLevel = Math.floor(scaled)
    if (billionLevel === 0) return (scaled).toFixed(2) + 'aa'
    
    let suffix = ''
    let level = billionLevel
    
    // Generate suffix: aa, ab, ac, ... zz, aaa, aab, etc.
    while (level > 0) {
      const letterIdx = (level - 1) % 26
      suffix = letters[letterIdx] + suffix
      level = Math.floor((level - 1) / 26)
      if (level === 0) break
    }
    
    // Ensure at least 2 letters (aa minimum)
    while (suffix.length < 2) {
      suffix = 'a' + suffix
    }
    
    return (scaled).toFixed(2) + suffix
  }
  
  // For very large numbers (trillions+): use exponential notation for now
  return (num / 1000000000).toFixed(2) + 'aa'
}

/**
 * Shorter format for UI display (1.2k, 5M, etc.)
 */
export function formatNumberShort(num: number): string {
  if (num < 1000) return num.toFixed(0)
  if (num < 1000000) return (num / 1000).toFixed(1) + 'k'
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M'
  
  // For billions: use aa, ab, ac, etc.
  let scaled = num / 1000000000
  if (scaled < 1000) {
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    const billionLevel = Math.floor(scaled)
    
    if (billionLevel === 0) return scaled.toFixed(1) + 'aa'
    
    let suffix = ''
    let level = billionLevel
    
    while (level > 0) {
      const letterIdx = (level - 1) % 26
      suffix = letters[letterIdx] + suffix
      level = Math.floor((level - 1) / 26)
      if (level === 0) break
    }
    
    while (suffix.length < 2) {
      suffix = 'a' + suffix
    }
    
    return scaled.toFixed(1) + suffix
  }
  
  return (num / 1000000000).toFixed(1) + 'aa'
}
