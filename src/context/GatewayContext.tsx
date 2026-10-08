import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Agent,
  EnterpriseResource,
  AuthorizationPolicy,
  AccessRequest,
  AuditLog,
  NotificationItem,
  EvaluationInput,
  EvaluationResult,
  ActionType,
} from '../types';
import { StorageService } from '../services/storageService';
import { GatewayEngine } from '../services/gatewayService';

interface GatewayContextType {
  agents: Agent[];
  resources: EnterpriseResource[];
  policies: AuthorizationPolicy[];
  requests: AccessRequest[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  
  // Actions
  executeRequest: (input: Omit<EvaluationInput, 'policies'>) => EvaluationResult;
  approveRequest: (requestId: string, reviewerName: string, note?: string) => void;
  rejectRequest: (requestId: string, reviewerName: string, note?: string) => void;
  registerAgent: (agent: Omit<Agent, 'id' | 'createdAt' | 'edgeKeyId' | 'totalRequestsToday' | 'lastActive'>) => Agent;
  updateAgent: (agentId: string, partial: Partial<Agent>) => void;
  deleteAgent: (agentId: string) => void;
  createPolicy: (policy: Omit<AuthorizationPolicy, 'id'>) => AuthorizationPolicy;
  updatePolicy: (policyId: string, partial: Partial<AuthorizationPolicy>) => void;
  deletePolicy: (policyId: string) => void;
  createResource: (resource: Omit<EnterpriseResource, 'id'>) => EnterpriseResource;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  resetDemoData: () => void;
}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

export const GatewayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>(() => StorageService.loadAgents());
  const [resources, setResources] = useState<EnterpriseResource[]>(() => StorageService.loadResources());
  const [policies, setPolicies] = useState<AuthorizationPolicy[]>(() => StorageService.loadPolicies());
  const [requests, setRequests] = useState<AccessRequest[]>(() => StorageService.loadRequests());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.loadAuditLogs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.loadNotifications());

  // Persistence triggers
  useEffect(() => {
    StorageService.saveAgents(agents);
  }, [agents]);

  useEffect(() => {
    StorageService.saveResources(resources);
  }, [resources]);

  useEffect(() => {
    StorageService.savePolicies(policies);
  }, [policies]);

  useEffect(() => {
    StorageService.saveRequests(requests);
  }, [requests]);

  useEffect(() => {
    StorageService.saveAuditLogs(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  // Execute request through deterministic Gateway engine
  const executeRequest = (input: Omit<EvaluationInput, 'policies'>): EvaluationResult => {
    const result = GatewayEngine.evaluate({
      ...input,
      policies,
    });

    // 1. Add request to beginning
    setRequests((prev) => [result.request, ...prev]);

    // 2. Add audit log
    setAuditLogs((prev) => [result.auditLog, ...prev]);

    // 3. Update agent stats
    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id === input.agent.id) {
          return {
            ...ag,
            totalRequestsToday: ag.totalRequestsToday + 1,
            lastActive: 'Just now',
            riskScore: Math.round((ag.riskScore * 0.7) + (result.riskScore * 0.3)), // dynamic smoothed risk score
          };
        }
        return ag;
      })
    );

    // 4. Trigger alert notification if high risk, requirement for approval, or denial
    if (result.decision === 'REQUIRE_APPROVAL') {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Approval Required: ${input.agent.name}`,
        message: `${input.agent.name} requested ${input.action} on ${input.resource.name} (Risk: ${result.riskScore}).`,
        type: 'APPROVAL',
        timestamp: 'Just now',
        read: false,
        requestId: result.request.id,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    } else if (result.decision === 'DENY') {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Policy Violation Blocked`,
        message: `${input.agent.name} attempted ${input.action} on ${input.resource.name} (Blocked with Risk: ${result.riskScore}).`,
        type: 'VIOLATION',
        timestamp: 'Just now',
        read: false,
        requestId: result.request.id,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    return result;
  };

  const approveRequest = (requestId: string, reviewerName: string, note?: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    let targetReq: AccessRequest | undefined;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          targetReq = req;
          return {
            ...req,
            approvalStatus: 'APPROVED',
            decision: 'ALLOW',
            reviewedBy: reviewerName,
            reviewedAt: timestamp,
            approvalNote: note || 'Approved by authorized manager following risk review.',
          };
        }
        return req;
      })
    );

    if (targetReq) {
      const auditEntry: AuditLog = {
        id: `aud-${Date.now().toString().slice(-6)}`,
        timestamp,
        requestId,
        agentName: targetReq.agentName,
        ownerName: targetReq.ownerName,
        action: targetReq.action,
        resourceName: targetReq.resourceName,
        decision: 'ALLOW',
        riskScore: targetReq.riskScore,
        reason: `Dual-Custody Approval GRANTED by ${reviewerName}. Note: ${note || 'Operational requirement justified.'}`,
        hash: `0x${Math.random().toString(16).substring(2, 10)}...appr`,
      };
      setAuditLogs((prev) => [auditEntry, ...prev]);

      // Add info notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Request Approved: ${targetReq.id}`,
        message: `${reviewerName} approved ${targetReq.agentName}'s ${targetReq.action} on ${targetReq.resourceName}.`,
        type: 'INFO',
        timestamp: 'Just now',
        read: false,
        requestId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const rejectRequest = (requestId: string, reviewerName: string, note?: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    let targetReq: AccessRequest | undefined;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          targetReq = req;
          return {
            ...req,
            approvalStatus: 'REJECTED',
            decision: 'DENY',
            reviewedBy: reviewerName,
            reviewedAt: timestamp,
            approvalNote: note || 'Declined during human security review.',
          };
        }
        return req;
      })
    );

    if (targetReq) {
      const auditEntry: AuditLog = {
        id: `aud-${Date.now().toString().slice(-6)}`,
        timestamp,
        requestId,
        agentName: targetReq.agentName,
        ownerName: targetReq.ownerName,
        action: targetReq.action,
        resourceName: targetReq.resourceName,
        decision: 'DENY',
        riskScore: targetReq.riskScore,
        reason: `Dual-Custody Approval REJECTED by ${reviewerName}. Reason: ${note || 'Exfiltration risk deemed unacceptable.'}`,
        hash: `0x${Math.random().toString(16).substring(2, 10)}...rejc`,
      };
      setAuditLogs((prev) => [auditEntry, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Request Denied: ${targetReq.id}`,
        message: `${reviewerName} rejected ${targetReq.agentName}'s ${targetReq.action} on ${targetReq.resourceName}.`,
        type: 'ALERT',
        timestamp: 'Just now',
        read: false,
        requestId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const registerAgent = (
    agentData: Omit<Agent, 'id' | 'createdAt' | 'edgeKeyId' | 'totalRequestsToday' | 'lastActive'>
  ): Agent => {
    const id = `agent-${Date.now().toString().slice(-4)}`;
    const newAgent: Agent = {
      ...agentData,
      id,
      edgeKeyId: `cf-durable-agent-${id}-v1`,
      createdAt: new Date().toISOString().slice(0, 10),
      totalRequestsToday: 0,
      lastActive: 'Just registered',
    };
    setAgents((prev) => [newAgent, ...prev]);
    return newAgent;
  };

  const updateAgent = (agentId: string, partial: Partial<Agent>) => {
    setAgents((prev) =>
      prev.map((ag) => (ag.id === agentId ? { ...ag, ...partial } : ag))
    );
  };

  const deleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((ag) => ag.id !== agentId));
  };

  const createPolicy = (policyData: Omit<AuthorizationPolicy, 'id'>): AuthorizationPolicy => {
    const id = `pol-${Date.now().toString().slice(-5)}`;
    const newPolicy: AuthorizationPolicy = {
      ...policyData,
      id,
    };
    setPolicies((prev) => [newPolicy, ...prev]);
    return newPolicy;
  };

  const updatePolicy = (policyId: string, partial: Partial<AuthorizationPolicy>) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, ...partial } : p))
    );
  };

  const deletePolicy = (policyId: string) => {
    setPolicies((prev) => prev.filter((p) => p.id !== policyId));
  };

  const createResource = (resourceData: Omit<EnterpriseResource, 'id'>): EnterpriseResource => {
    const id = `res-${Date.now().toString().slice(-5)}`;
    const newResource: EnterpriseResource = {
      ...resourceData,
      id,
    };
    setResources((prev) => [...prev, newResource]);
    return newResource;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetDemoData = () => {
    StorageService.resetToDemoDefaults();
    setAgents(StorageService.loadAgents());
    setResources(StorageService.loadResources());
    setPolicies(StorageService.loadPolicies());
    setRequests(StorageService.loadRequests());
    setAuditLogs(StorageService.loadAuditLogs());
    setNotifications(StorageService.loadNotifications());
  };

  return (
    <GatewayContext.Provider
      value={{
        agents,
        resources,
        policies,
        requests,
        auditLogs,
        notifications,
        executeRequest,
        approveRequest,
        rejectRequest,
        registerAgent,
        updateAgent,
        deleteAgent,
        createPolicy,
        updatePolicy,
        deletePolicy,
        createResource,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        resetDemoData,
      }}
    >
      {children}
    </GatewayContext.Provider>
  );
};

export const useGateway = () => {
  const context = useContext(GatewayContext);
  if (!context) {
    throw new Error('useGateway must be used within GatewayProvider');
  }
  return context;
};
