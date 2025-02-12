import React from 'react';
import { X } from 'lucide-react';

interface PaymentMethodFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Cadastrar Forma de Pagamento</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Descrição da Forma de Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição da Forma de Pagamento *
          </label>
          <input
            type="text"
            name="description"
            required
            placeholder="Ex.: Dinheiro, Cartão de Crédito, PIX"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Tipo de Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Pagamento *
          </label>
          <select
            name="paymentType"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione o tipo</option>
            <option value="à vista">À vista</option>
            <option value="parcelado">Parcelado</option>
          </select>
        </div>

        {/* Taxas e Parcelamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Taxa Aplicável (%)
            </label>
            <input
              type="number"
              name="fee"
              step="0.01"
              placeholder="Ex.: 2.5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Máximo de Parcelas
            </label>
            <input
              type="number"
              name="maxInstallments"
              min="1"
              placeholder="Ex.: 12"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Prazo de Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prazo de Pagamento (dias)
          </label>
          <input
            type="number"
            name="paymentTerm"
            min="0"
            placeholder="Ex.: 30"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodForm;