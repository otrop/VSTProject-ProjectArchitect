import React from 'react';
import { Phase } from '@/types';
import { ChevronDown, ChevronRight, CheckCircle, Circle, Clock } from 'lucide-react';

interface StepTrackerProps {
  phases: Phase[];
  currentPhase: number;
  onPhaseSelect: (phase: Phase) => void;
  onPhaseToggle: (phaseId: string) => void;
}

export default function StepTracker({ phases, currentPhase, onPhaseSelect, onPhaseToggle }: StepTrackerProps) {
  const getPhaseIcon = (phase: Phase, isCurrent: boolean) => {
    if (phase.status === 'completed') {
      return <CheckCircle className="w-8 h-8 text-green-600" />;
    } else if (isCurrent) {
      return <Clock className="w-8 h-8 text-blue-600" />;
    } else {
      return <Circle className="w-8 h-8 text-gray-400" />;
    }
  };

  const getPhaseStatus = (phase: Phase, isCurrent: boolean) => {
    if (phase.status === 'completed') return 'Completed';
    if (isCurrent) return 'In Progress';
    return 'Not Started';
  };

  const getPhaseStatusColor = (phase: Phase, isCurrent: boolean) => {
    if (phase.status === 'completed') return 'text-green-600';
    if (isCurrent) return 'text-blue-600';
    return 'text-gray-500';
  };

  const getConnectorColor = (index: number) => {
    const phase = phases[index];
    const isCurrent = phase.order === currentPhase;
    const isCompleted = phase.status === 'completed';
    
    if (isCompleted || isCurrent) return 'bg-blue-600';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Phases</h2>
      
      {/* Horizontal Step Tracker */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-8">
          {phases.map((phase, index) => {
            const isCurrent = phase.order === currentPhase;
            const isClickable = true;
            
            return (
              <div key={phase.id} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <button
                    onClick={() => onPhaseSelect(phase)}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                      isClickable ? 'hover:scale-105' : 'cursor-default'
                    }`}
                    disabled={!isClickable}
                  >
                    <div className={`relative ${isCurrent ? 'animate-pulse' : ''}`}>
                      {getPhaseIcon(phase, isCurrent)}
                    </div>
                    <div className="mt-2 text-center max-w-24">
                      <div className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-900'}`}>
                        {phase.name}
                      </div>
                      <div className={`text-xs ${getPhaseStatusColor(phase, isCurrent)}`}>
                        {getPhaseStatus(phase, isCurrent)}
                      </div>
                    </div>
                  </button>
                  
                  {/* Connector Line */}
                  {index < phases.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className={`h-1 rounded-full ${getConnectorColor(index)}`} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical Step Tracker for Mobile */}
      <div className="lg:hidden space-y-4">
        {phases.map((phase, index) => {
          const isCurrent = phase.order === currentPhase;
          
          return (
            <div key={phase.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className={`relative ${isCurrent ? 'animate-pulse' : ''}`}>
                  {getPhaseIcon(phase, isCurrent)}
                </div>
                {index < phases.length - 1 && (
                  <div className={`w-0.5 h-16 mt-2 ${getConnectorColor(index)}`} />
                )}
              </div>
              
              <button
                onClick={() => onPhaseSelect(phase)}
                className="flex-1 text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className={`font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-900'}`}>
                  {phase.name}
                </div>
                <div className={`text-sm ${getPhaseStatusColor(phase, isCurrent)}`}>
                  {getPhaseStatus(phase, isCurrent)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {phase.description}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Expandable Phase Details */}
      <div className="mt-8 space-y-4">
        {phases.map((phase) => (
          <div key={phase.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onPhaseToggle(phase.id)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getPhaseIcon(phase, phase.order === currentPhase)}
                <div className="text-left">
                  <div className="font-medium text-gray-900">{phase.name}</div>
                  <div className="text-sm text-gray-500">{phase.tasks.length} tasks</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getPhaseStatusColor(phase, phase.order === currentPhase)}`}>
                  {getPhaseStatus(phase, phase.order === currentPhase)}
                </span>
                {phase.isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            
            {phase.isExpanded && (
              <div className="p-4 bg-white border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                
                {phase.startDate && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Start: </span>
                      <span className="text-gray-900">{new Date(phase.startDate).toLocaleDateString()}</span>
                    </div>
                    {phase.endDate && (
                      <div>
                        <span className="text-gray-500">End: </span>
                        <span className="text-gray-900">{new Date(phase.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {phase.tasks.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Tasks Overview:</div>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-600">
                        ✓ {phase.tasks.filter(t => t.status === 'completed').length} completed
                      </span>
                      <span className="text-blue-600">
                        ⟳ {phase.tasks.filter(t => t.status === 'in-progress').length} in progress
                      </span>
                      <span className="text-gray-500">
                        ◯ {phase.tasks.filter(t => t.status === 'todo').length} pending
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}