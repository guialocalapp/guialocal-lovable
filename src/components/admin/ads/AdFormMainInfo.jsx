import React from 'react';
import { Eye } from 'lucide-react';

import { useUsers } from '@/hooks/useUsers';
import { useAdStatus } from '@/contexts/AdStatusContext';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardDescription } from '@/components/ui/card';

const AdFormMainInfo = ({ formData, setFormField, clientPlan, isClientView, isEditing }) => {
    const { clients } = useUsers();
    const { statuses } = useAdStatus();
    const moderationStatuses = ['Aprovado', 'Reprovado', 'Em moderação'];

    return (
        <div className="space-y-6">
            <CardDescription>Informações Principais</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="title">Título do Anúncio</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormField('title', e.target.value)} required maxLength="50" />
                </div>
                {!isClientView && (
                    <>
                        <div>
                            <Label htmlFor="userId">Cliente</Label>
                            <Select value={formData.user_id} onValueChange={(value) => setFormField('user_id', value)} required>
                                <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">Selecione um cliente</SelectItem>
                                    {clients.map(client => <SelectItem key={client.id} value={client.id}>{client.full_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="clientPlan">Plano do Cliente</Label>
                            <Input id="clientPlan" value={clientPlan ? clientPlan.name : 'Nenhum plano associado'} readOnly disabled className="bg-gray-800/50" />
                        </div>
                    </>
                )}
                <div>
                    <Label htmlFor="listing_status_id">Status</Label>
                    <Select value={formData.listing_status_id} onValueChange={(value) => setFormField('listing_status_id', value)} required >
                        <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                        <SelectContent>
                            {statuses.map(status => <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                
                {isClientView ? (
                    <div>
                        <Label htmlFor="moderation_status">Status de Moderação</Label>
                        <Input id="moderation_status" value={formData.moderation_status} readOnly disabled className="bg-gray-800/50" />
                    </div>
                ) : (
                    <div>
                        <Label htmlFor="moderation_status">Status de Moderação</Label>
                        <Select value={formData.moderation_status} onValueChange={(value) => setFormField('moderation_status', value)} required>
                            <SelectTrigger><SelectValue placeholder="Selecione o status de moderação" /></SelectTrigger>
                            <SelectContent>
                                {moderationStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {isEditing && (
                    <div className="relative">
                        <Label htmlFor="views">Visualizações</Label>
                        <Eye className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                        <Input id="views" value={formData.views || 0} readOnly disabled className="bg-gray-800/50 pl-10" />
                    </div>
                )}
            </div>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormField('description', e.target.value)} rows={6} maxLength="10000" />
                </div>
                <div>
                    <Label htmlFor="observations">Observações (visível para cliente)</Label>
                    <Textarea id="observations" value={formData.observations} onChange={(e) => setFormField('observations', e.target.value)} rows={4} disabled={isClientView} />
                </div>
                {!isClientView && (
                    <div>
                        <Label htmlFor="internal_observations">Observações Internas (apenas admin)</Label>
                        <Textarea id="internal_observations" value={formData.internal_observations} onChange={(e) => setFormField('internal_observations', e.target.value)} rows={4} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdFormMainInfo;