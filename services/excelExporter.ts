import { DisplayInventoryItem } from '../components/InventoryDashboard';

declare const XLSX: any; // Using XLSX from CDN

export const exportToExcel = (data: DisplayInventoryItem[], fileName: string): void => {
  if (typeof XLSX === 'undefined') {
    console.error('XLSX library is not loaded. Make sure it is included in your index.html.');
    alert('Excel export functionality is currently unavailable.');
    return;
  }
  
  // Map data to match original headers for consistency
  const dataToExport = data.map(item => ({
    'N°': item.id,
    'CÓDIGO PATRIM': item.template.assetCode,
    'DENOMINACIÓN': item.template.name,
    'UBICACIÓN': item.location,
    'MARCA': item.template.brand,
    'MODELO': item.template.model,
    'TIPO': item.template.type,
    'COLOR': item.template.color,
    'SERIE': item.serial,
    'DIMENSIONES': item.template.dimensions,
    'OTROS': item.template.other,
    'SITUACIÓN': item.situation,
    'ESTADO DE CONSERVACIÓN': item.conservationState,
    'ORIGEN DEL BIEN': item.template.origin,
    'OBSERVACIONES': item.observations || ''
  }));

  if(dataToExport.length === 0) {
    alert("No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

  // Auto-fit columns
  const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
    wch: Math.max(
        key.length, 
        ...dataToExport.map(row => (row[key as keyof typeof row] ?? '').toString().length)
    ) + 2 // Add extra padding
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
