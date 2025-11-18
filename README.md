# Project Architect - Comprehensive Project Management System

A modern, full-featured project management webapp built with Next.js 14, TypeScript, and Tailwind CSS, specifically designed for architectural and construction project management with enterprise-grade features and intuitive user experience.

## 🎯 Overview

Project Architect provides a complete project management solution with three main interfaces:
- **Dashboard**: Executive overview with KPIs, active projects, and task management
- **Projects List**: Comprehensive project catalog with advanced filtering and bulk operations  
- **Project Details**: In-depth project management with phase tracking and task coordination

## ✨ Core Features

### 🏠 **Dashboard Page**
- **KPI Overview**: Real-time metrics including active projects, total value, completion rates, and project distribution
- **Active Projects Summary**: Quick access to current projects with status indicators and key metrics
- **Task Management**: Upcoming tasks (next 7 days) and overdue tasks with priority indicators
- **Project Phase Distribution**: Visual breakdown of projects by current phase
- **Smart Navigation**: Clickable project names and task cards linking to detailed views
- **Activity Timeline**: Recent project activities with user attribution and timestamps

### 📋 **Projects List Page**  
- **Advanced Filtering**: Filter by project phase, architect, status, and custom search terms
- **Bulk Operations**: Select multiple projects for batch phase changes and actions
- **CSV Export**: Export filtered or selected projects with full project data
- **Sorting & Pagination**: Sort by name, customer, value, or phase with paginated results
- **Quick Actions**: View, edit, and manage projects directly from the list
- **Smart Search**: Real-time search across project names, customers, and locations

### 🏗️ **Project Detail Page**
- **Comprehensive Project Header**: Customer info, site location, project value, contract dates, and team assignments
- **Interactive Phase Tracker**: Visual progress through 5 project phases with expandable details
- **Task Management**: Phase-specific task lists with assignments, due dates, and priority levels
- **Activity Feed**: Real-time activity log with 50+ activity types and user tracking
- **Smart Navigation**: Breadcrumb navigation, back buttons, and quick project switching
- **Action Controls**: Phase navigation, task creation, and project status management

### 🎨 **Enhanced User Experience**
- **Custom AP Font Family**: Professional typography with 8 font variants (Light, Regular, Medium, Bold + Italics)
- **QuickNav Component**: Floating action button for instant navigation and quick actions
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Hover Effects**: Subtle animations and visual feedback throughout the interface
- **Loading States**: Proper hydration handling and loading indicators for optimal UX
- **Error Handling**: Graceful error states and user-friendly error messages

### 🔧 **Technical Excellence**
- **TypeScript**: Full type safety with comprehensive interfaces and type definitions
- **React Hooks**: Custom hooks for state management and data persistence
- **localStorage Integration**: Client-side data persistence with hydration-safe loading
- **ESLint Compliance**: Clean, maintainable code following best practices
- **Build Optimization**: Optimized production builds with code splitting and performance monitoring

## 🛠 Tech Stack

- **Framework**: Next.js 14 with Page Router architecture
- **Language**: TypeScript 5+ for complete type safety
- **Styling**: Tailwind CSS 3+ with custom design system
- **Icons**: Lucide React for consistent, scalable iconography
- **State Management**: React Hooks with custom useProjects hook
- **Data Persistence**: localStorage with SSR-safe hydration patterns
- **Build Tools**: ESLint, TypeScript compiler, Next.js build optimization

## 📁 Project Structure

