// Éléments DOM
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const authTitle = document.querySelector('.auth-title');

// Basculer vers register
showRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    loginSection.classList.remove('active');
    registerSection.classList.add('active');
    authTitle.textContent = 'Register';
});

// Basculer vers login
showLoginBtn.addEventListener('click', e => {
    e.preventDefault();
    registerSection.classList.remove('active');
    loginSection.classList.add('active');
    authTitle.textContent = 'Login';
});

function redirectByRole(role) {
    if (role === "user") {
        window.location.href = "main.html";
    } else if (role === "project_owner") {
        window.location.href = "association-membre.html";
    } else if (role === "idea_initiator") {
        window.location.href = "add.html";
    } else {
        alert("Rôle inconnu");
    }
}

// ================== LOGIN ==================
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
    alert(`✅ Bienvenue ${data.fullName} !`);

   const userId = data.id; // ✅ Récupération de l'ID
    // Stocker cet ID pour l'utiliser plus tard (localStorage ou sessionStorage)
    localStorage.setItem('userId', userId);

    redirectByRole(data.role); 
    

} else {
            alert('❌ ' + data.error);
        }
    } catch (err) {
        console.error(err);
        alert('❌ Erreur serveur');
    }
});

// ================== REGISTER ==================
// ================== REGISTER ==================
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async e => {
    e.preventDefault();

    const fullName = document.getElementById('register-fullname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('role').value; // ✅ Sans .toLowerCase()
    const country = document.getElementById('country').value;

    if (!fullName || !email || !password || !role || !country) {
        alert('⚠️ Veuillez remplir tous les champs !');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, role, country })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`✅ Inscription réussie ! Bienvenue ${data.fullName || fullName} !`);
            redirectByRole(data.role);
        } else {
            alert('❌ ' + data.error);
        }
    } catch (err) {
        console.error(err);
        alert('❌ Erreur serveur');
    }
});
