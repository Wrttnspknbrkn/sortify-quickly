import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Layers } from "lucide-react";
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#F8FAFC] via-[#E5DEFF] to-[#D3E4FD]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="logo-animation">
            <Layers size={48} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              QuickSort-It
            </h1>
            <p className="text-lg text-muted-foreground">
              Declutter your life, one decision at a time
            </p>
          </div>
        </div>
        
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