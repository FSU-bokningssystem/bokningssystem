import React, { useState } from 'react';
import type { CreateUserProfileDTO } from '../types/types';
import { postToApi } from '../api/postData';
import { useAuth } from '../context/AuthContext';
import styles from './UserForm.module.css';

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
    <div className={styles.container}>
      <h2 className={styles.title}>Skapa Profil</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.group}>
          <label htmlFor="email" className={styles.label}>E-post:</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="password" className={styles.label}>Lösenord:</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="confirmPassword" className={styles.label}>Upprepa lösenord:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={styles.input}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="firstName" className={styles.label}>Förnamn:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={styles.input}
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="lastName" className={styles.label}>Efternamn:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={styles.input}
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="phoneNumber" className={styles.label}>Telefonnummer:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className={styles.input}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="timeZone" className={styles.label}>Tidszon:</label>
          <input
            type="text"
            id="timeZone"
            name="timeZone"
            className={styles.input}
            value={formData.timeZone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Skapar...' : 'Skapa Användare'}
        </button>
      </form>

      {statusMessage && (
        <div
          className={`${styles.status} ${
            statusMessage.type === 'success' ? styles.statusSuccess : styles.statusError
          }`}
        >
          {statusMessage.text}
        </div>
      )}
    </div>
  );
};