@echo off
setlocal enabledelayedexpansion

REM Change to the folder containing your images
cd /d "C:\Users\dell\Documents\GitHub\altina1\altina_livings_simple_theme\altina_livings\public\projects\dlf-one-midtown"

set count=1

for %%f in ("WhatsApp Image*.jpeg") do (
    ren "%%f" "g!count!.jpg"
    set /a count+=1
)

echo Done! Renamed !count! files.
pause
