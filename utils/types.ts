export type IconProps = {
    size?: number;
    className?: string;
}

// Define the Reward type
export interface Reward {
    id: string;
    title: string;
    description: string;
    type: 'XP' | 'NFT' | 'TOKEN' | 'BOOSTER' | 'MYSTERY_BOX'; // Enum types of rewards
    amount: number;
    image?: string; // Optional field for an image
    isActive: boolean;
}

// Updated Task interface to include rewards
export interface Task {
    id: string;
    title: string;
    description: string;
    points: number;
    type: string;
    category: string;
    image: string;
    callToAction: string;
    taskData: any;
    taskStartTimestamp: Date | null;
    isCompleted: boolean;

    // New field for rewards: an array of Reward objects
    rewards: Reward[];
}

// Update TaskPopupProps to ensure it reflects the updated Task type
export interface TaskPopupProps {
    task: Task;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
}
