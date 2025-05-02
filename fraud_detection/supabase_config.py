from supabase import create_client, Client

# Replace with your actual values
SUPABASE_URL = "https://gtsqovhmxdheprkyxjya.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0c3FvdmhteGRoZXBya3l4anlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MjI3MzEsImV4cCI6MjA1NTA5ODczMX0.4-Jcbk7OSeQKJfS4Q02D_Gmk7cD-PbVPBlaYgd5Cyfw"

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)
