/**
 * Event Tracking System
 * Captures all user interactions with components and sends them to the backend
 * Users don't know they're teaching the system - it's completely transparent
 */

interface EventData {
  componentType: string;
  componentId: string;
  action: string;
  value?: any;
  metadata?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  context?: {
    route?: string;
    prevRoute?: string;
    screen?: { width: number; height: number };
    device?: string;
  };
}

class EventTracker {
  private sessionId: string;
  private userId?: string;
  private eventQueue: EventData[] = [];
  private flushInterval = 5000; // Send events every 5 seconds
  private maxQueueSize = 50; // Or when queue reaches 50 events
  private apiEndpoint = 'http://localhost:3001/api/events';

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    // Only start flush interval in browser environment
    if (typeof window !== 'undefined') {
      this.startFlushInterval();
      this.trackPageView();
    }
  }

  /**
   * Get or create a session ID
   */
  private getOrCreateSessionId(): string {
    // Check if running in browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    let sessionId = sessionStorage.getItem('generative_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('generative_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Set the user ID when a user logs in
   */
  public setUserId(userId: string) {
    this.userId = userId;
    localStorage.setItem('generative_user_id', userId);
  }

  /**
   * Track a component interaction
   */
  public track(
    componentType: string,
    componentId: string,
    action: string,
    value?: any,
    metadata?: Record<string, any>
  ) {
    const event: EventData = {
      componentType,
      componentId,
      action,
      value,
      metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId || localStorage.getItem('generative_user_id') || undefined,
      context: {
        route: window.location.pathname,
        prevRoute: document.referrer,
        screen: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        device: this.detectDevice(),
      },
    };

    this.eventQueue.push(event);

    // Flush if queue is full
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  /**
   * Detect device type
   */
  private detectDevice(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  /**
   * Track page view
   */
  private trackPageView() {
    this.track('navigation', 'page', 'view', window.location.pathname);
  }

  /**
   * Start the periodic flush interval
   */
  private startFlushInterval() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  /**
   * Send queued events to backend
   */
  private async flush() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
        keepalive: true, // Ensure requests complete even if page is closing
      });
    } catch (error) {
      console.error('Failed to send events:', error);
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Track custom event
   */
  public trackCustom(eventName: string, data?: Record<string, any>) {
    this.track('custom', eventName, 'trigger', data);
  }
}

// Singleton instance
export const eventTracker = new EventTracker();

/**
 * React Hook for easy component tracking
 */
export function useEventTracking(componentType: string, componentId: string) {
  return {
    track: (action: string, value?: any, metadata?: Record<string, any>) => {
      eventTracker.track(componentType, componentId, action, value, metadata);
    },
  };
}
