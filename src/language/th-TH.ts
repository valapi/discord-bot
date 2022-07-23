//import

import type { ILanguage } from '../lang';

//script

const _language: ILanguage.File = {
    name: `th-TH`,
    data: {
        "not_guild": `คำสั่งนี้สามารถใช้ได้เฉพาะในเซิฟเวอร์`,
        "not_permission": `คุณไม่มีสิทธิ์ใช้คำสั่งนี้`,
        "dev_cmd": `คำสั่งนี้สามารถใช้ได้เฉพาะในการทดสอบ`,
        "error": `บางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง`,
        command: {
            ping: {
                "default": `ปอง!`,
            },
            account: {
                "succes": `คุณลงทะเบียนบัญชีของคุณด้วย`,
                "not_account": `ไม่พบบัญชีของคุณ`,
                "verify": `กรุณายืนยันบัญชีของคุณ\nโดยใช้: **/verify {รหัสยืนยัน}**`,
                "remove": `บัญชีของคุณถูกลบแล้ว`,
                "reconnect": `เชื่อมต่อใหม่แล้ว !`,
            },
            language: {
                "fail": `ไม่พบภาษา`,
                "succes": `ภาษาถูกเปลี่ยนแล้ว`,
            },
            profile: {
                "default": `นี่คือข้อมูลโปรไฟล์ของคุณ`,
            },
            store: {
                "not_nightmarket": `ไม่พบตลาดมืด`,
                "no_nightmarket": `คุณยังไม่ได้เปิดตลาดมืดแม้แต่อันเดียว`,
            },
            report: {
                "thanks": `ขอบคุณสำหรับการรายงาน!`,
                "topic_title": `หัวข้อ`,
                "topic_placeholder": `หัวข้อของคุณ (ต้องการ)`,
                "message_title": `ข้อความ`,
                "message_placeholder": `ข้อความที่คุณต้องการรายงาน (ต้องการ)\nบางครั้งคุณอาจต้องการรายงานอีกครั้งเพื่อส่งข้อความของคุณ`,
            },
            collection: {
                "default": `นี่คือรายการของสะสมของคุณ`,
            },
            party: {
                "not_party": `คุณไม่ได้อยู่ในเกม`,
            }
        },
    },
}

//export

export default _language;