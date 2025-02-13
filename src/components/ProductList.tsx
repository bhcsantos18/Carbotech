import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductForm from './ProductForm';

const ProductList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const handleSubmit = (productData: any) => {
    setProducts([...products, { id: Date.now(), ...productData }]);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Cadastrar Produto
        </button>
      </div>

      {showForm ? (
        <ProductForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      ) : (
        <div className="bg-white rounded-lg shadow">
          {products.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum produto cadastrado
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.currency} {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
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

export default ProductList;