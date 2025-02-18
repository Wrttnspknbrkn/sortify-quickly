import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Layers, Download } from "lucide-react";
import Quadrant from "@/components/Quadrant";
import AddTaskForm from "@/components/AddTaskForm";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { playDragSound, playDropSound, playCompleteSound } from "@/utils/sounds";

interface Task {
  id: string;
  content: string;
  quadrant: string;
  completed: boolean;
  startTime?: number;
  elapsedTime?: number;
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

  // Timer effect for Q1 tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.quadrant === 'Q1' && task.startTime && !task.completed) {
            return {
              ...task,
              elapsedTime: Date.now() - task.startTime
            };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    let exportText = "QuickSort-It Tasks\n";
    exportText += `Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n`;

    Object.entries(QUADRANTS).forEach(([key, title]) => {
      const quadrantTasks = tasks.filter(task => task.quadrant === key);
      
      exportText += `${title.toUpperCase()}\n`;
      exportText += "----------------------------------------\n";
      
      if (quadrantTasks.length === 0) {
        exportText += "No tasks in this category\n";
      } else {
        quadrantTasks.forEach((task, index) => {
          exportText += `${index + 1}. ${task.content}\n`;
          exportText += `   Status: ${task.completed ? "✓ Completed" : "○ Pending"}\n`;
          if (task.elapsedTime) {
            const seconds = Math.floor(task.elapsedTime / 1000);
            exportText += `   Time spent: ${seconds} seconds\n`;
          }
          exportText += "\n";
        });
      }
      exportText += "\n";
    });

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quicksort-tasks-${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Tasks exported successfully",
      description: "Your tasks have been downloaded as a text file",
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("taskId", id);
    playDragSound();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetQuadrant: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            quadrant: targetQuadrant,
            startTime: targetQuadrant === 'Q1' ? Date.now() : undefined,
            elapsedTime: undefined
          }
        : task
    ));

    playDropSound();
    toast({
      title: "Task moved",
      description: `Task moved to ${QUADRANTS[targetQuadrant as keyof typeof QUADRANTS]}`,
    });
  };

  const addTask = (content: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      quadrant: "Q1",
      completed: false,
      startTime: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
    
    toast({
      title: "Task added",
      description: "New task has been added successfully",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const completed = !task.completed;
        if (completed) playCompleteSound();
        return { ...task, completed };
      }
      return task;
    }));
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

  const getQuadrantProgress = (quadrant: string) => {
    const quadrantTasks = getTasksByQuadrant(quadrant);
    if (quadrantTasks.length === 0) return 0;
    const completedTasks = quadrantTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / quadrantTasks.length) * 100);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#F8FAFC] via-[#E5DEFF] to-[#D3E4FD]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
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
          <Button
            onClick={handleExport}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download size={16} />
            Export Tasks
          </Button>
        </div>
        
        <AddTaskForm onAddTask={addTask} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(QUADRANTS).map(([key, title]) => (
            <div key={key} className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                <div className="text-sm text-muted-foreground">
                  {getQuadrantProgress(key)}% Complete
                </div>
              </div>
              <Progress value={getQuadrantProgress(key)} className="mb-4" />
              <Quadrant
                title={title}
                tasks={getTasksByQuadrant(key)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, key)}
                onDeleteTask={deleteTask}
                onToggleComplete={toggleTaskCompletion}
                showTimer={key === 'Q1'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
