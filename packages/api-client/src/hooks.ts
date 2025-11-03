"use client"

import { useState, useEffect } from 'react';
import { apiClient, type Contact, type ContactRequest, type Invitation } from '@youbet/api-client';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async (search?: string) => {
    try {
      setLoading(true);
      const data = await apiClient.getContacts(search);
      setContacts(data.contacts);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const removeContact = async (contactId: string) => {
    await apiClient.removeContact(contactId);
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  return {
    contacts,
    loading,
    error,
    refetch: fetchContacts,
    removeContact,
  };
}

export function useContactRequests() {
  const [sent, setSent] = useState<ContactRequest[]>([]);
  const [received, setReceived] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const [sentData, receivedData] = await Promise.all([
        apiClient.getSentRequests(),
        apiClient.getReceivedRequests(),
      ]);
      setSent(sentData.requests);
      setReceived(receivedData.invitations);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const sendRequest = async (phone: string, message?: string) => {
    const result = await apiClient.sendContactRequest(phone, message);
    await fetchAll();
    return result;
  };

  const approveRequest = async (requestId: string) => {
    await apiClient.approveContactRequest(requestId);
    setReceived(received.filter(r => r.id !== requestId));
  };

  const declineRequest = async (requestId: string) => {
    await apiClient.declineContactRequest(requestId);
    setReceived(received.filter(r => r.id !== requestId));
  };

  const cancelRequest = async (requestId: string) => {
    await apiClient.cancelContactRequest(requestId);
    setSent(sent.filter(r => r.id !== requestId));
  };

  return {
    sent,
    received,
    loading,
    sendRequest,
    approveRequest,
    declineRequest,
    cancelRequest,
    refetch: fetchAll,
  };
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      apiClient.setToken(token);
      apiClient.getProfile()
        .then(setUser)
        .catch(() => apiClient.clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const sendOtp = async (phone: string) => {
    return apiClient.sendOtp(phone);
  };

  const verifyOtp = async (phone: string, code: string, name?: string, email?: string) => {
    const data = await apiClient.verifyOtp(phone, code, name, email);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    sendOtp,
    verifyOtp,
    logout,
    isAuthenticated: !!user,
  };
}

