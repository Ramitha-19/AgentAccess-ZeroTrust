import {
  Agent,
  EnterpriseResource,
  AuthorizationPolicy,
  ActionType,
  DecisionType,
  RiskLevel,
  RiskFactor,
  AccessRequest,
  AuditLog,
  RequestContextData,
  EvaluationInput,
  EvaluationResult,
} from '../types';

export type { EvaluationInput, EvaluationResult };

export class GatewayEngine {
  /**
   * Deterministic evaluation of an AI Agent access request
   */
  public static evaluate(input: EvaluationInput): EvaluationResult {
    const { agent, resource, action, purpose, policies } = input;
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    // 1. Build normalized context
    const context: RequestContextData = {
      ip: input.context?.ip || '103.21.244.18',
      location: input.context?.location || 'Bengaluru, India',
      timeOfDay: input.context?.timeOfDay || 'Business Hours (IST)',
      frequencyPerMin: input.context?.frequencyPerMin || 4,
      deviceSession: input.context?.deviceSession || 'Managed Edge Node • Zero Trust v4.2',
      networkType: input.context?.networkType || 'Direct Zero Trust',
    };

    // 2. Risk factor analysis
    const riskFactors: RiskFactor[] = [];
    let baseScore = 0;

    // A. Action base risk
    switch (action) {
      case 'READ':
        baseScore += 12;
        riskFactors.push({
          factor: 'Read-Only Action',
          points: 12,
          explanation: 'Non-mutating read query on enterprise resource.',
        });
        break;
      case 'UPDATE':
        baseScore += 42;
        riskFactors.push({
          factor: 'State Mutation (UPDATE)',
          points: 42,
          explanation: 'Agent attempting in-place record modification.',
        });
        break;
      case 'EXPORT':
        baseScore += 58;
        riskFactors.push({
          factor: 'Bulk Data Exfiltration Vector (EXPORT)',
          points: 58,
          explanation: 'Agent attempting extraction of large enterprise datasets.',
        });
        break;
      case 'DELETE':
        baseScore += 88;
        riskFactors.push({
          factor: 'Destructive Erasure Action (DELETE)',
          points: 88,
          explanation: 'Permanent deletion risk against core transactional system.',
        });
        break;
    }

    // B. Resource Sensitivity risk
    switch (resource.sensitivity) {
      case 'Restricted':
        baseScore += 16;
        riskFactors.push({
          factor: 'Restricted Classification',
          points: 16,
          explanation: `Resource '${resource.name}' is highest tier restricted.`,
        });
        break;
      case 'Confidential':
        baseScore += 12;
        riskFactors.push({
          factor: 'Confidential Classification',
          points: 12,
          explanation: `Resource contains sensitive corporate or employee data.`,
        });
        break;
      case 'High':
        baseScore += 8;
        riskFactors.push({
          factor: 'High Sensitivity Asset',
          points: 8,
          explanation: `Elevated security controls apply to ${resource.name}.`,
        });
        break;
      case 'Medium':
      case 'Low':
        baseScore -= 4;
        riskFactors.push({
          factor: 'Standard Sensitivity Asset',
          points: -4,
          explanation: 'Baseline operational asset with relaxed isolation.',
        });
        break;
    }

    // C. Agent Status & Permissions Alignment
    const isResourceAllowed = agent.allowedResources.includes(resource.id);
    const isActionRestricted = agent.restrictedActions.includes(action);

    if (agent.status === 'SUSPENDED') {
      baseScore += 45;
      riskFactors.push({
        factor: 'Agent Account Suspended',
        points: 45,
        explanation: 'Identity is administratively locked pending security review.',
      });
    } else if (agent.status === 'REVIEW') {
      baseScore += 18;
      riskFactors.push({
        factor: 'Agent Under Behavioral Review',
        points: 18,
        explanation: 'Elevated anomaly rate detected on recent sessions.',
      });
    }

    if (!isResourceAllowed) {
      baseScore += 25;
      riskFactors.push({
        factor: 'Undeclared Resource Scope',
        points: 25,
        explanation: `Agent was not provisioned for ${resource.name}.`,
      });
    }

    if (isActionRestricted) {
      baseScore += 20;
      riskFactors.push({
        factor: 'Restricted Action Scope',
        points: 20,
        explanation: `Action '${action}' is in agent restricted actions registry.`,
      });
    }

    // D. Context factors (Velocity & Network)
    if (context.frequencyPerMin > 20) {
      baseScore += 15;
      riskFactors.push({
        factor: 'High Request Velocity Anomaly',
        points: 15,
        explanation: `Frequency (${context.frequencyPerMin} req/min) exceeds baseline.`,
      });
    }

    if (context.networkType === 'Public Edge' || context.networkType === 'Unknown Proxy') {
      baseScore += 20;
      riskFactors.push({
        factor: 'Untrusted Network Posture',
        points: 20,
        explanation: 'Request bypassed corporate Cloudflare Zero Trust tunnel.',
      });
    } else if (context.networkType === 'Direct Zero Trust') {
      baseScore -= 6;
      riskFactors.push({
        factor: 'Zero Trust Verified Session',
        points: -6,
        explanation: 'Hardware key mTLS posture verified by Cloudflare Edge.',
      });
    }

    // Purpose evaluation
    if (!purpose || purpose.trim().length < 10) {
      baseScore += 12;
      riskFactors.push({
        factor: 'Missing or Vague Justification Purpose',
        points: 12,
        explanation: 'Agent did not supply detailed semantic context for audit.',
      });
    }

    // Clamp score
    const finalRiskScore = Math.max(5, Math.min(99, Math.round(baseScore)));
    const riskLevel: RiskLevel =
      finalRiskScore >= 85
        ? 'CRITICAL'
        : finalRiskScore >= 60
        ? 'HIGH'
        : finalRiskScore >= 30
        ? 'MEDIUM'
        : 'LOW';

    // 3. Deterministic Policy Matching
    // Specific (agent, resource, action) -> Wildcard combinations -> Universal default
    const matchingPolicy = policies.find(
      (p) =>
        p.active &&
        (p.agentId === agent.id || p.agentId === '*') &&
        (p.resourceId === resource.id || p.resourceId === '*') &&
        (p.action === action || p.action === '*')
    );

    let decision: DecisionType = 'REQUIRE_APPROVAL';
    let reason = '';

    if (agent.status === 'SUSPENDED') {
      decision = 'DENY';
      reason = 'Agent account is suspended by CISO governance team.';
    } else if (action === 'DELETE') {
      decision = 'DENY';
      reason = 'Prohibited action: Universal Zero Trust policy prevents autonomous AI agents from deleting production databases.';
    } else if (matchingPolicy) {
      if (matchingPolicy.decision === 'DENY') {
        decision = 'DENY';
        reason = `Explicit policy '${matchingPolicy.name}' blocks ${action} on ${resource.name}.`;
      } else if (matchingPolicy.decision === 'REQUIRE_APPROVAL') {
        decision = 'REQUIRE_APPROVAL';
        reason = `Policy '${matchingPolicy.name}' mandates human supervisor approval for sensitive ${action} requests.`;
      } else {
        // Policy says ALLOW, but verify risk threshold
        if (finalRiskScore > matchingPolicy.maxRiskScore) {
          decision = 'REQUIRE_APPROVAL';
          reason = `Policy '${matchingPolicy.name}' allows ${action}, but calculated risk score (${finalRiskScore}) exceeded maximum threshold (${matchingPolicy.maxRiskScore}). Elevated to Human Approval.`;
        } else {
          decision = 'ALLOW';
          reason = `Policy '${matchingPolicy.name}' permits access. Context and risk score (${finalRiskScore}) are within permissible safety thresholds.`;
        }
      }
    } else {
      // No explicit policy match - default least privilege
      if (action === 'READ' && finalRiskScore < 40 && isResourceAllowed) {
        decision = 'ALLOW';
        reason = 'Default least-privilege allows verified low-risk read operations for registered owner agents.';
      } else if (finalRiskScore >= 75) {
        decision = 'DENY';
        reason = `No explicit policy authorized this operation and calculated risk score (${finalRiskScore}) is critically elevated.`;
      } else {
        decision = 'REQUIRE_APPROVAL';
        reason = `No explicit policy found for (${agent.name} + ${resource.name} + ${action}). Dual-custody approval required.`;
      }
    }

    const requestId = `req-${Date.now().toString().slice(-6)}`;
    const hexHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;

    const accessRequest: AccessRequest = {
      id: requestId,
      timestamp,
      agentId: agent.id,
      agentName: agent.name,
      ownerName: agent.ownerName,
      ownerEmail: agent.ownerEmail,
      action,
      resourceId: resource.id,
      resourceName: resource.name,
      purpose,
      context,
      riskScore: finalRiskScore,
      riskLevel,
      riskFactors,
      decision,
      policyId: matchingPolicy?.id,
      policyName: matchingPolicy?.name,
      approvalStatus: decision === 'REQUIRE_APPROVAL' ? 'PENDING' : 'NOT_REQUIRED',
    };

    const auditLog: AuditLog = {
      id: `aud-${Date.now().toString().slice(-6)}`,
      timestamp,
      requestId,
      agentName: agent.name,
      ownerName: agent.ownerName,
      action,
      resourceName: resource.name,
      decision,
      riskScore: finalRiskScore,
      reason,
      hash: hexHash,
    };

    return {
      decision,
      riskScore: finalRiskScore,
      riskLevel,
      riskFactors,
      matchedPolicy: matchingPolicy,
      reason,
      request: accessRequest,
      auditLog,
    };
  }
}
