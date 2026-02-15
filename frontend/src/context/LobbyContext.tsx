import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Player {
    id: string; // This is the user_id (e.g. "admin-...", "user-...")
    username: string;
    role: 'admin' | 'user';
    joinedAt: number;
    isReady: boolean;
    bidData: any | null; // Added for final submissions
}

interface Lobby {
    id: string; // DB UUID
    code: string;
    adminId: string;
    players: Player[];
    status: 'waiting' | 'starting' | 'in-progress' | 'completed';
    createdAt: number;
    simulationData: any;
}

interface LobbyContextType {
    currentLobby: Lobby | null;
    createLobby: (adminId: string, adminUsername: string) => Promise<string | null>;
    joinLobby: (code: string, userId: string, username: string) => Promise<boolean>;
    leaveLobby: (userId: string) => Promise<void>;
    startGame: () => Promise<void>;
    submitBid: (userId: string, bidData: any) => Promise<void>;
    getLobbyPlayers: () => Player[];
    isAdmin: (userId: string) => boolean;
}

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const LobbyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);

    // Fetch full lobby state (metadata + players)
    const fetchLobbyState = useCallback(async (lobbyCode: string) => {
        const { data: lobbyData, error: lobbyError } = await supabase
            .from('lobbies')
            .select('*, players(*)')
            .eq('code', lobbyCode)
            .single();

        if (lobbyError || !lobbyData) {
            console.error('Error fetching lobby:', lobbyError);
            return null;
        }

        const formattedPlayers: Player[] = lobbyData.players.map((p: any) => ({
            id: p.user_id,
            username: p.username,
            role: p.role,
            isReady: p.is_ready,
            joinedAt: new Date(p.joined_at).getTime(),
            bidData: p.bid_data
        }));

        const lobby: Lobby = {
            id: lobbyData.id,
            code: lobbyData.code,
            adminId: lobbyData.admin_id,
            status: lobbyData.status,
            createdAt: new Date(lobbyData.created_at).getTime(),
            players: formattedPlayers,
            simulationData: lobbyData.simulation_data
        };

        return lobby;
    }, []);

    // Set up real-time subscriptions
    useEffect(() => {
        if (!currentLobby) return;

        const lobbyChannel = supabase
            .channel(`lobby_${currentLobby.code}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'lobbies', filter: `code=eq.${currentLobby.code}` },
                async () => {
                    const updatedLobby = await fetchLobbyState(currentLobby.code);
                    if (updatedLobby) setCurrentLobby(updatedLobby);
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'players', filter: `lobby_id=eq.${currentLobby.id}` },
                async () => {
                    const updatedLobby = await fetchLobbyState(currentLobby.code);
                    if (updatedLobby) setCurrentLobby(updatedLobby);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(lobbyChannel);
        };
    }, [currentLobby?.code, currentLobby?.id, fetchLobbyState]);

    // Generate a random 6-character lobby code
    const generateLobbyCode = (): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };

    const createLobby = async (adminId: string, adminUsername: string): Promise<string | null> => {
        const code = generateLobbyCode();

        // 1. Create Lobby
        const { data: lobby, error: lobbyError } = await supabase
            .from('lobbies')
            .insert([{
                code,
                admin_id: adminId,
                status: 'waiting',
                simulation_data: {}
            }])
            .select()
            .single();

        if (lobbyError) {
            console.error('Error creating lobby:', lobbyError);
            return null;
        }

        // 2. Add Admin as Player
        const { error: playerError } = await supabase
            .from('players')
            .insert([{
                lobby_id: lobby.id,
                user_id: adminId,
                username: adminUsername,
                role: 'admin',
                is_ready: true
            }]);

        if (playerError) {
            console.error('Error adding admin player:', playerError);
            return null;
        }

        const fullLobby = await fetchLobbyState(code);
        setCurrentLobby(fullLobby);
        return code;
    };

    const joinLobby = async (code: string, userId: string, username: string): Promise<boolean> => {
        const { data: lobby, error: lobbyError } = await supabase
            .from('lobbies')
            .select('*')
            .eq('code', code)
            .single();

        if (lobbyError || !lobby) {
            console.error('Lobby not found');
            return false;
        }

        if (lobby.status !== 'waiting') {
            console.error('Game already started');
            return false;
        }

        // Add player (ignore if already exists)
        const { error: playerError } = await supabase
            .from('players')
            .upsert([{
                lobby_id: lobby.id,
                user_id: userId,
                username,
                role: 'user',
                is_ready: true
            }], { onConflict: 'lobby_id,user_id' });

        if (playerError) {
            console.error('Error joining lobby:', playerError);
            return false;
        }

        const fullLobby = await fetchLobbyState(code);
        setCurrentLobby(fullLobby);
        return true;
    };

    const leaveLobby = async (userId: string) => {
        if (!currentLobby) return;

        const { error: playerError } = await supabase
            .from('players')
            .delete()
            .match({ lobby_id: currentLobby.id, user_id: userId });

        if (playerError) {
            console.error('Error leaving lobby:', playerError);
            return;
        }

        // Check if any players left
        const { data: playersLeft, error: countError } = await supabase
            .from('players')
            .select('id')
            .eq('lobby_id', currentLobby.id);

        if (!countError && playersLeft && playersLeft.length === 0) {
            await supabase.from('lobbies').delete().eq('id', currentLobby.id);
        }

        setCurrentLobby(null);
    };

    const startGame = async () => {
        if (!currentLobby) return;

        const { error } = await supabase
            .from('lobbies')
            .update({ status: 'in-progress' })
            .eq('id', currentLobby.id);

        if (error) {
            console.error('Error starting game:', error);
        }
    };

    const submitBid = async (userId: string, bidData: any) => {
        if (!currentLobby) return;

        const { error } = await supabase
            .from('players')
            .update({ bid_data: bidData })
            .match({ lobby_id: currentLobby.id, user_id: userId });

        if (error) {
            console.error('Error submitting bid:', error);
        }
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
            submitBid,
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
