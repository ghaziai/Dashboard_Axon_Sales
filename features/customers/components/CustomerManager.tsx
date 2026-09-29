'use client';

import { useState, useEffect, useCallback } from 'react';
import { Customer, CustomerFilterParams, CustomerFormData } from '@/features/customers/types';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/features/customers/services/customer-service';
import { CustomerFormModal } from '@/features/customers/components/CustomerFormModal';
import { CustomerDetailModal } from '@/features/customers/components/CustomerDetailModal'; // <-- Tambahan import detail modal
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/format';

export function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; 

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // State khusus untuk Detail Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const fetchCustomers = useCallback(async (currentSearch: string, currentCountry: string, page: number) => {
    try {
      const filters: CustomerFilterParams = {
        page: page,
        limit: itemsPerPage
      };
      
      if (currentSearch) filters.search = currentSearch;
      if (currentCountry) filters.country = currentCountry;

      const res = await getCustomers(filters);
      setCustomers(res.data);
      setTotalPages(Math.ceil(res.count / itemsPerPage) || 1);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCustomers('', '', 1);
    };
    loadInitialData();
  }, [fetchCustomers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCurrentPage(1); 
    fetchCustomers(search, countryFilter, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setLoading(true);
      setCurrentPage(newPage);
      fetchCustomers(search, countryFilter, newPage);
    }
  };

  const handleCreateOrUpdate = async (formData: CustomerFormData) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.customerNumber, formData);
    } else {
      await createCustomer(formData);
    }
    setLoading(true);
    fetchCustomers(search, countryFilter, currentPage);
    setIsFormModalOpen(false);
  };

  const handleDelete = async (customerNumber: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      await deleteCustomer(customerNumber);
      setLoading(true);
      const targetPage = (customers.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
      setCurrentPage(targetPage);
      fetchCustomers(search, countryFilter, targetPage);
    }
  };

  return (
    <Card title="Daftar & Manajemen Pelanggan">
      <div className="space-y-4">
        
        {/* Kontrol Pencarian & Tambah */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 w-full md:w-2/3">
            <input
              type="text"
              placeholder="Cari pelanggan..."
              className="border border-gray-300 rounded p-2 text-sm w-full md:w-1/2 focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter negara..."
              className="border border-gray-300 rounded p-2 text-sm w-full md:w-1/4 focus:ring-2 focus:ring-blue-500"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            />
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 transition-colors">
              Cari
            </button>
          </form>
          
          <button
            onClick={() => {
              setEditingCustomer(null);
              setIsFormModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 whitespace-nowrap transition-colors"
          >
            + Tambah Pelanggan
          </button>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data pelanggan...</div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Pelanggan tidak ditemukan.</div>
          ) : (
            <div className="flex flex-col">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                  <tr>
                    <th className="p-3 font-semibold">Pelanggan</th>
                    <th className="p-3 font-semibold">Kontak</th>
                    <th className="p-3 font-semibold">Telepon</th>
                    <th className="p-3 font-semibold">Lokasi</th>
                    <th className="p-3 font-semibold text-right">Limit&nbsp;Kredit</th>
                    <th className="p-3 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((c) => (
                    <tr key={c.customerNumber} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium text-gray-900">{c.customerName}</td>
                      <td className="p-3 text-gray-700">{`${c.contactFirstName} ${c.contactLastName}`}</td>
                      <td className="p-3 text-gray-700">{c.phone}</td>
                      <td className="p-3 text-gray-700">{`${c.city}, ${c.country}`}</td>
                      <td className="p-3 text-right font-medium text-gray-800">{formatCurrency(c.creditLimit)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                            {/* Tombol Detail (Ikon Mata) */}
                            <button
                            onClick={() => {
                                setSelectedCustomerId(c.customerNumber);
                                setIsDetailModalOpen(true);
                            }}
                            className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                            title="Lihat Detail"
                            >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            </button>

                            {/* Tombol Edit (Ikon Pensil) */}
                            <button
                            onClick={() => {
                                setEditingCustomer(c);
                                setIsFormModalOpen(true);
                            }}
                            className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                            title="Edit Pelanggan"
                            >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            </button>

                            {/* Tombol Hapus (Ikon Tempat Sampah) */}
                            <button
                            onClick={() => handleDelete(c.customerNumber)}
                            className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                            title="Hapus Pelanggan"
                            >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paging Controls */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
                <p className="text-sm text-gray-700">
                  Halaman <span className="font-medium">{currentPage}</span> dari <span className="font-medium">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 text-sm border rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Form Tambah/Edit */}
        {isFormModalOpen && (
          <CustomerFormModal
            onClose={() => setIsFormModalOpen(false)}
            onSubmit={handleCreateOrUpdate}
            initialData={editingCustomer}
          />
        )}

        {/* Modal Detail Pelanggan */}
        <CustomerDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCustomerId(null);
          }}
          customerNumber={selectedCustomerId}
        />

      </div>
    </Card>
  );
}