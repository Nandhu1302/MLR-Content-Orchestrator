-- Create visual_assets table to store extracted visual elements from brand documents
CREATE TABLE IF NOT EXISTS public.visual_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  source_document_id UUID NOT NULL REFERENCES public.brand_documents(id) ON DELETE CASCADE,
  
  -- Visual classification
  visual_type TEXT NOT NULL CHECK (visual_type IN ('table', 'chart', 'graph', 'image', 'infographic', 'diagram')),
  title TEXT,
  caption TEXT,
  
  -- Source tracking
  source_section TEXT,
  source_page INTEGER,
  
  -- Visual data storage
  visual_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- For tables: structured data; For images: storage path
  visual_metadata JSONB DEFAULT '{}'::jsonb, -- Size, colors, footnotes, data source, etc.
  storage_path TEXT, -- Path in Supabase Storage for image files
  
  -- Context and usage
  applicable_contexts JSONB DEFAULT '[]'::jsonb, -- Array of contexts where this visual is relevant
  applicable_asset_types TEXT[] DEFAULT '{}',
  applicable_audiences TEXT[] DEFAULT '{}',
  
  -- Related evidence
  linked_claims UUID[] DEFAULT '{}',
  linked_references UUID[] DEFAULT '{}',
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- MLR approval
  mlr_approved BOOLEAN DEFAULT false,
  mlr_approved_by UUID,
  mlr_approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_visual_assets_brand_id ON public.visual_assets(brand_id);
CREATE INDEX idx_visual_assets_source_document_id ON public.visual_assets(source_document_id);
CREATE INDEX idx_visual_assets_visual_type ON public.visual_assets(visual_type);
CREATE INDEX idx_visual_assets_applicable_asset_types ON public.visual_assets USING GIN(applicable_asset_types);

-- Enable RLS
ALTER TABLE public.visual_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view visual assets for accessible brands"
  ON public.visual_assets FOR SELECT
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can create visual assets for accessible brands"
  ON public.visual_assets FOR INSERT
  WITH CHECK (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Users can update visual assets for accessible brands"
  ON public.visual_assets FOR UPDATE
  USING (user_has_brand_access(auth.uid(), brand_id));

CREATE POLICY "Demo users can manage all visual assets"
  ON public.visual_assets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_demo_user = true
    )
  );

-- Create storage bucket for visual assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('visual-assets', 'visual-assets', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for visual assets
CREATE POLICY "Users can view visual assets for accessible brands"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'visual-assets' AND
    EXISTS (
      SELECT 1 FROM visual_assets va
      WHERE va.storage_path = storage.objects.name
      AND user_has_brand_access(auth.uid(), va.brand_id)
    )
  );

CREATE POLICY "Users can upload visual assets for accessible brands"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'visual-assets');

CREATE POLICY "Users can update visual assets for accessible brands"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'visual-assets');

CREATE POLICY "Demo users can manage all visual asset files"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'visual-assets' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.is_demo_user = true
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_visual_assets_updated_at
  BEFORE UPDATE ON public.visual_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();