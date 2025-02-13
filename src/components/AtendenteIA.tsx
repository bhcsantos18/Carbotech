import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, ArrowRight, Brain, Settings, X } from 'lucide-react';

interface Integration {
  type: 'whatsapp' | 'instagram' | 'facebook';
  status: 'connected' | 'disconnected';
}

interface AIAssistant {
  id: string;
  name: string;
  channel: string[];
  status: 'active' | 'inactive';
  license: string;
  maxTokens: number;
  apiKey: string;
}

const AtendenteIA: React.FC = () => {
  const [assistants, setAssistants] = useState<AIAssistant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<AIAssistant | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<AIAssistant | null>(null);

  // Carregar integrações do localStorage
  useEffect(() => {
    const savedIntegrations = localStorage.getItem('integrations');
    if (savedIntegrations) {
      setIntegrations(JSON.parse(savedIntegrations));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const channels = integrations
      .filter(i => i.status === 'connected')
      .map(i => i.type)
      .filter(type => formData.get(`channel-${type}`) === 'on');

    const assistantData: Partial<AIAssistant> = {
      name: formData.get('name') as string,
      channel: channels,
      status: formData.get('status') as 'active' | 'inactive',
      license: 'regular',
      maxTokens: Number(formData.get('maxTokens')),
      apiKey: formData.get('apiKey') as string,
    };

    if (editingAssistant) {
      setAssistants(assistants.map(assistant => 
        assistant.id === editingAssistant.id 
          ? { ...assistantData, id: assistant.id } as AIAssistant
          : assistant
      ));
    } else {
      setAssistants([...assistants, { ...assistantData, id: Date.now().toString() } as AIAssistant]);
    }

    setShowForm(false);
    setEditingAssistant(null);
  };

  const handleDelete = (id: string) => {
    setAssistants(assistants.filter(assistant => assistant.id !== id));
  };

  const handleEdit = (assistant: AIAssistant) => {
    setEditingAssistant(assistant);
    setShowForm(true);
  };

  const handleConfigClick = (assistant: AIAssistant) => {
    setSelectedAssistant(assistant);
    setShowConfig(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Atendente IA</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Novo Atendente IA
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingAssistant ? 'Editar Atendente IA' : 'Novo Atendente IA'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingAssistant(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingAssistant?.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingAssistant?.status || 'active'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Canais de Atendimento
                </label>
                <div className="mt-2 space-y-2">
                  {integrations.map(integration => (
                    integration.status === 'connected' && (
                      <label key={integration.type} className="flex items-center">
                        <input
                          type="checkbox"
                          name={`channel-${integration.type}`}
                          defaultChecked={editingAssistant?.channel.includes(integration.type)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                        </span>
                      </label>
                    )
                  ))}
                  {integrations.filter(i => i.status === 'connected').length === 0 && (
                    <p className="text-sm text-red-500">
                      Nenhum canal integrado. Configure as integrações primeiro.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chave API *
                </label>
                <input
                  type="text"
                  name="apiKey"
                  required
                  defaultValue={editingAssistant?.apiKey}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Máximo de Tokens
                </label>
                <input
                  type="number"
                  name="maxTokens"
                  defaultValue={editingAssistant?.maxTokens || 500}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAssistant(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingAssistant ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      ) : showConfig ? (
        <div className="bg-white rounded-lg shadow p-6">
          {/* Aqui vai o conteúdo das configurações avançadas do assistente selecionado */}
          {selectedAssistant && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Configurações do Atendente: {selectedAssistant.name}</h2>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Aqui serão carregadas as configurações do PromptAI quando integrado com o banco de dados */}
              <div className="text-center text-gray-500 py-8">
                <Settings className="w-12 h-12 mx-auto mb-4" />
                <p>As configurações avançadas serão carregadas do banco de dados</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {assistants.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum atendente IA cadastrado</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Canal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Licença
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assistants.map((assistant) => (
                  <tr key={assistant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{assistant.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assistant.channel.map(ch => 
                        ch.charAt(0).toUpperCase() + ch.slice(1)
                      ).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        assistant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {assistant.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assistant.license}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleDelete(assistant.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(assistant)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleConfigClick(assistant)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </td>
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

export default AtendenteIA;