```
VSTProject-ProjectArchitect/
├── components/                 # Reusable UI components
│   ├── ProjectHeader.tsx      # Project information header with status
│   ├── StepTracker.tsx        # Interactive phase tracking component
│   ├── TaskList.tsx           # Task management with CRUD operations
│   ├── ActivityFeed.tsx       # Real-time activity timeline
│   ├── ActionButtons.tsx      # Project action controls
│   ├── Navigation.tsx         # Main navigation component
│   └── QuickNav.tsx          # Floating quick navigation menu
├── pages/                     # Next.js page routes
│   ├── _app.tsx              # App configuration with custom fonts
│   ├── dashboard.tsx         # Executive dashboard with KPIs
│   ├── projects.tsx          # Projects list with filtering
│   ├── project/
│   │   └── [id].tsx         # Dynamic project detail pages
│   └── index.tsx            # Landing page
├── hooks/                    # Custom React hooks
│   └── useProjects.ts       # Project data management hook
├── data/                     # Data layer
│   └── mockData.ts          # Sample project and user data
├── types/                    # TypeScript definitions
│   └── index.ts             # Complete type system
├── styles/                   # Styling configuration
│   └── globals.css          # Tailwind CSS and custom styles
├── public/                   # Static assets
│   └── fonts/               # AP font family files
│       ├── AP-Light.woff2
│       ├── AP-Regular.woff2
│       ├── AP-Medium.woff2
│       └── AP-Bold.woff2
└── tailwind.config.js       # Tailwind configuration with custom fonts
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or later (LTS recommended)
- **npm** 8+ or **yarn** 1.22+
- Modern web browser with ES2020+ support

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd VSTProject-ProjectArchitect
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Start development server:**
```bash
npm run dev
# or
yarn dev
```

4. **Open application:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - If port 3000 is busy, Next.js will automatically use port 3001

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📖 Usage Guide

### 🏠 **Dashboard Navigation**
- **Overview**: View KPI cards showing active projects, total value, and completion metrics
- **Active Projects**: Click any project name to navigate to detailed project view
- **Task Management**: Click project names in task cards to jump to specific projects
- **Quick Actions**: Use the floating QuickNav button for instant navigation

### 📋 **Projects Management**
- **Filtering**: Use search bar and filter dropdowns to find specific projects
- **Bulk Operations**: Select multiple projects using checkboxes for batch actions
- **Export Data**: Export filtered or selected projects to CSV format
- **Navigation**: Click project names or eye icons to view detailed project information
- **Sorting**: Click column headers to sort by name, customer, value, or phase

### 🏗️ **Project Detail Operations**
- **Phase Navigation**: Use breadcrumb navigation or back button for easy navigation
- **Phase Tracking**: Click phases in the tracker to expand and view phase-specific tasks
- **Task Management**: 
  - Add tasks using the "Add Task" button
  - Change task status by clicking checkboxes (todo → in-progress → completed)
  - Assign tasks by selecting team members from dropdowns
  - Set due dates and priority levels
- **Project Actions**: Use action buttons to move between phases or mark project as delivered
- **Activity Monitoring**: View real-time activity feed showing all project changes

### 🎯 **Navigation Features**
- **QuickNav Menu**: Floating action button available on all pages for quick navigation
- **Smart Links**: Project names throughout the app link to detailed project views
- **Breadcrumbs**: Clear navigation path showing current location in the app
- **Back Navigation**: Browser-aware back buttons that preserve your navigation history

## 📊 Data Architecture

### Core Entities

**Project Entity**
```typescript
interface Project {
  id: string;
  name: string;
  customer: string;
  site: string;
  value: number;
  currency: string;
  contractStartDate: string;
  contractEndDate: string;
  architects: string[];
  currentPhase: number;
  status: 'active' | 'completed' | 'on-hold' | 'delivered';
  phases: Phase[];
  activities: Activity[];
}
```

**Phase Management**
- 5 standardized phases: Project Initiation → Design Phase → Permit & Approval → Construction → Final Delivery
- Expandable phase details with task lists and completion tracking
- Status indicators for not-started, in-progress, and completed phases

**Task System**
- Comprehensive task properties including assignments, due dates, and priorities
- Status workflow: todo → in-progress → completed
- Priority levels: low, medium, high with visual indicators

**Activity Logging**
- 9 activity types: task operations, phase transitions, project lifecycle events
- Real-time activity feed with user attribution and timestamps
- Activity persistence with localStorage integration

## 🔧 Customization & Extension

### **Adding New Features**

**Activity Types**
```typescript
// Add to types/index.ts
export type ActivityType = 
  | 'task_created' | 'task_completed' | 'task_assigned'
  | 'phase_started' | 'phase_completed' | 'project_delivered'
  | 'phase_moved' | 'project_created' | 'project_deleted'
  | 'your_new_activity_type'; // Add your custom types here
```

**Custom Task Properties**
```typescript
// Extend Task interface in types/index.ts
export interface Task {
  // ... existing properties
  customField?: string;
  metadata?: Record<string, any>;
}
```

**Phase Customization**
- Modify phase names in the `phaseNames` array across components
- Add custom phase properties to the `Phase` interface
- Update phase icons and colors in `StepTracker.tsx`

### **Styling Customization**
- **Fonts**: Replace AP font files in `public/fonts/` and update `tailwind.config.js`
- **Colors**: Modify the color palette in `tailwind.config.js` under the `colors` section
- **Components**: Update component styles using Tailwind CSS classes

## 🚀 Future Roadmap

### **Phase 2 - Backend Integration**
- [ ] REST API with Node.js/Express or Next.js API routes
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Real-time updates with WebSocket/Server-Sent Events

### **Phase 3 - Advanced Features**
- [ ] File upload and document management
- [ ] Gantt chart visualization with timeline management
- [ ] Advanced reporting and analytics dashboard
- [ ] Team collaboration features (comments, mentions, notifications)
- [ ] Email notifications and automated alerts
- [ ] Mobile app (React Native/PWA)

### **Phase 4 - Enterprise Features**
- [ ] Multi-tenant architecture
- [ ] Advanced user roles and permissions
- [ ] Integration with external tools (CAD software, accounting systems)
- [ ] API for third-party integrations
- [ ] Advanced project templates and workflows
- [ ] Time tracking and resource management

## 🤝 Contributing

We welcome contributions to Project Architect! Here's how to get started:

### **Development Workflow**
1. **Fork** the repository and clone your fork
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Install** dependencies: `npm install`
4. **Make** your changes following our coding standards
5. **Test** your changes: `npm run build` and `npm run dev`
6. **Commit** with descriptive messages: `git commit -m 'Add: amazing new feature'`
7. **Push** to your fork: `git push origin feature/amazing-feature`
8. **Submit** a Pull Request with a clear description

### **Code Standards**
- Follow TypeScript best practices with strict type checking
- Use ESLint rules defined in the project
- Maintain consistent code formatting
- Write descriptive commit messages
- Update documentation for new features

### **Bug Reports**
- Use the issue template to report bugs
- Include steps to reproduce the issue
- Provide screenshots or error messages when applicable
- Specify your environment (OS, browser, Node.js version)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the incredible React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon library
- **TypeScript** team for making JavaScript development more reliable

---

**Built with ❤️ for architectural project management**

For questions, suggestions, or support, please open an issue or reach out to the development team.