
// Manipulador de erros da API InfoSimples
export function handleInfosimplesError(code: number, message: string) {
  switch (code) {
    case 200:
    case 201:
      return null; // Sem erro
    case 601:
      return new Error('Autenticação falhou. Verifique seu token de API.');
    case 605:
      return new Error('Tempo limite excedido. A consulta demorou muito para ser processada.');
    case 612:
      return new Error('Registro não encontrado com os parâmetros fornecidos.');
    case 618:
      return new Error('Limite de requisições excedido. Tente novamente mais tarde.');
    default:
      return new Error(`Erro ${code}: ${message}`);
  }
}
