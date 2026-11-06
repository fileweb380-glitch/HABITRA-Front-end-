import React from 'react';
import Input from '../common/Input';

export default function ScheduleTimeInput({ value, onChange }) {
  return <Input type="time" label="Start Time" value={value} onChange={onChange} />;
}