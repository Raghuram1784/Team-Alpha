import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Batch() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    batch: '',
    joining_date: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const batches = [
    'Morning (9 AM - 12 PM)',
    'Afternoon (2 PM - 5 PM)',
    'Evening (6 PM - 9 PM)',
    'Weekend (Sat-Sun 10 AM - 5 PM)'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setError('Student ID is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(`http://localhost:5000/api/students/${id}/batch`, formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      <div className="fixed top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="max-w-md mx-auto pt-16 px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-8 text-center">
          Select Your Batch
        </h1>

        {success ? (
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-6">
            <p className="text-green-700 dark:text-green-100">
              Batch selection confirmed! Check your email for details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
                <p className="text-red-700 dark:text-red-100">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Select Batch
              </label>
              <select
                required
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full p-2 border rounded-md dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              >
                <option value="">Choose a batch</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Joining Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full p-2 border rounded-md dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full p-3 rounded-md bg-accent text-white font-medium 
                ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              {submitting ? 'Submitting...' : 'Confirm Batch'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}