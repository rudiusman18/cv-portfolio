# CV dan Portofolio - Muhammad Fakhruddin Usman

Single page statis: HTML, CSS, dan Three.js (lanyard 3D). Tidak ada build step.

## Menjalankan lokal

```bash
python3 -m http.server 8000
```

Buka `http://localhost:8000`.

## Mengganti foto kartu

Taruh foto di `assets/profile.jpg` (rasio potret, minimal 600x800). Kartu otomatis memakai foto itu. Kalau file tidak ada, kartu menampilkan inisial MFU.

## Deploy ke GitHub Pages

```bash
git init
git add .
git commit -m "feat: cv dan portofolio"
git branch -M main
git remote add origin https://github.com/rudiusman18/cv-portfolio.git
git push -u origin main
```

Lalu di repo GitHub: Settings > Pages > Source: Deploy from a branch > Branch: `main` / root > Save. Situs aktif di `https://rudiusman18.github.io/cv-portfolio/`.

## Struktur

- `index.html` isi CV, proyek, dan kontak
- `style.css` tema dan layout
- `main.js` scene Three.js dan animasi reveal
- `assets/profile.jpg` foto kartu (opsional)
