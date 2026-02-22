const $ = (id) => document.getElementById(id);

const EVENTS = [
  {
    key: "civil",
    label: "Civil",
    badge: "Evento A",
    subtitle: "20/03 · 10:45 — Registro Civil del Jagüel",
    when: "20/03/2026 · 10:45",
    where: "Registro Civil del Jagüel",
    dress: "Elegante discreto / prolijo",
    mapHtml:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.98603890186!2d-58.49098660000001!3d-34.8319529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd13ea2f09f95%3A0xb30ffcb9b90ab38a!2sRegistro%20Civil%20Jag%C3%BCel!5e1!3m2!1ses!2sar!4v1771711977148!5m2!1ses!2sar" loading="lazy" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade" title="Mapa - Registro Civil Jagüel"></iframe>',
  },
  {
    key: "discurso",
    label: "Discurso de boda",
    badge: "Evento B",
    subtitle: "20/03 · 13:00 — Barberena 435 (Salón del Reino)",
    when: "20/03/2026 · 13:00",
    where: "Barberena 435 (Salón del Reino)",
    dress: "Formal sobrio (tonos neutros)",
    mapHtml:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.867528432339!2d-58.49597792346756!3d-34.83442136972012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd1b1a7d704ad%3A0x7dd3e6210dcd7ca0!2sSal%C3%B3n%20del%20Reino%20de%20los%20testigos%20de%20Jehov%C3%A1!5e1!3m2!1ses!2sar!4v1771712020004!5m2!1ses!2sar" loading="lazy" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade" title="Mapa - Salón del Reino (Barberena 435)"></iframe>',
  },
  {
    key: "evento",
    label: "Evento de bodas",
    badge: "Evento C",
    subtitle: "21/03 · 11:00 — Pablo Groussac 40, C1804",
    when: "21/03/2026 · 11:00",
    where: "Pablo Groussac 40, C1804 (Buenos Aires, Prov. Bs. As.)",
    dress: "Elegante / fiesta (cómodo para celebrar)",
    mapHtml:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.0632543138745!2d-58.52430502346944!3d-34.78866146729031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd1bb8e955139%3A0x278ce10d7a222cce!2sParrilla%20La%20Carrocita%20Ranch!5e1!3m2!1ses!2sar!4v1771712096941!5m2!1ses!2sar" loading="lazy" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade" title="Mapa - Evento de bodas (Pablo Groussac 40)"></iframe>',
  },
];

const targetCivil = new Date("2026-03-20T10:45:00-03:00");
const pad2 = (n) => String(n).padStart(2, "0");
function tickCountdown() {
  const now = new Date();
  const diffMs = targetCivil - now;
  if (diffMs <= 0) {
    $("cdDays").textContent = "00";
    $("cdHours").textContent = "00";
    $("cdMins").textContent = "00";
    $("cdSecs").textContent = "00";
    return;
  }
  const totalSec = Math.floor(diffMs / 1000);
  $("cdDays").textContent = pad2(Math.floor(totalSec / 86400));
  $("cdHours").textContent = pad2(Math.floor((totalSec % 86400) / 3600));
  $("cdMins").textContent = pad2(Math.floor((totalSec % 3600) / 60));
  $("cdSecs").textContent = pad2(totalSec % 60);
}
setInterval(tickCountdown, 1000);
tickCountdown();

