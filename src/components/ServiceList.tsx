import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ServiceForm from './ServiceForm';

const ServiceList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  const handleSubmit = (serviceData: any) => {
    setServices([...services, { id: Date.now(), ...serviceData }]);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Cadastrar Serviço
        </button>
      </div>

      {showForm ? (
        <ServiceForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      ) : (
        <div className="bg-white rounded-lg shadow">
          {services.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum serviço cadastrado
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço/Hora
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">R$ {service.hourlyRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceList;