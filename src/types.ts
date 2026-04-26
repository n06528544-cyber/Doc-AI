
export type DocumentaryTone = 'investigative' | 'poetic' | 'nature' | 'historical' | 'true-crime' | 'biographical';

export interface ScriptParams {
  topic: string;
  tone: DocumentaryTone;
  duration: number; // in minutes
  narrativeStyle: 'narrator' | 'interview' | 'first-person';
  targetAudience: string;
}

export interface ScriptSegment {
  id: string;
  timeframe: string;
  narrator: string;
  visuals: string;
  sound: string;
}

export interface DocumentaryScript {
  title: string;
  logline: string;
  segments: ScriptSegment[];
}
