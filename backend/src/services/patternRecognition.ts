/**
 * Pattern Recognition Engine
 * Analyzes event sequences to identify behavioral patterns
 */

import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface Event {
  id: string;
  session_id: string;
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}

interface PatternRule {
  type: string;
  minOccurrences?: number;
  [key: string]: unknown;
}

interface PatternDefinition {
  id: string;
  name: string;
  type: string;
  rules: {
    sequence: PatternRule[];
    timeout: number;
  };
}

interface RecognizedPattern {
  id: string;
  sessionId: string;
  type: string;
  confidence: number;
  startTime: number;
  endTime: number;
  eventIds: string[];
  metadata: Record<string, unknown>;
}

/**
 * Pattern Recognition Engine
 * Uses rule-based matching to identify patterns in event sequences
 */
export class PatternRecognitionEngine {
  private definitions: PatternDefinition[] = [];
  
  constructor() {
    this.loadDefinitions();
  }
  
  /**
   * Load pattern definitions from database
   */
  private loadDefinitions(): void {
    try {
      const db = getDatabase();
      const rows = db.prepare(`
        SELECT * FROM pattern_definitions WHERE is_active = 1
      `).all();
      
      this.definitions = rows.map((row: any) => ({
        id: row.id as string,
        name: row.name as string,
        type: row.type as string,
        rules: JSON.parse(row.rules as string),
      }));
      
      logger.info(`Loaded ${this.definitions.length} pattern definitions`);
    } catch (error) {
      logger.error('Failed to load pattern definitions', { error: error instanceof Error ? error.message : String(error) });
    }
  }
  
  /**
   * Reload pattern definitions
   */
  public reloadDefinitions(): void {
    this.loadDefinitions();
  }
  
  /**
   * Analyze events for a session
   */
  public analyzeSession(sessionId: string): RecognizedPattern[] {
    const db = getDatabase();
    
    // Get events for session
    const eventRows = db.prepare(`
      SELECT * FROM events 
      WHERE session_id = ?
      ORDER BY timestamp ASC
    `).all(sessionId) as Record<string, unknown>[];
    
    const events: Event[] = eventRows.map(row => ({
      id: row.id as string,
      session_id: row.session_id as string,
      type: row.type as string,
      timestamp: row.timestamp as number,
      data: JSON.parse(row.data as string),
    }));
    
    if (events.length === 0) {
      return [];
    }
    
    const patterns: RecognizedPattern[] = [];
    
    // Try to match each pattern definition
    for (const definition of this.definitions) {
      const matches = this.findPatternMatches(events, definition);
      patterns.push(...matches);
    }
    
    // Save recognized patterns
    this.savePatterns(patterns);
    
    logger.info(`Recognized ${patterns.length} patterns for session ${sessionId}`);
    
    return patterns;
  }
  
  /**
   * Find all matches for a pattern definition in event sequence
   */
  private findPatternMatches(events: Event[], definition: PatternDefinition): RecognizedPattern[] {
    const { sequence, timeout } = definition.rules;
    const matches: RecognizedPattern[] = [];
    
    let i = 0;
    while (i < events.length) {
      const match = this.matchSequence(events, i, sequence, timeout);
      
      if (match) {
        const matchedEvents = match.events;
        const confidence = this.calculateConfidence(matchedEvents, definition);
        
        matches.push({
          id: uuidv4(),
          sessionId: events[0].session_id,
          type: definition.type,
          confidence,
          startTime: matchedEvents[0].timestamp,
          endTime: matchedEvents[matchedEvents.length - 1].timestamp,
          eventIds: matchedEvents.map(e => e.id),
          metadata: this.extractMetadata(matchedEvents, definition),
        });
        
        // Move past this match
        i = match.endIndex + 1;
      } else {
        i++;
      }
    }
    
    return matches;
  }
  
  /**
   * Try to match a sequence starting at a given index
   */
  private matchSequence(
    events: Event[],
    startIndex: number,
    sequence: PatternRule[],
    timeout: number
  ): { events: Event[]; endIndex: number } | null {
    const matchedEvents: Event[] = [];
    let currentIndex = startIndex;
    let sequenceIndex = 0;
    const startTime = events[startIndex].timestamp;
    
    while (sequenceIndex < sequence.length && currentIndex < events.length) {
      const event = events[currentIndex];
      const rule = sequence[sequenceIndex];
      
      // Check timeout
      if (event.timestamp - startTime > timeout) {
        return null;
      }
      
      if (this.matchesRule(event, rule)) {
        matchedEvents.push(event);
        
        // Handle minOccurrences
        if (rule.minOccurrences && rule.minOccurrences > 1) {
          let occurrences = 1;
          currentIndex++;
          
          while (
            currentIndex < events.length &&
            occurrences < rule.minOccurrences
          ) {
            if (events[currentIndex].timestamp - startTime > timeout) {
              return null;
            }
            
            if (this.matchesRule(events[currentIndex], rule)) {
              matchedEvents.push(events[currentIndex]);
              occurrences++;
            }
            currentIndex++;
          }
          
          if (occurrences < rule.minOccurrences) {
            return null;
          }
          
          sequenceIndex++;
          continue;
        }
        
        sequenceIndex++;
        currentIndex++;
      } else {
        // Allow non-matching events between sequence steps
        currentIndex++;
      }
    }
    
    // Check if we matched the entire sequence
    if (sequenceIndex < sequence.length) {
      return null;
    }
    
    return {
      events: matchedEvents,
      endIndex: currentIndex - 1,
    };
  }
  
