export type Language = 'it' | 'en' | 'es' | 'fr'

export const translations = {
  it: {
    // Common
    appName: 'Fortune Wheel',
    loading: 'Caricamento...',
    save: 'Salva',
    cancel: 'Annulla',
    confirm: 'Conferma',
    back: 'Indietro',
    submit: 'Invia',
    copy: 'Copia',
    copied: 'Copiato!',
    error: 'Errore',
    success: 'Successo',
    
    // Auth
    login: 'Accedi',
    register: 'Registrati',
    logout: 'Esci',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Conferma Password',
    phone: 'Numero di Telefono',
    displayName: 'Nome Utente',
    referralCode: 'Codice Referral',
    referralCodeRequired: 'Il codice referral è obbligatorio',
    invalidReferralCode: 'Codice referral non valido',
    selectLanguage: 'Seleziona Lingua',
    alreadyHaveAccount: 'Hai già un account?',
    dontHaveAccount: 'Non hai un account?',
    forgotPassword: 'Password dimenticata?',
    checkEmail: 'Controlla la tua email per confermare la registrazione',
    
    // Navigation
    dashboard: 'Dashboard',
    deposit: 'Deposita',
    withdraw: 'Preleva',
    wheel: 'Ruota',
    profile: 'Profilo',
    admin: 'Admin',
    
    // Dashboard
    welcome: 'Benvenuto',
    yourBalance: 'Il tuo Saldo',
    yourReferralCode: 'Il tuo Codice Referral',
    shareReferral: 'Condividi con gli amici',
    recentTransactions: 'Transazioni Recenti',
    noTransactions: 'Nessuna transazione',
    spinAvailable: 'Giro disponibile!',
    spinCooldown: 'Prossimo giro tra',
    hours: 'ore',
    minutes: 'minuti',
    
    // Deposit
    depositTitle: 'Deposita USDT',
    depositAddress: 'Indirizzo Deposito (TRC20)',
    depositInstructions: 'Invia USDT (TRC20) a questo indirizzo e inserisci l\'hash della transazione',
    transactionHash: 'Hash Transazione (TXID)',
    hashPlaceholder: 'Inserisci l\'hash della transazione',
    amount: 'Importo',
    amountPlaceholder: 'Inserisci l\'importo depositato',
    depositSubmit: 'Invia Deposito',
    depositPending: 'Il tuo deposito è in attesa di approvazione',
    hashAlreadyUsed: 'Questo hash è già stato utilizzato',
    
    // Withdraw
    withdrawTitle: 'Preleva USDT',
    withdrawAmount: 'Importo da Prelevare',
    walletAddress: 'Indirizzo Wallet (TRC20)',
    walletPlaceholder: 'Inserisci il tuo indirizzo TRC20',
    withdrawSubmit: 'Richiedi Prelievo',
    minWithdraw: 'Prelievo minimo:',
    insufficientBalance: 'Saldo insufficiente',
    withdrawPending: 'La tua richiesta è in attesa di approvazione',
    
    // Wheel
    wheelTitle: 'Ruota della Fortuna',
    spinButton: 'GIRA!',
    spinning: 'Girando...',
    tryAgainTomorrow: 'Ritenta domani',
    doubleSpinWon: 'Hai vinto un doppio giro!',
    youWon: 'Hai vinto',
    congratulations: 'Congratulazioni!',
    
    // Profile
    profileTitle: 'Il tuo Profilo',
    referralStats: 'Statistiche Referral',
    totalReferrals: 'Referral Totali',
    spinHistory: 'Storico Giri',
    transactionHistory: 'Storico Transazioni',
    
    // Transaction Status
    pending: 'In Attesa',
    approved: 'Approvato',
    rejected: 'Rifiutato',
    
    // Admin
    adminDashboard: 'Pannello Admin',
    users: 'Utenti',
    transactions: 'Transazioni',
    wheelSettings: 'Impostazioni Ruota',
    bannerSettings: 'Gestione Banner',
    approve: 'Approva',
    reject: 'Rifiuta',
    viewOnTronScan: 'Vedi su TronScan',
    editBalance: 'Modifica Saldo',
    deleteUser: 'Elimina Utente',
    probability: 'Probabilità',
    bannerTitle: 'Titolo Banner',
    bannerMessage: 'Messaggio Banner',
    bannerEnabled: 'Banner Attivo',
  },
  en: {
    // Common
    appName: 'Fortune Wheel',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    submit: 'Submit',
    copy: 'Copy',
    copied: 'Copied!',
    error: 'Error',
    success: 'Success',
    
    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phone: 'Phone Number',
    displayName: 'Display Name',
    referralCode: 'Referral Code',
    referralCodeRequired: 'Referral code is required',
    invalidReferralCode: 'Invalid referral code',
    selectLanguage: 'Select Language',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    forgotPassword: 'Forgot password?',
    checkEmail: 'Check your email to confirm registration',
    
    // Navigation
    dashboard: 'Dashboard',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    wheel: 'Wheel',
    profile: 'Profile',
    admin: 'Admin',
    
    // Dashboard
    welcome: 'Welcome',
    yourBalance: 'Your Balance',
    yourReferralCode: 'Your Referral Code',
    shareReferral: 'Share with friends',
    recentTransactions: 'Recent Transactions',
    noTransactions: 'No transactions',
    spinAvailable: 'Spin available!',
    spinCooldown: 'Next spin in',
    hours: 'hours',
    minutes: 'minutes',
    
    // Deposit
    depositTitle: 'Deposit USDT',
    depositAddress: 'Deposit Address (TRC20)',
    depositInstructions: 'Send USDT (TRC20) to this address and enter the transaction hash',
    transactionHash: 'Transaction Hash (TXID)',
    hashPlaceholder: 'Enter the transaction hash',
    amount: 'Amount',
    amountPlaceholder: 'Enter the deposited amount',
    depositSubmit: 'Submit Deposit',
    depositPending: 'Your deposit is pending approval',
    hashAlreadyUsed: 'This hash has already been used',
    
    // Withdraw
    withdrawTitle: 'Withdraw USDT',
    withdrawAmount: 'Amount to Withdraw',
    walletAddress: 'Wallet Address (TRC20)',
    walletPlaceholder: 'Enter your TRC20 address',
    withdrawSubmit: 'Request Withdrawal',
    minWithdraw: 'Minimum withdrawal:',
    insufficientBalance: 'Insufficient balance',
    withdrawPending: 'Your request is pending approval',
    
    // Wheel
    wheelTitle: 'Fortune Wheel',
    spinButton: 'SPIN!',
    spinning: 'Spinning...',
    tryAgainTomorrow: 'Try again tomorrow',
    doubleSpinWon: 'You won a double spin!',
    youWon: 'You won',
    congratulations: 'Congratulations!',
    
    // Profile
    profileTitle: 'Your Profile',
    referralStats: 'Referral Stats',
    totalReferrals: 'Total Referrals',
    spinHistory: 'Spin History',
    transactionHistory: 'Transaction History',
    
    // Transaction Status
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    
    // Admin
    adminDashboard: 'Admin Panel',
    users: 'Users',
    transactions: 'Transactions',
    wheelSettings: 'Wheel Settings',
    bannerSettings: 'Banner Management',
    approve: 'Approve',
    reject: 'Reject',
    viewOnTronScan: 'View on TronScan',
    editBalance: 'Edit Balance',
    deleteUser: 'Delete User',
    probability: 'Probability',
    bannerTitle: 'Banner Title',
    bannerMessage: 'Banner Message',
    bannerEnabled: 'Banner Enabled',
  },
  es: {
    // Common
    appName: 'Rueda de la Fortuna',
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    back: 'Atrás',
    submit: 'Enviar',
    copy: 'Copiar',
    copied: '¡Copiado!',
    error: 'Error',
    success: 'Éxito',
    
    // Auth
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    phone: 'Número de Teléfono',
    displayName: 'Nombre de Usuario',
    referralCode: 'Código de Referido',
    referralCodeRequired: 'El código de referido es obligatorio',
    invalidReferralCode: 'Código de referido inválido',
    selectLanguage: 'Seleccionar Idioma',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    forgotPassword: '¿Olvidaste tu contraseña?',
    checkEmail: 'Revisa tu correo para confirmar el registro',
    
    // Navigation
    dashboard: 'Panel',
    deposit: 'Depositar',
    withdraw: 'Retirar',
    wheel: 'Rueda',
    profile: 'Perfil',
    admin: 'Admin',
    
    // Dashboard
    welcome: 'Bienvenido',
    yourBalance: 'Tu Saldo',
    yourReferralCode: 'Tu Código de Referido',
    shareReferral: 'Comparte con amigos',
    recentTransactions: 'Transacciones Recientes',
    noTransactions: 'Sin transacciones',
    spinAvailable: '¡Giro disponible!',
    spinCooldown: 'Próximo giro en',
    hours: 'horas',
    minutes: 'minutos',
    
    // Deposit
    depositTitle: 'Depositar USDT',
    depositAddress: 'Dirección de Depósito (TRC20)',
    depositInstructions: 'Envía USDT (TRC20) a esta dirección e ingresa el hash de la transacción',
    transactionHash: 'Hash de Transacción (TXID)',
    hashPlaceholder: 'Ingresa el hash de la transacción',
    amount: 'Monto',
    amountPlaceholder: 'Ingresa el monto depositado',
    depositSubmit: 'Enviar Depósito',
    depositPending: 'Tu depósito está pendiente de aprobación',
    hashAlreadyUsed: 'Este hash ya ha sido utilizado',
    
    // Withdraw
    withdrawTitle: 'Retirar USDT',
    withdrawAmount: 'Monto a Retirar',
    walletAddress: 'Dirección de Wallet (TRC20)',
    walletPlaceholder: 'Ingresa tu dirección TRC20',
    withdrawSubmit: 'Solicitar Retiro',
    minWithdraw: 'Retiro mínimo:',
    insufficientBalance: 'Saldo insuficiente',
    withdrawPending: 'Tu solicitud está pendiente de aprobación',
    
    // Wheel
    wheelTitle: 'Rueda de la Fortuna',
    spinButton: '¡GIRAR!',
    spinning: 'Girando...',
    tryAgainTomorrow: 'Intenta mañana',
    doubleSpinWon: '¡Ganaste un giro doble!',
    youWon: 'Ganaste',
    congratulations: '¡Felicitaciones!',
    
    // Profile
    profileTitle: 'Tu Perfil',
    referralStats: 'Estadísticas de Referidos',
    totalReferrals: 'Referidos Totales',
    spinHistory: 'Historial de Giros',
    transactionHistory: 'Historial de Transacciones',
    
    // Transaction Status
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    
    // Admin
    adminDashboard: 'Panel Admin',
    users: 'Usuarios',
    transactions: 'Transacciones',
    wheelSettings: 'Configuración de Rueda',
    bannerSettings: 'Gestión de Banner',
    approve: 'Aprobar',
    reject: 'Rechazar',
    viewOnTronScan: 'Ver en TronScan',
    editBalance: 'Editar Saldo',
    deleteUser: 'Eliminar Usuario',
    probability: 'Probabilidad',
    bannerTitle: 'Título del Banner',
    bannerMessage: 'Mensaje del Banner',
    bannerEnabled: 'Banner Activo',
  },
  fr: {
    // Common
    appName: 'Roue de la Fortune',
    loading: 'Chargement...',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    back: 'Retour',
    submit: 'Soumettre',
    copy: 'Copier',
    copied: 'Copié!',
    error: 'Erreur',
    success: 'Succès',
    
    // Auth
    login: 'Connexion',
    register: "S'inscrire",
    logout: 'Déconnexion',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    phone: 'Numéro de Téléphone',
    displayName: "Nom d'utilisateur",
    referralCode: 'Code de Parrainage',
    referralCodeRequired: 'Le code de parrainage est obligatoire',
    invalidReferralCode: 'Code de parrainage invalide',
    selectLanguage: 'Sélectionner la Langue',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    dontHaveAccount: "Vous n'avez pas de compte?",
    forgotPassword: 'Mot de passe oublié?',
    checkEmail: 'Vérifiez votre email pour confirmer votre inscription',
    
    // Navigation
    dashboard: 'Tableau de Bord',
    deposit: 'Déposer',
    withdraw: 'Retirer',
    wheel: 'Roue',
    profile: 'Profil',
    admin: 'Admin',
    
    // Dashboard
    welcome: 'Bienvenue',
    yourBalance: 'Votre Solde',
    yourReferralCode: 'Votre Code de Parrainage',
    shareReferral: 'Partagez avec vos amis',
    recentTransactions: 'Transactions Récentes',
    noTransactions: 'Aucune transaction',
    spinAvailable: 'Tour disponible!',
    spinCooldown: 'Prochain tour dans',
    hours: 'heures',
    minutes: 'minutes',
    
    // Deposit
    depositTitle: 'Déposer USDT',
    depositAddress: 'Adresse de Dépôt (TRC20)',
    depositInstructions: "Envoyez USDT (TRC20) à cette adresse et entrez le hash de la transaction",
    transactionHash: 'Hash de Transaction (TXID)',
    hashPlaceholder: 'Entrez le hash de la transaction',
    amount: 'Montant',
    amountPlaceholder: 'Entrez le montant déposé',
    depositSubmit: 'Soumettre le Dépôt',
    depositPending: "Votre dépôt est en attente d'approbation",
    hashAlreadyUsed: 'Ce hash a déjà été utilisé',
    
    // Withdraw
    withdrawTitle: 'Retirer USDT',
    withdrawAmount: 'Montant à Retirer',
    walletAddress: 'Adresse du Wallet (TRC20)',
    walletPlaceholder: 'Entrez votre adresse TRC20',
    withdrawSubmit: 'Demander un Retrait',
    minWithdraw: 'Retrait minimum:',
    insufficientBalance: 'Solde insuffisant',
    withdrawPending: "Votre demande est en attente d'approbation",
    
    // Wheel
    wheelTitle: 'Roue de la Fortune',
    spinButton: 'TOURNER!',
    spinning: 'En rotation...',
    tryAgainTomorrow: 'Réessayez demain',
    doubleSpinWon: 'Vous avez gagné un double tour!',
    youWon: 'Vous avez gagné',
    congratulations: 'Félicitations!',
    
    // Profile
    profileTitle: 'Votre Profil',
    referralStats: 'Statistiques de Parrainage',
    totalReferrals: 'Parrainages Totaux',
    spinHistory: 'Historique des Tours',
    transactionHistory: 'Historique des Transactions',
    
    // Transaction Status
    pending: 'En Attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    
    // Admin
    adminDashboard: 'Panneau Admin',
    users: 'Utilisateurs',
    transactions: 'Transactions',
    wheelSettings: 'Paramètres de la Roue',
    bannerSettings: 'Gestion du Bannière',
    approve: 'Approuver',
    reject: 'Rejeter',
    viewOnTronScan: 'Voir sur TronScan',
    editBalance: 'Modifier le Solde',
    deleteUser: 'Supprimer Utilisateur',
    probability: 'Probabilité',
    bannerTitle: 'Titre du Bannière',
    bannerMessage: 'Message du Bannière',
    bannerEnabled: 'Bannière Active',
  },
} as const

export type TranslationKey = keyof typeof translations.it

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.it[key] || key
}

export const languageNames: Record<Language, string> = {
  it: 'Italiano',
  en: 'English',
  es: 'Español',
  fr: 'Français',
}

export const languageFlags: Record<Language, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
}
