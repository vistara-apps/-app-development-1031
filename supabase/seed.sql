-- Seed data for FanSpark application

-- Insert sample creators
INSERT INTO creators (id, name, bio, email, base_wallet_address, profile_image_url)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Creator', 'Digital artist and NFT creator', 'john@example.com', '0x1234567890abcdef1234567890abcdef12345678', 'https://randomuser.me/api/portraits/men/1.jpg'),
  ('22222222-2222-2222-2222-222222222222', 'Sarah Writer', 'Author and content creator', 'sarah@example.com', '0x2345678901abcdef2345678901abcdef23456789', 'https://randomuser.me/api/portraits/women/2.jpg'),
  ('33333333-3333-3333-3333-333333333333', 'Mike Musician', 'Independent musician and producer', 'mike@example.com', '0x3456789012abcdef3456789012abcdef34567890', 'https://randomuser.me/api/portraits/men/3.jpg');

-- Insert sample fans
INSERT INTO fans (id, name, email, base_wallet_address, profile_image_url)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'Alice Fan', 'alice@example.com', '0x4567890123abcdef4567890123abcdef45678901', 'https://randomuser.me/api/portraits/women/4.jpg'),
  ('55555555-5555-5555-5555-555555555555', 'Bob Supporter', 'bob@example.com', '0x5678901234abcdef5678901234abcdef56789012', 'https://randomuser.me/api/portraits/men/5.jpg'),
  ('66666666-6666-6666-6666-666666666666', 'Carol Backer', 'carol@example.com', '0x6789012345abcdef6789012345abcdef67890123', 'https://randomuser.me/api/portraits/women/6.jpg');

-- Insert sample tiers for John Creator
INSERT INTO tiers (id, creator_id, name, description, price_monthly_usd, benefits)
VALUES
  ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Bronze', 'Basic membership tier', 5.00, '{"benefits": ["Early access to content", "Monthly Q&A session", "Exclusive community access"]}'),
  ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Silver', 'Mid-tier membership', 15.00, '{"benefits": ["All Bronze benefits", "Monthly digital artwork", "Name in credits", "Direct messaging"]}'),
  ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Gold', 'Premium membership tier', 30.00, '{"benefits": ["All Silver benefits", "Custom digital artwork", "1-on-1 video call monthly", "Input on future projects"]}');

-- Insert sample tiers for Sarah Writer
INSERT INTO tiers (id, creator_id, name, description, price_monthly_usd, benefits)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Reader', 'Basic reader tier', 3.00, '{"benefits": ["Early access to articles", "Monthly newsletter", "Reading recommendations"]}'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Bookworm', 'Enhanced reader tier', 8.00, '{"benefits": ["All Reader benefits", "Exclusive short stories", "Book club access", "Voting rights on next topics"]}'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Editor', 'Premium reader tier', 20.00, '{"benefits": ["All Bookworm benefits", "Manuscript previews", "Monthly writing workshop", "Acknowledgment in publications"]}');

-- Insert sample tips
INSERT INTO tips (id, creator_id, fan_id, amount, currency, message, status, transaction_hash)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 10.00, 'USDC', 'Love your work!', 'completed', '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 5.00, 'USDC', 'Great content as always', 'completed', '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 15.00, 'USDC', 'Your latest article was amazing', 'completed', '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab');

