import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddTaskFormProps {
  onAddTask: (content: string) => void;
}

const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddTask(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-8 p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm">
      <Input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 bg-white/80 border-white/40"
      />
      <Button type="submit" className="gap-2">
        <Plus size={16} /> Add
      </Button>
    </form>
  );
};

export default AddTaskForm;