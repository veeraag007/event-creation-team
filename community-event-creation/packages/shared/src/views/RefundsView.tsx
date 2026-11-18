import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  FileText, 
  ShieldCheck, 
  Plus, 
  RotateCcw,
  Building,
  User,
  CreditCard
} from 'lucide-react';
import { RefundRecord } from '../types';
import { INITIAL_REFUNDS } from '../data/eventData';
import { StatusBadge, Modal } from '../ui/UIComponents';

interface RefundsViewProps {
  onNotify?: (msg: string) => void;
}

export const RefundsView: React.FC<RefundsViewProps> = ({ onNotify }) => {
  const [refunds, setRefunds] = useState<RefundRecord[]>(INITIAL_REFUNDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRecord | null>(null);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Form state for initiating a refund
  const [newRefund, setNewRefund] = useState({
    originalTransactionId: '',
    originalInvoiceNumber: '',
    memberName: '',
    memberUnit: '',
    amount: '',
    reason: 'Booking Cancellation' as RefundRecord['reason'],
    paymentMode: 'Original Source' as RefundRecord['paymentMode'],
    notes: ''
  });

  const showToast = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const filteredRefunds = refunds.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQ = !q || 
      r.refundId.toLowerCase().includes(q) || 
      r.memberName.toLowerCase().includes(q) || 
      r.memberUnit.toLowerCase().includes(q) || 
      r.originalTransactionId.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesReason = reasonFilter === 'all' || r.reason === reasonFilter;
    return matchesQ && matchesStatus && matchesReason;
  });

  // Financial Metrics
  const totalRefunded = refunds
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingAmount = refunds
    .filter(r => r.status === 'pending' || r.status === 'processing')
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingCount = refunds.filter(r => r.status === 'pending').length;
  const processingCount = refunds.filter(r => r.status === 'processing').length;

  const handleApproveRefund = (refundId: string) => {
    setRefunds(prev => prev.map(r => {
      if (r.id === refundId) {
        return {
          ...r,
          status: 'completed',
          processedDate: 'Today, Just now',
          gatewayRef: `UTR-REV-${Date.now().toString().slice(-8)}`,
          approvedBy: 'Admin (Manual Approval)'
        };
      }
      return r;
    }));
    if (selectedRefund && selectedRefund.id === refundId) {
      setSelectedRefund({
        ...selectedRefund,
        status: 'completed',
        processedDate: 'Today, Just now',
        gatewayRef: `UTR-REV-${Date.now().toString().slice(-8)}`,
        approvedBy: 'Admin (Manual Approval)'
      });
    }
    showToast(`Refund #${refundId} approved and initiated to payment gateway.`);
  };

  const handleRejectRefund = (refundId: string) => {
    setRefunds(prev => prev.map(r => {
      if (r.id === refundId) {
        return { ...r, status: 'rejected', notes: 'Claim rejected by Finance Committee audit' };
      }
      return r;
    }));
    if (selectedRefund && selectedRefund.id === refundId) {
      setSelectedRefund({ ...selectedRefund, status: 'rejected', notes: 'Claim rejected by Finance Committee audit' });
    }
    showToast(`Refund claim #${refundId} has been rejected.`);
  };

  const handleCreateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefund.memberName || !newRefund.amount) {
      showToast('Please specify member name and refund amount.');
      return;
    }

    const created: RefundRecord = {
      id: `rfd-${Date.now()}`,
      refundId: `RFD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      originalTransactionId: newRefund.originalTransactionId || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      originalInvoiceNumber: newRefund.originalInvoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      memberId: 'MEM-TEMP',
      memberName: newRefund.memberName,
      memberUnit: newRefund.memberUnit || 'General Pool',
      amount: parseFloat(newRefund.amount) || 0,
      reason: newRefund.reason,
      requestedDate: 'Today, Just now',
      status: 'pending',
      paymentMode: newRefund.paymentMode,
      gatewayRef: 'Pending Gateway Batch',
      notes: newRefund.notes || 'Manually logged refund request.'
    };

    setRefunds([created, ...refunds]);
    setIsInitiateModalOpen(false);
    setNewRefund({
      originalTransactionId: '',
      originalInvoiceNumber: '',
      memberName: '',
      memberUnit: '',
      amount: '',
      reason: 'Booking Cancellation',
      paymentMode: 'Original Source',
      notes: ''
    });
    showToast(`Initiated refund claim ${created.refundId} for ₹${created.amount.toLocaleString()}.`);
  };

  const handleExport = () => {
    showToast('Exported Refunds & Reversals Ledger to CSV successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-600" />
            Refunds & Reversals Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track cancelled booking refunds, event pass reversals, and security deposit reconciliations
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Ledger</span>
          </button>
          <button
            onClick={() => setIsInitiateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Initiate Refund</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Total Settled Refunds</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">₹{totalRefunded.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">Reconciled to source accounts</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Awaiting Committee Approval</span>
          <span className="text-xl font-bold text-amber-600 mt-1 block">{pendingCount} claims</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Pending treasurer clearance</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">In Bank Gateway Queue</span>
          <span className="text-xl font-bold text-indigo-600 mt-1 block">{processingCount} requests</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Batch dispatching to NPCI / Banks</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Average Reversal Turnaround</span>
          <span className="text-xl font-bold text-purple-600 mt-1 block">4.2 Hours</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Instant UPI auto-credit SLA</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Refund ID, member name, flat or transaction #..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by Refund Status"
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed (Settled)</option>
            <option value="pending">Pending Approval</option>
            <option value="processing">In Gateway Queue</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={reasonFilter}
            onChange={e => setReasonFilter(e.target.value)}
            aria-label="Filter by Refund Reason"
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Refund Reasons</option>
            <option value="Booking Cancellation">Booking Cancellation</option>
            <option value="Event Rescheduled">Event Rescheduled</option>
            <option value="Duplicate Payment">Duplicate Payment</option>
            <option value="Security Deposit Return">Security Deposit Return</option>
            <option value="Overcharge Adjustment">Overcharge Adjustment</option>
          </select>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Refund ID & Date</th>
                <th className="p-3.5">Resident & Unit</th>
                <th className="p-3.5">Category / Reason</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Method & Reference</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No refund records match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">{r.refundId}</div>
                      <div className="text-[11px] text-slate-400">{r.requestedDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{r.memberName}</div>
                      <div className="text-[11px] text-slate-500">{r.memberUnit}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {r.reason}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                        Ref: {r.originalTransactionId}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 text-sm">
                      ₹{r.amount.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-700 font-medium">{r.paymentMode}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                        {r.gatewayRef}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        r.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        r.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        r.status === 'processing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        {r.status === 'pending' && <Clock className="w-3 h-3" />}
                        {r.status === 'processing' && <ShieldCheck className="w-3 h-3" />}
                        {r.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        <span className="capitalize">{r.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedRefund(r)}
                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition"
                        title="View Reversal Audit Trail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleApproveRefund(r.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector / Detail Modal */}
      {selectedRefund && (
        <Modal
          isOpen={!!selectedRefund}
          onClose={() => setSelectedRefund(null)}
          title={`Refund Voucher - ${selectedRefund.refundId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase font-semibold">Refund Amount</span>
                  <span className="text-2xl font-bold text-purple-700">₹{selectedRefund.amount.toLocaleString()}</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedRefund.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  selectedRefund.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  selectedRefund.status === 'processing' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {selectedRefund.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Resident:</span>
                  <span className="font-semibold text-slate-900">{selectedRefund.memberName} ({selectedRefund.memberUnit})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Original Transaction:</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedRefund.originalTransactionId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Original Invoice:</span>
                  <span className="font-mono text-slate-800">{selectedRefund.originalInvoiceNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Payout Mode:</span>
                  <span className="font-semibold text-slate-800">{selectedRefund.paymentMode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Requested Date:</span>
                  <span>{selectedRefund.requestedDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Settlement UTR / Ref:</span>
                  <span className="font-mono text-slate-700">{selectedRefund.gatewayRef}</span>
                </div>
              </div>
            </div>

            {selectedRefund.notes && (
              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg text-slate-700">
                <span className="font-bold block text-purple-900 mb-0.5">Audit Note:</span>
                {selectedRefund.notes}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              {selectedRefund.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleRejectRefund(selectedRefund.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => handleApproveRefund(selectedRefund.id)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                  >
                    Approve & Release to Source
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedRefund(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Initiate Refund Modal */}
      <Modal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        title="Initiate Resident Refund Request"
      >
        <form onSubmit={handleCreateRefund} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resident / Member Name *</label>
            <input
              type="text"
              required
              value={newRefund.memberName}
              onChange={e => setNewRefund({ ...newRefund, memberName: e.target.value })}
              placeholder="e.g. Arvind Rao"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Residence Unit</label>
              <input
                type="text"
                value={newRefund.memberUnit}
                onChange={e => setNewRefund({ ...newRefund, memberUnit: e.target.value })}
                placeholder="e.g. Villa C-09"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Refund Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={newRefund.amount}
                onChange={e => setNewRefund({ ...newRefund, amount: e.target.value })}
                placeholder="e.g. 1500"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Refund Category *</label>
              <select
                value={newRefund.reason}
                onChange={e => setNewRefund({ ...newRefund, reason: e.target.value as RefundRecord['reason'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
              >
                <option value="Booking Cancellation">Booking Cancellation</option>
                <option value="Event Rescheduled">Event Rescheduled</option>
                <option value="Duplicate Payment">Duplicate Payment</option>
                <option value="Security Deposit Return">Security Deposit Return</option>
                <option value="Overcharge Adjustment">Overcharge Adjustment</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payout Channel</label>
              <select
                value={newRefund.paymentMode}
                onChange={e => setNewRefund({ ...newRefund, paymentMode: e.target.value as RefundRecord['paymentMode'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
              >
                <option value="Original Source">Original Source Gateway</option>
                <option value="UPI">Direct UPI Transfer</option>
                <option value="Net Banking">NEFT / RTGS Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Original Transaction #</label>
              <input
                type="text"
                value={newRefund.originalTransactionId}
                onChange={e => setNewRefund({ ...newRefund, originalTransactionId: e.target.value })}
                placeholder="e.g. TXN-9028421"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Original Invoice #</label>
              <input
                type="text"
                value={newRefund.originalInvoiceNumber}
                onChange={e => setNewRefund({ ...newRefund, originalInvoiceNumber: e.target.value })}
                placeholder="e.g. INV-2026-0885"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Justification & Notes</label>
            <textarea
              rows={2}
              value={newRefund.notes}
              onChange={e => setNewRefund({ ...newRefund, notes: e.target.value })}
              placeholder="e.g. Resident requested cancellation due to personal scheduling conflict."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsInitiateModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition shadow-xs"
            >
              Submit Refund Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
