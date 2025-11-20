import type { Trip } from '../types';

// Helper to get a future date string
const getFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const initialTrips: Trip[] = [
  {
    id: 'trip-1',
    driverId: 1,
    origin: 'São Paulo, SP',
    destination: 'Rio de Janeiro, RJ',
    departureDate: getFutureDate(3),
    departureTime: '09:00',
    totalSeats: 3,
    availableSeats: 2,
    price: 75.00,
    status: 'active',
  },
  {
    id: 'trip-2',
    driverId: 2,
    origin: 'Belo Horizonte, MG',
    destination: 'Vitória, ES',
    departureDate: getFutureDate(5),
    departureTime: '10:30',
    totalSeats: 4,
    availableSeats: 4,
    price: 95.00,
    status: 'active',
  },
  {
    id: 'trip-3',
    driverId: 1,
    origin: 'Curitiba, PR',
    destination: 'Florianópolis, SC',
    departureDate: getFutureDate(7),
    departureTime: '14:00',
    totalSeats: 2,
    availableSeats: 0,
    price: 60.00,
    status: 'active',
  },
   {
    id: 'trip-4',
    driverId: 3,
    origin: 'São Paulo, SP',
    destination: 'Brasília, DF',
    departureDate: getFutureDate(3),
    departureTime: '11:00',
    totalSeats: 3,
    availableSeats: 3,
    price: 150.00,
    status: 'active',
  },
  {
    id: 'trip-5',
    driverId: 1,
    origin: 'Rio de Janeiro, RJ',
    destination: 'São Paulo, SP',
    departureDate: '2023-10-20', // Past date
    departureTime: '18:00',
    totalSeats: 3,
    availableSeats: 0,
    price: 75.00,
    status: 'completed',
  },
];