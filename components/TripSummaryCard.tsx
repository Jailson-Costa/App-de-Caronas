import React from 'react';
import type { Trip } from '../types';
import { CalendarIcon, ClockIcon, UsersIcon, DollarSignIcon, MapPinIcon } from './Icons';

interface TripSummaryCardProps {
  trip: Trip;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-lg">
        <div className="text-primary mb-2">{icon}</div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
);

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({ trip }) => {
  const formattedDate = new Date(trip.departureDate).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
  
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(trip.price);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Resumo da Sua Viagem</h2>
            
            <div className="flex items-center justify-between mb-6 text-slate-700">
                <div className="text-center">
                    <p className="font-bold text-lg">{trip.origin}</p>
                    <p className="text-sm text-slate-500">Origem</p>
                </div>
                <div className="flex-grow flex items-center justify-center text-primary">
                    <MapPinIcon className="w-5 h-5" />
                    <div className="flex-grow border-t-2 border-dashed border-slate-300 mx-4"></div>
                    <MapPinIcon className="w-5 h-5" />
                </div>
                <div className="text-center">
                    <p className="font-bold text-lg">{trip.destination}</p>
                    <p className="text-sm text-slate-500">Destino</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailItem icon={<CalendarIcon className="w-6 h-6" />} label="Data" value={formattedDate} />
                <DetailItem icon={<ClockIcon className="w-6 h-6" />} label="Hora" value={trip.departureTime} />
                <DetailItem icon={<UsersIcon className="w-6 h-6" />} label="Total de Assentos" value={trip.totalSeats} />
                <DetailItem icon={<DollarSignIcon className="w-6 h-6" />} label="Preço/Assento" value={formattedPrice} />
            </div>
        </div>
    </div>
  );
};