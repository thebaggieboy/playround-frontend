"use client"

export function Footer() {
  return (
    <footer className="bg-[#0b1530] border-t border-[#1d3a6e] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4 group">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-900/30 transition-all duration-300">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                Playground
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Financial analysis made simple.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1d3a6e] pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500">
            &copy; 2025 Playground. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-slate-500 hover:text-blue-400 transition-all duration-300 hover:scale-110 inline-block"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-blue-400 transition-all duration-300 hover:scale-110 inline-block"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-blue-400 transition-all duration-300 hover:scale-110 inline-block"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
