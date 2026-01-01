# DevUtility – Client-Side Universal Converter

## 1. Overview

DevUtility คือ web-based utility สำหรับแปลงข้อมูล (text / structured data / cryptographic formats) แบบ client-side 100%
โดยมุ่งเน้น ความโปร่งใส, ความเร็ว, และ ไม่ต้องพึ่ง backend

เครื่องมือนี้ถูกออกแบบให้:

- ใช้งานง่าย
- รองรับหลายรูปแบบการแปลง
- ไม่ต้องสลับหลายเมนูหรือหลายหน้า
- ทุกการแปลงเกิดขึ้นใน browser เท่านั้น

## 2. Problem Statement

ปัญหาปัจจุบัน:

- เครื่องมือแปลงข้อมูลส่วนใหญ่อยู่กระจัดกระจาย
- ต้องสลับหลายเว็บ / หลายเมนู
- บาง tool ส่งข้อมูลไป backend (เสี่ยงข้อมูลรั่ว)
- Keyboard layout convert (ไทย ↔ อังกฤษ) มักถูกเข้าใจผิดว่าเป็น translation

Pain Points:

- Developer ต้องการ tool ที่ "เร็ว + ปลอดภัย + predictable"
- ต้องการแปลงข้อมูลไปมา (bidirectional) โดยไม่ต้องคิดว่าใช้ tool ไหน
- ข้อมูล sensitive (JWT, hash, token) ไม่ควรออกจากเครื่อง

## 3. Goals & Non-Goals

### 3.1 Goals

- รองรับการแปลงข้อมูลหลายประเภทในที่เดียว
- ทุก process ทำงานแบบ client-side only
- รองรับการแปลงแบบ bidirectional (A ↔ B)
- UI เดียว ใช้ config-driven conversion
- เหมาะกับ developer / power user

### 3.2 Non-Goals

- ❌ ไม่ทำ translation ภาษา
- ❌ ไม่เก็บหรือ log ข้อมูลผู้ใช้
- ❌ ไม่รองรับ server-side processing
- ❌ ไม่ทำ user authentication / account system
- ❌ ไม่รองรับ encryption key management

## 4. Target Users

- Software Developers
- DevOps / Backend Engineers
- QA / Tester
- Power users ที่ต้องจัดการ text / config / token

## 5. Supported Conversions

### 5.1 Text & Encoding

| Type                             | Description                                  |
| -------------------------------- | -------------------------------------------- |
| Thai ↔ English (Keyboard Layout) | แปลงตามตำแหน่งปุ่ม keyboard ไม่ใช่การแปลภาษา |
| Base64 Encode / Decode           | RFC-compliant base64                         |
| MD5                              | Hash text เป็น MD5                           |
| SHA-256                          | Hash text เป็น SHA-256                       |
| bcrypt                           | Hash plaintext ด้วย bcrypt (client-side)     |
| JWT Decode                       | Decode header + payload                      |
| JWT Encode                       | Encode payload (no secret storage)           |

### 5.2 Structured Data (Dynamic Section)

Section นี้ต้องเป็น dynamic
ผู้ใช้เลือก input format และ output format ได้เอง
ไม่แยกเมนูย่อย

| Input | Output |
| ----- | ------ |
| JSON  | YAML   |
| YAML  | JSON   |
| TOML  | YAML   |

Rules:

- ระบบต้อง detect input format อัตโนมัติ (ถ้าเป็นไปได้)
- ผู้ใช้สามารถสลับ direction ได้ทันที
- ใช้ UI เดียวกันทั้งหมด

## 6. User Experience & Flow

### 6.1 Core Flow

1. User เลือก Conversion Type
2. ใส่ข้อมูลใน Input Panel
3. ระบบประมวลผลแบบ real-time หรือ on-demand
4. แสดงผลใน Output Panel
5. ผู้ใช้สามารถ:
   - Copy
   - Swap direction
   - Clear input

### 6.2 UI Principles

- Single-page layout
- Two-panel design (Input / Output)
- No modal overload
- Minimal clicks
- Keyboard friendly

## 7. Functional Requirements

### 7.1 Conversion Engine

- Conversion logic ต้อง:
  - Pure function
  - Stateless
  - Deterministic
  - รองรับ bidirectional mapping

### 7.2 Dynamic Conversion Section

- ผู้ใช้เลือก:
  - Input Format
  - Output Format
- UI ต้อง:
  - Reuse component เดียว
  - ไม่ duplicate menu / page
  - Conversion mapping ต้อง config-driven

### 7.3 Client-Side Only Guarantee

- ❗ ห้ามเรียก API
- ❗ ห้ามส่งข้อมูลออกจาก browser
- ใช้ native browser APIs หรือ JS libraries เท่านั้น

## 8. Non-Functional Requirements

### 8.1 Performance

- Conversion ต้องตอบสนอง < 100ms สำหรับ input ปกติ
- รองรับ text ขนาดกลาง (≤ 1MB)

### 8.2 Security

- No network request during conversion
- No localStorage / IndexedDB สำหรับข้อมูล input
- JWT secret ใช้เฉพาะ memory

### 8.3 Reliability

- Error ต้อง:
  - Explainable
  - Readable
  - ไม่ crash UI

## 9. Technical Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Libraries (Client-Side)

- crypto-js / Web Crypto API
- js-yaml
- toml parser
- bcryptjs
- jwt-decode

## 10. Success Metrics

- Conversion correctness 100%
- Zero backend dependency
- Zero data leakage
- User can convert any supported format in ≤ 2 interactions
- Tool usable offline (optional)

## 11. Risks & Open Questions

- bcrypt performance on large input
- Keyboard layout edge cases (Thai/English mixed)
- Format auto-detection accuracy
- Error messaging clarity for invalid formats

## 12. Future Enhancements (Out of Scope)

- Clipboard auto-detect
- Batch conversion
- Custom conversion plugin system
- CLI version of Convert Tool
