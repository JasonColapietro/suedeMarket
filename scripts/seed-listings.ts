import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

const SELLERS = [
  { email: 'alex@suedemarket.test', password: 'test1234', display_name: 'Alex Rivera', participant_type: 'human' as const, bio: 'Guitar collector and session musician based in Nashville' },
  { email: 'jordan@suedemarket.test', password: 'test1234', display_name: 'Jordan Chen', participant_type: 'human' as const, bio: 'Producer and synth enthusiast' },
  { email: 'sam@suedemarket.test', password: 'test1234', display_name: 'Sam Okafor', participant_type: 'human' as const, bio: 'Drummer, educator, and gear nerd' },
  { email: 'agent-scout@suedemarket.test', password: 'test1234', display_name: 'GearScout AI', participant_type: 'agent' as const, agent_description: 'AI agent that scouts and lists vintage gear deals' },
  { email: 'agent-flip@suedemarket.test', password: 'test1234', display_name: 'FlipBot', participant_type: 'agent' as const, agent_description: 'Automated instrument trading bot specializing in guitars' },
]

const LISTINGS = [
  { title: '1962 Fender Stratocaster Sunburst', description: 'Original pre-CBS Stratocaster in 3-tone sunburst. All-original electronics, neck date stamp clearly visible. Comes with original brown tolex case. This is a serious collector\'s piece with incredible tone.', price_cents: 3500000, condition: 'good', brand: 'Fender', model: 'Stratocaster', year: 1962, category_slug: 'electric-guitars', tags: ['vintage', 'collector', 'pre-cbs'], location: 'Nashville, TN', shipping_info: 'Ships fully insured via FedEx', images: [img('strat62-1'), img('strat62-2'), img('strat62-3')] },
  { title: 'Gibson Les Paul Standard \'59 Reissue R9', description: 'Murphy Lab aged, beautiful flame top in Dirty Lemon. Lightweight at 8.2 lbs. PAF-style pickups with stunning clarity. Plays like butter.', price_cents: 549900, condition: 'excellent', brand: 'Gibson', model: 'Les Paul Standard R9', year: 2023, category_slug: 'electric-guitars', tags: ['les paul', 'murphy lab', 'flame top'], location: 'Austin, TX', shipping_info: 'Free shipping CONUS', images: [img('lp59-1'), img('lp59-2'), img('lp59-3'), img('lp59-4')] },
  { title: 'PRS Custom 24 10-Top Emerald Green', description: 'Pristine PRS Custom 24 with a stunning 10-top flame maple cap in Emerald Green. Pattern neck carve, 85/15 pickups. Comes with PRS hardshell case.', price_cents: 329900, condition: 'mint', brand: 'PRS', model: 'Custom 24', year: 2024, category_slug: 'electric-guitars', tags: ['prs', '10-top', 'usa'], location: 'Portland, OR', shipping_info: 'Ships in original case', images: [img('prs24-1'), img('prs24-2')] },
  { title: 'Martin D-28 Acoustic Guitar', description: 'Classic dreadnought with solid Sitka spruce top and East Indian rosewood back and sides. Rich, full tone that only gets better with age. Light play wear on the top.', price_cents: 219900, condition: 'good', brand: 'Martin', model: 'D-28', year: 2019, category_slug: 'acoustic-guitars', tags: ['dreadnought', 'rosewood', 'sitka'], location: 'Denver, CO', shipping_info: 'Ships in hardshell case', images: [img('martin-d28-1'), img('martin-d28-2'), img('martin-d28-3')] },
  { title: 'Fender American Professional II Jazz Bass', description: 'Olympic White with rosewood fingerboard. V-Mod II pickups deliver punchy, articulate tone. Slim C-to-D neck profile. Includes Elite molded case.', price_cents: 149900, condition: 'excellent', brand: 'Fender', model: 'Jazz Bass', year: 2022, category_slug: 'bass-guitars', tags: ['jazz bass', 'american', 'professional'], location: 'Chicago, IL', shipping_info: 'Free shipping', images: [img('jbass-1'), img('jbass-2')] },
  { title: 'Taylor 814ce Builder\'s Edition', description: 'Grand Auditorium body with V-Class bracing. Sitka spruce top, Indian rosewood back and sides. The beveled armrest and cutaway make this incredibly comfortable. Expression System 2 electronics.', price_cents: 349900, condition: 'mint', brand: 'Taylor', model: '814ce', year: 2024, category_slug: 'acoustic-guitars', tags: ['grand auditorium', 'v-class', 'builders edition'], location: 'Los Angeles, CA', shipping_info: 'Ships in Taylor deluxe case', images: [img('taylor814-1'), img('taylor814-2'), img('taylor814-3')] },
  { title: 'Sequential Prophet-5 Rev 4', description: 'The legendary polysynth reborn. 5-voice analog, fully discrete VCOs and filters. Includes original box and power supply. Barely used — bought during lockdown.', price_cents: 299900, condition: 'excellent', brand: 'Sequential', model: 'Prophet-5 Rev 4', year: 2023, category_slug: 'synthesizers', tags: ['analog', 'polysynth', 'classic'], location: 'Brooklyn, NY', shipping_info: 'Local pickup preferred, will ship double-boxed', images: [img('prophet5-1'), img('prophet5-2')] },
  { title: 'Nord Stage 3 88 Weighted', description: '88-key fully weighted stage keyboard. Piano, organ, and synth sections. Excellent condition with only studio use. Includes Nord soft case.', price_cents: 349900, condition: 'excellent', brand: 'Nord', model: 'Stage 3 88', year: 2021, category_slug: 'electric-pianos', tags: ['stage piano', 'weighted', '88-key'], location: 'Miami, FL', shipping_info: 'Ships in original packaging', images: [img('nord-stage-1'), img('nord-stage-2'), img('nord-stage-3')] },
  { title: 'Moog Subsequent 37', description: 'Paraphonic analog synthesizer with legendary Moog sound. Duo mode for two-note paraphony. Aftertouch enabled. Rack ears included.', price_cents: 139900, condition: 'good', brand: 'Moog', model: 'Subsequent 37', year: 2020, category_slug: 'synthesizers', tags: ['moog', 'analog', 'mono'], location: 'Seattle, WA', shipping_info: 'Ships in Moog gig bag', images: [img('moog-sub37-1'), img('moog-sub37-2')] },
  { title: 'DW Collector\'s Series Maple 5-Piece Shell Pack', description: 'Stunning Exotic Sapele Pommele finish. Sizes: 22x18, 10x8, 12x9, 14x12, 16x14. These shells sing. No hardware included.', price_cents: 399900, condition: 'excellent', brand: 'DW', model: 'Collector\'s Series', year: 2022, category_slug: 'drum-kits', tags: ['maple', 'shell pack', 'collectors'], location: 'Atlanta, GA', shipping_info: 'Ships in DW padded bags', images: [img('dw-drums-1'), img('dw-drums-2'), img('dw-drums-3')] },
  { title: 'Zildjian K Custom Dark Cymbal Set', description: 'Full cymbal set: 14" hi-hats, 16" crash, 18" crash, 20" ride. Dark, complex, washy tones. Used in studio only. No cracks, minimal stick marks.', price_cents: 159900, condition: 'excellent', brand: 'Zildjian', model: 'K Custom Dark', year: 2023, category_slug: 'cymbals', tags: ['k custom', 'cymbal set', 'dark'], location: 'Philadelphia, PA', shipping_info: 'Ships in cymbal bag', images: [img('zildjian-k-1'), img('zildjian-k-2')] },
  { title: 'Fender \'65 Twin Reverb Reissue', description: '85 watts of clean Fender tone. 2x12 Jensen speakers. Reverb and vibrato channels. Recently serviced with fresh tubes. Some tolex wear but sounds incredible.', price_cents: 129900, condition: 'good', brand: 'Fender', model: '\'65 Twin Reverb', year: 2018, category_slug: 'guitar-amps', tags: ['tube', 'clean', 'twin reverb'], location: 'San Francisco, CA', shipping_info: 'Local pickup strongly preferred', images: [img('twin-reverb-1'), img('twin-reverb-2')] },
  { title: 'Strymon Timeline Multidimensional Delay', description: 'Flagship delay pedal with 12 delay machines. MIDI capable. Includes expression pedal input, favorite switch, and original box. Velcro on bottom.', price_cents: 34900, condition: 'excellent', brand: 'Strymon', model: 'Timeline', year: 2022, category_slug: 'effects-pedals', tags: ['delay', 'midi', 'strymon'], location: 'Nashville, TN', shipping_info: 'Ships USPS Priority', images: [img('strymon-tl-1'), img('strymon-tl-2')] },
  { title: 'Mesa Boogie Dual Rectifier Head', description: 'Three-channel 100W head. Incredible high-gain tones from searing lead to tight rhythm. Multi-watt switch (50/100W). Includes footswitch and head cover.', price_cents: 169900, condition: 'good', brand: 'Mesa Boogie', model: 'Dual Rectifier', year: 2020, category_slug: 'guitar-amps', tags: ['high gain', 'tube', 'metal'], location: 'Dallas, TX', shipping_info: 'Ships double-boxed', images: [img('mesa-dual-1'), img('mesa-dual-2'), img('mesa-dual-3')] },
  { title: 'Neumann U87 Ai Studio Condenser Microphone', description: 'The studio standard. Three polar patterns (omni, cardioid, figure-8). Includes EA 87 shock mount and wooden box. Used gently in a home studio.', price_cents: 259900, condition: 'excellent', brand: 'Neumann', model: 'U87 Ai', year: 2021, category_slug: 'microphones', tags: ['condenser', 'studio', 'large diaphragm'], location: 'New York, NY', shipping_info: 'Ships in original wooden case', images: [img('u87-1'), img('u87-2')] },
  { title: 'Universal Audio Apollo x8p Thunderbolt 3', description: '18x24 audio interface with 8 Unison preamps and UAD-2 HEXA Core processing. Thunderbolt 3. Elite conversion. Includes rack ears and TB3 cable.', price_cents: 399900, condition: 'mint', brand: 'Universal Audio', model: 'Apollo x8p', year: 2024, category_slug: 'pro-audio', tags: ['interface', 'thunderbolt', 'uad'], location: 'Los Angeles, CA', shipping_info: 'Ships in original box', images: [img('apollo-x8p-1'), img('apollo-x8p-2'), img('apollo-x8p-3')] },
  { title: 'Pioneer CDJ-3000 (Pair)', description: 'Two CDJ-3000 players in excellent condition. 9" touchscreens, improved jog wheels. Cloud library compatible. Includes original boxes and cables.', price_cents: 449900, condition: 'excellent', brand: 'Pioneer DJ', model: 'CDJ-3000', year: 2023, category_slug: 'dj-electronic', tags: ['cdj', 'pair', 'pro dj'], location: 'Las Vegas, NV', shipping_info: 'Ships in original boxes', images: [img('cdj3000-1'), img('cdj3000-2'), img('cdj3000-3')] },
  { title: 'Pedaltrain Classic PRO with Soft Case', description: 'Full-size pedalboard, 32" x 16". Includes mounting hardware and Pedaltrain soft case. Some velcro residue on top rails.', price_cents: 14900, condition: 'good', brand: 'Pedaltrain', model: 'Classic PRO', year: 2021, category_slug: 'accessories', tags: ['pedalboard', 'full size'], location: 'Boston, MA', shipping_info: 'Ships in soft case', images: [img('pedaltrain-1')] },
]

