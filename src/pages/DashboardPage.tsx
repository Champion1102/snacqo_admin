import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, formatPaise, type DashboardResponse } from '@/api/dashboard';

export function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { orders, revenue, lowStock, counts } = data;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Orders today</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{orders.today}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Orders this week</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{orders.thisWeek}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Revenue today</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{formatPaise(revenue.todayPaise)}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Revenue this week</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{formatPaise(revenue.thisWeekPaise)}</p>
        </div>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active products</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{counts.activeProducts}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active coupons</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{counts.activeCoupons}</p>
        </div>
      </div>

      {/* Low stock table */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Low stock</h2>
        {lowStock.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-slate-500 text-sm">
            No variants with low stock or marked out of stock.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Variant / SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lowStock.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {v.product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {v.name} <span className="text-slate-400">({v.sku})</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{v.stock}</td>
                    <td className="px-4 py-3">
                      {v.outOfStock ? (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800">
                          Out of stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-800">
                          Low stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/products/${v.product.id}`}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        Edit product
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
