// Supabase CDN بيطلع object اسمه supabase
const supabaseClient = supabase.createClient(
  "https://PROJECT_ID.supabase.co",
  "ANON_PUBLIC_KEY"
);

// نخليه global
window.supabaseClient = supabaseClient;

