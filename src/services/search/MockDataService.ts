
import { SearchResultFine } from '@/models/SearchHistory';

export const MockDataService = {
  // Mock function para gerar amostras de multas (mantida para compatibilidade)
  getMockFines(): SearchResultFine[] {
    return [
      {
        id: "1",
        autoNumber: "I41664643",
        date: "05/10/2020 10:15",
        agency: "RENAINF",
        plate: "KXC2317",
        owner: "ALEXANDER FLORENTINO DE SOUZA",
        respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
        situation: "Penalidade - Paga em: 06/08/2020 NOTIFICADA DA PENALIDADE",
        infraction: "74550 - TRANSITAR EM VELOCIDADE SUPERIOR À MÁXIMA PERMITIDA EM ATÉ 20%",
        location: "BR101 KM 426.2 - MANGARATIBA",
        frame: "218 INC I - MÉDIA",
        points: 4,
        dueDate: "08/10/2021",
        value: 130.16,
        discountValue: 104.12,
        process: "-"
      },
      {
        id: "2",
        autoNumber: "E43789654",
        date: "15/01/2021 08:30",
        agency: "DETRAN RJ",
        plate: "KXC2317",
        owner: "ALEXANDER FLORENTINO DE SOUZA",
        respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
        situation: "Penalidade - Notificada",
        infraction: "60503 - ESTACIONAR EM LOCAL PROIBIDO",
        location: "AV BRASIL 1250 - RIO DE JANEIRO",
        frame: "181 INC XVII - LEVE",
        points: 3,
        dueDate: "20/03/2021",
        value: 88.38,
        discountValue: 70.70,
        process: "-"
      },
      {
        id: "3",
        autoNumber: "B12398745",
        date: "10/03/2021 17:45",
        agency: "GUARDA MUNICIPAL",
        plate: "KXC2317",
        owner: "ALEXANDER FLORENTINO DE SOUZA",
        respPoints: "TIAGO FELIPPE DA SILVA MEDEIROS",
        situation: "Autuação - Em processamento",
        infraction: "73662 - AVANÇAR O SINAL VERMELHO DO SEMÁFORO",
        location: "RUA VOLUNTÁRIOS DA PÁTRIA - BOTAFOGO",
        frame: "208 - GRAVÍSSIMA",
        points: 7,
        dueDate: "15/05/2021",
        value: 293.47,
        discountValue: 234.78,
        process: "P202103456"
      }
    ];
  }
};
