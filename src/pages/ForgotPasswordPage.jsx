import React from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function ForgotPasswordPage() {
  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <h2>Forgot Password</h2>
      <form style={{ marginTop: '1rem' }}>
        <Input label="Email" type="email" required />
        <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Send Reset Link</Button>
      </form>
    </div>
  );
}