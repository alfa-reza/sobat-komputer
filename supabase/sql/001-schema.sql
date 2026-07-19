begin;

create extension if not exists pgcrypto;

create type public.content_status as enum (
  'draft',
  'published',
  'archived'
);

create table public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  internal_label text not null,
  reference_code text not null unique,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_internal_label_check check (
    internal_label = btrim(internal_label)
    and char_length(internal_label) between 1 and 100
  ),
  constraint products_reference_code_check check (
    reference_code = btrim(reference_code)
    and char_length(reference_code) between 3 and 30
    and reference_code ~ '^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$'
  ),
  constraint products_sort_order_check check (sort_order >= 0)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  sort_order smallint not null,
  width integer not null,
  height integer not null,
  bytes bigint not null,
  created_at timestamptz not null default now(),
  constraint product_images_position_unique unique (product_id, sort_order),
  constraint product_images_storage_path_check check (
    storage_path = btrim(storage_path)
    and storage_path like 'products/%'
    and storage_path not like '%://%'
    and storage_path <> 'products/'
  ),
  constraint product_images_alt_text_check check (
    alt_text = btrim(alt_text)
    and char_length(alt_text) between 5 and 160
  ),
  constraint product_images_sort_order_check check (sort_order between 1 and 5),
  constraint product_images_width_check check (width between 1 and 1600),
  constraint product_images_height_check check (height between 1 and 1600),
  constraint product_images_bytes_check check (bytes > 0)
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  internal_label text not null,
  storage_path text not null,
  alt_text text not null,
  status public.content_status not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0,
  width integer not null,
  height integer not null,
  bytes bigint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_internal_label_check check (
    internal_label = btrim(internal_label)
    and char_length(internal_label) between 1 and 100
  ),
  constraint promotions_storage_path_check check (
    storage_path = btrim(storage_path)
    and storage_path like 'promotions/%'
    and storage_path not like '%://%'
    and storage_path <> 'promotions/'
  ),
  constraint promotions_alt_text_check check (
    alt_text = btrim(alt_text)
    and char_length(alt_text) between 5 and 160
  ),
  constraint promotions_schedule_check check (
    ends_at is null
    or starts_at is null
    or ends_at > starts_at
  ),
  constraint promotions_sort_order_check check (sort_order >= 0),
  constraint promotions_width_check check (width between 1 and 1600),
  constraint promotions_height_check check (height between 1 and 1600),
  constraint promotions_bytes_check check (bytes > 0)
);

create table public.hero_settings (
  id boolean primary key default true,
  desktop_path text not null,
  mobile_path text not null,
  alt_text text not null,
  updated_by uuid not null references auth.users (id) on delete restrict,
  updated_at timestamptz not null default now(),
  constraint hero_settings_singleton_check check (id),
  constraint hero_settings_desktop_path_check check (
    desktop_path = btrim(desktop_path)
    and desktop_path like 'hero/%'
    and desktop_path not like '%://%'
    and desktop_path <> 'hero/'
  ),
  constraint hero_settings_mobile_path_check check (
    mobile_path = btrim(mobile_path)
    and mobile_path like 'hero/%'
    and mobile_path not like '%://%'
    and mobile_path <> 'hero/'
  ),
  constraint hero_settings_alt_text_check check (
    alt_text = btrim(alt_text)
    and char_length(alt_text) between 5 and 160
  )
);

create index products_public_order_idx
  on public.products (sort_order, created_at, id)
  where status = 'published';

create index promotions_public_order_idx
  on public.promotions (sort_order, created_at, id)
  where status = 'published';

create index promotions_schedule_idx
  on public.promotions (starts_at, ends_at)
  where status = 'published';

create function public.touch_content_row()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$;

create function public.touch_hero_settings()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function public.preserve_product_image_created_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.created_at := old.created_at;
  return new;
end;
$$;

create function public.enforce_published_product_images()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target_product_id uuid;
  image_count integer;
begin
  if tg_table_name = 'products' then
    target_product_id := new.id;
  elsif tg_op = 'DELETE' then
    target_product_id := old.product_id;
  else
    target_product_id := new.product_id;
  end if;

  if exists (
    select 1
    from public.products
    where id = target_product_id
      and status = 'published'
  ) then
    select count(*)
    into image_count
    from public.product_images
    where product_id = target_product_id;

    if image_count not between 1 and 5 then
      raise exception using
        errcode = 'check_violation',
        message = 'Published product must have between one and five images';
    end if;
  end if;

  if tg_table_name = 'product_images'
    and tg_op = 'UPDATE'
    and old.product_id is distinct from new.product_id
    and exists (
      select 1
      from public.products
      where id = old.product_id
        and status = 'published'
    )
  then
    select count(*)
    into image_count
    from public.product_images
    where product_id = old.product_id;

    if image_count not between 1 and 5 then
      raise exception using
        errcode = 'check_violation',
        message = 'Published product must have between one and five images';
    end if;
  end if;

  return null;
end;
$$;

create trigger products_touch_content_row
before update on public.products
for each row execute function public.touch_content_row();

create trigger promotions_touch_content_row
before update on public.promotions
for each row execute function public.touch_content_row();

create trigger hero_settings_touch_row
before update on public.hero_settings
for each row execute function public.touch_hero_settings();

create trigger product_images_preserve_created_at
before update on public.product_images
for each row execute function public.preserve_product_image_created_at();

create constraint trigger products_require_images_when_published
after insert or update on public.products
deferrable initially deferred
for each row execute function public.enforce_published_product_images();

create constraint trigger product_images_preserve_published_count
after insert or update or delete on public.product_images
deferrable initially deferred
for each row execute function public.enforce_published_product_images();

commit;
