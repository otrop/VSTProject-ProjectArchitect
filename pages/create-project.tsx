import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Project, Phase } from '@/types';
import { useProjects } from '@/hooks/useProjects';
import QuickNav from '@/components/QuickNav';
import { 
  Building, 
  User, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Plus, 
  X, 
  ChevronLeft,
  Home,
  Save,
  FileText
} from 'lucide-react';

export default function CreateProject() {
  const router = useRouter();
  const { createProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    customer: '',
    site: '',
    description: '',
    
    // Financial Info  
    value: '',
    currency: 'USD',
    contractStartDate: '',
    contractEndDate: '',
    
    // Team & Status
    architects: [''],
    status: 'active' as 'active' | 'completed' | 'on-hold' | 'delivered',
    
    // Additional Details
    projectType: 'commercial',
    estimatedDuration: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Project name is required';
      if (!formData.customer.trim()) newErrors.customer = 'Customer is required';
      if (!formData.site.trim()) newErrors.site = 'Site location is required';
    }

    if (step === 2) {
      if (!formData.value || parseFloat(formData.value) <= 0) newErrors.value = 'Valid project value is required';
      if (!formData.contractStartDate) newErrors.contractStartDate = 'Contract start date is required';
      if (!formData.contractEndDate) newErrors.contractEndDate = 'Contract end date is required';
      
      if (formData.contractStartDate && formData.contractEndDate) {
        if (new Date(formData.contractStartDate) >= new Date(formData.contractEndDate)) {
          newErrors.contractEndDate = 'End date must be after start date';
        }
      }
    }

    if (step === 3) {
      if (formData.architects.filter(arch => arch.trim()).length === 0) {
        newErrors.architects = 'At least one architect is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    let isValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        isValid = false;
      }
    }

    if (!isValid) {
      setCurrentStep(1); // Go to first error
      return;
    }

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
      
      // Navigate to the new project
      if (newProject) {
        router.push(`/project/${newProject.id}`);
      }
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2 text-primary-600" />
              Basic Project Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.site ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter site location"
                />
                {errors.site && <p className="mt-1 text-sm text-red-600">{errors.site}</p>}
              </div>

              {/* Project Type */}
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="industrial">Industrial</option>
                  <option value="institutional">Institutional</option>
                  <option value="mixed-use">Mixed Use</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Project Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the project objectives and scope"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
              Financial & Timeline Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Value */}
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Value *
                </label>
                <input
                  type="number"
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.contractEndDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.contractEndDate && <p className="mt-1 text-sm text-red-600">{errors.contractEndDate}</p>}
              </div>

              {/* Estimated Duration */}
              <div className="md:col-span-2">
                <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration (months)
                </label>
                <input
                  type="number"
                  id="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Estimated project duration"
                  min="1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Team & Additional Details
            </h3>

            <div className="space-y-6">
              {/* Architects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Architects *
                </label>
                <div className="space-y-3">
                  {formData.architects.map((architect, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={architect}
                        onChange={(e) => handleArchitectChange(index, e.target.value)}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.architects ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter architect name"
                      />
                      {formData.architects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArchitect(index)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addArchitect}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Another Architect
                  </button>
                </div>
                {errors.architects && <p className="mt-1 text-sm text-red-600">{errors.architects}</p>}
              </div>

              {/* Project Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Project Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'on-hold' | 'delivered' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any additional notes or special requirements"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="flex items-center hover:text-primary-600 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/projects" className="flex items-center hover:text-primary-600 transition-colors">
            <Building className="w-4 h-4 mr-1" />
            Projects
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Create New Project</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-ap font-bold text-gray-900 tracking-tight">Create New Project</h1>
              <p className="mt-1 text-lg text-gray-500">
                Set up a new architectural project with phases and team assignments
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step === currentStep
                      ? 'bg-primary-600 text-white'
                      : step < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Financial & Timeline</span>
            <span>Team & Details</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {errors.submit}
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Next
                  <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating Project...' : 'Create Project'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Quick Navigation */}
      <QuickNav />
    </div>
  );
}