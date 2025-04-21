export interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'dev' | 'prod';
  usage: number;
  limits: number | null;
  created_at: string;
}

export interface FormData {
  name: string;
  type: 'dev' | 'prod';
  limitEnabled: boolean;
  limits: number | null;
  usage: number;
} 