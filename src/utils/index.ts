import { twMerge } from 'tailwind-merge'
import { AES, enc } from 'crypto-js'
import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encrypt(data: string) {
  const encrypted = AES.encrypt(data, import.meta.env.VITE_ENCODE_KEY)

  return encrypted.toString()
}

export function decrypt(str: string) {
  const data = AES.decrypt(str, import.meta.env.VITE_ENCODE_KEY)

  return data.toString(enc.Utf8)
}
