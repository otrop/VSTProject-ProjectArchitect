import React, { useState } from 'react';
import { Phase, Task, User } from '@/types';
import { Plus, CheckCircle, Circle, Clock, User as UserIcon, Calendar, AlertCircle } from 'lucide-react';

interface TaskListProps {
  phase: Phase;
  tasks: Task[];
  users: User[];
  onTaskUpdate: (task: Task) => void;
  onAddTask: (taskTitle: string) => void;
}

export default function TaskList({ phase, tasks, users, onTaskUpdate, onAddTask }: TaskListProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setShowAddTask(false);
    }
  };

  const handleTaskStatusChange = (task: Task, newStatus: Task['status']) => {
    const updatedTask = {
      ...task,
      status: newStatus,
      completedDate: newStatus === 'completed' ? new Date().toISOString() : undefined
    };
    onTaskUpdate(updatedTask);
  };

  const handleTaskAssign = (task: Task, assignee: string) => {
    const updatedTask = { ...task, assignee };
    onTaskUpdate(updatedTask);
    setEditingTask(null);
  };

  const handleDueDateChange = (task: Task, dueDate: string) => {
    const updatedTask = { ...task, dueDate };
    onTaskUpdate(updatedTask);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return 'Due yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Tasks - {phase.name}
        </h3>
        <button
          onClick={() => setShowAddTask(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              autoFocus
            />
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddTask(false);
                setNewTaskTitle('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Circle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No tasks in this phase yet.</p>
            <p className="text-sm">Click &quot;Add Task&quot; to create your first task.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              } ${task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed' ? 'border-red-300' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => {
                    const nextStatus = task.status === 'todo' ? 'in-progress' : 
                                    task.status === 'in-progress' ? 'completed' : 'todo';
                    handleTaskStatusChange(task, nextStatus);
                  }}
                  className="mt-0.5 hover:scale-110 transition-transform"
                >
                  {getStatusIcon(task.status)}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h4>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      
                      {task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed' && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-sm">
                      {/* Assignee */}
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        {editingTask === task.id ? (
                          <select
                            value={task.assignee || ''}
                            onChange={(e) => handleTaskAssign(task, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            onBlur={() => setEditingTask(null)}
                            autoFocus
                          >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                              <option key={user.id} value={user.name}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditingTask(task.id)}
                            className="text-gray-600 hover:text-primary-600 transition-colors"
                          >
                            {task.assignee || 'Unassigned'}
                          </button>
                        )}
                      </div>

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={task.dueDate}
                            onChange={(e) => handleDueDateChange(task, e.target.value)}
                            className={`text-sm border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-primary-500 rounded px-1 ${
                              isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600' : 'text-gray-600'
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {task.dueDate && (
                      <div className={`text-xs ${
                        isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-500'
                      }`}>
                        {formatDueDate(task.dueDate)}
                      </div>
                    )}
                  </div>

                  {task.completedDate && (
                    <div className="text-xs text-green-600 mt-2">
                      Completed on {new Date(task.completedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Summary */}
      {tasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Total: {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
            <div className="flex space-x-4">
              <span className="text-green-600">
                {tasks.filter(t => t.status === 'completed').length} completed
              </span>
              <span className="text-blue-600">
                {tasks.filter(t => t.status === 'in-progress').length} in progress
              </span>
              <span className="text-gray-500">
                {tasks.filter(t => t.status === 'todo').length} pending
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}