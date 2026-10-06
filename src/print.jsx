import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import QRCode from 'qrcode'
import Mark from './components/Mark'
import { person, collection, jacket, bags, boots } from './content'
import './print.css'

// The print kit: a keycard business card and a hang tag for each room, each with a
// QR code that opens the site at the right place. Print at 100% scale on card stock,
// or send the PDF to a printer (Save as PDF from the print dialog).

// The site's address: person.site if it is set, otherwise wherever this page is served from.
const base = (person.site || window.location.href.replace(/print\.html.*$/, '')).replace(/\/?$/, '/')

function QR({ to, label }) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    QRCode.toString(to, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#13241e', light: '#0000' } })
      .then(setSvg)
  }, [to])
  return <div className="qr" role="img" aria-label={`QR code: ${label}`} dangerouslySetInnerHTML={{ __html: svg }} />
}

function Keycard() {
  return (
    <div className="pair">
      <div className="card card--front">
        <div className="card-stripe" />
        <Mark className="card-mark" />
        <p className="card-kicker">Room key · {collection.title}</p>
        <p className="card-name">{person.name}</p>
        <p className="card-role">{person.role} · {person.school}</p>
        <p className="card-sign"><span>EXIT</span> entry != exit</p>
        <span className="card-arrow" aria-hidden="true">Insert this way ↑</span>
      </div>
      <div className="card card--back">
        <QR to={`${base}#exit`} label="the contact section of the portfolio" />
        <div className="card-back-text">
          <p className="card-scan">Scan to find the exit</p>
          <p>{person.email}</p>
          <p>{person.instagram.handle}</p>
          {person.linkedin && <p>linkedin.com/in/{person.linkedin.split('/in/')[1]}</p>}
          <p className="card-small">{person.degree}</p>
        </div>
        <Mark stamp={false} className="card-mark-back" />
      </div>
    </div>
  )
}

function Tag({ room, materials }) {
  return (
    <div className="tag">
      <span className="tag-hole" aria-hidden="true" />
      <p className="tag-room">Room {room.number}</p>
      <p className="tag-title">{room.title}</p>
      <p className="tag-line">{room.line}</p>
      <p className="tag-mat">{materials}</p>
      <QR to={`${base}#${room.id}`} label={`the ${room.title.toLowerCase()} room`} />
      <p className="tag-scan">Scan for how it was made</p>
      <div className="tag-foot"><Mark className="tag-mark" /><span>{person.name}<br />{collection.title}, {collection.season.replace('Ready-to-wear, ', '')}</span></div>
    </div>
  )
}

function Kit() {
  return (
    <main className="kit">
      <header className="kit-head">
        <h1>Print kit</h1>
        <p>A keycard business card (85.6 × 54 mm, front and back) and a hang tag for each room (50 × 100 mm).
          The QR codes open <strong>{base}</strong>{person.site ? '' : ' (the address this page was opened from; set person.site in content.js to fix it)'}.
          Print at 100% scale on 300–350 gsm card, or choose Save as PDF and send that to a printer. Cut along the grey lines.</p>
        <button type="button" onClick={() => window.print()}>Print</button>
      </header>
      <section className="sheet">
        <Keycard />
        <Keycard />
      </section>
      <section className="sheet sheet--tags">
        <Tag room={jacket} materials={jacket.materials.join(', ')} />
        <Tag room={bags} materials={bags.materials.slice(0, 2).join(', ')} />
        <Tag room={boots} materials="Full-grain oil pull-up leather, sheep nappa lining" />
      </section>
    </main>
  )
}

createRoot(document.getElementById('print')).render(<React.StrictMode><Kit /></React.StrictMode>)
