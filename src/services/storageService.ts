import {
  Agent,
  EnterpriseResource,
  AuthorizationPolicy,
  AccessRequest,
  AuditLog,
  NotificationItem,
} from '../types';
import {
  INITIAL_AGENTS,
  INITIAL_RESOURCES,
  INITIAL_POLICIES,
  INITIAL_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

const STORAGE_KEYS = {
  AGENTS: 'agentaccess_agents_v1',
  RESOURCES: 'agentaccess_resources_v1',
  POLICIES: 'agentaccess_policies_v1',
  REQUESTS: 'agentaccess_requests_v1',
  AUDIT_LOGS: 'agentaccess_audit_logs_v1',
  NOTIFICATIONS: 'agentaccess_notifications_v1',
};

export class StorageService {
  public static loadAgents(): Agent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
      return data ? JSON.parse(data) : INITIAL_AGENTS;
    } catch {
      return INITIAL_AGENTS;
    }
  }

  public static saveAgents(agents: Agent[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    } catch {}
  }

  public static loadResources(): EnterpriseResource[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      return data ? JSON.parse(data) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  }

  public static saveResources(resources: EnterpriseResource[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } catch {}
  }

  public static loadPolicies(): AuthorizationPolicy[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POLICIES);
      return data ? JSON.parse(data) : INITIAL_POLICIES;
    } catch {
      return INITIAL_POLICIES;
    }
  }

  public static savePolicies(policies: AuthorizationPolicy[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));
    } catch {}
  }

  public static loadRequests(): AccessRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return data ? JSON.parse(data) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  }

  public static saveRequests(requests: AccessRequest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch {}
  }

  public static loadAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  public static saveAuditLogs(logs: AuditLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    } catch {}
  }

  public static loadNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  public static saveNotifications(notifs: NotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch {}
  }

  public static resetToDemoDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.AGENTS);
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.POLICIES);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  }
}
