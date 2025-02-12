import React, { useState } from 'react';
import { Brain, Settings, FunctionSquare as FunctionIcon, Building2, Save, AlertCircle } from 'lucide-react';

interface AIConfig {
  slug: string;
  version: string;
  temperature: number;
  maxTokens: number;
  functions: string[];
  departments: string[];
  prompt: string;
}

const PromptAI: React.FC = () => {
  const [config, setConfig] = useState<AIConfig>({
    slug: '',
    version: 'gpt4',
    temperature: 0.7,
    maxTokens: 500,
    functions: [],
    departments: [],
    prompt: ''
  });

  const availableFunctions = [
    'transferir_departamento',
    'consultar_agenda',
    'transferir_atendente',
    'consultar_produto',
    'consultar_servicos',
    'consultar_pagamento'
  ];

  const aiVersions = [
    { id: 'gpt4', name: 'GPT-4' },
    { id: 'gpt4-mini', name: 'GPT-4 Mini' },
    { id: 'meta-ai', name: 'Meta AI' }
  ];

  const handleFunctionToggle = (func: string) => {
    setConfig(prev => ({
      ...prev,
      functions: prev.functions.includes(func)
        ? prev.functions.filter(f => f !== func)
        : [...prev.functions, func]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de salvamento
    console.log('Configuração da IA:', config);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuração do Prompt IA</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Definições Básicas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <h2 className="ml-4 text-lg font-semibold text-gray-900">Definições Básicas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug da Instância *
              </label>
              <input
                type="text"
                required
                value={config.slug}
                onChange={(e) => setConfig({...config, slug: e.target.value})}
                placeholder="ex: minha-ia-assistente"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Será usado para gerar o link de acesso à instância
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Versão da IA *
              </label>
              <select
                required
                value={config.version}
                onChange={(e) => setConfig({...config, version: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {aiVersions.map(version => (
                  <option key={version.id} value={version.id}>
                    {version.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperatura
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({...config, temperature: Number(e.target.value)})}
                className="mt-1 block w-full"
              />
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span>Mais Focado ({config.temperature})</span>
                <span>Mais Criativo</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Máximo de Tokens
              </label>
              <input
                type="number"
                min="500"
                max="1000"
                value={config.maxTokens}
                onChange={(e) => setConfig({...config, maxTokens: Number(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Limite entre 500 e 1000 tokens
              </p>
            </div>
          </div>
        </div>

        {/* Definições Avançadas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="text-white" size={24} />
            </div>
            <h2 className="ml-4 text-lg font-semibold text-gray-900">Definições Avançadas</h2>
          </div>

          <div className="space-y-6">
            {/* Funções */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Funções Disponíveis
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableFunctions.map(func => (
                  <label
                    key={func}
                    className={`flex items-center p-3 rounded-lg border ${
                      config.functions.includes(func)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    } cursor-pointer transition-colors`}
                  >
                    <input
                      type="checkbox"
                      checked={config.functions.includes(func)}
                      onChange={() => handleFunctionToggle(func)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm">
                      {func.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Departamentos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamentos Vinculados
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center text-gray-500">
                  <AlertCircle size={20} className="mr-2" />
                  <p className="text-sm">
                    Os departamentos serão carregados automaticamente após serem cadastrados no sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editor de Prompt */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <h2 className="ml-4 text-lg font-semibold text-gray-900">Edição do Prompt</h2>
          </div>

          <div>
            <textarea
              value={config.prompt}
              onChange={(e) => setConfig({...config, prompt: e.target.value})}
              rows={15}
              placeholder="Digite aqui as instruções para a IA..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            ></textarea>
            <p className="mt-2 text-sm text-gray-500">
              Descreva detalhadamente como a IA deve se comportar e responder
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save size={20} className="mr-2" />
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptAI;