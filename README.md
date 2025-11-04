Exam Portal Demo
================

What is included:
- index.html — main page. Student enters name and clicks 'Start Exam' to begin. Timer runs for exactly 2 hours from click.
- script.js — logic for start, countdown, rendering sample pages, blocking shortcuts.
- style.css — basic styles and print-hide CSS.
- page1.png, page2.png — sample exam pages (images).
- exam.pdf — a sample PDF created from the images (you can replace with your LaTeX-generated PDF).
- You can upload this folder to GitHub Pages. Students will open index.html and click 'Start Exam' to begin.

Important notes:
- This is a client-side (browser) deterrent, not a foolproof security solution. Determined users may still capture content.
- For stronger protection use server-side tokenized serving, remote proctoring, or exam browsers like Safe Exam Browser.

How to replace with your PDF:
- Option A (recommended for static hosting): replace page1.png/page2.png with images generated from your LaTeX PDF (one image per page) and keep filenames the same.
- Option B: replace exam.pdf with your PDF. The current demo displays images for robustness; to display PDF directly you'd need to integrate pdf.js (not included).

If you want, I can next:
- Add pdf.js support so the actual PDF is rendered in-browser (more featureful).
- Provide a small Node/Netlify function example to serve PDF only during the allowed window.
