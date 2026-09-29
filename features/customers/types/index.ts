export interface Customer {
  customerNumber: number;
  customerName: string;
  contactFirstName: string;
  contactLastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  salesRepEmployeeNumber?: number | null;
  creditLimit: number;
}

export interface CustomerFormData {
  customerName: string;
  contactFirstName: string;
  contactLastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  salesRepEmployeeNumber?: number | null;
  creditLimit: number;
}

export interface CustomerFilterParams {
  search?: string;
  country?: string;
  city?: string;
  minCreditLimit?: number;
  maxCreditLimit?: number;
}

export interface CustomerDetail extends Customer {
  orders: {
    orderNumber: number;
    orderDate: string;
    requiredDate: string;
    shippedDate?: string | null;
    status: string;
  }[];
  payments: {
    checkNumber: string;
    paymentDate: string;
    amount: number;
  }[];
  totalSpent: number;
  totalOrders: number;
}

export interface CustomerFilterParams {
  search?: string;
  country?: string;
  city?: string;
  minCreditLimit?: number;
  maxCreditLimit?: number;
  // Tambahan untuk paging
  page?: number;
  limit?: number;
}

// Tambahan untuk respon paging dari Supabase
export interface PaginatedCustomers {
  data: Customer[];
  count: number;
}