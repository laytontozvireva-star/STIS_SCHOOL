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

    const { name, email, role, subject, department, redirectTo } = await request.json();
    const allowedRoles = ["teacher", "parent", "admin"];
    if (!name?.trim() || !email?.trim() || !allowedRoles.includes(role)) {
      throw new Error("Name, email, and a valid account role are required.");
    }

    const adminClient = createClient(url, serviceKey);
    let userId: string;

    const inviteOptions: { data: any; redirectTo?: string } = {
      data: { name: name.trim() },
    };
    if (redirectTo) {
      inviteOptions.redirectTo = redirectTo;
    }

    const { data: invitation, error: invitationError } = await adminClient.auth.admin.inviteUserByEmail(email.trim(), inviteOptions);
    if (invitationError || !invitation.user) {
      throw invitationError ?? new Error(`Could not send the ${role} invitation.`);
    }
    userId = invitation.user.id;

    const { error: roleError } = await adminClient.from("profiles")
      .update({ name: name.trim(), email: email.trim(), role })
      .eq("id", userId);
    if (roleError) throw roleError;

    if (role !== "student") {
      await adminClient.from("students").delete().eq("profile_id", userId);
    }

    if (role === "teacher") {
      const { error: teacherError } = await adminClient.from("teachers").insert({
        profile_id: userId,
        subject: subject?.trim() || null,
        department: department?.trim() || null,
      });
      if (teacherError) throw teacherError;
    }

    const message = `${role[0].toUpperCase()}${role.slice(1)} invitation sent. They must use the email link to set a password.`;
    return Response.json({ message }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error.message || "Could not create account." }, { status: 400, headers: corsHeaders });
  }
});