#!/usr/bin/env python3
"""Chinese versions of System Design Lab pages.

The English pages are the only source of code. Each page has a translation file,
i18n/<slug>.json, that maps English text fragments to Traditional Chinese (zh-tw).
This script builds zh-tw/<slug>/index.html from the English page plus that file,
then converts the result to Simplified Chinese (zh-cn) with OpenCC (tw2sp:
Taiwan to mainland vocabulary) plus a few fix-ups.

  python3 tools/i18n.py extract <slug|index> [...]   add new English fragments to i18n/<slug>.json
  python3 tools/i18n.py build [--check]              regenerate zh-tw/ and zh-cn/ (--check: fail if anything is stale)

In a translation file, "zh": "=" means "keep the English text" (code, names).
Needs: pip install opencc
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I18N = os.path.join(ROOT, 'i18n')
# Mainland usage that OpenCC's phrase table misses (applied after tw2sp)
CN_FIXUPS = [('预设', '默认'), ('滑杆', '滑块'), ('进程式码', '进代码'), ('工作阶段', '会话'), ('回应', '响应'),
             ('回传', '返回'), ('逾时', '超时'), ('重设', '重置'), ('透过', '通过')]

BREAK = re.compile(r'<(?:!DOCTYPE|/?(?:html|head|body|meta|title|link|style|header|nav|main|section|div|p|h[1-6]|ul|ol|li|label|button|a|span|small|pre|canvas|input|br)\b)[^>]*>', re.I)
SCRIPT = re.compile(r'(<script>.*?</script>|<style>.*?</style>)', re.S)
ATTR = re.compile(r'\b(content|aria-label|placeholder|title)="([^"]*[A-Za-z]{2,}[^"]*)"')


def src_path(slug):
    return os.path.join(ROOT, 'index.html') if slug == 'index' else os.path.join(ROOT, slug, 'index.html')


def css_vocab():
    css = open(os.path.join(ROOT, 'assets', 'explainer.css')).read()
    words = set(re.findall(r'\.([a-z][a-z0-9-]*)', css))
    return words | {'ok', 'bad', 'wait', 'run', 'fail', 'on', 'hit', 'dim', 'mut', 'more', 'pv', 'nx', 'down', 'risk', 'right', 'wrong', 'empty', 'u', 'data', 'dead', 'k', 's', 'c', 'key', 'ln', 'active', 'hl'}


def skip_string(code, i):
    """Return the index just past the string or template literal starting at i (handles nested ${...})."""
    q, j, n = code[i], i + 1, len(code)
    while j < n:
        c = code[j]
        if c == '\\': j += 2; continue
        if c == q: return j + 1
        if q == '`' and code.startswith('${', j):
            j, depth = j + 2, 1
            while j < n and depth:
                c = code[j]
                if c in '\'"`': j = skip_string(code, j); continue
                if c == '{': depth += 1
                elif c == '}': depth -= 1
                j += 1
            continue
        j += 1
    return n


def js_literals(code):
    """Yield (start, end, quote) for each string literal in JS code. Skips comments and regex literals."""
    i, n, prev = 0, len(code), ''
    while i < n:
        ch = code[i]
        if ch in ' \t\r\n':
            i += 1; continue
        if code.startswith('//', i):
            j = code.find('\n', i); i = n if j < 0 else j; continue
        if code.startswith('/*', i):
            j = code.find('*/', i + 2); i = n if j < 0 else j + 2; continue
        if ch in '\'"`':
            j = skip_string(code, i)
            yield i, j, ch
            i, prev = j, 'x'; continue
        if ch == '/' and (prev == '' or prev in '(,=:[!&|?{};+-*%<>~^'):
            j, cls = i + 1, False
            while j < n and (code[j] != '/' or cls):
                if code[j] == '\\': j += 1
                elif code[j] == '[': cls = True
                elif code[j] == ']': cls = False
                j += 1
            j += 1
            while j < n and code[j].isalpha(): j += 1
            i, prev = j, 'x'; continue
        prev = ch if not (ch.isalnum() or ch in '_$') else 'x'
        if ch.isalpha():
            m = re.match(r'[A-Za-z_$][\w$]*', code[i:])
            word = m.group(0)
            prev = '(' if word in ('return', 'typeof', 'case', 'in', 'of') else 'x'
            i += len(word); continue
        i += 1


def wanted_js(text, vocab):
    if not re.search(r'[A-Za-z]{2,}', text): return False
    if re.match(r'^(#|\.|\[|--|var\(|https?:|\.\./|[a-z]+=)', text): return False
    if re.fullmatch(r'[a-z0-9_$-]+', text): return False  # identifiers, event names, single classes
    words = text.split()
    if all(re.fullmatch(r'[a-z0-9-]+', w) and w in vocab for w in words): return False  # class lists
    if re.fullmatch(r'[\w.-]+\.(html|js|css|png)', text): return False
    return True


def extract_segments(html):
    vocab = css_vocab()
    segs, seen = [], set()
    def add(kind, en):
        if (kind, en) not in seen:
            seen.add((kind, en)); segs.append({'kind': kind, 'en': en, 'zh': ''})
    for part in SCRIPT.split(html):
        if part.startswith('<style>'): continue
        if part.startswith('<script>'):
            code = part[8:-9]
            for a, b, q in js_literals(code):
                text = code[a + 1:b - 1]
                if wanted_js(text, vocab): add('js', code[a:b])
            continue
        part = re.sub(r'<!--.*?-->', '', part, flags=re.S)  # comments are never shown
        for m in ATTR.finditer(part):
            add('attr', m.group(2))
        for chunk in BREAK.split(part):
            t = chunk.strip()
            if t and re.search(r'[A-Za-z]{2,}', re.sub(r'<[^>]+>', '', t)):
                add('html', t)
    return segs


def cmd_extract(slugs):
    os.makedirs(I18N, exist_ok=True)
    for slug in slugs:
        path = os.path.join(I18N, slug + '.json')
        old = {(s['kind'], s['en']): s['zh'] for s in json.load(open(path))['segments']} if os.path.exists(path) else {}
        segs = extract_segments(open(src_path(slug)).read())
        for s in segs: s['zh'] = old.get((s['kind'], s['en']), '')
        json.dump({'page': slug, 'segments': segs}, open(path, 'w'), ensure_ascii=False, indent=1)
        todo = sum(1 for s in segs if not s['zh'])
        print(f'{slug}: {len(segs)} fragments, {todo} untranslated → {os.path.relpath(path, ROOT)}')


def js_quote(zh, q):
    body = zh.replace('\\', '\\\\') if q != '`' else zh
    if q == "'": body = body.replace("'", "\\'")
    if q == '"': body = body.replace('"', '\\"')
    return q + body + q


def translate(html, segs):
    problems = []
    js = [s for s in segs if s['kind'] == 'js']
    other = [s for s in segs if s['kind'] != 'js']
    out = []
    for part in SCRIPT.split(html):
        if part.startswith('<style>'):
            out.append(part); continue
        if part.startswith('<script>'):
            code = part[8:-9]
            lits = list(js_literals(code))
            table = {s['en']: s['zh'] for s in js}
            pieces, last = [], 0
            for a, b, q in lits:
                lit = code[a:b]
                if lit in table and table[lit] not in ('', '='):
                    zh = table[lit]
                    inner = zh[1:-1] if len(zh) >= 2 and zh[0] == zh[-1] == q else zh
                    pieces.append(code[last:a]); pieces.append(js_quote(inner, q) if not (zh[0] == q and zh[-1] == q) else zh); last = b
            pieces.append(code[last:])
            out.append('<script>' + ''.join(pieces) + '</script>'); continue
        for s in sorted(other, key=lambda s: -len(s['en'])):
            if s['zh'] in ('', '='): continue
            if s['kind'] == 'attr':
                part = part.replace(f'="{s["en"]}"', f'="{s["zh"]}"')
            else:
                part = re.sub(r'(?<=>)(\s*)' + re.escape(s['en']) + r'(\s*)(?=<)', lambda m: m.group(1) + s['zh'] + m.group(2), part)
        out.append(part)
    result = ''.join(out)
    current = {(s['kind'], s['en']) for s in extract_segments(html)}
    for s in segs:
        if (s['kind'], s['en']) not in current: problems.append('stale (no longer in the English page): ' + s['en'][:70])
        elif not s['zh']: problems.append('untranslated: ' + s['en'][:70])
    for k, en in current - {(s['kind'], s['en']) for s in segs}:
        problems.append('new English text, run extract: ' + en[:70])
    return result, problems


def localize(html, slug, lang):
    depth = 1 if slug == 'index' else 2
    up = '../' * depth
    html = html.replace('<html lang="en">', f'<html lang="{"zh-Hant-TW" if lang == "zh-tw" else "zh-Hans-CN"}" data-lang="{lang}" data-slug="{"" if slug == "index" else slug}">', 1)
    html = re.sub(r'(href|src)="(\.\./)?assets/', lambda m: f'{m.group(1)}="{up}assets/', html)
    html = html.replace('family=Silkscreen:wght@400;700&display=swap', 'family=Silkscreen:wght@400;700&family=Noto+Sans+TC:wght@400;500;700&display=swap')
    html = html.replace(f'<script src="{up}assets/explainer.js"></script>', f'<script src="{up}assets/explainer.js"></script>\n<script src="{up}assets/i18n.{lang}.js"></script>', 1)
    return html


def cmd_build(check):
    try:
        import opencc
    except ImportError:
        sys.exit('Needs OpenCC: pip install opencc')
    cc = opencc.OpenCC('tw2sp')
    def to_cn(s):
        s = cc.convert(s)
        for a, b in CN_FIXUPS: s = s.replace(a, b)
        return s
    bad = False
    for name in sorted(os.listdir(I18N)):
        if not name.endswith('.json'): continue
        slug = name[:-5]
        segs = json.load(open(os.path.join(I18N, name)))['segments']
        tw, problems = translate(open(src_path(slug)).read(), segs)
        for p in problems: print(f'  {slug}: {p}')
        bad |= bool(problems)
        tw = localize(tw, slug, 'zh-tw')
        cn = (to_cn(tw).replace('data-lang="zh-tw"', 'data-lang="zh-cn"').replace('assets/i18n.zh-tw.js', 'assets/i18n.zh-cn.js')
              .replace('lang="zh-Hant-TW"', 'lang="zh-Hans-CN"').replace('Noto+Sans+TC', 'Noto+Sans+SC'))
        for lang, text in (('zh-tw', tw), ('zh-cn', cn)):
            out = os.path.join(ROOT, lang, 'index.html') if slug == 'index' else os.path.join(ROOT, lang, slug, 'index.html')
            os.makedirs(os.path.dirname(out), exist_ok=True)
            if check and (not os.path.exists(out) or open(out).read() != text):
                print(f'  {lang}/{slug}: generated file is out of date'); bad = True
            if not check: open(out, 'w').write(text)
        print(f'{slug}: {"ok" if not problems else str(len(problems)) + " problem(s)"}')
    shared = os.path.join(ROOT, 'assets', 'i18n.zh-tw.js')
    cn_shared = to_cn(open(shared).read())
    cn_path = os.path.join(ROOT, 'assets', 'i18n.zh-cn.js')
    if check and (not os.path.exists(cn_path) or open(cn_path).read() != cn_shared):
        print('  assets/i18n.zh-cn.js is out of date'); bad = True
    if not check: open(cn_path, 'w').write(cn_shared)
    if bad and check: sys.exit(1)


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['extract']: cmd_extract(args[1:])
    elif args[:1] == ['build']: cmd_build('--check' in args)
    else: print(__doc__)
