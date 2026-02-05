import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Player {
    id: string;
    username: string;
    role: 'admin' | 'user';
    joinedAt: number;
    isReady: boolean;
}

interface Lobby {
    code: string;
    adminId: string;
    players: Player[];
    status: 'waiting' | 'starting' | 'in-progress' | 'completed';
    createdAt: number;
}

interface LobbyContextType {
    currentLobby: Lobby | null;
    createLobby: (adminId: string, adminUsername: string) => string;
    joinLobby: (code: string, userId: string, username: string) => boolean;
    leaveLobby: (userId: string) => void;
    startGame: () => void;
    getLobbyPlayers: () => Player[];
    isAdmin: (userId: string) => boolean;
}

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const LobbyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);

    // Sync lobby state from localStorage
    const syncLobbyFromStorage = () => {
        if (!currentLobby) return;

        const storedLobby = localStorage.getItem(`lobby_${currentLobby.code}`);
        if (storedLobby) {
            const parsedLobby = JSON.parse(storedLobby);
            // Only update if there are actual changes
            if (JSON.stringify(parsedLobby) !== JSON.stringify(currentLobby)) {
                setCurrentLobby(parsedLobby);
            }
        }
    };

    // Listen for storage events (cross-tab communication)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key?.startsWith('lobby_') && currentLobby) {
                syncLobbyFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [currentLobby]);

    // Poll localStorage every 500ms for updates (for same-tab updates)
    useEffect(() => {
        if (!currentLobby) return;

        const interval = setInterval(() => {
            syncLobbyFromStorage();
        }, 500);

        return () => clearInterval(interval);
    }, [currentLobby]);

    // Generate a random 6-character lobby code
    const generateLobbyCode = (): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };

    const createLobby = (adminId: string, adminUsername: string): string => {
        const code = generateLobbyCode();
        const newLobby: Lobby = {
            code,
            adminId,
            players: [{
                id: adminId,
                username: adminUsername,
                role: 'admin',
                joinedAt: Date.now(),
                isReady: true
            }],
            status: 'waiting',
            createdAt: Date.now()
        };

        setCurrentLobby(newLobby);

        // Store in localStorage for persistence
        localStorage.setItem(`lobby_${code}`, JSON.stringify(newLobby));

        // Trigger storage event manually for same-tab updates
        window.dispatchEvent(new StorageEvent('storage', {
            key: `lobby_${code}`,
            newValue: JSON.stringify(newLobby)
        }));

        return code;
    };

    const joinLobby = (code: string, userId: string, username: string): boolean => {
        // Try to load lobby from localStorage
        const storedLobby = localStorage.getItem(`lobby_${code}`);

        if (!storedLobby) {
            return false; // Lobby doesn't exist
        }

        const lobby: Lobby = JSON.parse(storedLobby);

        if (lobby.status !== 'waiting') {
            return false; // Game already started
        }

        // Check if user already in lobby
        if (lobby.players.some(p => p.id === userId)) {
            setCurrentLobby(lobby);
            return true;
        }

        // Add new player
        const newPlayer: Player = {
            id: userId,
            username,
            role: 'user',
            joinedAt: Date.now(),
            isReady: true
        };

        lobby.players.push(newPlayer);

        // Update lobby
        const updatedLobby = { ...lobby };
        setCurrentLobby(updatedLobby);
        localStorage.setItem(`lobby_${code}`, JSON.stringify(updatedLobby));

        // Trigger storage event manually for same-tab updates
        window.dispatchEvent(new StorageEvent('storage', {
            key: `lobby_${code}`,
            newValue: JSON.stringify(updatedLobby)
        }));

        return true;
    };

    const leaveLobby = (userId: string) => {
        if (!currentLobby) return;

        const updatedPlayers = currentLobby.players.filter(p => p.id !== userId);

        if (updatedPlayers.length === 0) {
            // Last player left, delete lobby
            localStorage.removeItem(`lobby_${currentLobby.code}`);
            setCurrentLobby(null);
        } else {
            const updatedLobby = { ...currentLobby, players: updatedPlayers };
            setCurrentLobby(updatedLobby);
            localStorage.setItem(`lobby_${currentLobby.code}`, JSON.stringify(updatedLobby));

            // Trigger storage event manually for same-tab updates
            window.dispatchEvent(new StorageEvent('storage', {
                key: `lobby_${currentLobby.code}`,
                newValue: JSON.stringify(updatedLobby)
            }));
        }
    };

    const startGame = () => {
        if (!currentLobby) return;

        const updatedLobby = { ...currentLobby, status: 'in-progress' as const };
        setCurrentLobby(updatedLobby);
        localStorage.setItem(`lobby_${currentLobby.code}`, JSON.stringify(updatedLobby));

        // Trigger storage event manually for same-tab updates
        window.dispatchEvent(new StorageEvent('storage', {
            key: `lobby_${currentLobby.code}`,
            newValue: JSON.stringify(updatedLobby)
        }));
    };

    const getLobbyPlayers = (): Player[] => {
        return currentLobby?.players || [];
    };

    const isAdmin = (userId: string): boolean => {
        return currentLobby?.adminId === userId;
    };

    return (
        <LobbyContext.Provider value={{
            currentLobby,
            createLobby,
            joinLobby,
            leaveLobby,
            startGame,
            getLobbyPlayers,
            isAdmin
        }}>
            {children}
        </LobbyContext.Provider>
    );
};

export const useLobby = () => {
    const context = useContext(LobbyContext);
    if (context === undefined) {
        throw new Error('useLobby must be used within a LobbyProvider');
    }
    return context;
};
