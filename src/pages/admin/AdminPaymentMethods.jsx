import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2, CreditCard, Upload } from 'lucide-react';

const AdminPaymentMethods = () => {
    const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = usePaymentMethods();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentMethod, setCurrentMethod] = useState(null);
    const [formData, setFormData] = useState({ name: '', icon: null });

    const handleOpenDialog = (method = null) => {
        setCurrentMethod(method);
        if (method) {
            setFormData({ name: method.name, icon: method.icon || null });
        } else {
            setFormData({ name: '', icon: null });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setCurrentMethod(null);
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, icon: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'O nome é obrigatório.',
            });
            return;
        }

        if (currentMethod) {
            updatePaymentMethod(currentMethod.id, formData);
            toast({ title: 'Sucesso', description: 'Forma de pagamento atualizada.' });
        } else {
            addPaymentMethod(formData);
            toast({ title: 'Sucesso', description: 'Nova forma de pagamento adicionada.' });
        }
        handleCloseDialog();
    };

    const handleDelete = (id) => {
        deletePaymentMethod(id);
        toast({ title: 'Sucesso', description: 'Forma de pagamento excluída.' });
    };

    return (
        <>
            <Helmet>
                <title>Formas de Pagamento - Admin - Guia Local</title>
            </Helmet>
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Formas de Pagamento</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Nova Forma de Pagamento
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todas as Formas de Pagamento</CardTitle>
                    <CardDescription>Gerencie as formas de pagamento disponíveis na plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Ícone</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead className="text-right w-[120px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentMethods.length > 0 ? (
                                paymentMethods.map((method) => (
                                    <TableRow key={method.id}>
                                        <TableCell>
                                            {method.icon ? (
                                                <img src={method.icon} alt={method.name} className="h-8 w-8 object-contain" />
                                            ) : (
                                                <div className="h-8 w-8 bg-gray-700 rounded-sm flex items-center justify-center">
                                                    <CreditCard className="h-4 w-4 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{method.name}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => handleOpenDialog(method)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Essa ação não pode ser desfeita. Isso excluirá permanentemente a forma de pagamento.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(method.id)}>
                                                            Excluir
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        <CreditCard className="mx-auto h-12 w-12 text-gray-500 mb-2" />
                                        Nenhuma forma de pagamento encontrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{currentMethod ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="icon">Ícone</Label>
                                <div className="flex items-center space-x-4">
                                    {formData.icon && <img src={formData.icon} alt="Preview" className="h-10 w-10 object-contain rounded-sm bg-gray-700 p-1" />}
                                    <Input id="icon" type="file" onChange={handleIconChange} accept="image/*" className="file:text-white" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminPaymentMethods;