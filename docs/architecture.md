# FanSpark Architecture

This document outlines the architecture of the FanSpark application, a Base MiniApp for creators to accept direct tips and offer tiered memberships from their audience.

## System Overview

FanSpark is built as a modern web application with blockchain integration. It follows a client-server architecture with the following components:

1. **Frontend**: Next.js application with React and TypeScript
2. **Backend**: Supabase for database and authentication
3. **Blockchain**: Base (Ethereum L2) for transactions
4. **Authentication**: Privy and Turnkey for wallet management
5. **Payment Processing**: Base (USDC) and Stripe (fiat fallback)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FanSpark Frontend                         │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Creator   │  │     Fan     │  │      Authentication     │  │
│  │  Dashboard  │  │ Experience  │  │    (Privy/Turnkey)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer                                 │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │  Supabase   │  │    Base     │  │   Turnkey   │  │ Stripe  │ │
│  │    API      │  │     RPC     │  │     API     │  │   API   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                                                                 │
└───────────┬───────────────────┬───────────────────┬─────────────┘
            │                   │                   │
            ▼                   ▼                   ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│                   │  │                   │  │                   │
│     Supabase      │  │       Base        │  │      Stripe       │
│     Database      │  │     Blockchain    │  │     Payment       │
│                   │  │                   │  │     Gateway       │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

## Component Descriptions

### Frontend Components

1. **Creator Dashboard**
   - Profile management
   - Tier management
   - Content management
   - Analytics and earnings

2. **Fan Experience**
   - Creator discovery
   - Subscription management
   - Tipping interface
   - Content consumption

3. **Authentication**
   - Wallet connection
   - Wallet creation
   - Session management
   - Protected routes

### API Layer

1. **Supabase API**
   - Database operations
   - User management
   - Content storage
   - Real-time subscriptions

2. **Base RPC**
   - Transaction processing
   - Balance checking
   - Smart contract interaction
   - Event listening

3. **Turnkey API**
   - Wallet management
   - Transaction signing
   - Key management
   - Security features

4. **Stripe API**
   - Fiat payment processing
   - Subscription management
   - Payment webhooks
   - Checkout sessions

### Backend Services

1. **Supabase Database**
   - PostgreSQL database
   - Row Level Security
   - Real-time capabilities
   - Edge functions

2. **Base Blockchain**
   - Ethereum L2 solution
   - USDC transactions
   - Low gas fees
   - Fast confirmations

3. **Stripe Payment Gateway**
   - Credit card processing
   - Subscription billing
   - Invoicing
   - Refund handling

## Data Flow

### Creator Onboarding Flow

1. Creator signs in using Farcaster ID or email via Privy
2. Creator connects their Base wallet or creates one via Turnkey
3. Creator profile is created in Supabase
4. Creator sets up membership tiers stored in Supabase
5. Creator adds content with access rules stored in Supabase

### Fan Tipping Flow

1. Fan views a creator's profile
2. Fan selects the 'Tip' option
3. Fan enters a custom amount or selects a preset
4. Fan confirms the transaction via their wallet
5. Transaction is processed on Base chain
6. Transaction record is stored in Supabase
7. Creator receives notification

### Fan Subscription Flow

1. Fan views a creator's profile and membership tiers
2. Fan selects a desired tier
3. Fan confirms the subscription (monthly USDC payment)
4. Transaction is processed on Base chain
5. Subscription record is created in Supabase
6. Fan gains access to tier-specific content
7. Automatic renewal process is initiated monthly

## Security Considerations

1. **Authentication Security**
   - Wallet-based authentication
   - Session management
   - JWT token validation

2. **Data Security**
   - Row Level Security in Supabase
   - Encrypted sensitive data
   - API rate limiting

3. **Transaction Security**
   - Secure wallet management with Turnkey
   - Transaction signing verification
   - Gas limit protections

4. **Content Security**
   - Access control for gated content
   - Subscription verification
   - Content encryption where necessary

## Scalability Considerations

1. **Database Scalability**
   - Supabase scaling capabilities
   - Connection pooling
   - Query optimization

2. **Frontend Scalability**
   - Static generation where possible
   - Edge caching
   - Code splitting

3. **Blockchain Scalability**
   - Base L2 scaling solutions
   - Batch transactions where possible
   - Optimistic updates

## Future Enhancements

1. **Mobile Application**
   - React Native implementation
   - Mobile wallet integration
   - Push notifications

2. **Enhanced Analytics**
   - Advanced creator analytics
   - Fan engagement metrics
   - Revenue forecasting

3. **Additional Payment Methods**
   - More cryptocurrency options
   - Alternative fiat payment methods
   - Cross-chain support

4. **Content Expansion**
   - Video content support
   - Live streaming integration
   - NFT-based memberships

