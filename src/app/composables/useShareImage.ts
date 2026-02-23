/**
 * Generate a shareable result card image using Canvas 2D API.
 * No external dependencies — fully client-side.
 */

export interface ShareImageData {
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  score: number
  accuracy: number // 0–100
  correctCount: number
  totalCount: number
  mode: string
  app: string
  streak?: number
}

interface ShareImageOptions {
  width?: number
  height?: number
}

const GRADE_COLORS: Record<string, string> = {
  S: '#f59e0b',
  A: '#84cc16',
  B: '#00d4ff',
  C: '#a855f7',
  D: '#f43f5e'
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function buildCanvas(data: ShareImageData, opts: ShareImageOptions = {}): HTMLCanvasElement {
  const W = opts.width ?? 800
  const H = opts.height ?? 420
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H

  const ctx = canvas.getContext('2d')!
  const gradeColor = GRADE_COLORS[data.grade] ?? '#00d4ff'

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0a0f1e')
  bg.addColorStop(1, '#0d1b2a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Accent line top
  ctx.fillStyle = gradeColor
  ctx.fillRect(0, 0, W, 4)

  // App + mode label
  ctx.fillStyle = '#64748b'
  ctx.font = '600 14px system-ui, sans-serif'
  ctx.fillText(`${data.app.toUpperCase()}  ·  ${data.mode.replace(/-/g, ' ').toUpperCase()}`, 40, 48)

  // Brand
  ctx.fillStyle = '#00d4ff'
  ctx.font = '700 14px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('⌨ Shortcut Mastery', W - 40, 48)
  ctx.textAlign = 'left'

  // Grade circle
  const cx = 130
  const cy = 220
  ctx.beginPath()
  ctx.arc(cx, cy, 72, 0, Math.PI * 2)
  ctx.fillStyle = `${gradeColor}18`
  ctx.fill()
  ctx.strokeStyle = gradeColor
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = gradeColor
  ctx.font = '700 64px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(data.grade, cx, cy)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // Score
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 56px system-ui, sans-serif'
  ctx.fillText(data.score.toLocaleString(), 240, 200)

  ctx.fillStyle = '#64748b'
  ctx.font = '500 16px system-ui, sans-serif'
  ctx.fillText('SCORE', 240, 226)

  // Stats row
  const statY = 310
  const stats = [
    { label: 'ACCURACY', value: `${Math.round(data.accuracy)}%` },
    { label: 'CORRECT', value: `${data.correctCount}/${data.totalCount}` },
    ...(data.streak ? [{ label: 'BEST STREAK', value: `×${data.streak}` }] : [])
  ]

  stats.forEach((s, i) => {
    const x = 240 + i * 170

    drawRoundRect(ctx, x, statY - 36, 150, 60, 8)
    ctx.fillStyle = '#ffffff0d'
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = '700 22px system-ui, sans-serif'
    ctx.fillText(s.value, x + 12, statY)

    ctx.fillStyle = '#64748b'
    ctx.font = '600 11px system-ui, sans-serif'
    ctx.fillText(s.label, x + 12, statY + 18)
  })

  // Footer
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, H - 50, W, 50)
  ctx.fillStyle = '#475569'
  ctx.font = '500 13px system-ui, sans-serif'
  ctx.fillText('shortcutmastery.app  ·  Learn keyboard shortcuts the fun way', 40, H - 18)

  return canvas
}

export function useShareImage() {
  /**
   * Generate the result card as a data URL (PNG).
   * Returns null in SSR or if canvas is not supported.
   */
  function generateDataUrl(data: ShareImageData, opts: ShareImageOptions = {}): string | null {
    if (!import.meta.client) return null
    const canvas = buildCanvas(data, opts)
    return canvas.toDataURL('image/png')
  }

  /**
   * Share via Web Share API if available, otherwise download.
   */
  async function share(data: ShareImageData, opts: ShareImageOptions = {}): Promise<void> {
    if (!import.meta.client) return

    const canvas = buildCanvas(data, opts)

    // Try Web Share API with file
    if (navigator.canShare) {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(b => resolve(b!), 'image/png')
      })
      const file = new File([blob], 'shortcut-mastery-result.png', { type: 'image/png' })

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `I scored ${data.score.toLocaleString()} in Shortcut Mastery!`,
          text: `Grade ${data.grade} · ${Math.round(data.accuracy)}% accuracy · ${data.mode} mode`,
          files: [file]
        })
        return
      }
    }

    // Fallback: download
    download(data, opts)
  }

  /** Download the card as a PNG file */
  function download(data: ShareImageData, opts: ShareImageOptions = {}): void {
    if (!import.meta.client) return

    const canvas = buildCanvas(data, opts)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `shortcut-mastery-${data.grade}-${data.score}.png`
    a.click()
  }

  return { generateDataUrl, share, download }
}
