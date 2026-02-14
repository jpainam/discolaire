# Staff Attendance Device Integration

This project now supports machine-driven staff check-ins via:

- `POST /api/attendances/checkin`

Use this endpoint from an RFID/NFC or fingerprint device integration service.

## 1. API Contract

### Security

Send one of:

- Header `x-api-key: <DISCOLAIRE_API_KEY>`
- Header `Authorization: Bearer <DISCOLAIRE_API_KEY>`

Also provide tenant context (multi-tenant DB):

- Header `discolaire-tenant: <tenant>`
- or query string `?tenant=<tenant>`
- or body field `tenant`
- or fallback env `NEXT_PUBLIC_DEFAULT_TENANT`

### Request body

At least one staff identifier is required.

```json
{
  "staffId": "staff_uuid_optional",
  "userId": "user_uuid_optional",
  "username": "staff_username_optional",
  "email": "staff_email_optional",
  "schoolId": "optional_school_id_check",
  "timestamp": "2026-02-13T08:02:00.000Z",
  "scheduledStartAt": "2026-02-13T08:00:00.000Z",
  "lateAfterMinutes": 10,
  "status": "present",
  "source": "main-gate-rfid",
  "observation": "Card swipe",
  "createdById": "optional_user_id",
  "dedupeByDay": true,
  "allowInactive": false,
  "tenant": "demo"
}
```

Allowed `status` values:

- `present`
- `absent`
- `late`
- `holiday`
- `mission`
- `in_mission`

### Behavior

- If `status` is omitted, it is auto-computed:
  - `late` when `timestamp > scheduledStartAt + lateAfterMinutes`
  - otherwise `present`
- If `dedupeByDay=true` (default), a second swipe the same day updates the existing row instead of creating a duplicate.

### Example

```bash
curl -X POST "https://your-domain.com/api/attendances/checkin?tenant=demo" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${DISCOLAIRE_API_KEY}" \
  -d '{
    "username": "john.doe",
    "source": "front-door-rfid",
    "timestamp": "2026-02-13T07:58:00.000Z",
    "scheduledStartAt": "2026-02-13T08:00:00.000Z",
    "lateAfterMinutes": 10
  }'
```

## 2. Device Architecture (Recommended)

Do not connect most terminals directly to your public API. Use a small gateway service (Raspberry Pi/mini PC/cloud worker):

1. Device emits event (swipe/fingerprint).
2. Gateway receives event from vendor SDK/cloud webhook.
3. Gateway maps device user/card to `staffId` or `username`.
4. Gateway calls `/api/attendances/checkin`.
5. Gateway retries on transient errors and logs failures.

## 3. What Kind of Device to Buy

Choose devices with open integration options (HTTP push/API/SDK), not devices that only export CSV manually.

### Option A: Biometric terminal (easy operations)

Best when you want standalone hardware at school entrances.

Buy only models/ecosystems with:

- API/webhook or event push support
- Offline event buffering + automatic sync
- NTP time sync
- Exportable user identifiers (employee ID/card UID)

Useful references:

- Hikvision developer docs (ISAPI): https://www.hikvision.com/en/support/development/download/
- ZKTeco API docs (ZKBio Time): https://www.zkteco.com/en/document-api.php

### Option B: USB RFID/NFC reader + gateway computer (maximum control)

Best for custom workflows and fastest API integration.

Useful references:

- ACS ACR1552U (SDK/API style integration): https://www.acs.com.hk/en/products/981/acr1552u-usb-nfc-reader-iv/

### Option C: USB fingerprint scanner + gateway app

Best if you want biometric capture but custom software ownership.

Useful references:

- HID DigitalPersona developer portal/SDK: https://hidglobal.github.io/digitalpersona-access-management-services/

## 4. Procurement Checklist

Before buying, confirm with seller/integrator:

- Exact model supports API/event push in your region/firmware.
- Developer documentation is available without vendor lock-in.
- Device can emit stable identifier (employee code/card UID/template ID).
- Events can be replayed after internet outage.
- Vendor can provide sample payload/webhook or SDK example.

## 5. Mapping Strategy in Discolaire

Recommended mapping key priority:

1. `staffId` (most stable)
2. `userId`
3. `username`
4. `email`

For RFID cards, keep a mapping table in your gateway (card UID -> `staffId`) and post only trusted IDs to this API.

## 6. Operations Notes

- Rotate `DISCOLAIRE_API_KEY` periodically.
- Restrict gateway egress to your API domain.
- Monitor for repeated 401/404 responses (misconfiguration or mapping drift).
- Keep terminal and gateway clocks synced to avoid wrong late/present classification.
