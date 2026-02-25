export type ModelKey = 'abc' | 'eep' | 'emi' | 'evr' | 'cli'
export type Plan = 'free' | 'pro'
export type Role = 'user' | 'assistant'

export interface ModelMeta {
  key: ModelKey
  name: string
  shortName: string
  icon: string
  desc: string
  welcome: string
  verse: string
  plan: Plan // plano mínimo necessário
}

export interface Message {
  id?: string
  role: Role
  content: string
  created_at?: string
}

export interface Conversation {
  id: string
  model: ModelKey
  title: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: Plan
  stripe_customer_id: string | null
  mp_preapproval_id: string | null
  mp_subscription_status: 'none' | 'pending' | 'authorized' | 'paused' | 'cancelled' | null
}

export interface UsageInfo {
  current: number
  limit: number
  plan: Plan
}
