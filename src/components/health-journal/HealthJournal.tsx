import React, { useState } from 'react';
import { Stethoscope, Activity, Brain, FlaskConical, User } from 'lucide-react';
import BloodPressure from './monitoring/BloodPressure';
import DiagnosticLab from './monitoring/DiagnosticLab';
import CognitiveJournal from './cognitive/CognitiveJournal';
import HealthDashboard from './dashboard/HealthDashboard';
import { useHSJ } from '../../lib/manifest';

export default function HealthJournal() {
  const { manifest, healthData, updateHealthData, ejectData, importData } = useHSJ();
  const [currentRoute, setCurrentRoute] = useState('profile');

  // Handle navigation with debug logging
  const handleNavigation = (route: string) => {
    console.log('Navigation requested to:', route);
    setCurrentRoute(route);
  };

  const renderRoute = () => {
    console.log('Rendering route:', currentRoute);
    switch (currentRoute) {
      case 'vitals':
        return healthData && (
          <BloodPressure 
            healthData={healthData}
            onUpdate={(data) => updateHealthData({
              path: 'bloodPressure',
              operation: 'update',
              value: data,
              timestamp: new Date().toISOString()
            })}
          />
        );
      case 'lab':
        return <DiagnosticLab />;
      case 'journal':
        return (
          <CognitiveJournal />
        );
      case 'profile':
        return (
          <HealthDashboard 
            healthData={healthData}
            onUpdate={(section, data) => updateHealthData({
              path: section,
              operation: 'update',
              value: data,
              timestamp: new Date().toISOString()
            })}
            onExport={async () => {
              const exportPackage = await ejectData();
              const blob = new Blob([JSON.stringify(exportPackage, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `health-profile-${exportPackage.manifest.hsj_id}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            onImport={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                  try {
                    const importedData = JSON.parse(e.target?.result as string);
                    await importData(importedData);
                  } catch (error) {
                    console.error('Error loading profile:', error);
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  // Navigation button component for consistency
  const NavButton = ({ route, icon: Icon, label }: { route: string; icon: any; label: string }) => (
    <div className="flex flex-col items-center">
      <button
        onClick={() => {
          console.log(`Clicked ${label} button`);
          handleNavigation(route);
        }}
        className="w-16 h-16 flex items-center justify-center hover:bg-[#00CED1]/10 rounded-full transition-colors"
        aria-label={label}
        title={label}
      >
        <Icon className={`w-7 h-7 ${currentRoute === route ? 'text-[#FFD700]' : 'text-[#00CED1]'}`} />
      </button>
      <span className="mt-1 text-sm text-[#00CED1]">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00CED1]/20 to-[#FFD700]/20">
      {/* Top Navigation */}
      <header className="px-8 py-4 bg-white/80 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="relative bg-[#FFD700] w-12 h-12 rounded-md overflow-hidden">
              <Stethoscope
                size={56}
                color="#00CED1"
                strokeWidth={2}
                className="absolute -right-1 -bottom-1"
              />
            </div>
            <span className="text-[#00CED1] font-mono font-bold text-3xl">Health Journal</span>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-12">
            <NavButton route="vitals" icon={Activity} label="BP Monitor" />
            <NavButton route="lab" icon={FlaskConical} label="Lab Results" />
            <NavButton route="journal" icon={Brain} label="Journal" />
            <NavButton route="profile" icon={User} label="Dashboard" />
          </div>

          {/* Current Time */}
          <div className="text-[#00CED1] font-mono text-xl">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-12">
        {renderRoute()}
      </main>
    </div>
  );
}
