// DOM elements
const passwordTableBody = document.getElementById('passwordTableBody');
const addNewBtn = document.getElementById('addNewBtn');
const passwordModal = document.getElementById('passwordModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const cancelBtn = document.getElementById('cancelBtn');
const savePasswordBtn = document.getElementById('savePasswordBtn');
const passwordForm = document.getElementById('passwordForm');
const modalTitle = document.getElementById('modalTitle');
const passwordId = document.getElementById('passwordId');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const passwordInput = document.getElementById('passwordInput');
const generateBtn = document.getElementById('generateBtn');
const generatedPassword = document.getElementById('generatedPassword');
const copyGeneratedBtn = document.getElementById('copyGeneratedBtn');
const strengthMeterBar = document.getElementById('strengthMeterBar');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const uppercaseOption = document.getElementById('uppercaseOption');
const lowercaseOption = document.getElementById('lowercaseOption');
const numbersOption = document.getElementById('numbersOption');
const symbolsOption = document.getElementById('symbolsOption');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortOption = document.getElementById('sortOption');
const logoutBtn = document.getElementById('logoutBtn');
const notificationContainer = document.getElementById('notificationContainer');
const websiteInput = document.getElementById('websiteInput');
const urlInput = document.getElementById('urlInput');
const usernameInput = document.getElementById('usernameInput');
const categoryInput = document.getElementById('categoryInput');
const notesInput = document.getElementById('notesInput');

// Sample password data (in a real app, this would be stored securely)
let passwords = [
    {
        id: 1,
        website: 'Facebook',
        url: 'https://facebook.com',
        username: 'user@example.com',
        password: 'P@ssw0rd123!',
        category: 'social',
        notes: 'Personal Facebook account',
        strength: 'strong',
        dateAdded: new Date('2023-01-15')
    },
    {
        id: 2,
        website: 'Gmail',
        url: 'https://gmail.com',
        username: 'user@gmail.com',
        password: 'Gm@il2023',
        category: 'email',
        notes: 'Work email account',
        strength: 'medium',
        dateAdded: new Date('2023-02-20')
    },
    {
        id: 3,
        website: 'Amazon',
        url: 'https://amazon.com',
        username: 'user@example.com',
        password: 'AmazonShopping!2023',
        category: 'shopping',
        notes: 'Shopping account',
        strength: 'strong',
        dateAdded: new Date('2023-03-05')
    },
    {
        id: 4,
        website: 'Bank of America',
        url: 'https://bankofamerica.com',
        username: 'username123',
        password: 'B@nkAccount!456',
        category: 'banking',
        notes: 'Personal checking account',
        strength: 'very-strong',
        dateAdded: new Date('2023-04-10')
    },
    {
        id: 5,
        website: 'LinkedIn',
        url: 'https://linkedin.com',
        username: 'user@example.com',
        password: 'LinkedIn2023',
        category: 'work',
        notes: 'Professional networking account',
        strength: 'medium',
        dateAdded: new Date('2023-05-15')
    }
];

// Initialize the app
function init() {
    // Load passwords from local storage if available
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
        passwords = JSON.parse(storedPasswords, (key, value) => {
            if (key === 'dateAdded') return new Date(value);
            return value;
        });
    }
    
    renderPasswordTable();
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Add new password button
    addNewBtn.addEventListener('click', () => {
        openPasswordModal('add');
    });

    // Modal close buttons
    modalCloseBtn.addEventListener('click', closePasswordModal);
    cancelBtn.addEventListener('click', closePasswordModal);

    // Save password button
    savePasswordBtn.addEventListener('click', savePassword);

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Generate password button
    generateBtn.addEventListener('click', generatePassword);

    // Copy generated password button
    copyGeneratedBtn.addEventListener('click', () => copyToClipboard(generatedPassword.value, 'Generated password copied to clipboard!'));

    // Password length slider
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    // Search input
    searchInput.addEventListener('input', filterPasswords);

    // Category filter
    categoryFilter.addEventListener('change', filterPasswords);

    // Sort options
    sortOption.addEventListener('change', filterPasswords);

    // Logout button
    logoutBtn.addEventListener('click', () => {
        showNotification('Logged out successfully!', 'success');
        // In a real app, this would handle session management
    });
}

