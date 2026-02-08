const supabaseClient.from('records').select('*')
  "https://PROJECT_ID.supabase.co",
  "ANON_PUBLIC_KEY"
);

window.supabaseClient = supabaseClient;
