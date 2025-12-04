import { useState, useEffect, useCallback } from 'react';
import { localizationService } from '@/services/localizationService';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';

export const useLocalizationManagement = ({
  projectId,
  autoLoad = true
} = {}) => {
  const [localizationProjects, setLocalizationProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [translationMemory, setTranslationMemory] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [contentReadiness, setContentReadiness] = useState(null);
  const [agencyRecommendations, setAgencyRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { selectedBrand } = useBrand();

  const loadLocalizationProjects = useCallback(async () => {
    if (!selectedBrand?.id) return;
    try {
      setLoading(true);
      setError(null);
      const projects = await localizationService.getLocalizationProjects(selectedBrand.id);
      setLocalizationProjects(projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load localization projects');
    } finally {
      setLoading(false);
    }
  }, [selectedBrand?.id]);

  const loadLocalizationProject = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const [project, projectWorkflows] = await Promise.all([
        localizationService.getLocalizationProject(id),
        localizationService.getLocalizationWorkflows(id)
      ]);
      setCurrentProject(project);
      setWorkflows(projectWorkflows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load localization project');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    if (!selectedBrand?.id) return;
    try {
      setLoading(true);
      const data = await localizationService.getDashboardData(selectedBrand.id);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [selectedBrand?.id]);

  const loadAgencies = useCallback(async () => {
    if (!selectedBrand?.id) return;
    try {
      const agencyList = await localizationService.getLocalizationAgencies(selectedBrand.id);
      setAgencies(agencyList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agencies');
    }
  }, [selectedBrand?.id]);

  const createLocalizationProject = useCallback(async (projectData) => {
    if (!selectedBrand?.id || !user?.id) {
      throw new Error('Authentication and brand selection required');
    }
    try {
      setSaving(true);
      setError(null);
      const newProject = await localizationService.createLocalizationProject(
        projectData,
        selectedBrand.id,
        user.id
      );
      await loadLocalizationProjects();
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create localization project');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [selectedBrand?.id, user?.id, loadLocalizationProjects]);

  const updateProjectStatus = useCallback(async (projectId, status) => {
    if (!user?.id) throw new Error('Authentication required');
    try {
      setSaving(true);
      const updatedProject = await localizationService.updateLocalizationProject(
        projectId,
        { status },
        user.id
      );
      setLocalizationProjects(prev =>
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project status');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [user?.id, currentProject?.id]);

  const updateWorkflowStatus = useCallback(async (workflowId, status) => {
    if (!user?.id) throw new Error('Authentication required');
    try {
      setSaving(true);
      const updatedWorkflow = await localizationService.updateWorkflowStatus(
        workflowId,
        status,
        user.id
      );
      setWorkflows(prev =>
        prev.map(w => w.id === workflowId ? updatedWorkflow : w)
      );
      return updatedWorkflow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workflow status');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [user?.id]);

  const assessContentReadiness = useCallback(async (projectData) => {
    try {
      setLoading(true);
      const assessment = await localizationService.assessContentReadiness(projectData);
      setContentReadiness(assessment);
      return assessment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess content readiness');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const findOptimalAgencies = useCallback(async (criteria) => {
    if (!selectedBrand?.id) throw new Error('Brand selection required');
    try {
      setLoading(true);
      const recommendations = await localizationService.findOptimalAgencies(criteria, selectedBrand.id);
      setAgencyRecommendations(recommendations);
      return recommendations;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find optimal agencies');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedBrand?.id]);

  const addAgency = useCallback(async (agencyData) => {
    if (!user?.id) throw new Error('Authentication required');
    try {
      setSaving(true);
      const newAgency = await localizationService.addLocalizationAgency(agencyData, user.id);
      setAgencies(prev => [...prev, newAgency]);
      return newAgency;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add agency');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [user?.id]);

  const searchTranslationMemory = useCallback(async (
    sourceText,
    sourceLanguage,
    targetLanguage
  ) => {
    if (!selectedBrand?.id) throw new Error('Brand selection required');
    try {
      const matches = await localizationService.searchTranslationMemory(
        sourceText,
        sourceLanguage,
        targetLanguage,
        selectedBrand.id
      );
      return matches;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search translation memory');
      throw err;
    }
  }, [selectedBrand?.id]);

  const handleContentUpload = useCallback(async (files, projectData) => {
    if (!selectedBrand?.id || !user?.id) {
      throw new Error('Authentication and brand selection required');
    }
    try {
      setSaving(true);
      setError(null);
      const processedContent = await Promise.all(
        files.map(async (file) => {
          const content = await file.text();
          return {
            filename: file.name,
            type: file.type,
            content: content.substring(0, 1000),
            size: file.size
          };
        })
      );
      const fullProjectData = {
        project_name: projectData.project_name || `Uploaded Content - ${new Date().toLocaleDateString()}`,
        description: projectData.description,
        source_content_type: 'uploaded',
        target_markets: projectData.target_markets || [],
        target_languages: projectData.target_languages || [],
        priority_level: projectData.priority_level || 'medium',
        total_budget: projectData.total_budget,
        desired_timeline: projectData.desired_timeline
      };
      const newProject = await createLocalizationProject(fullProjectData);
      return { project: newProject, processedContent };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process uploaded content');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [selectedBrand?.id, user?.id, createLocalizationProject]);

  const clearError = useCallback(() => setError(null), []);

  const refreshData = useCallback(async () => {
    if (projectId) {
      await loadLocalizationProject(projectId);
    } else {
      await Promise.all([
        loadLocalizationProjects(),
        loadDashboardData(),
        loadAgencies()
      ]);
    }
  }, [projectId, loadLocalizationProject, loadLocalizationProjects, loadDashboardData, loadAgencies]);

  useEffect(() => {
    if (autoLoad && selectedBrand?.id) {
      if (projectId) {
        loadLocalizationProject(projectId);
      } else {
        refreshData();
      }
    }
  }, [autoLoad, selectedBrand?.id, projectId, loadLocalizationProject, refreshData]);

  return {
    localizationProjects,
    currentProject,
    workflows,
    agencies,
    translationMemory,
    dashboardData,
    contentReadiness,
    agencyRecommendations,
    loading,
    saving,
    error,
    createLocalizationProject,
    updateProjectStatus,
    loadLocalizationProject,
    loadLocalizationProjects,
    updateWorkflowStatus,
    assessContentReadiness,
    searchTranslationMemory,
    handleContentUpload,
    findOptimalAgencies,
    addAgency,
    loadAgencies,
    loadDashboardData,
    clearError,
    refreshData
  };
};
