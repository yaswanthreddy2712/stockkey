import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { Briefcase, Search, Filter, Plus, ArrowUpRight, LayoutDashboard, Users, TrendingUp, Mail, BarChart3, DollarSign, PieChart } from 'lucide-react';
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

export default function AdminPortfolios() {
  const { user, logout } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await fetch('/api/customers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
      } catch (error) {
        console.error('Failed to fetch portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    return customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalValue = customers.reduce((sum, c) => sum + (c.portfolio?.totalValue || 0), 0);
  const totalHoldings = customers.reduce((sum, c) => sum + (c.portfolio?.holdings?.length || 0), 0);

  const stats = [
    { label: 'Total Value', value: `₹${totalValue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-teal-400' },
    { label: 'Portfolios', value: customers.filter(c => c.portfolio?.holdings?.length > 0).length, icon: Briefcase, color: 'from-blue-500 to-cyan-400' },
    { label: 'Total Holdings', value: totalHoldings, icon: BarChart3, color: 'from-purple-500 to-pink-400' },
    { label: 'Avg. Value', value: `₹${(totalValue / (customers.filter(c => c.portfolio?.holdings?.length > 0).length || 1)).toLocaleString()}`, icon: PieChart, color: 'from-orange-500 to-amber-400' }
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
                <h1 className="text-lg font-semibold text-white">Portfolios</h1>
                <p className="text-xs text-gray-400">Manage customer portfolios</p>
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
                <PieChart className="w-5 h-5" />
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

        {/* Search */}
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
                placeholder="Search by customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Portfolios Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {loading ? (
            <div className="col-span-full p-12 text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading portfolios...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="col-span-full p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No portfolios found</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <motion.div 
                key={customer._id}
                whileHover={{ y: -2 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedPortfolio(customer)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {customer.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-white">{customer.name}</div>
                      <div className="text-sm text-gray-400">{customer.email}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-500" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400">Value</div>
                    <div className="text-white font-medium">₹{(customer.portfolio?.totalValue || 0).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400">Holdings</div>
                    <div className="text-white font-medium">{customer.portfolio?.holdings?.length || 0}</div>
                  </div>
                  {customer.portfolio?.riskProfile && (
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div className="text-sm text-gray-400">Risk</div>
                      <div className="text-white font-medium">{customer.portfolio.riskProfile}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Portfolio Detail Modal */}
        {selectedPortfolio && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-gray-900 border border-gray-800/50 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {selectedPortfolio.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{selectedPortfolio.name}</h3>
                      <p className="text-sm text-gray-400">{selectedPortfolio.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPortfolio(null)}
                    className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Total Value</div>
                    <div className="text-white font-medium">₹{(selectedPortfolio.portfolio?.totalValue || 0).toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Risk Profile</div>
                    <div className="text-white font-medium">{selectedPortfolio.portfolio?.riskProfile || 'Not assessed'}</div>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-gray-400 mb-3">Holdings</h4>
                <div className="space-y-2">
                  {(selectedPortfolio.portfolio?.holdings || []).map((holding: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div>
                        <div className="text-sm font-medium text-white">{holding.symbol}</div>
                        <div className="text-xs text-gray-500">{holding.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{holding.quantity} units</div>
                        <div className="text-xs text-gray-500">₹{(holding.value || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  {(!selectedPortfolio.portfolio?.holdings || selectedPortfolio.portfolio.holdings.length === 0) && (
                    <div className="text-center py-6 text-gray-500">No holdings yet</div>
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
