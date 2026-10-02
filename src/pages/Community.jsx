import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

/**
 * KONAN COMMUNITY
 * ============================================================
 * ÉTAPE 1 — FRONTEND COMPLET DANS UN SEUL FICHIER
 *
 * Important :
 * - Aucun ancien composant Community n'est utilisé ici.
 * - Tout le frontend de Community est regroupé dans ce fichier.
 * - Le backend actuel n'est utilisé que pour les données réellement disponibles.
 * - Les fonctionnalités sont branchées sur un contrat API réel.
 *   Lorsqu'une route n'existe pas encore, l'interface affiche un état vide
 *   au lieu de fabriquer des données.
 *
 * Backend actuellement détecté :
 *   GET    /api/social
 *   GET    /api/social/:id
 *   POST   /api/social
 *   PUT    /api/social/:id
 *   DELETE /api/social/:id
 *   GET    /messages
 *   POST   /messages
 *   PUT    /messages/:id/read
 *   PUT    /messages/:id/delete
 *   PUT    /messages/:id
 *   DELETE /messages/:id
 *   Socket.IO :
 *      joinCommunity
 *      sendMessage
 *      typing
 *      newMessage
 *      onlineUsers
 *      userJoined
 *
 * Les nouveaux endpoints sociaux seront ajoutés à l'étape 2.
 */

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  "";

const apiUrl = (path) => `${API_BASE}${path}`;

/* ============================================================
   COUCHE DE SECURITE FRONTEND — COMMUNITY
   Le backend reste toujours l'autorité finale.
============================================================ */

const MAX_COMMUNITY_TEXT = 5000;
const MAX_COMMUNITY_SEARCH = 200;
const COMMUNITY_MUTATION_COOLDOWN_MS = 450;

function getCommunityToken() {
  try {
    const token = localStorage.getItem("token");
    return typeof token === "string" && token.trim()
      ? token.trim()
      : "";
  } catch {
    return "";
  }
}

function communityAuthHeaders(extra = {}) {
  const token = getCommunityToken();
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

const communityMutationTimes = new Map();

function communityMutationAllowed(key) {
  const now = Date.now();
  const previous = communityMutationTimes.get(key) || 0;

  if (now - previous < COMMUNITY_MUTATION_COOLDOWN_MS) {
    return false;
  }

  communityMutationTimes.set(key, now);
  return true;
}

async function secureCommunityFetch(url, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const headers = communityAuthHeaders(options.headers || {});

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const key = `${method}:${url}`;
    if (!communityMutationAllowed(key)) {
      throw new Error("Action trop rapide. Veuillez patienter un instant.");
    }
  }

  return fetch(url, {
    ...options,
    method,
    headers,
    credentials: "same-origin",
  });
}

function sanitizeCommunityText(value, max = MAX_COMMUNITY_TEXT) {
  return String(value || "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, max);
}

function isSafeCommunityId(value) {
  const id = String(value || "");
  return Boolean(id) && id.length <= 128 && /^[A-Za-z0-9_-]+$/.test(id);
}

function secureSocketPayload(payload = {}) {
  const safe = { ...payload };

  /*
    L'identité ne doit jamais venir du navigateur.
    Le serveur Socket.IO doit utiliser socket.user/sub issu du JWT.
  */
  delete safe.userId;
  delete safe.senderId;
  delete safe.authorId;
  delete safe.reporterId;
  delete safe.driverId;

  if (typeof safe.communityId === "string") {
    safe.communityId = safe.communityId.slice(0, 128);
  }

  return safe;
}

function secureSocketEmit(socket, event, payload = {}) {
  if (!socket || typeof socket.emit !== "function") return false;
  socket.emit(event, secureSocketPayload(payload));
  return true;
}

const SOCKET_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_SOCKET_URL) ||
  API_BASE ||
  (typeof window !== "undefined" ? window.location.origin : "");

const COLORS = {
  primary: "#0b66ff",
  primaryDark: "#084ec4",
  blueSoft: "#eef5ff",
  text: "#172033",
  muted: "#6f7b91",
  border: "#e7ebf2",
  surface: "#ffffff",
  page: "#f5f7fb",
  success: "#18a957",
  danger: "#e5484d",
  warning: "#f59e0b",
  purple: "#7957d5",
  pink: "#e84a9b",
  dark: "#101828",
};

const fontFamily =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const icon = (name, extra = "") =>
  `fa-solid fa-${name}${extra ? ` ${extra}` : ""}`;

