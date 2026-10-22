"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight, faArrowUpRightFromSquare, faBars, faBriefcase, faCheck, faChevronRight, faDumbbell, faGamepad, faGraduationCap, faHouse, faMessage, faMoon, faPaperPlane, faSun, faXmark } from "@fortawesome/free-solid-svg-icons";

type Page = "Beranda" | "Biodata" | "Hobi" | "Kontak";
type ChatMessage = { role: "user" | "assistant"; content: string };

const navItems: { label: Page; icon: typeof faHouse }[] = [
  { label: "Beranda", icon: faHouse }, { label: "Biodata", icon: faGraduationCap },
  { label: "Hobi", icon: faGamepad }, { label: "Kontak", icon: faMessage }
];

export default function Portfolio() {
  const [page, setPage] = useState<Page>("Beranda");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Halo! Ingin tahu tentang Habib? Tanyakan saja soal biodata, sekolah, hobi, atau cita-citanya." }
  ]);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("habib-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  useEffect(() => { localStorage.setItem("habib-theme", theme); }, [theme]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, chatOpen]);
  useEffect(() => {
    const timer = window.setTimeout(() => setIntroVisible(false), 2850);
    return () => window.clearTimeout(timer);
  }, []);

  const navigate = (next: Page) => { setPage(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || data.error || "Maaf, saya belum punya jawabannya." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sepertinya koneksi sedang bermasalah. Coba lagi sebentar, ya." }]);
    } finally { setLoading(false); }
  };
  const copyWhatsApp = async () => {
    try { await navigator.clipboard.writeText("083869313223"); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <main className={`site ${theme}`}>
      <AnimatePresence>
        {introVisible && <motion.div className="intro-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(12px)", transition: { duration: .55 } }}>
          <div className="intro-grid" />
          <div className="intro-content">
            <span className="intro-kicker">HABIB HASIBUAN · PORTOFOLIO PRIBADI</span>
            <h1 className="intro-title" aria-label="Welcome To My Portofolio">
              {["Welcome", "To", "My", "Portofolio"].map((word, i) => <motion.span key={word} initial={{ opacity: 0, y: 34, rotateX: -45, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }} transition={{ duration: .62, delay: .25 + i * .28, ease: [0.2, 0.8, 0.2, 1] }}>{word}{i < 3 ? " " : ""}</motion.span>)}
            </h1>
            <div className="intro-progress"><span /></div>
          </div>
        </motion.div>}
      </AnimatePresence>
      <div className="canvas-glow glow-one" /><div className="canvas-glow glow-two" /><div className="canvas-glow glow-three" />
      <div className="grain" />
      <header className="topbar">
        <button className="wordmark" onClick={() => navigate("Beranda")} aria-label="Kembali ke beranda">habib<span>.</span></button>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navItems.map(item => <button key={item.label} className={`nav-link ${page === item.label ? "active" : ""}`} onClick={() => navigate(item.label)}><FontAwesomeIcon icon={item.icon} /><span>{item.label}</span></button>)}
        </nav>
        <div className="top-actions">
          <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Ganti tema">
            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} /><span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka menu"><FontAwesomeIcon icon={menuOpen ? faXmark : faBars} /></button>
        </div>
      </header>

      <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav glass" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{navItems.map(item => <button key={item.label} className={page === item.label ? "active" : ""} onClick={() => navigate(item.label)}><FontAwesomeIcon icon={item.icon} />{item.label}<FontAwesomeIcon className="chevron" icon={faChevronRight} /></button>)}</motion.nav>}</AnimatePresence>

      <section className="page-shell">
        <AnimatePresence mode="wait">
          <motion.div key={page} className="page-content" initial={{ opacity: 0, y: 12, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }} transition={{ duration: .35, ease: "easeOut" }}>
            {page === "Beranda" && <HomePage navigate={navigate} />}
            {page === "Biodata" && <BiodataPage />}
            {page === "Hobi" && <HobbyPage />}
            {page === "Kontak" && <ContactPage copyWhatsApp={copyWhatsApp} copied={copied} />}
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="footer"><span>© {new Date().getFullYear()} Habib Hasibuan</span><span>Dibuat untuk berbagi cerita dan minat saya.</span><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Kembali ke atas <FontAwesomeIcon icon={faArrowRight} /></button></footer>

      <button className="assistant-fab" onClick={() => setChatOpen(true)} aria-label="Buka asisten informasi"><FontAwesomeIcon icon={faMessage} /><span>Tanya tentang Habib</span></button>
      <AnimatePresence>{chatOpen && <motion.aside className="chat-panel glass" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }} aria-label="Asisten informasi Habib">
        <div className="chat-head"><div><span className="status-dot" /><div><strong>Kenali Habib</strong><small>Teman informasi situs</small></div></div><button onClick={() => setChatOpen(false)} aria-label="Tutup asisten"><FontAwesomeIcon icon={faXmark} /></button></div>
        <div className="chat-messages" aria-live="polite">{messages.map((m, i) => <div key={i} className={`chat-bubble ${m.role}`}>{m.content}</div>)}{loading && <div className="chat-bubble assistant typing">Sebentar, ya<span>...</span></div>}<div ref={chatEndRef} /></div>
        <div className="suggestions">{["Apa hobi Habib?", "Di mana Habib sekolah?", "Apa cita-cita Habib?"].map(q => <button key={q} onClick={() => setInput(q)}>{q}</button>)}</div>
        <form className="chat-form" onSubmit={sendMessage}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Tulis pertanyaan..." maxLength={1000} aria-label="Pertanyaan untuk asisten" /><button disabled={loading || !input.trim()} aria-label="Kirim pertanyaan"><FontAwesomeIcon icon={faPaperPlane} /></button></form>
        <p className="chat-note">Saya menjawab berdasarkan informasi di situs ini. Kalau belum ada informasinya, saya akan mengatakannya.</p>
      </motion.aside>}</AnimatePresence>
    </main>
  );
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number}</span><span className="label-line" /><span>{children}</span></div>;
}

