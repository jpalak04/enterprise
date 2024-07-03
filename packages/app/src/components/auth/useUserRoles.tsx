import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useApi, microsoftAuthApiRef } from '@backstage/core-plugin-api';

// If your decoded token has a specific type, define it; otherwise, use any
interface DecodedToken {
    roles?: string[];
}

const useUserRoles = () => {
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const microsoftAuthApi = useApi(microsoftAuthApiRef);

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const idToken = await microsoftAuthApi.getIdToken();
                const decodedToken: DecodedToken = jwtDecode(idToken);
                const userRoles = decodedToken.roles || [];
                setRoles(userRoles);
            } catch (error) {
                console.error('Failed to fetch or decode ID token', error);
                setError(null);
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, [microsoftAuthApi]);

    return { roles, loading, error };
};

export default useUserRoles;
