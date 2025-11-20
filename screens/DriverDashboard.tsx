import React, { useState } from 'react';
import type { Trip } from '../types';
import { PostTripForm } from '../components/PostTripForm';
import { MyTripsList } from '../components/MyTripsList';
import { ArrowLeftIcon } from '../components/Icons';

interface DriverDashboardProps {
  myTrips: Trip[];
  onAddTrip: (tripData: Omit<Trip, 'id' | 'driverId' | 'availableSeats' | 'status'>) => void;
  onCancelTrip: (tripId: string) => void;
  onSwitchRole: () => void;
}

type DriverTab = 'post' | 'myTrips';

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ myTrips, onAddTrip, onCancelTrip, onSwitchRole }) => {
  const [activeTab, setActiveTab] = useState<DriverTab>('post');

  const handleTripPosted = (tripData: Omit<Trip, 'id' | 'driverId' | 'availableSeats' | 'status'>) => {
    onAddTrip(tripData);
    // Switch to My Trips tab to show the newly added trip
    setTimeout(() => setActiveTab('myTrips'), 1600);
  }

  const tabButtonClasses = (tab: DriverTab) => 
    `px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${
        activeTab === tab 
        ? 'bg-primary text-white' 
        : 'text-slate-600 hover:bg-slate-200'
    }`;


  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
                    Painel do Motorista
                </h1>
                <button onClick={onSwitchRole} className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Trocar Perfil
                </button>
            </header>

            <div className="mb-8 border-b border-slate-200">
                <div className="flex gap-4">
                    <button className={tabButtonClasses('post')} onClick={() => setActiveTab('post')}>Publicar Nova Viagem</button>
                    <button className={tabButtonClasses('myTrips')} onClick={() => setActiveTab('myTrips')}>Minhas Viagens</button>
                </div>
            </div>
            
            <div>
                {activeTab === 'post' && <PostTripForm onTripPosted={handleTripPosted} />}
                {activeTab === 'myTrips' && <MyTripsList trips={myTrips} onCancelTrip={onCancelTrip} />}
            </div>
        </div>
    </div>
  );
};