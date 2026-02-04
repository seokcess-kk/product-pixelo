// Supabase Database Types
// 실제 사용 시 supabase gen types typescript 명령으로 생성하세요.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          nickname: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nickname: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nickname?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seasons: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          grid_size: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          grid_size?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          grid_size?: number
          is_active?: boolean
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          content: string
          category: string
          season_id: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          category: string
          season_id: string
          order: number
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          category?: string
          season_id?: string
          order?: number
          created_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          user_id: string
          question_id: string
          content: string
          color_code: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          content: string
          color_code: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          content?: string
          color_code?: string
          created_at?: string
        }
      }
      pixels: {
        Row: {
          id: string
          user_id: string
          season_id: string
          answer_id: string
          x: number
          y: number
          color_code: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          season_id: string
          answer_id: string
          x: number
          y: number
          color_code: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          season_id?: string
          answer_id?: string
          x?: number
          y?: number
          color_code?: string
          created_at?: string
        }
      }
      friends: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string
          created_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          user_id: string
          target_user_id: string
          target_pixel_id: string | null
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_user_id: string
          target_pixel_id?: string | null
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_user_id?: string
          target_pixel_id?: string | null
          emoji?: string
          created_at?: string
        }
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
  }
}
