import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useUsers } from '@/hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, HeartHandshake as Handshake, Calendar, Users, DollarSign, Info, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString, format = 'short') => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (format === 'monthYear') {
        const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
        return `${month.charAt(0).toUpperCase() + month.slice(1)} de ${date.getFullYear()}`;
    }
    return new Intl.DateTimeFormat('pt-BR').format(date);
};

const AdminAffiliates = () => {
    const { getAffiliateCommissions, loading } = useUsers();
    const [affiliateData, setAffiliateData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAffiliateCommissions();
            setAffiliateData(data);
        };
        fetchData();
    }, [getAffiliateCommissions]);

    return (
        <>
            <Helmet>
                <title>Afiliados - Admin - Guia Local</title>
            </Helmet>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Handshake className="h-8 w-8" />
                        Gestão de Afiliados
                    </h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Resumo de Comissões e Indicações</CardTitle>
                        <CardDescription>Acompanhe os afiliados, suas indicações e as comissões geradas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            </div>
                        ) : affiliateData.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full">
                                {affiliateData.map((affiliate) => (
                                    <AccordionItem value={affiliate.id} key={affiliate.id}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex justify-between items-center w-full pr-4">
                                                <div className="text-left">
                                                    <p className="font-bold text-lg text-foreground">{affiliate.full_name}</p>
                                                    <p className="text-sm text-muted-foreground">{affiliate.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-sm">
                                                        {affiliate.referred_users.length} {affiliate.referred_users.length === 1 ? 'indicado' : 'indicados'}
                                                    </Badge>
                                                    {Object.keys(affiliate.commissionsByMonth).length > 0 && (
                                                      <Badge variant="outline" className="text-sm">
                                                          {Object.keys(affiliate.commissionsByMonth).length} {Object.keys(affiliate.commissionsByMonth).length === 1 ? 'mês com comissão' : 'meses com comissões'}
                                                      </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-6 p-4 bg-muted/50 rounded-md">
                                                
                                                <Card>
                                                  <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-lg"><UserPlus className="h-5 w-5" /> Clientes Indicados</CardTitle>
                                                  </CardHeader>
                                                  <CardContent>
                                                    <Table>
                                                      <TableHeader>
                                                        <TableRow>
                                                          <TableHead>Cliente</TableHead>
                                                          <TableHead>Plano Atual</TableHead>
                                                          <TableHead>Data de Cadastro</TableHead>
                                                          <TableHead>Data Contratação Plano</TableHead>
                                                        </TableRow>
                                                      </TableHeader>
                                                      <TableBody>
                                                        {affiliate.referred_users.map(referred => (
                                                          <TableRow key={referred.id}>
                                                            <TableCell>{referred.full_name}</TableCell>
                                                            <TableCell>
                                                              <Badge variant={referred.plan ? "default" : "secondary"}>
                                                                {referred.plan?.name || 'Nenhum'}
                                                              </Badge>
                                                            </TableCell>
                                                            <TableCell>{formatDate(referred.created_at)}</TableCell>
                                                            <TableCell>{formatDate(referred.planHiredDate)}</TableCell>
                                                          </TableRow>
                                                        ))}
                                                      </TableBody>
                                                    </Table>
                                                  </CardContent>
                                                </Card>

                                                {Object.keys(affiliate.commissionsByMonth).length > 0 ? (
                                                    Object.entries(affiliate.commissionsByMonth)
                                                        .sort(([a], [b]) => new Date(b) - new Date(a))
                                                        .map(([month, data]) => (
                                                        <Card key={month}>
                                                            <CardHeader>
                                                                <CardTitle className="flex justify-between items-center text-lg">
                                                                    <span className="flex items-center gap-2 capitalize"><Calendar className="h-5 w-5" /> Comissões de {formatDate(month, 'monthYear')}</span>
                                                                    <span className="flex items-center gap-2 font-bold text-primary"><DollarSign className="h-5 w-5" /> {formatCurrency(data.totalCommission)}</span>
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Cliente Indicado</TableHead>
                                                                            <TableHead>Plano Contratado</TableHead>
                                                                            <TableHead>Previsão Pagamento</TableHead>
                                                                            <TableHead className="text-right">Comissão</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {data.details.map((detail, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>{detail.referredUserName}</TableCell>
                                                                                <TableCell>{detail.planName}</TableCell>
                                                                                <TableCell>{formatDate(detail.paymentDueDate)}</TableCell>
                                                                                <TableCell className="text-right font-medium">{formatCurrency(detail.commissionValue)}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 px-4 border border-dashed rounded-lg">
                                                        <Info className="mx-auto h-8 w-8 text-muted-foreground" />
                                                        <h4 className="mt-3 text-md font-semibold">Nenhuma comissão gerada ainda</h4>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Este afiliado tem {affiliate.referred_users.length} indicado(s), mas nenhum deles contratou um plano pago ainda.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-16">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Nenhum afiliado encontrado</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Ainda não há clientes que indicaram outros usuários. As indicações aparecerão aqui.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AdminAffiliates;