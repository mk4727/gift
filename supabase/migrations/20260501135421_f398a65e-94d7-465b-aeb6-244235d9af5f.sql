-- Memory folders
CREATE TABLE public.folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  cover_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Memory images
CREATE TABLE public.images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Romantic messages/notices
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site settings (hero image, together-since date, secret letter, etc.)
CREATE TABLE public.settings (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.settings (key, value) VALUES
  ('hero_image', NULL),
  ('together_since', '2024-01-01'),
  ('secret_letter', 'My dearest love, every day with you feels like a beautiful dream I never want to wake up from. You are my home, my heart, my forever. ❤️'),
  ('hero_quote', 'Every moment with you is my favorite memory.');

-- Enable RLS
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read (this is a personal showcase site, public viewing is intended)
CREATE POLICY "Public can view folders" ON public.folders FOR SELECT USING (true);
CREATE POLICY "Public can view images" ON public.images FOR SELECT USING (true);
CREATE POLICY "Public can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);

-- No write policies: all writes go through the admin-action edge function (service role)

-- Storage bucket for memories
INSERT INTO storage.buckets (id, name, public) VALUES ('memories', 'memories', true);

CREATE POLICY "Public can view memory images" ON storage.objects
  FOR SELECT USING (bucket_id = 'memories');
-- Uploads happen through edge function using service role
