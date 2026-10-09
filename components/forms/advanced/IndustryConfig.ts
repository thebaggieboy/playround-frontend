export const INDUSTRY_SUB_TYPES: Record<string, string[]> = {
  "Manufacturing": [
    "Food & Beverage",
    "Chemicals",
    "Automotive",
    "Textiles",
    "Pharmaceuticals",
    "Electronics",
    "Steel & Metals",
    "Steel",
    "Fertilizer",
    "Cement",
    "Other"
  ],
  "Real Estate": [
    "Residential",
    "Commercial",
    "Commercial Office",
    "Mixed Use",
    "Mixed-Use",
    "Hospitality",
    "Industrial/Warehousing",
    "Retail",
    "Other"
  ],
  "Energy & Power": [
    "Solar",
    "Battery Storage",
    "Wind",
    "Hydro",
    "Thermal",
    "Nuclear",
    "Biogas",
    "Hydrogen",
    "Geothermal",
    "Waste-to-Energy",
    "Biomass",
    "Concentrated Solar Power",
    "Transmission and Distribution",
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
  "Mining and Natural Resources": [
    "Exploration",
    "Mining",
    "Processing",
    "Mineral Beneficiation",
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
  "Energy & Power": ["MW", "MWac", "MWdc", "MWh", "GWh", "kW", "kWh"],
  "Oil & Gas": ["bpd (barrels per day)", "mmscfd", "tons/day"],
  "Healthcare": ["beds", "patients/day", "procedures/month"],
  "Technology": ["users", "subscribers", "GB/month", "API calls/month", "racks"],
  "Agriculture": ["hectares", "acres", "tons/year", "heads", "kg/day"],
  "Infrastructure": ["km", "passengers/day", "tons/day", "vehicles/day"],
  "Mining and Natural Resources": ["tonnes/year", "tonnes/day", "kt/year", "ore tonnes", "ounces/year"],
  "Other": ["units", "other"]
};

export interface OpexTemplateItem {
  name: string;
  type: "fixed_usd" | "fixed_local" | "pct_revenue";
  defaultValue?: number;
}

export const OPEX_TEMPLATES: Record<string, OpexTemplateItem[]> = {
  "Upstream (Exploration & Production)": [
    { name: "Well maintenance", type: "fixed_usd" },
    { name: "Drilling consumables", type: "fixed_usd" },
    { name: "Rig rental", type: "fixed_usd" },
    { name: "HSE compliance", type: "fixed_usd" },
    { name: "Community development levy", type: "pct_revenue" }
  ],
  "Downstream (Refining & Marketing)": [
    { name: "Feedstock cost", type: "pct_revenue" },
    { name: "Catalyst replacement", type: "fixed_usd" },
    { name: "Tank farm maintenance", type: "fixed_usd" },
    { name: "Pipeline fees", type: "pct_revenue" },
    { name: "Product blending", type: "fixed_usd" }
  ],
  "Solar": [
    { name: "Plant operations and maintenance", type: "fixed_usd" },
    { name: "Inverter replacement reserve", type: "fixed_usd" },
    { name: "Grid connection charges", type: "fixed_usd" },
    { name: "Curtailment losses", type: "pct_revenue" }
  ],
  "Hydro": [
    { name: "Dam and civil works maintenance", type: "fixed_usd" },
    { name: "Turbine overhaul reserve", type: "fixed_usd" },
    { name: "Environmental flow monitoring", type: "fixed_usd" },
    { name: "Water use charges", type: "fixed_usd" }
  ],
  "Manufacturing": [
    { name: "Raw material", type: "pct_revenue" },
    { name: "Quality assurance and control", type: "fixed_usd" },
    { name: "Packaging", type: "pct_revenue" },
    { name: "Distribution and logistics", type: "pct_revenue" },
    { name: "Waste treatment and disposal", type: "fixed_usd" }
  ],
  "Real Estate": [
    { name: "Property management", type: "pct_revenue" },
    { name: "Service charges", type: "fixed_usd" },
    { name: "Grounds maintenance", type: "fixed_usd" },
    { name: "Pest control", type: "fixed_usd" },
    { name: "Elevator maintenance", type: "fixed_usd" }
  ],
  "Healthcare": [
    { name: "Medical supplies", type: "pct_revenue" },
    { name: "Biomedical equipment maintenance", type: "fixed_usd" },
    { name: "Clinical waste treatment and disposal", type: "fixed_usd" },
    { name: "Licensing and accreditation", type: "fixed_usd" }
  ],
  "Technology": [
    { name: "Cloud hosting", type: "pct_revenue" },
    { name: "API and data costs", type: "pct_revenue" },
    { name: "Cybersecurity", type: "fixed_usd" },
    { name: "Customer support systems", type: "fixed_usd" },
    { name: "Software licence fees", type: "fixed_usd" }
  ]
};

export function getOpexTemplate(industry: string, subType: string): OpexTemplateItem[] {
  const normalizedSubType = subType === "Hydropower" ? "Hydro" : subType;
  if (industry === "Oil & Gas" && OPEX_TEMPLATES[normalizedSubType]) {
    return OPEX_TEMPLATES[normalizedSubType];
  }
  if ((industry === "Energy & Power" || industry === "Oil & Gas") && OPEX_TEMPLATES[normalizedSubType]) {
    return OPEX_TEMPLATES[normalizedSubType];
  }
  if (OPEX_TEMPLATES[industry]) {
    return OPEX_TEMPLATES[industry];
  }
  return [];
}

export type IndustryLibraryDomain =
  | "project"
  | "macro"
  | "revenue"
  | "opex"
  | "capex"
  | "financing"
  | "tax"
  | "working-capital"
  | "depreciation"
  | "dividend"
  | "valuation";

export interface IndustryLibraryField {
  id: string;
  label: string;
  type: "number" | "select" | "text";
  unit?: string;
  options?: string[];
  description: string;
  libraryItemId?: null;
  valueType?: "number" | "categorical" | "text";
  benchmarkStatus?: "not-approved";
  sourceRequired?: boolean;
  projectOverrideAllowed?: true;
  validation?: { minimum?: number; maximum?: number };
}

export interface IndustryFormCopy {
  timelinePhaseLabel: string;
  productionHeading: string;
  capacityLabel: string;
  capacityUnitLabel: string;
  capacityDescription: string;
  availabilityLabel: string;
  availabilityDescription: string;
  commissioningLabel: string;
  sectionNames: Record<IndustryLibraryDomain, string>;
  revenueStreamLabel: string;
  revenueNameLabel: string;
  laborHeading: string;
  workforceLabel: string;
  primaryUtilityLabel: string;
  capexAssetLabel: string;
  capexCivilLabel: string;
}

export function getIndustryFormCopy(industry: string, subType: string): IndustryFormCopy {
  const profile = {
    timelinePhaseLabel: ({
      Technology: "Development",
      Healthcare: "Facility Development",
      Agriculture: "Farm Development",
      "Mining and Natural Resources": "Mine Development",
      "Oil & Gas": subType.includes("Upstream") ? "Field Development" : "Asset Development",
      "Energy & Power": "Project Development",
    } as Record<string, string>)[industry] || "Construction",
    productionHeading: "Capacity & Production Details",
    capacityLabel: "Total Plant/Factory Capacity",
    capacityUnitLabel: "Capacity Unit",
    capacityDescription: "The maximum production output the facility is designed for at rated capacity.",
    availabilityLabel: "Maximum Plant Availability",
    availabilityDescription: "Expected operating availability after planned and unplanned outages.",
    commissioningLabel: "Commissioning Availability",
    sectionNames: {
      project: "Project Information",
      macro: `${industry} Macro Assumptions`,
      revenue: `${industry} Revenue Assumptions`,
      opex: `${industry} Operating Costs`,
      capex: `${industry} Capital Investment`,
      financing: `${industry} Financing Structure`,
      tax: `${industry} Tax & Statutory Assumptions`,
      "working-capital": `${industry} Working Capital`,
      depreciation: `${industry} Asset Depreciation`,
      dividend: `${industry} Distributions & Shareholder Returns`,
      valuation: `${industry} Project Valuation`,
    } satisfies Record<IndustryLibraryDomain, string>,
    revenueStreamLabel: "Revenue Stream",
    revenueNameLabel: "Product/Service Name",
    laborHeading: "Workforce & Personnel Costs",
    workforceLabel: "Total Headcount",
    primaryUtilityLabel: "Primary Energy / Utility Cost",
    capexAssetLabel: "Plant, Machinery & Equipment",
    capexCivilLabel: "Building & Civil Works",
  }

  if (industry === "Energy & Power") {
    const solar = subType === "Solar"
    const battery = subType === "Battery Storage"
    return {
      ...profile,
      productionHeading: battery ? "Storage Power & Energy Capacity" : `${subType || "Power"} Generation & Yield Details`,
      capacityLabel: battery ? "Storage Power Capacity" : `${subType || "Power"} Installed Capacity`,
      capacityUnitLabel: battery ? "Power / Energy Capacity Unit" : "Installed Capacity Unit",
      capacityDescription: battery
        ? "Maximum storage charge or discharge power; enter storage energy capacity separately."
        : `Nameplate ${subType.toLowerCase()} generation capacity. Select AC, DC or energy units to match the project design.`,
      availabilityLabel: "Plant / System Availability",
      availabilityDescription: "Expected operating availability after planned and unplanned outages.",
      commissioningLabel: "Commissioning / Ramp-up Availability",
      sectionNames: {
        ...profile.sectionNames,
        revenue: `${subType} Offtake & Revenue`,
        opex: `${subType} Operations & Lifecycle Costs`,
        capex: `${subType} Generation / Storage CAPEX`,
        financing: "Power Project Financing & Reserves",
        tax: "Power Project Tax & Incentives",
        "working-capital": "Power Offtaker Receivables & Operating Reserves",
        depreciation: `${subType} Asset Lives & Depreciation`,
        dividend: "Power Project Distributions & Reserve Conditions",
        valuation: `${subType} Generation Case & Project Valuation`,
      },
      revenueStreamLabel: solar ? "Offtake / Energy Revenue Stream" : `${subType} Revenue Stream`,
      revenueNameLabel: battery ? "Storage Service / Revenue Product" : solar ? "Energy Offtake Product" : `${subType} Product / Service`,
      laborHeading: "Plant Operations & Maintenance Workforce",
      workforceLabel: "Plant Operations FTEs",
      primaryUtilityLabel: battery ? "Auxiliary Electricity & Charging Cost" : "Auxiliary Electricity / Station Service Cost",
      capexAssetLabel: battery ? "Battery Energy Storage System (BESS)" : `${subType} Generation Plant & Equipment`,
      capexCivilLabel: solar ? "Site Preparation & Solar Civil Works" : `${subType} Civil & Site Works`,
    }
  }

  if (industry === "Mining and Natural Resources") {
    return {
      ...profile,
      productionHeading: `${subType || "Mining"} & Processing Throughput`,
      capacityLabel: "Annual Ore / Plant Throughput",
      capacityUnitLabel: "Ore or Product Capacity Unit",
      capacityDescription: "Design throughput for mine production or processing; specify ore, concentrate or saleable product basis.",
      availabilityLabel: "Mine / Processing Plant Availability",
      availabilityDescription: "Expected operating availability of the mine and processing circuit.",
      commissioningLabel: "Ramp-up Recovery / Throughput",
      sectionNames: {
        ...profile.sectionNames,
        revenue: "Commodity Sales & Offtake",
        opex: "Mining, Processing & Site Operating Costs",
        capex: "Mine Development & Processing CAPEX",
        financing: "Mine Development Financing & Reserves",
        tax: "Mining Tax, Royalties & Duties",
        "working-capital": "Ore Stockpiles, Consumables & Receivables",
        depreciation: "Mine, Plant & Development Asset Lives",
        dividend: "Mine Cash Distribution & Covenant Policy",
        valuation: "Commodity Price Case & Mine Valuation",
      },
      revenueStreamLabel: "Commodity / Product Sales Stream",
      revenueNameLabel: "Commodity / Saleable Product",
      laborHeading: "Mine, Processing & Site Workforce",
      workforceLabel: "Mine & Plant FTEs",
      primaryUtilityLabel: "Mine & Processing Power Cost",
      capexAssetLabel: "Mine Fleet & Processing Plant",
      capexCivilLabel: "Mine Infrastructure & Site Development",
    }
  }

  const sectorCopy: Record<string, Partial<IndustryFormCopy>> = {
    Manufacturing: {
      productionHeading: `${subType || "Manufacturing"} Production & Throughput`,
      capacityLabel: "Annual Nameplate Production Capacity",
      capacityUnitLabel: "Production Capacity Unit",
      capacityDescription: "Maximum annual product output at rated operating capacity.",
      availabilityLabel: "Production Line Availability",
      commissioningLabel: "Production Ramp-up Availability",
      revenueStreamLabel: "Product Sales Stream",
      revenueNameLabel: "Product / SKU Name",
      laborHeading: "Production Workforce & Personnel Costs",
      workforceLabel: "Production & Support FTEs",
      primaryUtilityLabel: "Production Energy Cost",
      capexAssetLabel: `${subType || "Manufacturing"} Production Line & Equipment`,
      capexCivilLabel: "Factory & Process Civil Works",
    },
    Agriculture: {
      productionHeading: `${subType || "Agriculture"} Production & Yield`,
      capacityLabel: "Annual Farm / Production Output",
      capacityUnitLabel: "Agricultural Output Unit",
      capacityDescription: "Expected annual output, land area or production volume; select the matching unit.",
      availabilityLabel: "Production / Facility Availability",
      commissioningLabel: "First-Cycle Production Ramp-up",
      revenueStreamLabel: "Crop / Livestock / Produce Sales",
      revenueNameLabel: "Crop / Livestock Product",
      laborHeading: "Farm & Seasonal Workforce",
      workforceLabel: "Farm & Seasonal FTEs",
      primaryUtilityLabel: "Irrigation / Production Energy Cost",
      capexAssetLabel: "Farm Machinery & Production Assets",
      capexCivilLabel: "Land Preparation & Agricultural Infrastructure",
    },
    "Real Estate": {
      productionHeading: `${subType || "Property"} Area & Inventory`,
      capacityLabel: "Gross / Saleable Property Area",
      capacityUnitLabel: "Area / Property Unit",
      capacityDescription: "Gross, lettable or saleable area or unit count as appropriate to the property.",
      availabilityLabel: "Lettable / Saleable Availability",
      commissioningLabel: "Lease-up / Occupancy at Opening",
      revenueStreamLabel: "Property / Tenancy Revenue Stream",
      revenueNameLabel: "Property Type / Unit Category",
      laborHeading: "Property Operations & Management Team",
      workforceLabel: "Property Operations FTEs",
      primaryUtilityLabel: "Common-Area Utilities Cost",
      capexAssetLabel: "Building Systems & Property Equipment",
      capexCivilLabel: "Building Construction & Site Works",
    },
    Healthcare: {
      productionHeading: `${subType || "Healthcare"} Clinical Service Capacity`,
      capacityLabel: "Beds / Patients / Procedures Capacity",
      capacityUnitLabel: "Clinical Capacity Unit",
      capacityDescription: "Use the relevant service measure: beds, patients per day or procedures per month.",
      availabilityLabel: "Clinical Service Availability",
      commissioningLabel: "Clinical Service Ramp-up",
      revenueStreamLabel: "Clinical Service Revenue Stream",
      revenueNameLabel: "Clinical Service / Care Category",
      laborHeading: "Clinical & Facility Workforce",
      workforceLabel: "Clinical & Facility FTEs",
      primaryUtilityLabel: "Clinical Facility Energy Cost",
      capexAssetLabel: "Clinical & Diagnostic Equipment",
      capexCivilLabel: "Clinical Facility & Specialist Civil Works",
    },
    Technology: {
      productionHeading: `${subType || "Technology"} Service & Platform Capacity`,
      capacityLabel: "Addressable Platform / Service Capacity",
      capacityUnitLabel: "Digital Capacity Unit",
      capacityDescription: "Use the relevant digital measure: users, subscribers, data throughput, API calls or racks.",
      availabilityLabel: "Platform / Service Availability",
      commissioningLabel: "Customer / Platform Ramp-up",
      revenueStreamLabel: "Digital Product / Service Revenue",
      revenueNameLabel: "Platform / Subscription / Service",
      laborHeading: "Product, Engineering & Support Workforce",
      workforceLabel: "Product & Support FTEs",
      primaryUtilityLabel: "Cloud / Data Centre Energy Cost",
      capexAssetLabel: "Technology Platform & Compute Equipment",
      capexCivilLabel: "Data Centre & Technical Infrastructure",
    },
    Infrastructure: {
      productionHeading: `${subType || "Infrastructure"} Service Throughput`,
      capacityLabel: "Design Service / Network Capacity",
      capacityUnitLabel: "Infrastructure Capacity Unit",
      capacityDescription: "Enter the infrastructure throughput in the matching service unit, such as km, passengers or tonnes per day.",
      availabilityLabel: "Asset / Network Availability",
      commissioningLabel: "Service Opening Ramp-up",
      revenueStreamLabel: "Concession / User-Fee Revenue Stream",
      revenueNameLabel: "Service / User-Fee Category",
      laborHeading: "Asset Operations & Maintenance Workforce",
      workforceLabel: "Operations & Maintenance FTEs",
      primaryUtilityLabel: "Network / Asset Energy Cost",
      capexAssetLabel: `${subType || "Infrastructure"} Asset & Systems`,
      capexCivilLabel: `${subType || "Infrastructure"} Civil Works`,
    },
    "Oil & Gas": {
      productionHeading: `${subType || "Oil & Gas"} Production & Throughput`,
      capacityLabel: "Design Production / Throughput Capacity",
      capacityUnitLabel: "Hydrocarbon Capacity Unit",
      capacityDescription: "Enter the facility's design production, transport, storage or processing throughput.",
      availabilityLabel: "Facility / Asset Availability",
      commissioningLabel: "Production Ramp-up Availability",
      revenueStreamLabel: "Hydrocarbon Product / Service Stream",
      revenueNameLabel: "Hydrocarbon Product / Service",
      laborHeading: "Facility & Field Workforce",
      workforceLabel: "Field & Facility FTEs",
      primaryUtilityLabel: "Process Energy & Utilities Cost",
      capexAssetLabel: `${subType || "Oil & Gas"} Process & Operating Equipment`,
      capexCivilLabel: "Site, Pipeline & Process Civil Works",
    },
  }

  const selected = sectorCopy[industry]
  return selected ? { ...profile, ...selected } : profile
}

const POWER_SUBSECTORS = ["Solar", "Battery Storage", "Wind", "Hydro", "Thermal", "Nuclear", "Biogas", "Hydrogen"];

const POWER_SHARED_PROJECT_FIELDS: IndustryLibraryField[] = [
  { id: "offtakeRoute", label: "Offtake Route", type: "select", options: ["Power Purchase Agreement (PPA)", "Merchant", "Captive / behind-the-meter", "Hybrid"], description: "Power-sector configuration switch." },
  { id: "gridConnection", label: "Grid Connection", type: "select", options: ["Grid-connected", "Islanded / off-grid"], description: "Power-sector configuration switch." },
  { id: "financingRoute", label: "Financing Route", type: "select", options: ["Project finance", "Corporate finance", "Public / concessional", "Hybrid"], description: "Power-sector configuration switch." },
];

const POWER_PROJECT_FIELDS: Record<string, IndustryLibraryField[]> = {
  Solar: [
    { id: "segment", label: "Solar Segment", type: "select", options: ["Utility-scale", "Commercial & Industrial (C&I)"], description: "Residential solar is outside the v1.0 library scope." },
    { id: "mountingType", label: "Mounting Configuration", type: "select", options: ["Fixed tilt", "Single-axis tracker", "Rooftop"], description: "Select the PV mounting configuration." },
    { id: "storage", label: "Battery Storage Included", type: "select", options: ["No", "Yes"], description: "Storage is linked to the Battery Storage sub-sector library." },
    { id: "specificYield", label: "Specific Yield", type: "number", unit: "kWh/kWp/year", description: "Annual energy yield per installed kWp; enter a project-specific or sourced value." },
    { id: "p50Yield", label: "P50 Annual Yield", type: "number", unit: "MWh/year", description: "Median annual energy production estimate." },
    { id: "p90Yield", label: "P90 Annual Yield", type: "number", unit: "MWh/year", description: "Downside annual energy production estimate." },
    { id: "degradation", label: "Annual Module Degradation", type: "number", unit: "%/year", description: "Expected annual reduction in PV output." },
    { id: "gridLosses", label: "Grid and Electrical Losses", type: "number", unit: "%", description: "Aggregate electrical losses between generation and metering." },
  ],
  "Battery Storage": [
    { id: "powerCapacity", label: "Storage Power Capacity", type: "number", unit: "MW", description: "Maximum charge or discharge power." },
    { id: "energyCapacity", label: "Storage Energy Capacity", type: "number", unit: "MWh", description: "Usable stored energy at commissioning." },
    { id: "duration", label: "Storage Duration", type: "number", unit: "hours", description: "Energy capacity divided by power capacity." },
    { id: "roundTripEfficiency", label: "Round-trip Efficiency", type: "number", unit: "%", description: "AC-to-AC energy efficiency over a full cycle." },
    { id: "annualDegradation", label: "Annual Capacity Degradation", type: "number", unit: "%/year", description: "Annual reduction in usable battery capacity." },
    { id: "coupling", label: "System Coupling", type: "select", options: ["AC-coupled", "DC-coupled"], description: "Electrical configuration for the storage system." },
  ],
  Wind: [
    { id: "turbineRating", label: "Turbine Rated Capacity", type: "number", unit: "MW/turbine", description: "Nameplate capacity of each wind turbine." },
    { id: "turbineCount", label: "Number of Turbines", type: "number", unit: "turbines", description: "Installed wind turbine count." },
    { id: "netYield", label: "Net Specific Yield", type: "number", unit: "MWh/MW/year", description: "Net annual energy generation per installed MW." },
    { id: "wakeLoss", label: "Wake Loss", type: "number", unit: "%", description: "Estimated energy loss from turbine wake effects." },
    { id: "availability", label: "Plant Availability", type: "number", unit: "%", description: "Expected operating availability after planned and unplanned outages." },
  ],
  Hydro: [
    { id: "grossHead", label: "Gross Hydraulic Head", type: "number", unit: "m", description: "Vertical difference between intake and tailwater levels." },
    { id: "designFlow", label: "Design Flow", type: "number", unit: "m³/s", description: "Design water flow through the turbines." },
    { id: "plantFactor", label: "Plant Capacity Factor", type: "number", unit: "%", description: "Expected annual generation relative to nameplate capacity." },
    { id: "environmentalFlow", label: "Environmental Flow", type: "number", unit: "m³/s", description: "Minimum flow reserved for environmental and downstream needs." },
  ],
  Thermal: [
    { id: "technology", label: "Generation Technology", type: "select", options: ["Open-cycle gas turbine", "Combined-cycle gas turbine", "Diesel engine", "Steam turbine"], description: "Select the thermal generation technology." },
    { id: "fuel", label: "Primary Fuel", type: "select", options: ["Natural gas", "Diesel", "LNG", "Heavy fuel oil", "Coal"], description: "Thermal fuel types follow the library's prioritised fuel scope." },
    { id: "heatRate", label: "Net Heat Rate", type: "number", unit: "GJ/MWh", description: "Net fuel energy input per MWh generated." },
    { id: "availability", label: "Plant Availability", type: "number", unit: "%", description: "Expected operating availability after planned and unplanned outages." },
    { id: "auxiliaryLoad", label: "Auxiliary Load", type: "number", unit: "% of gross output", description: "Plant electricity consumed by its own systems." },
  ],
  Biogas: [
    { id: "feedstock", label: "Primary Feedstock", type: "text", description: "Feedstock type and source." },
    { id: "feedstockVolume", label: "Annual Feedstock Requirement", type: "number", unit: "tonnes/year", description: "Annual volume of feedstock consumed." },
    { id: "gasYield", label: "Biogas Yield", type: "number", unit: "Nm³/tonne", description: "Gas production per unit of feedstock." },
    { id: "methaneContent", label: "Methane Content", type: "number", unit: "%", description: "Methane fraction of raw biogas." },
    { id: "availability", label: "Plant Availability", type: "number", unit: "%", description: "Expected operating availability." },
  ],
  Hydrogen: [
    { id: "electrolyserCapacity", label: "Electrolyser Capacity", type: "number", unit: "MW", description: "Installed electrolyser input capacity." },
    { id: "specificConsumption", label: "Specific Energy Consumption", type: "number", unit: "kWh/kg H₂", description: "Electricity required per kilogram of hydrogen produced." },
    { id: "hydrogenOutput", label: "Hydrogen Output", type: "number", unit: "tonnes/year", description: "Annual hydrogen production capacity." },
    { id: "waterRequirement", label: "Water Requirement", type: "number", unit: "m³/tonne H₂", description: "Water input required per tonne of hydrogen." },
    { id: "renewableShare", label: "Renewable Electricity Share", type: "number", unit: "%", description: "Share of electricity supplied from dedicated renewable generation." },
  ],
  Nuclear: [
    { id: "reactorType", label: "Reactor Type", type: "select", options: ["Large reactor", "Small modular reactor"], description: "The v1.0 library defines the structure; detailed benchmark content is a later build wave." },
    { id: "constructionPeriod", label: "Construction Period", type: "number", unit: "years", description: "Expected period from construction start to commercial operation." },
    { id: "decommissioningFund", label: "Decommissioning Fund Basis", type: "select", options: ["Fixed annual contribution", "Per MWh generated", "% of revenue", "Project-specific"], description: "Dedicated funding basis for end-of-life decommissioning." },
  ],
};

const DOMAIN_FIELDS: Record<IndustryLibraryDomain, IndustryLibraryField[]> = {
  project: [],
  macro: [
    { id: "jurisdiction", label: "Library Jurisdiction", type: "select", options: ["Nigeria"], description: "Nigeria is the only fully governed jurisdiction in the v1.0 library." },
    { id: "priceBasis", label: "Library Cost Price Basis", type: "select", options: ["Real (constant prices)", "Nominal"], description: "Real prices use the library base year; nominal contractual or statutory values must not be escalated twice." },
    { id: "costBaseYear", label: "Cost Base Year", type: "number", unit: "year", description: "The library default is 2026; item-specific source metadata still applies." },
  ],
  revenue: [
    { id: "offtakeType", label: "Offtake / Revenue Mechanism", type: "select", options: ["Power Purchase Agreement (PPA)", "Merchant energy", "Capacity payment", "Renewable certificates", "Storage services", "Captive / behind-the-meter", "Hybrid"], description: "Select only the revenue mechanisms applicable to the selected project configuration." },
    { id: "indexationBasis", label: "Tariff Indexation Basis", type: "select", options: ["Fixed", "Local CPI", "US CPI", "FX-linked", "Contract-specific"], description: "Tariff indexation must follow the applicable offtake contract." },
    { id: "billingTiming", label: "Billing Frequency", type: "select", options: ["Monthly", "Quarterly", "Annually", "Contract-specific"], description: "Billing and settlement frequency for the revenue stream." },
    { id: "offtakerPaymentDays", label: "Offtaker Payment Terms", type: "number", unit: "days", description: "Contractual customer collection period; maps to receivables." },
  ],
  opex: [
    { id: "opexDriver", label: "Primary OPEX Driver", type: "select", options: ["Fixed annual", "Per installed MW", "Per MWh generated", "% of CAPEX", "% of revenue", "Per unit of throughput"], description: "Choose the cost driver used by the relevant operating cost items." },
    { id: "maintenanceBasis", label: "Major Maintenance Basis", type: "select", options: ["Scheduled overhaul", "Annual reserve", "Per operating hour", "Per MWh", "Project-specific"], description: "Record major maintenance and replacement events separately from routine OPEX." },
    { id: "insuranceBasis", label: "Insurance Rate Basis", type: "select", options: ["% of insured asset value", "Fixed annual premium", "Per unit of capacity"], description: "Define the basis and insured value for project insurance." },
  ],
  capex: [
    { id: "equipmentCostDriver", label: "Equipment Cost Driver", type: "select", options: ["USD/Wp", "USD/kW", "USD/MW", "USD/MWh", "Lump sum", "Project-specific"], description: "Cost driver is recorded separately from the asset specification." },
    { id: "epcCost", label: "EPC / Installed Cost", type: "number", unit: "reporting currency; selected cost driver", description: "Project-specific cost; attach a source and currency in the project record." },
    { id: "gridConnectionCost", label: "Grid Connection Cost", type: "number", unit: "reporting currency", description: "Include connection and interconnection scope where applicable." },
    { id: "localCostShare", label: "Local-Currency Cost Share", type: "number", unit: "%", description: "Share of project costs denominated in local currency." },
    { id: "capexPhasing", label: "Construction Phasing Template", type: "select", options: ["S-curve", "Linear", "Milestone-based", "Project-specific"], description: "Select the CAPEX drawdown profile used to phase project costs." },
  ],
  financing: [
    { id: "financingRoute", label: "Financing Route", type: "select", options: ["Project finance", "Corporate finance", "Public / concessional", "Hybrid"], description: "Project-finance route determines relevant facilities, covenants and reserves." },
    { id: "reserveAccounts", label: "Reserve Accounts", type: "select", options: ["Debt service reserve", "Major maintenance reserve", "Both", "None / project-specific"], description: "Select reserve facilities required by the financing structure." },
  ],
  tax: [
    { id: "taxIncentive", label: "Sector Tax Incentive", type: "select", options: ["None identified", "Applicable - details required"], description: "Tax rules are jurisdiction-level; confirm incentive eligibility and source before use." },
    { id: "taxIncentiveDetails", label: "Tax Incentive / Duty Treatment", type: "text", description: "Record the project-specific legal basis, expiry and applicable assets." },
  ],
  "working-capital": [
    { id: "sparesInventory", label: "Critical Spares Inventory", type: "number", unit: "reporting currency", description: "Project-specific reserve for critical operating spares." },
    { id: "vatSettlementDays", label: "VAT Settlement / Recovery Period", type: "number", unit: "days", description: "Expected timing of VAT receivable recovery or payable settlement." },
    { id: "restrictedCash", label: "Restricted Cash Reserve", type: "number", unit: "reporting currency", description: "Cash held in restricted reserve accounts, including lender-required reserves." },
  ],
  depreciation: [
    { id: "assetUsefulLife", label: "Primary Plant Useful Life", type: "number", unit: "years", description: "Asset-specific economic life; component lives should be recorded separately where they differ." },
    { id: "depreciationStart", label: "Depreciation Start Event", type: "select", options: ["Commercial operation date", "Asset available for use", "Project-specific policy"], description: "Set the commencement rule for depreciation of capitalised assets." },
    { id: "decommissioningTreatment", label: "Decommissioning Provision Treatment", type: "select", options: ["Capitalised asset retirement obligation", "Operating provision", "Project-specific"], description: "Confirm the accounting and tax treatment for end-of-life obligations." },
  ],
  dividend: [
    { id: "distributionBasis", label: "Distribution Basis", type: "select", options: ["Distributable profit", "Free cash flow", "Cash available after debt service", "Project-specific"], description: "Select the basis for shareholder distributions under the financing and operating plan." },
    { id: "reserveCondition", label: "Distribution Reserve Condition", type: "select", options: ["After debt service reserve is funded", "After all required reserves are funded", "No reserve condition", "Financing-document specific"], description: "Power project distributions may be restricted until lender covenants and reserve accounts are satisfied." },
    { id: "distributionFrequency", label: "Distribution Frequency", type: "select", options: ["Quarterly", "Semi-annually", "Annually", "Financing-document specific"], description: "Expected distribution schedule, subject to cash availability and financing covenants." },
  ],
  valuation: [
    { id: "yieldScenario", label: "Yield / Production Case", type: "select", options: ["P50", "P90", "Project-specific"], description: "Select the technical production case used for valuation and downside analysis." },
    { id: "merchantExposure", label: "Merchant Exposure", type: "number", unit: "% of generation", description: "Share of production exposed to merchant prices rather than contracted revenue." },
  ],
};

const REGISTERED_PROJECT_FIELDS: Record<string, IndustryLibraryField[]> = {
  "Oil & Gas": [
    { id: "projectPhase", label: "Project Phase", type: "select", options: ["Upstream", "Midstream", "Downstream", "Integrated", "LNG", "Petrochemicals"], description: "Select the applicable value-chain phase." },
    { id: "designThroughput", label: "Design Throughput", type: "number", unit: "sector-specific capacity unit", description: "Enter the design throughput using the selected capacity unit." },
    { id: "feedstockOrProduct", label: "Primary Feedstock / Product", type: "text", description: "Identify the principal hydrocarbon stream." },
  ],
  Infrastructure: [
    { id: "assetClass", label: "Infrastructure Asset Class", type: "select", options: ["Roads and bridges", "Rail", "Ports", "Airports", "Water", "Wastewater", "Telecom"], description: "Select the financed infrastructure asset." },
    { id: "assetCapacity", label: "Design Capacity", type: "number", unit: "sector-specific capacity unit", description: "Enter the asset's design capacity in the selected unit." },
    { id: "concessionTerm", label: "Concession / Operating Term", type: "number", unit: "years", description: "Contracted operating or concession period." },
  ],
  "Real Estate": [
    { id: "propertyType", label: "Property Type", type: "select", options: INDUSTRY_SUB_TYPES["Real Estate"], description: "Select the primary property segment." },
    { id: "grossBuildingArea", label: "Gross Building Area", type: "number", unit: "m²", description: "Total gross floor area." },
    { id: "lettableArea", label: "Lettable Area", type: "number", unit: "m²", description: "Area available for lease or sale." },
    { id: "unitCount", label: "Saleable / Lettable Units", type: "number", unit: "units", description: "Number of discrete units, rooms or spaces." },
  ],
  Manufacturing: [
    { id: "productionProcess", label: "Production Process", type: "text", description: "Name the principal production line or process." },
    { id: "annualNameplateOutput", label: "Annual Nameplate Output", type: "number", unit: "selected capacity unit/year", description: "Maximum annual output at rated capacity." },
    { id: "yieldLoss", label: "Process Yield Loss", type: "number", unit: "% of input", description: "Production input lost during conversion or processing." },
    { id: "rawMaterial", label: "Primary Raw Material", type: "text", description: "Identify the principal feedstock or raw material." },
  ],
  Healthcare: [
    { id: "clinicalFacilityType", label: "Facility Type", type: "select", options: INDUSTRY_SUB_TYPES.Healthcare.filter((value) => value !== "Other"), description: "Select the principal health facility or service." },
    { id: "clinicalCapacity", label: "Clinical Capacity", type: "number", unit: "beds / procedures per day / patients per day", description: "Enter the unit appropriate to the facility and state that unit in the project record." },
    { id: "serviceLines", label: "Primary Service Lines", type: "text", description: "List the project's primary clinical or diagnostic services." },
  ],
  Technology: [
    { id: "technologyBusinessModel", label: "Technology Business Model", type: "select", options: INDUSTRY_SUB_TYPES.Technology.filter((value) => value !== "Other"), description: "Select the relevant technology service or asset type." },
    { id: "activeUsers", label: "Addressable Active Users / Subscribers", type: "number", unit: "users or subscribers", description: "Enter the relevant addressable customer base." },
    { id: "dataThroughput", label: "Data / Compute Throughput", type: "number", unit: "GB/month, API calls/month or racks", description: "Use the unit appropriate to the selected technology business." },
  ],
  Agriculture: [
    { id: "productionActivity", label: "Production Activity", type: "select", options: INDUSTRY_SUB_TYPES.Agriculture.filter((value) => value !== "Other"), description: "Select the primary agricultural activity." },
    { id: "cultivatedArea", label: "Cultivated / Production Area", type: "number", unit: "hectares", description: "Area under production where applicable." },
    { id: "yieldPerHectare", label: "Production Yield", type: "number", unit: "tonnes/hectare/season", description: "Expected production per hectare per growing season." },
    { id: "productionCycles", label: "Annual Production Cycles", type: "number", unit: "cycles/year", description: "Number of production cycles in a model year." },
  ],
};

const SECTOR_CODES: Record<string, string> = {
  "Energy & Power": "POW",
  "Oil & Gas": "OGS",
  Infrastructure: "INF",
  "Real Estate": "REL",
  Manufacturing: "MFG",
  Healthcare: "HLT",
  Agriculture: "AGR",
  "Mining and Natural Resources": "MIN",
  Technology: "TEC",
  Other: "OTH",
};

const SUBSECTOR_CODES: Record<string, string> = {
  Solar: "SOL",
  Wind: "WND",
  Hydro: "HYD",
  Thermal: "THM",
  Nuclear: "NUC",
  Biogas: "BIO",
  Hydrogen: "HGN",
  "Battery Storage": "BES",
};

export function getIndustryCapacityUnits(industry: string, subType: string): string[] {
  if (industry === "Energy & Power") {
    const normalizedSubType = subType === "Hydropower" ? "Hydro" : subType;
    if (normalizedSubType === "Solar" || normalizedSubType === "Wind" || normalizedSubType === "Hydro" || normalizedSubType === "Thermal") {
      return ["MW", "MWac", "MWdc", "MWh", "GWh"];
    }
    if (normalizedSubType === "Battery Storage") return ["MW", "MWh", "MW / MWh"];
    if (normalizedSubType === "Hydrogen") return ["tonnes/year", "kg/day", "MW"];
    if (normalizedSubType === "Biogas") return ["MW", "MWh", "Nm³/day", "tonnes/year"];
    return CAPACITY_UNIT_MAPPINGS[industry];
  }
  return CAPACITY_UNIT_MAPPINGS[industry] ?? CAPACITY_UNIT_MAPPINGS.Other;
}

export function getIndustryRevenueUnits(industry: string, subType: string): string[] {
  if (industry === "Energy & Power") {
    const normalizedSubType = subType === "Hydropower" ? "Hydro" : subType;
    if (normalizedSubType === "Hydrogen") return ["kg H₂", "tonnes H₂", "MWh"];
    if (normalizedSubType === "Biogas") return ["MWh", "Nm³", "tonnes"];
    if (normalizedSubType === "Battery Storage") return ["MWh discharged", "MW available", "MW"];
    return ["MWh", "kWh", "MW", "capacity payment"];
  }
  if (industry === "Mining and Natural Resources") {
    return ["tonnes", "tonnes of ore", "tonnes of concentrate", "ounces", "lb"];
  }
  if (industry === "Healthcare" && subType === "Hospital") return ["patient-days", "admissions", "procedures", "consultations"];
  if (industry === "Agriculture") return ["tonnes", "kg", "hectares", "heads", "litres"];
  if (industry === "Infrastructure") return ["vehicle-km", "passengers", "tonnes", "m³", "km"];
  return CAPACITY_UNIT_MAPPINGS[industry] ?? CAPACITY_UNIT_MAPPINGS.Other;
}

export function getIndustryRevenueModelTypes(industry: string, subType: string): string[] {
  if (industry === "Energy & Power") {
    if (subType === "Battery Storage") return ["Energy Throughput × Price", "Capacity × Availability Tariff", "Ancillary Services Contract", "Fixed Contract"];
    if (subType === "Hydrogen") return ["Volume × Price", "Hydrogen Offtake Contract", "Fixed Contract"];
    if (subType === "Biogas") return ["Volume × Price", "Generation × Tariff", "Biomethane Offtake Contract", "Fixed Contract"];
    return ["Generation × Tariff", "Power Purchase Agreement (PPA)", "Merchant Energy", "Capacity Payment", "Fixed Contract"];
  }
  if (industry === "Mining and Natural Resources") return ["Commodity Volume × Price", "Offtake Contract", "Treatment / Throughput Fee", "By-product Credits"];
  if (industry === "Real Estate") return ["Rental / Lease", "Unit Sales", "Property Services Contract", "% of Market"];
  if (industry === "Healthcare") return ["Procedure × Tariff", "Patient-Day × Rate", "Consultation × Fee", "Fixed Contract"];
  if (industry === "Agriculture") return ["Harvest Volume × Price", "Livestock Sales", "Processing / Offtake Contract", "By-product Sales"];
  if (industry === "Infrastructure") return ["Usage × Tariff", "Availability Payment", "Concession / Toll Revenue", "Fixed Contract"];
  if (industry === "Technology") return ["Subscription/SaaS", "Users × ARPU", "Usage-Based", "Fixed Contract"];
  if (industry === "Oil & Gas") return ["Hydrocarbon Volume × Price", "Throughput / Tariff", "Processing Fee", "Offtake Contract"];
  if (industry === "Manufacturing") return ["Product Volume × Price", "Capacity × Tariff", "Fixed Supply Contract", "% of Market"];
  return REVENUE_MODEL_TYPES;
}

function getRawIndustryLibraryFields(
  domain: IndustryLibraryDomain,
  industry: string,
  subType: string,
): IndustryLibraryField[] {
  const normalizedSubType = subType === "Hydropower" ? "Hydro" : subType;
  const globalFields = DOMAIN_FIELDS[domain];
  if (domain === "project" && industry === "Energy & Power" && POWER_PROJECT_FIELDS[normalizedSubType]) {
    return [...POWER_SHARED_PROJECT_FIELDS, ...POWER_PROJECT_FIELDS[normalizedSubType]];
  }
  if (domain === "project" && industry === "Mining and Natural Resources") {
    return [
      { id: "mineStage", label: "Mining Lifecycle Stage", type: "select", options: ["Exploration", "Development", "Mining", "Processing", "Mineral Beneficiation"], description: "Select the project stage from the registered Mining and Natural Resources sector." },
      { id: "oreType", label: "Ore / Mineral", type: "text", description: "Record the target mineral and ore specification." },
      { id: "annualOreThroughput", label: "Annual Ore Throughput", type: "number", unit: "tonnes/year", description: "Design or forecast ore processed per year." },
      { id: "recoveryRate", label: "Metallurgical Recovery", type: "number", unit: "%", description: "Expected recoverable mineral as a share of contained grade." },
    ];
  }
  if (domain === "project" && REGISTERED_PROJECT_FIELDS[industry]) {
    return REGISTERED_PROJECT_FIELDS[industry];
  }
  if (industry === "Energy & Power" && POWER_SUBSECTORS.includes(normalizedSubType)) {
    if (domain === "revenue") {
      const mechanisms = normalizedSubType === "Battery Storage"
        ? ["Energy arbitrage", "Ancillary services", "Capacity payment", "Availability / tolling agreement"]
        : normalizedSubType === "Hydrogen"
          ? ["Hydrogen sales", "Ammonia / derivatives sales", "Oxygen by-product", "Fixed contract"]
          : normalizedSubType === "Biogas"
            ? ["Electricity sales", "Biomethane sales", "Heat sales", "Renewable certificates"]
            : ["Power Purchase Agreement (PPA)", "Merchant energy", "Capacity payment", "Renewable certificates", "Captive / behind-the-meter", "Hybrid"];
      return [
        { id: "offtakeType", label: "Offtake / Revenue Mechanism", type: "select", options: mechanisms, description: `Revenue mechanisms available to the ${normalizedSubType} project configuration.` },
        ...DOMAIN_FIELDS.revenue.filter((field) => field.id !== "offtakeType"),
      ];
    }
    if (domain === "capex") {
      const costDrivers = normalizedSubType === "Solar"
        ? ["USD/Wp", "USD/kW", "Lump sum", "Project-specific"]
        : normalizedSubType === "Battery Storage"
          ? ["USD/kW", "USD/kWh", "USD/MWh", "Lump sum", "Project-specific"]
          : normalizedSubType === "Hydrogen"
            ? ["USD/kW electrolyser", "USD/kg/day output", "Lump sum", "Project-specific"]
            : ["USD/MW", "USD/MWh", "Lump sum", "Project-specific"];
      return [
        { id: "equipmentCostDriver", label: "Equipment Cost Driver", type: "select", options: costDrivers, description: `${normalizedSubType} asset cost basis, recorded separately from asset specifications.` },
        { id: "epcCost", label: "EPC / Installed Cost", type: "number", unit: "reporting currency; selected cost driver", description: "Project-specific cost; attach a source and currency in the project record." },
        { id: "gridConnectionCost", label: "Grid Connection Cost", type: "number", unit: "reporting currency", description: "Include connection and interconnection scope where applicable." },
        { id: "localCostShare", label: "Local-Currency Cost Share", type: "number", unit: "%", description: "Share of project costs denominated in local currency." },
        { id: "capexPhasing", label: "Construction Phasing Template", type: "select", options: ["S-curve", "Linear", "Milestone-based", "Project-specific"], description: "Select the CAPEX drawdown profile used to phase project costs." },
      ];
    }
    if (domain === "opex" && normalizedSubType === "Solar") {
      return [
        { id: "routineMaintenanceDriver", label: "Routine O&M Driver", type: "select", options: ["Per kWp", "Per MWh generated", "% of CAPEX", "Fixed annual"], description: "Select the cost basis for routine solar operations and maintenance." },
        ...globalFields,
      ];
    }
    if (domain === "opex") {
      const driverOptions = normalizedSubType === "Thermal"
        ? ["Fuel per MWh generated", "Per operating hour", "Per installed MW", "Fixed annual"]
        : normalizedSubType === "Battery Storage"
          ? ["Per MW installed", "Per MWh throughput", "% of CAPEX", "Fixed annual"]
          : normalizedSubType === "Hydrogen"
            ? ["Per kg H₂ produced", "Per MWh consumed", "Per MW electrolyser", "Fixed annual"]
            : ["Per installed MW", "Per MWh generated", "% of CAPEX", "Fixed annual"];
      return [
        { id: "opexDriver", label: "Primary OPEX Driver", type: "select", options: driverOptions, description: `Choose the main lifecycle cost basis for ${normalizedSubType}.` },
        ...DOMAIN_FIELDS.opex.filter((field) => field.id !== "opexDriver"),
      ];
    }
    return globalFields;
  }
  if (industry === "Energy & Power") return globalFields;
  if (industry === "Mining and Natural Resources") {
    if (domain === "opex") {
      return [
        { id: "stripRatio", label: "Strip Ratio", type: "number", unit: "waste tonnes / ore tonne", description: "Waste material moved per tonne of ore mined." },
        { id: "energyIntensity", label: "Energy Intensity", type: "number", unit: "kWh/tonne processed", description: "Electricity consumption per unit of processed material." },
        ...DOMAIN_FIELDS.opex,
      ];
    }
    if (domain === "capex") {
      return [
        { id: "equipmentCostDriver", label: "Mining CAPEX Cost Driver", type: "select", options: ["USD/tpa capacity", "USD/t of annual throughput", "Lump sum", "Project-specific"], description: "Select a cost driver appropriate to the mine and processing configuration." },
        ...DOMAIN_FIELDS.capex.filter((field) => field.id !== "equipmentCostDriver"),
      ];
    }
    if (domain === "revenue") {
      return [
        { id: "commodity", label: "Primary Commodity", type: "text", description: "Identify the mineral product and sale specification." },
        { id: "salesProduct", label: "Sales Product Stage", type: "select", options: ["Run-of-mine ore", "Concentrate", "Refined / beneficiated product"], description: "Select the commercial product sold by the project." },
        { id: "payableMetal", label: "Payable Metal / Recovery", type: "number", unit: "%", description: "Payability or saleable recovery under the offtake agreement." },
        { id: "customerPaymentDays", label: "Offtaker Payment Terms", type: "number", unit: "days", description: "Contractual collection period; maps to receivables." },
      ];
    }
    if (domain === "working-capital") {
      return [
        { id: "stockpileCoverage", label: "Ore / Product Stockpile Coverage", type: "number", unit: "days", description: "Target days of ore, concentrate or product stockpile." },
        { id: "criticalSpares", label: "Critical Spares Reserve", type: "number", unit: "reporting currency", description: "Project-specific reserve for critical mine and process-plant spares." },
        { id: "vatSettlementDays", label: "VAT Settlement / Recovery Period", type: "number", unit: "days", description: "Expected timing of VAT receivable recovery or payable settlement." },
      ];
    }
    if (domain === "tax") {
      return [
        { id: "royaltyBasis", label: "Mineral Royalty Basis", type: "select", options: ["% of gross revenue", "Per unit produced", "Project-specific"], description: "Confirm the applicable mineral royalty basis and jurisdictional rule." },
        { id: "royaltyRateSource", label: "Royalty Rule / Legal Source", type: "text", description: "Record the jurisdictional legal basis and effective date for the royalty." },
        ...DOMAIN_FIELDS.tax,
      ];
    }
    if (domain === "valuation") {
      return [
        { id: "commodityCase", label: "Commodity Price Case", type: "select", options: ["Base", "Upside", "Downside", "Project-specific"], description: "Select the commodity price case used for project valuation." },
        { id: "grade", label: "Head Grade", type: "number", unit: "g/t or %", description: "Enter grade using the unit appropriate to the commodity and test work." },
        { id: "recovery", label: "Metallurgical Recovery", type: "number", unit: "%", description: "Share of contained mineral recovered into the saleable product." },
      ];
    }
    return DOMAIN_FIELDS[domain];
  }

  if (domain === "revenue") {
    return [
      { id: "revenueMechanism", label: "Revenue Mechanism", type: "select", options: ["Volume × price", "Service / throughput fee", "Rental / lease", "Subscription", "Fixed contract", "Project-specific"], description: `Select the revenue mechanism appropriate to ${industry} / ${subType || "the selected project"}.` },
      { id: "salesContractTerm", label: "Sales Contract Term", type: "number", unit: "years", description: "Contract term for the primary revenue stream, where applicable." },
      { id: "customerPaymentDays", label: "Customer Payment Terms", type: "number", unit: "days", description: "Contractual collection period; maps to receivables." },
    ];
  }
  if (domain === "opex") {
    return DOMAIN_FIELDS.opex;
  }
  if (domain === "capex") {
    const capacityCostOptions = industry === "Real Estate"
      ? ["currency/m²", "currency/unit", "Lump sum", "Project-specific"]
      : industry === "Healthcare"
        ? ["currency/bed", "currency/procedure capacity", "Lump sum", "Project-specific"]
        : industry === "Infrastructure"
          ? ["currency/km", "currency/unit of capacity", "Lump sum", "Project-specific"]
          : industry === "Agriculture"
            ? ["currency/hectare", "currency/tonne/year", "Lump sum", "Project-specific"]
            : industry === "Technology"
              ? ["currency/user", "currency/rack", "currency/MW", "Lump sum", "Project-specific"]
              : industry === "Manufacturing"
                ? ["currency/unit of annual capacity", "currency/tonne/year", "Lump sum", "Project-specific"]
                : ["currency/unit of capacity", "Lump sum", "Project-specific"];
    return [
      { id: "equipmentCostDriver", label: "CAPEX Cost Driver", type: "select", options: capacityCostOptions, description: "Select the cost driver appropriate to the selected sector and sub-sector." },
      ...DOMAIN_FIELDS.capex.filter((field) => field.id !== "equipmentCostDriver" && field.id !== "gridConnectionCost"),
    ];
  }
  if (domain === "working-capital") {
    return [
      { id: "inventoryBasis", label: industry === "Real Estate" || industry === "Technology" ? "Prepayments / Operating Deposits" : "Inventory / Operating Supplies Basis", type: "select", options: ["Days of cost", "% of annual cost", "Fixed reserve", "Not applicable"], description: `Select the working-capital basis relevant to ${industry} / ${subType || "the selected project"}.` },
      { id: "inventoryCoverage", label: "Inventory / Prepayment Coverage", type: "number", unit: "days", description: "Coverage period for stock, spares or prepaid operating costs." },
      { id: "vatSettlementDays", label: "VAT Settlement / Recovery Period", type: "number", unit: "days", description: "Expected timing of VAT receivable recovery or payable settlement." },
    ];
  }
  if (domain === "valuation") {
    return [
      { id: "valuationCase", label: "Operating Case", type: "select", options: ["Base", "Upside", "Downside", "Project-specific"], description: "Select the production or operating case used for valuation." },
      { id: "keySensitivity", label: "Primary Value Driver", type: "text", description: `Identify the key ${industry} / ${subType || "project"} sensitivity driver.` },
    ];
  }
  if (domain === "dividend") {
    return DOMAIN_FIELDS.dividend;
  }
  return DOMAIN_FIELDS[domain];
}

export function getIndustryLibraryFields(
  domain: IndustryLibraryDomain,
  industry: string,
  subType: string,
): IndustryLibraryField[] {
  return getRawIndustryLibraryFields(domain, industry, subType).map((field) => {
    const isPercentage = field.unit?.includes("%") ?? false;
    const validation = isPercentage ? { minimum: 0, maximum: 100 } : undefined;
    return {
      ...field,
      libraryItemId: null,
      valueType: field.type === "number" ? "number" : field.type === "select" ? "categorical" : "text",
      benchmarkStatus: "not-approved",
      sourceRequired: field.type === "number",
      projectOverrideAllowed: true,
      ...(validation ? { validation } : {}),
    };
  });
}

export function getIndustryLibrarySchema(industry: string, subType: string) {
  const domains: IndustryLibraryDomain[] = [
    "project", "macro", "revenue", "opex", "capex", "financing", "tax",
    "working-capital", "depreciation", "dividend", "valuation",
  ];
  return Object.fromEntries(
    domains.map((domain) => [
      domain,
      getIndustryLibraryFields(domain, industry, subType),
    ]),
  );
}

export function getIndustryLibraryMetadata(industry: string, subType: string) {
  const normalizedSubType = subType === "Hydropower" ? "Hydro" : subType;
  const subSectorCode = SUBSECTOR_CODES[normalizedSubType];
  const isPowerPilot = industry === "Energy & Power" && POWER_SUBSECTORS.includes(normalizedSubType);
  const waveStatus: Record<string, string> = {
    Solar: "Pilot scope · Wave 1",
    "Battery Storage": "Pilot scope · Wave 1",
    Wind: "Pilot scope · Wave 2",
    Hydro: "Pilot scope · Wave 2",
    Thermal: "Pilot scope · Wave 3",
    Biogas: "Pilot scope · Wave 3",
    Nuclear: "Architecture-ready · Wave 4",
    Hydrogen: "Architecture-ready · Wave 4",
  };
  return {
    level: subSectorCode ? `Global → Energy and Power (POW) → ${normalizedSubType} (${subSectorCode})` : `Global → ${industry} (${SECTOR_CODES[industry] ?? "OTH"}) → Sub-sector`,
    itemCode: subSectorCode ?? SECTOR_CODES[industry] ?? "OTH",
    status: isPowerPilot ? waveStatus[normalizedSubType] : "Sector registered; detailed library build planned",
    baseYear: 2026,
    isPowerPilot,
  };
}
