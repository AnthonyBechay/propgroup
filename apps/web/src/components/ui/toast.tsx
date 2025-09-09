"use client"

import { useEffect, useState } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

interface ToastProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const ToastComponent = ({ toast, onDismiss }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const variantStyles = {
    default: "bg-white border-gray-200",
    destructive: "bg-red-50 border-red-200 text-red-900",
  }

  return (
    <div
      className={`max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${
        variantStyles[toast.variant || "default"]
      } border p-4`}
    >
      <div className="flex-1">
        {toast.title && (
          <p className="text-sm font-medium">{toast.title}</p>
        )}
        {toast.description && (
          <p className="mt-1 text-sm opacity-90">{toast.description}</p>
        )}
      </div>
      {toast.action}
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

const toastState = {
  toasts: [] as Toast[],
  listeners: [] as ((toasts: Toast[]) => void)[],
  
  addToast(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    this.toasts = [...this.toasts, newToast]
    this.notify()
    return id
  },
  
  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.notify()
  },
  
  notify() {
    this.listeners.forEach((listener) => listener(this.toasts))
  },
  
  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  },
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toastState.subscribe(setToasts)
  }, [])

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={(id) => toastState.removeToast(id)}
          />
        ))}
      </div>
    </div>
  )
}

export function toast(props: Omit<Toast, "id">) {
  return toastState.addToast(props)
}
