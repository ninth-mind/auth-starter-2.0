import React from 'react'
import Link from 'next/link'
import { Layout } from 'antd'
import './Footer.scss'

function Footer(props) {
  return (
    <Layout.Footer>
      <div className="footer">
        <ul className="footer__group">
          <li className="footer__group__item">
            <Link href="/legal/terms">
              <a>Terms</a>
            </Link>
          </li>
          <li className="footer__group__item">
            <Link href="/legal/privacy">
              <a>Privacy</a>
            </Link>
          </li>
        </ul>
        <div className="footer__group__item copyright">
          Copyright <i>Sudonym.net</i> 2020
        </div>
      </div>
    </Layout.Footer>
  )
}

export default Footer
