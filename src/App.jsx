import { useState, useRef, useEffect, useCallback, memo } from "react";
// ── CÓDIGO FUENTE EMBEBIDO (para exportar JSX publicable) ─────────
const __SOURCE_CODE__ = `import { useState, useRef, useEffect, useCallback, memo } from "reac// ── CONSTANTES ─────────────────────────────────────────────────────────
const AIRPORTS = [{ id: "aep", code: "AEP", name: "Aeroparque Jorge Newbery" }, { id: "eze", const LIC_ESTADOS = [{ id: "visitar", label: "A Visitar", color: "#F59E0B", bg: "#FFFBEB" }, const OBRA_ESTADOS = [{ id: "pendiente", label: "Pendiente", color: "#94A3B8", bg: "#F8FAFC" const ROLES = ["Jefe de Obra", "Capataz", "Técnico", "Proveedor", "Contratista", "Administratconst DOC_TYPES = [{ id: "art", label: "ART", acceptsExp: true }, { id: "antec", label: "Anteconst LIC_DOC_TYPES = [{ id: "planos", label: "Planos", accept: ".pdf,.png,.jpg,.dwg,.zip" },const EMAIL_IA = "ia.belfastcm@gmail.com";
const ADMIN_CREDS = [{ user: "admin", pass: "belfast2025", rol: "Administrador" }, { user: "s// ── TEMA ───────────────────────────────────────────────────────────────
const THEME_PRESETS = [
 { id: "azul", label: "Azul", accent: "#1D4ED8", al: "#EFF6FF", bg: "#F1F5F9", card: "#fff { id: "oscuro", label: "Oscuro", accent: "#60A5FA", al: "#172554", bg: "#0F172A", card: " { id: "verde", label: "Verde", accent: "#16A34A", al: "#DCFCE7", bg: "#F0FDF4", card: "#f { id: "violeta", label: "Violeta", accent: "#7C3AED", al: "#F5F3FF", bg: "#FAF5FF", card: { id: "rojo", label: "Rojo", accent: "#DC2626", al: "#FEF2F2", bg: "#FFF5F5", card: "#fff { id: "naranja", label: "Naranja", accent: "#EA580C", al: "#FFF7ED", bg: "#FFFBF5", card: { id: "minimal", label: "Mínimal", accent: "#111111", al: "#F5F5F5", bg: "#FAFAFA", card: { id: "cyan", label: "Cyan", accent: "#0891B2", al: "#ECFEFF", bg: "#F0FDFF", card: "#fff { id: "rosa", label: "Rosa", accent: "#DB2777", al: "#FDF2F8", bg: "#FDF4FF", card: "#fff];
const FONTS = [
 { id: "jakarta", label: "Jakarta", value: "'Plus Jakarta Sans'" },
 { id: "inter", label: "Inter", value: "'Inter'" },
 { id: "poppins", label: "Poppins", value: "'Poppins'" },
 { id: "roboto", label: "Roboto", value: "'Roboto'" },
 { id: "montserrat", label: "Montserrat", value: "'Montserrat'" },
 { id: "system", label: "Sistema", value: "-apple-system,BlinkMacSystemFont" },
];
const RADIUS_OPTS = [{ id: "sharp", label: "Recto", r: 4 }, { id: "normal", label: "Normal", const COLOR_KEYS = [{ k: "accent", label: "Principal" }, { k: "bg", label: "Fondo" }, { k: "cconst DEFAULT_COLORS = { accent: "#1D4ED8", al: "#EFF6FF", bg: "#F1F5F9", card: "#ffffff", boconst DEFAULT_UBICACIONES = [{ id: "aep", code: "AEP", name: "Aeroparque Jorge Newbery" }, { const DEFAULT_TEXTOS = {
 // Nav
 nav_ia: "IA", nav_inicio: "Inicio", nav_obras: "Obras", nav_personal: "Personal", nav_car // Dashboard
 dash_titulo: "Panel operativo", dash_subtitulo: "BelfastCM × AA2000",
 dash_licitaciones: "Licitaciones", dash_obras_activas: "Obras activas", dash_alertas: "Al dash_obras_curso: "Obras en curso", dash_ver_todas: "Ver todas →", dash_acciones: "Accion dash_nueva_lic: "Nueva licitación", dash_nueva_obra: "Nueva obra", dash_presup_mat: "Pres // Obras
 obras_titulo: "Obras", obras_nueva: "Nueva obra", obras_avance: "Avance", obras_inicio: " obras_sector: "Sector", obras_estado: "Estado", obras_info: "Info", obras_notas: "Notas", obras_obs_placeholder: "Registrar observación...", obras_sin_notas: "Sin notas", obras_si obras_agregar_fotos: "Agregar fotos", obras_agregar_arch: "Agregar archivo", obras_elimin // Licitaciones
 lic_titulo: "Licitaciones", lic_nueva: "Nueva licitación", lic_nombre: "Nombre", lic_mont lic_crear: "Crear licitación", lic_eliminar: "Eliminar",
 // Personal
 pers_titulo: "Personal de Obra", pers_nuevo: "Nuevo trabajador", pers_nombre: "Nombre", p pers_obra: "Obra", pers_whatsapp: "WhatsApp", pers_documentacion: "Documentación", pers_s pers_eliminar: "Eliminar trabajador", pers_agregar: "Agregar",
 // Cargar
 carg_titulo: "Registro de Avance", carg_sub: "Fotos + Informe IA", carg_sel_obra: "Selecc carg_fotos: "Cargá fotos nuevas", carg_tomar: "Tomar foto", carg_galeria: "Galería / PC",
 carg_generar: "Comparar y generar informe", carg_analizando: "Analizando...",
 carg_informe: "Informe generado", carg_nuevo: "+ Nuevo", carg_descargar: " Descargar",
 // Chat / IA
 chat_titulo: "Asistente IA", chat_placeholder: "Escribí o usá el micrófono…",
 chat_hablar: "Hablar", chat_escuchando: "Escuchando…", chat_pausar: "Pausar", chat_voz_au // Más
 mas_titulo: "Más opciones", mas_config: "Configuración", mas_config_sub: "Estética · Logo mas_cerrar_sesion: "Cerrar sesión",
 // Config
 cfg_cuenta: "Cuenta y empresa", cfg_tema: "Tema visual", cfg_tipografia: "Tipografía",
 cfg_forma: "Forma de los elementos", cfg_logos: "Logos y textos", cfg_textos: "Textos de  cfg_guardar: "✓ Guardar y cerrar", cfg_restaurar: "↺ Restaurar tema por defecto",
};
const DEFAULT_CONFIG = { email: EMAIL_IA, empresa: "BelfastCM", cargo: "Gerencia de Obra", te// Helper para obtener texto con fallback al default
function t(cfg, key) { return cfg?.textos?.[key] || DEFAULT_TEXTOS[key] || key; }
function getUbics(cfg) { return (cfg?.ubicaciones?.length ? cfg.ubicaciones : DEFAULT_UBICACIfunction getLabelUbic(cfg) { return cfg?.labelUbicacion || "Aeropuerto"; }
function uid() { return Math.random().toString(36).slice(2, 9); }
function toDataUrl(f) { return new Promise((res, rej) => { const r = new FileReader(); r.onlofunction getBase64(d) { return d.split(',')[1]; }
function getMediaType(d) { const m = d.match(/data:([^;]+);/); return m ? m[1] : 'image/jpeg'async function callAI(msgs, sys, apiKey) {
 try {
 if (typeof window !== 'undefined' && window.claude?.complete) {
 const fullPrompt = sys ? sys + "\\n\\n" + msgs.map(m => {
 const txt = Array.isArray(m.content) ? m.content.filter(b => b.type==='text') return (m.role === 'user' ? 'Usuario: ' : 'Asistente: ') + txt;
 }).join('\\n') : msgs.map(m => {
 const txt = Array.isArray(m.content) ? m.content.filter(b => b.type==='text') return (m.role === 'user' ? 'Usuario: ' : 'Asistente: ') + txt;
 }).join('\\n');
 const result = await window.claude.complete(fullPrompt);
 return result || "Sin respuesta.";
 }
 const headers = { "Content-Type": "application/json", "anthropic-dangerous-direct-bro if (apiKey) headers["x-api-key"] = apiKey;
 else return "⚠ Configurá tu API Key en Más → Configuración para usar la IA.";
 const r = await fetch("https://api.anthropic.com/v1/messages", {
 method: "POST",
 headers,
 body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, syste });
 if (!r.ok) {
 let msg = "Error de conexión.";
 try { const d = await r.json(); msg = d.error?.message || \`Error \${r.status}\`; return msg;
 }
 const d = await r.json();
 if (d.error) return \`Error: \${d.error.message || 'Sin respuesta.'}\`;
 return d.content?.map(b => b.text || "").join("") || "Sin respuesta.";
 } catch (e) {
 return \`Error de conexión: \${e.message || 'Verificá tu API Key en Configuración.'}\ }
} function daysSince(s) { if (!s) return 999; const [d, m, y] = s.split("/"); return Math.ceifunction hexLight(hex) { try { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slicfunction buildThemeCSS(cfg) {
 const c = cfg.colors || DEFAULT_COLORS;
 const fv = FONTS.find(f => f.id === cfg.fontId)?.value || "'Plus Jakarta Sans'";
 const rv = RADIUS_OPTS.find(r => r.id === cfg.radiusId)?.r || 14;
 return \`:root{--bg:\${c.bg};--card:\${c.card};--border:\${c.border};--text:\${c.text};--}
const T = { bg: "var(--bg,#F1F5F9)", card: "var(--card,#fff)", border: "var(--border,#E2E8F0)const css = \`
 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;70 *{box-sizing:border-box;margin:0;padding:0;}
 body{background:var(--bg,#F1F5F9);overscroll-behavior:none;}
 input,textarea,select,button{font-family:var(--font,'Plus Jakarta Sans'),sans-serif;}
 input:focus,textarea:focus,select:focus{outline:none;}textarea{resize:none;}button{cursor:p @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)
 @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
 @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
 @keyframes scanSweep{0%{top:-100%}100%{top:200%}}
\`;
const BelfastLogo = ({ size = 44 }) => (
 <svg width={Math.round(size * 1.12)} height={size} viewBox="0 0 278 212" fill="none" stro <polygon points="8,84 98,84 126,54 36,54" />
 <path d="M8,84 L8,200 L98,200 L98,174 L52,174 L52,132 L98,132 L98,117 L57,117 L57,88  <line x1="98" y1="84" x2="126" y2="54" />
 <rect x="120" y="6" width="150" height="194" />
 <rect x="138" y="22" width="114" height="72" />
 <rect x="179" y="128" width="21" height="72" />
 </svg>
);
const AA2000Symbol = ({ size = 54 }) => (
 <svg width={size} height={Math.round(size * .52)} viewBox="0 0 130 68" fill="none">
 <ellipse cx="48" cy="34" rx="44" ry="20" stroke="#6b7280" strokeWidth="9" fill="none" <polygon points="22,18 22,50 70,34" fill="#6b7280" />
 </svg>
);
function AppBrand({ cfg }) {
 const lb = cfg?.logoBelfast, la = cfg?.logoAA2000;
 return (
 <div style={{ background: "#fff", borderBottom: \`1px solid \${T.border}\`, padding:  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 {lb ? <img src={lb} alt="Belfast" style={{ height: 66, objectFit: "contain" } : <><BelfastLogo size={62} /><div style={{ lineHeight: 1.2 }}><div style= </div>
 <div style={{ width: 1, height: 58, background: T.border, flexShrink: 0 }} />
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 {la ? <img src={la} alt="AA2000" style={{ height: 66, objectFit: "contain" }} : <><AA2000Symbol size={76} /><div style={{ lineHeight: 1.35 }}><div styl </div>
 </div>
 );
}
function Card({ children, style = {}, onClick }) { return <div onClick={onClick} style={{ bacfunction Badge({ color, bg, children, style = {} }) { return <span style={{ display: "inline-function PBtn({ children, onClick, disabled, full, style = {}, variant = "primary" }) {
 const v = { primary: { background: disabled ? "#E2E8F0" : "var(--accent,#1D4ED8)", color: return <button onClick={onClick} disabled={disabled} style={{ ...v[variant], borderRadius}
function Sheet({ title, onClose, children }) { return (<div style={{ position: "fixed", insetfunction Lbl({ children }) { return <div style={{ fontSize: 11, fontWeight: 700, color: T.subfunction TInput({ value, onChange, placeholder, type = "text", extraStyle = {} }) { return <i
function Sel({ value, onChange, children }) { return <select value={value} onChange={onChangefunction FieldRow({ children }) { return <div style={{ display: "grid", gridTemplateColumns: function Field({ label, children }) { return <div style={{ marginBottom: 12 }}><Lbl>{label}</function PlusBtn({ onClick }) { return <button onClick={onClick} style={{ background: "var(--function AppHeader({ title, sub, right, back, onBack }) { return (<div style={{ background: Tfunction LoginModal({ titulo, onSuccess, onClose }) {
 const [u, setU] = useState('');
 const [p, setP] = useState('');
 const [err, setErr] = useState('');
 const [showPass, setShowPass] = useState(false);
 function login() {
 const usuario = u.trim().toLowerCase();
 const contra = p.trim();
 if (!usuario || !contra) { setErr('Completá usuario y contraseña'); return; }
 const f = ADMIN_CREDS.find(c => c.user === usuario && c.pass === contra);
 if (f) { setErr(''); onSuccess(f); } else { setErr('Usuario o contraseña incorrectos' }
 return (<Sheet title={titulo || "Acceso requerido"} onClose={onClose}>
 <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, p <svg width="18" height="18" viewBox="0 0 24 24" fill="#15803D"><path fillRule="ev <span style={{ fontSize: 12, color: "#15803D", fontWeight: 600 }}>Área protegida  </div>
 <Field label="Usuario">
 <input value={u} onChange={e => { setU(e.target.value); setErr(''); }} placeholde autoCapitalize="none" autoCorrect="off" autoComplete="username"
 onKeyDown={e => e.key === 'Enter' && login()}
 style={{ width: "100%", background: T.bg, border: \`1.5px solid \${err ? '#FE </Field>
 <Field label="Contraseña">
 <div style={{ position: "relative" }}>
 <input type={showPass ? "text" : "password"} value={p} onChange={e => { setP( placeholder="••••••••" autoComplete="current-password"
 onKeyDown={e => e.key === 'Enter' && login()}
 style={{ width: "100%", background: T.bg, border: \`1.5px solid \${err ?  <button onClick={() => setShowPass(v => !v)} type="button"
 style={{ position: "absolute", right: 10, top: "50%", transform: "transla {showPass
 ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d }
 </button>
 </div>
 </Field>
 {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadiu <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="ev {err}
 </div>}
 <PBtn full onClick={login}>Ingresar</PBtn>
 <div style={{ marginTop: 14, background: T.bg, borderRadius: 10, padding: "10px 12px" <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppe <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
 {ADMIN_CREDS.map(c => (<div key={c.user} style={{ background: T.card, border: <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent,#1D4ED8 <div style={{ fontSize: 10, color: T.sub, marginTop: 2 }}>Usuario: <stron <div style={{ fontSize: 10, color: T.sub }}>Clave: <strong>{c.pass}</stro </div>))}
 </div>
 </div>
 </Sheet>);
}
const NAV_DEFS = [
 { id: "chat", tk: "nav_ia", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="c { id: "dashboard", tk: "nav_inicio", icon: <svg width="22" height="22" viewBox="0 0 24 24 { id: "obras", tk: "nav_obras", icon: <svg width="22" height="22" viewBox="0 0 24 24" fil { id: "personal", tk: "nav_personal", icon: <svg width="22" height="22" viewBox="0 0 24 2 { id: "cargar", tk: "nav_cargar", icon: <svg width="22" height="22" viewBox="0 0 24 24" f { id: "mas", tk: "nav_mas", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="c];
function BottomNav({ view, setView, alerts, cfg }) {
 return (<nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(- {NAV_DEFS.map(n => {
 const active = view === n.id; const badge = n.id === "dashboard" && alerts.filter <button key={n.id} onClick={() => setView(n.id)} style={{ flex: 1, display: " {n.id === "cargar" ? <div style={{ width: 46, height: 46, borderRadius: " <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: n.id = {badge && <div style={{ position: "absolute", top: 4, right: "calc(50% -  </button>
 );
 })}
 </nav>);
}
function Dashboard({ lics, obras, personal, alerts, setView, setDetailObraId, requireAuth, cf const UBICS = getUbics(cfg);
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <div style={{ background: T.navy, padding: "16px 18px 20px" }}>
 <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 3 }}>{t( <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{t(cfg, 'dash_titul <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>{new D <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, ma {[{ l: t(cfg, 'dash_licitaciones'), v: lics.filter(l => !["adjudicada", "desc <div key={k.l} style={{ background: "rgba(255,255,255,.08)", borderRadius
 <div style={{ fontSize: 22, fontWeight: 800, color: k.c }}>{k.v}</div <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", marginTop:  </div>
 ))}
 </div>
 </div>
 <div style={{ padding: "14px 18px" }}>
 {alerts.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ fontSize: 1 <div style={{ marginBottom: 16 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: " <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: <button onClick={() => setView("obras")} style={{ fontSize: 12, color: T. </div>
 {obras.filter(o => o.estado === "curso").map(o => (<Card key={o.id} onClick={ <div style={{ display: "flex", justifyContent: "space-between", marginBot <div style={{ height: 4, background: T.bg, borderRadius: 4, marginBottom: <div style={{ fontSize: 11, color: T.muted }}>{UBICS.find(a => a.id === o </Card>))}
 </div>
 <div>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 8, t <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 {[{ label: t(cfg, 'dash_nueva_lic'), view: "licitaciones", lock: true, ic <button key={a.label} onClick={() => a.lock ? requireAuth(() => setVi <div style={{ fontSize: 16, marginBottom: 4 }}>{a.icon}</div>
 <div style={{ fontSize: 12, fontWeight: 600, color: T.text, lineH {a.lock && <div style={{ position: "absolute", top: 8, right: 8,  </button>
 ))}
 </div>
 </div>
 </div>
 </div>);
}
function formatMonto(val) {
 // Quitar todo excepto dígitos
 const nums = val.replace(/[^\\d]/g, '');
 if (!nums) return '';
 // Formatear con puntos cada 3 dígitos y $ al final
 return nums.replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.') + ' $';
}
function parseMonto(val) { return val.replace(/[^\\d]/g, ''); }
function MontoInput({ value, onChange, placeholder }) {
 const [display, setDisplay] = useState(value ? formatMonto(parseMonto(value)) : value ||  useEffect(() => { setDisplay(value ? formatMonto(parseMonto(value)) : value || ''); }, [v
 function handleChange(e) {
 const raw = parseMonto(e.target.value);
 const fmt = raw ? formatMonto(raw) : '';
 setDisplay(fmt);
 onChange(fmt);
 }
 return <input value={display} onChange={handleChange} placeholder={placeholder || '0 $'} }
function DocGrid({ docs, onUpload, onRemove, refs, prefix }) {
 return (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{LIC_DOC const doc = docs?.[d.id]; const rk = \`\${prefix}_\${d.id}\`; return (<div key={d.id} {doc ? (<div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borde ) : (<button onClick={() => refs.current[rk]?.click()} style={{ width: "100%", ba })}</div>);
}
function Licitaciones({ lics, setLics, requireAuth, cfg, obras, setObras }) {
 const UBICS = getUbics(cfg);
 const [ap, setAp] = useState("todos"); const [showNew, setShowNew] = useState(false); con const [form, setForm] = useState({ nombre: "", ap: "aep", estado: "visitar", monto: "", f const docRefs = useRef({}); const newDocRefs = useRef({});
 const filtered = lics.filter(l => ap === "todos" || l.ap === ap);
 // Crea una obra en curso automáticamente cuando una licitación pasa a adjudicada
 function autoCrearObra(lic) {
 const yaExiste = obras.some(o => o.lic_id === lic.id);
 if (yaExiste) return;
 const nuevaObra = {
 id: uid(),
 lic_id: lic.id,
 nombre: lic.nombre,
 ap: lic.ap,
 sector: lic.sector || "",
 estado: "curso",
 avance: 0,
 inicio: new Date().toLocaleDateString("es-AR"),
 cierre: "",
 obs: [{ id: uid(), txt: \`Obra creada automáticamente al adjudicar la licitación. fotos: [],
 archivos: [],
 informes: [],
 docs: {},
 };
 setObras(p => [...p, nuevaObra]);
 }
 function cambiarEstado(licId, nuevoEstado) {
 setLics(p => p.map(l => {
 if (l.id !== licId) return l;
 if ((nuevoEstado === "adjudicada" || nuevoEstado === "curso") && l.estado !== nue return { ...l, estado: nuevoEstado };
 }));
 }
 function add() { if (!form.nombre.trim()) return; setLics(p => [...p, { ...form, id: uid( function del(id) { setLics(p => p.filter(l => l.id !== id)); setShowDetail(null); }
 async function handleDoc(licId, did, file) { const url = await toDataUrl(file); setLics(p async function handleNewDoc(did, file) { const url = await toDataUrl(file); setForm(f =>  const detail = showDetail ? lics.find(l => l.id === showDetail) : null;
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title="Licitaciones" sub={\`\${filtered.length} registros\`} right={<PlusB <div style={{ padding: "10px 18px", display: "flex", gap: 6, overflowX: "auto" }}>{[{ <div style={{ padding: "0 18px" }}>
 {LIC_ESTADOS.map(est => { const items = filtered.filter(l => l.estado === est.id) </div>
 {showNew && (<Sheet title="Nueva licitación" onClose={() => setShowNew(false)}><Field {detail && (<Sheet title={detail.nombre} onClose={() => setShowDetail(null)}>
 <Field label="Nombre">
 <TInput value={detail.nombre} onChange={e => setLics(p => p.map(l => l.id === </Field>
 <FieldRow>
 <Field label="Aeropuerto">
 <Sel value={detail.ap} onChange={e => setLics(p => p.map(l => l.id === de {AIRPORTS.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name </Sel>
 </Field>
 <Field label="Monto">
 <MontoInput value={detail.monto || ''} onChange={v => setLics(p => p.map( </Field>
 </FieldRow>
 <FieldRow>
 <Field label="Sector">
 <TInput value={detail.sector || ''} onChange={e => setLics(p => p.map(l = </Field>
 <Field label="Fecha">
 <TInput value={detail.fecha || ''} onChange={e => setLics(p => p.map(l => </Field>
 </FieldRow>
 <div style={{ marginBottom: 16 }}><Lbl>Documentos</Lbl><DocGrid docs={detail.docs <Field label="Estado">
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
 {LIC_ESTADOS.map(e => (<button key={e.id} onClick={() => cambiarEstado(de </div>
 </Field>
 {(detail.estado === "adjudicada" || detail.estado === "curso") && (() => { const  <div style={{ background: "#ECFDF5", border: "1px solid #86EFAC", borderRadiu <svg width="14" height="14" viewBox="0 0 24 24" fill="#10B981"><path fill <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, col </div>
 ) : (
 <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadiu <div style={{ fontSize: 12, color: "#92400E", fontWeight: 600 }}>⚠ Sin ob <button onClick={() => autoCrearObra(detail)} style={{ background: "#F59E </div>
 ); })()}
 <PBtn full variant="danger" onClick={() => del(detail.id)}>Eliminar</PBtn>
 </Sheet>)}
 </div>);
}
function TabFotos({ detail, upd, fileRef, handleFoto, apiKey, cfg }) {
 const [loadingIA, setLoadingIA] = useState(false);
 const [informe, setInforme] = useState('');
 const [selFotos, setSelFotos] = useState([]);// ids de fotos seleccionadas para analizar
 const [modoSel, setModoSel] = useState(false);
 const fotos = detail.fotos || [];
 function toggleSel(id) { setSelFotos(p => p.includes(id) ? p.filter(x => x !== id) : [... async function analizarFotos() {
 if (!apiKey) { setInforme('⚠ Configurá tu API Key en Más → Configuración para usar es const fotosAAnalizar = selFotos.length > 0 ? fotos.filter(f => selFotos.includes(f.id if (!fotosAAnalizar.length) { setInforme('Agregá al menos una foto para analizar.');  setLoadingIA(true); setInforme('');
 try {
 const content = [];
 fotosAAnalizar.forEach(f => {
 try { content.push({ type: 'image', source: { type: 'base64', media_type: get });
 content.push({
 type: 'text', text: \`Analizá estas \${fotosAAnalizar.length} fotos de la obrGenerá un informe profesional AA2000 con:
1. **Estado general de la obra** — describí lo que se ve en las fotos
2. **Avance estimado** — ¿coincide con el \${detail.avance}% declarado?
3. **Trabajos en ejecución** — qué trabajos se observan
4. **Correcciones y recomendaciones** — anomalías, riesgos, trabajos incorrectos o mejorables
5. **Alertas de seguridad** — EPP, orden, señalización
6. **Conclusión** — estado global y próximos pasos sugeridos
Usá un tono técnico y profesional. Respondé en español rioplatense.\`});
 const r = await callAI([{ role: 'user', content }],
 \`Sos un inspector de obras aeroportuarias para AA2000. Analizás fotos y gene apiKey);
 setInforme(r);
 // Guardar el informe generado dentro de la obra
 const nuevoInf = { id: uid(), titulo: \`Análisis IA — \${new Date().toLocaleDateS upd(detail.id, { informes: [nuevoInf, ...(detail.informes || [])] });
 } catch (e) { setInforme('Error al analizar: ' + e.message); }
 setLoadingIA(false); setModoSel(false); setSelFotos([]);
 }
 return (<div>
 <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFoto} styl {/* Barra de acciones */}
 <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
 <PBtn onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: "11px 0 {fotos.length > 0 && <button onClick={() => { setModoSel(v => !v); setSelFotos([] {modoSel ? "Cancelar" : "Seleccionar"}
 </button>}
 </div>
 {/* Botón analizar */}
 {fotos.length > 0 && (<button onClick={analizarFotos} disabled={loadingIA} style={{ w {loadingIA
 ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255, : <><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path fillRu </button>)}
 {modoSel && <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginBo {/* Grilla de fotos */}
 {fotos.length === 0
 ? <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBo {fotos.map(f => {
 const sel = selFotos.includes(f.id); return (<div key={f.id} onClick={()  {sel && <div style={{ position: "absolute", top: 5, right: 5, width:  <img src={f.url} alt="" style={{ width: "100%", aspectRatio: "4/3", o <div style={{ padding: "5px 8px", fontSize: 9, color: T.muted, backgr <button onClick={e => { e.stopPropagation(); upd(detail.id, { fotos:  </div>);
 })}
 </div>}
 {/* Informe generado */}
 {informe && (<Card style={{ padding: "14px" }}>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-betwe <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{  <div style={{ display: "flex", gap: 6 }}>
 <button onClick={() => { try { navigator.clipboard.writeText(informe); }  <button onClick={() => { const b = new Blob([informe], { type: 'text/plai <button onClick={() => setInforme('')} style={{ background: "#FEF2F2", bo </div>
 </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "12px 14px", fontSi <div style={{ fontSize: 10, color: "#10B981", marginTop: 8, fontWeight: 600 }}>✓  </Card>)}
 </div>);
}
function TabInformes({ detail, upd }) {
 const [subTab, setSubTab] = useState("diario");
 const [showNew, setShowNew] = useState(false);
 const [form, setForm] = useState({ titulo: '', tipo: 'diario', fecha: '', notas: '' });
 const fileRef = useRef(null);
 const informes = detail.informes || [];
 const TIPOS_INF = [
 { id: 'diario', label: 'Diario', color: '#3B82F6', bg: '#EFF6FF' },
 { id: 'semanal', label: 'Semanal', color: '#7C3AED', bg: '#F5F3FF' },
 { id: 'ingeniero', label: 'Ingeniero', color: '#10B981', bg: '#ECFDF5' },
 ];
 async function handleFile(e) {
 const files = Array.from(e.target.files);
 const nuevos = [];
 for (const f of files) {
 const url = await toDataUrl(f);
 nuevos.push({
 id: uid(),
 titulo: form.titulo || f.name.replace(/\\.[^.]+$/, ''),
 tipo: form.tipo || subTab,
 fecha: form.fecha || new Date().toLocaleDateString('es-AR'),
 notas: form.notas,
 nombre: f.name,
 ext: f.name.split('.').pop().toUpperCase(),
 url,
 size: (f.size / 1024).toFixed(0) + 'KB',
 cargado: new Date().toLocaleDateString('es-AR'),
 });
 }
 upd(detail.id, { informes: [...nuevos, ...informes] });
 setForm({ titulo: '', tipo: 'diario', fecha: '', notas: '' });
 setShowNew(false);
 e.target.value = '';
 }
 const filtered = informes.filter(i => i.tipo === subTab);
 const tp = TIPOS_INF.find(x => x.id === subTab);
 return (<div>
 {/* Sub-tabs */}
 <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
 {TIPOS_INF.map(tipo => (<button key={tipo.id} onClick={() => setSubTab(tipo.id)}  </div>
 {/* Botón subir */}
 <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png" m <button onClick={() => setShowNew(true)} style={{ width: "100%", background: tp?.bg,  <span style={{ fontSize: 18, color: tp?.color }}>+</span>
 <span style={{ fontSize: 13, fontWeight: 700, color: tp?.color }}>Subir informe { </button>
 {/* Lista */}
 {filtered.length === 0
 ? <div style={{ textAlign: "center", padding: "28px 0", color: T.muted, fontSize: : filtered.map(inf => (<div key={inf.id} style={{ display: "flex", alignItems: "c <div style={{ width: 38, height: 38, borderRadius: 9, background: tp?.bg, dis <span style={{ fontSize: 9, fontWeight: 800, color: tp?.color }}>{inf.ext </div>
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: "hi <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{inf.fecha} · {inf.notas && <div style={{ fontSize: 10, color: T.sub, marginTop: 2, ove </div>
 <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
 <a href={inf.url} download={inf.nombre} style={{ textDecoration: "none" } <button style={{ background: T.accentLight, border: \`1px solid \${T. </a>
 <button onClick={() => upd(detail.id, { informes: informes.filter(x => x. </div>
 </div>))}
 {/* Sheet nuevo informe */}
 {showNew && (<Sheet title={\`Subir informe \${tp?.label}\`} onClose={() => setShowNew <Field label="Título (opcional)">
 <TInput value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.ta </Field>
 <FieldRow>
 <Field label="Tipo">
 <Sel value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.targe {TIPOS_INF.map(t => <option key={t.id} value={t.id}>{t.label}</option </Sel>
 </Field>
 <Field label="Fecha">
 <TInput value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e. </Field>
 </FieldRow>
 <Field label="Notas">
 <textarea value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.ta </Field>
 <PBtn full onClick={() => fileRef.current?.click()}> Seleccionar archivo</PBtn>
 <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 8 }}> </Sheet>)}
 </div>);
}
function Obras({ obras, setObras, lics, detailId, setDetailId, requireAuth, cfg, apiKey }) {
 const UBICS = getUbics(cfg); const LUBIC = getLabelUbic(cfg);
 const [showNew, setShowNew] = useState(false); const [tab, setTab] = useState("info");
 const [form, setForm] = useState({ nombre: "", ap: "aep", sector: "", estado: "pendiente" const [newObs, setNewObs] = useState(""); const fileRef = useRef(null); const archRef = u const detail = detailId ? obras.find(o => o.id === detailId) : null;
 function add() { if (!form.nombre.trim()) return; setObras(p => [...p, { ...form, id: uid function upd(id, patch) { setObras(p => p.map(o => o.id === id ? { ...o, ...patch } : o)) async function handleFoto(e) { if (!detail) return; for (const f of Array.from(e.target.f async function handleArch(e) { if (!detail) return; for (const f of Array.from(e.target.f const ec = id => OBRA_ESTADOS.find(e => e.id === id) || OBRA_ESTADOS[0];
 if (detail) {
 const e = ec(detail.estado); return (
 <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title={detail.nombre} sub={\`\${UBICS.find(a => a.id === detail.ap <div style={{ background: T.card, borderBottom: \`1px solid \${T.border}\`, p <div style={{ display: "flex", justifyContent: "space-between", marginBot <div style={{ height: 8, background: T.bg, borderRadius: 4 }}><div style= <div style={{ display: "flex", justifyContent: "space-between", marginTop <input type="range" min="0" max="100" value={detail.avance} onChange={e = </div>
 <div style={{ background: T.card, borderBottom: \`1px solid \${T.border}\`, d <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom {tab === "info" && (<div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10 <div style={{ fontSize: 10, color: T.muted, marginBottom: 5,  <select value={detail.ap} onChange={e => upd(detail.id, { ap:
 {UBICS.map(a => <option key={a.id} value={a.id}>{a.code}  </select>
 </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10 <div style={{ fontSize: 10, color: T.muted, marginBottom: 5,  <input value={detail.sector || ''} onChange={e => upd(detail. </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10 <div style={{ fontSize: 10, color: T.muted, marginBottom: 5,  <input value={detail.inicio || ''} onChange={e => upd(detail. </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10 <div style={{ fontSize: 10, color: T.muted, marginBottom: 5,  <input value={detail.cierre || ''} onChange={e => upd(detail. </div>
 </div>
 <Lbl>{t(cfg, 'obras_estado')}</Lbl>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 <button onClick={() => { setObras(p => p.filter(o => o.id !== detail. </div>)}
 {tab === "obs" && (<div><div style={{ display: "flex", gap: 8, marginBott {tab === "fotos" && (<TabFotos detail={detail} upd={upd} fileRef={fileRef {tab === "archivos" && (<div><input ref={archRef} type="file" accept=".pd {tab === "informes" && <TabInformes detail={detail} upd={upd} />}
 </div>
 </div>
 );
 }
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title={t(cfg, 'obras_titulo')} sub={\`\${obras.length} registros\`} right= <div style={{ padding: "14px 18px" }}>{OBRA_ESTADOS.map(est => { const items = obras. {showNew && (<Sheet title={t(cfg, 'obras_nueva')} onClose={() => setShowNew(false)}>< </div>);
}
function Personal({ personal, setPersonal, obras, cfg }) {
 const [showNew, setShowNew] = useState(false); const [expanded, setExpanded] = useState(n const [form, setForm] = useState({ nombre: "", rol: "Técnico", empresa: "BelfastCM", obra const fileRefs = useRef({}); const fotoRefs = useRef({}); const newFotoRef = useRef(null) function ini(n) { return n.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCa function add() { if (!form.nombre.trim()) return; setPersonal(p => [...p, { ...form, id:  function upd(id, patch) { setPersonal(p => p.map(x => x.id === id ? { ...x, ...patch } :  async function handleDoc(pid, did, file) { const url = await toDataUrl(file); setPersonal function setVence(pid, did, val) { setPersonal(p => p.map(x => x.id === pid ? { ...x, doc const Av = ({ p, size = 38, showCam = false, onClick }) => (<div onClick={onClick} style= return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title={t(cfg, 'pers_titulo')} sub={\`\${personal.length} trabajadores\`} r
 <div style={{ padding: "14px 18px" }}>
 {personal.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", c {personal.map(p => {
 const docsOk = Object.values(p.docs || {}).filter(Boolean).length; const isOp <div onClick={() => setExpanded(isOpen ? null : p.id)} style={{ display:  <Av p={p} size={40} />
 <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, <div style={{ display: "flex", gap: 3, marginRight: 4 }}>{DOC_TYPES.m <span style={{ fontSize: 11, color: T.muted }}>{docsOk}/{DOC_TYPES.le <span style={{ fontSize: 14, color: T.muted, marginLeft: 2 }}>{isOpen </div>
 {isOpen && (<div style={{ padding: "0 14px 14px", borderTop: \`1px solid  <div style={{ display: "flex", gap: 14, marginTop: 14, marginBottom:  <div style={{ flexShrink: 0 }}><input type="file" accept="image/* <div style={{ flex: 1 }}><Lbl>WhatsApp</Lbl><div style={{ display </div>
 <Lbl>Documentación</Lbl>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 {DOC_TYPES.map(d => { const doc = p.docs?.[d.id]; const rk = \`\$ </div>
 <button onClick={() => { setPersonal(prev => prev.filter(x => x.id != </div>)}
 </Card>);
 })}
 </div>
 {showNew && (<Sheet title={t(cfg, 'pers_nuevo')} onClose={() => setShowNew(false)}>
 <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><inp <Field label={t(cfg, 'pers_nombre')}><TInput value={form.nombre} onChange={e => s <FieldRow><Field label={t(cfg, 'pers_rol')}><Sel value={form.rol} onChange={e =>  <Field label={t(cfg, 'pers_whatsapp')}><TInput value={form.telefono} onChange={e  <Field label={t(cfg, 'pers_obra')}><Sel value={form.obra_id} onChange={e => setFo <PBtn full onClick={add} disabled={!form.nombre.trim()}>{t(cfg, 'pers_agregar')}< </Sheet>)}
 </div>);
}
function CargarView({ obras, setObras, cargarState, setCargarState, apiKey }) {
 const { obraId, newFotos, report } = cargarState;
 const [loading, setLoading] = useState(false);
 const camRef = useRef(null); const galRef = useRef(null);
 const setObraId = v => setCargarState(s => ({ ...s, obraId: v, newFotos: [], report: '' } const setNewFotos = fn => setCargarState(s => ({ ...s, newFotos: typeof fn === 'function' const setReport = v => setCargarState(s => ({ ...s, report: v }));
 const obra = obras.find(o => o.id === obraId); const prevFotos = obra?.fotos || [];
 async function handleFotos(e) { for (const f of Array.from(e.target.files)) { const url = async function generateReport() {
 if (!obra || !newFotos.length) return; setLoading(true); setReport('');
 try {
 const content = []; prevFotos.slice(-4).forEach(f => { try { content.push({ type: const pTxt = prevFotos.length > 0 ? \`Las primeras \${Math.min(prevFotos.length,  content.push({ type: 'text', text: \`Generá informe de avance para "\${obra.nombr let reportText = '';
 if (typeof window !== 'undefined' && window.claude?.complete) {
 const imgMsgs = content.filter(b => b.type === 'image');
 const txtMsg = content.find(b => b.type === 'text');
 reportText = await window.claude.complete(txtMsg?.text || 'Analizá estas foto } else {
 if (!apiKey) { setReport('⚠ Configurá tu API Key en Más → Configuración.'); s const headers = { "Content-Type": "application/json", "anthropic-dangerous-di const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POS const d = await r.json(); reportText = d.content?.map(b => b.text || '').join }
 setReport(reportText);
 setObras(p => p.map(o => o.id === obraId ? { ...o, fotos: [...o.fotos, ...newFoto } catch { setReport('Error de conexión.'); } setLoading(false);
 }
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title="Registro de Avance" sub="Fotos + Informe IA" />
 <div style={{ padding: "14px 18px" }}>
 <Card style={{ padding: "16px", marginBottom: 12 }}>
 <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 <Sel value={obraId} onChange={e => setObraId(e.target.value)}><option value=" {obra && <div style={{ marginTop: 10, background: T.accentLight, borderRadius </Card>
 {obra && (<Card style={{ padding: "16px", marginBottom: 12 }}>
 <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin <input ref={camRef} type="file" accept="image/*" capture="environment" mu <input ref={galRef} type="file" accept="image/*" multiple onChange={handl <button onClick={() => camRef.current?.click()} style={{ background: "#11 <svg width="46" height="38" viewBox="0 0 92 76" fill="none"><rect x=" Tomar foto
 </button>
 <button onClick={() => galRef.current?.click()} style={{ background: "#f8 <svg width="46" height="38" viewBox="0 0 92 76" fill="none"><rect x=" Galería / PC
 </button>
 </div>
 {newFotos.length > 0 && <div style={{ display: "grid", gridTemplateColumns: " {prevFotos.length > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, co </Card>)}
 {obra && (<Card style={{ padding: "16px", marginBottom: 12 }}>
 <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 <button onClick={generateReport} disabled={!newFotos.length || loading} style
 {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba </button>
 </Card>)}
 {report && (<Card style={{ padding: "16px" }}><div style={{ display: "flex", just {!obra && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ f </div>
 </div>);
}
function PresupuestoView({ tipo, setView }) {
 const titulo = tipo === 'materiales' ? 'Presupuesto Materiales' : 'Subcontratos';
 const [items, setItems] = useState([]); const [showNew, setShowNew] = useState(false);
 const [form, setForm] = useState({ descripcion: '', proveedor: '', monto: '', obra: '', e const [loaded, setLoaded] = useState(false); const key = \`bcm_presup_\${tipo}\`;
 useEffect(() => { (async () => { try { const r = await window.storage.get(key); if (r?.va useEffect(() => { if (loaded) window.storage.set(key, JSON.stringify(items)).catch(() =>  const ESTADOS = [{ id: 'pendiente', label: 'Pendiente', color: '#F59E0B', bg: '#FFFBEB' } const total = items.reduce((s, i) => { const n = parseFloat((i.monto || '').replace(/[^0- function add() { if (!form.descripcion.trim()) return; setItems(p => [...p, { ...form, id return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title={titulo} back onBack={() => setView('dashboard')} sub={\`\${items.le <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
 <Card style={{ padding: "16px", marginBottom: 14, background: T.navy, color: "#ff {items.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", color </div>
 {showNew && (<Sheet title={\`Nuevo – \${titulo}\`} onClose={() => setShowNew(false)}> </div>);
}
function PanelVigilancia({ setView }) {
 const [camaras, setCamaras] = useState([]); const [showNew, setShowNew] = useState(false) const [form, setForm] = useState({ nombre: '', url: '', sector: '', ap: 'aep', tipo: 'ip' useEffect(() => { (async () => { try { const r = await window.storage.get('bcm_camaras'); useEffect(() => { if (loaded) window.storage.set('bcm_camaras', JSON.stringify(camaras)). function add() { if (!form.nombre || !form.url) return; setCamaras(p => [...p, { ...form, return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title="Panel de Vigilancia" back onBack={() => setView("mas")} sub="Cámara <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
 <div style={{ background: T.navy, borderRadius: 14, padding: "16px", marginBottom <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 1 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}> </div>
 {camaras.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", col </div>
 {showNew && (<Sheet title="Agregar cámara" onClose={() => setShowNew(false)}><Field l </div>);
}
function Presentismo({ personal, setView }) {
 const [registros, setRegistros] = useState({}); const [scanning, setScanning] = useState( useEffect(() => { (async () => { try { const r = await window.storage.get('bcm_presentism useEffect(() => { if (loaded) window.storage.set('bcm_presentismo', JSON.stringify({ regi const today = new Date().toLocaleDateString('es-AR');
 function simulateScan(persona) { if (scanning) return; setScanning(true); setScanResult(n const todayRecords = Object.entries(registros).filter(([k]) => k.endsWith(today)).map(([, const FP = ({ active, ok }) => { const c = active ? 'var(--accent,#1D4ED8)' : ok ? '#10B9 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title="Control de Presentismo" back onBack={() => setView("mas")} sub="Bio <div style={{ padding: "14px 18px" }}>
 <Card style={{ padding: "14px 16px", marginBottom: 12 }}><Lbl>Sistema biométrico  <Card style={{ padding: "20px 16px", marginBottom: 12 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 16,  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}> {scanning && <div style={{ textAlign: "center", marginBottom: 12, fontSize: 1 {scanResult && !scanning && (<div style={{ textAlign: "center", marginBottom: {personal.length === 0 ? <div style={{ textAlign: "center", color: T.muted, f </Card>
 {todayRecords.length > 0 && (<Card style={{ padding: "14px 16px" }}><Lbl>Resumen  </div>
 </div>);
}
// ── INFORMES DEL INGENIERO ─────────────────────────────────────────────
function InformesIngeniero({ setView }) {
 const [informes, setInformes] = useState([]); const [loaded, setLoaded] = useState(false) const [showNew, setShowNew] = useState(false); const [form, setForm] = useState({ titulo: const fileRef = useRef(null); const [uploading, setUploading] = useState(false);
 useEffect(() => { (async () => { try { const r = await window.storage.get('bcm_inf_ing'); useEffect(() => { if (loaded) window.storage.set('bcm_inf_ing', JSON.stringify(informes)) const TIPOS = [{ id: 'visita', label: 'Visita de obra', color: '#3B82F6', bg: '#EFF6FF' } async function handleFile(e) {
 setUploading(true);
 const files = Array.from(e.target.files);
 const nuevos = [];
 for (const f of files) {
 const url = await toDataUrl(f);
 nuevos.push({ id: uid(), titulo: form.titulo || f.name.replace(/\\.[^.]+$/, ''),  }
 setInformes(p => [...nuevos, ...p]);
 setForm({ titulo: '', obra: '', tipo: 'visita', fecha: '', notas: '' });
 setShowNew(false); setUploading(false);
 e.target.value = '';
 }
 const tipoMap = t => TIPOS.find(x => x.id === t) || TIPOS[0];
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title="Informes del Ingeniero" back onBack={() => setView("mas")} sub={\`\ <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
 {informes.length === 0 && <div style={{ textAlign: "center", padding: "48px 0" }} {TIPOS.map(tipo => {
 const items = informes.filter(i => i.tipo === tipo.id);
 if (!items.length) return null;
 return (<div key={tipo.id} style={{ marginBottom: 16 }}>
 <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom {items.map(inf => (<Card key={inf.id} style={{ padding: "13px 14px", marg <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
 <div style={{ width: 42, height: 42, borderRadius: 10, background <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: T.text, o <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{ {inf.notas && <div style={{ fontSize: 11, color: T.sub, margi </div>
 <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
 <a href={inf.url} download={inf.nombre} style={{ textDecorati <button onClick={() => setInformes(p => p.filter(x => x.id != </div>
 </div>
 </Card>))}
 </div>);
 })}
 </div>
 <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png" m {showNew && (<Sheet title="Subir informe" onClose={() => setShowNew(false)}>
 <Field label="Título"><TInput value={form.titulo} onChange={e => setForm(p => ({  <FieldRow>
 <Field label="Obra"><TInput value={form.obra} onChange={e => setForm(p => ({  <Field label="Fecha"><TInput value={form.fecha} onChange={e => setForm(p => ( </FieldRow>
 <Field label="Tipo de informe">
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
 {TIPOS.map(tp => (<button key={tp.id} onClick={() => setForm(p => ({ ...p </div>
 </Field>
 <Field label="Notas"><textarea value={form.notas} onChange={e => setForm(p => ({  <PBtn full onClick={() => fileRef.current?.click()} disabled={uploading}>{uploadi <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 8 }}> </Sheet>)}
 </div>);
}
// ── INFORMES IA ────────────────────────────────────────────────────────
function InformesIA({ obras, personal, lics, alerts, setView, apiKey, cfg }) {
 const [tab, setTab] = useState("generar");
 const [modeloDiario, setModeloDiario] = useState('');
 const [modeloSemanal, setModeloSemanal] = useState('');
 const [informes, setInformes] = useState([]);
 const [loading, setLoading] = useState(null); // 'diario'|'semanal'|null
 const [obraId, setObraId] = useState('');
 const [loaded, setLoaded] = useState(false);
 useEffect(() => {
 (async () => {
 try {
 const r = await window.storage.get('bcm_inf_ia'); if (r?.value) { const d = J } catch { } setLoaded(true);
 })();
 }, []);
 useEffect(() => { if (loaded) window.storage.set('bcm_inf_ia', JSON.stringify({ informes, const obra = obras.find(o => o.id === obraId);
 async function generar(tipo) {
 if (!apiKey) { alert("Configurá tu API Key primero en Más → Configuración"); return;  const modelo = tipo === 'diario' ? modeloDiario : modeloSemanal;
 setLoading(tipo);
 const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric const obraInfo = obra ? \`Obra: \${obra.nombre} | Aeropuerto: \${AIRPORTS.find(a => a const persInfo = personal.length ? \`Personal en obra: \${personal.map(p => \`\${p.no const alertInfo = alerts.length ? \`Alertas activas: \${alerts.map(a => a.msg).join(' const prompt = modelo
 ? \`Completá el siguiente modelo de informe \${tipo} con los datos reales de la o : \`Generá un informe \${tipo === 'diario' ? 'diario' : 'semanal'} de obra profes try {
 const r = await callAI([{ role: "user", content: prompt }], "Sos un ingeniero civ const nuevo = { id: uid(), tipo, titulo: \`Informe \${tipo} — \${new Date().toLoc setInformes(p => [nuevo, ...p]);
 setTab("historial");
 } catch { alert("Error al generar. Verificá la API Key."); }
 setLoading(null);
 }
 function descargar(inf) {
 const b = new Blob([inf.texto], { type: 'text/plain;charset=utf-8' });
 const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download =  }
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title="Informes IA" back onBack={() => setView("mas")} sub="Diarios y sema
 <div style={{ background: T.card, borderBottom: \`1px solid \${T.border}\`, display:  {[["generar", "Generar"], ["modelos", "Modelos"], ["historial", \`Historial (\${i </div>
 <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
 {tab === "generar" && (<div>
 <Card style={{ padding: "14px 16px", marginBottom: 12, background: T.navy, bo <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom:  <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1. </Card>
 <Field label="Obra (opcional)">
 <select value={obraId} onChange={e => setObraId(e.target.value)} style={{ <option value="">— Datos generales —</option>
 {obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
 </select>
 </Field>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margi <button onClick={() => generar('diario')} disabled={!!loading} style={{ b {loading === 'diario' ? <div style={{ width: 24, height: 24, border:  <div><div style={{ fontSize: 14, fontWeight: 700 }}>Informe Diario</d </button>
 <button onClick={() => generar('semanal')} disabled={!!loading} style={{  {loading === 'semanal' ? <div style={{ width: 24, height: 24, border: <div><div style={{ fontSize: 14, fontWeight: 700 }}>Informe Semanal</ </button>
 </div>
 {!apiKey && <div style={{ marginTop: 12, background: "#FEF2F2", border: "1px  </div>)}
 {tab === "modelos" && (<div>
 <div style={{ background: T.accentLight, border: \`1px solid \${T.border}\`,  Cargá tu modelo de informe. La IA lo va a completar con los datos reales  </div>
 <Field label="Modelo de informe DIARIO">
 <textarea
 value={modeloDiario}
 onChange={e => setModeloDiario(e.target.value)}
 placeholder={"INFORME DIARIO DE OBRA\\nFecha: [FECHA]\\nObra: [OBRA]\ rows={10}
 style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T. />
 </Field>
 <Field label="Modelo de informe SEMANAL">
 <textarea
 value={modeloSemanal}
 onChange={e => setModeloSemanal(e.target.value)}
 placeholder={"INFORME SEMANAL DE OBRA\\nSemana: [FECHA]\\nObra: [OBRA
 rows={12}
 style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T. />
 </Field>
 <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
 <button onClick={() => setModeloDiario('')} style={{ flex: 1, background: <button onClick={() => setModeloSemanal('')} style={{ flex: 1, background </div>
 <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600, textAlign: "ce </div>)}
 {tab === "historial" && (<div>
 {informes.length === 0 && <div style={{ textAlign: "center", padding: "48px 0 {informes.map(inf => (<Card key={inf.id} style={{ padding: "14px", marginBott <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginB <div style={{ width: 40, height: 40, borderRadius: 10, background: in <span style={{ fontSize: 9, fontWeight: 800, color: inf.tipo ===  </div>
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{in <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{inf. </div>
 <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
 <button onClick={() => descargar(inf)} style={{ background: T.acc <button onClick={() => { try { navigator.clipboard.writeText(inf. <button onClick={() => setInformes(p => p.filter(x => x.id !== in </div>
 </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" </Card>))}
 </div>)}
 </div>
 </div>);
}
const CfgSection = memo(({ id, title, icon, children, openSec, setOpenSec }) => {
 const open = openSec === id;
 return (<div style={{ border: \`1px solid \${T.border}\`, borderRadius: T.rsm, marginBott <div onClick={() => setOpenSec(open ? null : id)} style={{ display: "flex", alignItem <span style={{ fontSize: 20 }}>{icon}</span>
 <span style={{ fontSize: 13, fontWeight: 700, color: open ? T.accent : T.text, fl <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{open ? "▲" : "▼" </div>
 {open && <div style={{ padding: "12px 14px", borderTop: \`1px solid \${T.border}\`, b </div>);
});
function Mas({ setView, authed, setAuthed, requireAuth, cfg, setCfg, apiKey, setApiKey, cfgLo const [showConfig, setShowConfig] = useState(false);
 const [openSec, setOpenSec] = useState("cuenta");
 const [localCfg, setLocalCfg] = useState({ ...DEFAULT_CONFIG, ...cfg });
 const [localKey, setLocalKey] = useState(apiKey || '');
 const [showKey, setShowKey] = useState(false);
 const [hasUnsaved, setHasUnsaved] = useState(false);
 const [confirmClose, setConfirmClose] = useState(false);
 const [showLockConfirm, setShowLockConfirm] = useState(false);
 const [showUnlockModal, setShowUnlockModal] = useState(false);
 const [unlockUser, setUnlockUser] = useState('');
 const [unlockPass, setUnlockPass] = useState('');
 const [unlockErr, setUnlockErr] = useState('');
 const logoRef1 = useRef(null); const logoRef2 = useRef(null); const logoRef3 = useRef(nul function handleLock() { setCfgLocked(true); setShowLockConfirm(false); setShowConfig(fals function tryUnlock() {
 const f = ADMIN_CREDS.find(c => c.user === unlockUser.trim().toLowerCase() && c.pass  if (f) { setCfgLocked(false); setShowUnlockModal(false); setUnlockUser(''); setUnlock else { setUnlockErr('Usuario o contraseña incorrectos'); }
 }
 useEffect(() => { if (!showConfig) { setLocalCfg({ ...DEFAULT_CONFIG, ...cfg }); setHasUn // Detectar cambios pendientes comparando localCfg con cfg
 useEffect(() => {
 if (!showConfig) return;
 const a = JSON.stringify({ ...localCfg, logoBelfast: undefined, logoAA2000: undefined const b = JSON.stringify({ ...cfg, logoBelfast: undefined, logoAA2000: undefined, log setHasUnsaved(a !== b);
 }, [localCfg, cfg, showConfig]);
 const updateText = useCallback((patch) => { setLocalCfg(p => ({ ...p, ...patch })); }, [] const applyVisual = useCallback((patch) => { setCfg(p => ({ ...p, ...patch })); setLocalC const applyThemePreset = useCallback((preset) => { applyVisual({ themeId: preset.id, colo const applyColorKey = useCallback((key, value) => { const nc = { ...(cfg.colors || DEFAUL const guardarYCerrar = useCallback(() => {
 setCfg(p => ({ ...p, ...localCfg }));
 setApiKey(localKey);
 window.storage.set('bcm_apikey', localKey).catch(() => { });
 setHasUnsaved(false); setConfirmClose(false); setShowConfig(false);
 }, [localCfg, localKey, setCfg, setApiKey]);
 const handleSetOpenSec = useCallback((v) => setOpenSec(v), []);
 async function exportarJSX() {
 try {
 let src = __SOURCE_CODE__;
 // Sanitizar datos: quitar fotos/archivos pesados de obras y personal para el exp const licsClean = JSON.parse(JSON.stringify(lics)).map(l => ({ ...l, docs: {} })) const obrasClean = JSON.parse(JSON.stringify(obras)).map(o => ({
 ...o,
 fotos: [], // fotos son base64 pesados — se omiten
 archivos: [], // igual
 docs: {},
 }));
 const personalClean = JSON.parse(JSON.stringify(personal)).map(p => ({
 ...p,
 foto: '', // foto de perfil base64 — se omite
 docs: {},
 }));
 const alertsClean = JSON.parse(JSON.stringify(alerts));
 // Config limpia (sin logos — son base64 muy pesados)
 const { logoBelfast, logoAA2000, logoAsistente, logoCentral, ...cfgClean } = cfg;
 const licsStr = JSON.stringify(licsClean);
 const obrasStr = JSON.stringify(obrasClean);
 const personalStr = JSON.stringify(personalClean);
 const alertsStr = JSON.stringify(alertsClean);
 const cfgStr = JSON.stringify(cfgClean);
 // Reemplazar las constantes DEMO_ con los datos reales
 let out = src;
 out = out.replace(/const DEMO_LICS = \\[[\\s\\S]*?\\];/, \`const DEMO_LICS = \${l out = out.replace(/const DEMO_OBRAS = \\[[\\s\\S]*?\\];/, \`const DEMO_OBRAS = \$ out = out.replace(/const DEMO_PERSONAL = \\[[\\s\\S]*?\\];/, \`const DEMO_PERSONA out = out.replace(/const DEMO_ALERTS = \\[[\\s\\S]*?\\];/, \`const DEMO_ALERTS =  // Reemplazar DEFAULT_CONFIG con la config actual (solo la parte sin logos)
 out = out.replace(
 /const DEFAULT_CONFIG = \\{[^;]+\\};/,
 \`const DEFAULT_CONFIG = \${cfgStr};\`
 );
 const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
 const a = document.createElement('a');
 a.href = URL.createObjectURL(blob);
 a.download = \`belfast_cm_publicado_\${new Date().toLocaleDateString('es-AR').rep a.click();
 URL.revokeObjectURL(a.href);
 } catch (e) {
 alert('Error al exportar: ' + e.message);
 }
 }
 function tryClose() {
 if (hasUnsaved) { setConfirmClose(true); }
 else { setShowConfig(false); }
 }
 const MAS_ITEMS = [
 { id: "vigilancia", label: "Panel Vigilancia", sub: "Cámaras IP en vivo", icon: <svg  { id: "presentismo", label: "Presentismo", sub: "Control biométrico", icon: <svg widt { id: "licitaciones", label: "Licitaciones", sub: "Gestión y seguimiento", icon: <svg { id: "resumen", label: "Resumen ejecutivo", sub: "Indicadores y avances", icon: <svg { id: "mensajes", label: "Mensajes internos", sub: "Comunicaciones del equipo", icon: { id: "archivos", label: "Archivos", sub: "PDFs, planos, Excel", icon: <svg width="20 { id: "seguimiento", label: "Seguimiento", sub: "Alertas y pendientes", icon: <svg wi { id: "contactos", label: "Contactos", sub: "Agenda y emails", icon: <svg width="20"  { id: "whatsapp", label: "Grupos WhatsApp", sub: "Equipos de trabajo", icon: <svg wid ];
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title="Más opciones" right={authed && <button onClick={() => setAuthed(nul {authed && <div style={{ margin: "12px 18px 0", background: "#ECFDF5", border: "1px s <div style={{ padding: "14px 18px" }}>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margi {MAS_ITEMS.map(item => (<button key={item.id} onClick={() => setView(item.id) <div style={{ width: 40, height: 40, borderRadius: T.rsm, background: T.a <div style={{ fontSize: 11, fontWeight: 700, color: T.text, lineHeight: 1 </button>))}
 </div>
 <div style={{ height: 1, background: T.border, margin: "4px 0 14px" }} />
 <Card onClick={() => { if (cfgLocked) setShowUnlockModal(true); else requireAuth( <div style={{ width: 44, height: 44, borderRadius: T.rsm, background: cfgLock {cfgLocked
 ? <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path  : <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path  </div>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: cfgLocked ? "#EF4444" <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{cfgLocked ? "T </div>
 <span style={{ fontSize: 18, color: cfgLocked ? "#EF4444" : T.accent }}>›</sp </Card>
 </div>
 {showConfig && !cfgLocked && (<Sheet title=" Configuración" onClose={tryClose}>
 {/* Banner cambios pendientes */}
 {hasUnsaved && !confirmClose && (
 <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadiu <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706"><path fill <span style={{ fontSize: 12, color: "#92400E", fontWeight: 600, flex: 1 } <button onClick={guardarYCerrar} style={{ background: "#D97706", border:  </div>
 )}
 {/* Diálogo confirmación cierre */}
 {confirmClose && (
 <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadiu <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBott <div style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 12, lineHeigh <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 <button onClick={() => { setConfirmClose(false); setShowConfig(false) <button onClick={guardarYCerrar} style={{ background: T.accent, borde </div>
 </div>
 )}
 <CfgSection id="cuenta" title="Cuenta y empresa" icon=" " openSec={openSec} setO <div style={{ marginBottom: 14 }}>
 <Lbl>API Key de Anthropic</Lbl>
 <div style={{ position: "relative" }}>
 <input
 type={showKey ? "text" : "password"}
 value={localKey}
 onChange={e => setLocalKey(e.target.value)}
 placeholder="sk-ant-api03-..."
 autoComplete="off"
 spellCheck={false}
 style={{ width: "100%", background: T.bg, border: \`1.5px solid \ />
 <button onClick={() => setShowKey(v => !v)} type="button" style={{ po {showKey
 ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" </button>
 </div>
 {localKey
 ? <div style={{ display: "flex", alignItems: "center", gap: 5, margin : <div style={{ fontSize: 10, color: T.muted, marginTop: 5, lineHeigh </div>
 <Field label="Email del asistente IA"><TInput value={localCfg.email || ''} on <Field label="Nombre de la empresa"><TInput value={localCfg.empresa || ''} on <FieldRow><Field label="Cargo"><TInput value={localCfg.cargo || ''} onChange= <Field label="Ciudad / Sede"><TInput value={localCfg.ciudad || ''} onChange={ </CfgSection>
 <CfgSection id="tema" title="Tema visual" icon=" " openSec={openSec} setOpenSec= <Lbl>Presets</Lbl>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8,  {THEME_PRESETS.map(p => {
 const active = localCfg.themeId === p.id; return (<button key={p.id}  <div style={{ display: "flex", gap: 3 }}>{[p.bg, p.card, p.border <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{p. {active && <div style={{ width: 6, height: 6, borderRadius: "50%" </button>);
 })}
 </div>
 <Lbl>Colores individuales</Lbl>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, ma {COLOR_KEYS.map(({ k, label }) => (<div key={k} style={{ textAlign: "cent <div style={{ position: "relative", width: "100%", paddingBottom: "10 <input type="color" value={(localCfg.colors || DEFAULT_COLORS)[k] </div>
 <div style={{ fontSize: 9, fontWeight: 600, color: T.sub }}>{label}</ </div>))}
 </div>
 <button onClick={() => applyThemePreset(THEME_PRESETS[0])} style={{ width: "1 </CfgSection>
 <CfgSection id="font" title="Tipografía" icon=" " openSec={openSec} setOpenSec={ <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 {FONTS.map(f => {
 const active = localCfg.fontId === f.id; return (<button key={f.id} o <div style={{ fontSize: 22, fontWeight: 700, color: active ? T.ac <div style={{ fontSize: 10, fontWeight: 600, color: active ? T.ac {active && <div style={{ width: 6, height: 6, borderRadius: "50%" </button>);
 })}
 </div>
 </CfgSection>
 <CfgSection id="forma" title="Forma de los elementos" icon=" " openSec={openSec} <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 } {RADIUS_OPTS.map(r => {
 const active = localCfg.radiusId === r.id; return (<button key={r.id} <div style={{ width: 36, height: 28, background: active ? T.accen <div style={{ fontSize: 10, fontWeight: 600, color: active ? T.ac </button>);
 })}
 </div>
 </CfgSection>
 <CfgSection id="logos" title="Logos y textos" icon=" " openSec={openSec} setOpen
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 <input ref={logoRef1} type="file" accept="image/*,.svg" style={{ display: "no <input ref={logoRef2} type="file" accept="image/*,.svg" style={{ display: "no <input ref={logoRef3} type="file" accept="image/*,.svg" style={{ display: "no <input ref={logoRef4} type="file" accept="image/*,.svg" style={{ display: "no <div style={{ marginBottom: 12 }}><Lbl>Logo botón micrófono (pantalla IA)</Lb <div style={{ border: \`1.5px dashed \${T.border}\`, borderRadius: T.rsm, {cfg.logoCentral
 ? (<div style={{ display: "flex", alignItems: "center", gap: 10,  : (<><div style={{ fontSize: 28, marginBottom: 4 }}> </div><div  </div>
 </div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, ma {[{ key: "logoBelfast", label: "Belfast", ref: logoRef1 }, { key: "logoAA <div key={key} style={{ border: \`1.5px dashed \${T.border}\`, border {cfg[key] ? (<><img src={cfg[key]} alt={label} style={{ height: 3 : (<><div style={{ fontSize: 24, marginBottom: 3 }}> </div>< </div>
 ))}
 </div>
 <Field label="Título del asistente"><TInput value={localCfg.tituloAsistente | <Field label="Subtítulo"><TInput value={localCfg.subtituloAsistente || ''} on <div style={{ background: T.bg, borderRadius: T.rsm, padding: "12px", textAli <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom <div style={{ width: 60, height: 52, background: "#fff", borderRadius: 10 {cfg.logoAsistente ? <img src={cfg.logoAsistente} alt="" style={{ wid </div>
 <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: <div style={{ fontSize: 10, color: T.muted }}>{localCfg.subtituloAsistent </div>
 </CfgSection>
 <CfgSection id="ubicaciones" title="Ubicaciones / Aeropuertos" icon=" " openSec= <div style={{ fontSize: 11, color: T.muted, marginBottom: 14, lineHeight: 1.5 Editá el nombre, código y etiqueta de cada ubicación. Se usan en obras, l </div>
 <Field label="Etiqueta del campo">
 <TInput
 value={localCfg.labelUbicacion || 'Aeropuerto'}
 onChange={e => updateText({ labelUbicacion: e.target.value })}
 placeholder="Aeropuerto"
 />
 </Field>
 <Lbl>Ubicaciones</Lbl>
 {(localCfg.ubicaciones || DEFAULT_UBICACIONES).map((ub, i) => (
 <div key={ub.id} style={{ background: T.bg, borderRadius: T.rsm, padding: <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, marginB
 <FieldRow>
 <Field label="Código (ej: AEP)">
 <TInput
 value={ub.code}
 onChange={e => {
 const nuevas = [...(localCfg.ubicaciones || DEFAULT_U nuevas[i] = { ...nuevas[i], code: e.target.value.toUp setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }}
 placeholder="AEP"
 />
 </Field>
 <Field label="ID interno">
 <TInput
 value={ub.id}
 onChange={e => {
 const nuevas = [...(localCfg.ubicaciones || DEFAULT_U nuevas[i] = { ...nuevas[i], id: e.target.value.toLowe setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }}
 placeholder="aep"
 />
 </Field>
 </FieldRow>
 <Field label="Nombre completo">
 <TInput
 value={ub.name}
 onChange={e => {
 const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICA nuevas[i] = { ...nuevas[i], name: e.target.value };
 setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }}
 placeholder="Aeroparque Jorge Newbery"
 />
 </Field>
 {(localCfg.ubicaciones || DEFAULT_UBICACIONES).length > 1 && (
 <button onClick={() => {
 const nuevas = (localCfg.ubicaciones || DEFAULT_UBICACIONES). setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }} style={{ background: "#FEF2F2", border: "1px solid #FECACA", b Eliminar ubicación
 </button>
 )}
 </div>
 ))}
 <button onClick={() => {
 const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES), { id: \
 setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }} style={{ width: "100%", background: T.accentLight, border: \`1.5px dashed  + Agregar ubicación
 </button>
 <button onClick={() => setLocalCfg(p => ({ ...p, ubicaciones: DEFAULT_UBICACI ↺ Restaurar ubicaciones por defecto
 </button>
 </CfgSection>
 <CfgSection id="textos" title={t(cfg, 'cfg_textos')} icon=" " openSec={openSec}  <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 {Object.entries(DEFAULT_TEXTOS).map(([key, defaultVal]) => (
 <div key={key} style={{ marginBottom: 10 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBo <input
 value={localCfg.textos?.[key] ?? defaultVal}
 onChange={e => {
 const val = e.target.value;
 setLocalCfg(p => ({ ...p, textos: { ...(p.textos || DEFAULT_T }}
 placeholder={defaultVal}
 style={{ width: "100%", background: T.bg, border: \`1.5px solid \ />
 </div>
 ))}
 <button onClick={() => setLocalCfg(p => ({ ...p, textos: { ...DEFAULT_TEXTOS  </CfgSection>
 <PBtn full onClick={guardarYCerrar} style={{ marginTop: 8 }}>{t(cfg, 'cfg_guardar {/* Botón Exportar JSX */}
 <div style={{ marginTop: 12, padding: "14px 16px", background: "#EFF6FF", border: <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom:  <div style={{ fontSize: 11, color: "#1E3A8A", marginBottom: 10, lineHeight: 1 <button onClick={exportarJSX} style={{ width: "100%", background: "#1D4ED8",  </div>
 {/* Botón Publicar y Bloquear */}
 <div style={{ marginTop: 16, padding: "14px 16px", background: "#FEF2F2", border: <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom:  <div style={{ fontSize: 11, color: "#7F1D1D", marginBottom: 10, lineHeight: 1 <button onClick={() => setShowLockConfirm(true)} style={{ width: "100%", back </div>
 </Sheet>)}
 {/* Modal confirmación de bloqueo */}
 {showLockConfirm && (
 <Sheet title=" Confirmar bloqueo" onClose={() => setShowLockConfirm(false)}>
 <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadiu <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBott <div style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.6 }}>La confi </div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 <button onClick={() => setShowLockConfirm(false)} style={{ background: T. <button onClick={handleLock} style={{ background: "#EF4444", border: "non </div>
 </Sheet>
 )}
 {/* Modal desbloqueo */}
 {showUnlockModal && (
 <Sheet title=" Desbloquear configuración" onClose={() => { setShowUnlockModal(f <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadiu <Field label="Usuario"><input value={unlockUser} onChange={e => { setUnlockUs <Field label="Contraseña"><input type="password" value={unlockPass} onChange= {unlockErr && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA <PBtn full onClick={tryUnlock}> Desbloquear</PBtn>
 </Sheet>
 )}
 </div>);
}
function Archivos({ setView }) { const [files, setFiles] = useState([]); const inputRef = usefunction Seguimiento({ alerts, setAlerts, setView }) { function dismiss(id) { setAlerts(p => function ResumenView({ lics, obras, personal, alerts, setView }) { const kpis = [{ label: "Lifunction MensajesView({ personal, setView }) { const [sel, setSel] = useState(null); const [tfunction ContactosView({ setView, onContactosChange }) { const [contacts, setContacts] = useSfunction WhatsappGrupos({ personal, setView }) { const [grupos, setGrupos] = useState([]); cofunction speakText(text) {
 window.speechSynthesis.cancel();
 const clean = text.replace(/[*_#\`~]/g, '').replace(/https?:\\/\\/\\S+/g, '').replace(/  function doSpeak() {
 const voices = window.speechSynthesis.getVoices();
 // Log para debug — se puede quitar
 // console.log('Voces disponibles:', voices.map(v=>v.name+' '+v.lang));
 // Candidatos masculinos en orden de preferencia
 const MALE_NAMES = ['Jorge', 'Carlos', 'Diego', 'Miguel', 'Antonio', 'Juan', 'Pablo', const FEMALE_NAMES = ['Paulina', 'María', 'Laura', 'Sara', 'Carmen', 'Isabel', 'Googl const esVoices = voices.filter(v =>
 v.lang.startsWith('es-AR') ||
 v.lang.startsWith('es-419') ||
 v.lang.startsWith('es-MX') ||
 v.lang.startsWith('es-US') ||
 v.lang.startsWith('es-ES') ||
 v.lang.startsWith('es')
 );
 let chosen = null;
 // 1. Buscar voz española con nombre masculino conocido
 for (const name of MALE_NAMES) {
 const v = esVoices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
 if (v) { chosen = v; break; }
 }
 // 2. Si no encontró, excluir voces con nombre femenino conocido
 if (!chosen) {
 chosen = esVoices.find(v => !FEMALE_NAMES.some(fn => v.name.toLowerCase().include }
 // 3. Fallback: cualquier voz española
 if (!chosen && esVoices.length > 0) chosen = esVoices[0];
 const utt = new SpeechSynthesisUtterance(clean);
 utt.lang = 'es-AR';
 utt.rate = 0.95; // un poco más lento, más natural
 utt.pitch = 0.75; // más grave = más masculino
 utt.volume = 1;
 if (chosen) utt.voice = chosen;
 window.speechSynthesis.speak(utt);
 }
 if (window.speechSynthesis.getVoices().length > 0) { doSpeak(); }
 else { window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true });}
function Chat({ contactos, lics, obras, personal, alerts, msgs, setMsgs, cfg, apiKey }) {
 const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); co const [listening, setListening] = useState(false); const [speaking, setSpeaking] = useSta const [userName, setUserName] = useState(''); const [nameInput, setNameInput] = useState( const bottomRef = useRef(null); const taRef = useRef(null); const imgFileRef = useRef(nul
 useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, lo // Cargar nombre guardado
 useEffect(() => {
 (async () => {
 try { const r = await window.storage.get('bcm_username'); if (r?.value) setUserNa setNameLoaded(true);
 })();
 }, []);
 function saveName() {
 const n = nameInput.trim();
 if (!n) return;
 setUserName(n);
 window.storage.set('bcm_username', n).catch(() => { });
 }
 const [micError, setMicError] = useState('');
 const [micStatus, setMicStatus] = useState('idle');
 async function startListen() {
 setMicError('');
 const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
 if (!SR) { setMicError('Tu navegador no soporta micrófono. Usá Chrome.'); setMicStatu try { setMicStatus('requesting'); await navigator.mediaDevices.getUserMedia({ audio:  catch (err) {
 setMicStatus('error');
 if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') { set else { setMicError('No se pudo acceder al micrófono: ' + err.message); }
 return;
 }
 window.speechSynthesis.cancel();
 const r = new SR();
 r.lang = 'es-AR'; r.continuous = false; r.interimResults = true; r.maxAlternatives =  r.onstart = () => { setListening(true); setMicStatus('listening'); setMicError(''); } r.onend = () => { setListening(false); setMicStatus('idle'); };
 r.onerror = e => {
 setListening(false); setMicStatus('error');
 const msgs_ = { aborted: 'Cancelado', audio: 'Sin audio detectado', 'network': 'E setMicError(msgs_[e.error] || 'Error de micrófono: ' + e.error);
 };
 r.onresult = e => {
 const results = Array.from(e.results); const last = results[results.length - 1];  if (last.isFinal) { setInput(tx); setTimeout(() => sendVoice(tx), 80); } else { s };
 recognitionRef.current = r;
 try { r.start(); } catch (e) { setMicStatus('error'); setMicError('No se pudo iniciar
 }
 function stopListen() { recognitionRef.current?.stop(); }
 function stopSpeak() { window.speechSynthesis.cancel(); setSpeaking(false); }
 async function sendVoice(text) {
 const c = text.trim(); if (!c || loading) return;
 setInput(""); if (taRef.current) taRef.current.style.height = "22px";
 const userContent = [{ type: 'text', text: c }];
 const next = [...msgs, { role: "user", content: userContent, _snap: [], _text: c }];  try {
 const sys = await buildContext();
 const r = await callAI(next.map(m => ({ role: m.role, content: m.content })), sys setMsgs([...next, { role: "assistant", content: [{ type: "text", text: r }] }]);
 if (autoSpeak) { setSpeaking(true); speakText(r); setTimeout(() => setSpeaking(fa } catch { setMsgs([...next, { role: "assistant", content: [{ type: "text", text: "Err setLoading(false);
 }
 async function handleAttach(e) { setShowAttachMenu(false); for (const f of Array.from(e.t async function buildContext() {
 let pm = [], ps = [], camaras = [], pres = {};
 try { const r1 = await window.storage.get('bcm_presup_materiales'); if (r1?.value) pm const today = new Date().toLocaleDateString('es-AR');
 const empresa = cfg?.empresa || 'BelfastCM'; const emailIA = cfg?.email || EMAIL_IA;
 let c = \`Sos el Asistente IA de \${empresa}. Email: \${emailIA}\${cfg?.cargo ? \`\\n if (userName) c += \`El usuario se llama \${userName}. Usá su nombre naturalmente en  c += \`Especialista en obras en AA2000. Respondés en español rioplatense, profesional c += \` LICITACIONES (\${lics?.length || 0})\\n\`; lics?.forEach(l => { c += \`• \$ c += \`\\n OBRAS (\${obras?.length || 0})\\n\`; obras?.forEach(o => { c += \`• \${o c += \`\\n PERSONAL (\${personal?.length || 0})\\n\`; personal?.forEach(p => { c += if (alerts?.length) { c += \`\\n ALERTAS\\n\`; alerts.forEach(a => c += \`• [\${a.p if (pm.length) { c += \`\\n MATERIALES\\n\`; pm.forEach(i => c += \`• \${i.descripc if (ps.length) { c += \`\\n SUBCONTRATOS\\n\`; ps.forEach(i => c += \`• \${i.descri if (contactos?.length) { c += \`\\n CONTACTOS\\n\`; contactos.forEach(x => c += \`• if (camaras.length) { c += \`\\n CÁMARAS (\${camaras.length})\\n\`; }
 const todayRecs = Object.entries(pres.registros || {}).filter(([k]) => k.endsWith(tod if (todayRecs.length) { c += \`\\n PRESENTISMO HOY\\n\`; todayRecs.forEach(r => c + return c;
 }
 async function send(text) {
 const c = (text || input).trim();
 if ((!c && !attachments.length) || loading) return;
 setInput(""); if (taRef.current) taRef.current.style.height = "22px"; setShowAttachMe const userContent = [];
 attachments.forEach(a => { if (a.isImg) userContent.push({ type: 'image', source: { t if (c) userContent.push({ type: 'text', text: c }); else userContent.push({ type: 'te const snapAtt = [...attachments]; setAttachments([]);
 const next = [...msgs, { role: "user", content: userContent, _snap: snapAtt, _text: c
 try {
 const sys = await buildContext(); const r = await callAI(next.map(m => ({ role: m if (autoSpeak) { setSpeaking(true); speakText(r); setTimeout(() => setSpeaking(fa }
 catch { setMsgs([...next, { role: "assistant", content: [{ type: "text", text: "Error setLoading(false);
 }
 function mailBlock(text) { const m = text.match(/ PREPARADO PARA ENVÍO[\\s\\S]*?Para:\\ const titulo = cfg?.tituloAsistente || \`Asistente \${cfg?.empresa || 'BelfastCM'}\`;
 const subtitulo = cfg?.subtituloAsistente || "Lee todos los datos de la app en tiempo rea const QUICK = userName
 ? [\`¿Qué obras tenemos activas, \${userName}?\`, \`¿Qué documentación le falta al pe : ["¿Estado de todas mis obras y licitaciones?", "¿Qué documentación le falta al pers // Pantalla de bienvenida / pedir nombre
 const WelcomeScreen = () => {
 if (!nameLoaded) return null;
 // Si ya tiene nombre: mostrar pantalla principal con micrófono
 if (userName) {
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", alignIte <div style={{ marginBottom: 6, fontSize: 13, color: T.muted, fontWeight: 500  <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 4,  <div style={{ fontSize: 11, color: T.muted, marginBottom: 28, textAlign: "cen {/* Botón micrófono grande central */}
 <button onClick={listening ? stopListen : startListen} style={{ display: "fle <div style={{ width: 120, height: 120, borderRadius: 28, background: T.ca {listening && <div style={{ position: "absolute", inset: -6, borderRa {listening && <div style={{ position: "absolute", inset: -14, borderR {cfg?.logoCentral
 ? <img src={cfg.logoCentral} alt="logo" style={{ width: "78%", he : <svg width="56" height="56" viewBox="0 0 24 24" fill={listening <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
 <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={listening ? "#EF4 <line x1="12" y1="19" x2="12" y2="23" stroke={listening ? "#E <line x1="8" y1="23" x2="16" y2="23" stroke={listening ? "#EF </svg>}
 </div>
 <div style={{ fontSize: 13, fontWeight: 700, color: listening ? "#EF4444" {listening ? t(cfg, 'chat_escuchando') : "Tocar para hablar"}
 </div>
 </button>
 {listening && input && <div style={{ fontSize: 13, color: T.accent, fontStyle {micError && <div style={{ display: "flex", alignItems: "center", gap: 6, bac <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path fill <span style={{ fontSize: 11, color: "#EF4444", flex: 1 }}>{micError}</spa
 <button onClick={() => { setMicError(''); setMicStatus('idle'); }} style= </div>}
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7 {QUICK.map((q, i) => (<button key={i} onClick={() => send(q)} style={{ ba </div>
 <button onClick={() => { setUserName(''); window.storage.set('bcm_username',  </div>);
 }
 // Si NO tiene nombre: pantalla para pedirlo
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems:  <div style={{ width: 100, height: 100, display: "flex", alignItems: "center", jus {cfg?.logoCentral
 ? <img src={cfg.logoCentral} alt="logo" style={{ width: "100%", height: " : <svg width="80" height="80" viewBox="0 0 24 24" fill={T.accent}>
 <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
 <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={T.accent} strokeWidth="1. <line x1="12" y1="19" x2="12" y2="23" stroke={T.accent} strokeWidth=" <line x1="8" y1="23" x2="16" y2="23" stroke={T.accent} strokeWidth="1 </svg>}
 </div>
 <div style={{ fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 6, text <div style={{ fontSize: 12, color: T.muted, marginBottom: 28, textAlign: "center" <div style={{ width: "100%", marginBottom: 12 }}>
 <input
 value={nameInput}
 onChange={e => setNameInput(e.target.value)}
 onKeyDown={e => e.key === 'Enter' && saveName()}
 placeholder="Escribí tu nombre..."
 autoFocus
 style={{ width: "100%", background: T.bg, border: \`2px solid \${T.accent />
 </div>
 <PBtn full onClick={saveName} disabled={!nameInput.trim()}>Comenzar →</PBtn>
 </div>);
 };
 const VoiceBar = () => (<div style={{ background: T.card, borderBottom: \`1px solid \${T. <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
 <button onClick={listening ? stopListen : startListen} disabled={micStatus === 'r {micStatus === 'requesting'
 ? <><div style={{ width: 8, height: 8, borderRadius: "50%", background: " : listening
 ? <><div style={{ width: 8, height: 8, borderRadius: "50%", backgroun : <><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><pat </button>
 {speaking && <button onClick={stopSpeak} style={{ display: "flex", alignItems: "c <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><rect x="6" y="4 </button>}
 <div style={{ flex: 1 }} />
 <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
 <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{t(cfg, 'chat <div onClick={() => setAutoSpeak(v => !v)} style={{ width: 34, height: 18, bo <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#f </div>
 </div>
 </div>
 {micError && <div style={{ display: "flex", alignItems: "center", gap: 6, background: <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="ev <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, flex: 1 }}>{micEr <button onClick={() => { setMicError(''); setMicStatus('idle'); }} style={{ backg </div>}
 {listening && input && <div style={{ fontSize: 12, color: T.accent, fontStyle: "itali </div>);
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde {!apiKey && <div style={{ background: "#FFFBEB", borderBottom: "1px solid #FDE68A", p <svg width="14" height="14" viewBox="0 0 24 24" fill="#D97706"><path fillRule="ev <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600, flex: 1 }}>Falta  </div>}
 {msgs.length > 0 && <VoiceBar />}
 <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }} {msgs.length === 0 ? (<WelcomeScreen />) : (
 <div style={{ padding: "14px 18px 0" }}>
 {msgs.map((m, i) => {
 const txt = Array.isArray(m.content) ? m.content.filter(b => b.type = <div key={i} style={{ display: "flex", flexDirection: "column", a {m.role !== "user" && <div style={{ fontSize: 10, fontWeight: {m.role === "user" && imgs.length > 0 && <div style={{ displa {m.role === "user" && docs.length > 0 && <div style={{ displa {(dispTxt || m.role === 'assistant') && <div style={{ maxWidt {mb && <div style={{ maxWidth: "87%", marginTop: 6, backgroun </div>);
 })}
 {loading && <div style={{ display: "flex", gap: 5, padding: "6px 4px", ma <div ref={bottomRef} style={{ height: 14 }} />
 </div>
 )}
 </div>
 {attachments.length > 0 && (<div style={{ background: T.card, borderTop: \`1px solid  <div style={{ padding: "8px 14px calc(max(14px,env(safe-area-inset-bottom)) + 70px)", {showAttachMenu && (<div style={{ position: "absolute", bottom: "100%", left: 14, <input ref={camRef} type="file" accept="image/*" capture="environment" multip
 <input ref={imgFileRef} type="file" accept="image/*" multiple onChange={e =>  <input ref={anyFileRef} type="file" accept=".pdf,.docx,.doc,.xlsx,.xls,.txt"  {[{ icon: " ", label: "Cámara", ref: camRef }, { icon: " ", label: "Imagen" </div>)}
 <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
 <button onClick={() => setShowAttachMenu(p => !p)} style={{ width: 40, height <div style={{ flex: 1, background: T.bg, border: \`1.5px solid \${T.border}\` <button onClick={listening ? stopListen : startListen} style={{ width: 42, he {listening && <div style={{ position: "absolute", inset: -3, borderRadius <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path </button>
 <button onClick={() => send()} disabled={(!input.trim() && !attachments.lengt </div>
 </div>
 </div>);
}
const DEMO_LICS = [{ id: "l1", nombre: "Refacción Terminal A", ap: "aep", estado: "curso", moconst DEMO_OBRAS = [{ id: "o1", nombre: "Refacción Terminal A", ap: "aep", estado: "curso", aconst DEMO_PERSONAL = [{ id: "p1", nombre: "M. Rodríguez", rol: "Jefe de Obra", empresa: "Belconst DEMO_ALERTS = [{ id: "a1", prioridad: "alta", msg: "ART de M. Rodríguez vence en 2 díasexport default function App() {
 const [view, setView] = useState("chat");
 const [lics, setLics] = useState(DEMO_LICS);
 const [obras, setObras] = useState(DEMO_OBRAS);
 const [personal, setPersonal] = useState(DEMO_PERSONAL);
 const [alerts, setAlerts] = useState(DEMO_ALERTS);
 const [contactos, setContactos] = useState([]);
 const [detailObraId, setDetailObraId] = useState(null);
 const [authed, setAuthed] = useState(null);
 const [authModal, setAuthModal] = useState(null);
 const [chatMsgs, setChatMsgs] = useState([]);
 const [cargarState, setCargarState] = useState({ obraId: '', newFotos: [], report: '' });
 const [cfg, setCfg] = useState(DEFAULT_CONFIG);
 const [cfgLoaded, setCfgLoaded] = useState(false);
 const [dataLoaded, setDataLoaded] = useState(false);
 const [apiKey, setApiKey] = useState('');
 const [cfgLocked, setCfgLocked] = useState(false);
 const [cfgLockedLoaded, setCfgLockedLoaded] = useState(false);
 // Carga estado de bloqueo
 useEffect(() => {
 (async () => {
 try { const r = await window.storage.get('bcm_cfg_locked'); if (r?.value === 'tru setCfgLockedLoaded(true);
 })();
 }, []);
 useEffect(() => {
 if (!cfgLockedLoaded) return;
 window.storage.set('bcm_cfg_locked', cfgLocked ? 'true' : 'false').catch(() => {});
 }, [cfgLocked, cfgLockedLoaded]);
 // Carga datos — PRIMERO lee, DESPUÉS habilita el guardado
 useEffect(() => {
 (async () => {
 try {
 const r = await window.storage.get("bcm_state");
 if (r?.value) {
 const s = JSON.parse(r.value);
 if (s.lics?.length) setLics(s.lics);
 if (s.obras?.length) setObras(s.obras);
 if (s.personal?.length) setPersonal(s.personal);
 if (s.alerts?.length) setAlerts(s.alerts);
 }
 } catch { }
 setDataLoaded(true); // solo ahora habilita el guardado
 })();
 }, []);
 // Al cargar datos, sincroniza obras faltantes para lics en curso/adjudicada
 useEffect(() => {
 if (!dataLoaded) return;
 const TRIGGER = ["curso", "adjudicada"];
 const nuevas = [];
 lics.forEach(lic => {
 if (!TRIGGER.includes(lic.estado)) return;
 const yaExiste = obras.some(o => o.lic_id === lic.id);
 if (yaExiste) return;
 nuevas.push({
 id: Math.random().toString(36).slice(2, 9),
 lic_id: lic.id,
 nombre: lic.nombre,
 ap: lic.ap,
 sector: lic.sector || "",
 estado: "curso",
 avance: 0,
 inicio: new Date().toLocaleDateString("es-AR"),
 cierre: "",
 obs: [{ id: Math.random().toString(36).slice(2, 9), txt: "Obra creada automát fotos: [], archivos: [], informes: [], docs: {},
 });
 });
 if (nuevas.length > 0) setObras(p => [...p, ...nuevas]);
 }, [dataLoaded]);
 // Guarda solo después de que se cargaron los datos del storage
 useEffect(() => {
 if (!dataLoaded) return;
 window.storage.set("bcm_state", JSON.stringify({ lics, obras, personal, alerts })).ca }, [lics, obras, personal, alerts, dataLoaded]);
 useEffect(() => {
 (async () => {
 try {
 const r = await window.storage.get('bcm_config');
 const lb = await window.storage.get('bcm_logo_b').catch(() => null);
 const la = await window.storage.get('bcm_logo_a').catch(() => null);
 const li = await window.storage.get('bcm_logo_i').catch(() => null);
 const lc = await window.storage.get('bcm_logo_c').catch(() => null);
 const base = r?.value ? { ...DEFAULT_CONFIG, ...JSON.parse(r.value) } : { ... setCfg({ ...base, logoBelfast: lb?.value || '', logoAA2000: la?.value || '',  const rk = await window.storage.get('bcm_apikey').catch(() => null);
 if (rk?.value) setApiKey(rk.value);
 } catch { }
 setCfgLoaded(true);
 })();
 }, []);
 useEffect(() => {
 if (!cfgLoaded) return;
 const { logoBelfast, logoAA2000, logoAsistente, logoCentral, ...rest } = cfg;
 window.storage.set('bcm_config', JSON.stringify(rest)).catch(() => { });
 window.storage.set('bcm_logo_b', logoBelfast || '').catch(() => { });
 window.storage.set('bcm_logo_a', logoAA2000 || '').catch(() => { });
 window.storage.set('bcm_logo_i', logoAsistente || '').catch(() => { });
 window.storage.set('bcm_logo_c', logoCentral || '').catch(() => { });
 }, [cfg, cfgLoaded]);
 function requireAuth(action, titulo) {
 if (authed) { action(); }
 else { setAuthModal({ onSuccess: (u) => { setAuthed(u); action(); setAuthModal(null); }
 const nav = (v) => { setDetailObraId(null); setView(v); };
 const hideBrand = ["archivos", "seguimiento", "mensajes"].includes(view);
 return (
 <div style={{ height: "100vh", display: "flex", flexDirection: "column", background:  <style>{css}</style>
 <style>{buildThemeCSS(cfg)}</style>
 {!hideBrand && <AppBrand cfg={cfg} />}
 <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "colum {view === "dashboard" && <Dashboard lics={lics} obras={obras} personal={perso {view === "licitaciones" && <Licitaciones lics={lics} setLics={setLics} requi {view === "obras" && <Obras obras={obras} setObras={setObras} lics={lics} det {view === "personal" && <Personal personal={personal} setPersonal={setPersona {view === "mas" && <Mas setView={nav} authed={authed} setAuthed={setAuthed} r {view === "archivos" && <Archivos setView={nav} />}
 {view === "seguimiento" && <Seguimiento alerts={alerts} setAlerts={setAlerts} {view === "mensajes" && <MensajesView personal={personal} setView={nav} />}
 {view === "resumen" && <ResumenView lics={lics} obras={obras} personal={perso {view === "cargar" && <CargarView obras={obras} setObras={setObras} cargarSta {view === "contactos" && <ContactosView setView={nav} onContactosChange={setC {view === "whatsapp" && <WhatsappGrupos personal={personal} setView={nav} />}
 {view === "informes_ingeniero" && <InformesIngeniero setView={nav} />}
 {view === "informes_ia" && <InformesIA obras={obras} personal={personal} lics {view === "vigilancia" && <PanelVigilancia setView={nav} />}
 {view === "presentismo" && <Presentismo personal={personal} setView={nav} />}
 {view === "presupuesto_materiales" && <PresupuestoView tipo="materiales" setV {view === "presupuesto_subcontratos" && <PresupuestoView tipo="subcontratos"  {view === "chat" && <Chat contactos={contactos} lics={lics} obras={obras} per </div>
 <BottomNav view={view} setView={nav} alerts={alerts} cfg={cfg} />
 {authModal && <LoginModal titulo={authModal.titulo} onSuccess={authModal.onSucces </div>
 );
}
`;
// ── CONSTANTES ─────────────────────────────────────────────────────────
const AIRPORTS = [{ id: "aep", code: "AEP", name: "Aeroparque Jorge Newbery" }, { id: "eze", const LIC_ESTADOS = [{ id: "visitar", label: "A Visitar", color: "#F59E0B", bg: "#FFFBEB" }, const OBRA_ESTADOS = [{ id: "pendiente", label: "Pendiente", color: "#94A3B8", bg: "#F8FAFC" const ROLES = ["Jefe de Obra", "Capataz", "Técnico", "Proveedor", "Contratista", "Administratconst DOC_TYPES = [{ id: "art", label: "ART", acceptsExp: true }, { id: "antec", label: "Anteconst LIC_DOC_TYPES = [{ id: "planos", label: "Planos", accept: ".pdf,.png,.jpg,.dwg,.zip" },const EMAIL_IA = "ia.belfastcm@gmail.com";
const ADMIN_CREDS = [{ user: "admin", pass: "belfast2025", rol: "Administrador" }, { user: "s// ── TEMA ───────────────────────────────────────────────────────────────
const THEME_PRESETS = [
 { id: "azul", label: "Azul", accent: "#1D4ED8", al: "#EFF6FF", bg: "#F1F5F9", card: "#fff { id: "oscuro", label: "Oscuro", accent: "#60A5FA", al: "#172554", bg: "#0F172A", card: " { id: "verde", label: "Verde", accent: "#16A34A", al: "#DCFCE7", bg: "#F0FDF4", card: "#f { id: "violeta", label: "Violeta", accent: "#7C3AED", al: "#F5F3FF", bg: "#FAF5FF", card: { id: "rojo", label: "Rojo", accent: "#DC2626", al: "#FEF2F2", bg: "#FFF5F5", card: "#fff { id: "naranja", label: "Naranja", accent: "#EA580C", al: "#FFF7ED", bg: "#FFFBF5", card:
 { id: "minimal", label: "Mínimal", accent: "#111111", al: "#F5F5F5", bg: "#FAFAFA", card: { id: "cyan", label: "Cyan", accent: "#0891B2", al: "#ECFEFF", bg: "#F0FDFF", card: "#fff { id: "rosa", label: "Rosa", accent: "#DB2777", al: "#FDF2F8", bg: "#FDF4FF", card: "#fff];
const FONTS = [
 { id: "jakarta", label: "Jakarta", value: "'Plus Jakarta Sans'" },
 { id: "inter", label: "Inter", value: "'Inter'" },
 { id: "poppins", label: "Poppins", value: "'Poppins'" },
 { id: "roboto", label: "Roboto", value: "'Roboto'" },
 { id: "montserrat", label: "Montserrat", value: "'Montserrat'" },
 { id: "system", label: "Sistema", value: "-apple-system,BlinkMacSystemFont" },
];
const RADIUS_OPTS = [{ id: "sharp", label: "Recto", r: 4 }, { id: "normal", label: "Normal", const COLOR_KEYS = [{ k: "accent", label: "Principal" }, { k: "bg", label: "Fondo" }, { k: "cconst DEFAULT_COLORS = { accent: "#1D4ED8", al: "#EFF6FF", bg: "#F1F5F9", card: "#ffffff", boconst DEFAULT_UBICACIONES = [{ id: "aep", code: "AEP", name: "Aeroparque Jorge Newbery" }, { const DEFAULT_TEXTOS = {
 // Nav
 nav_ia: "IA", nav_inicio: "Inicio", nav_obras: "Obras", nav_personal: "Personal", nav_car // Dashboard
 dash_titulo: "Panel operativo", dash_subtitulo: "BelfastCM × AA2000",
 dash_licitaciones: "Licitaciones", dash_obras_activas: "Obras activas", dash_alertas: "Al dash_obras_curso: "Obras en curso", dash_ver_todas: "Ver todas →", dash_acciones: "Accion dash_nueva_lic: "Nueva licitación", dash_nueva_obra: "Nueva obra", dash_presup_mat: "Pres // Obras
 obras_titulo: "Obras", obras_nueva: "Nueva obra", obras_avance: "Avance", obras_inicio: " obras_sector: "Sector", obras_estado: "Estado", obras_info: "Info", obras_notas: "Notas", obras_obs_placeholder: "Registrar observación...", obras_sin_notas: "Sin notas", obras_si obras_agregar_fotos: "Agregar fotos", obras_agregar_arch: "Agregar archivo", obras_elimin // Licitaciones
 lic_titulo: "Licitaciones", lic_nueva: "Nueva licitación", lic_nombre: "Nombre", lic_mont lic_crear: "Crear licitación", lic_eliminar: "Eliminar",
 // Personal
 pers_titulo: "Personal de Obra", pers_nuevo: "Nuevo trabajador", pers_nombre: "Nombre", p pers_obra: "Obra", pers_whatsapp: "WhatsApp", pers_documentacion: "Documentación", pers_s pers_eliminar: "Eliminar trabajador", pers_agregar: "Agregar",
 // Cargar
 carg_titulo: "Registro de Avance", carg_sub: "Fotos + Informe IA", carg_sel_obra: "Selecc carg_fotos: "Cargá fotos nuevas", carg_tomar: "Tomar foto", carg_galeria: "Galería / PC",
 carg_generar: "Comparar y generar informe", carg_analizando: "Analizando...",
 carg_informe: "Informe generado", carg_nuevo: "+ Nuevo", carg_descargar: " Descargar",
 // Chat / IA
 chat_titulo: "Asistente IA", chat_placeholder: "Escribí o usá el micrófono…",
 chat_hablar: "Hablar", chat_escuchando: "Escuchando…", chat_pausar: "Pausar", chat_voz_au // Más
 mas_titulo: "Más opciones", mas_config: "Configuración", mas_config_sub: "Estética · Logo
 mas_cerrar_sesion: "Cerrar sesión",
 // Config
 cfg_cuenta: "Cuenta y empresa", cfg_tema: "Tema visual", cfg_tipografia: "Tipografía",
 cfg_forma: "Forma de los elementos", cfg_logos: "Logos y textos", cfg_textos: "Textos de  cfg_guardar: "✓ Guardar y cerrar", cfg_restaurar: "↺ Restaurar tema por defecto",
};
const DEFAULT_CONFIG = { email: EMAIL_IA, empresa: "BelfastCM", cargo: "Gerencia de Obra", te// Helper para obtener texto con fallback al default
function t(cfg, key) { return cfg?.textos?.[key] || DEFAULT_TEXTOS[key] || key; }
function getUbics(cfg) { return (cfg?.ubicaciones?.length ? cfg.ubicaciones : DEFAULT_UBICACIfunction getLabelUbic(cfg) { return cfg?.labelUbicacion || "Aeropuerto"; }
function uid() { return Math.random().toString(36).slice(2, 9); }
function toDataUrl(f) { return new Promise((res, rej) => { const r = new FileReader(); r.onlofunction getBase64(d) { return d.split(',')[1]; }
function getMediaType(d) { const m = d.match(/data:([^;]+);/); return m ? m[1] : 'image/jpeg'async function callAI(msgs, sys, apiKey) {
 try {
 // Intentar API interna de Claude (artifacts publicados en claude.ai)
 if (typeof window !== 'undefined' && window.claude?.complete) {
 const fullPrompt = sys ? sys + "\n\n" + msgs.map(m => {
 const txt = Array.isArray(m.content) ? m.content.filter(b => b.type==='text') return (m.role === 'user' ? 'Usuario: ' : 'Asistente: ') + txt;
 }).join('\n') : msgs.map(m => {
 const txt = Array.isArray(m.content) ? m.content.filter(b => b.type==='text') return (m.role === 'user' ? 'Usuario: ' : 'Asistente: ') + txt;
 }).join('\n');
 const result = await window.claude.complete(fullPrompt);
 return result || "Sin respuesta.";
 }
 // Fallback: API directa con key propia
 const headers = { "Content-Type": "application/json", "anthropic-dangerous-direct-bro if (apiKey) headers["x-api-key"] = apiKey;
 else return "⚠ Configurá tu API Key en Más → Configuración para usar la IA.";
 const r = await fetch("https://api.anthropic.com/v1/messages", {
 method: "POST",
 headers,
 body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, syste });
 if (!r.ok) {
 let msg = "Error de conexión.";
 try { const d = await r.json(); msg = d.error?.message || `Error ${r.status}`; }  return msg;
 }
 const d = await r.json();
 if (d.error) return `Error: ${d.error.message || 'Sin respuesta.'}`;
 return d.content?.map(b => b.text || "").join("") || "Sin respuesta.";
 } catch (e) {
 return `Error de conexión: ${e.message || 'Verificá tu API Key en Configuración.'}`;
 }
} function daysSince(s) { if (!s) return 999; const [d, m, y] = s.split("/"); return Math.ceifunction hexLight(hex) { try { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slicfunction buildThemeCSS(cfg) {
 const c = cfg.colors || DEFAULT_COLORS;
 const fv = FONTS.find(f => f.id === cfg.fontId)?.value || "'Plus Jakarta Sans'";
 const rv = RADIUS_OPTS.find(r => r.id === cfg.radiusId)?.r || 14;
 return `:root{--bg:${c.bg};--card:${c.card};--border:${c.border};--text:${c.text};--sub:$}
const T = { bg: "var(--bg,#F1F5F9)", card: "var(--card,#fff)", border: "var(--border,#E2E8F0)const css = `
 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;70 *{box-sizing:border-box;margin:0;padding:0;}
 body{background:var(--bg,#F1F5F9);overscroll-behavior:none;}
 input,textarea,select,button{font-family:var(--font,'Plus Jakarta Sans'),sans-serif;}
 input:focus,textarea:focus,select:focus{outline:none;}textarea{resize:none;}button{cursor:p @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0) @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
 @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
 @keyframes scanSweep{0%{top:-100%}100%{top:200%}}
`;
const BelfastLogo = ({ size = 44 }) => (
 <svg width={Math.round(size * 1.12)} height={size} viewBox="0 0 278 212" fill="none" stro <polygon points="8,84 98,84 126,54 36,54" />
 <path d="M8,84 L8,200 L98,200 L98,174 L52,174 L52,132 L98,132 L98,117 L57,117 L57,88  <line x1="98" y1="84" x2="126" y2="54" />
 <rect x="120" y="6" width="150" height="194" />
 <rect x="138" y="22" width="114" height="72" />
 <rect x="179" y="128" width="21" height="72" />
 </svg>
);
const AA2000Symbol = ({ size = 54 }) => (
 <svg width={size} height={Math.round(size * .52)} viewBox="0 0 130 68" fill="none">
 <ellipse cx="48" cy="34" rx="44" ry="20" stroke="#6b7280" strokeWidth="9" fill="none" <polygon points="22,18 22,50 70,34" fill="#6b7280" />
 </svg>
);
function AppBrand({ cfg }) {
 const lb = cfg?.logoBelfast, la = cfg?.logoAA2000;
 return (
 <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, padding: "8p <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 {lb ? <img src={lb} alt="Belfast" style={{ height: 66, objectFit: "contain" } : <><BelfastLogo size={62} /><div style={{ lineHeight: 1.2 }}><div style= </div>
 <div style={{ width: 1, height: 58, background: T.border, flexShrink: 0 }} />
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 {la ? <img src={la} alt="AA2000" style={{ height: 66, objectFit: "contain" }} : <><AA2000Symbol size={76} /><div style={{ lineHeight: 1.35 }}><div styl </div>
 </div>
 );
}
function Card({ children, style = {}, onClick }) { return <div onClick={onClick} style={{ bacfunction Badge({ color, bg, children, style = {} }) { return <span style={{ display: "inline-function PBtn({ children, onClick, disabled, full, style = {}, variant = "primary" }) {
 const v = { primary: { background: disabled ? "#E2E8F0" : "var(--accent,#1D4ED8)", color: return <button onClick={onClick} disabled={disabled} style={{ ...v[variant], borderRadius}
function Sheet({ title, onClose, children }) { return (<div style={{ position: "fixed", insetfunction Lbl({ children }) { return <div style={{ fontSize: 11, fontWeight: 700, color: T.subfunction TInput({ value, onChange, placeholder, type = "text", extraStyle = {} }) { return <ifunction Sel({ value, onChange, children }) { return <select value={value} onChange={onChangefunction FieldRow({ children }) { return <div style={{ display: "grid", gridTemplateColumns: function Field({ label, children }) { return <div style={{ marginBottom: 12 }}><Lbl>{label}</function PlusBtn({ onClick }) { return <button onClick={onClick} style={{ background: "var(--function AppHeader({ title, sub, right, back, onBack }) { return (<div style={{ background: Tfunction LoginModal({ titulo, onSuccess, onClose }) {
 const [u, setU] = useState('');
 const [p, setP] = useState('');
 const [err, setErr] = useState('');
 const [showPass, setShowPass] = useState(false);
 function login() {
 const usuario = u.trim().toLowerCase();
 const contra = p.trim();
 if (!usuario || !contra) { setErr('Completá usuario y contraseña'); return; }
 const f = ADMIN_CREDS.find(c => c.user === usuario && c.pass === contra);
 if (f) { setErr(''); onSuccess(f); } else { setErr('Usuario o contraseña incorrectos' }
 return (<Sheet title={titulo || "Acceso requerido"} onClose={onClose}>
 <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, p <svg width="18" height="18" viewBox="0 0 24 24" fill="#15803D"><path fillRule="ev <span style={{ fontSize: 12, color: "#15803D", fontWeight: 600 }}>Área protegida  </div>
 <Field label="Usuario">
 <input value={u} onChange={e => { setU(e.target.value); setErr(''); }} placeholde autoCapitalize="none" autoCorrect="off" autoComplete="username"
 onKeyDown={e => e.key === 'Enter' && login()}
 style={{ width: "100%", background: T.bg, border: `1.5px solid ${err ? '#FECA </Field>
 <Field label="Contraseña">
 <div style={{ position: "relative" }}>
 <input type={showPass ? "text" : "password"} value={p} onChange={e => { setP( placeholder="••••••••" autoComplete="current-password"
 onKeyDown={e => e.key === 'Enter' && login()}
 style={{ width: "100%", background: T.bg, border: `1.5px solid ${err ? '# <button onClick={() => setShowPass(v => !v)} type="button"
 style={{ position: "absolute", right: 10, top: "50%", transform: "transla {showPass
 ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d }
 </button>
 </div>
 </Field>
 {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadiu <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="ev {err}
 </div>}
 <PBtn full onClick={login}>Ingresar</PBtn>
 <div style={{ marginTop: 14, background: T.bg, borderRadius: 10, padding: "10px 12px" <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppe <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
 {ADMIN_CREDS.map(c => (<div key={c.user} style={{ background: T.card, border: <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent,#1D4ED8 <div style={{ fontSize: 10, color: T.sub, marginTop: 2 }}>Usuario: <stron <div style={{ fontSize: 10, color: T.sub }}>Clave: <strong>{c.pass}</stro </div>))}
 </div>
 </div>
 </Sheet>);
}
const NAV_DEFS = [
 { id: "chat", tk: "nav_ia", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="c { id: "dashboard", tk: "nav_inicio", icon: <svg width="22" height="22" viewBox="0 0 24 24 { id: "obras", tk: "nav_obras", icon: <svg width="22" height="22" viewBox="0 0 24 24" fil { id: "personal", tk: "nav_personal", icon: <svg width="22" height="22" viewBox="0 0 24 2 { id: "cargar", tk: "nav_cargar", icon: <svg width="22" height="22" viewBox="0 0 24 24" f { id: "mas", tk: "nav_mas", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="c];
function BottomNav({ view, setView, alerts, cfg }) {
 return (<nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(- {NAV_DEFS.map(n => {
 const active = view === n.id; const badge = n.id === "dashboard" && alerts.filter <button key={n.id} onClick={() => setView(n.id)} style={{ flex: 1, display: " {n.id === "cargar" ? <div style={{ width: 46, height: 46, borderRadius: " <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: n.id = {badge && <div style={{ position: "absolute", top: 4, right: "calc(50% -  </button>
 );
 })}
 </nav>);
}
function Dashboard({ lics, obras, personal, alerts, setView, setDetailObraId, requireAuth, cf const UBICS = getUbics(cfg);
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <div style={{ background: T.navy, padding: "16px 18px 20px" }}>
 <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 3 }}>{t( <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{t(cfg, 'dash_titul <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>{new D <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, ma {[{ l: t(cfg, 'dash_licitaciones'), v: lics.filter(l => !["adjudicada", "desc <div key={k.l} style={{ background: "rgba(255,255,255,.08)", borderRadius <div style={{ fontSize: 22, fontWeight: 800, color: k.c }}>{k.v}</div <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", marginTop:  </div>
 ))}
 </div>
 </div>
 <div style={{ padding: "14px 18px" }}>
 {alerts.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ fontSize: 1 <div style={{ marginBottom: 16 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: " <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: <button onClick={() => setView("obras")} style={{ fontSize: 12, color: T. </div>
 {obras.filter(o => o.estado === "curso").map(o => (<Card key={o.id} onClick={ <div style={{ display: "flex", justifyContent: "space-between", marginBot <div style={{ height: 4, background: T.bg, borderRadius: 4, marginBottom: <div style={{ fontSize: 11, color: T.muted }}>{UBICS.find(a => a.id === o </Card>))}
 </div>
 <div>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 8, t <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 {[{ label: t(cfg, 'dash_nueva_lic'), view: "licitaciones", lock: true, ic <button key={a.label} onClick={() => a.lock ? requireAuth(() => setVi
 <div style={{ fontSize: 16, marginBottom: 4 }}>{a.icon}</div>
 <div style={{ fontSize: 12, fontWeight: 600, color: T.text, lineH {a.lock && <div style={{ position: "absolute", top: 8, right: 8,  </button>
 ))}
 </div>
 </div>
 </div>
 </div>);
}
function formatMonto(val) {
 // Quitar todo excepto dígitos
 const nums = val.replace(/[^\d]/g, '');
 if (!nums) return '';
 // Formatear con puntos cada 3 dígitos y $ al final
 return nums.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' $';
}
function parseMonto(val) { return val.replace(/[^\d]/g, ''); }
function MontoInput({ value, onChange, placeholder }) {
 const [display, setDisplay] = useState(value ? formatMonto(parseMonto(value)) : value ||  useEffect(() => { setDisplay(value ? formatMonto(parseMonto(value)) : value || ''); }, [v function handleChange(e) {
 const raw = parseMonto(e.target.value);
 const fmt = raw ? formatMonto(raw) : '';
 setDisplay(fmt);
 onChange(fmt);
 }
 return <input value={display} onChange={handleChange} placeholder={placeholder || '0 $'} }
function DocGrid({ docs, onUpload, onRemove, refs, prefix }) {
 return (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{LIC_DOC const doc = docs?.[d.id]; const rk = `${prefix}_${d.id}`; return (<div key={d.id}><in {doc ? (<div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borde ) : (<button onClick={() => refs.current[rk]?.click()} style={{ width: "100%", ba })}</div>);
}
function Licitaciones({ lics, setLics, requireAuth, cfg, obras, setObras }) {
 const UBICS = getUbics(cfg);
 const [ap, setAp] = useState("todos"); const [showNew, setShowNew] = useState(false); con const [form, setForm] = useState({ nombre: "", ap: "aep", estado: "visitar", monto: "", f const docRefs = useRef({}); const newDocRefs = useRef({});
 const filtered = lics.filter(l => ap === "todos" || l.ap === ap);
 // Crea una obra en curso automáticamente cuando una licitación pasa a adjudicada
 function autoCrearObra(lic) {
 const yaExiste = obras.some(o => o.lic_id === lic.id);
 if (yaExiste) return;
 const nuevaObra = {
 id: uid(),
 lic_id: lic.id,
 nombre: lic.nombre,
 ap: lic.ap,
 sector: lic.sector || "",
 estado: "curso",
 avance: 0,
 inicio: new Date().toLocaleDateString("es-AR"),
 cierre: "",
 obs: [{ id: uid(), txt: `Obra creada automáticamente al adjudicar la licitación.` fotos: [],
 archivos: [],
 informes: [],
 docs: {},
 };
 setObras(p => [...p, nuevaObra]);
 }
 function cambiarEstado(licId, nuevoEstado) {
 setLics(p => p.map(l => {
 if (l.id !== licId) return l;
 if ((nuevoEstado === "adjudicada" || nuevoEstado === "curso") && l.estado !== nue return { ...l, estado: nuevoEstado };
 }));
 }
 function add() { if (!form.nombre.trim()) return; setLics(p => [...p, { ...form, id: uid( function del(id) { setLics(p => p.filter(l => l.id !== id)); setShowDetail(null); }
 async function handleDoc(licId, did, file) { const url = await toDataUrl(file); setLics(p async function handleNewDoc(did, file) { const url = await toDataUrl(file); setForm(f =>  const detail = showDetail ? lics.find(l => l.id === showDetail) : null;
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title="Licitaciones" sub={`${filtered.length} registros`} right={<PlusBtn  <div style={{ padding: "10px 18px", display: "flex", gap: 6, overflowX: "auto" }}>{[{ <div style={{ padding: "0 18px" }}>
 {LIC_ESTADOS.map(est => { const items = filtered.filter(l => l.estado === est.id) </div>
 {showNew && (<Sheet title="Nueva licitación" onClose={() => setShowNew(false)}><Field {detail && (<Sheet title={detail.nombre} onClose={() => setShowDetail(null)}>
 <Field label="Nombre">
 <TInput value={detail.nombre} onChange={e => setLics(p => p.map(l => l.id === </Field>
 <FieldRow>
 <Field label="Aeropuerto">
 <Sel value={detail.ap} onChange={e => setLics(p => p.map(l => l.id === de {AIRPORTS.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name </Sel>
 </Field>
 <Field label="Monto">
 <MontoInput value={detail.monto || ''} onChange={v => setLics(p => p.map( </Field>
 </FieldRow>
 <FieldRow>
 <Field label="Sector">
 <TInput value={detail.sector || ''} onChange={e => setLics(p => p.map(l = </Field>
 <Field label="Fecha">
 <TInput value={detail.fecha || ''} onChange={e => setLics(p => p.map(l => </Field>
 </FieldRow>
 <div style={{ marginBottom: 16 }}><Lbl>Documentos</Lbl><DocGrid docs={detail.docs <Field label="Estado">
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
 {LIC_ESTADOS.map(e => (<button key={e.id} onClick={() => cambiarEstado(de </div>
 </Field>
 {(detail.estado === "adjudicada" || detail.estado === "curso") && (() => { const  <div style={{ background: "#ECFDF5", border: "1px solid #86EFAC", borderRadiu <svg width="14" height="14" viewBox="0 0 24 24" fill="#10B981"><path fill <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, col </div>
 ) : (
 <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadiu <div style={{ fontSize: 12, color: "#92400E", fontWeight: 600 }}>⚠ Sin ob <button onClick={() => autoCrearObra(detail)} style={{ background: "#F59E </div>
 ); })()}
 <PBtn full variant="danger" onClick={() => del(detail.id)}>Eliminar</PBtn>
 </Sheet>)}
 </div>);
}
function TabFotos({ detail, upd, fileRef, handleFoto, apiKey, cfg }) {
 const [loadingIA, setLoadingIA] = useState(false);
 const [informe, setInforme] = useState('');
 const [selFotos, setSelFotos] = useState([]);// ids de fotos seleccionadas para analizar
 const [modoSel, setModoSel] = useState(false);
 const fotos = detail.fotos || [];
 function toggleSel(id) { setSelFotos(p => p.includes(id) ? p.filter(x => x !== id) : [... async function analizarFotos() {
 if (!apiKey) { setInforme('⚠ Configurá tu API Key en Más → Configuración para usar es const fotosAAnalizar = selFotos.length > 0 ? fotos.filter(f => selFotos.includes(f.id if (!fotosAAnalizar.length) { setInforme('Agregá al menos una foto para analizar.');  setLoadingIA(true); setInforme('');
 try {
 const content = [];
 fotosAAnalizar.forEach(f => {
 try { content.push({ type: 'image', source: { type: 'base64', media_type: get });
 content.push({
 type: 'text', text: `Analizá estas ${fotosAAnalizar.length} fotos de la obra Generá un informe profesional AA2000 con:
1. **Estado general de la obra** — describí lo que se ve en las fotos
2. **Avance estimado** — ¿coincide con el ${detail.avance}% declarado?
3. **Trabajos en ejecución** — qué trabajos se observan
4. **Correcciones y recomendaciones** — anomalías, riesgos, trabajos incorrectos o mejorables
5. **Alertas de seguridad** — EPP, orden, señalización
6. **Conclusión** — estado global y próximos pasos sugeridos
Usá un tono técnico y profesional. Respondé en español rioplatense.`});
 const r = await callAI([{ role: 'user', content }],
 `Sos un inspector de obras aeroportuarias para AA2000. Analizás fotos y gener apiKey);
 setInforme(r);
 // Guardar el informe generado dentro de la obra
 const nuevoInf = { id: uid(), titulo: `Análisis IA — ${new Date().toLocaleDateStr upd(detail.id, { informes: [nuevoInf, ...(detail.informes || [])] });
 } catch (e) { setInforme('Error al analizar: ' + e.message); }
 setLoadingIA(false); setModoSel(false); setSelFotos([]);
 }
 return (<div>
 <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFoto} styl {/* Barra de acciones */}
 <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
 <PBtn onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: "11px 0 {fotos.length > 0 && <button onClick={() => { setModoSel(v => !v); setSelFotos([] {modoSel ? "Cancelar" : "Seleccionar"}
 </button>}
 </div>
 {/* Botón analizar */}
 {fotos.length > 0 && (<button onClick={analizarFotos} disabled={loadingIA} style={{ w {loadingIA
 ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255, : <><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path fillRu </button>)}
 {modoSel && <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginBo {/* Grilla de fotos */}
 {fotos.length === 0
 ? <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBo {fotos.map(f => {
 const sel = selFotos.includes(f.id); return (<div key={f.id} onClick={()  {sel && <div style={{ position: "absolute", top: 5, right: 5, width:  <img src={f.url} alt="" style={{ width: "100%", aspectRatio: "4/3", o <div style={{ padding: "5px 8px", fontSize: 9, color: T.muted, backgr <button onClick={e => { e.stopPropagation(); upd(detail.id, { fotos:  </div>);
 })}
 </div>}
 {/* Informe generado */}
 {informe && (<Card style={{ padding: "14px" }}>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-betwe <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{  <div style={{ display: "flex", gap: 6 }}>
 <button onClick={() => { try { navigator.clipboard.writeText(informe); }  <button onClick={() => { const b = new Blob([informe], { type: 'text/plai <button onClick={() => setInforme('')} style={{ background: "#FEF2F2", bo </div>
 </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "12px 14px", fontSi <div style={{ fontSize: 10, color: "#10B981", marginTop: 8, fontWeight: 600 }}>✓  </Card>)}
 </div>);
}
function TabInformes({ detail, upd }) {
 const [subTab, setSubTab] = useState("diario");
 const [showNew, setShowNew] = useState(false);
 const [form, setForm] = useState({ titulo: '', tipo: 'diario', fecha: '', notas: '' });
 const fileRef = useRef(null);
 const informes = detail.informes || [];
 const TIPOS_INF = [
 { id: 'diario', label: 'Diario', color: '#3B82F6', bg: '#EFF6FF' },
 { id: 'semanal', label: 'Semanal', color: '#7C3AED', bg: '#F5F3FF' },
 { id: 'ingeniero', label: 'Ingeniero', color: '#10B981', bg: '#ECFDF5' },
 ];
 async function handleFile(e) {
 const files = Array.from(e.target.files);
 const nuevos = [];
 for (const f of files) {
 const url = await toDataUrl(f);
 nuevos.push({
 id: uid(),
 titulo: form.titulo || f.name.replace(/\.[^.]+$/, ''),
 tipo: form.tipo || subTab,
 fecha: form.fecha || new Date().toLocaleDateString('es-AR'),
 notas: form.notas,
 nombre: f.name,
 ext: f.name.split('.').pop().toUpperCase(),
 url,
 size: (f.size / 1024).toFixed(0) + 'KB',
 cargado: new Date().toLocaleDateString('es-AR'),
 });
 }
 upd(detail.id, { informes: [...nuevos, ...informes] });
 setForm({ titulo: '', tipo: 'diario', fecha: '', notas: '' });
 setShowNew(false);
 e.target.value = '';
 }
 const filtered = informes.filter(i => i.tipo === subTab);
 const tp = TIPOS_INF.find(x => x.id === subTab);
 return (<div>
 {/* Sub-tabs */}
 <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
 {TIPOS_INF.map(tipo => (<button key={tipo.id} onClick={() => setSubTab(tipo.id)}  </div>
 {/* Botón subir */}
 <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png" m <button onClick={() => setShowNew(true)} style={{ width: "100%", background: tp?.bg,  <span style={{ fontSize: 18, color: tp?.color }}>+</span>
 <span style={{ fontSize: 13, fontWeight: 700, color: tp?.color }}>Subir informe { </button>
 {/* Lista */}
 {filtered.length === 0
 ? <div style={{ textAlign: "center", padding: "28px 0", color: T.muted, fontSize: : filtered.map(inf => (<div key={inf.id} style={{ display: "flex", alignItems: "c <div style={{ width: 38, height: 38, borderRadius: 9, background: tp?.bg, dis <span style={{ fontSize: 9, fontWeight: 800, color: tp?.color }}>{inf.ext </div>
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: "hi <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{inf.fecha} · {inf.notas && <div style={{ fontSize: 10, color: T.sub, marginTop: 2, ove </div>
 <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
 <a href={inf.url} download={inf.nombre} style={{ textDecoration: "none" } <button style={{ background: T.accentLight, border: `1px solid ${T.bo </a>
 <button onClick={() => upd(detail.id, { informes: informes.filter(x => x. </div>
 </div>))}
 {/* Sheet nuevo informe */}
 {showNew && (<Sheet title={`Subir informe ${tp?.label}`} onClose={() => setShowNew(fa <Field label="Título (opcional)">
 <TInput value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.ta </Field>
 <FieldRow>
 <Field label="Tipo">
 <Sel value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.targe {TIPOS_INF.map(t => <option key={t.id} value={t.id}>{t.label}</option </Sel>
 </Field>
 <Field label="Fecha">
 <TInput value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e. </Field>
 </FieldRow>
 <Field label="Notas">
 <textarea value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.ta </Field>
 <PBtn full onClick={() => fileRef.current?.click()}> Seleccionar archivo</PBtn>
 <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 8 }}> </Sheet>)}
 </div>);
}
function Obras({ obras, setObras, lics, detailId, setDetailId, requireAuth, cfg, apiKey }) {
 const UBICS = getUbics(cfg); const LUBIC = getLabelUbic(cfg);
 const [showNew, setShowNew] = useState(false); const [tab, setTab] = useState("info");
 const [form, setForm] = useState({ nombre: "", ap: "aep", sector: "", estado: "pendiente" const [newObs, setNewObs] = useState(""); const fileRef = useRef(null); const archRef = u
 const detail = detailId ? obras.find(o => o.id === detailId) : null;
 function add() { if (!form.nombre.trim()) return; setObras(p => [...p, { ...form, id: uid function upd(id, patch) { setObras(p => p.map(o => o.id === id ? { ...o, ...patch } : o)) async function handleFoto(e) { if (!detail) return; for (const f of Array.from(e.target.f async function handleArch(e) { if (!detail) return; for (const f of Array.from(e.target.f const ec = id => OBRA_ESTADOS.find(e => e.id === id) || OBRA_ESTADOS[0];
 if (detail) {
 const e = ec(detail.estado); return (
 <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title={detail.nombre} sub={`${UBICS.find(a => a.id === detail.ap)? <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padd <div style={{ display: "flex", justifyContent: "space-between", marginBot <div style={{ height: 8, background: T.bg, borderRadius: 4 }}><div style= <div style={{ display: "flex", justifyContent: "space-between", marginTop <input type="range" min="0" max="100" value={detail.avance} onChange={e = </div>
 <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, disp <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom {tab === "info" && (<div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10 <div style={{ fontSize: 10, color: T.muted, marginBottom: 5,  <select value={detail.ap} onChange={e => upd(detail.id, { ap: {UBICS.map(a => <option key={a.id} value={a.id}>{a.code}  </select>
 </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10 <div style={{ fontSize: 10, color: T.muted, marginBottom: 5,  <input value={detail.sector || ''} onChange={e => upd(detail. </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10 <div style={{ fontSize: 10, color: T.muted, marginBottom: 5,  <input value={detail.inicio || ''} onChange={e => upd(detail. </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10 <div style={{ fontSize: 10, color: T.muted, marginBottom: 5,  <input value={detail.cierre || ''} onChange={e => upd(detail. </div>
 </div>
 <Lbl>{t(cfg, 'obras_estado')}</Lbl>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 <button onClick={() => { setObras(p => p.filter(o => o.id !== detail. </div>)}
 {tab === "obs" && (<div><div style={{ display: "flex", gap: 8, marginBott {tab === "fotos" && (<TabFotos detail={detail} upd={upd} fileRef={fileRef {tab === "archivos" && (<div><input ref={archRef} type="file" accept=".pd {tab === "informes" && <TabInformes detail={detail} upd={upd} />}
 </div>
 </div>
 );
 }
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title={t(cfg, 'obras_titulo')} sub={`${obras.length} registros`} right={<P <div style={{ padding: "14px 18px" }}>{OBRA_ESTADOS.map(est => { const items = obras. {showNew && (<Sheet title={t(cfg, 'obras_nueva')} onClose={() => setShowNew(false)}>< </div>);
}
function Personal({ personal, setPersonal, obras, cfg }) {
 const [showNew, setShowNew] = useState(false); const [expanded, setExpanded] = useState(n const [form, setForm] = useState({ nombre: "", rol: "Técnico", empresa: "BelfastCM", obra const fileRefs = useRef({}); const fotoRefs = useRef({}); const newFotoRef = useRef(null) function ini(n) { return n.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCa function add() { if (!form.nombre.trim()) return; setPersonal(p => [...p, { ...form, id:  function upd(id, patch) { setPersonal(p => p.map(x => x.id === id ? { ...x, ...patch } :  async function handleDoc(pid, did, file) { const url = await toDataUrl(file); setPersonal function setVence(pid, did, val) { setPersonal(p => p.map(x => x.id === pid ? { ...x, doc const Av = ({ p, size = 38, showCam = false, onClick }) => (<div onClick={onClick} style= return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title={t(cfg, 'pers_titulo')} sub={`${personal.length} trabajadores`} righ <div style={{ padding: "14px 18px" }}>
 {personal.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", c {personal.map(p => {
 const docsOk = Object.values(p.docs || {}).filter(Boolean).length; const isOp <div onClick={() => setExpanded(isOpen ? null : p.id)} style={{ display:  <Av p={p} size={40} />
 <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, <div style={{ display: "flex", gap: 3, marginRight: 4 }}>{DOC_TYPES.m <span style={{ fontSize: 11, color: T.muted }}>{docsOk}/{DOC_TYPES.le <span style={{ fontSize: 14, color: T.muted, marginLeft: 2 }}>{isOpen </div>
 {isOpen && (<div style={{ padding: "0 14px 14px", borderTop: `1px solid $ <div style={{ display: "flex", gap: 14, marginTop: 14, marginBottom:  <div style={{ flexShrink: 0 }}><input type="file" accept="image/* <div style={{ flex: 1 }}><Lbl>WhatsApp</Lbl><div style={{ display </div>
 <Lbl>Documentación</Lbl>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 {DOC_TYPES.map(d => { const doc = p.docs?.[d.id]; const rk = `${p </div>
 <button onClick={() => { setPersonal(prev => prev.filter(x => x.id != </div>)}
 </Card>);
 })}
 </div>
 {showNew && (<Sheet title={t(cfg, 'pers_nuevo')} onClose={() => setShowNew(false)}>
 <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><inp <Field label={t(cfg, 'pers_nombre')}><TInput value={form.nombre} onChange={e => s <FieldRow><Field label={t(cfg, 'pers_rol')}><Sel value={form.rol} onChange={e =>  <Field label={t(cfg, 'pers_whatsapp')}><TInput value={form.telefono} onChange={e  <Field label={t(cfg, 'pers_obra')}><Sel value={form.obra_id} onChange={e => setFo <PBtn full onClick={add} disabled={!form.nombre.trim()}>{t(cfg, 'pers_agregar')}< </Sheet>)}
 </div>);
}
function CargarView({ obras, setObras, cargarState, setCargarState, apiKey }) {
 const { obraId, newFotos, report } = cargarState;
 const [loading, setLoading] = useState(false);
 const camRef = useRef(null); const galRef = useRef(null);
 const setObraId = v => setCargarState(s => ({ ...s, obraId: v, newFotos: [], report: '' } const setNewFotos = fn => setCargarState(s => ({ ...s, newFotos: typeof fn === 'function' const setReport = v => setCargarState(s => ({ ...s, report: v }));
 const obra = obras.find(o => o.id === obraId); const prevFotos = obra?.fotos || [];
 async function handleFotos(e) { for (const f of Array.from(e.target.files)) { const url = async function generateReport() {
 if (!obra || !newFotos.length) return; setLoading(true); setReport('');
 try {
 const content = []; prevFotos.slice(-4).forEach(f => { try { content.push({ type: const pTxt = prevFotos.length > 0 ? `Las primeras ${Math.min(prevFotos.length, 4) content.push({ type: 'text', text: `Generá informe de avance para "${obra.nombre} let reportText = '';
 if (typeof window !== 'undefined' && window.claude?.complete) {
 const imgMsgs = content.filter(b => b.type === 'image');
 const txtMsg = content.find(b => b.type === 'text');
 reportText = await window.claude.complete(txtMsg?.text || 'Analizá estas foto } else {
 if (!apiKey) { setReport('⚠ Configurá tu API Key en Más → Configuración.'); s const headers = { "Content-Type": "application/json", "anthropic-dangerous-di const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POS const d = await r.json(); reportText = d.content?.map(b => b.text || '').join }
 setReport(reportText);
 setObras(p => p.map(o => o.id === obraId ? { ...o, fotos: [...o.fotos, ...newFoto } catch { setReport('Error de conexión.'); } setLoading(false);
 }
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title="Registro de Avance" sub="Fotos + Informe IA" />
 <div style={{ padding: "14px 18px" }}>
 <Card style={{ padding: "16px", marginBottom: 12 }}>
 <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12
 <Sel value={obraId} onChange={e => setObraId(e.target.value)}><option value=" {obra && <div style={{ marginTop: 10, background: T.accentLight, borderRadius </Card>
 {obra && (<Card style={{ padding: "16px", marginBottom: 12 }}>
 <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin <input ref={camRef} type="file" accept="image/*" capture="environment" mu <input ref={galRef} type="file" accept="image/*" multiple onChange={handl <button onClick={() => camRef.current?.click()} style={{ background: "#11 <svg width="46" height="38" viewBox="0 0 92 76" fill="none"><rect x=" Tomar foto
 </button>
 <button onClick={() => galRef.current?.click()} style={{ background: "#f8 <svg width="46" height="38" viewBox="0 0 92 76" fill="none"><rect x=" Galería / PC
 </button>
 </div>
 {newFotos.length > 0 && <div style={{ display: "grid", gridTemplateColumns: " {prevFotos.length > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, co </Card>)}
 {obra && (<Card style={{ padding: "16px", marginBottom: 12 }}>
 <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 <button onClick={generateReport} disabled={!newFotos.length || loading} style {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba </button>
 </Card>)}
 {report && (<Card style={{ padding: "16px" }}><div style={{ display: "flex", just {!obra && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ f </div>
 </div>);
}
function PresupuestoView({ tipo, setView }) {
 const titulo = tipo === 'materiales' ? 'Presupuesto Materiales' : 'Subcontratos';
 const [items, setItems] = useState([]); const [showNew, setShowNew] = useState(false);
 const [form, setForm] = useState({ descripcion: '', proveedor: '', monto: '', obra: '', e const [loaded, setLoaded] = useState(false); const key = `bcm_presup_${tipo}`;
 useEffect(() => { (async () => { try { const r = await window.storage.get(key); if (r?.va useEffect(() => { if (loaded) window.storage.set(key, JSON.stringify(items)).catch(() =>  const ESTADOS = [{ id: 'pendiente', label: 'Pendiente', color: '#F59E0B', bg: '#FFFBEB' } const total = items.reduce((s, i) => { const n = parseFloat((i.monto || '').replace(/[^0- function add() { if (!form.descripcion.trim()) return; setItems(p => [...p, { ...form, id return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title={titulo} back onBack={() => setView('dashboard')} sub={`${items.leng <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
 <Card style={{ padding: "16px", marginBottom: 14, background: T.navy, color: "#ff {items.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", color
 </div>
 {showNew && (<Sheet title={`Nuevo – ${titulo}`} onClose={() => setShowNew(false)}><Fi </div>);
}
function PanelVigilancia({ setView }) {
 const [camaras, setCamaras] = useState([]); const [showNew, setShowNew] = useState(false) const [form, setForm] = useState({ nombre: '', url: '', sector: '', ap: 'aep', tipo: 'ip' useEffect(() => { (async () => { try { const r = await window.storage.get('bcm_camaras'); useEffect(() => { if (loaded) window.storage.set('bcm_camaras', JSON.stringify(camaras)). function add() { if (!form.nombre || !form.url) return; setCamaras(p => [...p, { ...form, return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title="Panel de Vigilancia" back onBack={() => setView("mas")} sub="Cámara <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
 <div style={{ background: T.navy, borderRadius: 14, padding: "16px", marginBottom <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 1 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}> </div>
 {camaras.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", col </div>
 {showNew && (<Sheet title="Agregar cámara" onClose={() => setShowNew(false)}><Field l </div>);
}
function Presentismo({ personal, setView }) {
 const [registros, setRegistros] = useState({}); const [scanning, setScanning] = useState( useEffect(() => { (async () => { try { const r = await window.storage.get('bcm_presentism useEffect(() => { if (loaded) window.storage.set('bcm_presentismo', JSON.stringify({ regi const today = new Date().toLocaleDateString('es-AR');
 function simulateScan(persona) { if (scanning) return; setScanning(true); setScanResult(n const todayRecords = Object.entries(registros).filter(([k]) => k.endsWith(today)).map(([, const FP = ({ active, ok }) => { const c = active ? 'var(--accent,#1D4ED8)' : ok ? '#10B9 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title="Control de Presentismo" back onBack={() => setView("mas")} sub="Bio <div style={{ padding: "14px 18px" }}>
 <Card style={{ padding: "14px 16px", marginBottom: 12 }}><Lbl>Sistema biométrico  <Card style={{ padding: "20px 16px", marginBottom: 12 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 16,  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}> {scanning && <div style={{ textAlign: "center", marginBottom: 12, fontSize: 1 {scanResult && !scanning && (<div style={{ textAlign: "center", marginBottom: {personal.length === 0 ? <div style={{ textAlign: "center", color: T.muted, f </Card>
 {todayRecords.length > 0 && (<Card style={{ padding: "14px 16px" }}><Lbl>Resumen  </div>
 </div>);
}
// ── INFORMES DEL INGENIERO ─────────────────────────────────────────────
function InformesIngeniero({ setView }) {
 const [informes, setInformes] = useState([]); const [loaded, setLoaded] = useState(false) const [showNew, setShowNew] = useState(false); const [form, setForm] = useState({ titulo: const fileRef = useRef(null); const [uploading, setUploading] = useState(false);
 useEffect(() => { (async () => { try { const r = await window.storage.get('bcm_inf_ing'); useEffect(() => { if (loaded) window.storage.set('bcm_inf_ing', JSON.stringify(informes)) const TIPOS = [{ id: 'visita', label: 'Visita de obra', color: '#3B82F6', bg: '#EFF6FF' } async function handleFile(e) {
 setUploading(true);
 const files = Array.from(e.target.files);
 const nuevos = [];
 for (const f of files) {
 const url = await toDataUrl(f);
 nuevos.push({ id: uid(), titulo: form.titulo || f.name.replace(/\.[^.]+$/, ''), o }
 setInformes(p => [...nuevos, ...p]);
 setForm({ titulo: '', obra: '', tipo: 'visita', fecha: '', notas: '' });
 setShowNew(false); setUploading(false);
 e.target.value = '';
 }
 const tipoMap = t => TIPOS.find(x => x.id === t) || TIPOS[0];
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title="Informes del Ingeniero" back onBack={() => setView("mas")} sub={`${ <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
 {informes.length === 0 && <div style={{ textAlign: "center", padding: "48px 0" }} {TIPOS.map(tipo => {
 const items = informes.filter(i => i.tipo === tipo.id);
 if (!items.length) return null;
 return (<div key={tipo.id} style={{ marginBottom: 16 }}>
 <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom {items.map(inf => (<Card key={inf.id} style={{ padding: "13px 14px", marg <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
 <div style={{ width: 42, height: 42, borderRadius: 10, background <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: T.text, o <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{ {inf.notas && <div style={{ fontSize: 11, color: T.sub, margi </div>
 <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
 <a href={inf.url} download={inf.nombre} style={{ textDecorati <button onClick={() => setInformes(p => p.filter(x => x.id != </div>
 </div>
 </Card>))}
 </div>);
 })}
 </div>
 <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png" m {showNew && (<Sheet title="Subir informe" onClose={() => setShowNew(false)}>
 <Field label="Título"><TInput value={form.titulo} onChange={e => setForm(p => ({  <FieldRow>
 <Field label="Obra"><TInput value={form.obra} onChange={e => setForm(p => ({  <Field label="Fecha"><TInput value={form.fecha} onChange={e => setForm(p => ( </FieldRow>
 <Field label="Tipo de informe">
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
 {TIPOS.map(tp => (<button key={tp.id} onClick={() => setForm(p => ({ ...p </div>
 </Field>
 <Field label="Notas"><textarea value={form.notas} onChange={e => setForm(p => ({  <PBtn full onClick={() => fileRef.current?.click()} disabled={uploading}>{uploadi <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 8 }}> </Sheet>)}
 </div>);
}
// ── INFORMES IA ────────────────────────────────────────────────────────
function InformesIA({ obras, personal, lics, alerts, setView, apiKey, cfg }) {
 const [tab, setTab] = useState("generar");
 const [modeloDiario, setModeloDiario] = useState('');
 const [modeloSemanal, setModeloSemanal] = useState('');
 const [informes, setInformes] = useState([]);
 const [loading, setLoading] = useState(null); // 'diario'|'semanal'|null
 const [obraId, setObraId] = useState('');
 const [loaded, setLoaded] = useState(false);
 useEffect(() => {
 (async () => {
 try {
 const r = await window.storage.get('bcm_inf_ia'); if (r?.value) { const d = J } catch { } setLoaded(true);
 })();
 }, []);
 useEffect(() => { if (loaded) window.storage.set('bcm_inf_ia', JSON.stringify({ informes, const obra = obras.find(o => o.id === obraId);
 async function generar(tipo) {
 if (!apiKey) { alert("Configurá tu API Key primero en Más → Configuración"); return;  const modelo = tipo === 'diario' ? modeloDiario : modeloSemanal;
 setLoading(tipo);
 const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric
 const obraInfo = obra ? `Obra: ${obra.nombre} | Aeropuerto: ${AIRPORTS.find(a => a.id const persInfo = personal.length ? `Personal en obra: ${personal.map(p => `${p.nombre const alertInfo = alerts.length ? `Alertas activas: ${alerts.map(a => a.msg).join(' | const prompt = modelo
 ? `Completá el siguiente modelo de informe ${tipo} con los datos reales de la obr : `Generá un informe ${tipo === 'diario' ? 'diario' : 'semanal'} de obra profesio try {
 const r = await callAI([{ role: "user", content: prompt }], "Sos un ingeniero civ const nuevo = { id: uid(), tipo, titulo: `Informe ${tipo} — ${new Date().toLocale setInformes(p => [nuevo, ...p]);
 setTab("historial");
 } catch { alert("Error al generar. Verificá la API Key."); }
 setLoading(null);
 }
 function descargar(inf) {
 const b = new Blob([inf.texto], { type: 'text/plain;charset=utf-8' });
 const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download =  }
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde <AppHeader title="Informes IA" back onBack={() => setView("mas")} sub="Diarios y sema <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, display: "fl {[["generar", "Generar"], ["modelos", "Modelos"], ["historial", `Historial (${inf </div>
 <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
 {tab === "generar" && (<div>
 <Card style={{ padding: "14px 16px", marginBottom: 12, background: T.navy, bo <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom:  <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1. </Card>
 <Field label="Obra (opcional)">
 <select value={obraId} onChange={e => setObraId(e.target.value)} style={{ <option value="">— Datos generales —</option>
 {obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
 </select>
 </Field>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margi <button onClick={() => generar('diario')} disabled={!!loading} style={{ b {loading === 'diario' ? <div style={{ width: 24, height: 24, border:  <div><div style={{ fontSize: 14, fontWeight: 700 }}>Informe Diario</d </button>
 <button onClick={() => generar('semanal')} disabled={!!loading} style={{  {loading === 'semanal' ? <div style={{ width: 24, height: 24, border: <div><div style={{ fontSize: 14, fontWeight: 700 }}>Informe Semanal</
 </button>
 </div>
 {!apiKey && <div style={{ marginTop: 12, background: "#FEF2F2", border: "1px  </div>)}
 {tab === "modelos" && (<div>
 <div style={{ background: T.accentLight, border: `1px solid ${T.border}`, bor Cargá tu modelo de informe. La IA lo va a completar con los datos reales  </div>
 <Field label="Modelo de informe DIARIO">
 <textarea
 value={modeloDiario}
 onChange={e => setModeloDiario(e.target.value)}
 placeholder={"INFORME DIARIO DE OBRA\nFecha: [FECHA]\nObra: [OBRA]\nA rows={10}
 style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.bo />
 </Field>
 <Field label="Modelo de informe SEMANAL">
 <textarea
 value={modeloSemanal}
 onChange={e => setModeloSemanal(e.target.value)}
 placeholder={"INFORME SEMANAL DE OBRA\nSemana: [FECHA]\nObra: [OBRA]\ rows={12}
 style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.bo />
 </Field>
 <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
 <button onClick={() => setModeloDiario('')} style={{ flex: 1, background: <button onClick={() => setModeloSemanal('')} style={{ flex: 1, background </div>
 <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600, textAlign: "ce </div>)}
 {tab === "historial" && (<div>
 {informes.length === 0 && <div style={{ textAlign: "center", padding: "48px 0 {informes.map(inf => (<Card key={inf.id} style={{ padding: "14px", marginBott <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginB <div style={{ width: 40, height: 40, borderRadius: 10, background: in <span style={{ fontSize: 9, fontWeight: 800, color: inf.tipo ===  </div>
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{in <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{inf. </div>
 <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
 <button onClick={() => descargar(inf)} style={{ background: T.acc
 <button onClick={() => { try { navigator.clipboard.writeText(inf. <button onClick={() => setInformes(p => p.filter(x => x.id !== in </div>
 </div>
 <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" </Card>))}
 </div>)}
 </div>
 </div>);
}
const CfgSection = memo(({ id, title, icon, children, openSec, setOpenSec }) => {
 const open = openSec === id;
 return (<div style={{ border: `1px solid ${T.border}`, borderRadius: T.rsm, marginBottom: <div onClick={() => setOpenSec(open ? null : id)} style={{ display: "flex", alignItem <span style={{ fontSize: 20 }}>{icon}</span>
 <span style={{ fontSize: 13, fontWeight: 700, color: open ? T.accent : T.text, fl <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{open ? "▲" : "▼" </div>
 {open && <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, back </div>);
});
function Mas({ setView, authed, setAuthed, requireAuth, cfg, setCfg, apiKey, setApiKey, cfgLo const [showConfig, setShowConfig] = useState(false);
 const [openSec, setOpenSec] = useState("cuenta");
 const [localCfg, setLocalCfg] = useState({ ...DEFAULT_CONFIG, ...cfg });
 const [localKey, setLocalKey] = useState(apiKey || '');
 const [showKey, setShowKey] = useState(false);
 const [hasUnsaved, setHasUnsaved] = useState(false);
 const [confirmClose, setConfirmClose] = useState(false);
 const [showLockConfirm, setShowLockConfirm] = useState(false);
 const [showUnlockModal, setShowUnlockModal] = useState(false);
 const [unlockUser, setUnlockUser] = useState('');
 const [unlockPass, setUnlockPass] = useState('');
 const [unlockErr, setUnlockErr] = useState('');
 const logoRef1 = useRef(null); const logoRef2 = useRef(null); const logoRef3 = useRef(nul function handleLock() { setCfgLocked(true); setShowLockConfirm(false); setShowConfig(fals function tryUnlock() {
 const f = ADMIN_CREDS.find(c => c.user === unlockUser.trim().toLowerCase() && c.pass  if (f) { setCfgLocked(false); setShowUnlockModal(false); setUnlockUser(''); setUnlock else { setUnlockErr('Usuario o contraseña incorrectos'); }
 }
 useEffect(() => { if (!showConfig) { setLocalCfg({ ...DEFAULT_CONFIG, ...cfg }); setHasUn
 // Detectar cambios pendientes comparando localCfg con cfg
 useEffect(() => {
 if (!showConfig) return;
 const a = JSON.stringify({ ...localCfg, logoBelfast: undefined, logoAA2000: undefined const b = JSON.stringify({ ...cfg, logoBelfast: undefined, logoAA2000: undefined, log setHasUnsaved(a !== b);
 }, [localCfg, cfg, showConfig]);
 const updateText = useCallback((patch) => { setLocalCfg(p => ({ ...p, ...patch })); }, [] const applyVisual = useCallback((patch) => { setCfg(p => ({ ...p, ...patch })); setLocalC const applyThemePreset = useCallback((preset) => { applyVisual({ themeId: preset.id, colo const applyColorKey = useCallback((key, value) => { const nc = { ...(cfg.colors || DEFAUL const guardarYCerrar = useCallback(() => {
 setCfg(p => ({ ...p, ...localCfg }));
 setApiKey(localKey);
 window.storage.set('bcm_apikey', localKey).catch(() => { });
 setHasUnsaved(false); setConfirmClose(false); setShowConfig(false);
 }, [localCfg, localKey, setCfg, setApiKey]);
 const handleSetOpenSec = useCallback((v) => setOpenSec(v), []);
 async function exportarJSX() {
 try {
 let src = __SOURCE_CODE__;
 // Limpiar datos pesados (base64)
 const licsClean = JSON.parse(JSON.stringify(lics)).map(l => ({ ...l, docs: {} })) const obrasClean = JSON.parse(JSON.stringify(obras)).map(o => ({ ...o, fotos: [], const personalClean = JSON.parse(JSON.stringify(personal)).map(p => ({ ...p, foto const alertsClean = JSON.parse(JSON.stringify(alerts));
 const { logoBelfast, logoAA2000, logoAsistente, logoCentral, ...cfgClean } = cfg;
 const licsStr = JSON.stringify(licsClean);
 const obrasStr = JSON.stringify(obrasClean);
 const personalStr = JSON.stringify(personalClean);
 const alertsStr = JSON.stringify(alertsClean);
 const cfgStr = JSON.stringify(cfgClean);
 // Reemplazar constantes con datos actuales
 let out = src;
 out = out.replace(/const DEMO_LICS = \[[\s\S]*?\];/, 'const DEMO_LICS = ' + licsS out = out.replace(/const DEMO_OBRAS = \[[\s\S]*?\];/, 'const DEMO_OBRAS = ' + obr out = out.replace(/const DEMO_PERSONAL = \[[\s\S]*?\];/, 'const DEMO_PERSONAL = ' out = out.replace(/const DEMO_ALERTS = \[[\s\S]*?\];/, 'const DEMO_ALERTS = ' + a out = out.replace(/const DEFAULT_CONFIG = \{[^\n]+\};/, 'const DEFAULT_CONFIG = ' const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
 const a = document.createElement('a');
 a.href = URL.createObjectURL(blob);
 a.download = 'belfast_cm_publicado_' + new Date().toLocaleDateString('es-AR').rep a.click();
 URL.revokeObjectURL(a.href);
 } catch (e) {
 alert('Error al exportar: ' + e.message);
 }
 }
 function tryClose() {
 if (hasUnsaved) { setConfirmClose(true); }
 else { setShowConfig(false); }
 }
 const MAS_ITEMS = [
 { id: "vigilancia", label: "Panel Vigilancia", sub: "Cámaras IP en vivo", icon: <svg  { id: "presentismo", label: "Presentismo", sub: "Control biométrico", icon: <svg widt { id: "licitaciones", label: "Licitaciones", sub: "Gestión y seguimiento", icon: <svg { id: "resumen", label: "Resumen ejecutivo", sub: "Indicadores y avances", icon: <svg { id: "mensajes", label: "Mensajes internos", sub: "Comunicaciones del equipo", icon: { id: "archivos", label: "Archivos", sub: "PDFs, planos, Excel", icon: <svg width="20 { id: "seguimiento", label: "Seguimiento", sub: "Alertas y pendientes", icon: <svg wi { id: "contactos", label: "Contactos", sub: "Agenda y emails", icon: <svg width="20"  { id: "whatsapp", label: "Grupos WhatsApp", sub: "Equipos de trabajo", icon: <svg wid ];
 return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
 <AppHeader title="Más opciones" right={authed && <button onClick={() => setAuthed(nul {authed && <div style={{ margin: "12px 18px 0", background: "#ECFDF5", border: "1px s <div style={{ padding: "14px 18px" }}>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margi {MAS_ITEMS.map(item => (<button key={item.id} onClick={() => setView(item.id) <div style={{ width: 40, height: 40, borderRadius: T.rsm, background: T.a <div style={{ fontSize: 11, fontWeight: 700, color: T.text, lineHeight: 1 </button>))}
 </div>
 <div style={{ height: 1, background: T.border, margin: "4px 0 14px" }} />
 <Card onClick={() => { if (cfgLocked) setShowUnlockModal(true); else requireAuth( <div style={{ width: 44, height: 44, borderRadius: T.rsm, background: cfgLock {cfgLocked
 ? <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path  : <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path  </div>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 14, fontWeight: 700, color: cfgLocked ? "#EF4444" <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{cfgLocked ? "T </div>
 <span style={{ fontSize: 18, color: cfgLocked ? "#EF4444" : T.accent }}>›</sp </Card>
 </div>
 {showConfig && !cfgLocked && (<Sheet title=" Configuración" onClose={tryClose}>
 {/* Banner cambios pendientes */}
 {hasUnsaved && !confirmClose && (
 <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadiu <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706"><path fill <span style={{ fontSize: 12, color: "#92400E", fontWeight: 600, flex: 1 } <button onClick={guardarYCerrar} style={{ background: "#D97706", border:  </div>
 )}
 {/* Diálogo confirmación cierre */}
 {confirmClose && (
 <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadiu <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBott <div style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 12, lineHeigh <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 <button onClick={() => { setConfirmClose(false); setShowConfig(false) <button onClick={guardarYCerrar} style={{ background: T.accent, borde </div>
 </div>
 )}
 <CfgSection id="cuenta" title="Cuenta y empresa" icon=" " openSec={openSec} setO <div style={{ marginBottom: 14 }}>
 <Lbl>API Key de Anthropic</Lbl>
 <div style={{ position: "relative" }}>
 <input
 type={showKey ? "text" : "password"}
 value={localKey}
 onChange={e => setLocalKey(e.target.value)}
 placeholder="sk-ant-api03-..."
 autoComplete="off"
 spellCheck={false}
 style={{ width: "100%", background: T.bg, border: `1.5px solid ${ />
 <button onClick={() => setShowKey(v => !v)} type="button" style={{ po {showKey
 ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" </button>
 </div>
 {localKey
 ? <div style={{ display: "flex", alignItems: "center", gap: 5, margin
 : <div style={{ fontSize: 10, color: T.muted, marginTop: 5, lineHeigh </div>
 <Field label="Email del asistente IA"><TInput value={localCfg.email || ''} on <Field label="Nombre de la empresa"><TInput value={localCfg.empresa || ''} on <FieldRow><Field label="Cargo"><TInput value={localCfg.cargo || ''} onChange= <Field label="Ciudad / Sede"><TInput value={localCfg.ciudad || ''} onChange={ </CfgSection>
 <CfgSection id="tema" title="Tema visual" icon=" " openSec={openSec} setOpenSec= <Lbl>Presets</Lbl>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8,  {THEME_PRESETS.map(p => {
 const active = localCfg.themeId === p.id; return (<button key={p.id}  <div style={{ display: "flex", gap: 3 }}>{[p.bg, p.card, p.border <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{p. {active && <div style={{ width: 6, height: 6, borderRadius: "50%" </button>);
 })}
 </div>
 <Lbl>Colores individuales</Lbl>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, ma {COLOR_KEYS.map(({ k, label }) => (<div key={k} style={{ textAlign: "cent <div style={{ position: "relative", width: "100%", paddingBottom: "10 <input type="color" value={(localCfg.colors || DEFAULT_COLORS)[k] </div>
 <div style={{ fontSize: 9, fontWeight: 600, color: T.sub }}>{label}</ </div>))}
 </div>
 <button onClick={() => applyThemePreset(THEME_PRESETS[0])} style={{ width: "1 </CfgSection>
 <CfgSection id="font" title="Tipografía" icon=" " openSec={openSec} setOpenSec={ <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 {FONTS.map(f => {
 const active = localCfg.fontId === f.id; return (<button key={f.id} o <div style={{ fontSize: 22, fontWeight: 700, color: active ? T.ac <div style={{ fontSize: 10, fontWeight: 600, color: active ? T.ac {active && <div style={{ width: 6, height: 6, borderRadius: "50%" </button>);
 })}
 </div>
 </CfgSection>
 <CfgSection id="forma" title="Forma de los elementos" icon=" " openSec={openSec} <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 } {RADIUS_OPTS.map(r => {
 const active = localCfg.radiusId === r.id; return (<button key={r.id}
 <div style={{ width: 36, height: 28, background: active ? T.accen <div style={{ fontSize: 10, fontWeight: 600, color: active ? T.ac </button>);
 })}
 </div>
 </CfgSection>
 <CfgSection id="logos" title="Logos y textos" icon=" " openSec={openSec} setOpen <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 <input ref={logoRef1} type="file" accept="image/*,.svg" style={{ display: "no <input ref={logoRef2} type="file" accept="image/*,.svg" style={{ display: "no <input ref={logoRef3} type="file" accept="image/*,.svg" style={{ display: "no <input ref={logoRef4} type="file" accept="image/*,.svg" style={{ display: "no <div style={{ marginBottom: 12 }}><Lbl>Logo botón micrófono (pantalla IA)</Lb <div style={{ border: `1.5px dashed ${T.border}`, borderRadius: T.rsm, pa {cfg.logoCentral
 ? (<div style={{ display: "flex", alignItems: "center", gap: 10,  : (<><div style={{ fontSize: 28, marginBottom: 4 }}> </div><div  </div>
 </div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, ma {[{ key: "logoBelfast", label: "Belfast", ref: logoRef1 }, { key: "logoAA <div key={key} style={{ border: `1.5px dashed ${T.border}`, borderRad {cfg[key] ? (<><img src={cfg[key]} alt={label} style={{ height: 3 : (<><div style={{ fontSize: 24, marginBottom: 3 }}> </div>< </div>
 ))}
 </div>
 <Field label="Título del asistente"><TInput value={localCfg.tituloAsistente | <Field label="Subtítulo"><TInput value={localCfg.subtituloAsistente || ''} on <div style={{ background: T.bg, borderRadius: T.rsm, padding: "12px", textAli <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom <div style={{ width: 60, height: 52, background: "#fff", borderRadius: 10 {cfg.logoAsistente ? <img src={cfg.logoAsistente} alt="" style={{ wid </div>
 <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: <div style={{ fontSize: 10, color: T.muted }}>{localCfg.subtituloAsistent </div>
 </CfgSection>
 <CfgSection id="ubicaciones" title="Ubicaciones / Aeropuertos" icon=" " openSec= <div style={{ fontSize: 11, color: T.muted, marginBottom: 14, lineHeight: 1.5 Editá el nombre, código y etiqueta de cada ubicación. Se usan en obras, l </div>
 <Field label="Etiqueta del campo">
 <TInput
 value={localCfg.labelUbicacion || 'Aeropuerto'}
 onChange={e => updateText({ labelUbicacion: e.target.value })}
 placeholder="Aeropuerto"
 />
 </Field>
 <Lbl>Ubicaciones</Lbl>
 {(localCfg.ubicaciones || DEFAULT_UBICACIONES).map((ub, i) => (
 <div key={ub.id} style={{ background: T.bg, borderRadius: T.rsm, padding: <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, marginB <FieldRow>
 <Field label="Código (ej: AEP)">
 <TInput
 value={ub.code}
 onChange={e => {
 const nuevas = [...(localCfg.ubicaciones || DEFAULT_U nuevas[i] = { ...nuevas[i], code: e.target.value.toUp setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }}
 placeholder="AEP"
 />
 </Field>
 <Field label="ID interno">
 <TInput
 value={ub.id}
 onChange={e => {
 const nuevas = [...(localCfg.ubicaciones || DEFAULT_U nuevas[i] = { ...nuevas[i], id: e.target.value.toLowe setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }}
 placeholder="aep"
 />
 </Field>
 </FieldRow>
 <Field label="Nombre completo">
 <TInput
 value={ub.name}
 onChange={e => {
 const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICA nuevas[i] = { ...nuevas[i], name: e.target.value };
 setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }}
 placeholder="Aeroparque Jorge Newbery"
 />
 </Field>
 {(localCfg.ubicaciones || DEFAULT_UBICACIONES).length > 1 && (
 <button onClick={() => {
 const nuevas = (localCfg.ubicaciones || DEFAULT_UBICACIONES). setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }} style={{ background: "#FEF2F2", border: "1px solid #FECACA", b Eliminar ubicación
 </button>
 )}
 </div>
 ))}
 <button onClick={() => {
 const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES), { id: ` setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
 }} style={{ width: "100%", background: T.accentLight, border: `1.5px dashed $ + Agregar ubicación
 </button>
 <button onClick={() => setLocalCfg(p => ({ ...p, ubicaciones: DEFAULT_UBICACI ↺ Restaurar ubicaciones por defecto
 </button>
 </CfgSection>
 <CfgSection id="textos" title={t(cfg, 'cfg_textos')} icon=" " openSec={openSec}  <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 {Object.entries(DEFAULT_TEXTOS).map(([key, defaultVal]) => (
 <div key={key} style={{ marginBottom: 10 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBo <input
 value={localCfg.textos?.[key] ?? defaultVal}
 onChange={e => {
 const val = e.target.value;
 setLocalCfg(p => ({ ...p, textos: { ...(p.textos || DEFAULT_T }}
 placeholder={defaultVal}
 style={{ width: "100%", background: T.bg, border: `1.5px solid ${ />
 </div>
 ))}
 <button onClick={() => setLocalCfg(p => ({ ...p, textos: { ...DEFAULT_TEXTOS  </CfgSection>
 <PBtn full onClick={guardarYCerrar} style={{ marginTop: 8 }}>{t(cfg, 'cfg_guardar {/* Botón Exportar JSX */}
 <div style={{ marginTop: 12, padding: "14px 16px", background: "#EFF6FF", border: <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom:  <div style={{ fontSize: 11, color: "#1E3A8A", marginBottom: 10, lineHeight: 1 <button onClick={exportarJSX} style={{ width: "100%", background: "#1D4ED8",  </div>
 {/* Botón Publicar y Bloquear */}
 <div style={{ marginTop: 16, padding: "14px 16px", background: "#FEF2F2", border:
 <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom:  <div style={{ fontSize: 11, color: "#7F1D1D", marginBottom: 10, lineHeight: 1 <button onClick={() => setShowLockConfirm(true)} style={{ width: "100%", back </div>
 </Sheet>)}
 {/* Modal confirmación de bloqueo */}
 {showLockConfirm && (
 <Sheet title=" Confirmar bloqueo" onClose={() => setShowLockConfirm(false)}>
 <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadiu <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBott <div style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.6 }}>La confi </div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 <button onClick={() => setShowLockConfirm(false)} style={{ background: T. <button onClick={handleLock} style={{ background: "#EF4444", border: "non </div>
 </Sheet>
 )}
 {/* Modal desbloqueo */}
 {showUnlockModal && (
 <Sheet title=" Desbloquear configuración" onClose={() => { setShowUnlockModal(f <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadiu <Field label="Usuario"><input value={unlockUser} onChange={e => { setUnlockUs <Field label="Contraseña"><input type="password" value={unlockPass} onChange= {unlockErr && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA <PBtn full onClick={tryUnlock}> Desbloquear</PBtn>
 </Sheet>
 )}
 </div>);
}
function Archivos({ setView }) { const [files, setFiles] = useState([]); const inputRef = usefunction Seguimiento({ alerts, setAlerts, setView }) { function dismiss(id) { setAlerts(p => function ResumenView({ lics, obras, personal, alerts, setView }) { const kpis = [{ label: "Lifunction MensajesView({ personal, setView }) { const [sel, setSel] = useState(null); const [tfunction ContactosView({ setView, onContactosChange }) { const [contacts, setContacts] = useSfunction WhatsappGrupos({ personal, setView }) { const [grupos, setGrupos] = useState([]); cofunction speakText(text) {
 window.speechSynthesis.cancel();
 const clean = text.replace(/[*_#`~]/g, '').replace(/https?:\/\/\S+/g, '').replace(/ [\s\ function doSpeak() {
 const voices = window.speechSynthesis.getVoices();
 // Log para debug — se puede quitar
 // console.log('Voces disponibles:', voices.map(v=>v.name+' '+v.lang));
 // Candidatos masculinos en orden de preferencia
 const MALE_NAMES = ['Jorge', 'Carlos', 'Diego', 'Miguel', 'Antonio', 'Juan', 'Pablo', const FEMALE_NAMES = ['Paulina', 'María', 'Laura', 'Sara', 'Carmen', 'Isabel', 'Googl const esVoices = voices.filter(v =>
 v.lang.startsWith('es-AR') ||
 v.lang.startsWith('es-419') ||
 v.lang.startsWith('es-MX') ||
 v.lang.startsWith('es-US') ||
 v.lang.startsWith('es-ES') ||
 v.lang.startsWith('es')
 );
 let chosen = null;
 // 1. Buscar voz española con nombre masculino conocido
 for (const name of MALE_NAMES) {
 const v = esVoices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
 if (v) { chosen = v; break; }
 }
 // 2. Si no encontró, excluir voces con nombre femenino conocido
 if (!chosen) {
 chosen = esVoices.find(v => !FEMALE_NAMES.some(fn => v.name.toLowerCase().include }
 // 3. Fallback: cualquier voz española
 if (!chosen && esVoices.length > 0) chosen = esVoices[0];
 const utt = new SpeechSynthesisUtterance(clean);
 utt.lang = 'es-AR';
 utt.rate = 0.95; // un poco más lento, más natural
 utt.pitch = 0.75; // más grave = más masculino
 utt.volume = 1;
 if (chosen) utt.voice = chosen;
 window.speechSynthesis.speak(utt);
 }
 if (window.speechSynthesis.getVoices().length > 0) { doSpeak(); }
 else { window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true });}
function Chat({ contactos, lics, obras, personal, alerts, msgs, setMsgs, cfg, apiKey }) {
 const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); co const [listening, setListening] = useState(false); const [speaking, setSpeaking] = useSta const [userName, setUserName] = useState(''); const [nameInput, setNameInput] = useState( const bottomRef = useRef(null); const taRef = useRef(null); const imgFileRef = useRef(nul useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, lo // Cargar nombre guardado
 useEffect(() => {
 (async () => {
 try { const r = await window.storage.get('bcm_username'); if (r?.value) setUserNa setNameLoaded(true);
 })();
 }, []);
 function saveName() {
 const n = nameInput.trim();
 if (!n) return;
 setUserName(n);
 window.storage.set('bcm_username', n).catch(() => { });
 }
 const [micError, setMicError] = useState('');
 const [micStatus, setMicStatus] = useState('idle');
 async function startListen() {
 setMicError('');
 const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
 if (!SR) { setMicError('Tu navegador no soporta micrófono. Usá Chrome.'); setMicStatu try { setMicStatus('requesting'); await navigator.mediaDevices.getUserMedia({ audio:  catch (err) {
 setMicStatus('error');
 if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') { set else { setMicError('No se pudo acceder al micrófono: ' + err.message); }
 return;
 }
 window.speechSynthesis.cancel();
 const r = new SR();
 r.lang = 'es-AR'; r.continuous = false; r.interimResults = true; r.maxAlternatives =  r.onstart = () => { setListening(true); setMicStatus('listening'); setMicError(''); } r.onend = () => { setListening(false); setMicStatus('idle'); };
 r.onerror = e => {
 setListening(false); setMicStatus('error');
 const msgs_ = { aborted: 'Cancelado', audio: 'Sin audio detectado', 'network': 'E
 setMicError(msgs_[e.error] || 'Error de micrófono: ' + e.error);
 };
 r.onresult = e => {
 const results = Array.from(e.results); const last = results[results.length - 1];  if (last.isFinal) { setInput(tx); setTimeout(() => sendVoice(tx), 80); } else { s };
 recognitionRef.current = r;
 try { r.start(); } catch (e) { setMicStatus('error'); setMicError('No se pudo iniciar }
 function stopListen() { recognitionRef.current?.stop(); }
 function stopSpeak() { window.speechSynthesis.cancel(); setSpeaking(false); }
 async function sendVoice(text) {
 const c = text.trim(); if (!c || loading) return;
 setInput(""); if (taRef.current) taRef.current.style.height = "22px";
 const userContent = [{ type: 'text', text: c }];
 const next = [...msgs, { role: "user", content: userContent, _snap: [], _text: c }];  try {
 const sys = await buildContext();
 const r = await callAI(next.map(m => ({ role: m.role, content: m.content })), sys setMsgs([...next, { role: "assistant", content: [{ type: "text", text: r }] }]);
 if (autoSpeak) { setSpeaking(true); speakText(r); setTimeout(() => setSpeaking(fa } catch { setMsgs([...next, { role: "assistant", content: [{ type: "text", text: "Err setLoading(false);
 }
 async function handleAttach(e) { setShowAttachMenu(false); for (const f of Array.from(e.t async function buildContext() {
 let pm = [], ps = [], camaras = [], pres = {};
 try { const r1 = await window.storage.get('bcm_presup_materiales'); if (r1?.value) pm const today = new Date().toLocaleDateString('es-AR');
 const empresa = cfg?.empresa || 'BelfastCM'; const emailIA = cfg?.email || EMAIL_IA;
 let c = `Sos el Asistente IA de ${empresa}. Email: ${emailIA}${cfg?.cargo ? `\nCargo: if (userName) c += `El usuario se llama ${userName}. Usá su nombre naturalmente en la c += `Especialista en obras en AA2000. Respondés en español rioplatense, profesional  c += ` LICITACIONES (${lics?.length || 0})\n`; lics?.forEach(l => { c += `• ${l.nom c += `\n OBRAS (${obras?.length || 0})\n`; obras?.forEach(o => { c += `• ${o.nombre c += `\n PERSONAL (${personal?.length || 0})\n`; personal?.forEach(p => { c += `• $ if (alerts?.length) { c += `\n ALERTAS\n`; alerts.forEach(a => c += `• [${a.priorid if (pm.length) { c += `\n MATERIALES\n`; pm.forEach(i => c += `• ${i.descripcion}  if (ps.length) { c += `\n SUBCONTRATOS\n`; ps.forEach(i => c += `• ${i.descripcion} if (contactos?.length) { c += `\n CONTACTOS\n`; contactos.forEach(x => c += `• ${x. if (camaras.length) { c += `\n CÁMARAS (${camaras.length})\n`; }
 const todayRecs = Object.entries(pres.registros || {}).filter(([k]) => k.endsWith(tod if (todayRecs.length) { c += `\n PRESENTISMO HOY\n`; todayRecs.forEach(r => c += `• return c;
 }
 async function send(text) {
 const c = (text || input).trim();
 if ((!c && !attachments.length) || loading) return;
 setInput(""); if (taRef.current) taRef.current.style.height = "22px"; setShowAttachMe const userContent = [];
 attachments.forEach(a => { if (a.isImg) userContent.push({ type: 'image', source: { t if (c) userContent.push({ type: 'text', text: c }); else userContent.push({ type: 'te const snapAtt = [...attachments]; setAttachments([]);
 const next = [...msgs, { role: "user", content: userContent, _snap: snapAtt, _text: c try {
 const sys = await buildContext(); const r = await callAI(next.map(m => ({ role: m if (autoSpeak) { setSpeaking(true); speakText(r); setTimeout(() => setSpeaking(fa }
 catch { setMsgs([...next, { role: "assistant", content: [{ type: "text", text: "Error setLoading(false);
 }
 function mailBlock(text) { const m = text.match(/ PREPARADO PARA ENVÍO[\s\S]*?Para:\s* const titulo = cfg?.tituloAsistente || `Asistente ${cfg?.empresa || 'BelfastCM'}`;
 const subtitulo = cfg?.subtituloAsistente || "Lee todos los datos de la app en tiempo rea const QUICK = userName
 ? [`¿Qué obras tenemos activas, ${userName}?`, `¿Qué documentación le falta al person : ["¿Estado de todas mis obras y licitaciones?", "¿Qué documentación le falta al pers // Pantalla de bienvenida / pedir nombre
 const WelcomeScreen = () => {
 if (!nameLoaded) return null;
 // Si ya tiene nombre: mostrar pantalla principal con micrófono
 if (userName) {
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", alignIte <div style={{ marginBottom: 6, fontSize: 13, color: T.muted, fontWeight: 500  <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 4,  <div style={{ fontSize: 11, color: T.muted, marginBottom: 28, textAlign: "cen {/* Botón micrófono grande central */}
 <button onClick={listening ? stopListen : startListen} style={{ display: "fle <div style={{ width: 120, height: 120, borderRadius: 28, background: T.ca {listening && <div style={{ position: "absolute", inset: -6, borderRa {listening && <div style={{ position: "absolute", inset: -14, borderR {cfg?.logoCentral
 ? <img src={cfg.logoCentral} alt="logo" style={{ width: "78%", he : <svg width="56" height="56" viewBox="0 0 24 24" fill={listening <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
 <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={listening ? "#EF4 <line x1="12" y1="19" x2="12" y2="23" stroke={listening ? "#E <line x1="8" y1="23" x2="16" y2="23" stroke={listening ? "#EF </svg>}
 </div>
 <div style={{ fontSize: 13, fontWeight: 700, color: listening ? "#EF4444"
 {listening ? t(cfg, 'chat_escuchando') : "Tocar para hablar"}
 </div>
 </button>
 {listening && input && <div style={{ fontSize: 13, color: T.accent, fontStyle {micError && <div style={{ display: "flex", alignItems: "center", gap: 6, bac <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path fill <span style={{ fontSize: 11, color: "#EF4444", flex: 1 }}>{micError}</spa <button onClick={() => { setMicError(''); setMicStatus('idle'); }} style= </div>}
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7 {QUICK.map((q, i) => (<button key={i} onClick={() => send(q)} style={{ ba </div>
 <button onClick={() => { setUserName(''); window.storage.set('bcm_username',  </div>);
 }
 // Si NO tiene nombre: pantalla para pedirlo
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems:  <div style={{ width: 100, height: 100, display: "flex", alignItems: "center", jus {cfg?.logoCentral
 ? <img src={cfg.logoCentral} alt="logo" style={{ width: "100%", height: " : <svg width="80" height="80" viewBox="0 0 24 24" fill={T.accent}>
 <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
 <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={T.accent} strokeWidth="1. <line x1="12" y1="19" x2="12" y2="23" stroke={T.accent} strokeWidth=" <line x1="8" y1="23" x2="16" y2="23" stroke={T.accent} strokeWidth="1 </svg>}
 </div>
 <div style={{ fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 6, text <div style={{ fontSize: 12, color: T.muted, marginBottom: 28, textAlign: "center" <div style={{ width: "100%", marginBottom: 12 }}>
 <input
 value={nameInput}
 onChange={e => setNameInput(e.target.value)}
 onKeyDown={e => e.key === 'Enter' && saveName()}
 placeholder="Escribí tu nombre..."
 autoFocus
 style={{ width: "100%", background: T.bg, border: `2px solid ${T.accent}` />
 </div>
 <PBtn full onClick={saveName} disabled={!nameInput.trim()}>Comenzar →</PBtn>
 </div>);
 };
 const VoiceBar = () => (<div style={{ background: T.card, borderBottom: `1px solid ${T.bo
 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
 <button onClick={listening ? stopListen : startListen} disabled={micStatus === 'r {micStatus === 'requesting'
 ? <><div style={{ width: 8, height: 8, borderRadius: "50%", background: " : listening
 ? <><div style={{ width: 8, height: 8, borderRadius: "50%", backgroun : <><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><pat </button>
 {speaking && <button onClick={stopSpeak} style={{ display: "flex", alignItems: "c <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><rect x="6" y="4 </button>}
 <div style={{ flex: 1 }} />
 <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
 <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{t(cfg, 'chat <div onClick={() => setAutoSpeak(v => !v)} style={{ width: 34, height: 18, bo <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#f </div>
 </div>
 </div>
 {micError && <div style={{ display: "flex", alignItems: "center", gap: 6, background: <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="ev <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, flex: 1 }}>{micEr <button onClick={() => { setMicError(''); setMicStatus('idle'); }} style={{ backg </div>}
 {listening && input && <div style={{ fontSize: 12, color: T.accent, fontStyle: "itali </div>);
 return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidde {!apiKey && <div style={{ background: "#FFFBEB", borderBottom: "1px solid #FDE68A", p <svg width="14" height="14" viewBox="0 0 24 24" fill="#D97706"><path fillRule="ev <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600, flex: 1 }}>Falta  </div>}
 {msgs.length > 0 && <VoiceBar />}
 <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }} {msgs.length === 0 ? (<WelcomeScreen />) : (
 <div style={{ padding: "14px 18px 0" }}>
 {msgs.map((m, i) => {
 const txt = Array.isArray(m.content) ? m.content.filter(b => b.type = <div key={i} style={{ display: "flex", flexDirection: "column", a {m.role !== "user" && <div style={{ fontSize: 10, fontWeight: {m.role === "user" && imgs.length > 0 && <div style={{ displa {m.role === "user" && docs.length > 0 && <div style={{ displa {(dispTxt || m.role === 'assistant') && <div style={{ maxWidt {mb && <div style={{ maxWidth: "87%", marginTop: 6, backgroun </div>);
 })}
 {loading && <div style={{ display: "flex", gap: 5, padding: "6px 4px", ma
 <div ref={bottomRef} style={{ height: 14 }} />
 </div>
 )}
 </div>
 {attachments.length > 0 && (<div style={{ background: T.card, borderTop: `1px solid $ <div style={{ padding: "8px 14px calc(max(14px,env(safe-area-inset-bottom)) + 70px)", {showAttachMenu && (<div style={{ position: "absolute", bottom: "100%", left: 14, <input ref={camRef} type="file" accept="image/*" capture="environment" multip <input ref={imgFileRef} type="file" accept="image/*" multiple onChange={e =>  <input ref={anyFileRef} type="file" accept=".pdf,.docx,.doc,.xlsx,.xls,.txt"  {[{ icon: " ", label: "Cámara", ref: camRef }, { icon: " ", label: "Imagen" </div>)}
 <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
 <button onClick={() => setShowAttachMenu(p => !p)} style={{ width: 40, height <div style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, b <button onClick={listening ? stopListen : startListen} style={{ width: 42, he {listening && <div style={{ position: "absolute", inset: -3, borderRadius <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path </button>
 <button onClick={() => send()} disabled={(!input.trim() && !attachments.lengt </div>
 </div>
 </div>);
}
const DEMO_LICS = [{ id: "l1", nombre: "Refacción Terminal A", ap: "aep", estado: "curso", moconst DEMO_OBRAS = [{ id: "o1", nombre: "Refacción Terminal A", ap: "aep", estado: "curso", aconst DEMO_PERSONAL = [{ id: "p1", nombre: "M. Rodríguez", rol: "Jefe de Obra", empresa: "Belconst DEMO_ALERTS = [{ id: "a1", prioridad: "alta", msg: "ART de M. Rodríguez vence en 2 díasexport default function App() {
 const [view, setView] = useState("chat");
 const [lics, setLics] = useState(DEMO_LICS);
 const [obras, setObras] = useState(DEMO_OBRAS);
 const [personal, setPersonal] = useState(DEMO_PERSONAL);
 const [alerts, setAlerts] = useState(DEMO_ALERTS);
 const [contactos, setContactos] = useState([]);
 const [detailObraId, setDetailObraId] = useState(null);
 const [authed, setAuthed] = useState(null);
 const [authModal, setAuthModal] = useState(null);
 const [chatMsgs, setChatMsgs] = useState([]);
 const [cargarState, setCargarState] = useState({ obraId: '', newFotos: [], report: '' });
 const [cfg, setCfg] = useState(DEFAULT_CONFIG);
 const [cfgLoaded, setCfgLoaded] = useState(false);
 const [dataLoaded, setDataLoaded] = useState(false);
 const [apiKey, setApiKey] = useState('');
 const [cfgLocked, setCfgLocked] = useState(false);
 const [cfgLockedLoaded, setCfgLockedLoaded] = useState(false);
 // Carga estado de bloqueo
 useEffect(() => {
 (async () => {
 try { const r = await window.storage.get('bcm_cfg_locked'); if (r?.value === 'tru setCfgLockedLoaded(true);
 })();
 }, []);
 useEffect(() => {
 if (!cfgLockedLoaded) return;
 window.storage.set('bcm_cfg_locked', cfgLocked ? 'true' : 'false').catch(() => {});
 }, [cfgLocked, cfgLockedLoaded]);
 // Carga datos — PRIMERO lee, DESPUÉS habilita el guardado
 useEffect(() => {
 (async () => {
 try {
 const r = await window.storage.get("bcm_state");
 if (r?.value) {
 const s = JSON.parse(r.value);
 if (s.lics?.length) setLics(s.lics);
 if (s.obras?.length) setObras(s.obras);
 if (s.personal?.length) setPersonal(s.personal);
 if (s.alerts?.length) setAlerts(s.alerts);
 }
 } catch { }
 setDataLoaded(true); // solo ahora habilita el guardado
 })();
 }, []);
 // Al cargar datos, sincroniza obras faltantes para lics en curso/adjudicada
 useEffect(() => {
 if (!dataLoaded) return;
 const TRIGGER = ["curso", "adjudicada"];
 const nuevas = [];
 lics.forEach(lic => {
 if (!TRIGGER.includes(lic.estado)) return;
 const yaExiste = obras.some(o => o.lic_id === lic.id);
 if (yaExiste) return;
 nuevas.push({
 id: Math.random().toString(36).slice(2, 9),
 lic_id: lic.id,
 nombre: lic.nombre,
 ap: lic.ap,
 sector: lic.sector || "",
 estado: "curso",
 avance: 0,
 inicio: new Date().toLocaleDateString("es-AR"),
 cierre: "",
 obs: [{ id: Math.random().toString(36).slice(2, 9), txt: "Obra creada automát fotos: [], archivos: [], informes: [], docs: {},
 });
 });
 if (nuevas.length > 0) setObras(p => [...p, ...nuevas]);
 }, [dataLoaded]);
 // Guarda solo después de que se cargaron los datos del storage
 useEffect(() => {
 if (!dataLoaded) return;
 window.storage.set("bcm_state", JSON.stringify({ lics, obras, personal, alerts })).ca }, [lics, obras, personal, alerts, dataLoaded]);
 useEffect(() => {
 (async () => {
 try {
 const r = await window.storage.get('bcm_config');
 const lb = await window.storage.get('bcm_logo_b').catch(() => null);
 const la = await window.storage.get('bcm_logo_a').catch(() => null);
 const li = await window.storage.get('bcm_logo_i').catch(() => null);
 const lc = await window.storage.get('bcm_logo_c').catch(() => null);
 const base = r?.value ? { ...DEFAULT_CONFIG, ...JSON.parse(r.value) } : { ... setCfg({ ...base, logoBelfast: lb?.value || '', logoAA2000: la?.value || '',  const rk = await window.storage.get('bcm_apikey').catch(() => null);
 if (rk?.value) setApiKey(rk.value);
 } catch { }
 setCfgLoaded(true);
 })();
 }, []);
 useEffect(() => {
 if (!cfgLoaded) return;
 const { logoBelfast, logoAA2000, logoAsistente, logoCentral, ...rest } = cfg;
 window.storage.set('bcm_config', JSON.stringify(rest)).catch(() => { });
 window.storage.set('bcm_logo_b', logoBelfast || '').catch(() => { });
 window.storage.set('bcm_logo_a', logoAA2000 || '').catch(() => { });
 window.storage.set('bcm_logo_i', logoAsistente || '').catch(() => { });
 window.storage.set('bcm_logo_c', logoCentral || '').catch(() => { });
 }, [cfg, cfgLoaded]);
 function requireAuth(action, titulo) {
 if (authed) { action(); }
 else { setAuthModal({ onSuccess: (u) => { setAuthed(u); action(); setAuthModal(null); }
 const nav = (v) => { setDetailObraId(null); setView(v); };
 const hideBrand = ["archivos", "seguimiento", "mensajes"].includes(view);
 return (
 <div style={{ height: "100vh", display: "flex", flexDirection: "column", background:  <style>{css}</style>
 <style>{buildThemeCSS(cfg)}</style>
 {!hideBrand && <AppBrand cfg={cfg} />}
 <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "colum {view === "dashboard" && <Dashboard lics={lics} obras={obras} personal={perso {view === "licitaciones" && <Licitaciones lics={lics} setLics={setLics} requi {view === "obras" && <Obras obras={obras} setObras={setObras} lics={lics} det {view === "personal" && <Personal personal={personal} setPersonal={setPersona {view === "mas" && <Mas setView={nav} authed={authed} setAuthed={setAuthed} r {view === "archivos" && <Archivos setView={nav} />}
 {view === "seguimiento" && <Seguimiento alerts={alerts} setAlerts={setAlerts} {view === "mensajes" && <MensajesView personal={personal} setView={nav} />}
 {view === "resumen" && <ResumenView lics={lics} obras={obras} personal={perso {view === "cargar" && <CargarView obras={obras} setObras={setObras} cargarSta {view === "contactos" && <ContactosView setView={nav} onContactosChange={setC {view === "whatsapp" && <WhatsappGrupos personal={personal} setView={nav} />}
 {view === "informes_ingeniero" && <InformesIngeniero setView={nav} />}
 {view === "informes_ia" && <InformesIA obras={obras} personal={personal} lics {view === "vigilancia" && <PanelVigilancia setView={nav} />}
 {view === "presentismo" && <Presentismo personal={personal} setView={nav} />}
 {view === "presupuesto_materiales" && <PresupuestoView tipo="materiales" setV {view === "presupuesto_subcontratos" && <PresupuestoView tipo="subcontratos"  {view === "chat" && <Chat contactos={contactos} lics={lics} obras={obras} per </div>
 <BottomNav view={view} setView={nav} alerts={alerts} cfg={cfg} />
 {authModal && <LoginModal titulo={authModal.titulo} onSuccess={authModal.onSucces </div>
 );
