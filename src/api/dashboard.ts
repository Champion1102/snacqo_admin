import { request } from './client';

export interface LowStockVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
  outOfStock: boolean;
  product: { id: string; name: string; slug: string };
}

export interface DashboardResponse {
  orders: { today: number; thisWeek: number; total: number };
  revenue: { todayPaise: number; thisWeekPaise: number };
  lowStock: LowStockVariant[];
  counts: { activeProducts: number; activeCoupons: number };
}

export function getDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>('/admin/dashboard');
}

export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
