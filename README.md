# FanSpark

FanSpark is a Base MiniApp that enables creators to accept direct tips and offer tiered memberships easily from their audience.

## Features

- **Direct Tipping**: Fans can send a specified amount of cryptocurrency (e.g., USDC on Base) directly to the creator's wallet.
- **Tiered Memberships**: Creators can define multiple membership tiers with varying benefits that fans can subscribe to.
- **Content Gating**: Unlock specific pieces of content (text, images, links) only for users who have subscribed to a particular membership tier.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: Privy for auth and wallet management
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Base (Ethereum L2), USDC for payments
- **Wallet Management**: Turnkey/Privy for embedded wallets

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Privy account
- Base RPC endpoint

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/fanspark.git
cd fanspark
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_BASE_RPC_URL=your_base_rpc_url
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Setup

1. Create a new Supabase project
2. Run the SQL scripts in the `supabase/schema.sql` file to set up the database schema
3. (Optional) Run the `supabase/seed.sql` file to populate the database with sample data

## Project Structure

```
fanspark/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── creators/         # Creator discovery and profiles
│   ├── dashboard/        # Creator dashboard
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── content/          # Content management components
│   ├── creators/         # Creator components
│   ├── dashboard/        # Dashboard components
│   ├── tiers/            # Membership tier components
│   ├── tipping/          # Tipping components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utility functions and API clients
│   ├── auth.ts           # Authentication utilities
│   ├── supabase.ts       # Supabase client and functions
│   ├── utils.ts          # General utilities
│   └── wallet.ts         # Wallet and blockchain utilities
├── providers/            # React context providers
│   └── AuthProvider.tsx  # Authentication provider
├── public/               # Static assets
├── supabase/             # Supabase configuration
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
└── types/                # TypeScript type definitions
```

## Features Implementation

### Authentication

FanSpark uses Privy for authentication and wallet management. Users can sign in with their email or connect their existing wallet. The application supports two user roles:

- **Creator**: Users who create content and receive tips/subscriptions
- **Fan**: Users who support creators through tips and subscriptions

### Direct Tipping

Fans can send USDC directly to creators through the tipping feature. The process is as follows:

1. Fan clicks the "Send Tip" button on a creator's profile
2. Fan enters the amount and an optional message
3. Fan confirms the transaction with their wallet
4. The transaction is processed on the Base chain
5. The tip is recorded in the database

### Tiered Memberships

Creators can define multiple membership tiers with different benefits and prices. Fans can subscribe to these tiers to access exclusive content and perks.

1. Creator creates membership tiers with names, descriptions, prices, and benefits
2. Fans can view available tiers on the creator's profile
3. Fans can subscribe to a tier by paying the monthly fee in USDC
4. Subscriptions are recorded in the database and automatically renewed

### Content Gating

Creators can publish content that is only accessible to subscribers of specific tiers:

1. Creator creates content (text, images, or links)
2. Creator specifies whether the content is public or exclusive to a specific tier
3. Fans can only view exclusive content if they have an active subscription to the required tier

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [Privy](https://privy.io/)
- [Base](https://base.org/)

