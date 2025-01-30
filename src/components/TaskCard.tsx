import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { X, Clock, CheckCircle } from "lucide-react";

interface TaskCardProps {
  id: string;
  content: string;
  completed: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  showTimer?: boolean;
  startTime?: number;
  elapsedTime?: number;
}

const TaskCard = ({
  id,
  content,
  completed,
  onDragStart,
  onDelete,
  onToggleComplete,
  showTimer = false,
  startTime,
  elapsedTime,
}: TaskCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (ms?: number) => {
    if (!ms) return '00:00';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, id);
    
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(3deg) scale(1.1)';
    dragImage.style.opacity = '0.9';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    requestAnimationFrame(() => {
      dragImage.remove();
    });
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
        "task-card group relative",
        isDragging && "dragging",
        completed && "opacity-50"
      )}
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => onToggleComplete(id)}
            className={cn(
              "transition-colors duration-200",
              completed ? "text-primary" : "text-gray-300 hover:text-primary"
            )}
          >
            <CheckCircle size={18} />
          </button>
          <span className={cn(completed && "line-through")}>{content}</span>
        </div>
        {showTimer && !completed && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        )}
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