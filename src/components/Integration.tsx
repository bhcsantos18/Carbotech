import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Loader2
} from 'lucide-react';
import ChatbotBuilder from './ChatbotBuilder';
import io from 'socket.io-client';

interface IntegrationConfig {
  type: 'whatsapp' | 'instagram' | 'facebook';
  name: string;
  status: 'connected' | 'disconnected' | 'connecting';
  details?: {
    account?: string;
    phone?: string;
  };
}

const Integration: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [showChatbotBuilder, setShowChatbotBuilder] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('Connecting to socket...');
      const newSocket = io('http://localhost:3000', {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });
      
      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
        setError(null);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setError('Erro ao conectar com o servidor. Certifique-se que o servidor está rodando.');
        setConnecting(false);
      });

      newSocket.on('qr', (qr: string) => {
        console.log('QR code received');
        setQrCode(qr);
        setError(null);
      });

      newSocket.on('connection-status', (status: string) => {
        console.log('Connection status:', status);
        if (status === 'connected') {
          setConnecting(false);
          setQrCode(null);
          setError(null);
          
          setIntegrations(prev => prev.map(integration => 
            integration.type === 'whatsapp' 
              ? { 
                  ...integration, 
                  status: 'connected',
                  details: {
                    ...integration.details,
                    phone: 'Conectado'
                  }
                }
              : integration
          ));
        }
      });

      newSocket.on('error', (errorMsg: string) => {
        console.error('Server error:', errorMsg);
        setError(errorMsg);
        setConnecting(false);
      });

      setSocket(newSocket);

      return () => {
        console.log('Disconnecting socket...');
        newSocket.disconnect();
      };
    } catch (err) {
      console.error('Error setting up socket:', err);
      setError('Erro ao configurar a conexão');
    }
  }, []);

  const handleWhatsAppConnect = () => {
    if (!socket?.connected) {
      setError('Servidor não está conectado. Verifique se o servidor está rodando.');
      return;
    }

    setConnecting(true);
    setError(null);
    setQrCode(null);
    
    console.log('Requesting WhatsApp connection...');
    socket.emit('start-whatsapp');
    
    setIntegrations(prev => [
      ...prev,
      {
        type: 'whatsapp',
        name: 'WhatsApp',
        status: 'connecting'
      }
    ]);
  };

  const handleDisconnect = (type: string) => {
    if (type === 'whatsapp' && socket?.connected) {
      socket.emit('disconnect-whatsapp');
    }
    setIntegrations(integrations.filter(integration => integration.type !== type));
    setQrCode(null);
    setError(null);
  };

  const handleConnect = (type: 'instagram' | 'facebook') => {
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
                onClick={handleWhatsAppConnect}
                disabled={connecting}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {connecting ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <QrCode size={20} className="mr-2" />
                    Conectar
                  </>
                )}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {qrCode && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex justify-center">
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="mt-4 text-sm text-center text-gray-600">
                Escaneie o QR Code com seu WhatsApp para conectar
              </p>
            </div>
          )}

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
              <AlertCircle size={24} className="mr-2" />
              <p>Configure o chatbot para automatizar seus atendimentos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integration;