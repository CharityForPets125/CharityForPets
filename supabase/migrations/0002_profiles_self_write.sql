create policy if not exists "profiles self insert"
on public.profiles for insert
with check (auth.uid() = id);

create policy if not exists "profiles self update"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);