function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return <div className="home-layout">
    <div className="hero-copy">
      <SectionLabel number="01 / 04">TENTANG SAYA</SectionLabel>
      <p className="eyebrow"><span className="live-dot" /> PORTOFOLIO PRIBADI</p>
      <h1>Halo, saya<br /><span className="name-gradient">Habib Hasibuan.</span></h1>
      <p className="hero-description">Saya suka berolahraga dan bermain game. Suatu hari nanti, saya ingin punya usaha sendiri. Di situs ini, saya berbagi sedikit cerita tentang diri saya dan hal-hal yang saya sukai.</p>
      <div className="hero-buttons"><button className="button-primary" onClick={() => navigate("Biodata")}>Tentang saya <FontAwesomeIcon icon={faArrowRight} /></button><button className="button-quiet" onClick={() => navigate("Hobi")}>Hobi saya <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></button></div>
      <div className="hero-meta"><span>INDONESIA</span><span className="meta-line" /><span>PORTOFOLIO PRIBADI · 2026</span></div>
    </div>
    <div className="hero-visual">
      <div className="orbit orbit-a" /><div className="orbit orbit-b" />
      <div className="portrait-card glass"><div className="portrait-top"><span>HH / PROFILE</span><span>01—04</span></div><div className="portrait-frame"><Image src="/images/habib1.jpg" alt="Foto Habib Hasibuan" fill priority sizes="(max-width: 800px) 80vw, 36vw" className="portrait-image" /></div><div className="portrait-caption"><div><strong>Habib Hasibuan</strong><span>Pelajar · Calon pengusaha</span></div><span className="portrait-index">HH.</span></div></div>
      <div className="floating-note glass"><span className="note-icon"><FontAwesomeIcon icon={faBriefcase} /></span><div><small>CITA-CITA</small><strong>Menjadi pengusaha.</strong></div><span className="blue-spark">✳</span></div>
      <div className="vertical-note">PORTOFOLIO PRIBADI — EST. 2010</div>
    </div>
    <button className="scroll-cue" onClick={() => navigate("Biodata")}><span className="scroll-icon"><FontAwesomeIcon icon={faArrowDown} /></span>GULIR UNTUK MELIHAT LEBIH JAUH</button>
    <div className="home-bottom"><span>01</span><div /><span>HALAMAN UTAMA</span><span className="home-bottom-right">CERITA SINGKAT TENTANG SAYA.</span></div>
  </div>;
}

