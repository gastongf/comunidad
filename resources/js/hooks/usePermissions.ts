import { usePage } from '@inertiajs/react';

interface Auth {
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
    permisos: string[];
    roles: string[];
}

export function usePermissions() {
    const { auth } = usePage().props as unknown as { auth: Auth };

    const can = (permission: string): boolean => {
        return auth.permisos.includes(permission);
    };

    const hasRole = (role: string): boolean => {
        return auth.roles.includes(role);
    };

    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some((role) => auth.roles.includes(role));
    };

    const hasAllRoles = (roles: string[]): boolean => {
        return roles.every((role) => auth.roles.includes(role));
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some((permission) =>
            auth.permisos.includes(permission),
        );
    };

    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every((permission) =>
            auth.permisos.includes(permission),
        );
    };

    return {
        can,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        hasAnyPermission,
        hasAllPermissions,
        auth,
    };
}
