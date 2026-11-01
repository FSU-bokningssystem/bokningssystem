import React from 'react';
import { UserForm } from '../components/UserForm';

export const CreateUserPage: React.FC = () => {
  return (
    <main className="create-user-page">
      <UserForm />
    </main>
  );
};

export default CreateUserPage;