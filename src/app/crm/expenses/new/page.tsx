'use client'

import { useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Upload, X, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Select from '@/components/crm/ui/Select'
import { EXPENSE_CATEGORIES } from '@/lib/crm/constants'
import type { ExpenseCategory } from '@/types/crm'
import toast from 'react-hot-toast'

type FormData = {
  title: string
  amount: string
  category: ExpenseCategory | ''
  expense_date: string
  description: string
  notes: string
}

const initial: FormData = {
  title: '',
  amount: '',
  category: '',
  expense_date: new Date().toISOString().slice(0, 10),
  description: '',
  notes: '',
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE_MB = 5

export default function NewExpensePage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>(initial)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    }
  }

  const handleFileSelect = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP, or PDF files are allowed')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be under ${MAX_SIZE_MB}MB`)
      return
    }
    setReceiptFile(file)
    if (file.type.startsWith('image/')) {
      setReceiptPreview(URL.createObjectURL(file))
    } else {
      setReceiptPreview(null)
    }
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const removeFile = () => {
    setReceiptFile(null)
    setReceiptPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadReceipt = async (file: File): Promise<string> => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(path, file, { contentType: file.type, upsert: false })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(data.path)
    return publicUrl
  }

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount'
    if (!form.category) errs.category = 'Select a category'
    if (!form.expense_date) errs.expense_date = 'Select a date'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault()
    if (!asDraft && !validate()) return

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      let receipt_url: string | null = null
      if (receiptFile) {
        receipt_url = await uploadReceipt(receiptFile)
      }

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          title: form.title.trim(),
          amount: Number(form.amount),
          category: form.category || 'other',
          expense_date: form.expense_date,
          description: form.description.trim() || null,
          receipt_url,
          notes: form.notes.trim() || null,
          status: asDraft ? 'draft' : 'submitted',
          submitted_by: user?.id || null,
        })
        .select('id')
        .single()

      if (error) throw error

      toast.success(asDraft ? 'Expense saved as draft' : 'Expense submitted for approval')
      router.push(`/crm/expenses/${data.id}`)
    } catch (err) {
      console.error('Failed to submit expense:', err)
      toast.error('Failed to submit expense. Please try again.')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const isLoading = saving || uploading

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/crm/expenses"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Submit Expense</h1>
          <p className="mt-0.5 text-sm text-altina-muted">Fill in your expense details for approval</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Basic Details */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Expense Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Google Ads Campaign – March 2026"
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:ring-2 focus:ring-altina-gold/20 ${
                  errors.title ? 'border-red-500/50' : 'border-white/15 focus:border-altina-gold/50'
                }`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Amount (INR) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => update('amount', e.target.value)}
                placeholder="0.00"
                min="1"
                step="0.01"
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:ring-2 focus:ring-altina-gold/20 ${
                  errors.amount ? 'border-red-500/50' : 'border-white/15 focus:border-altina-gold/50'
                }`}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.expense_date}
                onChange={(e) => update('expense_date', e.target.value)}
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:ring-2 focus:ring-altina-gold/20 [color-scheme:dark] ${
                  errors.expense_date ? 'border-red-500/50' : 'border-white/15 focus:border-altina-gold/50'
                }`}
              />
              {errors.expense_date && <p className="mt-1 text-xs text-red-400">{errors.expense_date}</p>}
            </div>

            <div className="sm:col-span-2">
              <Select
                label="Category"
                value={form.category}
                onChange={(v) => update('category', v)}
                options={EXPENSE_CATEGORIES}
                placeholder="Select category..."
                className={errors.category ? 'border-red-500/50' : ''}
              />
              {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                placeholder="Describe what this expense was for..."
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
          </div>
        </div>

        {/* Receipt Upload */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Receipt</h2>

          {receiptFile ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              {receiptPreview ? (
                <img src={receiptPreview} alt="Receipt preview" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-altina-gold/10">
                  <FileText size={24} className="text-altina-gold" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{receiptFile.name}</p>
                <p className="text-xs text-altina-muted">{(receiptFile.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/[0.01] p-8 transition-colors hover:border-altina-gold/30 hover:bg-white/[0.03]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-altina-gold/10">
                <Upload size={22} className="text-altina-gold" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">Click or drag to upload receipt</p>
                <p className="mt-1 text-xs text-altina-muted">JPEG, PNG, WebP or PDF · Max {MAX_SIZE_MB}MB</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Additional Notes</h2>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            placeholder="Any additional context for the approver..."
            className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
            disabled={isLoading}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-altina-gold px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> {uploading ? 'Uploading...' : 'Submitting...'}</>
            ) : (
              <><Save size={16} /> Submit for Approval</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
