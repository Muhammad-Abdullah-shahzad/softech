import { 
  LayoutDashboard, 
  IndianRupee, 
  UploadCloud, 
  BarChart3, 
  FileText, 
  MessageSquareWarning, 
  Users, 
  Bell, 
  Settings,
  ShieldCheck
} from 'lucide-react';

export const navigationConfig = {
  worker: [
    {
      title: 'Main',
      links: [
        { label: 'Dashboard', path: '/dashboard/worker', icon: LayoutDashboard },
        { label: 'Earnings', path: '/dashboard/worker/earnings', icon: IndianRupee },
        { label: 'Upload & Verify', path: '/dashboard/worker/upload', icon: UploadCloud },
        { label: 'Anomalies', path: '/dashboard/worker/anomalies', icon: ShieldCheck },
      ]
    },
    {
      title: 'Reports & Insights',
      links: [
        { label: 'Analytics', path: '/dashboard/worker/analytics', icon: BarChart3 },
        { label: 'Income Certificate', path: '/dashboard/worker/certificate', icon: FileText },
        { label: 'Community Insights', path: '/dashboard/worker/community', icon: Users },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Grievances', path: '/dashboard/worker/grievances', icon: MessageSquareWarning },
        { label: 'Notifications', path: '/dashboard/worker/notifications', icon: Bell },
        { label: 'Profile', path: '/dashboard/worker/profile', icon: Settings },
      ]
    }
  ],
  admin: [/* ... stay same or update if needed ... */],
  verifier: [
    {
      title: 'Verification',
      links: [
        { label: 'Pending Queue', path: '/dashboard/verifier/queue', icon: LayoutDashboard },
        { label: 'Flagged Records', path: '/dashboard/verifier/flagged', icon: MessageSquareWarning },
        { label: 'Audit History', path: '/dashboard/verifier/history', icon: FileText },
      ]
    },
    {
      title: 'Insights',
      links: [
        { label: 'Analytics', path: '/dashboard/verifier/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'System',
      links: [
        { label: 'Notifications', path: '/dashboard/verifier/notifications', icon: Bell },
        { label: 'Profile Settings', path: '/dashboard/verifier/profile', icon: Settings },
      ]
    }
  ],
  analyst: [/* ... */],
  support: [/* ... */]
};