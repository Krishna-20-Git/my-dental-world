import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Smile,
  Menu,
  X,
  ChevronRight,
  UserCheck,
  Sparkles,
  Activity,
  Shield,
  Zap,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Send,
  User,
  Bot,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "https://my-dental-api.onrender.com/api";

// --- HERO IMAGES ---
const heroImages = [
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1920&q=80",
];

// --- 🤖 CHATBOT ---
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Dental Assistant. How can I help you?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages, isOpen]
  );

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, {
        message: userMsg.text,
      });

      setMessages((prev) => [
        ...prev,
        { text: res.data.reply || "I can help with that.", sender: "bot" },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm having trouble connecting. Please call +91 93422 58492.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white w-[340px] h-[480px] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col mb-4"
          >
            <div className="bg-teal-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Sparkles size={16} fill="white" />
                </div>
                <h4 className="font-bold text-sm">Dental AI</h4>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === "user"
                        ? "bg-slate-300"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User size={12} />
                    ) : (
                      <Bot size={14} />
                    )}
                  </div>
                  <div
                    className={`p-2 px-3 rounded-xl text-xs max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-slate-800 text-white"
                        : "bg-white border border-slate-200 text-slate-700 shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="text-xs text-slate-400 ml-4">Thinking...</div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSend}
              className="p-2 bg-white border-t border-slate-100 flex gap-2"
            >
              <input
                className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-xs outline-none"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-teal-600 text-white p-2 rounded-lg"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

// --- DATA ---
const locations = [
  {
    id: 1,
    title: "My Dental World Doddanekundi (Main)",
    address:
      "Shop No:50, A.N.M Krishna Reddy Layout, Chinnapanahalli, Doddanekundi Extn, Bengaluru - 560037. Landmark: Opp to Alpine Eco Apartment near to rainbow children hospital.",
    phone: "9342258492",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=My+Dental+World+Doddanekundi+Bengaluru",
  },
  {
    id: 2,
    title: "My Dental World Mahadevapura",
    address:
      "Shop No: 5, YSR skyline, Venkateshwara Layout, Chinappa Layout, Mahadevpura, Bengaluru, Karnataka 560048",
    phone: "7975424909",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=My+Dental+World+Mahadevapura",
  },
  {
    id: 3,
    title: "My Dental World Whitefield",
    address:
      "Shop No. 7, property no. 131, Ecc road, Pattanduru Agrahara village, next to Yuken India Ltd. Whitefield post, Bengaluru, Karnataka 560066, India",
    phone: "8105279462",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=My+Dental+World+Whitefield",
  },
  {
    id: 4,
    title: "My Dental World Medahalli",
    address:
      "No.42, kamashree layout, near big day super market, parvathinagar, medahalli, Bengaluru, Karnataka 560049, India",
    phone: "8147061084",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=My+Dental+World+Medahalli",
  },
];

const doctorsList = [
  {
    name: "Dr. Shailendra Jha",
    qual: "BDS, MRHS, FRHS",
    role: "Founder & Surgeon",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZoBK2E8NHzCTbs6814bMs5_7LNloulD8KWg&s",
    desc: "Dr. Shailendra Jha is a reputed Dental Surgeon in Bangalore. He graduated from the prestigious A.B.Shetty Dental College from Mangalore. He has more than 10 years of experience. His academic interests have kept him associated with some colleges as a visiting faculty too. Currently, he runs his own Multispeciality Dental Clinic at Kaggadasapura and at Doddanekundi extension apart from consulting at few major hospitals. His care and concern for the patients have always been appreciated by the people.",
  },
  {
    name: "Dr. Shruthi.K",
    qual: "BDS",
    role: "Dental Surgeon",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Y4F9aQSud_CYFRTpKz41ni27pCbVfnohzw&s",
    desc: "Dr. Shruthi.K is a dental surgeon graduated from the most reputed and prestigious institution GDCRI ( govt dental college and research institute) Bangalore. With more than 4 years of experience, she had worked as an intern in Victoria and KCG hospitals Bangalore, as a school dental health officer at Karuna trust Bangalore, and as an associate dentist at RGS dental clinic JP Nagar. She has a great experience in surgical dentistry, endodontics, and prosthesis with handling complicated cases. Her key of interest are the fields of advanced endodontics and laser dentistry. Her desire is to give the most comfortable, painless and the best dental treatment to her patients.",
  },
  {
    name: "Dr. Tijo George",
    qual: "BDS, MDS",
    role: "Senior Consultant",
    image:
      "http://www.mydentalworld.co.in/static/5be0a67a6e7bfd880fb33d1c_1be21ca0-ea1b-11e8-9142-859520b784a9New%20Project%20(69).jpg",
    desc: "Dr. Tijo George is a senior consultant with more than 8 years of experience. He completed his BDS from the famous Government dental college Kottayam and MDS from the prestigious GDC Calicut. Apart from being a staff at Shymala Reddy Dental College, Marathalli, Bangalore, he is actively engaged in consultations throughout Bangalore. His friendly, humble and down to earth attitude coupled with his excellent handwork makes him completely standout from others",
  },
  {
    name: "Dr. Shameel Ahmed Shariff",
    qual: "BDS, MDS",
    role: "Oral-Maxillofacial Surgeon",
    image:
      "http://www.mydentalworld.co.in/static/5be0a67a6e7bfd880fb33d1c_2bbdb670-ea1b-11e8-9142-859520b784a9New%20Project%20(65).jpg",
    desc: "Dr.Shameel Ahmed Shariff MDS., Oral-Maxillofacial Surgeon & Implantologist, Asst Prof Maaruti Dental College is a specialist consultant at our unit who specializes in removal of wisdom tooth, dentoalveolar surgeries, orofacial infections management, dental implants placement, direct and indirect sinus lift procedures. He is well known for empathetic management of his patients and has been a feather in our cap.",
  },
  {
    name: "Dr. Krishnand",
    qual: "BDS, MDS",
    role: "Periodontist",
    image:
      "http://www.mydentalworld.co.in/static/5be0a67a6e7bfd880fb33d1c_24d53810-ea1b-11e8-9142-859520b784a9New%20Project%20(67).jpg",
    desc: "Dr Krishnand Specialized in Gum (Periodontal) Infections, Laser Treatments, Oral Implantology, Facial Aesthetics, and Microsurgery. He has a nice knowledge of Oral Implants and Laser Technology. He holds the record of placing the highest number of Implants in India for his Thesis and also has many National and International publications to his name. He was awarded many awards for his contribution in the field of Periodontology and Implantology.",
  },
  {
    name: "Dr. Vidyanand Mandal",
    qual: "BDS",
    role: "Dental Professional",
    image:
      "http://www.mydentalworld.co.in/static/67d0b5aafc9515e80e0f9e7f_db925b10-ca7d-11f0-997e-affdcb41b063WhatsApp%20Image%202025-11-25%20at%2017.30.57_c80f0ecf.jpg",
    desc: "Dr. Vidyanand Mandal is a skilled dental professional with a Bachelor of Dental Surgery from Rajasthan University of Health Sciences and over 5 years of rich clinical experience. He is dedicated to delivering gentle, precise, and advanced dental treatments with a personal touch. At My Dental World, Dr. Mandal’s mission is to create healthy, confident, and beautiful smiles through compassionate care and modern technology.",
  },
];

const servicesList = [
  {
    id: 1,
    title: "Dental Implant",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy6sWV7Wi4v6fJ9Bm2H1dCwMxJs2TDMnmRFg&s",
    desc: "Dental implants are an aesthetically pleasing, highly functional, surgically placed solution to missing teeth. Implants have a success rate of 93 to over 98 per cent depending on the patient's overall health.",
    icon: <Activity />,
  },
  {
    id: 2,
    title: "Root Canal",
    image:
      "https://www.cedarbraefamilydental.ca/wp-content/uploads/2024/09/what-are-the-different-types-of-root-canal-treatment.jpg",
    desc: "It is used for treating oral pulp such as nerves, blood vessels and other soft tissues. When this pulp is irreversibly damaged, it is better to remove the source of pain or infection.",
    icon: <Shield />,
  },
  {
    id: 3,
    title: "Gum Therapy",
    image:
      "https://www.allsmilesdentalcenter.com/wp-content/uploads/gum-disease-2312.jpg",
    desc: "Healthy gums provide the support needed for your teeth to function as they should. We provide gum treatment by our specialist dentists to prevent inflammation, bleeding, and recession.",
    icon: <Heart />,
  },
  {
    id: 4,
    title: "Cavity Fillings",
    image:
      "https://www.ddsgroupnyc.com/wp-content/uploads/2025/09/AdultCavity-2880w.webp",
    desc: "Cavities or dental caries are the decayed areas of your teeth. We provide Full Mouth Rehabilitation where we treat cavity affected teeth and gums using high-quality fillings.",
    icon: <Zap />,
  },
  {
    id: 5,
    title: "Braces & Aligners",
    image:
      "https://www.vyomdentalcare.com/wp-content/uploads/2019/06/metal.jpg",
    desc: "For teeth and gum disorders, we use metal braces, ceramic braces, or lingual braces depending on their situation to straighten teeth and correct bite issues.",
    icon: <Star />,
  },
  {
    id: 6,
    title: "Extractions",
    image:
      "https://centraldentalcare.ie/wp-content/uploads/2023/07/Tooth-Extraction-Central-Dental-Care-Dublin.png",
    desc: "An extraction means to have a tooth removed, usually because of disease, trauma or crowding. We ensure your pain is minimal and the process is safe.",
    icon: <X />,
  },
  {
    id: 7,
    title: "Teeth Cleaning",
    image:
      "https://ik.imagekit.io/amddentalclinic/08bdff15-05ed-421e-a31d-477e02bcfabe-Teeth_Cleaning_fJgT6eYrK.jpg",
    desc: "Yellowness of teeth can be embarrassing. Our dentists provide essential cleaning treatments to remove stains and tartar for a brighter, healthier smile.",
    icon: <Sparkles />,
  },
  {
    id: 8,
    title: "Cad-Cam Crowns",
    image:
      "https://sa1s3optim.patientpop.com/filters:format(webp)/assets/production/practices/65ea8de1e69e69f8d64af07f2a941974be112852/images/2759249.jpeg",
    desc: "Crowns are made of a tooth-coloured material used for severely decayed teeth. We restore your teeth to their natural functionality and aesthetics.",
    icon: <CheckCircle />,
  },
  {
    id: 9,
    title: "Smile Design",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsK6qBEC1o7FN69KJ206xVmzEK8T8NoXy46w&s",
    desc: "If you face issues like chipped teeth or gaps, we provide effective Smile Makeover treatments including Veneers and Composite Bonding.",
    icon: <Smile />,
  },
  {
    id: 10,
    title: "Child Dental Care",
    image:
      "https://www.yashodahealthcare.com/blogs/wp-content/uploads/2022/01/stock-photo-dentist-examining-little-boy-s-teeth-in-clinic-663132562-1920w.jpg",
    desc: "Our pediatric dentist offers a wide range of treatment options, as well as expertise and training to care for your child’s teeth, gums, and mouth.",
    icon: <UserCheck />,
  },
];

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [branch, setBranch] = useState(1);
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Dental Implant",
  });

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentImage((p) => (p + 1) % heroImages.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- FETCH REAL SLOTS ---
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get(`${API_BASE}/appointments/slots`, {
          params: { date, branchId: branch },
        });

        let fetchedSlots = res.data || [];

        // CLIENT-SIDE SUNDAY GUARD
        const day = new Date(date).getDay();
        if (day === 0) {
          const allowed = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM"];
          fetchedSlots = fetchedSlots.filter((s) => allowed.includes(s.time));
        }
        setSlots(fetchedSlots);
      } catch (error) {
        console.error("Backend offline, loading fallback.");
        setSlots([]); // Empty state if backend dead
      }
    };
    fetchSlots();
  }, [date, branch]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIX: Added "/${selectedSlot._id}" to the URL to match the server's expectation
      await axios.post(`${API_BASE}/appointments/book/${selectedSlot._id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
      });

      setSlots(
        slots.map((s) =>
          s._id === selectedSlot._id ? { ...s, status: "booked" } : s
        )
      );
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Booking Failed. Please try again.");
    }
  };

  return (
    <div className="font-sans text-slate-700 bg-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Inter:wght@400;500;600&display=swap'); 
        h1, h2, h3, h4, h5, h6 { font-family: 'DM Sans', sans-serif; } 
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* --- FLOATING GLASS NAVBAR --- */}
      <nav
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 flex justify-center`}
      >
        <div
          className={`
          flex justify-between items-center px-6 py-3 rounded-full transition-all duration-300 shadow-2xl backdrop-blur-xl border border-white/10
          ${
            scrolled
              ? "bg-slate-900/80 w-[90%] md:w-[70%] text-white"
              : "bg-slate-900/30 w-[95%] text-white"
          }
        `}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-teal-500 p-2 rounded-full text-white shadow-lg shadow-teal-500/30">
              <Smile size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              My Dental<span className="text-teal-400">World</span>
            </span>
          </div>

          <div className="hidden md:flex gap-6 font-medium text-sm text-white/90">
            {["Home", "About", "Services", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-teal-400 hover:scale-105 transition-all"
              >
                {item}
              </a>
            ))}
          </div>

          <a
            href="#booking"
            className="hidden md:block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2 rounded-full text-sm font-bold transition transform hover:scale-105 shadow-lg shadow-teal-500/40 hover:shadow-teal-400/50"
          >
            Book Now
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 mx-6 bg-slate-900/95 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4 text-white md:hidden z-50">
            <a href="#home" onClick={() => setIsMenuOpen(false)}>
              Home
            </a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>
              About
            </a>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>
              Services
            </a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section
        id="home"
        className="relative h-[650px] flex items-center overflow-hidden bg-slate-900"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={heroImages[currentImage]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-20 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold text-teal-300 mb-6 shadow-sm backdrop-blur-sm">
              <CheckCircle size={14} className="text-teal-400" /> #1 Rated
              Dental Clinic
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 drop-shadow-xl">
              World-Class Care <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-500">
                For Your Smile.
              </span>
            </h1>
            <p className="text-lg text-slate-200 mb-8 leading-relaxed font-medium drop-shadow-md">
              Experience advanced dentistry in a safe, hygienic, and comfortable
              environment. Our team of specialists is dedicated to your perfect
              smile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#booking"
                className="bg-teal-500 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-teal-500/20 hover:bg-teal-600 transition text-center transform hover:-translate-y-1"
              >
                Book Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- WELCOME HOME SECTION --- */}
      <section id="home" className="relative py-24 bg-white overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Sparkles size={16} /> Welcome to Excellence
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Your Smile, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">
                  Our Passion.
                </span>
              </h1>

              {/* YOUR SPECIFIC TEXT */}
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                <span className="font-bold text-slate-800">
                  Welcome to My Dental World clinic!
                </span>{" "}
                Our patient-friendly environment specializes in Oral and Dental
                care and caters to a clientele that appreciates personalized,
                quality care from a dentist. You and your family can receive the
                highest level of treatment, all under one roof with the best
                hospitality and ambience.
              </p>

              {/* ADDED "RANDOM" CONTEXT TEXT */}
              <p className="text-slate-500 mb-8 leading-relaxed">
                We utilize state-of-the-art technology including digital X-rays
                and intraoral cameras to ensure precise diagnoses. Whether you
                need a routine checkup, cosmetic enhancement, or complex
                restoration, our team is dedicated to providing pain-free
                dentistry in a relaxing atmosphere.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:border-teal-500 hover:text-teal-600 transition"
                >
                  View Services
                </a>
              </div>
            </motion.div>

            {/* Right Column: Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80"
                    alt="Dental Clinic Interior"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover hover:scale-105 transition duration-500"
                  />
                  <div className="bg-teal-600 p-6 rounded-2xl shadow-lg text-white text-center">
                    <h3 className="text-4xl font-bold mb-1">10+</h3>
                    <p className="text-sm opacity-90">Years of Experience</p>
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white text-center">
                    <h3 className="text-4xl font-bold mb-1">5k+</h3>
                    <p className="text-sm opacity-90">Happy Patients</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
                    alt="Advanced Equipment"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-black mb-4"
            >
              World-Class Treatments
            </motion.h2>
            <div className="w-24 h-2 bg-teal-900 mx-auto rounded-full"></div>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {servicesList.map((service, i) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="group bg-gray-400 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-teal-500/50 transition-all duration-300 cursor-pointer shadow-2xl"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-90 group-hover:opacity-60 transition duration-500"></div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute bottom-4 left-6 z-20">
                    <div className="bg-teal-700 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-teal-600/40">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <div className="p-8 pt-4">
                  <p className="text-black text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- DOCTORS --- */}
      <section id="about" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-teal-600 font-bold tracking-wider uppercase text-sm">
              About Us
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-slate-900 mt-2 mb-4"
            >
              Meet Our Specialists
            </motion.h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              At My Dental World, we have curated an elite team of dental
              specialists, surgeons, and support staff. Together, we represent
              the pinnacle of expertise across every specialty of modern
              dentistry.
            </p>
          </div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {doctorsList.map((doc, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-64 overflow-hidden bg-slate-200 relative">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {doc.name}
                  </h3>
                  <p className="text-teal-600 font-medium text-sm mb-3">
                    {doc.qual}
                  </p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4 border-b border-slate-100 pb-4">
                    {doc.role}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {doc.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- BOOKING --- */}
      <section id="booking" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate-900 text-white rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-4">Book Appointment</h2>
            <p className="mb-8 text-slate-400">
              Select a clinic location and date to see available slots.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-2xl">
              <div className="flex-1 bg-slate-800 rounded-lg p-3 flex items-center gap-3">
                <MapPin className="text-teal-400" />
                <select
                  className="bg-transparent w-full outline-none text-white font-medium cursor-pointer"
                  value={branch}
                  onChange={(e) => setBranch(Number(e.target.value))}
                >
                  {locations.map((loc) => (
                    <option
                      key={loc.id}
                      value={loc.id}
                      className="text-slate-900"
                    >
                      {loc.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 bg-slate-800 rounded-lg p-3 flex items-center gap-3">
                <Calendar className="text-teal-400" />
                <input
                  type="date"
                  className="bg-transparent w-full outline-none text-white font-medium cursor-pointer"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-2xl">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <button
                    key={slot._id || slot.time}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setShowModal(true);
                    }}
                    disabled={slot.status === "booked"}
                    className={`py-3 rounded-lg font-bold transition ${
                      slot.status === "booked"
                        ? "bg-slate-800 text-slate-600 cursor-not-allowed line-through opacity-60"
                        : "bg-teal-500 hover:bg-teal-400 text-white transform hover:-translate-y-1"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))
              ) : (
                <div className="col-span-full text-red-300 font-medium py-4">
                  No slots available. (We close at 2:00 PM on Sundays)
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section
        id="contact"
        className="py-20 bg-slate-50 border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Our Clinic Locations
            </h2>
          </div>
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {locations.map((loc) => (
              <motion.div
                key={loc.id}
                variants={fadeInUp}
                className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:border-teal-400 transition-colors group flex flex-col h-full"
              >
                <h3 className="font-bold text-xl text-slate-900 mb-3">
                  {loc.title}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-grow">
                  {loc.address}
                </p>
                <div className="space-y-3 pt-6 border-t border-slate-100 mt-auto">
                  <a
                    href={`tel:${loc.phone}`}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-teal-600"
                  >
                    <Phone size={18} className="text-teal-500" /> {loc.phone}
                  </a>
                  <a
                    href={loc.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm font-bold text-teal-600 hover:underline"
                  >
                    <MapPin size={18} className="text-teal-500" /> Get
                    Directions
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full md:w-auto">
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <Clock size={16} /> Opening Hours
                </h4>
                <p>Mon-Sat: 10:00 AM – 09:00 PM</p>
                <p>Sun: 10:00 AM – 02:00 PM</p>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <a
                  href="mailto:jhashailendra1979@gmail.com"
                  className="flex items-center gap-2 hover:text-teal-600 transition"
                >
                  <Mail size={16} className="text-teal-600" />{" "}
                  jhashailendra1979@gmail.com
                </a>
                <div className="flex gap-4">
                  <a
                    href="tel:+919342258492"
                    className="flex items-center gap-2 hover:text-teal-600 transition"
                  >
                    <Phone size={16} className="text-teal-600" /> +91 9342258492
                  </a>
                  <a
                    href="tel:08049542289"
                    className="flex items-center gap-2 hover:text-teal-600 transition"
                  >
                    <Phone size={16} className="text-teal-600" /> 080-49542289
                  </a>
                </div>
              </div>
            </div>
            <p>© 2026 My Dental World. All Rights Reserved.</p>
          </div>
        </div>
      </section>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Confirm Booking
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {locations.find((l) => l.id === branch)?.title} - {date} at{" "}
                    {selectedSlot?.time}
                  </p>
                </div>
                <button onClick={() => setShowModal(false)}>
                  <X />
                </button>
              </div>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <input
                  required
                  placeholder="Name"
                  className="w-full p-3 border rounded-lg outline-none focus:border-teal-500 transition"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone"
                  className="w-full p-3 border rounded-lg outline-none focus:border-teal-500 transition"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg outline-none focus:border-teal-500 transition"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition"
                >
                  Confirm
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Chatbot />
    </div>
  );
}

export default App;
