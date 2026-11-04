export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      categories: {
        Row: {
          color: string;
          created_at: string;
          id: number;
          name: string;
          position: number;
        };
        ComputedFields: never;
        Insert: {
          color: string;
          created_at?: string;
          id?: never;
          name: string;
          position?: number;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: never;
          name?: string;
          position?: number;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          first_name: string;
          id: number;
          ip_hash: string;
          last_name: string;
          message: string;
          subject: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          email: string;
          first_name: string;
          id?: never;
          ip_hash: string;
          last_name: string;
          message: string;
          subject: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: never;
          ip_hash?: string;
          last_name?: string;
          message?: string;
          subject?: string;
        };
        Relationships: [];
      };
      game_authors: {
        Row: {
          author_id: string;
          game_id: string;
        };
        ComputedFields: never;
        Insert: {
          author_id: string;
          game_id: string;
        };
        Update: {
          author_id?: string;
          game_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_authors_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_authors_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
        ];
      };
      game_mechanics: {
        Row: {
          game_id: string;
          mechanic_id: number;
        };
        ComputedFields: never;
        Insert: {
          game_id: string;
          mechanic_id: number;
        };
        Update: {
          game_id?: string;
          mechanic_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "game_mechanics_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_mechanics_mechanic_id_fkey";
            columns: ["mechanic_id"];
            isOneToOne: false;
            referencedRelation: "mechanics";
            referencedColumns: ["id"];
          },
        ];
      };
      game_reviews: {
        Row: {
          created_at: string;
          decision: Database["public"]["Enums"]["game_status"];
          game_id: string;
          id: string;
          reason: string | null;
          reviewer_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          decision: Database["public"]["Enums"]["game_status"];
          game_id: string;
          id?: string;
          reason?: string | null;
          reviewer_id?: string;
        };
        Update: {
          created_at?: string;
          decision?: Database["public"]["Enums"]["game_status"];
          game_id?: string;
          id?: string;
          reason?: string | null;
          reviewer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_reviews_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
        ];
      };
      games: {
        Row: {
          age_threshold: number;
          category_id: number | null;
          cover_updated_at: string | null;
          created_at: string;
          created_by: string;
          description: string;
          id: string;
          max_players: number;
          max_time_minutes: number;
          min_players: number;
          min_time_minutes: number;
          name: string;
          rules_updated_at: string | null;
          rules_video_url: string | null;
          slug: string;
          status: Database["public"]["Enums"]["game_status"];
        };
        ComputedFields: never;
        Insert: {
          age_threshold: number;
          category_id?: number | null;
          cover_updated_at?: string | null;
          created_at?: string;
          created_by?: string;
          description: string;
          id?: string;
          max_players: number;
          max_time_minutes: number;
          min_players: number;
          min_time_minutes: number;
          name: string;
          rules_updated_at?: string | null;
          rules_video_url?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["game_status"];
        };
        Update: {
          age_threshold?: number;
          category_id?: number | null;
          cover_updated_at?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string;
          id?: string;
          max_players?: number;
          max_time_minutes?: number;
          min_players?: number;
          min_time_minutes?: number;
          name?: string;
          rules_updated_at?: string | null;
          rules_video_url?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["game_status"];
        };
        Relationships: [
          {
            foreignKeyName: "games_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "games_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      helloasso_orders: {
        Row: {
          created_at: string;
          email: string;
          order_id: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          email: string;
          order_id: number;
        };
        Update: {
          created_at?: string;
          email?: string;
          order_id?: number;
        };
        Relationships: [];
      };
      inventory_items: {
        Row: {
          category: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          name: string;
        };
        ComputedFields: never;
        Insert: {
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_items_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_loans: {
        Row: {
          borrowed_at: string | null;
          borrower_id: string;
          created_at: string;
          decided_at: string | null;
          decided_by: string | null;
          decision_note: string | null;
          id: string;
          item_id: string;
          location_id: string;
          message: string | null;
          quantity: number;
          returned_at: string | null;
          status: Database["public"]["Enums"]["loan_status"];
        };
        ComputedFields: never;
        Insert: {
          borrowed_at?: string | null;
          borrower_id: string;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          decision_note?: string | null;
          id?: string;
          item_id: string;
          location_id: string;
          message?: string | null;
          quantity: number;
          returned_at?: string | null;
          status: Database["public"]["Enums"]["loan_status"];
        };
        Update: {
          borrowed_at?: string | null;
          borrower_id?: string;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          decision_note?: string | null;
          id?: string;
          item_id?: string;
          location_id?: string;
          message?: string | null;
          quantity?: number;
          returned_at?: string | null;
          status?: Database["public"]["Enums"]["loan_status"];
        };
        Relationships: [
          {
            foreignKeyName: "inventory_loans_borrower_id_fkey";
            columns: ["borrower_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_loans_decided_by_fkey";
            columns: ["decided_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_loans_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_loans_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "inventory_locations";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_locations: {
        Row: {
          address: string | null;
          created_at: string;
          description: string | null;
          id: string;
          manager_id: string;
          name: string;
        };
        ComputedFields: never;
        Insert: {
          address?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          manager_id?: string;
          name: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          manager_id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_locations_manager_id_fkey";
            columns: ["manager_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_movements: {
        Row: {
          actor_id: string | null;
          created_at: string;
          delta: number;
          id: number;
          item_id: string;
          loan_id: string | null;
          location_id: string;
          reason: Database["public"]["Enums"]["movement_reason"];
        };
        ComputedFields: never;
        Insert: {
          actor_id?: string | null;
          created_at?: string;
          delta: number;
          id?: never;
          item_id: string;
          loan_id?: string | null;
          location_id: string;
          reason: Database["public"]["Enums"]["movement_reason"];
        };
        Update: {
          actor_id?: string | null;
          created_at?: string;
          delta?: number;
          id?: never;
          item_id?: string;
          loan_id?: string | null;
          location_id?: string;
          reason?: Database["public"]["Enums"]["movement_reason"];
        };
        Relationships: [
          {
            foreignKeyName: "inventory_movements_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_movements_loan_id_fkey";
            columns: ["loan_id"];
            isOneToOne: false;
            referencedRelation: "inventory_loans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_movements_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "inventory_locations";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_stock: {
        Row: {
          available: number | null;
          item_id: string;
          location_id: string;
          quantity: number;
          reserved: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          available?: never;
          item_id: string;
          location_id: string;
          quantity?: number;
          reserved?: number;
          updated_at?: string;
        };
        Update: {
          available?: never;
          item_id?: string;
          location_id?: string;
          quantity?: number;
          reserved?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_stock_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_stock_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "inventory_locations";
            referencedColumns: ["id"];
          },
        ];
      };
      mechanics: {
        Row: {
          bgg_id: number | null;
          created_at: string;
          id: number;
          name: string;
          status: Database["public"]["Enums"]["mechanic_status"];
          suggested_by: string | null;
        };
        ComputedFields: never;
        Insert: {
          bgg_id?: number | null;
          created_at?: string;
          id?: never;
          name: string;
          status?: Database["public"]["Enums"]["mechanic_status"];
          suggested_by?: string | null;
        };
        Update: {
          bgg_id?: number | null;
          created_at?: string;
          id?: never;
          name?: string;
          status?: Database["public"]["Enums"]["mechanic_status"];
          suggested_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "mechanics_suggested_by_fkey";
            columns: ["suggested_by"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      members: {
        Row: {
          avatar_updated_at: string | null;
          created_at: string | null;
          description: string | null;
          first_name: string | null;
          id: string;
          instagram_url: string | null;
          last_name: string | null;
          member_ship_expired_at: string | null;
          slug: string | null;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          avatar_updated_at?: string | null;
          created_at?: string | null;
          description?: string | null;
          first_name?: string | null;
          id: string;
          instagram_url?: string | null;
          last_name?: string | null;
          member_ship_expired_at?: string | null;
          slug?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_updated_at?: string | null;
          created_at?: string | null;
          description?: string | null;
          first_name?: string | null;
          id?: string;
          instagram_url?: string | null;
          last_name?: string | null;
          member_ship_expired_at?: string | null;
          slug?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      membership_settings: {
        Row: {
          id: boolean;
          start_day: number;
          start_month: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          id?: boolean;
          start_day?: number;
          start_month?: number;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          start_day?: number;
          start_month?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_member_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_list_members: {
        Args: Record<PropertyKey, never>;
        Returns: {
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          last_sign_in_at: string;
          member_ship_expired_at: string;
          roles: Database["public"]["Enums"]["app_role"][];
          slug: string;
        }[];
      };
      admin_set_membership: { Args: { active: boolean; target: string }; Returns: string };
      can_edit_game_files: { Args: { object_name: string }; Returns: boolean };
      can_sign_in: { Args: Record<PropertyKey, never>; Returns: boolean };
      current_membership_period: {
        Args: Record<PropertyKey, never>;
        Returns: {
          ends_on: string;
          starts_on: string;
        }[];
      };
      has_role: {
        Args: { r: Database["public"]["Enums"]["app_role"]; uid?: string };
        Returns: boolean;
      };
      helloasso_grant_membership: {
        Args: { p_email: string; p_first_name: string; p_last_name: string };
        Returns: string;
      };
      inventory_cancel_loan: { Args: { p_loan: string }; Returns: undefined };
      inventory_decide_loan: {
        Args: { p_approve: boolean; p_loan: string; p_note?: string };
        Returns: undefined;
      };
      inventory_declare_borrow: {
        Args: { p_item: string; p_location: string; p_message?: string; p_quantity: number };
        Returns: string;
      };
      inventory_lock_available: {
        Args: { p_item: string; p_location: string; p_quantity: number };
        Returns: undefined;
      };
      inventory_lock_managed_loan: {
        Args: { p_loan: string };
        Returns: {
          borrowed_at: string | null;
          borrower_id: string;
          created_at: string;
          decided_at: string | null;
          decided_by: string | null;
          decision_note: string | null;
          id: string;
          item_id: string;
          location_id: string;
          message: string | null;
          quantity: number;
          returned_at: string | null;
          status: Database["public"]["Enums"]["loan_status"];
        };
        SetofOptions: {
          from: "*";
          to: "inventory_loans";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      inventory_mark_borrowed: { Args: { p_loan: string }; Returns: undefined };
      inventory_mark_returned: { Args: { p_loan: string }; Returns: undefined };
      inventory_notify_targets: {
        Args: { p_loan: string };
        Returns: {
          email: string;
          target: string;
        }[];
      };
      inventory_request_loan: {
        Args: { p_item: string; p_location: string; p_message?: string; p_quantity: number };
        Returns: string;
      };
      inventory_set_stock: {
        Args: { p_item: string; p_location: string; p_quantity: number };
        Returns: undefined;
      };
      is_active_author: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_active_member: { Args: { member_id?: string }; Returns: boolean };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_location_manager: { Args: { loc: string }; Returns: boolean };
      is_pending_invite: { Args: { p_email: string }; Returns: boolean };
      set_game_mechanics: { Args: { game: string; mechanic_ids: number[] }; Returns: undefined };
      slugify: { Args: { value: string }; Returns: string };
    };
    Enums: {
      app_role: "admin" | "author" | "location_manager";
      game_status: "pending" | "approved" | "rejected";
      loan_status: "pending" | "approved" | "rejected" | "cancelled" | "borrowed" | "returned";
      mechanic_status: "pending" | "approved";
      movement_reason: "adjustment" | "loan" | "return";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "author", "location_manager"],
      game_status: ["pending", "approved", "rejected"],
      loan_status: ["pending", "approved", "rejected", "cancelled", "borrowed", "returned"],
      mechanic_status: ["pending", "approved"],
      movement_reason: ["adjustment", "loan", "return"],
    },
  },
} as const;
