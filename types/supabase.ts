export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      acara: {
        Row: {
          deskripsi: string | null
          dibuat_pada: string
          diskon: number | null
          diubah_pada: string | null
          harga: number
          id: string
          judul: string
          kapasitas: number
          kategori: string | null
          lokasi: string
          nama_penyelenggara: string | null
          tanggal_mulai: string
          tanggal_selesai: string
          url_gambar: string | null
          url_maps: string | null
          url_sub_gambar_1: string | null
          url_sub_gambar_2: string | null
          url_sub_gambar_3: string | null
          waktu: string | null
        }
        Insert: {
          deskripsi?: string | null
          dibuat_pada?: string
          diskon?: number | null
          diubah_pada?: string | null
          harga?: number
          id?: string
          judul: string
          kapasitas?: number
          kategori?: string | null
          lokasi: string
          nama_penyelenggara?: string | null
          tanggal_mulai: string
          tanggal_selesai: string
          url_gambar?: string | null
          url_maps?: string | null
          url_sub_gambar_1?: string | null
          url_sub_gambar_2?: string | null
          url_sub_gambar_3?: string | null
          waktu?: string | null
        }
        Update: {
          deskripsi?: string | null
          dibuat_pada?: string
          diskon?: number | null
          diubah_pada?: string | null
          harga?: number
          id?: string
          judul?: string
          kapasitas?: number
          kategori?: string | null
          lokasi?: string
          nama_penyelenggara?: string | null
          tanggal_mulai?: string
          tanggal_selesai?: string
          url_gambar?: string | null
          url_maps?: string | null
          url_sub_gambar_1?: string | null
          url_sub_gambar_2?: string | null
          url_sub_gambar_3?: string | null
          waktu?: string | null
        }
        Relationships: []
      }
      banner: {
        Row: {
          deskripsi: string | null
          dibuat_pada: string
          diubah_pada: string
          id: string
          is_active: boolean
          judul: string
          tautan: string | null
          url_gambar: string
        }
        Insert: {
          deskripsi?: string | null
          dibuat_pada?: string
          diubah_pada: string
          id?: string
          is_active?: boolean
          judul: string
          tautan?: string | null
          url_gambar: string
        }
        Update: {
          deskripsi?: string | null
          dibuat_pada?: string
          diubah_pada?: string
          id?: string
          is_active?: boolean
          judul?: string
          tautan?: string | null
          url_gambar?: string
        }
        Relationships: []
      }
      event: {
        Row: {
          deskripsi: string
          dibuat_pada: string
          diskon: number | null
          diubah_pada: string
          harga: number
          id: string
          judul: string
          kapasitas: number
          kategori: string | null
          lokasi: string
          nama_penyelenggara: string
          tanggal_mulai: string
          tanggal_selesai: string
          url_gambar: string | null
          url_maps: string | null
          url_sub_gambar_1: string | null
          url_sub_gambar_2: string | null
          url_sub_gambar_3: string | null
        }
        Insert: {
          deskripsi: string
          dibuat_pada?: string
          diskon?: number | null
          diubah_pada: string
          harga: number
          id?: string
          judul: string
          kapasitas: number
          kategori?: string | null
          lokasi: string
          nama_penyelenggara?: string
          tanggal_mulai: string
          tanggal_selesai: string
          url_gambar?: string | null
          url_maps?: string | null
          url_sub_gambar_1?: string | null
          url_sub_gambar_2?: string | null
          url_sub_gambar_3?: string | null
        }
        Update: {
          deskripsi?: string
          dibuat_pada?: string
          diskon?: number | null
          diubah_pada?: string
          harga?: number
          id?: string
          judul?: string
          kapasitas?: number
          kategori?: string | null
          lokasi?: string
          nama_penyelenggara?: string
          tanggal_mulai?: string
          tanggal_selesai?: string
          url_gambar?: string | null
          url_maps?: string | null
          url_sub_gambar_1?: string | null
          url_sub_gambar_2?: string | null
          url_sub_gambar_3?: string | null
        }
        Relationships: []
      }
      notifikasi: {
        Row: {
          dibuat_pada: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string
        }
        Insert: {
          dibuat_pada?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id: string
        }
        Update: {
          dibuat_pada?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      pengguna: {
        Row: {
          dibuat_pada: string
          diubah_pada: string
          email: string
          id: string
          nama: string | null
          peran: string
        }
        Insert: {
          dibuat_pada?: string
          diubah_pada: string
          email: string
          id?: string
          nama?: string | null
          peran?: string
        }
        Update: {
          dibuat_pada?: string
          diubah_pada?: string
          email?: string
          id?: string
          nama?: string | null
          peran?: string
        }
        Relationships: []
      }
      tiket: {
        Row: {
          dibuat_pada: string
          diubah_pada: string
          id: string
          id_acara: string
          id_pembayaran: string | null
          id_pengguna: string
          metode_pembayaran: string | null
          qr_code: string
          snap_token: string | null
          status: string
          status_bayar: string | null
        }
        Insert: {
          dibuat_pada?: string
          diubah_pada: string
          id?: string
          id_acara: string
          id_pembayaran?: string | null
          id_pengguna: string
          metode_pembayaran?: string | null
          qr_code: string
          snap_token?: string | null
          status?: string
          status_bayar?: string | null
        }
        Update: {
          dibuat_pada?: string
          diubah_pada?: string
          id?: string
          id_acara?: string
          id_pembayaran?: string | null
          id_pengguna?: string
          metode_pembayaran?: string | null
          qr_code?: string
          snap_token?: string | null
          status?: string
          status_bayar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tiket_id_acara_fkey"
            columns: ["id_acara"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tiket_id_pengguna_fkey"
            columns: ["id_pengguna"]
            isOneToOne: false
            referencedRelation: "pengguna"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

