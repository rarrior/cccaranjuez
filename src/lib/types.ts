export interface Member {
  id: string;
  name: string;
  seniority: string; // DATE: "YYYY-MM-DD"
  created_at: string;
}

export interface Season {
  id: string;
  year: number;
  is_active: boolean;
  created_at: string;
}

export interface Outing {
  id: string;
  season_id: string;
  date: string;
  description: string | null;
  created_at: string;
}

export interface Attendance {
  id: string;
  outing_id: string;
  member_id: string;
  completed: boolean;
  created_at: string;
}

export interface ClassificationRow {
  id: string;
  name: string;
  seniority: string;
  points: number;
  has_asterisk: boolean;
  asterisk_count: number;
  year: number;
}
