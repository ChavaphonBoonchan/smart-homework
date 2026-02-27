# 📚 Smart Homework

แอปจัดการการบ้านบนมือถือ สร้างด้วย React Native + Expo SDK 54

## 📥 ดาวน์โหลด APK

[![Download APK](https://img.shields.io/badge/Download-APK%20v1.0.0-blue?style=for-the-badge&logo=android)](https://github.com/ChavaphonBoonchan/smart-homework/releases/download/v1.0.0/smart-homework-v1.0.0.apk)

**วิธีติดตั้ง:**
1. คลิกปุ่มด้านบนเพื่อดาวน์โหลด APK
2. เปิดไฟล์ APK บนมือถือ Android
3. อนุญาตการติดตั้งจากแหล่งที่ไม่รู้จัก (ถ้าถาม)
4. ติดตั้งและเปิดใช้งาน

> **หมายเหตุ:** รองรับ Android 7.0 (API 24) ขึ้นไป

---

## ✨ ฟีเจอร์หลัก

- **เพิ่ม/แก้ไข/ลบ** งานการบ้านได้อย่างง่ายดาย
- **เลือกวันที่และเวลา** ผ่าน native date/time picker (จิ้มปฏิทิน)
- **ระดับความสำคัญ** 1–5 พร้อมสีแสดงผล
- **แจ้งเตือน** ล่วงหน้า 1 วันก่อนถึงกำหนด
- **สถานะงาน** รวม: ทั้งหมด / ค้างอยู่ / เสร็จแล้ว / เกินกำหนด
- **เรียงลำดับ** งานที่ยังไม่เสร็จก่อน → ลำดับความสำคัญ → วันที่
- **บันทึกข้อมูล** ใน SQLite บนเครื่องโดยไม่ต้องใช้อินเทอร์เน็ต

## 🛠 Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | React Native + Expo SDK 54 |
| Database | expo-sqlite (SQLite on-device) |
| Notifications | expo-notifications |
| Date Picker | @react-native-community/datetimepicker |
| ORM Schema | Prisma 7 |
| Language | JavaScript (JSX) |

## 📁 โครงสร้างโปรเจกต์

```
smart-homework/
├── App.js                  # UI หลัก (หน้าเดียว)
├── index.js                # Entry point
├── app.json                # Expo config
├── babel.config.js         # Babel config
├── package.json            # Dependencies
├── prisma/
│   └── schema.prisma       # Prisma schema (Homework model)
├── prisma.config.ts        # Prisma config (datasource URL)
├── src/
│   ├── database.js         # SQLite CRUD helpers
│   └── notifications.js    # Notification helpers
├── .env                    # Environment variables (ไม่ขึ้น Git)
└── .env.example            # ตัวอย่าง env vars
```

---

## 🚀 วิธีติดตั้งและรันโปรเจกต์ (สำหรับมือใหม่)

> ทำตามทีละขั้นตอน ไม่ต้องมีความรู้มาก่อน ✅

---

### ขั้นตอนที่ 1 — ติดตั้ง Node.js

Node.js คือโปรแกรมที่จำเป็นสำหรับรันโค้ด JavaScript บนคอมพิวเตอร์

1. ไปที่เว็บไซต์ **[https://nodejs.org](https://nodejs.org)**
2. กดดาวน์โหลดปุ่ม **"LTS"** (แนะนำ — เวอร์ชันเสถียร)
3. เปิดไฟล์ที่ดาวน์โหลดมา แล้วกด **Next** ไปเรื่อยๆ จนติดตั้งเสร็จ
4. ตรวจสอบว่าติดตั้งสำเร็จโดยเปิด **Command Prompt** (กด `Win + R` → พิมพ์ `cmd` → Enter) แล้วพิมพ์:

```bash
node -v
```

ถ้าขึ้นตัวเลข เช่น `v22.22.0` แสดงว่าติดตั้งสำเร็จ ✅

---

### ขั้นตอนที่ 2 — ติดตั้ง Git

Git คือโปรแกรมสำหรับดาวน์โหลดโค้ดจาก GitHub มาใช้งาน

1. ไปที่เว็บไซต์ **[https://git-scm.com](https://git-scm.com)**
2. กดดาวน์โหลด **"Download for Windows"**
3. เปิดไฟล์ที่ดาวน์โหลดมา กด **Next** ไปเรื่อยๆ จนติดตั้งเสร็จ
4. ตรวจสอบโดยเปิด Command Prompt แล้วพิมพ์:

```bash
git --version
```

ถ้าขึ้นเวอร์ชัน เช่น `git version 2.47.0` แสดงว่าติดตั้งสำเร็จ ✅

---

### ขั้นตอนที่ 3 — ติดตั้ง Expo Go บนมือถือ

Expo Go คือแอปที่ใช้เปิดดูโปรเจกต์บนมือถือโดยไม่ต้อง build แยก

**Android:**
1. เปิด **Google Play Store** บนมือถือ
2. ค้นหา **"Expo Go"**
3. กด **ติดตั้ง**
4. ลิงก์โดยตรง: [play.google.com/store/apps/details?id=host.exp.exponent](https://play.google.com/store/apps/details?id=host.exp.exponent)

**iOS (iPhone):**
1. เปิด **App Store** บนมือถือ
2. ค้นหา **"Expo Go"**
3. กด **GET** / **รับ**
4. ลิงก์โดยตรง: [apps.apple.com/app/expo-go/id982107779](https://apps.apple.com/app/expo-go/id982107779)

---

### ขั้นตอนที่ 4 — ดาวน์โหลดโค้ดโปรเจกต์

เปิด **Command Prompt** แล้วพิมพ์คำสั่งต่อไปนี้ทีละบรรทัด:

```bash
git clone https://github.com/ChavaphonBoonchan/smart-homework.git
cd smart-homework
```

> 💡 คำสั่ง `cd smart-homework` คือการเข้าไปในโฟลเดอร์โปรเจกต์

---

### ขั้นตอนที่ 5 — ติดตั้ง Package ที่โปรเจกต์ต้องการ

ยังอยู่ใน Command Prompt เดิม พิมพ์:

```bash
npm install
```

รอสักครู่จนขึ้นว่า `added ... packages` แสดงว่าติดตั้งสำเร็จ ✅

---

### ขั้นตอนที่ 6 — ตั้งค่าไฟล์ Environment

**Windows (Command Prompt):**
```bash
copy .env.example .env
```

> ไฟล์ `.env` จะถูกสร้างขึ้นมาโดยอัตโนมัติ ไม่ต้องแก้ไขอะไร

---

### ขั้นตอนที่ 7 — รันโปรเจกต์

```bash
npx expo start
```

รอสักครู่ Terminal จะแสดง **QR Code** ขึ้นมา

---

### ขั้นตอนที่ 8 — เปิดแอปบนมือถือผ่าน Expo Go

> ⚠️ **สำคัญ:** มือถือและคอมพิวเตอร์ต้องต่อ **Wi-Fi วงเดียวกัน**

**Android:**
1. เปิด [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. ค้นหา **"Expo Go"** แล้วติดตั้ง

**iOS:**
1. เปิด [App Store](https://apps.apple.com/app/expo-go/id982107779)
2. ค้นหา **"Expo Go"** แล้วติดตั้ง

### ขั้นตอนเปิดแอป

1. รัน `npx expo start` บนคอมพิวเตอร์
2. Terminal จะแสดง **QR Code** และ URL เช่น `exp://192.168.x.x:8081`
3. **Android:** เปิดแอป Expo Go → กด **"Scan QR code"** → สแกน QR Code
4. **iOS:** เปิด **กล้อง (Camera)** ในตัว → สแกน QR Code → กดลิงก์ที่แจ้งเตือน
5. แอปจะ build และแสดงผลบนมือถือโดยอัตโนมัติ

> ⚠️ **หมายเหตุ:** มือถือและคอมพิวเตอร์ต้องต่อ **Wi-Fi เดียวกัน**

### ตัวเลือกเพิ่มเติม

```bash
npx expo start --android   # เปิดบน Android Emulator
npx expo start --ios       # เปิดบน iOS Simulator (macOS เท่านั้น)
npx expo start --tunnel    # ใช้ tunnel ถ้า Wi-Fi ต่างกัน
```

---

## 🔔 การตั้งค่า Notification (Android)

แอปจะขอสิทธิ์แจ้งเตือนเมื่อเปิดครั้งแรก กด **Allow** เพื่อรับการแจ้งเตือน

สำหรับ Android 13+ (API 33) ระบบจะแสดง permission dialog อัตโนมัติ

---

## 📝 License

MIT
