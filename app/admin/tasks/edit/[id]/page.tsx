'use client';

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from 'next/navigation';
import { Task, TaskType } from '@prisma/client';
import * as z from "zod";
import { useToast } from '@/contexts/ToastContext';
import { imageMap } from '@/images';

// Define interfaces for TaskFormData and Reward
interface TaskFormData {
    title: string;
    description: string;
    points: number | null;
    type: TaskType;
    category: string;
    image: string;
    callToAction: string;
    isActive: boolean;
    rewards: Reward[];
    taskData: {
        link?: string;
        chatId?: string;
        friendsNumber?: number;
    };
}

interface Reward {
    title: string;
    description: string;
    type: 'XP' | 'TOKEN' | 'NFT' | 'BOOSTER' | 'MYSTERY_BOX';
    amount: number;
    image?: string;
    isActive: boolean;
}

// Define the Zod schema for task form validation
const taskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().min(1, "Description is required").max(200),
    points: z.number().min(0, "Points must be a positive number").nullable(),
    type: z.nativeEnum(TaskType),
    category: z.string().min(1, "Category is required"),
    image: z.string().min(1, "Image is required"),
    callToAction: z.string().min(1, "Call to action is required"),
    isActive: z.boolean(),
    rewards: z.array(z.object({
        title: z.string().min(1, "Reward title is required"),
        description: z.string().min(1, "Reward description is required"),
        type: z.enum(['XP', 'TOKEN', 'NFT', 'BOOSTER', 'MYSTERY_BOX']),
        amount: z.number().min(1, "Amount must be positive"),
        image: z.string().optional(),
        isActive: z.boolean(),
    })),
    taskData: z.object({
        link: z.string().url("Link must be a valid URL").optional(),
        chatId: z.string().optional(),
        friendsNumber: z.number().int("Number of friends must be an integer").positive("Number of friends must be positive").nullable().optional(),
    }),
});

// Default values for the form
const DEFAULT_FORM_VALUES: Partial<TaskFormData> = {
    title: '',
    description: '',
    points: null,
    type: TaskType.VISIT,
    category: '',
    image: '',
    callToAction: '',
    isActive: true,
    rewards: [{
        title: '',
        description: '',
        type: 'XP',
        amount: 0,
        isActive: true,
    }],
    taskData: {
        link: '',
        chatId: '',
        friendsNumber: undefined,
    },
};

