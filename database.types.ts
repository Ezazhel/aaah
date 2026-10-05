export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      authors: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string | null
          first_name: string | null
          id: string
          instagram_url: string | null
          last_name: string | null
          member_ship_expired_at: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          first_name?: string | null
          id: string
          instagram_url?: string | null
          last_name?: string | null
          member_ship_expired_at?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          first_name?: string | null
          id?: string
          instagram_url?: string | null
          last_name?: string | null
          member_ship_expired_at?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string
          created_at: string
          id: number
          name: string
          position: number
        }
        Insert: {
          color: string
          created_at?: string
          id?: never
          name: string
          position?: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: never
          name?: string
          position?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: number
          ip_hash: string
          last_name: string
          message: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: never
          ip_hash: string
          last_name: string
          message: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: never
          ip_hash?: string
          last_name?: string
          message?: string
          subject?: string
        }
        Relationships: []
      }
      game_authors: {
        Row: {
          author_id: string
          game_id: string
        }
        Insert: {
          author_id: string
          game_id: string
        }
        Update: {
          author_id?: string
          game_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_authors_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_mechanics: {
        Row: {
          game_id: string
          mechanic_id: number
        }
        Insert: {
          game_id: string
          mechanic_id: number
        }
        Update: {
          game_id?: string
          mechanic_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_mechanics_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_mechanics_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanics"
            referencedColumns: ["id"]
          },
        ]
      }
      game_reviews: {
        Row: {
          created_at: string
          decision: Database["public"]["Enums"]["game_status"]
          game_id: string
          id: string
          reason: string | null
          reviewer_id: string
        }
        Insert: {
          created_at?: string
          decision: Database["public"]["Enums"]["game_status"]
          game_id: string
          id?: string
          reason?: string | null
          reviewer_id?: string
        }
        Update: {
          created_at?: string
          decision?: Database["public"]["Enums"]["game_status"]
          game_id?: string
          id?: string
          reason?: string | null
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_reviews_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          age_threshold: number
          category_id: number | null
          created_at: string
          created_by: string
          description: string
          id: string
          max_players: number
          max_time_minutes: number
          min_players: number
          min_time_minutes: number
          name: string
          slug: string
          status: Database["public"]["Enums"]["game_status"]
        }
        Insert: {
          age_threshold: number
          category_id?: number | null
          created_at?: string
          created_by?: string
          description: string
          id?: string
          max_players: number
          max_time_minutes: number
          min_players: number
          min_time_minutes: number
          name: string
          slug?: string
          status?: Database["public"]["Enums"]["game_status"]
        }
        Update: {
          age_threshold?: number
          category_id?: number | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          max_players?: number
          max_time_minutes?: number
          min_players?: number
          min_time_minutes?: number
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["game_status"]
        }
        Relationships: [
          {
            foreignKeyName: "games_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      helloasso_orders: {
        Row: {
          created_at: string
          email: string
          order_id: number
        }
        Insert: {
          created_at?: string
          email: string
          order_id: number
        }
        Update: {
          created_at?: string
          email?: string
          order_id?: number
        }
        Relationships: []
      }
      mechanics: {
        Row: {
          bgg_id: number | null
          created_at: string
          id: number
          name: string
          status: Database["public"]["Enums"]["mechanic_status"]
          suggested_by: string | null
        }
        Insert: {
          bgg_id?: number | null
          created_at?: string
          id?: never
          name: string
          status?: Database["public"]["Enums"]["mechanic_status"]
          suggested_by?: string | null
        }
        Update: {
          bgg_id?: number | null
          created_at?: string
          id?: never
          name?: string
          status?: Database["public"]["Enums"]["mechanic_status"]
          suggested_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanics_suggested_by_fkey"
            columns: ["suggested_by"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_settings: {
        Row: {
          id: boolean
          start_day: number
          start_month: number
          updated_at: string
        }
        Insert: {
          id?: boolean
          start_day?: number
          start_month?: number
          updated_at?: string
        }
        Update: {
          id?: boolean
          start_day?: number
          start_month?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_authors: {
        Args: never
        Returns: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_admin: boolean
          last_name: string
          last_sign_in_at: string
          member_ship_expired_at: string
          slug: string
        }[]
      }
      admin_set_membership: {
        Args: { active: boolean; target: string }
        Returns: string
      }
      current_membership_period: {
        Args: never
        Returns: {
          ends_on: string
          starts_on: string
        }[]
      }
      helloasso_grant_membership: {
        Args: { p_email: string; p_first_name: string; p_last_name: string }
        Returns: string
      }
      is_active_member: { Args: { member_id?: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      set_game_mechanics: {
        Args: { game: string; mechanic_ids: number[] }
        Returns: undefined
      }
      slugify: { Args: { value: string }; Returns: string }
    }
    Enums: {
      app_role: "admin"
      game_status: "pending" | "approved" | "rejected"
      mechanic_status: "pending" | "approved"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin"],
      game_status: ["pending", "approved", "rejected"],
      mechanic_status: ["pending", "approved"],
    },
  },
} as const

