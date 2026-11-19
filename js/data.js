/* =========================================================
   data.js — ข้อมูลทั้งหมดของเว็บอยู่ในไฟล์นี้ที่เดียว
   ---------------------------------------------------------
   อยากแก้ข้อความ เพิ่มผลงาน หรือเติมข้อมูล ให้แก้ที่ไฟล์นี้
   ไม่ต้องไปแตะ HTML

   กติกา:
   - ข้อความที่ยังไม่แน่ใจ / ยังไม่มี  → ใส่ TODO (ตัวแปรด้านล่าง)
     แผงในหน้าแผนที่จะแสดงกล่อง [เดียวมาอัพเดต] · หน้ารายละเอียดผลงานจะซ่อนหัวข้อนั้นแทน
   - ก่อนเผยแพร่จริง ต้องไม่เหลือ TODO เลย
   ========================================================= */

const TODO = null; // ค่าว่าง = ยังไม่มีข้อมูล → เว็บจะโชว์ [เดียวมาอัพเดต]

/* ---------- ข้อมูลส่วนตัว ---------- */
const PROFILE = {
  name: "Sanpetch Meejue",
  nickname: "Peamai",
  role: "UX/UI Designer",
  headline: "UX/UI Designer | Design Systems & Digital Products",
  status: "Open to work",
  photo: "images/profile/sanpetch.webp",   // รูปโปรไฟล์ (ใช้ในหน้า About)
  playerSprite: "images/player/hero.webp", // ภาพตัวละครบนแผนที่ (null = ใช้หมากจากรูปโปรไฟล์แทน)
  location: "Pathum Thani, Thailand",
  experience: "5+ years of UX/UI design experience",
  tagline: "Design that decides, not just decorates.",
  // จาก CV: Professional Summary
  intro: "UX/UI Designer experienced in financial, insurance and e-commerce projects, including Insurverse, Roddonjai-TTB and BKI. I work across the whole design process, from user research and information architecture to interface design, prototyping and developer handoff.",
  strengths: "Key strengths: building design systems in Figma, applying accessibility principles, and working with business and development teams to turn complex requirements into clear user experiences.",
  quote: "I believe that every pixel should have a purpose and every design should tell a story. My mission is to create intuitive, inclusive, and delightful digital experiences that make people's lives easier.",
  email: "Sanpetch.me@gmail.com",
  phone: "080-2249608",
  behance: "https://www.behance.net/chanom-yen",
  linkedin: "https://www.linkedin.com/in/sanpetch-meejue",
  facebook: "https://www.facebook.com/FongFold/",
  resume: "files/Sanpetch_Meejue_UXUI_Designer_Resume.pdf",   // Resume 1 หน้า (A4)
  cv: "files/Sanpetch_Meejue_UXUI_Designer_CV.pdf",           // CV ฉบับเต็ม

  experienceList: [
    { company: "Extend IT Resource Co., Ltd.", role: "UX/UI Designer", period: "Apr 2022 – May 2026",
      points: [
        "Built and managed Figma design systems, component libraries and design tokens for Insurverse and Roddonjai-TTB, establishing shared standards for consistent interfaces and developer handoff.",
        "Led end-to-end UX/UI for enterprise platforms, from discovery and research to information architecture, user flows and high-fidelity prototypes.",
        "Led user research and usability testing, turning findings into improvements across key user journeys.",
        "Led UX/UI for the BKI website redesign, applying WCAG 2.1 accessibility principles.",
        "Worked with product managers, business stakeholders and developers to align design with user needs, business goals and technical requirements.",
        "Delivered responsive, mobile-first UI for clients including Money DD, ThaiBev and Singer."
      ] },
    { company: "1577 Home Shopping Co., Ltd.", role: "UX/UI Designer", period: "Oct 2021 – Mar 2022",
      points: [
        "Designed responsive web and mobile interfaces for e-commerce, shaped by consumer behaviour and the purchasing journey.",
        "Created digital assets and marketing materials aligned with brand guidelines."
      ] },
    { company: "Running Connect Co., Ltd.", role: "Graphic Designer", period: "Jun 2020 – Sep 2021",
      points: [
        "Designed sports event branding, merchandise, infographics and promotional materials for digital and print."
      ] }
  ],
  education: [
    { school: "Suan Sunandha Rajabhat University", detail: "Bachelor's Degree in Technology, Computer Application for Architecture", period: "2016 – 2020" },
    { school: "Eamlaor Vocational College", detail: "Vocational Diploma (High Vocational Certificate)", period: null }
  ],
  languages: [
    { name: "Thai", level: "Native" },
    { name: "English", level: "Technical English for designers" }
  ],
  skills: [
    { group: "UX Design & Research", items: ["User Research", "Design Thinking", "Information Architecture", "User Journey Mapping", "User Flows", "Wireframing", "Interactive Prototyping", "Usability Testing"] },
    { group: "UI Design & Accessibility", items: ["Responsive Web & Mobile", "Visual Hierarchy", "High-Fidelity UI", "WCAG 2.1"] },
    { group: "Design Systems", items: ["Architecture & Governance", "Design Tokens", "Atomic Design", "Reusable Components", "Component Libraries", "Design Documentation", "Developer Handoff"] },
    { group: "Collaboration & Leadership", items: ["Stakeholder Management", "Cross-Functional Collaboration", "Design Mentorship", "Design Reviews", "Agile / Scrum"] },
    { group: "AI-Assisted Design & Prototyping", items: ["AI design exploration", "Interactive prototyping", "Handoff documentation", "HTML · CSS · JavaScript · React (fundamentals)"] },
    { group: "Tools", items: ["Figma", "FigJam", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "Jira", "Slack", "Claude", "Cursor", "ChatGPT", "GitHub Copilot"] }
  ]
};

/* ---------- หัวข้อของหน้ารายละเอียดผลงาน (ใช้ร่วมกันทุกผลงาน) ----------
   หัวข้อไหนผลงานนั้นไม่มีข้อมูล → ซ่อนอัตโนมัติ ไม่ต้องฝืนให้ทุกงานยาวเท่ากัน */
