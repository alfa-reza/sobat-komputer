# Supabase Database Setup

Dokumen ini mencakup TASK-004 saja: schema PostgreSQL awal. RLS, Storage, seed, dan owner provisioning belum diterapkan.

## Prasyarat

- Gunakan Supabase project development kosong yang telah disetujui.
- Jangan jalankan pada production.
- Pastikan tidak ada table TASK-004 yang sudah ada di schema `public`.
- Jangan menaruh password, access token, `service_role` key, atau credential lain di repository maupun SQL Editor history yang dibagikan.

## Menjalankan Schema

1. Buka Supabase Dashboard untuk project development.
2. Buka **SQL Editor** dan buat query baru.
3. Salin seluruh isi `supabase/sql/001-schema.sql` tanpa mengubah urutan.
4. Pastikan query dimulai dengan `begin;` dan berakhir dengan `commit;`.
5. Jalankan query sekali.
6. Jika terjadi error, transaction membatalkan seluruh perubahan. Simpan pesan error lengkap tanpa credential dan jangan menjalankan potongan SQL secara terpisah.
7. Jika hasil eksekusi tidak diketahui, jangan rerun. Jalankan query inspeksi di bawah untuk memastikan migration sudah lengkap atau tidak diterapkan sama sekali.

Migration sengaja fail-fast dan bukan script rerunnable. `if not exists` tidak digunakan pada table/type karena dapat menyembunyikan schema drift.

## Verifikasi Struktur

Jalankan setelah `001-schema.sql` berhasil.

### Tables

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'app_admins',
    'products',
    'product_images',
    'promotions',
    'hero_settings'
  )
order by table_name;
```

Expected: lima row dengan nama table di atas.

### Constraints

```sql
select
  conrelid::regclass as table_name,
  conname,
  contype,
  pg_get_constraintdef(oid) as definition
from pg_constraint
where connamespace = 'public'::regnamespace
  and conrelid in (
    'public.app_admins'::regclass,
    'public.products'::regclass,
    'public.product_images'::regclass,
    'public.promotions'::regclass,
    'public.hero_settings'::regclass
  )
order by conrelid::regclass::text, conname;
```

Periksa primary key, foreign key, unique reference, unique image position, field checks, schedule check, dan hero singleton check.

### Indexes

```sql
select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'app_admins',
    'products',
    'product_images',
    'promotions',
    'hero_settings'
  )
order by tablename, indexname;
```

Expected custom indexes:

- `products_public_order_idx`
- `promotions_public_order_idx`
- `promotions_schedule_idx`

Primary key dan unique constraints juga menghasilkan indexes internal.

### Triggers

```sql
select
  event_object_table,
  trigger_name,
  action_timing,
  string_agg(event_manipulation, ', ' order by event_manipulation) as events
from information_schema.triggers
where trigger_schema = 'public'
group by event_object_table, trigger_name, action_timing
order by event_object_table, trigger_name;
```

Expected triggers:

- `products_touch_content_row`
- `promotions_touch_content_row`
- `hero_settings_touch_row`
- `product_images_preserve_created_at`
- `products_require_images_when_published`
- `product_images_preserve_published_count`

## Verification Test Transaction

Jalankan seluruh block berikut sebagai query terpisah. Block selalu berakhir dengan `rollback;` dan tidak meninggalkan test data.

```sql
begin;

do $$
declare
  product_id uuid;
  first_image_id uuid;
  original_created_at timestamptz;