// Render password table
function renderPasswordTable(passwordsToRender = passwords) {
    passwordTableBody.innerHTML = '';
    
    if (passwordsToRender.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 20px;">No passwords found. Add a new password to get started.</td>
        `;
        passwordTableBody.appendChild(emptyRow);
        return;
    }
    
    passwordsToRender.forEach(password => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${password.website}</td>
            <td>${password.username}</td>
            <td>
                <span class="password-dots">••••••••</span>
                <input type="hidden" value="${password.password}">
            </td>
            <td><span class="category-pill category-${password.category}">${password.category}</span></td>
            <td><span class="${getStrengthClass(password.strength)}">${password.strength}</span></td>
            <td class="password-actions">
                <button class="view-btn" data-id="${password.id}" title="View Password"><i class="far fa-eye"></i></button>
                <button class="copy-btn" data-id="${password.id}" title="Copy Password"><i class="far fa-copy"></i></button>
                <button class="edit-btn" data-id="${password.id}" title="Edit Password"><i class="far fa-edit"></i></button>
                <button class="delete-btn" data-id="${password.id}" title="Delete Password"><i class="far fa-trash-alt"></i></button>
            </td>
        `;
        passwordTableBody.appendChild(row);
    });

    // Add event listeners to the buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', viewPassword);
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', copyPassword);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            const passwordToEdit = passwords.find(p => p.id === id);
            if (passwordToEdit) {
                openPasswordModal('edit', passwordToEdit);
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            if (confirm('Are you sure you want to delete this password?')) {
                deletePassword(id);
            }
        });
    });
}

// Filter passwords based on search input and category filter
function filterPasswords() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const sortBy = sortOption.value;
    
    let filteredPasswords = passwords.filter(password => {
        const matchesSearch = 
            password.website.toLowerCase().includes(searchTerm) ||
            password.username.toLowerCase().includes(searchTerm) ||
            password.notes.toLowerCase().includes(searchTerm);
            
        const matchesCategory = category === 'all' || password.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort passwords
    switch (sortBy) {
        case 'nameAsc':
            filteredPasswords.sort((a, b) => a.website.localeCompare(b.website));
            break;
        case 'nameDesc':
            filteredPasswords.sort((a, b) => b.website.localeCompare(a.website));
            break;
        case 'recent':
            filteredPasswords.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'strength':
            const strengthOrder = { 'weak': 0, 'medium': 1, 'strong': 2, 'very-strong': 3 };
            filteredPasswords.sort((a, b) => strengthOrder[b.strength] - strengthOrder[a.strength]);
            break;
    }
    
    renderPasswordTable(filteredPasswords);
}

// Open password modal
function openPasswordModal(mode, password = null) {
    passwordForm.reset();
    passwordId.value = '';
    
    if (mode === 'add') {
        modalTitle.textContent = 'Add New Password';
    } else if (mode === 'edit' && password) {
        modalTitle.textContent = 'Edit Password';
        passwordId.value = password.id;
        websiteInput.value = password.website;
        urlInput.value = password.url;
        usernameInput.value = password.username;
        passwordInput.value = password.password;
        categoryInput.value = password.category;
        notesInput.value = password.notes;
    }
    
    passwordModal.classList.add('show');
}

// Close password modal
function closePasswordModal() {
    passwordModal.classList.remove('show');
}

// Save password
function savePassword() {
    // Validate form
    if (!passwordForm.checkValidity()) {
        passwordForm.reportValidity();
        return;
    }
    
    const id = passwordId.value ? parseInt(passwordId.value) : Date.now();
    const password = {
        id: id,
        website: websiteInput.value,
        url: urlInput.value,
        username: usernameInput.value,
        password: passwordInput.value,
        category: categoryInput.value,
        notes: notesInput.value,
        strength: calculatePasswordStrength(passwordInput.value),
        dateAdded: passwordId.value ? passwords.find(p => p.id === id).dateAdded : new Date()
    };
    
    if (passwordId.value) {
        // Update existing password
        const index = passwords.findIndex(p => p.id === id);
        if (index !== -1) {
            passwords[index] = password;
            showNotification('Password updated successfully!', 'success');
        }
    } else {
        // Add new password
        passwords.push(password);
        showNotification('Password added successfully!', 'success');
    }
    
    // Save to local storage
    saveToLocalStorage();
    
    // Update table
    renderPasswordTable();
    
    // Close modal
    closePasswordModal();
}

// Delete password
function deletePassword(id) {
    passwords = passwords.filter(password => password.id !== id);
    saveToLocalStorage();
    renderPasswordTable();
    showNotification('Password deleted successfully!', 'success');
}

// Toggle password visibility
function togglePasswordVisibility() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.innerHTML = '<i class="far fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        togglePasswordBtn.innerHTML = '<i class="far fa-eye"></i>';
    }
}