function BiodataPage() {
  const facts = [
    ["Nama lengkap", "Habib Hasibuan"], ["Tempat lahir", "Medan"], ["Tanggal lahir", "20 Oktober 2010"],
    ["Cita-cita", "Menjadi pengusaha"], ["Hobi", "Olahraga dan game"]
  ];
  return <div className="inner-page">
    <SectionLabel number="02 / 04">BIODATA</SectionLabel>
    <div className="page-heading"><div><p className="eyebrow">CERITA SINGKAT SAYA</p><h1>Kenalan<br /><span className="name-gradient">lebih dekat.</span></h1></div><p className="heading-side">Ini beberapa hal tentang saya.</p></div>
    <div className="bio-grid">
      <div className="bio-photo glass"><Image src="/images/habib2.jpg" alt="Potret Habib Hasibuan" fill sizes="(max-width: 800px) 90vw, 34vw" className="cover-image" /><span className="photo-tag">HABIB HASIBUAN / 001</span></div>
      <div className="bio-details glass"><div className="card-kicker">01 — INFORMASI PRIBADI</div>{facts.map(([label, value], i) => <div className="fact-row" key={label}><span className="fact-index">0{i + 1}</span><span className="fact-label">{label}</span><strong>{value}</strong></div>)}<p className="bio-note">Saya masih perlu banyak belajar dan mencari pengalaman. Harapannya, suatu saat saya bisa membangun usaha sendiri.</p></div>
    </div>
    <div className="school-section"><div className="subheading"><span>02 / RIWAYAT SEKOLAH</span><h2>Perjalanan pendidikan.</h2></div><div className="school-list">
      {[["01","SD","DAHLIA"],["02","SMP","AL WASHLIYAH"],["03","SMK","S TELADAN P SIANTAR"]].map(([n,level,name]) => <div className="school-row" key={n}><span className="school-no">{n}</span><span className="school-level">{level}</span><strong>{name}</strong><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></div>)}
    </div></div>
  </div>;
}

