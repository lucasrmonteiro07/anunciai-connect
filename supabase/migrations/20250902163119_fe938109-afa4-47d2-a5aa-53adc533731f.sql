-- Create storage bucket for service images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('services', 'services', true) 
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for service images
CREATE POLICY "Service images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'services');

CREATE POLICY "Users can upload their own service images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'services' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own service images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'services' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own service images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'services' AND auth.uid()::text = (storage.foldername(name))[1]);