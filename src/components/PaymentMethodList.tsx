import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PaymentMethodForm from './PaymentMethodForm';

const PaymentMethodList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const handleSubmit = (data: any) => {
    setPaymentMethods([...paymentMethods, { id: Date.now(), ...data }]);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Formas de Pagamento</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Cadastrar
        </button>
      </div>

      {showForm ? (
        <PaymentMethodForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      ) : (
        <div className="bg-white rounded-lg shadow">
          {paymentMethods.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhuma forma de pagamento cadastrada
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo (dias)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentMethods.map((method) => (
                  <tr key={method.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{method.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{method.paymentType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{method.fee || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{method.maxInstallments || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{method.paymentTerm || '-'}</td>
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

export default PaymentMethodList;