"""Pre-submission checks for every text deliverable.

Fails (exit 1) on:
  - em dashes, en dashes and other dash look-alikes (brand rule)
  - emoji (brand rule)
  - personal credit inside the deliverable (task failure criterion)
  - a citation that points to a source id missing from the source list
  - a source in the list that nothing cites
Also checks that the PDF text contains no banned characters.
Usage: python3 scripts/check.py
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_FILES = [
    ROOT / "docs" / "index.html",
    ROOT / "docs" / "pin.txt",
    ROOT / "docs" / "evidence.html",
    ROOT / "docs" / "style.css",
    ROOT / "README.md",
    *sorted((ROOT / "evidence").glob("*.md")),
    *sorted((ROOT / "evidence").glob("*.txt")),
    *sorted((ROOT / "scripts").glob("*")),
]
PDF = ROOT / "docs" / "KYC-and-Wallet-Activation-Explainer.pdf"

DASHES = re.compile("[" + "".join(chr(c) for c in (0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2015, 0x2212, 0xFE58, 0xFE63, 0xFF0D)) + "]")
EMOJI = re.compile("[" + chr(0x1F000) + "-" + chr(0x1FAFF) + chr(0x2600) + "-" + chr(0x27BF) + chr(0x2B00) + "-" + chr(0x2BFF) + chr(0xFE0F) + "]")
# Names or handles that must never appear inside the deliverable.
CREDIT = re.compile(r"darkseid|web3builder|made by|created by|written by|author:", re.I)

problems = []


def scan(name, text, credit=True):
    for i, line in enumerate(text.splitlines(), 1):
        if DASHES.search(line):
            problems.append(f"{name}:{i}: dash character: {line.strip()[:80]}")
        if EMOJI.search(line):
            problems.append(f"{name}:{i}: emoji: {line.strip()[:80]}")
        if credit and CREDIT.search(line):
            problems.append(f"{name}:{i}: personal credit: {line.strip()[:80]}")


for f in TEXT_FILES:
    if f.is_file():
        # This script names the banned words, so skip the credit check on itself.
        scan(f.relative_to(ROOT), f.read_text(encoding="utf-8"), credit=f.name != "check.py")

html = (ROOT / "docs" / "index.html").read_text(encoding="utf-8")
defined = set(re.findall(r'<li id="([se]\d+)">', html))
cited = set(re.findall(r'href="#([se]\d+)"', html))
for missing in sorted(cited - defined):
    problems.append(f"index.html: cites #{missing} but the source list has no such entry")
for unused in sorted(defined - cited):
    problems.append(f"index.html: source {unused} is listed but never cited")

if PDF.is_file():
    pdf_text = subprocess.run(["pdftotext", str(PDF), "-"], capture_output=True, text=True).stdout
    scan(PDF.name, pdf_text)
else:
    problems.append(f"{PDF.name} missing: run node scripts/build.mjs first")

if problems:
    print("\n".join(problems))
    sys.exit(1)
print(f"OK: {len(TEXT_FILES)} text files and the PDF passed. {len(defined)} sources, all cited.")
