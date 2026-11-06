import React from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function ResetPasswordPage() {
  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <h2>Reset Password</h2>
      <form style={{ marginTop: '1rem' }}>
        <Input label="New Password" type="password" required />
        <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Update Password</Button>
      </form>
    </div>
  );
}