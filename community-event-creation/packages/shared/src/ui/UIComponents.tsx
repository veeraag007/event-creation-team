import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Calendar, 
  Wrench, 
  HelpCircle,
  X,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { StatusType } from '../types';

export interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const norm = (status || '').toLowerCase();
  
  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = HelpCircle;

  switch (norm) {
    case 'active':
    case 'approved':
    case 'successful':
    case 'completed':
    case 'open':
    case 'delivered':
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      Icon = CheckCircle2;
      break;
    case 'pending':
    case 'scheduled':
      bg = 'bg-amber-50 text-amber-700 border-amber-200';
      Icon = Clock;
      break;
    case 'suspended':
    case 'warning':
      bg = 'bg-orange-50 text-orange-700 border-orange-200';
      Icon = AlertTriangle;
      break;
    case 'expired':
    case 'failed':
    case 'cancelled':
    case 'rejected':
      bg = 'bg-rose-50 text-rose-700 border-rose-200';
      Icon = XCircle;
      break;
    case 'refunded':
      bg = 'bg-purple-50 text-purple-700 border-purple-200';
      Icon = ArrowDownRight;
      break;
    case 'draft':
    case 'archived':
      bg = 'bg-slate-100 text-slate-600 border-slate-200';
      Icon = FileText;
      break;
    case 'published':
      bg = 'bg-blue-50 text-blue-700 border-blue-200';
      Icon = Calendar;
      break;
    case 'maintenance':
    case 'checked-in':
      bg = 'bg-cyan-50 text-cyan-700 border-cyan-200';
      Icon = Wrench;
      break;
    default:
      bg = 'bg-slate-100 text-slate-700 border-slate-200';
      Icon = HelpCircle;
      break;
  }

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const label = norm === 'open' ? 'Reg Open' : capitalize(norm.replace('-', ' '));

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full whitespace-nowrap ${
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    } ${bg} ${className}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
};

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: React.ElementType;
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'purple' | 'slate';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  accentColor = 'slate',
  onClick
}) => {
  const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    sky: 'text-sky-600 bg-sky-50 border-sky-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    slate: 'text-slate-700 bg-slate-100 border-slate-200'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg border ${colorMap[accentColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {change && (
          <span className={`inline-flex items-center text-xs font-semibold ${
            isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
  );
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} bg-white rounded-xl shadow-xl border border-slate-200 z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col`}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-lg'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className={`w-screen ${width} bg-white shadow-2xl border-l border-slate-200 flex flex-col`}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-400 shadow-xs mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
