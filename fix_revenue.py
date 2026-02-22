import codecs

path = r'c:\Users\newsh\OneDrive\Documents\Jobs\PLYGROUND\frontend\plyground_app\app\dashboard\models\input\advanced\page.tsx'
with codecs.open(path, 'r', 'utf-8') as f:
    text = f.read()

text = text.replace(
'''              onChange={(value) => updateRevenueProduct(idx, 'productName', value)}''',
'''              value={formData.revenueProducts[idx]?.productName}
              onChange={(value) => updateRevenueProduct(idx, 'productName', value)}'''
)

text = text.replace(
'''              onChange={(value) => updateRevenueProduct(idx, 'unitOfMeasure', value)}''',
'''              value={formData.revenueProducts[idx]?.unitOfMeasure}
              onChange={(value) => updateRevenueProduct(idx, 'unitOfMeasure', value)}'''
)

text = text.replace(
'''                <InputField label="Year 1 Sales Volume" type="number" onChange={(value) => updateRevenueProduct(idx, 'year1SalesVolume', Number(value))} defaultValue="10000" />
                <InputField label="Unit Price (Year 1)" type="number" onChange={(value) => updateRevenueProduct(idx, 'unitPrice', Number(value))} prefix="$" defaultValue="80" />
                <InputField label="Volume Growth Rate" type="number" onChange={(value) => updateRevenueProduct(idx, 'volumeGrowthRate', Number(value))} suffix="%" defaultValue="5.0" />
                <InputField label="Price Escalation Rate" type="number"  onChange={(value) => updateRevenueProduct(idx, 'priceEscalationRate', Number(value))}suffix="%" defaultValue="2.5" />''',
'''                <InputField label="Year 1 Sales Volume" type="number" value={formData.revenueProducts[idx]?.year1SalesVolume} onChange={(value) => updateRevenueProduct(idx, 'year1SalesVolume', Number(value))} defaultValue="10000" />
                <InputField label="Unit Price (Year 1)" type="number" value={formData.revenueProducts[idx]?.unitPriceYear1} onChange={(value) => updateRevenueProduct(idx, 'unitPriceYear1', Number(value))} prefix="$" defaultValue="80" />
                <InputField label="Volume Growth Rate" type="number" value={formData.revenueProducts[idx]?.volumeGrowthRate} onChange={(value) => updateRevenueProduct(idx, 'volumeGrowthRate', Number(value))} suffix="%" defaultValue="5.0" />
                <InputField label="Price Escalation Rate" type="number" value={formData.revenueProducts[idx]?.priceEscalationRate} onChange={(value) => updateRevenueProduct(idx, 'priceEscalationRate', Number(value))} suffix="%" defaultValue="2.5" />'''
)

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(text)
