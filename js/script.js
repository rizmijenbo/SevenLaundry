/* Tandai bahwa JavaScript aktif (dipakai CSS untuk animasi). Taruh paling atas. */
document.documentElement.classList.add("js");

/* ===== DATA LAYANAN (edit nama/harga di sini; tampil otomatis di semua halaman) ===== */
const layanan = [
  { id:"reguler", nama:"Cuci Reguler", ikon:"bi-calendar2-check", estimasi:"2 Hari", unit:"Kg",
    deskripsi:"Per kilonya sangat terjangkau, pekerjaan 2 hari.",
    item:[["Cuci Kering",3500],["Cuci Kering Lipat",5000],["Cuci Lipat Setrika",7000],["Setrika Saja",5000]] },
  { id:"express", nama:"Cuci Express", ikon:"bi-speedometer2", estimasi:"24 Jam", unit:"Kg",
    deskripsi:"Hanya 24 jam, cucianmu sudah jadi!",
    item:[["Cuci Kering",6000],["Cuci Kering Lipat",8000],["Cuci Lipat Setrika",10000],["Setrika Saja",8000]] },
  { id:"kilat", nama:"Cuci Kilat", ikon:"bi-lightning-charge-fill", estimasi:"6 Jam", unit:"Kg",
    deskripsi:"Hanya 6 jam, cucianmu sudah jadi!",
    item:[["Cuci Kering",10000],["Cuci Kering Lipat",12000],["Cuci Lipat Setrika",15000],["Setrika Saja",10000]] },
  { id:"satuan", nama:"Cuci Satuan", ikon:"bi-box2-heart", estimasi:"2–3 Hari", unit:"Pcs",
    deskripsi:"Pekerjaan menyeluruh dan detail dikerjakan 2–3 hari.",
    item:[["Bedcover Kecil",20000],["Bedcover Sedang",25000],["Bedcover Besar",35000],["Sprei Kecil",10000],["Sprei Besar",15000],["Selimut",15000],["Boneka Kecil",10000],["Boneka Sedang",15000],["Boneka Besar",25000],["Boneka Super Jumbo",55000],["Sepatu",25000,"Set"]] }
];

// Format angka menjadi "Rp3.500"
const rupiah = n => "Rp" + n.toLocaleString("id-ID");

// Daftar harga satu kategori (satuan bisa dikecualikan per item, mis. Sepatu = Set)
const daftarHarga = (k, pemisah) => '<ul class="price-list">' + k.item.map(i =>
  `<li><span>${i[0]}</span><b>${rupiah(i[1])}${pemisah}${i[2] || k.unit}</b></li>`).join("") + "</ul>";

// Card kategori. mode: "preview" (tanpa harga), "layanan" (deskripsi + harga), "harga" (harga + estimasi)
function buatCard(k, kolom, mode) {
  const isi = mode === "preview" ? `<p class="muted mb-0">${k.deskripsi}</p>`
    : mode === "layanan" ? `<p class="muted mb-0">${k.deskripsi}</p>${daftarHarga(k, " / ")}`
    : daftarHarga(k, "/");
  return `<div class="${kolom} service-item reveal" data-kategori="${k.id}">
    <div class="card-soft h-100">
      <div class="svc-head"><div class="svc-icon"><i class="bi ${k.ikon}"></i></div>
        <div><h4 class="mb-1">${k.nama}</h4><span class="time-badge"><i class="bi bi-clock"></i> Estimasi: ${k.estimasi}</span></div></div>
      ${isi}
    </div></div>`;
}

// Isi halaman sesuai elemen yang ada di halaman tersebut
const isiKe = (id, kolom, mode) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = layanan.map(k => buatCard(k, kolom, mode)).join("");
};
isiKe("serviceCards", "col-lg-6", "layanan");
isiKe("previewServices", "col-sm-6 col-lg-3", "preview");
isiKe("priceLists", "col-md-6", "harga");

// Filter kategori layanan
document.querySelectorAll(".btn-filter").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".btn-filter").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".service-item").forEach(card =>
    card.classList.toggle("hide", btn.dataset.filter !== "semua" && card.dataset.kategori !== btn.dataset.filter));
}));

// Navbar berubah saat scroll + tombol back-to-top
const nav = document.getElementById("mainNav"), topBtn = document.getElementById("backTop");
function saatScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 20);
  topBtn.classList.toggle("show", window.scrollY > 400);
}
window.addEventListener("scroll", saatScroll); saatScroll();
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Dark / light mode (pilihan disimpan di localStorage)
const html = document.documentElement, tombolTema = document.getElementById("themeToggle");
function setTema(t) {
  html.setAttribute("data-bs-theme", t);
  tombolTema.innerHTML = t === "dark" ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
  try { localStorage.setItem("tema", t); } catch (e) {}
}
let temaAwal = "light"; try { temaAwal = localStorage.getItem("tema") || "light"; } catch (e) {}
setTema(temaAwal);
tombolTema.addEventListener("click", () => setTema(html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark"));

// Animasi muncul saat di-scroll + animasi angka statistik
function hitung(el) {
  const target = +el.dataset.target, step = Math.max(1, Math.ceil(target / 60)); let n = 0;
  const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = n; if (n >= target) clearInterval(t); }, 25);
}
const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("visible");
  e.target.querySelectorAll(".counter").forEach(hitung);
  observer.unobserve(e.target);
}), { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Pengaman: jika ada elemen yang belum muncul setelah 2 detik, tampilkan saja
setTimeout(() => document.querySelectorAll(".reveal:not(.visible)").forEach(el => {
  if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("visible");
}), 2000);