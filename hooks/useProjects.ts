import { useState, useEffect } from 'react';
import { Project, Activity } from '@/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issue by ensuring client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Dynamic import to avoid SSR issues
        const { mockProjects } = await import('@/data/mockData');
        
        // Migration function to convert old field names to new ones
        const migrateProject = (project: any): Project => {
          return {
            ...project,
            customerName: project.customerName || project.customer || '',
            siteName: project.siteName || project.site || '',
            projectValue: project.projectValue || project.value || 0,
            contractDate: project.contractDate || project.contractStartDate || '',
            contractDeliveryDate: project.contractDeliveryDate || project.contractEndDate || '',
            projectArchitect: project.projectArchitect || project.architects?.[0] || '',
            designConsultant: project.designConsultant || project.architects?.[1] || undefined,
          };
        };
        
        // Check localStorage only on client side
        const storedProjects = typeof window !== 'undefined' 
          ? localStorage.getItem('projectarchitect_projects')
          : null;
        
        const storedActivities = typeof window !== 'undefined'
          ? localStorage.getItem('projectarchitect_activities')
          : null;

        let projectsToLoad = mockProjects;
        
        if (storedProjects) {
          try {
            const parsed = JSON.parse(storedProjects);
            // Only use stored data if it's an array with at least one project
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Migrate old data format to new format
              projectsToLoad = parsed.map(migrateProject);
              // Save migrated data back to localStorage
              localStorage.setItem('projectarchitect_projects', JSON.stringify(projectsToLoad));
            } else {
              // If stored data is empty or invalid, use mock data and save it
              console.log('Stored projects empty or invalid, loading mock data');
              projectsToLoad = mockProjects;
              localStorage.setItem('projectarchitect_projects', JSON.stringify(mockProjects));
            }
          } catch (parseError) {
            // If JSON parse fails, use mock data
            console.error('Failed to parse stored projects:', parseError);
            projectsToLoad = mockProjects;
            localStorage.setItem('projectarchitect_projects', JSON.stringify(mockProjects));
          }
        } else {
          // No stored data, save mock data
          if (typeof window !== 'undefined') {
            localStorage.setItem('projectarchitect_projects', JSON.stringify(mockProjects));
          }
        }
        
        setProjects(projectsToLoad);

        if (storedActivities) {
          const parsed = JSON.parse(storedActivities);
          setActivities(parsed);
        } else {
          // Generate initial activities from projects
          const initialActivities: Activity[] = mockProjects.slice(0, 3).map((project, index) => ({
            id: `init-${index}`,
            type: 'project_created' as const,
            description: `Project "${project.name}" was created`,
            timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
            user: 'System',
            projectId: project.id
          }));
          
          setActivities(initialActivities);
          if (typeof window !== 'undefined') {
            localStorage.setItem('projectarchitect_activities', JSON.stringify(initialActivities));
          }
        }
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isClient]);

  const updateProject = (updatedProject: Project) => {
    if (!isClient) return;
    
    const newProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(newProjects);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectarchitect_projects', JSON.stringify(newProjects));
    }
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    if (!isClient) return;
    
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const newActivities = [newActivity, ...activities].slice(0, 50);
    setActivities(newActivities);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectarchitect_activities', JSON.stringify(newActivities));
    }
  };

  const createProject = (projectData: Omit<Project, 'id'>) => {
    if (!isClient) return null;
    
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
    };
    const newProjects = [...projects, newProject];
    setProjects(newProjects);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectarchitect_projects', JSON.stringify(newProjects));
    }
    
    addActivity({
      type: 'project_created',
      description: `Project "${newProject.name}" was created`,
      user: 'System',
      projectId: newProject.id,
    });
    
    return newProject;
  };

  const deleteProject = (projectId: string) => {
    if (!isClient) return;
    
    const newProjects = projects.filter(p => p.id !== projectId);
    setProjects(newProjects);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectarchitect_projects', JSON.stringify(newProjects));
    }
    
    addActivity({
      type: 'project_deleted',
      description: `Project was deleted`,
      user: 'System',
      projectId,
    });
  };

  const resetToMockData = async () => {
    if (!isClient) return;
    
    try {
      const { mockProjects } = await import('@/data/mockData');
      setProjects(mockProjects);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('projectarchitect_projects', JSON.stringify(mockProjects));
      }

      // Generate initial activities
      const initialActivities: Activity[] = mockProjects.slice(0, 3).map((project, index) => ({
        id: `init-${index}`,
        type: 'project_created' as const,
        description: `Project "${project.name}" was created`,
        timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        user: 'System',
        projectId: project.id
      }));
      
      setActivities(initialActivities);
      if (typeof window !== 'undefined') {
        localStorage.setItem('projectarchitect_activities', JSON.stringify(initialActivities));
      }
      
      console.log('Data reset to mock data successfully');
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  };

  return {
    projects,
    activities,
    loading: loading || !isClient,
    error,
    isClient,
    updateProject,
    addActivity,
    createProject,
    deleteProject,
    resetToMockData,
  };
}