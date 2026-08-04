import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { TrendingUp, Search, Filter, Plus, Mail, Phone, Calendar, ArrowUpRight, LayoutDashboard, Users, Briefcase, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const statusConfig = {
  NEW: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Plus, label: 'New' },
  CONTACTED: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock, label: 'Contacted' },
  INTERESTED: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle, label: 'Interested' },
  CONVERTED: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: CheckCircle, label: 'Converted' },
  LOST: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle, label: 'Lost' }
};

export default function AdminLeads() {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/leads', {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);
    
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && lead.status === filterStatus;
  });

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: TrendingUp, color: 'from-blue-500 to-cyan-400' },
    { label: 'New', value: leads.filter(l => l.status === 'NEW').length, icon: Plus, color: 'from-indigo-500 to-blue-400' },
    { label: 'Interested', value: leads.filter(l => l.status === 'INTERESTED').length, icon: CheckCircle, color: 'from-emerald-500 to-teal-400' },
    { label: 'Converted', value: leads.filter(l => l.status === 'CONVERTED').length, icon: CheckCircle, color: 'from-purple-500 to-pink-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center hover:bg-gray-800 transition-colors">
                <LayoutDashboard className="w-5 h-5 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-white">Leads</h1>
                <p className="text-xs text-gray-400">Track and manage leads</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <Link to="/admin/customers" className="text-gray-400 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </Link>
              <Link to="/admin/broadcast" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
              <button onClick={() => { logout(); }} className="text-gray-400 hover:text-white transition-colors">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeIn} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search leads by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              >
                <option value="ALL">All Status</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="INTERESTED">Interested</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Leads Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {loading ? (
            <div className="col-span-full p-12 text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="col-span-full p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No leads found</p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const status = statusConfig[lead.status as keyof typeof statusConfig] || statusConfig.NEW;
              return (
                <motion.div 
                  key={lead._id}
                  whileHover={{ y: -2 }}
                  className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {lead.name?.charAt(0) || 'L'}
                      </div>
                      <div>
                        <div className="font-medium text-white">{lead.name}</div>
                        <div className="text-sm text-gray-400">{lead.email}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {lead.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                    {lead.message && (
                      <div className="text-sm text-gray-300 bg-gray-800/30 rounded-xl p-3">
                        "{lead.message}"
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-gray-900 border border-gray-800/50 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {selectedLead.name?.charAt(0) || 'L'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{selectedLead.name}</h3>
                      <p className="text-sm text-gray-400">{selectedLead.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Status</div>
                    <div className={`font-medium ${
                      selectedLead.status === 'CONVERTED' ? 'text-purple-400' :
                      selectedLead.status === 'INTERESTED' ? 'text-emerald-400' :
                      selectedLead.status === 'CONTACTED' ? 'text-amber-400' :
                      selectedLead.status === 'LOST' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {selectedLead.status || 'NEW'}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Phone</div>
                    <div className="text-white">{selectedLead.phone || 'Not provided'}</div>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Source</div>
                    <div className="text-white">{selectedLead.source || 'Direct'}</div>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Created</div>
                    <div className="text-white">{new Date(selectedLead.createdAt).toLocaleString()}</div>
                  </div>
                  {selectedLead.message && (
                    <div className="p-4 bg-gray-800/30 rounded-xl">
                      <div className="text-sm text-gray-400 mb-1">Message</div>
                      <div className="text-gray-200">"{selectedLead.message}"</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
