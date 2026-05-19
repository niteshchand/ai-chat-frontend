"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { Bot, Sparkles } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(
          data.error || "Login failed"
        )
        return
      }

      login(data.token, data.user)

      router.push("/")
    } catch (err) {
      setError(
        "Something went wrong. Try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] relative overflow-hidden">

      {/* background glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full bottom-[-200px] right-[-200px]" />

      {/* card */}
      <div className="w-full max-w-md relative z-10">

        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-black/5 p-8">

          {/* header */}
          <div className="flex flex-col items-center text-center mb-8">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-4">
              <Bot size={24} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to your AI Workspace
            </p>
          </div>

          {/* error */}
          {error && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* form */}
          <div className="space-y-4">

            <div>
              <label className="text-xs font-medium text-gray-600">
                Email
              </label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>

              <input
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <Sparkles size={16} />
                  Sign in
                </>
              )}
            </button>
          </div>

          {/* footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}