import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            welcome: "Welcome to Thulir",
            subtitle: "Bridging Farms to Markets",
            login_as: "I want to join as",
            farmer: "Farmer",
            buyer: "Buyer",
            name_label: "Full Name / Organization",
            location_label: "Location",
            join_btn: "Join Marketplace",
            entering: "Entering...",
            logout: "Logout",
            voice_search: "Search with Voice",
            sms_demo: "SMS/IVR Demo",
            market_trends: "Market Trends",
            post_crop: "Post New Crop",
            buy_crop: "Buy Crops",
            language: "Language",
            speak_now: "Speak now",
            listening: "Listening...",
            crop_type: "Crop Type",
            quantity: "Quantity (kg/quintal)",
            quality: "Quality Grade",
            expected_price: "Expected Price (per unit)",
            harvest_date: "Harvest Date",
            submit_listing: "List Crop now",
            my_listings: "My Active Listings",
            no_listings: "No crops listed yet.",
            delete: "Remove",
            edit: "Update",
            grade_a: "Grade A (Premium)",
            grade_b: "Grade B (Standard)",
            grade_c: "Grade C (Processing)",
            available: "Available",
            sold: "Sold",
            post_demand: "Request Supplies",
            buyer_portal: "Buyer Dashboard",
            view_supply: "Farmer Marketplace",
            view_demand: "Buyer Demands",
            no_demands: "No requests found.",
            all_crops: "All Crops",
            all_locations: "All Locations",
            filter_by: "Filter by",
            search_placeholder: "Search crops...",
            urgent: "Urgent",
            normal: "Standard",
            entity_type: "Buyer Type",
            retailer: "Retailer",
            cooperative: "Cooperative",
            institutional: "Institutional",
            community: "Community Group"
        }
    },
    ta: {
        translation: {
            welcome: "துளிர்-க்கு வரவேற்கிறோம்",
            subtitle: "விவசாய நிலங்களை சந்தையுடன் இணைக்கிறது",
            login_as: "நான் இணைய விரும்புகிறேன்",
            farmer: "விவசாயி",
            buyer: "வாங்குபவர்",
            name_label: "பெயர் / நிறுவனம்",
            location_label: "இருப்பிடம்",
            join_btn: "சந்தையில் இணையுங்கள்",
            entering: "உள்ளே நுழைகிறது...",
            logout: "வெளியேறு",
            voice_search: "குரல் வழி தேடல்",
            sms_demo: "SMS/IVR டெமோ",
            market_trends: "சந்தை நிலவரம்",
            post_crop: "புதிய பயிரை பதிவிட",
            buy_crop: "பயிர்களை வாங்க",
            language: "மொழி",
            speak_now: "இப்போது பேசுங்கள்",
            listening: "கேட்கிறது...",
            crop_type: "பயிர் வகை",
            quantity: "அளவு",
            quality: "தரம்",
            expected_price: "எதிர்பார்க்கும் விலை",
            harvest_date: "அறுவடை தேதி",
            submit_listing: "பயிரை பதிவிடு",
            my_listings: "எனது பயிர்கள்",
            no_listings: "பயிர்கள் எதுவும் இல்லை",
            delete: "நீக்கு",
            edit: "திருத்து",
            grade_a: "தரம் A (சிறந்தது)",
            grade_b: "தரம் B (சாதாரணமானது)",
            grade_c: "தரம் C (தொழில்துறைக்கு)",
            available: "கிடைக்கக்கூடியது",
            sold: "விற்கப்பட்டது",
            post_demand: "தேவையை பதிவிட",
            buyer_portal: "வாங்குபவர் தளம்",
            view_supply: "விவசாயிகள் சந்தை",
            view_demand: "வாங்குபவர் தேவைகள்",
            no_demands: "தேவைகள் எதுவும் இல்லை",
            all_crops: "அனைத்து பயிர்கள்",
            all_locations: "அனைத்து இடங்கள்",
            filter_by: "வடிகட்ட",
            search_placeholder: "பயிர்களைத் தேடு...",
            urgent: "அவசரம்",
            normal: "சாதாரணமானது",
            entity_type: "வாங்குபவர் வகை",
            retailer: "சில்லறை விற்பனையாளர்",
            cooperative: "கூட்டுறவு சங்கம்",
            institutional: "நிறுவனம்",
            community: "சமூகக் குழு"
        }
    }
    // Hindi, Telugu, Kannada, Malayalam omitted for brevity but should be updated in final
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
