import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <Input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
      />
      <Button type="submit">Add</Button>
    </form>
  );
};

export default AddTaskForm;