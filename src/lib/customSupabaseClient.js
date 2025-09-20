import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yujhmxzsibdnjpvizrma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1amhteHpzaWJkbmpwdml6cm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTM5MDEsImV4cCI6MjA3MjMyOTkwMX0.CtiWQ6BR8eLJNq2kDsKa4sJJFV3IS4moI69w7DcnReI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);