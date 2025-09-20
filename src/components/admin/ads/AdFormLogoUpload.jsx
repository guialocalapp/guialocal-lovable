import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdFormLogoUpload = ({ logo, setFormField }) => {
    const { toast } = useToast();

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormField('logo', {
                id: uuidv4(),
                file: file,
                url: reader.result,
            });
        };
        reader.readAsDataURL(file);
    };

    const removeLogo = () => {
        setFormField('logo', null);
        toast({ title: "Logotipo removido." });
    };

    return (
        <div>
            <Label>Logotipo</Label>
            <div className="mt-2">
                {logo && logo.url ? (
                    <div className="relative group w-40 h-40 rounded-md overflow-hidden shadow-md">
                        <img src={logo.url} alt="Preview do Logotipo" className="w-full h-full object-cover" />
                        <button type="button" onClick={removeLogo} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <Label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800/60 border-gray-600 hover:border-gray-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-400 text-center">Clique para enviar</p>
                        </div>
                        <Input id="logo-upload" type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                    </Label>
                )}
            </div>
        </div>
    );
};

export default AdFormLogoUpload;