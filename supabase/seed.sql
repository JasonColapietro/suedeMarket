-- Seed categories
insert into categories (name, slug, icon, sort_order) values
  ('Guitars', 'guitars', 'guitar', 1),
  ('Drums & Percussion', 'drums', 'drum', 2),
  ('Keyboards & Synths', 'keyboards', 'piano', 3),
  ('Brass', 'brass', 'trumpet', 4),
  ('Woodwinds', 'woodwinds', 'music', 5),
  ('Strings', 'strings', 'violin', 6),
  ('DJ & Electronic', 'dj-electronic', 'disc', 7),
  ('Amps & Effects', 'amps-effects', 'speaker', 8),
  ('Pro Audio', 'pro-audio', 'headphones', 9),
  ('Accessories', 'accessories', 'wrench', 10);

-- Subcategories
insert into categories (name, slug, parent_id, sort_order)
select sub.name, sub.slug, p.id, sub.sort_order
from (values
  ('Electric Guitars', 'electric-guitars', 'guitars', 1),
  ('Acoustic Guitars', 'acoustic-guitars', 'guitars', 2),
  ('Bass Guitars', 'bass-guitars', 'guitars', 3),
  ('Classical Guitars', 'classical-guitars', 'guitars', 4),
  ('Drum Kits', 'drum-kits', 'drums', 1),
  ('Cymbals', 'cymbals', 'drums', 2),
  ('Hand Percussion', 'hand-percussion', 'drums', 3),
  ('Electric Pianos', 'electric-pianos', 'keyboards', 1),
  ('Synthesizers', 'synthesizers', 'keyboards', 2),
  ('MIDI Controllers', 'midi-controllers', 'keyboards', 3),
  ('Turntables', 'turntables', 'dj-electronic', 1),
  ('DJ Controllers', 'dj-controllers', 'dj-electronic', 2),
  ('Guitar Amps', 'guitar-amps', 'amps-effects', 1),
  ('Bass Amps', 'bass-amps', 'amps-effects', 2),
  ('Effects Pedals', 'effects-pedals', 'amps-effects', 3),
  ('Microphones', 'microphones', 'pro-audio', 1),
  ('Mixers', 'mixers', 'pro-audio', 2),
  ('Studio Monitors', 'studio-monitors', 'pro-audio', 3)
) as sub(name, slug, parent_slug, sort_order)
join categories p on p.slug = sub.parent_slug;
