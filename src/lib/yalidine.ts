/**
 * Yalidine Express API client (§13).
 *
 * Base URL and field names below are confirmed from Yalidine's own SDKs and
 * partner-integration docs (dashboard: Settings -> API -> Generate, at
 * yalidine.app/dev — requires a verified Yalidine business account, no fee
 * for API access itself). One thing NOT independently confirmed: the exact
 * JSON key names in the /fees/ response — Yalidine's raw REST response
 * shape isn't in any public doc I could verify, only the higher-level SDK
 * call signature. calculateFee() below tries several plausible key-name
 * candidates and throws a clear error naming the real keys if none match,
 * specifically so this fails loudly instead of silently returning 0 once
 * you have real credentials to test against.
 *
 * Required env vars:
 *   YALIDINE_API_ID, YALIDINE_API_TOKEN — from yalidine.app/dev
 *   YALIDINE_FROM_WILAYA_ID — Kayaaan's own shipping-origin wilaya (numeric ID, 1-58)
 */
const BASE_URL = "https://api.yalidine.app/v1";

function getAuthHeaders(): Record<string, string> {
  const id = process.env.YALIDINE_API_ID;
  const token = process.env.YALIDINE_API_TOKEN;
  if (!id || !token) {
    throw new Error("Yalidine not configured — set YALIDINE_API_ID and YALIDINE_API_TOKEN in .env.");
  }
  // Header names per Yalidine's documented convention — verify against your
  // actual yalidine.app/dev docs once you have real credentials.
  return { "X-API-ID": id, "X-API-TOKEN": token };
}

async function yalidineFetch(path: string): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: getAuthHeaders() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Yalidine API error (HTTP ${res.status}) on ${path}: ${body}`);
  }
  return res.json();
}

export type YalidineWilaya = { id: number; name: string };
export type YalidineCommune = { id: number; name: string; wilaya_id: number };

export async function listWilayas(): Promise<YalidineWilaya[]> {
  const data = await yalidineFetch("/wilayas/");
  return data.data ?? data; // some Yalidine list endpoints wrap results in { data: [...] }
}

export async function listCommunes(wilayaId: number): Promise<YalidineCommune[]> {
  const data = await yalidineFetch(`/communes/?wilaya_id=${wilayaId}`);
  return data.data ?? data;
}

export type DeliveryFee = { homeFee: number; officeFee: number };

/**
 * Fee for shipping FROM Kayaaan's origin wilaya (YALIDINE_FROM_WILAYA_ID) TO
 * the given destination wilaya. Yalidine prices per wilaya pair (commune
 * mainly affects which specific stopdesk/office is available, not the base
 * price) — this matches how the SDK's fees.calculate() only takes
 * from/to wilaya IDs, no commune.
 */
export async function calculateFee(toWilayaId: number): Promise<DeliveryFee> {
  const fromWilayaId = process.env.YALIDINE_FROM_WILAYA_ID;
  if (!fromWilayaId) {
    throw new Error("YALIDINE_FROM_WILAYA_ID not set in .env — this is Kayaaan's own shipping-origin wilaya.");
  }

  const data = await yalidineFetch(`/fees/?from_wilaya_id=${fromWilayaId}&to_wilaya_id=${toWilayaId}`);

  // Best-effort extraction — candidate key names seen across different
  // Yalidine partner integrations. If none match, fail loudly rather than
  // silently charging 0 delivery fee.
  const homeFee = data.home_fee ?? data.domicile ?? data.oui_domicile ?? data.zone_domicile;
  const officeFee = data.stopdesk_fee ?? data.desk ?? data.oui_stopdesk ?? data.zone_stopdesk;

  if (homeFee === undefined || officeFee === undefined) {
    throw new Error(
      `Yalidine /fees/ response has an unrecognized shape — got keys [${Object.keys(data).join(", ")}]. ` +
        `Update the key names in calculateFee() (src/lib/yalidine.ts) once you can see a real response.`
    );
  }

  return { homeFee: Number(homeFee), officeFee: Number(officeFee) };
}

export type CreateParcelInput = {
  orderId: string;
  toWilayaName: string;
  toCommuneName: string;
  firstname: string;
  familyname: string;
  contactPhone: string;
  address: string;
  productList: string; // human-readable item summary, e.g. "قميص أسود x2, هودي أحمر x1"
  price: number; // amount to collect on delivery (COD) — the order total
  isStopdesk: boolean; // false = home delivery, true = office/stopdesk pickup
};

export type CreatedParcel = { tracking: string; labelUrl?: string };

/**
 * Creates the actual shipment once an order is confirmed. Field names
 * confirmed consistently across multiple independent Yalidine SDKs/partner
 * docs. from_wilaya_name comes from YALIDINE_FROM_WILAYA_NAME (set once,
 * matches Kayaaan's fixed shipping origin).
 */
export async function createParcel(input: CreateParcelInput): Promise<CreatedParcel> {
  const fromWilayaName = process.env.YALIDINE_FROM_WILAYA_NAME;
  if (!fromWilayaName) {
    throw new Error("YALIDINE_FROM_WILAYA_NAME not set in .env.");
  }

  const res = await fetch(`${BASE_URL}/parcels/`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        order_id: input.orderId,
        from_wilaya_name: fromWilayaName,
        firstname: input.firstname,
        familyname: input.familyname,
        contact_phone: input.contactPhone,
        address: input.address,
        to_commune_name: input.toCommuneName,
        to_wilaya_name: input.toWilayaName,
        product_list: input.productList,
        price: input.price,
        is_stopdesk: input.isStopdesk,
        freeshipping: false,
        has_exchange: false,
      },
    ]),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Yalidine parcel creation failed (HTTP ${res.status}): ${body}`);
  }

  const data = await res.json();
  // Response shape for parcel creation isn't independently confirmed either
  // — same caveat as calculateFee(). Adjust once you can see a real response.
  const first = Array.isArray(data) ? data[0] : data;
  const tracking = first?.tracking ?? first?.[input.orderId]?.tracking;
  if (!tracking) {
    throw new Error(`Yalidine parcel creation returned an unrecognized shape: ${JSON.stringify(data)}`);
  }

  return { tracking, labelUrl: first?.label_url ?? first?.[input.orderId]?.label_url };
}
