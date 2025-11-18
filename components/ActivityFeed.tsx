import React from 'react';
import { Activity } from '@/types';
import { Clock, CheckCircle, User, Settings, ArrowRight, Package } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_created':
        return <Settings className="w-4 h-4 text-blue-600" />;
      case 'task_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'task_assigned':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'phase_started':
        return <ArrowRight className="w-4 h-4 text-blue-600" />;
      case 'phase_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'project_delivered':
        return <Package className="w-4 h-4 text-purple-600" />;
      case 'project_created':
        return <Package className="w-4 h-4 text-green-600" />;
      case 'project_deleted':
        return <Package className="w-4 h-4 text-red-600" />;
      case 'phase_moved':
        return <ArrowRight className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'task_created':
        return 'bg-blue-50 border-blue-200';
      case 'task_completed':
        return 'bg-green-50 border-green-200';
      case 'task_assigned':
        return 'bg-purple-50 border-purple-200';
      case 'phase_started':
        return 'bg-blue-50 border-blue-200';
      case 'phase_completed':
        return 'bg-green-50 border-green-200';
      case 'project_delivered':
        return 'bg-purple-50 border-purple-200';
      case 'project_created':
        return 'bg-green-50 border-green-200';
      case 'project_deleted':
        return 'bg-red-50 border-red-200';
      case 'phase_moved':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: activityTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatFullDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedActivities = [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-sm text-gray-500">Last 50 activities</span>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No recent activity</p>
          <p className="text-sm">Activities will appear here as work progresses.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
          {sortedActivities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline connector */}
              {index < sortedActivities.length - 1 && (
                <div className="absolute left-5 top-10 w-0.5 h-6 bg-gray-200" />
              )}
              
              <div className={`relative flex items-start space-x-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-white border-2 border-current rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          by {activity.user}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span 
                          className="text-xs text-gray-500 cursor-help" 
                          title={formatFullDate(activity.timestamp)}
                        >
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Summary */}
      {sortedActivities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {sortedActivities.filter(a => a.type.includes('task')).length}
              </div>
              <div className="text-gray-500">Task Activities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {sortedActivities.filter(a => a.type.includes('phase') || a.type === 'project_delivered').length}
              </div>
              <div className="text-gray-500">Project Activities</div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Filters - Future Enhancement */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
          All
        </button>
        <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          Tasks
        </button>
        <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          Phases
        </button>
      </div>
    </div>
  );
}