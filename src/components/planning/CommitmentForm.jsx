import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

export default function CommitmentForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title }); }}>
      <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <Button type="submit">Save Commitment</Button>
    </form>
  );
}