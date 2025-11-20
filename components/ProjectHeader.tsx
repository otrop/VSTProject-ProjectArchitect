import React from 'react';
import { Project } from '@/types';
import { Calendar, MapPin, Users, DollarSign, Edit } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
  onEdit?: () => void;
}

export default function ProjectHeader({ project, onEdit }: ProjectHeaderProps) {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Details
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 lg:mt-0 lg:ml-6">
          <div className="text-2xl font-bold text-primary-600">
            {formatCurrency(project.projectValue, project.currency)}
          </div>
          <div className="text-sm text-gray-500">Project Value</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customer */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Customer</dt>
            <dd className="text-sm font-semibold text-gray-900">{project.customerName}</dd>
          </div>
        </div>

        {/* Site */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Site Location</dt>
            <dd className="text-sm font-semibold text-gray-900">{project.siteName}</dd>
          </div>
        </div>

        {/* Contract Dates */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Contract Period</dt>
            <dd className="text-sm font-semibold text-gray-900">
              {formatDate(project.contractDate)} - {formatDate(project.contractDeliveryDate)}
            </dd>
          </div>
        </div>

        {/* Architects */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Architects</dt>
            <dd className="text-sm font-semibold text-gray-900">
              <div className="space-y-1">
                {project.architects.map((architect, index) => (
                  <div key={index}>{architect}</div>
                ))}
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}