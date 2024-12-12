import { openDB } from 'idb';
import CONFIG from '../globals/config';

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database, oldVersion, newVersion, transaction) {
    console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);

    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      const store = database.createObjectStore(OBJECT_STORE_NAME, { keyPath: '_id' });
      store.createIndex('userIdIndex', 'userIds'); // Buat indeks berdasarkan userIds
    } else if (oldVersion < 2) {
      const store = transaction.objectStore(OBJECT_STORE_NAME);
      if (!store.indexNames.contains('userIdIndex')) {
        store.createIndex('userIdIndex', 'userIds' , { multiEntry: true }); // Pastikan indeks ada
      }
    }
  },
});

const SavedAgrowisataIdb = {
  // Mendapatkan semua agrowisata yang telah disimpan oleh pengguna berdasarkan userId
  async getAllAgrowisata(userId) {
    const db = await dbPromise;
    try {
      const allAgrowisata = await db.getAll(OBJECT_STORE_NAME);

      // Pastikan hanya data dengan userId yang sesuai yang dikembalikan
      return allAgrowisata.filter(item => item.userIds && item.userIds.includes(userId));
    } catch (error) {
      console.error('Error fetching all agrowisata:', error);
      return [];
    }
  },

  // Menyimpan agrowisata dengan userIds yang benar
  async putAgrowisata(agrowisata, userId) {
    const db = await dbPromise;
  
    // Ambil data dari database jika sudah ada
    const existingData = await db.get(OBJECT_STORE_NAME, agrowisata._id);
  
    // Pastikan userIds adalah array
    const updatedData = {
      ...agrowisata,
      userIds: existingData?.userIds || [], // Ambil userIds dari data lama jika ada
    };
  
    // Tambahkan userId jika belum ada
    if (!updatedData.userIds.includes(userId)) {
      updatedData.userIds.push(userId);
    }
  
    try {
      // Simpan data ke IndexedDB
      await db.put(OBJECT_STORE_NAME, updatedData);
      console.log('Data saved to IndexedDB:', updatedData);
    } catch (error) {
      console.error('Error saving data to IndexedDB:', error);
    }
  },
  
  

  // Menghapus agrowisata berdasarkan ID
  async deleteAgrowisata(id) {
    const db = await dbPromise;
    try {
      await db.delete(OBJECT_STORE_NAME, id);
      console.log(`Data with ID ${id} deleted from IndexedDB`);
    } catch (error) {
      console.error(`Error deleting data with ID ${id}:`, error);
    }
  },
};

export default SavedAgrowisataIdb;
