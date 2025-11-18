import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Home, Building, User, Menu, X } from 'lucide-react';
import AddProjectModal from './AddProjectModal';

interface QuickNavProps {
  currentPage?: 'dashboard' | 'projects' | 'project-detail';
}

export default function QuickNav({ currentPage }: QuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      active: currentPage === 'dashboard'
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Building,
      active: currentPage === 'projects'
    }
  ];

  return (
    <>
      {/* Quick Nav Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            isOpen 
              ? 'bg-red-600 hover:bg-red-700 rotate-180' 
              : 'bg-primary-600 hover:bg-primary-700'
          } text-white focus:outline-none focus:ring-4 focus:ring-primary-200`}
        >
          {isOpen ? (
            <X className="w-6 h-6 mx-auto" />
          ) : (
            <Menu className="w-6 h-6 mx-auto" />
          )}
        </button>

        {/* Quick Nav Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-48">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                      item.active
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              
              <hr className="my-2 border-gray-200" />
              
              {/* Quick Actions */}
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Quick Actions
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowCreateModal(true);
                  }}
                  className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </button>
                <Link
                  href="/create-project"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Detailed Setup
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Team Members
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}