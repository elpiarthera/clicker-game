// app/api/admin/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// GET: Fetch task details for editing
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const task = await prisma.task.findUnique({
            where: { id: params.id },
            include: { rewards: true }, // Ensure rewards are fetched with the task
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
    }
}

// PUT: Update task details
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const isLocalhost = req.headers.get('host')?.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';

    if (!isLocalhost || !isAdminAccessEnabled) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const taskData = await req.json();

        // Remove the id from the taskData
        const { id, ...updateData } = taskData;

        const task = await prisma.task.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('Update task error:', error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}
