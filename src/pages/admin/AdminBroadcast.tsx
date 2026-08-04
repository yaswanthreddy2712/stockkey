import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { Mail, Send, Users, CheckCircle, Clock, AlertCircle, LayoutDashboard, TrendingUp, Briefcase, FileText, ArrowUpRight } from 'lucide-react';
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

export default function AdminBroadcast() {
  const { user, logout } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [template, setTemplate] = useState('');
  const [sent, setSent] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const templates = [
    {
      name: 'Welcome',
      subject: 'Welcome to Stock Key Investments',
      message: 'Dear {{name}},\n\nThank you for joining Stock Key Investments! We are excited to have you on board.\n\nYour account is now active and ready to use. You can explore our investment options, track your portfolio, and connect with our team.\n\nIf you have any questions, feel free to reach out.\n\nBest regards,\nStock Key Investments Team'
    },
    {
      name: 'Portfolio Update',
      subject: 'Your Portfolio Update',
      message: 'Dear {{name}},\n\nHere is your monthly portfolio update:\n\nYour portfolio value: ₹{{value}}\nTotal holdings: {{holdings}}\n\nLog in to view detailed performance and make adjustments.\n\nBest regards,\nStock Key Investments Team'
    },
    {
      name: 'Market Insights',
      subject: 'Weekly Market Insights',
      message: 'Dear {{name}},\n\nHere are this week\'s market insights:\n\n• Nifty 50: Up 2.3%\n• Sensex: Up 1.8%\n• Top performing sector: IT\n\nOur analysts recommend maintaining a balanced portfolio approach.\n\nBest regards,\nStock Key Investments Team'
    }
  ];

  const handleSendBroadcast = async () => {
    if (!subject || !message) return;
    
    setSending(true);
    try {
      const personalizedMessage = message.replace(/\{\{name\}\}/g, '{{name}}');
      
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          subject,
          message: personalizedMessage,
          recipients: customers.map(c => c.email)
        })
      });

      if (res.ok) {
        setSent(true);
        setSentCount(customers.length);
      }
    } catch (error) {
      console.error('Failed to send broadcast:', error);
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = (tpl: typeof templates[0]) => {
    setSubject(tpl.subject);
    setMessage(tpl.message);
    setTemplate(tpl.name);
  };

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
                <h1 className="text-lg font-semibold text-white">Broadcast</h1>
                <p className="text-xs text-gray-400">Send emails to customers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              <Link to="/admin/customers" className="text-gray-400 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </Link>
              <Link to="/admin/leads" className="text-gray-400 hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </Link>
              <button onClick={() => { logout(); }} className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compose Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Compose Email</h2>
                <p className="text-xs text-gray-400">Send to {customers.length} customers</p>
              </div>
            </div>

            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Broadcast Sent!</h3>
                <p className="text-gray-400">Email sent to {sentCount} customers</p>
                <button 
                  onClick={() => { setSent(false); setSubject(''); setMessage(''); }}
                  className="mt-6 px-6 py-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/30 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message... Use {{name}} for personalization"
                    rows={10}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Recipients: {customers.length} customers
                  </div>
                  <button
                    onClick={handleSendBroadcast}
                    disabled={!subject || !message || sending}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-orange-500/25"
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Broadcast
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Templates */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Templates</h2>
                <p className="text-xs text-gray-400">Quick start templates</p>
              </div>
            </div>

            <div className="space-y-3">
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(tpl)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    template === tpl.name
                      ? 'bg-indigo-500/10 border-indigo-500/30'
                      : 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50'
                  }`}
                >
                  <div className="font-medium text-white mb-1">{tpl.name}</div>
                  <div className="text-sm text-gray-400 line-clamp-2">{tpl.subject}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Personalization</span>
              </div>
              <p className="text-xs text-gray-500">
                Use {'{{name}}'} in your message to insert the customer's name automatically.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Recent Broadcasts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Broadcasts</h2>
          <div className="space-y-3">
            {[
              { subject: 'Welcome to Stock Key', recipients: 45, date: '2 hours ago', status: 'sent' },
              { subject: 'Portfolio Update - July', recipients: 38, date: '1 day ago', status: 'sent' },
              { subject: 'Market Insights Weekly', recipients: 42, date: '3 days ago', status: 'sent' }
            ].map((broadcast, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{broadcast.subject}</div>
                    <div className="text-sm text-gray-400">{broadcast.recipients} recipients • {broadcast.date}</div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
                  Sent
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
