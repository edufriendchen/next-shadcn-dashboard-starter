'use client';

import { LabelList, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useSuspenseQuery } from '@tanstack/react-query';
import { dashboardQueryOptions, isOrgDashboard } from '@/features/overview/api/queries';
import { getActiveOrgId } from '@/features/overview/api/service';

const chartConfig = {
  logins: {
    label: 'Logins'
  },
  success: {
    label: 'Success',
    color: 'var(--chart-1)'
  },
  failed: {
    label: 'Failed',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

/**
 * Today's login outcomes (success vs failed), from the org-scoped AuthBoot
 * dashboard. Falls back to an empty state when no organization is active.
 */
export function PieGraph() {
  const orgId = getActiveOrgId();
  const { data } = useSuspenseQuery(dashboardQueryOptions(orgId));
  const org = isOrgDashboard(data) ? data : null;

  const totalToday = (org?.today_logins ?? 0) + (org?.today_failed_logins ?? 0);
  const chartData = org
    ? [
        { name: 'success', value: org.today_logins, fill: 'var(--color-success)' },
        { name: 'failed', value: org.today_failed_logins, fill: 'var(--color-failed)' }
      ]
    : [];

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Today's Logins</CardTitle>
        <CardDescription>Successful vs failed login attempts</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        {org && totalToday > 0 ? (
          <ChartContainer
            config={chartConfig}
            className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px] min-h-[250px]'
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey='logins' hideLabel />} />
              <Pie
                data={chartData}
                innerRadius={30}
                dataKey='value'
                radius={10}
                cornerRadius={8}
                paddingAngle={4}
              >
                <LabelList
                  dataKey='value'
                  stroke='none'
                  fontSize={12}
                  fontWeight={500}
                  fill='currentColor'
                  formatter={(value) => String(value ?? '')}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className='text-muted-foreground flex h-[250px] items-center justify-center text-sm'>
            Organization-level data appears once a workspace is active.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
