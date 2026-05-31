import { supabase } from "@/lib/supabase";

export default async function TestSupabasePage() {
  const { data, error } = await supabase
    .from("members")
    .select("*");

  return (
    <main style={{ padding: "40px", color: "white", background: "black", minHeight: "100vh" }}>
      <h1>Supabase Test</h1>

      <pre>
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}