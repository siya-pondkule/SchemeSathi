import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gtsqovhmxdheprkyxjya.supabase.co/';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0c3FvdmhteGRoZXBya3l4anlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MjI3MzEsImV4cCI6MjA1NTA5ODczMX0.4-Jcbk7OSeQKJfS4Q02D_Gmk7cD-PbVPBlaYgd5Cyfw';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export default supabase;
