import React, { useState } from 'react';
import type { Trip } from './types';
import { initialTrips } from './data/mockTrips';
import { DriverDashboard } from './screens/DriverDashboard';
import { PassengerDashboard } from './screens/PassengerDashboard';
import { CarIcon, UsersIcon } from './components/Icons';

type UserRole = 'driver' | 'passenger';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  // Handler to add a new trip
  const addTrip = (newTripData: Omit<Trip, 'id' | 'driverId' | 'availableSeats' | 'status'>) => {
    const newTrip: Trip = {
      ...newTripData,
      id: `trip-${Date.now()}-${Math.random()}`,
      driverId: 1, // Hardcoded driver ID for prototype
      availableSeats: newTripData.totalSeats,
      status: 'active',
    };
    setTrips(prevTrips => [newTrip, ...prevTrips]);
  };

  // Handler to cancel a trip
  const cancelTrip = (tripId: string) => {
    setTrips(prevTrips =>
      prevTrips.map(trip =>
        trip.id === tripId ? { ...trip, status: 'cancelled' } : trip
      )
    );
  };

  // Handler for a passenger to book a seat
  const bookSeat = (tripId: string) => {
    setTrips(prevTrips =>
      prevTrips.map(trip =>
        trip.id === tripId && trip.availableSeats > 0
          ? { ...trip, availableSeats: trip.availableSeats - 1 }
          : trip
      )
    );
     // In a real app, you'd also create a booking record for the user.
  };

  const renderContent = () => {
    if (!userRole) {
      return (
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-4">
            Bem-vindo ao App de Caronas
          </h1>
          <p className="text-slate-500 mb-8">Por favor, selecione seu perfil para continuar.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setUserRole('driver')}
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-4 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-all duration-300"
            >
              <CarIcon className="w-6 h-6" />
              Sou Motorista
            </button>
            <button
              onClick={() => setUserRole('passenger')}
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-4 font-semibold text-primary bg-primary/10 rounded-lg shadow-md hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-all duration-300"
            >
              <UsersIcon className="w-6 h-6" />
              Sou Passageiro
            </button>
          </div>
        </div>
      );
    }

    switch (userRole) {
      case 'driver':
        // Assuming driverId=1 is the current user
        const myTrips = trips.filter(trip => trip.driverId === 1);
        return <DriverDashboard myTrips={myTrips} onAddTrip={addTrip} onCancelTrip={cancelTrip} onSwitchRole={() => setUserRole(null)} />;
      case 'passenger':
        const availableTrips = trips.filter(trip => trip.status === 'active' && new Date(trip.departureDate) >= new Date(new Date().toISOString().split('T')[0]));
        return <PassengerDashboard availableTrips={availableTrips} onBookSeat={bookSeat} onSwitchRole={() => setUserRole(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <main className="w-full max-w-5xl">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;