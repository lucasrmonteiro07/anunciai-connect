/**
 * Utilitário para integração com Nominatim (OpenStreetMap)
 * Segue as diretrizes da documentação oficial: https://wiki.openstreetmap.org/wiki/API_v0.6
 */

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    road?: string;
    house_number?: string;
  };
}

interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    road?: string;
    houseNumber?: string;
  };
}

class NominatimService {
  private static instance: NominatimService;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private readonly RATE_LIMIT_DELAY = 1000; // 1 segundo entre requisições
  private readonly MAX_RETRIES = 3;

  private constructor() {}

  static getInstance(): NominatimService {
    if (!NominatimService.instance) {
      NominatimService.instance = new NominatimService();
    }
    return NominatimService.instance;
  }

  /**
   * Processa a fila de requisições respeitando o rate limit
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Erro na requisição Nominatim:', error);
        }
        await this.delay(this.RATE_LIMIT_DELAY);
      }
    }

    this.isProcessing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Busca coordenadas para um endereço usando Nominatim
   * Segue as diretrizes de uso responsável da API
   */
  async geocode(address: string): Promise<GeocodingResult | null> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.performGeocodeRequest(address);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async performGeocodeRequest(address: string): Promise<GeocodingResult | null> {
    const baseUrl = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
      format: 'json',
      q: address,
      limit: '1',
      countrycodes: 'br',
      addressdetails: '1',
      email: 'anunciai@anunciai.app.br', // Identificação do usuário conforme diretrizes
      'accept-language': 'pt-BR', // Idioma preferido
      dedupe: '1', // Remove duplicatas
      bounded: '1', // Limita busca ao país especificado
    });

    const url = `${baseUrl}?${params.toString()}`;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Anunciai-Connect/1.0 (anunciai@anunciai.app.br)', // User-Agent identificando a aplicação
          },
        });

        if (!response.ok) {
          if (response.status === 429) {
            // Rate limit excedido, aguardar mais tempo
            console.warn(`Rate limit excedido. Tentativa ${attempt}/${this.MAX_RETRIES}`);
            await this.delay(this.RATE_LIMIT_DELAY * attempt);
            continue;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: NominatimResponse[] = await response.json();

        if (!data || data.length === 0) {
          return null;
        }

        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          displayName: result.display_name,
          address: result.address ? {
            city: result.address.city,
            state: result.address.state,
            country: result.address.country,
            postcode: result.address.postcode,
            road: result.address.road,
            houseNumber: result.address.house_number,
          } : undefined,
        };

      } catch (error) {
        console.error(`Tentativa ${attempt} falhou:`, error);
        if (attempt === this.MAX_RETRIES) {
          throw error;
        }
        await this.delay(this.RATE_LIMIT_DELAY * attempt);
      }
    }

    return null;
  }

  /**
   * Busca reversa - obtém endereço a partir de coordenadas
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.performReverseGeocodeRequest(latitude, longitude);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async performReverseGeocodeRequest(latitude: number, longitude: number): Promise<string | null> {
    const baseUrl = 'https://nominatim.openstreetmap.org/reverse';
    const params = new URLSearchParams({
      format: 'json',
      lat: latitude.toString(),
      lon: longitude.toString(),
      zoom: '18',
      addressdetails: '1',
      email: 'anunciai@anunciai.app.br',
      'accept-language': 'pt-BR',
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Anunciai-Connect/1.0 (anunciai@anunciai.app.br)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.display_name || null;

    } catch (error) {
      console.error('Erro na geocodificação reversa:', error);
      return null;
    }
  }
}

// Exportar instância singleton
export const nominatimService = NominatimService.getInstance();
export type { GeocodingResult };
