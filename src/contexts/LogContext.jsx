import React, { createContext, useContext, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';

    const LogContext = createContext(null);

    export const LogProvider = ({ children }) => {
      const logEvent = useCallback(async (level, message, payload = {}, source = 'frontend') => {
        const { error } = await supabase.from('system_logs').insert([
          {
            log_level: level,
            message,
            payload,
            source,
          },
        ]);

        if (error) {
          console.error('Error logging to Supabase:', error);
        }
      }, []);

      return (
        <LogContext.Provider value={{ logEvent }}>
          {children}
        </LogContext.Provider>
      );
    };

    export const useLogger = () => {
      const context = useContext(LogContext);
      if (!context) {
        throw new Error('useLogger must be used within a LogProvider');
      }
      return context;
    };