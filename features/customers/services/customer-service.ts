import { createClient } from '@/lib/supabase/client';
import { Customer, CustomerFormData, CustomerFilterParams, CustomerDetail, PaginatedCustomers } from '../types';

const supabase = createClient();

export async function getCustomers(filters?: CustomerFilterParams): Promise<PaginatedCustomers> {
  // Tambahkan opsi count: 'exact' untuk mendapatkan total baris keseluruhan
  let query = supabase.from('customers').select('*', { count: 'exact' });

  if (filters?.search) {
    query = query.or(
      `customerName.ilike.%${filters.search}%,contactFirstName.ilike.%${filters.search}%,contactLastName.ilike.%${filters.search}%`
    );
  }

  if (filters?.country) {
    query = query.eq('country', filters.country);
  }

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }

  if (filters?.minCreditLimit !== undefined) {
    query = query.gte('creditLimit', filters.minCreditLimit);
  }

  if (filters?.maxCreditLimit !== undefined) {
    query = query.lte('creditLimit', filters.maxCreditLimit);
  }

  // Logika Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  
  // Hitung index awal dan akhir (Supabase menggunakan index berbasis 0)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Terapkan limit dan offset
  const { data, error, count } = await query
    .order('customerName', { ascending: true })
    .range(from, to);

  if (error) throw error;
  
  return { 
    data: data || [], 
    count: count || 0 
  };
}

// ... (Fungsi getCustomerDetail, createCustomer, updateCustomer, deleteCustomer biarkan SAMA seperti sebelumnya) ...

export async function getCustomerDetail(customerNumber: number): Promise<CustomerDetail> {
  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .select('*')
    .eq('customerNumber', customerNumber)
    .single();

  if (custErr) throw custErr;

  const { data: orders, error: ordErr } = await supabase
    .from('orders')
    .select('orderNumber, orderDate, requiredDate, shippedDate, status')
    .eq('customerNumber', customerNumber)
    .order('orderDate', { ascending: false });

  if (ordErr) throw ordErr;

  const { data: payments, error: payErr } = await supabase
    .from('payments')
    .select('checkNumber, paymentDate, amount')
    .eq('customerNumber', customerNumber)
    .order('paymentDate', { ascending: false });

  if (payErr) throw payErr;

  const totalSpent = (payments || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return {
    ...customer,
    orders: orders || [],
    payments: payments || [],
    totalSpent,
    totalOrders: orders?.length || 0,
  };
}

export async function createCustomer(payload: CustomerFormData): Promise<Customer> {
  // 1. Ambil nilai customerNumber tertinggi yang ada di database saat ini
  const { data: maxCust, error: fetchError } = await supabase
    .from('customers')
    .select('customerNumber')
    .order('customerNumber', { ascending: false })
    .limit(1)
    .single();

  // Abaikan error 'PGRST116' (No rows found) jika tabel kebetulan benar-benar kosong
  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError;
  }

  // 2. Buat ID baru (tambah 1 dari ID tertinggi, atau mulai dari 1000 jika tabel kosong)
  const nextId = maxCust ? Number(maxCust.customerNumber) + 1 : 1000;

  // 3. Sisipkan customerNumber ke dalam payload sebelum dikirim
  const payloadWithId = {
    ...payload,
    customerNumber: nextId,
  };

  // 4. Insert data lengkap (termasuk ID) ke Supabase
  const { data, error } = await supabase
    .from('customers')
    .insert([payloadWithId])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(
  customerNumber: number,
  payload: Partial<CustomerFormData>
): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .update(payload)
    .eq('customerNumber', customerNumber)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCustomer(customerNumber: number): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('customerNumber', customerNumber);

  if (error) throw error;
}