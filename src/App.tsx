import React, { useState } from 'react';
import { 
  MessageSquare, 
  LayoutDashboard, 
  FileText, 
  DollarSign,
  Users,
  Calendar as CalendarIcon,
  MessageCircle,
  Settings,
  Link,
  Brain,
  Building2,
  Palette,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import ServiceList from './components/ServiceList';
import ProductList from './components/ProductList';
import PaymentMethodList from './components/PaymentMethodList';
import ContactList from './components/ContactList';
import Calendar from './components/Calendar';
import UserManagement from './components/management/UserManagement';
import DepartmentManagement from './components/management/DepartmentManagement';
import SystemSettings from './components/management/SystemSettings';
import InternalChat from './components/InternalChat';
import Integration from './components/Integration';
import AtendenteIA from './components/AtendenteIA';
import SupportChat from './components/SupportChat';

function App() {
  const [activeMenu, setActiveMenu] = useState('chat');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuItems = [
    { id: 'chat', icon: <MessageSquare size={20} />, label: 'Chat' },
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'cadastro', icon: <FileText size={20} />, label: 'Cadastro', 
      submenu: ['Serviços', 'Produtos'] },
    { id: 'financeiro', icon: <DollarSign size={20} />, label: 'Financeiro' },
    { id: 'contatos', icon: <Users size={20} />, label: 'Contatos' },
    { id: 'agenda', icon: <CalendarIcon size={20} />, label: 'Agenda' },
    { id: 'chat-interno', icon: <MessageCircle size={20} />, label: 'Chat Interno' },
    { id: 'integracao', icon: <Link size={20} />, label: 'Integração' },
    { id: 'atendente-ia', icon: <Brain size={20} />, label: 'Atendente IA' },
    { id: 'gerenciamento', icon: <Settings size={20} />, label: 'Gerenciamento',
      submenu: ['Usuários', 'Departamentos', 'Configurações'] },
  ];

  const handleMenuSelect = (menuId: string) => {
    if (activeMenu === menuId) {
      setActiveSubmenu(null);
    } else {
      setActiveMenu(menuId);
      setActiveSubmenu(null);
    }
  };

  const handleSubmenuSelect = (submenuItem: string) => {
    setActiveSubmenu(submenuItem);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        menuItems={menuItems}
        activeMenu={activeMenu}
        onMenuSelect={handleMenuSelect}
        activeSubmenu={activeSubmenu}
        onSubmenuSelect={handleSubmenuSelect}
      />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {activeMenu === 'chat' && <Chat />}
        {activeMenu === 'dashboard' && <Dashboard />}
        {activeMenu === 'cadastro' && activeSubmenu === 'Serviços' && <ServiceList />}
        {activeMenu === 'cadastro' && activeSubmenu === 'Produtos' && <ProductList />}
        {activeMenu === 'financeiro' && <PaymentMethodList />}
        {activeMenu === 'contatos' && <ContactList />}
        {activeMenu === 'agenda' && <Calendar />}
        {activeMenu === 'chat-interno' && <InternalChat />}
        {activeMenu === 'gerenciamento' && activeSubmenu === 'Usuários' && <UserManagement />}
        {activeMenu === 'gerenciamento' && activeSubmenu === 'Departamentos' && <DepartmentManagement />}
        {activeMenu === 'gerenciamento' && activeSubmenu === 'Configurações' && <SystemSettings />}
        {activeMenu === 'integracao' && <Integration />}
        {activeMenu === 'atendente-ia' && <AtendenteIA />}
      </main>

      <SupportChat />
    </div>
  );
}

export default App;