// Generated release notes data from /releases/*.json
export interface ReleaseItem {
  type: "new" | "improvement" | "fix";
  id: string;
  en: string;
}

export interface ReleaseNote {
  version: string;
  date: string;
  type: string;
  status: string;
  project?: {
    name: string;
  };
  title: {
    id: string;
    en: string;
  };
  body: {
    id: string;
    en: string;
  };
  items: ReleaseItem[];
}

export const RELEASES_DATA: ReleaseNote[] = [
  {
      "date": "2026-11-06",
      "type": "feature",
      "status": "published",
      "project": {
          "name": "xphpMyAdmin — Pengelola Koneksi Database Remote"
      },
      "title": {
          "id": "Fitur Duplikasi Koneksi, Dukungan Dwibahasa Lengkap, & Optimasi Mac",
          "en": "Connection Duplication, Full Bilingual Support, & Mac Platform Optimization"
      },
      "body": {
          "id": "Pembaruan ini menghadirkan fitur klon koneksi host untuk memudahkan pembuatan profil server baru tanpa mengisi dari awal, dukungan dwibahasa menyeluruh (Indonesia & Inggris) di seluruh antarmuka aplikasi, tampilan ikon resmi di macOS Dock, penyalinan pesan sistem dan menu desktop, serta penyempurnaan pembuatan paket distribusi macOS Apple Silicon.",
          "en": "This update introduces a connection cloning feature to quickly create new server profiles without reconfiguring from scratch, comprehensive bilingual support (Indonesian & English) across all application views, official icon display in macOS Dock, native desktop right-click menus, and streamlined macOS Apple Silicon packaging."
      },
      "items": [
          {
              "type": "new",
              "id": "Fitur Duplikasi & Klon Profil Koneksi: Pengguna kini dapat menggandakan konfigurasi server database atau terowongan yang sudah ada dengan satu klik, memudahkan pembuatan profil baru tanpa perlu mengisi ulang seluruh parameter dari awal.",
              "en": "Connection Profile Duplication & Cloning Feature: Users can now clone existing database server or tunnel configurations with a single click, eliminating the need to re-enter all connection parameters from scratch."
          },
          {
              "type": "new",
              "id": "Menu Konteks Kartu & Menu Bar Aplikasi Desktop: Menyediakan menu bar desktop (Berkas, Sunting, Koneksi, Tampilan, Bantuan) dan menu klik kanan pada kartu koneksi untuk menghubungkan, mengedit, menduplikasi, dan menyalin parameter secara instan.",
              "en": "Card Context Menu & Desktop Application Menu Bar: Implements native desktop menubar and right-click context menu on connection cards for connecting, editing, duplicating, and copying parameters instantly."
          },
          {
              "type": "fix",
              "id": "Persistensi Password Brankas Lokal & Sinkronisasi Cloud: Password database kini tersimpan permanen di brankas lokal (Local Vault) dan ikut tersinkronisasi ke Neon Cloud Backend, sehingga pengguna tidak perlu lagi memasukkan ulang password setiap kali membuka aplikasi.",
              "en": "Local Vault Password Persistence & Cloud Sync: Database passwords are now permanently stored in the local vault and synchronized with Neon Cloud Backend, eliminating the need to re-enter credentials upon application restarts."
          },
          {
              "type": "improvement",
              "id": "Kemudahan Penyalinan Pesan Error & Menu Konteks Desktop: Notifikasi sistem kini mendukung seleksi teks langsung, tombol salin instan, klik dua kali untuk menyalin, serta menu klik kanan native desktop untuk memudahkan pemeriksaan kendala.",
              "en": "Streamlined Error Copying & Native Desktop Context Menu: System notifications now support direct text selection, instant copy buttons, double-click to copy, and a native desktop right-click context menu for effortless diagnostic review."
          },
          {
              "type": "improvement",
              "id": "Optimalisasi Pembuatan Paket Distribusi Multi-Platform: Jalur pembuatan paket aplikasi mandiri untuk Linux, macOS, dan Windows kini bekerja lebih cepat, efisien dalam penggunaan ruang penyimpanan, serta bebas hambatan pada seluruh perangkat.",
              "en": "Multi-Platform Distribution Packaging Optimization: Application packaging workflows for Linux, macOS, and Windows are now faster, more storage-efficient, and seamless across all desktop devices."
          },
          {
              "type": "improvement",
              "id": "Peningkatan Kecepatan & Efisiensi Pemasangan Komponen: Proses pembaruan dan instalasi komponen aplikasi kini dioptimalkan dengan manajemen penyimpanan bersama, memangkas waktu pemuatan dan memastikan konsistensi lingkungan kerja yang stabil.",
              "en": "Component Installation Speed & Efficiency Enhancement: Component installation and updates are now optimized with unified storage caching, cutting down setup durations and guaranteeing environment consistency."
          },
          {
              "type": "fix",
              "id": "Penegakan Integritas Audit dan Pengujian Sistem: Memperbaiki kelengkapan rincian pencatatan riwayat aksi pada modul sinkronisasi brankas data, memastikan seluruh rangkaian pengujian sistem lolos dengan status sempurna dan bebas galat.",
              "en": "Audit Integrity Enforcement & System Test Stabilization: Fixed action record details in the data vault synchronization module, ensuring all automated system test suites pass with complete reliability."
          },
          {
              "type": "improvement",
              "id": "Dukungan Bahasa Menyeluruh Tanpa Hambatan: Memperbaiki keterbatasan pergantian bahasa sebelumnya dengan mengintegrasikan kamus dwibahasa (Indonesia & Inggris) penuh ke seluruh komponen aplikasi—mulai dari bilah tab navigasi, bilah samping koneksi, daftar & menu kartu server, formulir pengaturan host & SSH, menu bar desktop, tab pengelola database, hingga pusat pembaruan.",
              "en": "Comprehensive Seamless Bilingual Support: Resolved partial language switching limitations by integrating complete bilingual (Indonesian & English) dictionaries across all application components—including navigation header tabs, connection sidebar, host cards & context menus, host & SSH configuration forms, application menubar, database workspace tabs, and the updates center."
          },
          {
              "type": "fix",
              "id": "Tampilan Ikon Resmi Aplikasi di macOS Dock: Memperbaiki tampilan ikon aplikasi pada sistem macOS agar senantiasa menampilkan logo resmi di Dock secara tajam dan konsisten baik dalam mode pengembangan maupun saat terpasang di sistem, menggantikan ikon bawaan.",
              "en": "Official Application Icon in macOS Dock: Enhanced macOS integration to consistently display the crisp, official brand icon in the system Dock during both local runtime and production installations, replacing generic system fallbacks."
          },
          {
              "type": "improvement",
              "id": "Penyempurnaan Jalur Kompilasi & Pemasangan Mac Apple Chip: Mengoptimalkan pembuatan paket installer DMG dan berkas aplikasi mandiri untuk Mac berbasis chip Apple Silicon (M1/M2/M3/M4) tanpa ketergantungan unduhan jaringan eksternal yang lambat, serta mendukung pemasangan langsung ke sistem.",
              "en": "Apple Silicon Mac Installer & Compilation Optimization: Streamlined DMG installer and standalone application packaging for Apple Silicon Macs (M1/M2/M3/M4) without slow external network dependencies, enabling fast local packaging and seamless system installation."
          }
      ],
      "version": "1.4.2"
  },
  {
    "version": "1.4.1",
    "date": "2026-10-31",
    "type": "feature",
    "status": "published",
    "project": {
      "name": "xphpMyAdmin — Pengelola Koneksi Database Remote"
    },
    "title": {
      "id": "Tampilan Mandiri Tambah Baris, Formulir Lapang Satu Kolom, Draf Koneksi Bersih, & Isolasi Akun Mandiri",
      "en": "Dedicated Table Row View, Spacious Single-Column Form, Draft Safety, & User-Scoped Account Isolation"
    },
    "body": {
      "id": "Pembaruan ini menghadirkan antarmuka mandiri untuk penyuntingan dan penyalinan baris data tabel, penataan ulang formulir konfigurasi koneksi menjadi satu kolom vertikal yang lapang, isolasi draf koneksi baru agar tidak mengotori daftar sebelum disimpan, pemberitahuan status seketika pada setiap aksi kerja, serta pemisahan data brankas dan snapshot audit per akun pengguna.",
      "en": "This update introduces a dedicated view for editing and duplicating table rows, streamlines connection configuration forms into a spacious single-column layout, isolates new connection drafts from polluting the list until saved, provides instant status notifications across all user actions, and ensures complete workspace and snapshot isolation between user accounts."
    },
    "items": [
      {
        "type": "new",
        "id": "Tampilan Mandiri Tambah, Ubah, dan Salin Baris Data: Pengguna kini diarahkan ke tampilan kerja penuh saat menyunting, menyalin, atau menambah baris tabel baru, lengkap dengan fungsi penanganan data otomatis dan tombol eksekusi fleksibel.",
        "en": "Dedicated Table Row Insert, Edit, and Duplicate View: Users are now guided to a full workspace view when editing, duplicating, or adding new rows, complete with automatic data helpers and flexible execution options."
      },
      {
        "type": "improvement",
        "id": "Isolasi Data Mandiri Antar-Akun & Snapshot Multiatribut: Setiap akun (Gratis, Pro, Tim, Bisnis) kini memiliki brankas data, riwayat kueri, profil koneksi, dan catatan audit jurnal yang terisolasi secara mandiri sehingga perpindahan akun selalu menampilkan snapshot dan ruang kerja yang akurat sesuai hak aksesnya tanpa saling menimpa.",
        "en": "User-Scoped Workspace Isolation & Multi-Account Snapshots: Each account tier (Free, Pro, Team, Business) now maintains completely isolated connection vaults, query history, saved profiles, and audit journals, ensuring that account switching displays accurate, partitioned snapshots without cross-account data leakage."
      },
      {
        "type": "improvement",
        "id": "Pengelolaan Draf Koneksi Tanpa Polusi Daftar: Penambahan host atau terowongan baru kini beroperasi dalam mode draf mandiri pada panel kanan. Koneksi baru hanya akan muncul pada daftar server setelah pengguna secara eksplisit mengonfirmasi simpan, mencegah data sementara tertinggal.",
        "en": "Draft-First Connection Creation Without List Pollution: Creating new hosts or tunnels now operates in an isolated draft state in the inspector. New profiles only appear in the saved servers list once explicitly confirmed by saving, preventing lingering temporary entries."
      },
      {
        "type": "improvement",
        "id": "Penataan Formulir Panel Samping Kanan Satu Kolom: Bidang isian konfigurasi server database dan server terowongan pada panel samping kanan kini tersusun rapi dalam satu kolom vertikal, memberikan keleluasaan membaca dan mengisi data.",
        "en": "Single-Column Right Inspector Form Layout: Server and tunnel configuration fields in the right-side inspector panel are now neatly arranged in a single vertical column, ensuring comfortable reading and input."
      },
      {
        "type": "improvement",
        "id": "Pemberitahuan Status Visual Terpadu: Seluruh operasi modifikasi data, eksekusi kueri, dan penanganan kesalahan kini dilengkapi pemberitahuan visual langsung di layar untuk memastikan transparansi setiap tindakan.",
        "en": "Unified Visual Status Notifications: All data modifications, query executions, and error handling now feature instant on-screen notifications to keep users informed of every operation status."
      },
      {
        "type": "improvement",
        "id": "Penyederhanaan Dialog Konfirmasi Penghapusan: Kotak dialog konfirmasi saat menghapus baris tabel disederhanakan dengan pesan yang ringkas, jelas, dan fokus pada objek yang dituju.",
        "en": "Simplified Deletion Confirmation Dialog: The confirmation dialog when deleting table rows has been streamlined with a concise, clear message focused directly on the targeted object."
      },
      {
        "type": "improvement",
        "id": "Pembersihan Pemberitahuan Navigasi Menu: Notifikasi pop-up saat beralih antar-menu bilah samping maupun antar-tab studio telah dihilangkan sehingga alur navigasi terasa hening, instan, dan bebas gangguan visual.",
        "en": "Silenced Menu Navigation Notifications: Pop-up alert notifications when switching between sidebar menus and studio tabs have been removed, making navigation silent, instantaneous, and distraction-free."
      }
    ]
  },
  {
    "version": "1.4.0",
    "date": "2026-10-30",
    "type": "feature",
    "status": "published",
    "project": {
      "name": "xphpMyAdmin — Pengelola Koneksi Database Remote"
    },
    "title": {
      "id": "Pusat Pengaturan Terpadu, Replikasi Multi-Perangkat, & Antarmuka Responsif",
      "en": "Unified Settings Center, Multi-Device Replication, & Responsive Interface"
    },
    "body": {
      "id": "Pembaruan harian menghadirkan pusat pengaturan aplikasi mandiri, replikasi otomatis profil database lintas perangkat saat aplikasi dibuka, penyesuaian bilah jendela bawaan macOS, perapian tata letak panel inspektur koneksi, serta penyempurnaan tema terang berdaya kontras tinggi.",
      "en": "A unified daily update introducing a dedicated application settings center, automated cross-device database profile sync upon launch, native macOS window header harmonization, streamlined connection inspector layout, and high-contrast light theme improvements."
    },
    "items": [
      {
        "type": "new",
        "id": "Pusat Pengaturan Aplikasi Mandiri: Halaman pengaturan terpadu baru yang dapat diakses langsung dari sudut kiri bawah bilah navigasi, menyediakan kustomisasi bahasa, tema visual, preferensi koneksi, batas data kueri, dan opsi sinkronisasi tanpa jendela sembul yang mengganggu.",
        "en": "Dedicated Application Settings Center: A newly integrated settings page accessible from the bottom-left sidebar, providing controls for language, visual themes, connection preferences, default query limits, and cloud synchronization without intrusive popups."
      },
      {
        "type": "new",
        "id": "Sinkronisasi Cloud Cerdas & Replikasi Multi-Perangkat: Sinkronisasi data awan kini otomatis menarik dan memperbarui profil koneksi server saat aplikasi dibuka maupun setelah masuk akun, memastikan data antar-perangkat selalu selaras seketika tanpa input ulang manual.",
        "en": "Smart Cloud Sync & Multi-Device Replication: Cloud synchronization now automatically pulls and updates server connection profiles upon application launch and sign-in, ensuring seamless cross-device synchronization without manual data re-entry."
      },
      {
        "type": "improvement",
        "id": "Penyelarasan Bilah Judul macOS: Penataan bilah atas pada sistem operasi macOS diselaraskan dengan tata letak tombol navigasi jendela bawaan, menghapus duplikasi tombol di sisi kanan dan memberikan ruang judul yang rapi serta proporsional.",
        "en": "Native macOS Title Bar Harmonization: Refined window header on macOS by aligning with native traffic-light window controls, eliminating redundant right-side buttons and ensuring proportional, distraction-free spacing."
      },
      {
        "type": "improvement",
        "id": "Kerapian Tata Letak Panel Pengaturan Koneksi: Panel samping kanan pengatur koneksi kini dilengkapi kepala panel tersemat, area konfigurasi mandiri yang dapat digulir, serta tombol aksi simpan dan tes koneksi yang selalu tersemat rapi di bagian bawah.",
        "en": "Streamlined Connection Inspector Layout: The right-side connection inspector now features a pinned header, independently scrollable form content, and pinned action buttons at the bottom for testing and saving connections."
      },
      {
        "type": "fix",
        "id": "Harmonisasi Kontras Tema Terang pada Fitur Terowongan Server: Seluruh elemen bertema ungu (koneksi terowongan SSH, penanda jalur loopback, preset kunci, dan lencana paket akun) menggunakan tingkat ketajaman kontras tinggi di mode terang sehingga mudah dibaca tanpa mengorbankan estetika mode gelap.",
        "en": "High-Contrast Light Theme Harmony for Server Tunneling: All purple-themed elements (SSH tunneling connections, loopback indicators, key presets, and subscription tier badges) feature high-contrast readability in light mode while maintaining dark mode elegance."
      },
      {
        "type": "improvement",
        "id": "Standardisasi Tombol Batal & Dukungan Dwibahasa Bawaan: Seluruh jendela dialog dan formulir aksi kini dilengkapi tombol pembatalan yang seragam dan mudah dijangkau, dengan dukungan penuh bahasa Inggris (bawaan) dan bahasa Indonesia di seluruh antarmuka.",
        "en": "Standardized Action Cancellation & Default Bilingual Support: All action dialogs and forms now feature clear, consistent cancellation buttons alongside comprehensive bilingual support with English set as default alongside Indonesian."
      },
      {
        "type": "improvement",
        "id": "Penyederhanaan Tampilan Masuk & Pendaftaran Akun: Antarmuka autentikasi dirampingkan menjadi satu tampilan ringkas tanpa bilah gulir vertikal maupun horizontal, memudahkan pengguna beralih antara masuk dan pendaftaran akun baru secara instan.",
        "en": "Streamlined Sign-In & Registration Experience: The authentication screen has been simplified into a compact, scroll-free layout, allowing users to seamlessly switch between logging in and creating a new account."
      },
      {
        "type": "improvement",
        "id": "Identitas Layanan Cloud Resmi & Kebersihan Bilah Aplikasi: Penyelarasan identitas layanan sinkronisasi cloud dengan penamaan resmi ER Suite serta pembersihan bilah atas aplikasi untuk ruang kerja yang lebih fokus dan leluasa.",
        "en": "Official Cloud Service Identity & Clean Application Bar: Harmonized cloud synchronization identity under official ER Suite branding and streamlined the top app bar for a focused, distraction-free workspace."
      },
      {
        "type": "improvement",
        "id": "Responsivitas Penuh Mode Jendela & Layar Penuh: Antarmuka aplikasi beradaptasi mulus baik pada jendela berukuran kecil maupun layar penuh, mencakup kontrol jendela adaptif, penataan grid kartu koneksi otomatis satu kolom, serta tata letak studio kerja proporsional.",
        "en": "Full Windowed & Fullscreen Responsiveness: The interface dynamically adapts whether in compact windowed mode or maximized fullscreen, featuring adaptive window controls, automatic single-column host card reflow, and proportional studio workspace boundaries."
      },
      {
        "type": "improvement",
        "id": "Pengguliran Horizontal Aman untuk Seluruh Tabel Data: Seluruh tabel penjelajah database (struktur tabel, daftar rutin, pemicu otomatis, variabel server, set karakter, dan hasil kueri) dilengkapi penampung gulir horizontal terproteksi agar tidak terpotong pada ukuran jendela sempit.",
        "en": "Protected Horizontal Scrolling Across All Data Tables: All workspace database tables (table structures, routines, automated triggers, server variables, charsets, and query outputs) feature safe horizontal scroll containers preventing column clipping on compact windows."
      }
    ]
  },
  {
    "version": "1.3.0",
    "date": "2026-10-29",
    "type": "feature",
    "status": "published",
    "title": {
      "id": "Standarisasi Terowongan VPS, Sinkronisasi Otomatis Cloud, dan Tema Aksen Teal",
      "en": "VPS Tunnel Standardization, Automated Cloud Sync, & Teal Accent Theme"
    },
    "body": {
      "id": "Pembaruan menyeluruh menghadirkan standardisasi konfigurasi terowongan VPS dengan preset pengguna dan perlindungan kunci terenkripsi, sinkronisasi otomatis aksi pengguna ke server cloud secara default bagi akun Pro/Team/Business dengan opsi manual instan, penyelarasan tema visual aksen Teal di seluruh aplikasi, eliminasi istilah teknis internal, serta penyempurnaan stabilitas koneksi hening melalui auto keep-alive berkala.",
      "en": "A unified release delivering VPS tunnel configuration standardization with user presets and encrypted key protection, default automated cloud synchronization of user activities for Pro/Team/Business accounts with instant manual sync options, app-wide Teal accent theme alignment, elimination of internal technical jargon, and enhanced idle connection resilience via periodic auto keep-alive."
    },
    "items": [
      {
        "type": "new",
        "id": "Otorisasi Masuk via Peramban Eksternal & Pembukaan Balik Otomatis: Saat pengguna memilih masuk dengan Google atau GitHub, aplikasi kini secara otomatis membuka peramban web bawaan sistem ke portal otorisasi resmi yang aman. Setelah proses masuk selesai di peramban, tautan balik secara instan memanggil dan memfokuskan kembali aplikasi desktop xphpMyAdmin, mengautentikasi sesi secara otomatis, dan langsung mengarahkan pengguna ke ruang kerja.",
        "en": "External Browser Authorization & Automatic Desktop Reopen: When users sign in with Google or GitHub, the application now automatically launches the system's default web browser to the secure official authorization portal. Upon completion in the browser, an intelligent callback instantly invokes and re-focuses the xphpMyAdmin desktop app, authenticates the session automatically, and grants immediate workspace access."
      },
      {
        "type": "new",
        "id": "Pendaftaran Akun Baru Tanpa Hambatan & Brankas Lokal Gratis: Pengguna baru kini dapat mendaftar tanpa harus memilih paket pembayaran di awal dan langsung menikmati brankas koneksi lokal mandiri secara gratis tanpa batasan waktu. Akses sinkronisasi cloud terpusat dilindungi dengan pemeriksaan status langganan cerdas, menampilkan dialog edukasi pembaruan paket saat pengguna akun gratis mencoba melakukan sinkronisasi awan.",
        "en": "Frictionless User Registration & Free Local Vault: New users can now register without being prompted for payment plans upfront, enjoying a fully functional local connection vault for free indefinitely. Centralized cloud synchronization access is protected with intelligent subscription verification, guiding free-tier users with an upgrade educational modal whenever cloud sync is requested."
      },
      {
        "type": "new",
        "id": "Pusat Langganan Cloud Berjenjang & Pilihan Siklus Tagihan: Pengguna kini dapat memilih dan memperbarui paket langganan cloud (Pro, Team, Business) dengan fleksibilitas siklus penagihan bulanan atau tahunan (hemat hingga 33%), integrasi sinkronisasi brankas otomatis lintas perangkat, serta akses akun pengujian instan.",
        "en": "Tiered Cloud Subscription Hub & Flexible Billing Cycles: Users can now select and upgrade cloud subscription plans (Pro, Team, Business) with monthly or annual billing cycles (saving up to 33%), multi-device automated vault synchronization, and instant test account access."
      },
      {
        "type": "new",
        "id": "Penyelarasan Cloud & Pencatatan Transaksi Terpadu: Penambahan arsitektur serialisasi data berformat JSON resmi yang mencatat seluruh aksi pengguna (pembuatan koneksi, riwayat kueri, pemeliharaan tabel, dan operasi basis data), dilengkapi kemampuan ekspor cadangan mandiri, pemulihan instan, serta integrasi sinkronisasi cloud otomatis bagi pengguna ruang kerja berlangganan.",
        "en": "Cloud Synchronization & Unified Transaction Journaling: Implementation of official JSON data serialization capturing all user actions (connection provisioning, query history, table maintenance, and database operations), featuring offline backup export, instant recovery, and automated cloud synchronization for workspace subscribers."
      },
      {
        "type": "new",
        "id": "Ekspor Cadangan Multi-Format & Seleksi Kustom: Pengguna kini dapat mencadangkan seluruh skema atau data tabel ke dalam berbagai format dokumen standar (SQL Dump, CSV, JSON, dan XML), baik melalui ekspor cepat satu-klik maupun pemilihan tabel secara fleksibel.",
        "en": "Multi-Format Backup Export & Custom Selection: Users can now back up entire schemas or table data into standard document formats (SQL Dump, CSV, JSON, and XML) through either quick one-click export or flexible table-by-table selection."
      },
      {
        "type": "new",
        "id": "Pemulihan & Impor Data Multi-Format yang Fleksibel: Modul impor kini mendukung pemulihan berkas SQL, pemetaan berkas data CSV ke tabel tujuan dengan penyesuaian pemisah karakter, serta pemulihan berkas JSON dengan umpan balik status eksekusi yang transparan.",
        "en": "Flexible Multi-Format Data Import & Restoration: The import module now supports restoring SQL script files, mapping CSV data files directly to target tables with custom delimiter options, and restoring JSON data with transparent execution status feedback."
      },
      {
        "type": "new",
        "id": "Pusat Operasi & Pemeliharaan Database dan Tabel: Tersedia panel operasi terpadu untuk mengubah set karakter (collation), menyalin atau mengubah nama database dan tabel, mengatur nomor urut otomatis, serta menjalankan fungsi pemeliharaan tabel (Optimalkan, Periksa Integritas, Analisis, Perbaiki, dan Ceklis Verifikasi).",
        "en": "Database & Table Operations and Maintenance Center: A unified operations hub to modify collations, copy or rename databases and tables, configure AUTO_INCREMENT counters, and perform table maintenance operations (Optimize, Check Integrity, Analyze, Repair, and Checksum Verification)."
      },
      {
        "type": "new",
        "id": "Pencarian Data Mendalam Lintas Tabel: Modul pencarian komprehensif yang memungkinkan penelusuran kata kunci di seluruh tabel basis data sekaligus (pencarian kemiripan kata, pencocokan persis, maupun ekspresi reguler) dengan indikator kecocokan instan dan tombol pintas penjelajahan hasil.",
        "en": "Cross-Table Deep Data Search: A comprehensive search module enabling keyword search across all database tables simultaneously (fuzzy matching, exact matching, or regular expressions) with instant match indicators and direct exploration shortcuts."
      },
      {
        "type": "new",
        "id": "Pengelolaan Prosedur, Fungsi, dan Pemicu Otomatis: Pengguna kini dapat menginspeksi definisi skrip logika tersimpan, memanggil dan mengeksekusi prosedur tersimpan, serta memantau dan mengelola pemicu otomatis langsung dari antarmuka visual.",
        "en": "Stored Procedures, Functions, and Triggers Management: Users can now inspect stored routine definitions, execute procedure calls, and monitor or manage automated triggers directly from the visual interface."
      },
      {
        "type": "improvement",
        "id": "Tabel Data Interaktif dengan Pengurutan & Penyaringan Cepat: Tampilan data tabel kini dilengkapi pengurutan kolom naik/turun, penyaringan cepat baris data, penyalinan baris ke format JSON, ekspor tampilan ke papan klip, serta penghapusan baris data individual secara aman.",
        "en": "Interactive Data Grid with Fast Sorting & Filtering: The tabular data view now features ascending/descending column sorting, quick row filtering, copy row as JSON, clipboard export of displayed data, and secure single-row deletion."
      },
      {
        "type": "new",
        "id": "Paket Distribusi Installer Siap Pasang: Penyediaan skrip otomatisasi di direktori build-app untuk menghasilkan installer siap pasang pada sistem operasi Linux (.deb), macOS (.dmg/.zip untuk Apple Silicon dan Intel), serta Windows (.exe/.zip).",
        "en": "Ready-to-Install Distribution Packages: Automation scripts in the build-app directory to generate install-ready packages for Linux (.deb), macOS (.dmg/.zip for Apple Silicon and Intel), and Windows (.exe/.zip)."
      },
      {
        "type": "new",
        "id": "Dukungan Multi-Platform Penuh (Mac Apple Chip, Windows, dan Linux): Paket aplikasi kini siap dikompilasi dan dijalankan secara native di Mac berbasis Apple Silicon (M1/M2/M3/M4) maupun Intel, sistem operasi Windows, dan berbagai distribusi Linux.",
        "en": "Comprehensive Multi-Platform Support (Apple Silicon Mac, Windows, and Linux): Application packages are now fully prepared to compile and run natively on Apple Silicon (M1/M2/M3/M4) and Intel Macs, Windows operating systems, and various Linux distributions."
      },
      {
        "type": "new",
        "id": "Navigasi & Penyaring Terowongan Server Interaktif: Bilah navigasi samping dan tombol penyaring cepat kini dapat diklik langsung untuk memilah daftar sambungan terowongan jarak jauh, dilengkapi tombol pintas '+ SSH Tunnel' untuk pembuatan koneksi instan.",
        "en": "Interactive Server Tunnel Navigation & Filters: Sidebar navigation and quick filter buttons are now fully interactive to organize remote tunnel connections, complete with a '+ SSH Tunnel' quick action for instant connection setup."
      },
      {
        "type": "new",
        "id": "Pintasan Salin Perintah Terminal: Panel konfigurasi terowongan kini menyediakan tombol satu-klik untuk menyalin perintah terminal mandiri secara otomatis sesuai konfigurasi server dan port yang ditentukan.",
        "en": "Terminal Command Copy Shortcut: The tunnel configuration panel now provides a one-click button to automatically copy the standalone terminal command tailored to the configured server and port."
      },
      {
        "type": "improvement",
        "id": "Standarisasi Mode Gelap Obsidian & Transisi Halus: Antarmuka aplikasi kini mengusung tema gelap terpadu dengan kontras tinggi yang nyaman di mata, eliminasi kilatan layar saat aplikasi dibuka, serta adaptasi warna tombol aksi dan editor perintah yang selaras secara otomatis baik pada mode gelap maupun mode terang.",
        "en": "Obsidian Dark Mode Standardization & Smooth Transitions: The application interface now features a unified, high-contrast dark theme that is gentle on the eyes, eliminates startup screen flash, and automatically adapts action button and query editor colors across both dark and light modes."
      },
      {
        "type": "improvement",
        "id": "Selektor Metode Sambungan & Autentikasi yang Lebih Jelas: Pemilihan metode sambungan (Langsung vs Terowongan) dan jenis autentikasi (Kata Sandi vs Berkas Kunci Akses) kini hadir dalam bentuk tombol pilihan segmen yang kontras dan mudah dipahami.",
        "en": "Clearer Connection Method & Authentication Selector: Connection method selection (Direct vs Tunnel) and authentication types (Password vs Access Key File) are now presented as high-contrast, intuitive segmented buttons."
      },
      {
        "type": "fix",
        "id": "Penyempurnaan Keterbacaan Kolom Masukan: Bidang isian teks pada formulir kini memiliki ruang vertikal yang lebih proporsional sehingga karakter garis bawah (_) dan huruf berekor dapat terlihat utuh tanpa terpotong batas bawah.",
        "en": "Input Field Readability Refinement: Form text fields now provide enhanced vertical spacing so underscores (_) and descender letters display completely without lower edge clipping."
      },
      {
        "type": "improvement",
        "id": "Penyelarasan Tema Aksen Teal & Eliminasi Istilah Teknis: Tampilan visual seluruh aplikasi desktop kini distandarisasikan dengan warna aksen Teal yang modern dan elegan, serta pembersihan menyeluruh istilah internal pengembang pada jendela sinkronisasi cloud menjadi terminologi layanan yang ramah pengguna.",
        "en": "Teal Accent Theme Alignment & Technical Jargon Elimination: The desktop application visual aesthetic is now standardized with a sleek, modern Teal accent color, alongside a comprehensive cleanup of developer internal jargon across the cloud synchronization modal into citizen-friendly service terminology."
      },
      {
        "type": "new",
        "id": "Standarisasi Konfigurasi Terowongan Server VPS: Penyediaan preset nama pengguna standar VPS (root, ubuntu, debian, ec2-user), pilihan cepat path berkas kunci akses privat (id_ed25519, id_rsa, id_ecdsa), dukungan kunci privat terenkripsi dengan proteksi frasa sandi (passphrase), serta otomasi ping penjaga kestabilan (auto keep-alive) setiap 15 detik agar koneksi basis data tidak terputus saat hening.",
        "en": "VPS Server Tunnel Configuration Standardization: Provision of standard VPS username presets (root, ubuntu, debian, ec2-user), quick selectors for private access key paths (id_ed25519, id_rsa, id_ecdsa), encrypted private key support with passphrase protection, and automated 15-second keep-alive pings preventing idle database connection drops."
      },
      {
        "type": "new",
        "id": "Sinkronisasi Otomatis Aksi Pengguna & Opsi Sinkron Manual: Setiap aktivitas pengguna pada paket non-free (Pro, Team, Business) kini otomatis disinkronkan secara langsung dan berkala ke server cloud tanpa jeda, dilengkapi sakelar kendali di menu pengaturan serta tombol sinkronisasi manual instan pada bilah navigasi utama dan tab jurnal aktivitas.",
        "en": "Automated User Action Cloud Synchronization & Manual Sync Options: Every user activity on paid plans (Pro, Team, Business) is now automatically synchronized to the cloud server in real-time, complete with a preference toggle in settings alongside instant one-click manual synchronization buttons on the main navigation bar and activity journal tab."
      }
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-10-24",
    "type": "feature",
    "status": "published",
    "title": {
      "id": "Peluncuran Antarmuka Desktop Modern & Ruang Kerja Data Terpadu",
      "en": "Launch of Modern Desktop Interface & Unified Data Workspace"
    },
    "body": {
      "id": "Aplikasi kini hadir dengan antarmuka desktop modern berkanvas gelap yang responsif saat mode jendela maupun layar penuh, pemisahan halaman navigasi terisolasi, dialog konfirmasi perlindungan data visual untuk aksi sensitif, opsi penghapusan sambungan host langsung, diagnostik kesehatan sambungan otomatis, bilah navigasi lengkap fitur inti phpMyAdmin (Databases, SQL, Status, Users, Export, Import, Variables, Charsets, Engines, Plugins), serta pengelolaan data langsung yang aman.",
      "en": "The application now features a modern dark-canvas desktop interface responsive in both windowed and fullscreen modes, isolated workspace navigation routing, visual data protection confirmation dialogs for sensitive actions, direct host connection deletion, automated connection health diagnostics, complete phpMyAdmin core navigation tabs (Databases, SQL, Status, Users, Export, Import, Variables, Charsets, Engines, Plugins), and integrated secure data management."
    },
    "items": [
      {
        "type": "new",
        "id": "Navigasi Lengkap Fitur Inti phpMyAdmin: Ruang kerja kini menghadirkan seluruh bilah tab sistem inti phpMyAdmin meliputi manajemen basis data, eksekusi perintah, pemantauan status & proses server, manajemen akun pengguna, ekspor, impor, penjelajah variabel sistem, set karakter, mesin penyimpanan, dan plugin server.",
        "en": "Complete phpMyAdmin Core Navigation: The workspace now delivers all phpMyAdmin core system tabs including database management, query execution, server status & process monitoring, user accounts management, export, import, system variables explorer, charsets, storage engines, and server plugins."
      },
      {
        "type": "new",
        "id": "Fitur Ekspor & Impor Basis Data Lengkap: Pengguna kini dapat mencadangkan seluruh skema dan data tabel ke dalam berkas cadangan dokumen, serta memulihkan data kembali secara langsung lewat pemilihan berkas maupun penempelan skrip.",
        "en": "Comprehensive Database Export & Import Feature: Users can now back up entire schemas and table data into backup document files, and restore data directly via file selection or script pasting."
      },
      {
        "type": "new",
        "id": "Antarmuka Pengelola Sambungan Modern: Tata letak bertingkat ramah mata dengan bilah pencarian cerdas dan navigasi multi-tab untuk mengelola banyak server sekaligus.",
        "en": "Modern Connection Manager Interface: Eye-friendly layered layout with smart search bar and multi-tab navigation to manage multiple servers simultaneously."
      },
      {
        "type": "new",
        "id": "Pemeriksaan Sambungan Mandiri: Sistem diagnostik bertahap yang memverifikasi kesiapan jaringan, enkripsi pengamanan, dan autentikasi secara visual.",
        "en": "Automated Connection Diagnostics: Multi-stage diagnostic system that visually verifies network readiness, security encryption, and authentication."
      },
      {
        "type": "new",
        "id": "Ruang Kerja Data & Eksekusi Perintah: Penjelajah tabel data interaktif dengan tampilan rapi, laporan status eksekusi cepat, dan fitur ekspor dokumen.",
        "en": "Data Workspace & Query Execution: Interactive table explorer with clean data views, quick execution status reports, and document export capabilities."
      },
      {
        "type": "new",
        "id": "Pengelolaan Kredensial Aman: Perlindungan sandi akses dengan sistem penyimpanan terenkripsi serta kemudahan untuk memperbarui atau menghapus sandi tersimpan.",
        "en": "Secure Credential Management: Access password protection with encrypted storage system and seamless options to update or remove saved passwords."
      },
      {
        "type": "improvement",
        "id": "Responsivitas Penuh Mode Jendela & Layar Penuh: Antarmuka aplikasi kini beradaptasi secara dinamis saat berada dalam mode jendela kecil maupun layar penuh, dilengkapi panel rincian yang dapat disembunyikan, bilah penjelajah yang fleksibel, dan editor perintah yang dapat diciutkan demi memaksimalkan ruang kerja data.",
        "en": "Full Windowed & Fullscreen Responsiveness: Application interface now dynamically adapts whether in small windowed mode or maximized fullscreen, featuring collapsible detail panels, flexible explorer sidebar, and collapsible query editor to maximize data workspace view."
      },
      {
        "type": "improvement",
        "id": "Penyederhanaan Konfigurasi Sambungan: Formulir konfigurasi awal kini tidak lagi mewajibkan pengisian basis data awal, memudahkan pengguna menyambungkan server cukup dengan alamat host, port, nama akun, dan kata sandi.",
        "en": "Simplified Connection Setup: Initial configuration form no longer requires upfront database specification, allowing users to connect to the server with just host address, port, username, and password."
      },
      {
        "type": "improvement",
        "id": "Penjelajah Daftar Basis Data Lengkap & Pencarian Cepat: Panel samping ruang kerja menampilkan daftar seluruh basis data aktif secara transparan dan menyeluruh, dilengkapi penyaring pencarian instan dan pembaruan daftar satu-klik.",
        "en": "Comprehensive Database Explorer & Quick Search: Workspace sidebar now displays the complete list of all active databases openly, featuring instant search filtering and one-click list refresh."
      },
      {
        "type": "improvement",
        "id": "Dukungan Tema Gelap Penuh & Pengalihan Cepat: Pilihan tema gelap terpadu sejak awal peluncuran dengan tombol pintas pengalihan tema di bilah navigasi dan pengaturan.",
        "en": "Full Dark Mode Support & Quick Switch: Unified dark theme from the initial launch with quick theme toggle shortcuts in the navigation bar and settings."
      },
      {
        "type": "improvement",
        "id": "Kemudahan Akses Kata Sandi: Kolom pengisian sandi database kini tampil langsung di samping nama pengguna dengan tombol intip dan ringkasan status keamanan.",
        "en": "Streamlined Password Access: Database password field is now directly displayed beside the username with peek visibility and security status overview."
      },
      {
        "type": "improvement",
        "id": "Interaktivitas & Fleksibilitas Impor SQL: Kotak pemilihan berkas impor kini dapat diklik di seluruh area, mendukung seret-dan-lepas (drag and drop), dilengkapi pemilih berkas ganda yang andal, pemilihan basis data target langsung, serta tombol eksekusi yang selalu responsif dan memberikan panduan saat berkas belum dipilih.",
        "en": "SQL Import Interactivity & Flexibility: The import file drop-zone is now fully clickable across the entire area, supports drag-and-drop, features dual reliable file pickers, direct target database selection, and an execution button that remains responsive with interactive guidance when no file is selected."
      },
      {
        "type": "improvement",
        "id": "Navigasi Struktur Tabel Satu-Klik & Operasi Lengkap: Mengklik baris atau nama basis data pada daftar kini secara otomatis menampilkan seluruh tabel di dalamnya melalui bilah Struktur ala phpMyAdmin, dilengkapi aksi jelajahi data, inspeksi kolom skema, sisipkan baris baru, hapus/kosongkan tabel, aksi massal, serta bilah operasi basis data.",
        "en": "One-Click Table Structure Navigation & Comprehensive Operations: Clicking any database row or name in the database list now automatically reveals all its tables in the phpMyAdmin-style Structure view, complete with data browsing, column schema inspection, new row insertion, empty/drop actions, bulk operations, and dedicated database operations tab."
      },
      {
        "type": "improvement",
        "id": "Pengalihan Tema Gelap dan Terang yang Mulus & Harmoni Tipografi Lengkap: Tombol pengubah tema kini beralih secara andal antara mode gelap dan mode terang dengan ikon interaktif (Bulan dan Matahari) serta label mode otomatis. Seluruh tipografi tabel, nama basis data, bilah navigasi, baris data saat disentuh kursor (hover), dan teks sekunder dioptimalkan dengan kontras tinggi yang tajam dan nyaman dibaca pada kedua mode.",
        "en": "Seamless Dark and Light Theme Switching & Complete Typography Harmony: The theme toggle button now reliably switches between dark and light modes with interactive icons (Moon and Sun) and automated mode labels. All table typography, database names, navigation tabs, data row hovers, and secondary text are fully optimized with sharp, high-contrast legibility across both themes."
      },
      {
        "type": "improvement",
        "id": "Standarisasi Penuh Desain & Tata Letak Berbasis Aturan shadcn/ui: Seluruh pondasi antarmuka, tata letak, dan komponen kini secara ketat mengikuti konvensi dan token semantik resmi shadcn/ui (bg-background, text-foreground, bg-card, bg-muted, border-border, bg-primary, variant built-in, serta size-* utilities) tanpa warna hex sembarangan atau override manual. Arsitektur ini memastikan transisi tema instan, harmonis, dan bersih dari aturan gaya rapuh.",
        "en": "Full shadcn/ui Design & Layout Standardization: All interface foundations, layouts, and components now strictly adhere to official shadcn/ui conventions and semantic tokens (bg-background, text-foreground, bg-card, bg-muted, border-border, bg-primary, built-in variants, and size-* utilities) eliminating arbitrary hex colors and fragile manual overrides for clean, robust theme transitions."
      },
      {
        "type": "improvement",
        "id": "Dukungan Lengkap Kredensial SSH Tunnel (User & Password): Formulir konfigurasi metode SSH Tunnel kini dilengkapi kolom masukan Nama Pengguna SSH (User SSH) dan Kata Sandi SSH (Password User SSH) dengan tombol intip/sembunyikan (peek visibility) serta dukungan kunci privat SSH opsional untuk fleksibilitas autentikasi ke server bastion.",
        "en": "Comprehensive SSH Tunnel Credentials Support (User & Password): The SSH Tunnel configuration form now features dedicated inputs for SSH Username and SSH Password with interactive peek visibility toggles, alongside optional SSH private key support for flexible bastion server authentication."
      },
      {
        "type": "new",
        "id": "Dialog Konfirmasi Perlindungan Data Visual: Sistem kini menyajikan dialog peringatan konfirmasi terpadu sebelum melakukan tindakan sensitif dan destruktif seperti pengosongan tabel, penghapusan tabel tunggal maupun massal, serta penghapusan basis data untuk mencegah kehilangan data penting secara tidak sengaja.",
        "en": "Visual Data Protection Confirmation Dialog: The system now presents a unified visual confirmation warning dialog prior to sensitive and destructive operations such as table truncating, single or bulk table deletions, and database dropping to safeguard against accidental data loss."
      },
      {
        "type": "new",
        "id": "Penghapusan Sambungan Host Langsung: Pengguna kini dapat langsung menghapus profil sambungan server dari kartu daftar host di halaman utama, dilengkapi konfirmasi perlindungan interaktif serta pembersihan otomatis sandi tersimpan dan tab sesi aktif.",
        "en": "Direct Host Connection Deletion: Users can now directly delete server connection profiles from host cards on the main dashboard, complete with protective confirmation and automated cleanup of stored passwords and active session tabs."
      },
      {
        "type": "improvement",
        "id": "Pemisahan Halaman Pusat Koneksi & Ruang Kerja Data: Alur antarmuka kini memisahkan pusat pengelola sambungan server dan studio kerja basis data ke dalam halaman mandiri, memberikan kecepatan akses yang lebih responsif serta stabilitas navigasi multi-sesi.",
        "en": "Dedicated Connection Hub & Data Workspace Routing: Interface workflow now separates the server connection hub and data workspace studio into dedicated, isolated views, providing faster responsiveness and seamless multi-session navigation stability."
      }
    ]
  }
];

export const LATEST_RELEASE = RELEASES_DATA[0];
