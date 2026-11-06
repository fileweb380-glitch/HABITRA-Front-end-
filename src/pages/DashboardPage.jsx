import React, { useState, useEffect } from 'react';
import { commitmentService } from '../features/commitments/commitmentService';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import TodayCommitmentList from '../components/dashboard/TodayCommitmentList';
import PlanTomorrowForm from '../components/planning/PlanTomorrowForm';
import MissedReasonForm from '../components/check-ins/MissedReasonForm';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { getCurrentDateString } from '../lib/dateTime';

export default function DashboardPage() {
  const [commitments, setCommitments] = useState([]);
  const [missedModalId, setMissedModalId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const todayStr = getCurrentDateString();

  const fetchCommitments = async () => {
    try {
      const data = await commitmentService.getCommitments(todayStr);
      setCommitments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCommitments();
  }, []);

  const handleCreate = async (data) => {
    try {
      await commitmentService.createCommitment(data);
      fetchCommitments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status, reasonData = {}) => {
    if (status === 'Missed' && !reasonData.reasonCode) {
      setMissedModalId(id);
      return;
    }
    try {
      const res = await commitmentService.updateStatus(id, { status, ...reasonData });
      if (status === 'Missed') {
        setToastMsg(res.message);
        setMissedModalId(null);
        setTimeout(() => setToastMsg(''), 5000);
      }
      fetchCommitments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Today Dashboard</h2>
      <Toast message={toastMsg} />
      <ProgressSummary commitments={commitments} />
      <PlanTomorrowForm onAdd={handleCreate} />
      <div style={{ marginTop: '2rem' }}>
        <h3>Today's Commitments</h3>
        <TodayCommitmentList commitments={commitments} onUpdateStatus={handleUpdateStatus} />
      </div>

      <Modal isOpen={Boolean(missedModalId)} onClose={() => setMissedModalId(null)}>
        <MissedReasonForm
          onCancel={() => setMissedModalId(null)}
          onSubmit={(reasonData) => handleUpdateStatus(missedModalId, 'Missed', reasonData)}
        />
      </Modal>
    </div>
  );
}