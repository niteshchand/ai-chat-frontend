# AI Chat Frontend

A production-grade AI chat frontend built with **Next.js 15** featuring real-time streaming, RAG-powered document chat, multi-conversation sidebar, and full accessibility support.

🌐 **Live Demo:** [ai-chat-frontend-iota.vercel.app](https://ai-chat-frontend-iota.vercel.app)
🔧 **Backend Repo:** [github.com/niteshchand/ai-chat-backend](https://github.com/niteshchand/ai-chat-backend)

---

## Features

- **ChatGPT-style streaming** — Real-time token-by-token responses with blinking cursor
- **Multi-conversation sidebar** — Create, switch, and delete conversations
- **PDF document chat** — Upload any PDF and ask questions about it (RAG)
- **Markdown rendering** — Syntax highlighted code blocks, tables, bold, lists
- **JWT Authentication** — Login/register with cookie-based token persistence
- **Accessibility** — WCAG 2.1 AA compliant with ARIA live regions, focus management
- **Responsive layout** — Collapsible sidebar, works on all screen sizes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Markdown | react-markdown + react-syntax-highlighter |
| Icons | lucide-react |
| Deployment | Vercel |

---

## Project Structure

```
ai-chat-frontend/
├── app/
│   ├── page.tsx           # Main chat page + all logic
│   ├── login/page.tsx     # Login page
│   ├── register/page.tsx  # Register page
│   └── layout.tsx         # Root layout with AuthProvider
├── components/
│   ├── ChatWindow.tsx     # Message list with empty state
│   ├── ChatBubble.tsx     # Individual message bubble
│   ├── ChatInput.tsx      # Textarea + send button
│   ├── MarkdownRenderer.tsx # Markdown + syntax highlighting
│   ├── Sidebar.tsx        # Conversation list + new chat
│   └── FileUpload.tsx     # PDF upload with validation
├── context/
│   └── AuthContext.tsx    # JWT token + user state
└── types/
    ├── chat.ts            # Message types
    └── conversation.ts    # Conversation types
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Backend running → [ai-chat-backend](https://github.com/niteshchand/ai-chat-backend)

### Setup

```bash
# Clone
git clone https://github.com/niteshchand/ai-chat-frontend.git
cd ai-chat-frontend

# Install
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Run
npm run dev
```

Open [localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production point to your deployed backend URL.

---

## Key Features Explained

### Streaming Implementation
Uses the browser's `ReadableStream` API to read SSE chunks from the Go backend. An empty AI message is added immediately, then filled token by token as chunks arrive — same pattern used by ChatGPT.

```tsx
const reader = res.body!.getReader()
const decoder = new TextDecoder()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  // append chunk to message
}
```

### RAG Integration
Upload a PDF → backend processes it into vector embeddings → every subsequent message searches for relevant chunks → AI answers from your document.

### Accessibility
- `role="log"` on chat window announces new messages to screen readers
- `aria-live="polite"` announces AI responses
- Focus returns to input after every AI response
- Skip link for keyboard navigation
- All interactive elements have `aria-label`

---

## Screenshots

| Login | Chat | PDF Upload |
|-------|------|------------|
| Clean login form | Multi-conversation sidebar | One-click PDF processing |

---

## Deployment

Deployed on Vercel with zero config — Next.js auto-detected.

```bash
# Build check before deploying
npm run build

# Deploy via git push
git push origin main
# Vercel auto-deploys on every push
```

---

## License

MIT
