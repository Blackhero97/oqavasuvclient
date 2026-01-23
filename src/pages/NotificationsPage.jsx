import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  MessageSquare,
  Phone,
  Mail,
  Plus,
  SendHorizontal,
  Users,
  UserCheck,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api`;

const NotificationsPage = () => {
  const [loading, setLoading] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState({
    active: false,
    botConfigured: false,
    chatIdSet: false,
  });
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [notifications] = useState([
    {
      id: 1,
      type: "sms",
      recipient: "Ali Valiyev ota-onasi",
      message: "Bugun davomat: Kelgan",
      date: "2026-01-23 09:30",
      status: "sent",
    },
    {
      id: 2,
      type: "telegram",
      recipient: "O'qituvchilar Guruhi",
      message: "Ertalabki davomat hisoboti yuborildi",
      date: "2026-01-23 09:02",
      status: "sent",
    },
  ]);

  const [templates] = useState([
    {
      id: 1,
      name: "Davomat (Ota-onaga)",
      content: "Hurmatli ota-ona, {student} bugun maktabga {status} vaqtda keldi.",
    },
    {
      id: 2,
      name: "Yig'ilish (O'qituvchilarga)",
      content: "Hurmatli hamkasblar, bugun soat {time} da majlis bo'lib o'tadi.",
    },
  ]);

  const [formData, setFormData] = useState({
    type: "Telegram",
    recipient: "all_students",
    template: "",
    message: "",
  });

  useEffect(() => {
    fetchTelegramStatus();
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/classes`);
      // handle different response formats
      const classData = response.data.classes || response.data;
      setClasses(Array.isArray(classData) ? classData : []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchTelegramStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${API_URL}/notifications/telegram/status`;
      console.log("🔍 Fetching telegram status from:", url);

      // TEST PING
      try {
        const pingResponse = await axios.get(`${API_URL}/notifications/ping`);
        console.log("🏓 Ping response:", pingResponse.data);
      } catch (e) {
        console.warn("🏓 Ping failed:", e.message);
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTelegramStatus(response.data);
    } catch (error) {
      console.error("Telegram status error:", error);
    }
  };

  const handleSendTelegramReport = async (role) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/notifications/telegram/attendance`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleSendClassReport = async () => {
    if (!selectedClass) {
      toast.error("Iltimos, sinf tanlang");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/notifications/telegram/class-attendance`,
        { className: selectedClass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSend = async () => {
    if (!formData.message) {
      toast.error("Xabar matnini kiriting");
      return;
    }
    toast.success("Xabar yuborish jarayoni boshlandi (Simulyatsiya)");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bildirishnomalar</h1>
            <p className="text-sm text-gray-500 mt-1">Avtomatik va qo'lda xabarnomalar yuborish tizimi</p>
          </div>

          {/* Telegram Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${telegramStatus.active
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-red-50 text-red-700 border-red-100"
            }`}>
            <div className={`w-2 h-2 rounded-full ${telegramStatus.active ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></div>
            Telegram Bot: {telegramStatus.active ? "Ulangan" : "Ulanmagan"}
          </div>
        </div>

        {/* Quick Actions Support */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">O'quvchilar Davomati</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Barcha o'quvchilarning bugungi davomat hisobotini darhol yuboring.</p>
            <button
              disabled={loading}
              onClick={() => handleSendTelegramReport('student')}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <SendHorizontal className="w-4 h-4" />
              Telegramga Yuborish
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">O'qituvchilar Davomati</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">O'qituvchilarning bugungi keldi-ketdi hisobotini guruhga yuboring.</p>
            <button
              disabled={loading}
              onClick={() => handleSendTelegramReport('teacher')}
              className="w-full py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <SendHorizontal className="w-4 h-4" />
              Telegramga Yuborish
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Sinfboyicha Davomat</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Tanlangan sinf uchun bugungi davomat hisobotini yuboring.</p>

            <div className="flex gap-2 mb-4">
              <select
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
                onChange={(e) => setSelectedClass(e.target.value)}
                value={selectedClass}
              >
                <option value="">Sinf tanlang</option>
                {classes.map(c => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              disabled={loading || !selectedClass}
              onClick={() => handleSendClassReport()}
              className="w-full py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <SendHorizontal className="w-4 h-4" />
              Sinfboyicha Yuborish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Message Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Xabar Yuborish</h2>
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transport</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option>Telegram</option>
                    <option>SMS</option>
                    <option>Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Qabul qiluvchi</label>
                  <select
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="all_students">Barcha O'quvchilar</option>
                    <option value="all_teachers">Barcha O'qituvchilar</option>
                    <option value="staff">Barcha Hodimlar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mavzu / Shablon</label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Shablonsiz</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Xabar matni</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  rows="5"
                  placeholder="Xabarni shu yerda yozing..."
                ></textarea>
              </div>

              <button
                onClick={handleManualSend}
                className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#004A77" }}
              >
                <Send className="w-4 h-4" />
                Xabar Yuborish
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Oxirgi Xabarlar</h2>
              <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400">
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${notif.type === 'telegram' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                        {notif.type === 'telegram' ? <SendHorizontal className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{notif.recipient}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] uppercase font-bold text-gray-400">{notif.type}</span>
                          <span className="text-[10px] text-gray-300">•</span>
                          <span className="text-[10px] text-gray-400">{notif.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg uppercase">
                      {notif.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-12">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
