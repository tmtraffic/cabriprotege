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
      api_consultation_logs: {
        Row: {
          api_name: string
          created_at: string | null
          elapsed_time_ms: number | null
          error_message: string | null
          id: string
          price: number | null
          request_params: Json
          response_code: number | null
          response_data: Json | null
          response_message: string | null
          user_id: string | null
        }
        Insert: {
          api_name: string
          created_at?: string | null
          elapsed_time_ms?: number | null
          error_message?: string | null
          id?: string
          price?: number | null
          request_params: Json
          response_code?: number | null
          response_data?: Json | null
          response_message?: string | null
          user_id?: string | null
        }
        Update: {
          api_name?: string
          created_at?: string | null
          elapsed_time_ms?: number | null
          error_message?: string | null
          id?: string
          price?: number | null
          request_params?: Json
          response_code?: number | null
          response_data?: Json | null
          response_message?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_credentials: {
        Row: {
          api_token: string
          callback_secret: string | null
          created_at: string | null
          encryption_key: string
          id: string
          is_active: boolean | null
          service: string
          updated_at: string | null
        }
        Insert: {
          api_token: string
          callback_secret?: string | null
          created_at?: string | null
          encryption_key: string
          id?: string
          is_active?: boolean | null
          service?: string
          updated_at?: string | null
        }
        Update: {
          api_token?: string
          callback_secret?: string | null
          created_at?: string | null
          encryption_key?: string
          id?: string
          is_active?: boolean | null
          service?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deadlines: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string | null
          process_id: string
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string | null
          process_id: string
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string | null
          process_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          drive_file_id: string
          entity_id: string
          entity_type: string
          file_type: string | null
          id: string
          name: string
          owner_id: string
          size: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          drive_file_id: string
          entity_id: string
          entity_type: string
          file_type?: string | null
          id?: string
          name: string
          owner_id: string
          size?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          drive_file_id?: string
          entity_id?: string
          entity_type?: string
          file_type?: string | null
          id?: string
          name?: string
          owner_id?: string
          size?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      infosimples_requests: {
        Row: {
          created_at: string | null
          id: string
          protocol: string | null
          search_query: string
          search_type: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          protocol?: string | null
          search_query: string
          search_type: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          protocol?: string | null
          search_query?: string
          search_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "infosimples_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      infosimples_results: {
        Row: {
          created_at: string | null
          id: string
          request_id: string | null
          result_data: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          request_id?: string | null
          result_data?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          request_id?: string | null
          result_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "infosimples_results_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "infosimples_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      infosimples_searches: {
        Row: {
          client_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          response_data: Json | null
          search_params: Json
          search_type: string
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          response_data?: Json | null
          search_params: Json
          search_type: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          response_data?: Json | null
          search_params?: Json
          search_type?: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "infosimples_searches_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "infosimples_searches_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      infractions: {
        Row: {
          auto_number: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          points: number | null
          process_id: string | null
          status: string | null
          updated_at: string
          value: number
          vehicle_id: string
        }
        Insert: {
          auto_number?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          points?: number | null
          process_id?: string | null
          status?: string | null
          updated_at?: string
          value: number
          vehicle_id: string
        }
        Update: {
          auto_number?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          points?: number | null
          process_id?: string | null
          status?: string | null
          updated_at?: string
          value?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "infractions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          assigned_to: string | null
          client_id: string
          created_at: string
          description: string | null
          id: string
          infraction_id: string | null
          status: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          infraction_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          infraction_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "processes_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_infraction_id_fkey"
            columns: ["infraction_id"]
            isOneToOne: false
            referencedRelation: "infractions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          created_at: string
          created_by: string | null
          error_message: string | null
          id: string
          related_client_id: string | null
          related_vehicle_id: string | null
          response_data: Json | null
          result_data: Json | null
          search_params: Json | null
          search_query: string
          search_type: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          id?: string
          related_client_id?: string | null
          related_vehicle_id?: string | null
          response_data?: Json | null
          result_data?: Json | null
          search_params?: Json | null
          search_query: string
          search_type: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          id?: string
          related_client_id?: string | null
          related_vehicle_id?: string | null
          response_data?: Json | null
          result_data?: Json | null
          search_params?: Json | null
          search_query?: string
          search_type?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_history_related_client_id_fkey"
            columns: ["related_client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_history_related_vehicle_id_fkey"
            columns: ["related_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          category: string | null
          color: string | null
          created_at: string
          id: string
          model: string
          owner_id: string
          plate: string
          professional_use: boolean | null
          renavam: string | null
          updated_at: string
          vehicle_id: string | null
          year: number | null
        }
        Insert: {
          brand: string
          category?: string | null
          color?: string | null
          created_at?: string
          id?: string
          model: string
          owner_id: string
          plate: string
          professional_use?: boolean | null
          renavam?: string | null
          updated_at?: string
          vehicle_id?: string | null
          year?: number | null
        }
        Update: {
          brand?: string
          category?: string | null
          color?: string | null
          created_at?: string
          id?: string
          model?: string
          owner_id?: string
          plate?: string
          professional_use?: boolean | null
          renavam?: string | null
          updated_at?: string
          vehicle_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      app_role: "admin" | "employee" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "employee", "client"],
    },
  },
} as const
