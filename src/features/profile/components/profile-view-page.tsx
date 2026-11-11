'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { updateProfile } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { useState } from 'react';

export default function ProfileViewPage() {
  const { user, refresh } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isPending || !user) return;
    setIsPending(true);
    setMessage(null);
    try {
      const result = await updateProfile({ nickname: nickname.trim() });
      if (!result.success) {
        setMessage({ kind: 'error', text: result.message });
        return;
      }
      await refresh();
      setMessage({ kind: 'success', text: 'Profile updated' });
    } finally {
      setIsPending(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className='flex w-full flex-col gap-6 p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your platform account information</CardDescription>
        </CardHeader>
        <CardContent className='flex items-center gap-4'>
          <Avatar className='h-16 w-16 rounded-lg'>
            <AvatarImage src={user.avatar || ''} alt={user.nickname || user.email} />
            <AvatarFallback className='rounded-lg text-lg'>
              {(user.nickname || user.email).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='grid gap-0.5 text-sm'>
            <span className='font-semibold'>{user.nickname || 'Unnamed'}</span>
            <span className='text-muted-foreground'>{user.email}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your display name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid max-w-sm gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='nickname'>Nickname</Label>
              <Input
                id='nickname'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder='Your display name'
              />
            </div>

            {message && (
              <Alert variant={message.kind === 'error' ? 'destructive' : 'default'}>
                <Icons.info className='h-4 w-4' />
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div>
              <LoadingButton type='submit' loading={isPending}>
                Save
              </LoadingButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
