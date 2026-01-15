import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import logo from "../assets/main-logo.png";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const demoUsers = [
    { username: "admin", password: "admin123", role: "Administrator" },
    { username: "teacher", password: "teacher123", role: "O'qituvchi" },
    { username: "director", password: "director123", role: "Direktor" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Foydalanuvchi nomi talab qilinadi";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Parol talab qilinadi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user = demoUsers.find(
        (u) =>
          u.username === formData.username && u.password === formData.password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Muvaffaqiyatli kirildi!", {
          duration: 1500,
          position: "top-center",
        });
        setTimeout(() => {
          onLogin(user);
        }, 1000);
      } else {
        toast.error("Noto'g'ri foydalanuvchi nomi yoki parol", {
          duration: 3000,
          position: "top-center",
        });
        setErrors({
          general: "Noto'g'ri foydalanuvchi nomi yoki parol",
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (demoUser) => {
    setFormData({
      username: demoUser.username,
      password: demoUser.password,
    });
    toast.success(`${demoUser.role} hisobi tanlandi`, {
      duration: 2000,
      position: "top-center",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 py-6 relative overflow-hidden">
      {/* Snow Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const delay = Math.random() * 10;
          const duration = 12 + Math.random() * 4;
          const left = Math.random() * 100;

          return (
            <div
              key={i}
              className="absolute text-white opacity-60"
              style={{
                left: `${left}%`,
                top: "-10px",
                animation: `snowfall ${duration}s linear ${delay}s infinite`,
                fontSize: "1.3rem",
                textShadow: "0 0 8px rgba(0,0,0,0.1)",
              }}
            >
              ❄
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes snowfall {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>

      <div className="w-full max-w-sm relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <img src={logo} alt="BM Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">BM Maktab CRM</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Ta'lim Boshqaruv Tizimi
          </p>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">
            Tizimga kirish
          </h2>
          <p className="text-xs text-gray-500">
            Tizimga kirttish uchun ma'lumotlarni kiriting
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Foydalanuvchi nomi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm transition-colors ${
                  errors.username
                    ? "border-red-300 bg-red-50 text-gray-900"
                    : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-blue-500"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Username"
              />
            </div>
            {errors.username && (
              <p className="mt-0.5 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Parol
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-9 pr-9 py-2.5 border rounded-lg text-sm transition-colors ${
                  errors.password
                    ? "border-red-300 bg-red-50 text-gray-900"
                    : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-blue-500"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-0.5 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Tekshirilmoqda...</span>
              </>
            ) : (
              <>
                <span>Kirish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>

        {/* Demo Accounts */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">
            Test hisoblar:
          </p>
          <div className="space-y-1.5">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(user)}
                className="w-full text-left p-2.5 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors text-xs"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{user.role}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {user.username}
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">© 2025 BM Maktab CRM</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
