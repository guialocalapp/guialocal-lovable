import React from 'react';
    import { Helmet } from 'react-helmet-async';
    import { useNavigate } from 'react-router-dom';
    import { usePayments } from '@/hooks/usePayments';
    import { useUsers } from '@/hooks/useUsers';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { CreditCard, ScanLine, AlertCircle, CheckCircle, Clock, Eye, Ban } from 'lucide-react';

    const formatCurrency = (value) => {
        if (typeof value !== 'number') return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'CONFIRMED':
            case 'RECEIVED':
                return <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30"><CheckCircle className="w-3 h-3 mr-1" /> Confirmado</Badge>;
            case 'PENDING':
                return <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/30"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>;
            case 'FAILED':
                return <Badge variant="destructive" className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30"><AlertCircle className="w-3 h-3 mr-1" /> Falhou</Badge>;
            case 'EXPIRED':
                 return <Badge variant="destructive" className="bg-orange-600/20 text-orange-400 border-orange-600/30 hover:bg-orange-600/30"><Ban className="w-3 h-3 mr-1" /> Expirado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const PaymentMethodIcon = ({ method }) => {
        switch (method) {
            case 'CREDIT_CARD':
                return <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /> Cartão</div>;
            case 'PIX':
                return <div className="flex items-center gap-2"><ScanLine className="w-4 h-4 text-gray-400" /> PIX</div>;
            default:
                return method;
        }
    }

    const GatewayBadge = ({ gateway }) => {
        if (!gateway) return null;
        const isAsaas = gateway.toLowerCase() === 'asaas';
        return (
            <Badge variant="outline" className={isAsaas ? "border-blue-400/50 text-blue-300" : "border-cyan-400/50 text-cyan-300"}>
                {gateway.charAt(0).toUpperCase() + gateway.slice(1).replace('_', ' ')}
            </Badge>
        );
    };

    const AdminPayments = () => {
        const { payments, loading } = usePayments();
        const { getUserById } = useUsers();
        const navigate = useNavigate();

        return (
            <>
                <Helmet>
                    <title>Pagamentos - Admin - Guia Local</title>
                </Helmet>
                <div className="flex items-center justify-between space-y-2 mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Histórico de Transações</CardTitle>
                        <CardDescription>Visualize todas as transações de pagamento da plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Plano</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Método</TableHead>
                                    <TableHead>Gateway</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            Carregando histórico...
                                        </TableCell>
                                    </TableRow>
                                ) : payments.length > 0 ? (
                                    payments.map(payment => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{formatDate(payment.created_at)}</TableCell>
                                            <TableCell>{getUserById(payment.user_id)?.full_name || 'N/A'}</TableCell>
                                            <TableCell>{payment.plan?.name || 'N/A'}</TableCell>
                                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                            <TableCell><PaymentMethodIcon method={payment.billing_type} /></TableCell>
                                            <TableCell><GatewayBadge gateway={payment.gateway} /></TableCell>
                                            <TableCell><StatusBadge status={payment.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/payments/${payment.id}`)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            Nenhum pagamento encontrado.
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

    export default AdminPayments;