
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { setHelenaApiKey, getHelenaApiKey } from "@/services/api/helena-api";
import { setInfosimplesCredentials, getInfosimplesCredentials } from "@/services/api/infosimples-api";

export function ApiKeySetup() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("helena");
  
  // Helena API state
  const [helenaApiKey, setHelenaKey] = useState("");
  const [showHelenaKey, setShowHelenaKey] = useState(false);
  
  // Infosimples API state
  const [infosimplesEmail, setInfosimplesEmail] = useState("");
  const [infosimplesApiToken, setInfosimplesApiToken] = useState("");
  const [showInfosimplesToken, setShowInfosimplesToken] = useState(false);
  
  // Load saved values on component mount
  useEffect(() => {
    // Load Helena API key
    const savedHelenaKey = localStorage.getItem("helena_api_key") || "";
    if (savedHelenaKey) {
      setHelenaKey(savedHelenaKey);
      setHelenaApiKey(savedHelenaKey);
    }
    
    // Load Infosimples credentials
    const savedInfosimplesEmail = localStorage.getItem("infosimples_email") || "";
    const savedInfosimplesToken = localStorage.getItem("infosimples_token") || "";
    
    if (savedInfosimplesEmail && savedInfosimplesToken) {
      setInfosimplesEmail(savedInfosimplesEmail);
      setInfosimplesApiToken(savedInfosimplesToken);
      setInfosimplesCredentials(savedInfosimplesEmail, savedInfosimplesToken);
    }
  }, []);
  
  const saveHelenaApiKey = () => {
    if (!helenaApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save to localStorage (for demo purposes - in production use more secure storage)
      localStorage.setItem("helena_api_key", helenaApiKey);
      
      // Set in API service
      setHelenaApiKey(helenaApiKey);
      
      toast({
        title: "Success",
        description: "Helena API key saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };
  
  const saveInfosimplesCredentials = () => {
    if (!infosimplesEmail.trim() || !infosimplesApiToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter both email and API token",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save to localStorage (for demo purposes - in production use more secure storage)
      localStorage.setItem("infosimples_email", infosimplesEmail);
      localStorage.setItem("infosimples_token", infosimplesApiToken);
      
      // Set in API service
      setInfosimplesCredentials(infosimplesEmail, infosimplesApiToken);
      
      toast({
        title: "Success",
        description: "Infosimples credentials saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Configure your API keys for integration with external services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="helena">Helena API</TabsTrigger>
            <TabsTrigger value="infosimples">Infosimples API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="helena" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="helena-api-key">Helena API Key</Label>
              <div className="flex">
                <Input
                  id="helena-api-key"
                  type={showHelenaKey ? "text" : "password"}
                  value={helenaApiKey}
                  onChange={(e) => setHelenaKey(e.target.value)}
                  placeholder="Enter your Helena API key"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowHelenaKey(!showHelenaKey)}
                  className="ml-2"
                >
                  {showHelenaKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally in your browser and is sent securely to the Helena API when making requests.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="infosimples" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="infosimples-email">Email</Label>
              <Input
                id="infosimples-email"
                type="email"
                value={infosimplesEmail}
                onChange={(e) => setInfosimplesEmail(e.target.value)}
                placeholder="Enter your Infosimples account email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="infosimples-token">API Token</Label>
              <div className="flex">
                <Input
                  id="infosimples-token"
                  type={showInfosimplesToken ? "text" : "password"}
                  value={infosimplesApiToken}
                  onChange={(e) => setInfosimplesApiToken(e.target.value)}
                  placeholder="Enter your Infosimples API token"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowInfosimplesToken(!showInfosimplesToken)}
                  className="ml-2"
                >
                  {showInfosimplesToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your credentials are stored locally in your browser and are sent securely to the Infosimples API when making requests.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        {activeTab === "helena" ? (
          <Button onClick={saveHelenaApiKey}>Save Helena API Key</Button>
        ) : (
          <Button onClick={saveInfosimplesCredentials}>Save Infosimples Credentials</Button>
        )}
      </CardFooter>
    </Card>
  );
}
