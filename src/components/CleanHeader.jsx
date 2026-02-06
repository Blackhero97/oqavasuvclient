import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, User, LogOut } from "lucide-react";

const CleanHeader = ({ user, onLogout }) => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentTime.toLocaleDateString("uz-UZ", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" • "}
            {currentTime.toLocaleTimeString("uz-UZ", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
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
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5  text-gray-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
              title="Chiqish"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CleanHeader;

