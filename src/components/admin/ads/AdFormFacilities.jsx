import React from 'react';
import * as Icons from 'lucide-react';

import { useFacilities } from '@/hooks/useFacilities';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const AdFormFacilities = ({ formData, setFormField }) => {
    const { facilities } = useFacilities();

    const getIcon = (iconName) => {
        const IconComponent = Icons[iconName];
        return IconComponent ? <IconComponent className="h-4 w-4 mr-2" /> : <Icons.HelpCircle className="h-4 w-4 mr-2" />;
    };
    
    const handleFacilityChange = (facilityId) => {
        const currentFacilities = formData.facilities || [];
        const newFacilities = currentFacilities.includes(facilityId)
            ? currentFacilities.filter(id => id !== facilityId)
            : [...currentFacilities, facilityId];
        setFormField('facilities', newFacilities);
    };

    return (
        <div>
            <Label>Facilidades</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-2 rounded-md border border-gray-700 p-4 bg-gray-900/50">
                {facilities.map(facility => (
                    <div key={facility.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`facility-${facility.id}`}
                            checked={(formData.facilities || []).includes(facility.id)}
                            onCheckedChange={() => handleFacilityChange(facility.id)}
                        />
                        <Label htmlFor={`facility-${facility.id}`} className="font-normal flex items-center">
                            {getIcon(facility.icon)} {facility.name}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdFormFacilities;