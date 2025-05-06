// DOM Elements
const form = document.getElementById('passwordForm');
const websiteInput = document.getElementById('website');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const notesInput = document.getElementById('notes');
const expiryDateInput = document.getElementById('expiryDate');
const credentialsList = document.getElementById('credentialsList');
const searchInput = document.getElementById('search');
const generateBtn = document.getElementById('generatePassword');
const darkToggle = document.getElementById('darkModeToggle');
const categoryInput = document.getElementById('category');
const filterCategory = document.getElementById('filterCategory');
const passwordLengthInput = document.getElementById('passwordLength');
const lengthValueSpan = document.getElementById('lengthValue');
const includeLowercaseCheckbox = document.getElementById('includeLowercase');
const includeUppercaseCheckbox = document.getElementById('includeUppercase');
const includeNumbersCheckbox = document.getElementById('includeNumbers');
const includeSymbolsCheckbox = document.getElementById('includeSymbols');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const passwordStrengthBar = document.querySelector('.strength-bar');
const passwordStrengthText = document.querySelector('.strength-text');
const toggleCardViewBtn = document.getElementById('toggleCardView');
const sortButtons = document.querySelectorAll('.sort-btn');
const themeSelector = document.getElementById('themeSelector');
const exportDataBtn = document.getElementById('exportData');
const importDataBtn = document.getElementById('importData');
const importFileInput = document.getElementById('importFile');
const clearDataBtn = document.getElementById('clearData');
const updateMasterKeyBtn = document.getElementById('updateMasterKey');
const masterPasswordInput = document.getElementById('masterPassword');
const autoLogoutTimeSelect = document.getElementById('autoLogoutTime');
const togglePasswordInputBtn = document.querySelector('.toggle-password-input');

// Constants
const DEFAULT_MASTER_KEY = 'myDefaultMasterKey123';
let encryptionKey = localStorage.getItem('masterKey') || DEFAULT_MASTER_KEY;
let inactivityTimer;
let lastActivity = Date.now();
let sortConfig = { field: 'date', direction: 'desc' };
let isCardView = false;

// Initialize the application
function init() {
  loadCredentials();
  setupEventListeners();
  initializeTheme();
  setupAutoLogout();
  updatePasswordLength();
  checkForExpiredPasswords();
}

// Set up event listeners
function setupEventListeners() {
  // Form submission
  form.addEventListener('submit', saveCredentials);
  
  // Search and filter
  searchInput.addEventListener('input', loadCredentials);
  filterCategory.addEventListener('change', loadCredentials);
  
  // Password generation
  generateBtn.addEventListener('click', generatePassword);
  passwordLengthInput.addEventListener('input', updatePasswordLength);
  
  // Password strength meter
  passwordInput.addEventListener('input', checkPasswordStrength);
  
  // Dark mode toggle
  darkToggle.addEventListener('change', toggleDarkMode);
  
  // Tab navigation
  tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  
  // Toggle password visibility
  togglePasswordInputBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordInputBtn.innerHTML = type === 'password' ? 
      '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
  });
  
  // View toggle
  toggleCardViewBtn.addEventListener('click', toggleCardView);
  
  // Sort buttons
  sortButtons.forEach(button => {
    button.addEventListener('click', () => {
      const field = button.dataset.sort;
      if (sortConfig.field === field) {
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
      } else {
        sortConfig.field = field;
        sortConfig.direction = 'asc';
      }
      loadCredentials();
    });
  });
  
  // Theme selector
  themeSelector.addEventListener('change', changeTheme);
  
  // Data management
  exportDataBtn.addEventListener('click', exportData);
  importDataBtn.addEventListener('click', () => importFileInput.click());
  importFileInput.addEventListener('change', importData);
  clearDataBtn.addEventListener('click', confirmClearData);
  
  // Security
  updateMasterKeyBtn.addEventListener('click', updateMasterKey);
  autoLogoutTimeSelect.addEventListener('change', updateAutoLogoutTime);
  
  // Track user activity for auto-logout
  ['click', 'keypress', 'mousemove', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
  });
}

