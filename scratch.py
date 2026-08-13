import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The pattern matches:
# <div class="border-glow-card reveal"[^>]*>\s*<span class="edge-light"></span>\s*<div class="border-glow-inner"[^>]*>\s*(<div class="glass-panel[^>]*>)\s*
# and we want to replace it with:
# \1 (but keeping the reveal class and adding border-glow)

# For services and projects:
pattern1 = re.compile(
    r'<div class="border-glow-card reveal"(.*?)>\s*<span class="edge-light"></span>\s*<div class="border-glow-inner"[^>]*>\s*<div class="glass-panel service-card"(.*?)>',
    re.DOTALL
)
# We need to capture the transition delay from group 1, and add it to group 2
def replacer1(match):
    delay = match.group(1)
    inner_attrs = match.group(2)
    # The inner element gets 'reveal' and 'border-glow'
    return f'<div class="glass-panel service-card reveal border-glow"{delay}>'

content = pattern1.sub(replacer1, content)

# Remove the closing divs for services/projects
content = re.sub(r'</div>\s*</div>\s*</div>\s*</div>\s*<div class="(glass-panel|border-glow-card)', r'</div>\n                </div>\n\n                <div class="\1', content)
# wait, it's easier to just do a smart string replacement or BeautifulSoup
