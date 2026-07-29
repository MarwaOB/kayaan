/**
 * Static delivery pricing — replaces the Yalidine API integration.
 * Prices are per-wilaya, fixed by the carrier agreement, and updated here
 * manually whenever the rates change.
 *
 * homeFee  = A domicile (home delivery)
 * deskFee  = Stop Desk (office pickup)
 */

export type WilayaEntry = {
  id: number;   // sequential 1-based index used as a stable key in the UI
  name: string; // display name (Arabic or French — match what you want shown)
  homeFee: number;
  deskFee: number;
};

export const WILAYAS: WilayaEntry[] = [
  { id:  1, name: "Alger",               homeFee:  400, deskFee:  400 },
  { id:  2, name: "Blida",               homeFee:  650, deskFee:  450 },
  { id:  3, name: "Boumerdès",           homeFee:  650, deskFee:  450 },
  { id:  4, name: "Tipaza",              homeFee:  650, deskFee:  450 },
  { id:  5, name: "Chlef",               homeFee:  750, deskFee:  450 },
  { id:  6, name: "Oum El Bouaghi",      homeFee:  750, deskFee:  450 },
  { id:  7, name: "Batna",               homeFee:  750, deskFee:  450 },
  { id:  8, name: "Béjaïa",              homeFee:  750, deskFee:  450 },
  { id:  9, name: "Bouira",              homeFee:  750, deskFee:  450 },
  { id: 10, name: "Tlemcen",             homeFee:  750, deskFee:  450 },
  { id: 11, name: "Tiaret",              homeFee:  750, deskFee:  450 },
  { id: 12, name: "Tizi Ouzou",          homeFee:  750, deskFee:  450 },
  { id: 13, name: "Jijel",               homeFee:  750, deskFee:  450 },
  { id: 14, name: "Sétif",               homeFee:  750, deskFee:  450 },
  { id: 15, name: "Saïda",               homeFee:  750, deskFee:  450 },
  { id: 16, name: "Skikda",              homeFee:  750, deskFee:  450 },
  { id: 17, name: "Sidi Bel Abbès",      homeFee:  750, deskFee:  450 },
  { id: 18, name: "Annaba",              homeFee:  750, deskFee:  450 },
  { id: 19, name: "Guelma",              homeFee:  750, deskFee:  450 },
  { id: 20, name: "Constantine",         homeFee:  750, deskFee:  450 },
  { id: 21, name: "Médéa",               homeFee:  750, deskFee:  450 },
  { id: 22, name: "Mostaganem",          homeFee:  750, deskFee:  450 },
  { id: 23, name: "M'Sila",              homeFee:  750, deskFee:  450 },
  { id: 24, name: "Mascara",             homeFee:  750, deskFee:  450 },
  { id: 25, name: "Borj Bou Arréridj",   homeFee:  750, deskFee:  450 },
  { id: 26, name: "El Tarf",             homeFee:  750, deskFee:  450 },
  { id: 27, name: "Tissemsilt",          homeFee:  750, deskFee:  450 },
  { id: 28, name: "Khenchela",           homeFee:  750, deskFee:  450 },
  { id: 29, name: "Souk Ahras",          homeFee:  750, deskFee:  450 },
  { id: 30, name: "Mila",                homeFee:  750, deskFee:  450 },
  { id: 31, name: "Aïn Defla",           homeFee:  750, deskFee:  450 },
  { id: 32, name: "Aïn Témouchent",      homeFee:  750, deskFee:  450 },
  { id: 33, name: "Relizane",            homeFee:  750, deskFee:  450 },
  { id: 34, name: "Laghouat",            homeFee:  950, deskFee:  550 },
  { id: 35, name: "Biskra",              homeFee:  950, deskFee:  550 },
  { id: 36, name: "Tébessa",             homeFee:  950, deskFee:  550 },
  { id: 37, name: "Djelfa",              homeFee:  950, deskFee:  550 },
  { id: 38, name: "Ouargla",             homeFee:  950, deskFee:  550 },
  { id: 39, name: "El Oued",             homeFee:  950, deskFee:  550 },
  { id: 40, name: "Ghardaïa",            homeFee:  950, deskFee:  550 },
  { id: 41, name: "Ouled Djellal",       homeFee:  950, deskFee:  550 },
  { id: 42, name: "Touggourt",           homeFee:  950, deskFee:  550 },
  { id: 43, name: "El M'Ghair",          homeFee:  950, deskFee:  550 },
  { id: 44, name: "El Menia",            homeFee:  950, deskFee:  550 },
  { id: 45, name: "Timimoun",            homeFee: 1350, deskFee:  900 },
  { id: 46, name: "Bordj Badji Mokhtar", homeFee: 1350, deskFee:  900 },
  { id: 47, name: "Béni Abbès",          homeFee: 1350, deskFee:  900 },
  { id: 48, name: "Adrar",               homeFee: 1400, deskFee:  900 },
  { id: 49, name: "Béchar",              homeFee: 1400, deskFee:  900 },
  { id: 50, name: "El Bayadh",           homeFee: 1400, deskFee:  900 },
  { id: 51, name: "Naâma",               homeFee: 1400, deskFee:  900 },
  { id: 52, name: "In Salah",            homeFee: 1550, deskFee: 1300 },
  { id: 53, name: "In Guezam",           homeFee: 1550, deskFee: 1300 },
  { id: 54, name: "Djanet",              homeFee: 1550, deskFee: 1300 },
  { id: 55, name: "Tamanrasset",         homeFee: 1600, deskFee: 1300 },
  { id: 56, name: "Illizi",              homeFee: 1600, deskFee: 1300 },
  { id: 57, name: "Tindouf",             homeFee: 1600, deskFee: 1300 },
];

// Keyed by ID for O(1) lookup during checkout.
const BY_ID = new Map<number, WilayaEntry>(WILAYAS.map((w) => [w.id, w]));

export type DeliveryFee = { homeFee: number; deskFee: number };

/**
 * Returns the delivery fees for the given wilaya ID, or null if the ID is
 * not found (should never happen if the wilaya was selected from our list).
 */
export function getDeliveryFee(wilayaId: number): DeliveryFee | null {
  const entry = BY_ID.get(wilayaId);
  if (!entry) return null;
  return { homeFee: entry.homeFee, deskFee: entry.deskFee };
}
