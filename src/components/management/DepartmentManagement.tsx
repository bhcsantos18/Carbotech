import React, { useState, useEffect } from 'react';
import { Plus, Pencil, X } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  workingHours: {
    start: string;
    end: string;
  };
}

// Função para salvar departamentos no localStorage
const saveDepartments = (departments: Department[]) => {
  localStorage.setItem('departments', JSON.stringify(departments));
};

// Função para carregar departamentos do localStorage
const loadDepartments = (): Department[] => {
  const saved = localStorage.getItem('departments');
  return saved ? JSON.parse(saved) : [];
};

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(loadDepartments());
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Salvar departamentos no localStorage sempre que houver mudanças
  useEffect(() => {
    saveDepartments(departments);
  }, [departments]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const departmentData = {
      name: formData.get('name') as string,
      workingHours: {
        start: formData.get('startTime') as string,
        end: formData.get('endTime') as string,
      },
    };

    if (editingDepartment) {
      setDepartments(departments.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...departmentData, id: dept.id }
          : dept
      ));
    } else {
      setDepartments([...departments, { ...departmentData, id: Date.now().toString() }]);
    }

    setShowForm(false);
    setEditingDepartment(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Departamentos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Novo Departamento
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingDepartment ? 'Editar Departamento' : 'Novo Departamento'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingDepartment(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome do Departamento
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingDepartment?.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Horário de Início
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      required
                      defaultValue={editingDepartment?.workingHours.start}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Horário de Término
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      required
                      defaultValue={editingDepartment?.workingHours.end}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDepartment(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingDepartment ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {departments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum departamento cadastrado
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário de Funcionamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((department) => (
                <tr key={department.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{department.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {department.workingHours.start} - {department.workingHours.end}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingDepartment(department);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;