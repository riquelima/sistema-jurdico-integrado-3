// Funções de prefetch para cada módulo do sistema

export const prefetchAcoesTrabalhistas = async () => {
  try {
    const response = await fetch("/api/acoes-trabalhistas?limit=100");
    return response.json();
  } catch (error) {
    console.warn("Failed to prefetch Ações Trabalhistas:", error);
    return [];
  }
};

export const prefetchAcoesCiveis = async () => {
  try {
    const response = await fetch("/api/acoes-civeis?limit=100");
    return response.json();
  } catch (error) {
    console.warn("Failed to prefetch Ações Cíveis:", error);
    return [];
  }
};

export const prefetchAcoesCriminais = async () => {
  try {
    const response = await fetch("/api/acoes-criminais?limit=100");
    return response.json();
  } catch (error) {
    console.warn("Failed to prefetch Ações Criminais:", error);
    return [];
  }
};

export const prefetchCompraVenda = async () => {
  try {
    const response = await fetch("/api/compra-venda-imoveis?limit=100");
    return response.json();
  } catch (error) {
    console.warn("Failed to prefetch Compra e Venda:", error);
    return [];
  }
};

export const prefetchPerdaNacionalidade = async () => {
  try {
    const response = await fetch("/api/perda-nacionalidade?limit=100");
    return response.json();
  } catch (error) {
    console.warn("Failed to prefetch Perda de Nacionalidade:", error);
    return [];
  }
};

export const prefetchVistos = async () => {
  try {
    const response = await fetch("/api/vistos?limit=100");
    return response.json();
  } catch (error) {
    console.warn("Failed to prefetch Vistos:", error);
    return [];
  }
};

export const prefetchDashboard = async () => {
  try {
    // Prefetch de dados do dashboard (estatísticas, notificações, etc.)
    const responses = await Promise.allSettled([
      fetch("/api/dashboard/stats"),
      fetch("/api/notifications/unread"),
      fetch("/api/recent-activities")
    ]);
    
    return {
      stats: responses[0].status === 'fulfilled' ? await responses[0].value.json() : {},
      notifications: responses[1].status === 'fulfilled' ? await responses[1].value.json() : [],
      activities: responses[2].status === 'fulfilled' ? await responses[2].value.json() : []
    };
  } catch (error) {
    console.warn("Failed to prefetch Dashboard:", error);
    return { stats: {}, notifications: [], activities: [] };
  }
};

// Funções de prefetch para páginas de detalhes individuais
export const prefetchAcaoTrabalhistaById = async (id: string) => {
  try {
    const response = await fetch(`/api/acoes-trabalhistas/${id}`);
    return response.json();
  } catch (error) {
    console.warn(`Failed to prefetch Ação Trabalhista ${id}:`, error);
    return null;
  }
};

export const prefetchAcaoCivilById = async (id: string) => {
  try {
    const response = await fetch(`/api/acoes-civeis/${id}`);
    return response.json();
  } catch (error) {
    console.warn(`Failed to prefetch Ação Civil ${id}:`, error);
    return null;
  }
};

export const prefetchAcaoCriminalById = async (id: string) => {
  try {
    const response = await fetch(`/api/acoes-criminais/${id}`);
    return response.json();
  } catch (error) {
    console.warn(`Failed to prefetch Ação Criminal ${id}:`, error);
    return null;
  }
};

export const prefetchCompraVendaById = async (id: string) => {
  try {
    const response = await fetch(`/api/compra-venda/${id}`);
    return response.json();
  } catch (error) {
    console.warn(`Failed to prefetch Compra e Venda ${id}:`, error);
    return null;
  }
};

export const prefetchPerdaNacionalidadeById = async (id: string) => {
  try {
    const response = await fetch(`/api/perda-nacionalidade/${id}`);
    return response.json();
  } catch (error) {
    console.warn(`Failed to prefetch Perda de Nacionalidade ${id}:`, error);
    return null;
  }
};

export const prefetchVistoById = async (id: string) => {
  try {
    const response = await fetch(`/api/vistos/${id}`);
    return response.json();
  } catch (error) {
    console.warn(`Failed to prefetch Visto ${id}:`, error);
    return null;
  }
};