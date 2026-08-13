import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for services and projects
p1 = re.compile(
    r'<div class="border-glow-card reveal"([^>]*)>\s*<span class="edge-light"></span>\s*<div class="border-glow-inner"[^>]*>\s*<div class="glass-panel service-card"[^>]*>(.*?)</div>\s*</div>\s*</div>',
    re.DOTALL
)
def replacer1(m):
    delay = m.group(1)
    inner = m.group(2)
    return f'<div class="glass-panel service-card reveal border-glow"{delay}>{inner}</div>'
content = p1.sub(replacer1, content)

# Pattern for contact items
p2 = re.compile(
    r'<div class="border-glow-card"[^>]*>\s*<span class="edge-light"></span>\s*<div class="border-glow-inner">\s*<div class="glass-panel contact-item"[^>]*>(.*?)</div>\s*</div>\s*</div>',
    re.DOTALL
)
def replacer2(m):
    inner = m.group(1)
    return f'<div class="glass-panel contact-item border-glow" style="padding: 1.5rem;">{inner}</div>'
content = p2.sub(replacer2, content)

# Pattern for contact form
p3 = re.compile(
    r'<div class="border-glow-card">\s*<span class="edge-light"></span>\s*<div class="border-glow-inner">\s*<div class="glass-panel">\s*<form class="contact-form" id="contactForm">(.*?)</form>\s*</div>\s*</div>\s*</div>',
    re.DOTALL
)
def replacer3(m):
    inner = m.group(1)
    return f'<div class="glass-panel border-glow">\n                    <form class="contact-form" id="contactForm">{inner}</form>\n                </div>'
content = p3.sub(replacer3, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
