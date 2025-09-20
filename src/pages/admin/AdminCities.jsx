import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCities } from '@/hooks/useCities';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const CityForm = ({ city, onSave, onOpenChange }) => {
    const [name, setName] = useState(city?.name || '');
    const [state, setState] = useState(city?.state || '');
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !state.trim()) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Nome e estado são obrigatórios.' });
            return;
        }
        onSave({ ...city, name, state });
        onOpenChange(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Nome</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="state" className="text-right">Estado (UF)</Label>
                    <Input id="state" value={state} onChange={e => setState(e.target.value)} className="col-span-3" maxLength="2" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Salvar</Button>
            </DialogFooter>
        </form>
    );
};

const AdminCities = () => {
    const { cities, addCity, updateCity, deleteCity } = useCities();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentCity, setCurrentCity] = useState(null);

    const handleSave = (cityData) => {
        try {
            if (cityData.id) {
                updateCity(cityData.id, { name: cityData.name, state: cityData.state });
                toast({ title: 'Sucesso!', description: 'Cidade atualizada.' });
            } else {
                addCity({ name: cityData.name, state: cityData.state });
                toast({ title: 'Sucesso!', description: 'Cidade adicionada.' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro!', description: 'Não foi possível salvar a cidade.' });
        }
        setCurrentCity(null);
    };

    const handleDelete = (id) => {
        try {
            deleteCity(id);
            toast({ title: 'Sucesso!', description: 'Cidade removida.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro!', description: 'Não foi possível remover a cidade.' });
        }
    };

    const openDialog = (city = null) => {
        setCurrentCity(city);
        setDialogOpen(true);
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Cidades - Admin - Guia Local</title>
            </Helmet>

            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Cidades</h1>
                 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => openDialog()}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Nova Cidade
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{currentCity ? 'Editar Cidade' : 'Adicionar Cidade'}</DialogTitle>
                            <DialogDescription>
                                Preencha as informações da cidade abaixo.
                            </DialogDescription>
                        </DialogHeader>
                        <CityForm city={currentCity} onSave={handleSave} onOpenChange={setDialogOpen} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Cidades</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-[100px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cities.length > 0 ? (
                                cities.map(city => (
                                    <TableRow key={city.id}>
                                        <TableCell>{city.name}</TableCell>
                                        <TableCell>{city.state}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="icon" className="mr-2" onClick={() => openDialog(city)}>
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
                                                            Esta ação não pode ser desfeita. Isso excluirá permanentemente a cidade.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(city.id)}>Excluir</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        Nenhuma cidade encontrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};

export default AdminCities;