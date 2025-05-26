
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

// Validation schemas
const finesSchema = z.object({
  searchType: z.enum(["placa", "renavam"]),
  value: z.string().min(1, "Campo obrigatório"),
});

const cnhSchema = z.object({
  searchType: z.enum(["cnh", "cpf"]),
  value: z.string().min(1, "Campo obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
});

const crlvSchema = z.object({
  searchType: z.enum(["placa", "renavam"]),
  value: z.string().min(1, "Campo obrigatório"),
});

type FinesFormData = z.infer<typeof finesSchema>;
type CNHFormData = z.infer<typeof cnhSchema>;
type CRLVFormData = z.infer<typeof crlvSchema>;

const InfosimplesSearch = () => {
  const [activeTab, setActiveTab] = useState("fines");

  // Form instances
  const finesForm = useForm<FinesFormData>({
    resolver: zodResolver(finesSchema),
    defaultValues: {
      searchType: "placa",
      value: "",
    },
  });

  const cnhForm = useForm<CNHFormData>({
    resolver: zodResolver(cnhSchema),
    defaultValues: {
      searchType: "cnh",
      value: "",
      birthDate: "",
    },
  });

  const crlvForm = useForm<CRLVFormData>({
    resolver: zodResolver(crlvSchema),
    defaultValues: {
      searchType: "placa",
      value: "",
    },
  });

  // Form handlers
  const onFinesSubmit = (data: FinesFormData) => {
    console.log("Consulta de multas:", data);
    toast({
      title: "Funcionalidade em implementação",
      description: `Consulta de multas por ${data.searchType}: ${data.value}`,
    });
  };

  const onCNHSubmit = (data: CNHFormData) => {
    console.log("Consulta CNH:", data);
    toast({
      title: "Funcionalidade em implementação",
      description: `Consulta CNH por ${data.searchType}: ${data.value}`,
    });
  };

  const onCRLVSubmit = (data: CRLVFormData) => {
    console.log("Consulta CRLV:", data);
    toast({
      title: "Funcionalidade em implementação",
      description: `Consulta CRLV por ${data.searchType}: ${data.value}`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Consultas Infosimples</h1>
        <p className="text-gray-600 mt-2">
          Realize consultas de multas, CNH e CRLV através da API Infosimples
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consultas Disponíveis</CardTitle>
          <CardDescription>
            Escolha o tipo de consulta que deseja realizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fines">Multas</TabsTrigger>
              <TabsTrigger value="cnh">CNH</TabsTrigger>
              <TabsTrigger value="crlv">CRLV</TabsTrigger>
            </TabsList>

            {/* Multas Tab */}
            <TabsContent value="fines" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Consulta de Multas</CardTitle>
                  <CardDescription>
                    Consulte multas de trânsito por placa ou RENAVAM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...finesForm}>
                    <form onSubmit={finesForm.handleSubmit(onFinesSubmit)} className="space-y-6">
                      <FormField
                        control={finesForm.control}
                        name="searchType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Busca</FormLabel>
                            <FormControl>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    value="placa"
                                    checked={field.value === "placa"}
                                    onChange={() => field.onChange("placa")}
                                  />
                                  Placa
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    value="renavam"
                                    checked={field.value === "renavam"}
                                    onChange={() => field.onChange("renavam")}
                                  />
                                  RENAVAM
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={finesForm.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {finesForm.watch("searchType") === "placa" ? "Placa" : "RENAVAM"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  finesForm.watch("searchType") === "placa"
                                    ? "Ex: ABC1234"
                                    : "Ex: 123456789"
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        Consultar Multas
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CNH Tab */}
            <TabsContent value="cnh" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Consulta de CNH</CardTitle>
                  <CardDescription>
                    Consulte informações da CNH por número ou CPF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...cnhForm}>
                    <form onSubmit={cnhForm.handleSubmit(onCNHSubmit)} className="space-y-6">
                      <FormField
                        control={cnhForm.control}
                        name="searchType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Busca</FormLabel>
                            <FormControl>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    value="cnh"
                                    checked={field.value === "cnh"}
                                    onChange={() => field.onChange("cnh")}
                                  />
                                  Número da CNH
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    value="cpf"
                                    checked={field.value === "cpf"}
                                    onChange={() => field.onChange("cpf")}
                                  />
                                  CPF
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={cnhForm.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {cnhForm.watch("searchType") === "cnh" ? "Número da CNH" : "CPF"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  cnhForm.watch("searchType") === "cnh"
                                    ? "Ex: 12345678901"
                                    : "Ex: 123.456.789-01"
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={cnhForm.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        Consultar CNH
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CRLV Tab */}
            <TabsContent value="crlv" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Consulta de CRLV</CardTitle>
                  <CardDescription>
                    Consulte informações do CRLV por placa ou RENAVAM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...crlvForm}>
                    <form onSubmit={crlvForm.handleSubmit(onCRLVSubmit)} className="space-y-6">
                      <FormField
                        control={crlvForm.control}
                        name="searchType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Busca</FormLabel>
                            <FormControl>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    value="placa"
                                    checked={field.value === "placa"}
                                    onChange={() => field.onChange("placa")}
                                  />
                                  Placa
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    value="renavam"
                                    checked={field.value === "renavam"}
                                    onChange={() => field.onChange("renavam")}
                                  />
                                  RENAVAM
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={crlvForm.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {crlvForm.watch("searchType") === "placa" ? "Placa" : "RENAVAM"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  crlvForm.watch("searchType") === "placa"
                                    ? "Ex: ABC1234"
                                    : "Ex: 123456789"
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        Consultar CRLV
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfosimplesSearch;
