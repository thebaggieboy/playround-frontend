import re
import codecs

path = r'c:\Users\newsh\OneDrive\Documents\Jobs\PLYGROUND\frontend\plyground_app\app\dashboard\models\input\advanced\page.tsx'

with codecs.open(path, 'r', 'utf-8') as f:
    text = f.read()

# Extract all properties accessed via formData?.<propName>
matches = re.findall(r'value=\{formData\?\.([a-zA-Z0-9_]+)\}', text)
properties_used = set(matches)

# Extract the FormData interface block
interface_match = re.search(r'(interface\s+FormData\s*\{)(.*?)(\n\})', text, re.DOTALL)
if interface_match:
    start_tag = interface_match.group(1)
    interface_body = interface_match.group(2)
    end_tag = interface_match.group(3)
    
    # Extract existing properties in the interface
    existing_props = set(re.findall(r'^\s*([a-zA-Z0-9_]+)\s*\??:', interface_body, re.MULTILINE))
    
    missing_props = properties_used - existing_props
    
    if missing_props:
        print(f"Adding {len(missing_props)} missing properties to FormData")
        new_lines = "\n  // Auto-added properties\n"
        for prop in sorted(missing_props):
            new_lines += f"  {prop}?: any;\n"
            
        new_interface_body = interface_body + new_lines
        
        new_text = text[:interface_match.start()] + start_tag + new_interface_body + end_tag + text[interface_match.end():]
        
        with codecs.open(path, 'w', 'utf-8') as f:
            f.write(new_text)
        print("Updated page.tsx successfully.")
    else:
        print("No missing properties found.")
else:
    print("Could not find FormData interface")
