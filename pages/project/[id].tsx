import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Project, Phase, Task, Activity } from '@/types';
import { mockProjects, mockUsers } from '@/data/mockData';
import { useProjects } from '@/hooks/useProjects';
import ProjectHeader from '@/components/ProjectHeader';
import StepTracker from '@/components/StepTracker';
import TaskList from '@/components/TaskList';
import ActivityFeed from '@/components/ActivityFeed';
import ActionButtons from '@/components/ActionButtons';
import EditProjectModal from '@/components/EditProjectModal';
import { ChevronLeft, Home, Building } from 'lucide-react';
import QuickNav from '@/components/QuickNav';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { projects, updateProject } = useProjects();
  
  const [project, setProject] = useState<Project | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string' && projects.length > 0) {
      const foundProject = projects.find(p => p.id === id);
      if (foundProject) {
        setProject(foundProject);
      } else {
        // If project not found, redirect to projects list
        router.push('/projects');
      }
    }
  }, [id, router, projects]);

  useEffect(() => {
    if (project) {
      // Set initial selected phase to current phase
      const currentPhase = project.phases.find(phase => phase.order === project.currentPhase);
      if (currentPhase) {
        setSelectedPhase(currentPhase);
      }
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  const handlePhaseSelect = (phase: Phase) => {
    setSelectedPhase(phase);
  };

  const handlePhaseToggle = (phaseId: string) => {
    setProject(prev => prev ? ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId
          ? { ...phase, isExpanded: !phase.isExpanded }
          : phase
      )
    }) : null);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setProject(prev => prev ? ({
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
    }) : null);

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

    setProject(prev => prev ? ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50) // Keep only last 50
    }) : null);
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

    setProject(prev => prev ? ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId
          ? { ...phase, tasks: [...phase.tasks, newTask] }
          : phase
      )
    }) : null);

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

    setProject(prev => prev ? ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50)
    }) : null);
  };

  const handleMovePhase = (direction: 'forward' | 'backward') => {
    const newCurrentPhase = direction === 'forward' 
      ? Math.min(project.currentPhase + 1, project.phases.length)
      : Math.max(project.currentPhase - 1, 1);

    setProject(prev => prev ? ({
      ...prev,
      currentPhase: newCurrentPhase
    }) : null);

    // Add activity
    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: 'phase_moved',
      description: `Project phase moved ${direction}`,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      projectId: project.id
    };

    setProject(prev => prev ? ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50)
    }) : null);
  };

  const handleMarkDelivered = () => {
    setProject(prev => prev ? ({
      ...prev,
      status: 'delivered'
    }) : null);

    // Add activity
    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: 'project_delivered',
      description: 'Project marked as delivered',
      timestamp: new Date().toISOString(),
      user: 'Current User',
      projectId: project.id
    };

    setProject(prev => prev ? ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 50)
    }) : null);
  };

  const handleSaveProject = (updatedProject: Project) => {
    setProject(updatedProject);
    updateProject(updatedProject);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <span className="text-gray-900 font-medium">{project.name}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        {/* Project Header */}
        <ProjectHeader project={project} onEdit={() => setIsEditModalOpen(true)} />

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

        {/* Quick Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Quick Navigation</h3>
              <div className="flex items-center space-x-3">
                {mockProjects.filter(p => p.id !== project.id).slice(0, 3).map(otherProject => (
                  <Link
                    key={otherProject.id}
                    href={`/project/${otherProject.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {otherProject.name}
                  </Link>
                ))}
                <Link
                  href="/projects"
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  View All Projects →
                </Link>
              </div>
            </div>
          </div>
        </div>

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

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSave={handleSaveProject}
      />
      
      {/* Quick Navigation */}
      <QuickNav currentPage="project-detail" />
    </div>
  );
}