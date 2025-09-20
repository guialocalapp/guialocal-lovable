import React, { createContext, useContext, useEffect, useState } from 'react';

    const ThemeProviderContext = createContext(null);

    export function ThemeProvider({
      children,
      ...props
    }) {
      useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
      }, []);

      const value = {
        theme: 'light',
        setTheme: () => {},
      };

      return (
        <ThemeProviderContext.Provider {...props} value={value}>
          {children}
        </ThemeProviderContext.Provider>
      );
    }

    export const useTheme = () => {
      const context = useContext(ThemeProviderContext);
      if (context === null) {
        throw new Error('useTheme must be used within a ThemeProvider');
      }
      return context;
    };