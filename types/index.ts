export interface Project {
  id: string;
  projectNumber?: string;
  name: string;
  customerName: string;
  siteName: string;
  projectValue: number;
  currency: string;
  contractDate: string;
  contractDeliveryDate: string;
  targetCompletionDate?: string;
  projectArchitect: string;
  designConsultant?: string;
  architects: string[];
  currentPhase: number;
  status: 'active' | 'completed' | 'on-hold' | 'delivered' | 'draft';
  phases: Phase[];
  activities: Activity[];
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'not-started' | 'in-progress' | 'completed';
  startDate?: string;
  endDate?: string;
  tasks: Task[];
  isExpanded?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: string;
  createdDate: string;
  completedDate?: string;
  phaseId: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  user: string;
  projectId: string;
  relatedTaskId?: string;
  relatedPhaseId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type PhaseStatus = 'not-started' | 'in-progress' | 'completed';
export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'delivered' | 'draft';
export type ActivityType = 'task_created' | 'task_completed' | 'task_assigned' | 'phase_started' | 'phase_completed' | 'project_delivered' | 'phase_moved' | 'project_created' | 'project_deleted';
export type Priority = 'low' | 'medium' | 'high';