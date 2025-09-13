-- Seeding initial data for LuckyBirr
-- Insert default app settings
INSERT INTO app_settings (key, value) VALUES 
  ('commission_percentage', '10'),
  ('min_deposit_amount', '10'),
  ('max_deposit_amount', '10000'),
  ('min_withdrawal_amount', '50'),
  ('otp_expiry_minutes', '5')
ON CONFLICT (key) DO NOTHING;

-- Create admin user
INSERT INTO users (phone_number, username, email, is_verified, is_admin) VALUES 
  ('+251911234567', 'admin', 'admin@luckybirr.com', TRUE, TRUE)
ON CONFLICT (phone_number) DO NOTHING;

-- Create admin wallet
INSERT INTO wallets (user_id, balance) 
SELECT id, 0.00 FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

-- Create sample lottery pools
INSERT INTO lottery_pools (name, description, entry_fee, min_participants, max_participants, winner_count, created_by) 
SELECT 
  'Daily Lucky 50',
  'Join our daily lottery pool with 50 Birr entry fee. Winner takes 80% of the pool!',
  50.00,
  5,
  20,
  1,
  id
FROM users WHERE username = 'admin'
UNION ALL
SELECT 
  'Weekly Mega 100',
  'Weekly mega lottery with 100 Birr entry. Top 3 winners share the prize!',
  100.00,
  10,
  50,
  3,
  id
FROM users WHERE username = 'admin'
UNION ALL
SELECT 
  'Premium 200',
  'Premium lottery pool for high rollers. 200 Birr entry, massive prizes!',
  200.00,
  8,
  30,
  2,
  id
FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;
