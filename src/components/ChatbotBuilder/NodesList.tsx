import React from 'react';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  TextCursor,
  Hash,
  Phone,
  Variable,
  GitBranch
} from 'lucide-react';

const NodesList: React.FC = () => {
  const bubbles = [
    {
      type: 'text',
      label: 'Texto',
      iconType: 'message',
      description: 'Envia uma mensagem de texto',
      category: 'elements'
    },
    {
      type: 'image',
      label: 'Imagem',
      iconType: 'image',
      description: 'Envia uma imagem',
      category: 'elements'
    },
    {
      type: 'video',
      label: 'Vídeo',
      iconType: 'video',
      description: 'Envia um vídeo',
      category: 'elements'
    },
    {
      type: 'audio',
      label: 'Áudio',
      iconType: 'audio',
      description: 'Envia um áudio',
      category: 'elements'
    },
    {
      type: 'input_text',
      label: 'Campo de Texto',
      iconType: 'input_text',
      description: 'Campo para digitar texto',
      category: 'inputs'
    },
    {
      type: 'input_number',
      label: 'Campo Numérico',
      iconType: 'input_number',
      description: 'Campo para digitar número',
      category: 'inputs'
    },
    {
      type: 'input_phone',
      label: 'Campo de Telefone',
      iconType: 'input_phone',
      description: 'Campo para digitar telefone',
      category: 'inputs'
    },
    {
      type: 'set_variable',
      label: 'Definir Variável',
      iconType: 'variable',
      description: 'Cria e define uma variável',
      category: 'logic'
    },
    {
      type: 'condition',
      label: 'Condição',
      iconType: 'condition',
      description: 'Define condições para o fluxo',
      category: 'logic'
    }
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'message':
        return <MessageSquare size={20} />;
      case 'image':
        return <ImageIcon size={20} />;
      case 'video':
        return <Video size={20} />;
      case 'audio':
        return <Mic size={20} />;
      case 'input_text':
        return <TextCursor size={20} />;
      case 'input_number':
        return <Hash size={20} />;
      case 'input_phone':
        return <Phone size={20} />;
      case 'variable':
        return <Variable size={20} />;
      case 'condition':
        return <GitBranch size={20} />;
      default:
        return <MessageSquare size={20} />;
    }
  };

  const handleDragStart = (e: React.DragEvent, bubble: any) => {
    e.currentTarget.classList.add('opacity-50');
    e.dataTransfer.setData('application/json', JSON.stringify(bubble));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const elementBubbles = bubbles.filter(b => b.category === 'elements');
  const inputBubbles = bubbles.filter(b => b.category === 'inputs');
  const logicBubbles = bubbles.filter(b => b.category === 'logic');

  return (
    <div className="p-4 space-y-6">
      {/* Elementos */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Elementos</h3>
        <div className="space-y-2">
          {elementBubbles.map((bubble) => (
            <div
              key={bubble.type}
              className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-500 hover:shadow-sm transition-all"
              draggable
              onDragStart={(e) => handleDragStart(e, bubble)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  {getIcon(bubble.iconType)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{bubble.label}</h4>
                  <p className="text-xs text-gray-500">{bubble.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campos de Entrada */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Campos de Entrada</h3>
        <div className="space-y-2">
          {inputBubbles.map((bubble) => (
            <div
              key={bubble.type}
              className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-500 hover:shadow-sm transition-all"
              draggable
              onDragStart={(e) => handleDragStart(e, bubble)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  {getIcon(bubble.iconType)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{bubble.label}</h4>
                  <p className="text-xs text-gray-500">{bubble.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lógica */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Lógica</h3>
        <div className="space-y-2">
          {logicBubbles.map((bubble) => (
            <div
              key={bubble.type}
              className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-500 hover:shadow-sm transition-all"
              draggable
              onDragStart={(e) => handleDragStart(e, bubble)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  {getIcon(bubble.iconType)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{bubble.label}</h4>
                  <p className="text-xs text-gray-500">{bubble.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodesList;