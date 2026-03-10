-- Fix the handle_new_user trigger to handle null participant_type safely
create or replace function handle_new_user()
returns trigger as $$
declare
  pt participant_type;
begin
  -- Safely cast participant_type, default to 'human'
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
