
export interface Trip {
  id: string;
  driverId: number;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: 'active' | 'cancelled' | 'completed';
}