// View password
function viewPassword(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const row = e.currentTarget.closest('tr');
    const passwordCell = row.querySelector('td:nth-child(3)');
    const passwordDots = passwordCell.querySelector('.password-dots');
    const passwordValue = passwordCell.querySelector('input').value;
    
    if (passwordDots.textContent === '••••••••') {
        passwordDots.textContent = passwordValue;
        e.currentTarget.innerHTML = '<i class="far fa-eye-slash"></i>';
        
        // Add highlight effect
        passwordDots.classList.add('highlight');
        
        // Hide password after 5 seconds
        setTimeout(() => {
            passwordDots.textContent = '••••••••';
            e.currentTarget.innerHTML = '<i class="far fa-eye"></i>';
            passwordDots.classList.remove('highlight');
        }, 5000);
    } else {
        passwordDots.textContent = '••••••••';
        e.currentTarget.innerHTML = '<i class="far fa-eye"></i>';
        passwordDots.classList.remove('highlight');
    }
}

// Copy password
function copyPassword(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const password = passwords.find(p => p.id === id);
    
    if (password) {
        copyToClipboard(password.password, `Password for ${password.website} copied to clipboard!`);
    }
}

// Copy to clipboard
function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification(message, 'success');
        })
        .catch(err => {
            showNotification('Failed to copy text.', 'error');
        });
}

// Generate a random password
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const hasUpper = uppercaseOption.checked;
    const hasLower = lowercaseOption.checked;
    const hasNumbers = numbersOption.checked;
    const hasSymbols = symbolsOption.checked;
    
    // Ensure at least one option is selected
    if (!hasUpper && !hasLower && !hasNumbers && !hasSymbols) {
        showNotification('Please select at least one character type!', 'warning');
        return;
    }
    
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?\\';
    
    let chars = '';
    if (hasUpper) chars += uppercase;
    if (hasLower) chars += lowercase;
    if (hasNumbers) chars += numbers;
    if (hasSymbols) chars += symbols;
    
    let password = '';
    
    // Ensure at least one character from each selected type
    if (hasUpper) password += uppercase[Math.floor(Math.random() * uppercase.length)];
    if (hasLower) password += lowercase[Math.floor(Math.random() * lowercase.length)];
    if (hasNumbers) password += numbers[Math.floor(Math.random() * numbers.length)];
    if (hasSymbols) password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest of the password
    for (let i = password.length; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle the password
    password = shuffleString(password);
    
    // Display the password
    generatedPassword.value = password;
    
    // Update strength meter
    const strength = calculatePasswordStrength(password);
    updateStrengthMeter(strength);
}

// Shuffle a string
function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Calculate password strength
function calculatePasswordStrength(password) {
    if (password.length < 8) return 'weak';
    
    let score = 0;
    
    // Length
    score += password.length >= 12 ? 2 : (password.length >= 8 ? 1 : 0);
    
    // Uppercase
    if (/[A-Z]/.test(password)) score += 1;
    
    // Lowercase
    if (/[a-z]/.test(password)) score += 1;
    
    // Numbers
    if (/[0-9]/.test(password)) score += 1;
    
    // Symbols
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Variety of characters
    const uniqueChars = new Set(password).size;
    score += uniqueChars >= 8 ? 2 : (uniqueChars >= 5 ? 1 : 0);
    
    // No repeating characters
    if (!/(.)\1{2,}/.test(password)) score += 1;
    
    // Return strength based on score
    if (score >= 8) return 'very-strong';
    if (score >= 6) return 'strong';
    if (score >= 4) return 'medium';
    return 'weak';
}

// Update strength meter
function updateStrengthMeter(strength) {
    strengthMeterBar.className = 'strength-meter-bar';
    
    switch (strength) {
        case 'weak':
            strengthMeterBar.classList.add('strength-weak');
            break;
        case 'medium':
            strengthMeterBar.classList.add('strength-medium');
            break;
        case 'strong':
            strengthMeterBar.classList.add('strength-strong');
            break;
        case 'very-strong':
            strengthMeterBar.classList.add('strength-very-strong');
            break;
    }
}

// Get strength class
function getStrengthClass(strength) {
    switch (strength) {
        case 'weak':
            return 'weak-password';
        case 'medium':
            return 'medium-password';
        case 'strong':
        case 'very-strong':
            return 'strong-password';
        default:
            return '';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon;
    switch (type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'times-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        default:
            icon = 'info-circle';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Save to local storage
function saveToLocalStorage() {
    localStorage.setItem('passwords', JSON.stringify(passwords));
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);