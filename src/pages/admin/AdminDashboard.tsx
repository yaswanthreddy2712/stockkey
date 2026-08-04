import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Briefcase, Mail, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Clock, Eye, BarChart3, Zap } from 'lucide-react';
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

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, leadRes] = await Promise.all([
          fetch('/api/customers', {
            headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
          }),
          fetch('/api/leads', {
            headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
          })
        ]);
        
        if (custRes.ok) {
          const custData = await custRes.json();
          setCustomers(custData.customers || []);
        }
        
        if (leadRes.ok) {
          const leadData = await leadRes.json();
          setLeads(leadData.leads || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'from-blue-500 to-cyan-400', change: '+12%', up: true },
    { label: 'Active Leads', value: leads.filter(l => l.status === 'NEW' || l.status === 'CONTACTED').length, icon: TrendingUp, color: 'from-purple-500 to-pink-400', change: '+5%', up: true },
    { label: 'Portfolios', value: customers.filter(c => c.portfolio?.holdings?.length > 0).length, icon: Briefcase, color: 'from-emerald-500 to-teal-400', change: '+8%', up: true },
    { label: 'Emails Sent', value: leads.length * 3, icon: Mail, color: 'from-orange-500 to-amber-400', change: '+24%', up: true }
  ];

  const recentActivity = [
    { text: 'New customer registered: Rahul Sharma', time: '2 min ago', icon: Users, color: 'text-blue-400' },
    { text: 'Portfolio updated: Equity allocation changed', time: '15 min ago', icon: Briefcase, color: 'text-purple-400' },
    { text: 'Lead contacted: Priya Patel responded', time: '1 hour ago', icon: Activity, color: 'text-emerald-400' },
    { text: 'Insurance claim processed: ₹50,000', time: '3 hours ago', icon: Zap, color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                <p className="text-xs text-gray-400">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/admin/customers" className="text-gray-400 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </Link>
              <Link to="/admin/leads" className="text-gray-400 hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </Link>
              <Link to="/admin/broadcast" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
              <button onClick={() => { logout(); navigate('/admin/login'); }} className="text-gray-400 hover:text-white transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeIn} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl" style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`}} />
              <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-800/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/customers" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Manage Customers</div>
                  <div className="text-xs text-gray-400">{customers.length} total</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors ml-auto" />
              </Link>

              <Link to="/admin/leads" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">View Leads</div>
                  <div className="text-xs text-gray-400">{leads.length} total</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors ml-auto" />
              </Link>

              <Link to="/admin/portfolios" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Portfolios</div>
                  <div className="text-xs text-gray-400">Manage holdings</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors ml-auto" />
              </Link>

              <Link to="/admin/broadcast" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <Mail className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Send Broadcast</div>
                  <div className="text-xs text-gray-400">Email customers</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors ml-auto" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Performance Chart Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Performance Overview</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Weekly</button>
              <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-400 hover:bg-gray-800/50 transition-colors">Monthly</button>
              <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-400 hover:bg-gray-800/50 transition-colors">Yearly</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border border-gray-800/30 rounded-xl bg-gray-800/20">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Performance chart coming soon</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
