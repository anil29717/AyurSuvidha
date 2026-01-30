import { Link, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { FaChartBar, FaUsers, FaDatabase, FaServer, FaChartLine, FaUserShield, FaTrash, FaCommentDots, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { io, Socket } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

type StatusLevel = 'healthy' | 'warning' | 'down';
type UserRole = 'user' | 'admin' | 'super_admin';

let socket: Socket;

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface Document {
  doc_id: string;
  category: string;
  chunks: number;
}

interface ChatLog {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  sender: 'user' | 'bot';
  content: string;
  citations: any[];
  timestamp: string;
}

interface ServiceStatus {
  status: StatusLevel;
  latencyMs?: number;
  detail?: string;
  extra?: Record<string, unknown>;
}

interface HealthSnapshot {
  backend: ServiceStatus;
  ai: ServiceStatus;
  mongo?: ServiceStatus;
  redis?: ServiceStatus;
}

function StatusBadge({ level }: { level: StatusLevel }) {
  const map: Record<StatusLevel, string> = {
    healthy: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-800',
    down: 'bg-red-100 text-red-700'
  };
  const label: Record<StatusLevel, string> = {
    healthy: 'Healthy',
    warning: 'Warning',
    down: 'Down'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${map[level]}`}>
      {label[level]}
    </span>
  );
}

function AdminOverview() {
  const [snapshot, setSnapshot] = useState<HealthSnapshot | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/admin/status');
      setSnapshot(res.data?.snapshot);
      setTimestamp(res.data?.timestamp);
    } catch (err: any) {
      setError('Unable to load system status. Ensure backend and AI service are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load via API
    loadStatus();

    // Listen for real-time updates
    if (socket) {
      socket.on('system_status', (data) => {
        setSnapshot(data.snapshot);
        setTimestamp(data.timestamp);
      });

      socket.on('active_users', (data) => {
        setActiveUsers(data.count);
      });
    }

    return () => {
      if (socket) {
        socket.off('system_status');
        socket.off('active_users');
      }
    };
  }, []);

  const cards = [
    {
      key: 'backend',
      label: 'Backend API',
      description: 'Node/Express service handling REST, auth glue and orchestration.',
      status: snapshot?.backend
    },
    {
      key: 'ai',
      label: 'AI Service',
      description: 'FastAPI RAG pipeline and embeddings.',
      status: snapshot?.ai
    },
    {
      key: 'mongo',
      label: 'MongoDB',
      description: 'Primary data store for users, chats and logs.',
      status: snapshot?.mongo
    },
    {
      key: 'redis',
      label: 'Redis',
      description: 'Cache, rate limiting and queues.',
      status: snapshot?.redis
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1 text-ayur-dark">Dashboard Overview</h2>
          <div className="flex items-center gap-3 text-xs text-gray-600">
             <span>Live health snapshot. Auto-updates via WebSocket.</span>
             <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
               {activeUsers} Active Users
             </span>
          </div>
        </div>
        <button
          onClick={loadStatus}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-ayur-primary text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {timestamp && (
        <p className="text-[10px] text-gray-500 mb-3">Last updated: {new Date(timestamp).toLocaleTimeString()}</p>
      )}
      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div key={card.key} className="border rounded-2xl p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-ayur-dark">{card.label}</h3>
              {card.status ? (
                <StatusBadge level={card.status.status} />
              ) : (
                <span className="text-[10px] text-gray-400">No data</span>
              )}
            </div>
            <p className="text-[11px] text-gray-700 mb-2">{card.description}</p>
            {card.status && (
              <div className="text-[10px] text-gray-600 space-y-1">
                {typeof card.status.latencyMs === 'number' && (
                  <p>Latency: {card.status.latencyMs} ms</p>
                )}
                {card.status.detail && <p>Detail: {card.status.detail}</p>}
                {card.key === 'ai' && card.status.extra && (
                  <div>
                    <p>
                      Vectors: {(card.status.extra.vectors as number) ?? '—'} | Model:{' '}
                      {(card.status.extra.embeddings_model as string) ?? '—'}
                    </p>
                    <p className="mt-1 flex items-center gap-2">
                       LLM: {(card.status.extra.llm_provider as string) ?? 'None'}
                       <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                         card.status.extra.llm_connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {card.status.extra.llm_connected ? 'Connected' : 'Missing Key'}
                       </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, newRole: UserRole) => {
    try {
      await apiClient.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-ayur-dark">User Management</h2>
        <button onClick={fetchUsers} className="text-sm text-ayur-primary hover:underline">Refresh List</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'super_admin' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user._id, e.target.value as UserRole)}
                      className="border rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-ayur-primary"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocumentManagement() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/docs');
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document from the Knowledge Base?')) return;
    try {
      await apiClient.delete(`/admin/docs/${encodeURIComponent(docId)}`);
      setDocs(docs.filter(d => d.doc_id !== docId));
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-ayur-dark">Knowledge Base Management</h2>
        <div className="flex gap-4">
           <Link to="/upload" className="bg-ayur-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-ayur-dark">
             Upload New Document
           </Link>
           <button onClick={fetchDocs} className="text-sm text-ayur-primary hover:underline">Refresh List</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
            <tr>
              <th className="px-6 py-3">Document ID / Source</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Chunks</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading documents...</td></tr>
            ) : docs.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No documents indexed.</td></tr>
            ) : (
              docs.map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{doc.doc_id}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{doc.chunks}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDelete(doc.doc_id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                      title="Delete Document"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AIReviewInterface() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-ayur-dark">AI Response Review</h2>
        <button onClick={fetchLogs} className="text-sm text-ayur-primary hover:underline">Refresh Logs</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Sender</th>
              <th className="px-6 py-3">Content</th>
              <th className="px-6 py-3">Citations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No chat logs found.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {log.userId?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      log.sender === 'bot' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.sender.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={log.content}>
                    {log.content}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {log.citations?.length || 0} Sources
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface AuditLog {
  _id: string;
  action: string;
  actor: {
    id: string;
    email: string;
    role: string;
    ip: string;
  };
  target: string;
  details: any;
  timestamp: string;
}

function SystemLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/audit');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes('LOGIN')) return 'text-green-400';
    if (action.includes('SIGNUP')) return 'text-blue-400';
    if (action.includes('DELETE')) return 'text-red-400';
    if (action.includes('UPDATE')) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-ayur-dark">System Audit Logs</h2>
        <button onClick={fetchLogs} className="text-sm text-ayur-primary hover:underline">Refresh Logs</button>
      </div>
      
      <div className="bg-gray-900 text-gray-200 p-4 rounded-xl font-mono text-xs h-[500px] overflow-y-auto shadow-inner border border-gray-800">
        {loading ? (
           <p className="text-gray-500 italic">Loading logs...</p>
        ) : logs.length === 0 ? (
           <p className="text-gray-500 italic">No activity recorded yet.</p>
        ) : (
           logs.map((log) => (
             <div key={log._id} className="mb-2 border-b border-gray-800 pb-2 last:border-0 hover:bg-gray-800/50 p-1 rounded transition">
               <div className="flex gap-2">
                 <span className="text-gray-500 w-36 shrink-0">[{new Date(log.timestamp).toLocaleString()}]</span>
                 <span className={`font-bold w-24 shrink-0 ${getActionColor(log.action)}`}>{log.action}</span>
                 <span className="text-gray-300 flex-1">
                   <span className="text-indigo-300">{log.actor?.email || 'System'}</span> 
                   <span className="text-gray-500 mx-1">→</span> 
                   <span className="text-emerald-300">{log.target}</span>
                 </span>
               </div>
               {log.details && Object.keys(log.details).length > 0 && (
                 <div className="ml-[14.5rem] text-gray-500 mt-1">
                   {JSON.stringify(log.details)}
                 </div>
               )}
             </div>
           ))
        )}
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-ayur-dark mb-6">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
           <h3 className="text-gray-500 text-xs uppercase font-bold tracking-wider">Total Requests</h3>
           <p className="text-3xl font-bold text-ayur-primary mt-2">1,284</p>
           <p className="text-green-500 text-xs mt-1">↑ 12% from yesterday</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
           <h3 className="text-gray-500 text-xs uppercase font-bold tracking-wider">Avg Response Time</h3>
           <p className="text-3xl font-bold text-purple-600 mt-2">245ms</p>
           <p className="text-gray-400 text-xs mt-1">Stable</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
           <h3 className="text-gray-500 text-xs uppercase font-bold tracking-wider">Error Rate</h3>
           <p className="text-3xl font-bold text-red-500 mt-2">0.2%</p>
           <p className="text-green-500 text-xs mt-1">↓ 0.1% from last week</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 h-64 flex items-center justify-center text-gray-400">
        Chart placeholder (integrate Recharts or Chart.js here)
      </div>
    </div>
  );
}

export function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    // Initialize admin socket connection
    socket = io('http://localhost:2021', {
      withCredentials: true
    });

    socket.emit('join_admin');

    socket.on('new_user', (data) => {
      toast.success(`New User Registered: ${data.name} (${data.email})`, {
        duration: 5000,
        position: 'top-right',
        icon: '👋',
        style: {
          background: '#E8F5E9',
          color: '#2C3E50',
          border: '1px solid #6CA651'
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const navItems = [
    { path: '/admin', label: 'Dashboard Overview', icon: <FaChartBar /> },
    { path: '/admin/users', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin/docs', label: 'Knowledge Base', icon: <FaDatabase />, disabled: false },
    { path: '/admin/reviews', label: 'AI Reviews', icon: <FaCommentDots />, disabled: false },
    { path: '/admin/logs', label: 'System Logs', icon: <FaServer />, disabled: false },
    { path: '/admin/analytics', label: 'Analytics', icon: <FaChartLine />, disabled: false },
  ];
  
  return (
    <div className="min-h-screen flex bg-ayur-bg font-body">
      <aside className="w-64 bg-white shadow-xl flex flex-col border-r border-ayur-secondary/20 z-10">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-ayur-gradient rounded-full flex items-center justify-center text-white shadow-sm">
             <FaUserShield />
          </div>
          <h1 className="font-heading font-bold text-ayur-dark text-lg">Admin Portal</h1>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            item.disabled ? (
              <span key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl text-ayur-muted/50 cursor-not-allowed text-sm font-medium">
                {item.icon} {item.label}
              </span>
            ) : (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  location.pathname === item.path 
                    ? 'bg-ayur-primary text-white shadow-md' 
                    : 'text-ayur-muted hover:bg-ayur-light hover:text-ayur-dark'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            )
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto bg-ayur-bg">
        <Toaster />
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/docs" element={<DocumentManagement />} />
            <Route path="/reviews" element={<AIReviewInterface />} />
            <Route path="/logs" element={<SystemLogs />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
          <Outlet />
        </div>
      </main>
    </div>
  );
}


