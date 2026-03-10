import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

async function fixTrigger() {
  // Use the Supabase SQL endpoint directly
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/`

  // Try executing SQL via pg_net or direct fetch to the SQL endpoint
  const sqlUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/pg`

  const sql = `
    create or replace function handle_new_user()
    returns trigger as $$
    declare
      pt participant_type;
    begin
      begin
        pt := (new.raw_user_meta_data->>'participant_type')::participant_type;
      exception when others then
        pt := 'human';
      end;

      if pt is null then
        pt := 'human';
      end if;

      insert into profiles (id, display_name, participant_type)
      values (
        new.id,
        coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        pt
      );
      return new;
    end;
    $$ language plpgsql security definer;
  `

  // Try the Supabase management API SQL endpoint
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })

  console.log('Direct SQL attempt:', res.status, await res.text())

  // Alternative: try via supabase.rpc if there's a custom function
  // If none of these work, the user needs to run the SQL in the Supabase dashboard
  console.log('\nIf the above failed, please run this SQL in your Supabase SQL Editor:')
  console.log(sql)
}

fixTrigger()