begin
  begin
    insert into public.products (internal_label, reference_code, status)
    values ('Produk invalid', 'INVALID-STATUS', 'invalid');
    raise exception 'Expected invalid status rejection';
  exception
    when invalid_text_representation then null;
  end;

  begin
    insert into public.products (internal_label, reference_code)
    values (' Label tidak trimmed ', 'TRIM-001');
    raise exception 'Expected label rejection';
  exception
    when check_violation then null;
  end;

  insert into public.products (internal_label, reference_code)
  values ('Produk test', 'TEST-001')
  returning id into product_id;

  begin
    insert into public.products (internal_label, reference_code)
    values ('Duplicate test', 'TEST-001');
    raise exception 'Expected duplicate reference rejection';
  exception
    when unique_violation then null;
  end;

  begin
    insert into public.product_images (
      product_id, storage_path, alt_text, sort_order, width, height, bytes
    ) values (
      product_id, 'products/test-6.webp', 'Gambar test keenam', 6, 100, 100, 1000
    );
    raise exception 'Expected sixth image position rejection';
  exception
    when check_violation then null;
  end;

  insert into public.product_images (
    product_id, storage_path, alt_text, sort_order, width, height, bytes
  ) values (
    product_id, 'products/test-1.webp', 'Gambar produk test', 1, 100, 100, 1000
  ) returning id, created_at into first_image_id, original_created_at;

  begin
    insert into public.product_images (
      product_id, storage_path, alt_text, sort_order, width, height, bytes
    ) values (
      product_id, 'products/test-duplicate.webp', 'Gambar posisi sama', 1, 100, 100, 1000
    );
    raise exception 'Expected duplicate image position rejection';
  exception
    when unique_violation then null;
  end;

  update public.product_images
  set created_at = created_at - interval '1 day'
  where id = first_image_id;

  if (select created_at from public.product_images where id = first_image_id) <> original_created_at then
    raise exception 'product_images.created_at changed';
  end if;

  update public.products
  set status = 'published'
  where id = product_id;

  begin
    delete from public.product_images where id = first_image_id;
    set constraints all immediate;
    raise exception 'Expected published product image-count rejection';
  exception
    when check_violation then
      set constraints all deferred;
  end;

  begin
    insert into public.promotions (
      internal_label,
      storage_path,
      alt_text,
      starts_at,
      ends_at,
      width,
      height,
      bytes
    ) values (
      'Promo invalid',
      'promotions/test.webp',
      'Poster promo test',
      '2026-07-20 00:00:00+00',
      '2026-07-19 00:00:00+00',
      100,
      100,
      1000
    );
    raise exception 'Expected promotion schedule rejection';
  exception
    when check_violation then null;
  end;
end;
$$;

rollback;
```

Expected: query berhasil dan diakhiri rollback. Exception yang diharapkan ditangkap oleh test block. Jika query gagal dengan pesan `Expected ... rejection`, constraint terkait tidak bekerja.

Hero singleton memerlukan Auth user valid untuk `updated_by`; verifikasi insert hero dilakukan setelah owner provisioning pada task security. Singleton sudah dijamin oleh boolean primary key dan `check (id)`.

## Verifikasi Cascade

Jalankan sebagai query terpisah. Test selalu rollback.

```sql
begin;

do $$
declare
  product_id uuid;
begin
  insert into public.products (internal_label, reference_code)
  values ('Cascade test', 'CASCADE-001')
  returning id into product_id;

  insert into public.product_images (
    product_id, storage_path, alt_text, sort_order, width, height, bytes
  ) values (
    product_id, 'products/cascade.webp', 'Gambar cascade test', 1, 100, 100, 1000
  );

  delete from public.products where id = product_id;

  if exists (
    select 1 from public.product_images where product_images.product_id = product_id
  ) then
    raise exception 'Product image row was not removed by cascade';
  end if;
end;
$$;

rollback;
```

Expected: query berhasil dan diakhiri rollback. Cascade hanya menghapus row `product_images`; Storage objects belum dikelola pada TASK-004.

## Rollback TASK-004

Rollback bersifat destruktif. Jalankan hanya pada environment yang disetujui setelah memastikan tidak ada data yang harus dipertahankan. Jangan gunakan `drop schema public cascade` dan jangan drop extension `pgcrypto`.

```sql
begin;

drop trigger if exists product_images_preserve_published_count on public.product_images;
drop trigger if exists products_require_images_when_published on public.products;
drop trigger if exists product_images_preserve_created_at on public.product_images;
drop trigger if exists hero_settings_touch_row on public.hero_settings;
drop trigger if exists promotions_touch_content_row on public.promotions;
drop trigger if exists products_touch_content_row on public.products;

drop table if exists public.hero_settings;
drop table if exists public.promotions;
drop table if exists public.product_images;
drop table if exists public.products;
drop table if exists public.app_admins;

drop function if exists public.enforce_published_product_images();
drop function if exists public.preserve_product_image_created_at();
drop function if exists public.touch_hero_settings();
drop function if exists public.touch_content_row();

drop type if exists public.content_status;

commit;
```

Rollback tidak menghapus Auth users atau Storage objects.

## Security Gate

TASK-004 belum mengaktifkan RLS. Jangan hubungkan frontend, membagikan anon key, seed content, atau menggunakan schema ini untuk public traffic sampai TASK-005 selesai dan policy telah diverifikasi.
