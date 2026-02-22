import codecs

path = r'c:\Users\newsh\OneDrive\Documents\Jobs\PLYGROUND\frontend\plyground_app\app\dashboard\models\input\advanced\page.tsx'
with codecs.open(path, 'r', 'utf-8') as f:
    text = f.read()

# Add index signature to FormData
text = text.replace('interface FormData {\n  // Project Information', 'interface FormData {\n  [key: string]: any;\n  // Project Information')

# Let's fix DepreciationForm bindings manually
text = text.replace(
'''<InputField label="Value" type="number" prefix="$" defaultValue="109626400" size="sm" \n              value={formData?.value}\n              onChange={(val) => updateFormData('value', Number(val))}\n            />''',
'''<InputField label="Value" type="number" prefix="$" defaultValue="109626400" size="sm" \n              value={formData?.constructionBuildingCost}\n              onChange={(val) => updateFormData('constructionBuildingCost', Number(val))}\n            />'''
)

text = text.replace(
'''<InputField label="Useful Life" type="number" suffix="years" defaultValue="40" size="sm" \n              value={formData?.usefulLife}\n              onChange={(val) => updateFormData('usefulLife', Number(val))}\n            />''',
'''<InputField label="Useful Life" type="number" suffix="years" defaultValue="40" size="sm" \n              value={formData?.buildingsUsefulLife}\n              onChange={(val) => updateFormData('buildingsUsefulLife', Number(val))}\n            />'''
)

text = text.replace(
'''<InputField label="Residual Value" type="number" suffix="%" defaultValue="10" size="sm" \n              value={formData?.residualValue}\n              onChange={(val) => updateFormData('residualValue', Number(val))}\n            />''',
'''<InputField label="Residual Value" type="number" suffix="%" defaultValue="10" size="sm" \n              value={formData?.buildingsResidualValue}\n              onChange={(val) => updateFormData('buildingsResidualValue', Number(val))}\n            />'''
)

# Equipment
text = text.replace(
'''<InputField label="Value" type="number" prefix="$" defaultValue="20554950" size="sm" \n              value={formData?.value}\n              onChange={(val) => updateFormData('value', Number(val))}\n            />''',
'''<InputField label="Value" type="number" prefix="$" defaultValue="20554950" size="sm" \n              value={formData?.equipmentMachineryCost}\n              onChange={(val) => updateFormData('equipmentMachineryCost', Number(val))}\n            />'''
)
text = text.replace(
'''<InputField label="Useful Life" type="number" suffix="years" defaultValue="15" size="sm" \n              value={formData?.usefulLife}\n              onChange={(val) => updateFormData('usefulLife', Number(val))}\n            />''',
'''<InputField label="Useful Life" type="number" suffix="years" defaultValue="15" size="sm" \n              value={formData?.equipmentUsefulLife}\n              onChange={(val) => updateFormData('equipmentUsefulLife', Number(val))}\n            />'''
)
text = text.replace(
'''<InputField label="Residual Value" type="number" suffix="%" defaultValue="5" size="sm" \n              value={formData?.residualValue}\n              onChange={(val) => updateFormData('residualValue', Number(val))}\n            />''',
'''<InputField label="Residual Value" type="number" suffix="%" defaultValue="5" size="sm" \n              value={formData?.equipmentResidualValue}\n              onChange={(val) => updateFormData('equipmentResidualValue', Number(val))}\n            />'''
)

# FFE
text = text.replace(
'''<InputField label="Value" type="number" prefix="$" defaultValue="6851650" size="sm" \n              value={formData?.value}\n              onChange={(val) => updateFormData('value', Number(val))}\n            />''',
'''<InputField label="Value" type="number" prefix="$" defaultValue="6851650" size="sm" \n              value={formData?.ffeCost}\n              onChange={(val) => updateFormData('ffeCost', Number(val))}\n            />'''
)
text = text.replace(
'''<InputField label="Useful Life" type="number" suffix="years" defaultValue="7" size="sm" \n              value={formData?.usefulLife}\n              onChange={(val) => updateFormData('usefulLife', Number(val))}\n            />''',
'''<InputField label="Useful Life" type="number" suffix="years" defaultValue="7" size="sm" \n              value={formData?.ffeUsefulLife}\n              onChange={(val) => updateFormData('ffeUsefulLife', Number(val))}\n            />'''
)
text = text.replace(
'''<InputField label="Residual Value" type="number" suffix="%" defaultValue="0" size="sm" \n              value={formData?.residualValue}\n              onChange={(val) => updateFormData('residualValue', Number(val))}\n            />''',
'''<InputField label="Residual Value" type="number" suffix="%" defaultValue="0" size="sm" \n              value={formData?.ffeResidualValue}\n              onChange={(val) => updateFormData('ffeResidualValue', Number(val))}\n            />'''
)

