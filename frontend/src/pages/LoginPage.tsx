import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setAuth } from '../features/auth/authSlice';
import { apiClient } from '../services/apiClient';
import { FaLeaf } from 'react-icons/fa';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      dispatch(setAuth({ isAuthenticated: true, role: user.role, user }));
      
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/chat');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ayur-bg font-body p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-md border border-ayur-secondary/20 relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-primary/10 rounded-bl-full -mr-4 -mt-4 pointer-events-none" />
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-ayur-gradient rounded-full flex items-center justify-center shadow-md">
            <FaLeaf className="text-white text-3xl" />
          </div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-center text-ayur-dark mb-2">Welcome Back</h1>
        <p className="text-sm text-ayur-muted text-center mb-8">
          Sign in to continue your journey with AyurAI.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ayur-primary text-white py-3.5 rounded-xl text-sm font-bold shadow-lg hover:bg-ayur-dark hover:shadow-xl transition disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-sm text-ayur-muted text-center">
          New to AyurAI?{' '}
          <Link to="/register" className="text-ayur-primary font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

