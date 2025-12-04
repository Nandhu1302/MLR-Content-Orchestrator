import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useBrand } from './BrandContext';

const GlobalContext = createContext(null);

const globalContextReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'UPDATE_MODULE_DATA':
      return {
        ...state,
        crossModuleData: {
          ...state.crossModuleData,
          [action.payload.module]: {
            ...state.crossModuleData[action.payload.module],
            ...action.payload.data
          }
        }
      };
    case 'SET_CURRENT_MODULE':
      return { ...state, currentModule: action.payload };
    case 'UPDATE_USER_SELECTIONS':
      return {
        ...state,
        userSelections: { ...state.userSelections, ...action.payload }
      };
    case 'SET_TAXONOMY':
      return { ...state, taxonomy: action.payload };
    case 'LOAD_CONTEXT':
      return {
        ...state,
        crossModuleData: action.payload.context_data || {},
        userSelections: action.payload.selections || {},
        currentModule: action.payload.context_type || 'initiative'
      };
    case 'CLEAR_CONTEXT':
      return {
        ...state,
        crossModuleData: {},
        userSelections: {},
        currentModule: 'initiative'
      };
    default:
      return state;
  }
};

const initialState = {
  sessionId: '',
  crossModuleData: {},
  currentModule: 'initiative',
  userSelections: {},
  taxonomy: [],
  isLoading: false,
  error: null
};

export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalContextReducer, initialState);
  const { user } = useAuth();
  const { selectedBrand } = useBrand();

  // Generate session ID on mount
  useEffect(() => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
  }, []);

  // Load context when user or brand changes
  useEffect(() => {
    if (user && selectedBrand && state.sessionId) {
      loadContext();
      loadTaxonomy();
    }
  }, [user, selectedBrand, state.sessionId]);

  const updateModuleData = (module, data) => {
    dispatch({ type: 'UPDATE_MODULE_DATA', payload: { module, data } });
    // Auto-persist after updates
    setTimeout(() => persistContext(), 500);
  };

  const setCurrentModule = (module) => {
    dispatch({ type: 'SET_CURRENT_MODULE', payload: module });
    persistContext();
  };

  const updateUserSelections = (selections) => {
    dispatch({ type: 'UPDATE_USER_SELECTIONS', payload: selections });
    persistContext();
  };

  const loadTaxonomy = async () => {
    try {
      const { data, error } = await supabase
        .from('global_taxonomy')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('taxonomy_level', { ascending: true });

      if (error) throw error;
      dispatch({ type: 'SET_TAXONOMY', payload: data || [] });
    } catch (error) {
      console.error('Error loading taxonomy:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load taxonomy' });
    }
  };

  const persistContext = async () => {
    if (!user || !selectedBrand || !state.sessionId) return;

    try {
      const contextData = {
        user_id: user.id,
        session_id: state.sessionId,
        brand_id: selectedBrand.id,
        context_type: state.currentModule,
        context_data: state.crossModuleData,
        selections: state.userSelections,
        metadata: {
          last_updated: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      };

      const { error } = await supabase
        .from('cross_module_context')
        .upsert(contextData, {
          onConflict: 'user_id,session_id,context_type'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error persisting context:', error);
    }
  };

  const loadContext = async () => {
    if (!user || !selectedBrand) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const { data, error } = await supabase
        .from('cross_module_context')
        .select('*')
        .eq('user_id', user.id)
        .eq('brand_id', selectedBrand.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        dispatch({ type: 'LOAD_CONTEXT', payload: data });
      }
    } catch (error) {
      console.error('Error loading context:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load context' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearContext = () => {
    dispatch({ type: 'CLEAR_CONTEXT' });
    persistContext();
  };

  const actions = {
    updateModuleData,
    setCurrentModule,
    updateUserSelections,
    loadTaxonomy,
    persistContext,
    loadContext,
    clearContext
  };

  return (
    <GlobalContext.Provider value={{ state, actions }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }
  return context;
};