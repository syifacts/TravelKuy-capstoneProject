class DesaWisataService {
    static async fetchData() {
      try {
        const response = await fetch('desa-wisata.json');
        if (!response.ok) throw new Error('Gagal memuat data');
        const data = await response.json();
        return Object.values(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    }
  
    static async getDesaById(id) {
      const data = await this.fetchData();
      return data.find((desa) => desa.id === id) || null;
    }
  }
  
  export default DesaWisataService;
  