function HobbyPage() {
  const [expandedHobby, setExpandedHobby] = useState<string | null>(null);
  const hobbies = [
    { n:"01", title:"Olahraga", tag:"AKTIF & BERGERAK", image:"/images/olahraga.jpg", icon:faDumbbell, description:"Saya suka olahraga karena badan terasa lebih segar setelah bergerak. Saya juga belajar untuk rutin latihan dan tidak cepat menyerah, meskipun hasilnya tidak langsung terlihat.", reason:"Saya menyukai olahraga karena membuat tubuh lebih bugar dan pikiran terasa segar. Latihan juga mengajarkan saya untuk sabar. Hasilnya memang tidak selalu cepat terlihat, jadi saya berusaha menjalaninya dengan rutin." },
    { n:"02", title:"Game", tag:"HIBURAN & STRATEGI", image:"/images/game.jpg", icon:faGamepad, description:"Saya suka bermain game saat ada waktu luang. Selain menghibur, beberapa game membuat saya berpikir sebelum mengambil langkah dan mencoba cara lain saat strategi pertama tidak berhasil.", reason:"Game seru karena bukan hanya soal menang atau kalah. Saya suka memikirkan langkah berikutnya dan mencoba lagi kalau gagal. Yang penting, bermain tetap secukupnya dan tidak mengganggu sekolah atau kegiatan lain." }
  ];
  return <div className="inner-page">
    <SectionLabel number="03 / 04">HAL YANG SAYA SUKAI</SectionLabel>
    <div className="page-heading"><div><p className="eyebrow">KEGIATAN DI WAKTU LUANG</p><h1>Waktu luang,<br /><span className="name-gradient">hal yang saya sukai.</span></h1></div><p className="heading-side">Inilah dua kegiatan yang paling saya nikmati saat waktu luang.</p></div>
    <div className="hobby-grid">{hobbies.map(h => <article className={`hobby-card glass ${expandedHobby === h.n ? "is-expanded" : ""}`} key={h.n}><div className="hobby-image"><Image src={h.image} alt={h.title} fill sizes="(max-width: 800px) 90vw, 40vw" className="cover-image" /><span className="hobby-number">{h.n}</span><span className="hobby-icon"><FontAwesomeIcon icon={h.icon} /></span></div><div className="hobby-body"><div className="card-kicker">{h.tag}</div><h2>{h.title}</h2><p>{h.description}</p><button className="hobby-footer" type="button" aria-expanded={expandedHobby === h.n} onClick={() => setExpandedHobby(expandedHobby === h.n ? null : h.n)}><span>{expandedHobby === h.n ? "TUTUP PENJELASAN" : "ALASAN SAYA MENYUKAINYA"}</span><span className="hobby-line" /><FontAwesomeIcon icon={faArrowRight} className={expandedHobby === h.n ? "hobby-arrow is-open" : "hobby-arrow"} /></button><AnimatePresence initial={false}>{expandedHobby === h.n && <motion.div className="hobby-reason" initial={{ opacity: 0, height: 0, y: -5 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -5 }} transition={{ duration: .25 }}><p>{h.reason}</p></motion.div>}</AnimatePresence></div></article>)}</div>
    <div className="hobby-outro glass"><span className="outro-star">✳</span><p>Olahraga membuat saya tetap aktif, sedangkan game jadi hiburan saat senggang. Saya menikmati keduanya dengan cara yang berbeda dan berusaha tetap membagi waktu dengan baik.</p></div>
  </div>;
}

function ContactPage({ copyWhatsApp, copied }: { copyWhatsApp: () => void; copied: boolean }) {
  return <div className="inner-page">
    <SectionLabel number="04 / 04">KONTAK & SOSIAL</SectionLabel>
    <div className="page-heading"><div><p className="eyebrow">INFORMASI KONTAK</p><h1>Hubungi saya<br /><span className="name-gradient">lebih lanjut.</span></h1></div><p className="heading-side">Kalau ingin menyapa, silakan hubungi saya lewat akun berikut.</p></div>
    <div className="contact-layout"><div className="contact-intro glass"><span className="contact-orb">HH<span>.</span></span><p>Senang rasanya bisa berkenalan dengan orang baru. Kamu bisa menghubungi saya lewat Instagram atau WhatsApp.</p><div className="contact-small">SOCIAL LINKS / 2026</div></div>
      <div className="social-list">
        <a className="social-card glass" href="https://www.instagram.com/habibb_tk/" target="_blank" rel="noreferrer"><span className="social-avatar instagram"><Image src="/images/profileinstagram.jpg" alt="Foto profil" fill sizes="52px" /></span><span className="social-text"><small>INSTAGRAM</small><strong>@habibb_tk</strong><span>Kunjungi akun Instagram saya.</span></span><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="social-arrow" /></a>
        <a className="social-card glass" href="https://wa.me/6283869313223" target="_blank" rel="noreferrer"><span className="social-avatar whatsapp"><Image src="/images/profilewhatsapp.jpg" alt="Foto profil" fill sizes="52px" /></span><span className="social-text"><small>WHATSAPP</small><strong>Chat langsung</strong><span>Kirim pesan melalui WhatsApp.</span></span><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="social-arrow" /></a>
        <button className="copy-number glass" onClick={copyWhatsApp}><span>NO. WHATSAPP</span><strong>0838 6931 3223</strong><span className="copy-action"><FontAwesomeIcon icon={copied ? faCheck : faArrowRight} /> {copied ? "Nomor disalin" : "Salin nomor"}</span></button>
      </div>
    </div>
  </div>;
}