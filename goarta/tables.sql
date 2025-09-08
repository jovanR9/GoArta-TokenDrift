-- Table to store overall chat sessions
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Foreign key to a users table, can be NULL for guests
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- If you have a users table:
    -- CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Add an index for faster lookups by user
CREATE INDEX idx_conversations_user_id ON conversations(user_id);

-- Table to store individual messages for each conversation
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_type VARCHAR(4) NOT NULL CHECK (sender_type IN ('user', 'ai')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_conversation 
        FOREIGN KEY(conversation_id) 
        REFERENCES conversations(id) 
        ON DELETE CASCADE -- If a conversation is deleted, delete all its messages
);

-- Add an index for faster retrieval of messages for a conversation
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
