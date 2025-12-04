import React, { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  isEmoji?: boolean
  emoji?: string
}

export default function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      // Clear canvas with transparency instead of opaque background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2 // gravity
        p.life -= 1

        const alpha = (p.life / p.maxLife) * 0.8
        if (p.isEmoji && p.emoji) {
          ctx.globalAlpha = alpha
          ctx.font = `${Math.max(12, p.size * 6)}px serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(p.emoji, p.x, p.y)
          ctx.globalAlpha = 1
        } else {
          ctx.fillStyle = p.color.replace(')', `, ${alpha})`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        if (p.life <= 0) {
          particles.splice(i, 1)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  const addParticles = (x: number, y: number, type: 'mine' | 'sell' | 'upgrade' | 'coin', emoji?: string, countOverride?: number) => {
    const count = typeof countOverride === 'number' ? countOverride : (type === 'mine' ? 3 : type === 'sell' ? 8 : type === 'upgrade' ? 5 : 10)
    const colors =
      type === 'mine'
        ? ['rgba(251, 191, 36, 1)', 'rgba(249, 115, 22, 1)']
        : type === 'sell'
        ? ['rgba(34, 197, 94, 1)', 'rgba(52, 211, 153, 1)']
        : ['rgba(59, 130, 246, 1)', 'rgba(139, 92, 246, 1)']

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / Math.max(1, count)
      const speed = 2 + Math.random() * 3
      const isEmoji = type === 'coin' || !!emoji
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * (speed + Math.random() * 2),
        vy: Math.sin(angle) * (speed + Math.random() * 2) - 1,
        life: 60 + Math.random() * 40,
        maxLife: 100,
        size: isEmoji ? (4 + Math.random() * 4) : (2 + Math.random() * 3),
        color: colors[Math.floor(Math.random() * colors.length)],
        isEmoji: isEmoji,
        emoji: emoji || (isEmoji ? '💵' : undefined)
      } as Particle)
    }
  }

  useEffect(() => {
    // Expose globally for other components
    ;(window as any).__particles = { addParticles }
    ;(window as any).__spawnEmoji = (x:number,y:number,emoji:string,count:number=8) => {
      addParticles(x, y, 'coin', emoji, count)
    }
  }, [])

  const handleResize = () => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  )
}
