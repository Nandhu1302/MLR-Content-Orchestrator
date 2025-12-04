-- Grant demo users access to all brands (simplified to match actual schema)
insert into user_brand_access (user_id, brand_id)
select
  p.user_id,
  b.id
from profiles p
cross join brand_profiles b
where p.is_demo_user = true
on conflict do nothing;

-- Add demo user view policies for key data tables
create policy "Demo users can view all SFMC campaign data"
on public.sfmc_campaign_data
for select
using (
  exists (
    select 1
    from profiles p
    where p.user_id = auth.uid()
      and p.is_demo_user = true
  )
);

create policy "Demo users can view all Veeva field insights"
on public.veeva_field_insights
for select
using (
  exists (
    select 1
    from profiles p
    where p.user_id = auth.uid()
      and p.is_demo_user = true
  )
);

create policy "Demo users can view all IQVIA market data"
on public.iqvia_market_data
for select
using (
  exists (
    select 1
    from profiles p
    where p.user_id = auth.uid()
      and p.is_demo_user = true
  )
);

create policy "Demo users can view all social listening data"
on public.social_listening_data
for select
using (
  exists (
    select 1
    from profiles p
    where p.user_id = auth.uid()
      and p.is_demo_user = true
  )
);

create policy "Demo users can view all competitive intelligence data"
on public.competitive_intelligence_data
for select
using (
  exists (
    select 1
    from profiles p
    where p.user_id = auth.uid()
      and p.is_demo_user = true
  )
);