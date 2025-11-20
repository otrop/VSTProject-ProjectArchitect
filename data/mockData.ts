import { Project, Activity } from '@/types';



export const mockUsers = [
  { id: 'user-001', name: 'John Smith', email: 'john.smith@company.com', role: 'Lead Architect' },
  { id: 'user-002', name: 'Maria Garcia', email: 'maria.garcia@company.com', role: 'Project Manager' },
  { id: 'user-003', name: 'David Chen', email: 'david.chen@company.com', role: 'Design Architect' },
  { id: 'user-004', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Senior Architect' },
  { id: 'user-005', name: 'Michael Brown', email: 'michael.brown@company.com', role: 'Project Coordinator' }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-202500001',
    projectNumber: '202500001',
    name: 'Aspire Onnut Station',
    customerName: 'ณัฏฐ์ปริยา ปราชญ์นคร',
    siteName: 'Aspire Onnut Station',
    projectValue: 212124,
    currency: 'THB',
    contractDate: '2025-10-01',
    contractDeliveryDate: '2025-12-30',
    targetCompletionDate: '2025-12-12',
    projectArchitect: 'ณัฏฐ์ปริยา ปราชญ์นคร',
    designConsultant: 'Bangkok Design Co.',
    architects: ['Worapha Paksookchai', 'Pailin Khwansuksri'],
    currentPhase: 1,
    status: 'active',
    phases: [
      {
        id: 'phase-asp-1',
        name: 'Project Initiation',
        description: 'Initial planning and requirements gathering',
        order: 1,
        status: 'in-progress',
        startDate: '2025-10-01',
        tasks: [
          {
            id: 'task-asp-1',
            title: 'Initial Site Survey',
            description: 'Conduct site analysis for Aspire Onnut Station',
            status: 'in-progress',
            assignee: 'Worapha Paksookchai',
            dueDate: '2025-10-15',
            createdDate: '2025-10-01',
            phaseId: 'phase-asp-1',
            priority: 'high'
          }
        ],
        isExpanded: false
      },
      {
        id: 'phase-asp-2',
        name: 'Design Phase',
        description: 'Architectural design and planning',
        order: 2,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-asp-3',
        name: 'Permit & Approval',
        description: 'Obtain necessary permits and approvals',
        order: 3,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-asp-4',
        name: 'Construction',
        description: 'Construction and implementation',
        order: 4,
        status: 'not-started',
        tasks: [],
        isExpanded: false
      },
      {
        id: 'phase-asp-5',
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
        id: 'act-asp-1',
        type: 'project_created',
        description: 'Project "Aspire Onnut Station" was created',
        timestamp: '2025-10-01T08:00:00Z',
        user: 'Worapha Paksookchai',
        projectId: 'proj-202500001'
      }
    ]
  },
];

