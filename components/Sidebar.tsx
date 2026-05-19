"use client"

import { useState } from "react"
import { Conversation } from "@/types/conversation"
import {
  Plus,
  MessageSquare,
  Trash2,
  LogOut,
  Sparkles,
} from "lucide-react"

interface Props {
  conversations: Conversation[]
  activeId: number | null
  onSelect: (conv: Conversation) => void
  onCreate: () => void
  onDelete: (id: number) => void
  userEmail: string
  onLogout: () => void
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  userEmail,
  onLogout,
}: Props) {
  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  const handleDelete = async (
    e: React.MouseEvent,
    id: number
  ) => {
    e.stopPropagation()

    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  return (
    <aside
      className="
        w-[290px]
        h-screen
        bg-[#0F172A]
        border-r
        border-slate-800
        flex
        flex-col
        shrink-0
      "
    >
      {/* Top Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-800">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          
          <div
            className="
              w-11
              h-11
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              flex
              items-center
              justify-center
              shadow-lg
              shadow-blue-900/30
            "
          >
            <Sparkles size={18} className="text-white" />
          </div>

          <div>
            <h1 className="text-white font-semibold text-sm tracking-tight">
              AI Workspace
            </h1>

            <p className="text-slate-400 text-xs mt-0.5">
              Enterprise Assistant
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onCreate}
          aria-label="Start new conversation"
          className="
            mt-5
            w-full
            h-11
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            active:scale-[0.98]
            transition-all
            duration-200
            text-white
            text-sm
            font-medium
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
            shadow-blue-900/20
          "
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Conversation Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        
        {/* Label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
            Conversations
          </p>
        </div>

        {/* Conversation List */}
        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            pb-4
            custom-scrollbar
          "
          aria-label="Conversations"
        >
          {conversations.length === 0 && (
            <div
              className="
                mt-6
                px-4
                text-center
                text-slate-500
                text-sm
                leading-6
              "
            >
              No conversations yet.
              <br />
              Start a new AI chat.
            </div>
          )}

          <div className="space-y-1">
            {conversations.map((conv) => {
              const active = activeId === conv.id

              return (
                <div
                  key={conv.id}
                  onClick={() => onSelect(conv)}
                  role="button"
                  aria-label={`Open conversation: ${conv.title}`}
                  aria-current={active ? "page" : undefined}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-2xl
                    cursor-pointer
                    transition-all
                    duration-200
                    border

                    ${
                      active
                        ? `
                          bg-white/10
                          border-white/10
                          text-white
                          shadow-inner
                        `
                        : `
                          border-transparent
                          text-slate-300
                          hover:bg-white/[0.04]
                          hover:border-white/[0.03]
                        `
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      w-9
                      h-9
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      shrink-0

                      ${
                        active
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-800 text-slate-400"
                      }
                    `}
                  >
                    <MessageSquare size={16} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conv.title}
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      AI conversation
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) =>
                      handleDelete(e, conv.id)
                    }
                    disabled={deletingId === conv.id}
                    aria-label={`Delete conversation: ${conv.title}`}
                    className="
                      opacity-0
                      group-hover:opacity-100
                      transition-all
                      duration-200
                      w-8
                      h-8
                      rounded-lg
                      hover:bg-red-500/10
                      hover:text-red-400
                      flex
                      items-center
                      justify-center
                      text-slate-500
                      shrink-0
                    "
                  >
                    {deletingId === conv.id ? (
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        
        <div
          className="
            flex
            items-center
            gap-3
            bg-white/[0.03]
            border
            border-white/[0.04]
            rounded-2xl
            px-3
            py-3
          "
        >
          {/* Avatar */}
          <div
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
              text-sm
              font-semibold
              shrink-0
            "
          >
            {userEmail?.[0]?.toUpperCase() || "U"}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate font-medium">
              {userEmail}
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              Active Session
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            aria-label="Logout"
            className="
              w-10
              h-10
              rounded-xl
              hover:bg-red-500/10
              hover:text-red-400
              text-slate-400
              flex
              items-center
              justify-center
              transition-all
              duration-200
              shrink-0
            "
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}