"use client";

import { useState } from "react";
import { MoreVertical, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { makeStaff, makeAdmin } from "./actions";

interface UserActionMenuProps {
  userId: string;
  peran: string;
}

export function UserActionMenu({ userId, peran }: UserActionMenuProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [targetRole, setTargetRole] = useState<"staf" | "admin" | null>(null);

  const handleSelectRole = (role: "staf" | "admin") => {
    setTargetRole(role);
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    if (!targetRole) return;
    setIsUpdating(true);
    if (targetRole === "staf") {
      await makeStaff(userId);
    } else if (targetRole === "admin") {
      await makeAdmin(userId);
    }
    setIsUpdating(false);
    setOpenDialog(false);
    setTargetRole(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 rounded-none">
          <span className="sr-only">Buka menu</span>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-none">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ubah Peran</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleSelectRole("staf")}
              disabled={isUpdating}
              className="cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" />
              Jadikan Staf
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSelectRole("admin")}
              disabled={isUpdating}
              className="cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 mr-2 text-red-600" />
              Jadikan Admin
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Perubahan Peran</AlertDialogTitle>
            <AlertDialogDescription>
              {targetRole === "staf"
                ? "Apakah Anda yakin ingin menjadikan pengguna ini sebagai Staf?"
                : "Apakah Anda yakin ingin menjadikan pengguna ini sebagai Admin?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isUpdating}
              className="rounded-none bg-primary text-primary-foreground"
            >
              {isUpdating ? "Memproses..." : "Ya, Lanjutkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
