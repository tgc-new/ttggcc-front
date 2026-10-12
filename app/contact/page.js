'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { settingsAPI } from '../../lib/api';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsAPI.get().then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const defaultMap = `https://maps.app.goo.gl/DPHAJXeNyXCWRgTw9`;

  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-2">যোগাযোগ</h1>
        <p className="text-green-200">আমাদের সাথে যোগাযোগ করুন</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">যোগাযোগের তথ্য</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                    <FaMapMarkerAlt className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-700">ঠিকানা</p>
                    <p className="text-sm text-gray-600 mt-0.5">{settings?.address || 'টুঙ্গিপাড়া, গোপালগঞ্জ, ঢাকা'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{settings?.addressEn || 'tungipara, Gopalganj, Dhaka'}</p>
                  </div>
                </div>
                {settings?.phone?.map((ph, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-green-100 p-2.5 rounded-lg flex-shrink-0">
                      <FaPhone className="text-green-600" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-700">ফোন {i > 0 ? i + 1 : ''}</p>
                      <a href={`tel:${ph}`} className="text-sm text-primary hover:underline">{ph}</a>
                    </div>
                  </div>
                ))}
                {settings?.email && (
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2.5 rounded-lg flex-shrink-0">
                      <FaEnvelope className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-700">ইমেইল</p>
                      <a href={`mailto:${settings.email}`} className="text-sm text-primary hover:underline break-all">{settings.email}</a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-2.5 rounded-lg flex-shrink-0">
                    <FaClock className="text-yellow-600" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-700">অফিস সময়</p>
                    <p className="text-sm text-gray-600">রবিবার - বৃহস্পতি: সকাল ৯টা - বিকেল ৫টা</p>
                    <p className="text-xs text-red-500">শুক্রবার-শনিবার বন্ধ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="card p-5 bg-primary text-white">
              <h3 className="font-bold mb-3">তথ্যসেবা কেন্দ্র</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-white/20 pb-1">
                  <span className="opacity-80">EIIN নম্বর:</span>
                  <span className="font-bold">{settings?.eiinNumber || '109678'}</span>
                </div>
                {settings?.mpoNumber && (
                  <div className="flex justify-between border-b border-white/20 pb-1">
                    <span className="opacity-80">MPO নম্বর:</span>
                    <span className="font-bold">{settings.mpoNumber}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-white/20 pb-1">
                  <span className="opacity-80">প্রতিষ্ঠিত:</span>
                  <span className="font-bold">{settings?.establishedYear || '১৯৮৬'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden h-full">
              <div className="section-title bg-primary">
                <FaMapMarkerAlt size={14} />
                <span>আমাদের অবস্থান</span>
              </div>
              <iframe
                src={settings?.googleMapEmbed || defaultMap}
                width="100%" height="450"
                style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="College Map"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
