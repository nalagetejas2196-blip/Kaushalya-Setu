import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Bell,
  Menu,
  X,
  User,
  Compass,
  Briefcase,
  BookOpen,
  Award,
  GitPullRequest,
  CheckCircle2,
  FileCheck,
  BarChart3,
  HelpCircle,
  LogOut,
  Mic
} from 'lucide-react';

export default function GovHeader({ onOpenVoice }) {
  const { lang, t } = useLanguage();
  const { user, logout, isBeneficiary, isOfficer, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b-2 border-[#0B3C5D] shadow-sm sticky top-0 z-40">
      {/* Official Branding Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          {/* Government Emblem / Bridge Symbol */}
          <div className="w-12 h-12 bg-gradient-to-br from-gov-navy to-gov-navy-light rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-inner border border-gov-saffron">
            <span className="text-gov-saffron">क</span><span className="text-white text-base">स</span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gov-navy tracking-tight group-hover:text-gov-navy-light">
                {t('app_name')}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                PM-AJAY / GIA
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {t('app_tagline')} &bull; <span className="text-gov-saffron-dark font-medium">{t('gov_india')}</span>
            </p>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Voice Assistant Shortcut Button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gov-saffron to-amber-500 text-slate-900 font-bold text-xs shadow hover:shadow-md transition active:scale-95"
            title="Open Kaushalya Sahayak Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">कौशल्य सहायक (Voice)</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(prev => !prev)}
              className="relative p-2 rounded-full text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="bg-gov-navy text-white px-4 py-2.5 flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-gov-saffron" />
                    Notifications / सूचना ({notifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-gov-saffron hover:underline text-[11px]"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No notifications yet / कोणतीही नवीन सूचना नाही.
                    </div>
                  ) : (
                    notifications.map(notif => {
                      const title = lang === 'mr' ? notif.title_mr || notif.title : (lang === 'hi' ? notif.title_hi || notif.title : notif.title);
                      const msg = lang === 'mr' ? notif.message_mr || notif.message : (lang === 'hi' ? notif.message_hi || notif.message : notif.message);
                      return (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                            !notif.read ? 'bg-blue-50/60 font-semibold' : 'text-slate-600'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-gov-navy font-bold">{title}</span>
                            {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></span>}
                          </div>
                          <p className="mt-0.5 text-slate-700 text-[11px] leading-relaxed">{msg}</p>
                          <span className="mt-1 block text-[10px] text-slate-400">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Close / बंद करा
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Status / Login Button */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to={isOfficer ? '/officer' : (isAdmin ? '/analytics' : '/dashboard')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200"
              >
                <User className="w-3.5 h-3.5 text-gov-navy" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-500 hover:text-red-600 rounded"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded bg-gov-navy text-white text-xs font-bold hover:bg-gov-navy-light transition"
            >
              {t('login')}
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-1.5 text-slate-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gov-navy" />}
          </button>
        </div>
      </div>

      {/* Official Notification Marquee */}
      <div className="bg-slate-100 border-t border-b border-slate-200 px-4 py-1 flex items-center text-xs text-slate-700">
        <span className="bg-gov-navy text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase flex-shrink-0 mr-2">
          महत्वाचे / Notice
        </span>
        <div className="overflow-hidden whitespace-nowrap">
          <p className="inline-block animate-marquee font-medium text-slate-800">
            📢 PM-AJAY Special Skill Drive 2026: 100% sponsored training in Solar PV & Agro-Mechanics at Govt ITI Sangamner & KVK Rahata with ₹1,500 monthly stipend for SC youth &bull; Online verification active for Ahilyanagar & Nashik districts &bull; No middlemen required.
          </p>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav aria-label="Main Navigation" className="bg-[#0B3C5D] text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto text-xs font-medium">
          <Link
            to="/"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_home')}
          </Link>

          {user && isBeneficiary && (
            <Link
              to="/dashboard"
              className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
                isActive('/dashboard') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
              }`}
            >
              {t('nav_dashboard')}
            </Link>
          )}

          <Link
            to="/skills"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/skills') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_skills')}
          </Link>

          <Link
            to="/skill-gap"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/skill-gap') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_skill_gap')}
          </Link>

          <Link
            to="/simulator"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/simulator') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_simulator')}
          </Link>

          <Link
            to="/schemes"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/schemes') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_schemes')}
          </Link>

          <Link
            to="/opportunities"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/opportunities') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_opportunities')}
          </Link>

          <Link
            to="/track"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/track') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_track')}
          </Link>

          {(isOfficer || isAdmin) && (
            <Link
              to="/officer"
              className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
                isActive('/officer') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-emerald-300 hover:text-white hover:bg-gov-navy-dark'
              }`}
            >
              🏛️ {t('nav_officer')}
            </Link>
          )}

          <Link
            to="/analytics"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/analytics') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_analytics')}
          </Link>

          <Link
            to="/help"
            className={`px-3 py-2.5 transition whitespace-nowrap border-b-2 ${
              isActive('/help') ? 'border-gov-saffron bg-gov-navy-light text-white font-bold' : 'border-transparent text-slate-200 hover:text-white hover:bg-gov-navy-dark'
            }`}
          >
            {t('nav_help')}
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gov-navy text-white px-4 pt-2 pb-4 space-y-1 text-sm border-t border-slate-600">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_home')}</Link>
          {user && isBeneficiary && (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_dashboard')}</Link>
          )}
          <Link to="/skills" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_skills')}</Link>
          <Link to="/skill-gap" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_skill_gap')}</Link>
          <Link to="/simulator" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_simulator')}</Link>
          <Link to="/schemes" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_schemes')}</Link>
          <Link to="/opportunities" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_opportunities')}</Link>
          <Link to="/track" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_track')}</Link>
          {(isOfficer || isAdmin) && (
            <Link to="/officer" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded bg-emerald-800 text-white font-semibold">🏛️ {t('nav_officer')}</Link>
          )}
          <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_analytics')}</Link>
          <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gov-navy-light">{t('nav_help')}</Link>
        </div>
      )}
    </header>
  );
}
