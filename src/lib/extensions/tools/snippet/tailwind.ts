import { createSnippetTool } from '@/lib/tools/snippet'

export const tailwindTool = createSnippetTool({
  id: 'tailwind',
  name: 'Tailwind Snippets',
  description: 'Commonly-used Tailwind CSS utility class combinations',
  category: 'Snippet',
  items: [
    // ---------- Layout / Flex & Grid ----------
    {
      key: 'Flex center (both axes)',
      value: 'flex items-center justify-center',
      description:
        'จัดกึ่งกลางทั้งแนวตั้งและแนวนอนพร้อมกัน — ใช้บ่อยที่สุดสำหรับ centering ลูก 1 ตัว',
      keywords: ['จัดกึ่งกลาง, center, flex, align, justify, กึ่งกลาง'],
    },
    {
      key: 'Flex center horizontal',
      value: 'flex justify-center',
      description: 'จัดกึ่งกลางเฉพาะแนวนอน (แกน main axis)',
      keywords: ['จัดกึ่งกลาง, center horizontal, justify, flex'],
    },
    {
      key: 'Flex center vertical',
      value: 'flex items-center',
      description: 'จัดกึ่งกลางเฉพาะแนวตั้ง (cross axis)',
      keywords: ['จัดกึ่งกลาง, center vertical, items, align, flex'],
    },
    {
      key: 'Flex space-between',
      value: 'flex items-center justify-between',
      description:
        'ดันลูก 2 ตัวออกขอบซ้าย-ขวา กลางแนวตั้ง — มาตรฐานสำหรับ navbar / header bar',
      keywords: ['space between, navbar, header, แบ่งซ้ายขวา, justify'],
    },
    {
      key: 'Flex space-around',
      value: 'flex justify-around',
      description: 'กระจายลูกให้มีช่องว่างเท่ากันรอบๆ (รวมขอบสองข้าง)',
      keywords: ['space around, justify, distribute, กระจาย'],
    },
    {
      key: 'Flex column',
      value: 'flex flex-col',
      description: 'เรียงลูกในแนวตั้ง',
      keywords: ['flex column, แนวตั้ง, stack, vertical'],
    },
    {
      key: 'Flex wrap',
      value: 'flex flex-wrap',
      description: 'ขึ้นบรรทัดใหม่อัตโนมัติเมื่อลูกไม่พอ — สำหรับ chips/tags',
      keywords: ['wrap, ขึ้นบรรทัด, chips, tags'],
    },
    {
      key: 'Flex gap',
      value: 'flex gap-4',
      description:
        'กำหนดระยะห่างระหว่างลูก — ใช้คู่กับ flex/grid, ปรับ gap-2 / gap-6 ตามต้องการ',
      keywords: ['gap, ระยะห่าง, spacing, flex'],
    },
    {
      key: 'Grid center (both axes)',
      value: 'grid place-items-center',
      description:
        'จัดกึ่งกลางทั้ง 2 แกนแบบกริด — สั้นกว่า flex ที่ใช้ items+justify พร้อมกัน',
      keywords: ['grid center, place items, จัดกึ่งกลาง, grid'],
    },
    {
      key: 'Responsive grid cols',
      value: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
      description:
        'การ์ด 1 คอลัมน์บนมือถือ → 2 คอลัมน์ (sm) → 3 คอลัมน์ (lg) — ทำ product/card grid มาตรฐาน',
      keywords: ['responsive grid, grid cols, คอลัมน์, cards, sm lg'],
    },

    // ---------- Position ----------
    {
      key: 'Absolute center',
      value: 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
      description:
        'จัดกึ่งกลาง element ที่ position absolute — ต้องมี parent เป็น relative และมีขนาด',
      keywords: ['absolute center, translate, จัดกึ่งกลาง, position, relative'],
    },
    {
      key: 'Full overlay',
      value: 'absolute inset-0',
      description:
        'ปิดทับ parent เต็มรูปแบบ (ทุกด้าน = 0) — สำหรับ overlay, modal backdrop, image hover',
      keywords: ['overlay, inset, backdrop, ปิดทับ, absolute'],
    },
    {
      key: 'Sticky header',
      value: 'sticky top-0 z-50',
      description: 'หัวเว็บติดอยู่ด้านบนตอน scroll — z-50 เพื่ออยู่เหนือเนื้อหา',
      keywords: ['sticky, header, ติดบน, navbar, scroll, z-index'],
    },
    {
      key: 'Fixed full-screen modal',
      value: 'fixed inset-0 z-50',
      description: 'Modal/dialog เต็มจอตรึงคงที่ — มักใช้คู่กับ overlay ดำๆ',
      keywords: ['modal, fixed, fullscreen, เต็มจอ, dialog, z-index'],
    },
    {
      key: 'Top-right badge',
      value: 'absolute top-0 right-0',
      description: 'ป้าย/โลโก้ที่มุมขวาบน — ต้องมี parent relative',
      keywords: ['badge, top right, มุมขวาบน, corner, absolute'],
    },

    // ---------- Sizing ----------
    {
      key: 'Full viewport height',
      value: 'min-h-screen',
      description:
        'สูงอย่างน้อยเท่าจอ — ดีกว่า h-screen เพราะรองรับเนื้อหายาวเกินจอ (mobile address bar ด้วย)',
      keywords: ['full height, screen, min-h-screen, เต็มจอ, สูง'],
    },
    {
      key: 'Full width',
      value: 'w-full',
      description: 'กว้างเต็ม parent',
      keywords: ['full width, w-full, กว้างเต็ม'],
    },
    {
      key: 'Full height',
      value: 'h-full',
      description: 'สูงเต็ม parent — สำคัญ: parent ต้องมีความสูงด้วย ไม่งั้นจะเป็น 0',
      keywords: ['full height, h-full, สูงเต็ม'],
    },
    {
      key: 'Aspect ratio 16:9 (video)',
      value: 'aspect-video',
      description: 'อัตราส่วน 16:9 — สำหรับ video player / thumbnail',
      keywords: ['aspect video, 16:9, ratio, video, thumbnail'],
    },
    {
      key: 'Aspect ratio square',
      value: 'aspect-square',
      description: 'อัตราส่วน 1:1 — สำหรับ avatar / รูปสี่เหลี่ยมจัตุรัส',
      keywords: ['aspect square, 1:1, ratio, avatar'],
    },

    // ---------- Text ----------
    {
      key: 'Truncate single line',
      value: 'truncate',
      description: 'ตัดข้อความยาวให้เป็นบรรทัดเดียวพร้อม ellipsis (...) — ต้องมี width จำกัด',
      keywords: ['truncate, ellipsis, ตัดข้อความ, จุดไข่ปลา, single line'],
    },
    {
      key: 'Line clamp 2',
      value: 'line-clamp-2',
      description: 'จำกัด 2 บรรทัดแล้วตัดด้วย ... — สำหรับ card description',
      keywords: ['line clamp, 2 บรรทัด, description, multi line'],
    },
    {
      key: 'Line clamp 3',
      value: 'line-clamp-3',
      description: 'จำกัด 3 บรรทัด — ปรับเลขตามต้องการ (line-clamp-1 ถึง line-clamp-6)',
      keywords: ['line clamp, 3 บรรทัด, description, multi line'],
    },
    {
      key: 'Text balance',
      value: 'text-balance',
      description:
        'ถ่วงบรรทัดให้สมดุล (browser ตัดบรรทัดให้สวย) — ใช้กับ headline / title',
      keywords: ['text balance, headline, ถ่วงบรรทัด, title'],
    },
    {
      key: 'Text pretty',
      value: 'text-pretty',
      description:
        'กระจายบรรทัดให้นุ่มนวล ลด orphan word — ใช้กับ paragraph เนื้อหา',
      keywords: ['text pretty, paragraph, กระจายบรรทัด, orphan'],
    },
    {
      key: 'Gradient text',
      value:
        'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent',
      description:
        'ตัวอักษรไล่เฉดสี — เปลี่ยน from/to และทิศทาง (to-r/to-br) ได้, text-transparent จำเป็น',
      keywords: ['gradient text, ไล่สี, text gradient, clip'],
    },
    {
      key: 'Screen reader only',
      value: 'sr-only',
      description:
        'ซ่อนจากสายตาแต่ screen reader อ่านได้ — สำหรับ accessibility (a11y)',
      keywords: ['sr-only, screen reader, accessibility, a11y, ซ่อน'],
    },
    {
      key: 'Tabular numbers',
      value: 'tabular-nums',
      description:
        'ตัวเลขแต่ละหลักกว้างเท่ากัน — สำหรับตาราง, counter, ตัวเลขที่เปลี่ยนเรื่อยๆ',
      keywords: ['tabular nums, ตัวเลข, table, counter, monospace number'],
    },

    // ---------- Effects ----------
    {
      key: 'Glass effect',
      value: 'bg-white/10 backdrop-blur-md border border-white/20',
      description: 'เอฟเฟกต์กระจกฝ้า (glassmorphism) — ปรับความโปร่งใส bg/border ตามต้องการ',
      keywords: ['glass, glassmorphism, กระจกฝ้า, blur, frosted'],
    },
    {
      key: 'Backdrop blur',
      value: 'backdrop-blur',
      description: 'เบลอเนื้อหาข้างหลัง — ใช้บน overlay/navbar ที่โปร่งใส',
      keywords: ['backdrop blur, เบลอ, blur background'],
    },
    {
      key: 'Hover lift card',
      value: 'transition hover:shadow-lg hover:-translate-y-1',
      description: 'การ์ดลอยขึ้นเล็กน้อยตอน hover — มาตรฐานสำหรับ card คลิกได้',
      keywords: ['hover lift, card, shadow, translate, ลอย'],
    },
    {
      key: 'Smooth color transition',
      value: 'transition-colors',
      description: 'เปลี่ยนสีแบบนุ่มนวลตอน hover/focus — เบากว่า transition ทุกอย่าง',
      keywords: ['transition colors, hover, smooth, เปลี่ยนสี'],
    },
    {
      key: 'Disable text selection',
      value: 'select-none',
      description: 'ห้าม user คลุมดำข้อความ — ใช้กับ button, label, icon',
      keywords: ['select none, ห้ามคลุม, no select, button'],
    },
    {
      key: 'Disable pointer (click-through)',
      value: 'pointer-events-none',
      description:
        'element นี้ไม่รับ click/interaction — click จะทะลุไปข้างล่าง (เช่น overlay ตกแต่ง)',
      keywords: ['pointer events none, click through, ทะลุ, disabled'],
    },

    // ---------- Container / Helpers ----------
    {
      key: 'Container centered',
      value: 'container mx-auto px-4',
      description: 'คอนเทนเนอร์กึ่งกลางหน้า + padding ขอบซ้ายขวา — พื้นฐาน page layout',
      keywords: ['container, mx auto, กึ่งกลาง, layout, page'],
    },
    {
      key: 'Center with max width',
      value: 'mx-auto max-w-4xl',
      description: 'จำกัดความกว้างสูงสุดและกึ่งกลาง — ใช้บ่อยแทน container (ยืดหยุ่นกว่า)',
      keywords: ['max width, mx auto, กึ่งกลาง, จำกัดความกว้าง, article'],
    },
    {
      key: 'Reset native appearance',
      value: 'appearance-none',
      description: 'ลบสไตล์ default ของ browser — จำเป็นตอน style button/select กำหนดเอง',
      keywords: ['appearance none, reset, ลบสไตล์, button, select, native'],
    },

    // ---------- Responsive ----------
    {
      key: 'Column → Row (mobile → desktop)',
      value: 'flex flex-col md:flex-row',
      description: 'เรียงแนวตั้งบนมือถือ → แนวนอนตอน md ขึ้นไป — สำหรับ form / sidebar layout',
      keywords: ['responsive, column to row, flex, md, มือถือ, desktop'],
    },
    {
      key: 'Hide on mobile',
      value: 'hidden md:block',
      description: 'ซ่อนบนมือถือ แสดงตอน md ขึ้นไป — เช่น sidebar บนจอใหญ่',
      keywords: ['hide mobile, hidden md, responsive, ซ่อนมือถือ'],
    },
    {
      key: 'Mobile only (hide on desktop)',
      value: 'block md:hidden',
      description: 'แสดงเฉพาะมือถือ ซ่อนตอน md ขึ้นไป — เช่น mobile menu button',
      keywords: ['mobile only, block md hidden, responsive, มือถือเท่านั้น'],
    },

    // ---------- Animation ----------
    {
      key: 'Spin (loader)',
      value: 'animate-spin',
      description: 'หมุนต่อเนื่อง — สำหรับ loading spinner',
      keywords: ['spin, loader, หมุน, loading, spinner'],
    },
    {
      key: 'Pulse (placeholder)',
      value: 'animate-pulse',
      description: 'กระพริบจางๆ วนลูป — สำหรับ skeleton placeholder ตอนโหลดข้อมูล',
      keywords: ['pulse, skeleton, placeholder, กระพริบ, loading'],
    },
    {
      key: 'Bounce',
      value: 'animate-bounce',
      description: 'เด้งขึ้นลง — สำหรับ scroll indicator / notification',
      keywords: ['bounce, เด้ง, scroll indicator, notification'],
    },
    {
      key: 'Ping (notification)',
      value: 'animate-ping',
      description: 'วงขยายออกแล้วจางหาย — สำหรับ notification dot / live indicator',
      keywords: ['ping, notification dot, วงขยาย, live, indicator'],
    },
  ],
})
