"use client"

import { useState, useCallback, useRef, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Upload, FileSpreadsheet, FileText, X, Check, Loader2, Eye, 
    ArrowLeft, Table2, ChevronDown, ChevronRight, AlertTriangle,
    Download, Sparkles, File
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://playground-backend-1t0f.onrender.com/api'
    : 'http://localhost:8000/api'

const ACCEPTED_TYPES = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'text/csv',
    'application/pdf',
]

const ACCEPTED_EXTENSIONS = ['.xls', '.xlsx', '.xlsm', '.csv', '.pdf']

interface SheetData {
    name: string
    headers: string[]
    rows: (string | number | null)[][]
    totalRows: number
    totalCols: number
}

interface ParsedModel {
    filename: string
    fileSize: number
    sheets: SheetData[]
    summary: {
        totalSheets: number
        totalCells: number
        detectedType: string
    }
}

export default function UploadModelPage() {
    const router = useRouter()
    const token = useSelector(selectToken)
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isDragOver, setIsDragOver] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [parsedModel, setParsedModel] = useState<ParsedModel | null>(null)
    const [activeSheet, setActiveSheet] = useState<string>("")
    const [expandedSheets, setExpandedSheets] = useState<Set<string>>(new Set())
    const [parseProgress, setParseProgress] = useState(0)

    const getAuthToken = () => {
        if (!token) return '';
        if (typeof token === 'string') return token;
        if (typeof token === 'object' && (token as any).access) return (token as any).access;
        return '';
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) validateAndSetFile(file)
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) validateAndSetFile(file)
    }

    const validateAndSetFile = (file: File) => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase()
        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
            toast({
                title: "Invalid File Type",
                description: `Please upload one of: ${ACCEPTED_EXTENSIONS.join(', ')}`,
                variant: "destructive"
            })
            return
        }
        setUploadedFile(file)
        setParsedModel(null)
    }

    const handleUploadAndParse = async () => {
        if (!uploadedFile) return
        setIsUploading(true)
        setParseProgress(0)

        try {
            const formData = new FormData()
            formData.append('file', uploadedFile)

            // Simulate progress for UX
            const progressInterval = setInterval(() => {
                setParseProgress(prev => Math.min(prev + 8, 90))
            }, 200)

            const res = await fetch(`${API_BASE_URL}/models/parse_upload/`, {
                method: 'POST',
                headers: {
                    'Authorization': `JWT ${getAuthToken()}`
                },
                body: formData
            })

            clearInterval(progressInterval)
            setParseProgress(100)

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Upload failed' }))
                throw new Error(errorData.error || 'Failed to parse file')
            }

            const data = await res.json()
            setParsedModel(data)
            
            if (data.sheets?.length > 0) {
                setActiveSheet(data.sheets[0].name)
            }

            toast({
                title: "File Parsed Successfully",
                description: `Found ${data.summary?.totalSheets || 0} sheets with ${data.summary?.totalCells?.toLocaleString() || 0} data cells.`
            })
        } catch (error: any) {
            toast({
                title: "Parse Error",
                description: error.message || "Could not parse the uploaded file.",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleClearFile = () => {
        setUploadedFile(null)
        setParsedModel(null)
        setActiveSheet("")
        setParseProgress(0)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleProcessExtraction = async () => {
        if (!parsedModel) return
        setIsUploading(true)
        
        try {
            const res = await fetch(`${API_BASE_URL}/models/import_as_calculated_model/`, {
                method: 'POST',
                headers: {
                    'Authorization': `JWT ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: parsedModel.filename,
                    sheets: parsedModel.sheets
                })
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Sync failed' }))
                throw new Error(errorData.error || 'Failed to sync model to dashboard')
            }

            const data = await res.json()
            
            toast({
                title: "Model Synced Successfully",
                description: "Your financial data has been extracted and added to your dashboard.",
            })

            // Redirect to dashboard or the new model's page
            router.push('/dashboard')
        } catch (error: any) {
            toast({
                title: "Sync Error",
                description: error.message || "Could not sync model to dashboard.",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const getFileIcon = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase()
        if (ext === 'pdf') return <FileText className="w-6 h-6" />
        if (ext === 'csv') return <Table2 className="w-6 h-6" />
        return <FileSpreadsheet className="w-6 h-6" />
    }

    const activeSheetData = useMemo(() => {
        if (!parsedModel || !activeSheet) return null
        return parsedModel.sheets.find(s => s.name === activeSheet) || null
    }, [parsedModel, activeSheet])

    return (
        <div className="flex flex-col min-h-screen w-full bg-background">
            <div className="flex-1 p-4 md:p-8 pt-6">
                <div className="space-y-6 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/models/input/advanced')} className="h-8 w-8">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground">Import Model</h2>
                            </div>
                            <p className="text-muted-foreground ml-11">Upload an existing financial model to view and analyze it.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard/models/input/advanced">
                                <Button variant="outline" className="gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Build from Scratch
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Upload Area */}
                    {!parsedModel && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className={`border-2 border-dashed transition-all duration-300 ${
                                isDragOver 
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                                    : uploadedFile 
                                    ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' 
                                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                            }`}>
                                <CardContent
                                    className="p-10"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {!uploadedFile ? (
                                        <div className="flex flex-col items-center justify-center text-center py-8">
                                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                                                isDragOver ? 'bg-primary/20 scale-110' : 'bg-muted'
                                            }`}>
                                                <Upload className={`w-10 h-10 transition-colors ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">
                                                {isDragOver ? 'Drop your file here' : 'Drag & Drop your Financial Model'}
                                            </h3>
                                            <p className="text-sm text-muted-foreground max-w-md mb-6">
                                                Upload Excel (.xls, .xlsx, .xlsm), CSV, or PDF files. We'll parse the data and let you explore it visually.
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    size="lg"
                                                    className="gap-2"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Browse Files
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                                                {ACCEPTED_EXTENSIONS.map(ext => (
                                                    <Badge key={ext} variant="secondary" className="text-xs">{ext}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-6">
                                            {/* File preview */}
                                            <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 w-full max-w-lg mb-6">
                                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg flex items-center justify-center">
                                                    {getFileIcon(uploadedFile.name)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground truncate">{uploadedFile.name}</p>
                                                    <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={handleClearFile} className="shrink-0">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {/* Progress bar */}
                                            {isUploading && (
                                                <div className="w-full max-w-lg mb-4">
                                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                        <span>Parsing file...</span>
                                                        <span>{parseProgress}%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <motion.div 
                                                            className="h-full bg-primary rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${parseProgress}%` }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                <Button
                                                    size="lg"
                                                    onClick={handleUploadAndParse}
                                                    disabled={isUploading}
                                                    className="gap-2"
                                                >
                                                    {isUploading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                    {isUploading ? 'Parsing...' : 'Parse & View Model'}
                                                </Button>
                                                <Button variant="outline" size="lg" onClick={handleClearFile} disabled={isUploading}>
                                                    Choose Different File
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xls,.xlsx,.xlsm,.csv,.pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    {/* Parsed Model Viewer — Full Width, No Sidebar */}
                    <AnimatePresence>
                        {parsedModel && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {/* File Summary Bar */}
                                <div className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <FileSpreadsheet className="w-4.5 h-4.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">{parsedModel.filename}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {parsedModel.summary.totalSheets} sheets · {parsedModel.summary.totalCells.toLocaleString()} cells · {formatFileSize(parsedModel.fileSize)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge variant="secondary" className="text-xs">{parsedModel.summary.detectedType}</Badge>
                                        <Button 
                                            variant="default" 
                                            size="sm" 
                                            onClick={handleProcessExtraction}
                                            disabled={isUploading}
                                            className="gap-2 text-xs bg-primary hover:bg-primary/90"
                                        >
                                            {isUploading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                                            Process & Sync to Dashboard
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleClearFile} className="gap-1.5 text-xs">
                                            <Upload className="w-3 h-3" />
                                            Upload New
                                        </Button>
                                    </div>
                                </div>

                                {/* Spreadsheet Viewer */}
                                <Card className="overflow-hidden border border-border shadow-sm">
                                    {/* Sheet Tabs — Horizontal scrollable strip */}
                                    <div className="border-b border-border bg-muted/30">
                                        <div className="flex items-center overflow-x-auto scrollbar-none">
                                            {parsedModel.sheets.map((sheet, idx) => (
                                                <button
                                                    key={sheet.name}
                                                    onClick={() => setActiveSheet(sheet.name)}
                                                    className={`relative shrink-0 px-4 py-2.5 text-xs font-medium transition-all border-r border-border/50 whitespace-nowrap ${
                                                        activeSheet === sheet.name
                                                            ? 'bg-card text-foreground shadow-sm'
                                                            : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                                                    }`}
                                                >
                                                    {sheet.name}
                                                    {activeSheet === sheet.name && (
                                                        <motion.div
                                                            layoutId="activeSheetTab"
                                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                        />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sheet Info Bar */}
                                    {activeSheetData && (
                                        <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/50 text-xs text-muted-foreground">
                                            <span>{activeSheetData.totalRows} rows × {activeSheetData.totalCols} columns</span>
                                            {activeSheetData.totalRows > activeSheetData.rows.length && (
                                                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Showing first {activeSheetData.rows.length} of {activeSheetData.totalRows} rows
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Data Table */}
                                    <div className="overflow-auto max-h-[60vh] md:max-h-[70vh] border-t border-border">
                                        {activeSheetData ? (
                                            <table className="w-full text-[11px] border-collapse font-mono" style={{ minWidth: `${Math.max(activeSheetData.headers.length * 120, 800)}px` }}>
                                                <thead className="sticky top-0 z-20">
                                                    <tr>
                                                        {/* Row number header */}
                                                        <th className="bg-[#f0f0f0] dark:bg-[#2a2a2a] text-center p-1.5 font-semibold text-muted-foreground border-b border-r border-[#d0d0d0] dark:border-[#444] w-12 sticky left-0 z-30">
                                                            
                                                        </th>
                                                        {activeSheetData.headers.map((h, i) => (
                                                            <th
                                                                key={i}
                                                                className="bg-[#f0f0f0] dark:bg-[#2a2a2a] text-left px-2 py-1.5 font-semibold border-b border-r border-[#d0d0d0] dark:border-[#444] text-foreground"
                                                                style={{ minWidth: '100px' }}
                                                                title={h}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] text-muted-foreground font-normal mb-0.5">
                                                                        {String.fromCharCode(65 + (i % 26))}{i >= 26 ? String.fromCharCode(65 + Math.floor(i / 26) - 1) : ''}
                                                                    </span>
                                                                    <span className="leading-tight">{h}</span>
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {activeSheetData.rows.map((row, rowIdx) => (
                                                        <tr
                                                            key={rowIdx}
                                                            className={`${rowIdx % 2 === 0 ? 'bg-card' : 'bg-muted/10'} hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors`}
                                                        >
                                                            {/* Row number */}
                                                            <td className="bg-[#f0f0f0] dark:bg-[#2a2a2a] text-center p-1.5 text-muted-foreground border-r border-b border-[#d0d0d0] dark:border-[#444] font-semibold sticky left-0 z-10 select-none">
                                                                {rowIdx + 2}
                                                            </td>
                                                            {row.map((cell, colIdx) => {
                                                                const isNumber = typeof cell === 'number'
                                                                const isEmpty = cell === null || cell === ''
                                                                return (
                                                                    <td
                                                                        key={colIdx}
                                                                        className={`px-2 py-1 border-r border-b border-[#e8e8e8] dark:border-[#333] ${
                                                                            isNumber ? 'text-right tabular-nums' : 'text-left'
                                                                        } ${isEmpty ? 'text-muted-foreground/20' : 'text-foreground'}`}
                                                                    >
                                                                        {isEmpty
                                                                            ? ''
                                                                            : isNumber
                                                                                ? cell.toLocaleString(undefined, { maximumFractionDigits: 2 })
                                                                                : String(cell)
                                                                        }
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                                                Select a sheet to view its data
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
