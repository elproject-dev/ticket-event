'use client';

import { useState, useTransition } from 'react';
import { MoreVertical, ShieldCheck, ShieldAlert, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { updateRole } from './actions';

interface StaffActionMenuProps {
  userId: string;
  initialRole: string;
}

export function StaffActionMenu({ userId, initialRole }: StaffActionMenuProps) {
  const [isPending, startTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState(false);
  const [targetRole, setTargetRole] = useState<string | null>(null);

  const handleSelectRole = (role: string) => {
    setTargetRole(role);
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (!targetRole) return;
    startTransition(async () => {
      await updateRole(userId, targetRole);
      setOpenDialog(false);
      setTargetRole(null);
    });
  };

  const getRoleDescription = () => {
    if (targetRole === 'staf') return 'Apakah Anda yakin ingin mengubah peran pengguna ini menjadi Staf?';
    if (targetRole === 'admin') return 'Apakah Anda yakin ingin mengubah peran pengguna ini menjadi Admin?';
    if (targetRole === 'pengguna') return 'Apakah Anda yakin ingin mengembalikan pengguna ini menjadi Pengguna Biasa?';
    return '';
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={isPending}
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 rounded-none"
        >
          <span className="sr-only">Buka menu</span>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-none">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ubah Peran</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {initialRole !== 'staf' && (
              <DropdownMenuItem
                onClick={() => handleSelectRole('staf')}
                disabled={isPending}
                className="cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" />
                Jadikan Staf
              </DropdownMenuItem>
            )}
            {initialRole !== 'admin' && (
              <DropdownMenuItem
                onClick={() => handleSelectRole('admin')}
                disabled={isPending}
                className="cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 mr-2 text-red-600" />
                Jadikan Admin
              </DropdownMenuItem>
            )}
            {initialRole !== 'pengguna' && (
              <DropdownMenuItem
                onClick={() => handleSelectRole('pengguna')}
                disabled={isPending}
                className="cursor-pointer text-muted-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Ubah ke Pengguna Biasa
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Perubahan Peran</AlertDialogTitle>
            <AlertDialogDescription>
              {getRoleDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              className="rounded-none bg-primary text-primary-foreground"
            >
              {isPending ? "Memproses..." : "Ya, Lanjutkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
