export interface UserProfile {
  name: string
  avatarUrl: string
  avatarAlt: string
  stats: { label: string; value: number }[]
}

export interface PermissionSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}
