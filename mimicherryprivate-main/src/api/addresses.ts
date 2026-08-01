import { apiFetch } from "@/lib/api";

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPayload {
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  country?: string;
  isDefault?: boolean;
}

export const getAddresses = () => apiFetch<Address[]>("/addresses");

export const createAddress = (payload: AddressPayload) =>
  apiFetch<Address>("/addresses", { method: "POST", body: JSON.stringify(payload) });

export const updateAddress = (id: string, payload: Partial<AddressPayload>) =>
  apiFetch<Address>(`/addresses/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteAddress = (id: string) =>
  apiFetch<void>(`/addresses/${id}`, { method: "DELETE" });
