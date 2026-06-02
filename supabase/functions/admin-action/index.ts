import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { password, action, payload } = body;

    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result: any = { ok: true };

    switch (action) {
      case "verify":
        break;

      case "create_folder": {
        const { data, error } = await supabase
          .from("folders")
          .insert({ title: payload.title, cover_image: payload.cover_image ?? null })
          .select()
          .single();
        if (error) throw error;
        result.data = data;
        break;
      }
      case "update_folder": {
        const { error } = await supabase
          .from("folders")
          .update({ title: payload.title, cover_image: payload.cover_image })
          .eq("id", payload.id);
        if (error) throw error;
        break;
      }
      case "delete_folder": {
        const { error } = await supabase.from("folders").delete().eq("id", payload.id);
        if (error) throw error;
        break;
      }

      case "upload_image": {
        // payload.folder_id, payload.file_base64, payload.filename
        const binary = Uint8Array.from(atob(payload.file_base64), (c) => c.charCodeAt(0));
        const path = `${payload.folder_id}/${Date.now()}-${payload.filename}`;
        const { error: upErr } = await supabase.storage
          .from("memories")
          .upload(path, binary, { contentType: payload.content_type, upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("memories").getPublicUrl(path);
        const mediaType = (payload.content_type || "").startsWith("video/") ? "video" : "image";
        const { data, error } = await supabase
          .from("images")
          .insert({ folder_id: payload.folder_id, image_url: pub.publicUrl, media_type: mediaType })
          .select()
          .single();
        if (error) throw error;
        result.data = data;
        break;
      }
      case "delete_image": {
        const { error } = await supabase.from("images").delete().eq("id", payload.id);
        if (error) throw error;
        break;
      }

      case "create_message": {
        const { data, error } = await supabase
          .from("messages")
          .insert({ title: payload.title, content: payload.content })
          .select()
          .single();
        if (error) throw error;
        result.data = data;
        break;
      }
      case "update_message": {
        const { error } = await supabase
          .from("messages")
          .update({ title: payload.title, content: payload.content })
          .eq("id", payload.id);
        if (error) throw error;
        break;
      }
      case "delete_message": {
        const { error } = await supabase.from("messages").delete().eq("id", payload.id);
        if (error) throw error;
        break;
      }

      case "update_setting": {
        const { error } = await supabase
          .from("settings")
          .upsert({ key: payload.key, value: payload.value, updated_at: new Date().toISOString() });
        if (error) throw error;
        break;
      }
      case "upload_hero": {
        const binary = Uint8Array.from(atob(payload.file_base64), (c) => c.charCodeAt(0));
        const path = `hero/${Date.now()}-${payload.filename}`;
        const { error: upErr } = await supabase.storage
          .from("memories")
          .upload(path, binary, { contentType: payload.content_type, upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("memories").getPublicUrl(path);
        await supabase.from("settings").upsert({ key: "hero_image", value: pub.publicUrl, updated_at: new Date().toISOString() });
        result.url = pub.publicUrl;
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
