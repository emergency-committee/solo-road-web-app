import type { PermissionSetting, UserProfile } from '../types/profile.types'

export const mockUserProfile: UserProfile = {
  name: '김지우',
  avatarUrl: 'https://picsum.photos/seed/solo-road-profile/160/160',
  avatarAlt: '프로필 사진',
  stats: [
    { label: 'My Walks', value: 12 },
    { label: 'Photos', value: 48 },
  ],
}

export const mockPermissionSettings: PermissionSetting[] = [
  {
    id: 'location',
    title: 'Location Access',
    description:
      'Allows us to recommend the safest routes and provide real-time crowd density data for your solo walk.',
    enabled: true,
  },
  {
    id: 'safety-data',
    title: 'Safety Data Sharing',
    description: '실시간 안전 데이터를 신뢰할 수 있는 연락처와 공유합니다.',
    enabled: false,
  },
  {
    id: 'emergency-contact',
    title: 'Emergency Contact Access',
    description: '위급 상황 발생 시 등록된 비상 연락처에 자동으로 알립니다.',
    enabled: false,
  },
]
