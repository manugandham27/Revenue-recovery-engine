# Database Schema

## Tables

### 1. users
- id (PK)
- username
- email
- role
- created_at
- updated_at

### 2. merchants
- id (PK)
- name
- contact_email
- created_at
- updated_at

### 3. customers
- id (PK)
- merchant_id (FK)
- customer_external_id
- historical_success_rate
- payment_frequency
- created_at
- updated_at

### 4. payments
- id (PK)
- transaction_id (unique)
- merchant_id (FK)
- customer_id (FK)
- amount
- currency
- timestamp
- payment_method
- status (success/failed)
- failure_code
- failure_reason
- retry_count
- invoice_info (JSON)
- created_at
- updated_at

### 5. payment_failures
- id (PK)
- payment_id (FK)
- failure_type
- failure_details
- occurred_at

### 6. recovery_predictions
- id (PK)
- payment_id (FK)
- recoverability_probability
- expected_recovery_value
- confidence
- model_version
- predicted_at

### 7. recovery_recommendations
- id (PK)
- payment_id (FK)
- root_cause
- reasoning_summary
- recommended_strategy
- confidence
- model_provider (LLM used)
- recommended_at

### 8. policy_decisions
- id (PK)
- payment_id (FK)
- recommended_strategy
- decision (allowed/blocked)
- reason
- rule_applied
- decided_at

### 9. recovery_actions
- id (PK)
- payment_id (FK)
- policy_decision_id (FK)
- action_type
- idempotency_key
- executed_at

### 10. recovery_outcomes
- id (PK)
- recovery_action_id (FK)
- action_succeeded
- revenue_recovered
- time_to_recovery
- attempts_made
- outcome_details
- occurred_at

### 11. human_reviews
- id (PK)
- payment_id (FK)
- ai_recommendation
- human_decision
- overridden_strategy
- reason
- reviewed_at
- reviewer_id (FK to users)

### 12. audit_logs
- id (PK)
- payment_id (FK)
- event_type
- event_data
- timestamp

### 13. experiments
- id (PK)
- name
- description
- start_date
- end_date
- status

### 14. experiment_results
- id (PK)
- experiment_id (FK)
- strategy
- sample_size
- recovery_rate
- revenue_recovered
- confidence_interval

### 15. model_runs
- id (PK)
- model_type
- version
- training_data_hash
- accuracy
- precision
- recall
- f1_score
- roc_auc
- created_at

## Relationships
- Payments belong to a merchant and customer
- Payment failures link to payments
- Predictions, recommendations, policy decisions, actions, and outcomes link to payments
- Human reviews link to payments and users
- Audit logs link to payments
- Experiment results link to experiments
- Model runs store metadata about each model training

## Notes
- All timestamps are in UTC
- JSON fields are used for flexible metadata
- Idempotency key is typically: payment.transaction_id + "_" + action_type
