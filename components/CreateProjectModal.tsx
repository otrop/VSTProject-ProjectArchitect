import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Project, Phase } from '@/types';
import { useProjects } from '@/hooks/useProjects';
import { X, Building, User, DollarSign, Calendar, MapPin, Plus } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (project: Project) => void;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const router = useRouter();
  const { createProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    site: '',
    value: '',
    currency: 'USD',
    contractStartDate: '',
    contractEndDate: '',
    architects: [''],
    status: 'active' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.customer.trim()) newErrors.customer = 'Customer is required';
    if (!formData.site.trim()) newErrors.site = 'Site location is required';
    if (!formData.value || parseFloat(formData.value) <= 0) newErrors.value = 'Valid project value is required';
    if (!formData.contractStartDate) newErrors.contractStartDate = 'Contract start date is required';
    if (!formData.contractEndDate) newErrors.contractEndDate = 'Contract end date is required';
    if (formData.architects.filter(arch => arch.trim()).length === 0) {
      newErrors.architects = 'At least one architect is required';
    }

    // Validate date order
    if (formData.contractStartDate && formData.contractEndDate) {
      if (new Date(formData.contractStartDate) >= new Date(formData.contractEndDate)) {
        newErrors.contractEndDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Create the default phases for a new project
      const defaultPhases: Phase[] = [
        {
          id: 'phase-1',
          name: 'Project Initiation',
          description: 'Initial project setup and planning',
          order: 1,
          status: 'not-started',
          tasks: [],
          isExpanded: false
        },
        {
          id: 'phase-2',
          name: 'Design Phase',
          description: 'Architectural design and documentation',
          order: 2,
          status: 'not-started',
          tasks: [],
          isExpanded: false
        },
        {
          id: 'phase-3',
          name: 'Permit & Approval',
          description: 'Regulatory approvals and permits',
          order: 3,
          status: 'not-started',
          tasks: [],
          isExpanded: false
        },
        {
          id: 'phase-4',
          name: 'Construction',
          description: 'Construction and implementation',
          order: 4,
          status: 'not-started',
          tasks: [],
          isExpanded: false
        },
        {
          id: 'phase-5',
          name: 'Final Delivery',
          description: 'Project completion and handover',
          order: 5,
          status: 'not-started',
          tasks: [],
          isExpanded: false
        }
      ];

      const projectData = {
        name: formData.name.trim(),
        customer: formData.customer.trim(),
        site: formData.site.trim(),
        value: parseFloat(formData.value),
        currency: formData.currency,
        contractStartDate: formData.contractStartDate,
        contractEndDate: formData.contractEndDate,
        architects: formData.architects.filter(arch => arch.trim()).map(arch => arch.trim()),
        currentPhase: 1,
        status: formData.status,
        phases: defaultPhases,
        activities: []
      };

      const newProject = createProject(projectData);
      
      if (onSuccess && newProject) {
        onSuccess(newProject);
      }

      // Navigate to the new project
      if (newProject) {
        router.push(`/project/${newProject.id}`);
      }

      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: 'Failed to create project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchitectChange = (index: number, value: string) => {
    const newArchitects = [...formData.architects];
    newArchitects[index] = value;
    setFormData({ ...formData, architects: newArchitects });
  };

  const addArchitect = () => {
    setFormData({ ...formData, architects: [...formData.architects, ''] });
  };

  const removeArchitect = (index: number) => {
    if (formData.architects.length > 1) {
      const newArchitects = formData.architects.filter((_, i) => i !== index);
      setFormData({ ...formData, architects: newArchitects });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Building className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter project name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Customer */}
              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Customer *
                </label>
                <input
                  type="text"
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.customer ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer name"
                />
                {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer}</p>}
              </div>

              {/* Site Location */}
              <div>
                <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Site Location *
                </label>
                <input
                  type="text"
                  id="site"
                  value={formData.site}
                  onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.site ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter site location"
                />
                {errors.site && <p className="mt-1 text-sm text-red-600">{errors.site}</p>}
              </div>

              {/* Project Value */}
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Project Value *
                </label>
                <input
                  type="number"
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.value ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter project value"
                  min="0"
                  step="0.01"
                />
                {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
              </div>

              {/* Currency */}
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="THB">THB (฿)</option>
                </select>
              </div>

              {/* Contract Start Date */}
              <div>
                <label htmlFor="contractStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Contract Start Date *
                </label>
                <input
                  type="date"
                  id="contractStartDate"
                  value={formData.contractStartDate}
                  onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.contractStartDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.contractStartDate && <p className="mt-1 text-sm text-red-600">{errors.contractStartDate}</p>}
              </div>

              {/* Contract End Date */}
              <div>
                <label htmlFor="contractEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Contract End Date *
                </label>
                <input
                  type="date"
                  id="contractEndDate"
                  value={formData.contractEndDate}
                  onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.contractEndDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.contractEndDate && <p className="mt-1 text-sm text-red-600">{errors.contractEndDate}</p>}
              </div>

              {/* Architects */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Architects *
                </label>
                <div className="space-y-2">
                  {formData.architects.map((architect, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={architect}
                        onChange={(e) => handleArchitectChange(index, e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.architects ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter architect name"
                      />
                      {formData.architects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArchitect(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addArchitect}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Another Architect
                  </button>
                </div>
                {errors.architects && <p className="mt-1 text-sm text-red-600">{errors.architects}</p>}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}