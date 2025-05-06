const encryptionKey = 'mySecretKey123'; // You can change this

const filterCategory = document.getElementById('filterCategory');
const form = document.getElementById('passwordForm');
const websiteInput = document.getElementById('website');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const credentialsList = document.getElementById('credentialsList');
const searchInput = document.getElementById('search');
const generateBtn = document.getElementById('generatePassword');
const darkToggle = document.getElementById('darkModeToggle');
const categoryInput = document.getElementById('category');

// Load previous dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkToggle.checked = true;
}

darkToggle.addEventListener('change', () => {
  if (darkToggle.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  }
});

function copyPassword(password, buttonElement) {
  navigator.clipboard.writeText(password).then(() => {
    const tooltip = document.createElement('span');
    tooltip.innerText = 'Copied!';
    tooltip.className = 'copy-tooltip';
    buttonElement.parentElement.appendChild(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 1500);
  }).catch(err => {
    console.error('Failed to copy password: ', err);
  });
}

function togglePassword(button) {
  const passwordSpan = button.previousElementSibling;
  const realPassword = passwordSpan.getAttribute('data-password');
  const isHidden = passwordSpan.innerText.includes('•');

  if (isHidden) {
    passwordSpan.innerText = realPassword;
    button.innerText = '🙈';
  } else {
    passwordSpan.innerText = '••••••••';
    button.innerText = '👁️';
  }
}

function loadCredentials() {
  credentialsList.innerHTML = "";
  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  const searchQuery = searchInput.value.toLowerCase();
  const selectedCategory = filterCategory.value;

  credentials
    .filter(entry =>
      entry.website.toLowerCase().includes(searchQuery) &&
      (selectedCategory === "" || entry.category === selectedCategory)
    )
    .forEach((entry, index) => {
      const decryptedPassword = CryptoJS.AES.decrypt(entry.password, encryptionKey).toString(CryptoJS.enc.Utf8);

      const li = document.createElement('li');
      li.innerHTML = `
        <div class="credential-view">
          <strong>${entry.website}</strong> <em>(${entry.category})</em><br />
          ${entry.username} |
          <span class="password-text" data-password="${decryptedPassword}">••••••••</span>
          <button class="toggle-password" onclick="togglePassword(this)">👁️</button>
        </div>
        <div class="actions">
          <button onclick="copyPassword('${decryptedPassword}', this)">Copy</button>
          <button onclick="editEntry(${index}, this)">Edit</button>
          <button onclick="deleteEntry(${index})">Delete</button>
        </div>
      `;
      credentialsList.appendChild(li);
    });
}

categoryInput.value = "";

function saveCredentials(e) {
  e.preventDefault();
  const encryptedPassword = CryptoJS.AES.encrypt(passwordInput.value, encryptionKey).toString();

  const newEntry = {
    website: websiteInput.value,
    username: usernameInput.value,
    password: encryptedPassword,
    category: categoryInput.value
  };

  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  credentials.push(newEntry);
  localStorage.setItem('credentials', JSON.stringify(credentials));
  form.reset();
  loadCredentials();
}

function deleteEntry(index) {
  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  credentials.splice(index, 1);
  localStorage.setItem('credentials', JSON.stringify(credentials));
  loadCredentials();
}

function editEntry(index, button) {
  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  const entry = credentials[index];

  const li = button.closest('li');
  li.innerHTML = `
    <div class="edit-form">
      <input type="text" id="edit-website-${index}" value="${entry.website}" />
      <input type="text" id="edit-username-${index}" value="${entry.username}" />
      <input type="text" id="edit-password-${index}" value="${CryptoJS.AES.decrypt(entry.password, encryptionKey).toString(CryptoJS.enc.Utf8)}" />
      <button onclick="saveEdit(${index})">Save</button>
      <button onclick="loadCredentials()">Cancel</button>
    </div>
  `;
}

function saveEdit(index) {
  const website = document.getElementById(`edit-website-${index}`).value;
  const username = document.getElementById(`edit-username-${index}`).value;
  const password = document.getElementById(`edit-password-${index}`).value;
  const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();

  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  credentials[index] = { website, username, password: encryptedPassword };

  localStorage.setItem('credentials', JSON.stringify(credentials));
  loadCredentials();
}

function generateRandomPassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

form.addEventListener('submit', saveCredentials);
searchInput.addEventListener('input', loadCredentials);
filterCategory.addEventListener('change', loadCredentials);
window.addEventListener('DOMContentLoaded', loadCredentials);
generateBtn.addEventListener('click', () => {
  const newPassword = generateRandomPassword();
  passwordInput.value = newPassword;
});
