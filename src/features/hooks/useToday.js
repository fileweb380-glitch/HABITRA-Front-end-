import { useState, useEffect } from 'react';
import { commitmentService } from '../commitments/commitmentService';
import { getCurrentDateString } from '../../lib/dateTime';

export const useToday = () => {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchToday = async () => {
    try {
      const today = getCurrentDateString();
      const data = await commitmentService.getCommitments(today);
      setCommitments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  return { commitments, loading, refetch: fetchToday };
};