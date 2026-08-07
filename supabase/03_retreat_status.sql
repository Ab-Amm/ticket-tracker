DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the exact name of the check constraint on the status column
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.engineers'::regclass AND contype = 'c';
    
    -- Drop it if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.engineers DROP CONSTRAINT ' || constraint_name;
    END IF;
END $$;

-- Recreate the constraint with 'retreat' included
ALTER TABLE public.engineers ADD CONSTRAINT engineers_status_check CHECK (status IN ('available', 'busy', 'offline', 'retreat'));