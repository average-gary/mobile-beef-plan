-- Pandoc filter for the .wiki dual-link format and repo-relative links.
-- Pass -M root=<prefix to site root> (e.g. "../../").
local GH = 'https://github.com/average-gary/mobile-beef-plan/blob/main/.wiki/'
local root = ''

local function is_str(el, pat) return el and el.t == 'Str' and el.text:find(pat) end

-- "[[slug|Title]] ([Title](x.md))" -> link; stray "[[slug|Title]]" -> "Title".
local function inlines(els)
  local out, i = pandoc.Inlines{}, 1
  while i <= #els do
    local el = els[i]
    local s = is_str(el, '%[%[')
    local j = i
    if s then while j <= #els and not is_str(els[j], '%]%]') do j = j + 1 end end
    if not s or j > #els then
      out:insert(el); i = i + 1
    else
      local raw = pandoc.utils.stringify(pandoc.Inlines({table.unpack(els, i, j)}))
      local pre, inner, post = raw:match('^(.-)%[%[(.-)%]%](.*)$')
      out:insert(pandoc.Str(pre))
      local a, b, c, d = els[j + 1], els[j + 2], els[j + 3], els[j + 4]
      if post == '' and a and a.t == 'Space' and b and b.t == 'Str' and b.text == '('
          and c and c.t == 'Link' and is_str(d, '^%)') then
        out:insert(c); out:insert(pandoc.Str(d.text:sub(2)))
        i = j + 5
      else
        out:insert(pandoc.Str((inner:match('|(.*)$') or inner) .. post))
        i = j + 1
      end
    end
  end
  return out
end

local function link(el)
  local t = el.target
  if t:match('^%a[%w+.-]*:') or t:match('^#') then return nil end
  local path, frag = t:match('^([^#]*)(.*)$')
  local rel = path:gsub('^%./', ''):gsub('^%.%./', ''):gsub('^%.%./', '')
  if rel:match('^raw/') then
    el.target = GH .. rel .. frag
  elseif rel:match('^output/.*%.md$') or rel:match('^output/.*%.pdf$') then
    el.target = root .. 'plan/' .. (rel:match('%.pdf$') and rel:match('[^/]*$') or '') .. frag
  elseif path:match('_index%.md$') then
    el.target = root .. 'wiki/' .. frag
  elseif path:match('%.md$') then
    el.target = path:gsub('%.md$', '.html') .. frag
  else
    return nil
  end
  return el
end

return {
  { Meta = function(m) root = m.root and pandoc.utils.stringify(m.root) or '' end },
  { Inlines = inlines },
  { Link = link },
}
