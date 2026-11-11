// ============================================================
// AuthBoot dashboard — type contracts
// ============================================================
// Mirrors idl/dashboard.proto from authboot-server.

// 趋势点：某天的计数（date 为 YYYY-MM-DD）
export interface TrendPoint {
  date: string;
  count: number;
}

// 月度登录趋势点（month 为 YYYY-MM），双序列折线图
export interface MonthlyLoginTrend {
  month: string;
  success: number;
  failed: number;
}

// Dashboard 右侧「最新注册用户」列表项
export interface RecentUser {
  user_id: number;
  nickname: string;
  avatar: string;
  identity: string;
  created_at: number;
}

// 组织维度管理后台 Dashboard
export interface OrgDashboardData {
  code: number;
  message: string;
  total_users: number;
  today_new_users: number;
  active_users_7d: number;
  disabled_users: number;
  admin_count: number;
  today_logins: number;
  today_failed_logins: number;
  login_trend_7d: TrendPoint[];
  new_user_trend_7d: TrendPoint[];
  // 首屏 KPI 卡（当前自然月 vs 上一个自然月）
  new_users_this_month: number;
  new_users_delta_pct: number;
  active_users_this_month: number;
  active_users_delta_pct: number;
  total_users_delta_pct: number;
  login_success_rate: number;
  login_success_rate_delta: number;
  monthly_login_trend: MonthlyLoginTrend[];
  recent_users: RecentUser[];
}

// 平台维度管理后台 Dashboard
export interface PlatformDashboardData {
  code: number;
  message: string;
  organization_count: number;
  user_count: number;
  admin_count: number;
  audit_log_count: number;
  today_login_count: number;
  today_new_users: number;
}

export type DashboardData = PlatformDashboardData | OrgDashboardData;

// BFF envelope: { data: DashboardData | null }
export interface DashboardApiResponse {
  data: DashboardData | null;
}
