ALTINA PATCH: Remove unsafe analytics ".length" assignments

Symptom
Global client error:
  Cannot assign to read only property 'length' of function 'function(){(r.callMethod?r.callMethod:r.queue.push).apply(r,arguments)}'
This is the Facebook Pixel function (fbq). Its "length" property is read-only in strict mode, so any code like:
  fbq.length = 0
throws a runtime error and crashes the page.

What this script does
1) Scans your source for "fbq.length =" and "gtag.length =" assignments and prints matches.
2) Backs up all src files into __backup_length_assignments__.
3) Removes these assignments safely (replaces them with comments). Your analytics still work; length must not be mutated.

How to use (Windows PowerShell)
1) Copy this file to your repo root (same folder as package.json).
2) Run:
   powershell -ExecutionPolicy Bypass -File .\apply-remove-analytics-length-assignment.ps1
3) Review the printed matches, commit, and redeploy.

If still failing
- The offending code may be in a script tag (e.g., public JS snippet) or a library. Share the first line from the browser console stack and I’ll pinpoint the exact file.
