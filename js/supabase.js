// نطلع createClient من المكتبة
const { createClient } = supabaseJs;

// ننشئ العميل
const supabaseClient = createClient(
  "https://PROJECT_ID.supabase.co",
  "ANON_PUBLIC_KEY"
);

// نخليه Global عشان نستخدمه في أي ملف
window.supabaseClient = supabaseClient;
