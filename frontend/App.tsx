import React, { useState } from 'react';
import { View } from './types';
import HomeView from './components/HomeView';
import AnalyticsView from './components/AnalyticsView';
import NewEntryView from './components/NewEntryView';
import CalendarView from './components/CalendarView';
import CommunityView from './components/CommunityView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import AddTimeRecordView, { TimeRecordData } from './components/AddTimeRecordView';
import AddHabitView from './components/AddHabitView';
import FocusModeView from './components/FocusModeView';
import PostDetailsView from './components/PostDetailsView';
import ReplyView from './components/ReplyView';
import NotificationView from './components/NotificationView';
import ChatView from './components/ChatView';
import PublicProfileView from './components/PublicProfileView';
import CategoryManagementView from './components/CategoryManagementView';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [editingRecord, setEditingRecord] = useState<TimeRecordData | null>(null);

  // Auto-login check
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Basic check, in reality we should verify token validity via API
      setCurrentView(View.CALENDAR);
    }
  }, []);

  // Helper to render the active component
  const renderView = () => {
    switch (currentView) {
      case View.LOGIN:
        return (
          <LoginView
            onLogin={() => setCurrentView(View.CALENDAR)}
            onGoToRegister={() => setCurrentView(View.REGISTER)}
          />
        );
      case View.REGISTER:
        return (
          <RegisterView
            onBackToLogin={() => setCurrentView(View.LOGIN)}
            onRegisterSuccess={() => {
              alert('注册成功，请使用新账号登录！');
              setCurrentView(View.LOGIN);
            }}
          />
        );
      case View.HOME:
        return <HomeView onOpenNewEntry={() => setCurrentView(View.NEW_ENTRY)} onOpenCalendar={() => setCurrentView(View.CALENDAR)} onAddHabit={() => setCurrentView(View.ADD_HABIT)} />;
      case View.ANALYTICS:
        // Pass onBack to return to the main dashboard (Calendar/Today)
        return <AnalyticsView onBack={() => setCurrentView(View.CALENDAR)} />;
      case View.NEW_ENTRY:
        return (
          <NewEntryView
            onClose={() => setCurrentView(View.CALENDAR)}
            onStartFocusMode={() => setCurrentView(View.FOCUS_MODE)}
            onLogTime={() => {
              setEditingRecord(null);
              setCurrentView(View.ADD_TIME_RECORD);
            }}
          />
        );
      case View.CALENDAR:
        return (
          <CalendarView
            onOpenNewEntry={() => setCurrentView(View.NEW_ENTRY)}
            onStartFocus={() => setCurrentView(View.FOCUS_MODE)}
            onCreateEvent={(startTimeMinutes) => {
              const h = Math.floor(startTimeMinutes / 60);
              const m = startTimeMinutes % 60;
              const endMins = startTimeMinutes + 60; // Default 1 hour
              let eh = Math.floor(endMins / 60);
              const em = endMins % 60;

              // Simple day wrap handling
              if (eh >= 24) eh -= 24;

              setEditingRecord({
                startTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
                endTime: `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`,
                category: '工作' // Default category
              });
              setCurrentView(View.ADD_TIME_RECORD);
            }}
            onEditEvent={(event) => {
              const h = Math.floor(event.startTime / 60);
              const m = event.startTime % 60;
              const endMins = event.startTime + event.duration;
              const eh = Math.floor(endMins / 60);
              const em = endMins % 60;

              setEditingRecord({
                id: event.id,
                title: event.title,
                startTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
                endTime: `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`,
                category: event.subtitle // Use the category from the event
              });
              setCurrentView(View.ADD_TIME_RECORD);
            }}
            onManageCategories={() => setCurrentView(View.CATEGORY_MANAGEMENT)}
          />
        );
      case View.COMMUNITY:
        return <CommunityView
          onOpenPost={() => setCurrentView(View.POST_DETAILS)}
          onOpenNotifications={() => setCurrentView(View.NOTIFICATIONS)}
          onOpenProfile={() => setCurrentView(View.PUBLIC_PROFILE)}
        />;
      case View.POST_DETAILS:
        return <PostDetailsView onBack={() => setCurrentView(View.COMMUNITY)} onReply={() => setCurrentView(View.REPLY)} onOpenProfile={() => setCurrentView(View.PUBLIC_PROFILE)} />;
      case View.REPLY:
        return <ReplyView onCancel={() => setCurrentView(View.POST_DETAILS)} onPost={() => setCurrentView(View.POST_DETAILS)} />;
      case View.PROFILE:
        return <ProfileView onBack={() => setCurrentView(View.CALENDAR)} />;
      case View.ADD_TIME_RECORD:
        return (
          <AddTimeRecordView
            onCancel={() => {
              setEditingRecord(null);
              setCurrentView(View.CALENDAR);
            }}
            onSave={() => {
              setEditingRecord(null);
              setCurrentView(View.CALENDAR);
            }}
            initialData={editingRecord}
          />
        );
      case View.ADD_HABIT:
        return <AddHabitView onCancel={() => setCurrentView(View.HOME)} onSave={() => setCurrentView(View.HOME)} />;
      case View.FOCUS_MODE:
        return <FocusModeView onPause={() => { }} onQuit={() => setCurrentView(View.CALENDAR)} />;
      case View.NOTIFICATIONS:
        return (
          <NotificationView
            onBack={() => setCurrentView(View.COMMUNITY)}
            onOpenChat={() => setCurrentView(View.CHAT)}
            onOpenPost={() => setCurrentView(View.POST_DETAILS)}
            onOpenProfile={() => setCurrentView(View.PUBLIC_PROFILE)}
          />
        );
      case View.CHAT:
        return <ChatView onBack={() => setCurrentView(View.NOTIFICATIONS)} onOpenProfile={() => setCurrentView(View.PUBLIC_PROFILE)} />;
      case View.PUBLIC_PROFILE:
        return <PublicProfileView onBack={() => setCurrentView(View.COMMUNITY)} onMessage={() => setCurrentView(View.CHAT)} />;
      case View.CATEGORY_MANAGEMENT:
        return <CategoryManagementView onBack={() => setCurrentView(View.CALENDAR)} />;
      default:
        return <CalendarView onOpenNewEntry={() => setCurrentView(View.NEW_ENTRY)} />;
    }
  };

  // Check if we should show bottom nav
  const showBottomNav = ![
    View.LOGIN,
    View.NEW_ENTRY,
    View.ADD_TIME_RECORD,
    View.ADD_HABIT,
    View.FOCUS_MODE,
    View.POST_DETAILS,
    View.REPLY,
    View.CHAT,
    View.PUBLIC_PROFILE
  ].includes(currentView);

  return (
    <div className="flex justify-center h-screen bg-black overflow-hidden">
      <div className="w-full max-w-md h-full relative shadow-2xl overflow-hidden flex flex-col bg-background-dark">

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col h-full">
          {renderView()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pt-3 pb-8 border-t bg-background-dark/95 ios-blur border-white/5">
            <div className="flex items-center justify-between">
              {/* 1. Habits (Home) */}
              <NavButton
                active={currentView === View.HOME}
                icon="check_circle"
                onClick={() => setCurrentView(View.HOME)}
              />

              {/* 2. Calendar */}
              <NavButton
                active={currentView === View.CALENDAR}
                icon="calendar_month"
                onClick={() => setCurrentView(View.CALENDAR)}
              />

              {/* 3. Analytics */}
              <NavButton
                active={currentView === View.ANALYTICS}
                icon="analytics"
                onClick={() => setCurrentView(View.ANALYTICS)}
              />

              {/* 4. Community (NEW) */}
              <NavButton
                active={currentView === View.COMMUNITY}
                icon="groups"
                onClick={() => setCurrentView(View.COMMUNITY)}
              />

              {/* 5. Messages */}
              <NavButton
                active={currentView === View.NOTIFICATIONS}
                icon="chat_bubble"
                onClick={() => setCurrentView(View.NOTIFICATIONS)}
              />

              {/* 6. Profile */}
              <NavButton
                active={currentView === View.PROFILE}
                icon="person"
                onClick={() => setCurrentView(View.PROFILE)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const NavButton = ({ active, icon, onClick }: { active: boolean; icon: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-12 h-10 gap-1 transition-colors duration-300 ${active ? 'text-primary' : 'text-gray-600 hover:text-gray-400'}`}
  >
    <span className={`material-symbols-outlined text-[26px] ${active ? 'filled' : ''}`}>{icon}</span>
  </button>
);