const CASE_SECTIONS = [
  { key: "overview",     title: "Overview" },
  { key: "problem",      title: "Problem & goals" },
  { key: "decisions",    title: "Key design decisions" },
  { key: "flows",        title: "User flow & IA" },
  { key: "development",  title: "Design development" },
  { key: "finalDesign",  title: "Final design" },
  { key: "designSystem", title: "Design system" },
  { key: "outcomes",     title: "Validation, handoff & outcomes" },
  { key: "reflection",   title: "Reflection" }
];

/* ---------- ผลงาน ----------
   ทุกช่องด้านล่าง "ไม่บังคับ" ยกเว้น id, title, category
   ช่องไหนยังไม่มีข้อมูล → ใส่ TODO หรือลบทิ้ง → หัวข้อนั้นจะไม่แสดงบนหน้าเว็บ
   (หน้ารายละเอียดจะไม่โชว์ [เดียวมาอัพเดต] ให้ผู้เข้าชมเห็น — ดูรายการที่ต้องเติมใน docs/portfolio-content-checklist.md)

   - accent       : สีประจำงาน (ใช้กับหมุด หัวตาราง เส้นเน้น)
   - cover        : ภาพการ์ดในแผง UX/UI · hero = ภาพใหญ่ใต้ชื่อในหน้ารายละเอียด
   - overview     : role / scope / team / duration / platform / status
   - problem      : context (HTML) · users [{name, need}] · goals [] · source (ที่มาของข้อมูล)
   - insights     : ตาราง ปัญหา → สิ่งที่ดีไซน์ตอบ [{pain, need}]
   - decisions    : 2–3 เรื่อง [{title, problem, approach, why, feedback?, image}]
   - flows        : ภาพ User flow / Sitemap [{src, caption, text?}]
   - development  : [{text, before:{src,caption}, after:{src,caption}}]
   - finalDesign  : กลุ่มหน้าจอตามงานของผู้ใช้ [{title, text, shots:[{src, caption, pins?}]}]
   - prototype    : ลิงก์ Prototype จริงเท่านั้น
   - designSystem : {text, items:[{src, caption}]}
   - validation / handoff / delivered (HTML) · trackMetrics [] = ตัวชี้วัดที่ "เสนอ" ให้ติดตาม (ยังไม่ได้วัด)
   - reflection   : บทเรียน (เจ้าของงานเขียนเอง)
   - pdf          : ลิงก์ไฟล์ PDF ของ Case study (ใส่เมื่อมีไฟล์จริง → ปุ่มดาวน์โหลดจะขึ้นเอง)
   - notes        : โน้ตภายใน ไม่แสดงบนเว็บ
   รูปภาพ: pins = หมุดอธิบายบนภาพ {x, y เป็น % ของภาพ, text}
*/
const PROJECTS = [
  {
    id: "gistda",
    title: "GISTDA Green Office",
    client: "GISTDA",
    category: "GovTech · Web platform",
    tags: ["Website Design", "Sustainability", "Data Visualization"],
    accent: "#3F9E2B",
    cover: "images/projects/gistda/cover.webp",
    hero: "images/projects/gistda/platform-overview.webp",
    summary: "A shared platform where government agencies follow one Green Office standard, and staff and the public can see energy, water and electricity statistics.",
    overview: {
      role: "UX/UI Designer (one of two designers)",
      scope: TODO,   // ส่วนไหนที่เราออกแบบเอง vs อีกคน → ถามเจ้าของงาน
      team: "PM 1 · BA 1 · UX/UI 2 · Dev 3 · QA 1",
      duration: "About 3 months",
      platform: "Web · front office and back office",
      status: TODO,  // ส่งมอบแล้ว / เปิดใช้จริง ?
      tools: "Figma, spreadsheets & docs, Trello / Jira"
    },
    problem: {
      context: `<p>GISTDA wanted one platform that government agencies could all use, so that every organisation works to the same Green Office standard. Besides the general public, staff inside each organisation needed to see their own statistics, such as energy, water and electricity use.</p>
                <p>The core problem: <strong>each agency kept its data in its own way</strong>, so results were hard to compare and hard for non-specialists to read.</p>
                <p><strong>Problem statement.</strong> Environmental policy and greenhouse-gas figures are two different kinds of information. The challenge was ordering them so that visitors see both what GISTDA is doing and how its emissions change from year to year.</p>`,
      users: [
        { name: "The public", need: "Read Green Office news, knowledge and environmental law, and see an agency's statistics without logging in" },
        { name: "Agency coordinators", need: "Register their agency and manage who can work on it" },
        { name: "Agency staff", need: "Log in to record and review their own energy and resource data" }
      ],
      goals: [
        "Help visitors understand GISTDA's Green Office policy, and compare greenhouse-gas data between years through charts and summary figures",
        "One standard and one way of presenting data for every participating agency",
        "Statistics that people without an environmental background can read at a glance",
        "A sign-up that a government coordinator can finish without getting lost",
        "Work within government approval rules, a fixed budget and a tight timeline"
      ],
      source: "Requirements came from staff interviews, a review of the existing website, and other agencies' websites used as a benchmark."
    },
    insightsTitle: "Insights",
    insightHeads: ["Design challenge", "Approach on the site"],
    insightsSource: "Observations from the Green Office website screens.",
    insights: [
      { pain: "Understand the project context", need: "Open with an aerial photo of the office and the policy headline" },
      { pain: "Compare data year to year", need: "Put the summary figure next to bar charts of last year and this year" },
      { pain: "See only the data you care about", need: "Agency and building filters above the results, with the download button in the same row" },
      { pain: "Find related content", need: "News and activities, and knowledge articles, as separate sections on the home page" },
      { pain: "Government sign-up forms are long and easy to give up on", need: "Split registration into three short steps" },
      { pain: "Specialists still need the raw numbers for reports", need: "A full data table under the charts, with CSV / PDF export" }
    ],
    decisions: [
      {
        title: "Lead the statistics with one number people can read",
        problem: "Emissions data is technical, and most visitors are not environmental specialists. A wall of charts would hide the answer to the first question everyone has: are we doing better than last year?",
        approach: "The page opens with total tCO2e and the change from last year, then splits emissions into the three scopes, then turns savings into everyday terms. The full table and the download sit underneath.",
        why: "Summary first, detail on demand. The trade-off is that specialists scroll one level further to reach the raw table, so the table and the CSV / PDF export stay on the same page instead of a separate report screen.",
        image: { src: "images/projects/gistda/dashboard.webp", caption: "Emissions summary: one big number, three scopes, then everyday impact",
          pins: [
            { x: 28, y: 7, text: "Filter by agency and building" },
            { x: 90, y: 7, text: "Download the data" },
            { x: 95, y: 15, text: "One big number: total tCO2e, with the change from last year" },
            { x: 18, y: 52, text: "The three emission scopes, this year against last year" },
            { x: 45, y: 75, text: "Savings turned into everyday terms people can picture" }
          ] }
      },
      {
        title: "Split agency sign-up into three short steps",
        problem: "Registering an agency asks for agency details, a main coordinator, and a user account. As one government form it is long, and coordinators are easy to lose halfway.",
        approach: "Three steps: agency details → main coordinator → user account and password, with a progress bar that shows where you are and how much is left.",
        why: "Each screen stays short and focused. The trade-off is more screens and one more click per step, which the progress bar makes predictable.",
        image: { src: "images/projects/gistda/register.webp", caption: "Agency sign-up, step 1 of 3",
          pins: [
            { x: 50, y: 24, text: "A three-step progress bar" },
            { x: 76, y: 44, text: "Logo upload states the size, file type and rules up front" },
            { x: 68, y: 55, text: "Check the agency name before going further" },
            { x: 62, y: 90, text: "One clear primary action: Next" }
          ] }
      },
      {
        title: "Build a design system before the screens multiplied",
        problem: "Four modules (platform, Green Office site, statistics and back office), two designers, and no existing design system to start from.",
        approach: "We built a design system and style guide from scratch in its own Figma file: foundations, then components with every state in three sizes, used by every module.",
        why: "It cost time up front, before any screen was finished. In return both designers produced consistent screens, and developers didn't have to guess hover, error or disabled styles.",
        image: { src: "images/projects/gistda/ds-buttons.webp", caption: "Buttons in every state and size" }
      }
    ],
    flows: [
      { src: "images/projects/gistda/user-flow.webp", caption: "User flow for a public visitor: enter, choose a section, view and download data" },
      { src: "images/projects/gistda/sitemap-v2.webp", caption: "Information architecture of the Green Office website",
        text: "The website is organised into six main sections, from the Green Office initiative and statistics to resources and contact information." }
    ],
    development: [
      {
        text: "Desktop wireframes set how the site organises Green Office information, news and environmental resources: the home page, news listing and article detail, and the knowledge overview and environmental regulations pages. Colour, photography and the design system came after.",
        before: { src: "images/projects/gistda/wireframes-labelled.webp", caption: "Wireframes: home page, news, knowledge base" },
        after: { src: "images/projects/gistda/green-office-overview.webp", caption: "Final Green Office website" }
      }
    ],
    finalDesign: [
      {
        title: "For the public",
        text: "The platform website introduces Green Office and lists participating agencies, benefits and the six assessment categories. The knowledge section groups general knowledge and environmental law into two clear entry points.",
        shots: [
          { src: "images/projects/gistda/knowledge.webp", caption: "Knowledge section",
            pins: [
              { x: 6, y: 10, text: "Breadcrumb keeps people oriented inside the section" },
              { x: 88, y: 29, text: "Two large entry points: general knowledge, and environmental law" }
            ] }
        ]
      },
      {
        title: "For agency staff",
        text: "Staff sign in to see their own agency's statistics. A side menu switches between electricity, water, waste, fuel and paper, with monthly bars against the target and the full table underneath.",
        shots: [
          { src: "images/projects/gistda/login.webp", caption: "Sign in for agency staff" },
          { src: "images/projects/gistda/dashboard-scene.webp", caption: "Energy and resource statistics" }
        ]
      }
    ],
    designSystem: {
      text: "Foundations (layout, colour, typography, icons, header) and components (button, tab, switch, breadcrumb, checkbox & radio, dropdown, date picker, input, progress indicators, modal, snackbar). Every component documents default, hover, focused, pressed, disabled and error states.",
      items: [
        { src: "images/projects/gistda/ds-dropdown.webp", caption: "Dropdown, selection and autocomplete" },
        { src: "images/projects/gistda/ds-checkbox.webp", caption: "Checkbox states" },
        { src: "images/projects/gistda/ds-input.webp", caption: "Input states" },
        { src: "images/projects/gistda/ds-switch.webp", caption: "Switch states" }
      ]
    },
    validation: TODO,  // ไม่มี Usability test · มี feedback จากลูกค้า / การ review ไหม?
    handoff: `<ul>
                <li>Developers worked straight from the Figma file, with front office and back office screens organised by module</li>
                <li>The design system documented every component state</li>
                <li>Work was tracked in Trello / Jira with the PM, BA, developers and QA</li>
              </ul>`,
    delivered: `<ul>
                  <li>A public platform website and a Green Office website</li>
                  <li>An energy &amp; resource statistics dashboard with CSV / PDF export</li>
                  <li>A three-step agency registration and a back office for staff</li>
                  <li>A reusable design system shared by every module</li>
                </ul>`,
    trackMetrics: [
      "Number of agencies that finish registration, and where people drop out of the three steps",
      "Share of agencies that submit their monthly data on time",
      "Statistics page visits and report downloads (CSV / PDF)"
    ],
    reflection: TODO,
    pdf: TODO,
    notes: "PDF เดิมระบุผู้ใช้ 4 กลุ่ม (staff, executives, partners, public) และ 'fully responsive' / 'automated carbon calculation' — ยังไม่ยืนยัน จึงไม่ใช้"
  },
  {
    id: "insurverse",
    title: "Insurverse",
    client: "Insurverse Public Company Limited (TIP Holdings group)",
    category: "InsurTech · Car insurance",
    tags: ["Mobile UI", "PWA", "Insurance"],
    accent: "#13B89E",
    cover: "images/projects/insurverse/cover.webp",
    hero: "images/projects/insurverse/cover.webp",
    summary: "An online car insurance platform. I took over the mobile screens for financial endorsement in Release 3.5.",
    overview: {
      role: "UX/UI Designer, taking over the mobile design mid-project",
      scope: "Release 3.5 · Financial endorsement: UI screens and components for selected modules",
      team: "Design 1 · BA 1 · PM 1 · Developers",
      duration: "A little over a month",
      platform: "PWA (mobile)",
      status: "Delivered",
      tools: "Figma"
    },
    problem: {
      context: `<p>Insurverse sells car insurance online from start to finish: customers compare packages, buy, do the vehicle inspection online, pay, and receive the policy by email.</p>
                <p>After buying, some customers need to change their policy in a way that affects the premium, so they may pay more or get money back. This is a <strong>financial endorsement</strong>. Release 3.5 brought these changes to the mobile app, and I took over the design of selected modules from the previous designer.</p>`,
      users: [
        { name: "Insurverse policyholders", need: "Change an existing car policy from their phone and see clearly what it will cost" }
      ],
      goals: [
        "Screens that customers find easy to use",
        "Keep the look consistent with the rest of the Insurverse product while continuing someone else's design"
      ],
      source: "Requirements came from the client through the BA."
    },
    flowsNote: "System context: the overall Insurverse purchase journey and structure. These show where the product sits; they are not the part I designed.",
    flows: [
      { src: "images/projects/insurverse/user-flow.webp", caption: "Insurverse purchase journey (system context): vehicle and driver details → compare packages → online vehicle inspection → payment → confirmation" },
      { src: "images/projects/insurverse/wireframes.webp", caption: "Product wireframes (system context): sign-up, choosing coverage, coverage details and payment" }
      // { src: "images/projects/insurverse/sitemap.webp", caption: "Sitemap" }  ← ซ่อนไว้: กล่องบนสุดในภาพเขียนว่า "GISTDA Green Office Website" (ผิด) รอ export ใหม่
    ],
    // หน้าจอจริงจาก Module ที่ออกแบบ (ข้อมูลส่วนตัวในภาพถูกเบลอแล้ว) · phone: true = แสดงขนาดจอมือถือ
    decisions: [
      {
        title: "Split a long policy into two tabs",
        problem: "A car policy holds the coverage amounts and a long list of vehicle, owner, driver and beneficiary details. As one page on a phone it becomes a very long scroll, and people lose track of where they are.",
        approach: "The policy page has two tabs: Coverage, and Policy information. The plan name, its status and the Send request button stay at the top of both tabs.",
        why: "Each tab answers one question: what am I covered for, and what is on my policy. The trade-off is that the details are one tap away instead of on the same screen.",
        image: { src: "images/projects/insurverse/endorse-coverage.webp", caption: "Policy detail: Coverage tab", phone: true,
          pins: [
            { x: 68, y: 11.3, text: "Send request: start a change to this policy" },
            { x: 50, y: 18.4, text: "Two tabs: Coverage, and Policy information" },
            { x: 75, y: 24.7, text: "The plan itself is shown read-only" },
            { x: 82, y: 44.3, text: "Edit buttons sit next to the parts that can change" },
            { x: 18, y: 96.8, text: "Download the policy documents" }
          ] }
      },
      {
        title: "Start each change from the section it belongs to",
        problem: "Customers usually change one thing at a time, such as adding a driver or updating accessories. Sending them through one long edit form for a single change is slow and easy to get wrong.",
        approach: "Every block that can change (vehicle, owner, drivers, beneficiary, policy delivery, accessories, dashcam) has its own edit button beside its heading.",
        why: "People go straight to the part they want to change. The trade-off is many edit buttons on one screen, so they all use the same small outlined icon button and stay in the same position.",
        image: { src: "images/projects/insurverse/endorse-policy-info.webp", caption: "Policy detail: Policy information tab (personal data blurred)", phone: true,
          pins: [
            { x: 60, y: 12.6, text: "Policy information tab" },
            { x: 82, y: 13.4, text: "Each block has its own edit button" },
            { x: 50, y: 54, text: "Several drivers in one card, separated by a divider" },
            { x: 18, y: 97.7, text: "Download the policy documents" }
          ] }
      }
    ],
    finalDesign: [],    // รอภาพหน้าจอแก้ไขข้อมูล / สรุปเบี้ยที่เปลี่ยน / ชำระเงินเพิ่ม-คืนเงิน
    designSystem: {
      text: "Components in the Insurverse style, shown with their states.",
      items: [
        { src: "images/projects/insurverse/ds-buttons.webp", caption: "Buttons" },
        { src: "images/projects/insurverse/ds-checkbox.webp", caption: "Checkbox states" },
        { src: "images/projects/insurverse/ds-input.webp", caption: "Input states" },
        { src: "images/projects/insurverse/ds-icons.webp", caption: "Icons" }
      ]
    },
    handoff: `<ul>
                <li>Continued from the previous designer's file, matching the existing theme and components</li>
                <li>Handed over to developers as a Figma file</li>
              </ul>`,
    delivered: `<ul>
                  <li>Mobile UI screens for selected financial-endorsement modules in Release 3.5</li>
                  <li>The components those screens needed</li>
                </ul>`,
    trackMetrics: [
      "Share of customers who start a policy change and finish it",
      "Where people drop out of the endorsement steps",
      "Support contacts about policy changes and extra payments or refunds"
    ],
    notes: "ไม่มี usability test / feedback · ตัวเลขเว็บเดิม (−35%, CSAT 4.8, WCAG AA) ไม่มีที่มา → ไม่ใช้ · ภาพ Flow/Wireframe/ปก จาก PDF = ภาพรวมระบบ ไม่ใช่ส่วนที่ออกแบบเอง"
  },
  {
    id: "job-sync",
    title: "Job Sync",
    subtitle: "Account & Candidate Onboarding",
    client: TODO,
    category: "Job platform · Onboarding",
    tags: ["Onboarding", "Form design", "Account & security"],
    accent: "#F0501E",
    cover: "images/projects/job-sync/cover.webp",
    hero: "images/projects/job-sync/cover.webp",
    summary: "An online job search and application platform. I designed the candidate onboarding: creating an account, logging in, and filling in the candidate profile before using the platform.",
    overview: {
      role: "UX/UI Designer",
      scope: "Candidate onboarding: sign-up and login, password rules and feedback, email verification, password reset, candidate profile steps, status messages",
      team: TODO, duration: TODO, platform: TODO, status: TODO, tools: TODO
    },
    problem: {
      context: `<p>Before job seekers can search and apply, they need an account and a candidate profile. This is the first part of the product they meet, and the part where forms, rules and errors pile up: passwords that must meet conditions, an email that must be verified, and profile details to complete.</p>
                <p>My part covered the whole onboarding path:</p>
                <ul>
                  <li>Sign-up and login</li>
                  <li>Showing and hiding the password</li>
                  <li>Password rules, and the state shown when each rule passes or fails</li>
                  <li>The "we've sent you a verification email" page</li>
                  <li>Requesting a password reset and setting a new password</li>
                  <li>The candidate profile steps</li>
                  <li>Dialogs and status messages along the onboarding path</li>
                </ul>`,
      users: [
        { name: "New job seekers", need: "Create an account and prepare their candidate details" },
        { name: "Returning users", need: "Log in, or get back into their account when they forget the password" }
      ],
      goals: [
        "Make the order of the first steps clear",
        "Show what people need to fill in and which conditions they must meet",
        "Tell people what to do next when something goes wrong"
      ],
      goalsNote: "These goals describe the design intent. They are not results confirmed by testing or by data after launch."
    },
    flowsNote: "The overall Job Sync journey. My part is the account and onboarding steps: login, sign-up and the candidate profile.",
    flows: [
      { src: "images/projects/job-sync/user-flow.webp", caption: "Job Sync journey: search → recommended jobs → job detail → apply, with login or sign-up asked for only when needed" },
      { src: "images/projects/job-sync/sitemap.webp", caption: "Sitemap: the Authentication branch (login, sign-up) is the onboarding part" }
    ],
    development: [
      { layout: "side",
        text: "Login. The wireframe put the form on the left and the image on the right. In the final design the image panel moved to the left, the Google button became an outlined secondary button with the Google logo, and the password field gained a show/hide icon.",
        before: { src: "images/projects/job-sync/wf-login.webp", caption: "Wireframe: login" },
        after: { src: "images/projects/job-sync/onboard-login.webp", caption: "Final: login" } },
      { layout: "side",
        text: "Sign up. The structure stayed the same: email, password, confirm password, and acceptance of the terms. In the final design Continue stays inactive until the form is complete, and the links to sign in, PDPA and the privacy policy use the brand colour.",
        before: { src: "images/projects/job-sync/wf-signup.webp", caption: "Wireframe: sign up" },
        after: { src: "images/projects/job-sync/onboard-signup.webp", caption: "Final: sign up" } },
      { layout: "side",
        text: "Upload resume. The wireframe had a plain upload box with Skip and Submit. The final step became a drag-and-drop area that states the accepted file types and size limit, shows the uploaded file with view and delete, and uses Back and Next like every other step.",
        before: { src: "images/projects/job-sync/wf-upload.webp", caption: "Wireframe: upload resume" },
        after: { src: "images/projects/job-sync/onboard-profile-1-resume.webp", caption: "Final: upload resume" } },
      { layout: "side",
        text: "Personal information. The wireframe asked for a middle name and a full address (house number, village, road). The final form drops the middle name, keeps the address to postal code, province, district and sub-district, and puts latest and expected salary side by side, with a Fresh Graduate option and helper text under commission and incentive.",
        before: { src: "images/projects/job-sync/wf-personal.webp", caption: "Wireframe: personal information" },
        after: { src: "images/projects/job-sync/onboard-profile-2-personal.webp", caption: "Final: personal information" } }
    ],
    decisions: [
      {
        title: "Show password rules as a live checklist",
        problem: "Password rules are a common reason forms fail. If the rules only appear after people press Continue, they have to guess, fail, read an error and try again.",
        approach: "The rules sit under the password field as a checklist, and each one turns green as soon as it is met. The eye icon shows or hides what was typed, and the active field is outlined in the brand colour.",
        why: "People can see what is still missing while they type, instead of after a failed attempt. The trade-off is a taller form, so the list appears with the field that needs it rather than on every screen.",
        image: { src: "images/projects/job-sync/onboard-new-password.webp", caption: "Set a new password: rules tick off as you type",
          pins: [
            { x: 54.4, y: 30, text: "The field being edited is outlined in the brand colour" },
            { x: 85.6, y: 30, text: "Show or hide the password" },
            { x: 54.4, y: 39.8, text: "Each rule turns green when it is met" },
            { x: 54.4, y: 60, text: "One clear action to continue" }
          ] }
      },
      {
        title: "Break the candidate profile into five steps, with progress always visible",
        problem: "A candidate profile asks for a resume, personal details, address, salary expectations, work history, education, skills, certificates and interests. As one form it is long enough to make people give up.",
        approach: "Five steps: upload resume, personal information, work experience, education, and skills / certificates / interests. A card on the right shows how complete the profile is and ticks off each finished step. Back and Next sit under every step.",
        why: "Each screen stays focused on one topic, and people always know how much is left. The trade-off is more clicks, which the percentage and the step list make predictable.",
        image: { src: "images/projects/job-sync/onboard-profile-2-personal.webp", caption: "Step 2 of 5: personal information, with the profile at 20%",
          pins: [
            { x: 92.6, y: 18.3, text: "How complete the profile is, as a percentage" },
            { x: 88.2, y: 25.1, text: "Finished steps are ticked off" },
            { x: 17.5, y: 24.2, text: "Required fields are marked with *" },
            { x: 58.6, y: 33.5, text: "The email comes from the account, so it cannot be edited here" },
            { x: 42.9, y: 95.8, text: "Back and Next under every step" }
          ] }
      },
      {
        title: "Let people review everything before they submit",
        problem: "After five steps it is hard to remember what was entered, and a mistake in salary or dates is easy to miss.",
        approach: "The last screen previews the whole profile in read-only fields, grouped in the same order as the steps, with the progress card at 100%. Back returns to the steps; Submit sends the profile.",
        why: "One last check catches mistakes before an employer sees them. The trade-off is one extra screen at the end of an already long process.",
        image: { src: "images/projects/job-sync/onboard-profile-preview.webp", caption: "Preview candidate information before submitting", tall: true,
          pins: [
            { x: 87, y: 8.2, text: "Profile 100% complete" },
            { x: 59, y: 16.3, text: "Everything shown read-only, in the same groups as the steps" },
            { x: 44, y: 98.8, text: "Back to fix something, or Submit" }
          ] }
      }
    ],
    finalDesign: [
      {
        title: "Create an account and log in",
        text: "Login and sign-up share one layout: a photo panel on the left, the form on the right, and a link to switch between the two. Sign-up asks for an email, a password and its confirmation, and acceptance of the terms, PDPA and privacy policy, then confirms that a verification email has been sent.",
        shots: [
          { src: "images/projects/job-sync/onboard-login.webp", caption: "Log in",
            pins: [
              { x: 85.4, y: 42.5, text: "Forgot password sits right under the password field" },
              { x: 54.6, y: 62.2, text: "Sign in with Google as an alternative" },
              { x: 79.7, y: 68.5, text: "Switch to sign-up" }
            ] },
          { src: "images/projects/job-sync/onboard-signup.webp", caption: "Sign up",
            pins: [
              { x: 85.2, y: 37.8, text: "Both password fields can be shown or hidden" },
              { x: 54.6, y: 50.3, text: "Accept the terms, PDPA and privacy policy" },
              { x: 54.6, y: 59.8, text: "Continue stays inactive until the form is complete" },
              { x: 79.7, y: 66.1, text: "Switch to sign in" }
            ] },
          { src: "images/projects/job-sync/onboard-verify-email.webp", caption: "Verification email sent",
            pins: [
              { x: 69.5, y: 38.5, text: "An illustration makes the state clear at a glance" },
              { x: 69.5, y: 61.5, text: "Tells people to verify their account before logging in" },
              { x: 69.5, y: 73.7, text: "One way forward: Go Home" }
            ] }
        ]
      },
      {
        title: "Get back into the account",
        text: "Forgot password asks only for the registered email, explains that a reset link will be sent, and offers Cancel next to Submit. The link leads to setting a new password with the live checklist.",
        shots: [
          { src: "images/projects/job-sync/onboard-forgot.webp", caption: "Forgot password",
            pins: [
              { x: 54.6, y: 38, text: "Explains what will happen: a reset link by email" },
              { x: 54.6, y: 56.1, text: "Cancel next to Submit" }
            ] }
        ]
      },
      {
        title: "Candidate profile",
        text: "Each step uses the same layout: the form on the left, the progress card on the right, Back and Next underneath. Sections that can repeat, such as work experience, education, languages and certificates, have an Add button.",
        shots: [
          { src: "images/projects/job-sync/onboard-profile-1-resume.webp", caption: "Step 1: upload resume",
            pins: [
              { x: 58.5, y: 30.6, text: "Drag and drop, with file types and size limit stated up front" },
              { x: 58.5, y: 44, text: "The uploaded file can be viewed or deleted" },
              { x: 86.3, y: 23.2, text: "The profile starts at 0%" }
            ] },
          { src: "images/projects/job-sync/onboard-profile-3-experience.webp", caption: "Step 3: work experience",
            pins: [
              { x: 41.8, y: 34.7, text: "\"I'm currently working in this role\"" },
              { x: 44, y: 54.8, text: "Add more than one experience" }
            ] },
          { src: "images/projects/job-sync/onboard-profile-4-education.webp", caption: "Step 4: education background",
            pins: [ { x: 31.8, y: 33.6, text: "\"Studying\" instead of a graduation year" },
                    { x: 46, y: 53.6, text: "Add more than one education" } ] },
          { src: "images/projects/job-sync/onboard-profile-5-skills.webp", caption: "Step 5: skills, certificates and interests",
            pins: [
              { x: 32.7, y: 27.1, text: "The rule is stated under the field: at least 3 skills" },
              { x: 45, y: 36.6, text: "Add more languages" },
              { x: 53.6, y: 46.2, text: "Optional sections can be collapsed" }
            ] }
        ]
      }
    ],
    designSystem: {
      text: "Components shown with their states.",
      items: [
        { src: "images/projects/job-sync/ds-checkbox.webp", caption: "Checkbox states" },
        { src: "images/projects/job-sync/ds-icons.webp", caption: "Icons" }
      ]
    },
    validation: TODO, handoff: TODO,
    trackMetrics: [
      "Share of new sign-ups who finish the candidate profile",
      "Where people drop out of the onboarding steps",
      "How often password rules fail, and password-reset requests"
    ],
    notes: "ยังไม่ยืนยัน: ประเภท/ที่มาของงาน, ทีม, ระยะเวลา, เครื่องมือ, สถานะ, feedback/test, handoff · 'AI job recommendations' ตัดออกจากคำอธิบาย (ยังไม่ยืนยัน)"
  },
  {
    id: "bki",
    title: "BKI Revamp",
    client: "Bangkok Insurance",
    category: "InsurTech · Website redesign",
    tags: ["Website redesign", "Insurance", "Form design"],
    accent: "#1F4E9C",
    cover: "images/projects/bki/cover.webp",
    hero: "images/projects/bki/cover.webp",
    summary: "A redesign of Bangkok Insurance's online car insurance form and package comparison website.",
    overview: { role: "UX/UI Designer at Extend IT Resource", scope: TODO, team: TODO, duration: TODO, platform: "Web", status: TODO, tools: TODO },
    problem: { context: `<p>The website lets customers enter their vehicle details, choose a type of coverage, and compare packages. The redesign focused on readability and on taking people through the form one step at a time.</p>` },
    finalDesign: [
      {
        title: "Applying for car insurance",
        text: "The form is split into steps with a progress bar, and each group of questions sits in its own section that can be collapsed.",
        shots: [
          { src: "images/projects/bki/screen.webp", caption: "Insurance application: basic vehicle information",
            pins: [
              { x: 37, y: 16, text: "Progress bar across the four steps of the application" },
              { x: 92, y: 29, text: "Each group of questions can be collapsed" },
              { x: 66, y: 58, text: "Vehicle type chosen with large picture buttons" },
              { x: 80, y: 81, text: "Next moves on to the following section" }
            ] }
        ]
      }
    ],
    notes: "เว็บเดิม: ไม่มี DS เดิม สร้าง DS ไปพร้อมกัน, WCAG AA, 1 DS ใช้ 3 ผลิตภัณฑ์, ลด handoff 4 สัปดาห์, PM อยากข้าม accessibility — ยังไม่ยืนยัน ไม่แสดง"
  },
  {
    id: "roddonjai",
    title: "Roddonjai",
    client: "TTB Bank",
    category: "E-Marketplace · Used cars",
    tags: ["Marketplace", "Automotive", "Finance"],
    accent: "#E8501E",
    cover: "images/projects/roddonjai/cover.webp",
    hero: "images/projects/roddonjai/cover.webp",
    summary: "An online platform for buying and selling used cars.",
    overview: { role: "UX/UI Designer at Extend IT Resource", scope: TODO, team: TODO, duration: TODO, platform: "Web", status: TODO, tools: TODO },
    problem: { context: `<p>Buyers can search used cars by brand, model, price and condition. Each car has a detailed profile with photos, specifications, price and a location map, alongside blue book prices, auction options and step-by-step purchase guidance.</p>` },
    finalDesign: [
      {
        title: "Car detail",
        text: "The detail page puts photos, the price and the rating at the top, then lets people switch between the car details, a loan calculation and insurance before reading the full specification.",
        shots: [
          { src: "images/projects/roddonjai/screen.webp", caption: "Car detail page",
            pins: [
              { x: 30, y: 30, text: "Photo gallery with thumbnails" },
              { x: 71, y: 36, text: "The best price stands out in the brand colour" },
              { x: 57, y: 62, text: "Switch between car details, loan calculation and insurance" },
              { x: 30, y: 78, text: "Full specification in a two-column table" },
              { x: 88, y: 92, text: "Where the car is, on a map" }
            ] }
        ]
      }
    ],
    notes: "เว็บเดิม: 50,000+ listings, +25% loan apps, +18% A/B, แสดง 3 ข้อมูลหลักบนการ์ด — ยังไม่ยืนยัน ไม่แสดง"
  },
  {
    id: "good-money",
    title: "Good Money",
    client: "Government Savings Bank (GSB)",
    category: "FinTech · Loan app",
    tags: ["Mobile app", "Personal loan", "Finance"],
    accent: "#E4277B",
    cover: "images/projects/good-money/cover.webp",
    hero: "images/projects/good-money/cover.webp",
    summary: "A personal-loan mobile app where people can calculate the loan amount and repayments before they apply.",
    overview: { role: "UX/UI Designer at Extend IT Resource", scope: TODO, team: TODO, duration: TODO, platform: "Mobile app", status: TODO, tools: TODO },
    problem: { context: `<p>Users can simulate a payment schedule by choosing their occupation, income and loan conditions in advance. The app also covers applying for a loan and tracking repayments.</p>` },
    finalDesign: [
      {
        title: "Calculate, apply and track",
        text: "Four screens follow the journey: work out how much you can borrow, see the loan offer on the home screen, confirm the result, and check the outstanding balance and payments.",
        shots: [
          { src: "images/projects/good-money/screen.webp", caption: "Loan calculator, home, application result and loan detail",
            pins: [
              { x: 5, y: 17, text: "Step 1 of the calculator: choose your occupation" },
              { x: 38, y: 22, text: "The loan offer and an Apply button on the home screen" },
              { x: 61, y: 49, text: "A clear result with the approved amount" },
              { x: 91, y: 32, text: "Outstanding loan with a Pay button" },
              { x: 91, y: 90, text: "Pay is the centre button in the tab bar" }
            ] }
        ]
      }
    ],
    notes: "เว็บเดิม: ผู้ใช้สูงอายุ/ทักษะดิจิทัลต่ำ, ปุ่มใหญ่ contrast สูง, user research — ยังไม่ยืนยัน ไม่แสดง"
  },
  {
    id: "smart-ticket",
    title: "Smart Ticket",
    client: TODO,
    category: "POS · Attraction ticketing",
    tags: ["POS", "Mobile", "Multi-currency"],
    accent: "#2E7D4F",
    cover: "images/projects/smart-ticket/cover.webp",
    hero: "images/projects/smart-ticket/cover.webp",
    summary: "A ticket sales and verification system for tourist attractions, designed for POS devices.",
    overview: { role: TODO, scope: TODO, team: TODO, duration: TODO, platform: "POS (handheld)", status: TODO, tools: TODO },
    problem: { context: `<p>Staff use it to sell and check tickets. It shows ticket information, prices and real-time availability, supports local and international ticket types, and calculates prices in several currencies on a single screen.</p>` },
    finalDesign: [
      {
        title: "Selling a ticket",
        text: "From the home menu, staff search attractions, pick a ticket, set the number of local and international visitors, and choose the currency to take payment in.",
        shots: [
          { src: "images/projects/smart-ticket/screen.webp", caption: "Home, ticket sale, ticket detail and currency",
            pins: [
              { x: 10, y: 52, text: "Four large actions on the home screen" },
              { x: 36, y: 25, text: "Search and filter attractions" },
              { x: 63, y: 60, text: "Local and international visitors counted separately" },
              { x: 80, y: 45, text: "Pick the currency: LAK, THB, USD or CNY" }
            ] }
        ]
      }
    ],
    notes: "เว็บเดิม: Extend IT? ไม่อยู่ในรายชื่อ, staff training < 20 นาที, จอเดียว, ทดสอบกับพนักงาน — ยังไม่ยืนยัน ไม่แสดง · ลูกค้า: ปกเขียน POS หลวงพระบาง"
  }
];

