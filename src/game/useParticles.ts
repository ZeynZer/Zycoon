import React, { useEffect } from 'react'

declare global {
  interface Window {
    __particles?: {
      addParticles: (x: number, y: number, type: 'mine' | 'sell' | 'upgrade' | 'coin') => void
    }
    __spawnEmoji?: (x:number,y:number,emoji:string,count?:number)=>void
  }
}

export function triggerParticles(x: number, y: number, type: 'mine' | 'sell' | 'upgrade' | 'coin') {
  if (window.__particles) {
    window.__particles.addParticles(x, y, type)
  }
}

export function spawnEmoji(x:number,y:number,emoji:string,count:number=8){
  if((window as any).__spawnEmoji) return (window as any).__spawnEmoji(x,y,emoji,count)
  // fallback: create simple floating emojis
  for(let i=0;i<count;i++){
    const el = document.createElement('div')
    el.textContent = emoji
    el.style.position = 'fixed'
    el.style.left = `${x + (Math.random()*80-40)}px`
    el.style.top = `${y + (Math.random()*40-20)}px`
    el.style.pointerEvents = 'none'
    el.style.fontSize = '20px'
    el.style.opacity = '1'
    el.style.transition = 'transform 900ms ease-out, opacity 900ms linear'
    document.body.appendChild(el)
    requestAnimationFrame(()=>{
      el.style.transform = `translateY(${-(80 + Math.random()*60)}px) translateX(${(Math.random()*120-60)}px) rotate(${Math.random()*360}deg)`
      el.style.opacity = '0'
    })
    setTimeout(()=>el.remove(),1000)
  }
}

export default function useParticles() {
  return { triggerParticles, spawnEmoji }
}
