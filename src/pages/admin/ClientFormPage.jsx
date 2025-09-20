import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { usePlans } from '@/hooks/usePlans';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { MaskedInput } from '@/components/ui/masked-input';
import { maskCPFOrCNPJ } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const ClientFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateUser, getUserById } = useUsers();
    const { updateUserPassword: updateAuthUserPassword, signUp } = useAuth();
    const { plans } = usePlans();
    const { toast } = useToast();

    const isEditing = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        doc: '',
        plan_id: 'null',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        zipCode: '',
        city: '',
        state: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (isEditing) {
            const user = getUserById(id);
            if (user && user.role === 'client') {
                setFormData({
                    full_name: user.full_name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    doc: user.doc ? maskCPFOrCNPJ(user.doc) : '',
                    plan_id: user.plan_id || 'null',
                    street: user.street || '',
                    number: user.number || '',
                    complement: user.complement || '',
                    neighborhood: user.neighborhood || '',
                    zipCode: user.zipCode || '',
                    city: user.city || '',
                    state: user.state || '',
                    password: '',
                    confirmPassword: '',
                });
            } else {
                toast({ variant: "destructive", title: "Erro!", description: "Cliente não encontrado." });
                navigate('/admin/clients');
            }
        }
    }, [id, isEditing, getUserById, navigate, toast]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        let maskedValue = value;
        if (id === 'doc') {
            maskedValue = maskCPFOrCNPJ(value);
        }
        setFormData(prev => ({ ...prev, [id]: maskedValue }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, plan_id: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { password, confirmPassword, ...profileData } = formData;
        
        if (!profileData.full_name.trim() || !profileData.email.trim()) {
            toast({ variant: "destructive", title: "Erro!", description: "Nome e e-mail são obrigatórios." });
            setLoading(false);
            return;
        }
        if (!isEditing && !password) {
            toast({ variant: "destructive", title: "Erro!", description: "A senha é obrigatória para novos clientes." });
            setLoading(false);
            return;
        }
        if (password && password !== confirmPassword) {
            toast({ variant: "destructive", title: "Erro!", description: "As senhas não coincidem." });
            setLoading(false);
            return;
        }

        try {
            const userDataForProfile = {
                ...profileData,
                plan_id: profileData.plan_id === 'null' ? null : profileData.plan_id,
                doc: profileData.doc.replace(/\D/g, ''),
                phone: profileData.phone.replace(/\D/g, ''),
            };

            if (isEditing) {
                await updateUser(id, userDataForProfile);

                if (password) {
                    await updateAuthUserPassword(password);
                }
            } else {
                const { data: authData, error: authError } = await signUp(profileData.email, password, { 
                    full_name: profileData.full_name,
                    role: 'client'
                });

                if (authError || !authData.user) {
                    throw authError || new Error("Falha ao criar usuário na autenticação.");
                }

                await updateUser(authData.user.id, userDataForProfile);
            }
            toast({ title: "Sucesso!", description: `Cliente ${isEditing ? 'atualizado' : 'criado'} com sucesso.` });
            navigate('/admin/clients');
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>{isEditing ? 'Editar Cliente' : 'Novo Cliente'} - Admin - Guia Local</title>
            </Helmet>

             <div className="mb-4">
                <Link to="/admin/clients" className="flex items-center text-sm text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Clientes
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <CardDescription>Informações Básicas</CardDescription>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="full_name">Nome Completo</Label>
                                    <Input id="full_name" value={formData.full_name} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone">Telefone</Label>
                                    <MaskedInput
                                        mask="(99) 99999-9999"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="doc">CPF/CNPJ</Label>
                                    <Input id="doc" value={formData.doc} onChange={handleInputChange} />
                                </div>
                            </div>
                             <div>
                                <Label htmlFor="plan_id">Plano</Label>
                                <Select value={String(formData.plan_id)} onValueChange={handleSelectChange}>
                                    <SelectTrigger id="plan_id">
                                        <SelectValue placeholder="Selecione um plano" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="null">Nenhum plano</SelectItem>
                                        {plans.map(plan => (
                                            <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <CardDescription>Endereço</CardDescription>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <div className="md:col-span-2">
                                    <Label htmlFor="street">Logradouro</Label>
                                    <Input id="street" value={formData.street} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="number">Número</Label>
                                    <Input id="number" value={formData.number} onChange={handleInputChange} />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="complement">Complemento</Label>
                                    <Input id="complement" value={formData.complement} onChange={handleInputChange} />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="neighborhood">Bairro</Label>
                                    <Input id="neighborhood" value={formData.neighborhood} onChange={handleInputChange} />
                                </div>
                                
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="zipCode">CEP</Label>
                                    <Input id="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="city">Cidade</Label>
                                    <Input id="city" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="state">Estado</Label>
                                    <Input id="state" value={formData.state} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <CardDescription>
                                {isEditing ? "Deixe os campos de senha em branco para não alterá-la." : "Crie uma senha segura para o novo cliente."}
                            </CardDescription>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                    <Label htmlFor="password">Senha</Label>
                                    <Input id="password" type="password" value={formData.password} onChange={handleInputChange} />
                               </div>
                               <div>
                                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
                               </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                         <Button type="button" variant="ghost" onClick={() => navigate('/admin/clients')}>Cancelar</Button>
                         <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar
                         </Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
};

export default ClientFormPage;