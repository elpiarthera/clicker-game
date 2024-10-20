// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const telegramInitData = url.searchParams.get('initData');

  if (!telegramInitData) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { validatedData, user } = validateTelegramWebAppData(telegramInitData);

  if (!validatedData) {
    return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 403 });
  }

  const telegramId = user.id?.toString();

  if (!telegramId) {
    return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
  }

  try {
    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch only active tasks and include rewards
    const activeTasks = await prisma.task.findMany({
      where: { isActive: true },
      include: { rewards: true },  // Include the rewards for each task
    });

    // Fetch valid UserTask entries for this user, only for active tasks
    const validUserTasks = await prisma.userTask.findMany({
      where: {
        userId: user.id,
        task: { 
          isNot: undefined,
          isActive: true
        },
      },
      include: {
        task: true,
      },
    });

    // Prepare the response data, ensuring tasks are mapped with rewards and user task info
    const tasksData = activeTasks.map(task => {
      const userTask = validUserTasks.find(ut => ut.taskId === task.id);
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        type: task.type,
        category: task.category,
        image: task.image,
        callToAction: task.callToAction,
        taskData: task.taskData,
        isActive: task.isActive,
        rewards: task.rewards, // Include rewards for each task
        taskStartTimestamp: userTask?.taskStartTimestamp || null,
        isCompleted: userTask?.isCompleted || false,
      };
    });

    return NextResponse.json({
      tasks: tasksData,
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch user tasks' }, { status: 500 });
  }
}
