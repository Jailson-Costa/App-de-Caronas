import React from 'react';
import type { Trip } from '../types';
import { CalendarIcon, ClockIcon, UsersIcon, DollarSignIcon, MapPinIcon } from './Icons';

interface MyTripsListProps {
  trips: Trip[];
  onCancelTrip: (tripId: string) => void;
}

const TripCard: React.FC<{ trip: Trip; onCancel: () => void; isUpcoming: boolean }> = ({ trip, onCancel, isUpcoming }) => {
  const formattedDate = new Date(trip.departureDate).toLocaleDateString('pt-BR', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
  });
  
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-slate-100 text-slate-800',
  };

  const statusLabels = {
    active: 'Ativa',
    cancelled: 'Cancelada',
    completed: 'Concluída',
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 text-slate-700">
                    <MapPinIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-lg">{trip.origin}</span>
                    <span className="font-semibold text-slate-500 mx-2">&rarr;</span>
                    <span className="font-bold text-lg">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                    <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4"/> {formattedDate}</span>
                    <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4"/> {trip.departureTime}</span>
                </div>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[trip.status]}`}>
                {statusLabels[trip.status]}
            </span>
        </div>
        
        <div className="border-t border-slate-100 my-4"></div>

        <div className="flex justify-between items-center">
             <div className="flex gap-4">
                <div className="text-center">
                    <p className="font-bold text-slate-800">{trip.availableSeats}/{trip.totalSeats}</p>
                    <p className="text-xs text-slate-500">Assentos Restantes</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-slate-800">R${trip.price.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">por Assento</p>
                </div>
             </div>
             {isUpcoming && trip.status === 'active' && (
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm font-semibold text-slate-600 bg-slate-200 rounded-md hover:bg-slate-300">Editar</button>
                    <button onClick={onCancel} className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">Cancelar</button>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export const MyTripsList: React.FC<MyTripsListProps> = ({ trips, onCancelTrip }) => {
  const now = new Date();
  now.setHours(0,0,0,0);

  const upcomingTrips = trips
    .filter(trip => new Date(trip.departureDate) >= now)
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
    
  const pastTrips = trips
    .filter(trip => new Date(trip.departureDate) < now)
    .sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime());

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Próximas Viagens</h3>
        {upcomingTrips.length > 0 ? (
          <div className="space-y-4">
            {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} onCancel={() => onCancelTrip(trip.id)} isUpcoming={true} />)}
          </div>
        ) : (
          <p className="text-slate-500">Você não tem viagens futuras.</p>
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Viagens Passadas</h3>
        {pastTrips.length > 0 ? (
          <div className="space-y-4">
            {pastTrips.map(trip => <TripCard key={trip.id} trip={trip} onCancel={() => {}} isUpcoming={false} />)}
          </div>
        ) : (
          <p className="text-slate-500">Você não tem viagens passadas.</p>
        )}
      </div>
    </div>
  );
};