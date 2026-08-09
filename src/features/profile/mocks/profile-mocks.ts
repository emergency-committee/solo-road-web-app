import type { PermissionSetting } from '../types/profile.types'

// 백엔드에 권한 설정 저장 엔드포인트가 없어 기본값/문구만 프론트에서 관리한다.
export const mockPermissionSettings: PermissionSetting[] = [
  {
    id: 'location',
    title: '위치 정보 접근',
    description: '가장 안전한 경로를 추천하고 혼자 걷는 동안 실시간 혼잡도 정보를 제공하기 위해 사용됩니다.',
    enabled: true,
  },
  {
    id: 'safety-data',
    title: '안전 데이터 공유',
    description: '실시간 안전 데이터를 신뢰할 수 있는 연락처와 공유합니다.',
    enabled: false,
  },
  {
    id: 'emergency-contact',
    title: '비상 연락처 접근',
    description: '위급 상황 발생 시 등록된 비상 연락처에 자동으로 알립니다.',
    enabled: false,
  },
]
