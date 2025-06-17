import React, { useState, useEffect, useRef } from 'react';
import { Brain, Trophy, Clock, Zap, ChevronRight, RotateCcw, Star, Target, Flame } from 'lucide-react';

const AdvancedQuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState(new Set());
  const timerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Balanced question pool with medium to medium-high complexity
    // Comprehensive question pool with multiple sets for medium and hard difficulty
  const questionPool = [
    // Medium Set 1 - Original
    {
      question: "What programming language was originally called 'Oak' before being renamed?",
      options: ["Python", "Java", "C++", "JavaScript"],
      correct: 1,
      difficulty: "medium",
      explanation: "Java was originally called 'Oak' when it was developed by Sun Microsystems in the early 1990s."
    },
    {
      question: "Which planet in our solar system has the most moons?",
      options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
      correct: 1,
      difficulty: "medium",
      explanation: "Saturn has the most confirmed moons with over 80 satellites orbiting around it."
    },
    {
      question: "What does 'HTTP' stand for in web addresses?",
      options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "HyperText Transmission Protocol", "Home Transfer Text Protocol"],
      correct: 0,
      difficulty: "medium",
      explanation: "HTTP stands for HyperText Transfer Protocol, the foundation of data communication on the web."
    },
    {
      question: "Which chemical element has the symbol 'Au'?",
      options: ["Silver", "Aluminum", "Gold", "Argon"],
      correct: 2,
      difficulty: "medium",
      explanation: "Gold has the chemical symbol 'Au' which comes from the Latin word 'aurum' meaning gold."
    },
    {
      question: "What is the term for a word that reads the same forwards and backwards?",
      options: ["Anagram", "Palindrome", "Homophone", "Synonym"],
      correct: 1,
      difficulty: "medium",
      explanation: "A palindrome is a word, phrase, or sequence that reads the same backward as forward, like 'radar' or 'level'."
    },

    // Medium Set 2 - Technology & Computing
    {
      question: "Which design pattern ensures only one instance of a class exists?",
      options: ["Factory", "Singleton", "Observer", "Strategy"],
      correct: 1,
      difficulty: "medium",
      explanation: "The Singleton pattern ensures that only one instance of a class is created and provides global access to it."
    },
    {
      question: "What is the primary purpose of a compiler?",
      options: ["Execute code", "Debug programs", "Translate source code to machine code", "Manage memory"],
      correct: 2,
      difficulty: "medium",
      explanation: "A compiler translates high-level source code into machine code that can be executed by the computer's processor."
    },
    {
      question: "Which database concept ensures data integrity through relationships?",
      options: ["Indexing", "Normalization", "Encryption", "Backup"],
      correct: 1,
      difficulty: "medium",
      explanation: "Normalization is the process of organizing data to reduce redundancy and improve data integrity through proper relationships."
    },
    {
      question: "What does 'API' stand for in software development?",
      options: ["Application Programming Interface", "Advanced Programming Integration", "Automated Program Interpreter", "Application Process Interface"],
      correct: 0,
      difficulty: "medium",
      explanation: "API stands for Application Programming Interface, which defines how software components communicate with each other."
    },
    {
      question: "Which networking model has 7 layers?",
      options: ["TCP/IP Model", "OSI Model", "Internet Model", "Ethernet Model"],
      correct: 1,
      difficulty: "medium",
      explanation: "The OSI (Open Systems Interconnection) model has 7 layers, from Physical to Application layer."
    },

    // Medium Set 3 - Science & Nature
    {
      question: "What is the process by which plants convert sunlight into energy?",
      options: ["Respiration", "Photosynthesis", "Osmosis", "Transpiration"],
      correct: 1,
      difficulty: "medium",
      explanation: "Photosynthesis is the process where plants use sunlight, carbon dioxide, and water to create glucose and oxygen."
    },
    {
      question: "Which blood type is considered the universal donor?",
      options: ["A+", "AB+", "O-", "B-"],
      correct: 2,
      difficulty: "medium",
      explanation: "O- blood type is the universal donor because it lacks A, B, and Rh antigens, making it compatible with all blood types."
    },
    {
      question: "What is the speed of light in a vacuum?",
      options: ["299,792,458 m/s", "300,000,000 m/s", "186,000 miles/s", "All of the above"],
      correct: 0,
      difficulty: "medium",
      explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second, which is approximately 300,000 km/s or 186,000 miles/s."
    },
    {
      question: "Which organ system is responsible for filtering blood?",
      options: ["Digestive System", "Respiratory System", "Excretory System", "Circulatory System"],
      correct: 2,
      difficulty: "medium",
      explanation: "The excretory system, primarily through the kidneys, filters waste products and excess water from the blood."
    },
    {
      question: "What is the chemical formula for water?",
      options: ["HO", "H2O", "H2O2", "OH"],
      correct: 1,
      difficulty: "medium",
      explanation: "Water has the chemical formula H2O, consisting of two hydrogen atoms bonded to one oxygen atom."
    },

    // Medium Set 4 - History & Culture
    {
      question: "Which ancient wonder of the world was located in Alexandria?",
      options: ["Hanging Gardens", "Lighthouse of Alexandria", "Colossus of Rhodes", "Temple of Artemis"],
      correct: 1,
      difficulty: "medium",
      explanation: "The Lighthouse of Alexandria (Pharos of Alexandria) was one of the Seven Wonders of the Ancient World."
    },
    {
      question: "What does 'Renaissance' mean in French?",
      options: ["Revolution", "Rebirth", "Reform", "Recovery"],
      correct: 1,
      difficulty: "medium",
      explanation: "Renaissance means 'rebirth' in French, referring to the cultural revival of art, literature, and learning in Europe."
    },
    {
      question: "Which philosophical school was founded by Epicurus?",
      options: ["Stoicism", "Epicureanism", "Cynicism", "Skepticism"],
      correct: 1,
      difficulty: "medium",
      explanation: "Epicureanism was founded by Epicurus and emphasized the pursuit of happiness through simple pleasures and freedom from fear."
    },
    {
      question: "What is the study of flags called?",
      options: ["Heraldry", "Vexillology", "Cartography", "Iconography"],
      correct: 1,
      difficulty: "medium",
      explanation: "Vexillology is the study of flags, their history, symbolism, and usage."
    },
    {
      question: "Which empire was ruled by Hammurabi?",
      options: ["Egyptian", "Babylonian", "Persian", "Roman"],
      correct: 1,
      difficulty: "medium",
      explanation: "Hammurabi ruled the Babylonian Empire and is famous for creating one of the first written legal codes."
    },

    // Medium Set 5 - Mathematics & Logic
    {
      question: "What is the derivative of x² with respect to x?",
      options: ["x", "2x", "x²", "2"],
      correct: 1,
      difficulty: "medium",
      explanation: "Using the power rule, the derivative of x² is 2x¹ = 2x."
    },
    {
      question: "Which mathematical constant is approximately 2.718?",
      options: ["π (pi)", "e (Euler's number)", "φ (golden ratio)", "√2"],
      correct: 1,
      difficulty: "medium",
      explanation: "Euler's number (e) is approximately 2.71828 and is the base of natural logarithms."
    },
    {
      question: "What is the sum of interior angles in a hexagon?",
      options: ["540°", "720°", "900°", "1080°"],
      correct: 1,
      difficulty: "medium",
      explanation: "The sum of interior angles in a polygon is (n-2) × 180°. For a hexagon: (6-2) × 180° = 720°."
    },
    {
      question: "Which statistical measure is most affected by outliers?",
      options: ["Mean", "Median", "Mode", "Range"],
      correct: 0,
      difficulty: "medium",
      explanation: "The mean is most affected by outliers because it includes all values in its calculation, unlike median or mode."
    },
    {
      question: "What is the probability of getting heads twice in two coin flips?",
      options: ["1/2", "1/4", "1/3", "2/3"],
      correct: 1,
      difficulty: "medium",
      explanation: "The probability is (1/2) × (1/2) = 1/4 or 25%, since each coin flip is independent."
    },

    // Medium Set 6 - Geography & Earth Sciences
    {
      question: "Which layer of Earth's atmosphere contains the ozone layer?",
      options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
      correct: 1,
      difficulty: "medium",
      explanation: "The ozone layer is located in the stratosphere, approximately 15-35 km above Earth's surface."
    },
    {
      question: "What is the smallest country in the world by area?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correct: 1,
      difficulty: "medium",
      explanation: "Vatican City is the smallest country in the world with an area of just 0.17 square miles (0.44 km²)."
    },
    {
      question: "Which tectonic plate boundary type creates mountains?",
      options: ["Divergent", "Convergent", "Transform", "Lateral"],
      correct: 1,
      difficulty: "medium",
      explanation: "Convergent plate boundaries, where plates collide, create mountain ranges through compression and uplift."
    },
    {
      question: "What is the deepest point in Earth's oceans?",
      options: ["Puerto Rico Trench", "Mariana Trench", "Japan Trench", "Peru-Chile Trench"],
      correct: 1,
      difficulty: "medium",
      explanation: "The Mariana Trench in the Pacific Ocean is the deepest point, reaching about 36,200 feet (11,034 meters) deep."
    },
    {
      question: "Which desert is the largest hot desert in the world?",
      options: ["Gobi Desert", "Arabian Desert", "Sahara Desert", "Kalahari Desert"],
      correct: 2,
      difficulty: "medium",
      explanation: "The Sahara Desert in North Africa is the largest hot desert, covering approximately 9 million square kilometers."
    },

    // Hard Set 1 - Advanced Computing & Algorithms
    {
      question: "What is the worst-case time complexity of quicksort algorithm?",
      options: ["O(n log n)", "O(n²)", "O(log n)", "O(n)"],
      correct: 1,
      difficulty: "hard",
      explanation: "Quicksort has O(n²) worst-case complexity when the pivot is always the smallest or largest element, though average case is O(n log n)."
    },
    {
      question: "Which theorem states that every non-trivial zero of the Riemann zeta function has real part 1/2?",
      options: ["Fermat's Last Theorem", "Riemann Hypothesis", "Goldbach Conjecture", "Twin Prime Conjecture"],
      correct: 1,
      difficulty: "hard",
      explanation: "The Riemann Hypothesis is one of the most famous unsolved problems in mathematics, concerning the distribution of prime numbers."
    },
    {
      question: "In object-oriented programming, what does the Liskov Substitution Principle state?",
      options: ["Objects should be replaceable with instances of their subtypes", "Classes should have single responsibility", "Depend on abstractions, not concretions", "Open for extension, closed for modification"],
      correct: 0,
      difficulty: "hard",
      explanation: "The Liskov Substitution Principle states that objects of a superclass should be replaceable with objects of its subclasses without breaking the application."
    },
    {
      question: "What is the Byzantine Generals Problem in distributed computing?",
      options: ["Load balancing issue", "Consensus problem with faulty nodes", "Network partitioning", "Deadlock detection"],
      correct: 1,
      difficulty: "hard",
      explanation: "The Byzantine Generals Problem addresses achieving consensus in a distributed system where some nodes may be faulty or malicious."
    },
    {
      question: "Which data structure is used in Dijkstra's shortest path algorithm for efficient implementation?",
      options: ["Stack", "Queue", "Priority Queue", "Hash Table"],
      correct: 2,
      difficulty: "hard",
      explanation: "Dijkstra's algorithm uses a priority queue (min-heap) to efficiently select the next vertex with minimum distance."
    },

    // Hard Set 2 - Advanced Science & Physics
    {
      question: "What is the uncertainty principle in quantum mechanics?",
      options: ["Energy and time cannot be measured simultaneously", "Position and momentum cannot be precisely determined simultaneously", "Wave and particle nature are mutually exclusive", "Quantum states collapse upon observation"],
      correct: 1,
      difficulty: "hard",
      explanation: "Heisenberg's uncertainty principle states that position and momentum of a particle cannot both be precisely determined at the same time."
    },
    {
      question: "Which equation describes the relationship between energy and mass?",
      options: ["F = ma", "E = mc²", "E = hf", "PV = nRT"],
      correct: 1,
      difficulty: "hard",
      explanation: "Einstein's mass-energy equivalence equation E = mc² shows that mass and energy are interchangeable."
    },
    {
      question: "What is the second law of thermodynamics?",
      options: ["Energy cannot be created or destroyed", "Entropy of an isolated system always increases", "For every action, there is an equal and opposite reaction", "The internal energy of a system equals heat added minus work done"],
      correct: 1,
      difficulty: "hard",
      explanation: "The second law of thermodynamics states that the entropy of an isolated system always increases over time."
    },
    {
      question: "Which particle is responsible for the Higgs mechanism?",
      options: ["Photon", "Electron", "Higgs boson", "Neutrino"],
      correct: 2,
      difficulty: "hard",
      explanation: "The Higgs boson is the particle associated with the Higgs field, which gives mass to other particles through the Higgs mechanism."
    },
    {
      question: "What is the study of the motion of fluids called?",
      options: ["Thermodynamics", "Electromagnetism", "Fluid dynamics", "Quantum mechanics"],
      correct: 2,
      difficulty: "hard",
      explanation: "Fluid dynamics is the study of the motion of liquids and gases, including the forces acting on them."
    },

    // Hard Set 3 - Advanced Mathematics
    {
      question: "What is the integral of 1/x with respect to x?",
      options: ["x²/2", "ln|x| + C", "1/x² + C", "-1/x² + C"],
      correct: 1,
      difficulty: "hard",
      explanation: "The integral of 1/x is ln|x| + C, where C is the constant of integration and ln is the natural logarithm."
    },
    {
      question: "Which theorem connects differentiation and integration?",
      options: ["Pythagorean Theorem", "Fundamental Theorem of Calculus", "Green's Theorem", "Stokes' Theorem"],
      correct: 1,
      difficulty: "hard",
      explanation: "The Fundamental Theorem of Calculus establishes the relationship between differentiation and integration as inverse operations."
    },
    {
      question: "What is the determinant of a 2x2 matrix [[a,b],[c,d]]?",
      options: ["ad + bc", "ad - bc", "ac - bd", "ab - cd"],
      correct: 1,
      difficulty: "hard",
      explanation: "The determinant of a 2x2 matrix [[a,b],[c,d]] is ad - bc."
    },
    {
      question: "Which mathematical concept describes the rate of change of a function?",
      options: ["Integral", "Derivative", "Limit", "Series"],
      correct: 1,
      difficulty: "hard",
      explanation: "The derivative of a function describes its instantaneous rate of change at any given point."
    },
    {
      question: "What is the name of the sequence where each number is the sum of the two preceding ones?",
      options: ["Arithmetic sequence", "Geometric sequence", "Fibonacci sequence", "Harmonic sequence"],
      correct: 2,
      difficulty: "hard",
      explanation: "The Fibonacci sequence starts with 0, 1 and each subsequent number is the sum of the two preceding numbers: 0, 1, 1, 2, 3, 5, 8, 13..."
    },

    // Hard Set 4 - Philosophy & Logic
    {
      question: "What is the philosophical problem of induction?",
      options: ["The difficulty of proving universal statements from particular observations", "The conflict between free will and determinism", "The question of whether objective reality exists", "The problem of defining consciousness"],
      correct: 0,
      difficulty: "hard",
      explanation: "The problem of induction questions whether we can justifiably infer universal conclusions from particular observations or experiences."
    },
    {
      question: "Which philosopher proposed the categorical imperative?",
      options: ["John Stuart Mill", "Immanuel Kant", "Aristotle", "Friedrich Nietzsche"],
      correct: 1,
      difficulty: "hard",
      explanation: "Immanuel Kant proposed the categorical imperative as a way to determine the morality of actions based on universal principles."
    },
    {
      question: "What is the ship of Theseus paradox about?",
      options: ["The nature of time", "Personal identity and change", "The existence of God", "The meaning of life"],
      correct: 1,
      difficulty: "hard",
      explanation: "The Ship of Theseus paradox explores questions of identity: if all parts of an object are gradually replaced, is it still the same object?"
    },
    {
      question: "Which logical fallacy involves attacking the person rather than their argument?",
      options: ["Straw man", "Ad hominem", "False dichotomy", "Slippery slope"],
      correct: 1,
      difficulty: "hard",
      explanation: "Ad hominem is a logical fallacy where someone attacks the character of the person making an argument rather than addressing the argument itself."
    },
    {
      question: "What does 'cogito ergo sum' mean?",
      options: ["God is dead", "I think, therefore I am", "Life is suffering", "Knowledge is power"],
      correct: 1,
      difficulty: "hard",
      explanation: "'Cogito ergo sum' is René Descartes' famous philosophical proposition meaning 'I think, therefore I am.'"
    },

    // Hard Set 5 - Advanced History & Culture
    {
      question: "Which treaty ended the Thirty Years' War?",
      options: ["Treaty of Versailles", "Peace of Westphalia", "Treaty of Utrecht", "Congress of Vienna"],
      correct: 1,
      difficulty: "hard",
      explanation: "The Peace of Westphalia (1648) ended the Thirty Years' War and established the modern concept of national sovereignty."
    },
    {
      question: "What was the primary cause of the Bronze Age collapse?",
      options: ["Natural disasters", "Multiple factors including invasions and climate change", "Single massive war", "Economic depression"],
      correct: 1,
      difficulty: "hard",
      explanation: "The Bronze Age collapse (c. 1200 BCE) was likely caused by multiple factors including climate change, invasions by Sea Peoples, and internal conflicts."
    },
    {
      question: "Which economic theory suggests that government spending can stimulate economic growth during recessions?",
      options: ["Classical economics", "Keynesian economics", "Austrian economics", "Chicago school"],
      correct: 1,
      difficulty: "hard",
      explanation: "Keynesian economics, developed by John Maynard Keynes, advocates for government intervention through spending to manage economic cycles."
    },
    {
      question: "What is the difference between deductive and inductive reasoning?",
      options: ["Deductive goes from general to specific, inductive from specific to general", "Deductive uses emotions, inductive uses logic", "Deductive is faster, inductive is slower", "There is no difference"],
      correct: 0,
      difficulty: "hard",
      explanation: "Deductive reasoning starts with general principles and moves to specific conclusions, while inductive reasoning starts with specific observations and moves to general conclusions."
    },
    {
      question: "Which art movement was characterized by the use of geometric shapes and multiple perspectives?",
      options: ["Impressionism", "Surrealism", "Cubism", "Abstract Expressionism"],
      correct: 2,
      difficulty: "hard",
      explanation: "Cubism, developed by Pablo Picasso and Georges Braque, used geometric shapes and showed objects from multiple perspectives simultaneously."
    },

    // Hard Set 6 - Advanced Biology & Chemistry
    {
      question: "What is the central dogma of molecular biology?",
      options: ["DNA → RNA → Protein", "Protein → RNA → DNA", "RNA → DNA → Protein", "DNA → Protein → RNA"],
      correct: 0,
      difficulty: "hard",
      explanation: "The central dogma describes the flow of genetic information: DNA is transcribed to RNA, which is then translated to proteins."
    },
    {
      question: "Which type of chemical bond involves the sharing of electron pairs?",
      options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Van der Waals force"],
      correct: 1,
      difficulty: "hard",
      explanation: "Covalent bonds form when atoms share electron pairs to achieve stable electron configurations."
    },
    {
      question: "What is the pH of a neutral solution at 25°C?",
      options: ["0", "7", "14", "1"],
      correct: 1,
      difficulty: "hard",
      explanation: "At 25°C, pure water has a pH of 7, which is considered neutral (equal concentrations of H⁺ and OH⁻ ions)."
    },
    {
      question: "Which process do plants use to convert atmospheric nitrogen into ammonia?",
      options: ["Photosynthesis", "Nitrogen fixation", "Transpiration", "Cellular respiration"],
      correct: 1,
      difficulty: "hard",
      explanation: "Nitrogen fixation is the process by which atmospheric nitrogen (N₂) is converted into ammonia (NH₃) by specialized bacteria in plant"
    },
    {
      question: "What is the name of the enzyme that unwinds DNA during replication?",
      options: ["DNA polymerase", "DNA ligase", "Helicase", "Primase"],
      correct: 2,
      difficulty: "hard",
      explanation: "Helicase is the enzyme responsible for unwinding the double helix structure of DNA by breaking hydrogen bonds between base pairs, creating the replication fork where DNA synthesis can occur."
    }
  ]

  // Particle system for visual effects
  const createParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    setParticles(newParticles);
  };

  useEffect(() => {
    createParticles();
  }, []);

  // Sound effects
  const playSound = (isCorrect) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (isCorrect) {
        // Correct answer sound - pleasant chime
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
          
          oscillator.start(audioContext.currentTime + index * 0.1);
          oscillator.stop(audioContext.currentTime + 0.8);
        });
      } else {
        // Wrong answer sound - descending tone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };
  // Victory sound effect
  const playVictorySound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Victory fanfare - ascending triumph melody
      const victorySequence = [
        { freq: 392, time: 0, duration: 0.3 },     // G4
        { freq: 523.25, time: 0.3, duration: 0.3 }, // C5
        { freq: 659.25, time: 0.6, duration: 0.3 }, // E5
        { freq: 783.99, time: 0.9, duration: 0.6 }, // G5 (longer)
        { freq: 1046.5, time: 1.5, duration: 0.8 }, // C6 (finale)
      ];

      victorySequence.forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + note.time);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + note.time + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + note.duration);
        
        oscillator.start(audioContext.currentTime + note.time);
        oscillator.stop(audioContext.currentTime + note.time + note.duration);
      });
    } catch (error) {
      console.log('Audio not supported');
    }
  };
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !showAnswer) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing' && !showAnswer) {
      handleTimeout();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameState, showAnswer]);

  const handleTimeout = () => {
    playSound(false);
    setStreak(0);
    setShowAnswer(true);
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const getRandomQuestion = () => {
    const availableQuestions = questionPool.filter(q => !usedQuestions.has(q.question));
    
    if (availableQuestions.length === 0) {
      setUsedQuestions(new Set());
      return questionPool[Math.floor(Math.random() * questionPool.length)];
    }
    
    const filteredQuestions = difficulty === 'mixed' ? 
      availableQuestions : 
      availableQuestions.filter(q => q.difficulty === difficulty);
    
    const selectedQuestion = filteredQuestions.length > 0 ? 
      filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)] :
      availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    setUsedQuestions(prev => new Set([...prev, selectedQuestion.question]));
    return selectedQuestion;
  };

  const startGame = () => {
    setScore(0);
    setQuestionNumber(0);
    setStreak(0);
    setUsedQuestions(new Set());
    setGameState('playing');
    loadQuestion();
  };

  const loadQuestion = () => {
    setLoading(true);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeLeft(30);
    
    setTimeout(() => {
      const question = getRandomQuestion();
      setCurrentQuestion(question);
      setQuestionNumber(prev => prev + 1);
      setLoading(false);
    }, 500);
  };

  const handleAnswer = (answerIndex) => {
    if (showAnswer || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      playSound(true);
      const points = Math.ceil((timeLeft / 30) * 100 * (difficulty === 'hard' ? 1.5 : difficulty === 'medium' ? 1.2 : 1));
      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
    } else {
      playSound(false);
      setStreak(0);
    }
    
    setShowAnswer(true);
    setTimeout(() => {
      if (questionNumber >= 5) {
        setGameState('results');
        // Play victory sound when game completes
        setTimeout(() => playVictorySound(), 300);
      } else {
        nextQuestion();
      }
    }, 3000);
  };

  const nextQuestion = () => {
    loadQuestion();
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setQuestionNumber(0);
    setStreak(0);
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animation: `float ${particle.speed * 3}s ease-in-out infinite`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Brain className="text-6xl text-purple-400 mr-4" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                QuizKandula
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-semibold">
              Fuel your Brain
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-2">
              Challenge yourself with engaging knowledge questions spanning science, technology, philosophy, and beyond
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Configure Your Challenge</h2>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-3 font-semibold">Difficulty Level</label>
              <div className="grid grid-cols-2 gap-3">
                {['medium', 'hard', 'mixed'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      difficulty === diff
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {diff === 'medium' && <Target className="w-4 h-4 mr-2" />}
                      {diff === 'hard' && <Flame className="w-4 h-4 mr-2" />}
                      {diff === 'mixed' && <Zap className="w-4 h-4 mr-2" />}
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {bestStreak > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-700/30">
                <div className="flex items-center justify-center text-yellow-400">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Best Streak: {bestStreak}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group"
            >
              Begin Challenge
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with stats */}
          <div className="flex justify-between items-center mb-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{streak}</div>
                <div className="text-sm text-gray-400">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{questionNumber}/5</div>
                <div className="text-sm text-gray-400">Question</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                  {timeLeft}
                </div>
                <div className="text-sm text-gray-400 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Time Left
                </div>
              </div>
              
              <button
                onClick={resetGame}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center"
              >
                Quit Game
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
              {currentQuestion && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(currentQuestion.difficulty)} bg-gray-700/50`}>
                        {currentQuestion.difficulty.toUpperCase()}
                      </span>
                      <div className="w-full bg-gray-700 rounded-full h-2 ml-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(timeLeft / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white leading-relaxed">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  <div className="grid gap-4">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showAnswer || selectedAnswer !== null}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          showAnswer
                            ? index === currentQuestion.correct
                              ? 'border-green-500 bg-green-500/20 text-green-300'
                              : selectedAnswer === index
                                ? 'border-red-500 bg-red-500/20 text-red-300'
                                : 'border-gray-600 bg-gray-700/30 text-gray-400'
                            : selectedAnswer === index
                              ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                              : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-700/30'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-lg font-semibold mr-4 text-gray-400">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-lg">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {showAnswer && (
                    <div className="mt-6 p-4 bg-blue-900/30 rounded-xl border border-blue-700/30">
                      <div className="flex items-start">
                        <Star className="w-5 h-5 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-blue-300 mb-2">Explanation</h3>
                          <p className="text-gray-300">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 max-w-2xl w-full text-center">
        <Trophy className="text-6xl text-yellow-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Challenge Complete!</h1>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400">{score}</div>
            <div className="text-gray-400">Final Score</div>
          </div>
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="text-3xl font-bold text-yellow-400">{bestStreak}</div>
            <div className="text-gray-400">Best Streak</div>
          </div>
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-400">{Math.round((score / 500) * 100)}%</div>
            <div className="text-gray-400">Performance</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </button>
          <button
            onClick={resetGame}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Main Menu
          </button>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700/50">
        <p className="text-gray-400 text-base font-semibold">No neurons were harmed</p>
        <p className="text-gray-500 text-sm font-semibold">A Game By Harshavardhan Kandula</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedQuizApp;
