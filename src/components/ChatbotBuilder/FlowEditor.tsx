import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  GripVertical, 
  Image as ImageIcon, 
  Video, 
  Mic,
  TextCursor,
  Hash,
  Phone,
  Variable,
  GitBranch,
  Upload,
  MessageSquare,
  Globe,
  Brain
} from 'lucide-react';

interface FlowNode {
  id: string;
  type: string;
  data: {
    text?: string;
    url?: string;
    placeholder?: string;
    inputType?: string;
    variable?: string;
    condition?: {
      variable?: string;
      operator?: string;
      value?: string;
      elseId?: string;
    };
  };
  position: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  connections?: string[];
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle: { x: number; y: number };
  targetHandle: { x: number; y: number };
}

interface FlowEditorProps {
  flow: FlowNode[];
  onFlowChange?: (flow: FlowNode[]) => void;
}

interface ConditionOperator {
  id: string;
  label: string;
}

const conditionOperators: ConditionOperator[] = [
  { id: 'equals', label: 'é igual a' },
  { id: 'not_equals', label: 'não é igual a' },
  { id: 'contains', label: 'contém' },
  { id: 'not_contains', label: 'não contém' },
  { id: 'empty', label: 'está vazio' },
  { id: 'not_empty', label: 'não está vazio' }
];

