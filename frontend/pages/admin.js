import { useState, useEffect } from 'react';
import axios from 'axios';
import DarkModeToggle from '../components/DarkModeToggle';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Joined: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

const StatsCard = ({ title, value, bgColor }) => (
  <div className={`${bgColor} p-6 rounded-lg shadow-sm`}>
    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/students');
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleMarkPaid = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/students/${id}/pay`);
      fetchStudents();
    } catch (err) {
      setError('Failed to update payment status');
    }
  };

  const stats = {
    total: students.length,
    pending: students.filter(s => s.status === 'Pending').length,
    paid: students.filter(s => s.status === 'Paid').length,
    joined: students.filter(s => s.status === 'Joined').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      <div className="fixed top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={stats.total}
            bgColor="bg-white dark:bg-dark-card"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            bgColor="bg-yellow-50 dark:bg-yellow-900/20"
          />
          <StatsCard
            title="Paid"
            value={stats.paid}
            bgColor="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatsCard
            title="Joined"
            value={stats.joined}
            bgColor="bg-green-50 dark:bg-green-900/20"
          />
        </div>

        {/* Students Table */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-text">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(student.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {student.status === 'Pending' && (
                      <button
                        onClick={() => handleMarkPaid(student._id)}
                        className="text-accent hover:text-blue-700 font-medium"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}