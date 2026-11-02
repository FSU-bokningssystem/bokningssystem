import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CreateUserProfileDTO } from '../types/types';
import { postToApi } from '../api/postData';
import { useAuth } from '../context/AuthContext';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Frontend-validering för lösenord
    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({ text: 'Lösenorden matchar inte.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const created = await postToApi("user/register", formData);

      // Logga in som den nyskapade användaren (backend returnerar time_zone, frontend använder timeZone)
      loginAs({
        id: created.id,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        phone: created.phone,
        timeZone: created.time_zone ?? created.timeZone,
      });

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
    <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-100 p-6 relative text-gray-800">
      {/* Kryss-knapp längst upp till höger som länkar tillbaka till /users */}
      <Link 
        to="/users"
        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-bold no-underline transition-colors"
        aria-label="Stäng"
      >
        ✕
      </Link>

      <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">
        Skapa Profil
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* E-post (Full bredd) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-post
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="E-postadress"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Förnamn & Efternamn bredvid varandra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Förnamn
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Förnamn"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Efternamn
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Efternamn"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Lösenord & Upprepa lösenord bredvid varandra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Lösenord"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Upprepa lösenord
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Upprepa lösenord"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Telefonnummer & Tidszon bredvid varandra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Telefonnummer
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="(valfritt)"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-1">
              Tidszon
            </label>
            <input
              type="text"
              id="timeZone"
              name="timeZone"
              placeholder="(valfritt)"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              value={formData.timeZone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Statusmeddelande */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg text-sm font-medium border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Knappar */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <span>+</span> {loading ? 'Skapar...' : 'Skapa Användare'}
          </button>
          
          {/* Avbryt-knapp som länkar tillbaka till /users */}
          <Link
            to="/users"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors inline-block text-center no-underline"
          >
            Avbryt
          </Link>
        </div>
      </form>
    </div>
  );
};