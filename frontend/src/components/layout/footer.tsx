import Link from 'next/link'
import { Gamepad2, Github, Twitter } from 'lucide-react'
import { RiDiscordFill } from 'react-icons/ri'

export default function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'API Documentation', href: '/dev' },
        { name: 'SDKs', href: '/dev/sdks' },
        { name: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { name: 'Documentation', href: '/dev' },
        { name: 'API Reference', href: '/dev/api' },
        { name: 'Examples', href: '/dev/examples' },
        { name: 'Status', href: '/status' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR', href: '/gdpr' },
      ],
    },
  ]

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold gradient-text">Web3APIs</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering the next generation of Web3 gaming with comprehensive APIs
              and developer tools.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://discord.com"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Discord"
              >
                <RiDiscordFill size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Web3APIs. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm text-muted-foreground">
            <span>Built with ❤️ for Web3 Gaming</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