# Vehicles
text = text.replace(
'''<InputField label="Value" type="number" prefix="$" defaultValue="1000000" size="sm" \n              value={formData?.value}\n              onChange={(val) => updateFormData('value', Number(val))}\n            />''',
'''<InputField label="Value" type="number" prefix="$" defaultValue="1000000" size="sm" \n              value={formData?.vehiclesValue}\n              onChange={(val) => updateFormData('vehiclesValue', Number(val))}\n            />'''
)
text = text.replace(
'''<InputField label="Useful Life" type="number" suffix="years" defaultValue="5" size="sm" \n              value={formData?.usefulLife}\n              onChange={(val) => updateFormData('usefulLife', Number(val))}\n            />''',
'''<InputField label="Useful Life" type="number" suffix="years" defaultValue="5" size="sm" \n              value={formData?.vehiclesUsefulLife}\n              onChange={(val) => updateFormData('vehiclesUsefulLife', Number(val))}\n            />'''
)
text = text.replace(
'''<InputField label="Residual Value" type="number" suffix="%" defaultValue="0" size="sm" \n              value={formData?.residualValue}\n              onChange={(val) => updateFormData('residualValue', Number(val))}\n            />''',
'''<InputField label="Residual Value" type="number" suffix="%" defaultValue="0" size="sm" \n              value={formData?.vehiclesResidualValue}\n              onChange={(val) => updateFormData('vehiclesResidualValue', Number(val))}\n            />'''
)

# Replace hardcoded transformToAPIFormat
text = text.replace('''        model_tolerance: 0.001,
        revenue_opex_escalation_usd: 2.5,
        longterm_target_inflation: 9.0,
        contingency_buffer: 4.0,''',
'''        model_tolerance: formData.modelTolerance ?? 0.001,
        revenue_opex_escalation_usd: formData.revenueOpexEscalationRateUsd ?? 2.5,
        longterm_target_inflation: formData.longTermTargetInflation ?? 9.0,
        contingency_buffer: formData.contingencyBuffer ?? 4.0,''')

text = text.replace('''        power_electricity_cost_annual: formData.powerElectricityCostAnnual,
        water_gas_utilities_annual: 100000,
        utilities_escalation_rate: formData.utilitiesEscalationRate,
        regular_maintenance_pct_revenue: formData.regularMaintenancePctRevenue,
        insurance_annual: formData.insuranceAnnual,
        marketing_sales_pct_revenue: formData.marketingSalesPctRevenue,
        administrative_expenses_annual: 150000,
        rent_facilities_annual: 120000,
        technology_software_annual: 50000,
        professional_fees_annual: 75000,''',
'''        power_electricity_cost_annual: formData.powerElectricityCostAnnual ?? formData.powerElectricityCost,
        water_gas_utilities_annual: formData.waterGasUtilities ?? 100000,
        utilities_escalation_rate: formData.utilitiesEscalationRate,
        regular_maintenance_pct_revenue: formData.regularMaintenancePctRevenue ?? formData.regularMaintenance,
        insurance_annual: formData.insuranceAnnual,
        marketing_sales_pct_revenue: formData.marketingSalesPctRevenue ?? formData.marketingSales,
        administrative_expenses_annual: formData.administrativeExpenses ?? 150000,
        rent_facilities_annual: formData.rentFacilities ?? 120000,
        technology_software_annual: formData.technologySoftware ?? 50000,
        professional_fees_annual: formData.professionalFees ?? 75000,''')

text = text.replace('''        capitalize_interest: true,
        construction_loan_interest_rate: 8.5,
        year_1_drawdown_pct: 30,
        year_2_drawdown_pct: 50,
        year_3_drawdown_pct: 20,
        replacement_capex_pct_revenue: 3.0,
        expansion_capex: 0,''',
'''        capitalize_interest: formData.capitalizeInterestDuringConstruction === 'Yes',
        construction_loan_interest_rate: formData.constructionLoanInterestRate ?? 8.5,
        year_1_drawdown_pct: formData.year1 ?? 30,
        year_2_drawdown_pct: formData.year2 ?? 50,
        year_3_drawdown_pct: formData.year3 ?? 20,
        replacement_capex_pct_revenue: formData.replacementCapex ?? 3.0,
        expansion_capex: formData.expansionCapexIfApplicable ?? 0,''')

