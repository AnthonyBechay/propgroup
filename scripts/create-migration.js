#!/usr/bin/env node

// Migration helper - creates new migrations with templates
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const templates = {
  table: `-- Create table migration
CREATE TABLE IF NOT EXISTS public.TABLE_NAME (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.TABLE_NAME ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER set_updated_at_TABLE_NAME
    BEFORE UPDATE ON public.TABLE_NAME
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.TABLE_NAME
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.TABLE_NAME
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for owners" ON public.TABLE_NAME
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for owners" ON public.TABLE_NAME
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_TABLE_NAME_created_at ON public.TABLE_NAME(created_at DESC);

-- Grant permissions
GRANT ALL ON public.TABLE_NAME TO authenticated;
GRANT SELECT ON public.TABLE_NAME TO anon;
`,

  function: `-- Create function migration
CREATE OR REPLACE FUNCTION public.FUNCTION_NAME()
RETURNS RETURN_TYPE AS $$
BEGIN
    -- Function logic here
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.FUNCTION_NAME() TO authenticated;
`,

  policy: `-- Create RLS policy migration
CREATE POLICY "POLICY_NAME" ON public.TABLE_NAME
    FOR OPERATION
    TO ROLE
    USING (CONDITION)
    WITH CHECK (CONDITION);
`,

  index: `-- Create index migration
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_TABLE_NAME_COLUMN
    ON public.TABLE_NAME(COLUMN);

-- For composite index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_TABLE_NAME_multi
    ON public.TABLE_NAME(column1, column2);

-- For partial index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_TABLE_NAME_partial
    ON public.TABLE_NAME(column)
    WHERE condition;

-- For GIN index (for JSONB)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_TABLE_NAME_gin
    ON public.TABLE_NAME USING GIN(jsonb_column);

-- For GiST index (for geography)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_TABLE_NAME_gist
    ON public.TABLE_NAME USING GIST(geography_column);
`,

  alter: `-- Alter table migration
-- Add column
ALTER TABLE public.TABLE_NAME 
    ADD COLUMN IF NOT EXISTS column_name DATA_TYPE;

-- Modify column
ALTER TABLE public.TABLE_NAME 
    ALTER COLUMN column_name TYPE DATA_TYPE;

-- Add constraint
ALTER TABLE public.TABLE_NAME 
    ADD CONSTRAINT constraint_name CHECK (condition);

-- Add foreign key
ALTER TABLE public.TABLE_NAME 
    ADD CONSTRAINT fk_name 
    FOREIGN KEY (column_name) 
    REFERENCES other_table(id) 
    ON DELETE CASCADE;

-- Drop column
ALTER TABLE public.TABLE_NAME 
    DROP COLUMN IF EXISTS column_name;
`,

  trigger: `-- Create trigger migration
CREATE OR REPLACE FUNCTION public.trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Trigger logic here
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_name
    BEFORE INSERT OR UPDATE ON public.TABLE_NAME
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_function();
`,

  enum: `-- Create enum type migration
CREATE TYPE public.ENUM_NAME AS ENUM ('value1', 'value2', 'value3');

-- Use in table
ALTER TABLE public.TABLE_NAME 
    ADD COLUMN column_name ENUM_NAME DEFAULT 'value1';

-- Add value to existing enum (PostgreSQL 9.1+)
ALTER TYPE public.ENUM_NAME ADD VALUE 'new_value';
`,

  rollback: `-- Rollback migration
-- Drop table
DROP TABLE IF EXISTS public.TABLE_NAME CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS public.FUNCTION_NAME() CASCADE;

-- Drop policy
DROP POLICY IF EXISTS "POLICY_NAME" ON public.TABLE_NAME;

-- Drop index
DROP INDEX IF EXISTS idx_TABLE_NAME_COLUMN;

-- Drop trigger
DROP TRIGGER IF EXISTS trigger_name ON public.TABLE_NAME;

-- Drop type
DROP TYPE IF EXISTS public.ENUM_NAME CASCADE;
`
};

async function createMigration() {
  console.log('🔄 Supabase Migration Creator\n');
  
  // Get migration name
  const name = await question('Migration name (e.g., "add_user_preferences"): ');
  
  if (!name) {
    console.log('❌ Migration name is required');
    rl.close();
    return;
  }
  
  // Show template options
  console.log('\nAvailable templates:');
  Object.keys(templates).forEach((key, index) => {
    console.log(`  ${index + 1}. ${key}`);
  });
  console.log('  0. Empty migration\n');
  
  const choice = await question('Select template (0-8): ');
  const templateKeys = Object.keys(templates);
  const templateIndex = parseInt(choice) - 1;
  
  let content = '-- Migration: ' + name + '\n';
  
  if (templateIndex >= 0 && templateIndex < templateKeys.length) {
    const selectedTemplate = templateKeys[templateIndex];
    content += templates[selectedTemplate];
    
    // Replace placeholders
    const tableName = await question('Table name (if applicable): ');
    if (tableName) {
      content = content.replace(/TABLE_NAME/g, tableName);
    }
    
    if (selectedTemplate === 'function') {
      const functionName = await question('Function name: ');
      const returnType = await question('Return type (e.g., VOID, BOOLEAN, TABLE(...)): ');
      content = content.replace(/FUNCTION_NAME/g, functionName || 'function_name');
      content = content.replace(/RETURN_TYPE/g, returnType || 'VOID');
    }
  } else {
    content += '\n-- Write your migration here\n';
  }
  
  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const fileName = `${timestamp}_${name.toLowerCase().replace(/\s+/g, '_')}.sql`;
  const filePath = path.join(process.cwd(), 'supabase', 'migrations', fileName);
  
  // Ensure migrations directory exists
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  // Write migration file
  fs.writeFileSync(filePath, content);
  
  console.log(`\n✅ Migration created: ${fileName}`);
  console.log(`📁 Location: ${filePath}`);
  
  console.log('\nNext steps:');
  console.log('  1. Edit the migration file to add your changes');
  console.log('  2. Test locally: pnpm dlx supabase db reset');
  console.log('  3. Push to remote: pnpm dlx supabase db push');
  
  rl.close();
}

createMigration().catch(console.error);
