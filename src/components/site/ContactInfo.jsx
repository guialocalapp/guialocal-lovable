import React from 'react';
import { Phone, Mail, Globe } from 'lucide-react';

const ContactInfo = ({ ad }) => {
    const hasInfo = ad.phone || ad.email || ad.website;

    if (!hasInfo) {
        return null;
    }

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    };

    const handlePhoneClick = () => {
        if (ad.phone) {
            window.location.href = `tel:${ad.phone.replace(/\D/g, '')}`;
        }
    };

    const handleEmailClick = () => {
        if (ad.email) {
            window.location.href = `mailto:${ad.email}`;
        }
    };
    
    const handleWebsiteClick = () => {
        if (ad.website) {
            let url = ad.website;
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="space-y-3">
            {ad.phone && (
                <div 
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    onClick={handlePhoneClick}
                >
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{formatPhoneNumber(ad.phone)}</span>
                </div>
            )}
            {ad.email && (
                 <div 
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    onClick={handleEmailClick}
                >
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{ad.email}</span>
                </div>
            )}
            {ad.website && (
                <div 
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    onClick={handleWebsiteClick}
                >
                    <Globe className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{ad.website}</span>
                </div>
            )}
        </div>
    );
};

export default ContactInfo;