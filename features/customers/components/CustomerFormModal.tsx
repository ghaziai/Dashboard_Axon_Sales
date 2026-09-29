'use client';

import { useState } from 'react';
import { Customer, CustomerFormData } from '../types';

interface Props {
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  initialData?: Customer | null;
}

export function CustomerFormModal({ onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<CustomerFormData>({
    customerName: initialData?.customerName || '',
    contactFirstName: initialData?.contactFirstName || '',
    contactLastName: initialData?.contactLastName || '',
    phone: initialData?.phone || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || '',
    creditLimit: initialData?.creditLimit || 0,
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      // onClose akan dieksekusi di komponen parent
    } catch (err: unknown) {
      // Tampilkan detail error di console browser
      console.error('SUPABASE ERROR DETAIL:', err);
      const message = err instanceof Error ? err.message : 'Periksa koneksi atau input Anda';
      alert(`Gagal menyimpan data: ${message}`);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {initialData ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Depan pelanggan</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                value={formData.contactFirstName}
                onChange={(e) => setFormData({ ...formData, contactFirstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Belakang pelanggan</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                value={formData.contactLastName}
                onChange={(e) => setFormData({ ...formData, contactLastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Alamat Baris 1</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kota</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Provinsi</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Negara</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Limit Kredit</label>
            <input
              type="number"
              required
              className="w-full border border-gray-300 rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}