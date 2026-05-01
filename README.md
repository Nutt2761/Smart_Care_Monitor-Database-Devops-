<img width="805" height="532" alt="ภาพถ่ายหน้าจอ 2569-04-25 เวลา 12 45 55" src="https://github.com/user-attachments/assets/688f9e64-db7c-444f-a8d2-4ece8f708b78" />

# Smart Care Monitor
ระบบติดตามดูแลผู้ป่วย (Patient Care Monitoring System) สำหรับบุคลากรทางการแพทย์ พัฒนาด้วย React + Node.js + MySQL รองรับการ deploy ด้วย Docker

---

## สารบัญ

- [ภาพรวมระบบ](#ภาพรวมระบบ)
- [Tech Stack](#tech-stack)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [ฟีเจอร์หลัก](#ฟีเจอร์หลัก)
- [การกำหนดสิทธิ์ (Role-based Access)](#การกำหนดสิทธิ์-role-based-access)
- [API Endpoints](#api-endpoints)
- [ฐานข้อมูล](#ฐานข้อมูล)
- [การติดตั้งและรันด้วย Docker](#การติดตั้งและรันด้วย-docker)
- [การติดตั้งแบบ Manual (Development)](#การติดตั้งแบบ-manual-development)

---

## ภาพรวมระบบ

Smart Care Monitor เป็น Web Application สำหรับโรงพยาบาลหรือคลินิก ใช้จัดการข้อมูลผู้ป่วย บันทึกสัญญาณชีพ ผลแล็บ ยา นัดหมาย และโน้ตทางการแพทย์ โดยแบ่งสิทธิ์การใช้งานตามบทบาทของผู้ใช้งาน

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM 7
- Tailwind CSS 3
- Recharts (กราฟ)
- Lucide React (ไอคอน)

**Backend**
- Node.js + Express 5
- MySQL2
- bcrypt / bcryptjs (เข้ารหัสรหัสผ่าน)
- dotenv, cors

**Database**
- MySQL 8.0

**Infrastructure**
- Docker + Docker Compose

---

## โครงสร้างโปรเจกต์

```
smart_care_monitor/
├── backend/                  # Express API server
│   ├── server.js             # Entry point
│   ├── db.js                 # MySQL connection pool
│   ├── Dockerfile
│   └── routes/
│       ├── auth.js           # Login / Auth
│       ├── users.js          # จัดการผู้ใช้งาน
│       ├── patients.js       # ข้อมูลผู้ป่วย
│       ├── vitals.js         # สัญญาณชีพ
│       ├── medicalNotes.js   # โน้ตทางการแพทย์
│       ├── labResults.js     # ผลแล็บ
│       ├── medications.js    # ยา
│       └── appointments.js   # นัดหมาย
├── smart-care/               # React frontend
│   ├── src/
│   │   ├── App.jsx           # Routing หลัก
│   │   ├── pages/            # หน้าต่างๆ
│   │   ├── components/       # ProtectedRoute ฯลฯ
│   │   ├── layouts/          # MainLayout
│   │   ├── services/         # API service layer
│   │   └── utils/            # permissions, can.js
│   └── Dockerfile
├── db/
│   └── init.sql              # SQL สร้าง Schema เริ่มต้น
├── smartmonitor.sql          # SQL dump พร้อม seed data
└── docker-compose.yml
```

---

## ฟีเจอร์หลัก

- **Dashboard** — ภาพรวมสถิติระบบ (เฉพาะ Admin)
- **จัดการผู้ป่วย** — เพิ่ม/ดู/แก้ไขข้อมูลผู้ป่วย พร้อมรายละเอียดแต่ละราย
- **สัญญาณชีพ (Vital Signs)** — บันทึกอุณหภูมิ ชีพจร ความดัน อัตราการหายใจ ค่า SpO₂
- **โน้ตทางการแพทย์** — บันทึกข้อมูลการรักษาโดยแพทย์/พยาบาล
- **ผลการตรวจแล็บ** — บันทึกและติดตามผลแล็บ
- **ยาและการรักษา** — จัดการข้อมูลยาที่ผู้ป่วยได้รับ
- **นัดหมาย** — จัดการตารางนัดหมาย
- **จัดการผู้ใช้งาน** — Admin สามารถเพิ่ม/แก้ไข/ลบผู้ใช้ในระบบ

---

## การกำหนดสิทธิ์ (Role-based Access)

ระบบมี 4 บทบาท:

| บทบาท | หน้าที่เข้าถึงได้ |
|--------|-----------------|
| `admin` | ทุกหน้า รวม Dashboard และจัดการผู้ใช้งาน |
| `doctor` | ผู้ป่วย, สัญญาณชีพ, โน้ต, แล็บ, ยา, นัดหมาย |
| `nurse` | ผู้ป่วย, สัญญาณชีพ, โน้ต, แล็บ, ยา, นัดหมาย |
| `patient` | นัดหมาย, แล็บ, ยา (ของตนเอง) |

---

## API Endpoints

Backend รันที่ port `5001` โดย base path คือ `/api`

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| GET/POST | `/api/users` | จัดการผู้ใช้งาน |
| GET/POST | `/api/patients` | ข้อมูลผู้ป่วย |
| GET/POST | `/api/vitals` | สัญญาณชีพ |
| GET/POST | `/api/medical-notes` | โน้ตทางการแพทย์ |
| GET/POST | `/api/lab-results` | ผลแล็บ |
| GET/POST | `/api/medications` | ยา |
| GET/POST | `/api/appointments` | นัดหมาย |

---

## ฐานข้อมูล

ชื่อ database: `smartmonitor`

ตารางหลัก:

- `users` — ผู้ใช้งานระบบ (id, name, email, password, role)
- `patients` — ข้อมูลผู้ป่วย (patient_id, ชื่อ, เพศ, วันเกิด, เบอร์โทร)
- `vital_signs` — สัญญาณชีพ (อุณหภูมิ, ชีพจร, ความดัน, อัตราการหายใจ, SpO₂)
- `medical_notes` — โน้ตทางการแพทย์
- `lab_results` — ผลการตรวจแล็บ
- `medications` — ข้อมูลยา
- `appointments` — นัดหมาย

---

## การติดตั้งและรันด้วย Docker

วิธีที่แนะนำ — รันทุก service พร้อมกันด้วยคำสั่งเดียว

**ข้อกำหนด:** Docker และ Docker Compose

```bash
# Clone หรือแตกไฟล์โปรเจกต์
cd smart_care_monitor

# รัน
docker compose up --build
```

เมื่อ build เสร็จ:
- **Frontend:** http://localhost:4173
- **Backend API:** http://localhost:5001
- **MySQL:** localhost:3306

---

## การติดตั้งแบบ Manual (Development)

**ข้อกำหนด:** Node.js 18+, MySQL 8.0

### 1. ตั้งค่า Database

```bash
# สร้าง database และ import schema
mysql -u root -p < db/init.sql

# (ถ้าต้องการ seed data)
mysql -u root -p < smartmonitor.sql
```

### 2. รัน Backend

```bash
cd backend
npm install

# สร้างไฟล์ .env
cat > .env << EOF
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=smartmonitor
EOF

npm start
```

Backend จะรันที่ http://localhost:5001

### 3. รัน Frontend

```bash
cd smart-care
npm install

# สร้างไฟล์ .env (ถ้ายังไม่มี)
echo "VITE_API_URL=http://localhost:5001" > .env

npm run dev
```

Frontend จะรันที่ http://localhost:5173

---

## บัญชีผู้ใช้ตัวอย่าง (Seed Data)

บัญชีเหล่านี้มีอยู่ใน `smartmonitor.sql` สำหรับทดสอบระบบ ใส่รหัสผ่านเองได้เลย

| Role | Email |
|------|-------|
| Admin | admin@gmail.com |
| Doctor | doctor@gmail.com |
| Nurse | nurse@gmail.com |
| Patient | pat@gmail.com |
| Patient | bas@gmail.com |

---

## ตัวแปร Environment (Backend)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|--------|-----------|----------|
| `PORT` | 5001 | Port ที่ backend รัน |
| `DB_HOST` | localhost | MySQL host |
| `DB_PORT` | 3306 | MySQL port |
| `DB_USER` | root | MySQL username |
| `DB_PASSWORD` | 1234 | MySQL password |
| `DB_NAME` | smartmonitor | ชื่อ database |

> ⚠️ **หมายเหตุ:** ควรเปลี่ยน `DB_PASSWORD` และค่าอื่นๆ ก่อนนำขึ้น Production

## Vital Simulate Data
เข้าไปที่ port frontend ที่รันบน local และ / ด้วย vital-simulator
ex : http://localhost:4173/vital-simulator

##ตัวอย่างการดูฐานข้อมูล
ใช้คำสั่ง :  docker exec -it smart_care_monitor-db-1 mysql -uroot -p1234

## ลิงก์สไลด์นำเสนอ
https://canva.link/kxclvql93g7m7up
