import { toast } from "@/components/ui/sonner";

// Define webhook types
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers: Record<string, string>;
  enabled: boolean;
  createdAt: string;
  lastTriggered?: string;
  failCount?: number;
}

// In-memory storage for demo purposes
// In a real application, this would come from a database
const STORAGE_KEY = "app_webhooks";

/**
 * Get all configured webhooks
 */
export function getAllWebhooks(): Webhook[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get webhooks:", error);
    return [];
  }
}

/**
 * Save a new webhook
 */
export function saveWebhook(webhook: Omit<Webhook, "id" | "createdAt">): Webhook {
  try {
    const webhooks = getAllWebhooks();
    
    const newWebhook: Webhook = {
      ...webhook,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    webhooks.push(newWebhook);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(webhooks));
    
    return newWebhook;
  } catch (error) {
    console.error("Failed to save webhook:", error);
    throw new Error("Failed to save webhook");
  }
}

/**
 * Update an existing webhook
 */
export function updateWebhook(id: string, updates: Partial<Webhook>): Webhook {
  try {
    const webhooks = getAllWebhooks();
    const index = webhooks.findIndex(hook => hook.id === id);
    
    if (index === -1) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    const updatedWebhook: Webhook = {
      ...webhooks[index],
      ...updates,
    };
    
    webhooks[index] = updatedWebhook;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(webhooks));
    
    return updatedWebhook;
  } catch (error) {
    console.error("Failed to update webhook:", error);
    throw new Error("Failed to update webhook");
  }
}

/**
 * Delete a webhook
 */
export function deleteWebhook(id: string): void {
  try {
    const webhooks = getAllWebhooks();
    const filteredWebhooks = webhooks.filter(hook => hook.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredWebhooks));
  } catch (error) {
    console.error("Failed to delete webhook:", error);
    throw new Error("Failed to delete webhook");
  }
}

/**
 * Toggle webhook enabled status
 */
export function toggleWebhookStatus(id: string): Webhook {
  try {
    const webhooks = getAllWebhooks();
    const index = webhooks.findIndex(hook => hook.id === id);
    
    if (index === -1) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    webhooks[index].enabled = !webhooks[index].enabled;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(webhooks));
    
    return webhooks[index];
  } catch (error) {
    console.error("Failed to toggle webhook status:", error);
    throw new Error("Failed to toggle webhook status");
  }
}

/**
 * Test a webhook by sending a test event
 */
export const testWebhook = async (webhook: Webhook): Promise<{ success: boolean; message: string }> => {
  try {
    const testPayload = {
      event: "test_event",
      timestamp: new Date().toISOString(),
      data: {
        message: "This is a test webhook event",
      },
    };
    
    // Create headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...webhook.headers,
    };
    
    // Make the request
    const response = await fetch(webhook.url, {
      method: "POST",
      headers,
      body: JSON.stringify(testPayload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Update last triggered timestamp
    updateWebhook(webhook.id, { 
      lastTriggered: new Date().toISOString(),
      failCount: 0
    });
    
    notifyWebhookReceived(testPayload);
    
    return {
      success: true,
      message: "Webhook test successful!"
    };
  } catch (error) {
    console.error("Error testing webhook:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to test webhook"
    };
  }
};

/**
 * Helper to generate a unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + "-" + Date.now().toString(36);
}

/**
 * Get available event types
 */
export function getAvailableEventTypes(): { id: string; name: string }[] {
  return [
    { id: "fine.created", name: "Fine Created" },
    { id: "fine.updated", name: "Fine Updated" },
    { id: "fine.deleted", name: "Fine Deleted" },
    { id: "process.created", name: "Process Created" },
    { id: "process.updated", name: "Process Updated" },
    { id: "process.status_changed", name: "Process Status Changed" },
    { id: "client.created", name: "Client Created" },
    { id: "client.updated", name: "Client Updated" },
    { id: "vehicle.created", name: "Vehicle Created" },
    { id: "vehicle.updated", name: "Vehicle Updated" },
    { id: "search.completed", name: "Search Completed" },
  ];
}

/**
 * Trigger a webhook for a specific event
 */
export async function triggerWebhook(eventType: string, data: any): Promise<void> {
  try {
    const webhooks = getAllWebhooks().filter(
      webhook => webhook.enabled && webhook.events.includes(eventType)
    );
    
    if (webhooks.length === 0) return;
    
    const payload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data,
    };
    
    // Send to each matching webhook
    const promises = webhooks.map(async webhook => {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...webhook.headers,
        };
        
        const response = await fetch(webhook.url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Update last triggered timestamp
        updateWebhook(webhook.id, { 
          lastTriggered: new Date().toISOString(),
          failCount: 0
        });
        
        return { success: true, webhookId: webhook.id };
      } catch (error) {
        console.error(`Failed to trigger webhook ${webhook.id}:`, error);
        
        // Update fail count
        const currentWebhook = getAllWebhooks().find(hook => hook.id === webhook.id);
        if (currentWebhook) {
          updateWebhook(webhook.id, { 
            lastTriggered: new Date().toISOString(),
            failCount: (currentWebhook.failCount || 0) + 1
          });
        }
        
        return { success: false, webhookId: webhook.id, error };
      }
    });
    
    await Promise.allSettled(promises);
  } catch (error) {
    console.error("Failed to trigger webhooks:", error);
  }
}

/**
 * Notify that a webhook has been received
 */
const notifyWebhookReceived = (payload: any) => {
  toast({
    description: `Received webhook with ID: ${payload.id || 'unknown'}`,
  });
};