const timeAgo = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const seconds = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} j`;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
};

const initials = (name = "K") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();

const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const safeArray = (v) => (Array.isArray(v) ? v : []);

const normalizePost = (post, index = 0) => {
  const raw = post || {};
  return {
    ...raw,
    id: raw._id || raw.id || `post-${index}`,
    title: raw.title || "",
    description: raw.description || "",
    content: raw.content || raw.description || raw.title || "",
    videoUrl: raw.videoUrl || "",
    thumbnailUrl: raw.thumbnailUrl || "",
    hashtags: safeArray(raw.hashtags),
    likesCount: Number(raw.likesCount || raw.likes || 0),
    commentsCount: Number(raw.commentsCount || raw.comments || 0),
    sharesCount: Number(raw.sharesCount || raw.shares || 0),
    saved: Boolean(raw.saved),
    liked: Boolean(raw.liked),
    createdAt: raw.createdAt || raw.publishedAt || null,
    author: raw.author || raw.user || null,
  };
};

const normalizeConversation = (conversation, index = 0) => {
  const raw = conversation || {};
  const person = raw.user || raw.participant || raw.contact || raw.otherUser || {};
  return {
    ...raw,
    id: raw._id || raw.id || `conversation-${index}`,
    user: {
      ...person,
      id: person._id || person.id || raw.userId || raw.participantId || null,
      name: person.name || person.fullName || person.username || "Membre",
      avatar: person.avatar || person.profilePicture || person.photo || "",
      online: Boolean(person.online || person.isOnline),
      verified: Boolean(person.verified),
    },
    lastMessage: raw.lastMessage?.text || raw.lastMessage || "",
    unread: Number(raw.unread || raw.unreadCount || 0),
  };
};

const normalizeMessage = (message, currentUserId = null) => {
  const raw = message || {};
  const sender = raw.sender || raw.author || raw.user || {};
  const senderId = sender._id || sender.id || raw.senderId || raw.userId || null;
  const id = raw._id || raw.id;
  if (!id) return null;
  return {
    ...raw,
    id,
    text: raw.text || raw.content || raw.message || "",
    senderId,
    me: Boolean(raw.me || (currentUserId && String(senderId) === String(currentUserId))),
    time: raw.time || (raw.createdAt ? new Date(raw.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""),
    sender: {
      ...sender,
      name: sender.name || sender.fullName || sender.username || "Membre",
      avatar: sender.avatar || sender.profilePicture || "",
    },
  };
};

const baseCss = `
*{box-sizing:border-box}
.kc-root{min-height:100vh;background:#f5f7fb;color:#172033;font-family:${fontFamily};font-size:14px}
.kc-root button,.kc-root input,.kc-root textarea,.kc-root select{font:inherit}
.kc-root button{cursor:pointer}
.kc-root img{max-width:100%;display:block}
.kc-root ::-webkit-scrollbar{width:7px;height:7px}
.kc-root ::-webkit-scrollbar-thumb{background:#cfd6e3;border-radius:20px}
.kc-topbar{height:68px;background:#fff;border-bottom:1px solid #e7ebf2;display:flex;align-items:center;position:sticky;top:0;z-index:60;padding:0 24px;gap:22px}
.kc-brand{display:flex;align-items:center;gap:11px;min-width:235px}
.kc-brand-mark{width:40px;height:40px;border-radius:13px;background:linear-gradient(135deg,#0b66ff,#084ec4);display:grid;place-items:center;color:#fff;box-shadow:0 7px 18px rgba(11,102,255,.25)}
.kc-brand-text{font-weight:850;letter-spacing:-.4px;font-size:17px}
.kc-brand-sub{display:block;color:#8994a8;font-size:10px;font-weight:700;letter-spacing:.7px;margin-top:1px}
.kc-search{height:42px;max-width:500px;flex:1;position:relative}
.kc-search i{position:absolute;left:15px;top:13px;color:#8c96a8}
.kc-search input{width:100%;height:100%;border:1px solid #e3e8f0;background:#f6f8fb;border-radius:13px;padding:0 16px 0 42px;outline:none;transition:.2s}
.kc-search input:focus{border-color:#9bbcff;background:#fff;box-shadow:0 0 0 4px rgba(11,102,255,.08)}
.kc-top-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.kc-icon-btn{width:42px;height:42px;border:0;background:#f5f7fb;color:#536075;border-radius:12px;display:grid;place-items:center;position:relative;transition:.2s}
.kc-icon-btn:hover{background:#eaf2ff;color:#0b66ff;transform:translateY(-1px)}
.kc-badge{position:absolute;right:-1px;top:-2px;background:#e5484d;color:#fff;border:2px solid #fff;border-radius:20px;min-width:19px;height:19px;font-size:10px;font-weight:800;display:grid;place-items:center;padding:0 4px}
.kc-avatar{width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 0 0 1px #e2e7ef}
.kc-avatar-lg{width:52px;height:52px}
.kc-avatar-xl{width:92px;height:92px}
.kc-layout{max-width:1480px;margin:0 auto;display:grid;grid-template-columns:245px minmax(0,650px) 315px;gap:22px;padding:22px 20px 40px}
.kc-left,.kc-right{position:sticky;top:90px;height:calc(100vh - 112px);overflow:auto;padding-right:2px}
.kc-nav-card,.kc-side-card,.kc-card{background:#fff;border:1px solid #e7ebf2;border-radius:18px;box-shadow:0 6px 24px rgba(20,37,63,.035)}
.kc-nav-card{padding:10px}
.kc-nav-item{width:100%;border:0;background:transparent;color:#5d687c;display:flex;align-items:center;gap:13px;padding:12px;border-radius:12px;text-align:left;font-weight:700;transition:.2s}
.kc-nav-item i{width:21px;text-align:center;font-size:16px}
.kc-nav-item:hover{background:#f3f7ff;color:#0b66ff}
.kc-nav-item.active{background:#eaf2ff;color:#0b66ff}
.kc-nav-section{font-size:10px;color:#9aa4b5;font-weight:850;text-transform:uppercase;letter-spacing:1px;padding:17px 12px 7px}
.kc-profile-mini{padding:16px;display:flex;align-items:center;gap:11px;border-bottom:1px solid #eef1f5;margin-bottom:4px}
.kc-profile-mini strong{display:block;font-size:13px}
.kc-profile-mini span{font-size:11px;color:#8a95a8}
.kc-main{min-width:0}
.kc-page-title{display:flex;justify-content:space-between;align-items:flex-end;margin:0 0 16px}
.kc-page-title h1{margin:0;font-size:27px;letter-spacing:-1px}
.kc-page-title p{margin:5px 0 0;color:#7c8799}
.kc-stories{display:flex;gap:11px;overflow:auto;padding-bottom:5px;margin-bottom:17px}
.kc-story{min-width:104px;width:104px;height:158px;border-radius:16px;overflow:hidden;position:relative;background:#eef2f7;border:1px solid #e3e8ef;cursor:pointer}
.kc-story-bg{position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(0,0,0,.76))}
.kc-story img.story-image{width:100%;height:100%;object-fit:cover}
.kc-story .kc-avatar{position:absolute;left:9px;top:9px;border:3px solid #fff;width:34px;height:34px}
.kc-story-name{position:absolute;bottom:10px;left:10px;right:7px;color:#fff;font-size:11px;font-weight:800;z-index:2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kc-story-add{background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:12px}
.kc-story-add .plus{position:absolute;top:43px;width:38px;height:38px;border-radius:50%;background:#0b66ff;color:#fff;display:grid;place-items:center;border:3px solid #fff;box-shadow:0 4px 12px rgba(11,102,255,.28)}
.kc-story-add .story-user{position:absolute;top:10px;width:52px;height:52px;border-radius:50%;object-fit:cover}
.kc-story-add .kc-story-name{color:#172033;text-align:center}
.kc-composer{padding:17px;margin-bottom:17px}
.kc-composer-row{display:flex;gap:11px;align-items:center}
.kc-composer-input{flex:1;height:44px;background:#f6f8fb;border:1px solid #e6eaf1;border-radius:13px;padding:0 15px;color:#8993a5;display:flex;align-items:center;cursor:pointer}
.kc-composer-actions{display:flex;gap:7px;margin-top:13px;border-top:1px solid #edf0f4;padding-top:12px}
.kc-composer-action{flex:1;border:0;background:transparent;border-radius:10px;padding:9px;color:#657086;font-weight:700;display:flex;justify-content:center;align-items:center;gap:8px}
.kc-composer-action:hover{background:#f5f7fb}
.kc-composer-action.video i{color:#e84a9b}.kc-composer-action.photo i{color:#19a968}.kc-composer-action.event i{color:#0b66ff}
.kc-post{padding:0;margin-bottom:17px;overflow:hidden}
.kc-post-head{padding:17px 17px 10px;display:flex;align-items:flex-start;gap:11px}
.kc-post-author{flex:1;min-width:0}
.kc-post-author strong{font-size:13px}
.kc-post-author small{display:block;color:#8a95a8;margin-top:3px}
.kc-post-menu{border:0;background:transparent;color:#8b95a6;width:34px;height:34px;border-radius:10px}
.kc-post-menu:hover{background:#f5f7fb}
.kc-post-content{padding:0 17px 14px;line-height:1.55;color:#364156}
.kc-post-content p{margin:0}
.kc-hashtags{color:#0b66ff;font-weight:700;margin-top:8px}
.kc-post-media{width:100%;max-height:590px;object-fit:cover;background:#101828}
.kc-post-video{width:100%;max-height:590px;display:block;background:#000}
.kc-post-poll{margin:0 17px 15px;border:1px solid #e6eaf1;border-radius:14px;overflow:hidden}
.kc-poll-question{font-weight:800;padding:14px;background:#f8faff}
.kc-poll-option{padding:12px 14px;border-top:1px solid #edf0f4;display:flex;justify-content:space-between;align-items:center}
.kc-poll-option button{border:0;background:#eef5ff;color:#0b66ff;border-radius:9px;padding:6px 10px;font-weight:800}
.kc-post-stats{display:flex;justify-content:space-between;padding:0 17px 9px;color:#8993a5;font-size:12px}
.kc-reaction-line{display:flex;align-items:center;gap:5px}
.kc-reaction-icons{display:flex}
.kc-reaction-icons span{width:19px;height:19px;border-radius:50%;display:grid;place-items:center;color:#fff;border:2px solid #fff;margin-left:-4px;font-size:9px}
.kc-reaction-icons span:first-child{margin-left:0}
.kc-reaction-icons .r-like{background:#0b66ff}.kc-reaction-icons .r-love{background:#e5484d}.kc-reaction-icons .r-wow{background:#f5a623}
.kc-post-actions{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #edf0f4;margin:0 17px}
.kc-post-action{height:46px;border:0;background:transparent;color:#69758a;font-weight:750;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:8px;margin:4px 0}
.kc-post-action:hover{background:#f5f7fb}
.kc-post-action.liked{color:#0b66ff;background:#f2f7ff}
.kc-comments{border-top:1px solid #edf0f4;margin-top:4px;padding:13px 17px 16px}
.kc-comment{display:flex;gap:9px;margin-bottom:11px}
.kc-comment-bubble{background:#f5f7fb;border-radius:13px;padding:9px 11px;flex:1}
.kc-comment-bubble strong{font-size:12px}.kc-comment-bubble p{margin:4px 0 0;color:#4e5a6e;line-height:1.4}
.kc-comment-form{display:flex;gap:8px}
.kc-comment-form input{flex:1;border:1px solid #e1e6ee;background:#f8f9fb;border-radius:12px;padding:10px 12px;outline:none}
.kc-comment-form button{width:40px;border:0;border-radius:11px;background:#0b66ff;color:#fff}
.kc-side-card{padding:15px;margin-bottom:15px}
.kc-side-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}
.kc-side-title strong{font-size:13px}.kc-side-title button{border:0;background:none;color:#0b66ff;font-weight:800;font-size:11px}
.kc-person{display:flex;align-items:center;gap:10px;padding:9px 0}
.kc-person-info{flex:1;min-width:0}.kc-person-info strong{display:block;font-size:12px}.kc-person-info span{display:block;color:#8b95a7;font-size:10px;margin-top:2px}
.kc-follow{border:1px solid #cfe0ff;color:#0b66ff;background:#f2f7ff;border-radius:9px;padding:6px 9px;font-size:11px;font-weight:850}
.kc-follow.following{background:#0b66ff;color:#fff;border-color:#0b66ff}
.kc-trend{padding:9px 0;border-bottom:1px solid #eef1f5}.kc-trend:last-child{border-bottom:0}.kc-trend span{font-size:10px;color:#98a1b1}.kc-trend strong{display:block;margin-top:3px;font-size:12px}.kc-trend small{color:#8b95a7}
.kc-event{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #eef1f5}.kc-event:last-child{border-bottom:0}.kc-event-date{width:46px;height:46px;background:#edf4ff;color:#0b66ff;border-radius:11px;display:grid;place-items:center;text-align:center;font-size:9px;font-weight:900}.kc-event strong{font-size:12px;display:block}.kc-event span{font-size:10px;color:#8b95a7;display:block;margin-top:4px}
.kc-footer{color:#9aa4b5;font-size:10px;line-height:1.8;padding:10px 4px}
.kc-modal-backdrop{position:fixed;inset:0;background:rgba(8,18,36,.55);backdrop-filter:blur(7px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.kc-modal{background:#fff;width:min(680px,100%);max-height:90vh;overflow:auto;border-radius:22px;box-shadow:0 28px 80px rgba(10,25,50,.28)}
.kc-modal.wide{width:min(940px,100%)}.kc-modal-head{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 19px;border-bottom:1px solid #edf0f4;position:sticky;top:0;background:#fff;z-index:2}.kc-modal-head h3{margin:0;font-size:16px}.kc-close{border:0;background:#f4f6f9;color:#6d788a;width:35px;height:35px;border-radius:50%}
.kc-modal-body{padding:19px}.kc-textarea{width:100%;min-height:150px;resize:vertical;border:0;outline:0;font-size:16px;line-height:1.6;padding:4px}.kc-create-user{display:flex;align-items:center;gap:10px;margin-bottom:10px}.kc-create-tools{display:flex;gap:8px;flex-wrap:wrap;border:1px solid #e7ebf2;border-radius:13px;padding:10px;margin-top:10px}.kc-tool{border:0;background:#f6f8fb;padding:8px 11px;border-radius:9px;color:#536075;font-weight:700}.kc-tool i{margin-right:6px}.kc-submit{margin-top:14px;width:100%;height:46px;border:0;border-radius:12px;background:#0b66ff;color:#fff;font-weight:850}.kc-submit:disabled{opacity:.55;cursor:not-allowed}
.kc-toast{position:fixed;right:20px;bottom:20px;z-index:500;background:#172033;color:#fff;padding:12px 15px;border-radius:12px;box-shadow:0 14px 40px rgba(0,0,0,.2);display:flex;align-items:center;gap:9px;font-weight:700}
.kc-profile-cover{height:220px;border-radius:20px 20px 0 0;background:linear-gradient(135deg,#0b66ff,#5a42c5);position:relative;overflow:hidden}.kc-profile-cover:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,rgba(255,255,255,.22),transparent 32%),linear-gradient(120deg,transparent 30%,rgba(255,255,255,.08));}
.kc-profile-body{padding:0 22px 22px}.kc-profile-row{display:flex;align-items:flex-end;gap:16px;margin-top:-47px;position:relative;z-index:2}.kc-profile-avatar-wrap{padding:4px;border-radius:50%;background:#fff}.kc-profile-main{flex:1;padding-bottom:5px}.kc-profile-main h2{margin:0;font-size:22px}.kc-profile-main p{margin:5px 0 0;color:#7b8799}.kc-profile-buttons{display:flex;gap:8px;padding-bottom:5px}.kc-btn{border:1px solid #dce2eb;background:#fff;border-radius:10px;height:38px;padding:0 13px;font-weight:800;color:#566277}.kc-btn.primary{background:#0b66ff;color:#fff;border-color:#0b66ff}.kc-profile-stats{display:flex;gap:26px;margin-top:17px;border-top:1px solid #edf0f4;padding-top:15px}.kc-profile-stats strong{display:block}.kc-profile-stats span{color:#8b95a7;font-size:11px}
.kc-section-tabs{display:flex;gap:2px;border-bottom:1px solid #e7ebf2;margin-bottom:15px;overflow:auto}.kc-section-tab{border:0;background:none;padding:12px 14px;color:#7b8798;font-weight:800;white-space:nowrap;border-bottom:2px solid transparent}.kc-section-tab.active{color:#0b66ff;border-bottom-color:#0b66ff}
.kc-discover-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.kc-group-card{overflow:hidden}.kc-group-cover{height:125px;object-fit:cover;width:100%}.kc-group-body{padding:13px}.kc-group-body h3{margin:0;font-size:14px}.kc-group-body p{margin:6px 0 11px;color:#8791a3;font-size:11px}
.kc-message-shell{display:grid;grid-template-columns:270px 1fr;height:calc(100vh - 152px);min-height:580px;overflow:hidden}.kc-message-list{border-right:1px solid #e7ebf2;overflow:auto}.kc-message-search{padding:14px;border-bottom:1px solid #edf0f4}.kc-message-search input{width:100%;border:1px solid #e4e9f0;background:#f7f9fb;border-radius:10px;padding:10px 11px;outline:none}.kc-conversation{display:flex;gap:10px;padding:13px 14px;border:0;width:100%;background:#fff;text-align:left;border-bottom:1px solid #f2f4f7}.kc-conversation.active{background:#edf4ff}.kc-conversation .kc-person-info strong{font-size:12px}.kc-conversation small{display:block;color:#8c96a7;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kc-unread{background:#0b66ff;color:#fff;border-radius:20px;font-size:9px;padding:3px 6px;font-weight:900}.kc-chat{display:flex;flex-direction:column;min-width:0}.kc-chat-head{height:67px;border-bottom:1px solid #edf0f4;display:flex;align-items:center;gap:11px;padding:0 17px}.kc-chat-head strong{font-size:13px}.kc-chat-head small{display:block;color:#18a957;margin-top:2px}.kc-chat-messages{flex:1;overflow:auto;padding:20px;background:#fafbfc}.kc-bubble-row{display:flex;margin:8px 0}.kc-bubble-row.me{justify-content:flex-end}.kc-bubble{max-width:min(75%,440px);padding:10px 12px;border-radius:15px;background:#fff;border:1px solid #e7ebf2;box-shadow:0 3px 10px rgba(20,37,63,.03)}.kc-bubble-row.me .kc-bubble{background:#0b66ff;color:#fff;border-color:#0b66ff;border-bottom-right-radius:4px}.kc-bubble-row:not(.me) .kc-bubble{border-bottom-left-radius:4px}.kc-bubble small{display:block;font-size:9px;opacity:.62;margin-top:4px}.kc-chat-compose{padding:12px;border-top:1px solid #edf0f4;display:flex;gap:8px}.kc-chat-compose input{flex:1;border:1px solid #e1e6ee;border-radius:12px;padding:11px 13px;outline:none}.kc-chat-compose button{width:42px;border:0;border-radius:11px;background:#0b66ff;color:#fff}.kc-chat-compose button:disabled{opacity:.45;cursor:not-allowed}.kc-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;color:#8b95a7;padding:35px;min-height:150px}.kc-empty i{font-size:27px;color:#9db9e8}.kc-empty strong{color:#4c586d;font-size:13px}.kc-empty span{font-size:11px;line-height:1.5;max-width:420px}
.kc-notif{display:flex;gap:12px;padding:13px;border-bottom:1px solid #eef1f5}.kc-notif.unread{background:#f4f8ff}.kc-notif-icon{width:38px;height:38px;border-radius:12px;background:#eaf2ff;color:#0b66ff;display:grid;place-items:center}.kc-notif p{margin:0;color:#4d596d;line-height:1.4}.kc-notif small{display:block;color:#929bac;margin-top:4px}
.kc-short-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.kc-short{height:320px;border-radius:16px;overflow:hidden;position:relative;background:#101828}.kc-short img,.kc-short video{width:100%;height:100%;object-fit:cover}.kc-short-overlay{position:absolute;inset:auto 0 0;padding:13px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.78))}.kc-short-overlay strong{display:block}.kc-short-overlay small{display:block;margin-top:5px;opacity:.8}
.kc-page-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.kc-page-card{padding:16px;display:flex;align-items:center;gap:12px}.kc-page-card .kc-person-info{min-width:0}
.kc-prof-banner{padding:20px;background:linear-gradient(135deg,#111d35,#1b4fa8);color:#fff;border-radius:18px;margin-bottom:15px}.kc-prof-banner h2{margin:0}.kc-prof-banner p{margin:7px 0 0;color:rgba(255,255,255,.72)}.kc-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.kc-kpi{padding:15px}.kc-kpi span{font-size:10px;color:#8a95a7}.kc-kpi strong{display:block;font-size:22px;margin-top:6px}.kc-kpi em{font-style:normal;color:#18a957;font-size:10px}
.kc-market-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}.kc-product{overflow:hidden}.kc-product img{height:190px;width:100%;object-fit:cover}.kc-product-body{padding:12px}.kc-product-body strong{display:block}.kc-product-price{color:#0b66ff;font-weight:900;margin-top:6px}.kc-product-body small{color:#8b95a7}
.kc-loading{padding:50px;text-align:center;color:#7d889a}


/* ================================================================
   MENU SANDWICH MOBILE / iOS
   ================================================================ */
.kc-mobile-menu-trigger{
  display:none;
  flex:0 0 42px;
  width:42px;
  height:42px;
  border:1px solid #e4e9f1;
  background:#f7f9fc;
  color:#26334a;
  border-radius:12px;
  align-items:center;
  justify-content:center;
  font-size:17px;
  -webkit-tap-highlight-color:transparent;
  touch-action:manipulation;
}
.kc-mobile-menu-trigger:active{transform:scale(.96)}
.kc-mobile-overlay{
  position:fixed;
  inset:0;
  background:rgba(9,20,38,.46);
  backdrop-filter:blur(5px);
  -webkit-backdrop-filter:blur(5px);
  z-index:300;
  opacity:0;
  pointer-events:none;
  transition:opacity .22s ease;
}
.kc-mobile-overlay.open{
  opacity:1;
  pointer-events:auto;
}
.kc-mobile-drawer{
  position:absolute;
  top:0;
  left:0;
  bottom:0;
  width:min(88vw,360px);
  background:#fff;
  box-shadow:20px 0 55px rgba(10,25,50,.20);
  transform:translateX(-102%);
  transition:transform .28s cubic-bezier(.22,.61,.36,1);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  padding-top:env(safe-area-inset-top);
}
.kc-mobile-overlay.open .kc-mobile-drawer{transform:translateX(0)}
.kc-mobile-drawer-head{
  min-height:76px;
  display:flex;
  align-items:center;
  gap:11px;
  padding:12px 15px;
  border-bottom:1px solid #edf0f4;
}
.kc-mobile-drawer-close{
  margin-left:auto;
  width:40px;
  height:40px;
  border:0;
  background:#f4f6f9;
  color:#687489;
  border-radius:12px;
}
.kc-mobile-drawer-user{
  display:flex;
  align-items:center;
  gap:10px;
  min-width:0;
}
.kc-mobile-drawer-user strong{
  display:block;
  font-size:13px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.kc-mobile-drawer-user span{
  display:block;
  color:#8b95a7;
  font-size:10px;
  margin-top:2px;
}
.kc-mobile-drawer-body{
  flex:1;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch;
  padding:9px 10px;
}
.kc-mobile-drawer-body .kc-nav-item{
  min-height:46px;
  font-size:13px;
}
.kc-mobile-drawer-footer{
  border-top:1px solid #edf0f4;
  padding:10px 10px calc(10px + env(safe-area-inset-bottom));
  background:#fff;
}
.kc-mobile-drawer-footer .kc-nav-item{
  min-height:46px;
}
.kc-mobile-nav{padding-bottom:max(5px,env(safe-area-inset-bottom))}
.kc-mobile-nav button{min-height:52px;touch-action:manipulation}
.kc-topbar{padding-top:env(safe-area-inset-top)}
.kc-modal-backdrop{
  padding-top:max(8px,env(safe-area-inset-top));
  padding-bottom:max(8px,env(safe-area-inset-bottom));
}
.kc-modal{
  max-height:calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 16px);
}
@supports not (height: 100dvh){
  .kc-modal{max-height:calc(100vh - 16px)}
}
.kc-community-shell,
.kc-community-shell *{
  -webkit-tap-highlight-color:transparent;
}

/* ================================================================
   ÉTAPE 1 — SOCLE RESPONSIVE
   ================================================================ */
.kc-community-shell{
  min-height:100dvh;
  width:100%;
  overflow-x:clip;
  background:#f5f7fb;
}
.kc-community-shell button,
.kc-community-shell input,
.kc-community-shell textarea,
.kc-community-shell select{
  -webkit-tap-highlight-color:transparent;
}
.kc-community-shell img,
.kc-community-shell video{
  max-width:100%;
}
.kc-community-shell .kc-main{
  min-width:0;
}
@media (max-width:900px){
  .kc-community-shell .kc-right{display:none}
  .kc-community-shell .kc-main{width:100%;max-width:none}
}
@media (max-width:640px){
  .kc-community-shell{
    padding-bottom:env(safe-area-inset-bottom);
  }
  .kc-community-shell .kc-main{
    padding-left:10px;
    padding-right:10px;
  }
  .kc-community-shell .kc-card{
    border-radius:14px;
  }
  .kc-community-shell .kc-section-tabs{
    overflow-x:auto;
    scrollbar-width:none;
    -webkit-overflow-scrolling:touch;
  }
  .kc-community-shell .kc-section-tabs::-webkit-scrollbar{display:none}
}

.kc-empty{min-height:170px;padding:28px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:#7c8798}
.kc-empty i{font-size:27px;color:#0b66ff;margin-bottom:3px}
.kc-empty strong{color:#273247;font-size:14px}
.kc-empty-mini{padding:14px 0;color:#8b95a7;display:flex;align-items:center;gap:8px;font-size:11px}
.kc-empty-mini i{color:#9aa5b6}
.kc-error{padding:20px;border:1px solid #ffd5d7;background:#fff5f5;border-radius:14px;color:#b62f35}
.kc-mobile-nav{display:none}
.kc-mobile-only{display:none}
@media(max-width:1200px){.kc-layout{grid-template-columns:215px minmax(0,650px);justify-content:center}.kc-right{display:none}.kc-brand{min-width:200px}}
@media(max-width:850px){
.kc-mobile-menu-trigger{display:flex}
.kc-topbar{padding-left:10px}
.kc-topbar{padding:0 12px;gap:10px;height:62px}.kc-brand{min-width:auto}.kc-brand-text-wrap{display:none}.kc-search{max-width:none}.kc-top-actions .optional{display:none}.kc-layout{display:block;padding:12px 10px 82px}.kc-left{display:none}.kc-main{width:100%;max-width:680px;margin:0 auto}.kc-mobile-nav{display:flex;position:fixed;left:0;right:0;bottom:0;height:63px;background:rgba(255,255,255,.96);backdrop-filter:blur(16px);border-top:1px solid #e3e8f0;z-index:80;justify-content:space-around;padding:5px}.kc-mobile-nav button{flex:1;border:0;background:transparent;color:#7b8798;border-radius:11px;font-size:10px;font-weight:800}.kc-mobile-nav button i{display:block;font-size:16px;margin-bottom:4px}.kc-mobile-nav button.active{color:#0b66ff}.kc-brand-mark{width:36px;height:36px}.kc-topbar .kc-search input{font-size:12px}.kc-page-title h1{font-size:23px}.kc-stories{margin-right:-10px;padding-right:10px}.kc-story{min-width:92px;width:92px;height:145px}.kc-post-actions{grid-template-columns:repeat(4,1fr);margin:0 10px}.kc-post-action{font-size:11px;gap:5px}.kc-post-head{padding:14px 12px 9px}.kc-post-content{padding:0 12px 12px}.kc-post-stats{padding:0 12px 8px}.kc-comments{padding:12px}.kc-modal-backdrop{padding:8px;align-items:flex-end}.kc-modal{max-height:94vh;border-radius:22px 22px 0 0}.kc-profile-cover{height:165px}.kc-profile-row{align-items:flex-end;gap:10px;margin-top:-38px}.kc-avatar-xl{width:75px;height:75px}.kc-profile-buttons{position:absolute;right:0;bottom:7px}.kc-profile-main{padding-top:8px}.kc-profile-main h2{font-size:18px}.kc-profile-stats{gap:16px}.kc-message-shell{height:calc(100vh - 138px);min-height:0;grid-template-columns:1fr}.kc-message-list{display:none}.kc-chat{display:flex}.kc-short-grid{grid-template-columns:repeat(2,1fr)}.kc-short{height:280px}.kc-discover-grid,.kc-page-grid,.kc-market-grid{grid-template-columns:1fr}.kc-kpi-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.kc-top-actions{gap:3px}.kc-icon-btn{width:36px;height:36px}.kc-topbar .kc-avatar{width:34px;height:34px}.kc-search input{padding-left:35px}.kc-search i{left:12px}.kc-story{min-width:82px;width:82px;height:132px}.kc-story-add .story-user{width:44px;height:44px}.kc-story-add .plus{top:39px}.kc-composer-actions .kc-composer-action span{display:none}.kc-post-action span{display:none}.kc-post-action{font-size:14px}.kc-short-grid{gap:7px}.kc-short{height:245px}.kc-modal-body{padding:14px}}
`;

function Avatar({ src, name, size = "", online = false, verified = false }) {
  return (
    <div style={{ position: "relative", flex: "0 0 auto" }}>
      {src ? (
        <img
          src={src}
          alt={name || ""}
          className={`kc-avatar ${size ? `kc-avatar-${size}` : ""}`}
        />
      ) : (
        <div
          className={`kc-avatar ${size ? `kc-avatar-${size}` : ""}`}
          style={{
            display: "grid",
            placeItems: "center",
            background: "#eaf2ff",
            color: COLORS.primary,
            fontWeight: 900,
          }}
        >
          {initials(name)}
        </div>
      )}
      {online && (
        <span
          style={{
            position: "absolute",
            right: 0,
            bottom: 1,
            width: 10,
            height: 10,
            background: COLORS.success,
            border: "2px solid #fff",
            borderRadius: "50%",
          }}
        />
      )}
      {verified && (
        <span
          title="Compte vérifié"
          style={{
            position: "absolute",
            right: -1,
            top: -1,
            width: 17,
            height: 17,
            borderRadius: "50%",
            background: COLORS.primary,
            color: "#fff",
            border: "2px solid #fff",
            display: "grid",
            placeItems: "center",
            fontSize: 7,
          }}
        >
          <i className={icon("check")} />
        </span>
      )}
    </div>
  );
}

function NavItem({ iconName, label, active, badge, onClick }) {
  return (
    <button className={`kc-nav-item ${active ? "active" : ""}`} onClick={onClick}>
      <i className={icon(iconName)} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? (
        <span
          style={{
            background: active ? "#d8e8ff" : "#eef1f6",
            color: active ? COLORS.primary : "#7c8798",
            borderRadius: 20,
            padding: "3px 7px",
            fontSize: 10,
          }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="kc-modal-backdrop" onMouseDown={onClose}>
      <div
        className={`kc-modal ${wide ? "wide" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="kc-modal-head">
          <h3>{title}</h3>
          <button className="kc-close" onClick={onClose} aria-label="Fermer">
            <i className={icon("xmark")} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle, action, onAction }) {
  return (
    <div className="kc-page-title">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action ? (
        <button className="kc-btn primary" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}

function Stories({ stories, onOpen, onCreate }) {
  return (
    <div className="kc-stories">
      <div className="kc-story kc-story-add" onClick={onCreate}>
        <div className="story-user" style={{
          width: 52, height: 52, borderRadius: "50%",
          display: "grid", placeItems: "center",
          background: "#eaf2ff", color: COLORS.primary,
          fontWeight: 900, position: "absolute", top: 10
        }}>
          <i className={icon("user")} />
        </div>
        <div className="plus">
          <i className={icon("plus")} />
        </div>
        <span className="kc-story-name">Créer une story</span>
      </div>
      {stories
        .filter((x) => !x.own)
        .map((story) => (
          <div
            className="kc-story"
            key={story.id}
            onClick={() => onOpen(story)}
          >
            {story.image ? (
              <img
                className="story-image"
                src={story.image}
                alt={story.name}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg,#0b66ff,#5a42c5)",
                }}
              />
            )}
            <div className="kc-story-bg" />
            <Avatar src={story.avatar} name={story.name} />
            <span className="kc-story-name">{story.name}</span>
          </div>
        ))}
    </div>
  );
}

function Composer({ user, onCreate, onStory }) {
  return (
    <div className="kc-card kc-composer">
      <div className="kc-composer-row">
        <Avatar
          src={user?.avatar || ""}
          name={user?.name || "Vous"}
        />
        <button className="kc-composer-input" onClick={onCreate}>
          Quoi de neuf, {user?.name?.split(" ")[0] || "vous"} ?
        </button>
      </div>
      <div className="kc-composer-actions">
        <button className="kc-composer-action video" onClick={onCreate}>
          <i className={icon("video")} />
          <span>Vidéo</span>
        </button>
        <button className="kc-composer-action photo" onClick={onCreate}>
          <i className={icon("image")} />
          <span>Photo</span>
        </button>
        <button className="kc-composer-action event" onClick={onStory}>
          <i className={icon("circle-play")} />
          <span>Story / Live</span>
        </button>
        <button className="kc-composer-action" onClick={onCreate}>
          <i className={icon("chart-simple")} />
          <span>Sondage</span>
        </button>
      </div>
    </div>
  );
}

function Poll({ poll, onVote }) {
  return (
    <div className="kc-post-poll">
      <div className="kc-poll-question">{poll.question}</div>
      {poll.options.map((option, i) => (
        <div className="kc-poll-option" key={`${option.label}-${i}`}>
          <span>
            {option.label}{" "}
            <small style={{ color: "#9aa3b2" }}>({option.votes})</small>
          </span>
          <button onClick={() => onVote(i)}>Voter</button>
        </div>
      ))}
    </div>
  );
}

function Comments({ postId, comments, onAdd }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(postId, value.trim());
    setValue("");
  };

  return (
    <div className="kc-comments">
      {comments.length ? (
        comments.map((comment) => (
          <div className="kc-comment" key={comment.id}>
            <Avatar src={comment.avatar} name={comment.author} />
            <div className="kc-comment-bubble">
              <strong>{comment.author}</strong>
              <p>{comment.text}</p>
              <small style={{ color: "#8c96a7" }}>{comment.time}</small>
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: "#8c96a7", paddingBottom: 10 }}>
          Soyez le premier à commenter.
        </div>
      )}
      <form className="kc-comment-form" onSubmit={submit}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Écrire un commentaire..."
        />
        <button type="submit" aria-label="Publier">
          <i className={icon("paper-plane")} />
        </button>
      </form>
    </div>
  );
}

function LegacyPostCard({
  post,
  comments,
  onLike,
  onComment,
  onShare,
  onSave,
  onVote,
  onMenu,
}) {
  const [showComments, setShowComments] = useState(false);
  const author = post.author || {};
  const isVideo = Boolean(post.videoUrl);

  return (
    <article className="kc-card kc-post">
      <div className="kc-post-head">
        <Avatar
          src={author.avatar}
          name={author.name}
          verified={author.verified}
        />
        <div className="kc-post-author">
          <strong>{author.name || "Utilisateur Konan"}</strong>
          <small>
            {author.role || "Membre"} • {timeAgo(post.createdAt)} •{" "}
            <i className={icon("earth-americas")} style={{ fontSize: 9 }} />
          </small>
        </div>
        <button className="kc-post-menu" onClick={() => onMenu(post)}>
          <i className={icon("ellipsis")} />
        </button>
      </div>

      {post.title ? (
        <div className="kc-post-content" style={{ paddingBottom: 5 }}>
          <strong style={{ fontSize: 15 }}>{post.title}</strong>
        </div>
      ) : null}

      {post.content ? (
        <div className="kc-post-content">
          <p>{post.content}</p>
          {post.hashtags?.length ? (
            <div className="kc-hashtags">
              {post.hashtags.map((tag) => `#${String(tag).replace(/^#/, "")}`).join(" ")}
            </div>
          ) : null}
        </div>
      ) : null}

      {isVideo ? (
        <video
          className="kc-post-video"
          controls
          playsInline
          preload="metadata"
          poster={post.thumbnailUrl || undefined}
          src={post.videoUrl}
        />
      ) : post.image ? (
        <img className="kc-post-media" src={post.image} alt="" />
      ) : post.thumbnailUrl ? (
        <img className="kc-post-media" src={post.thumbnailUrl} alt="" />
      ) : null}

      {post.poll ? <Poll poll={post.poll} onVote={(i) => onVote(post.id, i)} /> : null}

      <div className="kc-post-stats">
        <div className="kc-reaction-line">
          <div className="kc-reaction-icons">
            <span className="r-like">
              <i className={icon("thumbs-up")} />
            </span>
            <span className="r-love">
              <i className={icon("heart")} />
            </span>
          </div>
          <span>{Number(post.likesCount || 0).toLocaleString("fr-FR")}</span>
        </div>
        <div>
          {Number(post.commentsCount || comments.length || 0).toLocaleString("fr-FR")}{" "}
          commentaires • {Number(post.sharesCount || 0).toLocaleString("fr-FR")} partages
        </div>
      </div>

      <div className="kc-post-actions">
        <button
          className={`kc-post-action ${post.liked ? "liked" : ""}`}
          onClick={() => onLike(post.id)}
        >
          <i className={icon(post.liked ? "thumbs-up" : "thumbs-up")} />
          <span>J’aime</span>
        </button>
        <button
          className="kc-post-action"
          onClick={() => setShowComments((v) => !v)}
        >
          <i className={icon("comment")} />
          <span>Commenter</span>
        </button>
        <button className="kc-post-action" onClick={() => onShare(post)}>
          <i className={icon("share")} />
          <span>Partager</span>
        </button>
        <button
          className={`kc-post-action ${post.saved ? "liked" : ""}`}
          onClick={() => onSave(post.id)}
        >
          <i className={icon(post.saved ? "bookmark" : "bookmark")} />
          <span>Enregistrer</span>
        </button>
      </div>

      {showComments ? (
        <Comments
          postId={post.id}
          comments={comments}
          onAdd={onComment}
        />
      ) : null}
    </article>
  );
}


function FeedComposer({
  user,
  text,
  setText,
  mode,
  setMode,
  media,
  setMedia,
  poll,
  setPoll,
  onPublish,
  publishing,
}) {
  const fileInputRef = React.useRef(null);

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const next = files.map((file) => ({
      file,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setMedia((prev) => [...prev, ...next]);
    event.target.value = "";
  };

  const removeMedia = (index) => {
    setMedia((prev) => {
      const item = prev[index];
      if (item?.url) URL.revokeObjectURL(item.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updatePoll = (index, value) => {
    setPoll((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addPollOption = () => {
    setPoll((prev) => [...prev, ""]);
  };

  const canPublish =
    text.trim().length > 0 ||
    media.length > 0 ||
    (mode === "poll" && poll.some((option) => option.trim()));

  return (
    <section className="kc-card kc-composer">
      <div className="kc-composer-top">
        <Avatar
          src={user?.avatar || user?.profilePicture}
          name={user?.name}
          size="md"
          verified={user?.verified}
        />
        <button
          className="kc-composer-input"
          onClick={() => setMode("post")}
          type="button"
        >
          {text.trim()
            ? text
            : "Quoi de neuf ? Partagez quelque chose avec votre communauté…"}
        </button>
      </div>

      <div className="kc-composer-tabs">
        <button
          className={mode === "post" ? "active" : ""}
          type="button"
          onClick={() => setMode("post")}
        >
          <i className={icon("pen")} /> Publication
        </button>

        <button
          className={mode === "media" ? "active" : ""}
          type="button"
          onClick={() => {
            setMode("media");
            fileInputRef.current?.click();
          }}
        >
          <i className={icon("image")} /> Photo / vidéo
        </button>

        <button
          className={mode === "poll" ? "active" : ""}
          type="button"
          onClick={() => setMode("poll")}
        >
          <i className={icon("square-poll-vertical")} /> Sondage
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={handleFiles}
        />
      </div>

      <div className="kc-composer-body">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrivez votre publication…"
          rows={mode === "post" ? 4 : 3}
        />

        {mode === "media" || media.length > 0 ? (
          <div className="kc-composer-media">
            {media.map((item, index) => (
              <div className="kc-media-preview" key={`${item.name}-${index}`}>
                {item.type.startsWith("video/") ? (
                  <video src={item.url} controls playsInline />
                ) : (
                  <img src={item.url} alt={item.name} />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  title="Retirer"
                >
                  <i className={icon("xmark")} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="kc-add-media"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className={icon("plus")} />
              <span>Ajouter</span>
            </button>
          </div>
        ) : null}

        {mode === "poll" ? (
          <div className="kc-poll-editor">
            <strong>Votre sondage</strong>
            {poll.map((option, index) => (
              <input
                key={index}
                value={option}
                onChange={(e) => updatePoll(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
            ))}
            <button type="button" className="kc-btn" onClick={addPollOption}>
              <i className={icon("plus")} /> Ajouter une option
            </button>
          </div>
        ) : null}
      </div>

      <div className="kc-composer-bottom">
        <span className="kc-composer-hint">
          <i className={icon("shield-halved")} /> Visible selon vos paramètres de confidentialité
        </span>

        <button
          type="button"
          className="kc-btn primary"
          disabled={!canPublish || publishing}
          onClick={onPublish}
        >
          {publishing ? (
            <>
              <i className={icon("spinner", "fa-spin")} /> Publication…
            </>
          ) : (
            <>
              Publier <i className={icon("paper-plane")} />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function PollCard({ post, onVote }) {
  const options = safeArray(post?.poll?.options || post?.pollOptions);
  if (!options.length) return null;

  const totalVotes = options.reduce(
    (sum, option) => sum + Number(option?.votes || option?.voteCount || 0),
    0
  );

  return (
    <div className="kc-poll">
      <strong>{post?.poll?.question || post?.question || "Sondage"}</strong>
      <div className="kc-poll-options">
        {options.map((option, index) => {
          const votes = Number(option?.votes || option?.voteCount || 0);
          const percent = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;

          return (
            <button
              key={option?.id || index}
              type="button"
              className="kc-poll-option"
              onClick={() => onVote(post.id, index)}
            >
              <span className="kc-poll-progress" style={{ width: `${percent}%` }} />
              <span className="kc-poll-label">
                {option?.text || option?.label || `Option ${index + 1}`}
              </span>
              <span className="kc-poll-percent">{percent}%</span>
            </button>
          );
        })}
      </div>
      <small>{totalVotes} vote{totalVotes > 1 ? "s" : ""}</small>
    </div>
  );
}

function PostCard({
  post,
  comments,
  commentsOpen,
  commentDraft,
  setCommentDraft,
  commentsLoading,
  onLike,
  onSave,
  onShare,
  onComments,
  onCommentSubmit,
  onVote,
  onDelete,
  onMenu,
  currentUser,
}) {
  const author = post.author || post.user || {};
  const isOwner =
    String(author.id || author._id || "") ===
    String(currentUser?._id || currentUser?.id || "");

  return (
    <article className="kc-card kc-post">
      <div className="kc-post-head">
        <Avatar
          src={author.avatar || author.profilePicture}
          name={author.name || author.username}
          size="md"
          verified={author.verified}
          online={author.online}
        />

        <div className="kc-post-author">
          <strong>
            {author.name || author.username || "Membre"}
            {author.verified ? <i className={icon("badge-check")} /> : null}
          </strong>
          <span>
            {author.role || "Membre de la communauté"}{post.createdAt ? ` · ${timeAgo(post.createdAt)}` : ""}
          </span>
        </div>

        <button
          className="kc-icon-btn"
          type="button"
          title="Plus d'options"
          onClick={() => onMenu?.(post)}
        >
          <i className={icon("ellipsis")} />
        </button>
      </div>

      {post.content || post.text || post.title ? (
        <div className="kc-post-content">
          {post.title ? <h3>{post.title}</h3> : null}
          <p>{post.content || post.text}</p>
        </div>
      ) : null}

      {safeArray(post.media || post.mediaItems).length ? (
        <div className={`kc-post-media kc-media-count-${Math.min(safeArray(post.media || post.mediaItems).length, 4)}`}>
          {safeArray(post.media || post.mediaItems).map((item, index) => {
            const url = item?.url || item?.secureUrl || item?.src;
            const type = item?.type || item?.mimeType || "";
            if (!url) return null;

            return type.startsWith("video/") || item?.kind === "video" ? (
              <video key={index} src={url} controls playsInline preload="metadata" />
            ) : (
              <img key={index} src={url} alt="" loading="lazy" />
            );
          })}
        </div>
      ) : post.imageUrl || post.image ? (
        <div className="kc-post-media">
          <img src={post.imageUrl || post.image} alt="" loading="lazy" />
        </div>
      ) : post.videoUrl ? (
        <div className="kc-post-media">
          <video src={post.videoUrl} controls playsInline preload="metadata" />
        </div>
      ) : null}

      {post.poll || safeArray(post.pollOptions).length ? (
        <PollCard post={post} onVote={onVote} />
      ) : null}

      <div className="kc-post-stats">
        <span>
          {Number(post.likesCount || post.likeCount || 0).toLocaleString("fr-FR")} réaction
          {(Number(post.likesCount || post.likeCount || 0) > 1) ? "s" : ""}
        </span>
        <span>
          {Number(post.commentsCount || 0).toLocaleString("fr-FR")} commentaire
          {(Number(post.commentsCount || 0) > 1) ? "s" : ""}
          {" · "}
          {Number(post.sharesCount || 0).toLocaleString("fr-FR")} partage
          {(Number(post.sharesCount || 0) > 1) ? "s" : ""}
        </span>
      </div>

      <div className="kc-post-actions">
        <button
          type="button"
          className={post.liked ? "active" : ""}
          onClick={() => onLike(post.id)}
        >
          <i className={icon(post.liked ? "heart" : "heart")} />
          J'aime
        </button>

        <button
          type="button"
          className={commentsOpen ? "active" : ""}
          onClick={() => onComments(post.id)}
        >
          <i className={icon("comment")} />
          Commenter
        </button>

        <button
          type="button"
          disabled={post.id === undefined}
          onClick={() => onShare(post)}
        >
          <i className={icon("share")} />
          Partager
        </button>

        <button
          type="button"
          className={post.saved ? "active" : ""}
          onClick={() => onSave(post.id)}
        >
          <i className={icon("bookmark")} />
          Enregistrer
        </button>
      </div>

      {commentsOpen ? (
        <div className="kc-comments">
          <div className="kc-comment-write">
            <Avatar
              src={currentUser?.avatar || currentUser?.profilePicture}
              name={currentUser?.name}
              size="sm"
            />
            <input
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onCommentSubmit(post.id);
                }
              }}
              placeholder="Écrire un commentaire…"
            />
            <button
              type="button"
              onClick={() => onCommentSubmit(post.id)}
              disabled={!String(commentDraft || "").trim()}
            >
              <i className={icon("paper-plane")} />
            </button>
          </div>

          {commentsLoading ? (
            <div className="kc-comments-loading">
              <i className={icon("spinner", "fa-spin")} /> Chargement…
            </div>
          ) : comments?.length ? (
            comments.map((comment, index) => (
              <div className="kc-comment" key={comment.id || comment._id || index}>
                <Avatar
                  src={comment.author?.avatar || comment.user?.avatar}
                  name={comment.author?.name || comment.user?.name}
                  size="sm"
                />
                <div>
                  <strong>
                    {comment.author?.name || comment.user?.name || "Membre"}
                  </strong>
                  <p>{comment.text || comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="kc-comments-empty">
              Soyez le premier à commenter cette publication.
            </div>
          )}

          {isOwner ? (
            <button
              type="button"
              className="kc-delete-post"
              onClick={() => onDelete(post)}
            >
              <i className={icon("trash")} /> Supprimer la publication
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}


function RightSidebar({
  contacts = [],
  events = [],
  trends = [],
  onMessage,
  onProfile,
}) {
  return (
    <aside className="kc-right">
      <div className="kc-side-card">
        <div className="kc-side-title">
          <strong>Contacts</strong>
          <button onClick={onMessage}>Tout voir</button>
        </div>
        {contacts.length ? contacts.slice(0, 6).map((person) => (
          <div className="kc-person" key={person.id || person._id}>
            <Avatar
              src={person.avatar || person.profilePicture}
              name={person.name}
              online={person.online}
              verified={person.verified}
            />
            <div className="kc-person-info">
              <strong>{person.name}</strong>
              <span>{person.role || "Membre"}</span>
            </div>
            <button
              className="kc-follow"
              onClick={() => onMessage(person)}
              title="Envoyer un message"
            >
              <i className={icon("message")} />
            </button>
          </div>
        )) : (
          <div className="kc-empty-mini">
            <i className={icon("user-group")} />
            <span>Aucun contact à afficher.</span>
          </div>
        )}
      </div>

      <div className="kc-side-card">
        <div className="kc-side-title">
          <strong>Tendances</strong>
          <button onClick={onProfile}>Explorer</button>
        </div>
        {trends.length ? trends.slice(0, 6).map((trend, i) => (
          <div className="kc-trend" key={trend.id || trend._id || `${trend.name}-${i}`}>
            <span>#{i + 1} • Tendance</span>
            <strong>{trend.name || trend.tag || trend.title}</strong>
            {trend.count != null ? <small>{trend.count} publications</small> : null}
          </div>
        )) : (
          <div className="kc-empty-mini">
            <i className={icon("fire")} />
            <span>Les tendances apparaîtront ici.</span>
          </div>
        )}
      </div>

      <div className="kc-side-card">
        <div className="kc-side-title">
          <strong>Événements</strong>
          <button>Tout voir</button>
        </div>
        {events.length ? events.slice(0, 4).map((event) => (
          <div className="kc-event" key={event.id || event._id}>
            <div className="kc-event-date">
              {event.dateLabel || event.date || "—"}
            </div>
            <div>
              <strong>{event.title || event.name}</strong>
              <span>{event.meta || event.location || "Événement communautaire"}</span>
            </div>
          </div>
        )) : (
          <div className="kc-empty-mini">
            <i className={icon("calendar-days")} />
            <span>Aucun événement à venir.</span>
          </div>
        )}
      </div>

      <div className="kc-footer">
        Conditions • Confidentialité • Cookies • Aide • Accessibilité
        <br />
        © {new Date().getFullYear()} KonanShopping Community
      </div>
    </aside>
  );
}

function CreatePostModal({ user, onClose, onPublish }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mode, setMode] = useState("post");
  const [hashtags, setHashtags] = useState("");
  const [publishing, setPublishing] = useState(false);

  const submit = async () => {
    if (!content.trim() && !title.trim() && !videoUrl.trim() && !imageUrl.trim()) {
      return;
    }
    setPublishing(true);
    try {
      await onPublish({
        title: title.trim(),
        description: content.trim(),
        content: content.trim(),
        videoUrl: videoUrl.trim(),
        thumbnailUrl: imageUrl.trim(),
        image: imageUrl.trim(),
        hashtags: hashtags
          .split(/\s+/)
          .map((x) => x.replace(/^#/, "").trim())
          .filter(Boolean),
        mode,
      });
      onClose();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Modal title="Créer une publication" onClose={onClose}>
      <div className="kc-modal-body">
        <div className="kc-create-user">
          <Avatar
            src={user?.avatar || ""}
            name={user?.name || "Vous"}
          />
          <div>
            <strong>{user?.name || "Votre profil"}</strong>
            <div style={{ color: "#8a95a7", fontSize: 11 }}>
              <i className={icon("earth-americas")} /> Tout le monde
            </div>
          </div>
        </div>

        {mode === "post" ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre (facultatif)"
              style={{
                width: "100%",
                border: "1px solid #e4e9f0",
                borderRadius: 11,
                padding: "10px 12px",
                marginBottom: 10,
                outline: "none",
              }}
            />
            <textarea
              className="kc-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez une idée, une expérience ou une opportunité avec la communauté..."
              autoFocus
            />
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#hashtags"
              style={{
                width: "100%",
                border: "1px solid #e4e9f0",
                borderRadius: 11,
                padding: "10px 12px",
                outline: "none",
              }}
            />
            <div className="kc-create-tools">
              <button className="kc-tool" onClick={() => setMode("video")}>
                <i className={icon("video")} /> Vidéo
              </button>
              <button className="kc-tool" onClick={() => setMode("image")}>
                <i className={icon("image")} /> Photo
              </button>
              <button className="kc-tool" onClick={() => setMode("poll")}>
                <i className={icon("chart-simple")} /> Sondage
              </button>
              <button className="kc-tool">
                <i className={icon("location-dot")} /> Localisation
              </button>
              <button className="kc-tool">
                <i className={icon("user-tag")} /> Mention
              </button>
            </div>
          </>
        ) : null}

        {mode === "video" ? (
          <div style={{ display: "grid", gap: 10 }}>
            <textarea
              className="kc-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ajoutez une description à votre vidéo..."
            />
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="URL de la vidéo"
              style={{
                width: "100%",
                border: "1px solid #e4e9f0",
                borderRadius: 11,
                padding: "11px 12px",
                outline: "none",
              }}
            />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL de la miniature (facultatif)"
              style={{
                width: "100%",
                border: "1px solid #e4e9f0",
                borderRadius: 11,
                padding: "11px 12px",
                outline: "none",
              }}
            />
            <button className="kc-btn" onClick={() => setMode("post")}>
              <i className={icon("arrow-left")} /> Retour
            </button>
          </div>
        ) : null}

        {mode === "image" ? (
          <div style={{ display: "grid", gap: 10 }}>
            <textarea
              className="kc-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ajoutez une description à votre photo..."
            />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL de l'image"
              style={{
                width: "100%",
                border: "1px solid #e4e9f0",
                borderRadius: 11,
                padding: "11px 12px",
                outline: "none",
              }}
            />
            <button className="kc-btn" onClick={() => setMode("post")}>
              <i className={icon("arrow-left")} /> Retour
            </button>
          </div>
        ) : null}

        {mode === "poll" ? (
          <div style={{ padding: 10, background: "#f7f9fc", borderRadius: 12 }}>
            <strong>Le sondage sera activé avec le module de vote backend.</strong>
            <p style={{ color: "#7f899a", fontSize: 12 }}>
              Étape 1 : l'interface est prête. Étape 2 : persistance, votes et anti-abus.
            </p>
            <button className="kc-btn" onClick={() => setMode("post")}>
              <i className={icon("arrow-left")} /> Retour
            </button>
          </div>
        ) : null}

        <button className="kc-submit" disabled={publishing} onClick={submit}>
          {publishing ? "Publication..." : "Publier"}
        </button>
      </div>
    </Modal>
  );
}

function StoryViewer({ story, onClose }) {
  return (
    <Modal title={story?.name || "Story"} onClose={onClose}>
      <div style={{ background: "#101828", minHeight: 520, position: "relative" }}>
        {story?.image ? (
          <img
            src={story.image}
            alt={story.name}
            style={{ width: "100%", height: 520, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              height: 520,
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
              background: "linear-gradient(135deg,#0b66ff,#5a42c5)",
            }}
          >
            {story?.name}
          </div>
        )}
      </div>
    </Modal>
  );
}

function ProfileView({ user, onBack, onMessage }) {
  const profile = user || {
    name: "Votre profil",
    avatar: "",
    role: "Membre Konan Community",
  };
  return (
    <div>
      <button className="kc-btn" onClick={onBack} style={{ marginBottom: 12 }}>
        <i className={icon("arrow-left")} /> Retour
      </button>
      <div className="kc-card" style={{ overflow: "hidden" }}>
        <div className="kc-profile-cover" />
        <div className="kc-profile-body">
          <div className="kc-profile-row">
            <div className="kc-profile-avatar-wrap">
              <Avatar src={profile.avatar} name={profile.name} size="xl" verified />
            </div>
            <div className="kc-profile-main">
              <h2>{profile.name}</h2>
              <p>{profile.role || "Membre de Konan Community"} • Cameroun 🇨🇲</p>
            </div>
            <div className="kc-profile-buttons">
              <button className="kc-btn primary" onClick={onMessage}>
                <i className={icon("message")} /> Message
              </button>
              <button className="kc-btn">
                <i className={icon("user-plus")} /> Suivre
              </button>
            </div>
          </div>
          <div className="kc-profile-stats">
            <div><strong>1,8 k</strong><span>Abonnés</span></div>
            <div><strong>428</strong><span>Abonnements</span></div>
            <div><strong>86</strong><span>Publications</span></div>
            <div><strong>Pro</strong><span>Profil</span></div>
          </div>
        </div>
      </div>
      <div className="kc-section-tabs" style={{ marginTop: 15 }}>
        <button className="kc-section-tab active">Publications</button>
        <button className="kc-section-tab">À propos</button>
        <button className="kc-section-tab">Photos</button>
        <button className="kc-section-tab">Vidéos</button>
      </div>
      <div className="kc-card" style={{ padding: 17 }}>
        <strong>À propos</strong>
        <p style={{ color: "#687489", lineHeight: 1.6 }}>
          Construisez votre identité professionnelle, développez votre réseau et
          échangez avec la communauté KonanShopping.
        </p>
      </div>
    </div>
  );
}


function FeedView({
  user,
  posts,
  postsError,
  loadingPosts,
  comments,
  openComments,
  commentDrafts,
  setCommentDrafts,
  loadingComments,
  onPublish,
  publishing,
  composerText,
  setComposerText,
  composerMode,
  setComposerMode,
  composerMedia,
  setComposerMedia,
  composerPoll,
  setComposerPoll,
  onLike,
  onSave,
  onShare,
  onComments,
  onCommentSubmit,
  onVote,
  onDelete,
}) {
  return (
    <div className="kc-feed">
      <SectionTitle
        title="Fil d'actualité"
        subtitle="Les publications de votre communauté."
      />

      <FeedComposer
        user={user}
        text={composerText}
        setText={setComposerText}
        mode={composerMode}
        setMode={setComposerMode}
        media={composerMedia}
        setMedia={setComposerMedia}
        poll={composerPoll}
        setPoll={setComposerPoll}
        onPublish={onPublish}
        publishing={publishing}
      />

      {postsError ? (
        <div className="kc-card kc-api-notice">
          <i className={icon("circle-info")} />
          <span>{postsError}</span>
        </div>
      ) : null}

      {loadingPosts ? (
        <div className="kc-card kc-loading">
          <i className={icon("spinner", "fa-spin")} />
          <span>Chargement des publications…</span>
        </div>
      ) : posts.length ? (
        posts.map((post) => (
          <PostCard
            key={post.id || post._id}
            post={post}
            comments={comments[post.id] || []}
            commentsOpen={Boolean(openComments[post.id])}
            commentDraft={commentDrafts[post.id] || ""}
            setCommentDraft={(value) =>
              setCommentDrafts((prev) => ({ ...prev, [post.id]: value }))
            }
            commentsLoading={Boolean(loadingComments[post.id])}
            onLike={onLike}
            onSave={onSave}
            onShare={onShare}
            onComments={onComments}
            onCommentSubmit={onCommentSubmit}
            onVote={onVote}
            onDelete={onDelete}
            currentUser={user}
          />
        ))
      ) : (
        <div className="kc-card kc-empty">
          <i className={icon("newspaper")} />
          <strong>Aucune publication pour le moment.</strong>
          <span>Les publications réelles apparaîtront ici dès qu'elles seront disponibles.</span>
        </div>
      )}
    </div>
  );
}


function DiscoverView({
  people = [],
  groups = [],
  onProfile,
  onGroups,
}) {
  return (
    <div>
      <SectionTitle
        title="Découvrir"
        subtitle="Trouvez des personnes, entreprises et communautés qui vous correspondent."
      />

      <div className="kc-section-tabs">
        <button className="kc-section-tab active">Pour vous</button>
        <button className="kc-section-tab">Personnes</button>
        <button className="kc-section-tab">Entreprises</button>
        <button className="kc-section-tab">Groupes</button>
      </div>

      <div className="kc-card" style={{ padding: 15, marginBottom: 15 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: "#eaf2ff",
            display: "grid", placeItems: "center", color: COLORS.primary
          }}>
            <i className={icon("magnifying-glass")} />
          </div>
          <div>
            <strong>Développez votre réseau.</strong>
            <p style={{ margin: "4px 0 0", color: "#7c8798", fontSize: 12 }}>
              Connectez-vous à des membres, professionnels, créateurs et entreprises.
            </p>
          </div>
        </div>
      </div>

      <div className="kc-card" style={{ padding: 15, marginBottom: 15 }}>
        <div className="kc-side-title">
          <strong>Personnes recommandées</strong>
          <button>Tout voir</button>
        </div>
        {people.length ? people.map((person) => (
          <div className="kc-person" key={person.id || person._id}>
            <Avatar
              src={person.avatar || person.profilePicture}
              name={person.name}
              online={person.online}
              verified={person.verified}
            />
            <div className="kc-person-info">
              <strong>{person.name}</strong>
              <span>{person.role || "Membre"}</span>
            </div>
            <button className="kc-follow" onClick={() => onProfile(person)}>
              Voir profil
            </button>
          </div>
        )) : (
          <div className="kc-empty">
            <i className={icon("user-group")} />
            <strong>Aucune recommandation pour le moment.</strong>
            <span>Les membres recommandés seront chargés depuis le serveur.</span>
          </div>
        )}
      </div>

      <div className="kc-side-title">
        <strong>Communautés populaires</strong>
        <button onClick={onGroups}>Explorer</button>
      </div>

      <div className="kc-discover-grid">
        {groups.length ? groups.map((group) => (
          <div className="kc-card kc-group-card" key={group.id || group._id}>
            {group.image || group.cover ? (
              <img className="kc-group-cover" src={group.image || group.cover} alt="" />
            ) : (
              <div className="kc-group-cover" style={{ display: "grid", placeItems: "center", background: "#eef4ff" }}>
                <i className={icon("users")} style={{ fontSize: 30, color: COLORS.primary }} />
              </div>
            )}
            <div className="kc-group-body">
              <h3>{group.name}</h3>
              <p>{group.membersCount ?? 0} membres • {group.privacy || "Public"}</p>
              <button className="kc-btn primary" style={{ width: "100%" }}>
                Rejoindre
              </button>
            </div>
          </div>
        )) : (
          <div className="kc-card kc-empty" style={{ gridColumn: "1 / -1" }}>
            <i className={icon("users")} />
            <strong>Aucune communauté disponible.</strong>
            <span>Les communautés seront affichées dès que l'API les fournira.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GroupsView({ groups = [] }) {
  return (
    <div>
      <SectionTitle
        title="Communautés"
        subtitle="Rejoignez des espaces dédiés à vos passions et projets."
        action="Créer un groupe"
      />
      <div className="kc-section-tabs">
        <button className="kc-section-tab active">Pour vous</button>
        <button className="kc-section-tab">Mes groupes</button>
        <button className="kc-section-tab">Tendances</button>
        <button className="kc-section-tab">Invitations</button>
      </div>
      <div className="kc-discover-grid">
        {groups.length ? groups.map((group) => (
          <div className="kc-card kc-group-card" key={group.id || group._id}>
            {group.image || group.cover ? (
              <img className="kc-group-cover" src={group.image || group.cover} alt="" />
            ) : (
              <div className="kc-group-cover" style={{ display: "grid", placeItems: "center", background: "#eef4ff" }}>
                <i className={icon("users")} style={{ fontSize: 30, color: COLORS.primary }} />
              </div>
            )}
            <div className="kc-group-body">
              <h3>{group.name}</h3>
              <p>{group.membersCount ?? 0} membres • {group.privacy || "Public"}</p>
              <div style={{ display: "flex", gap: 7 }}>
                <button className="kc-btn primary" style={{ flex: 1 }}>Rejoindre</button>
                <button className="kc-btn"><i className={icon("ellipsis")} /></button>
              </div>
            </div>
          </div>
        )) : (
          <div className="kc-card kc-empty" style={{ gridColumn: "1 / -1" }}>
            <i className={icon("users")} />
            <strong>Aucune communauté.</strong>
            <span>Cette section attend les données réelles de l'API.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PagesView({ pages = [] }) {
  return (
    <div>
      <SectionTitle
        title="Pages professionnelles"
        subtitle="Suivez les entreprises, marques et créateurs que vous aimez."
        action="Créer une page"
      />
      <div className="kc-page-grid">
        {pages.length ? pages.map((page) => (
          <div className="kc-card kc-page-card" key={page.id || page._id}>
            <Avatar
              src={page.avatar || page.logo}
              name={page.name}
              size="lg"
              verified={page.verified}
            />
            <div className="kc-person-info">
              <strong>{page.name}</strong>
              <span>{page.followersCount ?? 0} abonnés</span>
              <button className="kc-follow" style={{ marginTop: 7 }}>
                Suivre
              </button>
            </div>
          </div>
        )) : (
          <div className="kc-card kc-empty" style={{ gridColumn: "1 / -1" }}>
            <i className={icon("building")} />
            <strong>Aucune page professionnelle.</strong>
            <span>Les pages réelles seront chargées depuis l'API.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsView({ notifications, onRead }) {
  return (
    <div>
      <SectionTitle title="Notifications" subtitle="Restez informé de ce qui compte." />
      <div className="kc-card" style={{ overflow: "hidden" }}>
        {notifications.length ? notifications.map((n) => (
          <button
            key={n.id || n._id}
            className={`kc-notif ${n.unread ? "unread" : ""}`}
            style={{
              width: "100%",
              border: 0,
              textAlign: "left",
              background: n.unread ? "#f4f8ff" : "#fff",
            }}
            onClick={() => onRead(n.id)}
          >
            <div className="kc-notif-icon">
              <i className={icon(n.icon)} />
            </div>
            <div>
              <p>{n.text}</p>
              <small>{n.time}</small>
            </div>
            {n.unread ? (
              <span
                style={{
                  width: 7,
                  height: 7,
                  background: COLORS.primary,
                  borderRadius: "50%",
                  marginLeft: "auto",
                  marginTop: 6,
                }}
              />
            ) : null}
          </button>
        )) : (
          <div className="kc-empty" style={{ padding: 30 }}>
            <i className={icon("bell-slash")} />
            <strong>Aucune notification réelle.</strong>
            <span>Les notifications du serveur apparaîtront ici.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MessagesView({
  conversations,
  activeConversation,
  setActiveConversation,
  messages,
  message,
  setMessage,
  sendMessage,
  loadingMessages,
  onReloadMessages,
}) {
  const [query, setQuery] = useState("");
  const active =
    conversations.find((x) => String(x.id) === String(activeConversation)) ||
    conversations[0] ||
    null;
  const bottomRef = useRef(null);
  const activeMessages = active ? messages[active.id] || [] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.id, activeMessages.length]);

  const visibleConversations = conversations.filter((conv) =>
    String(conv.user?.name || "").toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div>
      <SectionTitle
        title="Messages"
        subtitle="Échangez directement avec les autres membres de KONAN COMMUNITY."
      />

      <div className="kc-card kc-message-shell">
        <div className="kc-message-list">
          <div className="kc-message-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
            />
          </div>

          {visibleConversations.length ? (
            visibleConversations.map((conv) => (
              <button
                key={conv.id}
                className={`kc-conversation ${
                  String(active?.id) === String(conv.id) ? "active" : ""
                }`}
                onClick={() => setActiveConversation(conv.id)}
              >
                <Avatar
                  src={conv.user.avatar}
                  name={conv.user.name}
                  online={conv.user.online}
                  verified={conv.user.verified}
                />
                <div className="kc-person-info">
                  <strong>{conv.user.name}</strong>
                  <small>{conv.lastMessage || "Aucun message"}</small>
                </div>
                {conv.unread ? (
                  <span className="kc-unread">{conv.unread}</span>
                ) : null}
              </button>
            ))
          ) : (
            <div className="kc-empty" style={{ padding: 24 }}>
              <i className={icon("message")} />
              <strong>Aucune conversation réelle.</strong>
              <span>Les conversations créées sur le serveur apparaîtront ici.</span>
            </div>
          )}
        </div>

        <div className="kc-chat">
          {active ? (
            <>
              <div className="kc-chat-head">
                <Avatar
                  src={active.user.avatar}
                  name={active.user.name}
                  online={active.user.online}
                  verified={active.user.verified}
                />
                <div>
                  <strong>{active.user.name}</strong>
                  <small>
                    {active.user.online ? "En ligne" : "Hors ligne"}
                  </small>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
                  <button
                    type="button"
                    className="kc-icon-btn"
                    onClick={onReloadMessages}
                    title="Actualiser"
                  >
                    <i className={icon("rotate-right")} />
                  </button>
                </div>
              </div>

              <div className="kc-chat-messages">
                {loadingMessages ? (
                  <div className="kc-empty" style={{ minHeight: 220 }}>
                    <i className={icon("spinner", "fa-spin")} />
                    <span>Chargement des messages réels…</span>
                  </div>
                ) : activeMessages.length ? (
                  activeMessages.map((m) => (
                    <div
                      className={`kc-bubble-row ${m.me ? "me" : ""}`}
                      key={m.id}
                    >
                      <div className="kc-bubble">
                        {!m.me ? (
                          <strong style={{ display: "block", fontSize: 11, marginBottom: 3 }}>
                            {m.sender?.name || "Membre"}
                          </strong>
                        ) : null}
                        {m.text}
                        <small>{m.time}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="kc-empty" style={{ minHeight: 220 }}>
                    <i className={icon("comments")} />
                    <strong>Aucun message dans cette conversation.</strong>
                    <span>Commencez la discussion avec un message.</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <form
                className="kc-chat-compose"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!message.trim() || !active?.id) return;
                  sendMessage(active.id, message.trim());
                }}
              >
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  disabled={!active}
                />
                <button type="submit" disabled={!message.trim() || !active}>
                  <i className={icon("paper-plane")} />
                </button>
              </form>
            </>
          ) : (
            <div className="kc-empty" style={{ minHeight: 580 }}>
              <i className={icon("comments")} />
              <strong>Sélectionnez une conversation.</strong>
              <span>Vos échanges réels seront affichés ici.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoView({ videos = [] }) {
  return (
    <div>
      <SectionTitle
        title="Vidéos"
        subtitle="Découvrez les contenus courts et les vidéos de la communauté."
      />
      <div className="kc-section-tabs">
        <button className="kc-section-tab active">Pour vous</button>
        <button className="kc-section-tab">Suivis</button>
        <button className="kc-section-tab">En direct</button>
      </div>
      <div className="kc-short-grid">
        {videos.length ? videos.map((video, i) => (
          <div className="kc-short" key={video.id || video._id || i}>
            {video.thumbnailUrl || video.thumbnail ? (
              <img src={video.thumbnailUrl || video.thumbnail} alt="" />
            ) : video.videoUrl ? (
              <video src={video.videoUrl} muted playsInline preload="metadata" />
            ) : (
              <div style={{ height: "100%", display: "grid", placeItems: "center", background: "#101828", color: "#fff" }}>
                <i className={icon("play")} style={{ fontSize: 30 }} />
              </div>
            )}
            <div className="kc-short-overlay">
              <strong>{video.title || video.description || "Vidéo"}</strong>
              <small>
                <i className={icon("play")} /> {video.viewsCount ?? 0} vues
              </small>
            </div>
          </div>
        )) : (
          <div className="kc-card kc-empty" style={{ gridColumn: "1 / -1" }}>
            <i className={icon("video")} />
            <strong>Aucune vidéo disponible.</strong>
            <span>Les vidéos apparaîtront ici depuis le serveur.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function EventsView({ events = [] }) {
  return (
    <div>
      <SectionTitle
        title="Événements"
        subtitle="Rencontres, lives, formations et rendez-vous de la communauté."
        action="Créer un événement"
      />
      <div style={{ display: "grid", gap: 14 }}>
        {events.length ? events.map((event) => (
          <div className="kc-card" key={event.id || event._id} style={{ overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "190px 1fr" }}>
              {event.image || event.cover ? (
                <img src={event.image || event.cover} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 150, display: "grid", placeItems: "center", background: "#eef4ff", color: COLORS.primary }}>
                  <i className={icon("calendar-days")} style={{ fontSize: 30 }} />
                </div>
              )}
              <div style={{ padding: 16 }}>
                <span style={{ color: COLORS.primary, fontWeight: 900, fontSize: 10 }}>
                  {event.dateLabel || event.date || "À venir"}
                </span>
                <h3 style={{ margin: "6px 0" }}>{event.title || event.name}</h3>
                <p style={{ color: "#818c9e", margin: "5px 0 14px" }}>
                  {event.meta || event.location || "Événement communautaire"}
                </p>
                <button className="kc-btn primary">Participer</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="kc-card kc-empty">
            <i className={icon("calendar-days")} />
            <strong>Aucun événement à venir.</strong>
            <span>Les événements seront fournis par l'API Community.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MarketplaceView({ products = [] }) {
  const categories = ["Tout", "Mode", "High-Tech", "Maison", "Beauté", "Services"];

  return (
    <div>
      <SectionTitle
        title="Marketplace"
        subtitle="Découvrez des produits et des vendeurs au cœur de la communauté."
      />
      <div className="kc-card" style={{ padding: 12, marginBottom: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {categories.map((x, i) => (
          <button key={x} className={`kc-btn ${i === 0 ? "primary" : ""}`}>{x}</button>
        ))}
      </div>
      <div className="kc-market-grid">
        {products.length ? products.map((product) => (
          <div className="kc-card kc-product" key={product.id || product._id}>
            {product.image || product.imageUrl ? (
              <img src={product.image || product.imageUrl} alt={product.name || ""} />
            ) : (
              <div style={{ height: 190, display: "grid", placeItems: "center", background: "#f2f5f9", color: "#8b95a7" }}>
                <i className={icon("image")} style={{ fontSize: 28 }} />
              </div>
            )}
            <div className="kc-product-body">
              <strong>{product.name || product.title}</strong>
              <div className="kc-product-price">
                {product.price != null ? `${Number(product.price).toLocaleString("fr-FR")} FCFA` : "Prix non renseigné"}
              </div>
              <small>{product.sellerName || "Vendeur"}</small>
            </div>
          </div>
        )) : (
          <div className="kc-card kc-empty" style={{ gridColumn: "1 / -1" }}>
            <i className={icon("store")} />
            <strong>Aucun produit à afficher.</strong>
            <span>Les produits seront chargés depuis les données réelles.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfessionalView({ posts = [], contacts = [], videos = [], events = [] }) {
  const stats = [
    ["Publications", posts.length, "données actuellement chargées"],
    ["Membres visibles", contacts.length, "données actuellement chargées"],
    ["Vidéos", videos.length, "données actuellement chargées"],
    ["Événements", events.length, "données actuellement chargées"],
  ];

  return (
    <div>
      <div className="kc-prof-banner">
        <h2>Espace professionnel</h2>
        <p>
          Les indicateurs affichés ici proviennent uniquement des données réellement
          retournées par votre API Community.
        </p>
      </div>

      <div className="kc-kpi-grid" style={{ marginBottom: 15 }}>
        {stats.map(([label, value, note]) => (
          <div className="kc-card kc-kpi" key={label}>
            <span>{label}</span>
            <strong>{Number(value).toLocaleString("fr-FR")}</strong>
            <em>{note}</em>
          </div>
        ))}
      </div>

      <div className="kc-card" style={{ padding: 18, marginBottom: 15 }}>
        <div className="kc-side-title">
          <strong>Activité réelle disponible</strong>
        </div>
        {posts.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            {posts.slice(0, 8).map((post) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: "1px solid #eef1f5",
                }}
              >
                <Avatar src={post.author?.avatar} name={post.author?.name} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: "block", fontSize: 12 }}>
                    {post.author?.name || "Membre"}
                  </strong>
                  <span
                    style={{
                      display: "block",
                      color: "#7f899a",
                      fontSize: 11,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.content || post.title || "Publication"}
                  </span>
                </div>
                <span style={{ color: "#8c96a7", fontSize: 10 }}>
                  {post.likesCount || 0} réactions
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="kc-empty">
            <i className={icon("chart-line")} />
            <strong>Aucune activité réelle à analyser.</strong>
            <span>Les indicateurs apparaîtront lorsque l'API fournira des données.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsView({ user }) {
  const [privacy, setPrivacy] = useState(true);
  const [online, setOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const SettingRow = ({ iconName, title, text, value, setValue }) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #eef1f5" }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: "#f3f6fb", color: "#617087", display: "grid", placeItems: "center" }}>
        <i className={icon(iconName)} />
      </div>
      <div style={{ flex: 1 }}>
        <strong>{title}</strong>
        <p style={{ margin: "4px 0 0", color: "#8a95a7", fontSize: 11 }}>{text}</p>
      </div>
      <button
        onClick={() => setValue(!value)}
        style={{
          width: 46,
          height: 26,
          border: 0,
          borderRadius: 20,
          background: value ? COLORS.primary : "#d6dce6",
          padding: 3,
        }}
      >
        <span
          style={{
            display: "block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            transform: value ? "translateX(20px)" : "translateX(0)",
            transition: ".2s",
          }}
        />
      </button>
    </div>
  );

  return (
    <div>
      <SectionTitle title="Paramètres" subtitle="Contrôlez votre expérience et votre confidentialité." />
      <div className="kc-card" style={{ padding: 18, marginBottom: 15 }}>
        <div className="kc-create-user">
          <Avatar src={user?.avatar} name={user?.name} size="lg" />
          <div>
            <strong>{user?.name || "Votre profil"}</strong>
            <p style={{ margin: "4px 0 0", color: "#8b95a7", fontSize: 11 }}>
              Gérer votre compte Konan Community
            </p>
          </div>
        </div>
      </div>
      <div className="kc-card" style={{ padding: "0 18px" }}>
        <h3 style={{ margin: "18px 0 4px" }}>Confidentialité et expérience</h3>
        <SettingRow
          iconName="eye"
          title="Afficher mon statut en ligne"
          text="Permettre à vos contacts de voir quand vous êtes disponible."
          value={online}
          setValue={setOnline}
        />
        <SettingRow
          iconName="lock"
          title="Profil protégé"
          text="Contrôlez qui peut consulter certaines informations de votre profil."
          value={privacy}
          setValue={setPrivacy}
        />
        <SettingRow
          iconName="bell"
          title="Notifications"
          text="Recevoir les notifications sociales et professionnelles."
          value={notifications}
          setValue={setNotifications}
        />
        <div style={{ padding: "15px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="kc-btn">Sécurité</button>
          <button className="kc-btn">Compte</button>
          <button className="kc-btn">Blocages</button>
          <button className="kc-btn">Aide</button>
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const [activeView, setActiveView] = useState("home");
  const [posts, setPosts] = useState([]);
  const [composerText, setComposerText] = useState("");
  const [composerMode, setComposerMode] = useState("post");
  const [composerMedia, setComposerMedia] = useState([]);
  const [composerPoll, setComposerPoll] = useState(["", ""]);
  const [openComments, setOpenComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [sharingPostId, setSharingPostId] = useState(null);
  const [savingPostId, setSavingPostId] = useState(null);

  const [comments, setComments] = useState({});
  const [stories, setStories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [pages, setPages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);
  const [marketplaceProducts, setMarketplaceProducts] = useState([]);
  const [trends, setTrends] = useState([]);
  const [people, setPeople] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const socketRef = useRef(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const currentUser = useMemo(() => user || {}, [user]);
  const currentUserId = currentUser?._id || currentUser?.id || null;

  const showToast = useCallback((text) => {
    setToast(text);
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => {
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        localStorage.getItem("client");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setUser(parsed);
      }
    } catch {
      // L'interface reste utilisable même si le localStorage contient une valeur invalide.
    }
  }, []);

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    setPostsError("");

    try {
      const response = await secureCommunityFetch(apiUrl("/api/community/posts"), {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const serverPosts = safeArray(
        data?.posts || data?.items || data?.data
      ).map(normalizePost);

      // IMPORTANT : aucune donnée fictive n'est injectée si le serveur
      // ne renvoie rien. Le feed reflète uniquement la base réelle.
      setPosts(serverPosts);
    } catch (error) {
      console.warn("Community posts:", error);
      setPosts([]);
      setPostsError(
        "Les publications réelles ne sont pas encore exposées par l'API Community."
      );
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePublish = async () => {
    const text = sanitizeCommunityText(composerText);
    const validPoll = composerPoll
      .map((item) => item.trim())
      .filter(Boolean);

    if (!text && !composerMedia.length && !validPoll.length) {
      showToast("Ajoutez du contenu à votre publication.");
      return;
    }

    setPublishing(true);

    try {
      // Étape 2 garde le frontend prêt pour le multipart backend.
      // Tant que l'API n'accepte pas encore les fichiers, nous envoyons
      // uniquement les métadonnées compatibles JSON.
      const draft = {
        text,
        type: composerMode === "poll" ? "poll" : composerMedia.length ? "media" : "text",
        poll:
          composerMode === "poll"
            ? { options: validPoll.map((option) => ({ text: option })) }
            : undefined,
        media:
          composerMedia.length
            ? composerMedia.map((item) => ({
                name: item.name,
                type: item.type,
              }))
            : [],
      };

      await publishPost(draft);

      composerMedia.forEach((item) => {
        if (item.url) URL.revokeObjectURL(item.url);
      });

      setComposerText("");
      setComposerMode("post");
      setComposerMedia([]);
      setComposerPoll(["", ""]);
    } finally {
      setPublishing(false);
    }
  };

  const loadCommunityData = useCallback(async () => {
    try {
      const response = await secureCommunityFetch(apiUrl("/api/community/bootstrap"), {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      setStories(safeArray(data?.stories));
      setContacts(safeArray(data?.contacts || data?.members));
      setNotifications(safeArray(data?.notifications));
      setConversations(safeArray(data?.conversations).map(normalizeConversation));
      setGroups(safeArray(data?.groups));
      setPages(safeArray(data?.pages));
      setVideos(safeArray(data?.videos));
      setEvents(safeArray(data?.events));
      setMarketplaceProducts(
        safeArray(data?.marketplaceProducts || data?.products)
      );
      setTrends(safeArray(data?.trends));
      setPeople(safeArray(data?.people || data?.suggestions));
    } catch (error) {
      console.warn("Community bootstrap:", error);
      // Pas de données de remplacement : le frontend reste fidèle
      // à l'état réel du serveur.
    }
  }, []);

  useEffect(() => {
    loadCommunityData();
  }, [loadCommunityData]);

  const loadConversationMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    try {
      const response = await fetch(
        apiUrl(`/api/community/conversations/${conversationId}/messages`),
        { headers: { Accept: "application/json" } }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const list = safeArray(data?.messages || data?.items || data?.data)
        .map((item) => normalizeMessage(item, currentUserId))
        .filter(Boolean);
      setMessages((previous) => ({ ...previous, [conversationId]: list }));
    } catch (error) {
      console.error("Community conversation messages:", error);
      setMessages((previous) => ({ ...previous, [conversationId]: [] }));
      showToast("Impossible de charger les messages réels de cette conversation.");
    } finally {
      setLoadingMessages(false);
    }
  }, [currentUserId, showToast]);

  useEffect(() => {
    if (!activeConversation && conversations.length) {
      setActiveConversation(conversations[0].id);
    }
  }, [activeConversation, conversations]);

  useEffect(() => {
    if (activeConversation && messages[activeConversation] === undefined) {
      loadConversationMessages(activeConversation);
    }
  }, [activeConversation, messages, loadConversationMessages]);

  // Le nombre de membres en ligne est alimenté exclusivement par Socket.IO.
  // lorsque le backend Community temps réel sera branché.
  // Aucune valeur artificielle n'est affichée.


  useEffect(() => {
    if (!SOCKET_URL) return undefined;

    const token = getCommunityToken();

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: Boolean(token),

      auth: token
        ? { token }
        : undefined,

      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect_error", () => {
      /* Ne jamais afficher le contenu d'une erreur réseau au client. */
    });

    const communityId = "konan-community";

    const upsertPost = (payload) => {
      const rawPost = payload?.post || payload?.item || payload?.data || payload;
      if (!rawPost || typeof rawPost !== "object") return;
      const post = normalizePost(rawPost);
      if (!post.id || String(post.id).startsWith("post-")) return;
      setPosts((previous) => {
        const exists = previous.some((item) => String(item.id) === String(post.id));
        return exists
          ? previous.map((item) => String(item.id) === String(post.id) ? { ...item, ...post } : item)
          : [post, ...previous];
      });
    };

    const upsertComment = (payload) => {
      const postId = payload?.postId || payload?.post?._id || payload?.post?.id;
      const comment = payload?.comment || payload?.item || payload?.data || payload;
      if (!postId || !(comment?._id || comment?.id)) return;
      setComments((previous) => {
        const current = previous[postId] || [];
        const commentId = comment._id || comment.id;
        if (current.some((item) => String(item._id || item.id) === String(commentId))) return previous;
        return { ...previous, [postId]: [...current, comment] };
      });
    };

    const receiveMessage = (payload) => {
      const conversationId = payload?.conversationId || payload?.conversation?._id || payload?.conversation?.id;
      const raw = payload?.message || payload?.item || payload?.data || payload;
      if (!conversationId || !raw) return;
      const normalized = normalizeMessage(raw, currentUserId);
      if (!normalized) return;
      setMessages((previous) => {
        const current = previous[conversationId] || [];
        if (current.some((item) => String(item.id) === String(normalized.id))) return previous;
        return { ...previous, [conversationId]: [...current, normalized] };
      });
    };

    const receiveOnline = (payload) => {
      const count = typeof payload === "number"
        ? payload
        : Number(payload?.count ?? payload?.onlineUsers ?? payload?.usersCount);
      if (Number.isFinite(count) && count >= 0) setOnlineUsers(count);
    };

    const receiveNotification = (payload) => {
      const notification = payload?.notification || payload?.item || payload?.data || payload;
      if (!notification) return;
      const id = notification._id || notification.id;
      if (!id) return;
      setNotifications((previous) => {
        if (previous.some((item) => String(item._id || item.id) === String(id))) return previous;
        return [{ ...notification, id, unread: true }, ...previous];
      });
    };

    socket.on("connect", () => {
      secureSocketEmit(socket, "joinCommunity", {
        communityId,
      });
      secureSocketEmit(socket, "community:join", {
        communityId,
      });
    });

    ["newPost", "community:newPost", "postCreated"].forEach((event) => socket.on(event, upsertPost));
    ["newComment", "community:newComment", "commentCreated"].forEach((event) => socket.on(event, upsertComment));
    ["newMessage", "community:newMessage", "messageCreated"].forEach((event) => socket.on(event, receiveMessage));
    ["onlineUsers", "community:onlineUsers", "userCount"].forEach((event) => socket.on(event, receiveOnline));
    ["notification", "community:notification", "newNotification"].forEach((event) => socket.on(event, receiveNotification));

    return () => {
      ["newPost", "community:newPost", "postCreated"].forEach((event) => socket.off(event, upsertPost));
      ["newComment", "community:newComment", "commentCreated"].forEach((event) => socket.off(event, upsertComment));
      ["newMessage", "community:newMessage", "messageCreated"].forEach((event) => socket.off(event, receiveMessage));
      ["onlineUsers", "community:onlineUsers", "userCount"].forEach((event) => socket.off(event, receiveOnline));
      ["notification", "community:notification", "newNotification"].forEach((event) => socket.off(event, receiveNotification));
      secureSocketEmit(socket, "leaveCommunity", { communityId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId]);

  const filteredPosts = useMemo(() => {
    const q = sanitizeCommunityText(search, MAX_COMMUNITY_SEARCH).toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const text = [
        p.content,
        p.title,
        p.description,
        ...(p.hashtags || []),
        p.author?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [posts, search]);

  const publishPost = async (draft) => {
    try {
      const response = await secureCommunityFetch(apiUrl("/api/community/posts"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...draft,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const created = data?.post || data?.item || data?.data;

      if (created) {
        setPosts((previous) => [normalizePost(created), ...previous]);
      }

      showToast("Publication publiée.");
      return created;
    } catch (error) {
      console.error("Community publish:", error);
      showToast(
        "Publication impossible. Vérifiez votre connexion et réessayez."
      );
      throw error;
    }
  };


  const loadComments = useCallback(async (postId) => {
    setLoadingComments((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = await fetch(
        apiUrl(`/api/community/posts/${postId}/comments`),
        { headers: { Accept: "application/json" } }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: safeArray(data?.comments || data?.items || data?.data),
      }));
    } catch (error) {
      console.error("Community comments:", error);
      showToast("Impossible de charger les commentaires.");
    } finally {
      setLoadingComments((prev) => ({ ...prev, [postId]: false }));
    }
  }, []);

  const toggleComments = async (postId) => {
    const next = !openComments[postId];
    setOpenComments((prev) => ({ ...prev, [postId]: next }));
    if (next && comments[postId] === undefined) {
      await loadComments(postId);
    }
  };

  const submitComment = async (postId) => {
    const text = sanitizeCommunityText(commentDrafts[postId], 2000);
    if (!text || !isSafeCommunityId(postId)) return;

    await addComment(postId, text);
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  const toggleLike = async (postId) => {
    if (!isSafeCommunityId(postId)) return;
    try {
      const response = await secureCommunityFetch(apiUrl(`/api/community/posts/${postId}/like`), {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const liked = Boolean(data?.liked);
      const likesCount = Number(
        data?.likesCount ?? data?.post?.likesCount ?? 0
      );

      setPosts((previous) =>
        previous.map((p) =>
          p.id === postId ? { ...p, liked, likesCount } : p
        )
      );
    } catch (error) {
      console.error("Community like:", error);
      showToast("Impossible de modifier la réaction.");
    }
  };

  const toggleSave = async (postId) => {
    if (!isSafeCommunityId(postId)) return;
    try {
      const response = await secureCommunityFetch(apiUrl(`/api/community/posts/${postId}/save`), {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setPosts((previous) =>
        previous.map((p) =>
          p.id === postId
            ? { ...p, saved: Boolean(data?.saved) }
            : p
        )
      );
      showToast(data?.saved ? "Publication enregistrée." : "Publication retirée.");
    } catch (error) {
      console.error("Community save:", error);
      showToast("Impossible de modifier l'enregistrement.");
    }
  };

  const addComment = async (postId, commentText) => {
    if (!isSafeCommunityId(postId)) return;
    try {
      const response = await fetch(
        apiUrl(`/api/community/posts/${postId}/comments`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ text: commentText }),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const created = data?.comment || data?.item || data?.data;

      if (created) {
        setComments((previous) => ({
          ...previous,
          [postId]: [...(previous[postId] || []), created],
        }));
      }

      if (data?.commentsCount != null) {
        setPosts((previous) =>
          previous.map((p) =>
            p.id === postId
              ? { ...p, commentsCount: Number(data.commentsCount) }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Community comment:", error);
      showToast("Impossible de publier le commentaire.");
    }
  };

  const sharePost = async (post) => {
    const shareData = {
      title: post.title || "Konan Community",
      text: post.content || "Découvrez cette publication sur Konan Community.",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Lien copié.");
      }

      const response = await fetch(
        apiUrl(`/api/community/posts/${post.id}/share`),
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        setPosts((previous) =>
          previous.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  sharesCount: Number(
                    data?.sharesCount ?? Number(p.sharesCount || 0) + 1
                  ),
                }
              : p
          )
        );
      }
    } catch (error) {
      // L'annulation du partage natif n'est pas une erreur utilisateur.
      if (error?.name !== "AbortError") {
        console.warn("Community share:", error);
      }
    }
  };

  const votePoll = async (postId, optionIndex) => {
    if (!isSafeCommunityId(postId) || !Number.isInteger(Number(optionIndex)) || Number(optionIndex) < 0 || Number(optionIndex) > 100) return;
    try {
      const response = await fetch(
        apiUrl(`/api/community/posts/${postId}/poll/vote`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ optionIndex }),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data?.post) {
        setPosts((previous) =>
          previous.map((p) =>
            p.id === postId ? normalizePost(data.post) : p
          )
        );
      }
      showToast("Vote enregistré.");
    } catch (error) {
      console.error("Community poll:", error);
      showToast("Impossible d'enregistrer le vote.");
    }
  };

  const sendMessage = async (conversationId, text) => {
    const cleanText = sanitizeCommunityText(text);
    if (!isSafeCommunityId(conversationId) || !cleanText) return;

    try {
      const response = await fetch(
        apiUrl(`/api/community/conversations/${conversationId}/messages`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ text: cleanText }),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const created = data?.message || data?.item || data?.data;
      const normalized = normalizeMessage(created, currentUserId);

      if (normalized) {
        setMessages((previous) => {
          const current = previous[conversationId] || [];
          if (current.some((item) => String(item.id) === String(normalized.id))) return previous;
          return {
            ...previous,
            [conversationId]: [...current, normalized],
          };
        });
      }

      setMessage("");
    } catch (error) {
      console.error("Community message:", error);
      showToast("Impossible d'envoyer le message.");
    }
  };

  const markNotificationRead = async (id) => {
    if (!isSafeCommunityId(id)) return;
    try {
      const response = await fetch(
        apiUrl(`/api/community/notifications/${id}/read`),
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setNotifications((previous) =>
        previous.map((n) =>
          n.id === id ? { ...n, unread: false } : n
        )
      );
    } catch (error) {
      console.error("Community notification:", error);
    }
  };

  const deletePost = async (post) => {
    if (!post?.id || !isSafeCommunityId(post.id)) return;
    try {
      const response = await fetch(
        apiUrl(`/api/community/posts/${post.id}`),
        {
          method: "DELETE",
          headers: { Accept: "application/json" },
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setPosts((previous) => previous.filter((p) => p.id !== post.id));
      showToast("Publication supprimée.");
    } catch (error) {
      console.error("Community delete:", error);
      showToast("Impossible de supprimer cette publication.");
    }
  };

  const openPostMenu = (post) => {
    setModal({
      type: "postMenu",
      post,
    });
  };

  const openMessage = (person) => {
    setActiveView("messages");
    if (person?.id) {
      const found = conversations.find((x) => x.user.id === person.id);
      if (found) setActiveConversation(found.id);
    }
  };

  const renderHome = () => (
    <>
      <SectionTitle
        title="Accueil"
        subtitle={
          onlineUsers > 0
            ? `${onlineUsers} membre${onlineUsers > 1 ? "s" : ""} en ligne actuellement`
            : "Les données de la communauté sont chargées depuis le serveur"
        }
      />
      <Stories
        stories={stories}
        onOpen={(story) => setModal({ type: "story", story })}
        onCreate={() => setModal({ type: "create" })}
      />
      <Composer
        user={currentUser}
        onCreate={() => setModal({ type: "create" })}
        onStory={() => setModal({ type: "storyCreate" })}
      />

      {loadingPosts ? (
        <div className="kc-card kc-loading">
          <i className={icon("spinner", "fa-spin")} /> Chargement du fil...
        </div>
      ) : null}

      {postsError ? (
        <div className="kc-error" style={{ marginBottom: 15 }}>
          <i className={icon("circle-info")} /> {postsError}
        </div>
      ) : null}

      {filteredPosts.length ? (
        filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            comments={comments[post.id] || []}
            onLike={toggleLike}
            onComment={addComment}
            onShare={sharePost}
            onSave={toggleSave}
            onVote={votePoll}
            onDelete={deletePost}
            onMenu={openPostMenu}
          />
        ))
      ) : (
        <div className="kc-card kc-loading">
          <i className={icon("magnifying-glass")} />
          <p>Aucune publication ne correspond à votre recherche.</p>
        </div>
      )}
    </>
  );

  const viewTitle = {
    home: "Accueil",
    discover: "Découvrir",
    messages: "Messages",
    notifications: "Notifications",
    groups: "Communautés",
    pages: "Pages professionnelles",
    videos: "Vidéos",
    events: "Événements",
    marketplace: "Marketplace",
    professional: "Espace professionnel",
    settings: "Paramètres",
    profile: "Profil",
  };

  const navigate = (view) => {
    setActiveView(view);
    if (view !== "profile") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nav = [
    ["house", "Accueil", "home"],
    ["compass", "Découvrir", "discover"],
    ["user-group", "Réseau", "discover"],
    ["message", "Messages", "messages", 2],
    ["bell", "Notifications", "notifications", 2],
    ["users", "Communautés", "groups"],
    ["building", "Pages professionnelles", "pages"],
  ];

  const moreNav = [
    ["play", "Vidéos", "videos"],
    ["calendar-days", "Événements", "events"],
    ["store", "Marketplace", "marketplace"],
    ["chart-line", "Espace professionnel", "professional"],
  ];

  const mobileNav = [
    ["house", "Accueil", "home"],
    ["compass", "Découvrir", "discover"],
    ["plus", "Publier", "create"],
    ["message", "Messages", "messages"],
    ["user", "Profil", "profile"],
  ];

  let content;

  switch (activeView) {
    case "discover":
      content = (
        <DiscoverView
          people={people}
          groups={groups}
          onProfile={(person) => {
            setProfileUser(person);
            setActiveView("profile");
          }}
          onGroups={() => navigate("groups")}
        />
      );
      break;
    case "messages":
      content = (
        <MessagesView
          conversations={conversations}
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
          messages={messages}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          loadingMessages={loadingMessages}
          onReloadMessages={() => loadConversationMessages(activeConversation)}
        />
      );
      break;
    case "notifications":
      content = (
        <NotificationsView
          notifications={notifications}
          onRead={markNotificationRead}
        />
      );
      break;
    case "groups":
      content = <GroupsView groups={groups} />;
      break;
    case "pages":
      content = <PagesView pages={pages} />;
      break;
    case "videos":
      content = <VideoView videos={videos} />;
      break;
    case "events":
      content = <EventsView events={events} />;
      break;
    case "marketplace":
      content = <MarketplaceView products={marketplaceProducts} />;
      break;
    case "professional":
      content = (
        <ProfessionalView
          posts={posts}
          contacts={contacts}
          videos={videos}
          events={events}
        />
      );
      break;
    case "settings":
      content = <SettingsView user={currentUser} />;
      break;
    case "profile":
      content = (
        <ProfileView
          user={profileUser || currentUser}
          onBack={() => {
            setProfileUser(null);
            navigate("home");
          }}
          onMessage={() => openMessage()}
        />
      );
      break;
    case "home":
    default:
      content = renderHome();
      break;
  }

  const unreadNotifications = notifications.filter((x) => x.unread).length;
  const unreadMessages = conversations.reduce((sum, item) => sum + Number(item.unread || 0), 0);

  return (
    <div className="kc-root">
      <style>{baseCss}</style>

      <header className="kc-topbar">
        <button
          className="kc-mobile-menu-trigger"
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={Boolean(modal?.type === "mobileMenu")}
          onClick={() => setModal({ type: "mobileMenu" })}
        >
          <i className={icon("bars")} />
        </button>

        <button
          className="kc-brand"
          style={{ border: 0, background: "transparent", padding: 0, textAlign: "left" }}
          onClick={() => navigate("home")}
        >
          <div className="kc-brand-mark">
            <i className={icon("people-group")} />
          </div>
          <div className="kc-brand-text-wrap">
            <div className="kc-brand-text">Konan Community</div>
            <span className="kc-brand-sub">LE RÉSEAU DE KONANSHOPPING</span>
          </div>
        </button>

        <div className="kc-search">
          <i className={icon("magnifying-glass")} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (activeView !== "home") setActiveView("home");
            }}
            placeholder="Rechercher personnes, publications, groupes..."
          />
        </div>

        <div className="kc-top-actions">
          <button className="kc-icon-btn optional" onClick={() => navigate("videos")} title="Vidéos">
            <i className={icon("play")} />
          </button>
          <button className="kc-icon-btn" onClick={() => navigate("messages")} title="Messages">
            <i className={icon("message")} />
            {unreadMessages ? <span className="kc-badge">{unreadMessages}</span> : null}
          </button>
          <button className="kc-icon-btn" onClick={() => navigate("notifications")} title="Notifications">
            <i className={icon("bell")} />
            {unreadNotifications ? <span className="kc-badge">{unreadNotifications}</span> : null}
          </button>
          <button
            className="kc-icon-btn"
            onClick={() => navigate("profile")}
            title="Profil"
            style={{ background: "transparent" }}
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} />
          </button>
        </div>
      </header>

      <div className="kc-layout">
        <aside className="kc-left">
          <div className="kc-nav-card">
            <button
              className="kc-profile-mini"
              onClick={() => navigate("profile")}
              style={{ width: "100%", border: 0, background: "transparent", textAlign: "left" }}
            >
              <Avatar src={currentUser.avatar} name={currentUser.name} online />
              <div>
                <strong>{currentUser.name}</strong>
                <span>{currentUser.role || "Membre"}</span>
              </div>
            </button>

            {nav.map(([ic, label, view, badge]) => (
              <NavItem
                key={label}
                iconName={ic}
                label={label}
                active={activeView === view && !(view === "discover" && label === "Réseau")}
                badge={view === "messages" ? unreadMessages : view === "notifications" ? unreadNotifications : 0}
                onClick={() => navigate(view)}
              />
            ))}

            <div className="kc-nav-section">Explorer</div>

            {moreNav.map(([ic, label, view]) => (
              <NavItem
                key={label}
                iconName={ic}
                label={label}
                active={activeView === view}
                onClick={() => navigate(view)}
              />
            ))}

            <div className="kc-nav-section">Compte</div>

            <NavItem
              iconName="gear"
              label="Paramètres"
              active={activeView === "settings"}
              onClick={() => navigate("settings")}
            />
          </div>
        </aside>

        <main className="kc-main">
          {search && activeView !== "home" ? (
            <div
              className="kc-card"
              style={{
                padding: 12,
                marginBottom: 15,
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <i className={icon("magnifying-glass")} style={{ color: COLORS.primary }} />
              <span>
                Recherche : <strong>{search}</strong>
              </span>
              <button
                className="kc-btn"
                style={{ marginLeft: "auto" }}
                onClick={() => setSearch("")}
              >
                Effacer
              </button>
            </div>
          ) : null}
          {content}
        </main>

        <RightSidebar
          contacts={contacts}
          events={events}
          trends={trends}
          onMessage={() => navigate("messages")}
          onProfile={() => navigate("discover")}
        />
      </div>


      {modal?.type === "mobileMenu" ? (
        <div
          className="kc-mobile-overlay open"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
          onTouchStart={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <aside
            className="kc-mobile-drawer"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="kc-mobile-drawer-head">
              <div className="kc-mobile-drawer-user">
                <Avatar src={currentUser.avatar} name={currentUser.name} online />
                <div>
                  <strong>{currentUser.name}</strong>
                  <span>{currentUser.role || "Membre"}</span>
                </div>
              </div>
              <button
                className="kc-mobile-drawer-close"
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setModal(null)}
              >
                <i className={icon("xmark")} />
              </button>
            </div>

            <div className="kc-mobile-drawer-body">
              <div className="kc-nav-section">Navigation</div>

              {nav.map(([ic, label, view, badge]) => (
                <NavItem
                  key={`mobile-${label}`}
                  iconName={ic}
                  label={label}
                  active={
                    activeView === view &&
                    !(view === "discover" && label === "Réseau")
                  }
                  badge={badge}
                  onClick={() => {
                    setModal(null);
                    navigate(view);
                  }}
                />
              ))}

              <div className="kc-nav-section">Explorer</div>

              {moreNav.map(([ic, label, view]) => (
                <NavItem
                  key={`mobile-more-${label}`}
                  iconName={ic}
                  label={label}
                  active={activeView === view}
                  onClick={() => {
                    setModal(null);
                    navigate(view);
                  }}
                />
              ))}

              <div className="kc-nav-section">Compte</div>

              <NavItem
                iconName="user"
                label="Mon profil"
                active={activeView === "profile"}
                onClick={() => {
                  setModal(null);
                  navigate("profile");
                }}
              />

              <NavItem
                iconName="gear"
                label="Paramètres"
                active={activeView === "settings"}
                onClick={() => {
                  setModal(null);
                  navigate("settings");
                }}
              />

              <button
                className="kc-nav-item"
                type="button"
                onClick={() => {
                  setModal({ type: "create" });
                }}
              >
                <i className={icon("plus")} />
                <span>Créer une publication</span>
              </button>
            </div>

            <div className="kc-mobile-drawer-footer">
              <button
                className="kc-nav-item"
                type="button"
                onClick={() => {
                  setModal(null);
                  navigate("home");
                }}
              >
                <i className={icon("house")} />
                <span>Retour à l'accueil</span>
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <nav className="kc-mobile-nav">
        {mobileNav.map(([ic, label, view]) => (
          <button
            key={label}
            className={activeView === view ? "active" : ""}
            onClick={() => {
              if (view === "create") setModal({ type: "create" });
              else navigate(view);
            }}
          >
            <i className={icon(ic)} />
            {label}
          </button>
        ))}
      </nav>

      {modal?.type === "create" ? (
        <CreatePostModal
          user={currentUser}
          onClose={() => setModal(null)}
          onPublish={publishPost}
        />
      ) : null}

      {modal?.type === "story" ? (
        <StoryViewer story={modal.story} onClose={() => setModal(null)} />
      ) : null}

      {modal?.type === "storyCreate" ? (
        <Modal title="Créer une story" onClose={() => setModal(null)}>
          <div className="kc-modal-body">
            <div
              style={{
                minHeight: 280,
                borderRadius: 18,
                background: "linear-gradient(135deg,#0b66ff,#6b45c8)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                textAlign: "center",
                padding: 30,
              }}
            >
              <div>
                <i className={icon("camera")} style={{ fontSize: 35 }} />
                <h3>Votre story commence ici</h3>
                <p style={{ opacity: .8 }}>
                  Photo, vidéo, texte, musique et stickers seront connectés au backend à l'étape 2.
                </p>
                <button className="kc-btn" onClick={() => setModal(null)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      {modal?.type === "postMenu" ? (
        <Modal title="Options de la publication" onClose={() => setModal(null)}>
          <div className="kc-modal-body" style={{ display: "grid", gap: 8 }}>
            <button className="kc-nav-item" onClick={() => { toggleSave(modal.post.id); setModal(null); }}>
              <i className={icon("bookmark")} /> Enregistrer la publication
            </button>
            <button className="kc-nav-item" onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast("Lien copié."); setModal(null); }}>
              <i className={icon("link")} /> Copier le lien
            </button>
            <button className="kc-nav-item" onClick={() => { showToast("Publication masquée."); setModal(null); }}>
              <i className={icon("eye-slash")} /> Masquer cette publication
            </button>
            <button
              className="kc-nav-item"
              style={{ color: COLORS.danger }}
              onClick={() => {
                const ok = window.confirm("Supprimer cette publication ?");
                if (ok) deletePost(modal.post);
                setModal(null);
              }}
            >
              <i className={icon("trash")} /> Supprimer
            </button>
            <button className="kc-nav-item" onClick={() => setModal(null)}>
              <i className={icon("xmark")} /> Annuler
            </button>
          </div>
        </Modal>
      ) : null}

      {toast ? (
        <div className="kc-toast">
          <i className={icon("circle-check")} style={{ color: "#5fe29b" }} />
          {toast}
        </div>
      ) : null}
    </div>
  );
}