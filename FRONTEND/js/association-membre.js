
// Récupération des boutons
const validateBtn = document.querySelector('.validate-btn');
const addBtn = document.querySelector('.add-btn');
const modifyBtn = document.querySelector('.modify-btn');
const removeBtn = document.querySelector('.remove-btn');
const homeLink = document.querySelector('.home-icon a');

// Gestion du bouton VALIDATE
validateBtn.addEventListener('click', () => {
    console.log('VALIDATE clicked');
    alert('VALIDATE button clicked - This is a standalone page');
});

// Gestion du bouton ADD
addBtn.addEventListener('click', () => {
    window.location.href = 'add.html';
});

// Gestion du bouton MODIFY
modifyBtn.addEventListener('click', () => {
     window.location.href = 'modify.html';
});

// Gestion du bouton REMOVE
removeBtn.addEventListener('click', () => {
    console.log('REMOVE clicked');
    alert('REMOVE button clicked - This is a standalone page');
});

// Gestion du lien "Home" - ne fait rien
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Home icon clicked - This is a standalone page');
});

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Association membre page loaded');
});
