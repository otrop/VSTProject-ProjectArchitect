import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import { Project, Task } from '@/types';
import QuickNav from '@/components/QuickNav';
import AddProjectButton from '@/components/AddProjectButton';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Building, 
  DollarSign,
  ArrowRight,
  Users,
  TrendingUp,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { projects, activities, loading, isClient } = useProjects();

  // Show loading while hydrating
  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Calculate KPIs
  const activeProjects = projects.filter((p: Project) => p.status === 'active');
  const totalValue = projects.reduce((sum: number, p: Project) => sum + p.value, 0);
  
  const projectsByPhase = {
    'Project Initiation': projects.filter((p: Project) => p.currentPhase === 1).length,
    'Design Phase': projects.filter((p: Project) => p.currentPhase === 2).length,
    'Permit & Approval': projects.filter((p: Project) => p.currentPhase === 3).length,
    'Construction': projects.filter((p: Project) => p.currentPhase === 4).length,
    'Final Delivery': projects.filter((p: Project) => p.currentPhase === 5).length,
  };

  // Get all tasks from active projects
  const allTasks: (Task & { projectName: string; projectId: string })[] = [];
  activeProjects.forEach((project: Project) => {
    project.phases.forEach(phase => {
      phase.tasks.forEach(task => {
        allTasks.push({ ...task, projectName: project.name, projectId: project.id });
      });
    });
  });

  // Calculate upcoming and overdue tasks
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);

  const upcomingTasks = allTasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= now && dueDate <= sevenDaysFromNow;
  });

  const overdueTasks = allTasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < now;
  });

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-ap font-bold text-gray-900 tracking-tight">Project Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Overview of your active projects and upcoming tasks
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/projects"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Building className="w-4 h-4 mr-2" />
                All Projects
              </Link>
              <AddProjectButton variant="primary" className="shadow-sm">
                New Project
              </AddProjectButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Projects */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
                <p className="text-2xl font-semibold text-gray-900">{activeProjects.length}</p>
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Project Value</h3>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalValue, 'THB')}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Due Next 7 Days</h3>
                <p className="text-2xl font-semibold text-gray-900">{upcomingTasks.length}</p>
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Overdue Tasks</h3>
                <p className="text-2xl font-semibold text-gray-900">{overdueTasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects by Phase */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Projects by Phase</h3>
              <div className="space-y-4">
                {Object.entries(projectsByPhase).map(([phase, count]) => (
                  <div key={phase} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        phase === 'Project Initiation' ? 'bg-blue-500' :
                        phase === 'Design Phase' ? 'bg-purple-500' :
                        phase === 'Permit & Approval' ? 'bg-yellow-500' :
                        phase === 'Construction' ? 'bg-orange-500' :
                        'bg-green-500'
                      }`} />
                      <span className="text-sm text-gray-700">{phase}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Projects Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
                <Link 
                  href="/projects"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all projects →
                </Link>
              </div>
              <div className="space-y-4">
                {activeProjects.slice(0, 3).map((project: Project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link 
                          href={`/project/${project.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary-600"
                        >
                          {project.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">
                          {project.customer} • {project.site}
                        </p>
                        <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                          <span>Phase {project.currentPhase}/5</span>
                          <span>{formatCurrency(project.value, project.currency)}</span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {project.architects.length}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            {upcomingTasks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Upcoming Tasks (Next 7 Days)
                </h3>
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <Link 
                          href={`/project/${task.projectId}`}
                          className="text-xs text-gray-600 hover:text-primary-600 hover:underline font-medium"
                        >
                          {task.projectName}
                        </Link>
                        {task.assignee && (
                          <p className="text-xs text-gray-500 mt-1">Assigned to {task.assignee}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-yellow-700 font-medium">
                          {task.dueDate && formatDate(task.dueDate)}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  Overdue Tasks
                </h3>
                <div className="space-y-3">
                  {overdueTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <Link 
                          href={`/project/${task.projectId}`}
                          className="text-xs text-gray-600 hover:text-primary-600 hover:underline font-medium"
                        >
                          {task.projectName}
                        </Link>
                        {task.assignee && (
                          <p className="text-xs text-gray-500 mt-1">Assigned to {task.assignee}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-red-700 font-medium">
                          {task.dueDate && formatDate(task.dueDate)}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Navigation */}
      <QuickNav currentPage="dashboard" />
    </div>
  );
}