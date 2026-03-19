import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Coffee, 
  Moon, 
  Sparkles, 
  Utensils, 
  Thermometer, 
  Smile, 
  Frown, 
  Zap, 
  ChevronRight,
  CheckCircle2,
  Gift,
  Info,
  Palette,
  Settings,
  Volume2,
  VolumeX,
  History,
  Trash2,
  Edit2,
  X,
  Share2,
  Volume1,
  Flame,
  Sun,
  Music,
  Plus,
  Upload,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Droplets,
  BarChart3,
  PieChart as PieChartIcon,
  Film
} from 'lucide-react';
import { Howl } from 'howler';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { cn } from './lib/utils';
import { getPamperingAdvice } from './services/geminiService';

const THEMES = [
  { 
    id: 'organic', 
    name: 'Warm Organic', 
    colors: { cream: '#f5f5f0', olive: '#5A5A40', rose: '#d4a373', ink: '#1a1a1a' } 
  },
  { 
    id: 'lavender', 
    name: 'Soft Lavender', 
    colors: { cream: '#f3f0f5', olive: '#6b5a8e', rose: '#a38dbd', ink: '#1a1a1a' } 
  },
  { 
    id: 'rose', 
    name: 'Muted Rose', 
    colors: { cream: '#f5f0f0', olive: '#8e5a5a', rose: '#bd8d8d', ink: '#1a1a1a' } 
  },
  { 
    id: 'midnight', 
    name: 'Midnight', 
    colors: { cream: '#1a1b1e', olive: '#4a5568', rose: '#718096', ink: '#f7fafc' } 
  },
];

interface PamperIdea {
  title: string;
  description: string;
  type?: 'care' | 'movie' | 'song';
}

const SYMPTOMS = [
  { id: 'cramps', label: 'Cramps', icon: Thermometer },
  { id: 'fatigue', label: 'Fatigue', icon: Moon },
  { id: 'headache', label: 'Headache', icon: Zap },
  { id: 'cravings', label: 'Cravings', icon: Utensils },
  { id: 'bloating', label: 'Bloating', icon: Sparkles },
];

const MOODS = [
  { id: 'happy', label: 'Happy', icon: Sun },
  { id: 'okay', label: 'Doing Okay', icon: Smile },
  { id: 'sad', label: 'Sensitive', icon: Frown },
  { id: 'irritable', label: 'Irritable', icon: Zap },
  { id: 'angry', label: 'Angry', icon: Flame },
  { id: 'tired', label: 'Exhausted', icon: Moon },
];

const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Rain', url: 'https://assets.mixkit.co/music/preview/mixkit-rain-and-thunder-ambience-31.mp3' },
  { id: 'forest', name: 'Forest', url: 'https://assets.mixkit.co/music/preview/mixkit-forest-ambience-1215.mp3' },
  { id: 'waves', name: 'Waves', url: 'https://assets.mixkit.co/music/preview/mixkit-sea-waves-ambience-1185.mp3' },
  { id: 'white-noise', name: 'White Noise', url: 'https://assets.mixkit.co/music/preview/mixkit-white-noise-static-2947.mp3' },
];

const CARE_ITEMS = [
  { id: 'chocolate', label: 'Dark Chocolate', category: 'Food' },
  { id: 'heatpad', label: 'Heating Pad', category: 'Comfort' },
  { id: 'tea', label: 'Herbal Tea', category: 'Drink' },
  { id: 'socks', label: 'Fuzzy Socks', category: 'Comfort' },
  { id: 'movie', label: 'Comfort Movie', category: 'Activity' },
  { id: 'flowers', label: 'Fresh Flowers', category: 'Gift' },
];

interface Cycle {
  id: string;
  startDate: string;
  endDate?: string;
  ovulationDate?: string;
}

const MOOD_COLORS: Record<string, string> = {
  happy: '#FF69B4',
  okay: '#98FB98',
  sad: '#ADD8E6',
  irritable: '#FFA500',
  angry: '#FF4500',
  tired: '#DDA0DD',
  default: '#d4a373'
};

