import { useState } from 'react';
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
        "task-card group",
        isDragging && "dragging"
      )}
    >
      <div className="flex justify-between items-center gap-2">
        <span className="flex-1">{content}</span>
        <button
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-destructive 
                   transition-all duration-200 p-1 rounded-full hover:bg-destructive/10"
          aria-label="Delete task"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;