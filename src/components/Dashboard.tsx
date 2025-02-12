import React, { useState } from 'react';
import { 
  BarChart as BarChartIcon, 
  Users, 
  Phone,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: '2025-02-01',
    end: '2025-02-07'
  });

  const statsCards = [
    {
      title: 'Em conversa',
      value: '0',
      icon: <Phone className="text-blue-600" size={24} />,
    },
    {
      title: 'Aguardando',
      value: '0',
      icon: <Clock className="text-yellow-600" size={24} />,
    },
    {
      title: 'Finalizados',
      value: '0',
      icon: <CheckCircle className="text-green-600" size={24} />,
    },
    {
      title: 'Contatos',
      value: '0',
      icon: <Users className="text-purple-600" size={24} />,
    },
    {
      title: 'Tempo de Espera',
      value: '00h 00m',
      icon: <Clock className="text-orange-600" size={24} />,
    },
    {
      title: 'Tempo de Atendimento',
      value: '00h 00m',
      icon: <Clock className="text-indigo-600" size={24} />,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Date Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm text-gray-500">Tipo de Filtro</label>
            <select className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Por data</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Data Inicial</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500">Data Final</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            FILTRAR
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Total de conversas por usuários</h3>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-500">Data Inicial</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Data Final</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              FILTRAR
            </button>
          </div>
          <div className="h-64 bg-gray-50 rounded flex flex-col items-center justify-center text-gray-500">
            <BarChartIcon size={32} className="text-gray-400 mb-2" />
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      </div>

      {/* User Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm text-gray-500">Início</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Fim</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              FILTRAR
            </button>
          </div>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Users size={32} className="mx-auto mb-2 text-gray-400" />
          <p>Nenhum usuário cadastrado</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;