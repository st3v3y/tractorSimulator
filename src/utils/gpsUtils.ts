export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
  speed: number;
}

export function generateGPSPath(startLat: number, startLng: number, duration: number = 60): GPSPoint[] {
  const path: GPSPoint[] = [];
  const steps = duration;

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const angle = progress * Math.PI * 4; // Multiple loops
    const radius = 0.005; // ~500m radius

    const lat = startLat + Math.sin(angle) * radius * (1 - progress * 0.3);
    const lng = startLng + Math.cos(angle) * radius * (1 - progress * 0.3);

    path.push({
      lat,
      lng,
      timestamp: Date.now() + i * 1000,
      speed: Math.max(5, 15 - Math.abs(Math.sin(angle * 2)) * 10) // Variable speed
    });
  }

  return path;
}