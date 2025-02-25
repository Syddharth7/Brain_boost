import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yidolvjacyyumfabufte.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZG9sdmphY3l5dW1mYWJ1ZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTM5MzIsImV4cCI6MjA1NTk4OTkzMn0.t0aXCTu58KFsEe8idpYVKDKUPyRKWb_VtoGW-p4M0Mw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
