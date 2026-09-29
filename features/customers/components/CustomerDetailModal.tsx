'use client';

import { useState, useEffect } from 'react';
import { CustomerDetail } from '../types';
import { getCustomerDetail } from '../services/customer-service';
import { formatCurrency } from '@/lib/format';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customerNumber: number | null;
}

export function CustomerDetailModal({ isOpen, onClose, customerNumber }: Props) {
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !customerNumber) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCustomerDetail(customerNumber);
        setDetail(data);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Gagal memuat detail pelanggan.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, customerNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Pelanggan</h2>
            <p className="text-sm text-gray-500">
              {detail ? detail.customerName : 'Memuat...'} (ID: {customerNumber})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Konten Modal yang Bisa Di-scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Memuat data secara mendalam...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : detail ? (
            <>
              {/* Seksi 1: Profil & Ringkasan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Informasi Kontak</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-800">Nama Kontak:</span> {detail.contactFirstName} {detail.contactLastName}</p>
                    <p><span className="font-medium text-gray-800">Telepon:</span> {detail.phone}</p>
                    <p><span className="font-medium text-gray-800">Alamat:</span> {detail.addressLine1} {detail.addressLine2 ? `, ${detail.addressLine2}` : ''}</p>
                    <p><span className="font-medium text-gray-800">Lokasi:</span> {detail.city}, {detail.state || ''} {detail.postalCode || ''}, {detail.country}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded border border-gray-100 shadow-sm flex flex-col justify-center space-y-4">
                  <h3 className="font-semibold text-gray-800 border-b pb-2 mb-1">Ringkasan Finansial</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Limit Kredit:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(detail.creditLimit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Transaksi Selesai:</span>
                    <span className="font-bold text-green-600">{formatCurrency(detail.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Jumlah Pesanan:</span>
                    <span className="font-medium text-gray-900">{detail.totalOrders} Pesanan</span>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Riwayat Pesanan */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  Riwayat Pesanan <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{detail.orders.length}</span>
                </h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 sticky top-0 border-b border-gray-200 text-gray-700">
                      <tr>
                        <th className="p-3">No. Pesanan</th>
                        <th className="p-3">Tanggal Pesan</th>
                        <th className="p-3">Tanggal Kirim</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {detail.orders.length > 0 ? (
                        detail.orders.map((o) => (
                          <tr key={o.orderNumber} className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">#{o.orderNumber}</td>
                            <td className="p-3 text-gray-600">{new Date(o.orderDate).toLocaleDateString('id-ID')}</td>
                            <td className="p-3 text-gray-600">{o.shippedDate ? new Date(o.shippedDate).toLocaleDateString('id-ID') : '-'}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                o.status === 'Shipped' ? 'bg-green-100 text-green-800' :
                                o.status === 'In Process' ? 'bg-yellow-100 text-yellow-800' :
                                o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-gray-500">Belum ada riwayat pesanan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Seksi 3: Riwayat Pembayaran */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  Riwayat Pembayaran <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{detail.payments.length}</span>
                </h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 sticky top-0 border-b border-gray-200 text-gray-700">
                      <tr>
                        <th className="p-3">No. Cek</th>
                        <th className="p-3">Tanggal Bayar</th>
                        <th className="p-3 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {detail.payments.length > 0 ? (
                        detail.payments.map((p) => (
                          <tr key={p.checkNumber} className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">{p.checkNumber}</td>
                            <td className="p-3 text-gray-600">{new Date(p.paymentDate).toLocaleDateString('id-ID')}</td>
                            <td className="p-3 text-right font-semibold text-gray-800">{formatCurrency(p.amount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-gray-500">Belum ada riwayat pembayaran.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
        
        {/* Footer Modal */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-900 transition-colors"
          >
            Tutup Detail
          </button>
        </div>

      </div>
    </div>
  );
}