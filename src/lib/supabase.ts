
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          college_name: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          college_name: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          college_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      problem_sheets: {
        Row: {
          id: number
          user_id: string
          sheet_number: number
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          sheet_number: number
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          sheet_number?: number
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      problems: {
        Row: {
          id: number
          sheet_id: number
          title: string
          difficulty: 'easy' | 'medium' | 'hard'
          tags: string
          problem_url?: string
          notes?: string
          is_solved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          sheet_id: number
          title: string
          difficulty: 'easy' | 'medium' | 'hard'
          tags: string
          problem_url?: string
          notes?: string
          is_solved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          sheet_id?: number
          title?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          tags?: string
          problem_url?: string
          notes?: string
          is_solved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
