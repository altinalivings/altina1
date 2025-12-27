@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ==== CONFIG ====
set "ICON_DIR=public\icons"
set "OUT_MANIFEST=public\icons\icons.manifest.json"
set "OUT_TS=src\data\amenityIcons.generated.ts"

if not exist "%ICON_DIR%" (
  echo [ERROR] Folder not found: %ICON_DIR%
  exit /b 1
)

REM Ensure output dirs exist
for %%D in ("public\icons" "src\data") do (
  if not exist "%%~D" mkdir "%%~D"
)

REM Start JSON manifest
> "%OUT_MANIFEST%" echo {
>>"%OUT_MANIFEST%" echo   "generatedAt": "%date% %time%",
>>"%OUT_MANIFEST%" echo   "dir": "%ICON_DIR%",
>>"%OUT_MANIFEST%" echo   "files": [

REM Start TS file
> "%OUT_TS%" echo // Auto-generated. Do not edit manually.
>>"%OUT_TS%" echo // Run: tools\generate_icons.bat
>>"%OUT_TS%" echo
>>"%OUT_TS%" echo export const AMENITY_ICONS: Record^<string, string^> = {

set "firstJson=1"

REM Function-like loop for each extension
for %%E in (png jpg jpeg webp svg) do (
  for %%F in ("%ICON_DIR%\*.%%E") do (
    if exist "%%~fF" (
      set "file=%%~nxF"
      set "base=%%~nF"

      REM Normalize key: lower, spaces->_, remove common separators
      set "key=!base!"
      set "key=!key: =_!"
      set "key=!key:-=_!"
      set "key=!key:.=_!"
      set "key=!key=!!"
      for %%Z in (!key!) do set "key=%%Z"
      set "key=!key!"
      call :toLower key

      REM JSON add
      if "!firstJson!"=="1" (
        set "firstJson=0"
      ) else (
        >>"%OUT_MANIFEST%" echo     ,
      )
      >>"%OUT_MANIFEST%" echo     "!file!"

      REM TS add
      >>"%OUT_TS%" echo   "!key!": "/icons/!file!",
    )
  )
)

REM Close JSON
>>"%OUT_MANIFEST%" echo
>>"%OUT_MANIFEST%" echo   ]
>>"%OUT_MANIFEST%" echo }

REM Close TS
>>"%OUT_TS%" echo };
>>"%OUT_TS%" echo
>>"%OUT_TS%" echo export default AMENITY_ICONS;

echo Done.
echo Manifest: %OUT_MANIFEST%
echo TS Map  : %OUT_TS%
exit /b 0


:toLower
REM Usage: call :toLower varName
set "s=!%~1!"
for %%A in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
  set "s=!s:%%A=%%a!"
)
set "%~1=!s!"
exit /b 0
