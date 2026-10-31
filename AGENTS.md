# Panduan & Konvensi AI Agent — xphpMyAdmin Desktop

> **PERINGATAN WAJIB DIPATUHI (MANDATORY POLICY)**:  
> Seluruh AI Agent yang bekerja pada repositori `app-desktop` **WAJIB MEMATUHI DAN MENGEKSEKUSI** seluruh aturan arsitektur, standar estetika desain, prosedur pencatatan rilis, dan pelaporan kegiatan yang tertera pada berkas ini, [`DESIGN.md`](file:///DESIGN.md), serta direktori [`.agents/skills/`](file:///.agents/skills/).  
> Pelanggaran terhadap standar desain, kelalaian pelaporan kegiatan ke portfolio pada perubahan yang dirasakan pengguna, maupun pelanggaran invarian teknis dilarang keras.

---

## 1. Kepatuhan Skill Wajib (.agents/skills/)

Seluruh AI Agent **WAJIB MENGEKSEKUSI** panduan dari 3 skill inti berikut saat menjalankan tugas:

### 1. `raycast-design` ([`.agents/skills/raycast-design/SKILL.md`](file:///.agents/skills/raycast-design/SKILL.md) & [`DESIGN.md`](file:///DESIGN.md))
- **Kewajiban**: Standar estetika visual desktop developer tools dari [VoltAgent awesome-design-md (Raycast)](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/raycast).
- **Implementasi**: Canvas ultra-dark obsidian (`#07080a` / `#0a0d18`), permukaan bertingkat (`#0d0d0d` → `#101111` → `#121212`), hairline 1px borders (`#242728`), keycap `<kbd>` shortcuts, command-palette omni-search, dan tombol aksi utama kontras tinggi (`bg-white text-black`).
- **Aturan Eksekusi**: Setiap penambahan atau modifikasi komponen antarmuka harus mematuhi palet dan checklist pada skill ini.

### 2. `shadcn-ui` ([`.agents/skills/shadcn-ui/SKILL.md`](file:///.agents/skills/shadcn-ui/SKILL.md))
- **Kewajiban**: Standar arsitektur komponen UI, pustaka 62+ komponen di `@/components/ui/`, integrasi Tailwind CSS v4 + Radix UI, serta penggabungan class menggunakan utilitas `cn()` (`@/utils/tailwind`).
- **Aturan Eksekusi**: Dilarang membuat tombol atau modal unstyled mentah jika komponen resmi shadcn sudah tersedia di `src/components/ui/`.

### 3. `activity-sync` & `release-notes` ([`.agents/skills/activity-sync/SKILL.md`](file:///.agents/skills/activity-sync/SKILL.md))
- **Kewajiban**: Setiap selesai mengerjakan perubahan yang **dirasakan pengguna** (fitur baru, perbaikan bug, perubahan perilaku, rilis, deploy, hapus fitur), AI **WAJIB** mencatat di berkas rilis lalu mengirim satu entri kegiatan ke portfolio (`https://ajoroby.is-a.dev/api/activities`) sebelum menyelesaikan tugas. Refactor internal, format, komentar, dan tes yang tak terlihat pengguna: jangan kirim.
- **Aturan Eksekusi**:
  1. Tulis/perbarui berkas rilis `releases/YYYY-MM-DD-*.json` memakai skill `release-notes` ([`.agents/skills/activity-sync/release-notes/SKILL.md`](file:///.agents/skills/activity-sync/release-notes/SKILL.md)): konsolidasi 1 berkas JSON per hari, dwibahasa (`id` + `en`), bahasa pelayanan publik — bebas istilah teknis/library/framework/celah internal.
  2. Muat skill `activity-sync` dan ikuti alur CRUD di sana: cek proyek (`GET /api/projects?key=`), kirim isi berkas rilis `releases/*.json` apa adanya lewat `POST` (tambah `"project": {"name": "xphpMyAdmin — Pengelola Koneksi Database Remote"}`; API yang memetakan `type`/`date`/`items` otomatis), ubah (`PATCH`), hapus (`DELETE`), lalu verifikasi (`GET` + cek tidak dobel).
  3. Kunci `X-project` proyek ini: dibaca dari berkas `.ACTIVITY_PROJECT_KEYS` di `.agents/skills/activity-sync/.ACTIVITY_PROJECT_KEYS` — JANGAN commit berkas kunci ke git, JANGAN tampilkan ke user kecuali diminta.
  4. Setiap kiriman wajib dwibahasa (`id` + `en`), maksimal 300 karakter judul / 2000 karakter isi, bahasa pelayanan publik (dilarang menyebut library, framework, database, file kode, atau mekanisme internal).
  5. Laporkan ke user: apa yang dikirim (id baris), hasil verifikasi, dan apa pun yang gagal.

---

## 2. Invarian Arsitektur & Aturan Teknis Desktop

1. **Runtime & Modul Native**:
   - Runtime desktop adalah **Electron 44 / Node.js 22**.
   - Driver database menggunakan `mysql2/promise` murni (pure JavaScript) untuk menjamin kompatibilitas cross-platform tanpa memerlukan kompilasi native C++ (`node-gyp`).
   - SSH Tunneling menggunakan pustaka `ssh2` murni.
   - Manajemen paket menggunakan **Yarn** (`yarn.lock`).
2. **Kriptografi & Password Lifecycle**:
   - Master Key disimpan secara aman pada OS Keychain / DPAPI (`keytar` / `safeStorage`).
   - Kredensial database dienkripsi menggunakan AES-256-GCM.
   - Siklus password profil koneksi: opsi `keep` (pertahankan rahasia terenkripsi), `replace` (input password baru), dan `remove` (hapus password dari vault).
3. **Validasi & Integritas Data**:
   - Seluruh payload profil, konfigurasi SSH, dan pengaturan SSL/TLS wajib divalidasi menggunakan skema **Zod** (`src/types/connection.ts`) sebelum disimpan ke SQLite lokal.
4. **Isolasi Tab & Diagnostik Visual**:
   - Setiap tab koneksi database memiliki worker pool dan sesi tunnel terisolasi.
   - Diagnostik koneksi dijalankan dalam 4 tahap sekuensial yang terpantau secara visual:
     1. `socket`: TCP Socket Connection
     2. `handshake`: Protocol Handshake
     3. `auth`: Authentication & Permission Check
     4. `schema`: Metadata & Information Schema Discovery

---

## 3. Checklist Pre-Commit untuk AI Agent

Sebelum menyelesaikan tugas atau menjawab pengguna, AI Agent **WAJIB MEMASTIKAN**:
- [x] Antarmuka mematuhi **Raycast Design System** (hairline borders 1px, continuous dark canvas, high-contrast primary CTA).
- [x] Komponen UI memanfaatkan pustaka `@/components/ui/*` melalui `cn()` .
- [x] Validasi data dilakukan dengan skema Zod.
- [x] Tidak ada konflik atau warning dependency pada Yarn (`yarn.lock`).
- [x] Seluruh unit test (`yarn test`) lolos dengan status 100% hijau.
- [x] **Activity Sync**: Jika terdapat perubahan yang dirasakan pengguna, buat/perbarui berkas rilis harian di `releases/` dan kirimkan entri kegiatan ke portfolio via API.

---

## 4. Activity Sync — lapor kegiatan ke portfolio

Setiap selesai mengerjakan perubahan yang **dirasakan pengguna** (fitur baru,
perbaikan bug, perubahan perilaku, rilis, deploy, hapus fitur), AI WAJIB
mencatat di berkas rilis lalu mengirim satu entri kegiatan ke portfolio
sebelum menyelesaikan tugas. Refactor internal, format, komentar, dan tes yang
tak terlihat pengguna: jangan kirim.

1. Tulis/perbarui berkas rilis `releases/YYYY-MM-DD-*.json` memakai skill
   `release-notes` (folder `release-notes/` dalam paket activity-sync):
   konsolidasi 1 berkas JSON per hari, dwibahasa (id + en), bahasa pelayanan
   publik — bebas istilah teknis/library/framework.
2. Muat skill `activity-sync` (`.agents/skills/activity-sync/SKILL.md`) dan
   ikuti alur CRUD di sana: cek proyek (`GET /api/projects?key=`), kirim
   isi berkas rilis `releases/*.json` apa adanya lewat `POST` (tambah
   `"project": {"name": "xphpMyAdmin — Pengelola Koneksi Database Remote"}`; API yang memetakan `type`/`date`/`items`
   otomatis), ubah (`PATCH`), hapus (`DELETE`), lalu verifikasi (`GET` +
   cek tidak dobel).
3. Kunci `X-project` proyek ini: baca dari berkas `.ACTIVITY_PROJECT_KEYS`
   di folder skill ini (contoh format lihat `.ACTIVITY_PROJECT_KEYS.example`;
   salin jadi `.ACTIVITY_PROJECT_KEYS` lalu isi kunci app ini) — JANGAN commit
   berkas kunci ke git, JANGAN tampilkan ke user kecuali diminta.
4. Setiap kiriman wajib dwibahasa (`id` + `en`), maksimal 300 karakter judul /
   2000 karakter isi, bahasa pelayanan publik (dilarang menyebut library,
   framework, database, file kode, atau mekanisme internal).
5. Untuk rilis lama yang belum terkirim: ikuti `backfill.md` (sekali saja).
6. Laporkan ke user: apa yang dikirim (id baris), hasil verifikasi, dan apa
   pun yang gagal.

Aturan tambahan untuk AI (`AGENTS.md` ini):

- Kunci di `.ACTIVITY_PROJECT_KEYS` adalah sumber kebenaran app ini (contoh
  format: `.ACTIVITY_PROJECT_KEYS.example`; kunci bersama portfolio ada di
  baris contoh itu). Bila respons API `401` (tanpa header) atau `403`
  (kunci salah), berhenti dan minta kunci baru ke pemilik — jangan menebak.
- `source` otomatis dari `date` + slug judul berkas rilis; bila mengirim
  bentuk kanonik, `source` HARUS stabil per rilis agar revisi menimpa baris
  yang sama.

---

# Examples

Real-world code examples demonstrating the four principles. Each example shows what LLMs commonly do wrong and how to fix it.

---

## 1. Think Before Coding

### Example 1: Hidden Assumptions

**User Request:** "Add a feature to export user data"

**❌ What LLMs Do (Wrong Assumptions)**

```python
def export_users(format='json'):
    """Export all users to a file."""
    users = User.query.all()
    
    if format == 'json':
        with open('users.json', 'w') as f:
            json.dump([u.to_dict() for u in users], f)
    elif format == 'csv':
        with open('users.csv', 'w') as f:
            writer = csv.DictWriter(f, fieldnames=['id', 'email', 'name'])
            writer.writeheader()
            writer.writerows([u.to_dict() for u in users])
    
    return f"Exported {len(users)} users"
```

**Problems:**
- Assumed it should export ALL users (what about pagination? privacy?)
- Assumed file location without asking
- Assumed which fields to include
- Assumed CSV fieldnames without checking actual data structure

**✅ What Should Happen (Surface Assumptions)**

```
Before implementing, I need to clarify:

1. **Scope**: Export all users or filtered subset? (privacy implications)
2. **Format**: You mentioned "export" - did you mean:
   - Download file in browser?
   - Background job with email notification?
   - API endpoint returning data?
3. **Fields**: Which user fields? (some might be sensitive)
4. **Volume**: How many users typically? (affects approach)

Simplest approach: Add an API endpoint that returns paginated JSON.
Would need more info for file-based exports.

What's your preference?
```

### Example 2: Multiple Interpretations

**User Request:** "Make the search faster"

**❌ What LLMs Do (Pick Silently)**

```python
# Adds caching, database indexes, and async processing
# without asking which "faster" matters
@lru_cache(maxsize=1000)
async def search(query: str) -> List[Result]:
    # ... 200 lines of optimization code
```

**✅ What Should Happen**

```
"Make the search faster" could mean:

1. **Faster response time** (< 100ms instead of 500ms)
   - Add database indexes
   - Cache frequent queries
   - Estimated effort: 2 hours

2. **Handle more concurrent searches** (throughput)
   - Add async/await
   - Connection pooling
   - Estimated effort: 4 hours

3. **Faster perceived speed** (UX)
   - Show partial results immediately
   - Progressive loading
   - Estimated effort: 3 hours

Current search takes ~500ms for typical queries. 
Which aspect matters most for your use case?
```

---

## 2. Simplicity First

### Example 1: Over-abstraction

**User Request:** "Add a function to calculate discount"

**❌ What LLMs Do (Overengineered)**

```python
from abc import ABC, abstractmethod
from enum import Enum
from typing import Protocol, Union
from dataclasses import dataclass

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount: float) -> float:
        pass

class PercentageDiscount(DiscountStrategy):
    def __init__(self, percentage: float):
        self.percentage = percentage
    
    def calculate(self, amount: float) -> float:
        return amount * (self.percentage / 100)

class FixedDiscount(DiscountStrategy):
    def __init__(self, fixed_amount: float):
        self.fixed_amount = fixed_amount
    
    def calculate(self, amount: float) -> float:
        return min(self.fixed_amount, amount)

@dataclass
class DiscountConfig:
    strategy: DiscountStrategy
    min_purchase: float = 0.0
    max_discount: float = float('inf')

class DiscountCalculator:
    def __init__(self, config: DiscountConfig):
        self.config = config
    
    def apply_discount(self, amount: float) -> float:
        if amount < self.config.min_purchase:
            return 0
        discount = self.config.strategy.calculate(amount)
        return min(discount, self.config.max_discount)

# Usage requires 30+ lines of setup for a simple calculation
```

**✅ What Should Happen (Simple)**

```python
def calculate_discount(amount: float, percent: float) -> float:
    """Calculate discount amount. percent should be 0-100."""
    return amount * (percent / 100)

# Usage
discount = calculate_discount(100.0, 10.0)  # $10 off
```

**When to add complexity:** Only when you actually need multiple discount types. If that requirement comes later, refactor then.

### Example 2: Speculative Features

**User Request:** "Save user preferences to database"

**❌ What LLMs Do (Unnecessary Features)**

```python
class PreferenceManager:
    def __init__(self, db, cache=None, validator=None):
        self.db = db
        self.cache = cache or InMemoryCache()
        self.validator = validator or DefaultValidator()
    
    def save(self, user_id: int, prefs: dict, 
             merge: bool = True, 
             validate: bool = True,
             notify: bool = False) -> bool:
        """Save preferences with optional merging, validation, and notifications."""
        
        if validate:
            errors = self.validator.validate(prefs)
            if errors:
                raise ValidationError(errors)
        
        existing = self.get(user_id) if merge else {}
        
        if merge:
            existing.update(prefs)
            prefs = existing
        
        self.db.execute(
            "UPDATE users SET preferences = ? WHERE id = ?",
            (json.dumps(prefs), user_id)
        )
        
        if self.cache:
            self.cache.set(f"prefs:{user_id}", prefs)
        
        if notify:
            self.notify_preference_change(user_id, prefs)
        
        return True
    
    def notify_preference_change(self, user_id: int, prefs: dict):
        # Another 30 lines for a feature nobody asked for
        pass
```

**✅ What Should Happen (Just What Was Asked)**

```python
def save_preferences(db, user_id: int, preferences: dict):
    """Save user preferences to database."""
    db.execute(
        "UPDATE users SET preferences = ? WHERE id = ?",
        (json.dumps(preferences), user_id)
    )
```

**Add later if needed:** Caching (when performance matters), validation (when bad data appears), merging (when requirement emerges).

---

## 3. Surgical Changes

### Example 1: Drive-by Refactoring

**User Request:** "Fix the bug where empty emails crash the validator"

**❌ What LLMs Do (Too Much)**

```diff
  def validate_user(user_data):
-     # Check email format
-     if not user_data.get('email'):
+     """Validate user data."""
+     email = user_data.get('email', '').strip()
+     
+     # Validate email
+     if not email:
          raise ValueError("Email required")
-     
-     # Basic email validation
-     if '@' not in user_data['email']:
+     if '@' not in email or '.' not in email.split('@')[1]:
          raise ValueError("Invalid email")
      
-     # Check username
-     if not user_data.get('username'):
+     # Validate username
+     username = user_data.get('username', '').strip()
+     if not username:
          raise ValueError("Username required")
+     if len(username) < 3:
+         raise ValueError("Username too short")
+     if not username.isalnum():
+         raise ValueError("Username must be alphanumeric")
      
      return True
```

**Problems:**
- "Improved" email validation beyond the bug fix
- Added username validation nobody asked for
- Changed comments
- Added docstring

**✅ What Should Happen (Surgical)**

```diff
  def validate_user(user_data):
      # Check email format
-     if not user_data.get('email'):
+     email = user_data.get('email', '')
+     if not email or not email.strip():
          raise ValueError("Email required")
      
      # Basic email validation
-     if '@' not in user_data['email']:
+     if '@' not in email:
          raise ValueError("Invalid email")
      
      # Check username
      if not user_data.get('username'):
          raise ValueError("Username required")
      
      return True
```

**Only changed:** The specific lines that fix empty email handling.

### Example 2: Style Drift

**User Request:** "Add logging to the upload function"

**❌ What LLMs Do (Reformat Everything)**

```diff
- def upload_file(file_path, destination):
+ def upload_file(file_path: str, destination: str) -> bool:
+     """Upload file to destination with logging."""
+     logger.info(f"Uploading {file_path} to {destination}")
+     
      try:
-         with open(file_path, 'rb') as f:
-             data = f.read()
-         
-         response = requests.post(destination, files={'file': data})
-         
-         if response.status_code == 200:
-             return True
-         else:
-             return False
+         with open(file_path, "rb") as f:
+             data = f.read()
+         response = requests.post(destination, files={"file": data})
+         success = response.status_code == 200
+         
+         if success:
+             logger.info(f"Upload successful: {file_path}")
+         else:
+             logger.error(f"Upload failed: {file_path}, status={response.status_code}")
+         
+         return success
      except Exception as e:
-         print(f"Error: {e}")
+         logger.exception(f"Upload error for {file_path}: {e}")
          return False
```

**Problems:**
- Changed quote style ('' to "")
- Added type hints nobody asked for
- Added docstring
- Reformatted whitespace
- Changed boolean return logic

**✅ What Should Happen (Match Existing Style)**

```diff
+ import logging
+ 
+ logger = logging.getLogger(__name__)
+ 
  def upload_file(file_path, destination):
+     logger.info(f'Starting upload: {file_path}')
      try:
          with open(file_path, 'rb') as f:
              data = f.read()
          
          response = requests.post(destination, files={'file': data})
          
          if response.status_code == 200:
+             logger.info(f'Upload successful: {file_path}')
              return True
          else:
+             logger.error(f'Upload failed: {file_path}, status={response.status_code}')
              return False
      except Exception as e:
-         print(f"Error: {e}")
+         logger.exception(f'Upload error: {file_path}')
          return False
```

**Matched:** Single quotes, no type hints, existing boolean pattern, spacing style.

---

## 4. Goal-Driven Execution

### Example 1: Vague vs. Verifiable

**User Request:** "Fix the authentication system"

**❌ What LLMs Do (Vague Approach)**

```
I'll fix the authentication system by:
1. Reviewing the code
2. Identifying issues
3. Making improvements
4. Testing the changes

[Proceeds to make changes without clear success criteria]
```

**✅ What Should Happen (Verifiable Goals)**

```
To "fix authentication," I need to define success criteria. 
What specific issue are we solving?

If the issue is "users stay logged in after password change":

Plan:
1. Write test: Change password → verify old session invalidated
   Verify: Test fails (reproduces bug)

2. Implement: Invalidate sessions on password change
   Verify: Test passes

3. Check edge cases: Multiple active sessions, concurrent changes
   Verify: Additional tests pass

4. Verify no regression: Existing auth tests still pass
   Verify: Full test suite green

Current test coverage for auth: [shows coverage]
What's the specific auth issue you're seeing?
```

### Example 2: Multi-Step with Verification

**User Request:** "Add rate limiting to the API"

**❌ What LLMs Do (All at Once)**

```python
# Implements full rate limiting with Redis, multiple strategies,
# configuration system, and monitoring in one 300-line commit
# No clear verification steps
```

**✅ What Should Happen (Incremental with Verification)**

```
Plan for rate limiting:

1. Add basic in-memory rate limiting (single endpoint)
   Verify: 
   - Test: 100 requests → first 10 succeed, rest get 429
   - Manual: curl endpoint 11 times, see rate limit error

2. Extract to middleware (apply to all endpoints)
   Verify:
   - Test: Rate limits apply to /users and /posts
   - Existing endpoint tests still pass

3. Add Redis backend (for multi-server)
   Verify:
   - Test: Rate limit persists across app restarts
   - Test: Two app instances share rate limit counter

4. Add configuration (rates per endpoint)
   Verify:
   - Test: /search allows 10/min, /users allows 100/min
   - Config file parsed correctly

Each step is independently verifiable and deployable.
Start with step 1?
```

### Example 3: Test-First Verification

**User Request:** "The sorting breaks when there are duplicate scores"

**❌ What LLMs Do (Fix Without Reproducing)**

```python
# Immediately changes sort logic without confirming the bug
def sort_scores(scores):
    return sorted(scores, key=lambda x: (-x['score'], x['name']))
```

**✅ What Should Happen (Reproduce First)**

```python
# 1. First, write a test that reproduces the issue
def test_sort_with_duplicate_scores():
    """Test sorting when multiple items have same score."""
    scores = [
        {'name': 'Alice', 'score': 100},
        {'name': 'Bob', 'score': 100},
        {'name': 'Charlie', 'score': 90},
    ]
    
    result = sort_scores(scores)
    
    # The bug: order is non-deterministic for duplicates
    # Run this test multiple times, it should be consistent
    assert result[0]['score'] == 100
    assert result[1]['score'] == 100
    assert result[2]['score'] == 90

# Verify: Run test 10 times → fails with inconsistent ordering

# 2. Now fix with stable sort
def sort_scores(scores):
    """Sort by score descending, then name ascending for ties."""
    return sorted(scores, key=lambda x: (-x['score'], x['name']))

# Verify: Test passes consistently
```

---

## Anti-Patterns Summary

| Principle | Anti-Pattern | Fix |
|-----------|-------------|-----|
| Think Before Coding | Silently assumes file format, fields, scope | List assumptions explicitly, ask for clarification |
| Simplicity First | Strategy pattern for single discount calculation | One function until complexity is actually needed |
| Surgical Changes | Reformats quotes, adds type hints while fixing bug | Only change lines that fix the reported issue |
| Goal-Driven | "I'll review and improve the code" | "Write test for bug X → make it pass → verify no regressions" |

## Key Insight

The "overcomplicated" examples aren't obviously wrong—they follow design patterns and best practices. The problem is **timing**: they add complexity before it's needed, which:

- Makes code harder to understand
- Introduces more bugs
- Takes longer to implement
- Harder to test

The "simple" versions are:
- Easier to understand
- Faster to implement
- Easier to test
- Can be refactored later when complexity is actually needed

**Good code is code that solves today's problem simply, not tomorrow's problem prematurely.**
