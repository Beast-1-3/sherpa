// src/engine/sessionEngine.ts
// Centralized session timeline — single clock drives all UI updates

import { DEMO_SCRIPT, type ScriptEvent } from '../data/demoScript';
import { getInitialPDFields, type PDField } from '../data/pdFieldSchema';

export type SessionStatus = 'idle' | 'live' | 'paused' | 'ended';

export interface TranscriptMessage {
  eventId: string;
  timeMs: number;
  speaker: 'SM' | 'Borrower' | 'System';
  text: string;
  causedFieldUpdate: boolean;
}

export type NudgePriority = 'High' | 'Medium' | 'Low';
export type AlertSeverity = 'info' | 'warning' | 'high';

export interface NudgeItem {
  id: string;
  title: string;
  text: string;
  questionTag: string;
  priority: NudgePriority;
  timestamp: number;
  dismissed: boolean;
  resolved: boolean;
}

export interface AlertItem {
  id: string;
  title: string;
  text: string;
  severity: AlertSeverity;
  basedOn: string;
  timestamp: number;
  resolved: boolean;
  dismissed: boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  text: string;
  type: string;
  priority: NudgePriority;
  status: 'Open' | 'Live' | 'Resolved';
  owner: string;
  trigger: string;
  description: string;
  timestamp: number;
  completed: boolean;
}

export interface SessionState {
  status: SessionStatus;
  elapsedMs: number;
  speed: 1 | 2;
  transcript: TranscriptMessage[];
  fields: PDField[];
  nudges: NudgeItem[];
  alerts: AlertItem[];
  actions: ActionItem[];
  processedEventIds: Set<string>;
  scriptComplete: boolean;
}

export type SessionStateListener = (state: SessionState) => void;

function deepCloneFields(fields: PDField[]): PDField[] {
  return fields.map(f => ({ ...f }));
}

function applyEvent(state: SessionState, event: ScriptEvent): SessionState {
  const newState = { ...state };
  newState.transcript = [...state.transcript];
  newState.fields = deepCloneFields(state.fields);
  newState.nudges = [...state.nudges];
  newState.alerts = [...state.alerts];
  newState.actions = [...state.actions];
  newState.processedEventIds = new Set(state.processedEventIds);

  // Skip already-processed events
  if (newState.processedEventIds.has(event.id)) return state;
  newState.processedEventIds.add(event.id);

  // Transcript message
  const causedFieldUpdate = !!(event.fieldUpdates && event.fieldUpdates.length > 0);
  const isSystem = event.id === 'evt_120';
  newState.transcript.push({
    eventId: event.id,
    timeMs: event.timeMs,
    speaker: isSystem ? 'System' : event.speaker,
    text: event.text,
    causedFieldUpdate,
  });

  // Field updates
  if (event.fieldUpdates) {
    for (const update of event.fieldUpdates) {
      const fieldIdx = newState.fields.findIndex(f => f.id === update.id);
      if (fieldIdx !== -1) {
        newState.fields[fieldIdx] = {
          ...newState.fields[fieldIdx],
          value: update.value,
          status: update.status,
          evidenceEventId: event.id,
          evidenceTimestamp: event.timeMs,
          evidenceText: event.text,
          ...(update.verificationNote ? { verificationNote: update.verificationNote } : {}),
        };
      }
    }
  }

  // Resolve nudge
  if (event.resolveNudgeId) {
    const nudgeIdx = newState.nudges.findIndex(n => n.id === event.resolveNudgeId);
    if (nudgeIdx !== -1) {
      newState.nudges[nudgeIdx] = { ...newState.nudges[nudgeIdx], resolved: true };
    }
  }

  // Resolve alert
  if (event.resolveAlertId) {
    const alertIdx = newState.alerts.findIndex(a => a.id === event.resolveAlertId);
    if (alertIdx !== -1) {
      newState.alerts[alertIdx] = { ...newState.alerts[alertIdx], resolved: true };
    }
  }

  // Add nudge
  if (event.nudge && !newState.nudges.find(n => n.id === event.nudge!.id)) {
    newState.nudges.push({
      id: event.nudge.id,
      title: event.nudge.title,
      text: event.nudge.text,
      questionTag: event.nudge.questionTag,
      priority: event.nudge.priority,
      timestamp: event.timeMs,
      dismissed: false,
      resolved: false,
    });
  }

  // Add alert
  if (event.alert && !newState.alerts.find(a => a.id === event.alert!.id)) {
    newState.alerts.push({
      id: event.alert.id,
      title: event.alert.title,
      text: event.alert.text,
      severity: event.alert.severity,
      basedOn: event.alert.basedOn,
      timestamp: event.timeMs,
      resolved: false,
      dismissed: false,
    });
  }

  // Add action
  if (event.action && !newState.actions.find(a => a.id === event.action!.id)) {
    newState.actions.push({
      id: event.action.id,
      title: event.action.title,
      text: event.action.description || event.action.title,
      type: event.action.type,
      priority: event.action.priority,
      status: 'Open',
      owner: event.action.owner,
      trigger: event.action.trigger,
      description: event.action.description,
      timestamp: event.timeMs,
      completed: false,
    });
  }

  // Script complete
  if (event.id === 'evt_120') {
    newState.scriptComplete = true;
  }

  return newState;
}

