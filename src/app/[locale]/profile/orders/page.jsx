'use client';

import { useEffect, useState } from 'react';
import OrderCard from '../../../../components/profile/OrderCard';
import { getOrders } from '../../../../services/order/orderService';

import { Search, ShoppingBag, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Footer from '../../../../components/common/Footer';
import Header from '../../../../components/common/Header';

const statusFilters = [
  { label: 'همه', value: 'all' },
  { label: 'در حال آماده‌سازی', value: 'در حال آماده‌سازی' },
  { label: 'در حال ارسال', value: 'در حال ارسال' },
  { label: 'ارسال شده', value: 'ارسال شده' }
];

export default function OrdersPage({params}) {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { locale = "fa" } = params; 
  const ordersPerPage = 5;

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data); // اگر دیتا داخل data.orders هست، بنویس: setOrders(data.orders)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const name = order.recipient_name || '';
    const tracking = order.tracking_code || '';
    const status = order.status || '';

    const matchesSearch = searchQuery === '' ||
      name.includes(searchQuery) ||
      tracking.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
      <section className="pt-30 min-h-screen bg-gradient-to-b from-gray-50 to-gray-50 py-10 px-4 sm:px-6 lg:px-10 font-sans rtl">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="text-gray-600 w-6 h-6" />
                تاریخچه سفارش‌ها
              </h1>
              <div className="bg-gray-50 text-gray-700 px-3 py-1 text-sm mt-4 sm:mt-0">
                {orders.length} سفارش
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام یا کد پیگیری..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pr-10 pl-4 border border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 text-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-3 px-4 border border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 text-sm bg-white"
              >
                {statusFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-20">در حال بارگذاری سفارش‌ها...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">خطا در دریافت اطلاعات: {error}</div>
          ) : currentOrders.length === 0 ? (
            <div className="bg-white shadow-md p-8 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="text-gray-400 w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">سفارشی یافت نشد</h3>
                <p className="text-gray-500 max-w-md">
                  {searchQuery || statusFilter !== 'all'
                    ? 'سفارشی با معیارهای جستجوی شما یافت نشد. لطفاً فیلترها را تغییر دهید.'
                    : 'شما هنوز سفارشی ثبت نکرده‌اید.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6">
                {currentOrders.map(order => (
                  <OrderCard key={order.id} order={order} locale={locale}/>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-3 border-l border-gray-100 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="px-4">
                      <span className="font-medium">{currentPage}</span>
                      <span className="text-gray-500 mx-1">از</span>
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-3 border-r border-gray-100 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
