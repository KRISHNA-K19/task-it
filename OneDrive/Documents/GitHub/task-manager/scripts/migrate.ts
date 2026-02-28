import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    const sqlPath = path.join(process.cwd(), "migrations", "add_task_fields.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    // Execute the migration
    const { error } = await supabase.rpc("exec", { sql });

    if (error) {
      console.error("Migration failed:", error);
      process.exit(1);
    }

    console.log("✓ Migration completed successfully!");
  } catch (err) {
    console.error("Error running migration:", err);
    process.exit(1);
  }
}

runMigration();