text = text.replace('''        interest_rate_type: "Floating",
        base_rate_type: formData.baseRateType,
        base_rate_value: formData.baseRateValue,
        interest_margin_spread: formData.interestMarginSpread,
        loan_tenor_years: formData.loanTenorYears,
        grace_period_months: 36,
        repayment_type: "Amortizing (Equal Installments)",
        dsra_requirement_months: 6,
        dsra_funding_source: "Cash",
        upfront_fees_pct: 2.0,
        commitment_fee_pct: 0.5,
        drawdown_linked_to: "CAPEX Schedule",
        drawdown_frequency: "Quarterly",''',
'''        interest_rate_type: formData.interestRateType ?? "Floating",
        base_rate_type: formData.baseRateType,
        base_rate_value: formData.baseRateValue,
        interest_margin_spread: formData.interestMarginSpread,
        loan_tenor_years: formData.loanTenorYears,
        grace_period_months: formData.gracePeriod ?? 36,
        repayment_type: formData.repaymentType ?? "Amortizing (Equal Installments)",
        dsra_requirement_months: formData.dsraRequirement ?? 6,
        dsra_funding_source: formData.dsraFundingSource ?? "Cash",
        upfront_fees_pct: formData.upfrontFees ?? 2.0,
        commitment_fee_pct: formData.commitmentFee ?? 0.5,
        drawdown_linked_to: formData.drawdownLinkedTo ?? "CAPEX Schedule",
        drawdown_frequency: formData.drawdownFrequency ?? "Quarterly",''')

text = text.replace('''        tax_holiday_years: 0,
        minimum_tax_rate: 0.5,
        vat_sales_tax_rate: formData.vatSalesTaxRate,
        wht_dividends: 10.0,
        wht_interest: 10.0,
        wht_services: 5.0,
        wht_rent: 10.0,
        education_tax_pct: 2.5,
        tax_loss_carryforward_years: 5,
        initial_allowance_pct: 25.0,
        annual_allowance_pct: 20.0,''',
'''        tax_holiday_years: formData.taxHolidayPeriod ?? 0,
        minimum_tax_rate: formData.minimumTaxRate ?? 0.5,
        vat_sales_tax_rate: formData.vatSalesTaxRate,
        wht_dividends: formData.whtOnDividends ?? 10.0,
        wht_interest: formData.whtOnInterest ?? 10.0,
        wht_services: formData.whtOnServices ?? 5.0,
        wht_rent: formData.whtOnRent ?? 10.0,
        education_tax_pct: formData.educationTax ?? 2.5,
        tax_loss_carryforward_years: formData.taxLossCarryforwardPeriod ?? 5,
        initial_allowance_pct: formData.initialAllowance ?? 25.0,
        annual_allowance_pct: formData.annualAllowance ?? 20.0,''')

text = text.replace('''        initial_wc_pct_year1_opex: 30.0,
        receivables_days_dso: formData.receivablesDaysDso,
        inventory_days_dio: formData.inventoryDaysDio,
        payables_days_dpo: formData.payablesDaysDpo,
        wc_pct_revenue: 10.0,
        minimum_cash_balance: 1000000,
        wc_funding_source: "From Equity",
        wc_reserve_account: false,''',
'''        initial_wc_pct_year1_opex: formData.initialWorkingCapital ?? 30.0,
        receivables_days_dso: formData.receivablesDaysDso,
        inventory_days_dio: formData.inventoryDaysDio,
        payables_days_dpo: formData.payablesDaysDpo,
        wc_pct_revenue: formData.workingCapitalAsPctOfRevenue ?? 10.0,
        minimum_cash_balance: formData.minimumCashBalance ?? 1000000,
        wc_funding_source: formData.workingCapitalFunding ?? "From Equity",
        wc_reserve_account: formData.wcReserveAccount === 'Yes',''')

