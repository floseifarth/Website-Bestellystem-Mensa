import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Nur URL + anon key im Frontend verwenden (niemals service_role key).
const supabaseUrl = "https://qigqefdghcxerfpzxhmj.supabase.co";
const supabaseAnonKey = "sb_publishable_4uUlhkAJ9vyW8OQcfXK8AQ_NC-zX2Iv";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
