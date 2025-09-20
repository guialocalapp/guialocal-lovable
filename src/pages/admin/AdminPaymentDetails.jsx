import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePayments } from '@/hooks/usePayments';
import { useUsers } from '@/hooks/useUsers';
import { usePlans } from '@/hooks/usePlans';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, ScanLine, CreditCard, Info, Terminal, Server, Share2, Ban, Wifi } from 'lucide-react';

const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
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

const GatewayBadge = ({ gateway }) => {
    if (!gateway) return <Badge variant="outline">N/A</Badge>;
    const isAsaas = gateway.toLowerCase() === 'asaas';
    return (
        <Badge variant="outline" className={isAsaas ? "border-blue-400/50 text-blue-300" : "border-cyan-400/50 text-cyan-300"}>
            <Wifi className="w-3 h-3 mr-1" />
            {gateway.charAt(0).toUpperCase() + gateway.slice(1).replace('_', ' ')}
        </Badge>
    );
};

const LogTypeIcon = ({ type }) => {
    switch (type) {
        case 'REQUEST': return <Share2 className="w-5 h-5 text-blue-400" />;
        case 'RESPONSE': return <Server className="w-5 h-5 text-green-400" />;
        case 'INFO': return <Info className="w-5 h-5 text-cyan-400" />;
        case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-400" />;
        default: return <Terminal className="w-5 h-5 text-gray-400" />;
    }
}

const AdminPaymentDetails = () => {
    const { id } = useParams();
    const { getPaymentById, getPaymentLogs, loading: paymentsLoading } = usePayments();
    const { getUserById, loading: usersLoading } = useUsers();
    const { getPlanById, loading: plansLoading } = usePlans();
    
    const [payment, setPayment] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const paymentData = await getPaymentById(id);
            if (paymentData) {
                setPayment(paymentData);
                const logsData = await getPaymentLogs(id);
                setLogs(logsData);
            }
            setLoading(false);
        };

        fetchData();
    }, [id, getPaymentById, getPaymentLogs]);

    if (loading || paymentsLoading || usersLoading || plansLoading) {
        return <div>Carregando detalhes do pagamento...</div>;
    }

    if (!payment) {
        return <div>Pagamento não encontrado.</div>;
    }

    const user = getUserById(payment.user_id);
    const plan = getPlanById(payment.plan_id);

    return (
        <>
            <Helmet>
                <title>Detalhes do Pagamento - Admin</title>
            </Helmet>
            <div className="mb-6">
                <Button asChild variant="outline" size="sm">
                    <Link to="/admin/payments">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Pagamentos
                    </Link>
                </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo da Transação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <StatusBadge status={payment.status} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Gateway</span>
                                <GatewayBadge gateway={payment.gateway} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Valor</span>
                                <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Data</span>
                                <span>{formatDate(payment.created_at)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Método</span>
                                <div className="flex items-center gap-2">
                                    {payment.billing_type === 'CREDIT_CARD' ? <CreditCard className="w-4 h-4"/> : <ScanLine className="w-4 h-4" />}
                                    <span>{payment.billing_type === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'PIX'}</span>
                                </div>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-400">Período</span>
                                <span>{payment.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">ID Local</span>
                                <span className="font-mono text-xs">{payment.id}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-400">ID Assinatura Gateway</span>
                                <span className="font-mono text-xs">{payment.asaas_subscription_id || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">ID Pagamento Gateway</span>
                                <span className="font-mono text-xs">{payment.asaas_payment_id || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="mt-6">
                        <CardHeader><CardTitle>Informações</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="font-semibold">Cliente</h4>
                                <p className="text-gray-400">{user?.full_name || 'N/A'}</p>
                                <p className="text-sm text-gray-500">{user?.email || 'N/A'}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold">Plano</h4>
                                <p className="text-gray-400">{plan?.name || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle>Logs da Integração</CardTitle>
                            <CardDescription>Linha do tempo das interações com a API do gateway.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-gray-700 after:left-0">
                                {logs.length > 0 ? logs.map(log => (
                                    <div key={log.id} className="grid grid-cols-[auto_1fr] items-start gap-x-3 mb-6 last:mb-0">
                                        <div className="relative z-10">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 -ml-9 ring-4 ring-background">
                                               <LogTypeIcon type={log.log_type} />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="flex items-center justify-between">
                                                <Badge variant={log.log_type === 'ERROR' ? 'destructive' : 'secondary'}>{log.log_type}</Badge>
                                                <time className="text-xs text-gray-500">{formatDate(log.created_at)}</time>
                                            </div>
                                            <p className="font-medium text-gray-300 mt-1">{log.message}</p>
                                            {log.payload && (
                                                <details className="mt-2 text-xs">
                                                    <summary className="cursor-pointer text-gray-400">Ver detalhes</summary>
                                                    <pre className="mt-1 p-2 bg-gray-900 rounded-md overflow-auto text-gray-300">
                                                        {JSON.stringify(log.payload, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-500 py-8">Nenhum log de integração encontrado para este pagamento.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default AdminPaymentDetails;