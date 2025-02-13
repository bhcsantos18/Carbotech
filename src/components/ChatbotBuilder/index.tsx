import React, { useState } from 'react';
import { Plus, X, Save, Play, Settings, MessageSquare, ArrowRight, Trash2 } from 'lucide-react';
import FlowEditor from './FlowEditor';
import NodesList from './NodesList';
import TestChat from './TestChat';

interface Chatbot {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  flow: FlowNode[];
}

interface FlowNode {
  id: string;
  type: string;
  data: {
    text?: string;
    url?: string;
    options?: string[];
    variable?: string;
    condition?: string;
  };
  position: {
    x: number;
    y: number;
  };
  next?: string[];
}

const ChatbotBuilder: React.FC = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [showTestChat, setShowTestChat] = useState(false);

  const handleCreateChatbot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newChatbot: Chatbot = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: 'inactive',
      flow: []
    };

    setChatbots([...chatbots, newChatbot]);
    setShowForm(false);
  };

  const handleEditFlow = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setShowEditor(true);
  };

  const handleDeleteChatbot = (id: string) => {
    setChatbots(chatbots.filter(chatbot => chatbot.id !== id));
  };

  const handleFlowChange = (flow: FlowNode[]) => {
    if (!selectedChatbot) return;

    const updatedChatbots = chatbots.map(chatbot => 
      chatbot.id === selectedChatbot.id
        ? { ...chatbot, flow }
        : chatbot
    );

    setChatbots(updatedChatbots);
    setSelectedChatbot({ ...selectedChatbot, flow });
  };

  const handleTestChatbot = () => {
    setShowTestChat(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Construtor de Chatbot</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Novo Chatbot
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Novo Chatbot</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateChatbot} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome do Chatbot *
                  </label>
                  <input
                    type="text"
                    name="name"
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

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Criar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditor && selectedChatbot ? (
        <div className="fixed inset-0 bg-gray-100 z-50">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{selectedChatbot.name}</h2>
                  <p className="text-sm text-gray-500">{selectedChatbot.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleTestChatbot}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Play size={20} className="mr-2" />
                    Testar
                  </button>
                  <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Settings size={20} className="mr-2" />
                    Configurações
                  </button>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Save size={20} className="mr-2" />
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setShowEditor(false);
                      setSelectedChatbot(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Nodes List */}
              <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                <NodesList />
              </div>

              {/* Flow Editor */}
              <div className="flex-1 overflow-hidden">
                <FlowEditor 
                  flow={selectedChatbot.flow}
                  onFlowChange={handleFlowChange}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {chatbots.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum chatbot criado</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chatbots.map((chatbot) => (
                  <tr key={chatbot.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{chatbot.name}</td>
                    <td className="px-6 py-4">{chatbot.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        chatbot.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {chatbot.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDeleteChatbot(chatbot.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => handleEditFlow(chatbot)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Test Chat Modal */}
      <TestChat
        isOpen={showTestChat}
        onClose={() => setShowTestChat(false)}
        flow={selectedChatbot?.flow || []}
      />
    </div>
  );
};

export default ChatbotBuilder;