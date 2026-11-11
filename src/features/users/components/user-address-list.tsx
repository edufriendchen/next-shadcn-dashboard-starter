'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { userAddressesOptions } from '../api/queries';

type UserAddressListProps = {
  userId: string;
};

export default function UserAddressList({ userId }: UserAddressListProps) {
  const { data } = useSuspenseQuery(userAddressesOptions(Number(userId)));
  const addresses = data?.addresses ?? [];

  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <CardHeader>
        <CardTitle className='text-left text-lg font-semibold'>
          Addresses
          {addresses.length > 0 && (
            <span className='text-muted-foreground ml-2 text-sm font-normal'>
              ({addresses.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p className='text-muted-foreground text-sm'>
            {data?.success === false ? data.message : 'No addresses found.'}
          </p>
        ) : (
          <div className='divide-y'>
            {addresses.map((address) => {
              const region = [address.province, address.city, address.district]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={address.id}
                  className='flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium'>{address.receiver_name || '—'}</span>
                      {address.is_default && <Badge variant='secondary'>Default</Badge>}
                    </div>
                    {address.receiver_phone && (
                      <p className='text-muted-foreground text-sm'>{address.receiver_phone}</p>
                    )}
                    {region && <p className='text-sm'>{region}</p>}
                    {address.detail && (
                      <p className='text-muted-foreground text-sm'>{address.detail}</p>
                    )}
                  </div>
                  <div className='text-muted-foreground space-y-1 text-right text-xs whitespace-nowrap'>
                    {address.created_at && <p>Added {formatDate(address.created_at)}</p>}
                    <p>#{address.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
