import React, { useState } from 'react';
import { 
  Paperclip, 
  Send, 
  Mic, 
  User, 
  Circle,
  X,
  Image as ImageIcon,
  FileText,
  Headphones,
  Play,
  Pause,
  StopCircle,
  SmilePlus
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  platform: string;
  lastMessage?: string;
  lastMessageTime?: string;
  online?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'audio';
  fileUrl?: string;
  fileName?: string;
}

const Chat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'pending'>('ongoing');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      content: 'Arquivo enviado',
      timestamp: new Date().toISOString(),
      type: 'file',
      fileName: file.name,
      fileUrl: URL.createObjectURL(file)
    };

    setMessages([...messages, newMessage]);
    setShowAttachMenu(false);
  };

  const handleRecordAudio = () => {
    setIsRecording(!isRecording);
    // Implementar lógica de gravação de áudio
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex">
      {/* Lista de Contatos */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'ongoing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('ongoing')}
          >
            Em andamento
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pendente
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
          {contacts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="mb-2">Nenhum contato integrado</p>
              <p className="text-sm">Integre suas redes sociais para começar a conversar</p>
            </div>
          ) : (
            contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    {contact.online && (
                      <Circle className="w-3 h-3 text-green-500 absolute bottom-0 right-0 fill-current" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {contact.lastMessageTime}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{contact.platform}</p>
                    {contact.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {contact.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área do Chat */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Cabeçalho do Chat */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedContact.name}
                </h2>
                <p className="text-sm text-gray-500">{selectedContact.platform}</p>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.senderId === 'currentUser'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  {msg.type === 'text' && (
                    <p>{msg.content}</p>
                  )}
                  
                  {msg.type === 'file' && (
                    <div className="flex items-center space-x-2">
                      {msg.fileName?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <ImageIcon className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {msg.fileName}
                      </a>
                    </div>
                  )}

                  {msg.type === 'audio' && (
                    <div className="flex items-center space-x-2">
                      <Headphones className="w-5 h-5" />
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4 cursor-pointer" />
                        <div className="w-32 h-1 bg-gray-200 rounded-full">
                          <div className="w-1/2 h-full bg-blue-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}

                  <span className="text-xs opacity-70 mt-1 block">
                    {formatMessageTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Área de Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-2">
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-sm">Imagem</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span className="text-sm">Documento</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <SmilePlus className="w-5 h-5 text-gray-500" />
              </button>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />

              <button
                onClick={handleRecordAudio}
                className={`p-2 rounded-full ${
                  isRecording ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
                }`}
              >
                {isRecording ? (
                  <StopCircle className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <User className="w-16 h-16 mx-auto mb-4" />
            <p>Selecione um contato para iniciar uma conversa</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;