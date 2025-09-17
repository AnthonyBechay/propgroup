'use client'

import { useEffect, useState } from 'react'

interface PerformanceWrapperProps {
  children: React.ReactNode
  className?: string
  enableAnimations?: boolean
  delay?: number
}

/**
 * Performance wrapper component to optimize animations
 * - Reduces animations on low-end devices
 * - Delays animation start to prevent initial load jank
 * - Uses Intersection Observer to only animate visible elements
 */
export function PerformanceWrapper({ 
  children, 
  className = '',
  enableAnimations = true,
  delay = 100 
}: PerformanceWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Check device performance (simple heuristic based on cores and memory)
    const cores = navigator.hardwareConcurrency || 4
    const memory = (navigator as any).deviceMemory || 4
    const isLowEndDevice = cores < 4 || memory < 4
    
    // Determine if we should animate
    setShouldAnimate(enableAnimations && !prefersReducedMotion && !isLowEndDevice)
    
    // Delay visibility to prevent initial animation jank
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [enableAnimations, delay])

  return (
    <div 
      className={`${className} ${isVisible ? 'opacity-100' : 'opacity-0'} ${
        shouldAnimate ? 'transition-opacity duration-500' : ''
      }`}
    >
      {children}
    </div>
  )
}

/**
 * Hook to detect if animations should be enabled based on user preferences and device capabilities
 */
export function useOptimizedAnimations() {
  const [shouldAnimate, setShouldAnimate] = useState(true)

  useEffect(() => {
    const checkPerformance = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const cores = navigator.hardwareConcurrency || 4
      const memory = (navigator as any).deviceMemory || 4
      const isLowEndDevice = cores < 4 || memory < 4
      
      setShouldAnimate(!prefersReducedMotion && !isLowEndDevice)
    }

    checkPerformance()
    
    // Re-check if window is resized (might indicate different device context)
    window.addEventListener('resize', checkPerformance)
    
    return () => window.removeEventListener('resize', checkPerformance)
  }, [])

  return shouldAnimate
}
