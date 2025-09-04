import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactInfoProps {
  serviceId: string;
  isOwner: boolean;
}

interface ContactData {
  phone?: string;
  email?: string;
  whatsapp?: string;
  owner_name?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ serviceId, isOwner }) => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadContactInfo = async () => {
    if (showContact || contactData) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_service_contact_info', {
        service_id: serviceId
      });

      if (error) {
        if (error.message.includes('Authentication required')) {
          toast.error('Faça login para ver as informações de contato');
          return;
        }
        throw error;
      }

      if (data && data.length > 0) {
        setContactData(data[0]);
        setShowContact(true);
      } else {
        toast.error('Informações de contato não encontradas');
      }
    } catch (error) {
      console.error('Erro ao carregar contato:', error);
      toast.error('Erro ao carregar informações de contato');
    } finally {
      setLoading(false);
    }
  };

  // Se for o dono do serviço, carrega os dados automaticamente
  useEffect(() => {
    if (isOwner && !contactData) {
      loadContactInfo();
    }
  }, [isOwner, contactData]);

  if (!showContact && !isOwner) {
    return (
      <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">
            Informações de contato protegidas
          </p>
          <Button 
            onClick={loadContactInfo}
            disabled={loading}
            size="sm"
          >
            {loading ? 'Carregando...' : 'Ver Contato'}
          </Button>
        </div>
      </div>
    );
  }

  if (!contactData && (loading || isOwner)) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-muted-foreground">
          Carregando informações de contato...
        </p>
      </div>
    );
  }

  if (!contactData && !loading) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-muted-foreground">
          Informações de contato não disponíveis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Informações de Contato</h3>
        {!isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowContact(false)}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid gap-3">
        {contactData?.owner_name && (
          <div className="text-sm">
            <span className="font-medium">Responsável: </span>
            {contactData.owner_name}
          </div>
        )}
        
        {contactData?.phone && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(`tel:${contactData?.phone}`, '_self')}
          >
            <Phone className="h-4 w-4 mr-2" />
            {contactData.phone}
          </Button>
        )}
        
        {contactData?.whatsapp && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(`https://wa.me/${contactData.whatsapp?.replace(/\D/g, '') || ''}`, '_blank')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp: {contactData.whatsapp}
          </Button>
        )}
        
        {contactData?.email && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(`mailto:${contactData?.email}`, '_self')}
          >
            <Mail className="h-4 w-4 mr-2" />
            {contactData.email}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;