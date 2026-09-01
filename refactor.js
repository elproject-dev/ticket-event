import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const files = execSync('find app -name "*.ts" -o -name "*.tsx"').toString().split('\n').filter(Boolean);

const replacements = {
  '"Acara"': '"acara"',
  '"Pengguna"': '"pengguna"',
  '"Tiket"': '"tiket"',
  'tanggalMulai': 'tanggal_mulai',
  'tanggalSelesai': 'tanggal_selesai',
  'urlMaps': 'url_maps',
  'urlGambar': 'url_gambar',
  'urlSubGambar1': 'url_sub_gambar_1',
  'urlSubGambar2': 'url_sub_gambar_2',
  'urlSubGambar3': 'url_sub_gambar_3',
  'dibuatPada': 'dibuat_pada',
  'diubahPada': 'diubah_pada',
  'idAcara': 'id_acara',
  'idPengguna': 'id_pengguna',
  'qrCode': 'qr_code',
  'idPembayaran': 'id_pembayaran',
  'metodePembayaran': 'metode_pembayaran',
  'statusBayar': 'status_bayar',
  'snapToken': 'snap_token'
};

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  let newContent = content;
  
  for (const [oldStr, newStr] of Object.entries(replacements)) {
    // We use a global regex for replacing all occurrences
    const regex = new RegExp(oldStr, 'g');
    newContent = newContent.replace(regex, newStr);
  }
  
  if (content !== newContent) {
    writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
