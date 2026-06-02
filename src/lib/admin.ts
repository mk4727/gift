import { supabase } from "@/integrations/supabase/client";

const ADMIN_KEY = "forever_us_admin_pw";

export const getAdminPassword = () => sessionStorage.getItem(ADMIN_KEY);
export const setAdminPassword = (pw: string) => sessionStorage.setItem(ADMIN_KEY, pw);
export const clearAdminPassword = () => sessionStorage.removeItem(ADMIN_KEY);
export const isAdminAuthed = () => !!getAdminPassword();

export async function adminCall(action: string, payload: any = {}) {
  const password = getAdminPassword();
  if (!password) throw new Error("Not authenticated");
  const { data, error } = await supabase.functions.invoke("admin-action", {
    body: { password, action, payload },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function verifyPassword(password: string) {
  const { data, error } = await supabase.functions.invoke("admin-action", {
    body: { password, action: "verify", payload: {} },
  });
  if (error || data?.error) return false;
  return true;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
