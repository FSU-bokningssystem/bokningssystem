import React, { useState } from 'react';
import type { userData } from '../../types/types';
import { putToApi } from '../../api/putData';
import { X, Save, Eye, EyeOff } from 'lucide-react';

interface EditUserModalProps {
  user: userData & { phoneNumber?: string };
  onClose: () => void;
  onUserUpdated?: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUserUpdated }) => {
  const initialPhone = user.phone || user.phoneNumber || '';

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: initialPhone,
    timeZone: user.timeZone || '',
    password: '',
    confirmPassword: '',
  });

  const [showPasswordText, setShowPasswordText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validera endast om användaren har skrivit något i lösenordsfälten
    const isPasswordFilled = formData.password.trim() !== '' || formData.confirmPassword.trim() !== '';

    if (isPasswordFilled) {
      if (formData.password !== formData.confirmPassword) {
        setStatusMessage({ text: 'Lösenorden matchar inte.', type: 'error' });
        return;
      }
    }

    // Jämför om profilen eller lösenordet faktiskt har ändrats
    const isProfileChanged =
      formData.firstName !== (user.firstName || '') ||
      formData.lastName !== (user.lastName || '') ||
      formData.email !== (user.email || '') ||
      formData.phoneNumber !== initialPhone ||
      formData.timeZone !== (user.timeZone || '');

    const isPasswordChanged = formData.password.trim() !== '';

    // Om ingenting har ändrats – avbryt och stäng utan anrop till databasen
    if (!isProfileChanged && !isPasswordChanged) {
      onClose();
      return;
    }

    setLoading(true);

    try {
      await putToApi(`user/${user.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        timeZone: formData.timeZone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (onUserUpdated) onUserUpdated();
      onClose();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Kunde inte uppdatera användaren.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Redigera användare</h3>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              E-post
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
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
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
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
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Valfria lösenordsfält */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Nytt Lösenord <span className="text-[10px] text-gray-400 font-normal lowercase"></span>
              </label>
              <div className="relative">
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Valfritt"
                  className="w-full px-3.5 py-2 pr-10 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Upprepa lösenord
              </label>
              <input
                type={showPasswordText ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Valfritt"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
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
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
                value={formData.timeZone}
                onChange={handleChange}
              />
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-sm font-medium border ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#0058a3] hover:bg-[#004f93] rounded-full transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Sparar...' : 'Spara ändringar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;