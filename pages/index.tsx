import React, { useState, useEffect } from 'react';
import { Project, Phase, Task, Activity } from '@/types';
import { mockProject, mockUsers } from '@/data/mockData';
import ProjectHeader from '@/components/ProjectHeader';
import StepTracker from '@/components/StepTracker';
import TaskList from '@/components/TaskList';
import ActivityFeed from '@/components/ActivityFeed';
import ActionButtons from '@/components/ActionButtons';

export default function ProjectDetail() {
  const [project, setProject] = useState<Project>(mockProject);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  useEffect(() => {
    // Set initial selected phase to current phase
    const currentPhase = project.phases.find(phase => phase.order === project.currentPhase);
    if (currentPhase) {
      setSelectedPhase(currentPhase);
    }
  }, [project.currentPhase, project.phases]);

  const handlePhaseSelect = (phase: Phase) => {
    setSelectedPhase(phase);
  };

  const handlePhaseToggle = (phaseId: string) => {
    setProject(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId
          ? { ...phase, isExpanded: !phase.isExpanded }
          : phase
      )
    }));
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setProject(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === updatedTask.phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
              )
            }
          : phase
      )
    }));

    // Add activity for task update
    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: updatedTask.status === 'completed' ? 'task_completed' : 'task_assigned',
      description: `Task "${updatedTask.title}" was ${updatedTask.status === 'completed' ? 'completed' : 'updated'}`,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      projectId: project.id,
      relatedTaskId: updatedTask.id
    };

    setProject(prev => ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50) // Keep only last 50
    }));
  };

  const handleAddTask = (phaseId: string, taskTitle: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: '',
      status: 'todo',
      createdDate: new Date().toISOString(),
      phaseId,
      priority: 'medium'
    };

    setProject(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId
          ? { ...phase, tasks: [...phase.tasks, newTask] }
          : phase
      )
    }));

    // Add activity
    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: 'task_created',
      description: `New task "${taskTitle}" was created`,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      projectId: project.id,
      relatedTaskId: newTask.id
    };

    setProject(prev => ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50)
    }));
  };

  const handleMovePhase = (direction: 'forward' | 'backward') => {
    const newCurrentPhase = direction === 'forward' 
      ? Math.min(project.currentPhase + 1, project.phases.length)
      : Math.max(project.currentPhase - 1, 1);

    setProject(prev => ({
      ...prev,
      currentPhase: newCurrentPhase
    }));

    // Add activity
    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: 'phase_moved',
      description: `Project phase moved ${direction}`,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      projectId: project.id
    };

    setProject(prev => ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50)
    }));
  };

  const handleMarkDelivered = () => {
    setProject(prev => ({
      ...prev,
      status: 'delivered'
    }));

    // Add activity
    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: 'project_delivered',
      description: 'Project marked as delivered',
      timestamp: new Date().toISOString(),
      user: 'Current User',
      projectId: project.id
    };

    setProject(prev => ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <ProjectHeader project={project} />

        {/* Action Buttons */}
        <ActionButtons
          project={project}
          onMovePhase={handleMovePhase}
          onMarkDelivered={handleMarkDelivered}
          onAddTask={() => {
            const currentPhase = project.phases.find(p => p.order === project.currentPhase);
            if (currentPhase) {
              handleAddTask(currentPhase.id, `New Task ${currentPhase.tasks.length + 1}`);
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Step Tracker */}
          <div className="lg:col-span-2">
            <StepTracker
              phases={project.phases}
              currentPhase={project.currentPhase}
              onPhaseSelect={handlePhaseSelect}
              onPhaseToggle={handlePhaseToggle}
            />

            {/* Task List for Selected Phase */}
            {selectedPhase && (
              <div className="mt-8">
                <TaskList
                  phase={selectedPhase}
                  tasks={selectedPhase.tasks}
                  users={mockUsers}
                  onTaskUpdate={handleTaskUpdate}
                  onAddTask={(taskTitle) => handleAddTask(selectedPhase.id, taskTitle)}
                />
              </div>
            )}
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed activities={project.activities} />
          </div>
        </div>
      </div>
    </div>
  );
}