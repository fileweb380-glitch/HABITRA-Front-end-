import React from 'react';
import CommitmentCard from './CommitmentCard';
import EmptyState from '../common/EmptyState';

export default function TodayCommitmentList({ commitments, onUpdateStatus }) {
  if (commitments.length === 0) {
    return <EmptyState message="No commitments scheduled for today." />;
  }

  return (
    <div>
      {commitments.map(c => (
        <CommitmentCard key={c._id} commitment={c} onUpdateStatus={onUpdateStatus} />
      ))}
    </div>
  );
}