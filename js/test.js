async function runTest() {

  // 1️⃣ Login
  const { error: loginError } =
    await supabase.auth.signInWithPassword({
      email: "test@qc.com",
      password: "123456"
    });

  if (loginError) {
    console.log("LOGIN ERROR ❌", loginError.message);
    return;
  }
  console.log("LOGIN OK ✅");

  // 2️⃣ Insert
  const { error: insertError } =
    await supabase.from("defects").insert([{
      defect_date: "2026-01-26",
      department: "تجميع",
      defect_name: "اختبار",
      defect_category: "Test",
      defect_qty: 1,
      shift: "A",
      repair_status: true
    }]);

  if (insertError) {
    console.log("INSERT ERROR ❌", insertError.message);
  } else {
    console.log("INSERT OK ✅");
  }
}

runTest();
