"use client";

import { useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {suggestions} from '@/components/SuggestionQue'
import LoginForm from "../components/LoginForm";

type Message = {
  id: string;
  content: string;
  type: "user" | "assistant";
};

export default function ChatInterface() {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSubmit, setFormSubmit]=useState(false)

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    let currentText = "";
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: "",
      type: "assistant",
    };
    setMessages((prev) => [...prev, newMessage]);

    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, content: currentText } : msg
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    setIsTyping(false);
    setShowForm(true);
  };

  const handleCardClick = async (suggestion: (typeof suggestions)[0]) => {
    setShowSuggestions(false);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: suggestion.question,
        type: "user",
      },
    ]);
    await simulateTyping(suggestion.answer);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setShowSuggestions(false);

    const userMessage = inputValue;
    setInputValue("");
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: userMessage,
        type: "user",
      },
    ]);

    const dummyResponse = `Thank you for your question about "${userMessage}". 

Here's a general response:
1. First, make sure your iPhone is updated to the latest iOS version
2. Check if restarting your device resolves the issue
3. If the problem persists, you can contact Apple Support

Is there anything specific you'd like to know more about?`;

    await simulateTyping(dummyResponse);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-3 pb-0 min-h-screen flex flex-col">
      {/* Header */}
      {showSuggestions && (
        <>
          <div className="mb-8 ml-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Iphone
            </h1>
            <h2 className="text-2xl text-gray-600">How can I help?</h2>
          </div>


          <div className="relative flex items-center mb-8">
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 p-2 bg-gray-200 rounded-full disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth w-full px-8 space-x-4 no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {suggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className="p-4 min-w-[150px] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleCardClick(suggestion)}
                >
                  <p className="text-sm text-gray-800">{suggestion.question}</p>
                </Card>
              ))}
            </div>
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 p-2 bg-gray-200 rounded-full disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </>
      )}

      {/* Chat Messages */}
      <div className=" space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.type === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-4",
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-800"
              )}
            >
              {message.content.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* Contact Form */}
      {!formSubmit && showForm && !isTyping && messages.length > 0 && (
        <LoginForm setShowForm={setShowForm} setFormSubmit={setFormSubmit} />
      )}

      {/* Input Area */}
      <div className="mt-auto sticky bottom-0 bg-white ">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 p-2 border border-blue-400 rounded-full focus-within:border-blue-400"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question about iPhone"
            className="flex-grow border-none shadow-none focus:border-none focus:ring-0 focus:outline-none"
            style={{ outline: "none", boxShadow: "none" }} 
          />
          <Button
            type="submit"
            size="icon"
            disabled={isTyping}
            className="bg-white shadow-none hover:bg-transparent"
          >
            <Send className="h-4 w-4 text-blue-500 rotate-[40deg]" />
          </Button>
        </form>

        <div className="m-2 flex justify-center gap-4 items-center text-sm text-gray-500">
          <span className="text-blue-500 font-semibold">Disclaimer</span>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="font-semibold">Apple</span>
          </div>
        </div>
      </div>
    </div>
  );
}
