'use client';

import { useRouter } from 'next/navigation';

export default function TaskDashboard() {
    const router = useRouter();

    return (
        <div className="bg-[#1d2025] text-white min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-[#f3ba2f]">Task Management Dashboard</h1>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => router.push('/admin/tasks/list')}
                        className="px-6 py-3 bg-[#f3ba2f] text-black rounded-lg hover:bg-[#f4c141] transition-colors"
                    >
                        View Tasks
                    </button>
                    <button
                        onClick={() => router.push('/admin/tasks/create')}
                        className="px-6 py-3 bg-[#f3ba2f] text-black rounded-lg hover:bg-[#f4c141] transition-colors"
                    >
                        Create New Task
                    </button>
                </div>
            </div>
        </div>
    );
}
