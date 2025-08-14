export default function SettingsPage() {
    return (
      <main className="min-h-screen bg-gray-50 text-black">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
  
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Theme</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Toggle Light / Dark
              </button>
            </div>
  
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Task Settings</h2>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Reset All Tasks
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  