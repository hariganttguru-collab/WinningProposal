import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLobby } from '../context/LobbyContext';

interface BidData {
    userId: string;
    username: string;
    bidPrice: number;
    profitPercentage: number;
    overheadPercentage: number;
    baseCosts: number;
    overheadCost: number;
    financingCost: number;
    profitAmount: number;
    submittedAt: number;
    inputs: any;
}

export default function AdminWaitingScreen() {
    const navigate = useNavigate();
    const { user } = useAuth();
