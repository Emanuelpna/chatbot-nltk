import { useState } from "react";

import { Message } from "@/domain/models/Message";
import { ChatMessageType } from "@/domain/models/ChatMessageType";

import { ChatbotService } from "@/data/ChatbotService";

import { Logo } from "@/components/commons/Logo/Logo";
import { ChatInput } from "@/components/chat/ChatInput/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage/ChatMessage";
import { ChatContainer } from "@/components/chat/ChatContainer/ChatContainer";

import "./global.css";

const freeze = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), time));

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  async function onFormSubmit(formData: FormData) {
    const userInput = formData.get("user_input");

    if (!userInput) return;

    setMessages((messages) => [
      ...messages,
      new Message("José", userInput?.toString() ?? "", ChatMessageType.USER),
    ]);

    await freeze(100);

    const response = await ChatbotService.askChatbot(userInput.toString());

    if (!response) return;

    setMessages((messages) => [
      ...messages,
      new Message("Chatbot NLTK", response.message, ChatMessageType.CHATBOT),
    ]);
  }

  return (
    <>
      <Logo />

      <ChatContainer footer={<ChatInput onSubmitCallback={onFormSubmit} />}>
        {messages.map((message) => (
          <ChatMessage
            key={message.getSentAt().toISOString()}
            content={message.getContent()}
            sender={message.getSender()}
            type={message.getType()}
          />
        ))}
      </ChatContainer>
    </>
  );
}

export default App;
