import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DemoBanner } from './components/DemoBanner';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationPanel } from './components/NotificationPanel';

import { HomePage } from './pages/HomePage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { SOSPage } from './pages/SOSPage';
import { ReportEmergencyPage } from './pages/ReportEmergencyPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { SheltersPage } from './pages/SheltersPage';
import { RescueDashboardPage } from './pages/RescueDashboardPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { EmergencyStatusPage } from './pages/EmergencyStatusPage';

import { Language, translations } from './data/i18n';
import { emergencyService } from './services/emergencyService';
import { 
  hospitalService, 
  shelterService, 
  volunteerService, 
  resourceService, 
  alertService, 
  notificationService 
} from './services/dataService';
import { soundManager } from './utils/audio';
import { EmergencyRecord } from './models/emergency';
import { Hospital, Shelter, Volunteer, ResourceItem, DisasterAlert, AppNotification } from './models/entities';

export default function App() {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [lang, setLang] = useState<Language>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Specific emergency being inspected in status view
  const [activeStatusEmergencyId, setActiveStatusEmergencyId] = useState<string | null>(null);
  const [focusedEmergencyId, setFocusedEmergencyId] = useState<string | undefined>(undefined);

  // Entities state
  const [emergencies, setEmergencies] = useState<EmergencyRecord[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Initialize and load
  const reloadData = () => {
    setEmergencies(emergencyService.getEmergencies());
    setHospitals(hospitalService.getAll());
    setShelters(shelterService.getAll());
    setVolunteers(volunteerService.getAll());
    setResources(resourceService.getAll());
    setAlerts(alertService.getAll());
    setNotifications(notificationService.getAll());
  };

  useEffect(() => {
    reloadData();
    try {
      const savedLang = localStorage.getItem('disaster_hub_lang');
      if (savedLang === 'en' || savedLang === 'te') {
        setLang(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleLang = () => {
    const nextLang: Language = lang === 'en' ? 'te' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem('disaster_hub_lang', nextLang);
    } catch {
      // ignore
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  const handleNavigate = (section: string, focusId?: string) => {
    setCurrentSection(section);
    setActiveStatusEmergencyId(null);
    if (focusId) {
      setFocusedEmergencyId(focusId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewEmergencyStatus = (emergencyId: string) => {
    setActiveStatusEmergencyId(emergencyId);
    setCurrentSection('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmergencyCreated = (record: EmergencyRecord) => {
    setEmergencies(emergencyService.getEmergencies());
    setNotifications(notificationService.getAll());
  };

  const handleEmergencyUpdated = (record: EmergencyRecord) => {
    setEmergencies(emergencyService.getEmergencies());
    setNotifications(notificationService.getAll());
  };

  const unreadNotifs = notifications.filter(n => !n.isRead).length;
  const activeEmergenciesCount = emergencies.filter(e => e.status !== 'RESOLVED').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      
      {/* Demo Mode Notice Banner */}
      <DemoBanner t={t} />

      {/* Main Top Header */}
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={handleToggleLang}
        unreadCount={unreadNotifs}
        activeEmergenciesCount={activeEmergenciesCount}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onToggleNotificationPanel={() => setIsNotificationPanelOpen(prev => !prev)}
      />

      {/* App Body with Sidebar + Main Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          lang={lang}
          activeEmergenciesCount={activeEmergenciesCount}
          criticalAlertsCount={criticalAlertsCount}
          unreadNotifsCount={unreadNotifs}
        />

        {/* Content Container (padded left on lg to accommodate 64w sidebar) */}
        <main className="flex-1 lg:pl-64 w-full p-4 sm:p-6 overflow-x-hidden">
          
          {/* Emergency Status View: Section 7 */}
          {currentSection === 'status' && activeStatusEmergencyId && (
            <EmergencyStatusPage
              emergencyId={activeStatusEmergencyId}
              onBack={() => handleNavigate('dashboard')}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              lang={lang}
              emergencies={emergencies}
              hospitals={hospitals}
              shelters={shelters}
            />
          )}

          {currentSection === 'dashboard' && (
            <CitizenDashboard
              onNavigate={handleNavigate}
              onViewEmergencyStatus={handleViewEmergencyStatus}
              lang={lang}
              emergencies={emergencies}
              hospitals={hospitals}
              shelters={shelters}
              alerts={alerts}
            />
          )}

          {currentSection === 'sos' && (
            <SOSPage
              onNavigate={handleNavigate}
              onViewEmergencyStatus={handleViewEmergencyStatus}
              lang={lang}
              onEmergencyCreated={handleEmergencyCreated}
            />
          )}

          {currentSection === 'report' && (
            <ReportEmergencyPage
              onNavigate={handleNavigate}
              onViewEmergencyStatus={handleViewEmergencyStatus}
              lang={lang}
              onEmergencyCreated={handleEmergencyCreated}
            />
          )}

          {currentSection === 'map' && (
            <LiveMapPage
              onNavigate={handleNavigate}
              lang={lang}
              emergencies={emergencies}
              hospitals={hospitals}
              shelters={shelters}
            />
          )}

          {currentSection === 'alerts' && (
            <AlertsPage
              lang={lang}
              alerts={alerts}
              onAlertCreated={(newAlert) => {
                setAlerts(alertService.getAll());
                setNotifications(notificationService.getAll());
              }}
            />
          )}

          {currentSection === 'hospitals' && (
            <HospitalsPage
              onNavigate={handleNavigate}
              lang={lang}
              hospitals={hospitals}
            />
          )}

          {currentSection === 'shelters' && (
            <SheltersPage
              onNavigate={handleNavigate}
              lang={lang}
              shelters={shelters}
              onShelterUpdated={(updated) => {
                setShelters(shelterService.getAll());
              }}
            />
          )}

          {currentSection === 'rescue' && (
            <RescueDashboardPage
              lang={lang}
              emergencies={emergencies}
              onEmergencyUpdated={handleEmergencyUpdated}
              focusedEmergencyId={focusedEmergencyId}
            />
          )}

          {currentSection === 'volunteers' && (
            <VolunteersPage
              lang={lang}
              volunteers={volunteers}
              onVolunteerRegistered={(v) => {
                setVolunteers(volunteerService.getAll());
                setNotifications(notificationService.getAll());
              }}
              onVolunteerUpdated={(v) => {
                setVolunteers(volunteerService.getAll());
              }}
            />
          )}

          {currentSection === 'resources' && (
            <ResourcesPage
              lang={lang}
              resources={resources}
              onResourceUpdated={(r) => {
                setResources(resourceService.getAll());
                setNotifications(notificationService.getAll());
              }}
            />
          )}

          {currentSection === 'admin' && (
            <AdminDashboardPage
              lang={lang}
              emergencies={emergencies}
              hospitals={hospitals}
              shelters={shelters}
              volunteers={volunteers}
              resources={resources}
              alerts={alerts}
            />
          )}

          {currentSection === 'notifications' && (
            <NotificationsPage
              lang={lang}
              notifications={notifications}
              onNotificationsChanged={() => {
                setNotifications(notificationService.getAll());
              }}
            />
          )}

          {currentSection === 'profile' && (
            <ProfilePage
              lang={lang}
            />
          )}

          {currentSection === 'settings' && (
            <SettingsPage
              lang={lang}
              onSetLang={setLang}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onResetAllData={reloadData}
            />
          )}
        </main>

      </div>

      {/* Footer with Demo Notice */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] text-slate-500">
            Demo environment — emergency data is simulated until backend services are connected.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Dynamic Disaster Communication Hub</span>
            <span>·</span>
            <span>Phase 2 Citizen Emergency System</span>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Notifications Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          notificationService.markAllRead();
          setNotifications(notificationService.getAll());
        }}
        onClearAll={() => {
          notificationService.clearAll();
          setNotifications(notificationService.getAll());
        }}
        onNavigate={handleNavigate}
      />

    </div>
  );
}
