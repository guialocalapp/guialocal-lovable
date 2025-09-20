import React, { useState, useEffect } from 'react';
    import { Clock } from 'lucide-react';
    import { Badge } from '@/components/ui/badge';

    const dayOfWeekMap = [
        { key: 'dom', name: 'Domingo' },
        { key: 'seg', name: 'Segunda-feira' },
        { key: 'ter', name: 'Terça-feira' },
        { key: 'qua', name: 'Quarta-feira' },
        { key: 'qui', name: 'Quinta-feira' },
        { key: 'sex', name: 'Sexta-feira' },
        { key: 'sab', name: 'Sábado' },
    ];

    const timeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };
    
    const isCurrentlyOpen = (openingHours, now) => {
        if (!openingHours || typeof openingHours !== 'object' || Object.keys(openingHours).length === 0) {
            return false;
        }

        const nowDayIndex = now.getDay();
        const yesterdayDayIndex = (nowDayIndex - 1 + 7) % 7;
        const nowInMinutes = now.getHours() * 60 + now.getMinutes();
        
        const todayKey = dayOfWeekMap[nowDayIndex].key;
        const yesterdayKey = dayOfWeekMap[yesterdayDayIndex].key;
        
        const todaySchedule = openingHours[todayKey];
        const yesterdaySchedule = openingHours[yesterdayKey];

        const checkTurn = (turn, currentTime) => {
            if (!turn?.open || !turn?.close) return false;
            
            const openTime = timeToMinutes(turn.open);
            const closeTime = timeToMinutes(turn.close);

            if (openTime === null || closeTime === null || openTime === closeTime) return false;

            if (closeTime < openTime) { // Overnight schedule
                return currentTime >= openTime || currentTime < closeTime;
            } else { // Same day schedule
                return currentTime >= openTime && currentTime < closeTime;
            }
        };
        
        // Check today's schedule
        if (todaySchedule?.isOpen) {
            if (checkTurn(todaySchedule.turn1, nowInMinutes)) return true;
            if (checkTurn(todaySchedule.turn2, nowInMinutes)) return true;
        }

        // Check if we are in an overnight shift from yesterday
        if (yesterdaySchedule?.isOpen) {
            const checkOvernightTurn = (turn, currentTime) => {
                if (!turn?.open || !turn?.close) return false;
                const openTime = timeToMinutes(turn.open);
                const closeTime = timeToMinutes(turn.close);
                 if (openTime !== null && closeTime !== null && closeTime < openTime) {
                    return currentTime < closeTime;
                }
                return false;
            };

            if (checkOvernightTurn(yesterdaySchedule.turn1, nowInMinutes)) return true;
            if (checkOvernightTurn(yesterdaySchedule.turn2, nowInMinutes)) return true;
        }
        
        return false;
    };

    const OpeningHoursStatus = ({ openingHours }) => {
        const [status, setStatus] = useState({ isOpen: false, text: 'Fechado' });

        useEffect(() => {
            const checkStatus = () => {
                if (!openingHours || typeof openingHours !== 'object' || Object.keys(openingHours).length === 0) {
                    setStatus({ isOpen: false, text: 'Horário não informado' });
                    return;
                }
                
                const now = new Date();
                
                if (isCurrentlyOpen(openingHours, now)) {
                    setStatus({ isOpen: true, text: 'Aberto agora' });
                } else {
                    setStatus({ isOpen: false, text: 'Fechado' });
                }
            };

            checkStatus();
            const interval = setInterval(checkStatus, 60000);
            return () => clearInterval(interval);
        }, [openingHours]);

        const formatDaySchedule = (day) => {
            if (!day || !day.isOpen) return 'Fechado';
            
            const turn1Valid = day.turn1?.open && day.turn1?.close && day.turn1.open !== day.turn1.close;
            const turn2Valid = day.turn2?.open && day.turn2?.close && day.turn2.open !== day.turn2.close;

            const turn1Text = turn1Valid ? `${day.turn1.open} - ${day.turn1.close}` : null;
            const turn2Text = turn2Valid ? `${day.turn2.open} - ${day.turn2.close}` : null;

            if (turn1Text && turn2Text) return `${turn1Text}, ${turn2Text}`;
            if (turn1Text) return turn1Text;
            if (turn2Text) return turn2Text;
            
            return 'Fechado';
        };

        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <Badge variant={status.text === 'Horário não informado' ? 'secondary' : (status.isOpen ? 'success' : 'destructive')} className="text-sm">
                        {status.text}
                    </Badge>
                </div>
                {status.text !== 'Horário não informado' && (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {dayOfWeekMap.map(({ key, name }) => {
                            const day = openingHours ? openingHours[key] : null;
                            return (
                                <li key={key} className="flex justify-between">
                                    <span>{name}</span>
                                    <span className="font-medium">
                                        {formatDaySchedule(day)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    };

    export default OpeningHoursStatus;