'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
 * 6-month login trend (success vs failed), from the org-scoped AuthBoot
 * dashboard. Falls back to an empty state when no organization is active.
 */
export function AreaGraph() {
  const orgId = getActiveOrgId();
  const { data } = useSuspenseQuery(dashboardQueryOptions(orgId));
  const org = isOrgDashboard(data) ? data : null;
  const chartData = (org?.monthly_login_trend ?? []).map((point) => ({
    month: point.month,
    success: point.success,
    failed: point.failed
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Login Trend</CardTitle>
        <CardDescription>Successful vs failed logins, last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {org && chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <AreaChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => value.slice(5)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <DottedBackgroundPattern config={chartConfig} />
              </defs>
              <Area
                dataKey='failed'
                type='natural'
                fill='url(#dotted-background-pattern-failed)'
                fillOpacity={0.4}
                stroke='var(--color-failed)'
                stackId='a'
                strokeWidth={0.8}
              />
              <Area
                dataKey='success'
                type='natural'
                fill='url(#dotted-background-pattern-success)'
                fillOpacity={0.4}
                stroke='var(--color-success)'
                stackId='a'
                strokeWidth={0.8}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className='text-muted-foreground flex h-[220px] items-center justify-center text-sm'>
            Organization-level trend data appears once a workspace is active.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, value.color])
  );
  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <pattern
          key={key}
          id={`dotted-background-pattern-${key}`}
          x='0'
          y='0'
          width='7'
          height='7'
          patternUnits='userSpaceOnUse'
        >
          <circle cx='5' cy='5' r='1.5' fill={value} opacity={0.5}></circle>
        </pattern>
      ))}
    </>
  );
};
