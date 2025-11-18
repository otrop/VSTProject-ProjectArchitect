import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Project, Phase } from '@/types';
import { useProjects } from '@/hooks/useProjects';
import { X } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (project: Project) => void;
}

export default function AddProjectModal({ isOpen, onClose, onSuccess }: AddProjectModalProps) {
  const router = useRouter();
  const { createProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    site: '',
    value: '',
    currency: 'THB',
    startDate: '',
    targetCompletionDate: '',
    architects: '',
    status: 'active' as 'active' | 'completed' | 'on-hold' | 'delivered'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.customer.trim()) newErrors.customer = 'Customer name is required';
    if (!formData.site.trim()) newErrors.site = 'Site location is required';
    if (!formData.value || parseFloat(formData.value) <= 0) newErrors.value = 'Valid project value is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';

    // Validate date order if both dates are provided
    if (formData.startDate && formData.targetCompletionDate) {
      if (new Date(formData.startDate) >= new Date(formData.targetCompletionDate)) {
        newErrors.targetCompletionDate = 'Target date must be after start date';
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
        contractStartDate: formData.startDate,
        contractEndDate: formData.targetCompletionDate || formData.startDate,
        architects: formData.architects.trim() ? formData.architects.split(',').map(a => a.trim()).filter(a => a) : [formData.customer.trim()],
        currentPhase: 1,
        status: formData.status,
        phases: defaultPhases,
        activities: []
      };

      const newProject = createProject(projectData);
      
      if (onSuccess && newProject) {
        onSuccess(newProject);
      }

      // Show success message
      setShowSuccess(true);
      
      // Wait a moment before navigating
      setTimeout(() => {
        // Navigate to the new project
        if (newProject) {
          router.push(`/project/${newProject.id}`);
        }
        onClose();
      }, 800);
      
      // Reset form after navigation
      setTimeout(() => {
        setFormData({
          name: '',
          customer: '',
          site: '',
          value: '',
          currency: 'THB',
          startDate: '',
          targetCompletionDate: '',
          architects: '',
          status: 'active' as 'active' | 'completed' | 'on-hold' | 'delivered'
        });
        setShowSuccess(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: 'Failed to create project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      customer: '',
      site: '',
      value: '',
      currency: 'THB',
      startDate: '',
      targetCompletionDate: '',
      architects: '',
      status: 'active'
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
              <p className="text-sm text-gray-500 mt-1">Enter project details</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6">
            {showSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 animate-fadeIn">
                <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Project created successfully! Redirecting...</span>
              </div>
            )}
            
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-5">
              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="e.g., Luxury Condo Interior - Unit 2301"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Customer Name */}
              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.customer ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="e.g., Sarah Johnson"
                />
                {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer}</p>}
              </div>

              {/* Site Location */}
              <div>
                <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="site"
                  value={formData.site}
                  onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.site ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="e.g., Bangkok, Thailand"
                />
                {errors.site && <p className="mt-1 text-sm text-red-600">{errors.site}</p>}
              </div>

              {/* Project Value and Currency */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.value ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="e.g., 25000000"
                    min="0"
                    step="1000"
                  />
                  {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 bg-white transition-all cursor-pointer"
                  >
                    <option value="THB">THB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              {/* Architects */}
              <div>
                <label htmlFor="architects" className="block text-sm font-medium text-gray-700 mb-1">
                  Architects <span className="text-gray-400 text-xs">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  id="architects"
                  value={formData.architects}
                  onChange={(e) => setFormData({ ...formData, architects: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all"
                  placeholder="e.g., John Smith, Maria Garcia, David Chen"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to use customer name as architect</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>

                {/* Target Completion Date */}
                <div>
                  <label htmlFor="targetCompletionDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    id="targetCompletionDate"
                    value={formData.targetCompletionDate}
                    onChange={(e) => setFormData({ ...formData, targetCompletionDate: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.targetCompletionDate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.targetCompletionDate && <p className="mt-1 text-sm text-red-600">{errors.targetCompletionDate}</p>}
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'on-hold' | 'delivered' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 bg-white transition-all cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || showSuccess}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || showSuccess}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {showSuccess ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Success!
                  </span>
                ) : isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Add Project'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}