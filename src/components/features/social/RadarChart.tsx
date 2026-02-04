'use client'

import { useMemo } from 'react'
import type { AxisScore } from '@/types'

interface RadarChartProps {
  myScores: AxisScore[]
  friendScores: AxisScore[]
  size?: number
  className?: string
}

export function RadarChart({
  myScores,
  friendScores,
  size = 300,
  className,
}: RadarChartProps) {
  const center = size / 2
  const radius = (size / 2) * 0.75
  const levels = 5 // 1 to 5 score levels

  // Calculate points for polygon
  const calculatePoints = (scores: AxisScore[]) => {
    const points: { x: number; y: number }[] = []
    const angleStep = (2 * Math.PI) / scores.length

    scores.forEach((score, index) => {
      const angle = angleStep * index - Math.PI / 2 // Start from top
      const value = score.finalScore ?? score.averageScore ?? 3
      const normalizedValue = (value - 1) / 4 // Normalize 1-5 to 0-1
      const distance = radius * normalizedValue

      points.push({
        x: center + distance * Math.cos(angle),
        y: center + distance * Math.sin(angle),
      })
    })

    return points
  }

  const myPoints = useMemo(() => calculatePoints(myScores), [myScores])
  const friendPoints = useMemo(() => calculatePoints(friendScores), [friendScores])

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = []
    const angleStep = (2 * Math.PI) / myScores.length

    // Concentric circles
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level
      lines.push(
        <circle
          key={`circle-${level}`}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          opacity={0.5}
        />
      )
    }

    // Radial lines
    myScores.forEach((_, index) => {
      const angle = angleStep * index - Math.PI / 2
      const x2 = center + radius * Math.cos(angle)
      const y2 = center + radius * Math.sin(angle)

      lines.push(
        <line
          key={`line-${index}`}
          x1={center}
          y1={center}
          x2={x2}
          y2={y2}
          stroke="hsl(var(--border))"
          strokeWidth={1}
          opacity={0.5}
        />
      )
    })

    return lines
  }, [myScores, center, radius, levels])

  // Generate axis labels
  const axisLabels = useMemo(() => {
    const angleStep = (2 * Math.PI) / myScores.length
    const labelRadius = radius + 24

    return myScores.map((score, index) => {
      const angle = angleStep * index - Math.PI / 2
      const x = center + labelRadius * Math.cos(angle)
      const y = center + labelRadius * Math.sin(angle)

      return (
        <text
          key={`label-${index}`}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-xs font-medium"
        >
          {score.axisName.length > 4 ? score.axisName.slice(0, 4) : score.axisName}
        </text>
      )
    })
  }, [myScores, center, radius])

  // Convert points to SVG path
  const pointsToPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return ''
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  }

  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto"
      >
        {/* Grid */}
        {gridLines}

        {/* My score polygon */}
        <path
          d={pointsToPath(myPoints)}
          fill="hsl(var(--primary))"
          fillOpacity={0.3}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />

        {/* Friend score polygon */}
        <path
          d={pointsToPath(friendPoints)}
          fill="hsl(24 95% 53%)"
          fillOpacity={0.3}
          stroke="hsl(24 95% 53%)"
          strokeWidth={2}
        />

        {/* Score points - My */}
        {myPoints.map((point, index) => (
          <circle
            key={`my-point-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="hsl(var(--primary))"
          />
        ))}

        {/* Score points - Friend */}
        {friendPoints.map((point, index) => (
          <circle
            key={`friend-point-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="hsl(24 95% 53%)"
          />
        ))}

        {/* Axis labels */}
        {axisLabels}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">나</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(24 95% 53%)' }} />
          <span className="text-sm text-muted-foreground">친구</span>
        </div>
      </div>
    </div>
  )
}
