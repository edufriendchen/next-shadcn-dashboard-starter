'use client';

import { Bar, BarChart, XAxis } from 'recharts';

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
    label: 'Logins',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

/**
 * 7-day daily login trend, from the org-scoped AuthBoot dashboard. Falls
 * back to an empty state when no organization is active.
 */
export function BarGraph() {
  const orgId = getActiveOrgId();
  const { data } = useSuspenseQuery(dashboardQueryOptions(orgId));
  const org = isOrgDashboard(data) ? data : null;
  const chartData = (org?.login_trend_7d ?? []).map((point) => ({
    date: point.date,
    logins: point.count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Logins</CardTitle>
        <CardDescription>Login count for the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {org && chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <rect
                x='0'
                y='0'
                width='100%'
                height='85%'
                fill='url(#default-multiple-pattern-dots)'
              />
              <defs>
                <DottedBackgroundPattern />
              </defs>
              <XAxis
                dataKey='date'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => value.slice(5)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='dashed' hideLabel />}
              />
              <Bar
                dataKey='logins'
                fill='var(--color-logins)'
                shape={<CustomHatchedBar isHatched={false} />}
                radius={4}
              />
            </BarChart>
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

const CustomHatchedBar = (
  props: React.SVGProps<SVGRectElement> & {
    dataKey?: string;
    isHatched?: boolean;
  }
) => {
  const { fill, x, y, width, height, dataKey } = props;
  const isHatched = props.isHatched ?? true;

  return (
    <>
      <rect
        rx={4}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke='none'
        fill={isHatched ? `url(#hatched-bar-pattern-${dataKey})` : fill}
      />
      <defs>
        <pattern
          key={dataKey}
          id={`hatched-bar-pattern-${dataKey}`}
          x='0'
          y='0'
          width='5'
          height='5'
          patternUnits='userSpaceOnUse'
          patternTransform='rotate(-45)'
        >
          <rect width='10' height='10' opacity={0.5} fill={fill}></rect>
          <rect width='1' height='10' fill={fill}></rect>
        </pattern>
      </defs>
    </>
  );
};

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id='default-multiple-pattern-dots'
      x='0'
      y='0'
      width='10'
      height='10'
      patternUnits='userSpaceOnUse'
    >
      <circle className='dark:text-muted/40 text-muted' cx='2' cy='2' r='1' fill='currentColor' />
    </pattern>
  );
};
