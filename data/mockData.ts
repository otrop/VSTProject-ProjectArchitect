import { Project, Activity } from '@/types';

export const mockProject: Project = {
  id: 'proj-001',
  name: 'Luxury Resort Development',
  customer: 'Paradise Hotels Group',
  site: 'Phuket, Thailand',
  value: 25000000,
  currency: 'THB',
  contractStartDate: '2024-01-15',
  contractEndDate: '2025-12-31',
  architects: ['John Smith', 'Maria Garcia', 'David Chen'],
  currentPhase: 2,
  status: 'active',
  phases: [
    {
      id: 'phase-001',
      name: 'Project Initiation',
      description: 'Initial planning and requirements gathering',
      order: 1,
      status: 'completed',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      tasks: [
        {
          id: 'task-001',
          title: 'Site Survey',
          description: 'Conduct comprehensive site analysis',
          status: 'completed',
          assignee: 'John Smith',
          dueDate: '2024-02-01',
          createdDate: '2024-01-15',
          completedDate: '2024-01-30',
          phaseId: 'phase-001',
          priority: 'high'
        },
        {
          id: 'task-002',
          title: 'Requirements Documentation',
          description: 'Document all project requirements',
          status: 'completed',
          assignee: 'Maria Garcia',
          dueDate: '2024-02-15',
          createdDate: '2024-01-20',
          completedDate: '2024-02-10',
          phaseId: 'phase-001',
          priority: 'medium'
        }
      ],
      isExpanded: false
    },
    {
      id: 'phase-002',
      name: 'Design Phase',
      description: 'Architectural design and planning',
      order: 2,
      status: 'in-progress',
      startDate: '2024-03-16',
      tasks: [
        {
          id: 'task-003',
          title: 'Conceptual Design',
          description: 'Create initial design concepts',
          status: 'completed',
          assignee: 'David Chen',
          dueDate: '2024-04-15',
          createdDate: '2024-03-16',
          completedDate: '2024-04-10',
          phaseId: 'phase-002',
          priority: 'high'
        },
        {
          id: 'task-004',
          title: 'Detailed Drawings',
          description: 'Develop detailed architectural drawings',
          status: 'in-progress',
          assignee: 'John Smith',
          dueDate: '2024-05-30',
          createdDate: '2024-04-01',
          phaseId: 'phase-002',
          priority: 'high'
        },
        {
          id: 'task-005',
          title: 'Engineering Coordination',
          description: 'Coordinate with engineering teams',
          status: 'todo',
          assignee: 'Maria Garcia',
          dueDate: '2024-06-15',
          createdDate: '2024-04-15',
          phaseId: 'phase-002',
          priority: 'medium'
        }
      ],
      isExpanded: true
    },
    {
      id: 'phase-003',
      name: 'Permit & Approval',
      description: 'Obtain necessary permits and approvals',
      order: 3,
      status: 'not-started',
      tasks: [
        {
          id: 'task-006',
          title: 'Building Permit Application',
          description: 'Submit building permit application',
          status: 'todo',
          dueDate: '2024-07-01',
          createdDate: '2024-05-01',
          phaseId: 'phase-003',
          priority: 'high'
        }
      ],
      isExpanded: false
    },
    {
      id: 'phase-004',
      name: 'Construction',
      description: 'Construction and implementation',
      order: 4,
      status: 'not-started',
      tasks: [],
      isExpanded: false
    },
    {
      id: 'phase-005',
      name: 'Final Delivery',
      description: 'Project completion and handover',
      order: 5,
      status: 'not-started',
      tasks: [],
      isExpanded: false
    }
  ],
  activities: [
    {
      id: 'act-001',
      type: 'task_completed',
      description: 'Task "Conceptual Design" was completed by David Chen',
      timestamp: '2024-04-10T14:30:00Z',
      user: 'David Chen',
      projectId: 'proj-001',
      relatedTaskId: 'task-003'
    },
    {
      id: 'act-002',
      type: 'task_assigned',
      description: 'Task "Engineering Coordination" was assigned to Maria Garcia',
      timestamp: '2024-04-15T09:15:00Z',
      user: 'John Smith',
      projectId: 'proj-001',
      relatedTaskId: 'task-005'
    },
    {
      id: 'act-003',
      type: 'phase_started',
      description: 'Design Phase was started',
      timestamp: '2024-03-16T08:00:00Z',
      user: 'John Smith',
      projectId: 'proj-001',
      relatedPhaseId: 'phase-002'
    }
  ]
};

