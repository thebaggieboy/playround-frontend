// hooks/use-toast.ts
import { useState, type ReactNode } from 'react'

interface ToastProps {
  title: string
  description?: ReactNode
  variant?: 'default' | 'destructive'
  className?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts(prev => [...prev, props])
    
    // Auto-remove toast after its requested duration, defaulting to 5 seconds.
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== props))
    }, props.duration ?? 5000)
    
    // For now, also use console
    console.log(`Toast [${props.variant}]: ${props.title} - ${props.description}`)
  }

  return { toast }
}