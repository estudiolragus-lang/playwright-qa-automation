// Convierte textos como "Item total: $39.98" o "$29.99" en el número 39.98 / 29.99
export function parsePrice(text) {
  return Number(text.replace(/[^0-9.]/g, ''));
}
