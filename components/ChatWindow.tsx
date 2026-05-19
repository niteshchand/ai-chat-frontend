"use client"

import { useEffect, useRef } from "react"
import { Message } from "@/types/chat"
import ChatBubble from "./ChatBubble"
import { Sparkles } from "lucide-react"

interface Props {
  messages: Message[]
  streamingId?: string | null
}

export default function ChatWindow({
  messages,
  streamingId,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  return (
    <div
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      // className="
      //   flex-1
      //   overflow-y-auto
      //   scroll-smooth
      // "
      className="flex-1 min-h-0 overflow-y-auto p-4"
    >
      {/* Main Container */}
      <div className="px-4 md:px-6 py-8">
        
        {/* Centered Content Width */}
        <div className="max-w-4xl mx-auto">
          
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
              
              {/* Icon */}
              <div
                className="
                  w-20
                  h-20
                  rounded-3xl
                  bg-gradient-to-br
                  from-blue-500
                  to-indigo-600
                  flex
                  items-center
                  justify-center
                  shadow-2xl
                  shadow-blue-500/20
                  mb-8
                "
              >
                <Sparkles
                  size={34}
                  className="text-white"
                />
              </div>

              {/* Heading */}
              <h1
                className="
                  text-4xl
                  md:text-5xl
                  font-bold
                  tracking-tight
                  text-gray-900
                  mb-4
                "
              >
                What can I help you with?
              </h1>

              {/* Description */}
              <p
                className="
                  max-w-xl
                  text-gray-500
                  text-lg
                  leading-8
                  mb-10
                "
              >
                Ask questions, analyze documents,
                generate content, or build enterprise
                workflows powered by AI.
              </p>

              {/* Suggestion Cards */}
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                  w-full
                  max-w-2xl
                "
              >
                {[
                  "Summarize uploaded PDFs",
                  "Generate backend architecture",
                  "Explain complex code",
                  "Create business reports",
                ].map((item) => (
                  <button
                    key={item}
                    className="
                      group
                      text-left
                      p-5
                      rounded-2xl
                      bg-white
                      border
                      border-gray-200
                      hover:border-blue-300
                      hover:shadow-lg
                      hover:shadow-blue-100/40
                      transition-all
                      duration-200
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-medium
                        text-gray-800
                        group-hover:text-blue-700
                        transition-colors
                      "
                    >
                      {item}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <ol
              aria-label="Conversation history"
              className="
                list-none
                space-y-6
                pb-10
              "
            >
              {messages
                .filter(
                  (msg) => msg.content !== ""
                )
                .map((msg) => (
                  <li
                    key={msg.id}
                    className="
                      animate-[fadeIn_.25s_ease]
                    "
                  >
                    <ChatBubble
                      message={msg}
                      isStreaming={
                        msg.id === streamingId
                      }
                    />
                  </li>
                ))}
            </ol>
          )}

          {/* Bottom Scroll Anchor */}
          <div
            ref={bottomRef}
            aria-hidden="true"
            className="h-6"
          />
        </div>
      </div>
    </div>
  )
}