// Toggle between card and list view
function toggleCardView() {
  isCardView = !isCardView;
  const iconClass = isCardView ? 'fa-list' : 'fa-th';
  toggleCardViewBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
  
  if (isCardView) {
    credentialsList.classList.remove('list-view');
    credentialsList.classList.add('card-view');
  } else {
    credentialsList.classList.remove('card-view');
    credentialsList.classList.add('list-view');
  }
  
  loadCredentials();
}

// Switch between tabs
function switchTab(tabId) {
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  
  tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });
}

// Update the password length display
function updatePasswordLength() {
  lengthValueSpan.textContent = passwordLengthInput.value;
}

// Generate a secure password based on user preferences
function generatePassword() {
  const length = parseInt(passwordLengthInput.value);
  const useLower = includeLowercaseCheckbox.checked;
  const useUpper = includeUppercaseCheckbox.checked;
  const useNumbers = includeNumbersCheckbox.checked;
  const useSymbols = includeSymbolsCheckbox.checked;
  
  // Ensure at least one character type is selected
  if (!useLower && !useUpper && !useNumbers && !useSymbols) {
    alert('Please select at least one character type');
    return;
  }
  
  let chars = '';
  if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumbers) chars += '0123456789';
  if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let password = '';
  // Ensure password contains at least one of each selected character type
  if (useLower) password += getRandomChar('abcdefghijklmnopqrstuvwxyz');
  if (useUpper) password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (useNumbers) password += getRandomChar('0123456789');
  if (useSymbols) password += getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?');
  
  // Fill the rest of the password
  for (let i = password.length; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Shuffle the password to avoid predictable pattern
  password = shuffle(password);
  
  passwordInput.value = password;
  checkPasswordStrength();
  
  // Animate the password input
  passwordInput.classList.add('highlight');
  setTimeout(() => passwordInput.classList.remove('highlight'), 300);
}