// Build state from scratch up to a given timeMs
function buildStateUpTo(targetMs: number): SessionState {
  let state: SessionState = {
    status: 'live',
    elapsedMs: targetMs,
    speed: 1,
    transcript: [],
    fields: getInitialPDFields(),
    nudges: [],
    alerts: [],
    actions: [],
    processedEventIds: new Set(),
    scriptComplete: false,
  };

  for (const event of DEMO_SCRIPT) {
    if (event.timeMs <= targetMs) {
      state = applyEvent(state, event);
    }
  }

  return state;
}

class SessionEngine {
  private state: SessionState;
  private listeners: Set<SessionStateListener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastTickTime: number | null = null;

  constructor() {
    this.state = this.makeIdleState();
  }

  private makeIdleState(): SessionState {
    return {
      status: 'idle',
      elapsedMs: 0,
      speed: 1,
      transcript: [],
      fields: getInitialPDFields(),
      nudges: [],
      alerts: [],
      actions: [],
      processedEventIds: new Set(),
      scriptComplete: false,
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  subscribe(listener: SessionStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  getState(): SessionState {
    return this.state;
  }

  start() {
    if (this.state.status === 'live') return;
    this.state = { ...this.makeIdleState(), status: 'live', speed: this.state.speed };
    this.state.fields = getInitialPDFields();
    this.lastTickTime = performance.now();
    this.startTicking();
    this.notify();
  }

  pause() {
    if (this.state.status !== 'live') return;
    this.stopTicking();
    this.state = { ...this.state, status: 'paused' };
    this.notify();
  }

  resume() {
    if (this.state.status !== 'paused') return;
    this.state = { ...this.state, status: 'live' };
    this.lastTickTime = performance.now();
    this.startTicking();
    this.notify();
  }

  restart() {
    this.stopTicking();
    const speed = this.state.speed;
    this.state = { ...this.makeIdleState(), speed };
    this.notify();
  }

  endSession() {
    this.stopTicking();
    let alerts = [...this.state.alerts];
    if (!alerts.some(a => a.id === 'alert_pd_closure')) {
      alerts.push({
        id: 'alert_pd_closure',
        title: 'PD Closure With Pending Fields',
        text: 'PD complete ho gayi hai. 40 mein se 24 fields captured hain aur 16 fields pending hain. Final review se pehle missing information collect karein.',
        severity: 'high',
        basedOn: 'PD Completion Status',
        timestamp: this.state.elapsedMs,
        resolved: false,
        dismissed: false,
      });
    }
    this.state = { ...this.state, status: 'ended', alerts };
    this.notify();
  }

  dismissAlert(id: string) {
    this.state = {
      ...this.state,
      alerts: this.state.alerts.map(a => a.id === id ? { ...a, dismissed: true } : a),
    };
    this.notify();
  }

  setSpeed(speed: 1 | 2) {
    this.state = { ...this.state, speed };
    this.notify();
  }

  jumpTo(targetMs: number) {
    this.stopTicking();
    const speed = this.state.speed;
    const newState = buildStateUpTo(targetMs);
    this.state = { ...newState, speed, status: 'live' };
    this.lastTickTime = performance.now();
    this.startTicking();
    this.notify();
  }

  private startTicking() {
    if (this.intervalId !== null) return;
    this.intervalId = setInterval(() => this.tick(), 100);
  }

  private stopTicking() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.lastTickTime = null;
  }

  private tick() {
    if (this.state.status !== 'live') {
      this.stopTicking();
      return;
    }

    const now = performance.now();
    const delta = this.lastTickTime !== null ? (now - this.lastTickTime) * this.state.speed : 0;
    this.lastTickTime = now;

    let newElapsed = this.state.elapsedMs + delta;
    // Cap at 2 minutes + small buffer
    if (newElapsed > 125000) newElapsed = 125000;

    let newState = { ...this.state, elapsedMs: newElapsed };

    // Process any due events
    for (const event of DEMO_SCRIPT) {
      if (event.timeMs <= newElapsed && !newState.processedEventIds.has(event.id)) {
        newState = applyEvent(newState, event);
      }
    }

    this.state = newState;
    this.notify();
  }
}

// Singleton
export const sessionEngine = new SessionEngine();
