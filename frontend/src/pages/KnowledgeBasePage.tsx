import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUpload, FaFilePdf, FaFileAlt, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import { apiClient } from '../services/apiClient';

export const KnowledgeBasePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState('');
  const [category, setCategory] = useState('General');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_id', docId || file.name);
    formData.append('category', category);

    try {
      const res = await apiClient.post('/ai/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = res.data;
      setStatus({ type: 'success', msg: `Document indexed! ID: ${data.doc_id}, Chunks: ${data.chunks}` });
      setFile(null);
      setDocId('');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Failed to upload document. Ensure backend is running.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg font-body p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/admin/docs" className="inline-flex items-center gap-2 text-ayur-muted hover:text-ayur-primary mb-6 text-sm font-semibold transition">
          <FaArrowLeft /> Back to Admin
        </Link>

        <h1 className="text-3xl font-heading font-bold text-ayur-dark mb-2 flex items-center gap-3">
          <FaUpload className="text-ayur-primary" /> Upload Knowledge
        </h1>
        <p className="text-ayur-muted mb-8 text-sm">Add PDF or Text documents to expand AyurAI's wisdom.</p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-lg border border-ayur-secondary/20 relative overflow-hidden"
        >
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-primary/5 rounded-bl-full -mr-4 -mt-4 pointer-events-none" />

          <form onSubmit={handleUpload} className="space-y-6 relative z-10">
            
            {/* File Drop Area */}
            <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer relative group ${
              file ? 'border-ayur-primary bg-ayur-primary/5' : 'border-gray-200 hover:border-ayur-primary/50 hover:bg-gray-50'
            }`}>
              <input 
                type="file" 
                accept=".pdf,.txt" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex flex-col items-center text-ayur-primary">
                  {file.name.endsWith('.pdf') ? <FaFilePdf className="text-4xl mb-3" /> : <FaFileAlt className="text-4xl mb-3" />}
                  <span className="font-bold text-lg">{file.name}</span>
                  <span className="text-xs text-ayur-muted mt-1">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-ayur-muted group-hover:text-ayur-primary transition">
                  <FaUpload className="text-4xl mb-3 opacity-50" />
                  <span className="font-semibold">Click or Drag to Upload PDF/TXT</span>
                  <span className="text-xs mt-1 opacity-60">Max size 10MB</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Document ID (Optional)</label>
                <input 
                  type="text" 
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  placeholder="e.g. charaka-samhita-ch1"
                  className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ayur-muted uppercase tracking-wide mb-2">Category</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-ayur-light border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 appearance-none cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Treatments">Treatments</option>
                    <option value="Philosophy">Philosophy</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!file || uploading}
              className="w-full bg-ayur-primary text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-ayur-dark hover:shadow-xl disabled:opacity-70 transition flex justify-center items-center gap-2"
            >
              {uploading ? (
                <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> Uploading...</>
              ) : (
                'Upload to Knowledge Base'
              )}
            </button>
          </form>

          {status && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {status.type === 'success' ? <FaCheckCircle className="shrink-0" /> : <FaExclamationCircle className="shrink-0" />}
              {status.msg}
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
};
