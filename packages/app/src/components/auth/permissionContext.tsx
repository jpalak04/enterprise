// PermissionContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { AppPermission } from './permissions';

interface PermissionContextType {
    hasPermission: (permission: AppPermission) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};

export const PermissionProvider: React.FC<{ children: ReactNode, roles: string[] }> = ({ children, roles }) => {
    const hasPermission = (permission: AppPermission) => {
        // Logic to determine if the user has the specified permission based on their roles
        if (roles.includes('Demo.ALL')) {
            return true;
        }
        if (permission === AppPermission.DO_THIS && roles.includes('Demo.DoThis')) {
            return true;
        }
        return false;
    };

    return (
        <PermissionContext.Provider value={{ hasPermission }}>
            {children}
        </PermissionContext.Provider>
    );
};
