import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#212121] text-gray-300">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">

        {/* Brand */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-2">Trenzzo</h3>

          {/* Hide long description on mobile */}
          <p className="hidden md:block text-gray-400">
            Your one-stop destination for shopping — fashion, electronics,
            mobiles, and more.
          </p>

          {/* Socials */}
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a className="hover:text-white" href="#"><Facebook size={22} /></a>
            <a className="hover:text-white" href="#"><Instagram size={22} /></a>
            <a className="hover:text-white" href="#"><Twitter size={22} /></a>
            <a className="hover:text-white" href="#"><Linkedin size={22} /></a>
          </div>
        </div>

        {/* Categories */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-semibold mb-3">Categories</h3>
          <ul className="space-y-2">
            <li><Link className="hover:text-indigo-400" to="/category/mobiles">Mobiles</Link></li>
            <li><Link className="hover:text-indigo-400" to="/category/fashion">Fashion</Link></li>
            <li><Link className="hover:text-indigo-400" to="/category/electronics">Electronics</Link></li>
            <li><Link className="hover:text-indigo-400" to="/category/home">Home</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link className="hover:text-indigo-400" to="/help">Help Center</Link></li>
            {/* <li><Link className="hover:text-indigo-400" to="/returns">Returns</Link></li> */}
            {/* <li><Link className="hover:text-indigo-400" to="/shipping">Shipping</Link></li> */}
            {/* <li><Link className="hover:text-indigo-400" to="/contact">Contact</Link></li> */}
          </ul>
        </div>

        {/* Contact – Desktop only */}
        <div className="hidden md:block">
          <h3 className="text-white font-semibold mb-3">Get in Touch</h3>
          <p>Email: <span className="text-indigo-400">support@trenzzo.com</span></p>
          <p>Phone: +91 8605605058</p>
          <p>Address: Nagpur, Maharashtra, 441106, India</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} <span className="text-white">Trenzzo</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
