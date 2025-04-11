/** @format */

export const dbName = "pomodoro_timer";
export const objectStoreName = "pomodoro_sessions";

export type PomodoroSession = number[];
export type PomodoroSessions = PomodoroSession[];

export type DataType = PomodoroSession;

export interface DBSchema {
  id: string;
  data: DataType;
  created_at: number;
}
