export const INDUSTRY_SUB_TYPES: Record<string, string[]> = {
  "Manufacturing": [
    "Food & Beverage",
    "Chemicals",
    "Automotive",
    "Textiles",
    "Pharmaceuticals",
    "Electronics",
    "Steel & Metals",
    "Cement",
    "Other"
  ],
  "Real Estate": [
    "Residential",
    "Commercial Office",
    "Mixed-Use",
    "Hospitality",
    "Industrial/Warehousing",
    "Retail",
    "Other"
  ],
  "Energy & Power": [
    "Hydropower",
    "Solar",
    "Wind",
    "Thermal",
    "Nuclear",
    "Biomass",
    "Geothermal",
    "Other"
  ],
  "Oil & Gas": [
    "Upstream (Exploration & Production)",
    "Midstream (Transportation & Storage)",
    "Downstream (Refining & Marketing)",
    "Integrated",
    "LNG",
    "Petrochemicals",
    "Other"
  ],
  "Healthcare": [
    "Hospital",
    "Diagnostic Center",
    "Pharmaceutical Manufacturing",
    "Health Tech",
    "Other"
  ],
  "Technology": [
    "SaaS",
    "Hardware",
    "Fintech",
    "E-commerce",
    "Data Center",
    "Telecom",
    "Other"
  ],
  "Agriculture": [
    "Crop Farming",
    "Livestock",
    "Aquaculture",
    "Agro-Processing",
    "Forestry",
    "Other"
  ],
  "Infrastructure": [
    "Roads & Bridges",
    "Water & Sanitation",
    "Railways",
    "Ports",
    "Airports",
    "Telecom Infrastructure",
    "Other"
  ],
  "Other": ["Other"]
};

export const REVENUE_MODEL_TYPES = [
  "Volume × Price",
  "Capacity × Tariff",
  "Subscription/SaaS",
  "Rental/Lease",
  "Fixed Contract",
  "% of Market",
  "Custom Formula"
];

export const CAPACITY_UNIT_MAPPINGS: Record<string, string[]> = {
  "Manufacturing": ["barrels", "tons", "liters", "kg", "pieces", "MT", "units/month"],
  "Real Estate": ["sq.ft", "sq.m", "units", "acres", "rooms"],
  "Energy & Power": ["MW", "kW", "MWh", "GWh"],
  "Oil & Gas": ["bpd (barrels per day)", "mmscfd", "tons/day"],
  "Healthcare": ["beds", "patients/day", "procedures/month"],
  "Technology": ["users", "subscribers", "GB/month", "API calls/month", "racks"],
  "Agriculture": ["hectares", "acres", "tons/year", "heads", "kg/day"],
  "Infrastructure": ["km", "passengers/day", "tons/day", "vehicles/day"],
  "Other": ["units", "other"]
};

export interface OpexTemplateItem {
  name: string;
  type: "fixed_usd" | "fixed_local" | "pct_revenue";
  defaultValue: number;
}

export const OPEX_TEMPLATES: Record<string, OpexTemplateItem[]> = {
  "Upstream (Exploration & Production)": [
    { name: "Well maintenance", type: "fixed_usd", defaultValue: 500000 },
    { name: "Drilling consumables", type: "fixed_usd", defaultValue: 250000 },
    { name: "Rig rental", type: "fixed_usd", defaultValue: 1000000 },
    { name: "HSE compliance", type: "fixed_usd", defaultValue: 100000 },
    { name: "Community development levy", type: "pct_revenue", defaultValue: 2.0 }
  ],
  "Downstream (Refining & Marketing)": [
    { name: "Feedstock cost", type: "pct_revenue", defaultValue: 60.0 },
    { name: "Catalyst replacement", type: "fixed_usd", defaultValue: 300000 },
    { name: "Tank farm maintenance", type: "fixed_usd", defaultValue: 150000 },
    { name: "Pipeline fees", type: "pct_revenue", defaultValue: 1.5 },
    { name: "Product blending", type: "fixed_usd", defaultValue: 200000 }
  ],
  "Solar": [
    { name: "Panel cleaning", type: "fixed_usd", defaultValue: 50000 },
    { name: "Inverter replacement reserve", type: "fixed_usd", defaultValue: 100000 },
    { name: "Grid connection fees", type: "fixed_usd", defaultValue: 75000 },
    { name: "Curtailment losses", type: "pct_revenue", defaultValue: 2.0 }
  ],
  "Hydropower": [
    { name: "Dam maintenance", type: "fixed_usd", defaultValue: 200000 },
    { name: "Turbine overhaul reserve", type: "fixed_usd", defaultValue: 300000 },
    { name: "Environmental monitoring", type: "fixed_usd", defaultValue: 50000 },
    { name: "Water rights fees", type: "fixed_usd", defaultValue: 100000 }
  ],
  "Manufacturing": [
    { name: "Raw material", type: "pct_revenue", defaultValue: 40.0 },
    { name: "QA/QC", type: "fixed_usd", defaultValue: 100000 },
    { name: "Packaging", type: "pct_revenue", defaultValue: 5.0 },
    { name: "Distribution/logistics", type: "pct_revenue", defaultValue: 8.0 },
    { name: "Waste disposal", type: "fixed_usd", defaultValue: 50000 }
  ],
  "Real Estate": [
    { name: "Property management", type: "pct_revenue", defaultValue: 5.0 },
    { name: "HOA/service charges", type: "fixed_usd", defaultValue: 120000 },
    { name: "Grounds maintenance", type: "fixed_usd", defaultValue: 60000 },
    { name: "Pest control", type: "fixed_usd", defaultValue: 15000 },
    { name: "Elevator maintenance", type: "fixed_usd", defaultValue: 25000 }
  ],
  "Healthcare": [
    { name: "Medical supplies", type: "pct_revenue", defaultValue: 15.0 },
    { name: "Biomedical equipment maintenance", type: "fixed_usd", defaultValue: 150000 },
    { name: "Waste disposal (medical)", type: "fixed_usd", defaultValue: 50000 },
    { name: "Licensing & accreditation", type: "fixed_usd", defaultValue: 30000 }
  ],
  "Technology": [
    { name: "Cloud hosting", type: "pct_revenue", defaultValue: 10.0 },
    { name: "API costs", type: "pct_revenue", defaultValue: 2.0 },
    { name: "Cybersecurity", type: "fixed_usd", defaultValue: 100000 },
    { name: "Customer support software", type: "fixed_usd", defaultValue: 50000 },
    { name: "License fees", type: "fixed_usd", defaultValue: 75000 }
  ]
};

export function getOpexTemplate(industry: string, subType: string): OpexTemplateItem[] {
  if (industry === "Oil & Gas" && OPEX_TEMPLATES[subType]) {
    return OPEX_TEMPLATES[subType];
  }
  if (industry === "Energy & Power" && OPEX_TEMPLATES[subType]) {
    return OPEX_TEMPLATES[subType];
  }
  if (OPEX_TEMPLATES[industry]) {
    return OPEX_TEMPLATES[industry];
  }
  return [];
}
