import { useNavigate } from 'react-router-dom';

const MODULE_ROUTES = {
  'content-workflow': '/content-workshop',
  'intelligence-hub': '/intelligence',
  'content-studio': '/content-workshop',
  'design-studio': '/design-studio',
  'pre-mlr': '/pre-mlr',
  'glocalization': '/glocalization',
};

export const useDashboardNavigation = () => {
  const navigate = useNavigate();

  const navigateToModule = (moduleId) => {
    const route = MODULE_ROUTES[moduleId];
    if (route) {
      navigate(route);
    } else {
      console.warn(`No route found for module: ${moduleId}`);
    }
  };

  const navigateToContentWorkflow = () => navigate('/content-workshop');
  const navigateToIntelligence = () => navigate('/intelligence');
  const navigateToContentHub = () => navigate('/content-workshop');

  return {
    navigateToModule,
    navigateToContentWorkflow,
    navigateToIntelligence,
    navigateToContentHub
  };
};