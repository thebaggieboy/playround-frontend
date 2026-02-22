import codecs

path = r'c:\Users\newsh\OneDrive\Documents\Jobs\PLYGROUND\frontend\plyground_app\app\dashboard\models\input\advanced\page.tsx'
with codecs.open(path, 'r', 'utf-8') as f:
    text = f.read()

text = text.replace(
'''  const { toast } = useToast()
  
  // Initialize form data with default values''',
'''  const { toast } = useToast()
  const token = useSelector(selectToken)
  
  // Initialize form data with default values'''
)

text = text.replace(
'''  // Get auth token (adjust based on your auth implementation)
  const getAuthToken = () => {
    // Replace with your actual auth token retrieval
    return localStorage.getItem('authToken') || ''
  }''',
'''  // Get auth token (adjust based on your auth implementation)
  const getAuthToken = () => {
    return token || (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || ''
  }'''
)

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(text)
