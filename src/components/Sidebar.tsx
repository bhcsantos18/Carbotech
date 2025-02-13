import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  submenu?: string[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeMenu: string;
  onMenuSelect: (menuId: string) => void;
  activeSubmenu: string | null;
  onSubmenuSelect: (submenu: string) => void;
}

interface BrandSettings {
  name: string;
  logoUrl: string;
  sidebarColor: string;
}

const loadBrandSettings = (): BrandSettings => {
  const saved = localStorage.getItem('brandSettings');
  return saved ? JSON.parse(saved) : {
    name: 'Carbotech',
    logoUrl: '',
    sidebarColor: '#0d0764'
  };
};

const Sidebar: React.FC<SidebarProps> = ({ 
  menuItems, 
  activeMenu, 
  onMenuSelect,
  activeSubmenu,
  onSubmenuSelect
}) => {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(loadBrandSettings());

  useEffect(() => {
    const handleBrandSettingsChange = () => {
      setBrandSettings(loadBrandSettings());
    };

    window.addEventListener('storage', handleBrandSettingsChange);
    return () => window.removeEventListener('storage', handleBrandSettingsChange);
  }, []);

  return (
    <aside 
      className="w-[70px] hover:w-64 group transition-all duration-300 ease-in-out text-white h-screen flex flex-col"
      style={{ backgroundColor: brandSettings.sidebarColor }}
    >
      <div className="p-4 flex items-center overflow-hidden">
        {brandSettings.logoUrl ? (
          <img
            src={brandSettings.logoUrl}
            alt={brandSettings.name}
            className="h-8 w-8 object-contain"
          />
        ) : null}
        <h1 className="text-xl font-bold truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
          {brandSettings.name}
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id} className="relative">
            <button
              onClick={() => onMenuSelect(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm transition-all duration-200
                ${activeMenu === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="min-w-[24px]">{item.icon}</span>
              <span className="ml-3 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.label}
              </span>
              {item.submenu && (
                <ChevronDown 
                  size={16} 
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                />
              )}
            </button>
            
            {item.submenu && activeMenu === item.id && (
              <div className="overflow-hidden" style={{ backgroundColor: `${brandSettings.sidebarColor}ee` }}>
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem}
                    onClick={() => onSubmenuSelect(subItem)}
                    className={`w-full text-left pl-12 pr-4 py-2 text-sm transition-colors duration-200
                      ${activeSubmenu === subItem
                        ? 'text-white bg-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {subItem}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Profile section at bottom */}
      <div className="p-4 border-t border-white/10 flex items-center overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-sm">U</span>
        </div>
        <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-sm font-medium">Usuário</div>
          <div className="text-xs text-white/70">Online</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;