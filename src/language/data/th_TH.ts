import type { ILanguage } from "../interface";

export default {
    name: `th_TH`,
    data: {
        not_guild: `คำสั่งนี้สามารถใช้ได้เฉพาะในเซิฟเวอร์`,
        not_permission: `คุณไม่มีสิทธิ์ใช้คำสั่งนี้`,
        error: `บางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง`,
        command: {
            "ping": {
                "default": `ปอง!`,
            },
            "account": {
                "succes": `คุณลงทะเบียนบัญชีของคุณด้วย`,
                "not_account": `ไม่พบบัญชีของคุณ`,
                "verify": `กรุณายืนยันบัญชีของคุณ\nโดยใช้: **/verify {รหัสยืนยัน}**`,
                "remove": `บัญชีของคุณถูกลบแล้ว`,
            },
            "language": {
                "fail": `ไม่พบภาษา`,
                "succes": `ภาษาถูกเปลี่ยนแล้ว`,
            },
            "profile": {
                "default": `นี่คือข้อมูลโปรไฟล์ของคุณ`,
            },
            "store": {
                "not_nightmarket": `ไม่พบตลาดมืด`,
                "no_nightmarket": `คุณยังไม่ได้เปิดตลาดมืดแม้แต่อันเดียว`,
            },
            "report": {
                "thanks": `ขอบคุณสำหรับการรายงาน!`,
            },
            "collection": {
                "default": `นี่คือรายการของสะสมของคุณ`,
            }
        },
    },
} as ILanguage;