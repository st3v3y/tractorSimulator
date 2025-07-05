import { Tractor } from "../mock/MockTracktors";

export const getCurrentSpeed = (tractor: Tractor, gpsData) => {
  if (tractor.status !== 'moving' || gpsData.length === 0) {
    return '0 km/h';
  }
  const speed = gpsData[gpsData.length - 1]?.speed?.toFixed(1) || '0';
  return `${speed} km/h`;
}