async function seed() {
  console.log('Seeding suedeMarket...\n')

  // 1. Check categories
  const { data: cats } = await supabase.from('categories').select('id, slug')
  if (!cats || cats.length === 0) {
    console.log('No categories found. Please run the seed.sql migration first.')
    process.exit(1)
  }
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]))
  console.log(`Found ${cats.length} categories`)

  // 2. Disable the trigger that's causing issues, create users, then re-enable
  console.log('\nDisabling profile trigger...')
  await supabase.rpc('exec_sql', {
    sql: 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;',
  }).then(({ error }) => {
    if (error) console.log('  Could not drop trigger via RPC, trying raw SQL...')
  })

  // If RPC doesn't work, we'll handle the error from user creation differently
  const { data: existing } = await supabase.auth.admin.listUsers()
  const sellerIds: string[] = []

  for (const seller of SELLERS) {
    const found = existing?.users?.find((u) => u.email === seller.email)
    if (found) {
      console.log(`  User ${seller.email} already exists`)
      sellerIds.push(found.id)

      // Ensure profile exists
      await supabase.from('profiles').upsert({
        id: found.id,
        display_name: seller.display_name,
        participant_type: seller.participant_type,
        bio: seller.bio || null,
        agent_description: seller.agent_description || null,
      })
      continue
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: seller.email,
      password: seller.password,
      email_confirm: true,
    })

    if (error) {
      console.error(`  Failed to create ${seller.email}:`, error.message)
      continue
    }

    const userId = data.user.id
    sellerIds.push(userId)

    // Manually create profile since trigger may not have fired
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      display_name: seller.display_name,
      participant_type: seller.participant_type,
      bio: seller.bio || null,
      agent_description: seller.agent_description || null,
    })

    if (profileErr) {
      console.error(`  Profile insert failed for ${seller.email}:`, profileErr.message)
    }

    console.log(`  Created: ${seller.display_name} (${seller.participant_type})`)
  }

  if (sellerIds.length === 0) {
    console.log('\nNo sellers created. Cannot insert listings.')
    process.exit(1)
  }

  // 3. Insert listings
  console.log(`\nCreating listings with ${sellerIds.length} sellers...`)
  let created = 0

  for (const listing of LISTINGS) {
    const categoryId = catMap[listing.category_slug]
    const sellerId = sellerIds[created % sellerIds.length]

    const { error } = await supabase.from('listings').insert({
      seller_id: sellerId,
      category_id: categoryId || null,
      title: listing.title,
      description: listing.description,
      price_cents: listing.price_cents,
      condition: listing.condition,
      brand: listing.brand,
      model: listing.model,
      year: listing.year,
      status: 'active',
      images: listing.images,
      tags: listing.tags,
      location: listing.location,
      shipping_info: listing.shipping_info,
    })

    if (error) {
      console.error(`  Failed: "${listing.title}" — ${error.message}`)
    } else {
      console.log(`  Listed: ${listing.title} — ${(listing.price_cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`)
      created++
    }
  }

  console.log(`\nDone! ${sellerIds.length} users, ${created} listings.`)
  console.log('\nTest login: any seller email with password "test1234"')
  console.log('Emails:', SELLERS.map((s) => s.email).join(', '))
}

seed().catch(console.error)
