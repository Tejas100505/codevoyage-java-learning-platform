import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { missionService, WorldData } from '../services/missionService';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { StatCard } from '../components/StatCard';
import { XPBar } from '../components/XPBar';
import { PlanetCard } from '../components/PlanetCard';
import { MissionCard } from '../components/MissionCard';
import { Terminal, Shield, Zap, Flame, Rocket, Award, ChevronRight } from 'lucide-react';
import ignisImg from '../assets/images/ignis_station.jpg';
import byteImg from '../assets/images/byte_guide.jpg';

interface HomeProps {
  health: any;
  loadingHealth: boolean;
}

export const Home: React.FC<HomeProps> = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [worlds, setWorlds] = useState<WorldData[]>([]);

  useEffect(() => {
    missionService.getWorlds()
      .then((data) => setWorlds(data))
      .catch((err) => console.error('Error fetching worlds for dashboard', err));
  }, []);

  const world1 = worlds[0];

  return (
    <div className="space-y-10">
      {/* Hero Mission Control Banner */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-cyber-cyan/30 shadow-glow-cyan/20 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
              <Rocket className="w-3.5 h-3.5" />
              <span>STARFLEET FLIGHT TELEMETRY // ACTIVE DEPLOYMENT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-purple">{user?.username || 'Cadet Explorer'}</span>.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-mono">
              Ignis Station has reported auxiliary reactor instability. Write genuine Java 21 programs to reboot data arrays, calculate thruster vectors, and progress toward Fleet Commander.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <GlowButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/codelab?missionId=1')}
                icon={<Terminal className="w-4 h-4" />}
              >
                Launch Mission 01
              </GlowButton>

              <GlowButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/sectors')}
                icon={<Rocket className="w-4 h-4 text-cyber-purple" />}
              >
                Galaxy Star Chart
              </GlowButton>
            </div>
          </div>

          {/* Byte Robot Guide Companion Card */}
          <div className="lg:col-span-4">
            <GlassCard glow="cyan" className="p-5 border-cyber-cyan/30">
              <div className="flex items-center space-x-4">
                <img
                  src={byteImg}
                  alt="Byte Flight Companion"
                  className="w-16 h-16 rounded-2xl object-cover border border-cyber-cyan shadow-glow-cyan/50"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white font-mono">Byte AI</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-emerald/20 text-cyber-emerald font-mono">ONLINE</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    "Starship compilers stand by on port 5050. Let's calibrate the console!"
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Cadet Flight Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Cadet Level"
          value={`LVL ${user?.level || 1}`}
          subtitle="Explorer Rank"
          icon={Shield}
          color="cyan"
        />
        <StatCard
          title="Mission XP"
          value={`${user?.xp || 0} XP`}
          subtitle="Next rank at 500 XP"
          icon={Zap}
          color="amber"
        />
        <StatCard
          title="Flight Streak"
          value={`${user?.streak || 1} Days`}
          subtitle="Continuous calibration"
          icon={Flame}
          color="purple"
        />
        <StatCard
          title="Flight Commendations"
          value={`${user?.stars || 0} Stars`}
          subtitle="4 Badges Pending"
          icon={Award}
          color="emerald"
        />
      </section>

      {/* Active Sector Spotlight: World 1 Ignis Station */}
      {world1 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-semibold">
                <Flame className="w-4 h-4" />
                <span>PRIMARY DEPLOYMENT ZONE</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-mono tracking-tight">{world1.name}</h2>
            </div>

            <Link
              to="/sectors"
              className="text-xs font-mono text-cyber-cyan hover:underline flex items-center space-x-1"
            >
              <span>View Full Chart</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Planet Card with cinematic image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <PlanetCard
                name={world1.name}
                theme={world1.theme}
                lore={world1.lore}
                missionCount={world1.missions?.length || 5}
                imageSrc={ignisImg}
                onExplore={() => navigate('/sectors')}
              />
            </div>

            {/* Missions List */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {world1.missions?.slice(0, 4).map((mission) => (
                <MissionCard
                  key={mission.id}
                  id={mission.id}
                  missionOrder={mission.missionOrder}
                  title={mission.title}
                  objective={mission.objective}
                  javaConcept={mission.javaConcept}
                  xpReward={mission.xpReward}
                  difficulty={mission.difficulty}
                  unlocked={mission.unlocked}
                  completed={mission.completed}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
