import { toast as toastFunction } from "./toast"

export const toast = toastFunction

export function useToast() {
  return {
    toast: toastFunction,
  }
}
