
/**
 * Safely converts any data structure to a JSON-compatible format
 * Handles circular references, dates, and other special types
 * 
 * @param data Any data to be converted to JSON-safe format
 * @returns JSON-safe version of the data
 */
export function toJsonSafe(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }
  
  // Handle primitive types
  if (typeof data !== 'object') {
    return data;
  }
  
  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(toJsonSafe);
  }
  
  // Handle plain objects, avoiding circular references
  try {
    const seen = new WeakSet();
    const safeObj: Record<string, any> = {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        
        // Skip circular references
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            continue;
          }
          seen.add(value);
        }
        
        safeObj[key] = toJsonSafe(value);
      }
    }
    
    return safeObj;
  } catch (error) {
    console.error('Error converting to JSON-safe format:', error);
    return {};
  }
}

/**
 * Safely parses a JSON string, with error handling
 * 
 * @param jsonString JSON string to parse
 * @returns Parsed object or null if parsing fails
 */
export function parseJsonSafe<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}
