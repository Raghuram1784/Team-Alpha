import { useState } from 'react';
import axios from 'axios';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await axios.post('http://localhost:5000/api/students', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', course: '' });
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
          Student Registration
        </h1>

        {success ? (
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-6">
            <p className="text-green-700 dark:text-green-100">
              Registration successful! Check your email for confirmation.
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
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-md dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-md dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded-md dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Course
              </label>
              <select
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full p-2 border rounded-md dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              >
                <option value="">Select a course</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full p-3 rounded-md bg-accent text-white font-medium 
                ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              {submitting ? 'Submitting...' : 'Register Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}