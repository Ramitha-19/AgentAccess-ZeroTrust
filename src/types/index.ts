export type UserRole = 'ADMIN' | 'HR_USER';

export type ActionType = 'READ' | 'UPDATE' | 'EXPORT' | 'DELETE';

export type DecisionType = 'ALLOW' | 'REQUIRE_APPROVAL' | 'DENY';

export type ApprovalStatus = 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AgentStatus = 'ACTIVE' | 'SUSPENDED' | 'REVIEW';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
}

export interface Agent {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  department: string;
  purpose: string;
  status: AgentStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  allowedResources: string[];
  allowedActions: ActionType[];
  restrictedActions: ActionType[];
  totalRequestsToday: number;
  lastActive: string;
  avatar: string;
  edgeKeyId: string;
  createdAt: string;
}

export interface EnterpriseResource {
  id: string;
  name: string;
  code: string;
  type: 'Relational Database' | 'Document Store' | 'Object Bucket' | 'API Gateway';
  sensitivity: 'Low' | 'Medium' | 'High' | 'Confidential' | 'Restricted';
  description: string;
  allowedAgents: string[];
  recordCount: string;
  status: 'Healthy' | 'Maintenance' | 'Locked';
  location: string;
}

export interface AuthorizationPolicy {
  id: string;
  name: string;
  agentId: string; // or '*' for any
  resourceId: string; // or '*' for any
  action: ActionType | '*';
  decision: DecisionType;
  maxRiskScore: number;
  requiresPurpose: boolean;
  active: boolean;
  description: string;
}

export interface RequestContextData {
  ip: string;
  location: string;
  timeOfDay: string;
  frequencyPerMin: number;
  deviceSession: string;
  networkType: 'Corporate VPN' | 'Direct Zero Trust' | 'Public Edge' | 'Unknown Proxy';
}

export interface RiskFactor {
  factor: string;
  points: number;
  explanation: string;
}

export interface AccessRequest {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  ownerName: string;
  ownerEmail: string;
  action: ActionType;
  resourceId: string;
  resourceName: string;
  purpose: string;
  context: RequestContextData;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  decision: DecisionType;
  policyId?: string;
  policyName?: string;
  approvalStatus: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  approvalNote?: string;
  approvalDetails?: { reviewedBy?: string; reviewedAt?: string; note?: string };
}

export interface EvaluationInput {
  agent: Agent;
  resource: EnterpriseResource;
  action: ActionType;
  purpose: string;
  context?: Partial<RequestContextData>;
  policies: AuthorizationPolicy[];
}

export interface EvaluationResult {
  decision: DecisionType;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  matchedPolicy?: AuthorizationPolicy;
  reason: string;
  request: AccessRequest;
  auditLog: AuditLog;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  requestId: string;
  agentName: string;
  ownerName: string;
  action: ActionType;
  resourceName: string;
  decision: DecisionType;
  riskScore: number;
  reason: string;
  hash: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'APPROVAL' | 'INFO' | 'VIOLATION';
  timestamp: string;
  read: boolean;
  requestId?: string;
}

export interface EvaluationStep {
  step: 'IDENT' | 'CONTEXT' | 'POLICY' | 'RISK' | 'DECISION';
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details: string;
  metadata?: Record<string, any>;
}
