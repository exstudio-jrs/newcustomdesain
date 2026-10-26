// Jalankan pengecekan auth saat DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const currentUser = getCurrentUser();

    // Proteksi halaman dashboard
    if (path.includes("dashboard.html") && !currentUser) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "index.html";
        return;
    }

    // Jika sudah login dan buka index.html, lempar ke dashboard
    if (path.includes("index.html") && currentUser) {
        window.location.href = "dashboard.html";
        return;
    }

    // Render User Info & Logout listener
    renderHeaderUserInfo();
});

// Handling Form Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const uname = document.getElementById("usernameInput").value.trim();
        const pass = document.getElementById("passwordInput").value.trim();

        const userFound = USERS_DB.find(u => u.username === uname && u.password === pass);

        if (userFound) {
            localStorage.setItem("logged_in_user", JSON.stringify(userFound));
            window.location.href = "dashboard.html";
        } else {
            alert("Username atau Password salah! Periksa kembali data login Anda.");
        }
    });
}

// Quick Login Function for Demo
function quickLogin(username, password) {
    document.getElementById("usernameInput").value = username;
    document.getElementById("passwordInput").value = password;
    loginForm.dispatchEvent(new Event('submit'));
}

// Render Header Info & Handler Logout
function renderHeaderUserInfo() {
    const user = getCurrentUser();
    const userInfoContainer = document.getElementById("headerUserInfo");
    
    if (userInfoContainer && user) {
        userInfoContainer.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <p class="text-sm font-semibold text-slate-800">${user.name}</p>
                    <p class="text-xs text-slate-500 capitalize">Role: <span class="font-medium text-blue-600">${user.role}</span></p>
                </div>
                <button onclick="logout()" class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors">
                    Logout
                </button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem("logged_in_user");
    window.location.href = "index.html";
}