
// Normaliza os dados da resposta da API
export function normalizeResponseData(searchType: string, searchQuery: string, responseData: any) {
  if (searchType === 'cnh') {
    return {
      success: true,
      data: {
        name: responseData.data?.nome || responseData.data?.name || "Nome não disponível",
        cnh: searchQuery,
        category: responseData.data?.categoria || responseData.data?.category || "Não informada",
        status: responseData.data?.situacao || responseData.data?.status || "Regular",
        expirationDate: responseData.data?.validade || responseData.data?.expiration_date || "Não informada",
        points: responseData.data?.pontuacao || responseData.data?.points || 0,
        fines: responseData.data?.multas || responseData.data?.fines || []
      }
    };
  } else if (searchType === 'vehicle') {
    return {
      success: true,
      data: {
        plate: searchQuery,
        renavam: responseData.data?.renavam || "Não disponível",
        model: responseData.data?.modelo || responseData.data?.model || "Não disponível",
        year: responseData.data?.ano || responseData.data?.year || "Não disponível",
        owner: responseData.data?.proprietario || responseData.data?.owner || "Não disponível",
        fines: responseData.data?.multas || responseData.data?.fines || []
      }
    };
  } else {
    return {
      success: true,
      data: responseData.data
    };
  }
}
