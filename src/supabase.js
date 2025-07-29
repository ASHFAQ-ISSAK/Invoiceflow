import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ctdwmlvogrridiixjfin.supabase.co' // Paste your URL here
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZHdtbHZvZ3JyaWRpaXhqZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODA1NTMsImV4cCI6MjA2OTM1NjU1M30.l4GJ6CE0vMMUFM6gf_efoOO433ibLezT9RoXgsWPjW4' // Paste your anon key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey)