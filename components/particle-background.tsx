"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    const particles: Particle[] = []
    const colors = ["#ff6600", "#cc3300", "#ffd700", "#ff4400", "#ff8800"]

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const createParticle = (): Particle => {
      const maxLife = 150 + Math.random() * 100
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -1 - Math.random() * 2,
        size: 1 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife,
      }
    }

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      const p = createParticle()
      p.y = Math.random() * canvas.height
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new particles
      if (particles.length < 100 && Math.random() > 0.85) {
        particles.push(createParticle())
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life++

        // Fade in and out
        const lifeRatio = p.life / p.maxLife
        let currentOpacity = p.opacity
        if (lifeRatio < 0.1) {
          currentOpacity = p.opacity * (lifeRatio / 0.1)
        } else if (lifeRatio > 0.8) {
          currentOpacity = p.opacity * ((1 - lifeRatio) / 0.2)
        }

        // Draw particle with glow
        ctx.save()
        ctx.globalAlpha = currentOpacity * 0.3
        ctx.shadowBlur = 15
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Draw core
        ctx.globalAlpha = currentOpacity
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Remove dead particles
        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1)
        }
      }

      // Draw floating embers (small sparks)
      for (let i = 0; i < 5; i++) {
        if (Math.random() > 0.97) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          ctx.globalAlpha = 0.6 + Math.random() * 0.4
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  )
}
