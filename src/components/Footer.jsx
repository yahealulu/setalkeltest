import Link from 'next/link';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#a4cf6e] text-white pt-10">
            <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-2">
                {/* About */}
                <div>
                    <Link href="#"><img src="/images/logo_white_and_gold.png" alt="Sel alkel logo" className="w-28" /></Link>
                    <p className="text-lg text-white/90">
                        From frozen veggie products to canned favorites such as beans to vegan alternatives, we have something for everyone.
                    </p>
                </div>

                {/* Popular Categories */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Popular Categories</h3>
                    <ul className="space-y-2 text-lg text-white/90">
                        <li><Link href="#">Vegetables & Fruits</Link></li>
                        <li><Link href="#">Seafood</Link></li>
                        <li><Link href="#">Dairy</Link></li>
                        <li><Link href="#">Fresh Fish</Link></li>
                        <li><Link href="#">Mushrooms</Link></li>
                    </ul>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Useful Links</h3>
                    <ul className="space-y-2 text-lg text-white/90">
                        <li><Link href="/about-us">About Us</Link></li>
                        <li><Link href="/contact-us">Contact Us</Link></li>
                        <li><Link href="/delivery">Delivery</Link></li>
                        <li><Link href="/blog">Blog</Link></li>
                    </ul>
                </div>

                {/* Social and Apps */}
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">Available On:</h3>
                    <div className="flex gap-2 mb-4">
                        <Link href="#"><img src="/images/Google_Play_Store.webp" alt="Google Play" className="w-28" /></Link>
                        <Link href="#"><img src="/images/apple-app-store-cta.webp" alt="App Store" className="w-28" /></Link>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Social links:</h3>
                    <div className="flex space-x-3">
                        <Link href="https://www.facebook.com/Setalkel.food/"><FaFacebookF className="text-white text-xl hover:text-gray-200" /></Link>
                        <Link href="https://www.instagram.com/setalkel.co"><FaInstagram className="text-white text-xl hover:text-gray-200" /></Link>
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <div className="py-6 bg-[#a4cf6e]">
                <div className="container mx-auto px-4">
                    <div className="bg-[#98c75b] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0">
                        <h4 className="text-2xl font-semibold mb-2 text-white">Sign Up to our Newsletter</h4>
                        <p className="text-white/90 text-lg">Be the First to Know. Sign up to newsletter today</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                        type="email"
                        placeholder="Your email address"
                        className="px-4 py-2 rounded text-black focus:outline-none w-64"
                        />
                        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Sign Up</button>
                    </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="bg-[#a4cf6e] text-sm text-white/90 py-4 text-center">
                <p>
                    © 2025 Set Alkel Theme. Powered by <Link href="#" className="underline hover:text-white">WooCommerce Themes</Link>
                </p>
                <div className="mt-2 flex justify-center space-x-4">
                    <Link href="#" className="hover:text-white">Terms Of Service</Link>
                    <Link href="#" className="hover:text-white">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white">Store Refund Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
