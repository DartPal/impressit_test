"use client";

import { useMemo } from "react";
import { useAiChat } from "@hooks/api/useAiChat";
import { useMessages } from "@hooks/helpers/useMessages";
import { useApproval } from "@hooks/helpers/useApproval";
import { ChatInput } from "@components/ChatInput";
import { MessageList } from "@components/MessageList";

export const ChatPage = () => {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        addToolResult,
        status,
    } = useAiChat();
    const { processedMessages } = useMessages(messages);
    const { approve, reject, getStatus } = useApproval();

    const isLoading = useMemo(
        () => status === "streaming" || status === "submitted",
        [status],
    );

    const handleAccept = useMemo(
        () => (toolCallId: string) => {
            approve(toolCallId);
            addToolResult({
                tool: "scheduleEvent",
                toolCallId,
                output: {
                    confirmed: true,
                    message: "User accepted the event.",
                },
            });
        },
        [approve, addToolResult],
    );

    const handleReject = useMemo(
        () => (toolCallId: string) => {
            reject(toolCallId);
            addToolResult({
                tool: "scheduleEvent",
                toolCallId,
                output: {
                    confirmed: false,
                    message: "User rejected the event. Ask the user what they would like to change.",
                },
            });
        },
        [reject, addToolResult],
    );

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto w-full">
            <header className="px-4 py-3 border-b border-white/10 bg-[#212121]">
                <h1 className="text-lg font-semibold text-[#ececec]">AI Assistant</h1>
                <p className="text-xs text-[#8e8ea0]">
                    Ask me to schedule an event
                </p>
            </header>
            <MessageList
                messages={processedMessages}
                getStatus={getStatus}
                onAccept={handleAccept}
                onReject={handleReject}
            />
            <ChatInput
                input={input}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
            />
        </div>
    );
};
