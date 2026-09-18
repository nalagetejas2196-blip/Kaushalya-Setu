// Rule-based Multilingual Skill Extraction Engine
// Grounded NLP matching for Marathi, Hindi, and English input

const SKILL_RULES = [
  {
    skill: "Agricultural Pump Troubleshooting",
    skill_mr: "कृषी पंप बिघाड दुरुस्ती",
    skill_hi: "कृषि पंप समस्या निवारण",
    keywords: [
      "pump", "pumps", "motor", "water pump", "submersible", "pipeline", "starter", "borewell",
      "पंप", "मोटार", "मोटर", "पाणी", "विहीर", "सबमर्सिबल", "पाईप", "स्टार्टर", "बोअरवेल", "शेतातला पंप",
      "पानी का पंप", "नलकूप", "पाइपलाइन", "स्टार्टर पैनल"
    ],
    category: "Agro-Mechanics",
    nsqf_pack: "AGR/Q1102 - Micro Irrigation & Pump Technician (Level 3)",
    default_confidence: 85,
    rationale: "Matched practical experience handling agricultural water lifting, motor sets or pump servicing."
  },
  {
    skill: "Basic Mechanical Repair",
    skill_mr: "मूलभूत यांत्रिक दुरुस्ती",
    skill_hi: "बुनियादी यांत्रिक मरम्मत",
    keywords: [
      "repair", "fix", "tractor", "spanner", "greasing", "engine", "bearing", "gear", "mechanic",
      "दुरुस्ती", "ट्रॅक्टर", "रिपेअर", "पाना", "नट", "बोल्ट", "इंजिन", "बेअरिंग", "यांत्रिक",
      "मरम्मत", "ट्रैक्टर", "रिंच", "पाना", "नट-बोल्ट", "इंजन", "मैकेनिक"
    ],
    category: "Mechanical & Automotive",
    nsqf_pack: "ASC/Q1901 - Automotive Service Assistant (Level 3)",
    default_confidence: 80,
    rationale: "Identified hands-on mechanical tooling, vehicle assistance, or machinery repair abilities."
  },
  {
    skill: "Basic Electrical Wiring",
    skill_mr: "मूलभूत विद्युत वायरिंग",
    skill_hi: "बुनियादी विद्युत वायरिंग",
    keywords: [
      "electric", "electrical", "wiring", "wire", "switch", "mcb", "fuse", "board", "phase", "shock", "tester",
      "इलेक्ट्रिक", "वायरिंग", "वायर", "स्वीच", "फ्युज", "विद्युत", "मीटर", "अर्थिंग", "टेस्टर",
      "बिजली", "वायरिंग", "तार", "स्विच", "फ्यूज", "एमसीबी", "अर्थिंग", "टेस्टर"
    ],
    category: "Electrical",
    nsqf_pack: "CON/Q0602 - Domestic Electrician (Level 3)",
    default_confidence: 75,
    rationale: "Detected experience in circuit testing, household wiring, or fuse and switchboard replacement."
  },
  {
    skill: "Hand Tool Handling",
    skill_mr: "हाताच्या उपकरणांचा वापर",
    skill_hi: "हस्त उपकरणों का संचालन",
    keywords: [
      "tools", "wrench", "pliers", "hammer", "drill", "screw", "spanner", "cutter",
      "साहित्य", "अवजारे", "पकड", "हातोडी", "पाना", "ड्रिल", "कटर",
      "औजार", "प्लास", "हथौड़ा", "ड्रिल मशीन", "पेचकस", "कटर"
    ],
    category: "General Technical",
    nsqf_pack: "General Engineering Foundation (Level 2/3)",
    default_confidence: 88,
    rationale: "Demonstrated familiar usage of workshop and field hand tools."
  },
  {
    skill: "Solar PV Array Mounting",
    skill_mr: "सोलर पीव्ही पॅनेल माउंटिंग",
    skill_hi: "सोलर पीवी पैनल माउंटिंग",
    keywords: [
      "solar", "solar panel", "sun power", "rooftop solar", "pv", "inverter", "kusum",
      "सोलर", "सौर ऊर्जा", "सौर पंप", "पॅनेल", "इन्व्हर्टर", "कुसुम",
      "सोलर पैनल", "सौर ऊर्जा", "इन्वर्टर", "सोलर पंप", "कुसुम योजना"
    ],
    category: "Renewable Energy",
    nsqf_pack: "SGJ/Q0101 - Solar PV Installation Technician (Level 4)",
    default_confidence: 80,
    rationale: "Extracted interest or exposure to solar panel installation, rooftop brackets, and DC connections."
  },
  {
    skill: "Industrial Sewing & Tailoring",
    skill_mr: "औद्योगिक शिलाई व टेलरिंग",
    skill_hi: "औद्योगिक सिलाई एवं टेलरिंग",
    keywords: [
      "tailor", "tailoring", "sewing", "stitch", "stitching", "cloth", "garment", "fabric", "machine",
      "शिलाई", "टेलर", "शिलाई मशीन", "कपडे", "कटिंग", "शिवणकाम", "गारमेंट",
      "सिलाई", "दर्जी", "कपड़ा", "सिलाई मशीन", "कटिंग", "वस्त्र निर्माण"
    ],
    category: "Apparel & Textiles",
    nsqf_pack: "AMH/Q1001 - Self Employed Tailor / Sewing Machine Operator (Level 3)",
    default_confidence: 85,
    rationale: "Extracted experience in pattern cutting, garment stitching, and sewing machine operation."
  },
  {
    skill: "Agricultural Drone Operations",
    skill_mr: "कृषी ड्रोन संचालन",
    skill_hi: "कृषि ड्रोन संचालन",
    keywords: [
      "drone", "flying", "spraying", "crop spray", "kisan drone", "camera", "remote",
      "ड्रोन", "फवारणी", "रिमोट", "कॅमेरा", "किटकनाशक", "स्मार्ट शेती",
      "ड्रोन", "छिड़काव", "रिमोट कंट्रोल", "कैमरा", "कीटनाशक छिड़काव"
    ],
    category: "Smart Agriculture",
    nsqf_pack: "AGR/Q4901 - Drone Remote Pilot for Agriculture (Level 4)",
    default_confidence: 82,
    rationale: "Detected familiarity with remote-controlled devices, drone spraying, or field telemetry."
  },
  {
    skill: "Digital Literacy & Computer Basics",
    skill_mr: "डिजिटल साक्षरता आणि संगणक ज्ञान",
    skill_hi: "डिजिटल साक्षरता एवं कंप्यूटर ज्ञान",
    keywords: [
      "computer", "laptop", "mscit", "typing", "excel", "internet", "online form", "data entry", "smartphone",
      "संगणक", "कॉम्प्युटर", "टायपिंग", "इंटरनेट", "फॉर्म भरणे", "एमएससीआयटी", "स्मार्टफोन",
      "कंप्यूटर", "टाइपिंग", "इंटरनेट", "एक्सेल", "डेटा एंट्री", "ऑनलाइन फॉर्म"
    ],
    category: "IT & Digital Services",
    nsqf_pack: "SSC/Q2212 - Domestic Data Entry Operator (Level 4)",
    default_confidence: 78,
    rationale: "Found competence in handling computers, keyboards, smartphones, and online service forms."
  }
];

