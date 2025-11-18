import React from 'react';
import { Project } from '@/types';
import { Plus, ArrowLeft, ArrowRight, Package, Play, Pause } from 'lucide-react';

interface ActionButtonsProps {
  project: Project;
  onMovePhase: (direction: 'forward' | 'backward') => void;
  onMarkDelivered: () => void;
  onAddTask: () => void;
}

export default function ActionButtons({ 
  project, 
  onMovePhase, 
  onMarkDelivered, 
  onAddTask 
}: ActionButtonsProps) {
  const canMoveBackward = project.currentPhase > 1;
  const canMoveForward = project.currentPhase < project.phases.length;
  const canDeliver = project.status !== 'delivered' && project.currentPhase === project.phases.length;
  const isActive = project.status === 'active';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Actions</h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          disabled={!isActive}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
            isActive
              ? 'text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>

        {/* Phase Navigation Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onMovePhase('backward')}
            disabled={!canMoveBackward || !isActive}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
              canMoveBackward && isActive
                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Phase
          </button>

          <button
            onClick={() => onMovePhase('forward')}
            disabled={!canMoveForward || !isActive}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
              canMoveForward && isActive
                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Next Phase
          </button>
        </div>

        {/* Mark as Delivered Button */}
        <button
          onClick={onMarkDelivered}
          disabled={!canDeliver}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
            canDeliver
              ? 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
        >
          <Package className="w-4 h-4 mr-2" />
          Mark as Delivered
        </button>

        {/* Project Status Toggle */}
        {project.status !== 'delivered' && (
          <button
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
              project.status === 'active'
                ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            {project.status === 'active' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Put on Hold
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume Project
              </>
            )}
          </button>
        )}
      </div>

      {/* Action Hints */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Add Task:</strong> Create a new task in the current phase</li>
          <li>• <strong>Phase Navigation:</strong> Move between project phases</li>
          <li>• <strong>Mark as Delivered:</strong> Complete the project (available when all phases are done)</li>
        </ul>
      </div>

      {/* Current Status Display */}
      <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
        <div>
          <span className="text-sm font-medium text-blue-900">Current Status:</span>
          <span className="ml-2 text-sm text-blue-700">
            Phase {project.currentPhase} of {project.phases.length} - {project.phases[project.currentPhase - 1]?.name}
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          project.status === 'active' ? 'bg-green-100 text-green-800' :
          project.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
          project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {project.status.replace('-', ' ').toUpperCase()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Project Progress</span>
          <span>{Math.round((project.currentPhase / project.phases.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(project.currentPhase / project.phases.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}