// hooks/use-toast.ts
import { useState } from 'react'

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts(prev => [...prev, props])
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== props))
    }, 5000)
    
    // For now, also use console
    console.log(`Toast [${props.variant}]: ${props.title} - ${props.description}`)
  }

  return { toast }
}