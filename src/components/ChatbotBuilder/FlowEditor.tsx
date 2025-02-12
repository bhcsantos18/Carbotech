import React, { useState, useRef, useEffect } from 'react';
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
  MessageSquare
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
    condition?: string;
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
        return { width: 300, height: 180 };
      case 'set_variable':
      case 'condition':
        return { width: 300, height: 200 };
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
      default:
        return 'Nó';
    }
  };

  const renderNodeContent = (node: FlowNode) => {
    switch (node.type) {
      case 'text':
        return (
          <textarea
            value={node.data.text || ''}
            onChange={handleNodeDataChange}
            placeholder="Digite sua mensagem..."
            className="w-full h-[calc(100%-1rem)] resize-none p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'image':
      case 'video':
      case 'audio':
        return (
          <div className="w-full h-[calc(100%-1rem)] flex flex-col space-y-2">
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {node.data.url ? (
                node.type === 'image' ? (
                  <img 
                    src={node.data.url} 
                    alt="Preview" 
                    className="max-w-full max-h-[160px] object-contain"
                  />
                ) : (
                  <div className="text-gray-500 text-sm">
                    {node.type === 'video' ? 'Vídeo' : 'Áudio'} carregado
                  </div>
                )
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Clique para fazer upload
                  </p>
                </div>
              )}
            </div>
            <input
              type="text"
              value={node.data.url || ''}
              onChange={(e) => handleNodeDataChange(e, 'url')}
              placeholder="Ou cole a URL aqui"
              className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        );

      case 'input_text':
      case 'input_number':
      case 'input_phone':
        return (
          <div className="w-full h-[calc(100%-1rem)] flex flex-col space-y-2">
            <input
              type="text"
              value={node.data.placeholder || ''}
              onChange={(e) => handleNodeDataChange(e, 'placeholder')}
              placeholder="Digite o placeholder..."
              className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <div className="w-full p-2 border border-gray-300 rounded bg-white text-gray-400">
                {node.data.placeholder || 'Campo de entrada'}
              </div>
            </div>
          </div>
        );

      case 'set_variable':
        return (
          <div className="w-full h-[calc(100%-1rem)] flex flex-col space-y-2">
            <input
              type="text"
              value={node.data.variable || ''}
              onChange={(e) => handleNodeDataChange(e, 'variable')}
              placeholder="Nome da variável..."
              className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <textarea
              value={node.data.text || ''}
              onChange={handleNodeDataChange}
              placeholder="Valor ou expressão..."
              className="flex-1 w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
        );

      case 'condition':
        return (
          <div className="w-full h-[calc(100%-1rem)] flex flex-col space-y-2">
            <textarea
              value={node.data.condition || ''}
              onChange={(e) => handleNodeDataChange(e, 'condition')}
              placeholder="Digite a condição..."
              className="flex-1 w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const handleNodeDataChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: string = 'text'
  ) => {
    if (!selectedNode) return;

    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNode.id) {
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
    setSelectedNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        [field]: e.target.value
      }
    });

    if (onFlowChange) {
      onFlowChange(updatedNodes);
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
      const targetNode = nodes.find(n => n.id === targetId);
      if (targetNode) {
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
      className="relative w-full h-full bg-gray-100 overflow-auto"
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

            <div className="p-4 h-[calc(100%-4rem)]">
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

            <div
              className="connection-handle absolute top-1/2 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 bg-white border-2 border-slate-400 rounded-full hover:border-blue-500 cursor-crosshair z-10"
              onMouseDown={(e) => handleConnectionStart(e, node.id)}
            />
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