export default function EditTask() {
    const router = useRouter();
    const { id: taskId } = useParams(); // Get task ID from the URL
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useToast();

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: DEFAULT_FORM_VALUES,
    });

    const taskType = watch("type");
    const imageValue = watch("image");

    // Fetch existing task data for editing
    useEffect(() => {
        if (taskId) {
            const fetchTask = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/admin/tasks/${taskId}`);
                    const task = await response.json();
                    // Populate form with the fetched task data
                    reset({
                        title: task.title,
                        description: task.description,
                        points: task.points || null, // Handle nullable points
                        type: task.type,
                        category: task.category,
                        image: task.image,
                        callToAction: task.callToAction,
                        isActive: task.isActive,
                        rewards: task.rewards || DEFAULT_FORM_VALUES.rewards, // Use default if no rewards
                        taskData: {
                            link: task.taskData?.link || '',
                            chatId: task.taskData?.chatId || '',
                            friendsNumber: task.taskData?.friendsNumber || null,
                        },
                    });
                } catch (error) {
                    console.error('Error fetching task:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTask();
        }
    }, [taskId, reset]);

    // Handle form submission
    const onSubmit = async (data: TaskFormData) => {
        try {
            await fetch(`/api/admin/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            showToast('Task updated successfully!', 'success');
            router.push('/admin/tasks/list'); // Redirect to task list after successful update
        } catch (error) {
            console.error('Error updating task:', error);
            showToast('Failed to update task. Please try again.', 'error');
        }
    };

    // Set image when clicked
    const handleImageClick = (imageName: string) => {
        setValue("image", imageName);
    };

    return (
        <div className="bg-[#1d2025] text-white min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-[#f3ba2f]">Edit Task</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="mb-12 bg-[#272a2f] rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6">Task Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Task Title */}
                        <div>
                            <input
                                {...register("title")}
                                placeholder="Title"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                maxLength={100}
                                autoComplete="off"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Task Description */}
                        <div>
                            <input
                                {...register("description")}
                                placeholder="Description"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                maxLength={200}
                                autoComplete="off"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        {/* Task Points */}
                        <div>
                            <input
                                type="number"
                                {...register("points", { valueAsNumber: true })}
                                placeholder="Points"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                autoComplete="off"
                            />
                            {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points.message}</p>}
                        </div>

                        {/* Task Type */}
                        <div>
                            <select
                                {...register("type")}
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                            >
                                {Object.values(TaskType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                        </div>

                        {/* Task Category */}
                        <div>
                            <input
                                {...register("category")}
                                placeholder="Category"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg mb-2"
                                autoComplete="off"
                            />
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                        </div>

                        {/* Task Image */}
                        <div>
                            <input
                                {...register("image")}
                                placeholder="Image"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg mb-2"
                                autoComplete="off"
                                readOnly
                            />
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(imageMap).map(([name, src]) => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => handleImageClick(name)}
                                        className={`p-1 rounded transition-colors ${imageValue === name
                                            ? 'bg-[#f3ba2f] hover:bg-[#f4c141]'
                                            : 'bg-[#3a3d42] hover:bg-[#4a4d52]'
                                            }`}
                                    >
                                        <img
                                            src={src.src}
                                            alt={name}
                                            className="w-8 h-8 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Call To Action */}
                        <div>
                            <input
                                {...register("callToAction")}
                                placeholder="Call To Action"
                                className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                autoComplete="off"
                            />
                            {errors.callToAction && <p className="text-red-500 text-sm mt-1">{errors.callToAction.message}</p>}
                        </div>

                        {/* Is Active */}
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                {...register("isActive")}
                                className="form-checkbox h-5 w-5 text-[#f3ba2f]"
                                autoComplete="off"
                            />
                            <span>Is Active</span>
                        </label>

                        {/* Link field (for VISIT and TELEGRAM tasks) */}
                        {(taskType === TaskType.VISIT || taskType === TaskType.TELEGRAM) && (
                            <div>
                                <input
                                    {...register("taskData.link")}
                                    placeholder="Link"
                                    className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                    autoComplete="off"
                                />
                                {errors.taskData?.link && <p className="text-red-500 text-sm mt-1">{errors.taskData.link.message}</p>}
                            </div>
                        )}

                        {/* Chat ID (for TELEGRAM tasks) */}
                        {taskType === TaskType.TELEGRAM && (
                            <div>
                                <input
                                    {...register("taskData.chatId")}
                                    placeholder="Chat ID (e.g., clicker_game_news)"
                                    className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                    autoComplete="off"
                                />
                                {errors.taskData?.chatId && <p className="text-red-500 text-sm mt-1">{errors.taskData.chatId.message}</p>}
                            </div>
                        )}

                        {/* Friends Number (for REFERRAL tasks) */}
                        {taskType === TaskType.REFERRAL && (
                            <div>
                                <input
                                    type="number"
                                    {...register("taskData.friendsNumber", { valueAsNumber: true })}
                                    placeholder="Number of Friends"
                                    className="w-full bg-[#3a3d42] p-3 rounded-lg"
                                    autoComplete="off"
                                />
                                {errors.taskData?.friendsNumber && <p className="text-red-500 text-sm mt-1">{errors.taskData.friendsNumber.message}</p>}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="submit" className="px-6 py-2 bg-[#f3ba2f] text-black rounded-lg hover:bg-[#f4c141] transition-colors">
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
