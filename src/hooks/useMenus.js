import { useContext } from 'react';
import { MenuContext } from '@/contexts/MenuContext';

export const useMenus = () => {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenus must be used within a MenuProvider');
    }
    return context;
};