function b64decodeUrlSafe(input) {
  const s = (input || "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  return atob(s + pad);
}

function getGuestIdFromUrl() {
  const p = new URLSearchParams(location.search);
  const idb64 = p.get("id");
  if (!idb64) return null;
  try {
    const decoded = b64decodeUrlSafe(decodeURIComponent(idb64));
    const n = Number(decoded);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

const els = {
  greeting: $("greeting"),
  sectionTitle: $("sectionTitle"),
  sectionSubtitle: $("sectionSubtitle"),
  form: $("rsvpForm"),
  resetBtn: $("resetBtn"),
  summaryBox: $("summaryBox"),
  summaryIntro: $("summaryIntro"),
  summaryCards: $("summaryCards"),
  confirmedHint: $("confirmedHint"),
};

function showConfirmedSummaryMode() {
  els.form.classList.add("hidden");
  els.resetBtn.classList.add("hidden");
  els.sectionTitle.textContent = "Confirmación registrada";
  els.sectionSubtitle.textContent =
    "Si necesitás cambios, contactá a los novios.";
  els.summaryBox.classList.remove("hidden");
  els.confirmedHint.classList.remove("hidden");
}

function showNormalRsvpMode() {
  els.form.classList.remove("hidden");
  els.resetBtn.classList.remove("hidden");
  els.summaryBox.classList.add("hidden");
  els.confirmedHint.classList.add("hidden");
  els.sectionTitle.textContent = "Confirmación";
  els.sectionSubtitle.textContent = "Marcá si asistís o no a cada evento.";
}

function renderEventCards(allowed) {
  els.form.innerHTML = "";
  const tpl = $("eventCardTpl");
  const frag = document.createDocumentFragment();
  const visibleEvents = EVENTS.filter((e) => allowed[e.key]);

  for (const ev of visibleEvents) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.event = ev.key;
    node.querySelector("[data-title]").textContent = ev.label;
    node.querySelector("[data-subtitle]").textContent = ev.subtitle;
    node.querySelector("[data-badge]").textContent = ev.badge;
    node.querySelector("[data-dress]").textContent = ev.dress;

    const radios = node.querySelectorAll('input[type="radio"][data-name]');
    radios.forEach((r) => (r.name = `asiste_${ev.key}`));

    node.querySelector("[data-map]").innerHTML = ev.mapHtml;
    frag.appendChild(node);
  }

  const actions = document.createElement("section");
  actions.className =
    "lg:col-span-3 rounded-[var(--radius-card)] bg-white/70 p-5 ring-soft backdrop-blur safe-shadow";
  actions.innerHTML = `
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-2 sm:col-span-2">
              <label class="text-sm font-medium text-slate-800" for="comentarios">Comentarios (opcional)</label>
              <textarea id="comentarios" name="comentarios" rows="3" class="focus-soft w-full rounded-xl bg-white/80 px-4 py-3 text-sm ring-soft" placeholder="Ej: Voy después de las 20hs"></textarea>
            </div>
            <div class="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button id="submitBtn" type="submit" class="focus-soft rounded-xl bg-cactus-500 px-4 py-3 text-sm font-semibold text-white hover:bg-cactus-600">
                Confirmar
              </button>
            </div>
          </div>
        `;
  frag.appendChild(actions);

  els.form.appendChild(frag);
}

function renderSummary(guest, confirmed) {
  els.summaryCards.innerHTML = "";
  const tpl = $("summaryCardTpl");
  const frag = document.createDocumentFragment();

  const toBool = (v) => v === true || v === 1 || v === "1" || v === "true";

  const items = EVENTS.filter((e) => guest?.[e.key] === true).filter((e) =>
    toBool(confirmed[`asiste_${e.key}`]),
  );

  for (const ev of items) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector("[data-title]").textContent = ev.label;
    node.querySelector("[data-when]").textContent = ev.when;
    node.querySelector("[data-where]").textContent = ev.where;
    node.querySelector("[data-map]").innerHTML = ev.mapHtml;
    frag.appendChild(node);
  }

  els.summaryCards.appendChild(frag);
  els.summaryIntro.textContent = `${guest.nombre}. Esto es lo que confirmaste:`;
}

async function fetchGuest(id) {
  const res = await fetch(
    `https://kalenindumentaria.com/guest/get/index.php?id=${encodeURIComponent(id)}`,
    { method: "GET" },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function postConfirm(payload) {
  const res = await fetch(
    "https://kalenindumentaria.com/guest/confirm/index.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const text = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, text };
}

function getIntRadio(name) {
  const el = els.form.querySelector(`input[name="${name}"]:checked`);
  if (!el) return null;
  const v = Number(el.value);
  return v === 0 || v === 1 ? v : null;
}

function buildConfirmPayload(guestId, allowed) {
  const comentarios =
    (els.form.querySelector("#comentarios")?.value || "").toString().trim() ||
    null;
  const out = {
    id: guestId,
    asiste_civil: null,
    asiste_discurso: null,
    asiste_evento: null,
    comentarios,
  };

  if (allowed.civil) out.asiste_civil = getIntRadio("asiste_civil");
  if (allowed.discurso) out.asiste_discurso = getIntRadio("asiste_discurso");
  if (allowed.evento) out.asiste_evento = getIntRadio("asiste_evento");

  return out;
}

function allAnswered(payload, allowed) {
  if (allowed.civil && payload.asiste_civil == null) return false;
  if (allowed.discurso && payload.asiste_discurso == null) return false;
  if (allowed.evento && payload.asiste_evento == null) return false;
  return true;
}

function swalTheme() {
  return {
    confirmButtonText: "OK",
    confirmButtonColor: "#43a26f",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#e2e8f0",
    reverseButtons: true,
  };
}

(async () => {
  const guestId = getGuestIdFromUrl();
  if (guestId == null) {
    await Swal.fire({
      icon: "error",
      title: "Esta invitación no es válida",
      html: `
      <div class="min-h-[100vh] w-[100vw] flex flex-col items-center justify-center gap-4">
        <p class="text-slate-700">Parece que no estas invitado a esta boda.</p>
        <button id="swalReloadBtn" class="px-5 py-3 rounded-xl font-semibold text-white" style="background:#43a26f">
          Reiniciar
        </button>
      </div>
    `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      backdrop: true,
      didOpen: () => {
        const popup = Swal.getPopup();
        popup.style.width = "100vw";
        popup.style.height = "100vh";
        popup.style.margin = "0";
        popup.style.borderRadius = "0";
        popup.style.padding = "0";
        popup.style.display = "flex";
        popup.style.alignItems = "stretch";
        popup.style.justifyContent = "stretch";
        Swal.getContainer().querySelector(".swal2-container").style.padding =
          "0";
        document
          .getElementById("swalReloadBtn")
          ?.addEventListener("click", () => location.reload());
      },
    });
    return;
  }
  try {
    const json = await fetchGuest(guestId);
    if (!json?.ok || !json?.data) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo cargar",
        text: "No encontramos al invitado.",
        ...swalTheme(),
      });
      return;
    }

    const guest = json.data;
    const allowed = {
      civil: !!guest.civil,
      discurso: !!guest.discurso,
      evento: !!guest.evento,
    };
    els.greeting.innerHTML = guest.nombre
      ? `Hola ${guest.nombre} 👋, esta invitación de bodas es <b>solo para vos</b>.`
      : "Hola 👋";

    if (guest.confirmo) {
      const confirmed = {
        asiste_civil:
          guest.asiste_civil ??
          guest.civil_asiste ??
          guest.civil_confirmado ??
          null,
        asiste_discurso:
          guest.asiste_discurso ??
          guest.discurso_asiste ??
          guest.discurso_confirmado ??
          null,
        asiste_evento:
          guest.asiste_evento ??
          guest.evento_asiste ??
          guest.evento_confirmado ??
          null,
      };

      if (
        [
          confirmed.asiste_civil,
          confirmed.asiste_discurso,
          confirmed.asiste_evento,
        ].every((v) => v == null)
      ) {
        confirmed.asiste_civil = guest.civil ? 1 : 0;
        confirmed.asiste_discurso = guest.discurso ? 1 : 0;
        confirmed.asiste_evento = guest.evento ? 1 : 0;
      }

      renderSummary(guest, confirmed);
      showConfirmedSummaryMode();
      return;
    }

    showNormalRsvpMode();
    renderEventCards(allowed);

    els.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = buildConfirmPayload(guest.id, allowed);
      if (!allAnswered(payload, allowed)) {
        await Swal.fire({
          icon: "warning",
          title: "Falta completar",
          text: "Marcá tu asistencia en todos los eventos habilitados.",
          ...swalTheme(),
        });
        return;
      }

      const rows = [
        payload.asiste_civil === null
          ? ""
          : `<div><b>Civil:</b> ${payload.asiste_civil ? "Voy" : "No voy"}</div>`,
        payload.asiste_discurso === null
          ? ""
          : `<div><b>Discurso:</b> ${payload.asiste_discurso ? "Voy" : "No voy"}</div>`,
        payload.asiste_evento === null
          ? ""
          : `<div><b>Evento:</b> ${payload.asiste_evento ? "Voy" : "No voy"}</div>`,
        payload.comentarios
          ? `<div class="mt-2"><b>Comentarios:</b> ${payload.comentarios}</div>`
          : "",
      ].filter(Boolean);

      const { isConfirmed } = await Swal.fire({
        icon: "question",
        title: "¿Confirmar asistencia?",
        html: `<div class="text-left">${rows.join("")}</div>`,
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        ...swalTheme(),
      });

      if (!isConfirmed) return;

      const submitBtn = els.form.querySelector("#submitBtn");
      submitBtn.disabled = true;
      submitBtn.classList.add("opacity-70");

      Swal.fire({
        title: "Enviando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        ...swalTheme(),
      });

      try {
        const r = await postConfirm(payload);
        if (!r.ok) {
          Swal.close();
          await Swal.fire({
            icon: "error",
            title: "No se pudo confirmar",
            text: `Error HTTP ${r.status}${r.text ? ` · ${r.text}` : ""}`,
            ...swalTheme(),
          });
          return;
        }

        Swal.close();
        await Swal.fire({
          icon: "success",
          title: "Confirmación enviada",
          text: "¡Gracias! 💚",
          ...swalTheme(),
        });

        const guestForSummary = { ...guest };
        const confirmed = {
          asiste_civil: payload.asiste_civil ?? 0,
          asiste_discurso: payload.asiste_discurso ?? 0,
          asiste_evento: payload.asiste_evento ?? 0,
        };

        renderSummary(guestForSummary, confirmed);
        showConfirmedSummaryMode();
      } catch {
        Swal.close();
        await Swal.fire({
          icon: "error",
          title: "No se pudo confirmar",
          text: "Revisá tu conexión e intentá de nuevo.",
          ...swalTheme(),
        });
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-70");
      }
    });

    els.resetBtn.addEventListener("click", async () => {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "¿Reiniciar?",
        text: "Esto limpia la selección local del formulario (no borra la confirmación en el servidor).",
        showCancelButton: true,
        confirmButtonText: "Sí, reiniciar",
        ...swalTheme(),
      });
      if (!isConfirmed) return;
      els.form.reset();
    });
  } catch {
    await Swal.fire({
      icon: "error",
      title: "No se pudo cargar",
      text: "Revisá tu conexión e intentá de nuevo.",
      ...swalTheme(),
    });
  }
})();
