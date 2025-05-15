import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";

interface WebhookHeadersProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
}

export function WebhookHeaders({ headers, onChange }: WebhookHeadersProps) {
  const [newHeaderKey, setNewHeaderKey] = useState("");
  const [newHeaderValue, setNewHeaderValue] = useState("");

  const addHeader = () => {
    if (!newHeaderKey.trim()) return;

    const updatedHeaders = {
      ...headers,
      [newHeaderKey]: newHeaderValue,
    };

    onChange(updatedHeaders);
    setNewHeaderKey("");
    setNewHeaderValue("");
  };

  const removeHeader = (key: string) => {
    const { [key]: _, ...remainingHeaders } = headers;
    onChange(remainingHeaders);
  };

  const updateHeaderValue = (key: string, value: string) => {
    onChange({
      ...headers,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">HTTP Headers</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Add custom headers to send with webhook requests
        </p>
      </div>

      {/* Existing headers */}
      {Object.entries(headers).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-2">
          <div className="grid grid-cols-2 gap-2 flex-1">
            <Input value={key} disabled />
            <Input
              value={value}
              onChange={(e) => updateHeaderValue(key, e.target.value)}
              placeholder="Header value"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeHeader(key)}
            aria-label={`Remove ${key} header`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* Add new header */}
      <div className="flex items-center space-x-2">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <Input
            value={newHeaderKey}
            onChange={(e) => setNewHeaderKey(e.target.value)}
            placeholder="Header name"
          />
          <Input
            value={newHeaderValue}
            onChange={(e) => setNewHeaderValue(e.target.value)}
            placeholder="Header value"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={addHeader}
          disabled={!newHeaderKey.trim()}
          aria-label="Add header"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
