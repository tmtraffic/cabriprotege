
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getAvailableEventTypes } from "@/services/integration/webhook-service";

interface WebhookEventsProps {
  selectedEvents: string[];
  onChange: (events: string[]) => void;
}

export function WebhookEvents({ selectedEvents, onChange }: WebhookEventsProps) {
  const eventTypes = getAvailableEventTypes();

  const toggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      onChange(selectedEvents.filter(e => e !== event));
    } else {
      onChange([...selectedEvents, event]);
    }
  };

  const selectAll = () => {
    onChange(eventTypes.map(e => e.id));
  };

  const selectNone = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Events</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select which events will trigger this webhook
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <Button variant="outline" size="sm" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={selectNone}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {eventTypes.map((event) => (
          <div key={event.id} className="flex items-center space-x-2">
            <Checkbox
              id={`event-${event.id}`}
              checked={selectedEvents.includes(event.id)}
              onCheckedChange={() => toggleEvent(event.id)}
            />
            <label
              htmlFor={`event-${event.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {event.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  function Button({ 
    children, 
    variant, 
    size, 
    onClick 
  }: { 
    children: React.ReactNode;
    variant: "outline";
    size: "sm";
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
      >
        {children}
      </button>
    );
  }
}
