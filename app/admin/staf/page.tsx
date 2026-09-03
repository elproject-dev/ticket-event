import { prisma } from '@/lib/prisma';
import { RoleSelect } from './RoleSelect';
import { ShieldCheck, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function KelolaStafPage() {
  const users = await prisma.pengguna.findMany({
    where: {
      peran: {
        in: ['staf', 'admin']
      }
    },
    orderBy: { dibuat_pada: 'desc' }
  });

  return (
    <div className="p-4 pb-24">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-3 h-3 text-primary" />
          <h1 className="text-1x1 font-bold tracking-widest text-primary uppercase">Kelola Staf & Admin</h1>
        </div>

        <div className="bg-background border rounded-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 uppercase tracking-widest border-b">
                <tr>
                  <th className="p-3 font-bold">Nama</th>
                  <th className="p-3 font-bold">Email</th>
                  <th className="p-3 font-bold">No. Telp</th>
                  <th className="p-3 font-bold">Peran Saat Ini</th>
                  <th className="p-3 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.length > 0 ? users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      {user.nama || '-'}
                    </td>
                    <td className="p-3 text-muted-foreground">{user.email}</td>
                    <td className="p-3 text-muted-foreground">{user.no_telp || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 uppercase tracking-widest font-bold text-[8px] ${user.peran === 'admin' ? 'bg-red-600 text-white' :
                          user.peran === 'staf' ? 'bg-blue-600 text-white' :
                            'bg-muted text-muted-foreground'
                        }`}>
                        {user.peran}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <RoleSelect userId={user.id} initialRole={user.peran} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground border-dashed border">Belum ada pengguna</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
