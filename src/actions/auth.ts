"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Simulasi Database Pengguna
const MOCK_DB = [
  { username: 'admin', password: 'admin123', name: 'Admin Desa', role: 'admin' },
  { username: 'budi', password: 'user123', name: 'Budi Santoso', role: 'customer' }
];

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = MOCK_DB.find(u => u.username === username && u.password === password);

  if (user) {
    const cookieStore = await cookies();
    
    // Simpan data dalam bentuk JSON String
    const sessionData = JSON.stringify({
      username: user.username,
      name: user.name,
      role: user.role
    });

    cookieStore.set('rewang_auth', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 hari
      path: '/',
    });
    
    if (user.role === 'admin') {
      redirect('/admin');
    } else {
      redirect('/'); // User biasa kembali ke beranda
    }
  } else {
    return { error: 'Username atau password salah!' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('rewang_auth');
  redirect('/login');
}

