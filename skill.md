## PEMBUATAN PROJECT EVENT TICKET
- Konsep saat ini adalah membuat halaman event,
- pembelian tiket, halaman login, register, dan halaman checkout.
- Admin dapat membuat event dan mengelola event.
- Admin dapat melihat data user yang membeli tiket.
- Admin dapat melihat data tiket yang dibeli oleh user.
- Admin dapat melihat data event yang dibuat oleh admin.
- Admin dapat melihat data user yang terdaftar di event.

## FITUR
- Scan QR code untuk validasi tiket
- Pembeli tiket hanya bisa pakai 1x tiket saja, jika sudah di scan maka tidak bisa di scan lagi
- Pembayaran melalui Api midtrans
- role user di buatkan menjadi 3 (user, event_organizer, admin) 
- membuat menu halaman user untuk menampilkan barcode/qr code untuk di scan di event nanti
- role event_organizer hanya di tugaskan untuk scan dan validasi saja
- hanya admin yang bisa mengelola data user dan data event dan data tiket
- role event_organizer hanya bisa melihat data event yang dibuat oleh admin
- role event_organizer tidak bisa membuat event
- role event_organizer tidak bisa menghapus data user dan data tiket


## TEC
- Nextjs 16
- Tailwind CSS
- Shadcn UI
- PostgreSQL
- Supabase Auth
- Api midtrans
