/**
 * Centralized Error Messages
 * Untuk consistency dan easy maintenance
 */

const ERROR_MESSAGES = {
  // Authentication & Authorization Errors
  AUTH: {
    INVALID_CREDENTIALS: "Email atau password salah",
    ACCOUNT_NOT_FOUND: "Akun tidak ditemukan",
    ACCOUNT_INACTIVE: "Akun Anda telah dinonaktifkan",
    ACCOUNT_LOCKED: "Akun Anda terkunci. Silakan hubungi administrator",
    EMAIL_ALREADY_EXISTS: "Email sudah terdaftar",
    EMAIL_NOT_VERIFIED: "Email belum diverifikasi",
    TOKEN_INVALID: "Token tidak valid",
    TOKEN_EXPIRED: "Token sudah kadaluarsa",
    SESSION_EXPIRED: "Sesi Anda telah berakhir. Silakan login kembali",
    SESSION_INVALID: "Sesi tidak valid",
    NO_TOKEN_PROVIDED: "Token tidak ditemukan",
    UNAUTHORIZED: "Anda tidak memiliki akses",
    FORBIDDEN: "Akses ditolak",
    LOGIN_REQUIRED: "Silakan login terlebih dahulu",
    LOGOUT_FAILED: "Gagal logout",
    PASSWORD_INCORRECT: "Password saat ini salah",
    PASSWORD_TOO_WEAK: "Password terlalu lemah",
    PASSWORD_SAME_AS_OLD: "Password baru tidak boleh sama dengan password lama",
    TWO_FACTOR_REQUIRED: "Kode autentikasi dua faktor diperlukan",
    TWO_FACTOR_INVALID: "Kode autentikasi dua faktor tidak valid",
    CSRF_TOKEN_INVALID: "Token CSRF tidak valid",
    CSRF_TOKEN_MISSING: "Token CSRF tidak ditemukan",
  },

  // User Management Errors
  USER: {
    NOT_FOUND: "User tidak ditemukan",
    CREATE_FAILED: "Gagal membuat user",
    UPDATE_FAILED: "Gagal memperbarui user",
    DELETE_FAILED: "Gagal menghapus user",
    CANNOT_DELETE_SELF: "Anda tidak dapat menghapus akun sendiri",
    CANNOT_UPDATE_ROLE_SELF: "Anda tidak dapat mengubah role sendiri",
    EMAIL_REQUIRED: "Email wajib diisi",
    NAME_REQUIRED: "Nama wajib diisi",
    ROLE_INVALID: "Role tidak valid",
    INVALID_USER_DATA: "Data user tidak valid",
  },

  // Store Management Errors
  STORE: {
    NOT_FOUND: "Informasi toko tidak ditemukan",
    UPDATE_FAILED: "Gagal memperbarui informasi toko",
    INVALID_PHONE_NUMBER: "Nomor telepon tidak valid",
    INVALID_MAPS_URL: "URL Google Maps tidak valid",
    SOCIAL_LINK_INVALID: "Link social media tidak valid",
    OPERATION_HOURS_INVALID: "Jam operasional tidak valid",
  },

  // Product Management Errors
  PRODUCT: {
    NOT_FOUND: "Produk tidak ditemukan",
    CREATE_FAILED: "Gagal membuat produk",
    UPDATE_FAILED: "Gagal memperbarui produk",
    DELETE_FAILED: "Gagal menghapus produk",
    TITLE_REQUIRED: "Judul produk wajib diisi",
    PRICE_INVALID: "Harga tidak valid",
    STOCK_INVALID: "Stok tidak valid",
    CATEGORY_REQUIRED: "Kategori wajib dipilih",
    SLUG_ALREADY_EXISTS: "Slug produk sudah digunakan",
    SKU_ALREADY_EXISTS: "SKU sudah digunakan",
    MAX_FEATURED_REACHED: "Maksimal 3 produk unggulan",
    MAX_IMAGES_REACHED: "Maksimal 5 gambar per produk",
    FEATURED_LIMIT_EXCEEDED:
      "Tidak bisa menambah produk unggulan, maksimal 3 produk",
    OUT_OF_STOCK: "Produk tidak tersedia",
    INSUFFICIENT_STOCK: "Stok tidak mencukupi",
  },

  // Category Errors
  CATEGORY: {
    NOT_FOUND: "Kategori tidak ditemukan",
    CREATE_FAILED: "Gagal membuat kategori",
    UPDATE_FAILED: "Gagal memperbarui kategori",
    DELETE_FAILED: "Gagal menghapus kategori",
    NAME_REQUIRED: "Nama kategori wajib diisi",
    SLUG_ALREADY_EXISTS: "Slug kategori sudah digunakan",
    HAS_PRODUCTS: "Kategori tidak dapat dihapus karena masih memiliki produk",
    HAS_SUBCATEGORIES:
      "Kategori tidak dapat dihapus karena masih memiliki sub-kategori",
    PARENT_NOT_FOUND: "Parent kategori tidak ditemukan",
    CIRCULAR_REFERENCE: "Tidak dapat membuat circular reference pada kategori",
  },

  // Tag Errors
  TAG: {
    NOT_FOUND: "Tag tidak ditemukan",
    CREATE_FAILED: "Gagal membuat tag",
    UPDATE_FAILED: "Gagal memperbarui tag",
    DELETE_FAILED: "Gagal menghapus tag",
    NAME_REQUIRED: "Nama tag wajib diisi",
    ALREADY_EXISTS: "Tag sudah ada",
  },

  // Media/Upload Errors
  MEDIA: {
    NOT_FOUND: "Media tidak ditemukan",
    UPLOAD_FAILED: "Gagal mengupload file",
    DELETE_FAILED: "Gagal menghapus file",
    FILE_TOO_LARGE: "Ukuran file terlalu besar",
    FILE_TYPE_NOT_ALLOWED: "Tipe file tidak diizinkan",
    NO_FILE_UPLOADED: "Tidak ada file yang diupload",
    IMAGE_REQUIRED: "Gambar wajib diupload",
    VIDEO_REQUIRED: "Video wajib diupload",
    MAX_FILES_EXCEEDED: "Maksimal file terlampaui",
    IMAGE_DIMENSIONS_INVALID: "Dimensi gambar tidak valid",
    IMAGE_TOO_SMALL: "Ukuran gambar terlalu kecil",
    IMAGE_TOO_LARGE: "Ukuran gambar terlalu besar",
    INVALID_IMAGE_FORMAT: "Format gambar tidak valid",
  },

  // Review Errors
  REVIEW: {
    NOT_FOUND: "Review tidak ditemukan",
    CREATE_FAILED: "Gagal membuat review",
    UPDATE_FAILED: "Gagal memperbarui review",
    DELETE_FAILED: "Gagal menghapus review",
    ALREADY_REVIEWED: "Anda sudah memberikan review untuk produk ini",
    RATING_REQUIRED: "Rating wajib diisi",
    RATING_INVALID: "Rating harus antara 1-5",
    COMMENT_REQUIRED: "Komentar wajib diisi",
    COMMENT_TOO_SHORT: "Komentar terlalu pendek",
    PRODUCT_NOT_FOUND: "Produk tidak ditemukan",
    CANNOT_REVIEW_OWN_PRODUCT: "Anda tidak dapat mereview produk sendiri",
    MAX_IMAGES_EXCEEDED: "Maksimal 3 gambar per review",
  },

  // Newsletter Errors
  NEWSLETTER: {
    SUBSCRIBER_NOT_FOUND: "Subscriber tidak ditemukan",
    EMAIL_ALREADY_SUBSCRIBED: "Email sudah terdaftar",
    SUBSCRIPTION_FAILED: "Gagal berlangganan newsletter",
    UNSUBSCRIBE_FAILED: "Gagal berhenti berlangganan",
    TEMPLATE_NOT_FOUND: "Template email tidak ditemukan",
    SEND_FAILED: "Gagal mengirim email",
    NO_SUBSCRIBERS: "Tidak ada subscriber aktif",
    INVALID_EMAIL: "Email tidak valid",
  },

  // Article/Blog Errors
  ARTICLE: {
    NOT_FOUND: "Artikel tidak ditemukan",
    CREATE_FAILED: "Gagal membuat artikel",
    UPDATE_FAILED: "Gagal memperbarui artikel",
    DELETE_FAILED: "Gagal menghapus artikel",
    TITLE_REQUIRED: "Judul artikel wajib diisi",
    CONTENT_REQUIRED: "Konten artikel wajib diisi",
    SLUG_ALREADY_EXISTS: "Slug artikel sudah digunakan",
    CATEGORY_REQUIRED: "Kategori artikel wajib dipilih",
  },

  // Page Management Errors
  PAGE: {
    NOT_FOUND: "Halaman tidak ditemukan",
    UPDATE_FAILED: "Gagal memperbarui halaman",
    TITLE_REQUIRED: "Judul halaman wajib diisi",
    CONTENT_REQUIRED: "Konten halaman wajib diisi",
  },

  // FAQ Errors
  FAQ: {
    NOT_FOUND: "FAQ tidak ditemukan",
    CREATE_FAILED: "Gagal membuat FAQ",
    UPDATE_FAILED: "Gagal memperbarui FAQ",
    DELETE_FAILED: "Gagal menghapus FAQ",
    QUESTION_REQUIRED: "Pertanyaan wajib diisi",
    ANSWER_REQUIRED: "Jawaban wajib diisi",
  },

  // Homepage/Content Errors
  HOMEPAGE: {
    UPDATE_FAILED: "Gagal memperbarui homepage",
    HERO_IMAGE_REQUIRED: "Gambar hero wajib diupload",
    USP_LIMIT_EXCEEDED: "Maksimal 6 USP",
    USECASE_LIMIT_EXCEEDED: "Maksimal 4 use case",
    SECTION_NOT_FOUND: "Section tidak ditemukan",
  },

  // Settings Errors
  SETTING: {
    NOT_FOUND: "Pengaturan tidak ditemukan",
    UPDATE_FAILED: "Gagal memperbarui pengaturan",
    INVALID_TIMEZONE: "Timezone tidak valid",
    INVALID_CURRENCY: "Currency tidak valid",
    INVALID_DATE_FORMAT: "Format tanggal tidak valid",
    SMTP_CONFIG_INVALID: "Konfigurasi SMTP tidak valid",
    BACKUP_FAILED: "Gagal membuat backup",
    RESTORE_FAILED: "Gagal restore backup",
  },

  // Analytics Errors
  ANALYTICS: {
    FETCH_FAILED: "Gagal mengambil data analytics",
    EXPORT_FAILED: "Gagal export data",
    INVALID_DATE_RANGE: "Range tanggal tidak valid",
    NO_DATA_AVAILABLE: "Tidak ada data tersedia",
  },

  // Validation Errors
  VALIDATION: {
    FAILED: "Validasi gagal",
    REQUIRED_FIELD: "Field wajib diisi",
    INVALID_FORMAT: "Format tidak valid",
    INVALID_EMAIL: "Format email tidak valid",
    INVALID_URL: "Format URL tidak valid",
    INVALID_PHONE: "Format nomor telepon tidak valid",
    INVALID_DATE: "Format tanggal tidak valid",
    MIN_LENGTH: "Minimal {min} karakter",
    MAX_LENGTH: "Maksimal {max} karakter",
    MIN_VALUE: "Nilai minimal {min}",
    MAX_VALUE: "Nilai maksimal {max}",
    MUST_BE_POSITIVE: "Nilai harus positif",
    MUST_BE_INTEGER: "Nilai harus bilangan bulat",
    INVALID_OBJECT_ID: "ID tidak valid",
  },

  // Rate Limit Errors
  RATE_LIMIT: {
    TOO_MANY_REQUESTS: "Terlalu banyak request. Silakan coba lagi nanti",
    LOGIN_ATTEMPTS_EXCEEDED:
      "Terlalu banyak percobaan login. Coba lagi setelah 15 menit",
    API_LIMIT_EXCEEDED: "Limit API terlampaui",
    EXPORT_LIMIT_EXCEEDED: "Terlalu banyak request export. Coba lagi nanti",
  },

  // System Errors
  SYSTEM: {
    INTERNAL_ERROR: "Terjadi kesalahan sistem",
    SERVICE_UNAVAILABLE: "Layanan tidak tersedia",
    DATABASE_ERROR: "Error koneksi database",
    NETWORK_ERROR: "Error koneksi jaringan",
    TIMEOUT: "Request timeout",
    MAINTENANCE_MODE: "Sistem sedang dalam maintenance",
    FEATURE_NOT_AVAILABLE: "Fitur belum tersedia",
  },

  // Generic Errors
  GENERIC: {
    NOT_FOUND: "Data tidak ditemukan",
    CREATE_FAILED: "Gagal membuat data",
    UPDATE_FAILED: "Gagal memperbarui data",
    DELETE_FAILED: "Gagal menghapus data",
    FETCH_FAILED: "Gagal mengambil data",
    OPERATION_FAILED: "Operasi gagal",
    INVALID_REQUEST: "Request tidak valid",
    MISSING_PARAMETERS: "Parameter tidak lengkap",
    DUPLICATE_ENTRY: "Data sudah ada",
  },
};

/**
 * Helper function untuk format error message dengan dynamic values
 * Usage: formatErrorMessage(ERROR_MESSAGES.VALIDATION.MIN_LENGTH, { min: 8 })
 */
const formatErrorMessage = (message, params = {}) => {
  let formatted = message;
  Object.keys(params).forEach((key) => {
    formatted = formatted.replace(`{${key}}`, params[key]);
  });
  return formatted;
};

module.exports = {
  ERROR_MESSAGES,
  formatErrorMessage,
};