-- Insert sample subscriptions
INSERT INTO subscriptions (id, creator_id, fan_id, tier_id, start_date, end_date, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', NOW() - INTERVAL '30 days', NOW() + INTERVAL '30 days', 'active'),
  ('00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', 'active'),
  ('00000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days', 'expired');

-- Insert sample content
INSERT INTO content (id, creator_id, tier_id, title, content_type, content_data, is_public)
VALUES
  ('00000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', NULL, 'Welcome to My Creator Page', 'text', 'Hello everyone! This is my creator page where I''ll be sharing my digital art and NFT projects. Stay tuned for exclusive content!', true),
  ('00000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'Bronze Tier Exclusive: Creative Process', 'text', 'In this post, I''ll walk you through my creative process for digital art. I start with rough sketches and then...', false),
  ('00000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 'Silver Tier Exclusive: New Artwork Preview', 'image', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe', false),
  ('00000000-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', NULL, 'My Writing Journey', 'text', 'I''ve been writing for over 10 years now, and I wanted to share some insights about my journey as an author...', true),
  ('00000000-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Reader Tier: Upcoming Book Sneak Peek', 'text', 'Here''s an exclusive excerpt from my upcoming book. Chapter 1: The Beginning...', false),
  ('00000000-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bookworm Tier: Writing Resources', 'link', 'https://www.masterclass.com/classes/neil-gaiman-teaches-the-art-of-storytelling', false);

-- Insert sample transactions
INSERT INTO transactions (id, transaction_hash, from_address, to_address, amount, currency, transaction_type, status, related_entity_type, related_entity_id)
VALUES
  ('00000000-0000-0000-0000-00000000000a', '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', '0x4567890123abcdef4567890123abcdef45678901', '0x1234567890abcdef1234567890abcdef12345678', 10.00, 'USDC', 'tip', 'completed', 'tip', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('00000000-0000-0000-0000-00000000000b', '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a', '0x5678901234abcdef5678901234abcdef56789012', '0x1234567890abcdef1234567890abcdef12345678', 5.00, 'USDC', 'tip', 'completed', 'tip', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  ('00000000-0000-0000-0000-00000000000c', '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', '0x4567890123abcdef4567890123abcdef45678901', '0x2345678901abcdef2345678901abcdef23456789', 15.00, 'USDC', 'tip', 'completed', 'tip', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('00000000-0000-0000-0000-00000000000d', '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc', '0x4567890123abcdef4567890123abcdef45678901', '0x1234567890abcdef1234567890abcdef12345678', 15.00, 'USDC', 'subscription', 'completed', 'subscription', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-00000000000e', '0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd', '0x5678901234abcdef5678901234abcdef56789012', '0x1234567890abcdef1234567890abcdef12345678', 5.00, 'USDC', 'subscription', 'completed', 'subscription', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-00000000000f', '0xf1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde', '0x6789012345abcdef6789012345abcdef67890123', '0x2345678901abcdef2345678901abcdef23456789', 8.00, 'USDC', 'subscription', 'completed', 'subscription', '00000000-0000-0000-0000-000000000003');

-- Insert sample notifications
INSERT INTO notifications (id, user_id, user_type, title, message, is_read, notification_type, related_entity_type, related_entity_id)
VALUES
  ('00000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'creator', 'New Tip Received', 'You received a $10.00 tip from Alice Fan', false, 'tip', 'tip', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('00000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', 'creator', 'New Tip Received', 'You received a $5.00 tip from Bob Supporter', false, 'tip', 'tip', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  ('00000000-0000-0000-0000-000000000012', '22222222-2222-2222-2222-222222222222', 'creator', 'New Tip Received', 'You received a $15.00 tip from Alice Fan', false, 'tip', 'tip', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('00000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', 'creator', 'New Subscriber', 'Alice Fan subscribed to your Silver tier', false, 'subscription', 'subscription', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'creator', 'New Subscriber', 'Bob Supporter subscribed to your Bronze tier', false, 'subscription', 'subscription', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000015', '22222222-2222-2222-2222-222222222222', 'creator', 'New Subscriber', 'Carol Backer subscribed to your Bookworm tier', false, 'subscription', 'subscription', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000016', '44444444-4444-4444-4444-444444444444', 'fan', 'Subscription Activated', 'Your subscription to John Creator''s Silver tier is now active', false, 'subscription', 'subscription', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000017', '55555555-5555-5555-5555-555555555555', 'fan', 'Subscription Activated', 'Your subscription to John Creator''s Bronze tier is now active', false, 'subscription', 'subscription', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000018', '66666666-6666-6666-6666-666666666666', 'fan', 'Subscription Expired', 'Your subscription to Sarah Writer''s Bookworm tier has expired', false, 'subscription', 'subscription', '00000000-0000-0000-0000-000000000003');

