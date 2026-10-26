document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("dashboard.html")) return;

    const user = getCurrentUser();
    setupDashboardUI(user);
    renderOrderTable();
});

function setupDashboardUI(user) {
    const roleBadge = document.getElementById("roleBadge");
    const btnNewOrder = document.getElementById("btnNewOrder");
    const designerFilterBox = document.getElementById("designerFilterBox");

    if (roleBadge) {
        roleBadge.innerText = user.role.toUpperCase();
        roleBadge.className = user.role === 'marketing' 
            ? "px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800"
            : "px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800";
    }

    // Hanya marketing yang bisa membuat order baru
    if (btnNewOrder && user.role !== 'marketing') {
        btnNewOrder.style.display = 'none';
    }

    // Filter khusus Desainer
    if (designerFilterBox && user.role === 'designer') {
        designerFilterBox.classList.remove('hidden');
    }
}

function renderOrderTable() {
    const tableBody = document.getElementById("orderTableBody");
    if (!tableBody) return;

    const user = getCurrentUser();
    let orders = getOrders();
    
    // Filter pencarian & status
    const searchVal = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const statusVal = document.getElementById("statusFilter")?.value || "ALL";
    const designerScope = document.getElementById("designerFilter")?.value || "ALL";

    orders = orders.filter(o => {
        const matchSearch = o.title.toLowerCase().includes(searchVal) || o.client.toLowerCase().includes(searchVal) || o.id.toLowerCase().includes(searchVal);
        const matchStatus = statusVal === "ALL" || o.status === statusVal;
        const matchDesigner = designerScope === "ALL" || (designerScope === "MY" && o.assignedDesigner === user.name);
        return matchSearch && matchStatus && matchDesigner;
    });

    if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">Tidak ada data project ditemukan.</td></tr>`;
        return;
    }

    tableBody.innerHTML = orders.map(o => `
        <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100 text-sm">
            <td class="py-3 px-4 font-mono font-medium text-blue-600">${o.id}</td>
            <td class="py-3 px-4">
                <div class="font-semibold text-slate-800">${o.title}</div>
                <div class="text-xs text-slate-500">Client: ${o.client} (${o.qty} pcs)</div>
            </td>
            <td class="py-3 px-4 text-xs text-slate-600">
                <div><span class="font-medium">Bahan:</span> ${o.fabricType}</div>
                <div><span class="font-medium">Kerah:</span> ${o.collarType}</div>
            </td>
            <td class="py-3 px-4 text-xs">
                <div class="font-medium text-slate-700">${o.assignedDesigner || 'Belum Ditugaskan'}</div>
                <div class="text-slate-400">by ${o.createdBy}</div>
            </td>
            <td class="py-3 px-4">${getStatusBadge(o.status)}</td>
            <td class="py-3 px-4">
                ${o.designImg ? `<img src="${o.designImg}" class="w-10 h-10 object-cover rounded-lg border shadow-sm">` : `<span class="text-xs text-slate-400 italic">Belum ada</span>`}
            </td>
            <td class="py-3 px-4 text-right">
                <div class="flex justify-end gap-2">
                    <button onclick="openDetailModal('${o.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium">Detail</button>
                    ${renderActionButtons(o, user)}
                </div>
            </td>
        </tr>
    `).join("");
}

function getStatusBadge(status) {
    const badges = {
        'New Order': 'bg-yellow-100 text-yellow-800',
        'In Design': 'bg-blue-100 text-blue-800',
        'Waiting Approval': 'bg-purple-100 text-purple-800',
        'Revision': 'bg-orange-100 text-orange-800',
        'Completed': 'bg-emerald-100 text-emerald-800'
    };
    return `<span class="px-2.5 py-1 rounded-full text-xs font-semibold ${badges[status] || 'bg-gray-100'}">${status}</span>`;
}

function renderActionButtons(order, user) {
    let btns = "";
    
    // Aksi untuk Desainer: Upload Result
    if (user.role === 'designer' && order.status !== 'Completed') {
        btns += `<button onclick="openUploadModal('${order.id}')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium">Upload Hasil</button>`;
    }

    // Aksi untuk Marketing: Revision, Approve, Delete
    if (user.role === 'marketing') {
        if (order.status === 'Waiting Approval' || order.status === 'In Design') {
            btns += `<button onclick="openRevisionModal('${order.id}')" class="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-medium">Revisi</button>`;
            btns += `<button onclick="approveOrder('${order.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium">Approve</button>`;
        }
        btns += `<button onclick="deleteOrder('${order.id}')" class="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs font-medium">Hapus</button>`;
    }

    return btns;
}

// Logika Tambah Order (Marketing)
function handleCreateOrder(event) {
    event.preventDefault();
    const user = getCurrentUser();
    const orders = getOrders();

    const newOrder = {
        id: "ORD-" + new Date().getFullYear() + "-" + String(orders.length + 1).padStart(3, '0'),
        title: document.getElementById("orderTitle").value,
        client: document.getElementById("clientName").value,
        sportType: document.getElementById("sportType").value,
        collarType: document.getElementById("collarType").value,
        fabricType: document.getElementById("fabricType").value,
        qty: parseInt(document.getElementById("orderQty").value),
        notes: document.getElementById("orderNotes").value,
        status: "In Design",
        assignedDesigner: document.getElementById("assignedDesigner").value,
        createdBy: user.name,
        createdDate: new Date().toISOString().split('T')[0],
        refImg: document.getElementById("refImgUrl").value || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
        designImg: null,
        revisions: [],
        logs: [
            { time: new Date().toLocaleString(), text: `Order dibuat oleh ${user.name}` }
        ]
    };

    orders.unshift(newOrder);
    saveOrders(orders);
    closeModal('modalNewOrder');
    renderOrderTable();
    alert("Project order berhasil dibuat!");
}

// Logika Upload Result (Desainer)
function handleUploadDesign(event) {
    event.preventDefault();
    const user = getCurrentUser();
    const orderId = document.getElementById("uploadOrderId").value;
    const imgUrl = document.getElementById("designImgUrl").value;

    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);

    if (order) {
        order.designImg = imgUrl;
        order.status = "Waiting Approval";
        order.logs.push({ time: new Date().toLocaleString(), text: `Hasil desain JPG diunggah oleh ${user.name}` });
        saveOrders(orders);
        closeModal('modalUpload');
        renderOrderTable();
        alert("Hasil desain berhasil diunggah!");
    }
}

// Logika Approve (Marketing)
function approveOrder(orderId) {
    const user = getCurrentUser();
    if (!confirm("Apakah Anda yakin ingin menyetujui (Approve) hasil desain ini?")) return;

    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);

    if (order) {
        order.status = "Completed";
        order.logs.push({ time: new Date().toLocaleString(), text: `Desain disetujui (Approved) oleh ${user.name}` });
        saveOrders(orders);
        renderOrderTable();
        alert("Project berhasil disetujui (Completed)!");
    }
}

// Logika Hapus Order
function deleteOrder(orderId) {
    if (!confirm("Apakah Anda yakin ingin menghapus project ini?")) return;
    let orders = getOrders();
    orders = orders.filter(o => o.id !== orderId);
    saveOrders(orders);
    renderOrderTable();
}

// Helper Modals
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function openUploadModal(id) {
    document.getElementById("uploadOrderId").value = id;
    openModal('modalUpload');
}