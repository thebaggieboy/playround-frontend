import React from "react"
import { Card } from "@/components/ui/card"
import { InputField } from "./InputField"
import {
  getIndustryLibraryFields,
  getIndustryLibraryMetadata,
  type IndustryLibraryDomain,
} from "./IndustryConfig"

export function IndustryLibraryFields({
  formData,
  updateFormData,
  domain,
}: {
  formData: Record<string, any>
  updateFormData: (field: string, value: any) => void
  domain: IndustryLibraryDomain
}) {
  const industry = formData.industrySector || "Other"
  const subType = formData.industrySubType || ""
  const fields = getIndustryLibraryFields(domain, industry, subType)
  const metadata = getIndustryLibraryMetadata(industry, subType)

  if (fields.length === 0) return null

  const scope = `${industry}:${subType}:${domain}`
  const values = formData.industryLibraryInputs?.[scope] || {}
  const updateValue = (id: string, value: string, type: "number" | "select" | "text") => {
    const nextValue = type === "number" && value !== "" ? Number(value) : value
    updateFormData("industryLibraryInputs", {
      ...formData.industryLibraryInputs,
      [scope]: { ...values, [id]: nextValue },
    })
  }

  return (
    <Card className="mt-6 space-y-5 p-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            {subType ? `${subType} Library Inputs` : `${industry} Library Inputs`}
          </h3>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            {metadata.itemCode}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {metadata.level} · {metadata.status}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Library benchmarks are not prefilled unless an approved source is available. Enter project values and retain their source in the project record.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field) => {
          const value = values[field.id]
          return (
            <InputField
              key={field.id}
              label={field.label}
              type={field.type}
              options={field.options}
              value={value === undefined || value === null ? "" : String(value)}
              suffix={field.unit}
              tooltip={field.description}
              placeholder={field.type === "select" ? "Select an option" : "Enter a sourced project value"}
              onChange={(nextValue) => updateValue(field.id, nextValue, field.type)}
            />
          )
        })}
      </div>

      <div className="space-y-4 border-t border-border pt-5">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Project source / override record</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Record the shared source metadata for this tab's inputs. If values use different sources, identify each field in the reference.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InputField
            label="Source Tier"
            type="select"
            options={[
              "Tier 1: Official and primary",
              "Tier 2: Institutional and industry",
              "Tier 3: Commercial data",
              "Tier 4: Market and user data",
            ]}
            value={String(values.sourceTier ?? "")}
            placeholder="Select a source tier"
            onChange={(nextValue) => updateValue("sourceTier", nextValue, "select")}
          />
          <InputField
            label="Source / Publisher / Reference"
            value={String(values.sourceReference ?? "")}
            placeholder="Source name, URL or project override rationale"
            tooltip="Tier 3 values require licensing review; Tier 4 values remain project-specific and do not automatically become Library benchmarks."
            onChange={(nextValue) => updateValue("sourceReference", nextValue, "text")}
          />
          <InputField
            label="Publication / Source Date"
            value={String(values.sourceDate ?? "")}
            placeholder="YYYY-MM-DD"
            onChange={(nextValue) => updateValue("sourceDate", nextValue, "text")}
          />
          <InputField
            label="Licence / Usage Rights"
            value={String(values.licence ?? "")}
            placeholder="Record licence type, expiry and usage permissions"
            tooltip="Record commercial-use, redistribution and attribution requirements where applicable."
            onChange={(nextValue) => updateValue("licence", nextValue, "text")}
          />
        </div>
      </div>

      {domain === "macro" && (
        <p className="text-xs text-muted-foreground">
          Monetary library benchmarks use real 2026 prices by default. Contractual or statutory nominal values should be flagged so they are not escalated twice.
        </p>
      )}
    </Card>
  )
}
