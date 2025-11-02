import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rnkdxncmajpdlxwdlswz.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJua2R4bmNtYWpwZGx4d2Rsc3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzQ1MjEsImV4cCI6MjA3NzYxMDUyMX0.zHxlb8rykhwbwINTYjIA40LTG-bIRcXeo_DIVcEM2dk'

export const supabase = createClient(supabaseUrl, supabaseKey)