/* ---------- ใบรับรอง ----------
   image  : รูปย่อในการ์ด      เช่น "images/certs/2026-skooldio.webp"
   full   : รูปใหญ่ตอนดูเต็มจอ เช่น "images/certs/2026-skooldio-full.webp" (ไม่ใส่ = ใช้ image แทน)
   verify : ลิงก์ตรวจสอบจากผู้ออกใบ (ไม่มี = TODO หรือ null → ปุ่ม Verify ไม่แสดง) */
const CERTIFICATES = [
  { year: "Nov 2026", title: "UX/UI Champion Bootcamp (Batch #2)", issuer: "Skooldio", image: "images/certs/2026-skooldio.webp", full: "images/certs/2026-skooldio-full.webp", verify: null },
  { year: "Mar 2026", title: "AI for Software Development", issuer: "IMC Institute", image: "images/certs/2026-imc.webp", full: "images/certs/2026-imc-full.webp", verify: null },
  { year: "Oct 2024", title: "User Experience Design: Customer Loyalty & Positive Experiences", issuer: "FutureSkill", image: "images/certs/2024-futureskill-ux.webp", full: "images/certs/2024-futureskill-ux-full.webp", verify: null },
  { year: "Sep 2024", title: "IT Analysis & Wireframe Design on Figma", issuer: "FutureSkill", image: "images/certs/2024-futureskill-wireframe.webp", full: "images/certs/2024-futureskill-wireframe-full.webp", verify: null },
  { year: "Feb 2022", title: "Designing UX/UI to Meet User Needs Effectively (Passed assessment)", issuer: "RMUTSB", image: "images/certs/2022-rmutsb.webp", full: "images/certs/2022-rmutsb-full.webp", verify: null },
  { year: "Feb 2022", title: "Designing UX/UI to Meet User Needs Effectively (Completed 6-hour training)", issuer: "RMUTSB", image: "images/certs/2022-rmutsb-attended.webp", full: "images/certs/2022-rmutsb-attended-full.webp", verify: null },
  { year: "Jan 2022", title: "NFT 10,000 Randomly Generate", issuer: "Digit Soul Co., Ltd.", image: "images/certs/2022-digitsoul-nft.webp", full: "images/certs/2022-digitsoul-nft-full.webp", verify: null },
  { year: "May 2020", title: "Research presentation: Media Design for Mobile Application", issuer: "3rd FIT SSRU Conference", image: "images/certs/2020-ssru.webp", full: "images/certs/2020-ssru-full.webp", verify: null }
];


