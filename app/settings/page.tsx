import SettingsPanel from '../../components/SettingsPanel';

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <SettingsPanel />
      </div>
    </main>
  );
}
