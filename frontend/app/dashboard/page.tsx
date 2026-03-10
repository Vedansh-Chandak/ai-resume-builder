'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AI Resume Builder</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">👋 {user?.full_name}</span>
          <button
            onClick={logout}
            className="text-red-500 hover:underline text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-500 mb-8">Welcome back, {user?.full_name}!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => router.push('/upload')}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md cursor-pointer transition"
          >
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-semibold text-gray-900">Upload Resume</h3>
            <p className="text-gray-500 text-sm mt-1">Upload and parse your resume</p>
          </div>

          <div
            onClick={() => router.push('/generate')}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md cursor-pointer transition"
          >
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900">Generate Resume</h3>
            <p className="text-gray-500 text-sm mt-1">AI-powered ATS optimized resume</p>
          </div>

          <div
            onClick={() => router.push('/ats-check')}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md cursor-pointer transition"
          >
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-semibold text-gray-900">ATS Checker</h3>
            <p className="text-gray-500 text-sm mt-1">Industry-grade ATS analysis</p>
          </div>

          <div
            onClick={() => router.push('/skill-gap')}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md cursor-pointer transition"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900">Skill Gap Analyzer</h3>
            <p className="text-gray-500 text-sm mt-1">Find what skills you need</p>
          </div>

          <div
            onClick={() => router.push('/cover-letter')}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md cursor-pointer transition"
          >
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-semibold text-gray-900">Cover Letter</h3>
            <p className="text-gray-500 text-sm mt-1">AI-generated cover letters</p>
          </div>
        </div>
      </main>
    </div>
  );
}