
-- Create notification_templates table
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    subject_template TEXT,
    body_template TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notification_logs table
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.notification_templates(id),
    recipient TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    context_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create updated_at trigger for notification_templates
DROP TRIGGER IF EXISTS set_notification_templates_updated_at ON public.notification_templates;
CREATE TRIGGER set_notification_templates_updated_at
BEFORE UPDATE ON public.notification_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on notification_templates
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS notification_templates_select_policy ON public.notification_templates;
DROP POLICY IF EXISTS notification_templates_insert_policy ON public.notification_templates;
DROP POLICY IF EXISTS notification_templates_update_policy ON public.notification_templates;
DROP POLICY IF EXISTS notification_templates_delete_policy ON public.notification_templates;

DROP POLICY IF EXISTS notification_logs_select_policy ON public.notification_logs;
DROP POLICY IF EXISTS notification_logs_insert_policy ON public.notification_logs;
DROP POLICY IF EXISTS notification_logs_update_policy ON public.notification_logs;

-- Create policies for notification_templates
-- Admin and staff can read templates
CREATE POLICY notification_templates_select_policy ON public.notification_templates 
    FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
        )
    );

-- Only admins can create, update, and delete templates
CREATE POLICY notification_templates_insert_policy ON public.notification_templates 
    FOR INSERT TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY notification_templates_update_policy ON public.notification_templates 
    FOR UPDATE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY notification_templates_delete_policy ON public.notification_templates 
    FOR DELETE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Create policies for notification_logs
-- Admin and staff can see all notification logs
CREATE POLICY notification_logs_select_policy ON public.notification_logs 
    FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
        )
    );

-- Admin and staff can insert notification logs
CREATE POLICY notification_logs_insert_policy ON public.notification_logs 
    FOR INSERT TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
        )
    );

-- Admin and staff can update notification logs
CREATE POLICY notification_logs_update_policy ON public.notification_logs 
    FOR UPDATE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
        )
    );

-- Insert some basic notification templates
INSERT INTO public.notification_templates (name, type, subject_template, body_template)
VALUES
    ('welcome_email', 'email', 'Bem-vindo à Cabricop!', 'Olá {{clientName}},\n\nBem-vindo à Cabricop! Estamos felizes em tê-lo como nosso cliente.\n\nAtenciosamente,\nEquipe Cabricop'),
    
    ('new_process_notification', 'email', 'Novo processo criado', 'Olá {{clientName}},\n\nUm novo processo do tipo {{processType}} foi criado para você.\n\nPara mais detalhes, entre em contato conosco.\n\nAtenciosamente,\nEquipe Cabricop'),
    
    ('process_update', 'email', 'Atualização no seu processo', 'Olá {{clientName}},\n\nSeu processo #{{processId}} foi atualizado para o status: {{processStatus}}.\n\nPara mais detalhes, entre em contato conosco.\n\nAtenciosamente,\nEquipe Cabricop'),
    
    ('deadline_reminder', 'email', 'Lembrete de prazo importante', 'Olá {{clientName}},\n\nEste é um lembrete sobre um prazo importante relacionado ao seu processo #{{processId}}:\n\nPrazo: {{deadlineTitle}}\nData: {{deadlineDate}}\n\nPor favor, entre em contato caso precise de assistência.\n\nAtenciosamente,\nEquipe Cabricop'),
    
    ('new_fine_alert', 'whatsapp', null, 'Olá {{clientName}}. Detectamos uma nova multa para o veículo {{vehiclePlate}}. Entre em contato para discutirmos as opções de recurso.');
