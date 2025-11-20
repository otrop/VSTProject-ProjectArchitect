import React, { useState } from 'react';
import { Project } from '@/types';
import { X } from 'lucide-react';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSave: (updatedProject: Project) => void;
}

export default function EditProjectModal({ isOpen, onClose, project, onSave }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: project.name || '',
    customerName: project.customerName || '',
    siteName: project.siteName || '',
    projectValue: project.projectValue?.toString() || '0',
    currency: project.currency || 'THB',
    contractDate: project.contractDate || '',
    contractDeliveryDate: project.contractDeliveryDate || '',
    architects: project.architects?.join(', ') || '',
    status: project.status || 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.siteName.trim()) newErrors.siteName = 'Site location is required';
    if (!formData.projectValue || parseFloat(formData.projectValue) <= 0) newErrors.projectValue = 'Valid project value is required';
    if (!formData.contractDate) newErrors.contractDate = 'Contract date is required';
    if (!formData.contractDeliveryDate) newErrors.contractDeliveryDate = 'Delivery date is required';

    // Validate date order
    if (formData.contractDate && formData.contractDeliveryDate) {
      if (new Date(formData.contractDate) >= new Date(formData.contractDeliveryDate)) {
        newErrors.contractDeliveryDate = 'Delivery date must be after contract date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);

    const updatedProject: Project = {
      ...project,
      name: formData.name.trim(),
      customerName: formData.customerName.trim(),
      siteName: formData.siteName.trim(),
      projectValue: parseFloat(formData.projectValue),
      currency: formData.currency,
      contractDate: formData.contractDate,
      contractDeliveryDate: formData.contractDeliveryDate,
      architects: formData.architects.trim() 
        ? formData.architects.split(',').map(a => a.trim()).filter(a => a) 
        : [formData.customerName.trim()],
      status: formData.status as 'active' | 'completed' | 'on-hold' | 'delivered'
    };

    onSave(updatedProject);
    setIsSaving(false);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: project.name || '',
      customerName: project.customerName || '',
      siteName: project.siteName || '',
      projectValue: project.projectValue?.toString() || '0',
      currency: project.currency || 'THB',
      contractDate: project.contractDate || '',
      contractDeliveryDate: project.contractDeliveryDate || '',
      architects: project.architects?.join(', ') || '',
      status: project.status || 'active'
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
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Project Details</h2>
              <p className="text-sm text-gray-500 mt-1">Update project information</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-5 mt-4">
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
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.customerName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="e.g., Sarah Johnson"
                />
                {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
              </div>

              {/* Site Location */}
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.siteName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="e.g., Bangkok, Thailand"
                />
                {errors.siteName && <p className="mt-1 text-sm text-red-600">{errors.siteName}</p>}
              </div>

              {/* Project Value and Currency */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="projectValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="projectValue"
                    value={formData.projectValue}
                    onChange={(e) => setFormData({ ...formData, projectValue: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.projectValue ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="e.g., 25000000"
                    min="0"
                    step="1000"
                  />
                  {errors.projectValue && <p className="mt-1 text-sm text-red-600">{errors.projectValue}</p>}
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
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contractDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="contractDate"
                    value={formData.contractDate}
                    onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.contractDate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.contractDate && <p className="mt-1 text-sm text-red-600">{errors.contractDate}</p>}
                </div>

                <div>
                  <label htmlFor="contractDeliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="contractDeliveryDate"
                    value={formData.contractDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, contractDeliveryDate: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.contractDeliveryDate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.contractDeliveryDate && <p className="mt-1 text-sm text-red-600">{errors.contractDeliveryDate}</p>}
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'on-hold' | 'delivered' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 bg-white transition-all cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
