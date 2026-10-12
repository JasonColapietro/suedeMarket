import Link from 'next/link'
import { Zap, Music, Monitor, Pen } from 'lucide-react'
import { createPublicPageMetadata, homeJsonLd, jsonLdScript } from '@/lib/seo'

const PAGE = {
  title: 'Musical Instrument Buying & Selling Guides | Suede AI',
  description: 'Practical checklists for describing and inspecting used guitars, amps, pedals and studio gear. Reference guides from the retired suedeMarket marketplace.',
}

export const metadata = createPublicPageMetadata({ path: '/', ...PAGE })

const AGENT_FEATURES = [
  { title: 'Describe the exact instrument', desc: 'Include maker, model, condition, modifications, and accessories. Explain what you tested and what needs attention.' },
  { title: 'Show the details', desc: 'Photograph the whole instrument, identifying marks, controls, connectors, and wear. Include close-ups of repairs.' },
  { title: 'Agree the handoff', desc: 'Discuss collection or shipping, packing, included items, and the agreed terms. Keep the conversation with the listing record.' },
]

const GEAR_CHECKS = [
  { icon: Zap, name: 'Amps & effects', desc: 'Confirm voltage, the required power supply, noise, switching, and all inputs and outputs.' },
  { icon: Music, name: 'Guitars & basses', desc: 'Ask about fret wear, neck condition, electronics, repairs, and changed parts.' },
  { icon: Monitor, name: 'Studio equipment', desc: 'Check computer compatibility, connections, included adapters, and software licenses separately.' },
  { icon: Pen, name: 'Keys & drums', desc: 'Check every key, pad, pedal, trigger, stand, and the pieces included in the pictured setup.' },
]

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(homeJsonLd(PAGE))} />
      <section className="bg-[#0f0f14] px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest text-white/60">suedeMarket reference guides</p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            Musical instrument buying and selling guides
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-white/80">
            Check the exact model, condition, repairs and included accessories.
            Use these practical gear checklists to prepare a clear description
            or ask better questions before a handoff.
          </p>
          <p className="mt-6 max-w-2xl border-l-2 border-white/30 pl-5 text-sm leading-relaxed text-white/70">
            The suedeMarket marketplace has been retired. Listings, accounts and
            transaction tools are no longer available. These guides remain available
            as reference material.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <Link href="#buying-guide" className="underline underline-offset-4">Read the buying checklist</Link>
            <Link href="#selling-guide" className="underline underline-offset-4">Prepare a gear description</Link>
          </div>
        </div>
      </section>

      <section id="selling-guide" className="bg-[#f8f7f5] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary/60">Selling guide</p>
            <h2 className="mt-4 font-serif text-4xl text-primary">How to prepare a musical instrument listing</h2>
            <div className="mt-10 space-y-8">
              {AGENT_FEATURES.map(({ title, desc }) => (
                <div key={title} className="border-l-2 border-primary/20 pl-6">
                  <h3 className="font-semibold text-primary">{title}</h3>
                  <p className="mt-2 leading-relaxed text-primary/75">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5 leading-relaxed text-primary/80">
            <h3 className="font-serif text-2xl text-primary">From vague to useful</h3>
            <p>Instead of “great guitar, plays well,” describe details you can show:
              the exact model, finish, pickup configuration, visible fret wear,
              changed parts, and whether a case is included. State when a date or
              specification is unknown. Precise descriptions help buyers decide
              which questions to ask next.</p>
            <p>For an amplifier, list the tested channels and controls, available
              service history, and supplied speaker or cabinet. For a pedal, note
              whether the box and correct power supply are included. Keep ownership
              and repair records available for the conversation without posting
              personal information in the public listing.</p>
            <p>Price the actual item and its condition. When comparing other sales,
              distinguish completed transactions from asking prices. Compare the
              same model and included accessories, and explain differences that a
              buyer would otherwise have to guess.</p>
            <p>Before publishing, read the listing on a phone and check the photo
              order. Lead with a clear view of the actual item. Group detail photos
              so a buyer can move from the overall condition to specific wear,
              repairs, and included accessories without searching through the gallery.</p>
          </div>
        </div>
      </section>

      <section id="buying-guide" className="bg-[#1a1a22] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div className="space-y-6 leading-relaxed text-white/80">
            <p className="text-xs uppercase tracking-widest text-white/60">Buying guide</p>
            <h2 className="font-serif text-4xl text-white">Know the gear before the handoff</h2>
            <p>Match the listing to your setup before making an offer. Ask for
              missing photos, confirm the exact model and included items, and
              discuss faults or modifications. A short demonstration can answer
              questions about switches, controls, and unwanted noise that a still
              image cannot.</p>
            <p>For collection, agree a place and enough time to inspect the item.
              For shipping, discuss the case or packaging, detachable parts, carrier,
              and how shipment details will be shared. Keep the agreed description
              and the condition photos with your conversation.</p>
            <p>Before arranging payment, confirm the method and any protection
              offered by the provider you will actually use. A listing, accepted
              offer, or order record does not itself establish escrow or a payment
              guarantee. If software is included with hardware, check the
              publisher&apos;s transfer rules directly; an installed copy does not
              establish a transferable license.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {GEAR_CHECKS.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="border border-white/15 p-6">
                <Icon className="h-5 w-5 text-white/60" />
                <h3 className="mt-4 font-semibold text-white">{name}</h3>
                <p className="mt-3 leading-relaxed text-white/75">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#f8f7f5] px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6 text-sm text-primary/75">
          <p>Published by <a href="https://suedeai.ai" className="underline underline-offset-4">Suede AI</a>,
            founded by <a href="https://suedeai.ai/founder" className="underline underline-offset-4">Jason Colapietro</a>.</p>
          <Link href="/ai-instructions" className="underline underline-offset-4">Source and citation guide</Link>
        </div>
      </footer>
    </main>
  )
}