export const mockUsers = [
  { id: 'user-001', name: 'John Smith', email: 'john.smith@company.com', role: 'Lead Architect' },
  { id: 'user-002', name: 'Maria Garcia', email: 'maria.garcia@company.com', role: 'Project Manager' },
  { id: 'user-003', name: 'David Chen', email: 'david.chen@company.com', role: 'Design Architect' },
  { id: 'user-004', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Senior Architect' },
  { id: 'user-005', name: 'Michael Brown', email: 'michael.brown@company.com', role: 'Project Coordinator' }
];

export const mockProjects: Project[] = [
  mockProject,
  {
    id: 'proj-002',
    name: 'Urban Office Complex',
    customer: 'Metro Business Group',
    site: 'Bangkok, Thailand',
    value: 45000000,
    currency: 'THB',
    contractStartDate: '2024-06-01',
    contractEndDate: '2025-11-30',
    architects: ['Sarah Johnson', 'Michael Brown'],
    currentPhase: 1,
    status: 'active',
    phases: [
      {
        id: 'phase-2-1',
        name: 'Project Initiation',
        description: 'Initial planning and requirements gathering',
        order: 1,
        status: 'in-progress',
        startDate: '2024-06-01',
        tasks: [
          {
            id: 'task-011',
            title: 'Feasibility Study',
            description: 'Assess project viability',
            status: 'in-progress',
            assignee: 'Sarah Johnson',
            dueDate: '2024-11-22',
            createdDate: '2024-06-01',
            phaseId: 'phase-2-1',
            priority: 'high'
          },
          {
            id: 'task-012',
            title: 'Budget Planning',
            description: 'Detailed cost analysis',
            status: 'todo',
            assignee: 'Michael Brown',
            dueDate: '2024-11-20',
            createdDate: '2024-06-05',
            phaseId: 'phase-2-1',
            priority: 'medium'
          }
        ],
        isExpanded: false
      },
      {
        id: 'phase-2-2',
        name: 'Design Phase',
        description: 'Architectural design and planning',
        order: 2,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-2-3',
        name: 'Permit & Approval',
        description: 'Obtain necessary permits and approvals',
        order: 3,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-2-4',
        name: 'Construction',
        description: 'Construction and implementation',
        order: 4,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-2-5',
        name: 'Final Delivery',
        description: 'Project completion and handover',
        order: 5,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      }
    ],
    activities: []
  },
  {
    id: 'proj-003',
    name: 'Luxury Resort Development',
    customer: 'Paradise Hotels Group',
    site: 'Phuket, Thailand',
    value: 25000000,
    currency: 'THB',
    contractStartDate: '2024-09-01',
    contractEndDate: '2026-06-30',
    architects: ['John Smith', 'Maria Garcia', 'David Chen'],
    currentPhase: 2,
    status: 'active',
    phases: [
      {
        id: 'phase-3-1',
        name: 'Project Initiation',
        description: 'Initial planning and requirements gathering',
        order: 1,
        status: 'completed',
        startDate: '2024-09-01',
        endDate: '2024-10-15',
        tasks: [
          {
            id: 'task-3-1',
            title: 'Site Survey',
            description: 'Complete site analysis',
            status: 'completed',
            assignee: 'John Smith',
            dueDate: '2024-09-20',
            createdDate: '2024-09-01',
            completedDate: '2024-09-18',
            phaseId: 'phase-3-1',
            priority: 'high'
          }
        ],
        isExpanded: false
      },
      {
        id: 'phase-3-2',
        name: 'Design Phase',
        description: 'Architectural design and planning',
        order: 2,
        status: 'in-progress',
        startDate: '2024-10-16',
        tasks: [
          {
            id: 'task-3-2',
            title: 'Master Plan Design',
            description: 'Create resort master plan',
            status: 'in-progress',
            assignee: 'Maria Garcia',
            dueDate: '2024-11-30',
            createdDate: '2024-10-16',
            phaseId: 'phase-3-2',
            priority: 'high'
          },
          {
            id: 'task-3-3',
            title: 'Villa Design',
            description: 'Design individual villa units',
            status: 'todo',
            assignee: 'David Chen',
            dueDate: '2024-12-15',
            createdDate: '2024-10-20',
            phaseId: 'phase-3-2',
            priority: 'medium'
          }
        ],
        isExpanded: false
      },
      {
        id: 'phase-3-3',
        name: 'Permit & Approval',
        description: 'Obtain necessary permits and approvals',
        order: 3,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-3-4',
        name: 'Construction',
        description: 'Construction and implementation',
        order: 4,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-3-5',
        name: 'Final Delivery',
        description: 'Project completion and handover',
        order: 5,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      }
    ],
    activities: []
  },
  {
    id: 'proj-004',
    name: 'Shopping Mall Renovation',
    customer: 'Retail Excellence Ltd.',
    site: 'Pattaya, Thailand',
    value: 18000000,
    currency: 'THB',
    contractStartDate: '2024-01-15',
    contractEndDate: '2024-12-31',
    architects: ['Maria Garcia', 'Sarah Johnson'],
    currentPhase: 4,
    status: 'active',
    phases: [
      {
        id: 'phase-4-1',
        name: 'Project Initiation',
        description: 'Initial planning and requirements gathering',
        order: 1,
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-02-28',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-4-2',
        name: 'Design Phase',
        description: 'Architectural design and planning',
        order: 2,
        status: 'completed',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-4-3',
        name: 'Permit & Approval',
        description: 'Obtain necessary permits and approvals',
        order: 3,
        status: 'completed',
        startDate: '2024-06-01',
        endDate: '2024-07-31',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-4-4',
        name: 'Construction',
        description: 'Construction and implementation',
        order: 4,
        status: 'in-progress',
        startDate: '2024-08-01',
        tasks: [
          {
            id: 'task-4-1',
            title: 'Demolition Work',
            description: 'Remove old fixtures and fittings',
            status: 'completed',
            assignee: 'Maria Garcia',
            dueDate: '2024-09-15',
            createdDate: '2024-08-01',
            completedDate: '2024-09-10',
            phaseId: 'phase-4-4',
            priority: 'high'
          },
          {
            id: 'task-4-2',
            title: 'Structural Renovation',
            description: 'Reinforce structural elements',
            status: 'in-progress',
            assignee: 'Sarah Johnson',
            dueDate: '2024-11-25',
            createdDate: '2024-09-15',
            phaseId: 'phase-4-4',
            priority: 'high'
          },
          {
            id: 'task-4-3',
            title: 'Interior Fit-out',
            description: 'Complete interior finishing',
            status: 'todo',
            assignee: 'Maria Garcia',
            dueDate: '2024-12-20',
            createdDate: '2024-10-01',
            phaseId: 'phase-4-4',
            priority: 'medium'
          }
        ],
        isExpanded: false
      },
      {
        id: 'phase-4-5',
        name: 'Final Delivery',
        description: 'Project completion and handover',
        order: 5,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      }
    ],
    activities: []
  },
  {
    id: 'proj-005',
    name: 'Corporate Headquarters',
    customer: 'TechCorp International',
    site: 'Bangkok, Thailand',
    value: 85000000,
    currency: 'THB',
    contractStartDate: '2023-01-01',
    contractEndDate: '2024-10-31',
    architects: ['John Smith', 'Sarah Johnson', 'David Chen'],
    currentPhase: 5,
    status: 'delivered',
    phases: [
      {
        id: 'phase-5-1',
        name: 'Project Initiation',
        description: 'Initial planning and requirements gathering',
        order: 1,
        status: 'completed',
        startDate: '2023-01-01',
        endDate: '2023-03-31',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-5-2',
        name: 'Design Phase',
        description: 'Architectural design and planning',
        order: 2,
        status: 'completed',
        startDate: '2023-04-01',
        endDate: '2023-08-31',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-5-3',
        name: 'Permit & Approval',
        description: 'Obtain necessary permits and approvals',
        order: 3,
        status: 'completed',
        startDate: '2023-09-01',
        endDate: '2023-11-30',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-5-4',
        name: 'Construction',
        description: 'Construction and implementation',
        order: 4,
        status: 'completed',
        startDate: '2023-12-01',
        endDate: '2024-09-30',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-5-5',
        name: 'Final Delivery',
        description: 'Project completion and handover',
        order: 5,
        status: 'completed',
        startDate: '2024-10-01',
        endDate: '2024-10-31',
        tasks: [],
        isExpanded: false
      }
    ],
    activities: []
  },
  {
    id: 'proj-006',
    name: 'Boutique Hotel Interior',
    customer: 'Elegant Stays Ltd.',
    site: 'Koh Samui, Thailand',
    value: 12500000,
    currency: 'THB',
    contractStartDate: '2024-10-01',
    contractEndDate: '2025-06-30',
    architects: ['David Chen', 'Michael Brown'],
    currentPhase: 1,
    status: 'active',
    phases: [
      {
        id: 'phase-6-1',
        name: 'Project Initiation',
        description: 'Initial planning and requirements gathering',
        order: 1,
        status: 'in-progress',
        startDate: '2024-10-01',
        tasks: [
          {
            id: 'task-6-1',
            title: 'Client Requirements Gathering',
            description: 'Document all client requirements',
            status: 'in-progress',
            assignee: 'David Chen',
            dueDate: '2024-11-19',
            createdDate: '2024-10-01',
            phaseId: 'phase-6-1',
            priority: 'high'
          },
          {
            id: 'task-6-2',
            title: 'Space Planning',
            description: 'Create preliminary space allocation plan',
            status: 'todo',
            assignee: 'Michael Brown',
            dueDate: '2024-11-28',
            createdDate: '2024-10-10',
            phaseId: 'phase-6-1',
            priority: 'medium'
          }
        ],
        isExpanded: false
      },
      {
        id: 'phase-6-2',
        name: 'Design Phase',
        description: 'Architectural design and planning',
        order: 2,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-6-3',
        name: 'Permit & Approval',
        description: 'Obtain necessary permits and approvals',
        order: 3,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-6-4',
        name: 'Construction',
        description: 'Construction and implementation',
        order: 4,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-6-5',
        name: 'Final Delivery',
        description: 'Project completion and handover',
        order: 5,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      }
    ],
    activities: []
  },
  {
    id: 'proj-007',
    name: 'Modern Condominium Tower',
    customer: 'Skyline Developers',
    site: 'Chiang Mai, Thailand',
    value: 52000000,
    currency: 'THB',
    contractStartDate: '2024-05-01',
    contractEndDate: '2026-04-30',
    architects: ['John Smith', 'Maria Garcia'],
    currentPhase: 2,
    status: 'active',
    phases: [
      {
        id: 'phase-7-1',
        name: 'Project Initiation',
        description: 'Initial planning and requirements gathering',
        order: 1,
        status: 'completed',
        startDate: '2024-05-01',
        endDate: '2024-06-30',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-7-2',
        name: 'Design Phase',
        description: 'Architectural design and planning',
        order: 2,
        status: 'in-progress',
        startDate: '2024-07-01',
        tasks: [
          {
            id: 'task-7-1',
            title: 'Tower Design',
            description: 'Design main tower structure',
            status: 'in-progress',
            assignee: 'John Smith',
            dueDate: '2024-11-30',
            createdDate: '2024-07-01',
            phaseId: 'phase-7-2',
            priority: 'high'
          },
          {
            id: 'task-7-2',
            title: 'Unit Layout Plans',
            description: 'Create detailed unit floor plans',
            status: 'in-progress',
            assignee: 'Maria Garcia',
            dueDate: '2024-12-15',
            createdDate: '2024-07-15',
            phaseId: 'phase-7-2',
            priority: 'high'
          },
          {
            id: 'task-7-3',
            title: 'Amenities Design',
            description: 'Design common area amenities',
            status: 'todo',
            assignee: 'John Smith',
            dueDate: '2025-01-15',
            createdDate: '2024-08-01',
            phaseId: 'phase-7-2',
            priority: 'medium'
          }
        ],
        isExpanded: false
      },
      {
        id: 'phase-7-3',
        name: 'Permit & Approval',
        description: 'Obtain necessary permits and approvals',
        order: 3,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-7-4',
        name: 'Construction',
        description: 'Construction and implementation',
        order: 4,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-7-5',
        name: 'Final Delivery',
        description: 'Project completion and handover',
        order: 5,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      }
    ],
    activities: []
  },
  {
    id: 'proj-008',
    name: 'Community Recreation Center',
    customer: 'Municipal Development Board',
    site: 'Hua Hin, Thailand',
    value: 8500000,
    currency: 'THB',
    contractStartDate: '2024-02-01',
    contractEndDate: '2024-12-31',
    architects: ['Sarah Johnson'],
    currentPhase: 3,
    status: 'active',
    phases: [
      {
        id: 'phase-8-1',
        name: 'Project Initiation',
        description: 'Initial planning and requirements gathering',
        order: 1,
        status: 'completed',
        startDate: '2024-02-01',
        endDate: '2024-03-15',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-8-2',
        name: 'Design Phase',
        description: 'Architectural design and planning',
        order: 2,
        status: 'completed',
        startDate: '2024-03-16',
        endDate: '2024-06-30',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-8-3',
        name: 'Permit & Approval',
        description: 'Obtain necessary permits and approvals',
        order: 3,
        status: 'in-progress',
        startDate: '2024-07-01',
        tasks: [
          {
            id: 'task-8-1',
            title: 'Building Permit Submission',
            description: 'Submit to local authority',
            status: 'completed',
            assignee: 'Sarah Johnson',
            dueDate: '2024-08-15',
            createdDate: '2024-07-01',
            completedDate: '2024-08-10',
            phaseId: 'phase-8-3',
            priority: 'high'
          },
          {
            id: 'task-8-2',
            title: 'Fire Safety Approval',
            description: 'Obtain fire department approval',
            status: 'in-progress',
            assignee: 'Sarah Johnson',
            dueDate: '2024-11-22',
            createdDate: '2024-08-15',
            phaseId: 'phase-8-3',
            priority: 'high'
          }
        ],
        isExpanded: false
      },
      {
        id: 'phase-8-4',
        name: 'Construction',
        description: 'Construction and implementation',
        order: 4,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-8-5',
        name: 'Final Delivery',
        description: 'Project completion and handover',
        order: 5,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      }
    ],
    activities: []
  }
];