"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight, faArrowUpRightFromSquare, faBars, faBriefcase, faCheck, faChevronRight, faDumbbell, faGamepad, faGraduationCap, faHouse, faMessage, faMoon, faSun, faXmark } from "@fortawesome/free-solid-svg-icons";

type Page = "Beranda" | "Biodata" | "Hobi" | "Kontak";

const navItems: { label: Page; icon: typeof faHouse }[] = [
  { label: "Beranda", icon: faHouse }, { label: "Biodata", icon: faGraduationCap },
  { label: "Hobi", icon: faGamepad }, { label: "Kontak", icon: faMessage }
];

export default function Portfolio() {
  const [page, setPage] = useState<Page>("Beranda");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("habib-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  useEffect(() => { localStorage.setItem("habib-theme", theme); }, [theme]);
  useEffect(() => {
    const timer = window.setTimeout(() => setIntroVisible(false), 2850);
    return () => window.clearTimeout(timer);
  }, []);

  const navigate = (next: Page) => { setPage(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const copyWhatsApp = async () => {
    try { await navigator.clipboard.writeText("083869313223"); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <main className={`site ${theme}`}>
      <AnimatePresence>
        {introVisible && <motion.div className="intro-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(12px)", transition: { duration: .55 } }}>
          <div className="intro-grid" />
          <div className="intro-content">
            <span className="intro-kicker">HABIB HASIBUAN · PORTOFOLIO</span>
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
      <p className="hero-description">Saya menyukai olahraga dan permainan digital, serta bercita-cita menjadi pengusaha. Melalui situs ini, saya ingin berbagi sedikit tentang diri, minat, dan perjalanan saya.</p>
      <div className="hero-buttons"><button className="button-primary" onClick={() => navigate("Biodata")}>Kenali saya lebih dekat <FontAwesomeIcon icon={faArrowRight} /></button><button className="button-quiet" onClick={() => navigate("Hobi")}>Lihat minat saya <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></button></div>
      <div className="hero-meta"><span>INDONESIA</span><span className="meta-line" /><span>PORTOFOLIO PRIBADI · 2026</span></div>
    </div>
    <div className="hero-visual">
      <div className="orbit orbit-a" /><div className="orbit orbit-b" />
      <div className="portrait-card glass"><div className="portrait-top"><span>HH / PROFILE</span><span>01—04</span></div><div className="portrait-frame"><Image src="/images/habib1.jpg" alt="Foto Habib Hasibuan" fill priority sizes="(max-width: 800px) 80vw, 36vw" className="portrait-image" /></div><div className="portrait-caption"><div><strong>Habib Hasibuan</strong><span>Pelajar · Calon pengusaha</span></div><span className="portrait-index">HH.</span></div></div>
      <div className="floating-note glass"><span className="note-icon"><FontAwesomeIcon icon={faBriefcase} /></span><div><small>CITA-CITA</small><strong>Menjadi pengusaha.</strong></div><span className="blue-spark">✳</span></div>
      <div className="vertical-note">PORTOFOLIO PRIBADI — EST. 2010</div>
    </div>
    <button className="scroll-cue" onClick={() => navigate("Biodata")}><span className="scroll-icon"><FontAwesomeIcon icon={faArrowDown} /></span>GULIR UNTUK MENGENAL SAYA</button>
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
    <div className="page-heading"><div><p className="eyebrow">CERITA SINGKAT SAYA</p><h1>Kenalan<br /><span className="name-gradient">lebih dekat.</span></h1></div><p className="heading-side">Berikut beberapa informasi dasar untuk mengenal saya lebih dekat.</p></div>
    <div className="bio-grid">
      <div className="bio-photo glass"><Image src="/images/habib2.jpg" alt="Potret Habib Hasibuan" fill sizes="(max-width: 800px) 90vw, 34vw" className="cover-image" /><span className="photo-tag">HABIB HASIBUAN / 001</span></div>
      <div className="bio-details glass"><div className="card-kicker">01 — INFORMASI PRIBADI</div>{facts.map(([label, value], i) => <div className="fact-row" key={label}><span className="fact-index">0{i + 1}</span><span className="fact-label">{label}</span><strong>{value}</strong></div>)}<p className="bio-note">Saya ingin terus belajar, menambah pengalaman, dan mempersiapkan diri untuk membangun usaha sendiri di masa depan.</p></div>
    </div>
    <div className="school-section"><div className="subheading"><span>02 / RIWAYAT SEKOLAH</span><h2>Perjalanan pendidikan.</h2></div><div className="school-list">
      {[["01","SD","DAHLIA"],["02","SMP","AL WASHLIYAH"],["03","SMK","S TELADAN P SIANTAR"]].map(([n,level,name]) => <div className="school-row" key={n}><span className="school-no">{n}</span><span className="school-level">{level}</span><strong>{name}</strong><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></div>)}
    </div></div>
  </div>;
}

function HobbyPage() {
  const hobbies = [
    { n:"01", title:"Olahraga", tag:"AKTIF & BERGERAK", image:"/images/olahraga.jpg", icon:faDumbbell, description:"Saya menyukai olahraga karena membuat tubuh tetap aktif sekaligus memberi kesempatan untuk melatih disiplin. Saya juga menikmati prosesnya: kemajuan tidak selalu terlihat dalam sehari, tetapi kebiasaan yang dilakukan secara konsisten dapat membawa hasil." },
    { n:"02", title:"Game", tag:"MAIN & STRATEGI", image:"/images/game.jpg", icon:faGamepad, description:"Saya menikmati permainan digital karena dapat menjadi hiburan setelah menjalani kegiatan sehari-hari. Beberapa permainan juga menantang saya untuk menyusun strategi, mengambil keputusan, dan mencoba pendekatan lain ketika belum berhasil." }
  ];
  return <div className="inner-page">
    <SectionLabel number="03 / 04">HAL YANG SAYA SUKAI</SectionLabel>
    <div className="page-heading"><div><p className="eyebrow">KEGIATAN DI WAKTU LUANG</p><h1>Waktu luang,<br /><span className="name-gradient">hal yang saya sukai.</span></h1></div><p className="heading-side">Dua kegiatan yang saya nikmati karena memberi keseimbangan dalam keseharian.</p></div>
    <div className="hobby-grid">{hobbies.map(h => <article className="hobby-card glass" key={h.n}><div className="hobby-image"><Image src={h.image} alt={h.title} fill sizes="(max-width: 800px) 90vw, 40vw" className="cover-image" /><span className="hobby-number">{h.n}</span><span className="hobby-icon"><FontAwesomeIcon icon={h.icon} /></span></div><div className="hobby-body"><div className="card-kicker">{h.tag}</div><h2>{h.title}</h2><p>{h.description}</p><div className="hobby-footer"><span>ALASAN SAYA MENYUKAINYA</span><span className="hobby-line" /><FontAwesomeIcon icon={faArrowRight} /></div></div></article>)}</div>
    <div className="hobby-outro glass"><span className="outro-star">✳</span><p>Bagi saya, olahraga dan permainan digital memiliki kesenangan yang berbeda. Olahraga membantu menjaga kebugaran, sedangkan permainan memberi ruang untuk beristirahat dan berpikir strategis. Keduanya terasa lebih baik ketika dijalani secara seimbang.</p></div>
  </div>;
}

function ContactPage({ copyWhatsApp, copied }: { copyWhatsApp: () => void; copied: boolean }) {
  return <div className="inner-page">
    <SectionLabel number="04 / 04">KONTAK & SOSIAL</SectionLabel>
    <div className="page-heading"><div><p className="eyebrow">INFORMASI KONTAK</p><h1>Mari terhubung<br /><span className="name-gradient">lebih lanjut.</span></h1></div><p className="heading-side">Anda dapat menghubungi saya melalui akun media sosial berikut.</p></div>
    <div className="contact-layout"><div className="contact-intro glass"><span className="contact-orb">HH<span>.</span></span><p>Saya terbuka untuk berkenalan dan bertukar informasi. Silakan pilih saluran komunikasi yang paling nyaman.</p><div className="contact-small">SOCIAL LINKS / 2026</div></div>
      <div className="social-list">
        <a className="social-card glass" href="https://www.instagram.com/habibb_tk/" target="_blank" rel="noreferrer"><span className="social-avatar instagram"><Image src="/images/profileinstagram.jpg" alt="Foto profil Instagram Habib" fill sizes="52px" /></span><span className="social-text"><small>INSTAGRAM</small><strong>@habibb_tk</strong><span>Lihat pembaruan melalui akun Instagram saya.</span></span><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="social-arrow" /></a>
        <a className="social-card glass" href="https://wa.me/6283869313223" target="_blank" rel="noreferrer"><span className="social-avatar whatsapp"><Image src="/images/profilewhatsapp.jpg" alt="Foto profil WhatsApp Habib" fill sizes="52px" /></span><span className="social-text"><small>WHATSAPP</small><strong>Chat langsung</strong><span>Hubungi saya melalui WhatsApp.</span></span><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="social-arrow" /></a>
        <button className="copy-number glass" onClick={copyWhatsApp}><span>NO. WHATSAPP</span><strong>0838 6931 3223</strong><span className="copy-action"><FontAwesomeIcon icon={copied ? faCheck : faArrowRight} /> {copied ? "Nomor disalin" : "Salin nomor"}</span></button>
      </div>
    </div>
  </div>;
}