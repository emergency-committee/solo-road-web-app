export interface Coordinate {
  lat: number
  lng: number
}

export interface RouteOption {
  distanceM: number
  durationMinutes: number
  safetyScore: number
  facilityScore: number
  path: Coordinate[]
}

export interface RouteSafetyDetails {
  routeStrategy: 'BROAD_FIRST' | 'BROAD_FIRST_WITH_SAFE_WAYPOINT' | 'SHORTEST_ALREADY_SAFEST'
  scoreBasis: string
  facilityScore: number
  sampledPointCount: number
  lightingCoveragePercent: number
  streetLightCoveragePercent: number
  securityLightCoveragePercent: number
  cctvCoveragePercent: number
  policeCoveragePercent: number
  nearbyLightCount: number
  nearbyCctvCount: number
  nearbyPoliceCount: number
  baseLightingCoveragePercent: number
  baseCctvCoveragePercent: number
  basePoliceCoveragePercent: number
  baseSafetyScore: number
  baseFacilityScore: number
  safetyDetourApplied: boolean
  extraDistanceM: number
  extraDurationMinutes: number
  evidenceLevel: 'STRONG' | 'MODERATE' | 'LIMITED'
  evidenceAxisCount: number
  safetyWaypoints: SafetyWaypoint[]
  dataNotice: string
}

export interface SafetyWaypoint {
  name: string
  type:
    'POLICE_STATION' | 'PATROL_DIVISION' | 'POLICE_BOX' | 'COAST_GUARD_STATION' | 'SAFETY_EVIDENCE'
  coordinate: Coordinate
  reason: string
  evidenceScore: number
  predictedScoreGain: number
  predictedExtraDistanceM: number
  streetLightLocationCount: number
  securityLightLocationCount: number
  cctvLocationCount: number
  cctvCameraCount: number
  policeFacilityCount: number
  offRouteDistanceM: number
}

export interface NavigateRouteResponse extends RouteOption {
  polyline: string | null
  fastestRoute: RouteOption
  safety: RouteSafetyDetails
}

export interface MapBounds {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
}

export interface LightItem {
  lightMasterId: number
  latitude: number | null
  longitude: number | null
  locationName: string | null
  installCount: number | null
  installType: string | null
  lightType: string
}

export interface CctvItem {
  cctvMasterId: number
  latitude: number | null
  longitude: number | null
  manageOrg: string
  purpose: string | null
  cameraCount: number | null
  roadAddress: string | null
}

export interface PoliceItem {
  policeMasterId: number
  latitude: number | null
  longitude: number | null
  facilityName: string
  facilityType: 'POLICE_STATION' | 'PATROL_DIVISION' | 'POLICE_BOX' | 'COAST_GUARD_STATION'
  roadAddress: string | null
}

export type RouteView = 'safe' | 'fastest'
