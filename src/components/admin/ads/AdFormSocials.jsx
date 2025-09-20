import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardDescription } from '@/components/ui/card';
import { Instagram, Facebook, Youtube, Linkedin, MessageCircle, X, Instagram as Pinterest, Clapperboard, Send } from 'lucide-react';

const socialFields = [
    { name: 'instagram', label: 'Instagram', placeholder: 'usuario', Icon: Instagram },
    { name: 'facebook', label: 'Facebook', placeholder: 'usuario', Icon: Facebook },
    { name: 'youtube', label: 'YouTube', placeholder: 'usuario ou @usuario', Icon: Youtube },
    { name: 'linkedin', label: 'LinkedIn', placeholder: 'usuario', Icon: Linkedin },
    { name: 'tiktok', label: 'TikTok', placeholder: '@usuario', Icon: MessageCircle },
    { name: 'x_twitter', label: 'X (Twitter)', placeholder: 'usuario', Icon: X },
    { name: 'pinterest', label: 'Pinterest', placeholder: 'usuario', Icon: Pinterest },
    { name: 'kwai', label: 'Kwai', placeholder: 'usuario', Icon: Clapperboard },
    { name: 'telegram', label: 'Telegram', placeholder: 'usuario', Icon: Send }
];

const AdFormSocials = ({ formData, setFormField }) => {
    return (
        <div className="space-y-6">
            <CardDescription>Redes Sociais</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialFields.map(({ name, label, placeholder, Icon }) => (
                    <div key={name}>
                        <Label htmlFor={name} className="flex items-center mb-2">
                            <Icon className="w-4 h-4 mr-2" />
                            {label}
                        </Label>
                        <Input 
                            id={name} 
                            value={formData[name] || ''} 
                            onChange={(e) => setFormField(name, e.target.value)} 
                            placeholder={placeholder} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdFormSocials;