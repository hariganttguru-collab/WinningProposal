import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LobbyProvider } from "./context/LobbyContext";
import Dashboard from "./pages/Dashboard";
import Contract from "./pages/Contract";
import BotStrategy from "./pages/BotStrategy";
import Comparison from "./pages/Comparison";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import JoinLobby from "./pages/JoinLobby";
import AdminResults from "./pages/AdminResults";
import PlayerWaitingScreen from "./pages/PlayerWaitingScreen";
import MultiplayerResults from "./pages/MultiplayerResults";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <LobbyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lobby"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Lobby />
                </ProtectedRoute>
              }
            />
            <Route
              path="/join-lobby"
              element={
                <ProtectedRoute requireAuth={true}>
                  <JoinLobby />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-results"
              element={
                <ProtectedRoute requireAuth={true}>
                  <AdminResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/player-waiting"
              element={
                <ProtectedRoute requireAuth={true}>
                  <PlayerWaitingScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/multiplayer-results"
              element={
                <ProtectedRoute requireAuth={true}>
                  <MultiplayerResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contract"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Contract />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bot-strategy"
              element={
                <ProtectedRoute requireAuth={true}>
                  <BotStrategy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comparison"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Comparison />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </LobbyProvider>
    </AuthProvider>
  );
}