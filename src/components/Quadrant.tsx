import { cn } from "@/lib/utils";
import TaskCard from "./TaskCard";

interface QuadrantProps {
  title: string;
  tasks: Array<{ id: string; content: string }>;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDeleteTask: (id: string) => void;
}

const Quadrant = ({
  title,
  tasks,
  onDrop,
  onDragOver,
  onDragStart,
  onDeleteTask,
}: QuadrantProps) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={cn("quadrant min-h-[200px]")}
    >
      <h2 className="text-lg font-semibold mb-4 text-primary">{title}</h2>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          content={task.content}
          onDragStart={onDragStart}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default Quadrant;