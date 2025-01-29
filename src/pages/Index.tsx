import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Quadrant from "@/components/Quadrant";
import AddTaskForm from "@/components/AddTaskForm";

interface Task {
  id: string;
  content: string;
  quadrant: string;
}

const QUADRANTS = {
  Q1: "Urgent & Important",
  Q2: "Not Urgent but Important",
  Q3: "Urgent but Not Important",
  Q4: "Neither",
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("taskId", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetQuadrant: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, quadrant: targetQuadrant }
        : task
    ));

    toast({
      title: "Task moved",
      description: `Task moved to ${targetQuadrant}`,
    });
  };

  const addTask = (content: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      quadrant: "Q1",
    };
    setTasks(prev => [...prev, newTask]);
    
    toast({
      title: "Task added",
      description: "New task has been added successfully",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Task has been removed",
      variant: "destructive",
    });
  };

  const getTasksByQuadrant = (quadrant: string) => 
    tasks.filter(task => task.quadrant === quadrant);

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">QuickSort-It</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Declutter your life, one decision at a time.
        </p>
        
        <AddTaskForm onAddTask={addTask} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(QUADRANTS).map(([key, title]) => (
            <Quadrant
              key={key}
              title={title}
              tasks={getTasksByQuadrant(key)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, key)}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;