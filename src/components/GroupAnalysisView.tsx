import { Search, Clock, CheckCircle2, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ConversationGroup {
  id: string;
  title: string;
  approvalRate: number;
  emailCount: number;
  badge?: 'Approved' | 'Flagged' | 'Rejected' | 'Needs Info';
  conversations: string[]; // conversation IDs
}

interface GroupAnalysisStats {
  totalConversations: number;
  approvalRate: number;
  avgReviewTime: number; // in seconds
}

interface GroupAnalysisViewProps {
  groups: ConversationGroup[];
  stats: GroupAnalysisStats;
  onViewGroup: (groupId: string) => void;
  onMarkAll: (groupId: string) => void;
}

function StatCard({ 
  icon: Icon, 
  label, 
  value,
  color = 'text-neutral-900'
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[8px]">
        <Icon className="w-[16px] h-[16px]" style={{ color: 'var(--color-text-secondary)' }} />
        <p className="text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
          {label}
        </p>
      </div>
      <p className={`text-[32px] font-medium ${color}`}>
        {value}
      </p>
    </div>
  );
}

function GroupCard({ 
  group, 
  onViewEmails,
  onMarkAll
}: { 
  group: ConversationGroup;
  onViewEmails: () => void;
  onMarkAll: () => void;
}) {
  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case 'Approved':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Flagged':
        return 'bg-[#FFF3E0] text-[#E65100]';
      case 'Rejected':
        return 'bg-[#FFEBEE] text-[#C62828]';
      case 'Needs Info':
        return 'bg-[#E3F2FD] text-[#1565C0]';
      default:
        return 'bg-[#F5F5F5] text-[#616161]';
    }
  };

  return (
    <div 
      className="rounded-[12px] p-[20px] border border-solid"
      style={{ 
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <h3 className="text-[16px] font-medium text-neutral-900">
                {group.title}
              </h3>
              {group.badge && (
                <span 
                  className={`px-[8px] py-[2px] rounded-[6px] text-[12px] font-medium ${getBadgeStyles(group.badge)}`}
                >
                  {group.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center gap-[6px]">
                <span className="text-[14px] font-medium" style={{ color: '#2E7D32' }}>
                  Approval Rate: {group.approvalRate}%
                </span>
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
                  {group.emailCount} emails
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAll}
              className="text-[14px]"
              style={{ color: 'var(--color-primary)' }}
            >
              Mark All
            </Button>
          </div>
        </div>

        {/* View button */}
        <Button
          variant="outline"
          onClick={onViewEmails}
          className="w-full text-[14px] font-medium"
        >
          View Emails
        </Button>
      </div>
    </div>
  );
}

export function GroupAnalysisView({
  groups,
  stats,
  onViewGroup,
  onMarkAll
}: GroupAnalysisViewProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="flex flex-col gap-[24px] p-[24px] h-full overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-[16px]">
        <h1 className="text-[24px] font-medium text-neutral-900">
          Conversation Analysis
        </h1>

        {/* Search */}
        <div className="relative">
          <Search 
            className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px]"
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <Input
            placeholder="Search conversations by user, topic, or content..."
            className="pl-[36px] text-[14px]"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div 
        className="grid grid-cols-3 gap-[24px] p-[24px] rounded-[12px] border border-solid"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
      >
        <StatCard
          icon={Mail}
          label="Total Conversations"
          value={stats.totalConversations}
        />
        <StatCard
          icon={CheckCircle2}
          label="Approval Rate"
          value={`${stats.approvalRate}%`}
          color="text-[#2E7D32]"
        />
        <StatCard
          icon={Clock}
          label="Avg. Review Time"
          value={formatTime(stats.avgReviewTime)}
          color="text-[#E65100]"
        />
      </div>

      {/* Groups Section */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-medium text-neutral-900">
            Conversation Clusters
          </h2>
          <span className="text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
            {groups.length} groups
          </span>
        </div>

        <div className="grid gap-[16px]">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onViewEmails={() => onViewGroup(group.id)}
              onMarkAll={() => onMarkAll(group.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
