import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AdFormImageUpload = ({ formData, setFormField, imageLimit }) => {
    const { toast } = useToast();
    
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (imageLimit !== -1 && (formData.images.length + files.length) > imageLimit) {
            toast({
                variant: "destructive",
                title: "Limite de imagens excedido!",
                description: `Você pode enviar no máximo ${imageLimit} imagens.`
            });
            return;
        }

        const imagePromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        id: uuidv4(),
                        file: file,
                        url: reader.result,
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(newImages => {
            setFormField('images', [...formData.images, ...newImages]);
        });
    };

    const removeImage = async (idToRemove) => {
        const imageToRemove = formData.images.find(image => image.id === idToRemove);

        if (imageToRemove && imageToRemove.url && imageToRemove.url.includes('supabase.co')) {
            try {
                const bucketName = 'listings_images';
                const urlParts = imageToRemove.url.split(`${bucketName}/`);
                if (urlParts.length > 1) {
                    const filePath = decodeURIComponent(urlParts[1]);
                    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
                    if (error) {
                        throw error;
                    }
                    toast({ title: "Imagem removida do armazenamento." });
                }
            } catch (error) {
                toast({ variant: "destructive", title: "Erro ao remover imagem do armazenamento", description: error.message });
                return;
            }
        }

        const newImages = formData.images.filter(image => image.id !== idToRemove);
        setFormField('images', newImages);
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(formData.images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFormField('images', items);
    };

    const canUploadMore = imageLimit === undefined || imageLimit === null || imageLimit === -1 || formData.images.length < imageLimit;

    return (
        <div>
            <Label>Imagens (arraste para reordenar)</Label>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        >
                            {formData.images.map((image, index) => (
                                <Draggable key={image.id} draggableId={image.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`relative group rounded-md overflow-hidden ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-md'}`}
                                        >
                                            <div {...provided.dragHandleProps} className="absolute top-1 left-1 z-10 p-1 bg-black/30 text-white rounded-full cursor-grab active:cursor-grabbing">
                                                <GripVertical className="h-4 w-4" />
                                            </div>
                                            <img src={image.url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                                            <button type="button" onClick={() => removeImage(image.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            {canUploadMore && (
                                <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800/60 border-gray-600 hover:border-gray-500">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-400">Clique para enviar</p>
                                        {(imageLimit !== undefined && imageLimit !== null && imageLimit !== -1) && <p className="text-xs text-gray-500">{formData.images.length}/{imageLimit}</p>}
                                    </div>
                                    <Input id="image-upload" type="file" className="hidden" multiple onChange={handleImageUpload} accept="image/*" />
                                </Label>
                            )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default AdFormImageUpload;