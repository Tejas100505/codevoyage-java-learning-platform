import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LanguageSelection } from './pages/LanguageSelection';
import { GalaxyMap } from './pages/GalaxyMap';
import { Sectors } from './pages/Sectors';
import { CodeLab } from './pages/CodeLab';
import { MissionExperience } from './pages/MissionExperience';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { JavaCodex } from './pages/JavaCodex';
import { SkillTree } from './pages/SkillTree';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { systemService, HealthStatus } from './services/systemService';

const RootRoute: React.FC<{ health: HealthStatus | null; loadingHealth: boolean }> = ({ health, loadingHealth }) => {
  const { isAuthenticated } = useAuth();

  // If logged in, show personalized Mission Control dashboard; if not logged in, show high-impact Landing Page
  if (isAuthenticated) {
    return <Dashboard health={health} loadingHealth={loadingHealth} />;
  }
  return <LandingPage />;
};

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await systemService.checkHealth();
        setHealth(data);
      } catch {
        setHealth(null);
      } finally {
        setLoadingHealth(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route
              element={<AppShell backendOnline={Boolean(health && health.status === 'UP')} />}
            >
              <Route path="/" element={<RootRoute health={health} loadingHealth={loadingHealth} />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard health={health} loadingHealth={loadingHealth} />} />
              <Route path="/language-selection" element={<LanguageSelection />} />
              <Route path="/map" element={<GalaxyMap />} />
              <Route path="/sectors" element={<GalaxyMap />} />
              <Route path="/sectors-list" element={<Sectors />} />
              <Route path="/codelab" element={<CodeLab />} />
              <Route path="/codex" element={<JavaCodex />} />
              <Route path="/skills" element={<SkillTree />} />
              <Route path="/skill-tree" element={<SkillTree />} />
              <Route path="/mission/:id" element={<MissionExperience />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Profile />} />
              <Route path="/progress" element={<Profile />} />
              <Route path="/evaluation" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