text = text.replace('''        minimum_cash_before_dividend: 5000000,
        minimum_dscr_for_dividend: 1.3,
        minimum_llcr_for_dividend: 1.5,
        preferred_dividend_rate_pct: 0,
        share_buyback_provision: false,
        dividend_wht_pct: 10.0,
        dividend_reinvestment_option: false,''',
'''        minimum_cash_before_dividend: formData.minimumCashBeforeDividend ?? 5000000,
        minimum_dscr_for_dividend: formData.minimumDscrForDividend ?? 1.3,
        minimum_llcr_for_dividend: formData.minimumLlcrForDividend ?? 1.5,
        preferred_dividend_rate_pct: formData.preferredDividendRate ?? 0,
        share_buyback_provision: formData.shareBuybackProvision === 'Yes',
        dividend_wht_pct: formData.dividendWithholdingTax ?? 10.0,
        dividend_reinvestment_option: formData.dividendReinvestmentOption === 'Yes',''')

text = text.replace('''      exit_valuation: {
        exit_year: formData.exitYear,
        exit_multiple_ev_ebitda: formData.exitMultipleEvEbitda,
        terminal_growth_rate_pct: formData.terminalGrowthRatePct,
        discount_rate_npv_pct: formData.discountRateNpvPct,
        target_irr_pct: formData.targetIrrPct,
        pe_multiple: 12.0,
        price_book_multiple: 2.5,
        revenue_multiple: 1.5,
        asset_sale_value: 0,
        transaction_costs_pct: 3.0,
        valuation_method: "DCF (Discounted Cash Flow)",
        target_equity_irr_pct: 20.0,
        target_project_irr_pct: 15.0,
        payback_period_target_years: 7,
        minimum_moic: 2.5,
      }''',
'''      exit_valuation: {
        exit_year: formData.exitYear,
        exit_multiple_ev_ebitda: formData.exitMultipleEvEbitda,
        terminal_growth_rate_pct: formData.terminalGrowthRatePct,
        discount_rate_npv_pct: formData.discountRateNpvPct,
        target_irr_pct: formData.targetIrrPct,
        pe_multiple: formData.pEMultiple ?? 12.0,
        price_book_multiple: formData.priceBookMultiple ?? 2.5,
        revenue_multiple: formData.revenueMultiple ?? 1.5,
        asset_sale_value: formData.assetSaleValueIfApplicable ?? 0,
        transaction_costs_pct: formData.transactionCosts ?? 3.0,
        valuation_method: formData.valuationMethod ?? "DCF (Discounted Cash Flow)",
        target_equity_irr_pct: formData.targetEquityIrr ?? 20.0,
        target_project_irr_pct: formData.targetProjectIrr ?? 15.0,
        payback_period_target_years: formData.paybackPeriodTarget ?? 7,
        minimum_moic: formData.minimumMoic ?? 2.5,
      }''')

text = text.replace('''        {
          asset_category: "buildings",
          depreciation_method: "straight_line",
          asset_value: formData.constructionBuildingCost,
          useful_life_years: 40,
          residual_value_pct: 10,
        },
        {
          asset_category: "equipment",
          depreciation_method: "straight_line",
          asset_value: formData.equipmentMachineryCost,
          useful_life_years: 15,
          residual_value_pct: 5,
        },
        {
          asset_category: "ffe",
          depreciation_method: "straight_line",
          asset_value: formData.ffeCost,
          useful_life_years: 7,
          residual_value_pct: 0,
        },''',
'''        {
          asset_category: "buildings",
          depreciation_method: "straight_line",
          asset_value: formData.constructionBuildingCost,
          useful_life_years: formData.buildingsUsefulLife ?? 40,
          residual_value_pct: formData.buildingsResidualValue ?? 10,
        },
        {
          asset_category: "equipment",
          depreciation_method: "straight_line",
          asset_value: formData.equipmentMachineryCost,
          useful_life_years: formData.equipmentUsefulLife ?? 15,
          residual_value_pct: formData.equipmentResidualValue ?? 5,
        },
        {
          asset_category: "ffe",
          depreciation_method: "straight_line",
          asset_value: formData.ffeCost,
          useful_life_years: formData.ffeUsefulLife ?? 7,
          residual_value_pct: formData.ffeResidualValue ?? 0,
        },
        {
          asset_category: "vehicles_it",
          depreciation_method: "straight_line",
          asset_value: formData.vehiclesValue ?? 1000000,
          useful_life_years: formData.vehiclesUsefulLife ?? 5,
          residual_value_pct: formData.vehiclesResidualValue ?? 0,
        },''')

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(text)
