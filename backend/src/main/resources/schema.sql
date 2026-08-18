-- =========================================================================
-- Personal Finance & Budget Management System (PBFM) - Database Schema
-- Target Database: PostgreSQL 13
-- =========================================================================

-- 0. Enable pgcrypto extension to ensure gen_random_uuid() is loaded
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Drop existing tables if they exist (order respects foreign keys)
DROP TABLE IF EXISTS risk_profiles CASCADE;
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Drop existing custom types
DROP TYPE IF EXISTS account_type_enum CASCADE;
DROP TYPE IF EXISTS transaction_type_enum CASCADE;
DROP TYPE IF EXISTS budget_period_enum CASCADE;
DROP TYPE IF EXISTS goal_status_enum CASCADE;
DROP TYPE IF EXISTS investment_type_enum CASCADE;
DROP TYPE IF EXISTS reward_status_enum CASCADE;
DROP TYPE IF EXISTS reminder_status_enum CASCADE;
DROP TYPE IF EXISTS profile_type_enum CASCADE;

-- 3. Create Custom ENUM Types
CREATE TYPE account_type_enum AS ENUM ('SAVINGS', 'CHECKING', 'CREDIT_CARD', 'INVESTMENT', 'CASH');
CREATE TYPE transaction_type_enum AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE budget_period_enum AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
CREATE TYPE goal_status_enum AS ENUM ('IN_PROGRESS', 'ACHIEVED', 'FAILED');
CREATE TYPE investment_type_enum AS ENUM ('MUTUAL_FUND', 'STOCK', 'BOND', 'REAL_ESTATE', 'FIXED_DEPOSIT', 'OTHER');
CREATE TYPE reward_status_enum AS ENUM ('EARNED', 'REDEEMED', 'EXPIRED');
CREATE TYPE reminder_status_enum AS ENUM ('PENDING', 'COMPLETED', 'DISMISSED', 'OVERDUE');
CREATE TYPE profile_type_enum AS ENUM ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE');

-- 4. Shared Function for Auto-Updating updated_at Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =========================================================================
-- TABLE: users
-- =========================================================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    currency_preference VARCHAR(10) DEFAULT 'INR' NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: accounts
-- =========================================================================
CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_type account_type_enum NOT NULL,
    balance NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_accounts_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TRIGGER trg_accounts_updated_at
BEFORE UPDATE ON accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: categories
-- =========================================================================
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    type transaction_type_enum NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_categories_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_categories_user_name_type
        UNIQUE (user_id, category_name, type)
);

CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: transactions
-- =========================================================================
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    category_id UUID,
    amount NUMERIC(12,2) NOT NULL,
    type transaction_type_enum NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transactions_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transactions_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_transaction_amount
        CHECK (amount > 0.00)
);

CREATE TRIGGER trg_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: budgets
-- =========================================================================
CREATE TABLE budgets (
    budget_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    limit_amount NUMERIC(12,2) NOT NULL,
    period budget_period_enum NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_budgets_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_budgets_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_budget_limit
        CHECK (limit_amount > 0.00),

    CONSTRAINT chk_budget_dates
        CHECK (start_date <= end_date)
);

CREATE TRIGGER trg_budgets_updated_at
BEFORE UPDATE ON budgets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: goals
-- =========================================================================
CREATE TABLE goals (
    goal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    goal_name VARCHAR(100) NOT NULL,
    target_amount NUMERIC(12,2) NOT NULL,
    current_amount NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
    target_date DATE NOT NULL,
    status goal_status_enum DEFAULT 'IN_PROGRESS' NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_goals_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_goal_target
        CHECK (target_amount > 0.00),

    CONSTRAINT chk_goal_current
        CHECK (current_amount >= 0.00)
);

