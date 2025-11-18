import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddProjectModal from './AddProjectModal';

interface AddProjectButtonProps {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function AddProjectButton({ 
  variant = 'primary', 
  size = 'md',
  className = '',
  children 
}: AddProjectButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const baseClasses = 'inline-flex items-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 border border-transparent',
    secondary: 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500 border border-gray-300',
    icon: 'text-blue-600 hover:text-blue-700 focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${variant !== 'icon' ? sizeClasses[size] : 'p-2'} ${className}`;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={buttonClasses}
      >
        <Plus className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />
        {children || (variant !== 'icon' ? 'Add Project' : '')}
      </button>

      <AddProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}