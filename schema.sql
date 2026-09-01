CREATE TABLE public.acara (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  deskripsi text NOT NULL,
  tanggal_mulai timestamp with time zone NOT NULL,
  tanggal_selesai timestamp with time zone NOT NULL,
  lokasi text NOT NULL,
  url_maps text,
  harga double precision NOT NULL,
  diskon double precision,
  kapasitas integer NOT NULL,
  nama_penyelenggara text DEFAULT 'MANAJEMENTIKET' NOT NULL,
  url_gambar text,
  url_sub_gambar_1 text,
  url_sub_gambar_2 text,
  url_sub_gambar_3 text,
  dibuat_pada timestamp with time zone DEFAULT now() NOT NULL,
  diubah_pada timestamp with time zone NOT NULL
);

CREATE TABLE public.pengguna (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nama text,
  peran text DEFAULT 'pengguna' NOT NULL,
  dibuat_pada timestamp with time zone DEFAULT now() NOT NULL,
  diubah_pada timestamp with time zone NOT NULL
);

CREATE TABLE public.tiket (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_acara uuid NOT NULL REFERENCES public.acara(id) ON DELETE CASCADE,
  id_pengguna uuid NOT NULL REFERENCES public.pengguna(id) ON DELETE CASCADE,
  qr_code text UNIQUE NOT NULL,
  id_pembayaran text UNIQUE,
  metode_pembayaran text,
  status_bayar text,
  snap_token text,
  status text DEFAULT 'pending' NOT NULL,
  dibuat_pada timestamp with time zone DEFAULT now() NOT NULL,
  diubah_pada timestamp with time zone NOT NULL
);

-- Update the PostgREST schema cache
NOTIFY pgrst, 'reload schema';

CREATE TABLE public.banner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  url_gambar text NOT NULL,
  tautan text,
  is_active boolean DEFAULT true NOT NULL,
  dibuat_pada timestamp with time zone DEFAULT now() NOT NULL,
  diubah_pada timestamp with time zone NOT NULL
);

-- Update the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
