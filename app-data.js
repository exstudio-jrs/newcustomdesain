// Database User (2 Marketing, 2 Desainer)
const USERS_DB = [
    { username: 'marketing1', password: 'passmarketing1', name: 'Budi (Marketing 1)', role: 'marketing' },
    { username: 'marketing2', password: 'passmarketing2', name: 'Siti (Marketing 2)', role: 'marketing' },
    { username: 'designer1',  password: 'passdesigner1',  name: 'Rian (Desainer 1)',  role: 'designer' },
    { username: 'designer2',  password: 'passdesigner2',  name: 'Dewi (Desainer 2)',  role: 'designer' }
];

// Data Awal / Seed Orders
const INITIAL_ORDERS = [
    {
        id: "ORD-2026-001",
        title: "FC Garudaku Home Jersey 2026",
        client: "Bintang Pratama",
        sportType: "football",
        collarType: "vneck",
        fabricType: "dryfit-milano",
        qty: 24,
        notes: "Warna dominan merah menyala dengan aksen emas di bahu. Logo sablon 3D.",
        status: "Completed",
        assignedDesigner: "Rian (Desainer 1)",
        createdBy: "Budi (Marketing 1)",
        createdDate: "2026-03-10",
        refImg: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
        designImg: "https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=800&q=80",
        revisions: [],
        logs: [
            { time: "2026-03-10 09:00", text: "Order dibuat oleh Budi (Marketing 1)" },
            { time: "2026-03-10 10:15", text: "Ditugaskan ke Rian (Desainer 1)" },
            { time: "2026-03-11 14:30", text: "Hasil render diunggah oleh Rian (Desainer 1)" },
            { time: "2026-03-12 11:00", text: "Disetujui (Approved) oleh Budi (Marketing 1)" }
        ]
    },
    {
        id: "ORD-2026-002",
        title: "Thunder Basketball League Kit",
        client: "Komunitas Hoops BDG",
        sportType: "basketball",
        collarType: "round",
        fabricType: "dryfit-zara",
        qty: 12,
        notes: "Sleeveless singlet dengan nomor dada besar font modern.",
        status: "Waiting Approval",
        assignedDesigner: "Dewi (Desainer 2)",
        createdBy: "Siti (Marketing 2)",
        createdDate: "2026-03-12",
        refImg: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=600&q=80",
        designImg: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
        revisions: [],
        logs: [
            { time: "2026-03-12 13:00", text: "Order dibuat oleh Siti (Marketing 2)" },
            { time: "2026-03-12 13:30", text: "Ditugaskan ke Dewi (Desainer 2)" },
            { time: "2026-03-13 16:00", text: "Hasil render JPG diunggah oleh Dewi (Desainer 2)" }
        ]
    }
];

// Helper Storage
function getOrders() {
    const data = localStorage.getItem("jersey_orders_db");
    if (!data) {
        localStorage.setItem("jersey_orders_db", JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
    }
    return JSON.parse(data);
}

function saveOrders(orders) {
    localStorage.setItem("jersey_orders_db", JSON.stringify(orders));
}

function getCurrentUser() {
    const user = localStorage.getItem("logged_in_user");
    return user ? JSON.parse(user) : null;
}