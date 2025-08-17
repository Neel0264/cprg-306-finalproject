'use client';
import Header from "@/components/Header";
import QuoteBox from "@/components/QuoteBox";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import StatsCard from "@/components/StatsCard";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to StudyBuddy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay organized and motivated with your personalized study planner
          </p>
        </div>

        <StatsCard />
        <AnalyticsDashboard />
        <QuoteBox />
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Your Study Tasks
          </h2>
          <TaskInput />
        </div>
        
        <TaskList />
      </main>
    </div>
  );
}
