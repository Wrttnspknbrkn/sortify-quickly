import { useState } from 'react';
import { cn } from "@/lib/utils";

interface TaskCardProps {
  id: string;
  content: string;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ id, content, onDragStart, onDelete }: TaskCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "task-card",
        isDragging && "dragging"
      )}
    >
      <div className="flex justify-between items-center">
        <span>{content}</span>
        <button
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-destructive transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default TaskCard;