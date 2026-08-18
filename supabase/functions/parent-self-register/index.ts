import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { name, email, password, studentNumber, accessCode } = await request.json();
    if (!name?.trim() || !email?.trim() || !studentNumber?.trim() || !accessCode?.trim()) {
      throw new Error("Name, email, student number, and parent access code are required.");
    }
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const admin = createClient(url, serviceKey);

    const { data: student, error: studentError } = await admin
      .from("students")
      .select("id, parent_access_code")
      .eq("student_number", studentNumber.trim())
      .maybeSingle();

    if (studentError) throw studentError;
    if (!student || !student.parent_access_code || student.parent_access_code !== accessCode.trim()) {
      throw new Error("The student number or parent access code is incorrect.");
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: { name: name.trim(), role: "parent" },
    });
    if (createError || !created.user) throw createError ?? new Error("Could not create the account.");

    const { error: profileError } = await admin
      .from("profiles")
      .update({ name: name.trim(), email: email.trim(), role: "parent" })
      .eq("id", created.user.id);
    if (profileError) throw profileError;

    const { error: linkError } = await admin
      .from("parent_students")
      .insert({ parent_id: created.user.id, student_id: student.id });
    if (linkError) throw linkError;

    return Response.json(
      { message: "Parent account created. You can now sign in." },
      { headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Could not create the parent account." },
      { status: 400, headers: corsHeaders },
    );
  }
});