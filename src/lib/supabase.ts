import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type DbProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  visibility: string;
  stack: string[];
  repo_url: string;
  live_url: string;
  health_score: number;
  created_at: string;
  updated_at: string;
};