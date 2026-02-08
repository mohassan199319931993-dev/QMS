async function runTest() {

  // LOGIN
  const { error: loginError } =
    await window.supabaseClient.auth.signInWithPassword({
      email: "test@qc.com",
      password: "123456"
    });

  if (loginError) {
    console.log("LOGIN ERROR ❌", loginError.message);
    return;
  }
  console.log("LOGIN OK ✅");

  // SELECT
  const { data, error } =
    await window.supabaseClient
      .from("defects")
      .select("*")
      .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

runTest();
