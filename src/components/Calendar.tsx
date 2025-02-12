import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, X } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface Appointment {
  id: string;
  date: Date;
  time: string;
  title: string;
  description?: string;
}

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleScheduleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedDate) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      date: selectedDate,
      time: formData.get('time') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    };

    setAppointments([...appointments, newAppointment]);
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  const selectedDayAppointments = appointments.filter(
    app => selectedDate && format(app.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agenda</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-6">
        {/* Calendário */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={ptBR}
            modifiers={{
              booked: appointments.map(app => app.date)
            }}
            modifiersStyles={{
              booked: { 
                backgroundColor: '#93c5fd',
                color: 'white'
              }
            }}
            styles={{
              months: {
                padding: '0.5rem'
              },
              head_cell: {
                width: '48px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                textTransform: 'uppercase',
                padding: '0.5rem 0'
              },
              cell: {
                width: '48px',
                height: '48px',
                fontSize: '0.875rem',
                padding: '0'
              },
              day: {
                width: '48px',
                height: '48px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.5rem',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#E5E7EB'
                }
              },
              day_selected: {
                backgroundColor: '#2563EB !important',
                color: 'white',
                fontWeight: '600'
              },
              day_today: {
                backgroundColor: '#EFF6FF',
                fontWeight: '600'
              },
              nav_button: {
                width: '2rem',
                height: '2rem',
                color: '#4B5563',
                padding: '0.25rem',
                '&:hover': {
                  backgroundColor: '#F3F4F6'
                }
              },
              caption: {
                fontSize: '1.125rem',
                fontWeight: '600',
                padding: '0.5rem 0',
                color: '#1F2937'
              }
            }}
            className="w-full"
          />
        </div>

        {/* Área de Agendamento e Lista */}
        <div className="space-y-6">
          {/* Formulário de Agendamento */}
          {selectedDate && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Agendar para {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </h2>
              
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Horário
                  </label>
                  <input
                    type="time"
                    name="time"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Agendar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Agendamentos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              {selectedDate 
                ? `Agendamentos para ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                : 'Selecione uma data para ver os agendamentos'}
            </h2>
            
            {selectedDate && selectedDayAppointments.length === 0 ? (
              <p className="text-gray-500">Nenhum agendamento para este dia</p>
            ) : (
              <div className="space-y-4">
                {selectedDayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.title}
                      </p>
                      <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                      {appointment.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {appointment.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;