export const typeDefs = `#graphql
  enum ReimbursementCadence {
    daily
    weekly
    monthly
    yearly
  }

  enum MemberStatus {
    active
    removed
  }

  enum ActivityType {
    activity
    adjustment
  }

  enum ReimbursementStatus {
    pending
    processed
  }

  type ServiceProvider {
    service_provider_id: ID!
    name: String!
    reimbursement_cadence: ReimbursementCadence!
    reimbursement_percentage: Float!
    created_at: String!
  }

  type Member {
    member_id: ID!
    service_provider_id: Int!
    name: String!
    status: MemberStatus!
    registration_date: String!
    created_at: String!
    removed_at: String
  }

  type Activity {
    activity_id: ID!
    member_id: Int!
    reimbursement_id: Int
    activity_date: String!
    description: String
    activity_type: ActivityType!
    parent_activity_id: Int
    value: Float!
    created_at: String!
  }

  type Reimbursement {
    reimbursement_id: ID!
    service_provider_id: Int!
    cycle_start_date: String!
    cycle_end_date: String!
    total_activity_value: Float!
    reimbursed_amount: Float!
    status: ReimbursementStatus!
    created_at: String!
    processed_at: String
  }

  type Query {
    serviceProviderReimbursementStatus(datetime: String!): Reimbursement
  }

  input MemberInput {
    name: String!
    registration_date: String!
  }

  type Mutation {
    registerServiceProviderMembers(members: [MemberInput!]!): [Member]
  }
`;
