import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  Eye
} from 'lucide-react';
import { PaymentTransaction } from '../types';
import { INITIAL_PAYMENTS } from '../data/eventData';
import { StatusBadge, Drawer } from '../ui/UIComponents';

interface PaymentsViewProps {
  onRefund: (transactionId: string) => void;
  onExport: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  onRefund,
  onExport
}) => {
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTxn, setActiveTxn] = useState<PaymentTransaction | null>(null);

  const filtered = payments.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || p.transactionId.toLowerCase().includes(q) || p.memberName.toLowerCase().includes(q);
    const matchMod = moduleFilter === 'all' || p.module === moduleFilter;
    const matchStat = statusFilter === 'all' || p.status === statusFilter;
    return matchQ && matchMod && matchStat;
  });

  const totalCollected = payments
    .filter(p => p.status === 'successful')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleProcessRefund = (id: string) => {
    onRefund(id);
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'refunded' } : p));
    if (activeTxn) setActiveTxn({ ...activeTxn, status: 'refunded' });
  };

  return (
    <div className="space-y-5">
      {/* Finance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Total Collection (Sep)</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">₹{totalCollected.toLocaleString()}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Successful Transactions</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">98.2%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Pending Settlement</span>
          <span className="text-xl font-bold text-amber-600 mt-1 block">₹2,500</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Refunded Amount</span>
          <span className="text-xl font-bold text-purple-600 mt-1 block">₹300</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search transaction ID, member or invoice..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={moduleFilter}
            onChange={e => setModuleFilter(e.target.value)}
            aria-label="Filter by Transaction Module"
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700"
          >
            <option value="all">All Modules</option>
            <option value="Membership">Membership</option>
            <option value="Events">Events</option>
            <option value="Bookings">Bookings</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by Payment Status"
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3.5">Txn ID</th>
              <th className="p-3.5">Member</th>
              <th className="p-3.5">Module</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Method</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 font-mono font-bold text-slate-900">{p.transactionId}</td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-800">{p.memberName}</div>
                  <div className="text-[11px] text-slate-400">{p.memberId}</div>
                </td>
                <td className="p-3.5 font-semibold text-slate-700">{p.module}</td>
                <td className="p-3.5 font-bold text-slate-900">₹{p.amount.toLocaleString()}</td>
                <td className="p-3.5 text-slate-600">{p.paymentMethod}</td>
                <td className="p-3.5 text-slate-500">{p.date}</td>
                <td className="p-3.5"><StatusBadge status={p.status} size="sm" /></td>
                <td className="p-3.5 text-right space-x-1.5">
                  <button
                    onClick={() => setActiveTxn(p)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition"
                    title="View Transaction Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {p.status === 'successful' && (
                    <button
                      onClick={() => handleProcessRefund(p.id)}
                      className="text-[11px] font-bold text-purple-700 hover:underline"
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Drawer */}
      <Drawer
        isOpen={!!activeTxn}
        onClose={() => setActiveTxn(null)}
        title="Transaction Details"
        subtitle={activeTxn?.transactionId}
      >
        {activeTxn && (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={activeTxn.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Amount:</span>
                <span className="font-bold text-slate-900 text-sm">₹{activeTxn.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-700">{activeTxn.invoiceNumber}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Customer</h4>
              <p><strong>Name:</strong> {activeTxn.memberName}</p>
              <p><strong>Member ID:</strong> {activeTxn.memberId}</p>
              <p><strong>Email:</strong> {activeTxn.customerEmail}</p>
              <p><strong>Description:</strong> {activeTxn.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {activeTxn.status === 'successful' && (
                <button
                  onClick={() => handleProcessRefund(activeTxn.id)}
                  className="w-full py-2 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
                >
                  Initiate Full Refund
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
