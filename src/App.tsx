import React from 'react';
import Calendar from './components/Calendar/Calendar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-white shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Custom Event Calendar</h1>
          <p className="text-gray-600">Manage your schedule with ease</p>
        </header>
        
        <main className="py-6">
          <Calendar />
        </main>
      </div>
    </div>
  );
}

export default App;