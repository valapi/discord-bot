import type { ILanguage } from "../interface";

export default {
    name: `th_TH`,
    data: {
        error: `บางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง`,
        command: {
            "ping": {
                "default": `ปอง!`,
            },
            "account": {
                "succes": `คุณลงทะเบียนบัญชีของคุณด้วย`,
                "not_account": `ไม่พบบัญชีของคุณ`,
                "verify": `กรุณายืนยันบัญชีของคุณ\nโดยใช้: **/login verify {VerifyCode}**`,
                "remove": `บัญชีของคุณถูกลบแล้ว`,
            },
            "language": {
                "fail": `ไม่พบภาษา`,
                "succes": `ภาษาถูกเปลี่ยนแล้ว`,
            },
            "profile": {
                "default": `นี่คือข้อมูลโปรไฟล์ของคุณ`,
            }
        },
    },
} as ILanguage;