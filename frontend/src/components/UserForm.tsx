import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CreateUserProfileDTO, userData } from '../types/types';
import { postToApi } from '../api/postData';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus } from 'lucide-react';

export const UserForm: React.FC = () => {
  const { loginAs } = useAuth();
  const [formData, setFormData] = useState<CreateUserProfileDTO>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    timeZone: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({ text: 'Lösenorden matchar inte.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const created = await postToApi<userData>("user/register", formData);

      await loginAs(created.id);
        
      setStatusMessage({ text: 'Användarprofilen har skapats och du är nu inloggad!', type: 'success' });
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        timeZone: '',
      });
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Ett oväntat fel uppstod.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 relative">
      <Link 
        to="/users"
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
        aria-label="Stäng"
      >
        <X className="w-5 h-5" />
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
        Skapa Profil
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            E-post
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="anna.svensson@example.com"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Förnamn
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Förnamn"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Efternamn
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Efternamn"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Lösenord
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Lösenord"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Upprepa lösenord
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Upprepa lösenord"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Telefonnummer
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="(valfritt)"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="timeZone" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Tidszon
            </label>
            <input
              type="text"
              id="timeZone"
              name="timeZone"
              placeholder="Europe/Stockholm"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
              value={formData.timeZone}
              onChange={handleChange}
            />
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 rounded-lg text-sm font-medium border ${
              statusMessage.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            to="/users"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full text-sm transition"
          >
            Avbryt
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0058a3] hover:bg-[#004f93] text-white font-bold rounded-full text-sm transition shadow-xs disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Skapar...' : 'Skapa Användare'}
          </button>
        </div>
      </form>
    </div>
  );
};