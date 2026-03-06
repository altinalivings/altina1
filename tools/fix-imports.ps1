# tools\fix-imports.ps1
# Purpose: Migrate from projects.json to projects.ts and fix named/default imports.

$ErrorActionPreference = "Stop"

# 1) Target file extensions
$files = Get-ChildItem -Recurse -Include *.ts,*.tsx | Where-Object {
  $_.FullName -notmatch "\\node_modules\\"
}

$changes = 0

foreach ($file in $files) {
  $content = Get-Content -Raw -LiteralPath $file.FullName

  $original = $content

  # --- A. Replace JSON path -> TS module path ---
  # from "@/data/projects.json"  ->  from "@/data/projects"
  $content = [regex]::Replace($content, "from\s+['""]@/data/projects\.json['""]", 'from "@/data/projects"')

  # --- B. Fix named import for `projects` -> default import ---
  # import { projects } from "@/data/projects" -> import projects from "@/data/projects"
  $content = [regex]::Replace($content,
    "import\s*\{\s*projects\s*\}\s*from\s*['""]@/data/projects['""];?",
    'import projects from "@/data/projects";'
  )

  # import { projects, Project } from "@/data/projects" -> import projects, { Project } from "@/data/projects"
  $content = [regex]::Replace($content,
    "import\s*\{\s*projects\s*,\s*Project\s*\}\s*from\s*['""]@/data/projects['""];?",
    'import projects, { Project } from "@/data/projects";'
  )

  # import { Project, projects } from "@/data/projects" -> import projects, { Project } from "@/data/projects"
  $content = [regex]::Replace($content,
    "import\s*\{\s*Project\s*,\s*projects\s*\}\s*from\s*['""]@/data/projects['""];?",
    'import projects, { Project } from "@/data/projects";'
  )

  # --- C. Keep aliases if used elsewhere (projectsData) ---
  # import projectsData from "@/data/projects.json" -> import projectsData from "@/data/projects"
  $content = [regex]::Replace($content,
    "import\s+([A-Za-z0-9_]+)\s+from\s+['""]@/data/projects\.json['""];?",
    'import $1 from "@/data/projects";'
  )

  # --- D. Do not touch lines that import only { Project } ---
  # (We intentionally leave `import { Project } from "@/data/projects";` as-is.)

  if ($content -ne $original) {
    Set-Content -LiteralPath $file.FullName -Value $content -NoNewline
    $changes++
    Write-Host "Updated: $($file.FullName)"
  }
}

Write-Host ""
Write-Host "✅ Done. Files updated: $changes"
Write-Host "Tip: run a quick search for any leftover 'projects.json' just in case."
