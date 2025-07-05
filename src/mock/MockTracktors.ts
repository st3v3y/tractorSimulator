export enum TractorStatus {
  AVAILABLE = "available",
  MAINTENANCE = "maintenance",
}

export type Tractor = {
  id: number;
  name: string;
  model: string;
  status: TractorStatus;
  location: { lat: number; lng: number };
  lastSeen: string;
};

export const mockTractors: Tractor[] = [
  {
    id: 1,
    name: "John Deere 8R 410",
    model: "8R Series",
    status: TractorStatus.AVAILABLE,
    location: { lat: 40.7829, lng: -73.9654 },
    lastSeen: "2 minutes ago"
  },
  {
    id: 2,
    name: "Case IH Steiger 620",
    model: "Steiger Series",
    status: TractorStatus.AVAILABLE,
    location: { lat: 40.7589, lng: -73.9851 },
    lastSeen: "5 minutes ago"
  },
  {
    id: 3,
    name: "New Holland T9.700",
    model: "T9 Series",
    status: TractorStatus.AVAILABLE,
    location: { lat: 40.7505, lng: -73.9934 },
    lastSeen: "1 minute ago"
  },
  {
    id: 4,
    name: "Fendt 1050 Vario",
    model: "Vario Series",
    status: TractorStatus.MAINTENANCE,
    location: { lat: 40.7306, lng: -73.9352 },
    lastSeen: "3 minutes ago"
  },
  {
    id: 5,
    name: "Claas Xerion 5000",
    model: "Xerion Series",
    status: TractorStatus.AVAILABLE,
    location: { lat: 40.7128, lng: -74.0060 },
    lastSeen: "10 minutes ago"
  }
];