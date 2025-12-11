"use client"

import type React from "react"

import { useState } from "react"
import { Upload, File, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadedFile {
  name: string
  size: number
  uploadedAt: string
}

export default function CsvUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFiles = (fileList: FileList | null) => {
    setError(null)
    setSuccess(null)

    if (!fileList) return

    const validFiles = Array.from(fileList).filter((file) => {
      const isValid = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type)
      if (!isValid) {
        setError(`${file.name} is not a valid CSV or Excel file`)
      }
      return isValid
    })

    if (validFiles.length > 0) {
      const newFiles = validFiles.map((file) => ({
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleDateString(),
      }))
      setFiles((prev) => [...prev, ...newFiles])
      setSuccess(`Successfully uploaded ${validFiles.length} file(s)`)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  return (
    <div className="space-y-6 p-5">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Upload Financial Data</h2>
        <p className="text-muted-foreground">Import your CSV or Excel files for analysis and forecasting</p>
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="cursor-pointer space-y-4">
          <div className="flex justify-center">
            <div className="rounded-lg bg-primary/10 p-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground mb-1">Drag and drop your files here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <p className="text-xs text-muted-foreground">Supported: CSV, XLS, XLSX</p>
          </div>
          <input type="file" multiple accept=".csv,.xls,.xlsx" onChange={handleInputChange} className="hidden" />
          <Button className="mt-4" size="sm">
            Browse Files
          </Button>
        </label>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Uploaded Files ({files.length})</h3>
            <Button variant="outline" size="sm" onClick={() => setFiles([])}>
              Clear All
            </Button>
          </div>
          <div className="grid gap-3">
            {files.map((file, index) => (
              <Card key={index} className="flex items-center justify-between p-4 border-l-4 border-l-primary">
                <div className="flex items-center gap-3 flex-1">
                  <File className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB • {file.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Button className="w-full" size="lg">
            Proceed to Analysis
          </Button>
        </div>
      )}
    </div>
  )
}
