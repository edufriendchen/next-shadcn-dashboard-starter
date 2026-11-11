import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AuthUser } from '@/lib/auth-types';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: AuthUser | null;
}

export function UserAvatarProfile({ className, showInfo = false, user }: UserAvatarProfileProps) {
  const displayName = user?.nickname || user?.email || '';
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={user?.avatar || ''} alt={displayName} />
        <AvatarFallback className='rounded-lg'>
          {displayName.slice(0, 2).toUpperCase() || 'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{user?.nickname || user?.email || ''}</span>
          <span className='truncate text-xs'>{user?.email || ''}</span>
        </div>
      )}
    </div>
  );
}
