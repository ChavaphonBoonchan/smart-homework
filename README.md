# 📚 Smart Homework

แอปจัดการการบ้านบนมือถือ สร้างด้วย React Native + Expo SDK 54

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

## 🚀 วิธีติดตั้งและรันโปรเจกต์

### ความต้องการเบื้องต้น

- [Node.js](https://nodejs.org/) v20.19.4 หรือสูงกว่า
- [Yarn](https://classic.yarnpkg.com/en/docs/install) หรือ npm
- [Expo Go](https://expo.dev/go) บนมือถือ (Android หรือ iOS)

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/ChavaphonBoonchan/smart-homework.git
cd smart-homework
```

### 2. ติดตั้ง Dependencies

```bash
yarn install
# หรือ
npm install
```

### 3. ตั้งค่า Environment Variables

```bash
cp .env.example .env
```

ไฟล์ `.env` จะมีค่าเริ่มต้นพร้อมใช้งานสำหรับ SQLite:

```env
DATABASE_URL="file:./dev.db"
```

### 4. เริ่ม Metro Bundler

```bash
npx expo start
```

---

## 📱 วิธีใช้งานกับ Expo Go

### ขั้นตอนติดตั้ง Expo Go

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