CREATE TRIGGER trg_goals_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: investments
-- =========================================================================
CREATE TABLE investments (
    investment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    goal_id UUID,
    type investment_type_enum NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    start_date DATE NOT NULL,
    maturity_date DATE,
    current_value NUMERIC(12,2) NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_investments_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_investments_goal
        FOREIGN KEY (goal_id)
        REFERENCES goals(goal_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_investment_amount
        CHECK (amount > 0.00),

    CONSTRAINT chk_investment_current_value
        CHECK (current_value >= 0.00),

    CONSTRAINT chk_investment_dates
        CHECK (maturity_date IS NULL OR start_date <= maturity_date)
);

CREATE TRIGGER trg_investments_updated_at
BEFORE UPDATE ON investments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: rewards
-- =========================================================================
CREATE TABLE rewards (
    reward_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    source_transaction_id UUID,
    reward_type VARCHAR(50) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status reward_status_enum DEFAULT 'EARNED' NOT NULL,
    earned_date DATE DEFAULT CURRENT_DATE NOT NULL,
    expiry_date DATE,
    redeemed_date DATE,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_rewards_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rewards_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rewards_transaction
        FOREIGN KEY (source_transaction_id)
        REFERENCES transactions(transaction_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_reward_amount
        CHECK (amount >= 0.00),

    CONSTRAINT chk_reward_dates
        CHECK (redeemed_date IS NULL OR earned_date <= redeemed_date)
);

CREATE TRIGGER trg_rewards_updated_at
BEFORE UPDATE ON rewards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: reminders
-- =========================================================================
CREATE TABLE reminders (
    reminder_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    related_type VARCHAR(30) NOT NULL,
    related_id UUID NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status reminder_status_enum DEFAULT 'PENDING' NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_reminders_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_reminder_related_type
        CHECK (related_type IN ('INVESTMENT', 'BUDGET', 'GOAL'))
);

CREATE TRIGGER trg_reminders_updated_at
BEFORE UPDATE ON reminders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- TABLE: risk_profiles
-- =========================================================================
CREATE TABLE risk_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    risk_score INT NOT NULL,
    profile_type profile_type_enum NOT NULL,
    
    -- Auditing columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Soft Delete Support
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_risk_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_risk_score
        CHECK (risk_score >= 0 AND risk_score <= 100)
);

CREATE TRIGGER trg_risk_profiles_updated_at
BEFORE UPDATE ON risk_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =========================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION (Foreign Keys & Common Search Fields)
-- =========================================================================
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_goal_id ON investments(goal_id);
CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_rewards_account_id ON rewards(account_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_reminders_polymorphic ON reminders(related_type, related_id);


-- =========================================================================
-- AUTOMATED TRIGGERS FOR BALANCES & GOAL PROGRESS
-- =========================================================================

-- 1. Trigger Function: Automatically Update Account Balance on Transaction changes
CREATE OR REPLACE FUNCTION fn_update_account_balance_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.type = 'INCOME') THEN
            UPDATE accounts SET balance = balance + NEW.amount WHERE account_id = NEW.account_id;
        ELSIF (NEW.type = 'EXPENSE') THEN
            UPDATE accounts SET balance = balance - NEW.amount WHERE account_id = NEW.account_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.type = 'INCOME') THEN
            UPDATE accounts SET balance = balance - OLD.amount WHERE account_id = OLD.account_id;
        ELSIF (OLD.type = 'EXPENSE') THEN
            UPDATE accounts SET balance = balance + OLD.amount WHERE account_id = OLD.account_id;
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Reverse old values
        IF (OLD.type = 'INCOME') THEN
            UPDATE accounts SET balance = balance - OLD.amount WHERE account_id = OLD.account_id;
        ELSIF (OLD.type = 'EXPENSE') THEN
            UPDATE accounts SET balance = balance + OLD.amount WHERE account_id = OLD.account_id;
        END IF;
        -- Apply new values
        IF (NEW.type = 'INCOME') THEN
            UPDATE accounts SET balance = balance + NEW.amount WHERE account_id = NEW.account_id;
        ELSIF (NEW.type = 'EXPENSE') THEN
            UPDATE accounts SET balance = balance - NEW.amount WHERE account_id = NEW.account_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_account_balance
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION fn_update_account_balance_on_transaction();


-- 2. Trigger Function: Automatically Update Goal current_amount on Investment changes
CREATE OR REPLACE FUNCTION fn_update_goal_progress_on_investment()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.goal_id IS NOT NULL) THEN
            UPDATE goals SET current_amount = current_amount + NEW.amount WHERE goal_id = NEW.goal_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.goal_id IS NOT NULL) THEN
            UPDATE goals SET current_amount = current_amount - OLD.amount WHERE goal_id = OLD.goal_id;
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Subtract old amount from old goal
        IF (OLD.goal_id IS NOT NULL) THEN
            UPDATE goals SET current_amount = current_amount - OLD.amount WHERE goal_id = OLD.goal_id;
        END IF;
        -- Add new amount to new goal
        IF (NEW.goal_id IS NOT NULL) THEN
            UPDATE goals SET current_amount = current_amount + NEW.amount WHERE goal_id = NEW.goal_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_goal_progress
AFTER INSERT OR UPDATE OR DELETE ON investments
FOR EACH ROW EXECUTE FUNCTION fn_update_goal_progress_on_investment();


-- 3. Trigger Function: Automatically Update Goal Status to 'ACHIEVED' if target met
CREATE OR REPLACE FUNCTION fn_check_goal_achievement()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.current_amount >= NEW.target_amount) THEN
        NEW.status = 'ACHIEVED';
    ELSE
        NEW.status = 'IN_PROGRESS';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_goal_achievement
BEFORE UPDATE OF current_amount ON goals
FOR EACH ROW EXECUTE FUNCTION fn_check_goal_achievement();
