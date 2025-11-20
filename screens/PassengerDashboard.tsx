import React, { useState, useMemo } from 'react';
import type { Trip } from '../types';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, DollarSignIcon, MapPinIcon, UsersIcon } from '../components/Icons';

interface PassengerDashboardProps {
  availableTrips: Trip[];
  onBookSeat: (tripId: string) => void;
  onSwitchRole: () => void;
}

const TripListItem: React.FC<{ trip: Trip; onViewDetails: () => void }> = ({ trip, onViewDetails }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 grid grid-cols-[1fr_auto] items-center gap-4">
        <div>
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-800">{trip.origin}</span>
                <span className="font-semibold text-slate-500 mx-1">&rarr;</span>
                <span className="font-bold text-lg text-slate-800">{trip.destination}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-2">
                <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4"/> {new Date(trip.departureDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4"/> {trip.departureTime}</span>
                 <span className="flex items-center gap-1.5"><UsersIcon className="w-4 h-4"/> {trip.availableSeats} assentos restantes</span>
            </div>
        </div>
        <div className="text-right">
             <p className="font-bold text-xl text-primary">R${trip.price.toFixed(2)}</p>
             <button onClick={onViewDetails} className="mt-1 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-hover">
                Ver Detalhes
            </button>
        </div>
    </div>
);

const TripDetailsModal: React.FC<{ trip: Trip; onClose: () => void; onBook: () => void }> = ({ trip, onClose, onBook }) => {
     const formattedDate = new Date(trip.departureDate).toLocaleDateString('pt-BR', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    });
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                 <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Detalhes da Viagem</h2>
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-slate-700">
                        <div className="text-left">
                            <p className="font-bold text-lg">{trip.origin}</p>
                            <p className="text-sm text-slate-500">Origem</p>
                        </div>
                        <div className="flex-grow flex items-center justify-center text-primary px-4">
                             <MapPinIcon className="w-5 h-5" />
                             <div className="flex-grow border-t-2 border-dashed border-slate-300 mx-2"></div>
                             <MapPinIcon className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{trip.destination}</p>
                            <p className="text-sm text-slate-500">Destino</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-slate-600 bg-slate-50 p-4 rounded-lg">
                       <p className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-primary"/> <strong>Data:</strong> {formattedDate}</p>
                       <p className="flex items-center gap-3"><ClockIcon className="w-5 h-5 text-primary"/> <strong>Hora:</strong> {trip.departureTime}</p>
                       <p className="flex items-center gap-3"><UsersIcon className="w-5 h-5 text-primary"/> <strong>Assentos Disponíveis:</strong> {trip.availableSeats} de {trip.totalSeats}</p>
                       <p className="flex items-center gap-3"><DollarSignIcon className="w-5 h-5 text-primary"/> <strong>Valor por Assento:</strong> R${trip.price.toFixed(2)}</p>
                    </div>

                    <div className="mt-6">
                        <Button 
                            onClick={onBook} 
                            disabled={trip.availableSeats === 0}
                            className="w-full">
                            {trip.availableSeats > 0 ? 'Reservar Assento' : 'Esgotado'}
                        </Button>
                    </div>
                 </div>
            </div>
        </div>
    )
};


export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ availableTrips, onBookSeat, onSwitchRole }) => {
  const [searchCriteria, setSearchCriteria] = useState({ origin: '', destination: '', startDate: '', endDate: '' });
  const [searchResults, setSearchResults] = useState<Trip[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const results = availableTrips.filter(trip => {
      const originMatch = trip.origin.toLowerCase().includes(searchCriteria.origin.toLowerCase());
      const destinationMatch = trip.destination.toLowerCase().includes(searchCriteria.destination.toLowerCase());
      
      // Use getTime() for safe, timezone-agnostic date comparison
      const tripDate = new Date(trip.departureDate).getTime();

      const startDateMatch = searchCriteria.startDate
        ? tripDate >= new Date(searchCriteria.startDate).getTime()
        : true;
      
      const endDateMatch = searchCriteria.endDate
        ? tripDate <= new Date(searchCriteria.endDate).getTime()
        : true;

      return originMatch && destinationMatch && startDateMatch && endDateMatch;
    });
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const handleBookSeat = () => {
    if(selectedTrip) {
        onBookSeat(selectedTrip.id);
        // Optimistically update UI
        setSelectedTrip(prev => prev ? {...prev, availableSeats: prev.availableSeats - 1} : null);
        
        // In a real app, you might wait for a success response before closing
        setTimeout(() => {
            setSelectedTrip(null);
        }, 1000); // Close modal after a short delay
    }
  }

  return (
     <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
                    Encontrar uma Carona
                </h1>
                <button onClick={onSwitchRole} className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Trocar Perfil
                </button>
            </header>

            <form onSubmit={handleSearch} className="p-6 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="origin" label="Origem" type="text" value={searchCriteria.origin} onChange={handleSearchChange} placeholder="Ex: São Paulo, SP" />
                    <FormInput name="destination" label="Destino" type="text" value={searchCriteria.destination} onChange={handleSearchChange} placeholder="Ex: Rio de Janeiro, RJ" />
                    <FormInput name="startDate" label="A partir de" type="date" value={searchCriteria.startDate} onChange={handleSearchChange} />
                    <FormInput name="endDate" label="Até" type="date" value={searchCriteria.endDate} onChange={handleSearchChange} />
                </div>
                <div className="mt-4">
                    <Button type="submit" className="w-full">Buscar</Button>
                </div>
            </form>

            <div className="mt-8">
                {hasSearched ? (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">{searchResults.length} Viagens Encontradas</h2>
                        {searchResults.length > 0 ? (
                            <div className="space-y-4">
                                {searchResults.map(trip => <TripListItem key={trip.id} trip={trip} onViewDetails={() => setSelectedTrip(trip)} />)}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center bg-slate-50 p-8 rounded-lg">Nenhuma viagem corresponde aos seus critérios de busca. Tente ampliar sua pesquisa.</p>
                        )}
                    </div>
                ) : (
                    <p className="text-slate-500 text-center bg-slate-50 p-8 rounded-lg">Insira seus dados acima para encontrar caronas disponíveis.</p>
                )}
            </div>
        </div>
        {selectedTrip && <TripDetailsModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} onBook={handleBookSeat} />}
    </div>
  );
};