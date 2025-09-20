import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const UserFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addUser, updateUser, getUserById } = useUsers();
    const { toast } = useToast();

    const isEditing = Boolean(id);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (isEditing) {
            const user = getUserById(id);
            if (user && user.role === 'admin') {
                setFullName(user.full_name || '');
                setEmail(user.email || '');
            } else {
                toast({ variant: "destructive", title: "Erro!", description: "Usuário administrador não encontrado." });
                navigate('/admin/users');
            }
        }
    }, [id, isEditing, getUserById, navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim()) {
            toast({ variant: "destructive", title: "Erro!", description: "Nome e e-mail são obrigatórios." });
            return;
        }
        if (!isEditing && !password) {
            toast({ variant: "destructive", title: "Erro!", description: "A senha é obrigatória para novos usuários." });
            return;
        }
        if (password && password !== confirmPassword) {
            toast({ variant: "destructive", title: "Erro!", description: "As senhas não coincidem." });
            return;
        }

        try {
            if (isEditing) {
                const userData = { full_name: fullName, email };
                // A atualização de senha para usuários existentes via admin não é implementada
                // pois geralmente requer confirmação do usuário.
                // Se uma nova senha for fornecida, ela não será processada nesta etapa.
                await updateUser(id, userData);
                toast({ title: "Sucesso!", description: "Usuário administrador atualizado." });
            } else {
                const userData = { fullName, email, password, role: 'admin' };
                await addUser(userData);
                toast({ title: "Sucesso!", description: "Usuário administrador criado." });
            }
            navigate('/admin/users');
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>{isEditing ? 'Editar Usuário Admin' : 'Novo Usuário Admin'} - Guia Local</title>
            </Helmet>

             <div className="mb-4">
                <Link to="/admin/users" className="flex items-center text-sm text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Usuários
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Editar Usuário Admin' : 'Novo Usuário Admin'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="fullName">Nome Completo</Label>
                            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <CardDescription>
                            {isEditing ? "Para alterar a senha, o usuário deve usar a função 'Esqueci minha senha' na tela de login." : "Crie uma senha segura para o novo administrador."}
                        </CardDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                                <Label htmlFor="password">Senha</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isEditing} required={!isEditing} />
                           </div>
                           <div>
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isEditing} required={!isEditing} />
                           </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                         <Button type="button" variant="ghost" onClick={() => navigate('/admin/users')}>Cancelar</Button>
                         <Button type="submit">Salvar</Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
};

export default UserFormPage;