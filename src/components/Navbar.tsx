import { Bell, CloudSun, Menu, Search, Settings2, UserCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const navLabelsByLanguage = {
  en: {
    Overview: 'Overview',
    'Live Map': 'Live Map',
    Alerts: 'Alerts',
    Incidents: 'Incidents',
    Analytics: 'Analytics',
    'Citizen Reports': 'Citizen Reports',
    'Response Center': 'Response Center',
    Reports: 'Reports',
    Settings: 'Settings',
    Search: 'Search',
    DMO: 'DMO',
  },
  hi: {
    Overview: 'मुख्य दृश्य',
    'Live Map': 'लाइव मानचित्र',
    Alerts: 'अलर्ट',
    Incidents: 'घटनाएँ',
    Analytics: 'विश्लेषण',
    'Citizen Reports': 'नागरिक रिपोर्ट',
    'Response Center': 'प्रतिक्रिया केंद्र',
    Reports: 'रिपोर्ट्स',
    Settings: 'सेटिंग्स',
    Search: 'खोजें',
    DMO: 'डीएमओ',
  },
  bn: {
    Overview: 'ওভারভিউ',
    'Live Map': 'লাইভ ম্যাপ',
    Alerts: 'অ্যালার্ট',
    Incidents: 'ঘটনা',
    Analytics: 'বিশ্লেষণ',
    'Citizen Reports': 'সিভিল রিপোর্ট',
    'Response Center': 'রেসপন্স সেন্টার',
    Reports: 'রিপোর্ট',
    Settings: 'সেটিংস',
    Search: 'খুঁজুন',
    DMO: 'ডিএমও',
  },
  mr: {
    Overview: 'आढावा',
    'Live Map': 'लाइव्ह नकाशा',
    Alerts: 'अलर्ट',
    Incidents: 'घटना',
    Analytics: 'विश्लेषण',
    'Citizen Reports': 'नागरिक अहवाल',
    'Response Center': 'प्रतिक्रिया केंद्र',
    Reports: 'अहवाल',
    Settings: 'सेटिंग्ज',
    Search: 'शोध',
    DMO: 'डीएमओ',
  },
  ta: {
    Overview: 'கண்ணோட்டம்',
    'Live Map': 'நேர வரைபடம்',
    Alerts: 'எச்சரிக்கைகள்',
    Incidents: 'நிகழ்வுகள்',
    Analytics: 'பகுப்பாய்வு',
    'Citizen Reports': 'சிவில் அறிக்கைகள்',
    'Response Center': 'பதில் மையம்',
    Reports: 'அறிக்கைகள்',
    Settings: 'செட்டிங்ஸ்',
    Search: 'தேடு',
    DMO: 'டிஎமओ',
  },
  te: {
    Overview: 'అవలోకనం',
    'Live Map': 'లైవ్ మ్యాప్',
    Alerts: 'అలర్ట్స్',
    Incidents: 'సంఘటనలు',
    Analytics: 'విశ్లేషణ',
    'Citizen Reports': 'పౌర నివేదికలు',
    'Response Center': 'రెస్పాన్స్ సెంటర్',
    Reports: 'నివేదికలు',
    Settings: 'సెట్టింగులు',
    Search: 'శోధించండి',
    DMO: 'డిఎమో',
  },
  kn: {
    Overview: 'ಅವಲೋಕನ',
    'Live Map': 'ಲೈವ್ ನಕ್ಷೆ',
    Alerts: 'ಎಚ್ಚರಿಕೆಗಳು',
    Incidents: 'ಘಟನೆಗಳು',
    Analytics: 'ವಿಶ್ಲೇಷಣೆ',
    'Citizen Reports': 'ನಾಗರಿಕ ವರದಿಗಳು',
    'Response Center': 'ಪ್ರತಿಕ್ರಿಯೆ ಕೇಂದ್ರ',
    Reports: 'ವರದಿಗಳು',
    Settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    Search: 'ಹುಡುಕಿ',
    DMO: 'ಡಿಎಂಒ',
  },
  ml: {
    Overview: 'അവലോകനം',
    'Live Map': 'തത്സമയ മാപ്പ്',
    Alerts: 'അലേർട്ടുകൾ',
    Incidents: 'സംഭവങ്ങൾ',
    Analytics: 'വിശകലനം',
    'Citizen Reports': 'പൗരൻറെ റിപ്പോർട്ടുകൾ',
    'Response Center': 'റസ്പോൺസ് സെന്റർ',
    Reports: 'റിപ്പോർട്ടുകൾ',
    Settings: 'ക്രമീകരണങ്ങൾ',
    Search: 'മാനെ',
    DMO: 'ഡി.എം.ഒ',
  },
  or: {
    Overview: 'ସର୍ବେଶ୍ୱର',
    'Live Map': 'ଲାଇଭ ମ୍ୟାପ୍',
    Alerts: 'ଆଲର୍ଟ୍',
    Incidents: 'ଘଟନା',
    Analytics: 'ବିଶ୍ଳେଷଣ',
    'Citizen Reports': 'ନାଗରିକ ରିପୋର୍ଟ',
    'Response Center': 'ପ୍ରତିକ୍ରିୟା କେନ୍ଦ୍ର',
    Reports: 'ରିପୋର୍ଟ',
    Settings: 'ସେଟିଙ୍ଗ',
    Search: 'ସନ୍ଧାନ',
    DMO: 'ଡି.ଏମ.ଓ.',
  },
  gu: {
    Overview: 'ઓવરવ્યુ',
    'Live Map': 'લાઇવ મૅપ',
    Alerts: 'અલર્ટ',
    Incidents: 'ઘટનાઓ',
    Analytics: 'વિશ્લેષણ',
    'Citizen Reports': 'નાગરિક રિપોર્ટ',
    'Response Center': 'પ્રતિક્રિયા કેન્દ્ર',
    Reports: 'રિપોર્ટ્સ',
    Settings: 'સેટિંગ્સ',
    Search: 'શોધો',
    DMO: 'ડીએમઓ',
  },
  as: {
    Overview: 'ওভারভিউ',
    'Live Map': 'লাইভ মেপ',
    Alerts: 'এলাৰ্ট',
    Incidents: 'ঘটনা',
    Analytics: 'বিশ্লেষণ',
    'Citizen Reports': 'সিটিজেন রিপোর্ট',
    'Response Center': 'প্ৰতিক্ৰিয়া কেন্দ্ৰ',
    Reports: 'ৰিপোৰ্ট',
    Settings: 'ছেটিংছ',
    Search: 'সন্ধান',
    DMO: 'ডিএমও',
  },
} as const;

const navItems = [
  { label: 'Overview', to: '/' },
  { label: 'Live Map', to: '/map' },
  { label: 'Alerts', to: '/alerts' },
  { label: 'Incidents', to: '/incidents' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Citizen Reports', to: '/citizen-reports' },
  { label: 'Response Center', to: '/response-center' },
  { label: 'Reports', to: '/reports' },
  { label: 'Settings', to: '/settings' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { language } = useAppContext();
  const translatedLabels = navLabelsByLanguage[language] ?? navLabelsByLanguage.en;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-lg">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 md:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20">
                <CloudSun size={20} />
              </div>
              <div>
                <div className="text-lg font-bold tracking-[0.18em] text-white">MAUSAMNET</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">INDIA</div>
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/70 p-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {translatedLabels[item.label as keyof typeof translatedLabels] ?? item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 sm:inline-flex"
            >
              <Search size={16} />
              {translatedLabels.Search}
            </button>
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-sky-500/40 hover:text-sky-300"
            >
              <Bell size={17} />
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">3</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/analytics')}
              className="hidden items-center justify-center rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200 md:inline-flex"
            >
              <Settings2 size={17} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-2 py-2 text-sm text-sky-100 md:px-3"
            >
              <UserCircle2 size={18} />
              <span className="hidden sm:inline">{translatedLabels.DMO}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="space-y-2 border-t border-slate-800 pb-4 pt-3 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {translatedLabels[item.label as keyof typeof translatedLabels] ?? item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
