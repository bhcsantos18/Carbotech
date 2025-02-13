import React, { useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';

interface TestChatProps {
  isOpen: boolean;
  onClose: () => void;
  flow: FlowNode[];
}

interface FlowNode {
  id: string;
  type: string;
  data: {
    text?: string;
    url?: string;
    placeholder?: string;
    inputType?: string;
    variable?: string;
    condition?: string;
  };
  position: {
    x: number;
    y: number;
  };
  connections?: string[];
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  nodeId?: string;
}

const TestChat: React.FC<TestChatProps> = ({ isOpen, onClose, flow }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  // Reset chat when opened
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInputValue('');
      setCurrentNodeId(null);
      setVariables({});
      
      // Start the chat flow if there are nodes
      if (flow.length > 0) {
        const startNode = flow[0];
        if (startNode) {
          setTimeout(() => {
            handleBotResponse(startNode);
          }, 500);
        }
      }
    }
  }, [isOpen, flow]);

  const findNodeById = (id: string) => {
    return flow.find(node => node.id === id);
  };

  const findNextNode = (currentNode: FlowNode) => {
    if (!currentNode.connections?.length) return null;
    return findNodeById(currentNode.connections[0]);
  };

  const handleBotResponse = (node: FlowNode) => {
    let content = '';

    switch (node.type) {
      case 'text':
        content = node.data.text || '';
        break;
      case 'image':
        content = `[Imagem] ${node.data.url || ''}`;
        break;
      case 'video':
        content = `[Vídeo] ${node.data.url || ''}`;
        break;
      case 'audio':
        content = `[Áudio] ${node.data.url || ''}`;
        break;
      case 'input_text':
      case 'input_number':
      case 'input_phone':
        content = node.data.placeholder || 'Por favor, digite sua resposta...';
        break;
      case 'set_variable':
        if (node.data.variable && node.data.text) {
          setVariables(prev => ({
            ...prev,
            [node.data.variable!]: node.data.text!
          }));
        }
        const nextNode = findNextNode(node);
        if (nextNode) {
          setTimeout(() => {
            handleBotResponse(nextNode);
          }, 500);
        }
        return;
      case 'condition':
        const conditionResult = evaluateCondition(node.data.condition || '', variables);
        const nextNodeAfterCondition = findNextNode(node);
        if (nextNodeAfterCondition) {
          setTimeout(() => {
            handleBotResponse(nextNodeAfterCondition);
          }, 500);
        }
        return;
    }

    // Add bot message
    const botMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
      nodeId: node.id
    };

    setMessages(prev => [...prev, botMessage]);
    setCurrentNodeId(node.id);

    // If it's not an input node, automatically proceed to next node
    if (!node.type.startsWith('input_')) {
      const nextNode = findNextNode(node);
      if (nextNode) {
        setTimeout(() => {
          handleBotResponse(nextNode);
        }, 1000);
      }
    }
  };

  const evaluateCondition = (condition: string, variables: Record<string, string>): boolean => {
    try {
      const evaluableCondition = condition.replace(/\$\{(\w+)\}/g, (_, key) => 
        variables[key] || ''
      );
      return Boolean(eval(evaluableCondition));
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  };

  const handleUserInput = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Find current node and get next node
    if (currentNodeId) {
      const currentNode = findNodeById(currentNodeId);
      if (currentNode) {
        // If current node is an input node, store the value
        if (currentNode.type.startsWith('input_') && currentNode.data.variable) {
          setVariables(prev => ({
            ...prev,
            [currentNode.data.variable!]: inputValue
          }));
        }

        // Find and process next node
        const nextNode = findNextNode(currentNode);
        if (nextNode) {
          setTimeout(() => {
            handleBotResponse(nextNode);
          }, 500);
        }
      }
    }

    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Teste do Chatbot</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              Iniciando conversa...
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content.startsWith('[Imagem]') ? (
                    <img 
                      src={message.content.replace('[Imagem] ', '')}
                      alt="Imagem do chat"
                      className="max-w-full rounded"
                    />
                  ) : message.content.startsWith('[Vídeo]') ? (
                    <div className="bg-black/5 p-2 rounded">
                      <p className="text-sm">🎥 Vídeo</p>
                      <p className="text-xs mt-1 text-gray-500">
                        {message.content.replace('[Vídeo] ', '')}
                      </p>
                    </div>
                  ) : message.content.startsWith('[Áudio]') ? (
                    <div className="bg-black/5 p-2 rounded">
                      <p className="text-sm">🎵 Áudio</p>
                      <p className="text-xs mt-1 text-gray-500">
                        {message.content.replace('[Áudio] ', '')}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUserInput();
                }
              }}
            />
            <button
              onClick={handleUserInput}
              disabled={!inputValue.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChat;