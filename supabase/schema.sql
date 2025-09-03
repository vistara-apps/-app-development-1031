-- Create tables for FanSpark application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  email TEXT,
  farcaster_id TEXT,
  base_wallet_address TEXT NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fans table
CREATE TABLE fans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  farcaster_id TEXT,
  base_wallet_address TEXT NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tiers table
CREATE TABLE tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly_usd DECIMAL(10, 2) NOT NULL,
  benefits JSONB DEFAULT '{"benefits": []}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tips table
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  fan_id UUID NOT NULL REFERENCES fans(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDC',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  fan_id UUID NOT NULL REFERENCES fans(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES tiers(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content table
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES tiers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  content_data TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_hash TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDC',
  transaction_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  notification_type TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_tiers_creator_id ON tiers(creator_id);
CREATE INDEX idx_tips_creator_id ON tips(creator_id);
CREATE INDEX idx_tips_fan_id ON tips(fan_id);
CREATE INDEX idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX idx_subscriptions_fan_id ON subscriptions(fan_id);
CREATE INDEX idx_subscriptions_tier_id ON subscriptions(tier_id);
CREATE INDEX idx_content_creator_id ON content(creator_id);
CREATE INDEX idx_content_tier_id ON content(tier_id);
CREATE INDEX idx_transactions_related_entity ON transactions(related_entity_type, related_entity_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, user_type);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_creators_modtime
BEFORE UPDATE ON creators
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_fans_modtime
BEFORE UPDATE ON fans
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_tiers_modtime
BEFORE UPDATE ON tiers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_tips_modtime
BEFORE UPDATE ON tips
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_subscriptions_modtime
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_content_modtime
BEFORE UPDATE ON content
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_transactions_modtime
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE fans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Creators can view and edit their own profiles
CREATE POLICY creators_self_access ON creators
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Fans can view and edit their own profiles
CREATE POLICY fans_self_access ON fans
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Anyone can view creator profiles
CREATE POLICY creators_public_view ON creators
  FOR SELECT USING (true);

-- Creators can manage their own tiers
CREATE POLICY tiers_creator_access ON tiers
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Anyone can view tiers
CREATE POLICY tiers_public_view ON tiers
  FOR SELECT USING (true);

-- Creators can view tips they've received
CREATE POLICY tips_creator_view ON tips
  FOR SELECT USING (creator_id = auth.uid());

-- Fans can view tips they've given
CREATE POLICY tips_fan_view ON tips
  FOR SELECT USING (fan_id = auth.uid());

-- Fans can create tips
CREATE POLICY tips_fan_insert ON tips
  FOR INSERT WITH CHECK (fan_id = auth.uid());

-- Creators can view their subscribers
CREATE POLICY subscriptions_creator_view ON subscriptions
  FOR SELECT USING (creator_id = auth.uid());

-- Fans can view their subscriptions
CREATE POLICY subscriptions_fan_view ON subscriptions
  FOR SELECT USING (fan_id = auth.uid());

-- Fans can create subscriptions
CREATE POLICY subscriptions_fan_insert ON subscriptions
  FOR INSERT WITH CHECK (fan_id = auth.uid());

-- Creators can manage their content
CREATE POLICY content_creator_access ON content
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Anyone can view public content
CREATE POLICY content_public_view ON content
  FOR SELECT USING (is_public = true);

-- Subscribers can view tier-gated content
CREATE POLICY content_subscriber_view ON content
  FOR SELECT USING (
    is_public = true OR
    (tier_id IS NOT NULL AND
     EXISTS (
       SELECT 1 FROM subscriptions
       WHERE subscriptions.fan_id = auth.uid()
         AND subscriptions.tier_id = content.tier_id
         AND subscriptions.status = 'active'
     ))
  );

-- Users can view their own transactions
CREATE POLICY transactions_user_view ON transactions
  FOR SELECT USING (
    from_address IN (
      SELECT base_wallet_address FROM creators WHERE id = auth.uid()
      UNION
      SELECT base_wallet_address FROM fans WHERE id = auth.uid()
    ) OR
    to_address IN (
      SELECT base_wallet_address FROM creators WHERE id = auth.uid()
      UNION
      SELECT base_wallet_address FROM fans WHERE id = auth.uid()
    )
  );

-- Users can view their own notifications
CREATE POLICY notifications_user_view ON notifications
  FOR SELECT USING (
    (user_type = 'creator' AND user_id = auth.uid()) OR
    (user_type = 'fan' AND user_id = auth.uid())
  );

-- Users can update their own notifications (mark as read)
CREATE POLICY notifications_user_update ON notifications
  FOR UPDATE USING (
    (user_type = 'creator' AND user_id = auth.uid()) OR
    (user_type = 'fan' AND user_id = auth.uid())
  )
  WITH CHECK (
    (user_type = 'creator' AND user_id = auth.uid()) OR
    (user_type = 'fan' AND user_id = auth.uid())
  );

