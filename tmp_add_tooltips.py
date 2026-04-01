import re
import sys

def main():
    filepath = r"C:\Users\newsh\OneDrive\Documents\Jobs\PLYGROUND\frontend\plyground_app\app\dashboard\models\input\advanced\page.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Dictionary mapping labels to helpful tooltips
    tooltips_map = {
        "Project Name": "The official name of the development or investment project.",
        "Project Location": "Primary geographical location or market for the project.",
        "Industry/Sector": "The primary economic grouping this project falls under.",
        "Project Type": "Classification of the investment (e.g., Greenfield = new construction, Brownfield = upgrading existing).",
        "Project Commencement Date": "The official date the project planning and administration begins.",
        "Construction Start Date": "The date when physical construction or capital expenditure starts.",
        "Operations Start Date": "The date when the project begins commercial operations and generates revenue.",
        
        "Total Plant/Factory Capacity": "The maximum theoretical production or output capability.",
        "Capacity Unit": "The metric of measurement for the project's output.",
        "Phase I Capacity": "Initial operational capacity for the first development stage.",
        "Phase II Capacity": "Additional expanded capacity for the second development stage.",
        
        "Days in Year": "Standard days mapping for financial calculations (usually 360 or 365).",
        "Hours in Year": "Total hours operating in a standard calendar year.",
        "Hours in Day": "Number of active hours expected in a standard operating day.",
        
        "Reporting Currency": "The primary fiat currency used to report financials.",
        "Base Year": "The present year or 'Year 0' for the model timeline.",
        "Periodicity": "The frequency of the financial models outputs (e.g., Annually, Quarterly).",
        
        "Local Inflation Rate": "Average projected inflation rate for the domestic market.",
        "Foreign Inflation Rate": "Average projected inflation rate for the foreign exchange market.",
        "Long-Term Target Inflation": "The ultimate target baseline inflation over the long period.",
        "Model Tolerance": "Acceptable mathematical error margin for balancing formulas.",
        "Revenue & Opex Escalation (USD)": "Projected annual growth rate applied to revenues and operational expenses.",
        "Cost Contingency Buffer": "Safety margin percentage added to baseline CAPEX or OPEX to cover unexpected costs.",
        
        "Discount Rate (WACC)": "Weighted Average Cost of Capital, used to discount future cash flows to present value.",
        "Risk-Free Rate": "Theoretical return on an investment with zero risk (e.g., US Treasury bonds).",
        "Benchmark Rate Type": "The foundational interest rate utilized (e.g., SOFR, EURIBOR).",
        "Benchmark Rate Value": "The numeric percentage value of the chosen benchmark rate.",
        "Terminal Growth Rate": "The continuous steady growth rate assumed after the explicit forecast period.",
        
        "Total Initial Headcount": "The expected number of employees starting at operations.",
        "Average Annual Salary": "The blended average yearly wage across all employees.",
        "Salary Escalation Rate": "Projected annual percentage increase in employee wages.",
        "Benefits & Payroll Tax": "Percentage of base salary covering healthcare, pensions, and local payroll taxes.",
        "Power & Electricity Cost": "Estimated annual electricity and structural energy expenses.",
        "Water, Gas & Utilities": "Estimated baseline water and gas utilization costs.",
        "Utilities Escalation Rate": "Projected annual percentage growth in global utility costs.",
        "Regular Maintenance": "Percentage of gross revenue set aside for ongoing operational maintenance.",
        "Turn Around Maintenance (TAM) Cost": "Cost of a major plant shutdown and overhaul, occurring every few years.",
        "TAM Frequency": "Number of years between major Turn Around Maintenance events.",
        "Insurance (Annual)": "Yearly premiums paid for comprehensive property and operational insurance.",
        "Marketing & Sales": "Percentage of gross revenue assigned to customer acquisition and marketing.",
        "Administrative Expenses": "Fixed annual overhead for management and administrative support.",
        "Rent & Facilities": "Expected yearly cost for leasing land, equipment, or facility space.",
        "Technology & Software": "Budgeted yearly spend on IT infrastructure and software licensing.",
        "Professional Fees": "Estimated aggregate cost for recurring legal, accounting, and consulting retainers.",
        
        "Land Cost / Acquisition": "Total upfront cost to purchase or permanently lease the core real estate.",
        "Construction & Building Building": "Budget for all primary structural construction and civil works.",
        "Equipment & Machinery": "Total cost of acquiring heavy specialized machinery for operations.",
        "Furniture, Fixtures & Equipment (FF&E)": "Cost of all non-structural, moveable operational property.",
        "Contingency": "Percentage pool of additional funding to handle unexpected capital cost overruns.",
        "Professional Fees (Architecture/Engineering)": "One-off fees paid to design and manage the project build.",
        "Permits, Approvals & Admin": "Soft costs for securing government and environmental zoning approvals.",
        "VAT on Construction": "Value Added Tax applicable solely to the physical build phase.",
        "Construction Loan Interest Rate": "Short term interest rate paid on debt drawn down during construction.",
        "Year 1 Drawdown": "Percentage of total capital expenditure deployed in year 1.",
        "Year 2 Drawdown": "Percentage of total capital expenditure deployed in year 2.",
        "Year 3 Drawdown": "Percentage of total capital expenditure deployed in year 3.",
        "Replacement CAPEX": "Capital reserved yearly (as % of revenue) for replacing degraded equipment.",
        "Expansion CAPEX": "One-off future capital allocation for scaling operations.",
        
        "Equity Percentage": "Percentage of the total project funded directly by investor capital.",
        "Debt Percentage": "Percentage of the total project funded through borrowed loans.",
        "Off-Plan Sales / Pre-Sales": "Percentage of projected revenue secured and funded before completion.",
        "Interest Rate Type": "Classification of debt rate structures (Fixed vs Floating).",
        "Interest Margin / Spread": "The lender's profit margin added on top of the benchmark rate.",
        "Loan Tenor": "Total lifespan of the loan including any grace period before maturity.",
        "Grace Period (Principal)": "Number of months where only interest is paid, delaying principal repayment.",
        "Repayment Type": "Methodology for paying down the principal (e.g., Amortizing vs Bullet).",
        "DSRA Requirement": "Debt Service Reserve Account requirement holding liquid cash for near-term debt obligations.",
        "DSRA Funding Source": "Where the capital to fill the reserve account originates from.",
        "Upfront Fees": "One-time lending layout fees charged at the commencement of the loan.",
        "Commitment Fee": "Annual fee paid on any undrawn portion of the total available debt facility.",
        
        "Corporate Income Tax Rate": "Statutory national tax rate levied against net corporate profits.",
        "Tax Holiday Period": "Number of initial operating years granted a 0% tax incentive.",
        "Minimum Tax Rate": "A mandatory alternative floor baseline tax percentage applied.",
        "VAT / Sales Tax Rate": "Value Added Tax charged on top of products sold to end users.",
        "WHT on Dividends": "Withholding Tax rate deducted from dividend payments to shareholders.",
        "WHT on Interest": "Withholding Tax rate deducted from debt interest paid out.",
        "WHT on Services": "Withholding Tax rate applied to external professional services.",
        "WHT on Rent": "Withholding Tax rate applied to facility leasing payments.",
        "Education Tax": "Federal levy directed at educational funding development.",
        "Tax Loss Carryforward Period": "Maximum number of years historic net losses can offset future taxable income.",
        "Initial Allowance": "Accelerated first-year tax write-off granted on capital assets.",
        "Annual Allowance": "Standard, straight-line yearly tax depreciation on operational capital assets.",
        
        "Receivables Days (DSO)": "Days Sales Outstanding - average days taken to physically collect cash after a sale.",
        "Inventory Days (DIO)": "Days Inventory Outstanding - average duration raw stock is held before sale.",
        "Payables Days (DPO)": "Days Payable Outstanding - average days taken to pay critical suppliers.",
        "Working Capital Funding": "Methodology or source used to finance structural working capital deficits.",
        "WC Reserve Account": "Mandatory cash buffer held for rapid short-term operations liquidity.",
        
        "Depreciation Method": "Tax and accounting logic used to write down asset values over time.",
        "Useful Life": "Total expected lifespan of an asset before it's fully depreciated.",
        "Residual Value": "Scrap or salvage expected value of an asset at end of life.",
        
        "Dividend Payout Ratio": "Percentage of Net Income permanently distributed to equity holders.",
        "Payment Frequency": "How often confirmed dividend yields are physically distributed.",
        "Minimum DSCR for Dividend": "Debt Service Coverage Ratio baseline that must be met to legally permit a dividend payout.",
        "Minimum LLCR for Dividend": "Loan Life Coverage Ratio baseline that must be met to legally permit a dividend payout.",
        "Minimum Cash Before Dividend": "Absolute total cash buffer needed on the balance sheet before distribution.",
        
        "Exit Year": "The assumed calendar year the enterprise is liquidated or sold.",
        "Exit Multiple (EV/EBITDA)": "Valuation modifier applied to final year EBITDA to guess terminal market value.",
        "Target IRR": "The Internal Rate of Return goal needed for the project to be viable.",
        "Target Equity IRR": "The target return required by the equity investors.",
        "Minimum MOIC": "Minimum Multiple on Invested Capital threshold.",
        "Payback Period Target": "Maximum allowable years acceptable to recoup the initial capital.",
        "Pre-Sales / Off-plan %": "Expected percentage of units sold before commercial completion."
    }

    # Regex to find <InputField ... /> and their labels. We will try to add tooltips safely.
    def replacer(match):
        full_tag = match.group(0)
        # If it already has a tooltip, we can optionally skip or replace. We'll skip for safety.
        if 'tooltip=' in full_tag:
            return full_tag
            
        # Extract label
        label_match = re.search(r'label="([^"]+)"', full_tag)
        if label_match:
            label = label_match.group(1)
            # Find closest matching tooltip
            # We do a basic substring/exact match
            tooltip_text = None
            if label in tooltips_map:
                tooltip_text = tooltips_map[label]
            else:
                for k, v in tooltips_map.items():
                    if k.lower() in label.lower() or label.lower() in k.lower():
                        tooltip_text = v
                        break
            
            if tooltip_text:
                # Insert tooltip before the closing /> or inside if it's multiline
                # A simple way is to insert it right after the label="..."
                new_tag = full_tag.replace(f'label="{label}"', f'label="{label}" tooltip="{tooltip_text}"')
                print(f"Added tooltip for {label}: {tooltip_text}")
                return new_tag
                
        return full_tag

    # We match <InputField ... /> 
    # Because JSX can be multiline, we need a regex that matches the opening and closing tag of InputField.
    # Fortunately they mostly are self-closing <InputField ... />. Some might be <InputField ...> ... </InputField> but unlikely for this component.
    new_content = re.sub(r'<InputField[^>]+/>', replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        print("Done rewriting the file.")

if __name__ == "__main__":
    main()
