Altina Livings — Tailwind Fix

1) Copy these files into your repo root (keep paths exact):
   - tailwind.config.js
   - postcss.config.js
   - src/styles/globals.css

2) Edit src/app/layout.js and at the very top add this import (one time only):
     import "../styles/globals.css";

   Example minimal layout.js structure:
     export const metadata = { title: "Altina Livings" };
     export default function RootLayout({ children }) {
       return (
         <html lang="en">
           <body>{children}</body>
         </html>
       );
     }

3) Ensure your package.json has these devDependencies (it already should in your project):
     "tailwindcss": "^3",
     "autoprefixer": "^10",
     "postcss": "^8"

4) Commit and push. Vercel will rebuild and styles will apply.

Optional: If you use the alias "@/":
   Make sure jsconfig.json exists at the repo root with:
     {
       "compilerOptions": {
         "baseUrl": ".",
         "paths": { "@/*": ["src/*"] }
       }
     }

That's it!
