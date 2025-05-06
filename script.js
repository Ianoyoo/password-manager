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
     copyGeneratedBtn.addEventListener('click', generateCopy);