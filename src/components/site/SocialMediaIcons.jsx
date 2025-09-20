import React from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Youtube, Linkedin, MessageCircle, Twitter, Instagram as Pinterest, Clapperboard, Send } from 'lucide-react';

const socialMediaPlatforms = [
    { key: 'instagram', Icon: Instagram, baseUrl: 'https://instagram.com/', color: 'text-[#E1306C]' },
    { key: 'facebook', Icon: Facebook, baseUrl: 'https://facebook.com/', color: 'text-[#1877F2]' },
    { key: 'youtube', Icon: Youtube, baseUrl: 'https://youtube.com/', color: 'text-[#FF0000]' },
    { key: 'linkedin', Icon: Linkedin, baseUrl: 'https://linkedin.com/in/', color: 'text-[#0A66C2]' },
    { key: 'tiktok', Icon: MessageCircle, baseUrl: 'https://tiktok.com/', color: 'text-white' },
    { key: 'x_twitter', Icon: Twitter, baseUrl: 'https://x.com/', color: 'text-white' },
    { key: 'pinterest', Icon: Pinterest, baseUrl: 'https://pinterest.com/', color: 'text-[#E60023]' },
    { key: 'kwai', Icon: Clapperboard, baseUrl: 'https://kwai.com/', color: 'text-[#FF7A00]' },
    { key: 'telegram', Icon: Send, baseUrl: 'https://t.me/', color: 'text-[#24A1DE]' }
];

const SocialMediaIcons = ({ ad }) => {
    const availableSocials = socialMediaPlatforms.filter(platform => ad[platform.key]);

    if (availableSocials.length === 0) {
        return null;
    }
    
    const createUrl = (platform, username) => {
        if (platform.key === 'youtube') {
            return username.startsWith('@') 
                ? `${platform.baseUrl}${username}` 
                : `${platform.baseUrl}c/${username}`;
        }
        if (platform.key === 'tiktok') {
            return username.startsWith('@') 
                ? `${platform.baseUrl}${username}`
                : `${platform.baseUrl}@${username}`;
        }
        return `${platform.baseUrl}${username}`;
    };

    return (
        <div className="flex items-center gap-4 pt-2">
            {availableSocials.map(platform => (
                <Button asChild size="icon" variant="outline" key={platform.key}>
                    <a href={createUrl(platform, ad[platform.key])} target="_blank" rel="noopener noreferrer" aria-label={platform.key}>
                        <platform.Icon className={`w-6 h-6 ${platform.color}`} />
                    </a>
                </Button>
            ))}
        </div>
    );
};

export default SocialMediaIcons;