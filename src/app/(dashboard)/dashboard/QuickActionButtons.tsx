'use client';

import { Button } from "@/components/ui/Button";

export function QuickActionButtons() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Button
                variant="secondary"
                className="w-full"
                onClick={() => window.open('https://github.com/diegofbis63', '_blank')}
            >
                Manual Pro
            </Button>
            <Button
                variant="secondary"
                className="w-full"
                onClick={() => window.location.href = 'mailto:soporte@esteticapro.com'}
            >
                Soporte
            </Button>
        </div>
    );
}
