import React, { useState, useEffect } from 'react';
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
  StopCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  online?: boolean;
  lastSeen?: string;
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

const InternalChat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  // Simular busca de usuários do armazenamento local
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers).map((user: User) => ({
        ...user,
        online: Math.random() > 0.5, // Simulando status online aleatório
        lastSeen: '2 min atrás'
      }));
      setUsers(parsedUsers);
    }
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

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
    if (!file || !selectedUser) return;

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
      {/* Lista de Usuários */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar usuários..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {users.length === 0 
                ? "Nenhum usuário cadastrado no sistema"
                : "Nenhum usuário encontrado"}
            </div>
          ) : (
            filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    {user.online && (
                      <Circle className="w-3 h-3 text-green-500 absolute bottom-0 right-0 fill-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                  {!user.online && user.lastSeen && (
                    <span className="text-xs text-gray-400">{user.lastSeen}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área do Chat */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Cabeçalho do Chat */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.department}</p>
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
            <p>Selecione um usuário para iniciar uma conversa</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalChat;