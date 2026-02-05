import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setAuth } from '../features/auth/authSlice';
import { apiClient } from '../services/apiClient';
import { FaLeaf } from 'react-icons/fa';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    healthGoals: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        ...formData,
        age: Number(formData.age),
        healthGoals: formData.healthGoals.split(',').map(g => g.trim())
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);

      dispatch(setAuth({ 
        isAuthenticated: true, 
        role: user.role, 
        userId: user.id,
        displayName: user.name
      }));
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ayur-bg font-body p-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-lg border border-ayur-secondary/20 relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-primary/10 rounded-bl-full -mr-4 -mt-4 pointer-events-none" />
        
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-ayur-gradient rounded-full flex items-center justify-center shadow-md">
            <FaLeaf className="text-white text-2xl" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-center text-ayur-dark mb-2">Create Your Account</h1>
        <p className="text-sm text-ayur-muted text-center mb-8">
          Begin your journey to holistic wellness with AyuSuvidha.
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Full Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Age</label>
              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Health Goals</label>
            <input
              name="healthGoals"
              type="text"
              value={formData.healthGoals}
              onChange={handleChange}
              placeholder="e.g. Weight loss, Stress relief"
              className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ayur-primary text-white py-3.5 rounded-xl text-sm font-bold shadow-lg hover:bg-ayur-dark hover:shadow-xl transition disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
          >
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-sm text-ayur-muted text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-ayur-primary font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

