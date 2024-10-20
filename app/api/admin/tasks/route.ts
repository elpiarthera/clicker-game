import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// Helper function to validate admin access
function validateAdminAccess(req: NextRequest): boolean {
    // Ensure 'isLocalhost' is explicitly treated as boolean
    const isLocalhost = req.headers.get('host')?.includes('localhost') ?? false;

    // Explicitly check if ACCESS_ADMIN is 'true' to ensure it's a boolean
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';

    return isLocalhost && isAdminAccessEnabled;
}

// GET: Fetch tasks with rewards included
export async function GET(req: NextRequest) {
    if (!validateAdminAccess(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch tasks and include their associated rewards
    const tasks = await prisma.task.findMany({
        include: { rewards: true }, // Include rewards data in the response
    });

    return NextResponse.json(tasks);
}

// POST: Create a new task with multiple rewards
export async function POST(req: NextRequest) {
    if (!validateAdminAccess(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse task and rewards data from request body
    const { title, description, type, category, points, image, callToAction, taskData, isActive, rewards } = await req.json();

    // Ensure 'isActive' is assigned a default value if it's undefined
    const isActiveSafe: boolean = isActive === undefined ? true : isActive;  // FIX HERE

    // Validate that the rewards array is provided and well-formed
    if (!Array.isArray(rewards) || rewards.length === 0) {
        return NextResponse.json({ error: 'At least one reward is required' }, { status: 400 });
    }

    // Create task and associated rewards within a transaction
    try {
        const task = await prisma.$transaction(async (tx) => {
            const newTask = await tx.task.create({
                data: {
                    title,
                    description,
                    type,
                    category,
                    points,
                    image,
                    callToAction,
                    taskData,
                    isActive: isActiveSafe,
                    rewards: {
                        create: rewards.map(reward => ({
                            title: reward.title,
                            description: reward.description,
                            type: reward.type,
                            amount: reward.amount,
                            image: reward.image || null,
                            isActive: reward.isActive ?? true,
                        })),
                    },
                },
            });
            return newTask;
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Error creating task and rewards' }, { status: 500 });
    }
}

// PUT: Update an existing task and its rewards
export async function PUT(req: NextRequest) {
    if (!validateAdminAccess(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse task and rewards data from request body
    const { id, title, description, type, category, points, image, callToAction, taskData, isActive, rewards } = await req.json();

    // Ensure 'isActive' is assigned a default value if it's undefined
    const isActiveSafe: boolean = isActive === undefined ? true : isActive;  // FIX HERE

    // Validate task ID and rewards array
    if (!id || !Array.isArray(rewards)) {
        return NextResponse.json({ error: 'Task ID and rewards are required' }, { status: 400 });
    }

    // Update task and associated rewards in a transaction
    try {
        const updatedTask = await prisma.$transaction(async (tx) => {
            // Update the task details
            const task = await tx.task.update({
                where: { id },
                data: {
                    title,
                    description,
                    type,
                    category,
                    points,
                    image,
                    callToAction,
                    taskData,
                    isActive: isActiveSafe,
                },
            });

            // Delete existing rewards for the task
            await tx.reward.deleteMany({ where: { taskId: id } });

            // Create new rewards
            await tx.reward.createMany({
                data: rewards.map(reward => ({
                    taskId: id,
                    title: reward.title,
                    description: reward.description,
                    type: reward.type,
                    amount: reward.amount,
                    image: reward.image || null,
                    isActive: reward.isActive ?? true,
                })),
            });

            return task;
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Error updating task and rewards' }, { status: 500 });
    }
}
