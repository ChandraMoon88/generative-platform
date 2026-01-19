/**
 * Demo Scenarios
 * Example applications that demonstrate the universal component library
 */

'use client';

import React from 'react';

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Demo Scenarios</h1>
        <p className="text-lg text-gray-600 mb-8">
          Interactive component demonstrations are available in development mode.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Demos</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2"></span>
              <div>
                <strong>Restaurant Booking System</strong>
                <p className="text-gray-600">Calendar, forms, and reservation management</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2"></span>
              <div>
                <strong>Project Management</strong>
                <p className="text-gray-600">Kanban boards, task tracking, and team collaboration</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2"></span>
              <div>
                <strong>E-Commerce Store</strong>
                <p className="text-gray-600">Product listings, shopping cart, and checkout flow</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2"></span>
              <div>
                <strong>Admin Dashboard</strong>
                <p className="text-gray-600">User management, data tables, and system settings</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
