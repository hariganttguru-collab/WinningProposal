import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
    email?: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('currentUser');
            }
        }
    }, []);

    const login = async (username: string, password: string, role: 'admin' | 'user'): Promise<boolean> => {
        // Simple validation (in production, this would be an API call)
        if (!username || !password) {
            return false;
        }

        // For demo purposes, accept any username/password
        // In production, you'd validate against a backend
        const newUser: User = {
            id: `${role}-${Date.now()}`,
            username: username,
            role: role
        };

        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const isAuthenticated = user !== null;
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
