import re

path = r'c:\Users\newsh\OneDrive\Documents\Jobs\PLYGROUND\frontend\plyground_app\app\dashboard\models\input\advanced\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def inject_bindings(match):
    text = match.group(0)
    if 'calculated' in text or 'onChange' in text:
        return text
    
    # exclude dynamic real-estate labels in RevenueForm which use projectType === 'real-estate' ? ...
    if '{projectType' in text or 'idx,' in text or 'updateRevenueProduct' in text:
        return text
        
    label_m = re.search(r'label="([^"]+)"', text)
    if not label_m: 
        return text
    
    label = label_m.group(1)
    
    raw_name = label.replace('%', 'Pct').replace('/', ' ').replace('-', ' ').replace('(', '').replace(')', '').replace('&', '').replace(',', '').replace('+', '')
    words = raw_name.split()
    if not words: return text
    
    var_name = words[0].lower() + ''.join(w.capitalize() for w in words[1:])
    
    mapping = {
        'totalPlantFactoryCapacity': 'totalCapacity',
        'exchangeRateLocalUsd': 'exchangeRate',
    }
    var_name = mapping.get(var_name, var_name)

    is_select = 'type="select"' in text
    
    val_str = f"formData?.{var_name}"
    
    if not is_select:
        on_change = f"(val) => updateFormData('{var_name}', Number(val))"
    else:
        on_change = f"(val) => updateFormData('{var_name}', val)"
        
    inject = f'\n              value={{{val_str}}}\n              onChange={{{on_change}}}'
    
    idx = text.rfind('/>')
    if idx == -1: return text
    
    return text[:idx] + inject + "\n            />"

# split into forms to keep RevenueForm mostly untouched, although regex protects
# actually using dotall matcher
new_content = re.sub(r'<InputField[\s\S]*?/>', inject_bindings, content)

# Now, we also need to print all generated variable names so we can add them to FormData interface
variables_added = set()
for match in re.finditer(r"updateFormData\('([^']+)'", new_content):
    variables_added.add(match.group(1))

with open('tmp_page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Variables found:", sorted(variables_added))

