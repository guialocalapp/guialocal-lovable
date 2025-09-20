import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardDescription } from '@/components/ui/card';

const AdFormContactInfo = ({ formData, setFormField }) => {
    return (
        <div className="space-y-6">
            <CardDescription>Contato</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="website">Site</Label>
                    <Input id="website" value={formData.website} onChange={(e) => setFormField('website', e.target.value)} placeholder="https://exemplo.com" />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormField('email', e.target.value)} placeholder="contato@exemplo.com" />
                </div>
                <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => setFormField('phone', e.target.value)} placeholder="(00) 0000-0000" />
                </div>
                <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" value={formData.whatsapp} onChange={(e) => setFormField('whatsapp', e.target.value)} placeholder="(00) 90000-0000" />
                </div>
            </div>
        </div>
    );
};

export default AdFormContactInfo;