import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, User, LogOut, Menu, Key } from "lucide-react";
import toast from "react-hot-toast";
import ChangePasswordModal from "./ChangePasswordModal";

const CleanHeader = ({ user, onLogout, onToggleSidebar }) => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogoutClick = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-100 rounded-lg">
            <LogOut className="w-4 h-4 text-red-600" />
          </div>
          <p className="font-bold text-gray-900 text-sm">Tizimdan chiqmoqchimisiz?</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onLogout();
            }}
            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all shadow-sm"
          >
            Ha, chiqish
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      className: 'border-2 border-red-50/50 shadow-2xl rounded-2xl',
    });
  };

  const getPageTitle = () => {
    const titles = {
      "/dashboard": "Dashboard",
      "/students": "istamolchilar",
      "/staff": "Hodimlar",
      "/attendance": "Davomat",
      "/classes": "Sinflar",
      "/notifications": "Bildirishnomalar",
      "/reports": "Hisobotlar",
      "/settings": "Sozlamalar",
    };
    return titles[location.pathname] || "Dashboard";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Menu & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="min-w-0 flex-1">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight truncate">
              {getPageTitle()}
            </h1>
            <p className="hidden xs:block text-[10px] md:text-sm text-gray-500 mt-0.5 truncate">
            {currentTime.toLocaleDateString("uz-UZ", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {" • "}
            {currentTime.toLocaleTimeString("uz-UZ", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4.5 h-4.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Qidirish..."
              className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 border-l border-gray-200">
            <div 
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-indigo-100 group"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900">
                  {user?.username || "Admin"}
                </p>
                <p className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md inline-block uppercase tracking-wider">
                  {user?.role || "Administrator"}
              </p>
              </div>
              <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all ml-1" title="Parolni o'zgartirish">
                <Key className="w-4 h-4" />
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              className="p-2 md:p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-200"
              title="Chiqish"
            >
              <LogOut className="w-4.5 h-4.5 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </header>
  );
};

export default CleanHeader;