  /**
   * Check if an event matches a rule
   */
  private matchesRule(event: Event, rule: PatternRule): boolean {
    // Check type
    if (rule.type && event.type !== rule.type) {
      return false;
    }
    
    // Check nested properties
    for (const [key, value] of Object.entries(rule)) {
      if (key === 'type' || key === 'minOccurrences') continue;
      
      if (!this.matchProperty(event.data, key, value as Record<string, unknown>)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Match a property value (supports nested paths and patterns)
   */
  private matchProperty(data: Record<string, unknown>, key: string, expected: Record<string, unknown>): boolean {
    const value = data[key];
    
    if (typeof expected === 'object' && expected !== null) {
      // Check for pattern matching
      if ('pattern' in expected) {
        const pattern = expected.pattern as string;
        const stringValue = String(value);
        
        // Simple pattern matching (supports * wildcard)
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return regex.test(stringValue);
      }
      
      // Recursive object matching
      if (typeof value === 'object' && value !== null) {
        for (const [nestedKey, nestedValue] of Object.entries(expected)) {
          if (!this.matchProperty(value as Record<string, unknown>, nestedKey, nestedValue as Record<string, unknown>)) {
            return false;
          }
        }
        return true;
      }
      
      return false;
    }
    
    return value === expected;
  }
  
  /**
   * Calculate confidence score for a matched pattern
   */
  private calculateConfidence(events: Event[], definition: PatternDefinition): number {
    const { sequence } = definition.rules;
    
    // Base confidence
    let confidence = 0.7;
    
    // Increase confidence if exact sequence length matches
    if (events.length === sequence.length) {
      confidence += 0.1;
    }
    
    // Increase confidence based on timing tightness
    if (events.length > 1) {
      const duration = events[events.length - 1].timestamp - events[0].timestamp;
      const avgInterval = duration / (events.length - 1);
      
      // Tighter timing = higher confidence
      if (avgInterval < 5000) confidence += 0.1;
      else if (avgInterval < 30000) confidence += 0.05;
    }
    
    // Cap at 1.0
    return Math.min(confidence, 1.0);
  }
  
  /**
   * Extract metadata from matched events
   */
  private extractMetadata(events: Event[], definition: PatternDefinition): Record<string, unknown> {
    const metadata: Record<string, unknown> = {
      patternType: definition.type,
      patternName: definition.name,
      eventCount: events.length,
      duration: events.length > 1
        ? events[events.length - 1].timestamp - events[0].timestamp
        : 0,
    };
    
    // Extract common properties from events
    for (const event of events) {
      // Extract entity information
      if (event.data.entityName) {
        metadata.entityName = event.data.entityName;
      }
      if (event.data.entityId) {
        metadata.entityId = event.data.entityId;
      }
      
      // Extract path information
      if (event.data.to) {
        metadata.path = event.data.to;
      }
      if (event.data.path) {
        metadata.path = event.data.path;
      }
      
      // Extract form fields
      if (event.data.fieldName) {
        if (!metadata.fields) {
          metadata.fields = [];
        }
        (metadata.fields as string[]).push(event.data.fieldName as string);
      }
      
      // Extract workflow info
      if (event.data.workflowName) {
        metadata.workflowName = event.data.workflowName;
      }
      if (event.data.currentStep !== undefined) {
        metadata.steps = metadata.steps || [];
        (metadata.steps as unknown[]).push(event.data.currentStep);
      }
    }
    
    // Deduplicate fields
    if (metadata.fields) {
      metadata.fields = [...new Set(metadata.fields as string[])];
    }
    
    return metadata;
  }
  
  /**
   * Save recognized patterns to database
   */
  private savePatterns(patterns: RecognizedPattern[]): void {
    if (patterns.length === 0) return;
    
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO patterns (id, session_id, type, confidence, start_time, end_time, event_ids, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertPatterns = db.transaction((patternList: RecognizedPattern[]) => {
      for (const pattern of patternList) {
        stmt.run(
          pattern.id,
          pattern.sessionId,
          pattern.type,
          pattern.confidence,
          pattern.startTime,
          pattern.endTime,
          JSON.stringify(pattern.eventIds),
          JSON.stringify(pattern.metadata)
        );
      }
    });
    
    insertPatterns(patterns);
  }
  
  /**
   * Analyze all unanalyzed sessions
   */
  public analyzeUnprocessedSessions(): void {
    const db = getDatabase();
    
    // Find sessions without patterns
    const sessions = db.prepare(`
      SELECT DISTINCT s.id
      FROM sessions s
      LEFT JOIN patterns p ON s.id = p.session_id
      WHERE p.id IS NULL AND s.event_count > 0
    `).all() as { id: string }[];
    
    logger.info(`Found ${sessions.length} unprocessed sessions`);
    
    for (const session of sessions) {
      try {
        this.analyzeSession(session.id);
      } catch (error) {
        logger.error(`Failed to analyze session ${session.id}`, { error });
      }
    }
  }
}

// Singleton instance
let engineInstance: PatternRecognitionEngine | null = null;

export function getPatternEngine(): PatternRecognitionEngine {
  if (!engineInstance) {
    engineInstance = new PatternRecognitionEngine();
  }
  return engineInstance;
}
