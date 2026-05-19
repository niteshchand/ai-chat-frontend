"use client"

import { useState, RefObject, useEffect,useRef } from "react"
import { SendHorizonal, Paperclip } from "lucide-react"

interface Props {
  onSend: (message: string) => void
  disabled: boolean
  inputRef: RefObject<HTMLTextAreaElement | null>
  onFileUpload?: (file: File) => void
}

export default function ChatInput({
  onSend,
  disabled,
  inputRef,
  onFileUpload
}: Props) {
  const [input, setInput] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const handleSend = () => {
    if (!input.trim()) return

    onSend(input)
    setInput("")

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onFileUpload) return
    onFileUpload(file)
  }

  // Auto resize textarea
  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.style.height = "auto"
    inputRef.current.style.height =
      inputRef.current.scrollHeight + "px"
  }, [input, inputRef])

  return (
    <div className="sticky bottom-0 z-20 bg-gradient-to-t from-[#F5F7FB] via-[#F5F7FB] to-transparent px-4 md:px-6 pt-6 pb-6">
      
      <div className="max-w-4xl mx-auto">
        
        {/* Composer */}
        <div
          role="region"
          aria-label="Message input"
          className="
            bg-white
            border
            border-gray-200
            rounded-3xl
            shadow-[0_8px_30px_rgb(0,0,0,0.06)]
            transition-all
            duration-200
            focus-within:border-blue-400
            focus-within:shadow-[0_8px_30px_rgb(37,99,235,0.12)]
          "
        >
          
          {/* Top Input Area */}
          <div className="flex items-end gap-3 px-4 py-4">
              <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        className="hidden"
      />

            {/* Upload Button */}
            <button
            type="button"
        onClick={() => fileRef.current?.click()}
              className="
                hidden sm:flex
                items-center
                justify-center
                w-10
                h-10
                rounded-2xl
                text-gray-500
                hover:bg-gray-100
                hover:text-gray-700
                transition-all
                shrink-0
              "
              aria-label="Attach file"
            >
              <Paperclip size={18} />
            </button>

            {/* Textarea */}
            <div className="flex-1">
              <label htmlFor="chat-input" className="sr-only">
                Type your message. Press Enter to send,
                Shift+Enter for new line.
              </label>

              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                rows={1}
                placeholder="Message AI Assistant..."
                aria-label="Message input"
                aria-disabled={disabled}
                aria-describedby="input-hint"
                className="
                  w-full
                  resize-none
                  border-0
                  bg-transparent
                  text-[15px]
                  leading-6
                  text-gray-800
                  placeholder:text-gray-400
                  focus:outline-none
                  focus:ring-0
                  max-h-52
                  overflow-y-auto
                  py-2
                "
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              aria-label="Send message"
              aria-disabled={disabled || !input.trim()}
              className="
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-2xl
                bg-blue-600
                hover:bg-blue-700
                active:scale-95
                disabled:opacity-40
                disabled:cursor-not-allowed
                text-white
                shadow-lg
                shadow-blue-500/20
                transition-all
                shrink-0
              "
            >
              {disabled ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <SendHorizonal size={18} />
              )}
            </button>
          </div>

          {/* Footer Hint */}
          <div className="flex items-center justify-between px-5 pb-4">
            
            <span
              id="input-hint"
              className="text-xs text-gray-400"
            >
              Enter to send • Shift + Enter for new line
            </span>

            <span className="text-xs text-gray-300">
              AI can make mistakes
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}