/* ---------- นิยาย (ศาลานักเล่าเรื่อง) ----------
   titleTh : ชื่อเรื่องภาษาไทย (ตรวจตัวสะกดอีกครั้งนะ — คัดลอกมาจากภาพหน้าจอ)
   titleEn : ชื่อภาษาอังกฤษ
   genre   : แนว (ภาษาอังกฤษ)
   blurb   : คำโปรยภาษาอังกฤษ 1–2 ประโยค
   cover   : ภาพปก เช่น "images/novels/emperor.webp"
   url     : ลิงก์หน้านิยายใน Dek-D
*/
const PEN_NAME = "Howzler";
const NOVELS = [
  { titleTh: "ข้านี่แหละเง็กเซียนฮ่องเต้", titleEn: "I Am the Jade Emperor", genre: "Xianxia · Comedy",
    blurb: "Bored of Heaven, the Jade Emperor sneaks down to possess the body of a good-for-nothing, hoping to wander the land eating his fill. His plan falls apart when four beauties turn out to hear his inner thoughts. Stern on the outside, a total troublemaker inside, he sets off on a chaotic quest to vanquish demons.",
    cover: "images/novels/jade-emperor.webp", full: "images/novels/jade-emperor-full.webp", url: "https://dekd.co/w/n/2696187" },
  { titleTh: "คุณชายยอดมังกร", titleEn: "The Dragon Young Master", genre: "Chinese historical · Comedy",
    blurb: "A solitude-loving dragon who only wants to be a lazy 'salted fish' is forced to spread his wings and guard the phoenix throne. The legend of a young dragon who longs for idleness, yet keeps pulling off feats that the whole realm sings about.",
    cover: "images/novels/dragon-young-master.webp", full: "images/novels/dragon-young-master-full.webp", url: "https://dekd.co/w/n/2664716" },
  { titleTh: "[ภาค 1] Engineering the Heart : กลไกหัวใจนายวิศวะ", titleEn: "Engineering the Heart", genre: "Romance · Drama",
    blurb: "When the most perfect mechanism loses to the simplest heart, a journey to prove a vow sworn by rivers and mountains begins.",
    cover: "images/novels/engineering-the-heart.webp", full: "images/novels/engineering-the-heart-full.webp", url: "https://dekd.co/w/n/2667073" },
  { titleTh: "[ภาค 2] Jin-ius Mechanic: กลไก (รัก) ฉบับเพลย์บอย", titleEn: "Jin-ius Mechanic", genre: "Romance · Drama",
    blurb: "In engineering, everything has a reason and a cause. But in Ploypailin's world, Jin can't find a single answer. Maybe this love needs no formula, only a heart to crack the code.",
    cover: "images/novels/jin-ius-mechanic.webp", full: "images/novels/jin-ius-mechanic-full.webp", url: "https://dekd.co/w/n/2670179" },
  { titleTh: "[ภาค 3 มี E-Book] Time-less Engine: กลไก (รัก) หยุดเวลา", titleEn: "Time-less Engine", genre: "Romance · Comedy",
    blurb: "A billionaire's heir hides as an ordinary employee, only to have a strict manager catch his every slip. Can a secret mechanism outwit a walking lie detector? When time stops, which begins first: love or revenge?",
    cover: "images/novels/time-less-engine.webp", full: "images/novels/time-less-engine-full.webp", url: "https://dekd.co/w/n/2675712" }
];
