"use client"
import { useState, useRef } from "react"

interface Props {
  onUpload: (file: File) => Promise<void>
  disabled: boolean
}

export default function FileUpload({ onUpload, disabled }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported")
      return
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB")
      return
    }

    setSelectedFile(file)
    setError("")
    setSuccess(false)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError("")

    try {
      await onUpload(selectedFile)
      setSuccess(true)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err: any) {
      setError(err.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setError("")
    setSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="px-4 py-2 border-t bg-gray-50">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id="pdf-upload"
        aria-label="Upload PDF file"
        disabled={disabled || uploading}
      />

      {/* Success message */}
      {success && (
        <div
          role="status"
          className="flex items-center gap-2 text-xs text-green-600 mb-2"
        >
          <span>✅</span>
          <span>PDF uploaded! You can now ask questions about it.</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div role="alert" className="text-xs text-red-500 mb-2">
          ❌ {error}
        </div>
      )}

      {/* File selected state */}
      {selectedFile ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500" aria-hidden="true">📄</span>
          <span className="text-xs text-gray-700 flex-1 truncate">
            {selectedFile.name}
          </span>
          <span className="text-xs text-gray-400">
            {(selectedFile.size / 1024 / 1024).toFixed(1)}MB
          </span>
          <button
            onClick={handleClear}
            disabled={uploading}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            aria-label="Remove selected file"
          >
            ✕
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="text-xs bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-1 rounded-lg transition-colors"
            aria-label="Upload PDF"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      ) : (
        /* Upload trigger */
        <label
          htmlFor="pdf-upload"
          className={`flex items-center gap-2 text-xs text-gray-400 hover:text-blue-500 cursor-pointer transition-colors ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span aria-hidden="true">📎</span>
          <span>Attach PDF to chat with your document</span>
        </label>
      )}
    </div>
  )
}