const FlowEditor: React.FC<FlowEditorProps> = ({ flow, onFlowChange }) => {
  const [nodes, setNodes] = useState<FlowNode[]>(flow);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [dragNode, setDragNode] = useState<{ id: string; startX: number; startY: number; initialPos: { x: number; y: number } } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; direction: 'se' | 'e' | 's' | null }>({ id: '', direction: null });
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggingConnection, setDraggingConnection] = useState<{
    sourceId: string;
    sourceHandle: { x: number; y: number };
    currentPoint: { x: number; y: number };
  } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorSize, setEditorSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateEditorSize = () => {
      if (editorRef.current) {
        setEditorSize({
          width: editorRef.current.offsetWidth,
          height: editorRef.current.offsetHeight
        });
      }
    };

    updateEditorSize();
    window.addEventListener('resize', updateEditorSize);
    return () => window.removeEventListener('resize', updateEditorSize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingConnection && editorRef.current) {
        const rect = editorRef.current.getBoundingClientRect();
        const scrollLeft = editorRef.current.scrollLeft;
        const scrollTop = editorRef.current.scrollTop;
        
        setDraggingConnection(prev => ({
          ...prev!,
          currentPoint: {
            x: e.clientX - rect.left + scrollLeft,
            y: e.clientY - rect.top + scrollTop
          }
        }));
      }
    };

    const handleMouseUp = () => {
      setDraggingConnection(null);
    };

    if (draggingConnection) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingConnection]);

  const getInitialNodeSize = (type: string) => {
    switch (type) {
      case 'text':
        return { width: 300, height: 200 };
      case 'image':
      case 'video':
      case 'audio':
        return { width: 300, height: 250 };
      case 'input_text':
      case 'input_number':
      case 'input_phone':
        return { width: 300, height: 250 };
      case 'set_variable':
      case 'condition':
        return { width: 300, height: 250 };
      case 'http_request':
        return { width: 300, height: 300 };
      case 'ai_assistant':
        return { width: 300, height: 250 };
      default:
        return { width: 300, height: 200 };
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data && editorRef.current) {
      try {
        const bubble = JSON.parse(data);
        const rect = editorRef.current.getBoundingClientRect();
        const scrollLeft = editorRef.current.scrollLeft;
        const scrollTop = editorRef.current.scrollTop;

        const x = e.clientX - rect.left + scrollLeft - 150;
        const y = e.clientY - rect.top + scrollTop - 100;

        const newNode: FlowNode = {
          id: Date.now().toString(),
          type: bubble.type,
          data: { text: '' },
          position: { x, y },
          size: getInitialNodeSize(bubble.type),
          connections: []
        };

        const updatedNodes = [...nodes, newNode];
        setNodes(updatedNodes);
        setSelectedNode(newNode);
        
        if (onFlowChange) {
          onFlowChange(updatedNodes);
        }
      } catch (error) {
        console.error('Erro ao processar o drop:', error);
      }
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <MessageSquare size={16} />;
      case 'image':
        return <ImageIcon size={16} />;
      case 'video':
        return <Video size={16} />;
      case 'audio':
        return <Mic size={16} />;
      case 'input_text':
        return <TextCursor size={16} />;
      case 'input_number':
        return <Hash size={16} />;
      case 'input_phone':
        return <Phone size={16} />;
      case 'set_variable':
        return <Variable size={16} />;
      case 'condition':
        return <GitBranch size={16} />;
      case 'http_request':
        return <Globe size={16} />;
      case 'ai_assistant':
        return <Brain size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const getNodeTitle = (type: string) => {
    switch (type) {
      case 'text':
        return 'Mensagem de Texto';
      case 'image':
        return 'Imagem';
      case 'video':
        return 'Vídeo';
      case 'audio':
        return 'Áudio';
      case 'input_text':
        return 'Campo de Texto';
      case 'input_number':
        return 'Campo Numérico';
      case 'input_phone':
        return 'Campo de Telefone';
      case 'set_variable':
        return 'Definir Variável';
      case 'condition':
        return 'Condição';
      case 'http_request':
        return 'HTTP Request';
      case 'ai_assistant':
        return 'Atendente IA';
      default:
        return 'Nó';
    }
  };

  const handleNodeDataChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>,
    field: string = 'text'
  ) => {
    if (!selectedNode) return;

    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNode.id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return {
            ...node,
            data: {
              ...node.data,
              [parent]: {
                ...node.data[parent],
                [child]: e.target.value
              }
            }
          };
        }
        return {
          ...node,
          data: {
            ...node.data,
            [field]: e.target.value
          }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    setSelectedNode(updatedNodes.find(n => n.id === selectedNode.id) || null);

    if (onFlowChange) {
      onFlowChange(updatedNodes);
    }
  };

  const renderNodeContent = (node: FlowNode) => {
    switch (node.type) {
      case 'text':
        return (
          <div className="p-4">
            <textarea
              value={node.data.text || ''}
              onChange={handleNodeDataChange}
              placeholder="Digite sua mensagem..."
              className="w-full h-full resize-none p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        );

      case 'image':
      case 'video':
      case 'audio':
        return (
          <div className="p-4 space-y-4">
            <div 
              className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = node.type === 'image' 
                  ? 'image/*' 
                  : node.type === 'video'
                  ? 'video/*'
                  : 'audio/*';
                
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    handleNodeDataChange({ target: { value: url } } as any, 'url');
                  }
                };
                
                input.click();
              }}
            >
              {node.data.url ? (
                node.type === 'image' ? (
                  <img 
                    src={node.data.url} 
                    alt="Preview" 
                    className="max-w-full max-h-[160px] object-contain"
                  />
                ) : node.type === 'video' ? (
                  <video 
                    src={node.data.url}
                    controls
                    className="max-w-full max-h-[160px]"
                  />
                ) : (
                  <audio 
                    src={node.data.url}
                    controls
                    className="w-full"
                  />
                )
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Clique para {node.type === 'image' ? 'escolher imagem' : 
                      node.type === 'video' ? 'escolher vídeo' : 'escolher áudio'}
                  </p>
                </div>
              )}
            </div>
            <input
              type="text"
              value={node.data.url || ''}
              onChange={(e) => handleNodeDataChange(e, 'url')}
              placeholder={`Ou cole a URL do ${node.type}`}
              className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        );

      case 'input_text':
      case 'input_number':
      case 'input_phone':
        return (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={node.data.placeholder || ''}
                onChange={(e) => handleNodeDataChange(e, 'placeholder')}
                placeholder="Digite o placeholder..."
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-full p-2 border border-gray-300 rounded bg-white text-gray-400">
                {node.data.placeholder || 'Campo de entrada'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Variável
              </label>
              <input
                type="text"
                value={node.data.variable?.replace(/[{}]/g, '') || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[{}]/g, '');
                  handleNodeDataChange(
                    { target: { value: `{{${value}}}` } } as any,
                    'variable'
                  );
                }}
                placeholder="Ex: nome"
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'set_variable':
        return (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Variável
              </label>
              <input
                type="text"
                value={node.data.variable || ''}
                onChange={(e) => handleNodeDataChange(e, 'variable')}
                placeholder="Nome da variável (ex: {{nome}})"
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <textarea
                value={node.data.text || ''}
                onChange={handleNodeDataChange}
                placeholder="Valor ou expressão..."
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variável
              </label>
              <input
                type="text"
                value={node.data.condition?.variable || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[{}]/g, '');
                  handleNodeDataChange(
                    { target: { value } } as any,
                    'condition.variable'
                  );
                }}
                placeholder="Buscar variável..."
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operador
              </label>
              <select
                value={node.data.condition?.operator || ''}
                onChange={(e) => 
                  handleNodeDataChange(
                    { target: { value: e.target.value } } as any,
                    'condition.operator'
                  )
                }
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione um operador</option>
                {conditionOperators.map(op => (
                  <option key={op.id} value={op.id}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            {!['empty', 'not_empty'].includes(node.data.condition?.operator || '') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="text"
                  value={node.data.condition?.value || ''}
                  onChange={(e) => 
                    handleNodeDataChange(
                      { target: { value: e.target.value } } as any,
                      'condition.value'
                    )
                  }
                  placeholder="Digite um valor..."
                  className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Configure</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Else</span>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
        );

      case 'http_request':
        return (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método
              </label>
              <select
                value={node.data.method || 'GET'}
                onChange={(e) => handleNodeDataChange(e, 'method')}
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                value={node.data.url || ''}
                onChange={(e) => handleNodeDataChange(e, 'url')}
                placeholder="https://api.exemplo.com/endpoint"
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headers (JSON)
              </label>
              <textarea
                value={node.data.headers || ''}
                onChange={(e) => handleNodeDataChange(e, 'headers')}
                placeholder='{"Content-Type": "application/json"}'
                rows={3}
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body (JSON)
              </label>
              <textarea
                value={node.data.body || ''}
                onChange={(e) => handleNodeDataChange(e, 'body')}
                placeholder='{"key": "value"}'
                rows={3}
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        );

      case 'ai_assistant':
        return (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <textarea
                value={node.data.prompt || ''}
                onChange={(e) => handleNodeDataChange(e, 'prompt')}
                placeholder="Digite o prompt para o assistente..."
                rows={4}
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variável de Resposta
              </label>
              <input
                type="text"
                value={node.data.responseVariable || ''}
                onChange={(e) => handleNodeDataChange(e, 'responseVariable')}
                placeholder="Nome da variável para armazenar a resposta"
                className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, node: FlowNode) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.connection-handle')) return;

    setDragNode({
      id: node.id,
      startX: e.clientX,
      startY: e.clientY,
      initialPos: { ...node.position }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editorRef.current) return;

    const rect = editorRef.current.getBoundingClientRect();
    const scrollLeft = editorRef.current.scrollLeft;
    const scrollTop = editorRef.current.scrollTop;

    if (dragNode) {
      const deltaX = e.clientX - dragNode.startX;
      const deltaY = e.clientY - dragNode.startY;

      const updatedNodes = nodes.map(node => {
        if (node.id === dragNode.id) {
          return {
            ...node,
            position: {
              x: dragNode.initialPos.x + deltaX,
              y: dragNode.initialPos.y + deltaY
            }
          };
        }
        return node;
      });

      setNodes(updatedNodes);
      
      const updatedConnections = connections.map(conn => {
        if (conn.sourceId === dragNode.id) {
          const node = updatedNodes.find(n => n.id === dragNode.id);
          if (node) {
            return {
              ...conn,
              sourceHandle: {
                x: node.position.x + (node.size?.width || 0),
                y: node.position.y + (node.size?.height || 0) / 2
              }
            };
          }
        }
        if (conn.targetId === dragNode.id) {
          const node = updatedNodes.find(n => n.id === dragNode.id);
          if (node) {
            return {
              ...conn,
              targetHandle: {
                x: node.position.x,
                y: node.position.y + (node.size?.height || 0) / 2
              }
            };
          }
        }
        return conn;
      });
      setConnections(updatedConnections);

      if (onFlowChange) {
        onFlowChange(updatedNodes);
      }
    } else if (resizing.direction) {
      const node = nodes.find(n => n.id === resizing.id);
      if (!node || !node.size) return;

      const mouseX = e.clientX - rect.left + scrollLeft;
      const mouseY = e.clientY - rect.top + scrollTop;

      const updatedNodes = nodes.map(n => {
        if (n.id === resizing.id) {
          const newSize = { ...n.size };
          
          if (resizing.direction === 'e' || resizing.direction === 'se') {
            newSize.width = Math.max(200, mouseX - n.position.x);
          }
          if (resizing.direction === 's' || resizing.direction === 'se') {
            newSize.height = Math.max(150, mouseY - n.position.y);
          }

          return { ...n, size: newSize };
        }
        return n;
      });

      setNodes(updatedNodes);
      
      const updatedConnections = connections.map(conn => {
        if (conn.sourceId === resizing.id) {
          const node = updatedNodes.find(n => n.id === resizing.id);
          if (node) {
            return {
              ...conn,
              sourceHandle: {
                x: node.position.x + (node.size?.width || 0),
                y: node.position.y + (node.size?.height || 0) / 2
              }
            };
          }
        }
        return conn;
      });
      setConnections(updatedConnections);

      if (onFlowChange) {
        onFlowChange(updatedNodes);
      }
    }
  };

  const handleConnectionStart = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editorRef.current) return;

    const rect = editorRef.current.getBoundingClientRect();
    const scrollLeft = editorRef.current.scrollLeft;
    const scrollTop = editorRef.current.scrollTop;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const sourceHandle = {
      x: node.position.x + (node.size?.width || 0),
      y: node.position.y + (node.size?.height || 0) / 2
    };

    setDraggingConnection({
      sourceId: nodeId,
      sourceHandle,
      currentPoint: {
        x: e.clientX - rect.left + scrollLeft,
        y: e.clientY - rect.top + scrollTop
      }
    });
  };

  const handleConnectionEnd = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggingConnection && draggingConnection.sourceId !== targetId) {
      const sourceNode = nodes.find(n => n.id === draggingConnection.sourceId);
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (sourceNode && targetNode) {
        // Check if this is a condition node connection
        const isConditionConnection = sourceNode.type === 'condition';
        const connectionPoint = e.target as HTMLElement;
        const isElseConnection = connectionPoint.classList.contains('else-handle');

        const newConnection: Connection = {
          id: Date.now().toString(),
          sourceId: draggingConnection.sourceId,
          targetId: targetNode.id,
          sourceHandle: draggingConnection.sourceHandle,
          targetHandle: {
            x: targetNode.position.x,
            y: targetNode.position.y + (targetNode.size?.height || 0) / 2
          }
        };

        const connectionExists = connections.some(
          conn => conn.sourceId === draggingConnection.sourceId && conn.targetId === targetId
        );

        if (!connectionExists) {
          setConnections([...connections, newConnection]);

          const updatedNodes = nodes.map(node => {
            if (node.id === draggingConnection.sourceId) {
              if (isConditionConnection && isElseConnection) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    condition: {
                      ...node.data.condition,
                      elseId: targetNode.id
                    }
                  }
                };
              }
              return {
                ...node,
                connections: [...(node.connections || []), targetNode.id]
              };
            }
            return node;
          });

          setNodes(updatedNodes);
          if (onFlowChange) {
            onFlowChange(updatedNodes);
          }
        }
      }
    }

    setDraggingConnection(null);
  };

  const handleMouseUp = () => {
    setDragNode(null);
    setResizing({ id: '', direction: null });
  };

  const handleResizeStart = (e: React.MouseEvent, nodeId: string, direction: 'se' | 'e' | 's') => {
    e.stopPropagation();
    setResizing({ id: nodeId, direction });
  };

  const handleNodeClick = (e: React.MouseEvent, node: FlowNode) => {
    e.stopPropagation();
    setSelectedNode(node);
  };

  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    setNodes(updatedNodes);
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    setConnections(connections.filter(
      conn => conn.sourceId !== nodeId && conn.targetId !== nodeId
    ));
    if (onFlowChange) {
      onFlowChange(updatedNodes);
    }
  };

  return (
    <div 
      ref={editorRef}
      className="relative w-full h-full bg-gray -100 overflow-auto"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0" style={{ minWidth: '100%', minHeight: '100%' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          {connections.map(connection => (
            <path
              key={connection.id}
              d={`M ${connection.sourceHandle.x} ${connection.sourceHandle.y} C ${connection.sourceHandle.x + 100} ${connection.sourceHandle.y}, ${connection.targetHandle.x - 100} ${connection.targetHandle.y}, ${connection.targetHandle.x} ${connection.targetHandle.y}`}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          ))}
          {draggingConnection && (
            <path
              d={`M ${draggingConnection.sourceHandle.x} ${draggingConnection.sourceHandle.y} C ${draggingConnection.sourceHandle.x + 100} ${draggingConnection.sourceHandle.y}, ${draggingConnection.currentPoint.x - 100} ${draggingConnection.currentPoint.y}, ${draggingConnection.currentPoint.x} ${draggingConnection.currentPoint.y}`}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
            />
          )}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute rounded-lg shadow-lg ${
              selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''
            } bg-white`}
            style={{
              left: node.position.x,
              top: node.position.y,
              width: node.size?.width || 300,
              height: node.size?.height || 200,
            }}
            onClick={(e) => handleNodeClick(e, node)}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-200 cursor-move">
              <div className="flex items-center">
                <GripVertical size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-500 mr-2">
                  {getNodeIcon(node.type)}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {getNodeTitle(node.type)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNode(node.id);
                }}
                className="p-1 text-gray-500 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="h-[calc(100%-64px)] overflow-y-auto">
              {renderNodeContent(node)}
            </div>

            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={(e) => handleResizeStart(e, node.id, 'se')}
            />
            <div
              className="absolute bottom-0 right-1/2 w-4 h-4 -translate-x-1/2 cursor-s-resize"
              onMouseDown={(e) => handleResizeStart(e, node.id, 's')}
            />
            <div
              className="absolute top-1/2 right-0 w-4 h-4 -translate-y-1/2 cursor-e-resize"
              onMouseDown={(e) => handleResizeStart(e, node.id, 'e')}
            />

            {node.type === 'condition' ? (
              <>
                <div
                  className="connection-handle configure-handle absolute top-1/2 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 bg-white border-2 border-green-500 rounded-full hover:border-green-600 cursor-crosshair z-10"
                  onMouseDown={(e) => handleConnectionStart(e, node.id)}
                />
                <div
                  className="connection-handle else-handle absolute bottom-1/4 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 bg-white border-2 border-red-500 rounded-full hover:border-red-600 cursor-crosshair z-10"
                  onMouseDown={(e) => handleConnectionStart(e, node.id)}
                />
              </>
            ) : (
              <div
                className="connection-handle absolute top-1/2 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 bg-white border-2 border-slate-400 rounded-full hover:border-blue-500 cursor-crosshair z-10"
                onMouseDown={(e) => handleConnectionStart(e, node.id)}
              />
            )}
            <div
              className="connection-handle absolute top-1/2 left-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-slate-400 rounded-full hover:border-blue-500 cursor-crosshair z-10"
              onMouseUp={(e) => handleConnectionEnd(e, node.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowEditor;