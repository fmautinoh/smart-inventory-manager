import { ItemTemplate, InventoryItem } from '../types';
import { initializeDatabase, setupDatabaseTables } from '../services/database';
import { getAllItemTemplates, getAllInventoryItems } from '../services/crud';

// Initialize database and load data
async function initializeData() {
  try {
    await initializeDatabase();
    await setupDatabaseTables();
    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('✗ Failed to initialize database:', error);
    throw error;
  }
}

// Fetch data from the legacy table if it exists
async function fetchLegacyData() {
  try {
    const { getDatabase } = await import('../services/database');
    const db = getDatabase();
    const rawData = await db.execute('SELECT * FROM InventoryItems');
    return rawData.rows;
  } catch (error) {
    console.warn('Legacy InventoryItems table not found or error fetching:', error);
    return [];
  }
}

// Process legacy data and migrate to new structure
async function processLegacyData() {
  const templates: ItemTemplate[] = [];
  const inventory: InventoryItem[] = [];
  const templateMap = new Map<string, string>();

  let templateCounter = 1;
  const rawData = await fetchLegacyData();
  
  if (rawData.length > 0) {
    console.log(`Processing ${rawData.length} legacy items...`);
    
    rawData.forEach((item, index) => {
      const templateProps = {
        assetCode: String(item.assetCode),
        name: String(item.name),
        brand: String(item.brand),
        model: String(item.model),
        type: '', 
        color: String(item.color),
        dimensions: String(item.dimensions),
        other: String(item.other),
        origin: String(item.origin),
      };

      const templateKey = JSON.stringify(Object.values(templateProps).map(v => String(v || '').trim().toUpperCase()));
      let templateId = templateMap.get(templateKey);

      if (!templateId) {
        templateId = `tpl-${templateCounter++}`;
        templates.push({ id: templateId, ...templateProps });
        templateMap.set(templateKey, templateId);
      }

      inventory.push({
        id: `item-${index + 1}`,
        posision: index + 1,
        templateId: templateId,
        location: '',
        serial: String(item.series === 'SIN SERIE' ? '' : item.series),
        situation: 'U',
        conservationState: 'BUENO',
        observations: ''
      });
    });
  }

  return { templates, inventory };
}

// Load data from database or use legacy data
async function loadInitialData() {
  await initializeData();
  
  try {
    // Try to load from new tables first
    const templates = await getAllItemTemplates();
    const inventory = await getAllInventoryItems();
    
    // If no data in new tables, try to migrate legacy data
    if (templates.length === 0 && inventory.length === 0) {
      console.log('No data in new tables, checking for legacy data...');
      const legacy = await processLegacyData();
      return legacy;
    }
    
    return { templates, inventory };
  } catch (error) {
    console.error('Error loading data:', error);
    return { templates: [], inventory: [] };
  }
}

// Export initial data as promises
const dataPromise = loadInitialData();

export const initialItemTemplates: ItemTemplate[] = [];
export const initialInventoryData: InventoryItem[] = [];

// Load data asynchronously
dataPromise.then(({ templates, inventory }) => {
  initialItemTemplates.push(...templates);
  initialInventoryData.push(...inventory);
  console.log(`✓ Loaded ${templates.length} templates and ${inventory.length} inventory items`);
}).catch(error => {
  console.error('✗ Failed to load initial data:', error);
});
