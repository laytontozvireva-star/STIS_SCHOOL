import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) throw new Error("You must be signed in.");

    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const callerClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !caller) throw new Error("Invalid session.");

    const { data: profile, error: profileError } = await callerClient
      .from("profiles").select("role").eq("id", caller.id).single();
    if (profileError || profile?.role !== "admin") throw new Error("Only admins can create accounts.");

    const { name, email, password, role, subject, department } = await request.json();
    const allowedRoles = ["teacher", "parent", "admin"];
    if (!name?.trim() || !email?.trim() || !password || !allowedRoles.includes(role)) {
      throw new Error("Name, email, password, and a valid account role are required.");
    }
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");

    const adminClient = createClient(url, serviceKey);
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email: email.trim(), password, email_confirm: true, user_metadata: { name: name.trim() },
    });
    if (createError || !created.user) throw createError ?? new Error("Could not create the account.");

    const { error: roleError } = await adminClient.from("profiles")
      .update({ name: name.trim(), email: email.trim(), role })
      .eq("id", created.user.id);
    if (roleError) throw roleError;

    if (role === "teacher") {
      const { error: teacherError } = await adminClient.from("teachers").insert({
        profile_id: created.user.id,
        subject: subject?.trim() || null,
        department: department?.trim() || null,
      });
      if (teacherError) throw teacherError;
    }

    return Response.json({ message: `${role[0].toUpperCase()}${role.slice(1)} account created.` }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error.message || "Could not create account." }, { status: 400, headers: corsHeaders });
  }
});
