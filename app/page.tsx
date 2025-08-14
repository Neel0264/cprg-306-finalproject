import Header from "@/components/Header";
import QuoteBox from "@/components/QuoteBox";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Header />
        <QuoteBox />
        <h2 className="text-2xl font-semibold mb-4 mt-6">Your Tasks</h2>
        <TaskInput />
        <TaskList />
      </div>
    </main>
  );
}
