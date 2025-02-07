import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";


interface LoginFormProps {
  setShowForm: (value: boolean) => void;
  setFormSubmit: (value: boolean) => void;
}

export default function LoginForm({ setShowForm, setFormSubmit }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); 

    // Validation
    const validationErrors: { username?: string; password?: string } = {};
    if (!username.trim()) validationErrors.username = "Username is required.";
    if (!password.trim()) validationErrors.password = "Password is required.";
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}/auth/login`, {
        username,
        password,
      });

      
      if (response.status === 200) {
        toast.success(response.data.message)
        setUsername("");
        setPassword("");
       setShowForm(false)
       setFormSubmit(true)
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 m-4 ml-10 max-w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">How can we reach you?</h3>
        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username *</label>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* {message && <p className="text-center text-sm">{message}</p>} */}

        <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={loading}>
          {/* {loading ? "Logging in..." : "Login"} */}
          {loading ? (<div className="flex justify-start">
            <div className="bg-transparent rounded-lg p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
) : "Login"}
        </Button>
      </form>
    </Card>
  );
}
