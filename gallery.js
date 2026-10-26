document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("gallery.html")) return;

    renderGallery();
});

function renderGallery(filterCategory = 'ALL') {
    const galleryGrid = document.getElementById("galleryGrid");
    if (!galleryGrid) return;

    const orders = getOrders().filter(o => o.designImg !== null); // Tampilkan yang sudah punya desain

    const filtered = orders.filter(o => filterCategory === 'ALL' || o.sportType === filterCategory);

    if (filtered.length === 0) {
        galleryGrid.innerHTML = `
            <div class="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100">
                <p class="text-slate-400 font-medium">Belum ada karya desain dalam kategori ini.</p>
            </div>
        `;
        return;
    }

    galleryGrid.innerHTML = filtered.map(o => `
        <div onclick="openGalleryLightbox('${o.id}')" class="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
            <div class="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img src="${o.designImg}" alt="${o.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute top-3 right-3">
                    <span class="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-medium uppercase tracking-wider">${o.sportType}</span>
                </div>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">${o.title}</h3>
                    <p class="text-xs text-slate-500 mt-1">Client: ${o.client}</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>${o.fabricType}</span>
                    <span class="font-semibold text-blue-600">Lihat Detail →</span>
                </div>
            </div>
        </div>
    `).join("");
}

function filterGallery(category) {
    // Highlight Active Filter Button
    document.querySelectorAll(".gallery-filter-btn").forEach(btn => {
        btn.classList.remove("bg-blue-600", "text-white");
        btn.classList.add("bg-white", "text-slate-600");
    });
    event.target.classList.remove("bg-white", "text-slate-600");
    event.target.classList.add("bg-blue-600", "text-white");

    renderGallery(category);
}

function openGalleryLightbox(orderId) {
    const order = getOrders().find(o => o.id === orderId);
    if (!order) return;

    document.getElementById("lightboxTitle").innerText = order.title;
    document.getElementById("lightboxImg").src = order.designImg || order.refImg;
    document.getElementById("lightboxClient").innerText = order.client;
    document.getElementById("lightboxFabric").innerText = order.fabricType;
    document.getElementById("lightboxCollar").innerText = order.collarType;
    document.getElementById("lightboxDesigner").innerText = order.assignedDesigner;
    document.getElementById("lightboxNotes").innerText = order.notes;

    document.getElementById("galleryLightbox").classList.remove("hidden");
}

function closeGalleryLightbox() {
    document.getElementById("galleryLightbox").classList.add("hidden");
}