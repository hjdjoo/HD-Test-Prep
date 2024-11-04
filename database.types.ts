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
      categories: {
        Row: {
          category: string | null
          id: number
        }
        Insert: {
          category?: string | null
          id: number
        }
        Update: {
          category?: string | null
          id?: number
        }
        Relationships: []
      }
      math_problems: {
        Row: {
          answer: string | null
          category: number | null
          id: number
          problem_type: number | null
          question: number | null
          tags: number[]
          test_form: string | null
        }
        Insert: {
          answer?: string | null
          category?: number | null
          id: number
          problem_type?: number | null
          question?: number | null
          tags?: number[]
          test_form?: string | null
        }
        Update: {
          answer?: string | null
          category?: number | null
          id?: number
          problem_type?: number | null
          question?: number | null
          tags?: number[]
          test_form?: string | null
        }
        Relationships: []
      }
      problem_types: {
        Row: {
          id: number
          problem_type: string | null
        }
        Insert: {
          id: number
          problem_type?: string | null
        }
        Update: {
          id?: number
          problem_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: number
          instructor_id: number | null
          name: string | null
          role: string | null
          uid: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          instructor_id?: number | null
          name?: string | null
          role?: string | null
          uid?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          instructor_id?: number | null
          name?: string | null
          role?: string | null
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      question_feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          image_url: string | null
          question_id: number | null
          student_id: number | null
          tutor_id: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          question_id?: number | null
          student_id?: number | null
          tutor_id?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          question_id?: number | null
          student_id?: number | null
          tutor_id?: number | null
        }
        Relationships: []
      }
      student_responses: {
        Row: {
          created_at: string
          feedback_id: number | null
          id: number
          question_id: number | null
          student_id: number | null
          student_rating: number | null
          tags: number | null
          time_taken: number | null
        }
        Insert: {
          created_at?: string
          feedback_id?: number | null
          id?: number
          question_id?: number | null
          student_id?: number | null
          student_rating?: number | null
          tags?: number | null
          time_taken?: number | null
        }
        Update: {
          created_at?: string
          feedback_id?: number | null
          id?: number
          question_id?: number | null
          student_id?: number | null
          student_rating?: number | null
          tags?: number | null
          time_taken?: number | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: number
          tag_name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          tag_name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          tag_name?: string | null
        }
        Relationships: []
      }
      tutors: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
