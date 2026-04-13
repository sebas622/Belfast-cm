import { useState, useRef, useEffect, useCallback, memo } from "react";

// ── SUPABASE CONFIG ─────────────────────────────────────────────
const SUPA_URL = "https://mvrznqpvreeskbmbaclg.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cnpucXB2cmVlc2tibWJhY2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTE4NjUsImV4cCI6MjA5MTU4Nzg2NX0.rOn31fHnUhMaAsAMUgEUwIwOMFNhLLLnW4L8rMNIGcE";
const SH = () => ({ "Content-Type": "application/json", "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY });

// Storage adapter: Supabase (cloud) con fallback a localStorage
const storage = {
    get: async (key) => {
        try {
            const r = await fetch(SUPA_URL + "/rest/v1/bcm_storage?key=eq." + encodeURIComponent(key) + "&select=value&limit=1", { 
                method: "GET",
                headers: SH(),
                mode: "cors"
            });
            if (r.ok) { const d = await r.json(); if (d && d.length > 0) return { value: d[0].value }; }
        } catch(e) { console.log("Supabase get error:", e); }
        try { const v = localStorage.getItem(key); return v ? { value: v } : null; } catch { return null; }
    },
    set: async (key, value) => {
        try {
            await fetch(SUPA_URL + "/rest/v1/bcm_storage", {
                method: "POST", headers: { ...SH(), "Prefer": "resolution=merge-duplicates" },
                body: JSON.stringify({ key, value })
            });
        } catch { }
        try { localStorage.setItem(key, value); } catch { }
        return { value };
    },
    delete: async (key) => {
        try { await fetch(SUPA_URL + "/rest/v1/bcm_storage?key=eq." + encodeURIComponent(key), { method: "DELETE", headers: SH() }); } catch { }
        try { localStorage.removeItem(key); } catch { }
        return { deleted: true };
    },
    list: async (prefix) => {
        try {
            const url = prefix ? SUPA_URL + "/rest/v1/bcm_storage?key=like." + encodeURIComponent(prefix) + "*&select=key" : SUPA_URL + "/rest/v1/bcm_storage?select=key";
            const r = await fetch(url, { headers: SH() });
            if (r.ok) { const d = await r.json(); return { keys: d.map(x => x.key) }; }
        } catch { }
        try { return { keys: Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix)) }; } catch { return { keys: [] }; }
    }
};

// ── CÓDIGO FUENTE EMBEBIDO (para exportar JSX publicable) ─────────
const __SOURCE_CODE__ = `import { useState, useRef, useEffect, useCallback, memo } from "react";

// ── SUPABASE CONFIG ─────────────────────────────────────────────
const SUPA_URL = "https://mvrznqpvreeskbmbaclg.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cnpucXB2cmVlc2tibWJhY2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTE4NjUsImV4cCI6MjA5MTU4Nzg2NX0.rOn31fHnUhMaAsAMUgEUwIwOMFNhLLLnW4L8rMNIGcE";
const SH = () => ({ "Content-Type": "application/json", "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY });

// Storage adapter: Supabase (cloud) con fallback a localStorage
const storage = {
    get: async (key) => {
        try {
            const r = await fetch(SUPA_URL + "/rest/v1/bcm_storage?key=eq." + encodeURIComponent(key) + "&select=value&limit=1", { 
                method: "GET",
                headers: SH(),
                mode: "cors"
            });
            if (r.ok) { const d = await r.json(); if (d && d.length > 0) return { value: d[0].value }; }
        } catch(e) { console.log("Supabase get error:", e); }
        try { const v = localStorage.getItem(key); return v ? { value: v } : null; } catch { return null; }
    },
    set: async (key, value) => {
        try {
            await fetch(SUPA_URL + "/rest/v1/bcm_storage", {
                method: "POST", headers: { ...SH(), "Prefer": "resolution=merge-duplicates" },
                body: JSON.stringify({ key, value })
            });
        } catch { }
        try { localStorage.setItem(key, value); } catch { }
        return { value };
    },
    delete: async (key) => {
        try { await fetch(SUPA_URL + "/rest/v1/bcm_storage?key=eq." + encodeURIComponent(key), { method: "DELETE", headers: SH() }); } catch { }
        try { localStorage.removeItem(key); } catch { }
        return { deleted: true };
    },
    list: async (prefix) => {
        try {
            const url = prefix ? SUPA_URL + "/rest/v1/bcm_storage?key=like." + encodeURIComponent(prefix) + "*&select=key" : SUPA_URL + "/rest/v1/bcm_storage?select=key";
            const r = await fetch(url, { headers: SH() });
            if (r.ok) { const d = await r.json(); return { keys: d.map(x => x.key) }; }
        } catch { }
        try { return { keys: Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix)) }; } catch { return { keys: [] }; }
    }
};

// ── CONSTANTES ─────────────────────────────────────────────────────────
const AIRPORTS = [{ id: "aep", code: "AEP", name: "Aeroparque Jorge Newbery" }, { id: "eze", code: "EZE", name: "Aerop. Int'l Ministro Pistarini" }];
const LIC_ESTADOS = [{ id: "visitar", label: "A Visitar", color: "#F59E0B", bg: "#FFFBEB" }, { id: "presupuesto", label: "Presupuesto", color: "#3B82F6", bg: "#EFF6FF" }, { id: "curso", label: "En Curso", color: "#8B5CF6", bg: "#F5F3FF" }, { id: "presentada", label: "Presentada", color: "#F97316", bg: "#FFF7ED" }, { id: "adjudicada", label: "Adjudicada", color: "#10B981", bg: "#ECFDF5" }, { id: "descartada", label: "Descartada", color: "#EF4444", bg: "#FEF2F2" }];
const OBRA_ESTADOS = [{ id: "pendiente", label: "Pendiente", color: "#94A3B8", bg: "#F8FAFC" }, { id: "curso", label: "En Curso", color: "#10B981", bg: "#ECFDF5" }, { id: "pausada", label: "Pausada", color: "#F59E0B", bg: "#FFFBEB" }, { id: "terminada", label: "Terminada", color: "#6366F1", bg: "#EEF2FF" }];
const ROLES = ["Jefe de Obra", "Capataz", "Técnico", "Proveedor", "Contratista", "Administrativo"];
const DOC_TYPES = [{ id: "art", label: "ART", acceptsExp: true }, { id: "antec", label: "Antecedentes", acceptsExp: false }, { id: "preoc", label: "Preocupacional", acceptsExp: true }, { id: "dni", label: "DNI", acceptsExp: false }, { id: "sicop", label: "SiCoP", acceptsExp: false }, { id: "alta", label: "Alta Temprana", acceptsExp: false }];
const LIC_DOC_TYPES = [{ id: "planos", label: "Planos", accept: ".pdf,.png,.jpg,.dwg,.zip" }, { id: "pliego", label: "Pliego", accept: ".pdf,.doc,.docx" }, { id: "excel", label: "Excel", accept: ".xlsx,.xls,.csv,.pdf" }, { id: "otros", label: "Otros", accept: "*" }];
const EMAIL_IA = "ia.belfastcm@gmail.com";
const ADMIN_CREDS = [{ user: "admin", pass: "belfast2025", rol: "Administrador", nivel: "directivo" }, { user: "supervisor", pass: "obra2025", rol: "Supervisor", nivel: "directivo" }];
const USERS = ADMIN_CREDS; // alias — configurable desde Más → Configuración
function isDirectivo(user) {
    if (!user) return false;
    const nivel = user.nivel || '';
    const rol = (user.rol || '').toLowerCase();
    return nivel === 'directivo' || ['administrador', 'supervisor', 'gerente', 'director'].some(r => rol.includes(r));
}

// ── TEMA ───────────────────────────────────────────────────────────────
const THEME_PRESETS = [
    { id: "azul", label: "Azul", accent: "#1D4ED8", al: "#EFF6FF", bg: "#F1F5F9", card: "#fff", border: "#E2E8F0", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#0F172A" },
    { id: "oscuro", label: "Oscuro", accent: "#60A5FA", al: "#172554", bg: "#0F172A", card: "#1E293B", border: "#334155", text: "#F1F5F9", sub: "#94A3B8", muted: "#475569", navy: "#020617" },
    { id: "verde", label: "Verde", accent: "#16A34A", al: "#DCFCE7", bg: "#F0FDF4", card: "#fff", border: "#BBF7D0", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#14532D" },
    { id: "violeta", label: "Violeta", accent: "#7C3AED", al: "#F5F3FF", bg: "#FAF5FF", card: "#fff", border: "#E9D5FF", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#3B0764" },
    { id: "rojo", label: "Rojo", accent: "#DC2626", al: "#FEF2F2", bg: "#FFF5F5", card: "#fff", border: "#FECACA", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#7F1D1D" },
    { id: "naranja", label: "Naranja", accent: "#EA580C", al: "#FFF7ED", bg: "#FFFBF5", card: "#fff", border: "#FED7AA", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#431407" },
    { id: "minimal", label: "Mínimal", accent: "#111111", al: "#F5F5F5", bg: "#FAFAFA", card: "#fff", border: "#E8E8E8", text: "#111", sub: "#555", muted: "#aaa", navy: "#111" },
    { id: "cyan", label: "Cyan", accent: "#0891B2", al: "#ECFEFF", bg: "#F0FDFF", card: "#fff", border: "#A5F3FC", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#164E63" },
    { id: "rosa", label: "Rosa", accent: "#DB2777", al: "#FDF2F8", bg: "#FDF4FF", card: "#fff", border: "#FBCFE8", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#500724" },
];
const FONTS = [
    { id: "jakarta", label: "Jakarta", value: "'Plus Jakarta Sans'" },
    { id: "inter", label: "Inter", value: "'Inter'" },
    { id: "poppins", label: "Poppins", value: "'Poppins'" },
    { id: "roboto", label: "Roboto", value: "'Roboto'" },
    { id: "montserrat", label: "Montserrat", value: "'Montserrat'" },
    { id: "system", label: "Sistema", value: "-apple-system,BlinkMacSystemFont" },
];
const RADIUS_OPTS = [{ id: "sharp", label: "Recto", r: 4 }, { id: "normal", label: "Normal", r: 14 }, { id: "suave", label: "Suave", r: 20 }, { id: "round", label: "Redondo", r: 28 }];
const COLOR_KEYS = [{ k: "accent", label: "Principal" }, { k: "bg", label: "Fondo" }, { k: "card", label: "Tarjetas" }, { k: "text", label: "Texto" }, { k: "navy", label: "Encabezado" }, { k: "border", label: "Bordes" }];
const DEFAULT_COLORS = { accent: "#1D4ED8", al: "#EFF6FF", bg: "#F1F5F9", card: "#ffffff", border: "#E2E8F0", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#0F172A" };
const DEFAULT_UBICACIONES = [{ id: "aep", code: "AEP", name: "Aeroparque Jorge Newbery" }, { id: "eze", code: "EZE", name: "Aerop. Int'l Ministro Pistarini" }];

const DEFAULT_TEXTOS = {
    // Nav
    nav_ia: "IA", nav_inicio: "Inicio", nav_obras: "Obras", nav_personal: "Personal", nav_cargar: "Cargar", nav_mas: "Más",
    // Dashboard
    dash_titulo: "Panel operativo", dash_subtitulo: "BelfastCM × AA2000",
    dash_licitaciones: "Licitaciones", dash_obras_activas: "Obras activas", dash_alertas: "Alertas", dash_personal: "Personal",
    dash_obras_curso: "Obras en curso", dash_ver_todas: "Ver todas →", dash_acciones: "Acciones rápidas",
    dash_nueva_lic: "Nueva licitación", dash_nueva_obra: "Nueva obra", dash_presup_mat: "Presupuesto materiales", dash_subcontratos: "Subcontratos",
    // Obras
    obras_titulo: "Obras", obras_nueva: "Nueva obra", obras_avance: "Avance", obras_inicio: "Inicio", obras_cierre: "Cierre est.",
    obras_sector: "Sector", obras_estado: "Estado", obras_info: "Info", obras_notas: "Notas", obras_fotos: "Fotos", obras_archivos: "Archivos",
    obras_obs_placeholder: "Registrar observación...", obras_sin_notas: "Sin notas", obras_sin_fotos: "Sin fotos", obras_sin_archivos: "Sin archivos",
    obras_agregar_fotos: "Agregar fotos", obras_agregar_arch: "Agregar archivo", obras_eliminar: "Eliminar obra",
    // Licitaciones
    lic_titulo: "Licitaciones", lic_nueva: "Nueva licitación", lic_nombre: "Nombre", lic_monto: "Monto", lic_fecha: "Fecha", lic_sector: "Sector",
    lic_crear: "Crear licitación", lic_eliminar: "Eliminar",
    // Personal
    pers_titulo: "Personal de Obra", pers_nuevo: "Nuevo trabajador", pers_nombre: "Nombre", pers_rol: "Rol", pers_empresa: "Empresa",
    pers_obra: "Obra", pers_whatsapp: "WhatsApp", pers_documentacion: "Documentación", pers_sin_personal: "Sin personal registrado",
    pers_eliminar: "Eliminar trabajador", pers_agregar: "Agregar",
    // Cargar
    carg_titulo: "Registro de Avance", carg_sub: "Fotos + Informe IA", carg_sel_obra: "Seleccioná la obra",
    carg_fotos: "Cargá fotos nuevas", carg_tomar: "Tomar foto", carg_galeria: "Galería / PC",
    carg_generar: "Comparar y generar informe", carg_analizando: "Analizando...",
    carg_informe: "Informe generado", carg_nuevo: "+ Nuevo", carg_descargar: "⬇ Descargar",
    // Chat / IA
    chat_titulo: "Asistente IA", chat_placeholder: "Escribí o usá el micrófono…",
    chat_hablar: "Hablar", chat_escuchando: "Escuchando…", chat_pausar: "Pausar", chat_voz_auto: "Voz auto",
    // Más
    mas_titulo: "Más opciones", mas_config: "Configuración", mas_config_sub: "Estética · Logos · Empresa · Admin",
    mas_cerrar_sesion: "Cerrar sesión",
    // Config
    cfg_cuenta: "Cuenta y empresa", cfg_tema: "Tema visual", cfg_tipografia: "Tipografía",
    cfg_forma: "Forma de los elementos", cfg_logos: "Logos y textos", cfg_textos: "Textos de la app",
    cfg_guardar: "✓ Guardar y cerrar", cfg_restaurar: "↺ Restaurar tema por defecto",
};

const DEFAULT_CONFIG = { email: EMAIL_IA, empresa: "BelfastCM", cargo: "Gerencia de Obra", telefono: "", ciudad: "Buenos Aires, Argentina", logoBelfast: "", logoAA2000: "", logoAsistente: "", logoCentral: "", tituloAsistente: "Asistente BelfastCM", subtituloAsistente: "Lee todos los datos de la app en tiempo real", themeId: "azul", colors: { ...DEFAULT_COLORS }, fontId: "jakarta", radiusId: "normal", ubicaciones: DEFAULT_UBICACIONES, labelUbicacion: "Aeropuerto", textos: { ...DEFAULT_TEXTOS } };

// Helper para obtener texto con fallback al default
function t(cfg, key) { return cfg?.textos?.[key] || DEFAULT_TEXTOS[key] || key; }

function getUbics(cfg) { return (cfg?.ubicaciones?.length ? cfg.ubicaciones : DEFAULT_UBICACIONES); }
function getLabelUbic(cfg) { return cfg?.labelUbicacion || "Aeropuerto"; }
function uid() { return Math.random().toString(36).slice(2, 9); }
function toDataUrl(f, maxW = 1400) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => {
            if (!f.type.startsWith('image/')) { res(e.target.result); return; }
            const img = new Image();
            img.onload = () => {
                if (img.width <= maxW) { res(e.target.result); return; }
                const c = document.createElement('canvas');
                const ratio = maxW / img.width;
                c.width = maxW; c.height = Math.round(img.height * ratio);
                c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                res(c.toDataURL('image/jpeg', 0.85));
            };
            img.onerror = () => res(e.target.result);
            img.src = e.target.result;
        };
        reader.onerror = rej;
        reader.readAsDataURL(f);
    });
}
function getBase64(d) { return d.split(',')[1]; }
function getMediaType(d) { const m = d.match(/data:([^;]+);/); return m ? m[1] : 'image/jpeg'; }
async function callAI(msgs, sys, apiKey) {
    try {
        if (typeof window !== 'undefined' && window.claude?.complete) {
            const fullPrompt = sys ? sys + "\\n\\n" + msgs.map(m => {
                const txt = Array.isArray(m.content) ? m.content.filter(b => b.type==='text').map(b=>b.text).join('\\n') : m.content;
                return (m.role === 'user' ? 'Usuario: ' : 'Asistente: ') + txt;
            }).join('\\n') : msgs.map(m => {
                const txt = Array.isArray(m.content) ? m.content.filter(b => b.type==='text').map(b=>b.text).join('\\n') : m.content;
                return (m.role === 'user' ? 'Usuario: ' : 'Asistente: ') + txt;
            }).join('\\n');
            const result = await window.claude.complete(fullPrompt);
            return result || "Sin respuesta.";
        }
        const headers = { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true", "anthropic-version": "2023-06-01" };
        if (apiKey) headers["x-api-key"] = apiKey;
        else return "⚠ Configurá tu API Key en Más → Configuración para usar la IA.";
        const r = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers,
            body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, system: sys, messages: msgs })
        });
        if (!r.ok) {
            let msg = "Error de conexión.";
            try { const d = await r.json(); msg = d.error?.message || \`Error \${r.status}\`; } catch { }
            return msg;
        }
        const d = await r.json();
        if (d.error) return \`Error: \${d.error.message || 'Sin respuesta.'}\`;
        return d.content?.map(b => b.text || "").join("") || "Sin respuesta.";
    } catch (e) {
        return \`Error de conexión: \${e.message || 'Verificá tu API Key en Configuración.'}\`;
    }
} function daysSince(s) { if (!s) return 999; const [d, m, y] = s.split("/"); return Math.ceil((new Date(\`20\${y}\`, m - 1, d) - new Date()) / (1000 * 60 * 60 * 24)); }
function hexLight(hex) { try { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return \`#\${Math.round(r * .12 + 255 * .88).toString(16).padStart(2, '0')}\${Math.round(g * .12 + 255 * .88).toString(16).padStart(2, '0')}\${Math.round(b * .12 + 255 * .88).toString(16).padStart(2, '0')}\`; } catch { return '#EFF6FF'; } }
function buildThemeCSS(cfg) {
    const c = cfg.colors || DEFAULT_COLORS;
    const fv = FONTS.find(f => f.id === cfg.fontId)?.value || "'Plus Jakarta Sans'";
    const rv = RADIUS_OPTS.find(r => r.id === cfg.radiusId)?.r || 14;
    return \`:root{--bg:\${c.bg};--card:\${c.card};--border:\${c.border};--text:\${c.text};--sub:\${c.sub || '#475569'};--muted:\${c.muted || '#94A3B8'};--accent:\${c.accent};--al:\${c.al || hexLight(c.accent)};--navy:\${c.navy};--r:\${rv}px;--rsm:\${Math.max(4, rv - 4)}px;--font:\${fv};}\`;
}

const T = { bg: "var(--bg,#F1F5F9)", card: "var(--card,#fff)", border: "var(--border,#E2E8F0)", text: "var(--text,#0F172A)", sub: "var(--sub,#475569)", muted: "var(--muted,#94A3B8)", accent: "var(--accent,#1D4ED8)", accentLight: "var(--al,#EFF6FF)", navy: "var(--navy,#0F172A)", r: "var(--r,14px)", rsm: "var(--rsm,10px)", shadow: "0 1px 3px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04)" };

const css = \`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg,#F1F5F9);overscroll-behavior:none;}
  input,textarea,select,button{font-family:var(--font,'Plus Jakarta Sans'),sans-serif;}
  input:focus,textarea:focus,select:focus{outline:none;}textarea{resize:none;}button{cursor:pointer;}::-webkit-scrollbar{display:none;}
  @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes scanSweep{0%{top:-100%}100%{top:200%}}
\`;

const BelfastLogo = ({ size = 44 }) => (
    <svg width={Math.round(size * 1.12)} height={size} viewBox="0 0 278 212" fill="none" stroke="#111" strokeWidth="5.5" strokeLinejoin="miter">
        <polygon points="8,84 98,84 126,54 36,54" />
        <path d="M8,84 L8,200 L98,200 L98,174 L52,174 L52,132 L98,132 L98,117 L57,117 L57,88 L98,88 L98,84 Z" />
        <line x1="98" y1="84" x2="126" y2="54" />
        <rect x="120" y="6" width="150" height="194" />
        <rect x="138" y="22" width="114" height="72" />
        <rect x="179" y="128" width="21" height="72" />
    </svg>
);
const AA2000Symbol = ({ size = 54 }) => (
    <svg width={size} height={Math.round(size * .52)} viewBox="0 0 130 68" fill="none">
        <ellipse cx="48" cy="34" rx="44" ry="20" stroke="#6b7280" strokeWidth="9" fill="none" />
        <polygon points="22,18 22,50 70,34" fill="#6b7280" />
    </svg>
);
function AppBrand({ cfg }) {
    const lb = cfg?.logoBelfast, la = cfg?.logoAA2000;
    return (
        <div style={{ background: "#fff", borderBottom: \`1px solid \${T.border}\`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, minHeight: 76 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {lb ? <img src={lb} alt="Belfast" style={{ height: 66, objectFit: "contain" }} />
                    : <><BelfastLogo size={62} /><div style={{ lineHeight: 1.2 }}><div style={{ fontSize: 17, fontWeight: 900, color: "#111", letterSpacing: "0.06em", lineHeight: 1 }}>BELFAST</div><div style={{ fontSize: 9, fontWeight: 600, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>Construction Management</div></div></>}
            </div>
            <div style={{ width: 1, height: 58, background: T.border, flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {la ? <img src={la} alt="AA2000" style={{ height: 66, objectFit: "contain" }} />
                    : <><AA2000Symbol size={76} /><div style={{ lineHeight: 1.35 }}><div style={{ fontSize: 15, color: "#6b7280", fontWeight: 400 }}>Aeropuertos</div><div style={{ fontSize: 15, color: "#6b7280", fontWeight: 600 }}>Argentina</div></div></>}
            </div>
        </div>
    );
}

function Card({ children, style = {}, onClick }) { return <div onClick={onClick} style={{ background: T.card, borderRadius: T.r, border: \`1px solid \${T.border}\`, boxShadow: T.shadow, ...style }}>{children}</div>; }
function Badge({ color, bg, children, style = {} }) { return <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 20, padding: "3px 8px", textTransform: "uppercase", letterSpacing: "0.04em", ...style }}>{children}</span>; }
function PBtn({ children, onClick, disabled, full, style = {}, variant = "primary" }) {
    const v = { primary: { background: disabled ? "#E2E8F0" : "var(--accent,#1D4ED8)", color: disabled ? "#94A3B8" : "#fff", boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,.18)", border: "none" }, ghost: { background: "none", border: \`1.5px solid \${T.border}\`, color: T.sub, boxShadow: "none" }, danger: { background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#EF4444", boxShadow: "none" } };
    return <button onClick={onClick} disabled={disabled} style={{ ...v[variant], borderRadius: T.rsm, padding: "11px 20px", fontSize: 14, fontWeight: 600, width: full ? "100%" : "auto", transition: "all .15s", ...style }}>{children}</button>;
}
function Sheet({ title, onClose, children }) { return (<div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", zIndex: 200, display: "flex", alignItems: "flex-end", backdropFilter: "blur(2px)" }}><div style={{ background: T.card, borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "90vh", overflow: "auto", animation: "up .25s ease", paddingBottom: 32 }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 0" }}><span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{title}</span><button onClick={onClose} style={{ background: T.bg, border: "none", borderRadius: 20, width: 32, height: 32, fontSize: 18, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button></div><div style={{ padding: "14px 20px 0" }}>{children}</div></div></div>); }
function Lbl({ children }) { return <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{children}</div>; }
function TInput({ value, onChange, placeholder, type = "text", extraStyle = {} }) { return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text, ...extraStyle }} />; }
function Sel({ value, onChange, children }) { return <select value={value} onChange={onChange} style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }}>{children}</select>; }
function FieldRow({ children }) { return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>{children}</div>; }
function Field({ label, children }) { return <div style={{ marginBottom: 12 }}><Lbl>{label}</Lbl>{children}</div>; }
function PlusBtn({ onClick }) { return <button onClick={onClick} style={{ background: "var(--accent,#1D4ED8)", color: "#fff", border: "none", borderRadius: 20, width: 34, height: 34, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}>+</button>; }
function AppHeader({ title, sub, right, back, onBack }) { return (<div style={{ background: T.card, borderBottom: \`1px solid \${T.border}\`, padding: "12px 18px", flexShrink: 0, position: "sticky", top: 0, zIndex: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}>{back && <button onClick={onBack} style={{ background: T.bg, border: "none", borderRadius: 10, width: 32, height: 32, fontSize: 16, color: T.sub, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>}<div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>{title}</div>{sub && <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{sub}</div>}</div>{right}</div></div>); }

function LoginModal({ titulo, onSuccess, onClose }) {
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const [err, setErr] = useState('');
    const [showPass, setShowPass] = useState(false);
    function login() {
        const usuario = u.trim().toLowerCase();
        const contra = p.trim();
        if (!usuario || !contra) { setErr('Completá usuario y contraseña'); return; }
        const f = ADMIN_CREDS.find(c => c.user === usuario && c.pass === contra);
        if (f) { setErr(''); onSuccess(f); } else { setErr('Usuario o contraseña incorrectos'); }
    }
    return (<Sheet title={titulo || "Acceso requerido"} onClose={onClose}>
        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#15803D"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" /></svg>
            <span style={{ fontSize: 12, color: "#15803D", fontWeight: 600 }}>Área protegida – Acceso administrativo</span>
        </div>
        <Field label="Usuario">
            <input value={u} onChange={e => { setU(e.target.value); setErr(''); }} placeholder="Ingresá tu usuario"
                autoCapitalize="none" autoCorrect="off" autoComplete="username"
                onKeyDown={e => e.key === 'Enter' && login()}
                style={{ width: "100%", background: T.bg, border: \`1.5px solid \${err ? '#FECACA' : T.border}\`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }} />
        </Field>
        <Field label="Contraseña">
            <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={p} onChange={e => { setP(e.target.value); setErr(''); }}
                    placeholder="••••••••" autoComplete="current-password"
                    onKeyDown={e => e.key === 'Enter' && login()}
                    style={{ width: "100%", background: T.bg, border: \`1.5px solid \${err ? '#FECACA' : T.border}\`, borderRadius: T.rsm, padding: "11px 44px 11px 14px", fontSize: 14, color: T.text }} />
                <button onClick={() => setShowPass(v => !v)} type="button"
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: showPass ? "var(--accent,#1D4ED8)" : T.muted, display: "flex", alignItems: "center", padding: 4 }}>
                    {showPass
                        ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="currentColor" strokeWidth="1.5" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" /></svg>
                    }
                </button>
            </div>
        </Field>
        {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#EF4444", marginBottom: 12, fontWeight: 600, display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="evenodd" clipRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg>
            {err}
        </div>}
        <PBtn full onClick={login}>Ingresar</PBtn>
    </Sheet>);
}

const NAV_DEFS = [
    { id: "chat", tk: "nav_ia", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" /></svg> },
    { id: "dashboard", tk: "nav_inicio", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.061l8.69-8.69z" /><path d="M12 5.432l8.159 8.159.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198l.091-.086L12 5.432z" /></svg> },
    { id: "obras", tk: "nav_obras", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75V19.5H9z" /></svg> },
    { id: "personal", tk: "nav_personal", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> },
    { id: "cargar", tk: "nav_cargar", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" /><path fillRule="evenodd" clipRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H6a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg> },
    { id: "mas", tk: "nav_mas", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" /></svg> },
];
function BottomNav({ view, setView, alerts, cfg }) {
    return (<nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: T.card, borderTop: \`1px solid \${T.border}\`, display: "flex", padding: "6px 0 max(8px,env(safe-area-inset-bottom))", zIndex: 100, boxShadow: "0 -2px 16px rgba(0,0,0,.06)" }}>
        {NAV_DEFS.map(n => {
            const active = view === n.id; const badge = n.id === "dashboard" && alerts.length > 0; const label = t(cfg, n.tk); return (
                <button key={n.id} onClick={() => setView(n.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", color: n.id === "cargar" ? "#fff" : active ? "var(--accent,#1D4ED8)" : T.muted, padding: "4px 0", position: "relative" }}>
                    {n.id === "cargar" ? <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--accent,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -16, boxShadow: "0 4px 14px rgba(0,0,0,.25)", border: \`3px solid \${T.card}\` }}>{n.icon}</div> : n.icon}
                    <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: n.id === "cargar" ? "var(--accent,#1D4ED8)" : undefined }}>{label}</span>
                    {badge && <div style={{ position: "absolute", top: 4, right: "calc(50% - 12px)", width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: \`1.5px solid \${T.card}\` }} />}
                </button>
            );
        })}
    </nav>);
}

function Dashboard({ lics, obras, personal, alerts, setView, setDetailObraId, requireAuth, cfg, customIcons = {} }) {
    const UBICS = getUbics(cfg);
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <div style={{ background: T.navy, padding: "16px 18px 20px" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 3 }}>{t(cfg, 'dash_subtitulo')}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{t(cfg, 'dash_titulo')}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>{new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
                {[{ l: t(cfg, 'dash_licitaciones'), v: lics.filter(l => !["adjudicada", "descartada"].includes(l.estado)).length, c: "#60A5FA" }, { l: t(cfg, 'dash_obras_activas'), v: obras.filter(o => o.estado === "curso").length, c: "#34D399" }, { l: t(cfg, 'dash_alertas'), v: alerts.length, c: "#FBBF24" }, { l: t(cfg, 'dash_personal'), v: personal.length, c: "#A78BFA" }].map(k => (
                    <div key={k.l} style={{ background: "rgba(255,255,255,.08)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: k.c }}>{k.v}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", marginTop: 2, lineHeight: 1.3 }}>{k.l}</div>
                    </div>
                ))}
            </div>
        </div>
        <div style={{ padding: "14px 18px" }}>
            {alerts.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>⚠ {t(cfg, 'dash_alertas')}</div>{alerts.slice(0, 3).map(a => (<div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, background: a.prioridad === "alta" ? "#FEF2F2" : "#FFFBEB", border: \`1px solid \${a.prioridad === "alta" ? "#FECACA" : "#FDE68A"}\`, borderRadius: 10, padding: "10px 12px", marginBottom: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: a.prioridad === "alta" ? "#EF4444" : "#F59E0B", flexShrink: 0 }} /><div style={{ fontSize: 12, color: T.text, lineHeight: 1.4, flex: 1 }}>{a.msg}</div></div>))}</div>}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t(cfg, 'dash_obras_curso')}</div>
                    <button onClick={() => setView("obras")} style={{ fontSize: 12, color: T.accent, background: "none", border: "none", fontWeight: 600 }}>{t(cfg, 'dash_ver_todas')}</button>
                </div>
                {obras.filter(o => o.estado === "curso").map(o => (<Card key={o.id} onClick={() => { setDetailObraId(o.id); setView("obras"); }} style={{ padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><div style={{ fontSize: 13, fontWeight: 600, color: T.text, flex: 1, paddingRight: 8 }}>{o.nombre}</div><Badge color="#10B981" bg="#ECFDF5">{o.avance}%</Badge></div>
                    <div style={{ height: 4, background: T.bg, borderRadius: 4, marginBottom: 6 }}><div style={{ height: 4, background: T.accent, borderRadius: 4, width: \`\${o.avance}%\` }} /></div>
                    <div style={{ fontSize: 11, color: T.muted }}>{UBICS.find(a => a.id === o.ap)?.code || o.ap} · {t(cfg, 'obras_cierre')}: {o.cierre}</div>
                </Card>))}
            </div>
            <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t(cfg, 'dash_acciones')}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[{ label: t(cfg, 'dash_nueva_lic'), view: "licitaciones", lock: true, icon: "📋" }, { label: t(cfg, 'dash_nueva_obra'), view: "obras", lock: true, icon: "🏗" }, { label: t(cfg, 'dash_presup_mat'), view: "presupuesto_materiales", lock: false, icon: "📦" }, { label: t(cfg, 'dash_subcontratos'), view: "presupuesto_subcontratos", lock: false, icon: "🤝" }].map(a => (
                        <button key={a.label} onClick={() => a.lock ? requireAuth(() => setView(a.view), a.label) : setView(a.view)} style={{ background: T.card, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "14px 12px", textAlign: "left", boxShadow: T.shadow, cursor: "pointer", position: "relative" }}>
                            <div style={{ fontSize: 16, marginBottom: 4 }}>{a.icon}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{a.label}</div>
                            {a.lock && <div style={{ position: "absolute", top: 8, right: 8, opacity: .4 }}><svg width="11" height="11" viewBox="0 0 24 24" fill={T.sub}><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg></div>}
                        </button>
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
    const [editing, setEditing] = useState(false);
    const [rawVal, setRawVal] = useState(value || '');
    useEffect(() => { if (!editing) setRawVal(value || ''); }, [value, editing]);
    function handleFocus() { setEditing(true); setRawVal(String(value || '').replace(/[^0-9.,]/g, '')); }
    function handleBlur() { setEditing(false); const n = parseFloat(String(rawVal).replace(/\./g,'').replace(',','.')); const v = n ? '$' + n.toLocaleString('es-AR') : rawVal; setRawVal(v); onChange(v); }
    function handleChange(e) { setRawVal(e.target.value); onChange(e.target.value); }
    return <input value={rawVal} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder || '$ 0'} inputMode="decimal" style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }} />;
}

function DocGrid({ docs, onUpload, onRemove, refs, prefix }) {
    return (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{LIC_DOC_TYPES.map(d => {
        const doc = docs?.[d.id]; const rk = \`\${prefix}_\${d.id}\`; return (<div key={d.id}><input type="file" accept={d.accept} style={{ display: "none" }} ref={el => refs.current[rk] = el} onChange={async e => { if (e.target.files[0]) await onUpload(d.id, e.target.files[0]); e.target.value = ""; }} />
            {doc ? (<div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 10, padding: "9px 10px" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#15803D", marginBottom: 2 }}>{d.label}</div><div style={{ fontSize: 10, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{doc.nombre}</div><div style={{ display: "flex", gap: 4 }}><a href={doc.url} download={doc.nombre} style={{ textDecoration: "none", flex: 1 }}><button style={{ width: "100%", background: "none", border: "1px solid #86EFAC", borderRadius: 6, padding: "4px 0", fontSize: 9, color: "#15803D", fontWeight: 600, cursor: "pointer" }}>↓ Ver</button></a><button onClick={() => onRemove(d.id)} style={{ background: "none", border: "1px solid #FCA5A5", borderRadius: 6, padding: "4px 7px", fontSize: 9, color: "#EF4444", cursor: "pointer" }}>✕</button></div></div>
            ) : (<button onClick={() => refs.current[rk]?.click()} style={{ width: "100%", background: T.bg, border: "1.5px dashed #86EFAC", borderRadius: 10, padding: "10px 6px", cursor: "pointer", textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#15803D", marginBottom: 2 }}>{d.label.slice(0, 3).toUpperCase()}</div><div style={{ fontSize: 11, fontWeight: 600, color: T.sub }}>{d.label}</div><div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>Subir</div></button>)}</div>);
    })}</div>);
}

function Licitaciones({ lics, setLics, requireAuth, cfg, obras, setObras }) {
    const UBICS = getUbics(cfg);
    const [ap, setAp] = useState("todos"); const [showNew, setShowNew] = useState(false); const [showDetail, setShowDetail] = useState(null);
    const [form, setForm] = useState({ nombre: "", ap: "aep", estado: "visitar", monto: "", fecha: "", sector: "", docs: {} });
    const docRefs = useRef({}); const newDocRefs = useRef({});
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
            obs: [{ id: uid(), txt: \`Obra creada automáticamente al adjudicar la licitación.\`, fecha: new Date().toLocaleDateString("es-AR") }],
            fotos: [],
            archivos: [],
            informes: [],
            docs: {},
        };
        setObras(p => [...p, nuevaObra]);
    }

    function cambiarEstado(licId, nuevoEstado) {
        setLics(p => p.map(l => {
            if (l.id !== licId) return l;
            if ((nuevoEstado === "adjudicada" || nuevoEstado === "curso") && l.estado !== nuevoEstado) autoCrearObra({ ...l, estado: nuevoEstado });
            return { ...l, estado: nuevoEstado };
        }));
    }
    function add() { if (!form.nombre.trim()) return; setLics(p => [...p, { ...form, id: uid() }]); setForm({ nombre: "", ap: "aep", estado: "visitar", monto: "", fecha: "", sector: "", docs: {} }); setShowNew(false); }
    function del(id) { setLics(p => p.filter(l => l.id !== id)); setShowDetail(null); }
    async function handleDoc(licId, did, file) { const url = await toDataUrl(file); setLics(p => p.map(l => l.id === licId ? { ...l, docs: { ...(l.docs || {}), [did]: { nombre: file.name, url } } } : l)); }
    async function handleNewDoc(did, file) { const url = await toDataUrl(file); setForm(f => ({ ...f, docs: { ...(f.docs || {}), [did]: { nombre: file.name, url } } })); }
    const detail = showDetail ? lics.find(l => l.id === showDetail) : null;
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Licitaciones" sub={\`\${filtered.length} registros\`} right={<PlusBtn onClick={() => requireAuth(() => setShowNew(true), "Nueva licitación")} />} />
        <div style={{ padding: "10px 18px", display: "flex", gap: 6, overflowX: "auto" }}>{[{ id: "todos", label: "Todos" }, ...AIRPORTS.map(a => ({ id: a.id, label: a.code }))].map(f => (<button key={f.id} onClick={() => setAp(f.id)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: \`1.5px solid \${ap === f.id ? "var(--accent,#1D4ED8)" : T.border}\`, background: ap === f.id ? T.accentLight : T.card, color: ap === f.id ? T.accent : T.sub, fontSize: 12, fontWeight: 600 }}>{f.label}</button>))}</div>
        <div style={{ padding: "0 18px" }}>
            {LIC_ESTADOS.map(est => { const items = filtered.filter(l => l.estado === est.id); if (!items.length) return null; return (<div key={est.id} style={{ marginBottom: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: est.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: est.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{est.label}</span><span style={{ fontSize: 11, color: T.muted }}>({items.length})</span></div>{items.map(lic => { const obraVinc = obras.find(o => o.lic_id === lic.id); return (<Card key={lic.id} onClick={() => setShowDetail(lic.id)} style={{ padding: "13px 14px", marginBottom: 7, cursor: "pointer" }}><div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ flex: 1, paddingRight: 8 }}><div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>{lic.nombre}{obraVinc && <span style={{ fontSize: 9, fontWeight: 700, background: "#ECFDF5", color: "#10B981", border: "1px solid #86EFAC", borderRadius: 20, padding: "1px 6px" }}>🏗 EN OBRA</span>}</div><div style={{ fontSize: 11, color: T.muted }}>{AIRPORTS.find(a => a.id === lic.ap)?.code}{lic.sector ? \` · \${lic.sector}\` : ""}</div></div><div style={{ textAlign: "right", flexShrink: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{lic.monto}</div><div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{lic.fecha}</div></div></div></Card>); })}</div>); })}
        </div>
        {showNew && (<Sheet title="Nueva licitación" onClose={() => setShowNew(false)}><Field label="Nombre"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Refacción Terminal B" /></Field><FieldRow><Field label="Aeropuerto"><Sel value={form.ap} onChange={e => setForm(p => ({ ...p, ap: e.target.value }))}>{AIRPORTS.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</Sel></Field><Field label="Estado"><Sel value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>{LIC_ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</Sel></Field></FieldRow><FieldRow><Field label="Monto"><MontoInput value={form.monto} onChange={v => setForm(p => ({ ...p, monto: v }))} placeholder="0 $" /></Field><Field label="Sector"><TInput value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} placeholder="Terminal A" /></Field></FieldRow><Field label="Fecha"><TInput value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} placeholder="dd/mm/aa" /></Field><div style={{ marginBottom: 14 }}><Lbl>Documentos</Lbl><DocGrid docs={form.docs} onUpload={handleNewDoc} onRemove={did => setForm(f => ({ ...f, docs: { ...f.docs, [did]: null } }))} refs={newDocRefs} prefix="new" /></div><PBtn full onClick={add} disabled={!form.nombre.trim()}>Crear licitación</PBtn></Sheet>)}
        {detail && (<Sheet title={detail.nombre} onClose={() => setShowDetail(null)}>
            <Field label="Nombre">
                <TInput value={detail.nombre} onChange={e => setLics(p => p.map(l => l.id === detail.id ? { ...l, nombre: e.target.value } : l))} placeholder="Nombre de la licitación" />
            </Field>
            <FieldRow>
                <Field label="Aeropuerto">
                    <Sel value={detail.ap} onChange={e => setLics(p => p.map(l => l.id === detail.id ? { ...l, ap: e.target.value } : l))}>
                        {AIRPORTS.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name}</option>)}
                    </Sel>
                </Field>
                <Field label="Monto">
                    <MontoInput value={detail.monto || ''} onChange={v => setLics(p => p.map(l => l.id === detail.id ? { ...l, monto: v } : l))} placeholder="0 $" />
                </Field>
            </FieldRow>
            <FieldRow>
                <Field label="Sector">
                    <TInput value={detail.sector || ''} onChange={e => setLics(p => p.map(l => l.id === detail.id ? { ...l, sector: e.target.value } : l))} placeholder="Terminal A" />
                </Field>
                <Field label="Fecha">
                    <TInput value={detail.fecha || ''} onChange={e => setLics(p => p.map(l => l.id === detail.id ? { ...l, fecha: e.target.value } : l))} placeholder="dd/mm/aa" />
                </Field>
            </FieldRow>
            <div style={{ marginBottom: 16 }}><Lbl>Documentos</Lbl><DocGrid docs={detail.docs || {}} onUpload={(did, file) => handleDoc(detail.id, did, file)} onRemove={did => setLics(p => p.map(l => l.id === detail.id ? { ...l, docs: { ...(l.docs || {}), [did]: null } } : l))} refs={docRefs} prefix={\`det_\${detail.id}\`} /></div>
            <Field label="Estado">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {LIC_ESTADOS.map(e => (<button key={e.id} onClick={() => cambiarEstado(detail.id, e.id)} style={{ padding: "7px 4px", borderRadius: T.rsm, border: \`1.5px solid \${detail.estado === e.id ? e.color : T.border}\`, background: detail.estado === e.id ? e.bg : T.card, color: e.color, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{e.label}</button>))}
                </div>
            </Field>
            {(detail.estado === "adjudicada" || detail.estado === "curso") && (() => { const obraVinc = obras.find(o => o.lic_id === detail.id); return obraVinc ? (
                <div style={{ background: "#ECFDF5", border: "1px solid #86EFAC", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#10B981"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#15803D" }}>✅ Obra creada automáticamente</div><div style={{ fontSize: 11, color: "#166534", marginTop: 1 }}>{obraVinc.nombre} — En Curso ({obraVinc.avance}%)</div></div>
                </div>
            ) : (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ fontSize: 12, color: "#92400E", fontWeight: 600 }}>⚠ Sin obra vinculada</div>
                    <button onClick={() => autoCrearObra(detail)} style={{ background: "#F59E0B", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Crear obra ahora</button>
                </div>
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

    function toggleSel(id) { setSelFotos(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }

    async function analizarFotos() {
        if (!apiKey) { setInforme('⚠ Configurá tu API Key en Más → Configuración para usar esta función.'); return; }
        const fotosAAnalizar = selFotos.length > 0 ? fotos.filter(f => selFotos.includes(f.id)) : fotos.slice(-8);
        if (!fotosAAnalizar.length) { setInforme('Agregá al menos una foto para analizar.'); return; }
        setLoadingIA(true); setInforme('');
        try {
            const content = [];
            fotosAAnalizar.forEach(f => {
                try { content.push({ type: 'image', source: { type: 'base64', media_type: getMediaType(f.url), data: getBase64(f.url) } }); } catch { }
            });
            content.push({
                type: 'text', text: \`Analizá estas \${fotosAAnalizar.length} fotos de la obra "\${detail.nombre}" (\${detail.sector || '—'}, avance declarado: \${detail.avance}%).

Generá un informe profesional AA2000 con:
1. **Estado general de la obra** — describí lo que se ve en las fotos
2. **Avance estimado** — ¿coincide con el \${detail.avance}% declarado?
3. **Trabajos en ejecución** — qué trabajos se observan
4. **Correcciones y recomendaciones** — anomalías, riesgos, trabajos incorrectos o mejorables
5. **Alertas de seguridad** — EPP, orden, señalización
6. **Conclusión** — estado global y próximos pasos sugeridos

Usá un tono técnico y profesional. Respondé en español rioplatense.\`});

            const r = await callAI([{ role: 'user', content }],
                \`Sos un inspector de obras aeroportuarias para AA2000. Analizás fotos y generás informes técnicos precisos y profesionales en español rioplatense.\`,
                apiKey);
            setInforme(r);
            // Guardar el informe generado dentro de la obra
            const nuevoInf = { id: uid(), titulo: \`Análisis IA — \${new Date().toLocaleDateString('es-AR')}\`, tipo: 'diario', fecha: new Date().toLocaleDateString('es-AR'), notas: 'Generado automáticamente por IA a partir de fotos', nombre: 'informe_ia.txt', ext: 'IA', url: 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(r))), size: '—', cargado: new Date().toLocaleDateString('es-AR') };
            upd(detail.id, { informes: [nuevoInf, ...(detail.informes || [])] });
        } catch (e) { setInforme('Error al analizar: ' + e.message); }
        setLoadingIA(false); setModoSel(false); setSelFotos([]);
    }

    return (<div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFoto} style={{ display: "none" }} />

        {/* Barra de acciones */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <PBtn onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: "11px 0", fontSize: 13 }}>{t(cfg, 'obras_agregar_fotos')}</PBtn>
            {fotos.length > 0 && <button onClick={() => { setModoSel(v => !v); setSelFotos([]); }} style={{ background: modoSel ? T.accent : T.accentLight, border: \`1.5px solid \${T.accent}\`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 12, fontWeight: 700, color: modoSel ? "#fff" : T.accent, cursor: "pointer", flexShrink: 0 }}>
                {modoSel ? "Cancelar" : "Seleccionar"}
            </button>}
        </div>

        {/* Botón analizar */}
        {fotos.length > 0 && (<button onClick={analizarFotos} disabled={loadingIA} style={{ width: "100%", background: loadingIA ? "#94A3B8" : T.navy, border: "none", borderRadius: T.rsm, padding: "13px", marginBottom: 14, cursor: loadingIA ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#fff", fontSize: 13, fontWeight: 700 }}>
            {loadingIA
                ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Analizando fotos con IA…</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" clipRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" /></svg>{modoSel && selFotos.length > 0 ? \`Analizar \${selFotos.length} foto\${selFotos.length > 1 ? 's' : ''} seleccionada\${selFotos.length > 1 ? 's' : ''}\` : "Analizar fotos con IA"}</>}
        </button>)}

        {modoSel && <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginBottom: 10 }}>{selFotos.length === 0 ? "Tocá las fotos que querés analizar" : "" + selFotos.length + " seleccionada" + (selFotos.length > 1 ? "s" : "") + \` · o analizá las \${Math.min(fotos.length, 8)} más recientes\`}</div>}

        {/* Grilla de fotos */}
        {fotos.length === 0
            ? <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: 13 }}>{t(cfg, 'obras_sin_fotos')}</div>
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: informe ? 14 : 0 }}>
                {fotos.map(f => {
                    const sel = selFotos.includes(f.id); return (<div key={f.id} onClick={() => modoSel && toggleSel(f.id)} style={{ borderRadius: T.rsm, overflow: "hidden", border: \`2px solid \${sel ? "#10B981" : T.border}\`, cursor: modoSel ? "pointer" : "default", position: "relative" }}>
                        {sel && <div style={{ position: "absolute", top: 5, right: 5, width: 20, height: 20, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg></div>}
                        <img src={f.url} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", opacity: modoSel && !sel ? .6 : 1, transition: "opacity .2s" }} />
                        <div style={{ padding: "5px 8px", fontSize: 9, color: T.muted, background: T.card }}>{f.fecha}</div>
                        <button onClick={e => { e.stopPropagation(); upd(detail.id, { fotos: fotos.filter(x => x.id !== f.id) }); }} style={{ position: "absolute", top: 5, left: 5, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.5)", border: "none", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>✕</button>
                    </div>);
                })}
            </div>}

        {/* Informe generado */}
        {informe && (<Card style={{ padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} /><span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Informe IA generado</span></div>
                <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { try { navigator.clipboard.writeText(informe); } catch { } }} style={{ background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: 7, padding: "4px 10px", fontSize: 11, color: T.sub, cursor: "pointer" }}>📋 Copiar</button>
                    <button onClick={() => { const b = new Blob([informe], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = \`informe_\${detail.nombre}_\${new Date().toLocaleDateString('es-AR')}.txt\`; a.click(); }} style={{ background: T.navy, border: "none", borderRadius: 7, padding: "4px 10px", fontSize: 11, color: "#fff", cursor: "pointer" }}>⬇ Descargar</button>
                    <button onClick={() => setInforme('')} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 7, padding: "4px 8px", fontSize: 11, color: "#EF4444", cursor: "pointer" }}>✕</button>
                </div>
            </div>
            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "12px 14px", fontSize: 12, color: T.text, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 320, overflowY: "auto" }}>{informe}</div>
            <div style={{ fontSize: 10, color: "#10B981", marginTop: 8, fontWeight: 600 }}>✓ Guardado automáticamente en la pestaña Informes</div>
        </Card>)}
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
            {TIPOS_INF.map(tipo => (<button key={tipo.id} onClick={() => setSubTab(tipo.id)} style={{ flex: 1, padding: "8px 4px", borderRadius: 20, border: \`1.5px solid \${subTab === tipo.id ? tipo.color : T.border}\`, background: subTab === tipo.id ? tipo.bg : T.card, color: tipo.color, fontSize: 11, fontWeight: subTab === tipo.id ? 700 : 500, cursor: "pointer" }}>{tipo.label} ({informes.filter(i => i.tipo === tipo.id).length})</button>))}
        </div>

        {/* Botón subir */}
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png" multiple onChange={handleFile} style={{ display: "none" }} />
        <button onClick={() => setShowNew(true)} style={{ width: "100%", background: tp?.bg, border: \`1.5px dashed \${tp?.color}\`, borderRadius: T.rsm, padding: "12px", marginBottom: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 18, color: tp?.color }}>+</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: tp?.color }}>Subir informe {tp?.label}</span>
        </button>

        {/* Lista */}
        {filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "28px 0", color: T.muted, fontSize: 12 }}>Sin informes {tp?.label?.toLowerCase()}s cargados</div>
            : filtered.map(inf => (<div key={inf.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "11px 13px", marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: tp?.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: tp?.color }}>{inf.ext}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inf.titulo}</div>
                    <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{inf.fecha} · {inf.size}</div>
                    {inf.notas && <div style={{ fontSize: 10, color: T.sub, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inf.notas}</div>}
                </div>
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                    <a href={inf.url} download={inf.nombre} style={{ textDecoration: "none" }}>
                        <button style={{ background: T.accentLight, border: \`1px solid \${T.border}\`, borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.accent, fontSize: 12 }}>↓</button>
                    </a>
                    <button onClick={() => upd(detail.id, { informes: informes.filter(x => x.id !== inf.id) })} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 7, width: 30, height: 30, cursor: "pointer", color: "#EF4444", fontSize: 12 }}>✕</button>
                </div>
            </div>))}

        {/* Sheet nuevo informe */}
        {showNew && (<Sheet title={\`Subir informe \${tp?.label}\`} onClose={() => setShowNew(false)}>
            <Field label="Título (opcional)">
                <TInput value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder={\`Informe \${tp?.label?.toLowerCase()} \${new Date().toLocaleDateString('es-AR')}\`} />
            </Field>
            <FieldRow>
                <Field label="Tipo">
                    <Sel value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                        {TIPOS_INF.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </Sel>
                </Field>
                <Field label="Fecha">
                    <TInput value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} placeholder="dd/mm/aa" />
                </Field>
            </FieldRow>
            <Field label="Notas">
                <textarea value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Observaciones..." rows={3} style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "10px 12px", fontSize: 13, color: T.text, resize: "none" }} />
            </Field>
            <PBtn full onClick={() => fileRef.current?.click()}>📎 Seleccionar archivo</PBtn>
            <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 8 }}>PDF · DOC · DOCX · XLSX · JPG · PNG</div>
        </Sheet>)}
    </div>);
}

function Obras({ obras, setObras, lics, detailId, setDetailId, requireAuth, cfg, apiKey }) {
    const UBICS = getUbics(cfg); const LUBIC = getLabelUbic(cfg);
    const [showNew, setShowNew] = useState(false); const [tab, setTab] = useState("info");
    const [form, setForm] = useState({ nombre: "", ap: "aep", sector: "", estado: "pendiente", avance: 0, inicio: "", cierre: "" });
    const [newObs, setNewObs] = useState(""); const fileRef = useRef(null); const archRef = useRef(null);
    const detail = detailId ? obras.find(o => o.id === detailId) : null;
    function add() { if (!form.nombre.trim()) return; setObras(p => [...p, { ...form, id: uid(), avance: parseInt(form.avance) || 0, pagado: 0, obs: [], fotos: [], archivos: [], informes: [], docs: {} }]); setForm({ nombre: "", ap: "aep", sector: "", estado: "pendiente", avance: 0, inicio: "", cierre: "" }); setShowNew(false); }
    function upd(id, patch) { setObras(p => p.map(o => o.id === id ? { ...o, ...patch } : o)); }
    async function handleFoto(e) {
        if (!detail) return;
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const nuevas = await Promise.all(files.map(async f => ({ id: uid(), url: await toDataUrl(f), nombre: f.name, fecha: new Date().toLocaleDateString("es-AR") })));
        upd(detail.id, { fotos: [...(detail.fotos || []), ...nuevas] });
        e.target.value = "";
    }
    async function handleArch(e) { if (!detail) return; for (const f of Array.from(e.target.files)) { const url = await toDataUrl(f); upd(detail.id, { archivos: [...detail.archivos, { id: uid(), url, nombre: f.name, ext: f.name.split(".").pop().toUpperCase(), fecha: new Date().toLocaleDateString("es-AR") }] }); } e.target.value = ""; }
    const ec = id => OBRA_ESTADOS.find(e => e.id === id) || OBRA_ESTADOS[0];
    if (detail) {
        const e = ec(detail.estado); return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <AppHeader title={detail.nombre} sub={\`\${UBICS.find(a => a.id === detail.ap)?.code || detail.ap} · \${detail.sector || t(cfg, 'obras_sector')}\`} back onBack={() => setDetailId(null)} right={<Badge color={e.color} bg={e.bg}>{e.label}</Badge>} />
                <div style={{ background: T.card, borderBottom: \`1px solid \${T.border}\`, padding: "12px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{t(cfg, 'obras_avance')}</span><span style={{ fontSize: 14, fontWeight: 800, color: T.accent }}>{detail.avance}%</span></div>
                    <div style={{ height: 8, background: T.bg, borderRadius: 4 }}><div style={{ height: 8, background: T.accent, borderRadius: 4, width: \`\${detail.avance}%\`, transition: "width .5s" }} /></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}><span style={{ fontSize: 11, color: T.muted }}>{t(cfg, 'obras_inicio')}: {detail.inicio || "—"}</span><span style={{ fontSize: 11, color: T.muted }}>{t(cfg, 'obras_cierre')}: {detail.cierre || "—"}</span></div>
                    <input type="range" min="0" max="100" value={detail.avance} onChange={e => upd(detail.id, { avance: parseInt(e.target.value) })} style={{ width: "100%", accentColor: "var(--accent,#1D4ED8)", marginTop: 10 }} />
                </div>
                <div style={{ background: T.card, borderBottom: \`1px solid \${T.border}\`, display: "flex", overflowX: "auto" }}>{[[\`info\`, t(cfg, 'obras_info')], [\`obs\`, t(cfg, 'obras_notas')], [\`fotos\`, t(cfg, 'obras_fotos')], [\`archivos\`, t(cfg, 'obras_archivos')], [\`informes\`, 'Informes']].map(([id, label]) => (<button key={id} onClick={() => setTab(id)} style={{ flex: 1, minWidth: 52, padding: "10px 4px", background: "none", border: "none", fontSize: 11, fontWeight: tab === id ? 700 : 500, color: tab === id ? T.accent : T.muted, borderBottom: \`2px solid \${tab === id ? "var(--accent,#1D4ED8)" : "transparent"}\`, whiteSpace: "nowrap" }}>{label}</button>))}</div>
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
                    {tab === "info" && (<div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>{getLabelUbic(cfg)}</div>
                                <select value={detail.ap} onChange={e => upd(detail.id, { ap: e.target.value })} style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0, cursor: "pointer" }}>
                                    {UBICS.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name}</option>)}
                                </select>
                            </div>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>{t(cfg, 'obras_sector')}</div>
                                <input value={detail.sector || ''} onChange={e => upd(detail.id, { sector: e.target.value })} placeholder="Sin sector" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0 }} />
                            </div>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>{t(cfg, 'obras_inicio')}</div>
                                <input value={detail.inicio || ''} onChange={e => upd(detail.id, { inicio: e.target.value })} placeholder="dd/mm/aa" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0 }} />
                            </div>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>{t(cfg, 'obras_cierre')}</div>
                                <input value={detail.cierre || ''} onChange={e => upd(detail.id, { cierre: e.target.value })} placeholder="dd/mm/aa" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0 }} />
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>Presupuesto</div>
                                <input value={detail.monto || ''} onChange={e => upd(detail.id, { monto: e.target.value })} placeholder="$ 0" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0 }} />
                            </div>
                            <div style={{ background: detail.pagado > 0 ? "#ECFDF5" : T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>💰 Pagado</div>
                                <input value={detail.pagado || ''} onChange={e => { const v = e.target.value.replace(/[^0-9.]/g,''); upd(detail.id, { pagado: v ? parseFloat(v) : 0 }); }} placeholder="$ 0" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: "#10B981", padding: 0 }} />
                            </div>
                        </div>
                        {(detail.monto || detail.pagado > 0) && (() => {
                            const total = parseFloat(String(detail.monto || '0').replace(/[^0-9.]/g,'')) || 0;
                            const pagado = parseFloat(detail.pagado || 0);
                            const saldo = total - pagado;
                            const pct = total > 0 ? Math.round(pagado / total * 100) : 0;
                            return total > 0 ? (
                                <div style={{ background: pct > 80 ? "#FEF2F2" : "#F0FDF4", border: \`1px solid \${pct > 80 ? "#FECACA" : "#86EFAC"}\`, borderRadius: T.rsm, padding: "10px 12px", marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: 11, color: T.muted }}>Presupuesto consumido</span>
                                        <span style={{ fontSize: 12, fontWeight: 800, color: pct > 80 ? "#EF4444" : "#10B981" }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: 6, background: "#E2E8F0", borderRadius: 3, marginBottom: 8 }}>
                                        <div style={{ height: 6, background: pct > 80 ? "#EF4444" : "#10B981", borderRadius: 3, width: \`\${Math.min(pct,100)}%\`, transition: "width .5s" }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                                        <span style={{ color: T.muted }}>Pagado: <b style={{ color: "#10B981" }}>\${pagado.toLocaleString('es-AR')}</b></span>
                                        <span style={{ color: T.muted }}>Saldo: <b style={{ color: saldo < 0 ? "#EF4444" : T.text }}>\${saldo.toLocaleString('es-AR')}</b></span>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                        <Lbl>{t(cfg, 'obras_estado')}</Lbl>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>{OBRA_ESTADOS.map(e => (<button key={e.id} onClick={() => upd(detail.id, { estado: e.id })} style={{ padding: "9px", borderRadius: T.rsm, border: \`1.5px solid \${detail.estado === e.id ? e.color : T.border}\`, background: detail.estado === e.id ? e.bg : T.card, color: e.color, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{e.label}</button>))}</div>
                        <button onClick={() => { setObras(p => p.filter(o => o.id !== detail.id)); setDetailId(null); }} style={{ width: "100%", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm, padding: "9px", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>{t(cfg, 'obras_eliminar')}</button>
                    </div>)}
                    {tab === "obs" && (<div><div style={{ display: "flex", gap: 8, marginBottom: 14 }}><TInput value={newObs} onChange={e => setNewObs(e.target.value)} placeholder={t(cfg, 'obras_obs_placeholder')} /><PBtn onClick={() => { if (!newObs.trim()) return; const tx = newObs; setNewObs(""); upd(detail.id, { obs: [...detail.obs, { id: uid(), txt: tx, fecha: new Date().toLocaleDateString("es-AR") }] }); }} disabled={!newObs.trim()} style={{ padding: "11px 16px", flexShrink: 0 }}>+</PBtn></div>{[...detail.obs].reverse().map(o => (<Card key={o.id} style={{ padding: "12px 14px", marginBottom: 8 }}><div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{o.txt}</div><div style={{ fontSize: 10, color: T.muted, marginTop: 6 }}>{o.fecha}</div></Card>))}{detail.obs.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: 13 }}>{t(cfg, 'obras_sin_notas')}</div>}</div>)}
                    {tab === "fotos" && (<TabFotos detail={detail} upd={upd} fileRef={fileRef} handleFoto={handleFoto} apiKey={apiKey} cfg={cfg} />)}
                    {tab === "archivos" && (<div><input ref={archRef} type="file" accept=".pdf,.xlsx,.xls,.docx,.doc" multiple onChange={handleArch} style={{ display: "none" }} /><PBtn full onClick={() => archRef.current?.click()} style={{ marginBottom: 14 }}>{t(cfg, 'obras_agregar_arch')}</PBtn>{detail.archivos.map(f => (<div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "11px 13px", marginBottom: 7 }}><div style={{ width: 36, height: 36, borderRadius: 8, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 9, fontWeight: 700, color: T.accent }}>{f.ext}</span></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.nombre}</div><div style={{ fontSize: 10, color: T.muted }}>{f.fecha}</div></div><a href={f.url} download={f.nombre} style={{ textDecoration: "none" }}><button style={{ background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: 8, width: 30, height: 30, fontSize: 13, color: T.sub, cursor: "pointer" }}>↓</button></a></div>))}{detail.archivos.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: 13 }}>{t(cfg, 'obras_sin_archivos')}</div>}</div>)}
                    {tab === "informes" && <TabInformes detail={detail} upd={upd} />}
                </div>
            </div>
        );
    }
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title={t(cfg, 'obras_titulo')} sub={\`\${obras.length} registros\`} right={<PlusBtn onClick={() => requireAuth(() => setShowNew(true), t(cfg, 'obras_nueva'))} />} />
        <div style={{ padding: "14px 18px" }}>{OBRA_ESTADOS.map(est => { const items = obras.filter(o => o.estado === est.id); if (!items.length) return null; return (<div key={est.id} style={{ marginBottom: 16 }}><div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: est.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: est.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{est.label}</span><span style={{ fontSize: 11, color: T.muted }}>({items.length})</span></div>{items.map(o => (<Card key={o.id} onClick={() => setDetailId(o.id)} style={{ padding: "13px 14px", marginBottom: 7, cursor: "pointer" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{o.nombre}</div><span style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{o.avance}%</span></div><div style={{ height: 4, background: T.bg, borderRadius: 4, marginBottom: 6 }}><div style={{ height: 4, background: T.accent, borderRadius: 4, width: \`\${o.avance}%\` }} /></div><div style={{ fontSize: 11, color: T.muted }}>{UBICS.find(a => a.id === o.ap)?.code || o.ap} · {o.sector || "Sin sector"} · {o.cierre || "—"}</div></Card>))}</div>); })}    </div>
        {showNew && (<Sheet title={t(cfg, 'obras_nueva')} onClose={() => setShowNew(false)}><Field label={t(cfg, 'obras_titulo')}><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Refacción Terminal B" /></Field><FieldRow><Field label={getLabelUbic(cfg)}><Sel value={form.ap} onChange={e => setForm(p => ({ ...p, ap: e.target.value }))}>{UBICS.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name}</option>)}</Sel></Field><Field label={t(cfg, 'obras_estado')}><Sel value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>{OBRA_ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</Sel></Field></FieldRow><FieldRow><Field label={t(cfg, 'obras_sector')}><TInput value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} placeholder="Sector A" /></Field><Field label={\`\${t(cfg, 'obras_avance')} %\`}><TInput type="number" value={form.avance} onChange={e => setForm(p => ({ ...p, avance: e.target.value }))} placeholder="0" /></Field></FieldRow><FieldRow><Field label={t(cfg, 'obras_inicio')}><TInput value={form.inicio} onChange={e => setForm(p => ({ ...p, inicio: e.target.value }))} placeholder="dd/mm/aa" /></Field><Field label={t(cfg, 'obras_cierre')}><TInput value={form.cierre} onChange={e => setForm(p => ({ ...p, cierre: e.target.value }))} placeholder="dd/mm/aa" /></Field></FieldRow><PBtn full onClick={add} disabled={!form.nombre.trim()}>{t(cfg, 'obras_nueva')}</PBtn></Sheet>)}
    </div>);
}

function Personal({ personal, setPersonal, obras, cfg }) {
    const [showNew, setShowNew] = useState(false); const [expanded, setExpanded] = useState(null);
    const [form, setForm] = useState({ nombre: "", rol: "Técnico", empresa: "BelfastCM", obra_id: "", telefono: "", foto: "", tareas: [] });
    const fileRefs = useRef({}); const fotoRefs = useRef({}); const newFotoRef = useRef(null);
    const [nuevaTarea, setNuevaTarea] = useState({});
    function ini(n) { return n.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase(); }
    function add() { if (!form.nombre.trim()) return; setPersonal(p => [...p, { ...form, id: uid(), docs: {} }]); setForm({ nombre: "", rol: "Técnico", empresa: "BelfastCM", obra_id: "", telefono: "", foto: "", tareas: [] }); setShowNew(false); }
    function upd(id, patch) { setPersonal(p => p.map(x => x.id === id ? { ...x, ...patch } : x)); }
    async function handleDoc(pid, did, file) { const url = await toDataUrl(file); setPersonal(p => p.map(x => x.id === pid ? { ...x, docs: { ...x.docs, [did]: { nombre: file.name, url, vence: "" } } } : x)); }
    function setVence(pid, did, val) { setPersonal(p => p.map(x => x.id === pid ? { ...x, docs: { ...x.docs, [did]: { ...x.docs[did], vence: val } } } : x)); }
    const Av = ({ p, size = 38, showCam = false, onClick }) => (<div onClick={onClick} style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, position: "relative", overflow: "hidden", background: p.foto ? "transparent" : T.accentLight, border: \`1.5px solid \${T.border}\`, cursor: onClick ? "pointer" : "default" }}>{p.foto ? <img src={p.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .32, fontWeight: 700, color: T.accent }}>{ini(p.nombre)}</div>}{showCam && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.45)", padding: "4px 0", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 8, fontWeight: 600 }}>📷</span></div>}</div>);
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title={t(cfg, 'pers_titulo')} sub={\`\${personal.length} trabajadores\`} right={<PlusBtn onClick={() => setShowNew(true)} />} />
        <div style={{ padding: "14px 18px" }}>
            {personal.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: T.muted, fontSize: 14 }}>{t(cfg, 'pers_sin_personal')}</div>}
            {personal.map(p => {
                const docsOk = Object.values(p.docs || {}).filter(Boolean).length; const isOpen = expanded === p.id; const obraAsig = obras.find(o => o.id === p.obra_id); return (<Card key={p.id} style={{ marginBottom: 10, overflow: "hidden" }}>
                    <div onClick={() => setExpanded(isOpen ? null : p.id)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", cursor: "pointer" }}>
                        <Av p={p} size={40} />
                        <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{p.nombre}</div><div style={{ fontSize: 11, color: T.muted }}>{p.rol}{obraAsig ? \` · \${obraAsig.nombre}\` : ""}</div></div>
                        <div style={{ display: "flex", gap: 3, marginRight: 4 }}>{DOC_TYPES.map(d => { const doc = p.docs?.[d.id]; const exp = doc?.vence && daysSince(doc.vence) <= 5; return <div key={d.id} style={{ width: 7, height: 7, borderRadius: "50%", background: exp ? "#F59E0B" : doc ? "#22c55e" : T.border }} />; })}</div>
                        <span style={{ fontSize: 11, color: T.muted }}>{docsOk}/{DOC_TYPES.length}</span>
                        <span style={{ fontSize: 14, color: T.muted, marginLeft: 2 }}>{isOpen ? "⌃" : "⌄"}</span>
                    </div>
                    {isOpen && (<div style={{ padding: "0 14px 14px", borderTop: \`1px solid \${T.border}\` }}>
                        <div style={{ display: "flex", gap: 14, marginTop: 14, marginBottom: 16, alignItems: "flex-start" }}>
                            <div style={{ flexShrink: 0 }}><input type="file" accept="image/*" style={{ display: "none" }} ref={el => fotoRefs.current[p.id] = el} onChange={async e => { if (e.target.files[0]) upd(p.id, { foto: await toDataUrl(e.target.files[0]) }); e.target.value = ""; }} /><Av p={p} size={76} showCam onClick={() => fotoRefs.current[p.id]?.click()} /></div>
                            <div style={{ flex: 1 }}><Lbl>WhatsApp</Lbl><div style={{ display: "flex", gap: 6 }}><input type="tel" value={p.telefono || ""} onChange={e => upd(p.id, { telefono: e.target.value.replace(/\\D/g, '') })} placeholder="5491155556666" style={{ flex: 1, background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "9px 12px", fontSize: 13, color: T.text }} />{p.telefono && <a href={\`https://wa.me/\${p.telefono}\`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><button style={{ background: "#25D366", border: "none", borderRadius: 9, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: 14 }}>💬</button></a>}</div></div>
                        </div>
                        <Lbl>Documentación</Lbl>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, margin: "6px 0 12px" }}>
                            {DOC_TYPES.map(d => { const doc = p.docs?.[d.id]; const rk = \`\${p.id}_\${d.id}\`; const exp = doc?.vence && daysSince(doc.vence) <= 5; return (<div key={d.id}><input type="file" style={{ display: "none" }} ref={el => fileRefs.current[rk] = el} onChange={e => { if (e.target.files[0]) handleDoc(p.id, d.id, e.target.files[0]); e.target.value = ""; }} />{doc ? (<div style={{ background: exp ? "#FFFBEB" : "#F0FDF4", border: \`1.5px solid \${exp ? "#FDE68A" : "#86EFAC"}\`, borderRadius: 10, padding: "9px 10px" }}><div style={{ fontSize: 10, fontWeight: 700, color: exp ? "#92400E" : "#15803D", marginBottom: 2 }}>{d.label}</div><div style={{ fontSize: 10, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>{doc.nombre}</div>{d.acceptsExp && <input type="text" placeholder="Vence dd/mm/aa" value={doc.vence || ""} onChange={e => setVence(p.id, d.id, e.target.value)} style={{ width: "100%", fontSize: 10, padding: "4px 6px", border: \`1px solid \${T.border}\`, borderRadius: 6, background: "#fff", color: T.text, marginBottom: 6 }} />}<div style={{ display: "flex", gap: 4 }}><a href={doc.url} download={doc.nombre} style={{ textDecoration: "none", flex: 1 }}><button style={{ width: "100%", background: "none", border: \`1px solid \${exp ? "#FDE68A" : "#86EFAC"}\`, borderRadius: 6, padding: "4px 0", fontSize: 9, color: exp ? "#92400E" : "#15803D", fontWeight: 600, cursor: "pointer" }}>↓ Ver</button></a><button onClick={() => setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, docs: { ...x.docs, [d.id]: null } } : x))} style={{ background: "none", border: "1px solid #FCA5A5", borderRadius: 6, padding: "4px 7px", fontSize: 9, color: "#EF4444", cursor: "pointer" }}>✕</button></div></div>) : (<button onClick={() => fileRefs.current[rk]?.click()} style={{ width: "100%", background: T.bg, border: \`1.5px dashed \${T.border}\`, borderRadius: 10, padding: "10px 6px", cursor: "pointer", textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 3 }}>{d.label.slice(0, 3).toUpperCase()}</div><div style={{ fontSize: 10, fontWeight: 600, color: T.sub }}>{d.label}</div></button>)}</div>); })}
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Lbl>Tareas asignadas</Lbl>
                                <button onClick={() => {
                                    const tarea = prompt('Nueva tarea:');
                                    if (!tarea?.trim()) return;
                                    setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, tareas: [...(x.tareas || []), { id: uid(), txt: tarea.trim(), done: false, fecha: new Date().toLocaleDateString('es-AR') }] } : x));
                                }} style={{ fontSize: 11, background: T.accentLight, border: \`1px solid \${T.border}\`, borderRadius: 6, padding: '3px 8px', color: T.accent, cursor: 'pointer', fontWeight: 600 }}>+ Agregar</button>
                            </div>
                            {(p.tareas || []).length === 0 && <div style={{ fontSize: 12, color: T.muted, fontStyle: 'italic' }}>Sin tareas asignadas</div>}
                            {(p.tareas || []).map(t => (
                                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.done ? '#F0FDF4' : '#FFFBEB', border: \`1px solid \${t.done ? '#86EFAC' : '#FDE68A'}\`, borderRadius: 8, padding: '7px 10px', marginBottom: 5 }}>
                                    <input type="checkbox" checked={t.done} onChange={() => setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, tareas: x.tareas.map(tk => tk.id === t.id ? { ...tk, done: !tk.done } : tk) } : x))} style={{ accentColor: T.accent, width: 15, height: 15, flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontSize: 12, color: T.text, textDecoration: t.done ? 'line-through' : 'none' }}>{t.txt}</span>
                                    <span style={{ fontSize: 10, color: T.muted }}>{t.fecha}</span>
                                    <button onClick={() => setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, tareas: x.tareas.filter(tk => tk.id !== t.id) } : x))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 12, padding: 2 }}>✕</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { setPersonal(prev => prev.filter(x => x.id !== p.id)); if (expanded === p.id) setExpanded(null); }} style={{ width: "100%", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm, padding: "9px", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>{t(cfg, 'pers_eliminar')}</button>
                    </div>)}
                </Card>);
            })}
        </div>
        {showNew && (<Sheet title={t(cfg, 'pers_nuevo')} onClose={() => setShowNew(false)}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><input type="file" accept="image/*" ref={newFotoRef} style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); setForm(f => ({ ...f, foto: url })); } e.target.value = ""; }} /><div onClick={() => newFotoRef.current?.click()} style={{ width: 84, height: 84, borderRadius: "50%", cursor: "pointer", overflow: "hidden", background: form.foto ? "transparent" : T.bg, border: \`2px dashed \${T.border}\`, display: "flex", alignItems: "center", justifyContent: "center" }}>{form.foto ? <img src={form.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>📷</div><div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>Foto</div></div>}</div></div>
            <Field label={t(cfg, 'pers_nombre')}><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Juan García" /></Field>
            <FieldRow><Field label={t(cfg, 'pers_rol')}><Sel value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))}>{ROLES.map(r => <option key={r}>{r}</option>)}</Sel></Field><Field label={t(cfg, 'pers_empresa')}><TInput value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))} placeholder="BelfastCM" /></Field></FieldRow>
            <Field label={t(cfg, 'pers_whatsapp')}><TInput value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value.replace(/\\D/g, '') }))} placeholder="5491155556666" /></Field>
            <Field label={t(cfg, 'pers_obra')}><Sel value={form.obra_id} onChange={e => setForm(p => ({ ...p, obra_id: e.target.value }))}><option value="">Sin asignar</option>{obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</Sel></Field>
            <PBtn full onClick={add} disabled={!form.nombre.trim()}>{t(cfg, 'pers_agregar')}</PBtn>
        </Sheet>)}
    </div>);
}

function CargarView({ obras, setObras, cargarState, setCargarState, apiKey }) {
    const { obraId, newFotos, report } = cargarState;
    const [loading, setLoading] = useState(false);
    const camRef = useRef(null); const galRef = useRef(null);
    const setObraId = v => setCargarState(s => ({ ...s, obraId: v, newFotos: [], report: '' }));
    const setNewFotos = fn => setCargarState(s => ({ ...s, newFotos: typeof fn === 'function' ? fn(s.newFotos) : fn }));
    const setReport = v => setCargarState(s => ({ ...s, report: v }));
    const obra = obras.find(o => o.id === obraId); const prevFotos = obra?.fotos || [];
    async function handleFotos(e) { for (const f of Array.from(e.target.files)) { const url = await toDataUrl(f); setNewFotos(p => [...p, { id: uid(), url, nombre: f.name, fecha: new Date().toLocaleDateString('es-AR') }]); } e.target.value = ''; }
    async function generateReport() {
        if (!obra || !newFotos.length) return; setLoading(true); setReport('');
        try {
            const content = []; prevFotos.slice(-4).forEach(f => { try { content.push({ type: 'image', source: { type: 'base64', media_type: getMediaType(f.url), data: getBase64(f.url) } }); } catch { } }); newFotos.forEach(f => { try { content.push({ type: 'image', source: { type: 'base64', media_type: getMediaType(f.url), data: getBase64(f.url) } }); } catch { } });
            const pTxt = prevFotos.length > 0 ? \`Las primeras \${Math.min(prevFotos.length, 4)} imágenes son ANTERIORES y las últimas \${newFotos.length} son ACTUALES. Comparalas.\` : \`Las \${newFotos.length} imágenes son del estado actual.\`;
            content.push({ type: 'text', text: \`Generá informe de avance para "\${obra.nombre}" (\${AIRPORTS.find(a => a.id === obra.ap)?.code}). Avance: \${obra.avance}%. \${pTxt} Incluí: estado general, trabajos observados, comparación, alertas de seguridad y recomendaciones. Formato profesional AA2000.\` });
            let reportText = '';
            if (typeof window !== 'undefined' && window.claude?.complete) {
                const txtMsg = content.find(b => b.type === 'text');
                const nFotos = content.filter(b => b.type === 'image').length;
                reportText = await window.claude.complete(\`\${txtMsg?.text || 'Analizá estas fotos.'}

Analizá el estado de avance de esta obra basándote en la descripción. Generá un informe técnico profesional en español.\`);
            } else {
                if (!apiKey) { setReport('⚠ Configurá tu API Key en Más → Configuración.'); setLoading(false); return; }
                const headers = { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true", "anthropic-version": "2023-06-01", "x-api-key": apiKey };
                const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content }] }) });
                const d = await r.json(); reportText = d.content?.map(b => b.text || '').join('') || d.error?.message || 'Error.';
            }
            setReport(reportText);
            setObras(p => p.map(o => o.id === obraId ? { ...o, fotos: [...o.fotos, ...newFotos] } : o)); setNewFotos([]);
        } catch { setReport('Error de conexión.'); } setLoading(false);
    }
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Registro de Avance" sub="Fotos + Informe IA" />
        <div style={{ padding: "14px 18px" }}>
            <Card style={{ padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: obraId ? T.accent : "#E2E8F0", color: obraId ? "#fff" : T.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>1</div><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Seleccioná la obra</span></div>
                <Sel value={obraId} onChange={e => setObraId(e.target.value)}><option value="">— Elegir obra —</option>{obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</Sel>
                {obra && <div style={{ marginTop: 10, background: T.accentLight, borderRadius: 10, padding: "10px 12px" }}><div style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{obra.nombre}</div><div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>Avance: {obra.avance}% · {prevFotos.length} fotos anteriores</div></div>}
            </Card>
            {obra && (<Card style={{ padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>2</div><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Cargá fotos nuevas</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <input ref={camRef} type="file" accept="image/*" capture="environment" multiple onChange={handleFotos} style={{ display: "none" }} />
                    <input ref={galRef} type="file" accept="image/*" multiple onChange={handleFotos} style={{ display: "none" }} />
                    <button onClick={() => camRef.current?.click()} style={{ background: "#111", border: "none", borderRadius: T.rsm, padding: "13px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <svg width="46" height="38" viewBox="0 0 92 76" fill="none"><rect x="2" y="18" width="88" height="56" rx="9" fill="#1e293b" /><rect x="26" y="5" width="34" height="17" rx="6" fill="#0f172a" /><rect x="60" y="7" width="18" height="11" rx="3" fill="#fef3c7" /><rect x="61" y="8" width="16" height="9" rx="2" fill="#fbbf24" /><circle cx="46" cy="50" r="23" fill="#0f172a" /><circle cx="46" cy="50" r="19" fill="#1d4ed8" /><circle cx="46" cy="50" r="14" fill="#1e40af" /><circle cx="46" cy="50" r="9" fill="#1e3a8a" /><circle cx="46" cy="50" r="5" fill="#172554" /><ellipse cx="37" cy="41" rx="5.5" ry="4" fill="rgba(255,255,255,.35)" /></svg>
                        Tomar foto
                    </button>
                    <button onClick={() => galRef.current?.click()} style={{ background: "#f8fafc", border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "13px", color: T.text, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <svg width="46" height="38" viewBox="0 0 92 76" fill="none"><rect x="3" y="6" width="58" height="50" rx="5" fill="#94a3b8" transform="rotate(-8 32 31)" /><rect x="12" y="14" width="68" height="58" rx="5" fill="white" /><rect x="12" y="14" width="68" height="34" rx="5" fill="#dbeafe" /><circle cx="73" cy="24" r="9" fill="#fcd34d" /><polygon points="12,72 26,46 40,72" fill="#93c5fd" /><polygon points="28,72 42,48 56,72" fill="#60a5fa" /><polygon points="44,72 58,50 72,72" fill="#3b82f6" /><rect x="12" y="14" width="68" height="58" rx="5" fill="none" stroke="#e2e8f0" strokeWidth="1" /></svg>
                        Galería / PC
                    </button>
                </div>
                {newFotos.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>{newFotos.map(f => (<div key={f.id} style={{ position: "relative", borderRadius: 9, overflow: "hidden", border: \`1px solid \${T.border}\` }}><img src={f.url} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} /><button onClick={() => setNewFotos(p => p.filter(x => x.id !== f.id))} style={{ position: "absolute", top: 3, right: 3, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.6)", border: "none", color: "#fff", fontSize: 11, cursor: "pointer" }}>×</button></div>))}</div>}
                {prevFotos.length > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 6, textTransform: "uppercase" }}>Anteriores ({prevFotos.length})</div><div style={{ display: "flex", gap: 6, overflowX: "auto" }}>{prevFotos.slice(-6).map(f => (<img key={f.id} src={f.url} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0, border: \`1px solid \${T.border}\`, opacity: .6 }} />))}</div></div>}
            </Card>)}
            {obra && (<Card style={{ padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>3</div><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Generar informe IA</span></div>
                <button onClick={generateReport} disabled={!newFotos.length || loading} style={{ width: "100%", background: newFotos.length && !loading ? T.accent : "#E2E8F0", border: "none", borderRadius: T.rsm, padding: "14px", fontSize: 14, fontWeight: 700, color: newFotos.length && !loading ? "#fff" : "#94A3B8", cursor: newFotos.length && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Analizando...</> : "Comparar y generar informe"}
                </button>
            </Card>)}
            {report && (<Card style={{ padding: "16px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>✅ Informe generado</span><button onClick={() => { try { navigator.clipboard.writeText(report); } catch { } }} style={{ background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: 8, padding: "5px 10px", fontSize: 11, color: T.sub, cursor: "pointer" }}>📋 Copiar</button></div><div style={{ background: T.bg, borderRadius: T.rsm, padding: "14px", fontSize: 12, color: T.text, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 280, overflowY: "auto" }}>{report}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}><button onClick={() => setObraId('')} style={{ background: T.accentLight, border: \`1.5px solid \${T.accent}\`, borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: T.accent, cursor: "pointer" }}>+ Nuevo</button><button onClick={() => { const b = new Blob([report], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = \`informe_\${obra?.nombre || 'obra'}.txt\`; a.click(); }} style={{ background: "#111", border: "none", borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>⬇ Descargar</button></div></Card>)}
            {!obra && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📸</div><div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>Registro Fotográfico</div><div style={{ fontSize: 12, color: T.muted }}>Seleccioná una obra para comenzar</div></div>}
        </div>
    </div>);
}

function PresupuestoView({ tipo, setView }) {
    const titulo = tipo === 'materiales' ? 'Presupuesto Materiales' : 'Subcontratos';
    const [items, setItems] = useState([]); const [showNew, setShowNew] = useState(false);
    const [form, setForm] = useState({ descripcion: '', proveedor: '', monto: '', obra: '', estado: 'pendiente' });
    const [loaded, setLoaded] = useState(false); const key = \`bcm_presup_\${tipo}\`;
    useEffect(() => { (async () => { try { const r = await storage.get(key); if (r?.value) setItems(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []);
    useEffect(() => { if (loaded) storage.set(key, JSON.stringify(items)).catch(() => { }); }, [items, loaded]);
    const ESTADOS = [{ id: 'pendiente', label: 'Pendiente', color: '#F59E0B', bg: '#FFFBEB' }, { id: 'revision', label: 'En revisión', color: '#3B82F6', bg: '#EFF6FF' }, { id: 'aprobado', label: 'Aprobado', color: '#10B981', bg: '#ECFDF5' }, { id: 'rechazado', label: 'Rechazado', color: '#EF4444', bg: '#FEF2F2' }];
    const total = items.reduce((s, i) => { const n = parseFloat((i.monto || '').replace(/[^0-9.]/g, '')) || 0; return s + n; }, 0);
    function add() { if (!form.descripcion.trim()) return; setItems(p => [...p, { ...form, id: uid(), fecha: new Date().toLocaleDateString('es-AR') }]); setForm({ descripcion: '', proveedor: '', monto: '', obra: '', estado: 'pendiente' }); setShowNew(false); }
    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader title={titulo} back onBack={() => setView('dashboard')} sub={\`\${items.length} ítems\`} right={<PlusBtn onClick={() => setShowNew(true)} />} />
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
            <Card style={{ padding: "16px", marginBottom: 14, background: T.navy, color: "#fff", border: "none" }}><div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total {tipo}</div><div style={{ fontSize: 26, fontWeight: 800 }}>\${total.toLocaleString('es-AR')}</div></Card>
            {items.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Tocá + para agregar</div> : ESTADOS.map(est => { const ei = items.filter(i => i.estado === est.id); if (!ei.length) return null; return (<div key={est.id} style={{ marginBottom: 16 }}><div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: est.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: est.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{est.label}</span></div>{ei.map(item => (<Card key={item.id} style={{ padding: "13px 14px", marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><div style={{ flex: 1, paddingRight: 8 }}><div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.descripcion}</div>{item.proveedor && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{item.proveedor}{item.obra ? \` · \${item.obra}\` : ""}</div>}</div><div style={{ fontSize: 14, fontWeight: 800, color: T.accent, flexShrink: 0 }}>{item.monto || "—"}</div></div><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{ESTADOS.map(e => (<button key={e.id} onClick={() => setItems(p => p.map(i => i.id === item.id ? { ...i, estado: e.id } : i))} style={{ padding: "3px 8px", borderRadius: 20, border: \`1.5px solid \${item.estado === e.id ? e.color : T.border}\`, background: item.estado === e.id ? e.bg : T.card, color: e.color, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>{e.label}</button>))} <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))} style={{ padding: "3px 8px", borderRadius: 20, border: "1px solid #FECACA", background: "#FEF2F2", color: "#EF4444", fontSize: 9, fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}>✕</button></div></Card>))}</div>); })}
        </div>
        {showNew && (<Sheet title={\`Nuevo – \${titulo}\`} onClose={() => setShowNew(false)}><Field label="Descripción"><TInput value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} placeholder={tipo === 'materiales' ? "Cemento Portland" : "Subcontrato pintura"} /></Field><FieldRow><Field label={tipo === 'materiales' ? "Proveedor" : "Empresa"}><TInput value={form.proveedor} onChange={e => setForm(p => ({ ...p, proveedor: e.target.value }))} placeholder="Holcim" /></Field><Field label="Monto"><MontoInput value={form.monto} onChange={v => setForm(p => ({ ...p, monto: v }))} placeholder="0 $" /></Field></FieldRow><Field label="Obra"><TInput value={form.obra} onChange={e => setForm(p => ({ ...p, obra: e.target.value }))} placeholder="Terminal A" /></Field><Field label="Estado"><Sel value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>{ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</Sel></Field><PBtn full onClick={add} disabled={!form.descripcion.trim()}>Agregar</PBtn></Sheet>)}
    </div>);
}

function PanelVigilancia({ setView }) {
    const [camaras, setCamaras] = useState([]); const [showNew, setShowNew] = useState(false);
    const [form, setForm] = useState({ nombre: '', url: '', sector: '', ap: 'aep', tipo: 'ip' }); const [loaded, setLoaded] = useState(false);
    useEffect(() => { (async () => { try { const r = await storage.get('bcm_camaras'); if (r?.value) setCamaras(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []);
    useEffect(() => { if (loaded) storage.set('bcm_camaras', JSON.stringify(camaras)).catch(() => { }); }, [camaras, loaded]);
    function add() { if (!form.nombre || !form.url) return; setCamaras(p => [...p, { ...form, id: uid() }]); setForm({ nombre: '', url: '', sector: '', ap: 'aep', tipo: 'ip' }); setShowNew(false); }
    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader title="Panel de Vigilancia" back onBack={() => setView("mas")} sub="Cámaras en vivo" right={<PlusBtn onClick={() => setShowNew(true)} />} />
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
            <div style={{ background: T.navy, borderRadius: 14, padding: "16px", marginBottom: 16, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulse 2s infinite" }} /><span style={{ fontSize: 13, fontWeight: 700 }}>Sistema activo</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>{[{ l: "Total", v: camaras.length }, { l: "AEP", v: camaras.filter(c => c.ap === "aep").length }, { l: "EZE", v: camaras.filter(c => c.ap === "eze").length }].map(k => (<div key={k.l} style={{ background: "rgba(255,255,255,.1)", borderRadius: 8, padding: "8px", textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800 }}>{k.v}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.6)", marginTop: 2 }}>{k.l}</div></div>))}</div>
            </div>
            {camaras.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Sin cámaras configuradas</div> : camaras.map(cam => (<Card key={cam.id} style={{ padding: "14px 16px", marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 46, height: 46, borderRadius: 10, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="15" height="12" rx="2" stroke="#60A5FA" strokeWidth="1.5" /><path d="M17 11l4-2v6l-4-2v-2z" stroke="#60A5FA" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="9.5" cy="13" r="1.5" fill="#22c55e" /></svg></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{cam.nombre}</div><div style={{ fontSize: 11, color: T.muted }}>{AIRPORTS.find(a => a.id === cam.ap)?.code} · {cam.sector || "—"} · {cam.tipo?.toUpperCase()}</div><div style={{ fontSize: 10, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cam.url}</div></div><div style={{ display: "flex", gap: 6, flexShrink: 0 }}><a href={cam.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><button style={{ background: T.accent, border: "none", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M10 14L21 3M21 13v8H3V5h8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button></a><button onClick={() => setCamaras(p => p.filter(c => c.id !== cam.id))} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "#EF4444", fontSize: 14 }}>✕</button></div></div></Card>))}
        </div>
        {showNew && (<Sheet title="Agregar cámara" onClose={() => setShowNew(false)}><Field label="Nombre"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Cámara Terminal A" /></Field><Field label="URL"><TInput value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="http://192.168.1.100:8080" /></Field><FieldRow><Field label="Aeropuerto"><Sel value={form.ap} onChange={e => setForm(p => ({ ...p, ap: e.target.value }))}>{AIRPORTS.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</Sel></Field><Field label="Sistema"><Sel value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}><option value="ip">Cámara IP</option><option value="nvr">NVR Web</option><option value="hikvision">Hikvision</option><option value="dahua">Dahua</option><option value="otro">Otro</option></Sel></Field></FieldRow><Field label="Sector"><TInput value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} placeholder="Terminal A – Puerta 3" /></Field><PBtn full onClick={add} disabled={!form.nombre || !form.url}>Agregar cámara</PBtn></Sheet>)}
    </div>);
}

function Presentismo({ personal, setView }) {
    const [registros, setRegistros] = useState({}); const [scanning, setScanning] = useState(false); const [scanResult, setScanResult] = useState(null); const [bioLink, setBioLink] = useState(''); const [loaded, setLoaded] = useState(false);
    useEffect(() => { (async () => { try { const r = await storage.get('bcm_presentismo'); if (r?.value) { const d = JSON.parse(r.value); setRegistros(d.registros || {}); setBioLink(d.bioLink || ''); } } catch { } setLoaded(true); })(); }, []);
    useEffect(() => { if (loaded) storage.set('bcm_presentismo', JSON.stringify({ registros, bioLink })).catch(() => { }); }, [registros, bioLink, loaded]);
    const today = new Date().toLocaleDateString('es-AR');
    function simulateScan(persona) { if (scanning) return; setScanning(true); setScanResult(null); setTimeout(() => { const key = \`\${persona.id}_\${today}\`; const current = registros[key] || { entrada: null, salida: null, nombre: persona.nombre }; const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }); let result; if (!current.entrada) { setRegistros(r => ({ ...r, [key]: { ...current, entrada: hora } })); result = { tipo: 'entrada', hora, nombre: persona.nombre }; } else if (!current.salida) { setRegistros(r => ({ ...r, [key]: { ...current, salida: hora } })); result = { tipo: 'salida', hora, nombre: persona.nombre }; } else { result = { tipo: 'completo', nombre: persona.nombre }; } setScanResult(result); setScanning(false); }, 2200); }
    const todayRecords = Object.entries(registros).filter(([k]) => k.endsWith(today)).map(([, v]) => v);
    const FP = ({ active, ok }) => { const c = active ? 'var(--accent,#1D4ED8)' : ok ? '#10B981' : '#CBD5E1'; return (<svg width="70" height="70" viewBox="0 0 80 80" fill="none">{[4, 9, 15, 21, 27, 33].map((r, i) => (<ellipse key={i} cx="40" cy="41" rx={r} ry={r * .88} stroke={c} strokeWidth="2.2" fill="none" transform={i > 2 ? \`rotate(\${(i - 2) * -4} 40 41)\` : undefined} />))}<circle cx="40" cy="41" r="2.5" fill={c} />{active && <rect x="12" y="39" width="56" height="2" fill={c} opacity=".7" rx="1" />}</svg>); };
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Control de Presentismo" back onBack={() => setView("mas")} sub="Biométrico · Asistencia" />
        <div style={{ padding: "14px 18px" }}>
            <Card style={{ padding: "14px 16px", marginBottom: 12 }}><Lbl>Sistema biométrico externo</Lbl><div style={{ display: "flex", gap: 8 }}><TInput value={bioLink} onChange={e => setBioLink(e.target.value)} placeholder="https://sistema-biometrico.com" />{bioLink && <a href={bioLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}><button style={{ background: T.navy, border: "none", borderRadius: T.rsm, padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>Abrir →</button></a>}</div></Card>
            <Card style={{ padding: "20px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Registro biométrico · {today}</div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><div style={{ width: 110, height: 110, borderRadius: 20, background: scanning ? T.accentLight : "#F8FAFC", border: \`2px solid \${scanning ? T.accent : T.border}\`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}><FP active={scanning} ok={scanResult?.tipo === 'entrada' || scanResult?.tipo === 'salida'} />{scanning && <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: \`linear-gradient(90deg,transparent,var(--accent,#1D4ED8),transparent)\`, animation: "scanSweep 1.5s linear infinite", top: "50%" }} />}</div></div>
                {scanning && <div style={{ textAlign: "center", marginBottom: 12, fontSize: 13, color: T.accent, fontWeight: 600 }}>Leyendo huella digital…</div>}
                {scanResult && !scanning && (<div style={{ textAlign: "center", marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: scanResult.tipo === 'completo' ? "#FFFBEB" : "#ECFDF5", border: \`1px solid \${scanResult.tipo === 'completo' ? "#FDE68A" : "#86EFAC"}\`, fontSize: 13, fontWeight: 700, color: scanResult.tipo === 'completo' ? "#92400E" : "#15803D" }}>{scanResult.tipo === 'entrada' ? \`✓ \${scanResult.nombre}: Entrada \${scanResult.hora}\` : scanResult.tipo === 'salida' ? \`✓ \${scanResult.nombre}: Salida \${scanResult.hora}\` : \`ℹ \${scanResult.nombre}: Jornada ya registrada\`}</div>)}
                {personal.length === 0 ? <div style={{ textAlign: "center", color: T.muted, fontSize: 13 }}>Primero agregá personal</div> : (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{personal.map(p => { const key = \`\${p.id}_\${today}\`; const rec = registros[key]; const st = !rec?.entrada ? 'ausente' : !rec?.salida ? 'presente' : 'completo'; return (<button key={p.id} onClick={() => simulateScan(p)} disabled={scanning || st === 'completo'} style={{ background: st === 'presente' ? "#ECFDF5" : st === 'completo' ? "#F0FDF4" : T.bg, border: \`1.5px solid \${st === 'presente' ? "#86EFAC" : st === 'completo' ? "#22c55e" : T.border}\`, borderRadius: T.rsm, padding: "12px 8px", cursor: scanning || st === 'completo' ? "not-allowed" : "pointer" }}><div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 3 }}>{p.nombre.split(' ')[0]}</div><div style={{ fontSize: 10, color: T.muted, marginBottom: 5 }}>{p.rol}</div><div style={{ fontSize: 10, fontWeight: 700, color: st === 'ausente' ? "#94A3B8" : "#10B981" }}>{st === 'ausente' ? 'Sin registro' : st === 'presente' ? \`E: \${rec.entrada}\` : \`\${rec.entrada}–\${rec.salida}\`}</div></button>); })}</div>)}
            </Card>
            {todayRecords.length > 0 && (<Card style={{ padding: "14px 16px" }}><Lbl>Resumen hoy – {today}</Lbl>{todayRecords.map((r, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < todayRecords.length - 1 ? \`1px solid \${T.border}\` : "none" }}><span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{r.nombre}</span><span style={{ fontSize: 12, color: T.muted }}>{r.entrada}{r.salida ? \` – \${r.salida}\` : " (en obra)"}</span></div>))}</Card>)}
        </div>
    </div>);
}

// ── INFORMES DEL INGENIERO ─────────────────────────────────────────────
function InformesIngeniero({ setView }) {
    const [informes, setInformes] = useState([]); const [loaded, setLoaded] = useState(false);
    const [showNew, setShowNew] = useState(false); const [form, setForm] = useState({ titulo: '', obra: '', tipo: 'visita', fecha: '', notas: '' });
    const fileRef = useRef(null); const [uploading, setUploading] = useState(false);
    useEffect(() => { (async () => { try { const r = await storage.get('bcm_inf_ing'); if (r?.value) setInformes(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []);
    useEffect(() => { if (loaded) storage.set('bcm_inf_ing', JSON.stringify(informes)).catch(() => { }); }, [informes, loaded]);
    const TIPOS = [{ id: 'visita', label: 'Visita de obra', color: '#3B82F6', bg: '#EFF6FF' }, { id: 'inspeccion', label: 'Inspección', color: '#8B5CF6', bg: '#F5F3FF' }, { id: 'reunion', label: 'Reunión', color: '#F59E0B', bg: '#FFFBEB' }, { id: 'final', label: 'Informe final', color: '#10B981', bg: '#ECFDF5' }, { id: 'incidente', label: 'Incidente', color: '#EF4444', bg: '#FEF2F2' }];
    async function handleFile(e) {
        setUploading(true);
        const files = Array.from(e.target.files);
        const nuevos = [];
        for (const f of files) {
            const url = await toDataUrl(f);
            nuevos.push({ id: uid(), titulo: form.titulo || f.name.replace(/\\.[^.]+$/, ''), obra: form.obra, tipo: form.tipo, fecha: form.fecha || new Date().toLocaleDateString('es-AR'), notas: form.notas, nombre: f.name, ext: f.name.split('.').pop().toUpperCase(), url, size: (f.size / 1024).toFixed(0) + 'KB', cargado: new Date().toLocaleDateString('es-AR') });
        }
        setInformes(p => [...nuevos, ...p]);
        setForm({ titulo: '', obra: '', tipo: 'visita', fecha: '', notas: '' });
        setShowNew(false); setUploading(false);
        e.target.value = '';
    }
    const tipoMap = t => TIPOS.find(x => x.id === t) || TIPOS[0];
    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader title="Informes del Ingeniero" back onBack={() => setView("mas")} sub={\`\${informes.length} informes\`} right={<PlusBtn onClick={() => setShowNew(true)} />} />
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
            {informes.length === 0 && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📋</div><div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>Sin informes cargados</div><div style={{ fontSize: 12, color: T.muted }}>Tocá + para subir el primer informe</div></div>}
            {TIPOS.map(tipo => {
                const items = informes.filter(i => i.tipo === tipo.id);
                if (!items.length) return null;
                return (<div key={tipo.id} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: tipo.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: tipo.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{tipo.label}</span><span style={{ fontSize: 11, color: T.muted }}>({items.length})</span></div>
                    {items.map(inf => (<Card key={inf.id} style={{ padding: "13px 14px", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 10, background: tipo.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 10, fontWeight: 800, color: tipo.color }}>{inf.ext}</span></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inf.titulo}</div>
                                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{inf.obra ? \`\${inf.obra} · \` : ''}{inf.fecha} · {inf.size}</div>
                                {inf.notas && <div style={{ fontSize: 11, color: T.sub, marginTop: 3, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inf.notas}</div>}
                            </div>
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                <a href={inf.url} download={inf.nombre} style={{ textDecoration: "none" }}><button style={{ background: T.accentLight, border: \`1px solid \${T.border}\`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.accent, fontSize: 13 }}>↓</button></a>
                                <button onClick={() => setInformes(p => p.filter(x => x.id !== inf.id))} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#EF4444", fontSize: 13 }}>✕</button>
                            </div>
                        </div>
                    </Card>))}
                </div>);
            })}
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png" multiple onChange={handleFile} style={{ display: "none" }} />
        {showNew && (<Sheet title="Subir informe" onClose={() => setShowNew(false)}>
            <Field label="Título"><TInput value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Informe visita 15/04" /></Field>
            <FieldRow>
                <Field label="Obra"><TInput value={form.obra} onChange={e => setForm(p => ({ ...p, obra: e.target.value }))} placeholder="Terminal A" /></Field>
                <Field label="Fecha"><TInput value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} placeholder="dd/mm/aa" /></Field>
            </FieldRow>
            <Field label="Tipo de informe">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {TIPOS.map(tp => (<button key={tp.id} onClick={() => setForm(p => ({ ...p, tipo: tp.id }))} style={{ padding: "8px", borderRadius: T.rsm, border: \`1.5px solid \${form.tipo === tp.id ? tp.color : T.border}\`, background: form.tipo === tp.id ? tp.bg : T.card, color: tp.color, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{tp.label}</button>))}
                </div>
            </Field>
            <Field label="Notas"><textarea value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Observaciones del informe..." rows={3} style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "10px 12px", fontSize: 13, color: T.text, resize: "none" }} /></Field>
            <PBtn full onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Subiendo..." : "📎 Seleccionar archivo(s)"}</PBtn>
            <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 8 }}>PDF · DOC · DOCX · XLSX · JPG · PNG</div>
        </Sheet>)}
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
                const r = await storage.get('bcm_inf_ia'); if (r?.value) { const d = JSON.parse(r.value); setInformes(d.informes || []); setModeloDiario(d.modeloDiario || ''); setModeloSemanal(d.modeloSemanal || ''); }
            } catch { } setLoaded(true);
        })();
    }, []);
    useEffect(() => { if (loaded) storage.set('bcm_inf_ia', JSON.stringify({ informes, modeloDiario, modeloSemanal })).catch(() => { }); }, [informes, modeloDiario, modeloSemanal, loaded]);

    const obra = obras.find(o => o.id === obraId);

    async function generar(tipo) {
        if (!apiKey) { alert("Configurá tu API Key primero en Más → Configuración"); return; }
        const modelo = tipo === 'diario' ? modeloDiario : modeloSemanal;
        setLoading(tipo);
        const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const obraInfo = obra ? \`Obra: \${obra.nombre} | Aeropuerto: \${AIRPORTS.find(a => a.id === obra.ap)?.code} | Avance: \${obra.avance}% | Sector: \${obra.sector || '—'} | Estado: \${OBRA_ESTADOS.find(e => e.id === obra.estado)?.label}\\nNotas recientes: \${obra.obs?.slice(-3).map(o => o.txt).join(' | ') || 'Sin notas'}\` : 'Sin obra seleccionada';
        const persInfo = personal.length ? \`Personal en obra: \${personal.map(p => \`\${p.nombre} (\${p.rol})\`).join(', ')}\` : 'Sin personal registrado';
        const alertInfo = alerts.length ? \`Alertas activas: \${alerts.map(a => a.msg).join(' | ')}\` : 'Sin alertas';
        const prompt = modelo
            ? \`Completá el siguiente modelo de informe \${tipo} con los datos reales de la obra. Reemplazá los campos en blanco o entre corchetes con la información real. Mantené el formato y estructura del modelo.\\n\\nMODELO:\\n\${modelo}\\n\\nDATOS REALES:\\nFecha: \${today}\\n\${obraInfo}\\n\${persInfo}\\n\${alertInfo}\`
            : \`Generá un informe \${tipo === 'diario' ? 'diario' : 'semanal'} de obra profesional para AA2000 con estos datos:\\nFecha: \${today}\\n\${obraInfo}\\n\${persInfo}\\n\${alertInfo}\\n\\nIncluí: resumen ejecutivo, avance físico, personal en obra, materiales/equipos, observaciones, próximas actividades y firma del responsable. Formato profesional.\`;

        try {
            const r = await callAI([{ role: "user", content: prompt }], "Sos un ingeniero civil especialista en obras aeroportuarias AA2000. Redactás informes de obra en español profesional rioplatense, claros y completos.", apiKey);
            const nuevo = { id: uid(), tipo, titulo: \`Informe \${tipo} — \${new Date().toLocaleDateString('es-AR')}\`, obra: obra?.nombre || 'General', texto: r, fecha: new Date().toLocaleDateString('es-AR'), hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) };
            setInformes(p => [nuevo, ...p]);
            setTab("historial");
        } catch { alert("Error al generar. Verificá la API Key."); }
        setLoading(null);
    }

    function descargar(inf) {
        const b = new Blob([inf.texto], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = \`\${inf.titulo}.txt\`; a.click();
    }

    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader title="Informes IA" back onBack={() => setView("mas")} sub="Diarios y semanales" />
        <div style={{ background: T.card, borderBottom: \`1px solid \${T.border}\`, display: "flex" }}>
            {[["generar", "Generar"], ["modelos", "Modelos"], ["historial", \`Historial (\${informes.length})\`]].map(([id, label]) => (<button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "11px 0", background: "none", border: "none", fontSize: 12, fontWeight: tab === id ? 700 : 500, color: tab === id ? T.accent : T.muted, borderBottom: \`2px solid \${tab === id ? T.accent : "transparent"}\` }}>{label}</button>))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>

            {tab === "generar" && (<div>
                <Card style={{ padding: "14px 16px", marginBottom: 12, background: T.navy, border: "none", color: "#fff" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Generación automática con IA</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.5 }}>Seleccioná una obra y tipo de informe. La IA usará tus datos reales y el modelo que cargaste.</div>
                </Card>
                <Field label="Obra (opcional)">
                    <select value={obraId} onChange={e => setObraId(e.target.value)} style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }}>
                        <option value="">— Datos generales —</option>
                        {obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                    </select>
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                    <button onClick={() => generar('diario')} disabled={!!loading} style={{ background: loading === 'diario' ? "#94A3B8" : T.accent, border: "none", borderRadius: T.rsm, padding: "18px 12px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                        {loading === 'diario' ? <div style={{ width: 24, height: 24, border: "3px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> : <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
                        <div><div style={{ fontSize: 14, fontWeight: 700 }}>Informe Diario</div><div style={{ fontSize: 10, opacity: .8, marginTop: 2 }}>{modeloDiario ? "Con tu modelo" : "Formato estándar"}</div></div>
                    </button>
                    <button onClick={() => generar('semanal')} disabled={!!loading} style={{ background: loading === 'semanal' ? "#94A3B8" : "#7C3AED", border: "none", borderRadius: T.rsm, padding: "18px 12px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                        {loading === 'semanal' ? <div style={{ width: 24, height: 24, border: "3px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> : <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>}
                        <div><div style={{ fontSize: 14, fontWeight: 700 }}>Informe Semanal</div><div style={{ fontSize: 10, opacity: .8, marginTop: 2 }}>{modeloSemanal ? "Con tu modelo" : "Formato estándar"}</div></div>
                    </button>
                </div>
                {!apiKey && <div style={{ marginTop: 12, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#EF4444", fontWeight: 600 }}>⚠ Configurá tu API Key en Más → Configuración para usar esta función</div>}
            </div>)}

            {tab === "modelos" && (<div>
                <div style={{ background: T.accentLight, border: \`1px solid \${T.border}\`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: T.sub, lineHeight: 1.6 }}>
                    Cargá tu modelo de informe. La IA lo va a completar con los datos reales de la obra. Podés usar <strong>[FECHA]</strong>, <strong>[OBRA]</strong>, <strong>[AVANCE]</strong> como marcadores opcionales.
                </div>
                <Field label="Modelo de informe DIARIO">
                    <textarea
                        value={modeloDiario}
                        onChange={e => setModeloDiario(e.target.value)}
                        placeholder={"INFORME DIARIO DE OBRA\\nFecha: [FECHA]\\nObra: [OBRA]\\nAvance: [AVANCE]%\\n\\nTrabajos realizados:\\n\\nPersonal presente:\\n\\nObservaciones:\\n\\nFirma Responsable: ___________"}
                        rows={10}
                        style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "12px 14px", fontSize: 12, color: T.text, fontFamily: "monospace", lineHeight: 1.6 }}
                    />
                </Field>
                <Field label="Modelo de informe SEMANAL">
                    <textarea
                        value={modeloSemanal}
                        onChange={e => setModeloSemanal(e.target.value)}
                        placeholder={"INFORME SEMANAL DE OBRA\\nSemana: [FECHA]\\nObra: [OBRA]\\n\\nResumen ejecutivo:\\n\\nActividades completadas:\\n\\nActividades en curso:\\n\\nPróxima semana:\\n\\nIncidentes/alertas:\\n\\nFirma Responsable: ___________"}
                        rows={12}
                        style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "12px 14px", fontSize: 12, color: T.text, fontFamily: "monospace", lineHeight: 1.6 }}
                    />
                </Field>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button onClick={() => setModeloDiario('')} style={{ flex: 1, background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "9px", fontSize: 11, color: T.muted, cursor: "pointer" }}>↺ Borrar diario</button>
                    <button onClick={() => setModeloSemanal('')} style={{ flex: 1, background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "9px", fontSize: 11, color: T.muted, cursor: "pointer" }}>↺ Borrar semanal</button>
                </div>
                <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600, textAlign: "center", marginTop: 8 }}>✓ Los modelos se guardan automáticamente</div>
            </div>)}

            {tab === "historial" && (<div>
                {informes.length === 0 && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📄</div><div style={{ fontSize: 13, color: T.muted }}>Aún no generaste ningún informe</div></div>}
                {informes.map(inf => (<Card key={inf.id} style={{ padding: "14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: inf.tipo === 'diario' ? T.accentLight : "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 9, fontWeight: 800, color: inf.tipo === 'diario' ? T.accent : "#7C3AED" }}>{inf.tipo === 'diario' ? "DIA" : "SEM"}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{inf.titulo}</div>
                            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{inf.obra} · {inf.fecha} {inf.hora}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button onClick={() => descargar(inf)} style={{ background: T.accentLight, border: \`1px solid \${T.border}\`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.accent, fontSize: 13 }}>↓</button>
                            <button onClick={() => { try { navigator.clipboard.writeText(inf.texto); } catch { } }} style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#15803D", fontSize: 11 }}>📋</button>
                            <button onClick={() => setInformes(p => p.filter(x => x.id !== inf.id))} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#EF4444", fontSize: 13 }}>✕</button>
                        </div>
                    </div>
                    <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px", fontSize: 11, color: T.text, lineHeight: 1.6, maxHeight: 140, overflowY: "auto", whiteSpace: "pre-wrap" }}>{inf.texto.slice(0, 400)}{inf.texto.length > 400 ? "…" : ""}</div>
                </Card>))}
            </div>)}
        </div>
    </div>);
}

const CfgSection = memo(({ id, title, icon, children, openSec, setOpenSec }) => {
    const open = openSec === id;
    return (<div style={{ border: \`1px solid \${T.border}\`, borderRadius: T.rsm, marginBottom: 8, overflow: "hidden" }}>
        <div onClick={() => setOpenSec(open ? null : id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", cursor: "pointer", background: open ? T.accentLight : T.card }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: open ? T.accent : T.text, flex: 1 }}>{title}</span>
            <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{open ? "▲" : "▼"}</span>
        </div>
        {open && <div style={{ padding: "12px 14px", borderTop: \`1px solid \${T.border}\`, background: T.card }}>{children}</div>}
    </div>);
});

function Mas({ setView, authed, setAuthed, requireAuth, cfg, setCfg, apiKey, setApiKey, cfgLocked, setCfgLocked, lics, obras, personal, alerts, currentUser }) {
    const [showConfig, setShowConfig] = useState(false);
    const [openSec, setOpenSec] = useState("cuenta");
    const [localCfg, setLocalCfg] = useState({ ...DEFAULT_CONFIG, ...cfg });
    const [editIconMode, setEditIconMode] = useState(false);
    const [iconPickerFor, setIconPickerFor] = useState(null);
    const [customIcons, setCustomIcons] = useState(() => {
        try { return JSON.parse(localStorage.getItem('bcm_icons') || '{}'); } catch { return {}; }
    });
    const saveCustomIcons = (icons) => {
        setCustomIcons(icons);
        localStorage.setItem('bcm_icons', JSON.stringify(icons));
    };
    const [localKey, setLocalKey] = useState(apiKey || '');
    const [showKey, setShowKey] = useState(false);
    const [hasUnsaved, setHasUnsaved] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);
    const [showLockConfirm, setShowLockConfirm] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockUser, setUnlockUser] = useState('');
    const [unlockPass, setUnlockPass] = useState('');
    const [unlockErr, setUnlockErr] = useState('');
    const logoRef1 = useRef(null); const logoRef2 = useRef(null); const logoRef3 = useRef(null); const logoRef4 = useRef(null);

    function handleLock() { setCfgLocked(true); setShowLockConfirm(false); setShowConfig(false); }
    function tryUnlock() {
        const f = ADMIN_CREDS.find(c => c.user === unlockUser.trim().toLowerCase() && c.pass === unlockPass.trim());
        if (f) { setCfgLocked(false); setShowUnlockModal(false); setUnlockUser(''); setUnlockPass(''); setUnlockErr(''); }
        else { setUnlockErr('Usuario o contraseña incorrectos'); }
    }

    useEffect(() => { if (!showConfig) { setLocalCfg({ ...DEFAULT_CONFIG, ...cfg }); setHasUnsaved(false); setConfirmClose(false); } }, [cfg, showConfig]);

    // Detectar cambios pendientes comparando localCfg con cfg
    useEffect(() => {
        if (!showConfig) return;
        const a = JSON.stringify({ ...localCfg, logoBelfast: undefined, logoAA2000: undefined, logoAsistente: undefined, logoCentral: undefined });
        const b = JSON.stringify({ ...cfg, logoBelfast: undefined, logoAA2000: undefined, logoAsistente: undefined, logoCentral: undefined });
        setHasUnsaved(a !== b);
    }, [localCfg, cfg, showConfig]);

    const updateText = useCallback((patch) => { setLocalCfg(p => ({ ...p, ...patch })); }, []);
    const applyVisual = useCallback((patch) => { setCfg(p => ({ ...p, ...patch })); setLocalCfg(p => ({ ...p, ...patch })); }, [setCfg]);
    const applyThemePreset = useCallback((preset) => { applyVisual({ themeId: preset.id, colors: { accent: preset.accent, al: preset.al, bg: preset.bg, card: preset.card, border: preset.border, text: preset.text, sub: preset.sub, muted: preset.muted, navy: preset.navy } }); }, [applyVisual]);
    const applyColorKey = useCallback((key, value) => { const nc = { ...(cfg.colors || DEFAULT_COLORS), [key]: value }; if (key === 'accent') nc.al = hexLight(value); applyVisual({ themeId: 'custom', colors: nc }); }, [cfg, applyVisual]);
    const guardarYCerrar = useCallback(() => {
        setCfg(p => ({ ...p, ...localCfg }));
        setApiKey(localKey);
        storage.set('bcm_apikey', localKey).catch(() => { });
        setHasUnsaved(false); setConfirmClose(false); setShowConfig(false);
    }, [localCfg, localKey, setCfg, setApiKey]);
    const handleSetOpenSec = useCallback((v) => setOpenSec(v), []);

    async function exportarJSX() {
        try {
            let src = __SOURCE_CODE__;

            // Sanitizar datos: quitar fotos/archivos pesados de obras y personal para el export
            const licsClean = JSON.parse(JSON.stringify(lics)).map(l => ({ ...l, docs: {} }));
            const obrasClean = JSON.parse(JSON.stringify(obras)).map(o => ({
                ...o,
                fotos: [],        // fotos son base64 pesados — se omiten
                archivos: [],     // igual
                docs: {},
            }));
            const personalClean = JSON.parse(JSON.stringify(personal)).map(p => ({
                ...p,
                foto: '',         // foto de perfil base64 — se omite
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
            out = out.replace(/const DEMO_LICS = \\[[\\s\\S]*?\\];/, \`const DEMO_LICS = \${licsStr};\`);
            out = out.replace(/const DEMO_OBRAS = \\[[\\s\\S]*?\\];/, \`const DEMO_OBRAS = \${obrasStr};\`);
            out = out.replace(/const DEMO_PERSONAL = \\[[\\s\\S]*?\\];/, \`const DEMO_PERSONAL = \${personalStr};\`);
            out = out.replace(/const DEMO_ALERTS = \\[[\\s\\S]*?\\];/, \`const DEMO_ALERTS = \${alertsStr};\`);
            // Reemplazar DEFAULT_CONFIG con la config actual (solo la parte sin logos)
            out = out.replace(
                /const DEFAULT_CONFIG = \\{[^;]+\\};/,
                \`const DEFAULT_CONFIG = \${cfgStr};\`
            );

            const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = \`belfast_cm_publicado_\${new Date().toLocaleDateString('es-AR').replace(/\\//g, '-')}.jsx\`;
            a.click();
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
        { id: "vigilancia", label: "Panel Vigilancia", sub: "Cámaras IP en vivo", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" clipRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" /></svg> },
        { id: "presentismo", label: "Presentismo", sub: "Control biométrico", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M7.502 6h7l-1.501 4.5-1.5-1.5-1.5 1.5L8.499 9 7.502 6zm-1.5 0H3.75A2.25 2.25 0 001.5 8.25v10.5A2.25 2.25 0 003.75 21h16.5a2.25 2.25 0 002.25-2.25V8.25A2.25 2.25 0 0020.25 6H18l-.862 3.445a2.25 2.25 0 01-2.145 1.555H9.007a2.25 2.25 0 01-2.145-1.555L6.002 6zm7.998 9.75a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0v-2.25zm-4.5 1.5a.75.75 0 000 1.5h.75a.75.75 0 000-1.5H9zm6.75 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75z" /></svg> },
        { id: "licitaciones", label: "Licitaciones", sub: "Gestión y seguimiento", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75-6.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg> },
        { id: "resumen", label: "Resumen ejecutivo", sub: "Indicadores y avances", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" /></svg> },
        { id: "mensajes", label: "Mensajes internos", sub: "Comunicaciones del equipo", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" /><path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.126 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" /></svg> },
        { id: "archivos", label: "Archivos", sub: "PDFs, planos, Excel", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 00-3-3h-3.879a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H6a3 3 0 00-3 3v3.162A3.756 3.756 0 014.094 9h15.812zM4.094 10.5a2.25 2.25 0 00-2.227 2.568l.857 6A2.25 2.25 0 004.951 21H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-2.227-2.568H4.094z" /></svg> },
        { id: "seguimiento", label: "Seguimiento", sub: "Alertas y pendientes", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" /></svg> },
        { id: "contactos", label: "Contactos", sub: "Agenda y emails", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg> },
        { id: "whatsapp", label: "Grupos WhatsApp", sub: "Equipos de trabajo", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" /><path fillRule="evenodd" clipRule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75z" /></svg> },
    ];

    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Más opciones" right={authed && <button onClick={() => setAuthed(null)} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>Cerrar sesión</button>} />
        {authed && <div style={{ margin: "12px 18px 0", background: "#ECFDF5", border: "1px solid #86EFAC", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="#10B981"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg><span style={{ fontSize: 12, color: "#15803D", fontWeight: 600 }}>Sesión activa: {authed.rol}</span></div>}
        <div style={{ padding: "14px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                {MAS_ITEMS.map(item => (<button key={item.id} onClick={() => setView(item.id)} style={{ background: T.card, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "14px 8px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: T.shadow, textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: T.rsm, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{item.label}</div>
                </button>))}
            </div>
            <div style={{ height: 1, background: T.border, margin: "4px 0 14px" }} />
            <Card onClick={() => { if (cfgLocked) setShowUnlockModal(true); else requireAuth(() => setShowConfig(true), "Configuración"); }} style={{ padding: "15px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, border: \`1.5px solid \${cfgLocked ? "#EF4444" : T.accent}\`, background: cfgLocked ? "#FEF2F2" : T.accentLight }}>
                <div style={{ width: 44, height: 44, borderRadius: T.rsm, background: cfgLocked ? "#EF4444" : T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {cfgLocked
                        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" /></svg>
                        : <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" clipRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></svg>}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: cfgLocked ? "#EF4444" : T.accent }}>Configuración {cfgLocked ? "— Bloqueada 🔒" : ""}</div>
                    <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{cfgLocked ? "Tocá para desbloquear con credenciales admin" : "Estética · Logos · Empresa · Admin"}</div>
                </div>
                <span style={{ fontSize: 18, color: cfgLocked ? "#EF4444" : T.accent }}>›</span>
            </Card>
        </div>

        {showConfig && !cfgLocked && (<Sheet title="⚙️ Configuración" onClose={tryClose}>

            {/* Banner cambios pendientes */}
            {hasUnsaved && !confirmClose && (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                    <span style={{ fontSize: 12, color: "#92400E", fontWeight: 600, flex: 1 }}>Tenés cambios sin guardar</span>
                    <button onClick={guardarYCerrar} style={{ background: "#D97706", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Guardar ahora</button>
                </div>
            )}

            {/* Diálogo confirmación cierre */}
            {confirmClose && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 8 }}>¿Salir sin guardar?</div>
                    <div style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 12, lineHeight: 1.5 }}>Tenés cambios que no se guardaron. Si salís ahora se van a perder.</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <button onClick={() => { setConfirmClose(false); setShowConfig(false); setHasUnsaved(false); }} style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: "#EF4444", cursor: "pointer" }}>Salir igual</button>
                        <button onClick={guardarYCerrar} style={{ background: T.accent, border: "none", borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>✓ Guardar y cerrar</button>
                    </div>
                </div>
            )}
            <CfgSection id="cuenta" title="Cuenta y empresa" icon="🏢" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ marginBottom: 14 }}>
                    <Lbl>API Key de Anthropic</Lbl>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showKey ? "text" : "password"}
                            value={localKey}
                            onChange={e => setLocalKey(e.target.value)}
                            placeholder="sk-ant-api03-..."
                            autoComplete="off"
                            spellCheck={false}
                            style={{ width: "100%", background: T.bg, border: \`1.5px solid \${localKey ? '#10B981' : T.border}\`, borderRadius: T.rsm, padding: "11px 44px 11px 14px", fontSize: 13, color: T.text, fontFamily: "monospace" }}
                        />
                        <button onClick={() => setShowKey(v => !v)} type="button" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", alignItems: "center", padding: 4 }}>
                            {showKey
                                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="currentColor" strokeWidth="1.5" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" /></svg>}
                        </button>
                    </div>
                    {localKey
                        ? <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} /><span style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>Key configurada — se usa para el micrófono y la IA</span></div>
                        : <div style={{ fontSize: 10, color: T.muted, marginTop: 5, lineHeight: 1.5 }}>Ingresá tu API key de <strong>console.anthropic.com</strong> para habilitar el micrófono y la IA con tu propia cuenta.</div>}
                </div>
                <Field label="Email del asistente IA"><TInput value={localCfg.email || ''} onChange={e => updateText({ email: e.target.value })} placeholder="correo@empresa.com" /></Field>
                <Field label="Nombre de la empresa"><TInput value={localCfg.empresa || ''} onChange={e => updateText({ empresa: e.target.value })} placeholder="BelfastCM" /></Field>
                <FieldRow><Field label="Cargo"><TInput value={localCfg.cargo || ''} onChange={e => updateText({ cargo: e.target.value })} placeholder="Gerencia de Obra" /></Field><Field label="Teléfono"><TInput value={localCfg.telefono || ''} onChange={e => updateText({ telefono: e.target.value })} placeholder="+54 11..." /></Field></FieldRow>
                <Field label="Ciudad / Sede"><TInput value={localCfg.ciudad || ''} onChange={e => updateText({ ciudad: e.target.value })} placeholder="Buenos Aires" /></Field>
            </CfgSection>

            <CfgSection id="tema" title="Tema visual" icon="🎨" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <Lbl>Presets</Lbl>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
                    {THEME_PRESETS.map(p => {
                        const active = localCfg.themeId === p.id; return (<button key={p.id} onClick={() => applyThemePreset(p)} style={{ background: p.accent, borderRadius: T.rsm, padding: "12px 6px", border: \`3px solid \${active ? "#fff" : "transparent"}\`, boxShadow: active ? \`0 0 0 3px \${p.accent}\` : "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{ display: "flex", gap: 3 }}>{[p.bg, p.card, p.border].map((c, i) => (<div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,.4)" }} />))}</div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{p.label}</div>
                            {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                        </button>);
                    })}
                </div>
                <Lbl>Colores individuales</Lbl>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {COLOR_KEYS.map(({ k, label }) => (<div key={k} style={{ textAlign: "center" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", marginBottom: 4 }}>
                            <input type="color" value={(localCfg.colors || DEFAULT_COLORS)[k] || '#000000'} onChange={e => applyColorKey(k, e.target.value)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: \`2px solid \${T.border}\`, borderRadius: T.rsm, cursor: "pointer", padding: 3, background: "#fff" }} />
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: T.sub }}>{label}</div>
                    </div>))}
                </div>
                <button onClick={() => applyThemePreset(THEME_PRESETS[0])} style={{ width: "100%", background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "8px 14px", fontSize: 12, color: T.sub, cursor: "pointer" }}>↺ Restaurar tema por defecto</button>
            </CfgSection>

            <CfgSection id="font" title="Tipografía" icon="✏️" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {FONTS.map(f => {
                        const active = localCfg.fontId === f.id; return (<button key={f.id} onClick={() => applyVisual({ fontId: f.id })} style={{ padding: "12px 8px", borderRadius: T.rsm, border: \`2px solid \${active ? T.accent : T.border}\`, background: active ? T.accentLight : T.card, cursor: "pointer", textAlign: "center" }}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: active ? T.accent : T.text, fontFamily: f.value, lineHeight: 1, marginBottom: 4 }}>Aa</div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: active ? T.accent : T.sub }}>{f.label}</div>
                            {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, margin: "4px auto 0" }} />}
                        </button>);
                    })}
                </div>
            </CfgSection>

            <CfgSection id="forma" title="Forma de los elementos" icon="📐" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                    {RADIUS_OPTS.map(r => {
                        const active = localCfg.radiusId === r.id; return (<button key={r.id} onClick={() => applyVisual({ radiusId: r.id })} style={{ padding: "12px 4px", border: \`2px solid \${active ? T.accent : T.border}\`, background: active ? T.accentLight : T.card, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderRadius: 8 }}>
                            <div style={{ width: 36, height: 28, background: active ? T.accent : "#E2E8F0", borderRadius: r.r / 3 }} />
                            <div style={{ fontSize: 10, fontWeight: 600, color: active ? T.accent : T.sub }}>{r.label}</div>
                        </button>);
                    })}
                </div>
            </CfgSection>

            <CfgSection id="logos" title="Logos y textos" icon="🖼" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>Subí tus archivos PNG/SVG/JPG para reemplazar los logos automáticos.</div>
                <input ref={logoRef1} type="file" accept="image/*,.svg" style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); applyVisual({ logoBelfast: url }); } e.target.value = ""; }} />
                <input ref={logoRef2} type="file" accept="image/*,.svg" style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); applyVisual({ logoAA2000: url }); } e.target.value = ""; }} />
                <input ref={logoRef3} type="file" accept="image/*,.svg" style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); applyVisual({ logoAsistente: url }); } e.target.value = ""; }} />
                <input ref={logoRef4} type="file" accept="image/*,.svg" style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); applyVisual({ logoCentral: url }); } e.target.value = ""; }} />
                <div style={{ marginBottom: 12 }}><Lbl>Logo botón micrófono (pantalla IA)</Lbl>
                    <div style={{ border: \`1.5px dashed \${T.border}\`, borderRadius: T.rsm, padding: "14px", textAlign: "center", background: T.bg, cursor: "pointer" }} onClick={() => logoRef4.current?.click()}>
                        {cfg.logoCentral
                            ? (<div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}><img src={cfg.logoCentral} alt="Central" style={{ height: 52, objectFit: "contain", maxWidth: 140 }} /><div style={{ textAlign: "left" }}><div style={{ fontSize: 10, color: "#10B981", fontWeight: 700, marginBottom: 4 }}>✓ Logo cargado</div><button onClick={e => { e.stopPropagation(); applyVisual({ logoCentral: "" }); }} style={{ fontSize: 10, color: "#EF4444", background: "none", border: "1px solid #FECACA", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>Quitar</button></div></div>)
                            : (<><div style={{ fontSize: 28, marginBottom: 4 }}>📤</div><div style={{ fontSize: 11, fontWeight: 600, color: T.sub }}>Subir logo para el botón micrófono</div><div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>PNG · SVG · JPG — reemplaza el ícono del micrófono</div></>)}
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                    {[{ key: "logoBelfast", label: "Belfast", ref: logoRef1 }, { key: "logoAA2000", label: "AA2000", ref: logoRef2 }, { key: "logoAsistente", label: "Asistente", ref: logoRef3 }].map(({ key, label, ref }) => (
                        <div key={key} style={{ border: \`1.5px dashed \${T.border}\`, borderRadius: T.rsm, padding: "12px 6px", textAlign: "center", background: T.bg, cursor: "pointer" }} onClick={() => ref.current?.click()}>
                            {cfg[key] ? (<><img src={cfg[key]} alt={label} style={{ height: 36, objectFit: "contain", marginBottom: 5, maxWidth: "100%" }} /><div style={{ fontSize: 9, color: "#10B981", fontWeight: 700, marginBottom: 3 }}>✓ Cargado</div><button onClick={e => { e.stopPropagation(); applyVisual({ [key]: "" }); }} style={{ fontSize: 9, color: "#EF4444", background: "none", border: "1px solid #FECACA", borderRadius: 6, padding: "2px 7px", cursor: "pointer" }}>Quitar</button></>)
                                : (<><div style={{ fontSize: 24, marginBottom: 3 }}>📤</div><div style={{ fontSize: 10, fontWeight: 600, color: T.sub }}>{label}</div><div style={{ fontSize: 8, color: T.muted, marginTop: 2 }}>PNG · SVG</div></>)}
                        </div>
                    ))}
                </div>
                <Field label="Título del asistente"><TInput value={localCfg.tituloAsistente || ''} onChange={e => updateText({ tituloAsistente: e.target.value })} placeholder="Asistente BelfastCM" /></Field>
                <Field label="Subtítulo"><TInput value={localCfg.subtituloAsistente || ''} onChange={e => updateText({ subtituloAsistente: e.target.value })} placeholder="Lee todos los datos de la app" /></Field>
                <div style={{ background: T.bg, borderRadius: T.rsm, padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Vista previa</div>
                    <div style={{ width: 60, height: 52, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", boxShadow: T.shadow, border: \`1.5px solid \${T.border}\`, overflow: "hidden" }}>
                        {cfg.logoAsistente ? <img src={cfg.logoAsistente} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <BelfastLogo size={38} />}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 2 }}>{localCfg.tituloAsistente || "Asistente BelfastCM"}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{localCfg.subtituloAsistente || "Lee todos los datos de la app"}</div>
                </div>
            </CfgSection>

            <CfgSection id="ubicaciones" title="Ubicaciones / Aeropuertos" icon="✈️" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 14, lineHeight: 1.5 }}>
                    Editá el nombre, código y etiqueta de cada ubicación. Se usan en obras, licitaciones y cámaras.
                </div>
                <Field label="Etiqueta del campo">
                    <TInput
                        value={localCfg.labelUbicacion || 'Aeropuerto'}
                        onChange={e => updateText({ labelUbicacion: e.target.value })}
                        placeholder="Aeropuerto"
                    />
                </Field>
                <Lbl>Ubicaciones</Lbl>
                {(localCfg.ubicaciones || DEFAULT_UBICACIONES).map((ub, i) => (
                    <div key={ub.id} style={{ background: T.bg, borderRadius: T.rsm, padding: "12px 14px", marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ubicación {i + 1}</div>
                        <FieldRow>
                            <Field label="Código (ej: AEP)">
                                <TInput
                                    value={ub.code}
                                    onChange={e => {
                                        const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES)];
                                        nuevas[i] = { ...nuevas[i], code: e.target.value.toUpperCase() };
                                        setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                                    }}
                                    placeholder="AEP"
                                />
                            </Field>
                            <Field label="ID interno">
                                <TInput
                                    value={ub.id}
                                    onChange={e => {
                                        const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES)];
                                        nuevas[i] = { ...nuevas[i], id: e.target.value.toLowerCase().replace(/\\s/g, '') };
                                        setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                                    }}
                                    placeholder="aep"
                                />
                            </Field>
                        </FieldRow>
                        <Field label="Nombre completo">
                            <TInput
                                value={ub.name}
                                onChange={e => {
                                    const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES)];
                                    nuevas[i] = { ...nuevas[i], name: e.target.value };
                                    setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                                }}
                                placeholder="Aeroparque Jorge Newbery"
                            />
                        </Field>
                        {(localCfg.ubicaciones || DEFAULT_UBICACIONES).length > 1 && (
                            <button onClick={() => {
                                const nuevas = (localCfg.ubicaciones || DEFAULT_UBICACIONES).filter((_, j) => j !== i);
                                setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                            }} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: T.rsm, padding: "6px 12px", fontSize: 11, color: "#EF4444", cursor: "pointer", fontWeight: 600 }}>
                                Eliminar ubicación
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => {
                    const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES), { id: \`ubic\${Date.now()}\`, code: '', name: '' }];
                    setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                }} style={{ width: "100%", background: T.accentLight, border: \`1.5px dashed \${T.accent}\`, borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: T.accent, cursor: "pointer", marginTop: 4 }}>
                    + Agregar ubicación
                </button>
                <button onClick={() => setLocalCfg(p => ({ ...p, ubicaciones: DEFAULT_UBICACIONES, labelUbicacion: 'Aeropuerto' }))} style={{ width: "100%", background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "8px", fontSize: 11, color: T.muted, cursor: "pointer", marginTop: 8 }}>
                    ↺ Restaurar ubicaciones por defecto
                </button>
            </CfgSection>

            <CfgSection id="textos" title={t(cfg, 'cfg_textos')} icon="✏️" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>Editá cualquier texto visible en la app. Dejá vacío para usar el valor por defecto.</div>
                {Object.entries(DEFAULT_TEXTOS).map(([key, defaultVal]) => (
                    <div key={key} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{key.replace(/_/g, ' ')}</div>
                        <input
                            value={localCfg.textos?.[key] ?? defaultVal}
                            onChange={e => {
                                const val = e.target.value;
                                setLocalCfg(p => ({ ...p, textos: { ...(p.textos || DEFAULT_TEXTOS), [key]: val } }));
                            }}
                            placeholder={defaultVal}
                            style={{ width: "100%", background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "8px 12px", fontSize: 13, color: T.text }}
                        />
                    </div>
                ))}
                <button onClick={() => setLocalCfg(p => ({ ...p, textos: { ...DEFAULT_TEXTOS } }))} style={{ width: "100%", background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "8px 14px", fontSize: 12, color: T.sub, cursor: "pointer", marginTop: 4 }}>↺ Restaurar textos por defecto</button>
            </CfgSection>

            <CfgSection id="iconos" title="Iconos del menú" icon="🎨" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>Tocá cualquier ícono para cambiarlo. Podés elegir de la biblioteca o subir tu propia imagen.</div>
                
                <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Acciones rápidas</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                    {[{ id: "qa_lic", label: "Nueva licitación", defaultIcon: "📋" }, { id: "qa_obra", label: "Nueva obra", defaultIcon: "🏗" }, { id: "qa_mat", label: "Materiales", defaultIcon: "📦" }, { id: "qa_sub", label: "Subcontratos", defaultIcon: "🤝" }].map(item => {
                        const ci = customIcons[item.id];
                        return (
                            <button key={item.id} onClick={() => setIconPickerFor({ id: item.id, label: item.label })}
                                style={{ background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: 12, padding: "10px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, position: "relative" }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, overflow: "hidden", fontSize: 20 }}>
                                    {ci?.type === 'img' ? <img src={ci.src} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                                    : ci?.type === 'svg' ? <span dangerouslySetInnerHTML={{ __html: ci.src }} style={{ display: "flex", width: 22, height: 22 }} />
                                    : item.defaultIcon}
                                </div>
                                <div style={{ fontSize: 8, color: T.muted, fontWeight: 600, lineHeight: 1.2, textAlign: "center" }}>{item.label}</div>
                                {ci && <div style={{ position: "absolute", top: 3, right: 3, width: 10, height: 10, background: "#10B981", borderRadius: "50%" }} />}
                            </button>
                        );
                    })}
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Menú principal</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {MAS_ITEMS.map(item => {
                        const ci = customIcons[item.id];
                        return (
                            <button key={item.id} onClick={() => setIconPickerFor(item)}
                                style={{ background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: 12, padding: "10px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, position: "relative" }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, overflow: "hidden" }}>
                                    {ci?.type === 'img' ? <img src={ci.src} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                                    : ci?.type === 'svg' ? <span dangerouslySetInnerHTML={{ __html: ci.src }} style={{ display: "flex", width: 22, height: 22 }} />
                                    : item.icon}
                                </div>
                                <div style={{ fontSize: 8, color: T.muted, fontWeight: 600, lineHeight: 1.2, textAlign: "center" }}>{item.label}</div>
                                {ci && <div style={{ position: "absolute", top: 3, right: 3, width: 10, height: 10, background: "#10B981", borderRadius: "50%" }} />}
                            </button>
                        );
                    })}
                </div>
                <button onClick={() => { localStorage.removeItem('bcm_icons'); setCustomIcons({}); }} style={{ width: "100%", background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "9px", fontSize: 12, color: T.sub, cursor: "pointer", marginTop: 10 }}>↺ Restaurar todos los iconos originales</button>
            </CfgSection>

            <PBtn full onClick={guardarYCerrar} style={{ marginTop: 8 }}>{t(cfg, 'cfg_guardar')}</PBtn>

            {/* Botón Exportar JSX */}
            <div style={{ marginTop: 12, padding: "14px 16px", background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: T.rsm }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom: 4 }}>📦 Exportar app con datos actuales</div>
                <div style={{ fontSize: 11, color: "#1E3A8A", marginBottom: 10, lineHeight: 1.5 }}>Descarga un archivo JSX con tu configuración y datos operativos ya incluidos. Al subirlo a Claude, la app arranca con todo listo sin necesitar storage.</div>
                <button onClick={exportarJSX} style={{ width: "100%", background: "#1D4ED8", border: "none", borderRadius: T.rsm, padding: "11px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>📥 Descargar JSX publicable</button>
            </div>

            {/* Botón Publicar y Bloquear */}
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>🔒 Publicar y bloquear configuración</div>
                <div style={{ fontSize: 11, color: "#7F1D1D", marginBottom: 10, lineHeight: 1.5 }}>Una vez bloqueada, la configuración visual no se puede modificar sin credenciales de administrador. Los datos operativos (obras, personal, etc.) siguen funcionando con normalidad.</div>
                <button onClick={() => setShowLockConfirm(true)} style={{ width: "100%", background: "#EF4444", border: "none", borderRadius: T.rsm, padding: "11px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>🔒 Publicar y bloquear ahora</button>
            </div>
        </Sheet>)}

        {/* Modal confirmación de bloqueo */}
        {showLockConfirm && (
            <Sheet title="🔒 Confirmar bloqueo" onClose={() => setShowLockConfirm(false)}>
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>¿Estás seguro?</div>
                    <div style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.6 }}>La configuración visual quedará <strong>bloqueada</strong>. Para modificarla de nuevo vas a necesitar ingresar con usuario y contraseña de administrador.</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button onClick={() => setShowLockConfirm(false)} style={{ background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: T.rsm, padding: "12px", fontSize: 13, fontWeight: 600, color: T.sub, cursor: "pointer" }}>Cancelar</button>
                    <button onClick={handleLock} style={{ background: "#EF4444", border: "none", borderRadius: T.rsm, padding: "12px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>🔒 Sí, bloquear</button>
                </div>
            </Sheet>
        )}

        {/* Modal desbloqueo */}
        {showUnlockModal && (
            <Sheet title="🔓 Desbloquear configuración" onClose={() => { setShowUnlockModal(false); setUnlockUser(''); setUnlockPass(''); setUnlockErr(''); }}>
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#92400E", fontWeight: 600 }}>Ingresá las credenciales de administrador para desbloquear la configuración visual.</div>
                <Field label="Usuario"><input value={unlockUser} onChange={e => { setUnlockUser(e.target.value); setUnlockErr(''); }} placeholder="Ingresá tu usuario" autoCapitalize="none" onKeyDown={e => e.key === 'Enter' && tryUnlock()} style={{ width: "100%", background: T.bg, border: \`1.5px solid \${unlockErr ? '#FECACA' : T.border}\`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }} /></Field>
                <Field label="Contraseña"><input type="password" value={unlockPass} onChange={e => { setUnlockPass(e.target.value); setUnlockErr(''); }} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && tryUnlock()} style={{ width: "100%", background: T.bg, border: \`1.5px solid \${unlockErr ? '#FECACA' : T.border}\`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }} /></Field>
                {unlockErr && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#EF4444", marginBottom: 12, fontWeight: 600 }}>{unlockErr}</div>}
                <PBtn full onClick={tryUnlock}>🔓 Desbloquear</PBtn>
            </Sheet>
        )}
    </div>);
}

function Archivos({ setView }) { const [files, setFiles] = useState([]); const [loaded, setLoaded] = useState(false); const inputRef = useRef(null); useEffect(() => { (async () => { try { const r = await storage.get("bcm_archivos"); if (r?.value) setFiles(JSON.parse(r.value)); } catch {} setLoaded(true); })(); }, []); useEffect(() => { if (loaded) storage.set("bcm_archivos", JSON.stringify(files)).catch(() => {}); }, [files, loaded]); async function handleUp(e) { for (const f of Array.from(e.target.files)) { const url = await toDataUrl(f); setFiles(p => [...p, { id: uid(), nombre: f.name, ext: f.name.split(".").pop().toUpperCase(), url, fecha: new Date().toLocaleDateString("es-AR"), size: (f.size / 1024).toFixed(0) + "KB" }]); } e.target.value = ""; } return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}><AppHeader title="Archivos" back onBack={() => setView("mas")} right={<><input type="file" ref={inputRef} multiple onChange={handleUp} style={{ display: "none" }} /><PlusBtn onClick={() => inputRef.current?.click()} /></>} /><div style={{ padding: "12px 18px" }}>{files.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Subí tu primer archivo</div> : files.map(f => (<div key={f.id} style={{ display: "flex", alignItems: "center", gap: 11, background: T.card, border: \`1px solid \${T.border}\`, borderRadius: T.rsm, padding: "11px 13px", marginBottom: 7 }}><div style={{ width: 38, height: 38, borderRadius: 9, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 9, fontWeight: 800, color: T.accent }}>{f.ext}</span></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.nombre}</div><div style={{ fontSize: 10, color: T.muted }}>{f.size} · {f.fecha}</div></div><a href={f.url} download={f.nombre} style={{ textDecoration: "none" }}><button style={{ background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: 8, width: 30, height: 30, fontSize: 13, color: T.sub, cursor: "pointer" }}>↓</button></a></div>))}</div></div>); }

function Seguimiento({ alerts, setAlerts, setView }) { function dismiss(id) { setAlerts(p => p.filter(a => a.id !== id)); } return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}><AppHeader title="Seguimiento" back onBack={() => setView("mas")} /><div style={{ padding: "14px 18px" }}>{["alta", "media"].map(prio => alerts.filter(a => a.prioridad === prio).length > 0 && (<div key={prio} style={{ marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 700, color: prio === "alta" ? "#EF4444" : "#F59E0B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{prio === "alta" ? "Crítico" : "Atención"}</div>{alerts.filter(a => a.prioridad === prio).map(a => (<div key={a.id} style={{ background: prio === "alta" ? "#FEF2F2" : "#FFFBEB", border: \`1px solid \${prio === "alta" ? "#FECACA" : "#FDE68A"}\`, borderRadius: 10, padding: "11px 13px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><div style={{ flex: 1, fontSize: 12, color: T.text, lineHeight: 1.4 }}>{a.msg}</div><button onClick={() => dismiss(a.id)} style={{ background: "none", border: "none", fontSize: 14, color: T.muted, cursor: "pointer" }}>✕</button></div>))}</div>))}{alerts.length === 0 && <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>✅ Todo en orden</div><div style={{ fontSize: 13, color: T.muted }}>Sin alertas</div></div>}</div></div>); }

function ResumenView({ lics, obras, personal, alerts, setView }) { const kpis = [{ label: "Licitaciones", val: lics.filter(l => !['adjudicada', 'descartada'].includes(l.estado)).length, color: "#3B82F6" }, { label: "Obras activas", val: obras.filter(o => o.estado === "curso").length, color: "#10B981" }, { label: "Personal", val: personal.length, color: "#8B5CF6" }, { label: "Alertas", val: alerts.length, color: "#EF4444" }]; return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}><AppHeader title="Resumen Ejecutivo" back onBack={() => setView("mas")} /><div style={{ padding: "14px 18px" }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>{kpis.map(k => (<Card key={k.label} style={{ padding: "14px", textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.val}</div><div style={{ fontSize: 10, color: T.muted, lineHeight: 1.3, marginTop: 2 }}>{k.label}</div></Card>))}</div>{obras.length > 0 && <Card style={{ padding: "14px 16px", marginBottom: 12 }}><Lbl>Avance de obras</Lbl>{obras.map(o => { const ec = OBRA_ESTADOS.find(e => e.id === o.estado) || OBRA_ESTADOS[0]; return (<div key={o.id} style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{o.nombre}</span><span style={{ fontSize: 13, fontWeight: 800, color: ec.color }}>{o.avance}%</span></div><div style={{ height: 8, background: T.bg, borderRadius: 4 }}><div style={{ height: 8, background: ec.color, borderRadius: 4, width: \`\${o.avance}%\`, transition: "width .6s" }} /></div></div>); })}</Card>}</div></div>); }

function MensajesView({ personal, setView }) { const [sel, setSel] = useState(null); const [threads, setThreads] = useState({}); const [msg, setMsg] = useState(''); const [loaded, setLoaded] = useState(false); const scrollRef = useRef(null); const taRef = useRef(null); useEffect(() => { (async () => { try { const r = await storage.get('bcm_msgs'); if (r?.value) setThreads(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []); useEffect(() => { if (loaded) storage.set('bcm_msgs', JSON.stringify(threads)).catch(() => { }); }, [threads, loaded]); useEffect(() => { setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 80); }, [sel, threads]); function sendMsg() { if (!msg.trim() || !sel) return; const m = { id: uid(), txt: msg, autor: 'Yo', hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) }; setThreads(t => ({ ...t, [sel.id]: [...(t[sel.id] || []), m] })); setMsg(''); if (taRef.current) taRef.current.style.height = "22px"; } function ini(n) { return n.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase(); } if (sel) { const thread = threads[sel.id] || []; return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}><AppHeader title={sel.nombre} sub={sel.rol} back onBack={() => setSel(null)} /><div style={{ flex: 1, overflowY: "auto", padding: "14px 18px 10px" }}>{thread.map(m => (<div key={m.id} style={{ marginBottom: 12, display: "flex", flexDirection: "column", alignItems: m.autor === "Yo" ? "flex-end" : "flex-start" }}><div style={{ maxWidth: "82%", background: m.autor === "Yo" ? T.accent : T.card, border: m.autor === "Yo" ? "none" : \`1px solid \${T.border}\`, borderRadius: m.autor === "Yo" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 13px", color: m.autor === "Yo" ? "#fff" : T.text, fontSize: 13, lineHeight: 1.5, boxShadow: T.shadow, whiteSpace: "pre-wrap" }}>{m.txt}</div><div style={{ fontSize: 10, color: T.muted, marginTop: 3 }}>{m.hora}</div></div>))}<div ref={scrollRef} /></div><div style={{ padding: "10px 16px calc(max(14px,env(safe-area-inset-bottom)) + 10px)", background: T.card, borderTop: \`1px solid \${T.border}\`, display: "flex", gap: 8, alignItems: "flex-end" }}><div style={{ flex: 1, background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: 22, padding: "10px 14px" }}><textarea ref={taRef} rows={1} value={msg} onChange={e => { setMsg(e.target.value); const el = taRef.current; if (el) { el.style.height = "22px"; el.style.height = Math.min(el.scrollHeight, 80) + "px"; } }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }} style={{ width: "100%", background: "transparent", border: "none", color: T.text, fontSize: 14, lineHeight: 1.5, height: 22 }} /></div><button onClick={sendMsg} disabled={!msg.trim()} style={{ width: 42, height: 42, borderRadius: "50%", background: msg.trim() ? T.accent : "#E2E8F0", color: msg.trim() ? "#fff" : "#94A3B8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div></div>); } return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}><AppHeader title="Mensajes internos" back onBack={() => setView("mas")} /><div style={{ padding: "14px 18px" }}>{personal.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Primero agregá personal</div>}{personal.map(p => { const thread = threads[p.id] || []; const last = thread[thread.length - 1]; return (<Card key={p.id} onClick={() => setSel(p)} style={{ padding: "13px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: T.accent, flexShrink: 0 }}>{ini(p.nombre)}</div><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{p.nombre}</div><div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{last ? last.txt.slice(0, 38) + "..." : p.rol + " · Sin mensajes"}</div></div>{thread.length > 0 && <Badge color={T.accent} bg={T.accentLight}>{thread.length}</Badge>}<span style={{ fontSize: 14, color: T.muted }}>›</span></Card>); })}</div></div>); }

function ContactosView({ setView, onContactosChange }) { const [contacts, setContacts] = useState([]); const [showNew, setShowNew] = useState(false); const [form, setForm] = useState({ nombre: '', email: '', telefono: '', empresa: '', rol: '' }); const [loaded, setLoaded] = useState(false); useEffect(() => { (async () => { try { const r = await storage.get('bcm_contactos'); if (r?.value) setContacts(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []); useEffect(() => { if (loaded) { storage.set('bcm_contactos', JSON.stringify(contacts)).catch(() => { }); if (onContactosChange) onContactosChange(contacts); } }, [contacts, loaded]); function add() { if (!form.nombre || !form.email) return; setContacts(p => [...p, { ...form, id: uid() }]); setForm({ nombre: '', email: '', telefono: '', empresa: '', rol: '' }); setShowNew(false); } function ini(n) { return n.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase(); } const COLS = ["#1D4ED8", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]; return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}><AppHeader title="Contactos" back onBack={() => setView("mas")} right={<PlusBtn onClick={() => setShowNew(true)} />} /><div style={{ flex: 1, overflowY: "auto", padding: "12px 18px", paddingBottom: 80 }}>{contacts.length === 0 && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📧</div><div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Sin contactos</div></div>}{contacts.map((c, i) => { const col = COLS[i % COLS.length]; return (<Card key={c.id} style={{ padding: "12px 14px", marginBottom: 8 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 42, height: 42, borderRadius: "50%", background: col + "18", border: \`1.5px solid \${col}44\`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: col, flexShrink: 0 }}>{ini(c.nombre)}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{c.nombre}</div>{(c.empresa || c.rol) && <div style={{ fontSize: 11, color: T.muted }}>{c.empresa}{c.rol ? \` · \${c.rol}\` : ""}</div>}<div style={{ fontSize: 11, color: T.accent, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</div></div><div style={{ display: "flex", gap: 5, flexShrink: 0 }}><a href={\`mailto:\${c.email}\`} style={{ textDecoration: "none" }}><button style={{ background: T.accentLight, border: \`1px solid \${T.border}\`, borderRadius: 8, width: 30, height: 30, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✉️</button></a>{c.telefono && <a href={\`https://wa.me/\${c.telefono}\`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><button style={{ background: "#DCF8C6", border: "1px solid #86EFAC", borderRadius: 8, width: 30, height: 30, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</button></a>}<button onClick={() => setContacts(p => p.filter(x => x.id !== c.id))} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, width: 30, height: 30, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button></div></div></Card>); })}</div>{showNew && <Sheet title="Nuevo contacto" onClose={() => setShowNew(false)}><Field label="Nombre *"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Carlos Méndez" /></Field><Field label="Email *"><TInput value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="cmendez@aa2000.com.ar" /></Field><FieldRow><Field label="Empresa"><TInput value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))} placeholder="AA2000" /></Field><Field label="Rol"><TInput value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))} placeholder="Inspector" /></Field></FieldRow><Field label="WhatsApp"><TInput value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value.replace(/\\D/g, '') }))} placeholder="5491155556666" /></Field><PBtn full onClick={add} disabled={!form.nombre || !form.email}>Guardar</PBtn></Sheet>}</div>); }

function WhatsappGrupos({ personal, setView }) { const [grupos, setGrupos] = useState([]); const [showNew, setShowNew] = useState(false); const [form, setForm] = useState({ nombre: '', miembros: [] }); const [loaded, setLoaded] = useState(false); useEffect(() => { (async () => { try { const r = await storage.get('bcm_wa'); if (r?.value) setGrupos(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []); useEffect(() => { if (loaded) storage.set('bcm_wa', JSON.stringify(grupos)).catch(() => { }); }, [grupos, loaded]); function addG() { if (!form.nombre) return; setGrupos(p => [...p, { ...form, id: uid(), fecha: new Date().toLocaleDateString('es-AR') }]); setForm({ nombre: '', miembros: [] }); setShowNew(false); } function toggle(pid) { setForm(f => ({ ...f, miembros: f.miembros.includes(pid) ? f.miembros.filter(m => m !== pid) : [...f.miembros, pid] })); } return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}><AppHeader title="Grupos WhatsApp" back onBack={() => setView("mas")} right={<PlusBtn onClick={() => setShowNew(true)} />} /><div style={{ padding: "14px 18px" }}>{grupos.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 14 }}>Sin grupos</div>}{grupos.map(g => { const mbs = personal.filter(p => g.miembros.includes(p.id)); return (<Card key={g.id} style={{ padding: "14px", marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{g.nombre}</div><div style={{ fontSize: 11, color: "#25D366", marginBottom: 10, fontWeight: 600 }}>{mbs.length} miembro{mbs.length !== 1 ? "s" : ""}</div><div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>{mbs.map(m => (<div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, background: T.bg, borderRadius: 8, padding: "8px 10px" }}><div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: T.text }}>{m.nombre}<span style={{ color: T.muted, fontWeight: 400 }}> · {m.rol}</span></div>{m.telefono && <a href={\`https://wa.me/\${m.telefono}\`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><button style={{ background: "#25D366", border: "none", borderRadius: 7, width: 28, height: 28, cursor: "pointer", color: "white", fontSize: 12 }}>💬</button></a>}</div>))}</div><button onClick={() => setGrupos(p => p.filter(x => x.id !== g.id))} style={{ width: "100%", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm, padding: "8px", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>Eliminar</button></Card>); })}</div>{showNew && <Sheet title="Nuevo grupo" onClose={() => setShowNew(false)}><Field label="Nombre"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Equipo Terminal A" /></Field><div style={{ marginBottom: 14 }}><Lbl>Miembros</Lbl>{personal.map(p => { const sel = form.miembros.includes(p.id); return (<div key={p.id} onClick={() => toggle(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, background: sel ? "#F0FFF4" : T.bg, border: \`1.5px solid \${sel ? "#25D366" : T.border}\`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", marginBottom: 6 }}><div style={{ width: 24, height: 24, borderRadius: "50%", background: sel ? "#25D366" : T.border, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{sel ? "✓" : ""}</div><div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{p.nombre}<span style={{ color: T.muted, fontWeight: 400 }}> · {p.rol}</span></div></div>); })}</div><PBtn full onClick={addG} disabled={!form.nombre}>Crear grupo</PBtn></Sheet>}

        {iconPickerFor && <IconPickerModal item={iconPickerFor} customIcons={customIcons} onSave={saveCustomIcons} onClose={() => setIconPickerFor(null)} />}

/div>); }

function speakText(text) {
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#\`~]/g, '').replace(/https?:\\/\\/\\S+/g, '').replace(/📧[\\s\\S]*/, '').trim();

    function doSpeak() {
        const voices = window.speechSynthesis.getVoices();

        // Log para debug — se puede quitar
        // console.log('Voces disponibles:', voices.map(v=>v.name+' '+v.lang));

        // Candidatos masculinos en orden de preferencia
        const MALE_NAMES = ['Jorge', 'Carlos', 'Diego', 'Miguel', 'Antonio', 'Juan', 'Pablo', 'Andrés', 'Eduardo', 'Gustavo', 'Sergio', 'Daniel', 'Alejandro', 'Javier', 'Roberto', 'Martin', 'Felix', 'Google español', 'Español', 'Spanish'];
        const FEMALE_NAMES = ['Paulina', 'María', 'Laura', 'Sara', 'Carmen', 'Isabel', 'Google'];

        const esVoices = voices.filter(v =>
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
            chosen = esVoices.find(v => !FEMALE_NAMES.some(fn => v.name.toLowerCase().includes(fn.toLowerCase())));
        }

        // 3. Fallback: cualquier voz española
        if (!chosen && esVoices.length > 0) chosen = esVoices[0];

        const utt = new SpeechSynthesisUtterance(clean);
        utt.lang = 'es-AR';
        utt.rate = 0.95;   // un poco más lento, más natural
        utt.pitch = 0.75;  // más grave = más masculino
        utt.volume = 1;
        if (chosen) utt.voice = chosen;
        window.speechSynthesis.speak(utt);
    }

    if (window.speechSynthesis.getVoices().length > 0) { doSpeak(); }
    else { window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true }); }
}

function Chat({ contactos, lics, obras, personal, alerts, msgs, setMsgs, cfg, apiKey }) {
    const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [attachments, setAttachments] = useState([]); const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [listening, setListening] = useState(false); const [speaking, setSpeaking] = useState(false); const [autoSpeak, setAutoSpeak] = useState(true);
    const [userName, setUserName] = useState(''); const [nameInput, setNameInput] = useState(''); const [nameLoaded, setNameLoaded] = useState(false);
    const bottomRef = useRef(null); const taRef = useRef(null); const imgFileRef = useRef(null); const camRef = useRef(null); const anyFileRef = useRef(null); const recognitionRef = useRef(null);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

    // Cargar nombre guardado
    useEffect(() => {
        (async () => {
            try { const r = await storage.get('bcm_username'); if (r?.value) setUserName(r.value); } catch { }
            setNameLoaded(true);
        })();
    }, []);

    function saveName() {
        const n = nameInput.trim();
        if (!n) return;
        setUserName(n);
        storage.set('bcm_username', n).catch(() => { });
    }

    const [micError, setMicError] = useState('');
    const [micStatus, setMicStatus] = useState('idle');

    async function startListen() {
        setMicError('');
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { setMicError('Tu navegador no soporta micrófono. Usá Chrome.'); setMicStatus('error'); return; }
        try { setMicStatus('requesting'); await navigator.mediaDevices.getUserMedia({ audio: true }); }
        catch (err) {
            setMicStatus('error');
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') { setMicError('Permiso denegado. Habilitá el micrófono en el navegador.'); }
            else { setMicError('No se pudo acceder al micrófono: ' + err.message); }
            return;
        }
        window.speechSynthesis.cancel();
        const r = new SR();
        r.lang = 'es-AR'; r.continuous = false; r.interimResults = true; r.maxAlternatives = 1;
        r.onstart = () => { setListening(true); setMicStatus('listening'); setMicError(''); };
        r.onend = () => { setListening(false); setMicStatus('idle'); };
        r.onerror = e => {
            setListening(false); setMicStatus('error');
            const msgs_ = { aborted: 'Cancelado', audio: 'Sin audio detectado', 'network': 'Error de red', 'not-allowed': 'Permiso denegado', 'no-speech': 'No se detectó voz. Intentá de nuevo.' };
            setMicError(msgs_[e.error] || 'Error de micrófono: ' + e.error);
        };
        r.onresult = e => {
            const results = Array.from(e.results); const last = results[results.length - 1]; const tx = last[0].transcript;
            if (last.isFinal) { setInput(tx); setTimeout(() => sendVoice(tx), 80); } else { setInput(tx); }
        };
        recognitionRef.current = r;
        try { r.start(); } catch (e) { setMicStatus('error'); setMicError('No se pudo iniciar el micrófono.'); }
    }
    function stopListen() { recognitionRef.current?.stop(); }
    function stopSpeak() { window.speechSynthesis.cancel(); setSpeaking(false); }

    async function sendVoice(text) {
        const c = text.trim(); if (!c || loading) return;
        setInput(""); if (taRef.current) taRef.current.style.height = "22px";
        const userContent = [{ type: 'text', text: c }];
        const next = [...msgs, { role: "user", content: userContent, _snap: [], _text: c }]; setMsgs(next); setLoading(true);
        try {
            const sys = await buildContext();
            const r = await callAI(next.map(m => ({ role: m.role, content: m.content })), sys, apiKey);
            setMsgs([...next, { role: "assistant", content: [{ type: "text", text: r }] }]);
            if (autoSpeak) { setSpeaking(true); speakText(r); setTimeout(() => setSpeaking(false), r.length * 60 + 2000); }
        } catch { setMsgs([...next, { role: "assistant", content: [{ type: "text", text: "Error de conexión." }] }]); }
        setLoading(false);
    }
    async function handleAttach(e) { setShowAttachMenu(false); for (const f of Array.from(e.target.files)) { const dataUrl = await toDataUrl(f); const isImg = f.type.startsWith('image/'); setAttachments(p => [...p, { id: uid(), nombre: f.name, type: f.type, dataUrl, base64: getBase64(dataUrl), isImg, isPdf: f.type === 'application/pdf' }]); } e.target.value = ''; }
    async function buildContext() {
        let pm = [], ps = [], camaras = [], pres = {};
        try { const r1 = await storage.get('bcm_presup_materiales'); if (r1?.value) pm = JSON.parse(r1.value); const r2 = await storage.get('bcm_presup_subcontratos'); if (r2?.value) ps = JSON.parse(r2.value); const r3 = await storage.get('bcm_camaras'); if (r3?.value) camaras = JSON.parse(r3.value); const r4 = await storage.get('bcm_presentismo'); if (r4?.value) pres = JSON.parse(r4.value); } catch { }
        
        // Fetch real-time external data in parallel
        let dolarData = null, climaData = null;
        try {
            const [dolarRes, climaRes] = await Promise.allSettled([
                fetch('https://dolarapi.com/v1/dolares').then(r => r.ok ? r.json() : null),
                fetch('https://wttr.in/Buenos+Aires?format=j1').then(r => r.ok ? r.json() : null)
            ]);
            if (dolarRes.status === 'fulfilled') dolarData = dolarRes.value;
            if (climaRes.status === 'fulfilled') climaData = climaRes.value;
        } catch {}

        const today = new Date().toLocaleDateString('es-AR');
        const empresa = cfg?.empresa || 'BelfastCM'; const emailIA = cfg?.email || EMAIL_IA;
        let c = \`Sos el Asistente IA de \${empresa}. Email: \${emailIA}\${cfg?.cargo ? \`\\nCargo: \${cfg.cargo}\` : ''}\${cfg?.telefono ? \`\\nTel: \${cfg.telefono}\` : ''}\${cfg?.ciudad ? \`\\nSede: \${cfg.ciudad}\` : ''}\\n\\n\`;
        if (userName) c += \`El usuario se llama \${userName}. Usá su nombre naturalmente en las respuestas para personalizar la experiencia.\\n\\n\`;
        c += \`Especialista en obras en AA2000. Respondés en español rioplatense, profesional y preciso. Analizás pliegos, cotizás obras (UOCRA 2025), validás documentación y analizás fotos. Para mails agregás al final:\\n---\\n📧 PREPARADO PARA ENVÍO\\nDe: \${emailIA}\\nPara: [email]\\nAsunto: [asunto]\\n---\\n\\n\`;
        c += \`📋 LICITACIONES (\${lics?.length || 0})\\n\`; lics?.forEach(l => { c += \`• \${l.nombre} | \${AIRPORTS.find(a => a.id === l.ap)?.code} | \${LIC_ESTADOS.find(e => e.id === l.estado)?.label} | \${l.monto || '—'} | \${l.fecha || '—'}\${l.sector ? \` | \${l.sector}\` : ''}\\n\`; });
        c += \`\\n🏗 OBRAS (\${obras?.length || 0})\\n\`; obras?.forEach(o => { c += \`• \${o.nombre} | \${AIRPORTS.find(a => a.id === o.ap)?.code} | \${OBRA_ESTADOS.find(e => e.id === o.estado)?.label} | \${o.avance}% | \${o.sector || '—'} | \${o.inicio || '—'}→\${o.cierre || '—'}\\n\`; if (o.obs?.length) o.obs.forEach(n => c += \`  [\${n.fecha}] \${n.txt}\\n\`); if (o.fotos?.length) c += \`  Fotos: \${o.fotos.length}\\n\`; });
        c += \`\\n👷 PERSONAL (\${personal?.length || 0})\\n\`; personal?.forEach(p => { c += \`• \${p.nombre} | \${p.rol} | \${p.empresa || '—'}\${p.telefono ? \` | +\${p.telefono}\` : ''}\\n\`; DOC_TYPES.forEach(d => { const doc = p.docs?.[d.id]; if (doc) { const dias = doc.vence ? daysSince(doc.vence) : null; const st = dias === null ? '✓' : (dias <= 0 ? '🔴VENCIDO' : (dias <= 30 ? \`⚠ vence en \${dias}d\` : '✓')); c += \`  \${d.label}: \${st}\\n\`; } else c += \`  \${d.label}: ❌FALTA\\n\`; }); });
        if (alerts?.length) { c += \`\\n⚠️ ALERTAS\\n\`; alerts.forEach(a => c += \`• [\${a.prioridad.toUpperCase()}] \${a.msg}\\n\`); }
        if (pm.length) { c += \`\\n📦 MATERIALES\\n\`; pm.forEach(i => c += \`• \${i.descripcion} | \${i.proveedor || '—'} | \${i.monto || '—'} | \${i.estado}\\n\`); c += \`  TOTAL: $\${pm.reduce((s, i) => s + (parseFloat((i.monto || '').replace(/[^0-9.]/g, '')) || 0), 0).toLocaleString('es-AR')}\\n\`; }
        if (ps.length) { c += \`\\n🤝 SUBCONTRATOS\\n\`; ps.forEach(i => c += \`• \${i.descripcion} | \${i.proveedor || '—'} | \${i.monto || '—'} | \${i.estado}\\n\`); c += \`  TOTAL: $\${ps.reduce((s, i) => s + (parseFloat((i.monto || '').replace(/[^0-9.]/g, '')) || 0), 0).toLocaleString('es-AR')}\\n\`; }
        if (contactos?.length) { c += \`\\n📧 CONTACTOS\\n\`; contactos.forEach(x => c += \`• \${x.nombre} | \${x.empresa || ''} | \${x.email}\\n\`); }
        if (camaras.length) { c += \`\\n📹 CÁMARAS (\${camaras.length})\\n\`; }
        const todayRecs = Object.entries(pres.registros || {}).filter(([k]) => k.endsWith(today)).map(([, v]) => v);
        if (todayRecs.length) { c += \`\\n🕐 PRESENTISMO HOY\\n\`; todayRecs.forEach(r => c += \`• \${r.nombre}: \${r.entrada}\${r.salida ? \`–\${r.salida}\` : '(en obra)'}\\n\`); }
        return c;
    }
    async function send(text) {
        const c = (text || input).trim();
        if ((!c && !attachments.length) || loading) return;
        setInput(""); if (taRef.current) taRef.current.style.height = "22px"; setShowAttachMenu(false);
        const userContent = [];
        attachments.forEach(a => { if (a.isImg) userContent.push({ type: 'image', source: { type: 'base64', media_type: a.type || 'image/jpeg', data: a.base64 } }); else if (a.isPdf) userContent.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: a.base64 } }); });
        if (c) userContent.push({ type: 'text', text: c }); else userContent.push({ type: 'text', text: "Analizá este contenido." });
        const snapAtt = [...attachments]; setAttachments([]);
        const next = [...msgs, { role: "user", content: userContent, _snap: snapAtt, _text: c }]; setMsgs(next); setLoading(true);
        try {
            const sys = await buildContext(); const r = await callAI(next.map(m => ({ role: m.role, content: m.content })), sys, apiKey); setMsgs([...next, { role: "assistant", content: [{ type: "text", text: r }] }]);
            if (autoSpeak) { setSpeaking(true); speakText(r); setTimeout(() => setSpeaking(false), r.length * 60 + 2000); }
        }
        catch { setMsgs([...next, { role: "assistant", content: [{ type: "text", text: "Error de conexión." }] }]); }
        setLoading(false);
    }
    function mailBlock(text) { const m = text.match(/📧 PREPARADO PARA ENVÍO[\\s\\S]*?Para:\\s*([^\\n]+)[\\s\\S]*?Asunto:\\s*([^\\n]+)/i); return m ? { para: m[1].trim(), asunto: m[2].trim() } : null; }
    const titulo = cfg?.tituloAsistente || \`Asistente \${cfg?.empresa || 'BelfastCM'}\`;
    const subtitulo = cfg?.subtituloAsistente || "Lee todos los datos de la app en tiempo real";
    const QUICK = userName
        ? [\`¿Qué obras tenemos activas, \${userName}?\`, \`¿Qué documentación le falta al personal?\`, \`Resumen del avance de todas las obras\`, \`Total de materiales y subcontratos\`]
        : ["¿Estado de todas mis obras y licitaciones?", "¿Qué documentación le falta al personal?", "Resumen del avance de todas las obras activas", "Total de materiales y subcontratos cargados"];

    // Pantalla de bienvenida / pedir nombre
    const WelcomeScreen = () => {
        if (!nameLoaded) return null;
        // Si ya tiene nombre: mostrar pantalla principal con micrófono
        if (userName) {
            return (<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 24px 0" }}>
                <div style={{ marginBottom: 6, fontSize: 13, color: T.muted, fontWeight: 500 }}>Hola, <strong style={{ color: T.text }}>{userName}</strong> 👋</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 4, textAlign: "center" }}>{titulo}</div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 28, textAlign: "center" }}>{subtitulo}</div>

                {/* Botón micrófono grande central */}
                <button onClick={listening ? stopListen : startListen} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", marginBottom: 28 }}>
                    <div style={{ width: 120, height: 120, borderRadius: 28, background: T.card, border: \`2.5px solid \${listening ? "#EF4444" : "#111"}\`, boxShadow: listening ? \`0 0 0 6px rgba(239,68,68,.15),0 6px 24px rgba(0,0,0,.12)\` : \`0 6px 24px rgba(0,0,0,.1)\`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "all .3s", overflow: "hidden" }}>
                        {listening && <div style={{ position: "absolute", inset: -6, borderRadius: 34, border: "3px solid #EF4444", opacity: .35, animation: "pulse 1s ease infinite" }} />}
                        {listening && <div style={{ position: "absolute", inset: -14, borderRadius: 42, border: "2px solid #EF4444", opacity: .15, animation: "pulse 1s ease .3s infinite" }} />}
                        {cfg?.logoCentral
                            ? <img src={cfg.logoCentral} alt="logo" style={{ width: "78%", height: "78%", objectFit: "contain" }} />
                            : <svg width="56" height="56" viewBox="0 0 24 24" fill={listening ? "#EF4444" : T.accent} style={{ transition: "fill .3s" }}>
                                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={listening ? "#EF4444" : T.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                <line x1="12" y1="19" x2="12" y2="23" stroke={listening ? "#EF4444" : T.accent} strokeWidth="1.5" strokeLinecap="round" />
                                <line x1="8" y1="23" x2="16" y2="23" stroke={listening ? "#EF4444" : T.accent} strokeWidth="1.5" strokeLinecap="round" />
                            </svg>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: listening ? "#EF4444" : T.accent }}>
                        {listening ? t(cfg, 'chat_escuchando') : "Tocar para hablar"}
                    </div>
                </button>

                {listening && input && <div style={{ fontSize: 13, color: T.accent, fontStyle: "italic", textAlign: "center", marginBottom: 16, padding: "8px 16px", background: T.accentLight, borderRadius: 12 }}>"{input}"</div>}
                {micError && <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "8px 12px", marginBottom: 12, width: "100%" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                    <span style={{ fontSize: 11, color: "#EF4444", flex: 1 }}>{micError}</span>
                    <button onClick={() => { setMicError(''); setMicStatus('idle'); }} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 14, cursor: "pointer" }}>×</button>
                </div>}

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7 }}>
                    {QUICK.map((q, i) => (<button key={i} onClick={() => send(q)} style={{ background: T.card, border: \`1.5px solid \${T.border}\`, borderRadius: T.r, padding: "11px 14px", textAlign: "left", fontSize: 12, color: T.text, fontWeight: 500, boxShadow: T.shadow, cursor: "pointer" }}>{q}</button>))}
                </div>
                <button onClick={() => { setUserName(''); storage.set('bcm_username', '').catch(() => { }); }} style={{ marginTop: 18, fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>No soy {userName}</button>
            </div>);
        }

        // Si NO tiene nombre: pantalla para pedirlo
        return (<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px" }}>
            <div style={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                {cfg?.logoCentral
                    ? <img src={cfg.logoCentral} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <svg width="80" height="80" viewBox="0 0 24 24" fill={T.accent}>
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                        <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={T.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        <line x1="12" y1="19" x2="12" y2="23" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="8" y1="23" x2="16" y2="23" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 6, textAlign: "center" }}>{titulo}</div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 28, textAlign: "center", lineHeight: 1.6 }}>Antes de empezar,<br />¿cómo te llamás?</div>
            <div style={{ width: "100%", marginBottom: 12 }}>
                <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    placeholder="Escribí tu nombre..."
                    autoFocus
                    style={{ width: "100%", background: T.bg, border: \`2px solid \${T.accent}\`, borderRadius: T.r, padding: "14px 16px", fontSize: 16, color: T.text, textAlign: "center", fontWeight: 600 }}
                />
            </div>
            <PBtn full onClick={saveName} disabled={!nameInput.trim()}>Comenzar →</PBtn>
        </div>);
    };

    const VoiceBar = () => (<div style={{ background: T.card, borderBottom: \`1px solid \${T.border}\`, padding: "7px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={listening ? stopListen : startListen} disabled={micStatus === 'requesting'} style={{ display: "flex", alignItems: "center", gap: 6, background: listening ? "#EF4444" : micStatus === 'requesting' ? "#94A3B8" : T.accent, border: "none", borderRadius: 20, padding: "7px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: micStatus === 'requesting' ? "not-allowed" : "pointer", flexShrink: 0 }}>
                {micStatus === 'requesting'
                    ? <><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse .6s ease infinite" }} />Activando…</>
                    : listening
                        ? <><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse .6s ease infinite" }} />{t(cfg, 'chat_escuchando')}</>
                        : <><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /><line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>{t(cfg, 'chat_hablar')}</>}
            </button>
            {speaking && <button onClick={stopSpeak} style={{ display: "flex", alignItems: "center", gap: 5, background: "#F59E0B", border: "none", borderRadius: 20, padding: "7px 12px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>{t(cfg, 'chat_pausar')}
            </button>}
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{t(cfg, 'chat_voz_auto')}</span>
                <div onClick={() => setAutoSpeak(v => !v)} style={{ width: 34, height: 18, borderRadius: 9, background: autoSpeak ? T.accent : "#CBD5E1", cursor: "pointer", position: "relative", transition: "background .2s" }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: autoSpeak ? 18 : 2, transition: "left .2s" }} />
                </div>
            </div>
        </div>
        {micError && <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "6px 10px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
            <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, flex: 1 }}>{micError}</span>
            <button onClick={() => { setMicError(''); setMicStatus('idle'); }} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 14, cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
        </div>}
        {listening && input && <div style={{ fontSize: 12, color: T.accent, fontStyle: "italic", paddingLeft: 4, animation: "pulse 1s ease infinite" }}>"{input}"</div>}
    </div>);

    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
        {!apiKey && <div style={{ background: "#FFFBEB", borderBottom: "1px solid #FDE68A", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#D97706"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
            <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600, flex: 1 }}>Falta la API Key — ingresala en Más → Configuración → Cuenta</span>
        </div>}
        {msgs.length > 0 && <VoiceBar />}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {msgs.length === 0 ? (<WelcomeScreen />) : (
                <div style={{ padding: "14px 18px 0" }}>
                    {msgs.map((m, i) => {
                        const txt = Array.isArray(m.content) ? m.content.filter(b => b.type === 'text').map(b => b.text).join('\\n') : m.content; const mb = m.role === "assistant" ? mailBlock(txt) : null; const dispTxt = mb ? txt.replace(/---\\s*📧[\\s\\S]*/i, '').trim() : txt; const imgs = m._snap?.filter(a => a.isImg) || []; const docs = m._snap?.filter(a => !a.isImg) || []; return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                                {m.role !== "user" && <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 3, paddingLeft: 4 }}>{cfg?.empresa || 'BelfastCM'} IA</div>}
                                {m.role === "user" && imgs.length > 0 && <div style={{ display: "flex", gap: 5, marginBottom: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>{imgs.map(a => (<img key={a.id} src={a.dataUrl} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: \`1.5px solid \${T.border}\` }} />))}</div>}
                                {m.role === "user" && docs.length > 0 && <div style={{ display: "flex", gap: 5, marginBottom: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>{docs.map(a => (<div key={a.id} style={{ background: T.accentLight, border: \`1px solid \${T.border}\`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: T.accent, fontWeight: 600 }}>📄 {a.nombre.slice(0, 20)}</div>))}</div>}
                                {(dispTxt || m.role === 'assistant') && <div style={{ maxWidth: "87%", padding: "11px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? T.accent : T.card, color: m.role === "user" ? "#fff" : T.text, fontSize: 13, lineHeight: 1.65, boxShadow: m.role === "user" ? "0 2px 8px rgba(0,0,0,.2)" : T.shadow, border: m.role === "user" ? "none" : \`1px solid \${T.border}\`, whiteSpace: "pre-wrap" }}>{dispTxt}{m.role === 'assistant' && dispTxt && <button onClick={() => { speakText(dispTxt); setSpeaking(true); }} title="Escuchar" style={{ display: "inline-flex", alignItems: "center", marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: T.muted, verticalAlign: "middle", padding: 0 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" /></svg></button>}</div>}
                                {mb && <div style={{ maxWidth: "87%", marginTop: 6, background: "#ECFDF5", border: "1px solid #86EFAC", borderRadius: 12, padding: "12px 14px" }}><div style={{ fontSize: 11, color: "#15803D", fontWeight: 700, marginBottom: 6 }}>📧 Email listo</div><div style={{ fontSize: 11, color: T.text, marginBottom: 2 }}>Para: <strong>{mb.para}</strong></div><div style={{ fontSize: 11, color: T.text, marginBottom: 8 }}>Asunto: <strong>{mb.asunto}</strong></div><a href={\`mailto:\${mb.para}?subject=\${encodeURIComponent(mb.asunto)}&body=\${encodeURIComponent(dispTxt)}\`} style={{ display: "block", textDecoration: "none" }}><button style={{ width: "100%", background: "#10B981", border: "none", borderRadius: 9, padding: "9px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>✉️ Abrir cliente de correo</button></a></div>}
                            </div>);
                    })}
                    {loading && <div style={{ display: "flex", gap: 5, padding: "6px 4px", marginBottom: 10 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.muted, animation: \`pulse 1.2s ease \${i * .2}s infinite\` }} />)}</div>}
                    <div ref={bottomRef} style={{ height: 14 }} />
                </div>
            )}
        </div>
        {attachments.length > 0 && (<div style={{ background: T.card, borderTop: \`1px solid \${T.border}\`, padding: "8px 16px", display: "flex", gap: 8, overflowX: "auto" }}>{attachments.map(a => (<div key={a.id} style={{ position: "relative", flexShrink: 0 }}>{a.isImg ? <img src={a.dataUrl} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: \`1.5px solid \${T.border}\` }} /> : <div style={{ width: 56, height: 56, background: T.accentLight, border: \`1px solid \${T.border}\`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}><span style={{ fontSize: 8, fontWeight: 800, color: T.accent }}>{a.nombre.split('.').pop().toUpperCase()}</span><span style={{ fontSize: 7, color: T.sub, textAlign: "center", padding: "0 3px" }}>{a.nombre.slice(0, 10)}</span></div>}<button onClick={() => setAttachments(p => p.filter(x => x.id !== a.id))} style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#EF4444", border: "none", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>×</button></div>))}</div>)}
        <div style={{ padding: "8px 14px calc(max(14px,env(safe-area-inset-bottom)) + 70px)", background: T.card, borderTop: \`1px solid \${T.border}\`, position: "relative" }}>
            {showAttachMenu && (<div style={{ position: "absolute", bottom: "100%", left: 14, background: T.card, border: \`1px solid \${T.border}\`, borderRadius: 14, boxShadow: "0 -4px 20px rgba(0,0,0,.1)", padding: "8px", display: "flex", gap: 6, zIndex: 10 }}>
                <input ref={camRef} type="file" accept="image/*" capture="environment" multiple onChange={e => handleAttach(e)} style={{ display: "none" }} />
                <input ref={imgFileRef} type="file" accept="image/*" multiple onChange={e => handleAttach(e)} style={{ display: "none" }} />
                <input ref={anyFileRef} type="file" accept=".pdf,.docx,.doc,.xlsx,.xls,.txt" multiple onChange={e => handleAttach(e)} style={{ display: "none" }} />
                {[{ icon: "📷", label: "Cámara", ref: camRef }, { icon: "🖼️", label: "Imagen", ref: imgFileRef }, { icon: "📄", label: "Archivo", ref: anyFileRef }].map(opt => (<button key={opt.label} onClick={() => opt.ref.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: T.bg, border: \`1px solid \${T.border}\`, borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}><span style={{ fontSize: 22 }}>{opt.icon}</span><span style={{ fontSize: 10, fontWeight: 600, color: T.sub }}>{opt.label}</span></button>))}
            </div>)}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <button onClick={() => setShowAttachMenu(p => !p)} style={{ width: 40, height: 40, borderRadius: "50%", background: showAttachMenu ? T.accent : T.bg, border: \`1.5px solid \${showAttachMenu ? T.accent : T.border}\`, color: showAttachMenu ? "#fff" : T.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div style={{ flex: 1, background: T.bg, border: \`1.5px solid \${T.border}\`, borderRadius: 22, padding: "10px 14px" }}><textarea ref={taRef} rows={1} value={input} placeholder={t(cfg, 'chat_placeholder')} onChange={e => { setInput(e.target.value); const el = taRef.current; if (el) { el.style.height = "22px"; el.style.height = Math.min(el.scrollHeight, 100) + "px"; } }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} style={{ width: "100%", background: "transparent", border: "none", color: T.text, fontSize: 14, lineHeight: 1.5, height: 22 }} /></div>
                <button onClick={listening ? stopListen : startListen} style={{ width: 42, height: 42, borderRadius: "50%", background: listening ? "#EF4444" : T.bg, border: \`1.5px solid \${listening ? "#EF4444" : T.border}\`, color: listening ? "#fff" : T.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", position: "relative" }}>
                    {listening && <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "2px solid #EF4444", animation: "pulse 1s ease infinite", opacity: .5 }} />}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /><line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <button onClick={() => send()} disabled={(!input.trim() && !attachments.length) || loading} style={{ width: 42, height: 42, borderRadius: "50%", background: (input.trim() || attachments.length) && !loading ? T.accent : "#E2E8F0", color: (input.trim() || attachments.length) && !loading ? "#fff" : "#94A3B8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
        </div>
    </div>);
}

const DEMO_LICS = [/***EMPTY***/, nombre: "Refacción Terminal A", ap: "aep", estado: "curso", monto: "$4.200.000", fecha: "10/03/25", sector: "Terminal A", docs: {} }, { id: "l2", nombre: "Ampliación Sala VIP", ap: "aep", estado: "presupuesto", monto: "$8.500.000", fecha: "02/04/25", sector: "Sala VIP", docs: {} }, { id: "l3", nombre: "Señalética Pista Norte", ap: "eze", estado: "visitar", monto: "—", fecha: "15/04/25", sector: "Pista Norte", docs: {} }, { id: "l4", nombre: "Hangar Técnico", ap: "eze", estado: "adjudicada", monto: "$12.100.000", fecha: "20/02/25", sector: "Hangar", docs: {} }, { id: "l5", nombre: "Baños Internacionales", ap: "eze", estado: "curso", monto: "$1.800.000", fecha: "28/03/25", sector: "Terminal B", docs: {} }];
const DEMO_OBRAS = [{ id: "o1", nombre: "Refacción Terminal A", ap: "aep", estado: "curso", avance: 65, inicio: "10/03/25", cierre: "30/06/25", sector: "Terminal A", obs: [], fotos: [], archivos: [], informes: [], docs: {} }, { id: "o2", nombre: "Baños Internacionales", ap: "eze", estado: "curso", avance: 30, inicio: "28/03/25", cierre: "31/07/25", sector: "Terminal B", obs: [], fotos: [], archivos: [], informes: [], docs: {} }, { id: "o3", nombre: "Hangar Técnico", ap: "eze", estado: "terminada", avance: 100, inicio: "20/02/25", cierre: "15/04/25", sector: "Hangar", obs: [], fotos: [], archivos: [], informes: [], docs: {} }];
const DEMO_PERSONAL = [{ id: "p1", nombre: "M. Rodríguez", rol: "Jefe de Obra", empresa: "BelfastCM", docs: {}, telefono: "5491154321234", foto: "" }, { id: "p2", nombre: "P. Gómez", rol: "Capataz", empresa: "BelfastCM", docs: {}, telefono: "5491187654321", foto: "" }];
const DEMO_ALERTS = [{ id: "a1", prioridad: "alta", msg: "ART de M. Rodríguez vence en 2 días" }, { id: "a2", prioridad: "media", msg: "Obra 'Baños Internacionales' sin actividad hace 5 días" }, { id: "a3", prioridad: "alta", msg: "Pliego EZE vence en 3 días" }];

function LoginScreen({ onLogin }) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    function tryLogin() {
        setLoading(true);
        setTimeout(() => {
            const c = USERS.find(u => u.user === user.trim().toLowerCase() && u.pass === pass);
            if (c) { onLogin(c); return; }
            // Check personal staff users
            const staff = (window.__bcm_personal__ || []).find(p => p.appUser && p.appUser === user.trim().toLowerCase() && p.appPass === pass);
            if (staff) { onLogin({ user: staff.appUser, pass: staff.appPass, rol: staff.rol, nombre: staff.nombre, nivel: staff.nivel || 'empleado' }); return; }
            setErr('Usuario o contraseña incorrectos'); setLoading(false);
        }, 400);
    }
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', padding: '0 32px', fontFamily: "var(--font,'Plus Jakarta Sans'),sans-serif" }}>
            <div style={{ width: '100%', maxWidth: 360 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    {loginLogo
                        ? <img src={loginLogo} alt="Logo" style={{ height: 80, objectFit: 'contain', marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
                        : <div style={{ width: 64, height: 64, borderRadius: 18, background: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>🏗</div>
                    }
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>BelfastCM</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Construction Management</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Usuario</div>
                        <input value={user} onChange={e => { setUser(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && tryLogin()} placeholder="Ingresá tu usuario" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 15, color: '#0F172A', background: '#F8FAFC', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Contraseña</div>
                        <div style={{ position: 'relative' }}>
                            <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => { setPass(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && tryLogin()} placeholder="••••••••" style={{ width: '100%', padding: '12px 44px 12px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 15, color: '#0F172A', background: '#F8FAFC', boxSizing: 'border-box', outline: 'none' }} />
                            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: showPass ? '#1D4ED8' : '#94A3B8', padding: 4, display: 'flex', alignItems: 'center' }}>
                                {showPass
                                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                }
                            </button>
                        </div>
                    </div>
                    {err && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#EF4444', marginBottom: 14 }}>{err}</div>}
                    <button onClick={tryLogin} disabled={loading || !user || !pass} style={{ width: '100%', padding: '14px', background: (!user || !pass) ? '#CBD5E1' : '#1D4ED8', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [view, setView] = useState("chat");
    const [lics, setLics] = useState(DEMO_LICS);
    const [obras, setObras] = useState(DEMO_OBRAS);
    const [personal, setPersonal] = useState(DEMO_PERSONAL);
    const [alerts, setAlerts] = useState(DEMO_ALERTS);
    const [contactos, setContactos] = useState([]);
    const [detailObraId, setDetailObraId] = useState(null);
    const [authed, setAuthed] = useState(null);
    const [authModal, setAuthModal] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [unreadMsgs, setUnreadMsgs] = useState(0);
    const [showMsgBanner, setShowMsgBanner] = useState(false);
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
            try { const r = await storage.get('bcm_cfg_locked'); if (r?.value === 'true') setCfgLocked(true); } catch { }
            setCfgLockedLoaded(true);
        })();
    }, []);
    useEffect(() => {
        if (!cfgLockedLoaded) return;
        storage.set('bcm_cfg_locked', cfgLocked ? 'true' : 'false').catch(() => {});
    }, [cfgLocked, cfgLockedLoaded]);

    // Carga datos — PRIMERO lee, DESPUÉS habilita el guardado
    useEffect(() => {
        (async () => {
            try {
                const r = await storage.get("bcm_state");
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
                obs: [{ id: Math.random().toString(36).slice(2, 9), txt: "Obra creada automáticamente desde licitación.", fecha: new Date().toLocaleDateString("es-AR") }],
                fotos: [], archivos: [], informes: [], docs: {},
            });
        });
        if (nuevas.length > 0) setObras(p => [...p, ...nuevas]);
    }, [dataLoaded]);

    // Guarda solo después de que se cargaron los datos del storage
    useEffect(() => {
        if (!dataLoaded) return;
        storage.set("bcm_state", JSON.stringify({ lics, obras, personal, alerts })).catch(() => { });
    }, [lics, obras, personal, alerts, dataLoaded]);

    useEffect(() => {
        (async () => {
            try {
                const r = await storage.get('bcm_config');
                const lb = await storage.get('bcm_logo_b').catch(() => null);
                const la = await storage.get('bcm_logo_a').catch(() => null);
                const li = await storage.get('bcm_logo_i').catch(() => null);
                const lc = await storage.get('bcm_logo_c').catch(() => null);
                const base = r?.value ? { ...DEFAULT_CONFIG, ...JSON.parse(r.value) } : { ...DEFAULT_CONFIG };
                setCfg({ ...base, logoBelfast: lb?.value || '', logoAA2000: la?.value || '', logoAsistente: li?.value || '', logoCentral: lc?.value || '' });
                const rk = await storage.get('bcm_apikey').catch(() => null);
                if (rk?.value) setApiKey(rk.value);
            } catch { }
            setCfgLoaded(true);
        })();
    }, []);

    useEffect(() => {
        if (!cfgLoaded) return;
        const { logoBelfast, logoAA2000, logoAsistente, logoCentral, ...rest } = cfg;
        storage.set('bcm_config', JSON.stringify(rest)).catch(() => { });
        storage.set('bcm_logo_b', logoBelfast || '').catch(() => { });
        storage.set('bcm_logo_a', logoAA2000 || '').catch(() => { });
        storage.set('bcm_logo_i', logoAsistente || '').catch(() => { });
        storage.set('bcm_logo_c', logoCentral || '').catch(() => { });
    }, [cfg, cfgLoaded]);

    function requireAuth(action, titulo) {
        if (authed) { action(); }
        else { setAuthModal({ onSuccess: (u) => { setAuthed(u); action(); setAuthModal(null); }, onClose: () => setAuthModal(null), titulo: \`🔒 \${titulo}\` }); }
    }
    const nav = (v) => { setDetailObraId(null); setView(v); };
    // Expose personal for login check
    useEffect(() => { window.__bcm_personal__ = personal; }, [personal]);

    // Auto-check payment alerts
    useEffect(() => {
        if (!dataLoaded) return;
        obras.forEach(o => {
            if (o.estado !== 'curso') return;
            const total = parseFloat(String(o.monto || '0').replace(/[^0-9.]/g,'')) || 0;
            const pagado = parseFloat(o.pagado || 0);
            if (total <= 0) return;
            const pct = pagado / total * 100;
            const saldo = total - pagado;
            if (pct > 90) {
                const msg = \`💳 "\${o.nombre}": presupuesto al \${Math.round(pct)}% — quedan $\${saldo.toLocaleString('es-AR')}\`;
                if (!alerts.some(a => a.msg === msg))
                    setAlerts(p => [...p, { id: uid(), prioridad: 'alta', msg }]);
            }
        });
    }, [dataLoaded, obras]);

    // Auto-check document expiry and create alerts
    useEffect(() => {
        if (!dataLoaded) return;
        const hoy = new Date();
        const nuevasAlertas = [];
        personal.forEach(p => {
            Object.entries(p.docs || {}).forEach(([did, doc]) => {
                if (!doc?.vence) return;
                const [d, m, y] = doc.vence.split('/');
                if (!d || !m || !y) return;
                const vence = new Date(\`20\${y}\`, m - 1, d);
                const diasRestantes = Math.ceil((vence - hoy) / (1000 * 60 * 60 * 24));
                if (diasRestantes <= 7 && diasRestantes >= 0) {
                    const msg = \`⚠️ \${p.nombre}: \${doc.nombre || did.toUpperCase()} vence en \${diasRestantes === 0 ? 'HOY' : diasRestantes + ' día' + (diasRestantes > 1 ? 's' : '')}\`;
                    const yaExiste = alerts.some(a => a.msg === msg);
                    if (!yaExiste) nuevasAlertas.push({ id: uid(), prioridad: diasRestantes <= 2 ? 'alta' : 'media', msg });
                } else if (diasRestantes < 0) {
                    const msg = \`🔴 \${p.nombre}: \${doc.nombre || did.toUpperCase()} VENCIDO hace \${Math.abs(diasRestantes)} día\${Math.abs(diasRestantes) > 1 ? 's' : ''}\`;
                    const yaExiste = alerts.some(a => a.msg === msg);
                    if (!yaExiste) nuevasAlertas.push({ id: uid(), prioridad: 'alta', msg });
                }
            });
        });
        if (nuevasAlertas.length > 0) setAlerts(p => [...p, ...nuevasAlertas]);
    }, [dataLoaded, personal]);

    // Check unread messages every 15 seconds
    useEffect(() => {
        if (!loggedIn || !currentUser) return;
        const miUser = currentUser.user || currentUser.nombre || 'admin';
        async function checkUnread() {
            try {
                const r = await fetch(\`\${SUPA_URL}/rest/v1/bcm_mensajes?para=eq.\${encodeURIComponent(miUser)}&leido=eq.false&select=id\`, { headers: SH() });
                if (r.ok) {
                    const d = await r.json();
                    const count = d?.length || 0;
                    setUnreadMsgs(count);
                    if (count > 0) setShowMsgBanner(true);
                }
            } catch {}
        }
        checkUnread();
        const interval = setInterval(checkUnread, 15000);
        return () => clearInterval(interval);
    }, [loggedIn, currentUser]);
    const hideBrand = ["archivos", "seguimiento", "mensajes"].includes(view);

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg, fontFamily: \`var(--font,'Plus Jakarta Sans'),sans-serif\`, maxWidth: 480, margin: "0 auto", overflow: "hidden" }}>
            <style>{css}</style>
            <style>{buildThemeCSS(cfg)}</style>
            {!hideBrand && <AppBrand cfg={cfg} />}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {view === "dashboard" && <Dashboard lics={lics} obras={obras} personal={personal} alerts={alerts} setView={nav} setDetailObraId={setDetailObraId} requireAuth={requireAuth} cfg={cfg} customIcons={typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("bcm_icons") || "{}")) : {}} />}
                {view === "licitaciones" && <Licitaciones lics={lics} setLics={setLics} requireAuth={requireAuth} cfg={cfg} obras={obras} setObras={setObras} />}
                {view === "obras" && <Obras obras={obras} setObras={setObras} lics={lics} detailId={detailObraId} setDetailId={setDetailObraId} requireAuth={requireAuth} cfg={cfg} apiKey={apiKey} />}
                {view === "personal" && <Personal personal={personal} setPersonal={setPersonal} obras={obras} cfg={cfg} />}
                {view === "mas" && <Mas setView={nav} authed={authed} setAuthed={setAuthed} requireAuth={requireAuth} cfg={cfg} setCfg={setCfg} apiKey={apiKey} setApiKey={setApiKey} cfgLocked={cfgLocked} setCfgLocked={setCfgLocked} lics={lics} obras={obras} personal={personal} alerts={alerts} currentUser={currentUser} />}
                {view === "archivos" && <Archivos setView={nav} />}
                {view === "seguimiento" && <Seguimiento alerts={alerts} setAlerts={setAlerts} setView={nav} />}
                {view === "mensajes" && <MensajesView personal={personal} setView={nav} currentUser={currentUser} />}
                {view === "resumen" && <ResumenView lics={lics} obras={obras} personal={personal} alerts={alerts} setView={nav} />}
                {view === "cargar" && <CargarView obras={obras} setObras={setObras} cargarState={cargarState} setCargarState={setCargarState} apiKey={apiKey} />}
                {view === "contactos" && <ContactosView setView={nav} onContactosChange={setContactos} />}
                {view === "whatsapp" && <WhatsappGrupos personal={personal} setView={nav} />}
                {view === "proveedores" && <ProveedoresView setView={nav} />}
                {view === "info_externa" && <InfoExternaView setView={nav} />}
                {view === "info_util" && <InfoUtilView setView={nav} />}
                {view === "gantt" && <GanttView obras={obras} setView={nav} />}
                {view === "informes_ingeniero" && <InformesIngeniero setView={nav} />}
                {view === "informes_ia" && <InformesIA obras={obras} personal={personal} lics={lics} alerts={alerts} setView={nav} apiKey={apiKey} cfg={cfg} />}
                {view === "vigilancia" && <PanelVigilancia setView={nav} />}
                {view === "presentismo" && <Presentismo personal={personal} setView={nav} />}
                {view === "presupuesto_materiales" && <PresupuestoView tipo="materiales" setView={nav} />}
                {view === "presupuesto_subcontratos" && <PresupuestoView tipo="subcontratos" setView={nav} />}
                {view === "chat" && <Chat contactos={contactos} lics={lics} obras={obras} personal={personal} alerts={alerts} msgs={chatMsgs} setMsgs={setChatMsgs} cfg={cfg} apiKey={apiKey} />}
            </div>
            <BottomNav view={view} setView={nav} alerts={alerts} cfg={cfg} />
            {authModal && <LoginModal titulo={authModal.titulo} onSuccess={authModal.onSuccess} onClose={authModal.onClose} />}
        </div>
    );
}
`;


// ── CONSTANTES ─────────────────────────────────────────────────────────
const T = { bg: "var(--bg,#F1F5F9)", card: "var(--card,#fff)", border: "var(--border,#E2E8F0)", text: "var(--text,#0F172A)", sub: "var(--sub,#475569)", muted: "var(--muted,#94A3B8)", accent: "var(--accent,#1D4ED8)", accentLight: "var(--al,#EFF6FF)", navy: "var(--navy,#0F172A)", r: "var(--r,14px)", rsm: "var(--rsm,10px)", shadow: "0 1px 3px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04)" };
const AIRPORTS = [{ id: "aep", code: "AEP", name: "Aeroparque Jorge Newbery" }, { id: "eze", code: "EZE", name: "Aerop. Int'l Ministro Pistarini" }];
const LIC_ESTADOS = [{ id: "visitar", label: "A Visitar", color: "#F59E0B", bg: "#FFFBEB" }, { id: "presupuesto", label: "Presupuesto", color: "#3B82F6", bg: "#EFF6FF" }, { id: "curso", label: "En Curso", color: "#8B5CF6", bg: "#F5F3FF" }, { id: "presentada", label: "Presentada", color: "#F97316", bg: "#FFF7ED" }, { id: "adjudicada", label: "Adjudicada", color: "#10B981", bg: "#ECFDF5" }, { id: "descartada", label: "Descartada", color: "#EF4444", bg: "#FEF2F2" }];
const OBRA_ESTADOS = [{ id: "pendiente", label: "Pendiente", color: "#94A3B8", bg: "#F8FAFC" }, { id: "curso", label: "En Curso", color: "#10B981", bg: "#ECFDF5" }, { id: "pausada", label: "Pausada", color: "#F59E0B", bg: "#FFFBEB" }, { id: "terminada", label: "Terminada", color: "#6366F1", bg: "#EEF2FF" }];
const ROLES = ["Jefe de Obra", "Capataz", "Técnico", "Proveedor", "Contratista", "Administrativo"];
const DOC_TYPES = [{ id: "art", label: "ART", acceptsExp: true }, { id: "antec", label: "Antecedentes", acceptsExp: false }, { id: "preoc", label: "Preocupacional", acceptsExp: true }, { id: "dni", label: "DNI", acceptsExp: false }, { id: "sicop", label: "SiCoP", acceptsExp: false }, { id: "alta", label: "Alta Temprana", acceptsExp: false }];
const LIC_DOC_TYPES = [{ id: "planos", label: "Planos", accept: ".pdf,.png,.jpg,.dwg,.zip" }, { id: "pliego", label: "Pliego", accept: ".pdf,.doc,.docx" }, { id: "excel", label: "Excel", accept: ".xlsx,.xls,.csv,.pdf" }, { id: "otros", label: "Otros", accept: "*" }];
const EMAIL_IA = "ia.belfastcm@gmail.com";
const ADMIN_CREDS = [{ user: "admin", pass: "belfast2025", rol: "Administrador", nivel: "directivo" }, { user: "supervisor", pass: "obra2025", rol: "Supervisor", nivel: "directivo" }];
const USERS = ADMIN_CREDS; // alias — configurable desde Más → Configuración
function isDirectivo(user) {
    if (!user) return false;
    const nivel = user.nivel || '';
    const rol = (user.rol || '').toLowerCase();
    return nivel === 'directivo' || ['administrador', 'supervisor', 'gerente', 'director'].some(r => rol.includes(r));
}

// ── TEMA ───────────────────────────────────────────────────────────────
const THEME_PRESETS = [
    { id: "azul", label: "Azul", accent: "#1D4ED8", al: "#EFF6FF", bg: "#F1F5F9", card: "#fff", border: "#E2E8F0", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#0F172A" },
    { id: "oscuro", label: "Oscuro", accent: "#60A5FA", al: "#172554", bg: "#0F172A", card: "#1E293B", border: "#334155", text: "#F1F5F9", sub: "#94A3B8", muted: "#475569", navy: "#020617" },
    { id: "verde", label: "Verde", accent: "#16A34A", al: "#DCFCE7", bg: "#F0FDF4", card: "#fff", border: "#BBF7D0", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#14532D" },
    { id: "violeta", label: "Violeta", accent: "#7C3AED", al: "#F5F3FF", bg: "#FAF5FF", card: "#fff", border: "#E9D5FF", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#3B0764" },
    { id: "rojo", label: "Rojo", accent: "#DC2626", al: "#FEF2F2", bg: "#FFF5F5", card: "#fff", border: "#FECACA", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#7F1D1D" },
    { id: "naranja", label: "Naranja", accent: "#EA580C", al: "#FFF7ED", bg: "#FFFBF5", card: "#fff", border: "#FED7AA", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#431407" },
    { id: "minimal", label: "Mínimal", accent: "#111111", al: "#F5F5F5", bg: "#FAFAFA", card: "#fff", border: "#E8E8E8", text: "#111", sub: "#555", muted: "#aaa", navy: "#111" },
    { id: "cyan", label: "Cyan", accent: "#0891B2", al: "#ECFEFF", bg: "#F0FDFF", card: "#fff", border: "#A5F3FC", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#164E63" },
    { id: "rosa", label: "Rosa", accent: "#DB2777", al: "#FDF2F8", bg: "#FDF4FF", card: "#fff", border: "#FBCFE8", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#500724" },
];
const FONTS = [
    { id: "jakarta", label: "Jakarta", value: "'Plus Jakarta Sans'" },
    { id: "inter", label: "Inter", value: "'Inter'" },
    { id: "poppins", label: "Poppins", value: "'Poppins'" },
    { id: "roboto", label: "Roboto", value: "'Roboto'" },
    { id: "montserrat", label: "Montserrat", value: "'Montserrat'" },
    { id: "system", label: "Sistema", value: "-apple-system,BlinkMacSystemFont" },
];
const RADIUS_OPTS = [{ id: "sharp", label: "Recto", r: 4 }, { id: "normal", label: "Normal", r: 14 }, { id: "suave", label: "Suave", r: 20 }, { id: "round", label: "Redondo", r: 28 }];
const COLOR_KEYS = [{ k: "accent", label: "Principal" }, { k: "bg", label: "Fondo" }, { k: "card", label: "Tarjetas" }, { k: "text", label: "Texto" }, { k: "navy", label: "Encabezado" }, { k: "border", label: "Bordes" }];
const DEFAULT_COLORS = { accent: "#1D4ED8", al: "#EFF6FF", bg: "#F1F5F9", card: "#ffffff", border: "#E2E8F0", text: "#0F172A", sub: "#475569", muted: "#94A3B8", navy: "#0F172A" };
const DEFAULT_UBICACIONES = [{ id: "aep", code: "AEP", name: "Aeroparque Jorge Newbery" }, { id: "eze", code: "EZE", name: "Aerop. Int'l Ministro Pistarini" }];

const DEFAULT_TEXTOS = {
    // Nav
    nav_ia: "IA", nav_inicio: "Inicio", nav_obras: "Obras", nav_personal: "Personal", nav_cargar: "Cargar", nav_mas: "Más",
    // Dashboard
    dash_titulo: "Panel operativo", dash_subtitulo: "BelfastCM × AA2000",
    dash_licitaciones: "Licitaciones", dash_obras_activas: "Obras activas", dash_alertas: "Alertas", dash_personal: "Personal",
    dash_obras_curso: "Obras en curso", dash_ver_todas: "Ver todas →", dash_acciones: "Acciones rápidas",
    dash_nueva_lic: "Nueva licitación", dash_nueva_obra: "Nueva obra", dash_presup_mat: "Presupuesto materiales", dash_subcontratos: "Subcontratos",
    // Obras
    obras_titulo: "Obras", obras_nueva: "Nueva obra", obras_avance: "Avance", obras_inicio: "Inicio", obras_cierre: "Cierre est.",
    obras_sector: "Sector", obras_estado: "Estado", obras_info: "Info", obras_notas: "Notas", obras_fotos: "Fotos", obras_archivos: "Archivos",
    obras_obs_placeholder: "Registrar observación...", obras_sin_notas: "Sin notas", obras_sin_fotos: "Sin fotos", obras_sin_archivos: "Sin archivos",
    obras_agregar_fotos: "Agregar fotos", obras_agregar_arch: "Agregar archivo", obras_eliminar: "Eliminar obra",
    // Licitaciones
    lic_titulo: "Licitaciones", lic_nueva: "Nueva licitación", lic_nombre: "Nombre", lic_monto: "Monto", lic_fecha: "Fecha", lic_sector: "Sector",
    lic_crear: "Crear licitación", lic_eliminar: "Eliminar",
    // Personal
    pers_titulo: "Personal de Obra", pers_nuevo: "Nuevo trabajador", pers_nombre: "Nombre", pers_rol: "Rol", pers_empresa: "Empresa",
    pers_obra: "Obra", pers_whatsapp: "WhatsApp", pers_documentacion: "Documentación", pers_sin_personal: "Sin personal registrado",
    pers_eliminar: "Eliminar trabajador", pers_agregar: "Agregar",
    // Cargar
    carg_titulo: "Registro de Avance", carg_sub: "Fotos + Informe IA", carg_sel_obra: "Seleccioná la obra",
    carg_fotos: "Cargá fotos nuevas", carg_tomar: "Tomar foto", carg_galeria: "Galería / PC",
    carg_generar: "Comparar y generar informe", carg_analizando: "Analizando...",
    carg_informe: "Informe generado", carg_nuevo: "+ Nuevo", carg_descargar: "⬇ Descargar",
    // Chat / IA
    chat_titulo: "Asistente IA", chat_placeholder: "Escribí o usá el micrófono…",
    chat_hablar: "Hablar", chat_escuchando: "Escuchando…", chat_pausar: "Pausar", chat_voz_auto: "Voz auto",
    // Más
    mas_titulo: "Más opciones", mas_config: "Configuración", mas_config_sub: "Estética · Logos · Empresa · Admin",
    mas_cerrar_sesion: "Cerrar sesión",
    // Config
    cfg_cuenta: "Cuenta y empresa", cfg_tema: "Tema visual", cfg_tipografia: "Tipografía",
    cfg_forma: "Forma de los elementos", cfg_logos: "Logos y textos", cfg_textos: "Textos de la app",
    cfg_guardar: "✓ Guardar y cerrar", cfg_restaurar: "↺ Restaurar tema por defecto",
};

const DEFAULT_CONFIG = { email: EMAIL_IA, empresa: "BelfastCM", cargo: "Gerencia de Obra", telefono: "", ciudad: "Buenos Aires, Argentina", logoBelfast: "", logoAA2000: "", logoAsistente: "", logoCentral: "", tituloAsistente: "Asistente BelfastCM", subtituloAsistente: "Lee todos los datos de la app en tiempo real", themeId: "azul", colors: { ...DEFAULT_COLORS }, fontId: "jakarta", radiusId: "normal", ubicaciones: DEFAULT_UBICACIONES, labelUbicacion: "Aeropuerto", textos: { ...DEFAULT_TEXTOS } };

// Helper para obtener texto con fallback al default
function t(cfg, key) { return cfg?.textos?.[key] || DEFAULT_TEXTOS[key] || key; }

function getUbics(cfg) { return (cfg?.ubicaciones?.length ? cfg.ubicaciones : DEFAULT_UBICACIONES); }
function getLabelUbic(cfg) { return cfg?.labelUbicacion || "Aeropuerto"; }
function uid() { return Math.random().toString(36).slice(2, 9); }
function toDataUrl(f, maxW = 1400) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => {
            if (!f.type.startsWith('image/')) { res(e.target.result); return; }
            const img = new Image();
            img.onload = () => {
                if (img.width <= maxW) { res(e.target.result); return; }
                const c = document.createElement('canvas');
                const ratio = maxW / img.width;
                c.width = maxW; c.height = Math.round(img.height * ratio);
                c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                res(c.toDataURL('image/jpeg', 0.85));
            };
            img.onerror = () => res(e.target.result);
            img.src = e.target.result;
        };
        reader.onerror = rej;
        reader.readAsDataURL(f);
    });
}
function getBase64(d) { return d.split(',')[1]; }
function getMediaType(d) { const m = d.match(/data:([^;]+);/); return m ? m[1] : 'image/jpeg'; }
async function callAI(msgs, sys, apiKey) {
    try {
        const headers = { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true", "anthropic-version": "2023-06-01" };
        if (apiKey) headers["x-api-key"] = apiKey;
        else return "⚠ Para usar el asistente, ingresá tu API Key en Más → Configuración → API Key de Claude.";
        const r = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers,
            body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, system: sys, messages: msgs })
        });
        if (!r.ok) {
            let msg = "Error de conexión.";
            try { const d = await r.json(); msg = d.error?.message || `Error ${r.status}`; } catch { }
            return msg;
        }
        const d = await r.json();
        if (d.error) return `Error: ${d.error.message || 'Sin respuesta.'}`;
        return d.content?.map(b => b.text || "").join("") || "Sin respuesta.";
    } catch (e) {
        return `Error de conexión: ${e.message || 'Verificá tu API Key en Configuración.'}`;
    }
} function daysSince(s) { if (!s) return 999; const [d, m, y] = s.split("/"); return Math.ceil((new Date(`20${y}`, m - 1, d) - new Date()) / (1000 * 60 * 60 * 24)); }
function hexLight(hex) { try { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `#${Math.round(r * .12 + 255 * .88).toString(16).padStart(2, '0')}${Math.round(g * .12 + 255 * .88).toString(16).padStart(2, '0')}${Math.round(b * .12 + 255 * .88).toString(16).padStart(2, '0')}`; } catch { return '#EFF6FF'; } }
function buildThemeCSS(cfg) {
    const c = cfg.colors || DEFAULT_COLORS;
    const fv = FONTS.find(f => f.id === cfg.fontId)?.value || "'Plus Jakarta Sans'";
    const rv = RADIUS_OPTS.find(r => r.id === cfg.radiusId)?.r || 14;
    return `:root{--bg:${c.bg};--card:${c.card};--border:${c.border};--text:${c.text};--sub:${c.sub || '#475569'};--muted:${c.muted || '#94A3B8'};--accent:${c.accent};--al:${c.al || hexLight(c.accent)};--navy:${c.navy};--r:${rv}px;--rsm:${Math.max(4, rv - 4)}px;--font:${fv};}`;
}



const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg,#F1F5F9);overscroll-behavior:none;}
  input,textarea,select,button{font-family:var(--font,'Plus Jakarta Sans'),sans-serif;}
  input:focus,textarea:focus,select:focus{outline:none;}textarea{resize:none;}button{cursor:pointer;}::-webkit-scrollbar{display:none;}
  @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes scanSweep{0%{top:-100%}100%{top:200%}}
`;

const BelfastLogo = ({ size = 44 }) => (
    <svg width={Math.round(size * 1.12)} height={size} viewBox="0 0 278 212" fill="none" stroke="#111" strokeWidth="5.5" strokeLinejoin="miter">
        <polygon points="8,84 98,84 126,54 36,54" />
        <path d="M8,84 L8,200 L98,200 L98,174 L52,174 L52,132 L98,132 L98,117 L57,117 L57,88 L98,88 L98,84 Z" />
        <line x1="98" y1="84" x2="126" y2="54" />
        <rect x="120" y="6" width="150" height="194" />
        <rect x="138" y="22" width="114" height="72" />
        <rect x="179" y="128" width="21" height="72" />
    </svg>
);
const AA2000Symbol = ({ size = 54 }) => (
    <svg width={size} height={Math.round(size * .52)} viewBox="0 0 130 68" fill="none">
        <ellipse cx="48" cy="34" rx="44" ry="20" stroke="#6b7280" strokeWidth="9" fill="none" />
        <polygon points="22,18 22,50 70,34" fill="#6b7280" />
    </svg>
);
function AppBrand({ cfg }) {
    const lb = cfg?.logoBelfast, la = cfg?.logoAA2000;
    return (
        <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "stretch", flexShrink: 0, minHeight: 72 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px" }}>
                {lb ? <img src={lb} alt="Belfast" style={{ maxHeight: 54, maxWidth: "100%", objectFit: "contain" }} />
                    : <div style={{ display: "flex", alignItems: "center", gap: 8 }}><BelfastLogo size={46} /><div style={{ lineHeight: 1.2 }}><div style={{ fontSize: 13, fontWeight: 900, color: "#111", letterSpacing: "0.06em" }}>BELFAST</div><div style={{ fontSize: 8, fontWeight: 600, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>Construction Mgmt</div></div></div>}
            </div>
            <div style={{ width: 1, background: T.border, flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px" }}>
                {la ? <img src={la} alt="AA2000" style={{ maxHeight: 54, maxWidth: "100%", objectFit: "contain" }} />
                    : <div style={{ display: "flex", alignItems: "center", gap: 8 }}><AA2000Symbol size={58} /><div style={{ lineHeight: 1.35 }}><div style={{ fontSize: 12, color: "#6b7280", fontWeight: 400 }}>Aeropuertos</div><div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Argentina</div></div></div>}
            </div>
        </div>
    );
}

function Card({ children, style = {}, onClick }) { return <div onClick={onClick} style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.border}`, boxShadow: T.shadow, ...style }}>{children}</div>; }
function Badge({ color, bg, children, style = {} }) { return <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 20, padding: "3px 8px", textTransform: "uppercase", letterSpacing: "0.04em", ...style }}>{children}</span>; }
function PBtn({ children, onClick, disabled, full, style = {}, variant = "primary" }) {
    const v = { primary: { background: disabled ? "#E2E8F0" : "var(--accent,#1D4ED8)", color: disabled ? "#94A3B8" : "#fff", boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,.18)", border: "none" }, ghost: { background: "none", border: `1.5px solid ${T.border}`, color: T.sub, boxShadow: "none" }, danger: { background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#EF4444", boxShadow: "none" } };
    return <button onClick={onClick} disabled={disabled} style={{ ...v[variant], borderRadius: T.rsm, padding: "11px 20px", fontSize: 14, fontWeight: 600, width: full ? "100%" : "auto", transition: "all .15s", ...style }}>{children}</button>;
}
function Sheet({ title, onClose, children }) { return (<div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", zIndex: 200, display: "flex", alignItems: "flex-end", backdropFilter: "blur(2px)" }}><div style={{ background: T.card, borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "90vh", overflow: "auto", animation: "up .25s ease", paddingBottom: 32 }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 0" }}><span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{title}</span><button onClick={onClose} style={{ background: T.bg, border: "none", borderRadius: 20, width: 32, height: 32, fontSize: 18, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button></div><div style={{ padding: "14px 20px 0" }}>{children}</div></div></div>); }
function Lbl({ children }) { return <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{children}</div>; }
function TInput({ value, onChange, placeholder, type = "text", extraStyle = {} }) { return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text, ...extraStyle }} />; }
function Sel({ value, onChange, children }) { return <select value={value} onChange={onChange} style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }}>{children}</select>; }
function FieldRow({ children }) { return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>{children}</div>; }
function Field({ label, children }) { return <div style={{ marginBottom: 12 }}><Lbl>{label}</Lbl>{children}</div>; }
function PlusBtn({ onClick }) { return <button onClick={onClick} style={{ background: "var(--accent,#1D4ED8)", color: "#fff", border: "none", borderRadius: 20, width: 34, height: 34, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}>+</button>; }
function AppHeader({ title, sub, right, back, onBack }) { return (<div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "12px 18px", flexShrink: 0, position: "sticky", top: 0, zIndex: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}>{back && <button onClick={onBack} style={{ background: T.bg, border: "none", borderRadius: 10, width: 32, height: 32, fontSize: 16, color: T.sub, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>}<div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>{title}</div>{sub && <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{sub}</div>}</div>{right}</div></div>); }

function LoginModal({ titulo, onSuccess, onClose }) {
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const [err, setErr] = useState('');
    const [showPass, setShowPass] = useState(false);
    function login() {
        const usuario = u.trim().toLowerCase();
        const contra = p.trim();
        if (!usuario || !contra) { setErr('Completá usuario y contraseña'); return; }
        const f = ADMIN_CREDS.find(c => c.user === usuario && c.pass === contra);
        if (f) { setErr(''); onSuccess(f); } else { setErr('Usuario o contraseña incorrectos'); }
    }
    return (<Sheet title={titulo || "Acceso requerido"} onClose={onClose}>
        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#15803D"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" /></svg>
            <span style={{ fontSize: 12, color: "#15803D", fontWeight: 600 }}>Área protegida – Acceso administrativo</span>
        </div>
        <Field label="Usuario">
            <input value={u} onChange={e => { setU(e.target.value); setErr(''); }} placeholder="Ingresá tu usuario"
                autoCapitalize="none" autoCorrect="off" autoComplete="username"
                onKeyDown={e => e.key === 'Enter' && login()}
                style={{ width: "100%", background: T.bg, border: `1.5px solid ${err ? '#FECACA' : T.border}`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }} />
        </Field>
        <Field label="Contraseña">
            <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={p} onChange={e => { setP(e.target.value); setErr(''); }}
                    placeholder="••••••••" autoComplete="current-password"
                    onKeyDown={e => e.key === 'Enter' && login()}
                    style={{ width: "100%", background: T.bg, border: `1.5px solid ${err ? '#FECACA' : T.border}`, borderRadius: T.rsm, padding: "11px 44px 11px 14px", fontSize: 14, color: T.text }} />
                <button onClick={() => setShowPass(v => !v)} type="button"
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: showPass ? "var(--accent,#1D4ED8)" : T.muted, display: "flex", alignItems: "center", padding: 4 }}>
                    {showPass
                        ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="currentColor" strokeWidth="1.5" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" /></svg>
                    }
                </button>
            </div>
        </Field>
        {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#EF4444", marginBottom: 12, fontWeight: 600, display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="evenodd" clipRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg>
            {err}
        </div>}
        <PBtn full onClick={login}>Ingresar</PBtn>

    </Sheet>);
}

const NAV_DEFS = [
    { id: "chat", tk: "nav_ia", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" /></svg> },
    { id: "dashboard", tk: "nav_inicio", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.061l8.69-8.69z" /><path d="M12 5.432l8.159 8.159.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198l.091-.086L12 5.432z" /></svg> },
    { id: "obras", tk: "nav_obras", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75V19.5H9z" /></svg> },
    { id: "personal", tk: "nav_personal", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> },
    { id: "cargar", tk: "nav_cargar", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" /><path fillRule="evenodd" clipRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H6a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg> },
    { id: "mas", tk: "nav_mas", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" /></svg> },
];
function BottomNav({ view, setView, alerts, cfg }) {
    return (<nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", padding: "6px 0 max(8px,env(safe-area-inset-bottom))", zIndex: 100, boxShadow: "0 -2px 16px rgba(0,0,0,.06)" }}>
        {NAV_DEFS.map(n => {
            const active = view === n.id; const badge = n.id === "dashboard" && alerts.length > 0; const label = t(cfg, n.tk); return (
                <button key={n.id} onClick={() => setView(n.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", color: n.id === "cargar" ? "#fff" : active ? "var(--accent,#1D4ED8)" : T.muted, padding: "4px 0", position: "relative" }}>
                    {n.id === "cargar" ? <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--accent,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -16, boxShadow: "0 4px 14px rgba(0,0,0,.25)", border: `3px solid ${T.card}` }}>{n.icon}</div> : n.icon}
                    <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: n.id === "cargar" ? "var(--accent,#1D4ED8)" : undefined }}>{label}</span>
                    {badge && <div style={{ position: "absolute", top: 4, right: "calc(50% - 12px)", width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: `1.5px solid ${T.card}` }} />}
                </button>
            );
        })}
    </nav>);
}

function Dashboard({ lics, obras, personal, alerts, setView, setDetailObraId, requireAuth, cfg, customIcons = {} }) {
    const UBICS = getUbics(cfg);
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <div style={{ background: T.navy, padding: "16px 18px 20px" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 3 }}>{t(cfg, 'dash_subtitulo')}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{t(cfg, 'dash_titulo')}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>{new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
                {[{ l: t(cfg, 'dash_licitaciones'), v: lics.filter(l => !["adjudicada", "descartada"].includes(l.estado)).length, c: "#60A5FA" }, { l: t(cfg, 'dash_obras_activas'), v: obras.filter(o => o.estado === "curso").length, c: "#34D399" }, { l: t(cfg, 'dash_alertas'), v: alerts.length, c: "#FBBF24" }, { l: t(cfg, 'dash_personal'), v: personal.length, c: "#A78BFA" }].map(k => (
                    <div key={k.l} style={{ background: "rgba(255,255,255,.08)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: k.c }}>{k.v}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", marginTop: 2, lineHeight: 1.3 }}>{k.l}</div>
                    </div>
                ))}
            </div>
        </div>
        <div style={{ padding: "14px 18px" }}>
            {alerts.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>⚠ {t(cfg, 'dash_alertas')}</div>{alerts.slice(0, 3).map(a => (<div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, background: a.prioridad === "alta" ? "#FEF2F2" : "#FFFBEB", border: `1px solid ${a.prioridad === "alta" ? "#FECACA" : "#FDE68A"}`, borderRadius: 10, padding: "10px 12px", marginBottom: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: a.prioridad === "alta" ? "#EF4444" : "#F59E0B", flexShrink: 0 }} /><div style={{ fontSize: 12, color: T.text, lineHeight: 1.4, flex: 1 }}>{a.msg}</div></div>))}</div>}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t(cfg, 'dash_obras_curso')}</div>
                    <button onClick={() => setView("obras")} style={{ fontSize: 12, color: T.accent, background: "none", border: "none", fontWeight: 600 }}>{t(cfg, 'dash_ver_todas')}</button>
                </div>
                {obras.filter(o => o.estado === "curso").map(o => (<Card key={o.id} onClick={() => { setDetailObraId(o.id); setView("obras"); }} style={{ padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><div style={{ fontSize: 13, fontWeight: 600, color: T.text, flex: 1, paddingRight: 8 }}>{o.nombre}</div><Badge color="#10B981" bg="#ECFDF5">{o.avance}%</Badge></div>
                    <div style={{ height: 4, background: T.bg, borderRadius: 4, marginBottom: 6 }}><div style={{ height: 4, background: T.accent, borderRadius: 4, width: `${o.avance}%` }} /></div>
                    <div style={{ fontSize: 11, color: T.muted }}>{UBICS.find(a => a.id === o.ap)?.code || o.ap} · {t(cfg, 'obras_cierre')}: {o.cierre}</div>
                </Card>))}
            </div>
            <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t(cfg, 'dash_acciones')}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[{ id: "qa_lic", label: t(cfg, 'dash_nueva_lic'), view: "licitaciones", lock: true, icon: "📋" }, { id: "qa_obra", label: t(cfg, 'dash_nueva_obra'), view: "obras", lock: true, icon: "🏗" }, { id: "qa_mat", label: t(cfg, 'dash_presup_mat'), view: "presupuesto_materiales", lock: false, icon: "📦" }, { id: "qa_sub", label: t(cfg, 'dash_subcontratos'), view: "presupuesto_subcontratos", lock: false, icon: "🤝" }].map(a => {
                        const ci = customIcons?.[a.id];
                        return (
                        <button key={a.id} onClick={() => a.lock ? requireAuth(() => setView(a.view), a.label) : setView(a.view)} style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "14px 12px", textAlign: "left", boxShadow: T.shadow, cursor: "pointer", position: "relative" }}>
                            <div style={{ fontSize: 22, marginBottom: 6, display: "flex", alignItems: "center" }}>
                                {ci?.type === 'img' ? <img src={ci.src} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
                                : ci?.type === 'svg' ? <span dangerouslySetInnerHTML={{ __html: ci.src }} style={{ display: "flex", width: 24, height: 24 }} />
                                : a.icon}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{a.label}</div>
                            {a.lock && <div style={{ position: "absolute", top: 8, right: 8, opacity: .4 }}><svg width="11" height="11" viewBox="0 0 24 24" fill={T.sub}><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg></div>}
                        </button>
                        );
                    })}
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
    const [display, setDisplay] = useState(value ? formatMonto(parseMonto(value)) : value || '');
    useEffect(() => { setDisplay(value ? formatMonto(parseMonto(value)) : value || ''); }, [value]);
    function handleChange(e) {
        const raw = parseMonto(e.target.value);
        const fmt = raw ? formatMonto(raw) : '';
        setDisplay(fmt);
        onChange(fmt);
    }
    return <input value={display} onChange={handleChange} placeholder={placeholder || '0 $'} style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }} />;
}

function DocGrid({ docs, onUpload, onRemove, refs, prefix }) {
    return (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{LIC_DOC_TYPES.map(d => {
        const doc = docs?.[d.id]; const rk = `${prefix}_${d.id}`; return (<div key={d.id}><input type="file" accept={d.accept} style={{ display: "none" }} ref={el => refs.current[rk] = el} onChange={async e => { if (e.target.files[0]) await onUpload(d.id, e.target.files[0]); e.target.value = ""; }} />
            {doc ? (<div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 10, padding: "9px 10px" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#15803D", marginBottom: 2 }}>{d.label}</div><div style={{ fontSize: 10, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{doc.nombre}</div><div style={{ display: "flex", gap: 4 }}><a href={doc.url} download={doc.nombre} style={{ textDecoration: "none", flex: 1 }}><button style={{ width: "100%", background: "none", border: "1px solid #86EFAC", borderRadius: 6, padding: "4px 0", fontSize: 9, color: "#15803D", fontWeight: 600, cursor: "pointer" }}>↓ Ver</button></a><button onClick={() => onRemove(d.id)} style={{ background: "none", border: "1px solid #FCA5A5", borderRadius: 6, padding: "4px 7px", fontSize: 9, color: "#EF4444", cursor: "pointer" }}>✕</button></div></div>
            ) : (<button onClick={() => refs.current[rk]?.click()} style={{ width: "100%", background: T.bg, border: "1.5px dashed #86EFAC", borderRadius: 10, padding: "10px 6px", cursor: "pointer", textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 700, color: "#15803D", marginBottom: 2 }}>{d.label.slice(0, 3).toUpperCase()}</div><div style={{ fontSize: 11, fontWeight: 600, color: T.sub }}>{d.label}</div><div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>Subir</div></button>)}</div>);
    })}</div>);
}

function Licitaciones({ lics, setLics, requireAuth, cfg, obras, setObras }) {
    const UBICS = getUbics(cfg);
    const [ap, setAp] = useState("todos"); const [showNew, setShowNew] = useState(false); const [showDetail, setShowDetail] = useState(null);
    const [form, setForm] = useState({ nombre: "", ap: "aep", estado: "visitar", monto: "", fecha: "", sector: "", docs: {} });
    const docRefs = useRef({}); const newDocRefs = useRef({});
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
            obs: [{ id: uid(), txt: `Obra creada automáticamente al adjudicar la licitación.`, fecha: new Date().toLocaleDateString("es-AR") }],
            fotos: [],
            archivos: [],
            informes: [],
            docs: {},
        };
        setObras(p => [...p, nuevaObra]);
    }

    function cambiarEstado(licId, nuevoEstado) {
        setLics(p => p.map(l => {
            if (l.id !== licId) return l;
            if ((nuevoEstado === "adjudicada" || nuevoEstado === "curso") && l.estado !== nuevoEstado) autoCrearObra({ ...l, estado: nuevoEstado });
            return { ...l, estado: nuevoEstado };
        }));
    }
    function add() { if (!form.nombre.trim()) return; setLics(p => [...p, { ...form, id: uid() }]); setForm({ nombre: "", ap: "aep", estado: "visitar", monto: "", fecha: "", sector: "", docs: {} }); setShowNew(false); }
    function del(id) { setLics(p => p.filter(l => l.id !== id)); setShowDetail(null); }
    async function handleDoc(licId, did, file) { const url = await toDataUrl(file); setLics(p => p.map(l => l.id === licId ? { ...l, docs: { ...(l.docs || {}), [did]: { nombre: file.name, url } } } : l)); }
    async function handleNewDoc(did, file) { const url = await toDataUrl(file); setForm(f => ({ ...f, docs: { ...(f.docs || {}), [did]: { nombre: file.name, url } } })); }
    const detail = showDetail ? lics.find(l => l.id === showDetail) : null;
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Licitaciones" sub={`${filtered.length} registros`} right={<PlusBtn onClick={() => requireAuth(() => setShowNew(true), "Nueva licitación")} />} />
        <div style={{ padding: "10px 18px", display: "flex", gap: 6, overflowX: "auto" }}>{[{ id: "todos", label: "Todos" }, ...AIRPORTS.map(a => ({ id: a.id, label: a.code }))].map(f => (<button key={f.id} onClick={() => setAp(f.id)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${ap === f.id ? "var(--accent,#1D4ED8)" : T.border}`, background: ap === f.id ? T.accentLight : T.card, color: ap === f.id ? T.accent : T.sub, fontSize: 12, fontWeight: 600 }}>{f.label}</button>))}</div>
        <div style={{ padding: "0 18px" }}>
            {LIC_ESTADOS.map(est => { const items = filtered.filter(l => l.estado === est.id); if (!items.length) return null; return (<div key={est.id} style={{ marginBottom: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: est.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: est.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{est.label}</span><span style={{ fontSize: 11, color: T.muted }}>({items.length})</span></div>{items.map(lic => { const obraVinc = obras.find(o => o.lic_id === lic.id); return (<Card key={lic.id} onClick={() => setShowDetail(lic.id)} style={{ padding: "13px 14px", marginBottom: 7, cursor: "pointer" }}><div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ flex: 1, paddingRight: 8 }}><div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>{lic.nombre}{obraVinc && <span style={{ fontSize: 9, fontWeight: 700, background: "#ECFDF5", color: "#10B981", border: "1px solid #86EFAC", borderRadius: 20, padding: "1px 6px" }}>🏗 EN OBRA</span>}</div><div style={{ fontSize: 11, color: T.muted }}>{AIRPORTS.find(a => a.id === lic.ap)?.code}{lic.sector ? ` · ${lic.sector}` : ""}</div></div><div style={{ textAlign: "right", flexShrink: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{lic.monto}</div><div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{lic.fecha}</div></div></div></Card>); })}</div>); })}
        </div>
        {showNew && (<Sheet title="Nueva licitación" onClose={() => setShowNew(false)}><Field label="Nombre"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Refacción Terminal B" /></Field><FieldRow><Field label="Aeropuerto"><Sel value={form.ap} onChange={e => setForm(p => ({ ...p, ap: e.target.value }))}>{AIRPORTS.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</Sel></Field><Field label="Estado"><Sel value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>{LIC_ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</Sel></Field></FieldRow><FieldRow><Field label="Monto"><MontoInput value={form.monto} onChange={v => setForm(p => ({ ...p, monto: v }))} placeholder="0 $" /></Field><Field label="Sector"><TInput value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} placeholder="Terminal A" /></Field></FieldRow><Field label="Fecha"><TInput value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} placeholder="dd/mm/aa" /></Field><div style={{ marginBottom: 14 }}><Lbl>Documentos</Lbl><DocGrid docs={form.docs} onUpload={handleNewDoc} onRemove={did => setForm(f => ({ ...f, docs: { ...f.docs, [did]: null } }))} refs={newDocRefs} prefix="new" /></div><PBtn full onClick={add} disabled={!form.nombre.trim()}>Crear licitación</PBtn></Sheet>)}
        {detail && (<Sheet title={detail.nombre} onClose={() => setShowDetail(null)}>
            <Field label="Nombre">
                <TInput value={detail.nombre} onChange={e => setLics(p => p.map(l => l.id === detail.id ? { ...l, nombre: e.target.value } : l))} placeholder="Nombre de la licitación" />
            </Field>
            <FieldRow>
                <Field label="Aeropuerto">
                    <Sel value={detail.ap} onChange={e => setLics(p => p.map(l => l.id === detail.id ? { ...l, ap: e.target.value } : l))}>
                        {AIRPORTS.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name}</option>)}
                    </Sel>
                </Field>
                <Field label="Monto">
                    <MontoInput value={detail.monto || ''} onChange={v => setLics(p => p.map(l => l.id === detail.id ? { ...l, monto: v } : l))} placeholder="0 $" />
                </Field>
            </FieldRow>
            <FieldRow>
                <Field label="Sector">
                    <TInput value={detail.sector || ''} onChange={e => setLics(p => p.map(l => l.id === detail.id ? { ...l, sector: e.target.value } : l))} placeholder="Terminal A" />
                </Field>
                <Field label="Fecha">
                    <TInput value={detail.fecha || ''} onChange={e => setLics(p => p.map(l => l.id === detail.id ? { ...l, fecha: e.target.value } : l))} placeholder="dd/mm/aa" />
                </Field>
            </FieldRow>
            <div style={{ marginBottom: 16 }}><Lbl>Documentos</Lbl><DocGrid docs={detail.docs || {}} onUpload={(did, file) => handleDoc(detail.id, did, file)} onRemove={did => setLics(p => p.map(l => l.id === detail.id ? { ...l, docs: { ...(l.docs || {}), [did]: null } } : l))} refs={docRefs} prefix={`det_${detail.id}`} /></div>
            <Field label="Estado">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {LIC_ESTADOS.map(e => (<button key={e.id} onClick={() => cambiarEstado(detail.id, e.id)} style={{ padding: "7px 4px", borderRadius: T.rsm, border: `1.5px solid ${detail.estado === e.id ? e.color : T.border}`, background: detail.estado === e.id ? e.bg : T.card, color: e.color, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{e.label}</button>))}
                </div>
            </Field>
            {(detail.estado === "adjudicada" || detail.estado === "curso") && (() => { const obraVinc = obras.find(o => o.lic_id === detail.id); return obraVinc ? (
                <div style={{ background: "#ECFDF5", border: "1px solid #86EFAC", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#10B981"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#15803D" }}>✅ Obra creada automáticamente</div><div style={{ fontSize: 11, color: "#166534", marginTop: 1 }}>{obraVinc.nombre} — En Curso ({obraVinc.avance}%)</div></div>
                </div>
            ) : (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ fontSize: 12, color: "#92400E", fontWeight: 600 }}>⚠ Sin obra vinculada</div>
                    <button onClick={() => autoCrearObra(detail)} style={{ background: "#F59E0B", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Crear obra ahora</button>
                </div>
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

    function toggleSel(id) { setSelFotos(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }

    async function analizarFotos() {
        if (!apiKey) { setInforme('⚠ Configurá tu API Key en Más → Configuración para usar esta función.'); return; }
        const fotosAAnalizar = selFotos.length > 0 ? fotos.filter(f => selFotos.includes(f.id)) : fotos.slice(-8);
        if (!fotosAAnalizar.length) { setInforme('Agregá al menos una foto para analizar.'); return; }
        setLoadingIA(true); setInforme('');
        try {
            const content = [];
            fotosAAnalizar.forEach(f => {
                try { content.push({ type: 'image', source: { type: 'base64', media_type: getMediaType(f.url), data: getBase64(f.url) } }); } catch { }
            });
            content.push({
                type: 'text', text: `Analizá estas ${fotosAAnalizar.length} fotos de la obra "${detail.nombre}" (${detail.sector || '—'}, avance declarado: ${detail.avance}%).

Generá un informe profesional AA2000 con:
1. **Estado general de la obra** — describí lo que se ve en las fotos
2. **Avance estimado** — ¿coincide con el ${detail.avance}% declarado?
3. **Trabajos en ejecución** — qué trabajos se observan
4. **Correcciones y recomendaciones** — anomalías, riesgos, trabajos incorrectos o mejorables
5. **Alertas de seguridad** — EPP, orden, señalización
6. **Conclusión** — estado global y próximos pasos sugeridos

Usá un tono técnico y profesional. Respondé en español rioplatense.`});

            const r = await callAI([{ role: 'user', content }],
                `Sos un inspector de obras aeroportuarias para AA2000. Analizás fotos y generás informes técnicos precisos y profesionales en español rioplatense.`,
                apiKey);
            setInforme(r);
            // Guardar el informe generado dentro de la obra
            const nuevoInf = { id: uid(), titulo: `Análisis IA — ${new Date().toLocaleDateString('es-AR')}`, tipo: 'diario', fecha: new Date().toLocaleDateString('es-AR'), notas: 'Generado automáticamente por IA a partir de fotos', nombre: 'informe_ia.txt', ext: 'IA', url: 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(r))), size: '—', cargado: new Date().toLocaleDateString('es-AR') };
            upd(detail.id, { informes: [nuevoInf, ...(detail.informes || [])] });
        } catch (e) { setInforme('Error al analizar: ' + e.message); }
        setLoadingIA(false); setModoSel(false); setSelFotos([]);
    }

    return (<div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFoto} style={{ display: "none" }} />

        {/* Barra de acciones */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <PBtn onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: "11px 0", fontSize: 13 }}>{t(cfg, 'obras_agregar_fotos')}</PBtn>
            {fotos.length > 0 && <button onClick={() => { setModoSel(v => !v); setSelFotos([]); }} style={{ background: modoSel ? T.accent : T.accentLight, border: `1.5px solid ${T.accent}`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 12, fontWeight: 700, color: modoSel ? "#fff" : T.accent, cursor: "pointer", flexShrink: 0 }}>
                {modoSel ? "Cancelar" : "Seleccionar"}
            </button>}
        </div>

        {/* Botón analizar */}
        {fotos.length > 0 && (<button onClick={analizarFotos} disabled={loadingIA} style={{ width: "100%", background: loadingIA ? "#94A3B8" : T.navy, border: "none", borderRadius: T.rsm, padding: "13px", marginBottom: 14, cursor: loadingIA ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#fff", fontSize: 13, fontWeight: 700 }}>
            {loadingIA
                ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Analizando fotos con IA…</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" clipRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" /></svg>{modoSel && selFotos.length > 0 ? `Analizar ${selFotos.length} foto${selFotos.length > 1 ? 's' : ''} seleccionada${selFotos.length > 1 ? 's' : ''}` : "Analizar fotos con IA"}</>}
        </button>)}

        {modoSel && <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginBottom: 10 }}>{selFotos.length === 0 ? "Tocá las fotos que querés analizar" : "" + selFotos.length + " seleccionada" + (selFotos.length > 1 ? "s" : "") + ` · o analizá las ${Math.min(fotos.length, 8)} más recientes`}</div>}

        {/* Grilla de fotos */}
        {fotos.length === 0
            ? <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: 13 }}>{t(cfg, 'obras_sin_fotos')}</div>
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: informe ? 14 : 0 }}>
                {fotos.map(f => {
                    const sel = selFotos.includes(f.id); return (<div key={f.id} onClick={() => modoSel && toggleSel(f.id)} style={{ borderRadius: T.rsm, overflow: "hidden", border: `2px solid ${sel ? "#10B981" : T.border}`, cursor: modoSel ? "pointer" : "default", position: "relative" }}>
                        {sel && <div style={{ position: "absolute", top: 5, right: 5, width: 20, height: 20, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg></div>}
                        <img src={f.url} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", opacity: modoSel && !sel ? .6 : 1, transition: "opacity .2s" }} />
                        <div style={{ padding: "5px 8px", fontSize: 9, color: T.muted, background: T.card }}>{f.fecha}</div>
                        <button onClick={e => { e.stopPropagation(); upd(detail.id, { fotos: fotos.filter(x => x.id !== f.id) }); }} style={{ position: "absolute", top: 5, left: 5, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.5)", border: "none", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>✕</button>
                    </div>);
                })}
            </div>}

        {/* Informe generado */}
        {informe && (<Card style={{ padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} /><span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Informe IA generado</span></div>
                <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { try { navigator.clipboard.writeText(informe); } catch { } }} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 7, padding: "4px 10px", fontSize: 11, color: T.sub, cursor: "pointer" }}>📋 Copiar</button>
                    <button onClick={() => { const b = new Blob([informe], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `informe_${detail.nombre}_${new Date().toLocaleDateString('es-AR')}.txt`; a.click(); }} style={{ background: T.navy, border: "none", borderRadius: 7, padding: "4px 10px", fontSize: 11, color: "#fff", cursor: "pointer" }}>⬇ Descargar</button>
                    <button onClick={() => setInforme('')} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 7, padding: "4px 8px", fontSize: 11, color: "#EF4444", cursor: "pointer" }}>✕</button>
                </div>
            </div>
            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "12px 14px", fontSize: 12, color: T.text, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 320, overflowY: "auto" }}>{informe}</div>
            <div style={{ fontSize: 10, color: "#10B981", marginTop: 8, fontWeight: 600 }}>✓ Guardado automáticamente en la pestaña Informes</div>
        </Card>)}
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
            {TIPOS_INF.map(tipo => (<button key={tipo.id} onClick={() => setSubTab(tipo.id)} style={{ flex: 1, padding: "8px 4px", borderRadius: 20, border: `1.5px solid ${subTab === tipo.id ? tipo.color : T.border}`, background: subTab === tipo.id ? tipo.bg : T.card, color: tipo.color, fontSize: 11, fontWeight: subTab === tipo.id ? 700 : 500, cursor: "pointer" }}>{tipo.label} ({informes.filter(i => i.tipo === tipo.id).length})</button>))}
        </div>

        {/* Botón subir */}
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png" multiple onChange={handleFile} style={{ display: "none" }} />
        <button onClick={() => setShowNew(true)} style={{ width: "100%", background: tp?.bg, border: `1.5px dashed ${tp?.color}`, borderRadius: T.rsm, padding: "12px", marginBottom: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 18, color: tp?.color }}>+</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: tp?.color }}>Subir informe {tp?.label}</span>
        </button>

        {/* Lista */}
        {filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "28px 0", color: T.muted, fontSize: 12 }}>Sin informes {tp?.label?.toLowerCase()}s cargados</div>
            : filtered.map(inf => (<div key={inf.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "11px 13px", marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: tp?.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: tp?.color }}>{inf.ext}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inf.titulo}</div>
                    <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{inf.fecha} · {inf.size}</div>
                    {inf.notas && <div style={{ fontSize: 10, color: T.sub, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inf.notas}</div>}
                </div>
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                    <a href={inf.url} download={inf.nombre} style={{ textDecoration: "none" }}>
                        <button style={{ background: T.accentLight, border: `1px solid ${T.border}`, borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.accent, fontSize: 12 }}>↓</button>
                    </a>
                    <button onClick={() => upd(detail.id, { informes: informes.filter(x => x.id !== inf.id) })} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 7, width: 30, height: 30, cursor: "pointer", color: "#EF4444", fontSize: 12 }}>✕</button>
                </div>
            </div>))}

        {/* Sheet nuevo informe */}
        {showNew && (<Sheet title={`Subir informe ${tp?.label}`} onClose={() => setShowNew(false)}>
            <Field label="Título (opcional)">
                <TInput value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder={`Informe ${tp?.label?.toLowerCase()} ${new Date().toLocaleDateString('es-AR')}`} />
            </Field>
            <FieldRow>
                <Field label="Tipo">
                    <Sel value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                        {TIPOS_INF.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </Sel>
                </Field>
                <Field label="Fecha">
                    <TInput value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} placeholder="dd/mm/aa" />
                </Field>
            </FieldRow>
            <Field label="Notas">
                <textarea value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Observaciones..." rows={3} style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "10px 12px", fontSize: 13, color: T.text, resize: "none" }} />
            </Field>
            <PBtn full onClick={() => fileRef.current?.click()}>📎 Seleccionar archivo</PBtn>
            <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 8 }}>PDF · DOC · DOCX · XLSX · JPG · PNG</div>
        </Sheet>)}
    </div>);
}

function Obras({ obras, setObras, lics, detailId, setDetailId, requireAuth, cfg, apiKey }) {
    const UBICS = getUbics(cfg); const LUBIC = getLabelUbic(cfg);
    const [showNew, setShowNew] = useState(false); const [tab, setTab] = useState("info");
    const [form, setForm] = useState({ nombre: "", ap: "aep", sector: "", estado: "pendiente", avance: 0, inicio: "", cierre: "" });
    const [newObs, setNewObs] = useState(""); const fileRef = useRef(null); const archRef = useRef(null);
    const detail = detailId ? obras.find(o => o.id === detailId) : null;
    function add() { if (!form.nombre.trim()) return; setObras(p => [...p, { ...form, id: uid(), avance: parseInt(form.avance) || 0, pagado: 0, obs: [], fotos: [], archivos: [], informes: [], docs: {} }]); setForm({ nombre: "", ap: "aep", sector: "", estado: "pendiente", avance: 0, inicio: "", cierre: "" }); setShowNew(false); }
    function upd(id, patch) { setObras(p => p.map(o => o.id === id ? { ...o, ...patch } : o)); }
    async function handleFoto(e) {
        if (!detail) return;
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const nuevas = await Promise.all(files.map(async f => ({ id: uid(), url: await toDataUrl(f), nombre: f.name, fecha: new Date().toLocaleDateString("es-AR") })));
        upd(detail.id, { fotos: [...(detail.fotos || []), ...nuevas] });
        e.target.value = "";
    }
    async function handleArch(e) { if (!detail) return; for (const f of Array.from(e.target.files)) { const url = await toDataUrl(f); upd(detail.id, { archivos: [...detail.archivos, { id: uid(), url, nombre: f.name, ext: f.name.split(".").pop().toUpperCase(), fecha: new Date().toLocaleDateString("es-AR") }] }); } e.target.value = ""; }
    const ec = id => OBRA_ESTADOS.find(e => e.id === id) || OBRA_ESTADOS[0];
    if (detail) {
        const e = ec(detail.estado); return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <AppHeader title={detail.nombre} sub={`${UBICS.find(a => a.id === detail.ap)?.code || detail.ap} · ${detail.sector || t(cfg, 'obras_sector')}`} back onBack={() => setDetailId(null)} right={<Badge color={e.color} bg={e.bg}>{e.label}</Badge>} />
                <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "12px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{t(cfg, 'obras_avance')}</span><span style={{ fontSize: 14, fontWeight: 800, color: T.accent }}>{detail.avance}%</span></div>
                    <div style={{ height: 8, background: T.bg, borderRadius: 4 }}><div style={{ height: 8, background: T.accent, borderRadius: 4, width: `${detail.avance}%`, transition: "width .5s" }} /></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}><span style={{ fontSize: 11, color: T.muted }}>{t(cfg, 'obras_inicio')}: {detail.inicio || "—"}</span><span style={{ fontSize: 11, color: T.muted }}>{t(cfg, 'obras_cierre')}: {detail.cierre || "—"}</span></div>
                    <input type="range" min="0" max="100" value={detail.avance} onChange={e => upd(detail.id, { avance: parseInt(e.target.value) })} style={{ width: "100%", accentColor: "var(--accent,#1D4ED8)", marginTop: 10 }} />
                </div>
                <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, display: "flex", overflowX: "auto" }}>{[[`info`, t(cfg, 'obras_info')], [`obs`, t(cfg, 'obras_notas')], [`fotos`, t(cfg, 'obras_fotos')], [`archivos`, t(cfg, 'obras_archivos')], [`informes`, 'Informes']].map(([id, label]) => (<button key={id} onClick={() => setTab(id)} style={{ flex: 1, minWidth: 52, padding: "10px 4px", background: "none", border: "none", fontSize: 11, fontWeight: tab === id ? 700 : 500, color: tab === id ? T.accent : T.muted, borderBottom: `2px solid ${tab === id ? "var(--accent,#1D4ED8)" : "transparent"}`, whiteSpace: "nowrap" }}>{label}</button>))}</div>
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
                    {tab === "info" && (<div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>{getLabelUbic(cfg)}</div>
                                <select value={detail.ap} onChange={e => upd(detail.id, { ap: e.target.value })} style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0, cursor: "pointer" }}>
                                    {UBICS.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name}</option>)}
                                </select>
                            </div>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>{t(cfg, 'obras_sector')}</div>
                                <input value={detail.sector || ''} onChange={e => upd(detail.id, { sector: e.target.value })} placeholder="Sin sector" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0 }} />
                            </div>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>{t(cfg, 'obras_inicio')}</div>
                                <input value={detail.inicio || ''} onChange={e => upd(detail.id, { inicio: e.target.value })} placeholder="dd/mm/aa" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0 }} />
                            </div>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>{t(cfg, 'obras_cierre')}</div>
                                <input value={detail.cierre || ''} onChange={e => upd(detail.id, { cierre: e.target.value })} placeholder="dd/mm/aa" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0 }} />
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                            <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>Presupuesto</div>
                                <input value={detail.monto || ''} onChange={e => upd(detail.id, { monto: e.target.value })} placeholder="$ 0" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: T.text, padding: 0 }} />
                            </div>
                            <div style={{ background: detail.pagado > 0 ? "#ECFDF5" : T.bg, borderRadius: T.rsm, padding: "10px 12px" }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 5, textTransform: "uppercase" }}>💰 Pagado</div>
                                <input value={detail.pagado || ''} onChange={e => { const v = e.target.value.replace(/[^0-9.]/g,''); upd(detail.id, { pagado: v ? parseFloat(v) : 0 }); }} placeholder="$ 0" style={{ width: "100%", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: "#10B981", padding: 0 }} />
                            </div>
                        </div>
                        {(detail.monto || detail.pagado > 0) && (() => {
                            const total = parseFloat(String(detail.monto || '0').replace(/[^0-9.]/g,'')) || 0;
                            const pagado = parseFloat(detail.pagado || 0);
                            const saldo = total - pagado;
                            const pct = total > 0 ? Math.round(pagado / total * 100) : 0;
                            return total > 0 ? (
                                <div style={{ background: pct > 80 ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${pct > 80 ? "#FECACA" : "#86EFAC"}`, borderRadius: T.rsm, padding: "10px 12px", marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: 11, color: T.muted }}>Presupuesto consumido</span>
                                        <span style={{ fontSize: 12, fontWeight: 800, color: pct > 80 ? "#EF4444" : "#10B981" }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: 6, background: "#E2E8F0", borderRadius: 3, marginBottom: 8 }}>
                                        <div style={{ height: 6, background: pct > 80 ? "#EF4444" : "#10B981", borderRadius: 3, width: `${Math.min(pct,100)}%`, transition: "width .5s" }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                                        <span style={{ color: T.muted }}>Pagado: <b style={{ color: "#10B981" }}>${pagado.toLocaleString('es-AR')}</b></span>
                                        <span style={{ color: T.muted }}>Saldo: <b style={{ color: saldo < 0 ? "#EF4444" : T.text }}>${saldo.toLocaleString('es-AR')}</b></span>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                        <Lbl>{t(cfg, 'obras_estado')}</Lbl>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>{OBRA_ESTADOS.map(e => (<button key={e.id} onClick={() => upd(detail.id, { estado: e.id })} style={{ padding: "9px", borderRadius: T.rsm, border: `1.5px solid ${detail.estado === e.id ? e.color : T.border}`, background: detail.estado === e.id ? e.bg : T.card, color: e.color, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{e.label}</button>))}</div>
                        <button onClick={() => { setObras(p => p.filter(o => o.id !== detail.id)); setDetailId(null); }} style={{ width: "100%", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm, padding: "9px", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>{t(cfg, 'obras_eliminar')}</button>
                    </div>)}
                    {tab === "obs" && (<div><div style={{ display: "flex", gap: 8, marginBottom: 14 }}><TInput value={newObs} onChange={e => setNewObs(e.target.value)} placeholder={t(cfg, 'obras_obs_placeholder')} /><PBtn onClick={() => { if (!newObs.trim()) return; const tx = newObs; setNewObs(""); upd(detail.id, { obs: [...detail.obs, { id: uid(), txt: tx, fecha: new Date().toLocaleDateString("es-AR") }] }); }} disabled={!newObs.trim()} style={{ padding: "11px 16px", flexShrink: 0 }}>+</PBtn></div>{[...detail.obs].reverse().map(o => (<Card key={o.id} style={{ padding: "12px 14px", marginBottom: 8 }}><div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{o.txt}</div><div style={{ fontSize: 10, color: T.muted, marginTop: 6 }}>{o.fecha}</div></Card>))}{detail.obs.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: 13 }}>{t(cfg, 'obras_sin_notas')}</div>}</div>)}
                    {tab === "fotos" && (<TabFotos detail={detail} upd={upd} fileRef={fileRef} handleFoto={handleFoto} apiKey={apiKey} cfg={cfg} />)}
                    {tab === "archivos" && (<div><input ref={archRef} type="file" accept=".pdf,.xlsx,.xls,.docx,.doc" multiple onChange={handleArch} style={{ display: "none" }} /><PBtn full onClick={() => archRef.current?.click()} style={{ marginBottom: 14 }}>{t(cfg, 'obras_agregar_arch')}</PBtn>{detail.archivos.map(f => (<div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "11px 13px", marginBottom: 7 }}><div style={{ width: 36, height: 36, borderRadius: 8, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 9, fontWeight: 700, color: T.accent }}>{f.ext}</span></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.nombre}</div><div style={{ fontSize: 10, color: T.muted }}>{f.fecha}</div></div><a href={f.url} download={f.nombre} style={{ textDecoration: "none" }}><button style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, width: 30, height: 30, fontSize: 13, color: T.sub, cursor: "pointer" }}>↓</button></a></div>))}{detail.archivos.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: T.muted, fontSize: 13 }}>{t(cfg, 'obras_sin_archivos')}</div>}</div>)}
                    {tab === "informes" && <TabInformes detail={detail} upd={upd} />}
                </div>
            </div>
        );
    }
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title={t(cfg, 'obras_titulo')} sub={`${obras.length} registros`} right={<PlusBtn onClick={() => requireAuth(() => setShowNew(true), t(cfg, 'obras_nueva'))} />} />
        <div style={{ padding: "14px 18px" }}>{OBRA_ESTADOS.map(est => { const items = obras.filter(o => o.estado === est.id); if (!items.length) return null; return (<div key={est.id} style={{ marginBottom: 16 }}><div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: est.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: est.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{est.label}</span><span style={{ fontSize: 11, color: T.muted }}>({items.length})</span></div>{items.map(o => (<Card key={o.id} onClick={() => setDetailId(o.id)} style={{ padding: "13px 14px", marginBottom: 7, cursor: "pointer" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{o.nombre}</div><span style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{o.avance}%</span></div><div style={{ height: 4, background: T.bg, borderRadius: 4, marginBottom: 6 }}><div style={{ height: 4, background: T.accent, borderRadius: 4, width: `${o.avance}%` }} /></div><div style={{ fontSize: 11, color: T.muted }}>{UBICS.find(a => a.id === o.ap)?.code || o.ap} · {o.sector || "Sin sector"} · {o.cierre || "—"}</div></Card>))}</div>); })}    </div>
        {showNew && (<Sheet title={t(cfg, 'obras_nueva')} onClose={() => setShowNew(false)}><Field label={t(cfg, 'obras_titulo')}><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Refacción Terminal B" /></Field><FieldRow><Field label={getLabelUbic(cfg)}><Sel value={form.ap} onChange={e => setForm(p => ({ ...p, ap: e.target.value }))}>{UBICS.map(a => <option key={a.id} value={a.id}>{a.code} – {a.name}</option>)}</Sel></Field><Field label={t(cfg, 'obras_estado')}><Sel value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>{OBRA_ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</Sel></Field></FieldRow><FieldRow><Field label={t(cfg, 'obras_sector')}><TInput value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} placeholder="Sector A" /></Field><Field label={`${t(cfg, 'obras_avance')} %`}><TInput type="number" value={form.avance} onChange={e => setForm(p => ({ ...p, avance: e.target.value }))} placeholder="0" /></Field></FieldRow><FieldRow><Field label={t(cfg, 'obras_inicio')}><TInput value={form.inicio} onChange={e => setForm(p => ({ ...p, inicio: e.target.value }))} placeholder="dd/mm/aa" /></Field><Field label={t(cfg, 'obras_cierre')}><TInput value={form.cierre} onChange={e => setForm(p => ({ ...p, cierre: e.target.value }))} placeholder="dd/mm/aa" /></Field></FieldRow><PBtn full onClick={add} disabled={!form.nombre.trim()}>{t(cfg, 'obras_nueva')}</PBtn></Sheet>)}
    </div>);
}

function Personal({ personal, setPersonal, obras, cfg }) {
    const [showNew, setShowNew] = useState(false); const [expanded, setExpanded] = useState(null);
    const [form, setForm] = useState({ nombre: "", rol: "Técnico", empresa: "BelfastCM", obra_id: "", telefono: "", foto: "", tareas: [] });
    const fileRefs = useRef({}); const fotoRefs = useRef({}); const newFotoRef = useRef(null);
    const [nuevaTarea, setNuevaTarea] = useState({});
    function ini(n) { return n.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase(); }
    function add() { if (!form.nombre.trim()) return; setPersonal(p => [...p, { ...form, id: uid(), docs: {} }]); setForm({ nombre: "", rol: "Técnico", empresa: "BelfastCM", obra_id: "", telefono: "", foto: "", tareas: [] }); setShowNew(false); }
    function upd(id, patch) { setPersonal(p => p.map(x => x.id === id ? { ...x, ...patch } : x)); }
    async function handleDoc(pid, did, file) { const url = await toDataUrl(file); setPersonal(p => p.map(x => x.id === pid ? { ...x, docs: { ...x.docs, [did]: { nombre: file.name, url, vence: "" } } } : x)); }
    function setVence(pid, did, val) { setPersonal(p => p.map(x => x.id === pid ? { ...x, docs: { ...x.docs, [did]: { ...x.docs[did], vence: val } } } : x)); }
    const Av = ({ p, size = 38, showCam = false, onClick }) => (<div onClick={onClick} style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, position: "relative", overflow: "hidden", background: p.foto ? "transparent" : T.accentLight, border: `1.5px solid ${T.border}`, cursor: onClick ? "pointer" : "default" }}>{p.foto ? <img src={p.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .32, fontWeight: 700, color: T.accent }}>{ini(p.nombre)}</div>}{showCam && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.45)", padding: "4px 0", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 8, fontWeight: 600 }}>📷</span></div>}</div>);
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title={t(cfg, 'pers_titulo')} sub={`${personal.length} trabajadores`} right={<PlusBtn onClick={() => setShowNew(true)} />} />
        <div style={{ padding: "14px 18px" }}>
            {personal.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: T.muted, fontSize: 14 }}>{t(cfg, 'pers_sin_personal')}</div>}
            {personal.map(p => {
                const docsOk = Object.values(p.docs || {}).filter(Boolean).length; const isOpen = expanded === p.id; const obraAsig = obras.find(o => o.id === p.obra_id); return (<Card key={p.id} style={{ marginBottom: 10, overflow: "hidden" }}>
                    <div onClick={() => setExpanded(isOpen ? null : p.id)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", cursor: "pointer" }}>
                        <Av p={p} size={40} />
                        <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{p.nombre}</div><div style={{ fontSize: 11, color: T.muted }}>{p.rol}{obraAsig ? ` · ${obraAsig.nombre}` : ""}</div></div>
                        <div style={{ display: "flex", gap: 3, marginRight: 4 }}>{DOC_TYPES.map(d => { const doc = p.docs?.[d.id]; const exp = doc?.vence && daysSince(doc.vence) <= 5; return <div key={d.id} style={{ width: 7, height: 7, borderRadius: "50%", background: exp ? "#F59E0B" : doc ? "#22c55e" : T.border }} />; })}</div>
                        <span style={{ fontSize: 11, color: T.muted }}>{docsOk}/{DOC_TYPES.length}</span>
                        <span style={{ fontSize: 14, color: T.muted, marginLeft: 2 }}>{isOpen ? "⌃" : "⌄"}</span>
                    </div>
                    {isOpen && (<div style={{ padding: "0 14px 14px", borderTop: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", gap: 14, marginTop: 14, marginBottom: 16, alignItems: "flex-start" }}>
                            <div style={{ flexShrink: 0 }}><input type="file" accept="image/*" style={{ display: "none" }} ref={el => fotoRefs.current[p.id] = el} onChange={async e => { if (e.target.files[0]) upd(p.id, { foto: await toDataUrl(e.target.files[0]) }); e.target.value = ""; }} /><Av p={p} size={76} showCam onClick={() => fotoRefs.current[p.id]?.click()} /></div>
                            <div style={{ flex: 1 }}><Lbl>WhatsApp</Lbl><div style={{ display: "flex", gap: 6 }}><input type="tel" value={p.telefono || ""} onChange={e => upd(p.id, { telefono: e.target.value.replace(/\D/g, '') })} placeholder="5491155556666" style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "9px 12px", fontSize: 13, color: T.text }} />{p.telefono && <a href={`https://wa.me/${p.telefono}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><button style={{ background: "#25D366", border: "none", borderRadius: 9, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: 14 }}>💬</button></a>}</div></div>
                        </div>
                        <Lbl>Documentación</Lbl>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, margin: "6px 0 12px" }}>
                            {DOC_TYPES.map(d => { const doc = p.docs?.[d.id]; const rk = `${p.id}_${d.id}`; const exp = doc?.vence && daysSince(doc.vence) <= 5; return (<div key={d.id}><input type="file" style={{ display: "none" }} ref={el => fileRefs.current[rk] = el} onChange={e => { if (e.target.files[0]) handleDoc(p.id, d.id, e.target.files[0]); e.target.value = ""; }} />{doc ? (<div style={{ background: exp ? "#FFFBEB" : "#F0FDF4", border: `1.5px solid ${exp ? "#FDE68A" : "#86EFAC"}`, borderRadius: 10, padding: "9px 10px" }}><div style={{ fontSize: 10, fontWeight: 700, color: exp ? "#92400E" : "#15803D", marginBottom: 2 }}>{d.label}</div><div style={{ fontSize: 10, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>{doc.nombre}</div>{d.acceptsExp && <input type="text" placeholder="Vence dd/mm/aa" value={doc.vence || ""} onChange={e => setVence(p.id, d.id, e.target.value)} style={{ width: "100%", fontSize: 10, padding: "4px 6px", border: `1px solid ${T.border}`, borderRadius: 6, background: "#fff", color: T.text, marginBottom: 6 }} />}<div style={{ display: "flex", gap: 4 }}><a href={doc.url} download={doc.nombre} style={{ textDecoration: "none", flex: 1 }}><button style={{ width: "100%", background: "none", border: `1px solid ${exp ? "#FDE68A" : "#86EFAC"}`, borderRadius: 6, padding: "4px 0", fontSize: 9, color: exp ? "#92400E" : "#15803D", fontWeight: 600, cursor: "pointer" }}>↓ Ver</button></a><button onClick={() => setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, docs: { ...x.docs, [d.id]: null } } : x))} style={{ background: "none", border: "1px solid #FCA5A5", borderRadius: 6, padding: "4px 7px", fontSize: 9, color: "#EF4444", cursor: "pointer" }}>✕</button></div></div>) : (<button onClick={() => fileRefs.current[rk]?.click()} style={{ width: "100%", background: T.bg, border: `1.5px dashed ${T.border}`, borderRadius: 10, padding: "10px 6px", cursor: "pointer", textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 3 }}>{d.label.slice(0, 3).toUpperCase()}</div><div style={{ fontSize: 10, fontWeight: 600, color: T.sub }}>{d.label}</div></button>)}</div>); })}
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <Lbl>Tareas asignadas</Lbl>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8, marginTop: 4 }}>
                                <input
                                    value={nuevaTarea[p.id] || ''}
                                    onChange={e => setNuevaTarea(prev => ({ ...prev, [p.id]: e.target.value }))}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && nuevaTarea[p.id]?.trim()) {
                                            setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, tareas: [...(x.tareas || []), { id: uid(), txt: nuevaTarea[p.id].trim(), done: false, fecha: new Date().toLocaleDateString('es-AR') }] } : x));
                                            setNuevaTarea(prev => ({ ...prev, [p.id]: '' }));
                                        }
                                    }}
                                    placeholder="Nueva tarea..."
                                    style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: '8px 12px', fontSize: 12, color: T.text }}
                                />
                                <button onClick={() => {
                                    if (!nuevaTarea[p.id]?.trim()) return;
                                    setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, tareas: [...(x.tareas || []), { id: uid(), txt: nuevaTarea[p.id].trim(), done: false, fecha: new Date().toLocaleDateString('es-AR') }] } : x));
                                    setNuevaTarea(prev => ({ ...prev, [p.id]: '' }));
                                }} style={{ background: T.accent, border: 'none', borderRadius: T.rsm, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', flexShrink: 0 }}>+ Agregar</button>
                            </div>
                            {(p.tareas || []).length === 0 && <div style={{ fontSize: 12, color: T.muted, fontStyle: 'italic' }}>Sin tareas asignadas</div>}
                            {(p.tareas || []).map(t => (
                                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.done ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${t.done ? '#86EFAC' : '#FDE68A'}`, borderRadius: 8, padding: '7px 10px', marginBottom: 5 }}>
                                    <input type="checkbox" checked={t.done} onChange={() => setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, tareas: x.tareas.map(tk => tk.id === t.id ? { ...tk, done: !tk.done } : tk) } : x))} style={{ accentColor: T.accent, width: 15, height: 15, flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontSize: 12, color: T.text, textDecoration: t.done ? 'line-through' : 'none' }}>{t.txt}</span>
                                    <span style={{ fontSize: 10, color: T.muted }}>{t.fecha}</span>
                                    <button onClick={() => setPersonal(prev => prev.map(x => x.id === p.id ? { ...x, tareas: x.tareas.filter(tk => tk.id !== t.id) } : x))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 12, padding: 2 }}>✕</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { setPersonal(prev => prev.filter(x => x.id !== p.id)); if (expanded === p.id) setExpanded(null); }} style={{ width: "100%", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm, padding: "9px", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>{t(cfg, 'pers_eliminar')}</button>
                    </div>)}
                </Card>);
            })}
        </div>
        {showNew && (<Sheet title={t(cfg, 'pers_nuevo')} onClose={() => setShowNew(false)}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><input type="file" accept="image/*" ref={newFotoRef} style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); setForm(f => ({ ...f, foto: url })); } e.target.value = ""; }} /><div onClick={() => newFotoRef.current?.click()} style={{ width: 84, height: 84, borderRadius: "50%", cursor: "pointer", overflow: "hidden", background: form.foto ? "transparent" : T.bg, border: `2px dashed ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{form.foto ? <img src={form.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>📷</div><div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>Foto</div></div>}</div></div>
            <Field label={t(cfg, 'pers_nombre')}><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Juan García" /></Field>
            <FieldRow><Field label={t(cfg, 'pers_rol')}><Sel value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))}>{ROLES.map(r => <option key={r}>{r}</option>)}</Sel></Field><Field label={t(cfg, 'pers_empresa')}><TInput value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))} placeholder="BelfastCM" /></Field></FieldRow>
            <Field label={t(cfg, 'pers_whatsapp')}><TInput value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value.replace(/\D/g, '') }))} placeholder="5491155556666" /></Field>
            <Field label={t(cfg, 'pers_obra')}><Sel value={form.obra_id} onChange={e => setForm(p => ({ ...p, obra_id: e.target.value }))}><option value="">Sin asignar</option>{obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</Sel></Field>
            <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0369A1", marginBottom: 8 }}>🔑 Acceso a la app</div>
                <FieldRow>
                    <Field label="Usuario"><TInput value={form.appUser || ''} onChange={e => setForm(p => ({ ...p, appUser: e.target.value.toLowerCase().trim() }))} placeholder="usuario" autoCapitalize="none" /></Field>
                    <Field label="Contraseña"><TInput value={form.appPass || ''} onChange={e => setForm(p => ({ ...p, appPass: e.target.value }))} placeholder="••••••" /></Field>
                </FieldRow>
                <Field label="Panel"><Sel value={form.nivel || 'empleado'} onChange={e => setForm(p => ({ ...p, nivel: e.target.value }))}><option value="empleado">👷 Empleado (panel básico)</option><option value="directivo">👔 Directivo (panel completo)</option></Sel></Field>
            </div>
            <PBtn full onClick={add} disabled={!form.nombre.trim()}>{t(cfg, 'pers_agregar')}</PBtn>
        </Sheet>)}
    </div>);
}

function CargarView({ obras, setObras, cargarState, setCargarState, apiKey }) {
    const { obraId, newFotos, report } = cargarState;
    const [loading, setLoading] = useState(false);
    const camRef = useRef(null); const galRef = useRef(null);
    const setObraId = v => setCargarState(s => ({ ...s, obraId: v, newFotos: [], report: '' }));
    const setNewFotos = fn => setCargarState(s => ({ ...s, newFotos: typeof fn === 'function' ? fn(s.newFotos) : fn }));
    const setReport = v => setCargarState(s => ({ ...s, report: v }));
    const obra = obras.find(o => o.id === obraId); const prevFotos = obra?.fotos || [];
    async function handleFotos(e) { for (const f of Array.from(e.target.files)) { const url = await toDataUrl(f); setNewFotos(p => [...p, { id: uid(), url, nombre: f.name, fecha: new Date().toLocaleDateString('es-AR') }]); } e.target.value = ''; }
    async function generateReport() {
        if (!obra || !newFotos.length) return; setLoading(true); setReport('');
        try {
            const content = []; prevFotos.slice(-4).forEach(f => { try { content.push({ type: 'image', source: { type: 'base64', media_type: getMediaType(f.url), data: getBase64(f.url) } }); } catch { } }); newFotos.forEach(f => { try { content.push({ type: 'image', source: { type: 'base64', media_type: getMediaType(f.url), data: getBase64(f.url) } }); } catch { } });
            const pTxt = prevFotos.length > 0 ? `Las primeras ${Math.min(prevFotos.length, 4)} imágenes son ANTERIORES y las últimas ${newFotos.length} son ACTUALES. Comparalas.` : `Las ${newFotos.length} imágenes son del estado actual.`;
            content.push({ type: 'text', text: `Generá informe de avance para "${obra.nombre}" (${AIRPORTS.find(a => a.id === obra.ap)?.code}). Avance: ${obra.avance}%. ${pTxt} Incluí: estado general, trabajos observados, comparación, alertas de seguridad y recomendaciones. Formato profesional AA2000.` });
            let reportText = '';
            if (typeof window !== 'undefined' && window.claude?.complete) {
                const txtMsg = content.find(b => b.type === 'text');
                const nFotos = content.filter(b => b.type === 'image').length;
                reportText = await window.claude.complete(`${txtMsg?.text || 'Analizá estas fotos.'}

Analizá el estado de avance de esta obra basándote en la descripción. Generá un informe técnico profesional en español.`);
            } else {
                if (!apiKey) { setReport('⚠ Configurá tu API Key en Más → Configuración.'); setLoading(false); return; }
                const headers = { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true", "anthropic-version": "2023-06-01", "x-api-key": apiKey };
                const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content }] }) });
                const d = await r.json(); reportText = d.content?.map(b => b.text || '').join('') || d.error?.message || 'Error.';
            }
            setReport(reportText);
            setObras(p => p.map(o => o.id === obraId ? { ...o, fotos: [...o.fotos, ...newFotos] } : o)); setNewFotos([]);
        } catch { setReport('Error de conexión.'); } setLoading(false);
    }
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Registro de Avance" sub="Fotos + Informe IA" />
        <div style={{ padding: "14px 18px" }}>
            <Card style={{ padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: obraId ? T.accent : "#E2E8F0", color: obraId ? "#fff" : T.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>1</div><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Seleccioná la obra</span></div>
                <Sel value={obraId} onChange={e => setObraId(e.target.value)}><option value="">— Elegir obra —</option>{obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</Sel>
                {obra && <div style={{ marginTop: 10, background: T.accentLight, borderRadius: 10, padding: "10px 12px" }}><div style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{obra.nombre}</div><div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>Avance: {obra.avance}% · {prevFotos.length} fotos anteriores</div></div>}
            </Card>
            {obra && (<Card style={{ padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>2</div><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Cargá fotos nuevas</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <input ref={camRef} type="file" accept="image/*" capture="environment" multiple onChange={handleFotos} style={{ display: "none" }} />
                    <input ref={galRef} type="file" accept="image/*" multiple onChange={handleFotos} style={{ display: "none" }} />
                    <button onClick={() => camRef.current?.click()} style={{ background: "#111", border: "none", borderRadius: T.rsm, padding: "13px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <svg width="46" height="38" viewBox="0 0 92 76" fill="none"><rect x="2" y="18" width="88" height="56" rx="9" fill="#1e293b" /><rect x="26" y="5" width="34" height="17" rx="6" fill="#0f172a" /><rect x="60" y="7" width="18" height="11" rx="3" fill="#fef3c7" /><rect x="61" y="8" width="16" height="9" rx="2" fill="#fbbf24" /><circle cx="46" cy="50" r="23" fill="#0f172a" /><circle cx="46" cy="50" r="19" fill="#1d4ed8" /><circle cx="46" cy="50" r="14" fill="#1e40af" /><circle cx="46" cy="50" r="9" fill="#1e3a8a" /><circle cx="46" cy="50" r="5" fill="#172554" /><ellipse cx="37" cy="41" rx="5.5" ry="4" fill="rgba(255,255,255,.35)" /></svg>
                        Tomar foto
                    </button>
                    <button onClick={() => galRef.current?.click()} style={{ background: "#f8fafc", border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "13px", color: T.text, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <svg width="46" height="38" viewBox="0 0 92 76" fill="none"><rect x="3" y="6" width="58" height="50" rx="5" fill="#94a3b8" transform="rotate(-8 32 31)" /><rect x="12" y="14" width="68" height="58" rx="5" fill="white" /><rect x="12" y="14" width="68" height="34" rx="5" fill="#dbeafe" /><circle cx="73" cy="24" r="9" fill="#fcd34d" /><polygon points="12,72 26,46 40,72" fill="#93c5fd" /><polygon points="28,72 42,48 56,72" fill="#60a5fa" /><polygon points="44,72 58,50 72,72" fill="#3b82f6" /><rect x="12" y="14" width="68" height="58" rx="5" fill="none" stroke="#e2e8f0" strokeWidth="1" /></svg>
                        Galería / PC
                    </button>
                </div>
                {newFotos.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>{newFotos.map(f => (<div key={f.id} style={{ position: "relative", borderRadius: 9, overflow: "hidden", border: `1px solid ${T.border}` }}><img src={f.url} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} /><button onClick={() => setNewFotos(p => p.filter(x => x.id !== f.id))} style={{ position: "absolute", top: 3, right: 3, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.6)", border: "none", color: "#fff", fontSize: 11, cursor: "pointer" }}>×</button></div>))}</div>}
                {prevFotos.length > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 6, textTransform: "uppercase" }}>Anteriores ({prevFotos.length})</div><div style={{ display: "flex", gap: 6, overflowX: "auto" }}>{prevFotos.slice(-6).map(f => (<img key={f.id} src={f.url} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0, border: `1px solid ${T.border}`, opacity: .6 }} />))}</div></div>}
            </Card>)}
            {obra && (<Card style={{ padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>3</div><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Generar informe IA</span></div>
                <button onClick={generateReport} disabled={!newFotos.length || loading} style={{ width: "100%", background: newFotos.length && !loading ? T.accent : "#E2E8F0", border: "none", borderRadius: T.rsm, padding: "14px", fontSize: 14, fontWeight: 700, color: newFotos.length && !loading ? "#fff" : "#94A3B8", cursor: newFotos.length && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Analizando...</> : "Comparar y generar informe"}
                </button>
            </Card>)}
            {report && (<Card style={{ padding: "16px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>✅ Informe generado</span><button onClick={() => { try { navigator.clipboard.writeText(report); } catch { } }} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, color: T.sub, cursor: "pointer" }}>📋 Copiar</button></div><div style={{ background: T.bg, borderRadius: T.rsm, padding: "14px", fontSize: 12, color: T.text, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 280, overflowY: "auto" }}>{report}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}><button onClick={() => setObraId('')} style={{ background: T.accentLight, border: `1.5px solid ${T.accent}`, borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: T.accent, cursor: "pointer" }}>+ Nuevo</button><button onClick={() => { const b = new Blob([report], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `informe_${obra?.nombre || 'obra'}.txt`; a.click(); }} style={{ background: "#111", border: "none", borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>⬇ Descargar</button></div></Card>)}
            {!obra && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📸</div><div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>Registro Fotográfico</div><div style={{ fontSize: 12, color: T.muted }}>Seleccioná una obra para comenzar</div></div>}
        </div>
    </div>);
}

function PresupuestoView({ tipo, setView }) {
    const titulo = tipo === 'materiales' ? 'Presupuesto Materiales' : 'Subcontratos';
    const [items, setItems] = useState([]); const [showNew, setShowNew] = useState(false);
    const [form, setForm] = useState({ descripcion: '', proveedor: '', monto: '', obra: '', estado: 'pendiente' });
    const [loaded, setLoaded] = useState(false); const key = `bcm_presup_${tipo}`;
    useEffect(() => { (async () => { try { const r = await storage.get(key); if (r?.value) setItems(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []);
    useEffect(() => { if (loaded) storage.set(key, JSON.stringify(items)).catch(() => { }); }, [items, loaded]);
    const ESTADOS = [{ id: 'pendiente', label: 'Pendiente', color: '#F59E0B', bg: '#FFFBEB' }, { id: 'revision', label: 'En revisión', color: '#3B82F6', bg: '#EFF6FF' }, { id: 'aprobado', label: 'Aprobado', color: '#10B981', bg: '#ECFDF5' }, { id: 'rechazado', label: 'Rechazado', color: '#EF4444', bg: '#FEF2F2' }];
    const total = items.reduce((s, i) => { const n = parseFloat((i.monto || '').replace(/[^0-9.]/g, '')) || 0; return s + n; }, 0);
    function add() { if (!form.descripcion.trim()) return; setItems(p => [...p, { ...form, id: uid(), fecha: new Date().toLocaleDateString('es-AR') }]); setForm({ descripcion: '', proveedor: '', monto: '', obra: '', estado: 'pendiente' }); setShowNew(false); }
    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader title={titulo} back onBack={() => setView('dashboard')} sub={`${items.length} ítems`} right={<PlusBtn onClick={() => setShowNew(true)} />} />
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
            <Card style={{ padding: "16px", marginBottom: 14, background: T.navy, color: "#fff", border: "none" }}><div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total {tipo}</div><div style={{ fontSize: 26, fontWeight: 800 }}>${total.toLocaleString('es-AR')}</div></Card>
            {items.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Tocá + para agregar</div> : ESTADOS.map(est => { const ei = items.filter(i => i.estado === est.id); if (!ei.length) return null; return (<div key={est.id} style={{ marginBottom: 16 }}><div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: est.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: est.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{est.label}</span></div>{ei.map(item => (<Card key={item.id} style={{ padding: "13px 14px", marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><div style={{ flex: 1, paddingRight: 8 }}><div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.descripcion}</div>{item.proveedor && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{item.proveedor}{item.obra ? ` · ${item.obra}` : ""}</div>}</div><div style={{ fontSize: 14, fontWeight: 800, color: T.accent, flexShrink: 0 }}>{item.monto || "—"}</div></div><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{ESTADOS.map(e => (<button key={e.id} onClick={() => setItems(p => p.map(i => i.id === item.id ? { ...i, estado: e.id } : i))} style={{ padding: "3px 8px", borderRadius: 20, border: `1.5px solid ${item.estado === e.id ? e.color : T.border}`, background: item.estado === e.id ? e.bg : T.card, color: e.color, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>{e.label}</button>))} <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))} style={{ padding: "3px 8px", borderRadius: 20, border: "1px solid #FECACA", background: "#FEF2F2", color: "#EF4444", fontSize: 9, fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}>✕</button></div></Card>))}</div>); })}
        </div>
        {showNew && (<Sheet title={`Nuevo – ${titulo}`} onClose={() => setShowNew(false)}><Field label="Descripción"><TInput value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} placeholder={tipo === 'materiales' ? "Cemento Portland" : "Subcontrato pintura"} /></Field><FieldRow><Field label={tipo === 'materiales' ? "Proveedor" : "Empresa"}><TInput value={form.proveedor} onChange={e => setForm(p => ({ ...p, proveedor: e.target.value }))} placeholder="Holcim" /></Field><Field label="Monto"><MontoInput value={form.monto} onChange={v => setForm(p => ({ ...p, monto: v }))} placeholder="0 $" /></Field></FieldRow><Field label="Obra"><TInput value={form.obra} onChange={e => setForm(p => ({ ...p, obra: e.target.value }))} placeholder="Terminal A" /></Field><Field label="Estado"><Sel value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>{ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</Sel></Field><PBtn full onClick={add} disabled={!form.descripcion.trim()}>Agregar</PBtn></Sheet>)}
    </div>);
}

function PanelVigilancia({ setView }) {
    const [camaras, setCamaras] = useState([]); const [showNew, setShowNew] = useState(false);
    const [form, setForm] = useState({ nombre: '', url: '', sector: '', ap: 'aep', tipo: 'ip' }); const [loaded, setLoaded] = useState(false);
    useEffect(() => { (async () => { try { const r = await storage.get('bcm_camaras'); if (r?.value) setCamaras(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []);
    useEffect(() => { if (loaded) storage.set('bcm_camaras', JSON.stringify(camaras)).catch(() => { }); }, [camaras, loaded]);
    function add() { if (!form.nombre || !form.url) return; setCamaras(p => [...p, { ...form, id: uid() }]); setForm({ nombre: '', url: '', sector: '', ap: 'aep', tipo: 'ip' }); setShowNew(false); }
    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader title="Panel de Vigilancia" back onBack={() => setView("mas")} sub="Cámaras en vivo" right={<PlusBtn onClick={() => setShowNew(true)} />} />
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
            <div style={{ background: T.navy, borderRadius: 14, padding: "16px", marginBottom: 16, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulse 2s infinite" }} /><span style={{ fontSize: 13, fontWeight: 700 }}>Sistema activo</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>{[{ l: "Total", v: camaras.length }, { l: "AEP", v: camaras.filter(c => c.ap === "aep").length }, { l: "EZE", v: camaras.filter(c => c.ap === "eze").length }].map(k => (<div key={k.l} style={{ background: "rgba(255,255,255,.1)", borderRadius: 8, padding: "8px", textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800 }}>{k.v}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.6)", marginTop: 2 }}>{k.l}</div></div>))}</div>
            </div>
            {camaras.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Sin cámaras configuradas</div> : camaras.map(cam => (<Card key={cam.id} style={{ padding: "14px 16px", marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 46, height: 46, borderRadius: 10, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="15" height="12" rx="2" stroke="#60A5FA" strokeWidth="1.5" /><path d="M17 11l4-2v6l-4-2v-2z" stroke="#60A5FA" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="9.5" cy="13" r="1.5" fill="#22c55e" /></svg></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{cam.nombre}</div><div style={{ fontSize: 11, color: T.muted }}>{AIRPORTS.find(a => a.id === cam.ap)?.code} · {cam.sector || "—"} · {cam.tipo?.toUpperCase()}</div><div style={{ fontSize: 10, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cam.url}</div></div><div style={{ display: "flex", gap: 6, flexShrink: 0 }}><a href={cam.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><button style={{ background: T.accent, border: "none", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M10 14L21 3M21 13v8H3V5h8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button></a><button onClick={() => setCamaras(p => p.filter(c => c.id !== cam.id))} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "#EF4444", fontSize: 14 }}>✕</button></div></div></Card>))}
        </div>
        {showNew && (<Sheet title="Agregar cámara" onClose={() => setShowNew(false)}><Field label="Nombre"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Cámara Terminal A" /></Field><Field label="URL"><TInput value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="http://192.168.1.100:8080" /></Field><FieldRow><Field label="Aeropuerto"><Sel value={form.ap} onChange={e => setForm(p => ({ ...p, ap: e.target.value }))}>{AIRPORTS.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}</Sel></Field><Field label="Sistema"><Sel value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}><option value="ip">Cámara IP</option><option value="nvr">NVR Web</option><option value="hikvision">Hikvision</option><option value="dahua">Dahua</option><option value="otro">Otro</option></Sel></Field></FieldRow><Field label="Sector"><TInput value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} placeholder="Terminal A – Puerta 3" /></Field><PBtn full onClick={add} disabled={!form.nombre || !form.url}>Agregar cámara</PBtn></Sheet>)}
    </div>);
}

function Presentismo({ personal, setView }) {
    const [registros, setRegistros] = useState({}); const [scanning, setScanning] = useState(false); const [scanResult, setScanResult] = useState(null); const [bioLink, setBioLink] = useState(''); const [loaded, setLoaded] = useState(false);
    useEffect(() => { (async () => { try { const r = await storage.get('bcm_presentismo'); if (r?.value) { const d = JSON.parse(r.value); setRegistros(d.registros || {}); setBioLink(d.bioLink || ''); } } catch { } setLoaded(true); })(); }, []);
    useEffect(() => { if (loaded) storage.set('bcm_presentismo', JSON.stringify({ registros, bioLink })).catch(() => { }); }, [registros, bioLink, loaded]);
    const today = new Date().toLocaleDateString('es-AR');
    function simulateScan(persona) { if (scanning) return; setScanning(true); setScanResult(null); setTimeout(() => { const key = `${persona.id}_${today}`; const current = registros[key] || { entrada: null, salida: null, nombre: persona.nombre }; const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }); let result; if (!current.entrada) { setRegistros(r => ({ ...r, [key]: { ...current, entrada: hora } })); result = { tipo: 'entrada', hora, nombre: persona.nombre }; } else if (!current.salida) { setRegistros(r => ({ ...r, [key]: { ...current, salida: hora } })); result = { tipo: 'salida', hora, nombre: persona.nombre }; } else { result = { tipo: 'completo', nombre: persona.nombre }; } setScanResult(result); setScanning(false); }, 2200); }
    const todayRecords = Object.entries(registros).filter(([k]) => k.endsWith(today)).map(([, v]) => v);
    const FP = ({ active, ok }) => { const c = active ? 'var(--accent,#1D4ED8)' : ok ? '#10B981' : '#CBD5E1'; return (<svg width="70" height="70" viewBox="0 0 80 80" fill="none">{[4, 9, 15, 21, 27, 33].map((r, i) => (<ellipse key={i} cx="40" cy="41" rx={r} ry={r * .88} stroke={c} strokeWidth="2.2" fill="none" transform={i > 2 ? `rotate(${(i - 2) * -4} 40 41)` : undefined} />))}<circle cx="40" cy="41" r="2.5" fill={c} />{active && <rect x="12" y="39" width="56" height="2" fill={c} opacity=".7" rx="1" />}</svg>); };
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Control de Presentismo" back onBack={() => setView("mas")} sub="Biométrico · Asistencia" />
        <div style={{ padding: "14px 18px" }}>
            <Card style={{ padding: "14px 16px", marginBottom: 12 }}><Lbl>Sistema biométrico externo</Lbl><div style={{ display: "flex", gap: 8 }}><TInput value={bioLink} onChange={e => setBioLink(e.target.value)} placeholder="https://sistema-biometrico.com" />{bioLink && <a href={bioLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}><button style={{ background: T.navy, border: "none", borderRadius: T.rsm, padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>Abrir →</button></a>}</div></Card>
            <Card style={{ padding: "20px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Registro biométrico · {today}</div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><div style={{ width: 110, height: 110, borderRadius: 20, background: scanning ? T.accentLight : "#F8FAFC", border: `2px solid ${scanning ? T.accent : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}><FP active={scanning} ok={scanResult?.tipo === 'entrada' || scanResult?.tipo === 'salida'} />{scanning && <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,var(--accent,#1D4ED8),transparent)`, animation: "scanSweep 1.5s linear infinite", top: "50%" }} />}</div></div>
                {scanning && <div style={{ textAlign: "center", marginBottom: 12, fontSize: 13, color: T.accent, fontWeight: 600 }}>Leyendo huella digital…</div>}
                {scanResult && !scanning && (<div style={{ textAlign: "center", marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: scanResult.tipo === 'completo' ? "#FFFBEB" : "#ECFDF5", border: `1px solid ${scanResult.tipo === 'completo' ? "#FDE68A" : "#86EFAC"}`, fontSize: 13, fontWeight: 700, color: scanResult.tipo === 'completo' ? "#92400E" : "#15803D" }}>{scanResult.tipo === 'entrada' ? `✓ ${scanResult.nombre}: Entrada ${scanResult.hora}` : scanResult.tipo === 'salida' ? `✓ ${scanResult.nombre}: Salida ${scanResult.hora}` : `ℹ ${scanResult.nombre}: Jornada ya registrada`}</div>)}
                {personal.length === 0 ? <div style={{ textAlign: "center", color: T.muted, fontSize: 13 }}>Primero agregá personal</div> : (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{personal.map(p => { const key = `${p.id}_${today}`; const rec = registros[key]; const st = !rec?.entrada ? 'ausente' : !rec?.salida ? 'presente' : 'completo'; return (<button key={p.id} onClick={() => simulateScan(p)} disabled={scanning || st === 'completo'} style={{ background: st === 'presente' ? "#ECFDF5" : st === 'completo' ? "#F0FDF4" : T.bg, border: `1.5px solid ${st === 'presente' ? "#86EFAC" : st === 'completo' ? "#22c55e" : T.border}`, borderRadius: T.rsm, padding: "12px 8px", cursor: scanning || st === 'completo' ? "not-allowed" : "pointer" }}><div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 3 }}>{p.nombre.split(' ')[0]}</div><div style={{ fontSize: 10, color: T.muted, marginBottom: 5 }}>{p.rol}</div><div style={{ fontSize: 10, fontWeight: 700, color: st === 'ausente' ? "#94A3B8" : "#10B981" }}>{st === 'ausente' ? 'Sin registro' : st === 'presente' ? `E: ${rec.entrada}` : `${rec.entrada}–${rec.salida}`}</div></button>); })}</div>)}
            </Card>
            {todayRecords.length > 0 && (<Card style={{ padding: "14px 16px" }}><Lbl>Resumen hoy – {today}</Lbl>{todayRecords.map((r, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < todayRecords.length - 1 ? `1px solid ${T.border}` : "none" }}><span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{r.nombre}</span><span style={{ fontSize: 12, color: T.muted }}>{r.entrada}{r.salida ? ` – ${r.salida}` : " (en obra)"}</span></div>))}</Card>)}
        </div>
    </div>);
}

// ── INFORMES DEL INGENIERO ─────────────────────────────────────────────
function InformesIngeniero({ setView }) {
    const [informes, setInformes] = useState([]); const [loaded, setLoaded] = useState(false);
    const [showNew, setShowNew] = useState(false); const [form, setForm] = useState({ titulo: '', obra: '', tipo: 'visita', fecha: '', notas: '' });
    const fileRef = useRef(null); const [uploading, setUploading] = useState(false);
    useEffect(() => { (async () => { try { const r = await storage.get('bcm_inf_ing'); if (r?.value) setInformes(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []);
    useEffect(() => { if (loaded) storage.set('bcm_inf_ing', JSON.stringify(informes)).catch(() => { }); }, [informes, loaded]);
    const TIPOS = [{ id: 'visita', label: 'Visita de obra', color: '#3B82F6', bg: '#EFF6FF' }, { id: 'inspeccion', label: 'Inspección', color: '#8B5CF6', bg: '#F5F3FF' }, { id: 'reunion', label: 'Reunión', color: '#F59E0B', bg: '#FFFBEB' }, { id: 'final', label: 'Informe final', color: '#10B981', bg: '#ECFDF5' }, { id: 'incidente', label: 'Incidente', color: '#EF4444', bg: '#FEF2F2' }];
    async function handleFile(e) {
        setUploading(true);
        const files = Array.from(e.target.files);
        const nuevos = [];
        for (const f of files) {
            const url = await toDataUrl(f);
            nuevos.push({ id: uid(), titulo: form.titulo || f.name.replace(/\.[^.]+$/, ''), obra: form.obra, tipo: form.tipo, fecha: form.fecha || new Date().toLocaleDateString('es-AR'), notas: form.notas, nombre: f.name, ext: f.name.split('.').pop().toUpperCase(), url, size: (f.size / 1024).toFixed(0) + 'KB', cargado: new Date().toLocaleDateString('es-AR') });
        }
        setInformes(p => [...nuevos, ...p]);
        setForm({ titulo: '', obra: '', tipo: 'visita', fecha: '', notas: '' });
        setShowNew(false); setUploading(false);
        e.target.value = '';
    }
    const tipoMap = t => TIPOS.find(x => x.id === t) || TIPOS[0];
    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader title="Informes del Ingeniero" back onBack={() => setView("mas")} sub={`${informes.length} informes`} right={<PlusBtn onClick={() => setShowNew(true)} />} />
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
            {informes.length === 0 && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📋</div><div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>Sin informes cargados</div><div style={{ fontSize: 12, color: T.muted }}>Tocá + para subir el primer informe</div></div>}
            {TIPOS.map(tipo => {
                const items = informes.filter(i => i.tipo === tipo.id);
                if (!items.length) return null;
                return (<div key={tipo.id} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: tipo.color }} /><span style={{ fontSize: 11, fontWeight: 700, color: tipo.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{tipo.label}</span><span style={{ fontSize: 11, color: T.muted }}>({items.length})</span></div>
                    {items.map(inf => (<Card key={inf.id} style={{ padding: "13px 14px", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 10, background: tipo.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 10, fontWeight: 800, color: tipo.color }}>{inf.ext}</span></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inf.titulo}</div>
                                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{inf.obra ? `${inf.obra} · ` : ''}{inf.fecha} · {inf.size}</div>
                                {inf.notas && <div style={{ fontSize: 11, color: T.sub, marginTop: 3, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inf.notas}</div>}
                            </div>
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                <a href={inf.url} download={inf.nombre} style={{ textDecoration: "none" }}><button style={{ background: T.accentLight, border: `1px solid ${T.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.accent, fontSize: 13 }}>↓</button></a>
                                <button onClick={() => setInformes(p => p.filter(x => x.id !== inf.id))} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#EF4444", fontSize: 13 }}>✕</button>
                            </div>
                        </div>
                    </Card>))}
                </div>);
            })}
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.jpg,.png" multiple onChange={handleFile} style={{ display: "none" }} />
        {showNew && (<Sheet title="Subir informe" onClose={() => setShowNew(false)}>
            <Field label="Título"><TInput value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Informe visita 15/04" /></Field>
            <FieldRow>
                <Field label="Obra"><TInput value={form.obra} onChange={e => setForm(p => ({ ...p, obra: e.target.value }))} placeholder="Terminal A" /></Field>
                <Field label="Fecha"><TInput value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} placeholder="dd/mm/aa" /></Field>
            </FieldRow>
            <Field label="Tipo de informe">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {TIPOS.map(tp => (<button key={tp.id} onClick={() => setForm(p => ({ ...p, tipo: tp.id }))} style={{ padding: "8px", borderRadius: T.rsm, border: `1.5px solid ${form.tipo === tp.id ? tp.color : T.border}`, background: form.tipo === tp.id ? tp.bg : T.card, color: tp.color, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{tp.label}</button>))}
                </div>
            </Field>
            <Field label="Notas"><textarea value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Observaciones del informe..." rows={3} style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "10px 12px", fontSize: 13, color: T.text, resize: "none" }} /></Field>
            <PBtn full onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Subiendo..." : "📎 Seleccionar archivo(s)"}</PBtn>
            <div style={{ fontSize: 10, color: T.muted, textAlign: "center", marginTop: 8 }}>PDF · DOC · DOCX · XLSX · JPG · PNG</div>
        </Sheet>)}
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
                const r = await storage.get('bcm_inf_ia'); if (r?.value) { const d = JSON.parse(r.value); setInformes(d.informes || []); setModeloDiario(d.modeloDiario || ''); setModeloSemanal(d.modeloSemanal || ''); }
            } catch { } setLoaded(true);
        })();
    }, []);
    useEffect(() => { if (loaded) storage.set('bcm_inf_ia', JSON.stringify({ informes, modeloDiario, modeloSemanal })).catch(() => { }); }, [informes, modeloDiario, modeloSemanal, loaded]);

    const obra = obras.find(o => o.id === obraId);

    async function generar(tipo) {
        if (!apiKey) { alert("Configurá tu API Key primero en Más → Configuración"); return; }
        const modelo = tipo === 'diario' ? modeloDiario : modeloSemanal;
        setLoading(tipo);
        const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const obraInfo = obra ? `Obra: ${obra.nombre} | Aeropuerto: ${AIRPORTS.find(a => a.id === obra.ap)?.code} | Avance: ${obra.avance}% | Sector: ${obra.sector || '—'} | Estado: ${OBRA_ESTADOS.find(e => e.id === obra.estado)?.label}\nNotas recientes: ${obra.obs?.slice(-3).map(o => o.txt).join(' | ') || 'Sin notas'}` : 'Sin obra seleccionada';
        const persInfo = personal.length ? `Personal en obra: ${personal.map(p => `${p.nombre} (${p.rol})`).join(', ')}` : 'Sin personal registrado';
        const alertInfo = alerts.length ? `Alertas activas: ${alerts.map(a => a.msg).join(' | ')}` : 'Sin alertas';
        const prompt = modelo
            ? `Completá el siguiente modelo de informe ${tipo} con los datos reales de la obra. Reemplazá los campos en blanco o entre corchetes con la información real. Mantené el formato y estructura del modelo.\n\nMODELO:\n${modelo}\n\nDATOS REALES:\nFecha: ${today}\n${obraInfo}\n${persInfo}\n${alertInfo}`
            : `Generá un informe ${tipo === 'diario' ? 'diario' : 'semanal'} de obra profesional para AA2000 con estos datos:\nFecha: ${today}\n${obraInfo}\n${persInfo}\n${alertInfo}\n\nIncluí: resumen ejecutivo, avance físico, personal en obra, materiales/equipos, observaciones, próximas actividades y firma del responsable. Formato profesional.`;

        try {
            const r = await callAI([{ role: "user", content: prompt }], "Sos un ingeniero civil especialista en obras aeroportuarias AA2000. Redactás informes de obra en español profesional rioplatense, claros y completos.", apiKey);
            const nuevo = { id: uid(), tipo, titulo: `Informe ${tipo} — ${new Date().toLocaleDateString('es-AR')}`, obra: obra?.nombre || 'General', texto: r, fecha: new Date().toLocaleDateString('es-AR'), hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) };
            setInformes(p => [nuevo, ...p]);
            setTab("historial");
        } catch { alert("Error al generar. Verificá la API Key."); }
        setLoading(null);
    }

    function descargar(inf) {
        const b = new Blob([inf.texto], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${inf.titulo}.txt`; a.click();
    }

    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppHeader title="Informes IA" back onBack={() => setView("mas")} sub="Diarios y semanales" />
        <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, display: "flex" }}>
            {[["generar", "Generar"], ["modelos", "Modelos"], ["historial", `Historial (${informes.length})`]].map(([id, label]) => (<button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "11px 0", background: "none", border: "none", fontSize: 12, fontWeight: tab === id ? 700 : 500, color: tab === id ? T.accent : T.muted, borderBottom: `2px solid ${tab === id ? T.accent : "transparent"}` }}>{label}</button>))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>

            {tab === "generar" && (<div>
                <Card style={{ padding: "14px 16px", marginBottom: 12, background: T.navy, border: "none", color: "#fff" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Generación automática con IA</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.5 }}>Seleccioná una obra y tipo de informe. La IA usará tus datos reales y el modelo que cargaste.</div>
                </Card>
                <Field label="Obra (opcional)">
                    <select value={obraId} onChange={e => setObraId(e.target.value)} style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }}>
                        <option value="">— Datos generales —</option>
                        {obras.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                    </select>
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                    <button onClick={() => generar('diario')} disabled={!!loading} style={{ background: loading === 'diario' ? "#94A3B8" : T.accent, border: "none", borderRadius: T.rsm, padding: "18px 12px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                        {loading === 'diario' ? <div style={{ width: 24, height: 24, border: "3px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> : <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
                        <div><div style={{ fontSize: 14, fontWeight: 700 }}>Informe Diario</div><div style={{ fontSize: 10, opacity: .8, marginTop: 2 }}>{modeloDiario ? "Con tu modelo" : "Formato estándar"}</div></div>
                    </button>
                    <button onClick={() => generar('semanal')} disabled={!!loading} style={{ background: loading === 'semanal' ? "#94A3B8" : "#7C3AED", border: "none", borderRadius: T.rsm, padding: "18px 12px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                        {loading === 'semanal' ? <div style={{ width: 24, height: 24, border: "3px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> : <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>}
                        <div><div style={{ fontSize: 14, fontWeight: 700 }}>Informe Semanal</div><div style={{ fontSize: 10, opacity: .8, marginTop: 2 }}>{modeloSemanal ? "Con tu modelo" : "Formato estándar"}</div></div>
                    </button>
                </div>
                {!apiKey && <div style={{ marginTop: 12, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#EF4444", fontWeight: 600 }}>⚠ Configurá tu API Key en Más → Configuración para usar esta función</div>}
            </div>)}

            {tab === "modelos" && (<div>
                <div style={{ background: T.accentLight, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: T.sub, lineHeight: 1.6 }}>
                    Cargá tu modelo de informe. La IA lo va a completar con los datos reales de la obra. Podés usar <strong>[FECHA]</strong>, <strong>[OBRA]</strong>, <strong>[AVANCE]</strong> como marcadores opcionales.
                </div>
                <Field label="Modelo de informe DIARIO">
                    <textarea
                        value={modeloDiario}
                        onChange={e => setModeloDiario(e.target.value)}
                        placeholder={"INFORME DIARIO DE OBRA\nFecha: [FECHA]\nObra: [OBRA]\nAvance: [AVANCE]%\n\nTrabajos realizados:\n\nPersonal presente:\n\nObservaciones:\n\nFirma Responsable: ___________"}
                        rows={10}
                        style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "12px 14px", fontSize: 12, color: T.text, fontFamily: "monospace", lineHeight: 1.6 }}
                    />
                </Field>
                <Field label="Modelo de informe SEMANAL">
                    <textarea
                        value={modeloSemanal}
                        onChange={e => setModeloSemanal(e.target.value)}
                        placeholder={"INFORME SEMANAL DE OBRA\nSemana: [FECHA]\nObra: [OBRA]\n\nResumen ejecutivo:\n\nActividades completadas:\n\nActividades en curso:\n\nPróxima semana:\n\nIncidentes/alertas:\n\nFirma Responsable: ___________"}
                        rows={12}
                        style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "12px 14px", fontSize: 12, color: T.text, fontFamily: "monospace", lineHeight: 1.6 }}
                    />
                </Field>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button onClick={() => setModeloDiario('')} style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "9px", fontSize: 11, color: T.muted, cursor: "pointer" }}>↺ Borrar diario</button>
                    <button onClick={() => setModeloSemanal('')} style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "9px", fontSize: 11, color: T.muted, cursor: "pointer" }}>↺ Borrar semanal</button>
                </div>
                <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600, textAlign: "center", marginTop: 8 }}>✓ Los modelos se guardan automáticamente</div>
            </div>)}

            {tab === "historial" && (<div>
                {informes.length === 0 && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📄</div><div style={{ fontSize: 13, color: T.muted }}>Aún no generaste ningún informe</div></div>}
                {informes.map(inf => (<Card key={inf.id} style={{ padding: "14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: inf.tipo === 'diario' ? T.accentLight : "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 9, fontWeight: 800, color: inf.tipo === 'diario' ? T.accent : "#7C3AED" }}>{inf.tipo === 'diario' ? "DIA" : "SEM"}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{inf.titulo}</div>
                            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{inf.obra} · {inf.fecha} {inf.hora}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button onClick={() => descargar(inf)} style={{ background: T.accentLight, border: `1px solid ${T.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.accent, fontSize: 13 }}>↓</button>
                            <button onClick={() => { try { navigator.clipboard.writeText(inf.texto); } catch { } }} style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#15803D", fontSize: 11 }}>📋</button>
                            <button onClick={() => setInformes(p => p.filter(x => x.id !== inf.id))} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#EF4444", fontSize: 13 }}>✕</button>
                        </div>
                    </div>
                    <div style={{ background: T.bg, borderRadius: T.rsm, padding: "10px 12px", fontSize: 11, color: T.text, lineHeight: 1.6, maxHeight: 140, overflowY: "auto", whiteSpace: "pre-wrap" }}>{inf.texto.slice(0, 400)}{inf.texto.length > 400 ? "…" : ""}</div>
                </Card>))}
            </div>)}
        </div>
    </div>);
}

const CfgSection = memo(({ id, title, icon, children, openSec, setOpenSec }) => {
    const open = openSec === id;
    return (<div style={{ border: `1px solid ${T.border}`, borderRadius: T.rsm, marginBottom: 8, overflow: "hidden" }}>
        <div onClick={() => setOpenSec(open ? null : id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", cursor: "pointer", background: open ? T.accentLight : T.card }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: open ? T.accent : T.text, flex: 1 }}>{title}</span>
            <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{open ? "▲" : "▼"}</span>
        </div>
        {open && <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, background: T.card }}>{children}</div>}
    </div>);
});

// Library of SF-style technical icons for construction management
const ICON_LIBRARY = [
    { id: 'eye', label: 'Ojo', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd"/></svg>' },
    { id: 'doc', label: 'Documento', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75-6.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd"/><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z"/></svg>' },
    { id: 'chart', label: 'Gráfico', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"/></svg>' },
    { id: 'chat', label: 'Chat', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"/><path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.126 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"/></svg>' },
    { id: 'cart', label: 'Carrito', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>' },
    { id: 'bell', label: 'Alerta', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd"/></svg>' },
    { id: 'folder', label: 'Carpeta', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 00-3-3h-3.879a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H6a3 3 0 00-3 3v3.162A3.756 3.756 0 014.094 9h15.812zM4.094 10.5a2.25 2.25 0 00-2.227 2.568l.857 6A2.25 2.25 0 004.951 21H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-2.227-2.568H4.094z"/></svg>' },
    { id: 'cal', label: 'Calendario', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd"/></svg>' },
    { id: 'users', label: 'Personas', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"/></svg>' },
    { id: 'map', label: 'Mapa', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd"/></svg>' },
    { id: 'globe', label: 'Globo', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.683.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z"/></svg>' },
    { id: 'tool', label: 'Herramienta', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.641l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd"/></svg>' },
    { id: 'shield', label: 'Seguridad', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd"/></svg>' },
    { id: 'home', label: 'Casa', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.689z"/><path d="M12 5.432l8.159 8.159.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198l.091-.086L12 5.43z"/></svg>' },
    { id: 'crane', label: 'Grúa', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3zm3 0h2v4H6zm0 6h2v12H6zm3-6h2v2H9zm0 4h2v14H9zm3-4h8v2H12zm0 4h8v2H12zm1 4h6v8h-6z"/></svg>' },
    { id: 'cash', label: 'Dinero', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"/><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd"/><path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"/></svg>' },
    { id: 'phone', label: 'Teléfono', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd"/></svg>' },
    { id: 'clock', label: 'Reloj', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd"/></svg>' },
    { id: 'star', label: 'Estrella', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"/></svg>' },
    { id: 'info', label: 'Info', svg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5A.75.75 0 0012 9z" clipRule="evenodd"/></svg>' },
];

function IconPickerModal({ item, customIcons, onSave, onClose }) {
    const [tab, setTab] = useState('library'); // 'library' | 'upload'
    const fileRef = useRef(null);
    
    function selectLibraryIcon(ic) {
        const newIcons = { ...customIcons, [item.id]: { type: 'svg', src: ic.svg } };
        onSave(newIcons);
        onClose();
    }
    
    function resetIcon() {
        const newIcons = { ...customIcons };
        delete newIcons[item.id];
        onSave(newIcons);
        onClose();
    }
    
    async function handleUpload(e) {
        const f = e.target.files[0];
        if (!f) return;
        const url = await toDataUrl(f, 200);
        const newIcons = { ...customIcons, [item.id]: { type: 'img', src: url } };
        onSave(newIcons);
        onClose();
    }
    
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ background: T.card, borderRadius: '20px 20px 0 0', width: '100%', maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Icono: {item.label}</div>
                    <button onClick={onClose} style={{ background: T.bg, border: 'none', borderRadius: 8, width: 30, height: 30, fontSize: 16, cursor: 'pointer', color: T.muted }}>✕</button>
                </div>
                <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}` }}>
                    {['library', 'upload'].map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px', background: 'none', border: 'none', fontSize: 12, fontWeight: tab === t ? 700 : 500, color: tab === t ? T.accent : T.muted, borderBottom: `2px solid ${tab === t ? T.accent : 'transparent'}`, cursor: 'pointer' }}>
                            {t === 'library' ? '📚 Biblioteca' : '📷 Subir imagen'}
                        </button>
                    ))}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
                    {tab === 'library' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                            {ICON_LIBRARY.map(ic => (
                                <button key={ic.id} onClick={() => selectLibraryIcon(ic)} style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: '12px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                    <div style={{ color: T.accent }} dangerouslySetInnerHTML={{ __html: ic.svg }} />
                                    <div style={{ fontSize: 9, color: T.muted, fontWeight: 600 }}>{ic.label}</div>
                                </button>
                            ))}
                        </div>
                    )}
                    {tab === 'upload' && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🖼</div>
                            <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>Subí una imagen PNG, SVG o JPG</div>
                            <button onClick={() => fileRef.current?.click()} style={{ background: T.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Elegir imagen</button>
                        </div>
                    )}
                </div>
                <div style={{ padding: '12px 18px', borderTop: `1px solid ${T.border}` }}>
                    <button onClick={resetIcon} style={{ width: '100%', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, color: T.sub, cursor: 'pointer' }}>↩ Restaurar icono original</button>
                </div>
            </div>
        </div>
    );
}


function Mas({ setView, authed, setAuthed, requireAuth, cfg, setCfg, apiKey, setApiKey, cfgLocked, setCfgLocked, lics, obras, personal, alerts, currentUser }) {
    const [showConfig, setShowConfig] = useState(false);
    const [openSec, setOpenSec] = useState("cuenta");
    const [localCfg, setLocalCfg] = useState({ ...DEFAULT_CONFIG, ...cfg });
    const [editIconMode, setEditIconMode] = useState(false);
    const [iconPickerFor, setIconPickerFor] = useState(null);
    const [customIcons, setCustomIcons] = useState(() => {
        try { return JSON.parse(localStorage.getItem('bcm_icons') || '{}'); } catch { return {}; }
    });
    const saveCustomIcons = (icons) => {
        setCustomIcons(icons);
        localStorage.setItem('bcm_icons', JSON.stringify(icons));
    };
    const [localKey, setLocalKey] = useState(apiKey || '');
    const [showKey, setShowKey] = useState(false);
    const [hasUnsaved, setHasUnsaved] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);
    const [showLockConfirm, setShowLockConfirm] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockUser, setUnlockUser] = useState('');
    const [unlockPass, setUnlockPass] = useState('');
    const [unlockErr, setUnlockErr] = useState('');
    const logoRef1 = useRef(null); const logoRef2 = useRef(null); const logoRef3 = useRef(null); const logoRef4 = useRef(null);

    function handleLock() { setCfgLocked(true); setShowLockConfirm(false); setShowConfig(false); }
    function tryUnlock() {
        const f = ADMIN_CREDS.find(c => c.user === unlockUser.trim().toLowerCase() && c.pass === unlockPass.trim());
        if (f) { setCfgLocked(false); setShowUnlockModal(false); setUnlockUser(''); setUnlockPass(''); setUnlockErr(''); }
        else { setUnlockErr('Usuario o contraseña incorrectos'); }
    }

    useEffect(() => { if (!showConfig) { setLocalCfg({ ...DEFAULT_CONFIG, ...cfg }); setHasUnsaved(false); setConfirmClose(false); } }, [cfg, showConfig]);

    // Detectar cambios pendientes comparando localCfg con cfg
    useEffect(() => {
        if (!showConfig) return;
        const a = JSON.stringify({ ...localCfg, logoBelfast: undefined, logoAA2000: undefined, logoAsistente: undefined, logoCentral: undefined });
        const b = JSON.stringify({ ...cfg, logoBelfast: undefined, logoAA2000: undefined, logoAsistente: undefined, logoCentral: undefined });
        setHasUnsaved(a !== b);
    }, [localCfg, cfg, showConfig]);

    const updateText = useCallback((patch) => { setLocalCfg(p => ({ ...p, ...patch })); }, []);
    const applyVisual = useCallback((patch) => { setCfg(p => ({ ...p, ...patch })); setLocalCfg(p => ({ ...p, ...patch })); }, [setCfg]);
    const applyThemePreset = useCallback((preset) => { applyVisual({ themeId: preset.id, colors: { accent: preset.accent, al: preset.al, bg: preset.bg, card: preset.card, border: preset.border, text: preset.text, sub: preset.sub, muted: preset.muted, navy: preset.navy } }); }, [applyVisual]);
    const applyColorKey = useCallback((key, value) => { const nc = { ...(cfg.colors || DEFAULT_COLORS), [key]: value }; if (key === 'accent') nc.al = hexLight(value); applyVisual({ themeId: 'custom', colors: nc }); }, [cfg, applyVisual]);
    const guardarYCerrar = useCallback(() => {
        setCfg(p => ({ ...p, ...localCfg }));
        setApiKey(localKey);
        storage.set('bcm_apikey', localKey).catch(() => { });
        setHasUnsaved(false); setConfirmClose(false); setShowConfig(false);
    }, [localCfg, localKey, setCfg, setApiKey]);
    const handleSetOpenSec = useCallback((v) => setOpenSec(v), []);

    async function exportarJSX() {
        try {
            let src = __SOURCE_CODE__;

            // Limpiar datos pesados (base64)
            const licsClean = JSON.parse(JSON.stringify(lics)).map(l => ({ ...l, docs: {} }));
            const obrasClean = JSON.parse(JSON.stringify(obras)).map(o => ({ ...o, fotos: [], archivos: [], docs: {} }));
            const personalClean = JSON.parse(JSON.stringify(personal)).map(p => ({ ...p, foto: '', docs: {} }));
            const alertsClean = JSON.parse(JSON.stringify(alerts));
            const { logoBelfast, logoAA2000, logoAsistente, logoCentral, ...cfgClean } = cfg;

            const licsStr = JSON.stringify(licsClean);
            const obrasStr = JSON.stringify(obrasClean);
            const personalStr = JSON.stringify(personalClean);
            const alertsStr = JSON.stringify(alertsClean);
            const cfgStr = JSON.stringify(cfgClean);

            // Reemplazar constantes con datos actuales
            let out = src;
            out = out.replace(/const DEMO_LICS = \[[\s\S]*?\];/, 'const DEMO_LICS = ' + licsStr + ';');
            out = out.replace(/const DEMO_OBRAS = \[[\s\S]*?\];/, 'const DEMO_OBRAS = ' + obrasStr + ';');
            out = out.replace(/const DEMO_PERSONAL = \[[\s\S]*?\];/, 'const DEMO_PERSONAL = ' + personalStr + ';');
            out = out.replace(/const DEMO_ALERTS = \[[\s\S]*?\];/, 'const DEMO_ALERTS = ' + alertsStr + ';');
            out = out.replace(/const DEFAULT_CONFIG = \{[^\n]+\};/, 'const DEFAULT_CONFIG = ' + cfgStr + ';');

            const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'belfast_cm_publicado_' + new Date().toLocaleDateString('es-AR').replace(/\//g, '-') + '.jsx';
            a.click();
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
        { id: "vigilancia", label: "Panel Vigilancia", sub: "Cámaras IP en vivo", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" clipRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" /></svg> },
        { id: "presentismo", label: "Presentismo", sub: "Control biométrico", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M7.502 6h7l-1.501 4.5-1.5-1.5-1.5 1.5L8.499 9 7.502 6zm-1.5 0H3.75A2.25 2.25 0 001.5 8.25v10.5A2.25 2.25 0 003.75 21h16.5a2.25 2.25 0 002.25-2.25V8.25A2.25 2.25 0 0020.25 6H18l-.862 3.445a2.25 2.25 0 01-2.145 1.555H9.007a2.25 2.25 0 01-2.145-1.555L6.002 6zm7.998 9.75a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0v-2.25zm-4.5 1.5a.75.75 0 000 1.5h.75a.75.75 0 000-1.5H9zm6.75 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75z" /></svg> },
        { id: "licitaciones", label: "Licitaciones", sub: "Gestión y seguimiento", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75-6.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg> },
        { id: "resumen", label: "Resumen ejecutivo", sub: "Indicadores y avances", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" /></svg> },
        { id: "mensajes", label: "Mensajes internos", sub: "Comunicaciones del equipo", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" /><path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.126 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" /></svg> },
        { id: "proveedores", label: "Proveedores", sub: "Gestión de proveedores y contactos", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> },
        { id: "info_externa", label: "Info externa", sub: "Dólar · Clima · Maps · Tráfico", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.157 7.582A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253" /></svg> },
        { id: "info_util", label: "Info útil", sub: "Cotizaciones y clima en tiempo real", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.59-1.59a.75.75 0 10-1.06-1.061L6.166 6.166z" /></svg> },
        { id: "gantt", label: "Diagrama de Gantt", sub: "Cronograma con pronóstico de lluvia", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" /></svg> },
        { id: "archivos", label: "Archivos", sub: "PDFs, planos, Excel", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 00-3-3h-3.879a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H6a3 3 0 00-3 3v3.162A3.756 3.756 0 014.094 9h15.812zM4.094 10.5a2.25 2.25 0 00-2.227 2.568l.857 6A2.25 2.25 0 004.951 21H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-2.227-2.568H4.094z" /></svg> },
        { id: "seguimiento", label: "Seguimiento", sub: "Alertas y pendientes", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" /></svg> },
        { id: "contactos", label: "Contactos", sub: "Agenda y emails", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg> },
        { id: "whatsapp", label: "Grupos WhatsApp", sub: "Equipos de trabajo", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" /><path fillRule="evenodd" clipRule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75z" /></svg> },
    ];

    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Más opciones" right={authed && <button onClick={() => setAuthed(null)} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>Cerrar sesión</button>} />
        {authed && <div style={{ margin: "12px 18px 0", background: "#ECFDF5", border: "1px solid #86EFAC", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="#10B981"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg><span style={{ fontSize: 12, color: "#15803D", fontWeight: 600 }}>Sesión activa: {authed.rol}</span></div>}
        <div style={{ padding: "14px 18px" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                {MAS_ITEMS.filter(item => {
                    if (['resumen', 'vigilancia'].includes(item.id) && !isDirectivo(currentUser)) return false;
                    return true;
                }).map(item => {
                    const ci = customIcons[item.id];
                    return (<button key={item.id} onClick={() => setView(item.id)}
                        style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "14px 8px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: T.shadow, textAlign: "center" }}>
                        <div style={{ width: 40, height: 40, borderRadius: T.rsm, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, flexShrink: 0, overflow: "hidden" }}>
                            {ci?.type === 'img' ? <img src={ci.src} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} /> : ci?.type === 'svg' ? <span dangerouslySetInnerHTML={{ __html: ci.src }} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24 }} /> : item.icon}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{item.label}</div>
                    </button>);
                })}
            </div>
            <div style={{ height: 1, background: T.border, margin: "4px 0 14px" }} />
            <Card onClick={() => { if (cfgLocked) setShowUnlockModal(true); else requireAuth(() => setShowConfig(true), "Configuración"); }} style={{ padding: "15px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, border: `1.5px solid ${cfgLocked ? "#EF4444" : T.accent}`, background: cfgLocked ? "#FEF2F2" : T.accentLight }}>
                <div style={{ width: 44, height: 44, borderRadius: T.rsm, background: cfgLocked ? "#EF4444" : T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {cfgLocked
                        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" /></svg>
                        : <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path fillRule="evenodd" clipRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></svg>}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: cfgLocked ? "#EF4444" : T.accent }}>Configuración {cfgLocked ? "— Bloqueada 🔒" : ""}</div>
                    <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{cfgLocked ? "Tocá para desbloquear con credenciales admin" : "Estética · Logos · Empresa · Admin"}</div>
                </div>
                <span style={{ fontSize: 18, color: cfgLocked ? "#EF4444" : T.accent }}>›</span>
            </Card>
        </div>

        {showConfig && !cfgLocked && (<Sheet title="⚙️ Configuración" onClose={tryClose}>

            {/* Banner cambios pendientes */}
            {hasUnsaved && !confirmClose && (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                    <span style={{ fontSize: 12, color: "#92400E", fontWeight: 600, flex: 1 }}>Tenés cambios sin guardar</span>
                    <button onClick={guardarYCerrar} style={{ background: "#D97706", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Guardar ahora</button>
                </div>
            )}

            {/* Diálogo confirmación cierre */}
            {confirmClose && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 8 }}>¿Salir sin guardar?</div>
                    <div style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 12, lineHeight: 1.5 }}>Tenés cambios que no se guardaron. Si salís ahora se van a perder.</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <button onClick={() => { setConfirmClose(false); setShowConfig(false); setHasUnsaved(false); }} style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: "#EF4444", cursor: "pointer" }}>Salir igual</button>
                        <button onClick={guardarYCerrar} style={{ background: T.accent, border: "none", borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>✓ Guardar y cerrar</button>
                    </div>
                </div>
            )}
            <CfgSection id="cuenta" title="Cuenta y empresa" icon="🏢" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ marginBottom: 14 }}>
                    <Lbl>API Key de Anthropic</Lbl>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showKey ? "text" : "password"}
                            value={localKey}
                            onChange={e => setLocalKey(e.target.value)}
                            placeholder="sk-ant-api03-..."
                            autoComplete="off"
                            spellCheck={false}
                            style={{ width: "100%", background: T.bg, border: `1.5px solid ${localKey ? '#10B981' : T.border}`, borderRadius: T.rsm, padding: "11px 44px 11px 14px", fontSize: 13, color: T.text, fontFamily: "monospace" }}
                        />
                        <button onClick={() => setShowKey(v => !v)} type="button" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", alignItems: "center", padding: 4 }}>
                            {showKey
                                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="currentColor" strokeWidth="1.5" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" /></svg>}
                        </button>
                    </div>
                    {localKey
                        ? <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} /><span style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>Key configurada — se usa para el micrófono y la IA</span></div>
                        : <div style={{ fontSize: 10, color: T.muted, marginTop: 5, lineHeight: 1.5 }}>Ingresá tu API key de <strong>console.anthropic.com</strong> para habilitar el micrófono y la IA con tu propia cuenta.</div>}
                </div>
                <Field label="Email del asistente IA"><TInput value={localCfg.email || ''} onChange={e => updateText({ email: e.target.value })} placeholder="correo@empresa.com" /></Field>
                <Field label="Nombre de la empresa"><TInput value={localCfg.empresa || ''} onChange={e => updateText({ empresa: e.target.value })} placeholder="BelfastCM" /></Field>
                <FieldRow><Field label="Cargo"><TInput value={localCfg.cargo || ''} onChange={e => updateText({ cargo: e.target.value })} placeholder="Gerencia de Obra" /></Field><Field label="Teléfono"><TInput value={localCfg.telefono || ''} onChange={e => updateText({ telefono: e.target.value })} placeholder="+54 11..." /></Field></FieldRow>
                <Field label="Ciudad / Sede"><TInput value={localCfg.ciudad || ''} onChange={e => updateText({ ciudad: e.target.value })} placeholder="Buenos Aires" /></Field>
            </CfgSection>

            <CfgSection id="tema" title="Tema visual" icon="🎨" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <Lbl>Presets</Lbl>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
                    {THEME_PRESETS.map(p => {
                        const active = localCfg.themeId === p.id; return (<button key={p.id} onClick={() => applyThemePreset(p)} style={{ background: p.accent, borderRadius: T.rsm, padding: "12px 6px", border: `3px solid ${active ? "#fff" : "transparent"}`, boxShadow: active ? `0 0 0 3px ${p.accent}` : "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{ display: "flex", gap: 3 }}>{[p.bg, p.card, p.border].map((c, i) => (<div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,.4)" }} />))}</div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{p.label}</div>
                            {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                        </button>);
                    })}
                </div>
                <Lbl>Colores individuales</Lbl>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {COLOR_KEYS.map(({ k, label }) => (<div key={k} style={{ textAlign: "center" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", marginBottom: 4 }}>
                            <input type="color" value={(localCfg.colors || DEFAULT_COLORS)[k] || '#000000'} onChange={e => applyColorKey(k, e.target.value)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: `2px solid ${T.border}`, borderRadius: T.rsm, cursor: "pointer", padding: 3, background: "#fff" }} />
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: T.sub }}>{label}</div>
                    </div>))}
                </div>
                <button onClick={() => applyThemePreset(THEME_PRESETS[0])} style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "8px 14px", fontSize: 12, color: T.sub, cursor: "pointer" }}>↺ Restaurar tema por defecto</button>
            </CfgSection>

            <CfgSection id="font" title="Tipografía" icon="✏️" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {FONTS.map(f => {
                        const active = localCfg.fontId === f.id; return (<button key={f.id} onClick={() => applyVisual({ fontId: f.id })} style={{ padding: "12px 8px", borderRadius: T.rsm, border: `2px solid ${active ? T.accent : T.border}`, background: active ? T.accentLight : T.card, cursor: "pointer", textAlign: "center" }}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: active ? T.accent : T.text, fontFamily: f.value, lineHeight: 1, marginBottom: 4 }}>Aa</div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: active ? T.accent : T.sub }}>{f.label}</div>
                            {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, margin: "4px auto 0" }} />}
                        </button>);
                    })}
                </div>
            </CfgSection>

            <CfgSection id="forma" title="Forma de los elementos" icon="📐" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                    {RADIUS_OPTS.map(r => {
                        const active = localCfg.radiusId === r.id; return (<button key={r.id} onClick={() => applyVisual({ radiusId: r.id })} style={{ padding: "12px 4px", border: `2px solid ${active ? T.accent : T.border}`, background: active ? T.accentLight : T.card, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderRadius: 8 }}>
                            <div style={{ width: 36, height: 28, background: active ? T.accent : "#E2E8F0", borderRadius: r.r / 3 }} />
                            <div style={{ fontSize: 10, fontWeight: 600, color: active ? T.accent : T.sub }}>{r.label}</div>
                        </button>);
                    })}
                </div>
            </CfgSection>

            <CfgSection id="logos" title="Logos y textos" icon="🖼" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>Subí tus archivos PNG/SVG/JPG para reemplazar los logos automáticos.</div>
                <input ref={logoRef1} type="file" accept="image/*,.svg" style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); applyVisual({ logoBelfast: url }); } e.target.value = ""; }} />
                <input ref={logoRef2} type="file" accept="image/*,.svg" style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); applyVisual({ logoAA2000: url }); } e.target.value = ""; }} />
                <input ref={logoRef3} type="file" accept="image/*,.svg" style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); applyVisual({ logoAsistente: url }); } e.target.value = ""; }} />
                <input ref={logoRef4} type="file" accept="image/*,.svg" style={{ display: "none" }} onChange={async e => { if (e.target.files[0]) { const url = await toDataUrl(e.target.files[0]); applyVisual({ logoCentral: url }); } e.target.value = ""; }} />
                <div style={{ marginBottom: 12 }}><Lbl>Logo botón micrófono (pantalla IA)</Lbl>
                    <div style={{ border: `1.5px dashed ${T.border}`, borderRadius: T.rsm, padding: "14px", textAlign: "center", background: T.bg, cursor: "pointer" }} onClick={() => logoRef4.current?.click()}>
                        {cfg.logoCentral
                            ? (<div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}><img src={cfg.logoCentral} alt="Central" style={{ height: 52, objectFit: "contain", maxWidth: 140 }} /><div style={{ textAlign: "left" }}><div style={{ fontSize: 10, color: "#10B981", fontWeight: 700, marginBottom: 4 }}>✓ Logo cargado</div><button onClick={e => { e.stopPropagation(); applyVisual({ logoCentral: "" }); }} style={{ fontSize: 10, color: "#EF4444", background: "none", border: "1px solid #FECACA", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>Quitar</button></div></div>)
                            : (<><div style={{ fontSize: 28, marginBottom: 4 }}>📤</div><div style={{ fontSize: 11, fontWeight: 600, color: T.sub }}>Subir logo para el botón micrófono</div><div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>PNG · SVG · JPG — reemplaza el ícono del micrófono</div></>)}
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                    {[{ key: "logoBelfast", label: "Belfast", ref: logoRef1 }, { key: "logoAA2000", label: "AA2000", ref: logoRef2 }, { key: "logoAsistente", label: "Asistente", ref: logoRef3 }].map(({ key, label, ref }) => (
                        <div key={key} style={{ border: `1.5px dashed ${T.border}`, borderRadius: T.rsm, padding: "12px 6px", textAlign: "center", background: T.bg, cursor: "pointer" }} onClick={() => ref.current?.click()}>
                            {cfg[key] ? (<><img src={cfg[key]} alt={label} style={{ height: 36, objectFit: "contain", marginBottom: 5, maxWidth: "100%" }} /><div style={{ fontSize: 9, color: "#10B981", fontWeight: 700, marginBottom: 3 }}>✓ Cargado</div><button onClick={e => { e.stopPropagation(); applyVisual({ [key]: "" }); }} style={{ fontSize: 9, color: "#EF4444", background: "none", border: "1px solid #FECACA", borderRadius: 6, padding: "2px 7px", cursor: "pointer" }}>Quitar</button></>)
                                : (<><div style={{ fontSize: 24, marginBottom: 3 }}>📤</div><div style={{ fontSize: 10, fontWeight: 600, color: T.sub }}>{label}</div><div style={{ fontSize: 8, color: T.muted, marginTop: 2 }}>PNG · SVG</div></>)}
                        </div>
                    ))}
                </div>
                <Field label="Título del asistente"><TInput value={localCfg.tituloAsistente || ''} onChange={e => updateText({ tituloAsistente: e.target.value })} placeholder="Asistente BelfastCM" /></Field>
                <Field label="Subtítulo"><TInput value={localCfg.subtituloAsistente || ''} onChange={e => updateText({ subtituloAsistente: e.target.value })} placeholder="Lee todos los datos de la app" /></Field>
                <div style={{ background: T.bg, borderRadius: T.rsm, padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Vista previa</div>
                    <div style={{ width: 60, height: 52, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", boxShadow: T.shadow, border: `1.5px solid ${T.border}`, overflow: "hidden" }}>
                        {cfg.logoAsistente ? <img src={cfg.logoAsistente} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <BelfastLogo size={38} />}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 2 }}>{localCfg.tituloAsistente || "Asistente BelfastCM"}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{localCfg.subtituloAsistente || "Lee todos los datos de la app"}</div>
                </div>
            </CfgSection>

            <CfgSection id="ubicaciones" title="Ubicaciones / Aeropuertos" icon="✈️" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 14, lineHeight: 1.5 }}>
                    Editá el nombre, código y etiqueta de cada ubicación. Se usan en obras, licitaciones y cámaras.
                </div>
                <Field label="Etiqueta del campo">
                    <TInput
                        value={localCfg.labelUbicacion || 'Aeropuerto'}
                        onChange={e => updateText({ labelUbicacion: e.target.value })}
                        placeholder="Aeropuerto"
                    />
                </Field>
                <Lbl>Ubicaciones</Lbl>
                {(localCfg.ubicaciones || DEFAULT_UBICACIONES).map((ub, i) => (
                    <div key={ub.id} style={{ background: T.bg, borderRadius: T.rsm, padding: "12px 14px", marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ubicación {i + 1}</div>
                        <FieldRow>
                            <Field label="Código (ej: AEP)">
                                <TInput
                                    value={ub.code}
                                    onChange={e => {
                                        const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES)];
                                        nuevas[i] = { ...nuevas[i], code: e.target.value.toUpperCase() };
                                        setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                                    }}
                                    placeholder="AEP"
                                />
                            </Field>
                            <Field label="ID interno">
                                <TInput
                                    value={ub.id}
                                    onChange={e => {
                                        const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES)];
                                        nuevas[i] = { ...nuevas[i], id: e.target.value.toLowerCase().replace(/\s/g, '') };
                                        setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                                    }}
                                    placeholder="aep"
                                />
                            </Field>
                        </FieldRow>
                        <Field label="Nombre completo">
                            <TInput
                                value={ub.name}
                                onChange={e => {
                                    const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES)];
                                    nuevas[i] = { ...nuevas[i], name: e.target.value };
                                    setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                                }}
                                placeholder="Aeroparque Jorge Newbery"
                            />
                        </Field>
                        {(localCfg.ubicaciones || DEFAULT_UBICACIONES).length > 1 && (
                            <button onClick={() => {
                                const nuevas = (localCfg.ubicaciones || DEFAULT_UBICACIONES).filter((_, j) => j !== i);
                                setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                            }} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: T.rsm, padding: "6px 12px", fontSize: 11, color: "#EF4444", cursor: "pointer", fontWeight: 600 }}>
                                Eliminar ubicación
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => {
                    const nuevas = [...(localCfg.ubicaciones || DEFAULT_UBICACIONES), { id: `ubic${Date.now()}`, code: '', name: '' }];
                    setLocalCfg(p => ({ ...p, ubicaciones: nuevas }));
                }} style={{ width: "100%", background: T.accentLight, border: `1.5px dashed ${T.accent}`, borderRadius: T.rsm, padding: "10px", fontSize: 12, fontWeight: 700, color: T.accent, cursor: "pointer", marginTop: 4 }}>
                    + Agregar ubicación
                </button>
                <button onClick={() => setLocalCfg(p => ({ ...p, ubicaciones: DEFAULT_UBICACIONES, labelUbicacion: 'Aeropuerto' }))} style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "8px", fontSize: 11, color: T.muted, cursor: "pointer", marginTop: 8 }}>
                    ↺ Restaurar ubicaciones por defecto
                </button>
            </CfgSection>

            <CfgSection id="textos" title={t(cfg, 'cfg_textos')} icon="✏️" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>Editá cualquier texto visible en la app. Dejá vacío para usar el valor por defecto.</div>
                {Object.entries(DEFAULT_TEXTOS).map(([key, defaultVal]) => (
                    <div key={key} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{key.replace(/_/g, ' ')}</div>
                        <input
                            value={localCfg.textos?.[key] ?? defaultVal}
                            onChange={e => {
                                const val = e.target.value;
                                setLocalCfg(p => ({ ...p, textos: { ...(p.textos || DEFAULT_TEXTOS), [key]: val } }));
                            }}
                            placeholder={defaultVal}
                            style={{ width: "100%", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "8px 12px", fontSize: 13, color: T.text }}
                        />
                    </div>
                ))}
                <button onClick={() => setLocalCfg(p => ({ ...p, textos: { ...DEFAULT_TEXTOS } }))} style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "8px 14px", fontSize: 12, color: T.sub, cursor: "pointer", marginTop: 4 }}>↺ Restaurar textos por defecto</button>
            </CfgSection>

            <CfgSection id="iconos" title="Iconos del menú" icon="🎨" openSec={openSec} setOpenSec={handleSetOpenSec}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>Tocá cualquier ícono para cambiarlo. Podés elegir de la biblioteca o subir tu propia imagen.</div>
                
                <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Acciones rápidas</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                    {[{ id: "qa_lic", label: "Nueva licitación", defaultIcon: "📋" }, { id: "qa_obra", label: "Nueva obra", defaultIcon: "🏗" }, { id: "qa_mat", label: "Materiales", defaultIcon: "📦" }, { id: "qa_sub", label: "Subcontratos", defaultIcon: "🤝" }].map(item => {
                        const ci = customIcons[item.id];
                        return (
                            <button key={item.id} onClick={() => setIconPickerFor({ id: item.id, label: item.label })}
                                style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "10px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, position: "relative" }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, overflow: "hidden", fontSize: 20 }}>
                                    {ci?.type === 'img' ? <img src={ci.src} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                                    : ci?.type === 'svg' ? <span dangerouslySetInnerHTML={{ __html: ci.src }} style={{ display: "flex", width: 22, height: 22 }} />
                                    : item.defaultIcon}
                                </div>
                                <div style={{ fontSize: 8, color: T.muted, fontWeight: 600, lineHeight: 1.2, textAlign: "center" }}>{item.label}</div>
                                {ci && <div style={{ position: "absolute", top: 3, right: 3, width: 10, height: 10, background: "#10B981", borderRadius: "50%" }} />}
                            </button>
                        );
                    })}
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Menú principal</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {MAS_ITEMS.map(item => {
                        const ci = customIcons[item.id];
                        return (
                            <button key={item.id} onClick={() => setIconPickerFor(item)}
                                style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "10px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, position: "relative" }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, overflow: "hidden" }}>
                                    {ci?.type === 'img' ? <img src={ci.src} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                                    : ci?.type === 'svg' ? <span dangerouslySetInnerHTML={{ __html: ci.src }} style={{ display: "flex", width: 22, height: 22 }} />
                                    : item.icon}
                                </div>
                                <div style={{ fontSize: 8, color: T.muted, fontWeight: 600, lineHeight: 1.2, textAlign: "center" }}>{item.label}</div>
                                {ci && <div style={{ position: "absolute", top: 3, right: 3, width: 10, height: 10, background: "#10B981", borderRadius: "50%" }} />}
                            </button>
                        );
                    })}
                </div>
                <button onClick={() => { localStorage.removeItem('bcm_icons'); setCustomIcons({}); }} style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "9px", fontSize: 12, color: T.sub, cursor: "pointer", marginTop: 10 }}>↺ Restaurar todos los iconos originales</button>
            </CfgSection>

            <PBtn full onClick={guardarYCerrar} style={{ marginTop: 8 }}>{t(cfg, 'cfg_guardar')}</PBtn>

            {/* Botón Exportar JSX */}
            <div style={{ marginTop: 12, padding: "14px 16px", background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: T.rsm }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom: 4 }}>📦 Exportar app con datos actuales</div>
                <div style={{ fontSize: 11, color: "#1E3A8A", marginBottom: 10, lineHeight: 1.5 }}>Descarga un archivo JSX con tu configuración y datos operativos ya incluidos. Al subirlo a Claude, la app arranca con todo listo sin necesitar storage.</div>
                <button onClick={exportarJSX} style={{ width: "100%", background: "#1D4ED8", border: "none", borderRadius: T.rsm, padding: "11px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>📥 Descargar JSX publicable</button>
            </div>

            {/* Botón Publicar y Bloquear */}
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>🔒 Publicar y bloquear configuración</div>
                <div style={{ fontSize: 11, color: "#7F1D1D", marginBottom: 10, lineHeight: 1.5 }}>Una vez bloqueada, la configuración visual no se puede modificar sin credenciales de administrador. Los datos operativos (obras, personal, etc.) siguen funcionando con normalidad.</div>
                <button onClick={() => setShowLockConfirm(true)} style={{ width: "100%", background: "#EF4444", border: "none", borderRadius: T.rsm, padding: "11px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>🔒 Publicar y bloquear ahora</button>
            </div>
        </Sheet>)}

        {iconPickerFor && <IconPickerModal item={iconPickerFor} customIcons={customIcons} onSave={saveCustomIcons} onClose={() => setIconPickerFor(null)} />}


        {/* Modal confirmación de bloqueo */}
        {showLockConfirm && (
            <Sheet title="🔒 Confirmar bloqueo" onClose={() => setShowLockConfirm(false)}>
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>¿Estás seguro?</div>
                    <div style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.6 }}>La configuración visual quedará <strong>bloqueada</strong>. Para modificarla de nuevo vas a necesitar ingresar con usuario y contraseña de administrador.</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button onClick={() => setShowLockConfirm(false)} style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: T.rsm, padding: "12px", fontSize: 13, fontWeight: 600, color: T.sub, cursor: "pointer" }}>Cancelar</button>
                    <button onClick={handleLock} style={{ background: "#EF4444", border: "none", borderRadius: T.rsm, padding: "12px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>🔒 Sí, bloquear</button>
                </div>
            </Sheet>
        )}

        {/* Modal desbloqueo */}
        {showUnlockModal && (
            <Sheet title="🔓 Desbloquear configuración" onClose={() => { setShowUnlockModal(false); setUnlockUser(''); setUnlockPass(''); setUnlockErr(''); }}>
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#92400E", fontWeight: 600 }}>Ingresá las credenciales de administrador para desbloquear la configuración visual.</div>
                <Field label="Usuario"><input value={unlockUser} onChange={e => { setUnlockUser(e.target.value); setUnlockErr(''); }} placeholder="Ingresá tu usuario" autoCapitalize="none" onKeyDown={e => e.key === 'Enter' && tryUnlock()} style={{ width: "100%", background: T.bg, border: `1.5px solid ${unlockErr ? '#FECACA' : T.border}`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }} /></Field>
                <Field label="Contraseña"><input type="password" value={unlockPass} onChange={e => { setUnlockPass(e.target.value); setUnlockErr(''); }} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && tryUnlock()} style={{ width: "100%", background: T.bg, border: `1.5px solid ${unlockErr ? '#FECACA' : T.border}`, borderRadius: T.rsm, padding: "11px 14px", fontSize: 14, color: T.text }} /></Field>
                {unlockErr && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#EF4444", marginBottom: 12, fontWeight: 600 }}>{unlockErr}</div>}
                <PBtn full onClick={tryUnlock}>🔓 Desbloquear</PBtn>
            </Sheet>
        )}
    </div>);
}

function Archivos({ setView }) { const [files, setFiles] = useState([]); const [loaded, setLoaded] = useState(false); const inputRef = useRef(null); useEffect(() => { (async () => { try { const r = await storage.get("bcm_archivos"); if (r?.value) setFiles(JSON.parse(r.value)); } catch {} setLoaded(true); })(); }, []); useEffect(() => { if (loaded) storage.set("bcm_archivos", JSON.stringify(files)).catch(() => {}); }, [files, loaded]); async function handleUp(e) { for (const f of Array.from(e.target.files)) { const url = await toDataUrl(f); setFiles(p => [...p, { id: uid(), nombre: f.name, ext: f.name.split(".").pop().toUpperCase(), url, fecha: new Date().toLocaleDateString("es-AR"), size: (f.size / 1024).toFixed(0) + "KB" }]); } e.target.value = ""; } return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}><AppHeader title="Archivos" back onBack={() => setView("mas")} right={<><input type="file" ref={inputRef} multiple onChange={handleUp} style={{ display: "none" }} /><PlusBtn onClick={() => inputRef.current?.click()} /></>} /><div style={{ padding: "12px 18px" }}>{files.length === 0 ? <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Subí tu primer archivo</div> : files.map(f => (<div key={f.id} style={{ display: "flex", alignItems: "center", gap: 11, background: T.card, border: `1px solid ${T.border}`, borderRadius: T.rsm, padding: "11px 13px", marginBottom: 7 }}><div style={{ width: 38, height: 38, borderRadius: 9, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 9, fontWeight: 800, color: T.accent }}>{f.ext}</span></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.nombre}</div><div style={{ fontSize: 10, color: T.muted }}>{f.size} · {f.fecha}</div></div><a href={f.url} download={f.nombre} style={{ textDecoration: "none" }}><button style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, width: 30, height: 30, fontSize: 13, color: T.sub, cursor: "pointer" }}>↓</button></a></div>))}</div></div>); }

function Seguimiento({ alerts, setAlerts, setView }) { function dismiss(id) { setAlerts(p => p.filter(a => a.id !== id)); } return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}><AppHeader title="Seguimiento" back onBack={() => setView("mas")} /><div style={{ padding: "14px 18px" }}>{["alta", "media"].map(prio => alerts.filter(a => a.prioridad === prio).length > 0 && (<div key={prio} style={{ marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 700, color: prio === "alta" ? "#EF4444" : "#F59E0B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{prio === "alta" ? "Crítico" : "Atención"}</div>{alerts.filter(a => a.prioridad === prio).map(a => (<div key={a.id} style={{ background: prio === "alta" ? "#FEF2F2" : "#FFFBEB", border: `1px solid ${prio === "alta" ? "#FECACA" : "#FDE68A"}`, borderRadius: 10, padding: "11px 13px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><div style={{ flex: 1, fontSize: 12, color: T.text, lineHeight: 1.4 }}>{a.msg}</div><button onClick={() => dismiss(a.id)} style={{ background: "none", border: "none", fontSize: 14, color: T.muted, cursor: "pointer" }}>✕</button></div>))}</div>))}{alerts.length === 0 && <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>✅ Todo en orden</div><div style={{ fontSize: 13, color: T.muted }}>Sin alertas</div></div>}</div></div>); }

function parseMontoNum(m) { if (!m) return 0; return parseFloat(String(m).replace(/[^0-9.]/g,'')) || 0; }
function ResumenView({ lics, obras, personal, alerts, setView }) {
    const kpis = [{ label: "Licitaciones", val: lics.filter(l => !['adjudicada', 'descartada'].includes(l.estado)).length, color: "#3B82F6" }, { label: "Obras activas", val: obras.filter(o => o.estado === "curso").length, color: "#10B981" }, { label: "Personal", val: personal.length, color: "#8B5CF6" }, { label: "Alertas", val: alerts.length, color: "#EF4444" }];
    const obrasEnCurso = obras.filter(o => o.estado === "curso");
    return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <AppHeader title="Resumen Ejecutivo" back onBack={() => setView("mas")} />
        <div style={{ padding: "14px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {kpis.map(k => (<Card key={k.label} style={{ padding: "14px", textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.val}</div><div style={{ fontSize: 10, color: T.muted, lineHeight: 1.3, marginTop: 2 }}>{k.label}</div></Card>))}
            </div>
            {obrasEnCurso.length > 0 && <Card style={{ padding: "14px 16px", marginBottom: 12 }}>
                <Lbl>Avance y presupuesto por obra</Lbl>
                {obrasEnCurso.map(o => {
                    const ec = OBRA_ESTADOS.find(e => e.id === o.estado) || OBRA_ESTADOS[0];
                    const lic = lics.find(l => l.id === o.lic_id);
                    const presupTotal = parseMontoNum(lic?.monto || o.monto);
                    const pagado = parseMontoNum(o.pagado || 0);
                    const pct = presupTotal > 0 ? Math.min(100, Math.round(pagado / presupTotal * 100)) : o.avance;
                    return (<div key={o.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{o.nombre}</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: ec.color }}>{o.avance}%</span>
                        </div>
                        <div style={{ height: 7, background: T.bg, borderRadius: 4, marginBottom: 6 }}>
                            <div style={{ height: 7, background: ec.color, borderRadius: 4, width: `${o.avance}%`, transition: "width .6s" }} />
                        </div>
                        {presupTotal > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                            <span style={{ color: T.muted }}>Presupuesto: <b style={{ color: T.text }}>${presupTotal.toLocaleString('es-AR')}</b></span>
                            <span style={{ color: pct > 80 ? "#EF4444" : "#10B981", fontWeight: 700 }}>Consumido: {pct}%</span>
                        </div>}
                        {presupTotal > 0 && pagado > 0 && <div style={{ marginTop: 3, fontSize: 11, color: T.muted }}>Pagado: <b style={{ color: "#EF4444" }}>${pagado.toLocaleString('es-AR')}</b> · Saldo: <b style={{ color: "#10B981" }}>${(presupTotal - pagado).toLocaleString('es-AR')}</b></div>}
                    </div>);
                })}
            </Card>}
        </div>
    </div>);
}

function MensajesView({ personal, setView, currentUser }) {
    const [sel, setSel] = useState(null);
    const [msgs, setMsgs] = useState([]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const taRef = useRef(null);
    const miUser = currentUser?.user || currentUser?.nombre || 'admin';

    // Cargar mensajes desde Supabase
    async function loadMsgs() {
        try {
            const r = await fetch(`${SUPA_URL}/rest/v1/bcm_mensajes?or=(de.eq.${encodeURIComponent(miUser)},para.eq.${encodeURIComponent(miUser)})&order=created_at.asc`, { headers: SH() });
            if (r.ok) { const d = await r.json(); setMsgs(d || []); }
        } catch {}
    }

    // Marcar como leídos
    async function marcarLeidos(deUser) {
        try {
            await fetch(`${SUPA_URL}/rest/v1/bcm_mensajes?para=eq.${encodeURIComponent(miUser)}&de=eq.${encodeURIComponent(deUser)}&leido=eq.false`, {
                method: 'PATCH', headers: { ...SH(), 'Prefer': 'return=minimal' },
                body: JSON.stringify({ leido: true })
            });
        } catch {}
    }

    useEffect(() => { loadMsgs(); const interval = setInterval(loadMsgs, 5000); return () => clearInterval(interval); }, []);
    useEffect(() => { setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 80); }, [sel, msgs]);

    async function sendMsg() {
        if (!msg.trim() || !sel || loading) return;
        setLoading(true);
        const texto = msg.trim();
        setMsg('');
        if (taRef.current) taRef.current.style.height = "22px";
        try {
            await fetch(`${SUPA_URL}/rest/v1/bcm_mensajes`, {
                method: 'POST', headers: { ...SH(), 'Prefer': 'return=minimal' },
                body: JSON.stringify({ de: miUser, para: sel.appUser || sel.nombre, texto })
            });
            await loadMsgs();
        } catch {}
        setLoading(false);
    }

    function ini(n) { return n.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase(); }

    // Mensajes no leídos por persona
    function unreadFrom(p) {
        const paraId = p.appUser || p.nombre;
        return msgs.filter(m => m.de === paraId && m.para === miUser && !m.leido).length;
    }

    if (sel) {
        const selId = sel.appUser || sel.nombre;
        const thread = msgs.filter(m => (m.de === miUser && m.para === selId) || (m.de === selId && m.para === miUser));
        marcarLeidos(selId);
        return (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: T.bg, zIndex: 5 }}>
                <AppHeader title={sel.nombre} sub={sel.rol} back onBack={() => { setSel(null); loadMsgs(); }} />
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", paddingBottom: 80 }}>
                    {thread.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Sin mensajes aún. ¡Escribí el primero!</div>}
                    {thread.map(m => {
                        const esMio = m.de === miUser;
                        return (<div key={m.id} style={{ marginBottom: 12, display: "flex", flexDirection: "column", alignItems: esMio ? "flex-end" : "flex-start" }}>
                            <div style={{ maxWidth: "82%", background: esMio ? T.accent : T.card, border: esMio ? "none" : `1px solid ${T.border}`, borderRadius: esMio ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 13px", color: esMio ? "#fff" : T.text, fontSize: 13, lineHeight: 1.5, boxShadow: T.shadow, whiteSpace: "pre-wrap" }}>{m.texto}</div>
                            <div style={{ fontSize: 10, color: T.muted, marginTop: 3 }}>{new Date(m.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}{!esMio && m.leido ? ' ✓✓' : ''}</div>
                        </div>);
                    })}
                    <div ref={scrollRef} />
                </div>
                <div style={{ position: "fixed", bottom: 58, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, padding: "10px 16px 10px", background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, alignItems: "flex-end", zIndex: 20, boxSizing: "border-box" }}>
                    <div style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 22, padding: "10px 14px" }}>
                        <textarea ref={taRef} rows={1} value={msg} onChange={e => { setMsg(e.target.value); const el = taRef.current; if (el) { el.style.height = "22px"; el.style.height = Math.min(el.scrollHeight, 80) + "px"; } }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }} placeholder="Escribí un mensaje..." style={{ width: "100%", background: "transparent", border: "none", color: T.text, fontSize: 14, lineHeight: 1.5, height: 22 }} />
                    </div>
                    <button onClick={sendMsg} disabled={!msg.trim() || loading} style={{ width: 42, height: 42, borderRadius: "50%", background: msg.trim() ? T.accent : "#E2E8F0", color: msg.trim() ? "#fff" : "#94A3B8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        {loading ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
            <AppHeader title="Mensajes internos" back onBack={() => setView("mas")} right={<button onClick={loadMsgs} style={{ background: T.bg, border: "none", borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: "pointer" }}>↻</button>} />
            <div style={{ padding: "14px 18px" }}>
                {personal.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 13 }}>Primero agregá personal en la sección Personal</div>}
                {personal.map(p => {
                    const unread = unreadFrom(p);
                    const selId = p.appUser || p.nombre;
                    const lastMsg = [...msgs].reverse().find(m => (m.de === miUser && m.para === selId) || (m.de === selId && m.para === miUser));
                    return (
                        <Card key={p.id} onClick={() => setSel(p)} style={{ padding: "13px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, background: unread > 0 ? T.accentLight : T.card }}>
                            <div style={{ position: "relative" }}>
                                <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: T.accent, flexShrink: 0 }}>{ini(p.nombre)}</div>
                                {unread > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, background: "#EF4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>{unread}</div>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: unread > 0 ? 800 : 700, color: T.text }}>{p.nombre}</div>
                                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{lastMsg ? lastMsg.texto.slice(0, 38) + (lastMsg.texto.length > 38 ? "..." : "") : p.rol + " · Sin mensajes"}</div>
                            </div>
                            {unread > 0 && <Badge color="#EF4444" bg="#FEF2F2">{unread} nuevo{unread > 1 ? 's' : ''}</Badge>}
                            <span style={{ fontSize: 14, color: T.muted }}>›</span>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

function ContactosView({ setView, onContactosChange }) { const [contacts, setContacts] = useState([]); const [showNew, setShowNew] = useState(false); const [form, setForm] = useState({ nombre: '', email: '', telefono: '', empresa: '', rol: '' }); const [loaded, setLoaded] = useState(false); useEffect(() => { (async () => { try { const r = await storage.get('bcm_contactos'); if (r?.value) setContacts(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []); useEffect(() => { if (loaded) { storage.set('bcm_contactos', JSON.stringify(contacts)).catch(() => { }); if (onContactosChange) onContactosChange(contacts); } }, [contacts, loaded]); function add() { if (!form.nombre || !form.email) return; setContacts(p => [...p, { ...form, id: uid() }]); setForm({ nombre: '', email: '', telefono: '', empresa: '', rol: '' }); setShowNew(false); } function ini(n) { return n.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase(); } const COLS = ["#1D4ED8", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]; return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}><AppHeader title="Contactos" back onBack={() => setView("mas")} right={<PlusBtn onClick={() => setShowNew(true)} />} /><div style={{ flex: 1, overflowY: "auto", padding: "12px 18px", paddingBottom: 80 }}>{contacts.length === 0 && <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📧</div><div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Sin contactos</div></div>}{contacts.map((c, i) => { const col = COLS[i % COLS.length]; return (<Card key={c.id} style={{ padding: "12px 14px", marginBottom: 8 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 42, height: 42, borderRadius: "50%", background: col + "18", border: `1.5px solid ${col}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: col, flexShrink: 0 }}>{ini(c.nombre)}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{c.nombre}</div>{(c.empresa || c.rol) && <div style={{ fontSize: 11, color: T.muted }}>{c.empresa}{c.rol ? ` · ${c.rol}` : ""}</div>}<div style={{ fontSize: 11, color: T.accent, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</div></div><div style={{ display: "flex", gap: 5, flexShrink: 0 }}><a href={`mailto:${c.email}`} style={{ textDecoration: "none" }}><button style={{ background: T.accentLight, border: `1px solid ${T.border}`, borderRadius: 8, width: 30, height: 30, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✉️</button></a>{c.telefono && <a href={`https://wa.me/${c.telefono}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><button style={{ background: "#DCF8C6", border: "1px solid #86EFAC", borderRadius: 8, width: 30, height: 30, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</button></a>}<button onClick={() => setContacts(p => p.filter(x => x.id !== c.id))} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, width: 30, height: 30, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button></div></div></Card>); })}</div>{showNew && <Sheet title="Nuevo contacto" onClose={() => setShowNew(false)}><Field label="Nombre *"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Carlos Méndez" /></Field><Field label="Email *"><TInput value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="cmendez@aa2000.com.ar" /></Field><FieldRow><Field label="Empresa"><TInput value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))} placeholder="AA2000" /></Field><Field label="Rol"><TInput value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))} placeholder="Inspector" /></Field></FieldRow><Field label="WhatsApp"><TInput value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value.replace(/\D/g, '') }))} placeholder="5491155556666" /></Field><PBtn full onClick={add} disabled={!form.nombre || !form.email}>Guardar</PBtn></Sheet>}</div>); }

function WhatsappGrupos({ personal, setView }) { const [grupos, setGrupos] = useState([]); const [showNew, setShowNew] = useState(false); const [form, setForm] = useState({ nombre: '', miembros: [] }); const [loaded, setLoaded] = useState(false); useEffect(() => { (async () => { try { const r = await storage.get('bcm_wa'); if (r?.value) setGrupos(JSON.parse(r.value)); } catch { } setLoaded(true); })(); }, []); useEffect(() => { if (loaded) storage.set('bcm_wa', JSON.stringify(grupos)).catch(() => { }); }, [grupos, loaded]); function addG() { if (!form.nombre) return; setGrupos(p => [...p, { ...form, id: uid(), fecha: new Date().toLocaleDateString('es-AR') }]); setForm({ nombre: '', miembros: [] }); setShowNew(false); } function toggle(pid) { setForm(f => ({ ...f, miembros: f.miembros.includes(pid) ? f.miembros.filter(m => m !== pid) : [...f.miembros, pid] })); } return (<div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}><AppHeader title="Grupos WhatsApp" back onBack={() => setView("mas")} right={<PlusBtn onClick={() => setShowNew(true)} />} /><div style={{ padding: "14px 18px" }}>{grupos.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 14 }}>Sin grupos</div>}{grupos.map(g => { const mbs = personal.filter(p => g.miembros.includes(p.id)); return (<Card key={g.id} style={{ padding: "14px", marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{g.nombre}</div><div style={{ fontSize: 11, color: "#25D366", marginBottom: 10, fontWeight: 600 }}>{mbs.length} miembro{mbs.length !== 1 ? "s" : ""}</div><div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>{mbs.map(m => (<div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, background: T.bg, borderRadius: 8, padding: "8px 10px" }}><div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: T.text }}>{m.nombre}<span style={{ color: T.muted, fontWeight: 400 }}> · {m.rol}</span></div>{m.telefono && <a href={`https://wa.me/${m.telefono}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><button style={{ background: "#25D366", border: "none", borderRadius: 7, width: 28, height: 28, cursor: "pointer", color: "white", fontSize: 12 }}>💬</button></a>}</div>))}</div><button onClick={() => setGrupos(p => p.filter(x => x.id !== g.id))} style={{ width: "100%", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: T.rsm, padding: "8px", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer" }}>Eliminar</button></Card>); })}</div>{showNew && <Sheet title="Nuevo grupo" onClose={() => setShowNew(false)}><Field label="Nombre"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Equipo Terminal A" /></Field><div style={{ marginBottom: 14 }}><Lbl>Miembros</Lbl>{personal.map(p => { const sel = form.miembros.includes(p.id); return (<div key={p.id} onClick={() => toggle(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, background: sel ? "#F0FFF4" : T.bg, border: `1.5px solid ${sel ? "#25D366" : T.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", marginBottom: 6 }}><div style={{ width: 24, height: 24, borderRadius: "50%", background: sel ? "#25D366" : T.border, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{sel ? "✓" : ""}</div><div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{p.nombre}<span style={{ color: T.muted, fontWeight: 400 }}> · {p.rol}</span></div></div>); })}</div><PBtn full onClick={addG} disabled={!form.nombre}>Crear grupo</PBtn></Sheet>}</div>); }

function speakText(text) {
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`~]/g, '').replace(/https?:\/\/\S+/g, '').replace(/📧[\s\S]*/, '').trim();

    function doSpeak() {
        const voices = window.speechSynthesis.getVoices();

        // Log para debug — se puede quitar
        // console.log('Voces disponibles:', voices.map(v=>v.name+' '+v.lang));

        // Candidatos masculinos en orden de preferencia
        const MALE_NAMES = ['Jorge', 'Carlos', 'Diego', 'Miguel', 'Antonio', 'Juan', 'Pablo', 'Andrés', 'Eduardo', 'Gustavo', 'Sergio', 'Daniel', 'Alejandro', 'Javier', 'Roberto', 'Martin', 'Felix', 'Google español', 'Español', 'Spanish'];
        const FEMALE_NAMES = ['Paulina', 'María', 'Laura', 'Sara', 'Carmen', 'Isabel', 'Google'];

        const esVoices = voices.filter(v =>
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
            chosen = esVoices.find(v => !FEMALE_NAMES.some(fn => v.name.toLowerCase().includes(fn.toLowerCase())));
        }

        // 3. Fallback: cualquier voz española
        if (!chosen && esVoices.length > 0) chosen = esVoices[0];

        const utt = new SpeechSynthesisUtterance(clean);
        utt.lang = 'es-AR';
        utt.rate = 0.95;   // un poco más lento, más natural
        utt.pitch = 0.75;  // más grave = más masculino
        utt.volume = 1;
        if (chosen) utt.voice = chosen;
        window.speechSynthesis.speak(utt);
    }

    if (window.speechSynthesis.getVoices().length > 0) { doSpeak(); }
    else { window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true }); }
}

function Chat({ contactos, lics, obras, personal, alerts, msgs, setMsgs, cfg, apiKey }) {
    const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [attachments, setAttachments] = useState([]); const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [listening, setListening] = useState(false); const [speaking, setSpeaking] = useState(false); const [autoSpeak, setAutoSpeak] = useState(true);
    const [userName, setUserName] = useState(''); const [nameInput, setNameInput] = useState(''); const [nameLoaded, setNameLoaded] = useState(false);
    const bottomRef = useRef(null); const taRef = useRef(null); const imgFileRef = useRef(null); const camRef = useRef(null); const anyFileRef = useRef(null); const recognitionRef = useRef(null);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

    // Cargar nombre guardado
    useEffect(() => {
        (async () => {
            try { const r = await storage.get('bcm_username'); if (r?.value) setUserName(r.value); } catch { }
            setNameLoaded(true);
        })();
    }, []);

    function saveName() {
        const n = nameInput.trim();
        if (!n) return;
        setUserName(n);
        storage.set('bcm_username', n).catch(() => { });
    }

    const [micError, setMicError] = useState('');
    const [micStatus, setMicStatus] = useState('idle');

    async function startListen() {
        setMicError('');
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { setMicError('Tu navegador no soporta micrófono. Usá Chrome.'); setMicStatus('error'); return; }
        try { setMicStatus('requesting'); await navigator.mediaDevices.getUserMedia({ audio: true }); }
        catch (err) {
            setMicStatus('error');
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') { setMicError('Permiso denegado. Habilitá el micrófono en el navegador.'); }
            else { setMicError('No se pudo acceder al micrófono: ' + err.message); }
            return;
        }
        window.speechSynthesis.cancel();
        const r = new SR();
        r.lang = 'es-AR'; r.continuous = false; r.interimResults = true; r.maxAlternatives = 1;
        r.onstart = () => { setListening(true); setMicStatus('listening'); setMicError(''); };
        r.onend = () => { setListening(false); setMicStatus('idle'); };
        r.onerror = e => {
            setListening(false); setMicStatus('error');
            const msgs_ = { aborted: 'Cancelado', audio: 'Sin audio detectado', 'network': 'Error de red', 'not-allowed': 'Permiso denegado', 'no-speech': 'No se detectó voz. Intentá de nuevo.' };
            setMicError(msgs_[e.error] || 'Error de micrófono: ' + e.error);
        };
        r.onresult = e => {
            const results = Array.from(e.results); const last = results[results.length - 1]; const tx = last[0].transcript;
            if (last.isFinal) { setInput(tx); setTimeout(() => sendVoice(tx), 80); } else { setInput(tx); }
        };
        recognitionRef.current = r;
        try { r.start(); } catch (e) { setMicStatus('error'); setMicError('No se pudo iniciar el micrófono.'); }
    }
    function stopListen() { recognitionRef.current?.stop(); }
    function stopSpeak() { window.speechSynthesis.cancel(); setSpeaking(false); }

    async function sendVoice(text) {
        const c = text.trim(); if (!c || loading) return;
        setInput(""); if (taRef.current) taRef.current.style.height = "22px";
        const userContent = [{ type: 'text', text: c }];
        const next = [...msgs, { role: "user", content: userContent, _snap: [], _text: c }]; setMsgs(next); setLoading(true);
        try {
            const sys = await buildContext();
            const r = await callAI(next.map(m => ({ role: m.role, content: m.content })), sys, apiKey);
            setMsgs([...next, { role: "assistant", content: [{ type: "text", text: r }] }]);
            if (autoSpeak) { setSpeaking(true); speakText(r); setTimeout(() => setSpeaking(false), r.length * 60 + 2000); }
        } catch { setMsgs([...next, { role: "assistant", content: [{ type: "text", text: "Error de conexión." }] }]); }
        setLoading(false);
    }
    async function handleAttach(e) { setShowAttachMenu(false); for (const f of Array.from(e.target.files)) { const dataUrl = await toDataUrl(f); const isImg = f.type.startsWith('image/'); setAttachments(p => [...p, { id: uid(), nombre: f.name, type: f.type, dataUrl, base64: getBase64(dataUrl), isImg, isPdf: f.type === 'application/pdf' }]); } e.target.value = ''; }
    async function buildContext() {
        let pm = [], ps = [], camaras = [], pres = {};
        try { const r1 = await storage.get('bcm_presup_materiales'); if (r1?.value) pm = JSON.parse(r1.value); const r2 = await storage.get('bcm_presup_subcontratos'); if (r2?.value) ps = JSON.parse(r2.value); const r3 = await storage.get('bcm_camaras'); if (r3?.value) camaras = JSON.parse(r3.value); const r4 = await storage.get('bcm_presentismo'); if (r4?.value) pres = JSON.parse(r4.value); } catch { }
        
        // Fetch real-time external data in parallel
        let dolarData = null, climaData = null;
        try {
            const [dolarRes, climaRes] = await Promise.allSettled([
                fetch('https://dolarapi.com/v1/dolares').then(r => r.ok ? r.json() : null),
                fetch('https://wttr.in/Buenos+Aires?format=j1').then(r => r.ok ? r.json() : null)
            ]);
            if (dolarRes.status === 'fulfilled') dolarData = dolarRes.value;
            if (climaRes.status === 'fulfilled') climaData = climaRes.value;
        } catch {}

        const today = new Date().toLocaleDateString('es-AR');
        const empresa = cfg?.empresa || 'BelfastCM'; const emailIA = cfg?.email || EMAIL_IA;
        let c = `Sos el Asistente IA de ${empresa}. Email: ${emailIA}${cfg?.cargo ? `\nCargo: ${cfg.cargo}` : ''}${cfg?.telefono ? `\nTel: ${cfg.telefono}` : ''}${cfg?.ciudad ? `\nSede: ${cfg.ciudad}` : ''}\n\n`;
        if (userName) c += `El usuario se llama ${userName}. Usá su nombre naturalmente en las respuestas para personalizar la experiencia.\n\n`;
        // Include pending tasks info
        const tareasP = personal.filter(p => (p.tareas||[]).some(t => !t.done));
        if (tareasP.length > 0) {
            c += `TAREAS PENDIENTES DEL EQUIPO:\n`;
            tareasP.forEach(p => {
                const pendientes = (p.tareas||[]).filter(t => !t.done);
                c += `- ${p.nombre} (${p.rol}): ${pendientes.map(t => t.txt).join(', ')}\n`;
            });
            c += `\nSi el usuario pregunta por el estado de tareas, podés informarle sobre estos pendientes y sugerir que los reclame.\n\n`;
        }
        c += `Especialista en obras en AA2000. Respondés en español rioplatense, profesional y preciso. Analizás pliegos, cotizás obras (UOCRA 2025), validás documentación y analizás fotos. Para mails agregás al final:\n---\n📧 PREPARADO PARA ENVÍO\nDe: ${emailIA}\nPara: [email]\nAsunto: [asunto]\n---\n\n`;
        c += `📋 LICITACIONES (${lics?.length || 0})\n`; lics?.forEach(l => { c += `• ${l.nombre} | ${AIRPORTS.find(a => a.id === l.ap)?.code} | ${LIC_ESTADOS.find(e => e.id === l.estado)?.label} | ${l.monto || '—'} | ${l.fecha || '—'}${l.sector ? ` | ${l.sector}` : ''}\n`; });
        c += `\n🏗 OBRAS (${obras?.length || 0})\n`; obras?.forEach(o => { c += `• ${o.nombre} | ${AIRPORTS.find(a => a.id === o.ap)?.code} | ${OBRA_ESTADOS.find(e => e.id === o.estado)?.label} | ${o.avance}% | ${o.sector || '—'} | ${o.inicio || '—'}→${o.cierre || '—'}\n`; if (o.obs?.length) o.obs.forEach(n => c += `  [${n.fecha}] ${n.txt}\n`); if (o.fotos?.length) c += `  Fotos: ${o.fotos.length}\n`; });
        c += `\n👷 PERSONAL (${personal?.length || 0})\n`; personal?.forEach(p => { c += `• ${p.nombre} | ${p.rol} | ${p.empresa || '—'}${p.telefono ? ` | +${p.telefono}` : ''}\n`; DOC_TYPES.forEach(d => { const doc = p.docs?.[d.id]; if (doc) { const dias = doc.vence ? daysSince(doc.vence) : null; const st = dias === null ? '✓' : (dias <= 0 ? '🔴VENCIDO' : (dias <= 30 ? `⚠ vence en ${dias}d` : '✓')); c += `  ${d.label}: ${st}\n`; } else c += `  ${d.label}: ❌FALTA\n`; }); });
        if (alerts?.length) { c += `\n⚠️ ALERTAS\n`; alerts.forEach(a => c += `• [${a.prioridad.toUpperCase()}] ${a.msg}\n`); }
        if (pm.length) { c += `\n📦 MATERIALES\n`; pm.forEach(i => c += `• ${i.descripcion} | ${i.proveedor || '—'} | ${i.monto || '—'} | ${i.estado}\n`); c += `  TOTAL: $${pm.reduce((s, i) => s + (parseFloat((i.monto || '').replace(/[^0-9.]/g, '')) || 0), 0).toLocaleString('es-AR')}\n`; }
        if (ps.length) { c += `\n🤝 SUBCONTRATOS\n`; ps.forEach(i => c += `• ${i.descripcion} | ${i.proveedor || '—'} | ${i.monto || '—'} | ${i.estado}\n`); c += `  TOTAL: $${ps.reduce((s, i) => s + (parseFloat((i.monto || '').replace(/[^0-9.]/g, '')) || 0), 0).toLocaleString('es-AR')}\n`; }
        if (contactos?.length) { c += `\n📧 CONTACTOS\n`; contactos.forEach(x => c += `• ${x.nombre} | ${x.empresa || ''} | ${x.email}\n`); }

        // Real-time external data
        if (dolarData?.length) {
            c += `\n💵 COTIZACIÓN DÓLAR (tiempo real)\n`;
            const tipos = { oficial: 'Oficial', blue: 'Blue', bolsa: 'Bolsa/MEP', contadoconliqui: 'CCL', tarjeta: 'Tarjeta' };
            dolarData.filter(d => tipos[d.casa]).forEach(d => {
                c += `• ${tipos[d.casa]}: Compra $${d.compra?.toLocaleString('es-AR')} / Venta $${d.venta?.toLocaleString('es-AR')}\n`;
            });
        }
        if (climaData) {
            const cur = climaData.current_condition?.[0];
            const w = climaData.weather?.[0];
            if (cur) c += `\n🌤 CLIMA BUENOS AIRES (tiempo real)\nActual: ${cur.temp_C}°C, ${cur.weatherDesc?.[0]?.value}, Humedad ${cur.humidity}%, Viento ${cur.windspeedKmph}km/h\n`;
            if (w) c += `Hoy: Máx ${w.maxtempC}°C / Mín ${w.mintempC}°C, Lluvia ${w.hourly?.[4]?.chanceofrain || 0}%\n`;
        }
        if (camaras.length) { c += `\n📹 CÁMARAS (${camaras.length})\n`; }
        const todayRecs = Object.entries(pres.registros || {}).filter(([k]) => k.endsWith(today)).map(([, v]) => v);
        if (todayRecs.length) { c += `\n🕐 PRESENTISMO HOY\n`; todayRecs.forEach(r => c += `• ${r.nombre}: ${r.entrada}${r.salida ? `–${r.salida}` : '(en obra)'}\n`); }
        return c;
    }
    async function send(text) {
        const c = (text || input).trim();
        if ((!c && !attachments.length) || loading) return;
        setInput(""); if (taRef.current) taRef.current.style.height = "22px"; setShowAttachMenu(false);
        const userContent = [];
        attachments.forEach(a => { if (a.isImg) userContent.push({ type: 'image', source: { type: 'base64', media_type: a.type || 'image/jpeg', data: a.base64 } }); else if (a.isPdf) userContent.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: a.base64 } }); });
        if (c) userContent.push({ type: 'text', text: c }); else userContent.push({ type: 'text', text: "Analizá este contenido." });
        const snapAtt = [...attachments]; setAttachments([]);
        const next = [...msgs, { role: "user", content: userContent, _snap: snapAtt, _text: c }]; setMsgs(next); setLoading(true);
        try {
            const sys = await buildContext(); const r = await callAI(next.map(m => ({ role: m.role, content: m.content })), sys, apiKey); setMsgs([...next, { role: "assistant", content: [{ type: "text", text: r }] }]);
            if (autoSpeak) { setSpeaking(true); speakText(r); setTimeout(() => setSpeaking(false), r.length * 60 + 2000); }
        }
        catch { setMsgs([...next, { role: "assistant", content: [{ type: "text", text: "Error de conexión." }] }]); }
        setLoading(false);
    }
    function mailBlock(text) { const m = text.match(/📧 PREPARADO PARA ENVÍO[\s\S]*?Para:\s*([^\n]+)[\s\S]*?Asunto:\s*([^\n]+)/i); return m ? { para: m[1].trim(), asunto: m[2].trim() } : null; }
    const titulo = cfg?.tituloAsistente || `Asistente ${cfg?.empresa || 'BelfastCM'}`;
    const subtitulo = cfg?.subtituloAsistente || "Lee todos los datos de la app en tiempo real";
    const QUICK = userName
        ? [`¿Qué obras tenemos activas, ${userName}?`, `¿Qué documentación le falta al personal?`, `Resumen del avance de todas las obras`, `Total de materiales y subcontratos`]
        : ["¿Estado de todas mis obras y licitaciones?", "¿Qué documentación le falta al personal?", "Resumen del avance de todas las obras activas", "Total de materiales y subcontratos cargados"];

    // Pantalla de bienvenida / pedir nombre
    const WelcomeScreen = () => {
        if (!nameLoaded) return null;
        // Si ya tiene nombre: mostrar pantalla principal con micrófono
        if (userName) {
            return (<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 24px 0" }}>
                <div style={{ marginBottom: 6, fontSize: 13, color: T.muted, fontWeight: 500 }}>Hola, <strong style={{ color: T.text }}>{userName}</strong> 👋</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 4, textAlign: "center" }}>{titulo}</div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 28, textAlign: "center" }}>{subtitulo}</div>

                {/* Botón micrófono grande central */}
                <button onClick={listening ? stopListen : startListen} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", marginBottom: 28 }}>
                    <div style={{ width: 120, height: 120, borderRadius: 28, background: T.card, border: `2.5px solid ${listening ? "#EF4444" : "#111"}`, boxShadow: listening ? `0 0 0 6px rgba(239,68,68,.15),0 6px 24px rgba(0,0,0,.12)` : `0 6px 24px rgba(0,0,0,.1)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "all .3s", overflow: "hidden" }}>
                        {listening && <div style={{ position: "absolute", inset: -6, borderRadius: 34, border: "3px solid #EF4444", opacity: .35, animation: "pulse 1s ease infinite" }} />}
                        {listening && <div style={{ position: "absolute", inset: -14, borderRadius: 42, border: "2px solid #EF4444", opacity: .15, animation: "pulse 1s ease .3s infinite" }} />}
                        {cfg?.logoCentral
                            ? <img src={cfg.logoCentral} alt="logo" style={{ width: "78%", height: "78%", objectFit: "contain" }} />
                            : <svg width="56" height="56" viewBox="0 0 24 24" fill={listening ? "#EF4444" : T.accent} style={{ transition: "fill .3s" }}>
                                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={listening ? "#EF4444" : T.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                <line x1="12" y1="19" x2="12" y2="23" stroke={listening ? "#EF4444" : T.accent} strokeWidth="1.5" strokeLinecap="round" />
                                <line x1="8" y1="23" x2="16" y2="23" stroke={listening ? "#EF4444" : T.accent} strokeWidth="1.5" strokeLinecap="round" />
                            </svg>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: listening ? "#EF4444" : T.accent }}>
                        {listening ? t(cfg, 'chat_escuchando') : "Tocar para hablar"}
                    </div>
                </button>

                {listening && input && <div style={{ fontSize: 13, color: T.accent, fontStyle: "italic", textAlign: "center", marginBottom: 16, padding: "8px 16px", background: T.accentLight, borderRadius: 12 }}>"{input}"</div>}
                {micError && <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "8px 12px", marginBottom: 12, width: "100%" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                    <span style={{ fontSize: 11, color: "#EF4444", flex: 1 }}>{micError}</span>
                    <button onClick={() => { setMicError(''); setMicStatus('idle'); }} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 14, cursor: "pointer" }}>×</button>
                </div>}

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7 }}>
                    {QUICK.map((q, i) => (<button key={i} onClick={() => send(q)} style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: T.r, padding: "11px 14px", textAlign: "left", fontSize: 12, color: T.text, fontWeight: 500, boxShadow: T.shadow, cursor: "pointer" }}>{q}</button>))}
                </div>
                <button onClick={() => { setUserName(''); storage.set('bcm_username', '').catch(() => { }); }} style={{ marginTop: 18, fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>No soy {userName}</button>
            </div>);
        }

        // Si NO tiene nombre: pantalla para pedirlo
        return (<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px" }}>
            <div style={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                {cfg?.logoCentral
                    ? <img src={cfg.logoCentral} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <svg width="80" height="80" viewBox="0 0 24 24" fill={T.accent}>
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                        <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={T.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        <line x1="12" y1="19" x2="12" y2="23" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="8" y1="23" x2="16" y2="23" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 6, textAlign: "center" }}>{titulo}</div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 28, textAlign: "center", lineHeight: 1.6 }}>Antes de empezar,<br />¿cómo te llamás?</div>
            <div style={{ width: "100%", marginBottom: 12 }}>
                <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    placeholder="Escribí tu nombre..."
                    autoFocus
                    style={{ width: "100%", background: T.bg, border: `2px solid ${T.accent}`, borderRadius: T.r, padding: "14px 16px", fontSize: 16, color: T.text, textAlign: "center", fontWeight: 600 }}
                />
            </div>
            <PBtn full onClick={saveName} disabled={!nameInput.trim()}>Comenzar →</PBtn>
        </div>);
    };

    const VoiceBar = () => (<div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "7px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={listening ? stopListen : startListen} disabled={micStatus === 'requesting'} style={{ display: "flex", alignItems: "center", gap: 6, background: listening ? "#EF4444" : micStatus === 'requesting' ? "#94A3B8" : T.accent, border: "none", borderRadius: 20, padding: "7px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: micStatus === 'requesting' ? "not-allowed" : "pointer", flexShrink: 0 }}>
                {micStatus === 'requesting'
                    ? <><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse .6s ease infinite" }} />Activando…</>
                    : listening
                        ? <><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse .6s ease infinite" }} />{t(cfg, 'chat_escuchando')}</>
                        : <><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /><line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>{t(cfg, 'chat_hablar')}</>}
            </button>
            {speaking && <button onClick={stopSpeak} style={{ display: "flex", alignItems: "center", gap: 5, background: "#F59E0B", border: "none", borderRadius: 20, padding: "7px 12px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>{t(cfg, 'chat_pausar')}
            </button>}
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{t(cfg, 'chat_voz_auto')}</span>
                <div onClick={() => setAutoSpeak(v => !v)} style={{ width: 34, height: 18, borderRadius: 9, background: autoSpeak ? T.accent : "#CBD5E1", cursor: "pointer", position: "relative", transition: "background .2s" }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: autoSpeak ? 18 : 2, transition: "left .2s" }} />
                </div>
            </div>
        </div>
        {micError && <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "6px 10px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
            <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, flex: 1 }}>{micError}</span>
            <button onClick={() => { setMicError(''); setMicStatus('idle'); }} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 14, cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
        </div>}
        {listening && input && <div style={{ fontSize: 12, color: T.accent, fontStyle: "italic", paddingLeft: 4, animation: "pulse 1s ease infinite" }}>"{input}"</div>}
    </div>);

    return (<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
        {!apiKey && <div style={{ background: "#FFFBEB", borderBottom: "1px solid #FDE68A", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#D97706"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
            <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600, flex: 1 }}>Falta la API Key — ingresala en Más → Configuración → Cuenta</span>
        </div>}
        {msgs.length > 0 && <VoiceBar />}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {msgs.length === 0 ? (<WelcomeScreen />) : (
                <div style={{ padding: "14px 18px 0" }}>
                    {msgs.map((m, i) => {
                        const txt = Array.isArray(m.content) ? m.content.filter(b => b.type === 'text').map(b => b.text).join('\n') : m.content; const mb = m.role === "assistant" ? mailBlock(txt) : null; const dispTxt = mb ? txt.replace(/---\s*📧[\s\S]*/i, '').trim() : txt; const imgs = m._snap?.filter(a => a.isImg) || []; const docs = m._snap?.filter(a => !a.isImg) || []; return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                                {m.role !== "user" && <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 3, paddingLeft: 4 }}>{cfg?.empresa || 'BelfastCM'} IA</div>}
                                {m.role === "user" && imgs.length > 0 && <div style={{ display: "flex", gap: 5, marginBottom: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>{imgs.map(a => (<img key={a.id} src={a.dataUrl} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: `1.5px solid ${T.border}` }} />))}</div>}
                                {m.role === "user" && docs.length > 0 && <div style={{ display: "flex", gap: 5, marginBottom: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>{docs.map(a => (<div key={a.id} style={{ background: T.accentLight, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: T.accent, fontWeight: 600 }}>📄 {a.nombre.slice(0, 20)}</div>))}</div>}
                                {(dispTxt || m.role === 'assistant') && <div style={{ maxWidth: "87%", padding: "11px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? T.accent : T.card, color: m.role === "user" ? "#fff" : T.text, fontSize: 13, lineHeight: 1.65, boxShadow: m.role === "user" ? "0 2px 8px rgba(0,0,0,.2)" : T.shadow, border: m.role === "user" ? "none" : `1px solid ${T.border}`, whiteSpace: "pre-wrap" }}>{dispTxt}{m.role === 'assistant' && dispTxt && <button onClick={() => { speakText(dispTxt); setSpeaking(true); }} title="Escuchar" style={{ display: "inline-flex", alignItems: "center", marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: T.muted, verticalAlign: "middle", padding: 0 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" /></svg></button>}</div>}
                                {mb && <div style={{ maxWidth: "87%", marginTop: 6, background: "#ECFDF5", border: "1px solid #86EFAC", borderRadius: 12, padding: "12px 14px" }}><div style={{ fontSize: 11, color: "#15803D", fontWeight: 700, marginBottom: 6 }}>📧 Email listo</div><div style={{ fontSize: 11, color: T.text, marginBottom: 2 }}>Para: <strong>{mb.para}</strong></div><div style={{ fontSize: 11, color: T.text, marginBottom: 8 }}>Asunto: <strong>{mb.asunto}</strong></div><a href={`mailto:${mb.para}?subject=${encodeURIComponent(mb.asunto)}&body=${encodeURIComponent(dispTxt)}`} style={{ display: "block", textDecoration: "none" }}><button style={{ width: "100%", background: "#10B981", border: "none", borderRadius: 9, padding: "9px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>✉️ Abrir cliente de correo</button></a></div>}
                            </div>);
                    })}
                    {loading && <div style={{ display: "flex", gap: 5, padding: "6px 4px", marginBottom: 10 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.muted, animation: `pulse 1.2s ease ${i * .2}s infinite` }} />)}</div>}
                    <div ref={bottomRef} style={{ height: 14 }} />
                </div>
            )}
        </div>
        {attachments.length > 0 && (<div style={{ background: T.card, borderTop: `1px solid ${T.border}`, padding: "8px 16px", display: "flex", gap: 8, overflowX: "auto" }}>{attachments.map(a => (<div key={a.id} style={{ position: "relative", flexShrink: 0 }}>{a.isImg ? <img src={a.dataUrl} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: `1.5px solid ${T.border}` }} /> : <div style={{ width: 56, height: 56, background: T.accentLight, border: `1px solid ${T.border}`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}><span style={{ fontSize: 8, fontWeight: 800, color: T.accent }}>{a.nombre.split('.').pop().toUpperCase()}</span><span style={{ fontSize: 7, color: T.sub, textAlign: "center", padding: "0 3px" }}>{a.nombre.slice(0, 10)}</span></div>}<button onClick={() => setAttachments(p => p.filter(x => x.id !== a.id))} style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#EF4444", border: "none", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>×</button></div>))}</div>)}
        <div style={{ padding: "8px 14px calc(max(14px,env(safe-area-inset-bottom)) + 70px)", background: T.card, borderTop: `1px solid ${T.border}`, position: "relative" }}>
            {showAttachMenu && (<div style={{ position: "absolute", bottom: "100%", left: 14, background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: "0 -4px 20px rgba(0,0,0,.1)", padding: "8px", display: "flex", gap: 6, zIndex: 10 }}>
                <input ref={camRef} type="file" accept="image/*" capture="environment" multiple onChange={e => handleAttach(e)} style={{ display: "none" }} />
                <input ref={imgFileRef} type="file" accept="image/*" multiple onChange={e => handleAttach(e)} style={{ display: "none" }} />
                <input ref={anyFileRef} type="file" accept=".pdf,.docx,.doc,.xlsx,.xls,.txt" multiple onChange={e => handleAttach(e)} style={{ display: "none" }} />
                {[{ icon: "📷", label: "Cámara", ref: camRef }, { icon: "🖼️", label: "Imagen", ref: imgFileRef }, { icon: "📄", label: "Archivo", ref: anyFileRef }].map(opt => (<button key={opt.label} onClick={() => opt.ref.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}><span style={{ fontSize: 22 }}>{opt.icon}</span><span style={{ fontSize: 10, fontWeight: 600, color: T.sub }}>{opt.label}</span></button>))}
            </div>)}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <button onClick={() => setShowAttachMenu(p => !p)} style={{ width: 40, height: 40, borderRadius: "50%", background: showAttachMenu ? T.accent : T.bg, border: `1.5px solid ${showAttachMenu ? T.accent : T.border}`, color: showAttachMenu ? "#fff" : T.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div style={{ flex: 1, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 22, padding: "10px 14px" }}><textarea ref={taRef} rows={1} value={input} placeholder={t(cfg, 'chat_placeholder')} onChange={e => { setInput(e.target.value); const el = taRef.current; if (el) { el.style.height = "22px"; el.style.height = Math.min(el.scrollHeight, 100) + "px"; } }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} style={{ width: "100%", background: "transparent", border: "none", color: T.text, fontSize: 14, lineHeight: 1.5, height: 22 }} /></div>
                <button onClick={listening ? stopListen : startListen} style={{ width: 42, height: 42, borderRadius: "50%", background: listening ? "#EF4444" : T.bg, border: `1.5px solid ${listening ? "#EF4444" : T.border}`, color: listening ? "#fff" : T.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", position: "relative" }}>
                    {listening && <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "2px solid #EF4444", animation: "pulse 1s ease infinite", opacity: .5 }} />}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /><line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <button onClick={() => send()} disabled={(!input.trim() && !attachments.length) || loading} style={{ width: 42, height: 42, borderRadius: "50%", background: (input.trim() || attachments.length) && !loading ? T.accent : "#E2E8F0", color: (input.trim() || attachments.length) && !loading ? "#fff" : "#94A3B8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
        </div>
    </div>);
}

const DEMO_LICS = [];
const DEMO_OBRAS = [];
const DEMO_PERSONAL = [];
const DEMO_ALERTS = [];

function InfoUtilView({ setView }) {
    const [dolar, setDolar] = useState(null);
    const [clima, setClima] = useState(null);
    const [loadingD, setLoadingD] = useState(false);
    const [loadingC, setLoadingC] = useState(false);
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);

    useEffect(() => {
        // Get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(p => { setLat(p.coords.latitude); setLon(p.coords.longitude); }, () => { setLat(-34.6037); setLon(-58.3816); });
        } else { setLat(-34.6037); setLon(-58.3816); }
    }, []);

    useEffect(() => {
        // Fetch dólar
        setLoadingD(true);
        fetch('https://dolarapi.com/v1/dolares')
            .then(r => r.json())
            .then(d => { setDolar(d); setLoadingD(false); })
            .catch(() => setLoadingD(false));
    }, []);

    useEffect(() => {
        if (!lat || !lon) return;
        setLoadingC(true);
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weathercode,windspeed_10m&daily=precipitation_sum,weathercode&timezone=auto&forecast_days=7`)
            .then(r => r.json())
            .then(d => { setClima(d); setLoadingC(false); })
            .catch(() => setLoadingC(false));
    }, [lat, lon]);

    const WX = {0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',48:'🌫',51:'🌦',53:'🌦',55:'🌧',61:'🌧',63:'🌧',65:'🌧',71:'🌨',73:'🌨',75:'🌨',80:'🌦',81:'🌧',82:'⛈',95:'⛈',96:'⛈',99:'⛈'};
    const wxIcon = code => WX[code] || '🌡';
    const wxLabel = code => { if(code===0) return 'Despejado'; if(code<=2) return 'Parcial'; if(code<=3) return 'Nublado'; if(code<=48) return 'Niebla'; if(code<=55) return 'Llovizna'; if(code<=65) return 'Lluvia'; if(code<=75) return 'Nieve'; if(code<=82) return 'Lluvias'; return 'Tormenta'; };
    const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

    const dolarTypes = dolar ? [
        dolar.find(d => d.casa === 'oficial'),
        dolar.find(d => d.casa === 'blue'),
        dolar.find(d => d.casa === 'bolsa'),
        dolar.find(d => d.casa === 'contadoconliqui'),
    ].filter(Boolean) : [];

    const dolarLabels = { oficial: 'Oficial', blue: 'Blue', bolsa: 'MEP', contadoconliqui: 'CCL' };

    return (
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
            <AppHeader title="Info útil" back onBack={() => setView('mas')} />
            <div style={{ padding: '14px 18px' }}>
                {/* DÓLAR */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>💵 Cotización del dólar</div>
                    {loadingD ? <div style={{ textAlign: 'center', padding: 20, color: T.muted }}>Cargando...</div> :
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {dolarTypes.map(d => (
                            <Card key={d.casa} style={{ padding: '12px 14px' }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase' }}>{dolarLabels[d.casa] || d.nombre}</div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: T.accent, marginTop: 4 }}>${d.venta?.toLocaleString('es-AR')}</div>
                                <div style={{ fontSize: 10, color: T.muted }}>Compra: ${d.compra?.toLocaleString('es-AR')}</div>
                            </Card>
                        ))}
                        {!dolar && !loadingD && <div style={{ gridColumn: '1/-1', color: T.muted, fontSize: 12, textAlign: 'center', padding: 12 }}>Sin datos disponibles</div>}
                    </div>}
                </div>

                {/* CLIMA */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>🌤 Clima y pronóstico</div>
                    {loadingC ? <div style={{ textAlign: 'center', padding: 20, color: T.muted }}>Cargando...</div> :
                    clima ? <>
                        <Card style={{ padding: '14px 16px', marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ fontSize: 48 }}>{wxIcon(clima.current?.weathercode)}</div>
                                <div>
                                    <div style={{ fontSize: 32, fontWeight: 800, color: T.text }}>{Math.round(clima.current?.temperature_2m)}°C</div>
                                    <div style={{ fontSize: 13, color: T.muted }}>{wxLabel(clima.current?.weathercode)} · Viento {Math.round(clima.current?.windspeed_10m)} km/h</div>
                                    {clima.current?.precipitation > 0 && <div style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, marginTop: 2 }}>💧 Precipitación: {clima.current.precipitation} mm</div>}
                                </div>
                            </div>
                        </Card>
                        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                            {(clima.daily?.time || []).slice(0, 7).map((fecha, i) => {
                                const d = new Date(fecha + 'T12:00:00');
                                const lluvia = clima.daily?.precipitation_sum?.[i] || 0;
                                return (
                                    <div key={fecha} style={{ minWidth: 54, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '8px 6px', textAlign: 'center', flexShrink: 0, borderTop: `3px solid ${lluvia > 3 ? '#3B82F6' : lluvia > 0 ? '#93C5FD' : '#10B981'}` }}>
                                        <div style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>{DIAS[d.getDay()]}</div>
                                        <div style={{ fontSize: 22, margin: '4px 0' }}>{wxIcon(clima.daily?.weathercode?.[i])}</div>
                                        {lluvia > 0 && <div style={{ fontSize: 10, color: '#3B82F6', fontWeight: 700 }}>{lluvia.toFixed(0)}mm</div>}
                                        {lluvia === 0 && <div style={{ fontSize: 9, color: '#10B981', fontWeight: 600 }}>Sin lluvia</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </> : <div style={{ color: T.muted, fontSize: 12, textAlign: 'center', padding: 12 }}>Sin datos de clima</div>}
                </div>

                {/* MAPAS */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>🗺 Mapas y navegación</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/512px-Google_Maps_Logo_2020.svg.png', label: 'Google Maps', url: `https://www.google.com/maps/@${lat||'-34.6037'},${lon||'-58.3816'},15z`, color: '#4285F4' },
                            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/512px-Google_Maps_Logo_2020.svg.png', label: 'Tráfico', url: `https://www.google.com/maps/@${lat||'-34.6037'},${lon||'-58.3816'},15z/data=!5m1!1e1`, color: '#EA4335', badge: '🚦' },
                            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Google_Earth_Logo.png/240px-Google_Earth_Logo.png', label: 'Google Earth', url: `https://earth.google.com/web/@${lat||'-34.6037'},${lon||'-58.3816'},500a,1000d,35y,0h,0t,0r`, color: '#34A853' },
                            { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Waze_2022.svg/240px-Waze_2022.svg.png', label: 'Waze', url: 'https://waze.com/ul', color: '#33CCFF' },
                        ].map(m => (
                            <a key={m.label} href={m.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Card style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}>
                                    <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, position: 'relative' }}>
                                        <img src={m.img} alt={m.label} style={{ height: 40, objectFit: 'contain' }} onError={e => e.target.style.display='none'} />
                                        {m.badge && <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 16 }}>{m.badge}</span>}
                                    </div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.label}</div>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


function GanttView({ obras, setView }) {
    const [climaData, setClimaData] = useState(null);
    const [sel, setSel] = useState(obras.find(o => o.estado === 'curso')?.id || '');

    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            p => {
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.coords.latitude}&longitude=${p.coords.longitude}&daily=precipitation_sum,weathercode&timezone=auto&forecast_days=14`)
                    .then(r => r.json()).then(setClimaData).catch(() => {});
            },
            () => {
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816&daily=precipitation_sum,weathercode&timezone=auto&forecast_days=14`)
                    .then(r => r.json()).then(setClimaData).catch(() => {});
            }
        );
    }, []);

    const obra = obras.find(o => o.id === sel);
    const hoy = new Date();
    const dias = Array.from({ length: 14 }, (_, i) => { const d = new Date(hoy); d.setDate(hoy.getDate() + i); return d; });
    const DIAS = ['D','L','M','X','J','V','S'];

    function getRain(i) {
        if (!climaData?.daily?.precipitation_sum) return 0;
        return climaData.daily.precipitation_sum[i] || 0;
    }
    function getWxCode(i) { return climaData?.daily?.weathercode?.[i] || 0; }
    const isRainy = code => code >= 51;

    return (
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
            <AppHeader title="Diagrama de Gantt" back onBack={() => setView('mas')} />
            <div style={{ padding: '14px 18px' }}>
                {obras.filter(o => o.estado === 'curso').length > 0 &&
                    <div style={{ marginBottom: 12 }}>
                        <Lbl>Obra</Lbl>
                        <Sel value={sel} onChange={e => setSel(e.target.value)}>
                            {obras.filter(o => o.estado === 'curso').map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                        </Sel>
                    </div>
                }

                {/* Pronóstico 14 días */}
                <Card style={{ padding: '14px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 10 }}>🌤 Próximos 14 días — impacto en obra</div>
                    <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 6 }}>
                        {dias.map((d, i) => {
                            const lluvia = getRain(i);
                            const rain = isRainy(getWxCode(i));
                            const bg = lluvia > 5 ? '#DBEAFE' : lluvia > 0 ? '#EFF6FF' : '#F0FDF4';
                            const border = lluvia > 5 ? '#3B82F6' : lluvia > 0 ? '#93C5FD' : '#86EFAC';
                            return (
                                <div key={i} style={{ minWidth: 38, background: bg, border: `1.5px solid ${border}`, borderRadius: 8, padding: '6px 4px', textAlign: 'center', flexShrink: 0 }}>
                                    <div style={{ fontSize: 9, color: T.muted, fontWeight: 600 }}>{DIAS[d.getDay()]}</div>
                                    <div style={{ fontSize: 9, color: T.muted }}>{d.getDate()}/{d.getMonth()+1}</div>
                                    <div style={{ fontSize: 18, margin: '3px 0' }}>{rain ? '🌧' : '☀️'}</div>
                                    {lluvia > 0 ? <div style={{ fontSize: 9, color: '#3B82F6', fontWeight: 700 }}>{lluvia.toFixed(0)}mm</div>
                                        : <div style={{ fontSize: 9, color: '#10B981', fontWeight: 600 }}>OK</div>}
                                    {lluvia > 3 && <div style={{ fontSize: 8, color: '#EF4444', fontWeight: 700, marginTop: 2 }}>⚠ LLUVIA</div>}
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11, color: T.muted, display: 'flex', gap: 12 }}>
                        <span>🌧 Días con lluvia: <b style={{ color: '#3B82F6' }}>{dias.filter((_, i) => isRainy(getWxCode(i))).length}</b></span>
                        <span>☀️ Días hábiles: <b style={{ color: '#10B981' }}>{dias.filter((_, i) => !isRainy(getWxCode(i)) && [1,2,3,4,5].includes(dias[i].getDay())).length}</b></span>
                    </div>
                </Card>

                {/* Tareas de la obra */}
                {obra && (
                    <Card style={{ padding: '14px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 10 }}>📋 {obra.nombre} — Avance {obra.avance}%</div>
                        <div style={{ height: 8, background: T.bg, borderRadius: 4, marginBottom: 12 }}>
                            <div style={{ height: 8, background: T.accent, borderRadius: 4, width: `${obra.avance}%` }} />
                        </div>
                        {obra.obs?.slice(-5).map(o => (
                            <div key={o.id} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12 }}>
                                <span style={{ color: T.muted, flexShrink: 0 }}>{o.fecha}</span>
                                <span style={{ color: T.text }}>{o.txt}</span>
                            </div>
                        ))}
                        {(!obra.obs || obra.obs.length === 0) && <div style={{ color: T.muted, fontSize: 12 }}>Sin notas de avance</div>}
                    </Card>
                )}
            </div>
        </div>
    );
}


function InfoExternaView({ setView }) {
    const [dolar, setDolar] = useState(null);
    const [clima, setClima] = useState(null);
    const [loadingD, setLoadingD] = useState(true);
    const [loadingC, setLoadingC] = useState(false);
    const [ciudad, setCiudad] = useState('Buenos Aires');
    const [ciudadInput, setCiudadInput] = useState('Buenos Aires');

    useEffect(() => {
        fetch('https://dolarapi.com/v1/dolares')
            .then(r => r.json())
            .then(data => { setDolar(data); setLoadingD(false); })
            .catch(() => { setDolar(null); setLoadingD(false); });
    }, []);

    function buscarClima() {
        setLoadingC(true);
        setCiudad(ciudadInput);
        fetch(`https://wttr.in/${encodeURIComponent(ciudadInput)}?format=j1`)
            .then(r => r.json())
            .then(data => { setClima(data); setLoadingC(false); })
            .catch(() => { setClima(null); setLoadingC(false); });
    }

    useEffect(() => { buscarClima(); }, []);

    const cur = clima?.current_condition?.[0];
    const w3 = clima?.weather?.slice(0, 3) || [];

    const TIPOS_DOLAR = { oficial: '🏦 Oficial', blue: '💵 Blue', bolsa: '📊 Bolsa (MEP)', contadoconliqui: '🔄 CCL', mayorista: '🏢 Mayorista', cripto: '₿ Cripto', tarjeta: '💳 Tarjeta' };

    return (
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
            <AppHeader title="Info externa" back onBack={() => setView('mas')} />
            <div style={{ padding: '14px 18px' }}>

                {/* DÓLAR */}
                <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>💵 Cotización del dólar</div>
                {loadingD && <div style={{ textAlign: 'center', padding: '20px', color: T.muted }}>Cargando...</div>}
                {dolar && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                    {dolar.filter(d => ['oficial','blue','bolsa','contadoconliqui','mayorista','tarjeta'].includes(d.casa)).map(d => (
                        <Card key={d.casa} style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 4 }}>{TIPOS_DOLAR[d.casa] || d.nombre}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div><div style={{ fontSize: 9, color: T.muted }}>Compra</div><div style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>${d.compra?.toLocaleString('es-AR')}</div></div>
                                <div style={{ textAlign: 'right' }}><div style={{ fontSize: 9, color: T.muted }}>Venta</div><div style={{ fontSize: 14, fontWeight: 800, color: '#EF4444' }}>${d.venta?.toLocaleString('es-AR')}</div></div>
                            </div>
                        </Card>
                    ))}
                </div>}
                {!loadingD && !dolar && <Card style={{ padding: '14px', marginBottom: 20, textAlign: 'center', color: T.muted, fontSize: 13 }}>Sin conexión a cotizaciones</Card>}

                {/* CLIMA */}
                <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>🌤 Clima</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input value={ciudadInput} onChange={e => setCiudadInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && buscarClima()} placeholder="Ciudad o dirección de obra..." style={{ flex: 1, padding: '10px 12px', border: `1.5px solid ${T.border}`, borderRadius: T.rsm, fontSize: 13, color: T.text, background: T.bg }} />
                    <button onClick={buscarClima} style={{ background: T.accent, color: '#fff', border: 'none', borderRadius: T.rsm, padding: '10px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Buscar</button>
                </div>
                {loadingC && <div style={{ textAlign: 'center', padding: '20px', color: T.muted }}>Cargando clima...</div>}
                {cur && <Card style={{ padding: '16px', marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8 }}>{ciudad}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                        <div style={{ fontSize: 48, fontWeight: 800, color: T.accent }}>{cur.temp_C}°</div>
                        <div>
                            <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{cur.weatherDesc?.[0]?.value}</div>
                            <div style={{ fontSize: 11, color: T.muted }}>Humedad: {cur.humidity}%</div>
                            <div style={{ fontSize: 11, color: T.muted }}>Viento: {cur.windspeedKmph} km/h</div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                        {w3.map((d, i) => (
                            <div key={i} style={{ background: T.bg, borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: 10, color: T.muted, marginBottom: 2 }}>{i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : 'Pasado'}</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{d.maxtempC}° / {d.mintempC}°</div>
                                <div style={{ fontSize: 10, color: d.hourly?.[4]?.chanceofrain > 50 ? '#3B82F6' : T.muted }}>
                                    {d.hourly?.[4]?.chanceofrain > 0 ? `🌧 ${d.hourly?.[4]?.chanceofrain}%` : '☀️'}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>}

                {/* MAPS */}
                <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>🗺 Mapas y tráfico</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    {[
                        { label: 'Google Maps', color: '#4285F4', url: `https://maps.google.com/maps?q=${encodeURIComponent(ciudadInput)}`, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/512px-Google_Maps_Logo_2020.svg.png' },
                        { label: 'Tráfico', color: '#EA4335', url: `https://maps.google.com/maps?q=${encodeURIComponent(ciudadInput)}&layer=traffic`, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/512px-Google_Maps_Logo_2020.svg.png', badge: '🚦' },
                        { label: 'Google Earth', color: '#34A853', url: `https://earth.google.com/web/search/${encodeURIComponent(ciudadInput)}`, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Google_Earth_Logo.png/240px-Google_Earth_Logo.png' },
                        { label: 'Waze', color: '#33CCFF', url: `https://waze.com/ul?q=${encodeURIComponent(ciudadInput)}`, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Waze_2022.svg/240px-Waze_2022.svg.png' },
                    ].map(item => (
                        <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Card style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}>
                                <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, position: 'relative' }}>
                                    <img src={item.img} alt={item.label} style={{ height: 40, objectFit: 'contain' }} onError={e => e.target.style.display='none'} />
                                    {item.badge && <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 16 }}>{item.badge}</span>}
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</div>
                            </Card>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}


function LoginScreen({ onLogin, loginLogo }) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    function tryLogin() {
        setLoading(true);
        setTimeout(() => {
            const c = USERS.find(u => u.user === user.trim().toLowerCase() && u.pass === pass);
            if (c) { onLogin(c); return; }
            // Check personal staff users
            const staff = (window.__bcm_personal__ || []).find(p => p.appUser && p.appUser === user.trim().toLowerCase() && p.appPass === pass);
            if (staff) { onLogin({ user: staff.appUser, pass: staff.appPass, rol: staff.rol, nombre: staff.nombre, nivel: staff.nivel || 'empleado' }); return; }
            setErr('Usuario o contraseña incorrectos'); setLoading(false);
        }, 400);
    }
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', padding: '0 32px', fontFamily: "var(--font,'Plus Jakarta Sans'),sans-serif" }}>
            <div style={{ width: '100%', maxWidth: 360 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    {loginLogo
                        ? <img src={loginLogo} alt="Logo" style={{ height: 80, objectFit: 'contain', marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
                        : <div style={{ width: 64, height: 64, borderRadius: 18, background: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>🏗</div>
                    }
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>BelfastCM</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Construction Management</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Usuario</div>
                        <input value={user} onChange={e => { setUser(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && tryLogin()} placeholder="Ingresá tu usuario" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 15, color: '#0F172A', background: '#F8FAFC', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Contraseña</div>
                        <div style={{ position: 'relative' }}>
                            <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => { setPass(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && tryLogin()} placeholder="••••••••" style={{ width: '100%', padding: '12px 44px 12px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 15, color: '#0F172A', background: '#F8FAFC', boxSizing: 'border-box', outline: 'none' }} />
                            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: showPass ? '#1D4ED8' : '#94A3B8', padding: 4, display: 'flex', alignItems: 'center' }}>
                                {showPass
                                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                }
                            </button>
                        </div>
                    </div>
                    {err && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#EF4444', marginBottom: 14 }}>{err}</div>}
                    <button onClick={tryLogin} disabled={loading || !user || !pass} style={{ width: '100%', padding: '14px', background: (!user || !pass) ? '#CBD5E1' : '#1D4ED8', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProveedoresView({ setView }) {
    const [provs, setProvs] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ nombre: '', rubro: '', contacto: '', telefono: '', email: '', cuit: '', obs: '' });
    
    useEffect(() => {
        (async () => {
            try { const r = await storage.get('bcm_proveedores'); if (r?.value) setProvs(JSON.parse(r.value)); } catch {}
            setLoaded(true);
        })();
    }, []);
    useEffect(() => { if (loaded) storage.set('bcm_proveedores', JSON.stringify(provs)).catch(() => {}); }, [provs, loaded]);
    
    function openNew() { setForm({ nombre: '', rubro: '', contacto: '', telefono: '', email: '', cuit: '', obs: '' }); setEditId(null); setShowNew(true); }
    function openEdit(p) { setForm({ nombre: p.nombre, rubro: p.rubro || '', contacto: p.contacto || '', telefono: p.telefono || '', email: p.email || '', cuit: p.cuit || '', obs: p.obs || '' }); setEditId(p.id); setShowNew(true); }
    function save() {
        if (!form.nombre.trim()) return;
        if (editId) { setProvs(p => p.map(x => x.id === editId ? { ...x, ...form } : x)); }
        else { setProvs(p => [...p, { ...form, id: uid(), fecha: new Date().toLocaleDateString('es-AR') }]); }
        setShowNew(false); setEditId(null);
    }
    function del(id) { if (confirm('¿Eliminar proveedor?')) setProvs(p => p.filter(x => x.id !== id)); }
    
    const RUBROS = ['Electricidad', 'Plomería', 'Construcción', 'Pintura', 'Climatización', 'Seguridad', 'Limpieza', 'Transporte', 'Materiales', 'Otro'];
    
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <AppHeader title="Proveedores" back onBack={() => setView('mas')} right={<PlusBtn onClick={openNew} />} />
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px', paddingBottom: 80 }}>
                {provs.length === 0 && <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🏪</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Sin proveedores</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>Agregá tu primer proveedor</div>
                </div>}
                {provs.map(p => (
                    <Card key={p.id} style={{ padding: '13px 14px', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏪</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{p.nombre}</div>
                                {p.rubro && <div style={{ fontSize: 11, color: T.accent, fontWeight: 600, marginTop: 1 }}>{p.rubro}</div>}
                                {p.contacto && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>👤 {p.contacto}</div>}
                                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                                    {p.telefono && <a href={`https://wa.me/${p.telefono}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}><button style={{ background: '#DCF8C6', border: '1px solid #86EFAC', borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#16A34A', cursor: 'pointer' }}>💬 WhatsApp</button></a>}
                                    {p.email && <a href={`mailto:${p.email}`} style={{ textDecoration: 'none' }}><button style={{ background: T.accentLight, border: `1px solid ${T.border}`, borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: T.accent, cursor: 'pointer' }}>✉️ Email</button></a>}
                                    <button onClick={() => openEdit(p)} style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#F97316', cursor: 'pointer' }}>✏️ Editar</button>
                                    <button onClick={() => del(p.id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#EF4444', cursor: 'pointer' }}>✕</button>
                                </div>
                            </div>
                        </div>
                        {p.obs && <div style={{ marginTop: 8, fontSize: 11, color: T.muted, background: T.bg, borderRadius: 7, padding: '7px 10px' }}>{p.obs}</div>}
                    </Card>
                ))}
            </div>
            {showNew && <Sheet title={editId ? 'Editar proveedor' : 'Nuevo proveedor'} onClose={() => { setShowNew(false); setEditId(null); }}>
                <Field label="Nombre *"><TInput value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Electricidad SA" /></Field>
                <Field label="Rubro"><Sel value={form.rubro} onChange={e => setForm(p => ({ ...p, rubro: e.target.value }))}><option value="">Seleccionar...</option>{RUBROS.map(r => <option key={r} value={r}>{r}</option>)}</Sel></Field>
                <Field label="Contacto"><TInput value={form.contacto} onChange={e => setForm(p => ({ ...p, contacto: e.target.value }))} placeholder="Juan Pérez" /></Field>
                <FieldRow>
                    <Field label="WhatsApp"><TInput value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value.replace(/\D/g, '') }))} placeholder="5491155556666" /></Field>
                    <Field label="CUIT"><TInput value={form.cuit} onChange={e => setForm(p => ({ ...p, cuit: e.target.value }))} placeholder="20-12345678-9" /></Field>
                </FieldRow>
                <Field label="Email"><TInput value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="proveedor@email.com" /></Field>
                <Field label="Observaciones"><TInput value={form.obs} onChange={e => setForm(p => ({ ...p, obs: e.target.value }))} placeholder="Notas..." /></Field>
                <PBtn full onClick={save} disabled={!form.nombre.trim()}>{editId ? 'Guardar cambios' : 'Agregar proveedor'}</PBtn>
            </Sheet>}
        </div>
    );
}


export default function App() {
    const [view, setView] = useState("chat");
    const [lics, setLics] = useState(DEMO_LICS);
    const [obras, setObras] = useState(DEMO_OBRAS);
    const [personal, setPersonal] = useState(DEMO_PERSONAL);
    const [alerts, setAlerts] = useState(DEMO_ALERTS);
    const [contactos, setContactos] = useState([]);
    const [detailObraId, setDetailObraId] = useState(null);
    const [authed, setAuthed] = useState(null);
    const [authModal, setAuthModal] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [unreadMsgs, setUnreadMsgs] = useState(0);
    const [showMsgBanner, setShowMsgBanner] = useState(false);
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
            try { const r = await storage.get('bcm_cfg_locked'); if (r?.value === 'true') setCfgLocked(true); } catch { }
            setCfgLockedLoaded(true);
        })();
    }, []);
    useEffect(() => {
        if (!cfgLockedLoaded) return;
        storage.set('bcm_cfg_locked', cfgLocked ? 'true' : 'false').catch(() => {});
    }, [cfgLocked, cfgLockedLoaded]);

    // Carga datos — PRIMERO lee, DESPUÉS habilita el guardado
    useEffect(() => {
        (async () => {
            try {
                const r = await storage.get("bcm_state");
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
                obs: [{ id: Math.random().toString(36).slice(2, 9), txt: "Obra creada automáticamente desde licitación.", fecha: new Date().toLocaleDateString("es-AR") }],
                fotos: [], archivos: [], informes: [], docs: {},
            });
        });
        if (nuevas.length > 0) setObras(p => [...p, ...nuevas]);
    }, [dataLoaded]);

    // Guarda solo después de que se cargaron los datos del storage
    useEffect(() => {
        if (!dataLoaded) return;
        storage.set("bcm_state", JSON.stringify({ lics, obras, personal, alerts })).catch(() => { });
    }, [lics, obras, personal, alerts, dataLoaded]);

    useEffect(() => {
        (async () => {
            try {
                const r = await storage.get('bcm_config');
                const lb = await storage.get('bcm_logo_b').catch(() => null);
                const la = await storage.get('bcm_logo_a').catch(() => null);
                const li = await storage.get('bcm_logo_i').catch(() => null);
                const lc = await storage.get('bcm_logo_c').catch(() => null);
                const base = r?.value ? { ...DEFAULT_CONFIG, ...JSON.parse(r.value) } : { ...DEFAULT_CONFIG };
                setCfg({ ...base, logoBelfast: lb?.value || '', logoAA2000: la?.value || '', logoAsistente: li?.value || '', logoCentral: lc?.value || '' });
                const rk = await storage.get('bcm_apikey').catch(() => null);
                if (rk?.value) setApiKey(rk.value);
            } catch { }
            setCfgLoaded(true);
        })();
    }, []);

    useEffect(() => {
        if (!cfgLoaded) return;
        const { logoBelfast, logoAA2000, logoAsistente, logoCentral, ...rest } = cfg;
        storage.set('bcm_config', JSON.stringify(rest)).catch(() => { });
        storage.set('bcm_logo_b', logoBelfast || '').catch(() => { });
        storage.set('bcm_logo_a', logoAA2000 || '').catch(() => { });
        storage.set('bcm_logo_i', logoAsistente || '').catch(() => { });
        storage.set('bcm_logo_c', logoCentral || '').catch(() => { });
    }, [cfg, cfgLoaded]);

    function requireAuth(action, titulo) {
        if (authed) { action(); }
        else { setAuthModal({ onSuccess: (u) => { setAuthed(u); action(); setAuthModal(null); }, onClose: () => setAuthModal(null), titulo: `🔒 ${titulo}` }); }
    }
    const nav = (v) => { setDetailObraId(null); setView(v); };
    // Expose personal for login check
    useEffect(() => { window.__bcm_personal__ = personal; }, [personal]);

    // Auto-check payment alerts
    useEffect(() => {
        if (!dataLoaded) return;
        obras.forEach(o => {
            if (o.estado !== 'curso') return;
            const total = parseFloat(String(o.monto || '0').replace(/[^0-9.]/g,'')) || 0;
            const pagado = parseFloat(o.pagado || 0);
            if (total <= 0) return;
            const pct = pagado / total * 100;
            const saldo = total - pagado;
            if (pct > 90) {
                const msg = `💳 "${o.nombre}": presupuesto al ${Math.round(pct)}% — quedan $${saldo.toLocaleString('es-AR')}`;
                if (!alerts.some(a => a.msg === msg))
                    setAlerts(p => [...p, { id: uid(), prioridad: 'alta', msg }]);
            }
        });
    }, [dataLoaded, obras]);

    // Auto-check document expiry and create alerts
    useEffect(() => {
        if (!dataLoaded) return;
        const hoy = new Date();
        const nuevasAlertas = [];
        personal.forEach(p => {
            Object.entries(p.docs || {}).forEach(([did, doc]) => {
                if (!doc?.vence) return;
                const [d, m, y] = doc.vence.split('/');
                if (!d || !m || !y) return;
                const vence = new Date(`20${y}`, m - 1, d);
                const diasRestantes = Math.ceil((vence - hoy) / (1000 * 60 * 60 * 24));
                if (diasRestantes <= 7 && diasRestantes >= 0) {
                    const msg = `⚠️ ${p.nombre}: ${doc.nombre || did.toUpperCase()} vence en ${diasRestantes === 0 ? 'HOY' : diasRestantes + ' día' + (diasRestantes > 1 ? 's' : '')}`;
                    const yaExiste = alerts.some(a => a.msg === msg);
                    if (!yaExiste) nuevasAlertas.push({ id: uid(), prioridad: diasRestantes <= 2 ? 'alta' : 'media', msg });
                } else if (diasRestantes < 0) {
                    const msg = `🔴 ${p.nombre}: ${doc.nombre || did.toUpperCase()} VENCIDO hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) > 1 ? 's' : ''}`;
                    const yaExiste = alerts.some(a => a.msg === msg);
                    if (!yaExiste) nuevasAlertas.push({ id: uid(), prioridad: 'alta', msg });
                }
            });
        });
        if (nuevasAlertas.length > 0) setAlerts(p => [...p, ...nuevasAlertas]);
    }, [dataLoaded, personal]);

    // Check unread messages every 15 seconds
    useEffect(() => {
        if (!loggedIn || !currentUser) return;
        const miUser = currentUser.user || currentUser.nombre || 'admin';
        async function checkUnread() {
            try {
                const r = await fetch(`${SUPA_URL}/rest/v1/bcm_mensajes?para=eq.${encodeURIComponent(miUser)}&leido=eq.false&select=id`, { headers: SH() });
                if (r.ok) {
                    const d = await r.json();
                    const count = d?.length || 0;
                    setUnreadMsgs(count);
                    if (count > 0) setShowMsgBanner(true);
                }
            } catch {}
        }
        checkUnread();
        const interval = setInterval(checkUnread, 15000);
        return () => clearInterval(interval);
    }, [loggedIn, currentUser]);
    const hideBrand = ["archivos", "seguimiento", "mensajes"].includes(view);

    if (!loggedIn) return <LoginScreen loginLogo={cfg?.logoCentral || cfg?.logoBelfast} onLogin={u => { setLoggedIn(true); setCurrentUser(u); setAuthed(u.rol === 'Administrador' ? u : null); }} />;

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg, fontFamily: `var(--font,'Plus Jakarta Sans'),sans-serif`, maxWidth: 480, margin: "0 auto", overflow: "hidden" }}>
            <style>{css}</style>
            <style>{buildThemeCSS(cfg)}</style>
            {showMsgBanner && unreadMsgs > 0 && (
                <div onClick={() => { nav("mensajes"); setShowMsgBanner(false); }} style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#1D4ED8", color: "#fff", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, zIndex: 999, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,.25)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"/></svg>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Tenés {unreadMsgs} mensaje{unreadMsgs > 1 ? 's' : ''} nuevo{unreadMsgs > 1 ? 's' : ''}</div>
                        <div style={{ fontSize: 11, opacity: .8 }}>Tocá para ver</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setShowMsgBanner(false); }} style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: 6, width: 26, height: 26, color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
            )}
            {!hideBrand && <AppBrand cfg={cfg} />}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {view === "dashboard" && <Dashboard lics={lics} obras={obras} personal={personal} alerts={alerts} setView={nav} setDetailObraId={setDetailObraId} requireAuth={requireAuth} cfg={cfg} customIcons={typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("bcm_icons") || "{}")) : {}} />}
                {view === "licitaciones" && <Licitaciones lics={lics} setLics={setLics} requireAuth={requireAuth} cfg={cfg} obras={obras} setObras={setObras} />}
                {view === "obras" && <Obras obras={obras} setObras={setObras} lics={lics} detailId={detailObraId} setDetailId={setDetailObraId} requireAuth={requireAuth} cfg={cfg} apiKey={apiKey} />}
                {view === "personal" && <Personal personal={personal} setPersonal={setPersonal} obras={obras} cfg={cfg} />}
                {view === "mas" && <Mas setView={nav} authed={authed} setAuthed={setAuthed} requireAuth={requireAuth} cfg={cfg} setCfg={setCfg} apiKey={apiKey} setApiKey={setApiKey} cfgLocked={cfgLocked} setCfgLocked={setCfgLocked} lics={lics} obras={obras} personal={personal} alerts={alerts} currentUser={currentUser} />}
                {view === "archivos" && <Archivos setView={nav} />}
                {view === "seguimiento" && <Seguimiento alerts={alerts} setAlerts={setAlerts} setView={nav} />}
                {view === "mensajes" && <MensajesView personal={personal} setView={nav} currentUser={currentUser} />}
                {view === "resumen" && <ResumenView lics={lics} obras={obras} personal={personal} alerts={alerts} setView={nav} />}
                {view === "cargar" && <CargarView obras={obras} setObras={setObras} cargarState={cargarState} setCargarState={setCargarState} apiKey={apiKey} />}
                {view === "contactos" && <ContactosView setView={nav} onContactosChange={setContactos} />}
                {view === "whatsapp" && <WhatsappGrupos personal={personal} setView={nav} />}
                {view === "proveedores" && <ProveedoresView setView={nav} />}
                {view === "info_externa" && <InfoExternaView setView={nav} />}
                {view === "info_util" && <InfoUtilView setView={nav} />}
                {view === "gantt" && <GanttView obras={obras} setView={nav} />}
                {view === "informes_ingeniero" && <InformesIngeniero setView={nav} />}
                {view === "informes_ia" && <InformesIA obras={obras} personal={personal} lics={lics} alerts={alerts} setView={nav} apiKey={apiKey} cfg={cfg} />}
                {view === "vigilancia" && <PanelVigilancia setView={nav} />}
                {view === "presentismo" && <Presentismo personal={personal} setView={nav} />}
                {view === "presupuesto_materiales" && <PresupuestoView tipo="materiales" setView={nav} />}
                {view === "presupuesto_subcontratos" && <PresupuestoView tipo="subcontratos" setView={nav} />}
                {view === "chat" && <Chat contactos={contactos} lics={lics} obras={obras} personal={personal} alerts={alerts} msgs={chatMsgs} setMsgs={setChatMsgs} cfg={cfg} apiKey={apiKey} />}
            </div>
            <BottomNav view={view} setView={nav} alerts={alerts} cfg={cfg} />
            {authModal && <LoginModal titulo={authModal.titulo} onSuccess={authModal.onSuccess} onClose={authModal.onClose} />}
        </div>
    );
}
