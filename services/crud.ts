import { getDatabase } from './database';
import { ItemTemplate, InventoryItem, Location } from '../types';

// ==================== ITEM TEMPLATES CRUD ====================

export async function getAllItemTemplates(): Promise<ItemTemplate[]> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM ItemTemplates ORDER BY name');
  
  return result.rows.map(row => ({
    id: String(row.id),
    assetCode: String(row.assetCode || ''),
    name: String(row.name || ''),
    brand: String(row.brand || ''),
    model: String(row.model || ''),
    type: String(row.type || ''),
    color: String(row.color || ''),
    dimensions: String(row.dimensions || ''),
    other: String(row.other || ''),
    origin: String(row.origin || ''),
  }));
}

export async function getItemTemplateById(id: string): Promise<ItemTemplate | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM ItemTemplates WHERE id = ?',
    args: [id]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: String(row.id),
    assetCode: String(row.assetCode || ''),
    name: String(row.name || ''),
    brand: String(row.brand || ''),
    model: String(row.model || ''),
    type: String(row.type || ''),
    color: String(row.color || ''),
    dimensions: String(row.dimensions || ''),
    other: String(row.other || ''),
    origin: String(row.origin || ''),
  };
}

export async function createItemTemplate(template: Omit<ItemTemplate, 'id'>): Promise<ItemTemplate> {
  const db = getDatabase();
  const id = `tpl-${Date.now()}`;
  
  await db.execute({
    sql: `INSERT INTO ItemTemplates (id, assetCode, name, brand, model, type, color, dimensions, other, origin)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      template.assetCode,
      template.name,
      template.brand,
      template.model,
      template.type,
      template.color,
      template.dimensions,
      template.other,
      template.origin
    ]
  });
  
  return { id, ...template };
}

export async function updateItemTemplate(id: string, template: Partial<Omit<ItemTemplate, 'id'>>): Promise<void> {
  const db = getDatabase();
  
  const fields: string[] = [];
  const values: any[] = [];
  
  if (template.assetCode !== undefined) { fields.push('assetCode = ?'); values.push(template.assetCode); }
  if (template.name !== undefined) { fields.push('name = ?'); values.push(template.name); }
  if (template.brand !== undefined) { fields.push('brand = ?'); values.push(template.brand); }
  if (template.model !== undefined) { fields.push('model = ?'); values.push(template.model); }
  if (template.type !== undefined) { fields.push('type = ?'); values.push(template.type); }
  if (template.color !== undefined) { fields.push('color = ?'); values.push(template.color); }
  if (template.dimensions !== undefined) { fields.push('dimensions = ?'); values.push(template.dimensions); }
  if (template.other !== undefined) { fields.push('other = ?'); values.push(template.other); }
  if (template.origin !== undefined) { fields.push('origin = ?'); values.push(template.origin); }
  
  fields.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);
  
  await db.execute({
    sql: `UPDATE ItemTemplates SET ${fields.join(', ')} WHERE id = ?`,
    args: values
  });
}

export async function deleteItemTemplate(id: string): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: 'DELETE FROM ItemTemplates WHERE id = ?',
    args: [id]
  });
}

// ==================== INVENTORY ITEMS CRUD ====================

export async function getAllInventoryItems(): Promise<InventoryItem[]> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM InventoryItems ORDER BY posision');
  
  return result.rows.map(row => ({
    id: String(row.id),
    posision: Number(row.posision),
    templateId: String(row.templateId),
    location: String(row.location || ''),
    serial: String(row.serial || ''),
    situation: String(row.situation || ''),
    conservationState: String(row.conservationState || ''),
    observations: String(row.observations || ''),
  }));
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM InventoryItems WHERE id = ?',
    args: [id]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: String(row.id),
    posision: Number(row.posision),
    templateId: String(row.templateId),
    location: String(row.location || ''),
    serial: String(row.serial || ''),
    situation: String(row.situation || ''),
    conservationState: String(row.conservationState || ''),
    observations: String(row.observations || ''),
  };
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  const db = getDatabase();
  const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await db.execute({
    sql: `INSERT INTO InventoryItems (id, posision, templateId, location, serial, situation, conservationState, observations)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      item.posision,
      item.templateId,
      item.location,
      item.serial,
      item.situation,
      item.conservationState,
      item.observations || ''
    ]
  });
  
  return { id, ...item };
}

export async function createInventoryItems(items: Omit<InventoryItem, 'id'>[]): Promise<InventoryItem[]> {
  const db = getDatabase();
  const createdItems: InventoryItem[] = [];
  
  // Use transaction for batch insert
  for (const item of items) {
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await db.execute({
      sql: `INSERT INTO InventoryItems (id, posision, templateId, location, serial, situation, conservationState, observations)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        item.posision,
        item.templateId,
        item.location,
        item.serial,
        item.situation,
        item.conservationState,
        item.observations || ''
      ]
    });
    
    createdItems.push({ id, ...item });
  }
  
  return createdItems;
}

export async function updateInventoryItem(id: string, item: Partial<Omit<InventoryItem, 'id'>>): Promise<void> {
  const db = getDatabase();
  
  const fields: string[] = [];
  const values: any[] = [];
  
  if (item.posision !== undefined) { fields.push('posision = ?'); values.push(item.posision); }
  if (item.templateId !== undefined) { fields.push('templateId = ?'); values.push(item.templateId); }
  if (item.location !== undefined) { fields.push('location = ?'); values.push(item.location); }
  if (item.serial !== undefined) { fields.push('serial = ?'); values.push(item.serial); }
  if (item.situation !== undefined) { fields.push('situation = ?'); values.push(item.situation); }
  if (item.conservationState !== undefined) { fields.push('conservationState = ?'); values.push(item.conservationState); }
  if (item.observations !== undefined) { fields.push('observations = ?'); values.push(item.observations); }
  
  fields.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);
  
  await db.execute({
    sql: `UPDATE InventoryItems SET ${fields.join(', ')} WHERE id = ?`,
    args: values
  });
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: 'DELETE FROM InventoryItems WHERE id = ?',
    args: [id]
  });
}

// ==================== LOCATIONS CRUD ====================

export async function getAllLocations(): Promise<Location[]> {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM Locations ORDER BY name');
  
  return result.rows.map(row => ({
    id: String(row.id),
    name: String(row.name),
  }));
}

export async function getLocationById(id: string): Promise<Location | null> {
  const db = getDatabase();
  const result = await db.execute({
    sql: 'SELECT * FROM Locations WHERE id = ?',
    args: [id]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: String(row.id),
    name: String(row.name),
  };
}

export async function createLocation(location: Omit<Location, 'id'>): Promise<Location> {
  const db = getDatabase();
  const id = `loc-${Date.now()}`;
  
  await db.execute({
    sql: 'INSERT INTO Locations (id, name) VALUES (?, ?)',
    args: [id, location.name]
  });
  
  return { id, ...location };
}

export async function updateLocation(id: string, location: Partial<Omit<Location, 'id'>>): Promise<void> {
  const db = getDatabase();
  
  if (location.name !== undefined) {
    await db.execute({
      sql: 'UPDATE Locations SET name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      args: [location.name, id]
    });
  }
}

export async function deleteLocation(id: string): Promise<void> {
  const db = getDatabase();
  await db.execute({
    sql: 'DELETE FROM Locations WHERE id = ?',
    args: [id]
  });
}