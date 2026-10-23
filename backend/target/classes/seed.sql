-- =========================================================================
-- Personal Finance & Budget Management System (PBFM) - Seed Data Script
-- =========================================================================

-- Clear existing data (handled by CASCADE in schema.sql, but safe here)
TRUNCATE TABLE risk_profiles, reminders, rewards, investments, goals, budgets, transactions, categories, accounts, users CASCADE;

-- 1. Seed Users (passwords are bcrypt hashes for 'Password@123')
INSERT INTO users (user_id, name, email, password_hash, currency_preference, role, created_by, updated_by) VALUES
('e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Muskan Kapri', 'kaprimuskan6@gmail.com', '$2a$10$mPTQNU.8FC.u9eKGwiziZ.wLPdyWWPtCmP0NWKAPdxyX00IUjRUOq', 'INR', 'ADMIN', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('ac314b8c-9dd5-4c31-a45f-c8a913dbd42a', 'Yash Kapri', 'yashkaprisj02591@sjhsicse.com', '$2a$10$U6mctRc/t/3X3MGVoZIrmePLfHnZAprXHcbWnkqG9lWU0Pj.HUiUe', 'INR', 'USER', 'SYSTEM', 'SYSTEM'),
('10278a9e-c76f-45d5-a9a1-b5c102f7b53b', 'Bhumika', 'bhumika@gmail.com', '$2a$10$mPTQNU.8FC.u9eKGwiziZ.wLPdyWWPtCmP0NWKAPdxyX00IUjRUOq', 'INR', 'USER', 'SYSTEM', 'SYSTEM'),
('c30e6c25-8f19-4a0f-81fb-d70d82473e74', 'Ananya Kanchan', 'ananyak123@gmail.com', '$2a$10$mPTQNU.8FC.u9eKGwiziZ.wLPdyWWPtCmP0NWKAPdxyX00IUjRUOq', 'INR', 'USER', 'SYSTEM', 'SYSTEM');

-- 2. Seed Accounts (balances start at 0.00, will be updated by transaction triggers)
INSERT INTO accounts (account_id, user_id, account_name, account_type, balance, created_by, updated_by) VALUES
('b0000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'HDFC Savings Account', 'SAVINGS', 0.00, 'SEED_SYSTEM', 'SEED_SYSTEM'),
('b0000000-0000-0000-0000-000000000002', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'ICICI Credit Card', 'CREDIT_CARD', 0.00, 'SEED_SYSTEM', 'SEED_SYSTEM'),
('eac0fb92-386b-4d76-9a66-1a984018e85f', 'ac314b8c-9dd5-4c31-a45f-c8a913dbd42a', 'Primary Savings', 'SAVINGS', 0.00, 'SYSTEM', 'SYSTEM'),
('70205773-231a-4127-85ea-23ee0bffe46f', 'ac314b8c-9dd5-4c31-a45f-c8a913dbd42a', 'Cash Wallet', 'CASH', 0.00, 'SYSTEM', 'SYSTEM');

-- 3. Seed Categories
INSERT INTO categories (category_id, user_id, category_name, type, created_by, updated_by) VALUES
('c0000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Salary', 'INCOME', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('c0000000-0000-0000-0000-000000000002', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Housing', 'EXPENSE', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('c0000000-0000-0000-0000-000000000003', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Groceries', 'EXPENSE', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('c0000000-0000-0000-0000-000000000004', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Shopping', 'EXPENSE', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('c0000000-0000-0000-0000-000000000005', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Utilities', 'EXPENSE', 'SEED_SYSTEM', 'SEED_SYSTEM');

-- 4. Seed Budgets (limit_amount in currency preference)
INSERT INTO budgets (budget_id, user_id, category_id, limit_amount, period, start_date, end_date, created_by, updated_by) VALUES
('d0000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'c0000000-0000-0000-0000-000000000003', 15000.00, 'MONTHLY', '2026-08-01', '2026-08-31', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('d0000000-0000-0000-0000-000000000002', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'c0000000-0000-0000-0000-000000000004', 10000.00, 'MONTHLY', '2026-08-01', '2026-08-31', 'SEED_SYSTEM', 'SEED_SYSTEM');

-- 5. Seed Goals (current_amount starts at 0.00, will be updated by investment triggers)
INSERT INTO goals (goal_id, user_id, goal_name, target_amount, current_amount, target_date, status, created_by, updated_by) VALUES
('e0000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Emergency Fund', 100000.00, 0.00, '2027-12-31', 'IN_PROGRESS', 'SEED_SYSTEM', 'SEED_SYSTEM');

-- 6. Seed Transactions (this will trigger updates on accounts.balance)
-- HDFC Savings Balance will become: 0 + 75000.00 (income) - 4500.00 (groceries) - 1200.00 (utilities) = 69300.00
-- ICICI Credit Card Balance will become: 0 - 2400.00 (shopping) = -2400.00
INSERT INTO transactions (transaction_id, user_id, account_id, category_id, amount, type, date, created_by, updated_by) VALUES
('f1000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 75000.00, 'INCOME', '2026-08-01 10:00:00+05:30', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('f1000000-0000-0000-0000-000000000002', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 4500.00, 'EXPENSE', '2026-08-02 14:30:00+05:30', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('f1000000-0000-0000-0000-000000000003', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 2400.00, 'EXPENSE', '2026-08-03 18:00:00+05:30', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('f1000000-0000-0000-0000-000000000004', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 1200.00, 'EXPENSE', '2026-08-04 09:15:00+05:30', 'SEED_SYSTEM', 'SEED_SYSTEM');

-- 7. Seed Investments (this will trigger updates on goals.current_amount)
INSERT INTO investments (investment_id, user_id, goal_id, type, amount, start_date, maturity_date, current_value, created_by, updated_by) VALUES
('f0000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'e0000000-0000-0000-0000-000000000001', 'MUTUAL_FUND', 20000.00, '2026-08-05', '2029-08-05', 21500.00, 'SEED_SYSTEM', 'SEED_SYSTEM');

-- 8. Seed Rewards
INSERT INTO rewards (reward_id, user_id, account_id, source_transaction_id, reward_type, amount, status, earned_date, expiry_date, redeemed_date, created_by, updated_by) VALUES
('fa000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'b0000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000003', 'CASHBACK_1_PERCENT', 24.00, 'EARNED', '2026-08-03', '2027-08-03', NULL, 'SEED_SYSTEM', 'SEED_SYSTEM');

-- 9. Seed Reminders
INSERT INTO reminders (reminder_id, user_id, title, related_type, related_id, due_date, status, created_by, updated_by) VALUES
('fb000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Review Grocery Monthly Budget limit', 'BUDGET', 'd0000000-0000-0000-0000-000000000001', '2026-08-25 09:00:00+05:30', 'PENDING', 'SEED_SYSTEM', 'SEED_SYSTEM'),
('fb000000-0000-0000-0000-000000000002', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 'Check Emergency Fund Mutual Fund Growth', 'INVESTMENT', 'f0000000-0000-0000-0000-000000000001', '2026-09-01 10:00:00+05:30', 'PENDING', 'SEED_SYSTEM', 'SEED_SYSTEM');

-- 10. Seed Risk Profiles
INSERT INTO risk_profiles (profile_id, user_id, risk_score, profile_type, created_by, updated_by) VALUES
('fc000000-0000-0000-0000-000000000001', 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3', 45, 'MODERATE', 'SEED_SYSTEM', 'SEED_SYSTEM');
