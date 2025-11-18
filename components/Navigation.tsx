import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Building, BarChart3, Layers } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3
    },
    {
      name: 'Projects',
      href: '/projects', 
      icon: Building
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Building className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-ap font-medium text-gray-900 tracking-wide">Project Architect</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}