import React, { useState, useCallback } from 'react';
import type { Trip } from '../types';
import { FormInput } from './FormInput';
import { Button } from './Button';
import { TripSummaryCard } from './TripSummaryCard';
import { CheckCircleIcon, ExclamationTriangleIcon } from './Icons';

interface PostTripFormProps {
  onTripPosted: (tripData: Omit<Trip, 'id' | 'driverId' | 'availableSeats' | 'status'>) => void;
}

export const PostTripForm: React.FC<PostTripFormProps> = ({ onTripPosted }) => {
  const initialState = {
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    totalSeats: 1,
    price: 10,
  };

  const [tripDetails, setTripDetails] = useState(initialState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submittedTrip, setSubmittedTrip] = useState<Trip | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'error') {
        setStatus('idle');
        setErrorMessage('');
    }
    const { name, value, type } = e.target;
    setTripDetails(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  }, [status]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!tripDetails.origin || !tripDetails.destination || !tripDetails.departureDate || !tripDetails.departureTime || !tripDetails.totalSeats || !tripDetails.price) {
        setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        setStatus('error');
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(tripDetails.departureDate + 'T00:00:00');

    if (selectedDate < today) {
        setErrorMessage('A data de partida não pode ser no passado.');
        setStatus('error');
        return;
    }

    setStatus('submitting');
    setSubmittedTrip(null);
    setErrorMessage('');

    // Simulate API call
    setTimeout(() => {
      const tripDataForSubmission = {
        origin: tripDetails.origin,
        destination: tripDetails.destination,
        departureDate: tripDetails.departureDate,
        departureTime: tripDetails.departureTime,
        totalSeats: Number(tripDetails.totalSeats),
        price: Number(tripDetails.price),
      };
      
      onTripPosted(tripDataForSubmission);

      const completeTripData: Trip = {
          ...tripDataForSubmission,
          id: 'temp', driverId: 1, status: 'active',
          availableSeats: tripDataForSubmission.totalSeats
      }
      
      setSubmittedTrip(completeTripData);
      setStatus('success');
      setTripDetails(initialState);
    }, 1500);
  };
  
  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput name="origin" label="Origem" type="text" value={tripDetails.origin || ''} onChange={handleChange} placeholder="Ex: São Paulo, SP" required />
            <FormInput name="destination" label="Destino" type="text" value={tripDetails.destination || ''} onChange={handleChange} placeholder="Ex: Rio de Janeiro, RJ" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput name="departureDate" label="Data da Saída" type="date" value={tripDetails.departureDate || ''} onChange={handleChange} required min={todayString} />
            <FormInput name="departureTime" label="Hora da Saída" type="time" value={tripDetails.departureTime || ''} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput name="totalSeats" label="Quantidade de Assentos" type="number" value={tripDetails.totalSeats || ''} onChange={handleChange} min={1} required />
                <FormInput name="price" label="Valor por Assento (R$)" type="number" value={tripDetails.price || ''} onChange={handleChange} min={0} step={0.01} required />
            </div>
            
            <div className="pt-4">
            <Button type="submit" disabled={status === 'submitting'} className="w-full">
                {status === 'submitting' ? 'Publicando...' : 'Publicar Viagem'}
            </Button>
            </div>
        </form>

        <div className="mt-8">
            {status === 'success' && submittedTrip && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md flex items-center" role="alert">
                    <CheckCircleIcon className="w-6 h-6 mr-3"/>
                    <p className="font-bold">Viagem publicada com sucesso!</p>
                </div>
            )}
            {status === 'error' && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md flex items-center" role="alert">
                    <ExclamationTriangleIcon className="w-6 h-6 mr-3"/>
                    <p className="font-bold">{errorMessage}</p>
                </div>
            )}
        </div>
        
        {status === 'success' && submittedTrip && (
            <div className="mt-8">
                <TripSummaryCard trip={submittedTrip} />
            </div>
        )}
    </div>
  );
};