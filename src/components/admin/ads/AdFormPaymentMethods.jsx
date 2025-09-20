import React from 'react';

    import { usePaymentMethods } from '@/hooks/usePaymentMethods';

    import { Checkbox } from '@/components/ui/checkbox';
    import { Label } from '@/components/ui/label';

    const AdFormPaymentMethods = ({ formData, setFormField }) => {
        const { paymentMethods } = usePaymentMethods();

        const handlePaymentMethodChange = (methodId) => {
            const currentMethods = formData.payment_methods || [];
            const newMethods = currentMethods.includes(methodId)
                ? currentMethods.filter(id => id !== methodId)
                : [...currentMethods, methodId];
            setFormField('payment_methods', newMethods);
        };

        return (
            <div>
                <Label>Formas de Pagamento</Label>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-2 rounded-md border border-gray-700 p-4 bg-gray-900/50">
                    {paymentMethods.map(method => (
                        <div key={method.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`payment-${method.id}`}
                                checked={(formData.payment_methods || []).includes(method.id)}
                                onCheckedChange={() => handlePaymentMethodChange(method.id)}
                            />
                            <Label htmlFor={`payment-${method.id}`} className="font-normal">{method.name}</Label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    export default AdFormPaymentMethods;