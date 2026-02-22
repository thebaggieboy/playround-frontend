import codecs

path = r'c:\Users\newsh\OneDrive\Documents\Jobs\PLYGROUND\frontend\plyground_app\app\dashboard\models\input\advanced\page.tsx'
with codecs.open(path, 'r', 'utf-8') as f:
    text = f.read()

# Add missing OPEX
text = text.replace('''        power_electricity_cost_annual: formData.powerElectricityCostAnnual ?? formData.powerElectricityCost,''',
'''        raw_material_cost_per_unit: formData.rawMaterialCostPerUnit || null,
        raw_material_price_escalation: formData.rawMaterialPriceEscalation || null,
        variable_cost_pct_revenue: formData.variableCostAsPctOfRevenue || formData.variableCostPctRevenue || null,
        fuel_gas_cost_per_mmbtu: formData.fuelGasCost || null,
        power_electricity_cost_annual: formData.powerElectricityCostAnnual ?? formData.powerElectricityCost,''')

text = text.replace('''        regular_maintenance_pct_revenue: formData.regularMaintenancePctRevenue ?? formData.regularMaintenance,''',
'''        property_management_pct: formData.propertyManagement || null,
        regular_maintenance_pct_revenue: formData.regularMaintenancePctRevenue ?? formData.regularMaintenance,''')

text = text.replace('''        insurance_annual: formData.insuranceAnnual,''',
'''        insurance_annual: formData.insuranceAnnual,
        tam_cost: formData.turnAroundMaintenanceTamCost || formData.tamCost || null,
        tam_frequency_years: formData.tamFrequency || null,''')

# Add missing CAPEX
text = text.replace('''      capital_expenditure: {
        land_cost: formData.landCost,''',
'''      capital_expenditure: {
        land_cost: formData.landCost || 0,
        carpark_cost: formData.multiStoreyCarParkCost || null,
        amenities_cost: formData.amenitiesCost || null,
        apartment_construction_cost: formData.apartmentConstruction || null,
        hotel_commercial_cost: formData.hotelCommercialConstruction || null,''')

# Add missing Project Info
text = text.replace('''        commissioning_availability: formData.commissioningAvailability,
      },''',
'''        commissioning_availability: formData.commissioningAvailability,
        factory_capacity_multiplier: formData.factoryCapacityMultiplier || null,
        number_of_phases: formData.numberOfPhases || 1,
        phase_1_capacity: formData.phaseICapacity || null,
        phase_2_capacity: formData.phaseIiCapacity || null,
        days_in_year: formData.daysInYear || 365,
        hours_in_day: formData.hoursInDay || 24,
      },''')

# Add missing revenue products fields
text = text.replace('''        price_escalation_rate: product.priceEscalationRate,
      })),''',
'''        price_escalation_rate: product.priceEscalationRate,
        number_of_units: formData.numberOfUnits || null,
        gba_gross_building_area: formData.gbaGrossBuildingArea || null,
        lettable_area: formData.lettableArea || null,
        sale_price_per_unit: formData.salePricePerUnit || null,
        receivables_days_dso: formData.receivablesDaysDso || null,
        revenue_rampup_months: formData.revenueRampUpPeriod || null,
        seasonal_adjustment_factor: formData.seasonalAdjustmentFactor || 1.0,
        sales_absorption_period_months: formData.salesAbsorptionPeriod || null,
        presales_offplan_percentage: formData.preSalesOffPlanPct || formData.offPlanSalesPreSalesPct || null,
        market_share_target: formData.marketShareTarget || null,
      })),''')

# Add missing Debt Financing
text = text.replace('''        debt_percentage: formData.debtPercentage,''',
'''        debt_percentage: formData.debtPercentage,
        offplan_presales_percentage: formData.preSalesOffPlanPct || formData.offPlanSalesPreSalesPct || null,''')

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(text)