function extractSkillsFromText(text = '') {
  const normalizedText = text.toLowerCase();
  const matchedSkills = [];

  for (const rule of SKILL_RULES) {
    const matchedKeywords = rule.keywords.filter(keyword =>
      normalizedText.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      // Calculate a dynamic score based on keyword depth
      const score = Math.min(95, rule.default_confidence + (matchedKeywords.length - 1) * 4);
      matchedSkills.push({
        name: rule.skill,
        name_mr: rule.skill_mr,
        name_hi: rule.skill_hi,
        level: score,
        category: rule.category,
        nsqf_pack: rule.nsqf_pack,
        matchedKeywords: matchedKeywords.slice(0, 3),
        rationale: rule.rationale,
        confirmed: true
      });
    }
  }

  // If no direct keyword matched, provide intelligent baseline suggestion
  if (matchedSkills.length === 0 && text.trim().length > 3) {
    matchedSkills.push({
      name: "Hand Tool Handling",
      name_mr: "हाताच्या उपकरणांचा वापर",
      name_hi: "हस्त उपकरणों का संचालन",
      level: 70,
      category: "General Technical",
      nsqf_pack: "General Engineering Foundation (Level 2/3)",
      matchedKeywords: ["practical work"],
      rationale: "Baseline technical aptitude identified from practical work context.",
      confirmed: false
    });
  }

  return matchedSkills;
}

module.exports = {
  extractSkillsFromText,
  SKILL_RULES
};
