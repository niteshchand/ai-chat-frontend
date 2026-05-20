"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import {
  Sparkles,
  PanelLeft,
  Bot,
} from "lucide-react"

import { useAuth } from "@/context/AuthContext"

import { Message } from "@/types/chat"
import { Conversation } from "@/types/conversation"

import ChatWindow from "@/components/ChatWindow"
import ChatInput from "@/components/ChatInput"
import Sidebar from "@/components/Sidebar"
import FileUpload from "@/components/FileUpload"

export default function Home() {
  const { token, user, logout, isLoading } = useAuth()

  const router = useRouter()

  const [conversations, setConversations] = useState<
    Conversation[]
  >([])

  const [activeConv, setActiveConv] =
    useState<Conversation | null>(null)

  const [messages, setMessages] = useState<Message[]>(
    []
  )

  const [loading, setLoading] = useState(false)

  const [streamingId, setStreamingId] = useState<
    string | null
  >(null)

  const [error, setError] = useState<string | null>(
    null
  )

  const [announcement, setAnnouncement] =
    useState("")

  const [sidebarOpen, setSidebarOpen] =
    useState(true)

  const inputRef =
    useRef<HTMLTextAreaElement>(null)

  /* =========================================
     AUTH
  ========================================= */

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login")
    }
  }, [token, isLoading, router])

  /* =========================================
     LOAD CONVERSATIONS
  ========================================= */

  useEffect(() => {
    if (!token) return

    fetchConversations()
  }, [token])

  const fetchConversations = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      setConversations(data.conversations || [])

      if (
        data.conversations?.length > 0 &&
        !activeConv
      ) {
        selectConversation(data.conversations[0])
      }
    } catch (err) {
      console.error(
        "Failed to load conversations"
      )
    }
  }

  /* =========================================
     SELECT CONVERSATION
  ========================================= */

  const selectConversation = async (
    conv: Conversation
  ) => {
    setActiveConv(conv)

    setMessages([])

    setError(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conv.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      const msgs: Message[] = (
        data.conversation.messages || []
      )
        .filter((m: any) => m.content !== "")
        .map((m: any) => ({
          id: m.id.toString(),
          role: m.role,
          content: m.content,
        }))

      setMessages(msgs)
    } catch (err) {
      console.error(
        "Failed to load messages"
      )
    }
  }

  /* =========================================
     CREATE CONVERSATION
  ========================================= */

  const createConversation = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: "New Chat",

            system_prompt:
              "You are a helpful assistant. Format responses using proper markdown.",
          }),
        }
      )

      const data = await res.json()

      const newConv = data.conversation

      setConversations((prev) => [
        newConv,
        ...prev,
      ])

      setActiveConv(newConv)

      setMessages([])

      setError(null)

      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } catch (err) {
      console.error(
        "Failed to create conversation"
      )
    }
  }

  /* =========================================
     DELETE CONVERSATION
  ========================================= */

  const deleteConversation = async (
    id: number
  ) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setConversations((prev) =>
        prev.filter((c) => c.id !== id)
      )

      if (activeConv?.id === id) {
        const remaining =
          conversations.filter(
            (c) => c.id !== id
          )

        if (remaining.length > 0) {
          selectConversation(remaining[0])
        } else {
          setActiveConv(null)
          setMessages([])
        }
      }
    } catch (err) {
      console.error(
        "Failed to delete conversation"
      )
    }
  }

  /* =========================================
     SEND MESSAGE
  ========================================= */

  const handleSend = async (
    content: string
  ) => {
    if (!token || !activeConv) return

    setError(null)

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
    ])

    setLoading(true)

    setAnnouncement("Sending message")

    const aiId = (
      Date.now() + 1
    ).toString()

    setStreamingId(aiId)

    setMessages((prev) => [
      ...prev,
      {
        id: aiId,
        role: "assistant",
        content: "",
      },
    ])

  try {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chat/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: content,
        conversation_id: activeConv.id,
      }),
    }
  )

  if (!res.ok) throw new Error("Backend error")

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue

        const data = line.replace("data: ", "").trim()

        if (!data) continue
        if (data === "[DONE]") break

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiId
              ? { ...msg, content: msg.content + data }
              : msg
          )
        )
      }
    }
  } finally {
    reader.releaseLock()
  }

  setConversations((prev) =>
    prev.map((c) =>
      c.id === activeConv.id
        ? { ...c, title: content.slice(0, 40) }
        : c
    )
  )

  setAnnouncement("AI response received")

  setTimeout(() => {
    inputRef.current?.focus()
  }, 100)

} catch (err) {
  setError(
    "Something went wrong. Is your Go backend running?"
  )
} finally {
  setLoading(false)
  setStreamingId(null)
} }
  /* =========================================
     FILE UPLOAD
  ========================================= */

  const handleUpload = async (
    file: File
  ) => {
    if (!token || !activeConv) {
      throw new Error(
        "No active conversation"
      )
    }

    const formData = new FormData()

    formData.append("file", file)

    formData.append(
      "conversation_id",
      activeConv.id.toString()
    )

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/upload`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      }
    )

    if (!res.ok) {
      const data = await res.json()

      throw new Error(
        data.error || "Upload failed"
      )
    }

    const data = await res.json()

    const systemMsg: Message = {
      id: Date.now().toString(),

      role: "assistant",

      content: `✅ **${data.filename}** uploaded successfully! I've processed **${data.chunks} chunks** from your document.`,
    }

    setMessages((prev) => [
      ...prev,
      systemMsg,
    ])
  }

  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return (
      <div
        className="
          h-screen
          flex
          items-center
          justify-center
          bg-[#F5F7FB]
        "
      >
        <div className="flex items-center gap-3">
          
          <div
            className="
              w-10
              h-10
              rounded-2xl
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              animate-pulse
            "
          >
            <Sparkles size={18} />
          </div>

          <div>
            <p className="font-semibold text-gray-800">
              AI Workspace
            </p>

            <p className="text-sm text-gray-500">
              Loading...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!token) return null

  /* =========================================
     UI
  ========================================= */

  return (
    <div
      className="
        flex
        h-screen
        bg-[#F5F7FB]
        overflow-hidden
      "
    >
      {/* SIDEBAR */}
      {sidebarOpen && (
        <Sidebar
          conversations={conversations}
          activeId={activeConv?.id ?? null}
          onSelect={selectConversation}
          onCreate={createConversation}
          onDelete={deleteConversation}
          userEmail={user?.email ?? ""}
          onLogout={logout}
        />
      )}

      {/* MAIN */}
      <main
        role="main"
        id="chat-main"
        className="
          flex
          flex-col
          flex-1
          min-w-0
          relative
        "
      >
        {/* HEADER */}
        <header
          className="
            sticky
            top-0
            z-20

            flex
            items-center
            justify-between

            px-6
            py-4

            border-b
            border-gray-200/80

            bg-white/80
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-4">
            
            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className="
                w-10
                h-10
                rounded-xl
                border
                border-gray-200
                bg-white
                hover:bg-gray-50
                flex
                items-center
                justify-center
                transition-colors
              "
            >
              <PanelLeft size={18} />
            </button>

            <div>
              <h1
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                {activeConv?.title ??
                  "AI Workspace"}
              </h1>

              <p
                className="
                  text-xs
                  text-gray-500
                  mt-0.5
                "
              >
                {activeConv
                  ? "Powered by llama-3.3-70b"
                  : "Enterprise AI Assistant"}
              </p>
            </div>
          </div>

          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              border
              border-gray-200
              bg-white
            "
          >
            <div
              className="
                w-2
                h-2
                rounded-full
                bg-emerald-500
              "
            />

            <span
              className="
                text-xs
                font-medium
                text-gray-600
              "
            >
              Online
            </span>
          </div>
        </header>

        {/* EMPTY STATE */}
        {!activeConv && (
          <div
            className="
              flex-1
              flex
              flex-col
              items-center
              justify-center
              px-6
            "
          >
            <div
              className="
                w-24
                h-24
                rounded-[2rem]
                bg-gradient-to-br
                from-blue-500
                to-indigo-600

                text-white

                flex
                items-center
                justify-center

                shadow-2xl
                shadow-blue-500/20

                mb-8
              "
            >
              <Bot size={40} />
            </div>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-gray-900
                mb-3
              "
            >
              Welcome to AI Workspace
            </h2>

            <p
              className="
                text-gray-500
                text-center
                max-w-md
                leading-7
                mb-8
              "
            >
              Start a new conversation
              and interact with your
              AI assistant using
              documents, markdown,
              and streaming responses.
            </p>

            <button
              onClick={
                createConversation
              }
              className="
                inline-flex
                items-center
                gap-2

                px-6
                py-3

                rounded-2xl

                bg-blue-600
                hover:bg-blue-700

                text-white
                font-medium

                shadow-lg
                shadow-blue-500/20

                transition-all
              "
            >
              <Sparkles size={18} />
              Start New Chat
            </button>
          </div>
        )}

        {/* CHAT */}
        {activeConv && (
          <>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {announcement}
            </div>

            {/* CHAT WINDOW */}
            {/* <div
             className="flex-1 min-h-0 overflow-hidden"
            > */}
            <div className="flex-1 min-h-0 overflow-y-auto">

              <ChatWindow
                messages={messages}
                streamingId={
                  streamingId
                }
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="px-6 pb-3">
                <div
                  role="alert"
                  className="
                    px-4
                    py-3
                    rounded-2xl

                    border
                    border-red-200

                    bg-red-50

                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </div>
              </div>
            )}

            {/* THINKING */}
            {loading &&
              !streamingId && (
                <div
                  className="
                    px-6
                    pb-2

                    text-sm
                    text-gray-400

                    animate-pulse
                  "
                >
                  AI is thinking...
                </div>
              )}

            {/* INPUT AREA */}
            <div
              className="
                sticky
                bottom-0
                z-10

                px-4
                pb-4
                pt-2

                bg-gradient-to-t
                from-[#F5F7FB]
                to-transparent
              "
            >
              <div
                className="
                  max-w-5xl
                  mx-auto
                "
              >
                <div
                  className="
                    rounded-[2rem]
                    border
                    border-gray-200

                    bg-white/90
                    backdrop-blur-xl

                    shadow-xl
                    shadow-black/[0.03]
                  "
                >
                  <ChatInput
                    onSend={
                      handleSend
                    }
                    disabled={loading}
                    inputRef={
                      inputRef
                    }
                    onFileUpload={handleUpload}
                  />

                  {/* <div
                    className="
                      px-4
                      pb-4
                    "
                  >
                    <FileUpload
                      onUpload={
                        handleUpload
                      }
                      disabled={
                        loading
                      }
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
