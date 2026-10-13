import { Link } from 'react-router-dom'
import { useHead } from '../lib/head'

export default function NotFound({ bare }) {
  useHead({ title: 'Not found' })
  return (
    <div className="notfound grid">
      <p className="mono">404</p>
      <h1>This page is not here.</h1>
      <p>The project may have been renamed or hidden. <Link className="link" to="/work">See all work</Link>{bare ? null : <> or go <Link className="link" to="/">home</Link></>}.</p>
    </div>
  )
}
