/**
 * Geolocation & Haversine distance utilities for outdoor run tracking
 */

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
}

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates distance between two GPS coordinates in meters using the Haversine formula.
 */
export function calculateHaversineDistance(
  coord1: GeoCoordinate,
  coord2: GeoCoordinate
): number {
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Computes pace in "m:ss /km" from distance in meters and duration in seconds.
 */
export function calculatePace(distanceMeters: number, durationSeconds: number): string {
  if (distanceMeters < 50 || durationSeconds < 5) return '--:-- /km';

  const secPerKm = (durationSeconds / distanceMeters) * 1000;
  // Bound pace to reasonable human running (between 2:30/km and 20:00/km)
  if (secPerKm > 1200 || secPerKm < 150) return '--:-- /km';

  const mins = Math.floor(secPerKm / 60);
  const secs = Math.floor(secPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /km`;
}
