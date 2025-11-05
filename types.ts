export enum PHASE {
    IDLE = 'IDLE',
    WORKOUT = 'WORKOUT',
    REST = 'REST',
    SUMMARY = 'SUMMARY'
};

export type WorkoutPhase = PHASE.IDLE | PHASE.WORKOUT | PHASE.REST | PHASE.SUMMARY;

export interface Set {
  duration: number;
}

export type EndSound = 'beep' | 'voice';

export interface AppSettings {
  restDuration: number;
  targetSets: number;
  endSound: EndSound;
}

export interface SavedWorkout {
  id: number;
  date: string;
  name: string;
  comment?: string;
  sets: Set[];
  totalWorkoutTime: number;
  totalSetTime: number;
  restDuration: number;
}