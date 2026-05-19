"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter"

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism"

import {
  Copy,
  Check,
  ExternalLink,
} from "lucide-react"

import { useState } from "react"

interface Props {
  content: string
  isUser: boolean
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="
        absolute
        top-3
        right-3
        flex
        items-center
        gap-1.5
        px-2.5
        py-1.5
        rounded-lg
        bg-white/10
        hover:bg-white/20
        text-xs
        text-white
        backdrop-blur
        transition-all
        opacity-0
        group-hover:opacity-100
      "
    >
      {copied ? (
        <>
          <Check size={14} />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy
        </>
      )}
    </button>
  )
}

export default function MarkdownRenderer({
  content,
  isUser,
}: Props) {
  return (
    <div
      className={`
        prose
        prose-sm
        max-w-none

        prose-headings:font-bold
        prose-headings:tracking-tight

        prose-p:leading-7

        prose-a:no-underline
        prose-a:font-medium
        prose-a:text-blue-600
        hover:prose-a:text-blue-700

        prose-strong:font-semibold

        prose-li:leading-7

        prose-blockquote:not-italic
        prose-blockquote:border-blue-500
        prose-blockquote:bg-blue-50/50
        prose-blockquote:py-1
        prose-blockquote:px-4
        prose-blockquote:rounded-r-xl

        prose-table:w-full

        prose-th:bg-gray-50
        prose-th:text-gray-700
        prose-th:font-semibold

        prose-td:border-gray-200
        prose-th:border-gray-200

        ${
          isUser
            ? "prose-invert"
            : "prose-gray"
        }
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({
            inline,
            className,
            children,
            ...props
          }: any) {
            const match =
              /language-(\w+)/.exec(
                className || ""
              )

            const code =
              String(children).replace(/\n$/, "")

            // Code Block
            if (!inline && match) {
              return (
                <div className="relative group my-5">
                  
                  {/* Language Label */}
                  <div
                    className="
                      absolute
                      top-0
                      left-0
                      right-0
                      h-10
                      flex
                      items-center
                      px-4
                      bg-[#111827]
                      border-b
                      border-slate-700
                      rounded-t-2xl
                      text-xs
                      text-slate-400
                      font-medium
                      uppercase
                      tracking-wide
                      z-10
                    "
                  >
                    {match[1]}
                  </div>

                  {/* Copy Button */}
                  <CopyButton code={code} />

                  {/* Syntax Highlight */}
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: "1rem",
                      paddingTop: "3.5rem",
                      paddingBottom: "1.25rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              )
            }

            // Inline Code
            return (
              <code
                className="
                  px-1.5
                  py-0.5
                  rounded-md
                  bg-gray-100
                  text-blue-700
                  text-[0.85em]
                  font-medium
                  before:content-['']
                  after:content-['']
                "
                {...props}
              >
                {children}
              </code>
            )
          },

          p({ children }: any) {
            return (
              <p className="mb-4 last:mb-0">
                {children}
              </p>
            )
          },

          ul({ children }: any) {
            return (
              <ul className="my-4 space-y-2">
                {children}
              </ul>
            )
          },

          ol({ children }: any) {
            return (
              <ol className="my-4 space-y-2">
                {children}
              </ol>
            )
          },

          h1({ children }: any) {
            return (
              <h1 className="text-3xl mb-6 mt-8">
                {children}
              </h1>
            )
          },

          h2({ children }: any) {
            return (
              <h2 className="text-2xl mb-4 mt-8">
                {children}
              </h2>
            )
          },

          h3({ children }: any) {
            return (
              <h3 className="text-xl mb-3 mt-6">
                {children}
              </h3>
            )
          },

          blockquote({ children }: any) {
            return (
              <blockquote className="my-5">
                {children}
              </blockquote>
            )
          },

          table({ children }: any) {
            return (
              <div
                className="
                  my-6
                  overflow-x-auto
                  rounded-2xl
                  border
                  border-gray-200
                "
              >
                <table className="min-w-full border-collapse">
                  {children}
                </table>
              </div>
            )
          },

          th({ children }: any) {
            return (
              <th
                className="
                  px-4
                  py-3
                  text-left
                  text-sm
                  border-b
                "
              >
                {children}
              </th>
            )
          },

          td({ children }: any) {
            return (
              <td
                className="
                  px-4
                  py-3
                  text-sm
                  border-b
                "
              >
                {children}
              </td>
            )
          },

          a({
            href,
            children,
          }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-1
                "
              >
                {children}

                <ExternalLink size={14} />
              </a>
            )
          },

          hr() {
            return (
              <hr className="my-8 border-gray-200" />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}