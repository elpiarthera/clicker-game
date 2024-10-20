'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskType } from '@prisma/client';
import IceCube from '@/icons/IceCube';
import { formatNumber } from '@/utils/ui';
import { useRouter } from 'next/navigation';

interface ExtendedTask extends Task {
    taskData: {
        link?: string;
        chatId?: string;
        friendsNumber?: number;
    };
}

export default function TaskList() {
    const [tasks, setTasks] = useState<ExtendedTask[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [hideInactive, setHideInactive] = useState(false); // State for hiding inactive tasks
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const router = useRouter();

    // Fetch tasks from the API
    const fetchTasks = useCallback(async () => {
        setIsLoadingTasks(true);
        try {
            const response = await fetch('/api/admin/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoadingTasks(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Filter tasks by active status and search query
    const filteredTasks = tasks
        .filter(task => !hideInactive || task.isActive) // If hideInactive is true, only show active tasks
        .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase())); // Filter by search query

    return (
        <div className="bg-[#1d2025] text-white min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-[#f3ba2f]">Existing Tasks ({filteredTasks.length})</h1>

                {/* Search Bar and Filter */}
                <div className="mb-6 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        className="w-full bg-[#3a3d42] p-3 rounded-lg text-white mb-4 md:mb-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <label className="flex items-center space-x-2 ml-4">
                        <input
                            type="checkbox"
                            checked={hideInactive}
                            onChange={() => setHideInactive(!hideInactive)}
                            className="form-checkbox h-5 w-5 text-[#f3ba2f]"
                        />
                        <span>Hide Inactive Tasks</span>
                    </label>
                </div>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoadingTasks ? (
                        [...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#3a3d42] rounded-lg p-4 animate-pulse">
                                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                            </div>
                        ))
                    ) : filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <div key={task.id} className="bg-[#3a3d42] rounded-lg p-4 flex flex-col h-full">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                                    <p className="text-gray-400 mb-3">{task.description}</p>
                                    <div className="flex items-center mb-2">
                                        <IceCube className="w-4 h-4 mr-2" />
                                        <span className="text-[#f3ba2f] font-medium">{formatNumber(task.points)}</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Type: {task.type}</p>
                                    <p className="text-sm text-gray-400">Category: {task.category}</p>
                                    <p className="text-sm text-gray-400">Active: {task.isActive ? 'Yes' : 'No'}</p>

                                    {/* Additional data based on task type */}
                                    {task.type === TaskType.VISIT && task.taskData?.link && (
                                        <p className="text-sm text-gray-400">Link: {task.taskData.link}</p>
                                    )}
                                    {task.type === TaskType.TELEGRAM && (
                                        <>
                                            {task.taskData?.link && <p className="text-sm text-gray-400">Link: {task.taskData.link}</p>}
                                            {task.taskData?.chatId && <p className="text-sm text-gray-400">Chat ID: {task.taskData.chatId}</p>}
                                        </>
                                    )}
                                    {task.type === TaskType.REFERRAL && task.taskData?.friendsNumber && (
                                        <p className="text-sm text-gray-400">Friends Required: {task.taskData.friendsNumber}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => router.push(`/admin/tasks/edit/${task.id}`)}
                                    className="w-full mt-4 px-4 py-2 bg-[#f3ba2f] text-black rounded-lg hover:bg-[#f4c141] transition-colors"
                                >
                                    Edit
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400 bg-[#3a3d42] rounded-lg p-8">
                            No tasks available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
