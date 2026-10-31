import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const CodeLab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const missionId = parseInt(searchParams.get('missionId') || '1', 10);

  useEffect(() => {
    // Seamlessly forward to canonical 7-stage Mission Experience
    navigate(`/mission/${missionId}`, { replace: true });
  }, [missionId, navigate]);

  return (
    <div className="text-center py-24 text-slate-400 font-mono text-xs">
      Forwarding to Starfleet Flight Cockpit (Mission 0{missionId})...
    </div>
  );
};
