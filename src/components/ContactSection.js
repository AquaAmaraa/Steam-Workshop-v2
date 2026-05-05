import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ContactSection() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const copy = language === 'mn'
    ? {
        title: 'Хамтдаа Ярилцъя',
        subtitle: 'Асуулт байна уу? Хамтрахыг хүсэж байна уу? Бидэнтэй холбогдоорой!',
        email: 'Имэйл',
        phone: 'Утас',
        location: 'Байршил',
        sendMessage: 'Бидэнд Зурвас Илгээх',
        success: 'Зурвас амжилттай илгээгдлээ!',
        error: 'Алдаа гарлаа. Дахин оролдоно уу.',
        namePlaceholder: 'Таны нэр',
        emailPlaceholder: 'Имэйл хаяг',
        selectTopic: 'Сэдэв сонгох...',
        order: 'Захиалгын асуулт',
        partnership: 'Хамтын ажиллагаа',
        support: 'Техникийн тусламж',
        other: 'Бусад',
        messagePlaceholder: 'Бидэнд юу хэрэгтэй байгаагаа бичнэ үү...',
        sending: 'Илгээж байна...',
        send: 'Зурвас Илгээх',
      }
    : {
        title: "Let's Start a Conversation",
        subtitle: 'Have questions? Want to partner? Contact us!',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        sendMessage: 'Send us a Message',
        success: 'Message sent successfully!',
        error: 'Something went wrong. Try again.',
        namePlaceholder: 'Your Name',
        emailPlaceholder: 'Email Address',
        selectTopic: 'Select a topic...',
        order: 'Order Inquiry',
        partnership: 'Partnership',
        support: 'Technical Support',
        other: 'Other',
        messagePlaceholder: "Tell us what's on your mind...",
        sending: 'Sending...',
        send: 'Send Message',
      };

  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #C9E0E0 0%, #ffffff 100%)' }}>
      {/* Snowflakes */}
      <div className="absolute top-20 left-10 text-2xl opacity-30 hidden md:block">❄️</div>
      <div className="absolute top-40 right-20 text-xl opacity-20 hidden md:block">❄️</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6" style={{ fontFamily: "'Gochi Hand', 'Noto Sans', cursive" }}>
              {copy.title}
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-md" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
              {copy.subtitle}
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6" style={{ color: '#4B8481' }} />
                <div>
                  <div className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.email}</div>
                  <div className="font-semibold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>Steamworkshop.kids@outlook.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6" style={{ color: '#4B8481' }} />
                <div>
                  <div className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.phone}</div>
                  <div className="font-semibold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>+976 99224146</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6" style={{ color: '#4B8481' }} />
                <div>
                  <div className="text-sm text-gray-500" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.location}</div>
                  <div className="font-semibold text-gray-900" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>Ulaanbaatar, Mongolia</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl text-gray-600 transition-all" style={{ ':hover': { color: '#4B8481' } }}>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.sendMessage}</h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 border-2 rounded-xl" style={{ backgroundColor: '#C9E0E0', borderColor: '#4B8481' }}>
                <p className="font-semibold" style={{ color: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.success}</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-xl">
                <p className="text-red-800 font-semibold" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>{copy.error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={copy.namePlaceholder} className="px-5 py-3 rounded-xl border-2 border-gray-200 focus:outline-none" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif", ':focus': { borderColor: '#4B8481' } }} required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={copy.emailPlaceholder} className="px-5 py-3 rounded-xl border-2 border-gray-200 focus:outline-none" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }} required />
              </div>
              <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:outline-none bg-white" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }} required>
                <option value="">{copy.selectTopic}</option>
                <option value="order">{copy.order}</option>
                <option value="partnership">{copy.partnership}</option>
                <option value="support">{copy.support}</option>
                <option value="other">{copy.other}</option>
              </select>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder={copy.messagePlaceholder} className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:outline-none resize-none" style={{ fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }} required />
              <button type="submit" disabled={isSubmitting} className="w-full text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50" style={{ backgroundColor: '#4B8481', fontFamily: "'Baloo 2', 'Noto Sans', sans-serif" }}>
                {isSubmitting ? copy.sending : copy.send}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

