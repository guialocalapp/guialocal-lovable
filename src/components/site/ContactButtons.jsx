import React from 'react';
import { Button } from '@/components/ui/button';
import { WhatsappLogo } from '@/components/icons/WhatsappLogo';
import { TelegramLogo } from '@/components/icons/TelegramLogo';

const ContactButtons = ({ ad }) => {
    const handleWhatsAppClick = () => {
        if (ad.whatsapp) {
            const phone = ad.whatsapp.replace(/\D/g, '');
            window.open(`https://wa.me/55${phone}`, '_blank');
        }
    };

    const handleTelegramClick = () => {
        if (ad.telegram) {
            window.open(`https://t.me/${ad.telegram}`, '_blank');
        }
    };

    const hasContact = ad.whatsapp || ad.telegram;

    if (!hasContact) {
        return null;
    }

    return (
        <div className="space-y-2">
            {ad.whatsapp && (
                <Button 
                    className="w-full bg-green-100 hover:bg-green-200 text-green-800 border border-green-200"
                    onClick={handleWhatsAppClick}
                >
                    <WhatsappLogo className="w-5 h-5 mr-2" />
                    Chat via WhatsApp
                </Button>
            )}
            {ad.telegram && (
                <Button 
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200"
                    onClick={handleTelegramClick}
                >
                    <TelegramLogo className="w-5 h-5 mr-2" />
                    Chat via Telegram
                </Button>
            )}
        </div>
    );
};

export default ContactButtons;