// Get a random character from the given string
function getRandomChar(characters) {
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

// Shuffle a string
function shuffle(str) {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// Check password strength
function checkPasswordStrength() {
  const password = passwordInput.value;
  let strength = 0;
  
  // Give points for password length
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (password.length >= 16) strength += 1;
  
  // Give points for character types
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  
  // Check for common patterns
  if (password.toLowerCase().includes('password')) strength -= 1;
  if (/^[0-9]+$/.test(password)) strength -= 1;
  if (/^[a-zA-Z]+$/.test(password)) strength -= 1;
  
  // Normalize strength between 0 and 100%
  let strengthPercent = Math.max(0, Math.min(100, (strength / 7) * 100));
  
  // Update visual indicator
  passwordStrengthBar.style.width = `${strengthPercent}%`;
  
  // Set color based on strength
  let color, text;
  if (strengthPercent < 25) {
    color = '#e74c3c';
    text = 'Very Weak';
  } else if (strengthPercent < 50) {
    color = '#f39c12';
    text = 'Weak';
  } else if (strengthPercent < 75) {
    color = '#3498db';
    text = 'Good';
  } else {
    color = '#2ecc71';
    text = 'Strong';
  }
  
  passwordStrengthBar.style.backgroundColor = color;
  passwordStrengthText.textContent = `Password strength: ${text}`;
}

// Save credentials to local storage
function saveCredentials(e) {
  e.preventDefault();
  
  const encryptedPassword = CryptoJS.AES.encrypt(passwordInput.value, encryptionKey).toString();
  
  const newEntry = {
    website: websiteInput.value,
    username: usernameInput.value,
    password: encryptedPassword,
    category: categoryInput.value,
    notes: notesInput.value || '',
    expiryDate: expiryDateInput.value || '',
    dateAdded: Date.now()
  };
  
  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  credentials.push(newEntry);
  localStorage.setItem('credentials', JSON.stringify(credentials));
  
  // Show success message
  showNotification('Password saved successfully!', 'success');
  
  form.reset();
  loadCredentials();
}

// Load and display credentials
function loadCredentials() {
  credentialsList.innerHTML = "";
  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  const searchQuery = searchInput.value.toLowerCase();
  const selectedCategory = filterCategory.value;
  
  // Filter credentials
  let filteredCredentials = credentials.filter(entry =>
    (entry.website.toLowerCase().includes(searchQuery) || 
     entry.username.toLowerCase().includes(searchQuery)) &&
    (selectedCategory === "" || entry.category === selectedCategory)
  );
  
  // Sort credentials
  filteredCredentials.sort((a, b) => {
    const aValue = sortConfig.field === 'date' ? a.dateAdded : a[sortConfig.field].toLowerCase();
    const bValue = sortConfig.field === 'date' ? b.dateAdded : b[sortConfig.field].toLowerCase();
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Update sort button icons
  sortButtons.forEach(button => {
    const icon = button.querySelector('i');
    if (button.dataset.sort === sortConfig.field) {
      icon.className = `fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`;
    } else {
      icon.className = 'fas fa-sort';
    }
  });
  
  // Render credentials
  if (isCardView) {
    renderCardView(filteredCredentials);
  } else {
    renderListView(filteredCredentials);
  }
  
  // Show empty state message if no credentials
  if (filteredCredentials.length === 0) {
    credentialsList.innerHTML = `<div class="empty-state">
      <i class="fas fa-lock fa-3x"></i>
      <p>No passwords found. Add your first password to get started!</p>
    </div>`;
  }
}

// Render credentials in list view
function renderListView(credentials) {
  credentials.forEach((entry, index) => {
    const decryptedPassword = CryptoJS.AES.decrypt(entry.password, encryptionKey).toString(CryptoJS.enc.Utf8);
    
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="credential-view">
        <div class="credential-header">
          <strong>${entry.website}</strong> 
          <span class="category-badge">${entry.category}</span>
        </div>
        <div class="credential-body">
          <div>Username: ${entry.username}</div>
          <div>
            Password: 
            <span class="password-text" data-password="${decryptedPassword}">••••••••</span>
            <button class="toggle-password" onclick="togglePassword(this)">
              <i class="fas fa-eye"></i>
            </button>
            <button class="copy-btn" onclick="copyToClipboard('${decryptedPassword}', this)">
              <i class="fas fa-copy"></i>
            </button>
          </div>
          ${entry.notes ? `<div class="notes">${entry.notes}</div>` : ''}
          ${getExpiryHTML(entry.expiryDate)}
        </div>
      </div>
      <div class="actions">
        <button onclick="editEntry(${index})" class="edit-btn">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button onclick="deleteEntry(${index})" class="delete-btn">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;
    credentialsList.appendChild(li);
  });
}

// Render credentials in card view
function renderCardView(credentials) {
  credentialsList.innerHTML = '';
  
  credentials.forEach((entry, index) => {
    const decryptedPassword = CryptoJS.AES.decrypt(entry.password, encryptionKey).toString(CryptoJS.enc.Utf8);
    const template = document.getElementById('password-card-template');
    const card = document.importNode(template.content, true);
    
    // Fill in card content
    card.querySelector('.website-name').textContent = entry.website;
    card.querySelector('.category-badge').textContent = entry.category;
    card.querySelector('.username-value').textContent = entry.username;
    card.querySelector('.password-text').setAttribute('data-password', decryptedPassword);
    
    // Add notes if present
    if (entry.notes) {
      card.querySelector('.notes-section').innerHTML = `<div class="notes-label">Notes:</div>
        <div class="notes-content">${entry.notes}</div>`;
    }
    
    // Add expiry date if present
    if (entry.expiryDate) {
      card.querySelector('.expiry-section').innerHTML = getExpiryHTML(entry.expiryDate);
    }
    
    // Add timestamp
    const date = new Date(entry.dateAdded || Date.now());
    card.querySelector('.timestamp').textContent = date.toLocaleDateString();
    
    // Set up event listeners
    card.querySelector('.toggle-password').addEventListener('click', function() {
      togglePassword(this);
    });
    
    card.querySelector('.copy-btn[data-type="password"]').addEventListener('click', function() {
      copyToClipboard(decryptedPassword, this);
    });
    
    card.querySelector('.copy-btn[data-type="username"]').addEventListener('click', function() {
      copyToClipboard(entry.username, this);
    });
    
    card.querySelector('.edit-btn').addEventListener('click', function() {
      editEntry(index);
    });
    
    card.querySelector('.delete-btn').addEventListener('click', function() {
      deleteEntry(index);
    });
    
    credentialsList.appendChild(card);
  });
}

// Generate HTML for expiry date
function getExpiryHTML(expiryDate) {
  if (!expiryDate) return '';
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
  
  let expiryClass = '';
  let expiryMessage = '';
  
  if (daysLeft < 0) {
    expiryClass = 'expiry-warning';
    expiryMessage = 'Password expired!';
  } else if (daysLeft < 14) {
    expiryClass = 'expiry-warning';
    expiryMessage = `Expires in ${daysLeft} days`;
  } else {
    expiryClass = 'expiry-ok';
    expiryMessage = `Expires: ${expiry.toLocaleDateString()}`;
  }
  
  return `<div class="expiry ${expiryClass}">${expiryMessage}</div>`;
}

// Toggle password visibility
function togglePassword(button) {
  const passwordSpan = button.closest('div').querySelector('.password-text');
  const realPassword = passwordSpan.getAttribute('data-password');
  const isHidden = passwordSpan.textContent.includes('•');
  
  if (isHidden) {
    passwordSpan.textContent = realPassword;
    button.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    passwordSpan.textContent = '••••••••';
    button.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

// Copy text to clipboard
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    // Create tooltip element
    const tooltip = document.createElement('span');
    tooltip.innerText = 'Copied!';
    tooltip.className = 'copy-tooltip';
    
    // Position relative to button
    const rect = button.getBoundingClientRect();
    const parentRect = button.offsetParent.getBoundingClientRect();
    tooltip.style.left = `${rect.left - parentRect.left}px`;
    tooltip.style.top = `${rect.top - parentRect.top - 30}px`;
    
    // Append tooltip to parent
    button.parentElement.style.position = 'relative';
    button.parentElement.appendChild(tooltip);
    
    // Remove tooltip after animation
    setTimeout(() => {
      tooltip.remove();
    }, 1800);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    showNotification('Failed to copy text', 'error');
  });
}

// Delete an entry
function deleteEntry(index) {
  if (confirm('Are you sure you want to delete this password?')) {
    const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
    credentials.splice(index, 1);
    localStorage.setItem('credentials', JSON.stringify(credentials));
    loadCredentials();
    showNotification('Password deleted', 'info');
  }
}

// Edit an entry
function editEntry(index) {
  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  const entry = credentials[index];
  const decryptedPassword = CryptoJS.AES.decrypt(entry.password, encryptionKey).toString(CryptoJS.enc.Utf8);
  
  // Switch to add tab
  switchTab('add');
  
  // Fill form with entry data
  websiteInput.value = entry.website;
  usernameInput.value = entry.username;
  passwordInput.value = decryptedPassword;
  categoryInput.value = entry.category;
  notesInput.value = entry.notes || '';
  expiryDateInput.value = entry.expiryDate || '';
  
  // Remove the entry
  credentials.splice(index, 1);
  localStorage.setItem('credentials', JSON.stringify(credentials));
  
  checkPasswordStrength();
  showNotification('Editing password...', 'info');
}

// Toggle dark mode
function toggleDarkMode() {
  if (darkToggle.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Initialize theme from local storage
function initializeTheme() {
  // Dark mode
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkToggle.checked = true;
  }
  
  // Color theme
  const savedTheme = localStorage.getItem('theme') || 'default';
  themeSelector.value = savedTheme;
  changeTheme();
}

// Change color theme
function changeTheme() {
  const theme = themeSelector.value;
  document.body.className = document.body.className.replace(/theme-\w+/g, '');
  
  if (theme !== 'default') {
    document.body.classList.add(`theme-${theme}`);
  }
  
  localStorage.setItem('theme', theme);
}

// Export data as JSON file
function exportData() {
  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  
  if (credentials.length === 0) {
    showNotification('No passwords to export', 'warning');
    return;
  }
  
  const dataStr = JSON.stringify({ credentials, timestamp: Date.now() });
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileName = `password_manager_backup_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileName);
  linkElement.click();
  
  showNotification('Data exported successfully', 'success');
}

// Import data from JSON file
function importData() {
  const file = importFileInput.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      
      if (!importedData.credentials || !Array.isArray(importedData.credentials)) {
        throw new Error('Invalid data format');
      }
      
      if (confirm(`Import ${importedData.credentials.length} passwords? This will merge with your existing passwords.`)) {
        const currentCredentials = JSON.parse(localStorage.getItem('credentials')) || [];
        const newCredentials = [...currentCredentials, ...importedData.credentials];
        
        localStorage.setItem('credentials', JSON.stringify(newCredentials));
        loadCredentials();
        showNotification('Passwords imported successfully', 'success');
      }
    } catch (error) {
      console.error('Import error:', error);
      showNotification('Failed to import data: Invalid file format', 'error');
    }
    
    // Reset file input
    importFileInput.value = '';
  };
  
  reader.readAsText(file);
}

// Clear all data with confirmation
function confirmClearData() {
  if (confirm('WARNING: This will delete all your saved passwords. This action cannot be undone. Continue?')) {
    if (confirm('Are you absolutely sure? All your password data will be lost!')) {
      localStorage.removeItem('credentials');
      loadCredentials();
      showNotification('All passwords have been deleted', 'warning');
    }
  }
}

// Update master encryption key
function updateMasterKey() {
  const newMasterPassword = masterPasswordInput.value.trim();
  
  if (newMasterPassword.length < 8) {
    showNotification('Master password must be at least 8 characters', 'error');
    return;
  }
  
  try {
    // Re-encrypt all passwords with new key
    const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
    
    credentials.forEach(entry => {
      const decryptedPassword = CryptoJS.AES.decrypt(entry.password, encryptionKey).toString(CryptoJS.enc.Utf8);
      entry.password = CryptoJS.AES.encrypt(decryptedPassword, newMasterPassword).toString();
    });
    
    localStorage.setItem('credentials', JSON.stringify(credentials));
    localStorage.setItem('masterKey', newMasterPassword);
    encryptionKey = newMasterPassword;
    
    masterPasswordInput.value = '';
    showNotification('Master password updated successfully', 'success');
  } catch (error) {
    console.error('Error updating master key:', error);
    showNotification('Failed to update master password', 'error');
  }
}

// Set up auto logout timer
function setupAutoLogout() {
  const logoutTime = localStorage.getItem('autoLogoutTime') || '5';
  autoLogoutTimeSelect.value = logoutTime;
  
  resetInactivityTimer();
}

// Reset inactivity timer
function resetInactivityTimer() {
  lastActivity = Date.now();
  clearTimeout(inactivityTimer);
  
  const logoutTime = autoLogoutTimeSelect.value;
  if (logoutTime === 'never') return;
  
  const timeout = parseInt(logoutTime) * 60 * 1000;
  inactivityTimer = setTimeout(autoLogout, timeout);
}

// Update auto logout time
function updateAutoLogoutTime() {
  const logoutTime = autoLogoutTimeSelect.value;
  localStorage.setItem('autoLogoutTime', logoutTime);
  resetInactivityTimer();
}

// Auto logout function
function autoLogout() {
  // In a real app, this would lock the UI and require password re-entry
  // For this demo we'll just show a notification
  showNotification('Session timed out due to inactivity', 'warning');
}

// Check for expired passwords and show notification
function checkForExpiredPasswords() {
  const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
  const today = new Date();
  
  const expiredPasswords = credentials.filter(entry => {
    if (!entry.expiryDate) return false;
    const expiry = new Date(entry.expiryDate);
    return expiry <= today;
  });
  
  const soonToExpire = credentials.filter(entry => {
    if (!entry.expiryDate) return false;
    const expiry = new Date(entry.expiryDate);
    const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 && daysLeft <= 14;
  });
  
  if (expiredPasswords.length > 0) {
    showNotification(`You have ${expiredPasswords.length} expired password(s)`, 'warning');
  }
  
  if (soonToExpire.length > 0) {
    showNotification(`You have ${soonToExpire.length} password(s) expiring soon`, 'info');
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Check if notification container exists
  let notificationContainer = document.querySelector('.notification-container');
  
  // Create container if it doesn't exist
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Add icon based on type
  let icon;
  switch (type) {
    case 'success': icon = 'check-circle'; break;
    case 'error': icon = 'times-circle'; break;
    case 'warning': icon = 'exclamation-triangle'; break;
    default: icon = 'info-circle';
  }
  
  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;
  
  // Add notification to container
  notificationContainer.appendChild(notification);
  
  // Remove notification after timeout
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
      
      // Remove container if empty
      if (notificationContainer.children.length === 0) {
        notificationContainer.remove();
      }
    }, 300);
  }, 3000);
}

// Initialize the application when DOM is loaded
window.addEventListener('DOMContentLoaded', init);