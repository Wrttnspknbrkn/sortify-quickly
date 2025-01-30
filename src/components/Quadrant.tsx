import { cn } from "@/lib/utils";
import TaskCard from "./TaskCard";

interface QuadrantProps {
  title: string;
  tasks: Array<{
    id: string;
    content: string;
    completed: boolean;
    startTime?: number;
    elapsedTime?: number;
  }>;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  showTimer?: boolean;
}

const Quadrant = ({
  title,
  tasks,
  onDrop,
  onDragOver,
  onDragStart,
  onDeleteTask,
  onToggleComplete,
  showTimer = false,
}: QuadrantProps) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={cn("quadrant min-h-[200px]")}
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          content={task.content}
          completed={task.completed}
          onDragStart={onDragStart}
          onDelete={onDeleteTask}
          onToggleComplete={onToggleComplete}
          showTimer={showTimer}
          startTime={task.startTime}
          elapsedTime={task.elapsedTime}
        />
      ))}
    </div>
  );
};

export default Quadrant;