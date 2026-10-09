ALTER TABLE public.ai_packages
ADD COLUMN IF NOT EXISTS image_url TEXT;
