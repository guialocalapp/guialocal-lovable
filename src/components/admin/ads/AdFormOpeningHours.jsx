import React from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Button } from '@/components/ui/button';
    import { X } from 'lucide-react';

    const daysOfWeek = [
        { key: 'seg', label: 'Segunda-feira' },
        { key: 'ter', label: 'Terça-feira' },
        { key: 'qua', label: 'Quarta-feira' },
        { key: 'qui', label: 'Quinta-feira' },
        { key: 'sex', label: 'Sexta-feira' },
        { key: 'sab', label: 'Sábado' },
        { key: 'dom', label: 'Domingo' },
    ];

    const AdFormOpeningHours = ({ formData, setFormField }) => {
        const handleIsOpenChange = (dayKey, isChecked) => {
            const dayData = formData.opening_hours?.[dayKey] || { isOpen: true, turn1: { open: '', close: '' }, turn2: { open: '', close: '' } };
            setFormField('opening_hours', {
                ...formData.opening_hours,
                [dayKey]: { ...dayData, isOpen: isChecked },
            });
        };

        const handleTimeChange = (dayKey, turn, type, value) => {
            const dayData = formData.opening_hours?.[dayKey] || { isOpen: true, turn1: { open: '', close: '' }, turn2: { open: '', close: '' } };
            const newTurnData = { ...dayData[turn], [type]: value };
            setFormField('opening_hours', {
                ...formData.opening_hours,
                [dayKey]: { ...dayData, [turn]: newTurnData },
            });
        };

        const clearHours = (dayKey, turn) => {
            handleTimeChange(dayKey, turn, 'open', '');
            handleTimeChange(dayKey, turn, 'close', '');
        };

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Horários de Atendimento</CardTitle>
                    <CardDescription>Defina os horários de funcionamento do estabelecimento. Deixe em branco se não houver expediente.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {daysOfWeek.map(({ key, label }) => {
                        const dayData = formData.opening_hours?.[key] || { isOpen: true, turn1: { open: '', close: '' }, turn2: { open: '', close: '' } };
                        const { isOpen, turn1, turn2 } = dayData;

                        return (
                            <div key={key} className="p-4 border rounded-md space-y-4 bg-background/50">
                                <div className="flex items-center justify-between">
                                    <Label className="text-lg font-semibold">{label}</Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`isOpen_${key}`}
                                            checked={isOpen}
                                            onCheckedChange={(checked) => handleIsOpenChange(key, checked)}
                                        />
                                        <Label htmlFor={`isOpen_${key}`}>Aberto</Label>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Turno 1 (Ex: Manhã)</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    value={turn1?.open || ''}
                                                    onChange={(e) => handleTimeChange(key, 'turn1', 'open', e.target.value)}
                                                />
                                                <span className="text-muted-foreground">às</span>
                                                <Input
                                                    type="time"
                                                    value={turn1?.close || ''}
                                                    onChange={(e) => handleTimeChange(key, 'turn1', 'close', e.target.value)}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => clearHours(key, 'turn1')}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Turno 2 (Ex: Tarde)</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    value={turn2?.open || ''}
                                                    onChange={(e) => handleTimeChange(key, 'turn2', 'open', e.target.value)}
                                                />
                                                <span className="text-muted-foreground">às</span>
                                                <Input
                                                    type="time"
                                                    value={turn2?.close || ''}
                                                    onChange={(e) => handleTimeChange(key, 'turn2', 'close', e.target.value)}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => clearHours(key, 'turn2')}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        );
    };

    export default AdFormOpeningHours;