const FloatingHearts = ({ moodId }: { moodId: string }) => {
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; size: number }[]>([]);
  const color = MOOD_COLORS[moodId] || MOOD_COLORS.default;

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 20 + 10
    }));
    setHearts(newHearts);
  }, [moodId]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={`${moodId}-${heart.id}`}
            initial={{ y: '110vh', x: `${heart.x}vw`, opacity: 0, scale: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.5, 1, 1, 0.5],
              x: [
                `${heart.x}vw`, 
                `${heart.x + (Math.random() * 10 - 5)}vw`, 
                `${heart.x + (Math.random() * 10 - 5)}vw`, 
                `${heart.x}vw`
              ]
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear"
            }}
            className="absolute"
          >
            <motion.div
              animate={{ 
                rotateY: [0, 60, 0],
                scaleX: [1, 0.6, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart 
                size={heart.size} 
                fill={color} 
                stroke={color} 
                className="drop-shadow-sm opacity-60"
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'care' | 'calendar' | 'dashboard'>('care');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [advice, setAdvice] = useState<PamperIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [showThemes, setShowThemes] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientSound, setAmbientSound] = useState<Howl | null>(null);
  const [currentAmbientUrl, setCurrentAmbientUrl] = useState(AMBIENT_SOUNDS[0].url);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [moodHistory, setMoodHistory] = useState<{ date: string; mood: string; symptoms: string[]; completedItems: string[] }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [greeting, setGreeting] = useState("Thinking of you today.");
  const [isEditingGreeting, setIsEditingGreeting] = useState(false);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Initialize ambient sound
  useEffect(() => {
    if (ambientSound) {
      ambientSound.unload();
    }

    const sound = new Howl({
      src: [currentAmbientUrl],
      loop: true,
      volume: 0.3,
      onload: () => {
        if (isAmbientPlaying) sound.play();
      }
    });
    setAmbientSound(sound);

    return () => {
      sound.unload();
    };
  }, [currentAmbientUrl]);

  // Initial load for history, greeting and cycles
  useEffect(() => {
    // Load history
    const saved = localStorage.getItem('mood_history');
    if (saved) setMoodHistory(JSON.parse(saved));

    // Load greeting
    const savedGreeting = localStorage.getItem('app_greeting');
    if (savedGreeting) setGreeting(savedGreeting);

    // Load cycles
    const savedCycles = localStorage.getItem('cycle_history');
    if (savedCycles) setCycles(JSON.parse(savedCycles));
  }, []);

  const saveCycles = (newCycles: Cycle[]) => {
    setCycles(newCycles);
    localStorage.setItem('cycle_history', JSON.stringify(newCycles));
  };

  const saveGreeting = (newGreeting: string) => {
    setGreeting(newGreeting);
    localStorage.setItem('app_greeting', newGreeting);
  };

  const speakStatus = () => {
    if (!selectedMood && selectedSymptoms.length === 0) return;
    
    const moodLabel = MOODS.find(m => m.id === selectedMood)?.label || 'neutral';
    const symptomsLabels = selectedSymptoms.map(s => SYMPTOMS.find(sym => sym.id === s)?.label).join(', ');
    
    const text = `I am feeling ${moodLabel} today. ${selectedSymptoms.length > 0 ? `My symptoms are ${symptomsLabels}.` : ''}`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
    playClick();
  };

  const shareStatus = async () => {
    if (!selectedMood && selectedSymptoms.length === 0) return;
    
    const moodLabel = MOODS.find(m => m.id === selectedMood)?.label || 'neutral';
    const symptomsLabels = selectedSymptoms.map(s => SYMPTOMS.find(sym => sym.id === s)?.label).join(', ');
    
    const text = `Cycle Update: I'm feeling ${moodLabel} today. ${selectedSymptoms.length > 0 ? `Symptoms: ${symptomsLabels}.` : ''} ❤️`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cycle Update',
          text: text,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback to copy
      navigator.clipboard.writeText(text);
      alert('Status copied to clipboard!');
    }
    playClick();
  };

  const toggleAmbient = () => {
    if (!ambientSound) return;
    if (isAmbientPlaying) {
      ambientSound.pause();
    } else {
      ambientSound.play();
    }
    setIsAmbientPlaying(!isAmbientPlaying);
  };

  const handleCustomSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentAmbientUrl(url);
      setIsAmbientPlaying(true);
      setShowSoundMenu(false);
      playClick();
    }
  };

  const playClick = () => {
    const click = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-simple-soft-click-2709.mp3'],
      volume: 0.5,
    });
    click.play();
  };

  const saveToHistory = () => {
    if (!selectedMood && selectedSymptoms.length === 0) return;
    
    const entry = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      symptoms: [...selectedSymptoms],
      completedItems: [...checklist],
    };
    
    const newHistory = [entry, ...moodHistory].slice(0, 20);
    setMoodHistory(newHistory);
    localStorage.setItem('mood_history', JSON.stringify(newHistory));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-cream', currentTheme.colors.cream);
    root.style.setProperty('--accent-primary', currentTheme.colors.olive);
    root.style.setProperty('--accent-secondary', currentTheme.colors.rose);
    root.style.setProperty('--text-main', currentTheme.colors.ink);
  }, [currentTheme]);

  const toggleSymptom = (id: string) => {
    playClick();
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleChecklist = (id: string) => {
    playClick();
    setChecklist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const generateAdvice = async () => {
    playClick();
    saveToHistory();
    setLoading(true);
    const result = await getPamperingAdvice(selectedSymptoms, selectedMood);
    setAdvice(result as PamperIdea[]);
    setLoading(false);
    setStep(3);
  };

  const toggleDay = (day: Date) => {
    playClick();
    const dayStr = day.toISOString();
    const existingCycleIndex = cycles.findIndex(c => 
      isSameDay(parseISO(c.startDate), day) || 
      (c.endDate && isWithinInterval(day, { start: parseISO(c.startDate), end: parseISO(c.endDate) }))
    );

    if (existingCycleIndex > -1) {
      const cycle = cycles[existingCycleIndex];
      if (isSameDay(parseISO(cycle.startDate), day)) {
        // Remove cycle if clicking start date
        const newCycles = cycles.filter((_, i) => i !== existingCycleIndex);
        saveCycles(newCycles);
      } else {
        // Update end date
        const newCycles = [...cycles];
        newCycles[existingCycleIndex] = { ...cycle, endDate: dayStr };
        saveCycles(newCycles);
      }
    } else {
      // Create new cycle
      const newCycle: Cycle = {
        id: Math.random().toString(36).substr(2, 9),
        startDate: dayStr,
      };
      saveCycles([...cycles, newCycle]);
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "MMMM yyyy";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isPeriod = cycles.some(c => {
          const start = parseISO(c.startDate);
          const end = c.endDate ? parseISO(c.endDate) : start;
          return isWithinInterval(cloneDay, { start, end });
        });

        const isStart = cycles.some(c => isSameDay(parseISO(c.startDate), cloneDay));
        const isEnd = cycles.some(c => c.endDate && isSameDay(parseISO(c.endDate), cloneDay));

        days.push(
          <div
            className={cn(
              "relative h-14 sm:h-20 flex flex-col items-center justify-center cursor-pointer transition-all rounded-xl",
              !isSameMonth(day, monthStart) ? "opacity-20" : "opacity-100",
              isPeriod ? "bg-brand-rose/20 text-brand-rose" : "hover:bg-brand-olive/5",
              isStart && "bg-brand-rose text-white",
              isEnd && "bg-brand-rose/60 text-white"
            )}
            key={day.toString()}
            onClick={() => toggleDay(cloneDay)}
          >
            <span className="text-sm font-medium z-10">{formattedDate}</span>
            {isStart && <div className="absolute -top-1 -right-1"><Droplets className="w-3 h-3 fill-current" /></div>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-3xl font-serif">{format(currentMonth, dateFormat)}</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => { playClick(); setCurrentMonth(subMonths(currentMonth, 1)); }}
              className="p-2 rounded-full hover:bg-brand-olive/5 text-brand-olive"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => { playClick(); setCurrentMonth(addMonths(currentMonth, 1)); }}
              className="p-2 rounded-full hover:bg-brand-olive/5 text-brand-olive"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 px-2">
          {daysOfWeek.map(d => (
            <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-brand-olive/40 py-2">
              {d}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          {rows}
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-serif text-xl">Calendar Guide</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-brand-rose" />
              <span className="text-sm text-brand-olive/70">Period Start</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-brand-rose/20" />
              <span className="text-sm text-brand-olive/70">Period Days</span>
            </div>
          </div>
          <p className="text-xs text-brand-olive/50 italic leading-relaxed">
            Tap a date to mark the start of a cycle. Tap another date within or after to set the end date. Tap the start date again to remove the entry.
          </p>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    // Process data for charts
    const moodCounts = moodHistory.reduce((acc: any, entry) => {
      const mood = entry.mood || 'neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    const moodData = Object.entries(moodCounts).map(([name, value]) => ({
      name: MOODS.find(m => m.id === name)?.label || name,
      value
    }));

    const symptomCounts = moodHistory.reduce((acc: any, entry) => {
      entry.symptoms.forEach(s => {
        acc[s] = (acc[s] || 0) + 1;
      });
      return acc;
    }, {});

    const symptomData = Object.entries(symptomCounts)
      .map(([name, value]) => ({
        name: SYMPTOMS.find(s => s.id === name)?.label || name,
        value
      }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5);

    const totalCareItems = moodHistory.reduce((acc, entry) => acc + (entry.completedItems?.length || 0), 0);

    const COLORS = [currentTheme.colors.olive, currentTheme.colors.rose, '#8884d8', '#82ca9d', '#ffc658'];

    return (
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-3xl font-serif">Care Dashboard</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-olive/10 text-brand-olive text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> {totalCareItems} Items Completed
          </div>
        </div>

        <div className="grid gap-6">
          {/* Mood Distribution */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-brand-olive" />
              <h3 className="font-serif text-xl">Mood Balance</h3>
            </div>
            <div className="h-64 w-full">
              {moodData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: currentTheme.colors.cream, 
                        border: `1px solid ${currentTheme.colors.olive}20`,
                        borderRadius: '12px',
                        fontFamily: 'serif'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-brand-olive/40 italic">
                  Log some moods to see your distribution
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {moodData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-medium text-brand-olive/70">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Symptoms */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-olive" />
              <h3 className="font-serif text-xl">Top Symptoms</h3>
            </div>
            <div className="h-64 w-full">
              {symptomData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={symptomData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={currentTheme.colors.olive + '10'} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: currentTheme.colors.olive, fontSize: 12, fontFamily: 'serif' }}
                      width={80}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ 
                        backgroundColor: currentTheme.colors.cream, 
                        border: `1px solid ${currentTheme.colors.olive}20`,
                        borderRadius: '12px',
                        fontFamily: 'serif'
                      }} 
                    />
                    <Bar dataKey="value" fill={currentTheme.colors.rose} radius={[0, 10, 10, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-brand-olive/40 italic">
                  Log your symptoms to see trends
                </div>
              )}
            </div>
          </div>

          {/* Care Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-olive/60">Total Logs</p>
              <p className="text-4xl font-serif text-brand-olive">{moodHistory.length}</p>
            </div>
            <div className="glass-card p-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-olive/60">Cycles Tracked</p>
              <p className="text-4xl font-serif text-brand-olive">{cycles.length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-32">
      <FloatingHearts moodId={selectedMood} />
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center relative">
        <div className="absolute top-12 right-6 flex gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              onContextMenu={(e) => {
                e.preventDefault();
                toggleAmbient();
              }}
              className={cn(
                "p-2 rounded-full transition-colors",
                isAmbientPlaying ? "bg-brand-olive text-white" : "bg-white/50 hover:bg-white text-brand-olive"
              )}
              title="Ambient Sounds (Right click to toggle)"
            >
              <Music className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showSoundMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 right-0 glass-card p-4 z-50 flex flex-col gap-2 min-w-[200px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-olive/60">Ambience</p>
                    <button 
                      onClick={toggleAmbient}
                      className="text-brand-olive hover:text-brand-rose transition-colors"
                    >
                      {isAmbientPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {AMBIENT_SOUNDS.map(sound => (
                    <button
                      key={sound.id}
                      onClick={() => {
                        setCurrentAmbientUrl(sound.url);
                        setIsAmbientPlaying(true);
                        setShowSoundMenu(false);
                        playClick();
                      }}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-xl transition-all text-left",
                        currentAmbientUrl === sound.url ? "bg-brand-olive text-white" : "hover:bg-brand-olive/5"
                      )}
                    >
                      <span className="text-sm font-medium">{sound.name}</span>
                    </button>
                  ))}

                  <div className="border-t border-brand-olive/10 mt-2 pt-2">
                    <label className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-olive/5 cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-brand-olive" />
                      <span className="text-sm font-medium">Upload Custom</span>
                      <input 
                        type="file" 
                        accept="audio/*" 
                        className="hidden" 
                        onChange={handleCustomSoundUpload}
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowThemes(!showThemes)}
            className="p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
            title="Change Theme"
          >
            <Palette className="w-5 h-5 text-brand-olive" />
          </button>
        </div>

        <AnimatePresence>
          {showThemes && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-24 right-6 glass-card p-4 z-50 flex flex-col gap-2 min-w-[160px]"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-brand-olive/60 mb-1">Select Theme</p>
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setCurrentTheme(theme);
                    setShowThemes(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-xl transition-all text-left",
                    currentTheme.id === theme.id ? "bg-brand-olive text-white" : "hover:bg-brand-olive/5"
                  )}
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20" 
                    style={{ backgroundColor: theme.colors.olive }}
                  />
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-rose/20 text-brand-rose text-sm font-medium mb-4"
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>Care Companion</span>
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4 tracking-tight">
          Cycle Care <span className="italic">&</span> Pamper
        </h1>
        
        <div className="relative group max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {isEditingGreeting ? (
              <motion.div
                key="edit-greeting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <input
                  autoFocus
                  type="text"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  onBlur={() => setIsEditingGreeting(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingGreeting(false)}
                  className="w-full bg-white/50 border-b border-brand-olive px-2 py-1 font-serif text-lg italic text-center focus:outline-none"
                />
                <button onClick={() => setIsEditingGreeting(false)} className="text-brand-olive">
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="view-greeting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2"
              >
                <p className="text-brand-olive/70 font-serif text-lg italic">
                  {greeting}
                </p>
                <button 
                  onClick={() => setIsEditingGreeting(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-olive/40 hover:text-brand-olive"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {view === 'calendar' ? (
            <motion.section
              key="calendar-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderCalendar()}
            </motion.section>
          ) : view === 'dashboard' ? (
            <motion.section
              key="dashboard-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderDashboard()}
            </motion.section>
          ) : (
            <>
          {step === 1 && (
            <motion.section 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif">How is she feeling?</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={speakStatus}
                    disabled={!selectedMood && selectedSymptoms.length === 0}
                    className="text-brand-olive/60 hover:text-brand-olive transition-colors disabled:opacity-30"
                    title="Speak Status"
                  >
                    <Volume1 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={shareStatus}
                    disabled={!selectedMood && selectedSymptoms.length === 0}
                    className="text-brand-olive/60 hover:text-brand-olive transition-colors disabled:opacity-30"
                    title="Share Status"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs font-bold uppercase tracking-widest text-brand-olive/60 flex items-center gap-1 hover:text-brand-olive transition-colors"
                  >
                    <History className="w-3 h-3" /> History
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showHistory && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-card p-4 space-y-3 mb-4">
                      <div className="flex items-center justify-between border-b border-brand-olive/10 pb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-olive/60">Recent Logs</span>
                        <button 
                          onClick={() => {
                            setMoodHistory([]);
                            localStorage.removeItem('mood_history');
                          }}
                          className="text-brand-rose hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {moodHistory.length === 0 ? (
                        <p className="text-sm italic text-brand-olive/40 py-2">No logs yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {moodHistory.map((entry, i) => (
                            <div key={i} className="flex justify-between items-start text-sm">
                              <div>
                                <span className="font-medium text-brand-olive">{entry.mood || 'Neutral'}</span>
                                <p className="text-[10px] text-brand-olive/40">{entry.symptoms.join(', ')}</p>
                              </div>
                              <span className="text-[10px] text-brand-olive/40">{entry.date}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SYMPTOMS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleSymptom(s.id)}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all",
                        selectedSymptoms.includes(s.id) 
                          ? "bg-brand-olive border-brand-olive text-white shadow-lg" 
                          : "bg-white border-brand-olive/10 text-brand-olive hover:border-brand-olive/30"
                      )}
                    >
                      <s.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-serif">What's her mood like?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        playClick();
                        setSelectedMood(m.id);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all",
                        selectedMood === m.id 
                          ? "bg-brand-olive border-brand-olive text-white shadow-lg" 
                          : "bg-white border-brand-olive/10 text-brand-olive hover:border-brand-olive/30"
                      )}
                    >
                      <m.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  playClick();
                  setStep(2);
                }}
                disabled={selectedSymptoms.length === 0 && !selectedMood}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-serif">Quick Care Checklist</h2>
                <p className="text-sm text-brand-olive/60 italic">Essential items you can gather right now.</p>
                <div className="grid gap-3">
                  {CARE_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                        checklist.includes(item.id)
                          ? "bg-brand-olive/5 border-brand-olive/20"
                          : "bg-white border-brand-olive/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {checklist.includes(item.id) ? (
                          <CheckCircle2 className="w-5 h-5 text-brand-olive" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-brand-olive/20" />
                        )}
                        <span className={cn(
                          "font-medium",
                          checklist.includes(item.id) && "line-through text-brand-olive/40"
                        )}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-xs uppercase tracking-widest text-brand-olive/40 font-bold">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => {
                  playClick();
                  setStep(1);
                }} className="flex-1 btn-secondary">Back</button>
                <button 
                  onClick={generateAdvice} 
                  className="flex-[2] btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? "Thinking..." : "Get Personalized Ideas"} <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-serif">Your Care Plan</h2>
                  <button 
                    onClick={() => {
                      playClick();
                      setStep(1);
                    }}
                    className="text-brand-olive text-sm font-medium underline underline-offset-4"
                  >
                    Start Over
                  </button>
                </div>

                <div className="grid gap-6">
                  {advice.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card p-6 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        {item.type === 'movie' ? <Film className="w-12 h-12" /> : item.type === 'song' ? <Music className="w-12 h-12" /> : <Gift className="w-12 h-12" />}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === 'movie' && <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-olive text-white px-2 py-0.5 rounded-full">Bollywood Pick</span>}
                        {item.type === 'song' && <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-rose text-white px-2 py-0.5 rounded-full">Melody for Her</span>}
                        <h3 className="text-xl font-serif text-brand-olive">{item.title}</h3>
                      </div>
                      <p className="text-brand-ink/80 leading-relaxed font-serif text-lg italic">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 rounded-3xl bg-brand-olive text-white space-y-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    <h4 className="font-serif text-lg">Pro Tip</h4>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed italic">
                    "Sometimes the best pampering isn't a gift, but just being there. 
                    Ask her 'What can I do to make this easier for you?' or simply 
                    take over some of her chores without being asked."
                  </p>
                </div>
              </div>
            </motion.section>
          )}
          </>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Nav (Mobile style) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md glass-card p-2 flex items-center justify-around z-50">
        <button 
          onClick={() => { playClick(); setView('care'); setStep(1); }}
          className={cn(
            "p-3 rounded-2xl transition-all",
            view === 'care' && step === 1 ? "bg-brand-olive text-white" : "text-brand-olive hover:bg-brand-olive/5"
          )}
        >
          <Smile className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { playClick(); setView('calendar'); }}
          className={cn(
            "p-3 rounded-2xl transition-all",
            view === 'calendar' ? "bg-brand-olive text-white" : "text-brand-olive hover:bg-brand-olive/5"
          )}
        >
          <CalendarIcon className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { playClick(); setView('dashboard'); }}
          className={cn(
            "p-3 rounded-2xl transition-all",
            view === 'dashboard' ? "bg-brand-olive text-white" : "text-brand-olive hover:bg-brand-olive/5"
          )}
        >
          <BarChart3 className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { playClick(); setView('care'); setStep(2); }}
          className={cn(
            "p-3 rounded-2xl transition-all",
            view === 'care' && step === 2 ? "bg-brand-olive text-white" : "text-brand-olive hover:bg-brand-olive/5"
          )}
        >
          <Gift className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { playClick(); setView('care'); setStep(3); }}
          className={cn(
            "p-3 rounded-2xl transition-all",
            view === 'care' && step === 3 ? "bg-brand-olive text-white" : "text-brand-olive hover:bg-brand-olive/5"
          )}
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
