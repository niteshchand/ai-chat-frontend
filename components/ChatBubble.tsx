import { Message } from "@/types/chat"
import MarkdownRenderer from "./MarkdownRenderer"
import {
  Sparkles,
  User,
} from "lucide-react"

interface Props {
  message: Message
  isStreaming?: boolean
}

export default function ChatBubble({
  message,
  isStreaming,
}: Props) {
  const isUser = message.role === "user"

  return (
    <div
      role="article"
      aria-label={`${
        isUser ? "You" : "AI assistant"
      }: ${
        isStreaming
          ? "typing..."
          : message.content.slice(0, 50)
      }`}
      className={`
        flex
        items-start
        gap-4
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div
          aria-hidden="true"
          className="
            w-11
            h-11
            rounded-2xl
            bg-gradient-to-br
            from-blue-500
            to-indigo-600
            text-white
            flex
            items-center
            justify-center
            shadow-lg
            shadow-blue-500/20
            shrink-0
            sticky
            top-4
          "
        >
          <Sparkles size={18} />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`
          relative
          max-w-[85%]
          md:max-w-[75%]
          transition-all
          duration-200

          ${
            isUser
              ? `
                bg-blue-600
                text-white
                rounded-[28px]
                rounded-br-md
                px-5
                py-4
                shadow-lg
                shadow-blue-500/10
              `
              : `
                bg-white
                border
                border-gray-200
                rounded-[28px]
                rounded-bl-md
                px-6
                py-5
                shadow-sm
              `
          }
        `}
      >
        {/* User Message */}
        {isUser ? (
          <div
            className="
              whitespace-pre-wrap
              break-words
              text-[15px]
              leading-7
              font-normal
            "
          >
            {message.content}
          </div>
        ) : (
          <>
            {/* AI Label */}
            <div className="flex items-center gap-2 mb-4">
              
              <div
                className="
                  w-6
                  h-6
                  rounded-lg
                  bg-blue-100
                  text-blue-700
                  flex
                  items-center
                  justify-center
                "
              >
                <Sparkles size={13} />
              </div>

              <span
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                AI Assistant
              </span>

              {isStreaming && (
                <div className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-200" />
                </div>
              )}
            </div>

            {/* Markdown Content */}
            <div
              className="
                prose
                prose-gray
                prose-sm
                max-w-none
                 overflow-hidden   
  break-words  

                prose-headings:text-gray-900
                prose-p:text-gray-700
                prose-p:leading-7

                prose-pre:bg-[#0F172A]
                prose-pre:border
                prose-pre:border-slate-700
                prose-pre:rounded-2xl

                prose-code:text-blue-600
                prose-code:before:content-['']
                prose-code:after:content-['']

                prose-strong:text-gray-900
                prose-li:text-gray-700
                prose-blockquote:border-blue-500
              "
            >
              <MarkdownRenderer
                content={message.content}
                isUser={false}
              />
            </div>
          </>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          aria-hidden="true"
          className="
            w-11
            h-11
            rounded-2xl
            bg-gray-900
            text-white
            flex
            items-center
            justify-center
            shrink-0
            shadow-sm
            sticky
            top-4
          "
        >
          <User size={18} />
        </div>
      )}
    </div>
  )
}