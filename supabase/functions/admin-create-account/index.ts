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
    if (!name?.trim() || !email?.trim() || !allowedRoles.includes(role)) {
      throw new Error("Name, email, and a valid account role are required.");
    }
    if (role !== "teacher" && (!password || password.length < 8)) {
      throw new Error("A temporary password of at least 8 characters is required.");
    }

    const adminClient = createClient(url, serviceKey);
    let userId: string;
    if (role === "teacher") {
      const { data: invitation, error: invitationError } = await adminClient.auth.admin.inviteUserByEmail(email.trim(), {
        data: { name: name.trim() },
      });
      if (invitationError || !invitation.user) throw invitationError ?? new Error("Could not send the teacher invitation.");
      userId = invitation.user.id;
    } else {
      const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email: email.trim(), password, email_confirm: true, user_metadata: { name: name.trim() },
      });
      if (createError || !created.user) throw createError ?? new Error("Could not create the account.");
      userId = created.user.id;
    }

    const { error: roleError } = await adminClient.from("profiles")
      .update({ name: name.trim(), email: email.trim(), role })
      .eq("id", userId);
    if (roleError) throw roleError;

    if (role === "teacher") {
      const { error: teacherError } = await adminClient.from("teachers").insert({
        profile_id: userId,
        subject: subject?.trim() || null,
        department: department?.trim() || null,
      });
      if (teacherError) throw teacherError;
    }

    const message = role === "teacher"
      ? "Teacher invitation sent. The teacher must use the email link to set a password."
      : `${role[0].toUpperCase()}${role.slice(1)} account created.`;
    return Response.json({ message }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error.message || "Could not create account." }, { status: 400, headers: corsHeaders });
  }
});