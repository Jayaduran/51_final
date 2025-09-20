import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Factory, 
  ClipboardList, 
  Settings,
  FileText, 
  Package, 
  PackageSearch,
  BarChart3,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NavItem = ({ to, icon: Icon, label, isOpen, exact = false }: any) => (
  <NavLink
    to={to}
    end={exact}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600 font-semibold'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      } ${!isOpen ? 'justify-center' : ''}`
    }
  >
    <Icon className="h-5 w-5 flex-shrink-0" />
    {isOpen && <span className="text-sm">{label}</span>}
  </NavLink>
);

const NavHeader = ({ label }: { label: string }) => (
  <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
    {label}
  </h3>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menu = {
    operations: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { to: '/dashboard/manufacturing-orders', icon: Factory, label: 'Manufacturing Orders' },
      { to: '/dashboard/work-orders', icon: ClipboardList, label: 'Work Orders' },
      { to: '/dashboard/work-centers', icon: Settings, label: 'Work Centers' },
    ],
    inventory: [
      { to: '/dashboard/stock-ledger', icon: Package, label: 'Stock Ledger' },
      { to: '/dashboard/bom', icon: FileText, label: 'Bill of Materials' },
      { to: '/dashboard/product-master', icon: PackageSearch, label: 'Product Master' },
    ],
    analytics: [
      { to: '/dashboard/reports', icon: BarChart3, label: 'Reports & Analytics' },
    ],
    admin: [
      { to: '/dashboard/user-management', icon: Users, label: 'User Management' },
    ]
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Header */}
      <div className={`flex items-center p-4 border-b border-gray-200 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Factory className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Manufacture</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        {isOpen && <NavHeader label="Operations" />}
        {menu.operations.map(item => <NavItem key={item.to} {...item} isOpen={isOpen} />)}

        {isOpen && <NavHeader label="Inventory" />}
        {menu.inventory.map(item => <NavItem key={item.to} {...item} isOpen={isOpen} />)}
        
        {isOpen && <NavHeader label="Analytics" />}
        {menu.analytics.map(item => <NavItem key={item.to} {...item} isOpen={isOpen} />)}

        {isOpen && <NavHeader label="Admin" />}
        {menu.admin.map(item => <NavItem key={item.to} {...item} isOpen={isOpen} />)}
      </nav>
    </div>
  );
};

export default Sidebar;
