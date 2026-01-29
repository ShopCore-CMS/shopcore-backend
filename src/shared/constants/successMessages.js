/**
 * Centralized Success Messages
 * Untuk consistency dan easy maintenance
 */

const SUCCESS_MESSAGES = {
  // Authentication & Authorization
  AUTH: {
    LOGIN_SUCCESS: "Login berhasil",
    LOGOUT_SUCCESS: "Logout berhasil",
    REGISTER_SUCCESS: "Registrasi berhasil",
    PASSWORD_CHANGED: "Password berhasil diubah",
    PASSWORD_RESET_SENT: "Link reset password telah dikirim ke email Anda",
    PASSWORD_RESET_SUCCESS: "Password berhasil direset",
    EMAIL_VERIFIED: "Email berhasil diverifikasi",
    TWO_FACTOR_ENABLED: "Autentikasi dua faktor berhasil diaktifkan",
    TWO_FACTOR_DISABLED: "Autentikasi dua faktor berhasil dinonaktifkan",
    SESSION_REFRESHED: "Sesi berhasil diperpanjang",
  },

  // User Management
  USER: {
    CREATED: "User berhasil dibuat",
    UPDATED: "User berhasil diperbarui",
    DELETED: "User berhasil dihapus",
    PROFILE_UPDATED: "Profile berhasil diperbarui",
    STATUS_UPDATED: "Status user berhasil diperbarui",
    ROLE_UPDATED: "Role user berhasil diperbarui",
    FETCHED: "Data user berhasil diambil",
    LIST_FETCHED: "Daftar user berhasil diambil",
  },

  // Store Management
  STORE: {
    INFO_UPDATED: "Informasi toko berhasil diperbarui",
    LOGO_UPDATED: "Logo toko berhasil diperbarui",
    HOURS_UPDATED: "Jam operasional berhasil diperbarui",
    CONTACT_UPDATED: "Informasi kontak berhasil diperbarui",
    LOCATION_UPDATED: "Lokasi toko berhasil diperbarui",
    SOCIAL_LINKS_UPDATED: "Link social media berhasil diperbarui",
  },

  // Product Management
  PRODUCT: {
    CREATED: "Produk berhasil dibuat",
    UPDATED: "Produk berhasil diperbarui",
    DELETED: "Produk berhasil dihapus",
    PUBLISHED: "Produk berhasil dipublikasikan",
    UNPUBLISHED: "Produk berhasil dihapus dari publikasi",
    FEATURED_ADDED: "Produk berhasil ditambahkan ke produk unggulan",
    FEATURED_REMOVED: "Produk berhasil dihapus dari produk unggulan",
    IMAGE_UPLOADED: "Gambar produk berhasil diupload",
    IMAGE_DELETED: "Gambar produk berhasil dihapus",
    STOCK_UPDATED: "Stok produk berhasil diperbarui",
    BULK_UPDATED: "Produk berhasil diperbarui secara bulk",
    BULK_DELETED: "Produk berhasil dihapus secara bulk",
    FETCHED: "Data produk berhasil diambil",
    LIST_FETCHED: "Daftar produk berhasil diambil",
    IMPORTED: "Produk berhasil diimport",
    EXPORTED: "Produk berhasil diexport",
  },

  // Category Management
  CATEGORY: {
    CREATED: "Kategori berhasil dibuat",
    UPDATED: "Kategori berhasil diperbarui",
    DELETED: "Kategori berhasil dihapus",
    REORDERED: "Urutan kategori berhasil diperbarui",
    FETCHED: "Data kategori berhasil diambil",
    LIST_FETCHED: "Daftar kategori berhasil diambil",
  },

  // Tag Management
  TAG: {
    CREATED: "Tag berhasil dibuat",
    UPDATED: "Tag berhasil diperbarui",
    DELETED: "Tag berhasil dihapus",
    FETCHED: "Data tag berhasil diambil",
    LIST_FETCHED: "Daftar tag berhasil diambil",
  },

  // Media/Upload
  MEDIA: {
    UPLOADED: "File berhasil diupload",
    UPDATED: "Media berhasil diperbarui",
    DELETED: "Media berhasil dihapus",
    BULK_DELETED: "Media berhasil dihapus secara bulk",
    FETCHED: "Data media berhasil diambil",
    LIST_FETCHED: "Daftar media berhasil diambil",
  },

  // Review Management
  REVIEW: {
    CREATED: "Review berhasil dibuat",
    UPDATED: "Review berhasil diperbarui",
    DELETED: "Review berhasil dihapus",
    APPROVED: "Review berhasil disetujui",
    REJECTED: "Review berhasil ditolak",
    FEATURED_ADDED: "Review berhasil ditambahkan ke homepage",
    FEATURED_REMOVED: "Review berhasil dihapus dari homepage",
    REPLY_ADDED: "Balasan review berhasil ditambahkan",
    FETCHED: "Data review berhasil diambil",
    LIST_FETCHED: "Daftar review berhasil diambil",
  },

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBED: "Berhasil berlangganan newsletter",
    UNSUBSCRIBED: "Berhasil berhenti berlangganan newsletter",
    EMAIL_SENT: "Email berhasil dikirim",
    TEMPLATE_CREATED: "Template email berhasil dibuat",
    TEMPLATE_UPDATED: "Template email berhasil diperbarui",
    TEMPLATE_DELETED: "Template email berhasil dihapus",
    SUBSCRIBER_ADDED: "Subscriber berhasil ditambahkan",
    SUBSCRIBER_REMOVED: "Subscriber berhasil dihapus",
    BULK_IMPORT: "Subscriber berhasil diimport",
    EXPORTED: "Data subscriber berhasil diexport",
  },

  // Article/Blog
  ARTICLE: {
    CREATED: "Artikel berhasil dibuat",
    UPDATED: "Artikel berhasil diperbarui",
    DELETED: "Artikel berhasil dihapus",
    PUBLISHED: "Artikel berhasil dipublikasikan",
    UNPUBLISHED: "Artikel berhasil di-unpublish",
    FETCHED: "Data artikel berhasil diambil",
    LIST_FETCHED: "Daftar artikel berhasil diambil",
  },

  // Page Management
  PAGE: {
    UPDATED: "Halaman berhasil diperbarui",
    VISIBILITY_CHANGED: "Visibility halaman berhasil diubah",
    FETCHED: "Data halaman berhasil diambil",
  },

  // FAQ
  FAQ: {
    CREATED: "FAQ berhasil dibuat",
    UPDATED: "FAQ berhasil diperbarui",
    DELETED: "FAQ berhasil dihapus",
    REORDERED: "Urutan FAQ berhasil diperbarui",
    FETCHED: "Data FAQ berhasil diambil",
    LIST_FETCHED: "Daftar FAQ berhasil diambil",
  },

  // Homepage/Content
  HOMEPAGE: {
    HERO_UPDATED: "Hero section berhasil diperbarui",
    USP_ADDED: "USP berhasil ditambahkan",
    USP_UPDATED: "USP berhasil diperbarui",
    USP_DELETED: "USP berhasil dihapus",
    USECASE_ADDED: "Use case berhasil ditambahkan",
    USECASE_UPDATED: "Use case berhasil diperbarui",
    USECASE_DELETED: "Use case berhasil dihapus",
    SECTION_REORDERED: "Urutan section berhasil diperbarui",
    VISIBILITY_UPDATED: "Visibility section berhasil diperbarui",
    FETCHED: "Data homepage berhasil diambil",
  },

  // Settings
  SETTING: {
    GENERAL_UPDATED: "Pengaturan umum berhasil diperbarui",
    SEO_UPDATED: "Pengaturan SEO berhasil diperbarui",
    SECURITY_UPDATED: "Pengaturan keamanan berhasil diperbarui",
    EMAIL_UPDATED: "Pengaturan email berhasil diperbarui",
    BACKUP_UPDATED: "Pengaturan backup berhasil diperbarui",
    PRODUCT_UPDATED: "Pengaturan produk berhasil diperbarui",
    ORDER_UPDATED: "Pengaturan order berhasil diperbarui",
    BACKUP_CREATED: "Backup berhasil dibuat",
    RESTORED: "Data berhasil di-restore",
    FETCHED: "Pengaturan berhasil diambil",
  },

  // Analytics
  ANALYTICS: {
    FETCHED: "Data analytics berhasil diambil",
    EXPORTED: "Report analytics berhasil diexport",
    DASHBOARD_LOADED: "Dashboard analytics berhasil dimuat",
  },

  // System
  SYSTEM: {
    CACHE_CLEARED: "Cache berhasil dibersihkan",
    LOG_CLEARED: "Log berhasil dibersihkan",
    MAINTENANCE_ENABLED: "Mode maintenance berhasil diaktifkan",
    MAINTENANCE_DISABLED: "Mode maintenance berhasil dinonaktifkan",
  },

  // Generic
  GENERIC: {
    SUCCESS: "Operasi berhasil",
    CREATED: "Data berhasil dibuat",
    UPDATED: "Data berhasil diperbarui",
    DELETED: "Data berhasil dihapus",
    FETCHED: "Data berhasil diambil",
    SAVED: "Data berhasil disimpan",
    SENT: "Berhasil dikirim",
    COMPLETED: "Operasi selesai",
  },
};

module.exports = SUCCESS_MESSAGES;
