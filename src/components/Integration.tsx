import React, { useState } from 'react';
import {
  MessageSquare,
  QrCode,
  Instagram,
  Facebook,
  Settings,
  Plus,
  X,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import ChatbotBuilder from './ChatbotBuilder';

interface IntegrationConfig {
  type: 'whatsapp' | 'instagram' | 'facebook';
  name: string;
  status: 'connected' | 'disconnected';
  details?: {
    account?: string;
    phone?: string;
  };
}

const Integration: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [showChatbotBuilder, setShowChatbotBuilder] = useState(false);

  const handleConnect = (type: 'whatsapp' | 'instagram' | 'facebook') => {
    const newIntegration: IntegrationConfig = {
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      status: 'connected',
      details: {
        account: type === 'whatsapp' ? '+55 11 99999-9999' : '@example',
      }
    };
    setIntegrations([...integrations, newIntegration]);
  };

  const handleDisconnect = (type: string) => {
    setIntegrations(integrations.filter(integration => integration.type !== type));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Integrações</h1>

      {/* Social Media Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* WhatsApp Integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">WhatsApp</h3>
                <p className="text-sm text-gray-500">Via QR Code</p>
              </div>
            </div>
            {integrations.find(i => i.type === 'whatsapp') ? (
              <button
                onClick={() => handleDisconnect('whatsapp')}
                className="text-red-600 hover:text-red-700"
              >
                <X size={24} />
              </button>
            ) : (
              <button
                onClick={() => handleConnect('whatsapp')}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <QrCode size={20} className="mr-2" />
                Conectar
              </button>
            )}
          </div>

          {integrations.find(i => i.type === 'whatsapp')?.status === 'connected' && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Check className="text-green-500 mr-2" size={20} />
                <span className="text-sm text-green-700">Conectado</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                WhatsApp conectado com sucesso
              </p>
            </div>
          )}
        </div>

        {/* Instagram Integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Instagram className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Instagram</h3>
                <p className="text-sm text-gray-500">Direct Messages</p>
              </div>
            </div>
            {integrations.find(i => i.type === 'instagram') ? (
              <button
                onClick={() => handleDisconnect('instagram')}
                className="text-red-600 hover:text-red-700"
              >
                <X size={24} />
              </button>
            ) : (
              <button
                onClick={() => handleConnect('instagram')}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
              >
                <LinkIcon size={20} className="mr-2" />
                Conectar
              </button>
            )}
          </div>
          {integrations.find(i => i.type === 'instagram') && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Check className="text-purple-500 mr-2" size={20} />
                <span className="text-sm text-purple-700">Conectado</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Conta: @example
              </p>
            </div>
          )}
        </div>

        {/* Facebook Integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Facebook className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Facebook</h3>
                <p className="text-sm text-gray-500">Messenger</p>
              </div>
            </div>
            {integrations.find(i => i.type === 'facebook') ? (
              <button
                onClick={() => handleDisconnect('facebook')}
                className="text-red-600 hover:text-red-700"
              >
                <X size={24} />
              </button>
            ) : (
              <button
                onClick={() => handleConnect('facebook')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <LinkIcon size={20} className="mr-2" />
                Conectar
              </button>
            )}
          </div>
          {integrations.find(i => i.type === 'facebook') && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Check className="text-blue-500 mr-2" size={20} />
                <span className="text-sm text-blue-700">Conectado</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Página: Example Page
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Builder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Configuração do Chatbot</h3>
                <p className="text-sm text-gray-500">Construtor de fluxos de conversa</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatbotBuilder(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus size={20} className="mr-2" />
              Configurar
            </button>
          </div>
        </div>

        {showChatbotBuilder ? (
          <ChatbotBuilder />
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-center text-gray-500">
              <Settings size={24} className="mr-2" />
              <p>Configure o chatbot para automatizar seus atendimentos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integration;