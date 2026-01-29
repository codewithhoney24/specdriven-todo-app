from main import app
from mangum import Mangum

# This creates a Vercel-compatible server
handler = Mangum(app)