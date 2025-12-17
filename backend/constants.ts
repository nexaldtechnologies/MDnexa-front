

export const MODEL_NAME = 'gemini-2.5-flash';

export const REGIONS_DATA: Record<string, string[]> = {
  "North America": ["United States", "Canada", "Mexico"],
  "Europe": [
    "United Kingdom", "Germany", "France", "Spain", "Italy", "Netherlands", "Switzerland", "Belgium",
    "Portugal", "Sweden", "Norway", "Denmark", "Finland", "Poland", "Austria", "Ireland", "Greece",
    "Russia", "Ukraine", "Belarus", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Serbia", "Croatia",
    "Slovakia", "Slovenia", "Estonia", "Latvia", "Lithuania", "Moldova", "Bosnia and Herzegovina",
    "Albania", "North Macedonia", "Montenegro", "Iceland", "Luxembourg", "Malta", "Cyprus", "Kosovo"
  ],
  "Central Asia & Caucasus": [
    "Kazakhstan", "Uzbekistan", "Azerbaijan", "Georgia", "Armenia", "Kyrgyzstan", "Tajikistan", "Turkmenistan"
  ],
  "Asia-Pacific": [
    "Australia", "New Zealand", "Japan", "South Korea", "Singapore", "India", "China", "Taiwan",
    "Hong Kong", "Thailand", "Vietnam", "Indonesia", "Malaysia", "Philippines", "Pakistan", "Bangladesh",
    "Sri Lanka", "Nepal", "Mongolia"
  ],
  "Middle East & Africa": [
    "UAE", "Saudi Arabia", "Qatar", "Turkey", "Egypt", "South Africa", "Nigeria", "Kenya", "Morocco",
    "Algeria", "Ethiopia", "Ghana", "Tanzania", "Uganda", "Palestine"
  ],
  "South America": [
    "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "Bolivia",
    "Uruguay", "Paraguay", "Guyana", "Suriname"
  ],
  "Central America & Caribbean": [
    "Costa Rica", "Panama", "Dominican Republic", "Puerto Rico", "Guatemala", "Honduras",
    "El Salvador", "Nicaragua", "Cuba", "Jamaica", "Haiti", "Bahamas", "Belize", "Trinidad and Tobago"
  ]
};

// Maps countries to their default language code for convenience, 
// though this no longer dictates the voice input language strictly.
export const COUNTRY_TO_LANG_CODE: Record<string, string> = {
  // North America
  "United States": "en-US",
  "Canada": "en-CA",
  "Mexico": "es-MX",

  // Europe
  "United Kingdom": "en-GB",
  "Germany": "de-DE",
  "France": "fr-FR",
  "Spain": "es-ES",
  "Italy": "it-IT",
  "Netherlands": "nl-NL",
  "Switzerland": "de-CH",
  "Belgium": "fr-BE",
  "Portugal": "pt-PT",
  "Sweden": "sv-SE",
  "Norway": "no-NO",
  "Denmark": "da-DK",
  "Finland": "fi-FI",
  "Poland": "pl-PL",
  "Austria": "de-AT",
  "Ireland": "en-IE",
  "Greece": "el-GR",
  "Russia": "ru-RU",
  "Ukraine": "uk-UA",
  "Belarus": "ru-BY",
  "Czech Republic": "cs-CZ",
  "Hungary": "hu-HU",
  "Romania": "ro-RO",
  "Bulgaria": "bg-BG",
  "Serbia": "sr-RS",
  "Croatia": "hr-HR",
  "Slovakia": "sk-SK",
  "Slovenia": "sl-SI",
  "Estonia": "et-EE",
  "Latvia": "lv-LV",
  "Lithuania": "lt-LT",
  "Moldova": "ro-MD",
  "Bosnia and Herzegovina": "bs-BA",
  "Albania": "sq-AL",
  "North Macedonia": "mk-MK",
  "Montenegro": "sr-ME",
  "Iceland": "is-IS",
  "Luxembourg": "fr-LU",
  "Malta": "en-MT",
  "Cyprus": "el-CY",
  "Kosovo": "sq-AL",

  // Central Asia & Caucasus
  "Kazakhstan": "kk-KZ",
  "Uzbekistan": "uz-UZ",
  "Azerbaijan": "az-AZ",
  "Georgia": "ka-GE",
  "Armenia": "hy-AM",
  "Kyrgyzstan": "ky-KG",
  "Tajikistan": "tg-TJ",
  "Turkmenistan": "tk-TM",

  // Asia-Pacific
  "Australia": "en-AU",
  "New Zealand": "en-NZ",
  "Japan": "ja-JP",
  "South Korea": "ko-KR",
  "Singapore": "en-SG",
  "India": "en-IN",
  "China": "zh-CN",
  "Taiwan": "zh-TW",
  "Hong Kong": "zh-HK",
  "Thailand": "th-TH",
  "Vietnam": "vi-VN",
  "Indonesia": "id-ID",
  "Malaysia": "ms-MY",
  "Philippines": "en-PH",
  "Pakistan": "ur-PK",
  "Bangladesh": "bn-BD",
  "Sri Lanka": "si-LK",
  "Nepal": "ne-NP",
  "Mongolia": "mn-MN",

  // Middle East & Africa
  "UAE": "ar-AE",
  "Saudi Arabia": "ar-SA",
  "Qatar": "ar-QA",
  "Turkey": "tr-TR",
  "Egypt": "ar-EG",
  "South Africa": "en-ZA",
  "Nigeria": "en-NG",
  "Kenya": "en-KE",
  "Morocco": "ar-MA",
  "Algeria": "ar-DZ",
  "Ethiopia": "am-ET",
  "Ghana": "en-GH",
  "Tanzania": "sw-TZ",
  "Uganda": "en-UG",
  "Palestine": "ar-PS",

  // South America
  "Brazil": "pt-BR",
  "Argentina": "es-AR",
  "Chile": "es-CL",
  "Colombia": "es-CO",
  "Peru": "es-PE",
  "Venezuela": "es-VE",
  "Ecuador": "es-EC",
  "Bolivia": "es-BO",
  "Uruguay": "es-UY",
  "Paraguay": "es-PY",
  "Guyana": "en-GY",
  "Suriname": "nl-SR",

  // Central America & Caribbean
  "Costa Rica": "es-CR",
  "Panama": "es-PA",
  "Dominican Republic": "es-DO",
  "Puerto Rico": "es-PR",
  "Guatemala": "es-GT",
  "Honduras": "es-HN",
  "El Salvador": "es-SV",
  "Nicaragua": "es-NI",
  "Cuba": "es-CU",
  "Jamaica": "en-JM",
  "Haiti": "fr-HT",
  "Bahamas": "en-BS",
  "Belize": "en-BZ",
  "Trinidad and Tobago": "en-TT"
};

export const VOICE_LANGUAGES: Record<string, string> = {
  "English (US)": "en-US",
  "English (UK)": "en-GB",
  "Spanish (Spain)": "es-ES",
  "Spanish (Latin America)": "es-MX",
  "Russian": "ru-RU",
  "German": "de-DE",
  "French": "fr-FR",
  "Italian": "it-IT",
  "Portuguese (Brazil)": "pt-BR",
  "Portuguese (Portugal)": "pt-PT",
  "Chinese (Mandarin)": "zh-CN",
  "Japanese": "ja-JP",
  "Arabic": "ar-SA",
  "Hindi": "hi-IN"
};


export const DEFAULT_WELCOME_MESSAGE = "Hello, I am MDnexa™ - your guideline-aware medical AI assistant.\nBefore we begin, please ensure your language, country, and region are set correctly in settings to help me follow local medical standards.\nI can help you understand conditions, pathophysiology, differentials and drug suitability for educational purposes.";

// Multilingual Welcome Messages
export const MULTILINGUAL_WELCOME_MESSAGES: Record<string, string> = {
  "Spanish": "Hola, soy MDnexa™, tu asistente médico de IA consciente de las pautas.\nAntes de comenzar, asegúrese de que su idioma, país y región estén configurados correctamente en la configuración para ayudarme a seguir los estándares médicos locales.\nPuedo ayudarte a comprender condiciones, fisiopatología, diferenciales e idoneidad de medicamentos con fines educativos.",
  "French": "Bonjour, je suis MDnexa™ - votre assistant médical IA respectueux des directives.\nAvant de commencer, veuillez vous assurer que votre langue, votre pays et votre région sont correctement définis dans les paramètres pour m'aider à suivre les normes médicales locales.\nJe peux vous aider à comprendre les pathologies, la physiopathologie, les diagnostics différentiels et l'adéquation des médicaments à des fins éducatives.",
  "German": "Hallo, ich bin MDnexa™ - Ihr leitlinienbewusster medizinischer KI-Assistent.\nBevor wir beginnen, stellen Sie bitte sicher, dass Ihre Sprache, Ihr Land und Ihre Region in den Einstellungen korrekt festgelegt sind, damit ich die lokalen medizinischen Standards befolgen kann.\nIch kann Ihnen helfen, Bedingungen, Pathophysiologie, Differentialdiagnosen und Arzneimitteleignung zu Bildungszwecken zu verstehen.",
  "Portuguese": "Olá, sou o MDnexa™ - seu assistente médico de IA orientado por diretrizes.\nAntes de começarmos, certifique-se de que seu idioma, país e região estejam definidos corretamente nas configurações para me ajudar a seguir os padrões médicos locais.\nPosso ajudá-lo a entender condições, fisiopatologia, diferenciais e adequação de medicamentos para fins educacionais.",
  "Italian": "Ciao, sono MDnexa™ - il tuo assistente medico IA consapevole delle linee guida.\nPrima di iniziare, assicurati che la lingua, il paese e la regione siano impostati correttamente nelle impostazioni per aiutarmi a seguire gli standard medici locali.\nPosso aiutarti a comprendere condizioni, fisiopatologia, differenziali e idoneità dei farmaci a scopo educativo.",
  "Russian": "Здравствуйте, я MDnexa™ — ваш медицинский ИИ-ассистент, учитывающий клинические рекомендации.\nПрежде чем начать, пожалуйста, убедитесь, что ваш язык, страна и регион правильно настроены в настройках, чтобы я мог следовать местным медицинским стандартам.\nЯ могу помочь вам понять состояния, патофизиологию, дифференциальную диагностику и пригодность лекарств в образовательных целях.",
  "Chinese": "你好，我是 MDnexa™ - 您的循证医学 AI 助手。\n在我们开始之前，请确保在设置中正确设置了您的语言、国家和地区，以帮助我遵循当地的医疗标准。\n我可以帮助您了解疾病、病理生理学、鉴别诊断和药物适用性，仅供教育目的。",
  "Japanese": "こんにちは、MDnexa™ です。ガイドラインに準拠した医療 AI アシスタントです。\n始める前に、現地の医療基準に従うために、設定で言語、国、地域が正しく設定されていることを確認してください。\n教育目的で、病状、病態生理学、鑑別診断、薬の適合性を理解するお手伝いができます。",
  "Arabic": "مرحبًا، أنا MDnexa™ - مساعدك الطبي الذكي الملتزم بالإرشادات.\nقبل أن نبدأ، يرجى التأكد من ضبط لغتك وبلدك ومنطقتك بشكل صحيح في الإعدادات لمساعدتي في اتباع المعايير الطبية المحلية.\nيمكنني مساعدتك في فهم الحالات، والفيزيولوجيا المرضية، والتشخيص التفريقي، وملاءمة الدواء للأغراض التعليمية.",
  "Hindi": "नमस्ते, मैं MDnexa™ हूँ - आपका दिशानिर्देश-जागरूक चिकित्सा AI सहायक।\nशुरू करने से पहले, कृपया सुनिश्चित करें कि मैं स्थानीय चिकित्सा मानकों का पालन कर सकूँ, इसके लिए सेटिंग्स में आपकी भाषा, देश और क्षेत्र सही ढंग से सेट हैं।\nमैं आपको शैक्षिक उद्देश्यों के लिए स्थितियों, पैथोफिज़ियोलॉजी, अंतर और दवा की उपयुक्तता को समझने में मदद कर सकता हूँ।"
};

export const getWelcomeMessage = (language: string = "English"): string => {
  let message = DEFAULT_WELCOME_MESSAGE;
  const langKey = Object.keys(MULTILINGUAL_WELCOME_MESSAGES).find(key => language.includes(key));

  if (langKey) {
    message = MULTILINGUAL_WELCOME_MESSAGES[langKey];
  }
  return message;
};

export const isWelcomeMessage = (text: string): boolean => {
  if (text === DEFAULT_WELCOME_MESSAGE) return true;
  return Object.values(MULTILINGUAL_WELCOME_MESSAGES).includes(text);
};

export const isArabic = (language: string): boolean => {
  return language.includes("Arabic") || language.includes("ar");
};

export const DEFAULT_QUESTION_POOL = [
  // Cardiology
  "What are the first-line treatments for hypertension in elderly patients according to ESC 2023?",
  "Differential diagnosis for acute chest pain in a 45-year-old male smoker.",
  "Contraindications for prescribing beta-blockers in patients with asthma.",
  "Management of atrial fibrillation: Rate vs Rhythm control strategies.",
  "Interpret the significance of elevated Troponin I levels in non-ACS settings.",
  "Comparing effectiveness of ACE inhibitors vs. ARBs in heart failure with reduced ejection fraction.",
  "Guideline-directed medical therapy for HFrEF: The four pillars.",
  "Management of acute pericarditis: NSAIDs and Colchicine protocols.",
  "Indications for statin therapy in primary prevention of CVD.",
  "Management of stable angina pectoris: Medical therapy vs revascularization.",
  "ECG criteria for diagnosing Left Bundle Branch Block.",
  "Treatment of infective endocarditis: Empiric antibiotic regimens.",
  "Management of hypertensive emergency vs urgency.",
  "Workup for secondary causes of hypertension in young adults.",
  "Anticoagulation strategies for mechanical heart valves.",
  "Diagnosis and management of hypertrophic cardiomyopathy.",
  "Clinical features and management of aortic stenosis.",
  "Risk stratification in ACS: TIMI vs GRACE scores.",
  "Management of cardiogenic shock: Inotropes and mechanical support.",
  "QT prolongation: Drug causes and management.",

  // Respiratory
  "Management guidelines for community-acquired pneumonia in adults (ATS/IDSA).",
  "Treatment of acute asthma exacerbation in emergency settings.",
  "Management of COPD exacerbations according to GOLD guidelines.",
  "Risk stratification for pulmonary embolism (Wells Score).",
  "Diagnosis and treatment of Idiopathic Pulmonary Fibrosis.",
  "Management of spontaneous pneumothorax: Observation vs chest tube.",
  "Interpret pulmonary function tests (PFTs) in restrictive vs obstructive lung disease.",
  "Treatment of hospital-acquired pneumonia (HAP) and VAP.",
  "Management of acute respiratory distress syndrome (ARDS).",
  "Differential diagnosis of chronic cough in non-smokers.",
  "Evaluation of a solitary pulmonary nodule.",
  "Treatment of sarcoidosis: Indications for corticosteroids.",
  "Management of pleural effusion: Transudative vs Exudative.",
  "Cystic Fibrosis: Current modulator therapies.",
  "Diagnosis and management of Obstructive Sleep Apnea.",
  "Treatment of pulmonary hypertension: WHO groups.",
  "Management of hemoptysis: Initial stabilization and workup.",
  "Lung cancer screening guidelines (USPSTF).",
  "Aspirated foreign body in adults: Recognition and removal.",
  "Bronchiectasis: Etiology and long-term management.",

  // Gastroenterology
  "First-line regimens for H. pylori eradication.",
  "Diagnosis of Celiac Disease: Serology vs Biopsy.",
  "Management of acute diverticulitis: Antibiotics vs observation.",
  "Treatment of Clostridioides difficile infection: FDX vs Vanco.",
  "Management of acute gastrointestinal bleeding (Upper vs Lower).",
  "Differential diagnosis of acute abdominal pain in women of childbearing age.",
  "Management of GERD refractory to PPI therapy.",
  "Evaluation of elevated liver enzymes (AST/ALT).",
  "Treatment of Inflammatory Bowel Disease (Crohn's vs UC flare).",
  "Management of acute pancreatitis: Fluids and feeding.",
  "Diagnosis and treatment of SIBO (Small Intestinal Bacterial Overgrowth).",
  "Management of chronic Hepatitis B infection.",
  "Hepatitis C treatment: Direct-acting antivirals.",
  "Cirrhosis: Management of ascites and spontaneous bacterial peritonitis.",
  "Evaluation of dysphagia: Oropharyngeal vs Esophageal.",
  "Management of Irritable Bowel Syndrome (IBS-C vs IBS-D).",
  "Colon cancer screening options and intervals.",
  "Treatment of Wilson's Disease.",
  "Management of hemochromatosis.",
  "Diagnosis of Zollinger-Ellison Syndrome.",

  // Neurology
  "Treatment algorithms for acute migraine attacks.",
  "Management of acute ischemic stroke: tPA and thrombectomy windows.",
  "Differential diagnosis of sudden onset severe headache.",
  "Treatment of status epilepticus: Stepwise approach.",
  "Management of Multiple Sclerosis: Disease-modifying therapies.",
  "Diagnosis and management of Myasthenia Gravis.",
  "Parkinson's Disease: Levodopa vs Dopamine Agonists.",
  "Dementia workup: Reversible causes.",
  "Management of TIA (Transient Ischemic Attack) and secondary prevention.",
  "Guillain-Barre Syndrome: Diagnosis and treatment.",
  "Cluster headache: Acute treatment and prophylaxis.",
  "Management of bacterial meningitis: Empiric antibiotics.",
  "Normal Pressure Hydrocephalus: Triad and treatment.",
  "Bell's Palsy: Corticosteroids and antivirals.",
  "Trigeminal Neuralgia: Pharmacologic management.",
  "Restless Legs Syndrome: Treatment options.",
  "Essential Tremor vs Parkinsonian Tremor.",
  "Management of intracranial hypertension.",
  "Subarachnoid hemorrhage: Complications and management.",
  "ALS (Amyotrophic Lateral Sclerosis): Supportive care.",

  // Endocrinology
  "Diagnostic criteria for Type 2 Diabetes Mellitus (ADA).",
  "Protocols for managing Diabetic Ketoacidosis (DKA).",
  "Evaluation of a thyroid nodule: Bethesda system.",
  "Management of hypothyroidism in pregnancy.",
  "Treatment of hyperthyroidism: Graves' vs Toxic Nodule.",
  "Insulin initiation regimens in Type 2 Diabetes.",
  "Workup for adrenal incidentaloma.",
  "Diagnosis and management of Cushing's Syndrome.",
  "Primary Hyperparathyroidism: Surgical indications.",
  "Management of Addison's Disease (Adrenal Insufficiency).",
  "Polycystic Ovary Syndrome (PCOS): Diagnostic criteria.",
  "Management of gestational diabetes.",
  "Hypoglycemia workup in non-diabetic adults.",
  "Acromegaly: Diagnosis and treatment.",
  "Pheochromocytoma: Pre-operative management.",
  "Diabetes Insipidus: Central vs Nephrogenic.",
  "Osteoporosis treatment: Bisphosphonates and holidays.",
  "Management of Hyperprolactinemia.",
  "SIADH: Diagnosis and fluid management.",
  "Male hypogonadism: TRT indications and risks.",

  // Infectious Disease
  "Signs and symptoms of identifying sepsis (qSOFA vs SIRS).",
  "Antibiotic stewardship for uncomplicated UTIs.",
  "Systemic Inflammatory Response Syndrome (SIRS) criteria.",
  "Treatment of Lyme disease: Early localized vs Disseminated.",
  "Management of febrile neutropenia.",
  "HIV: Antiretroviral therapy initiation.",
  "Oppurtunistic infections in HIV (PCP, Toxo).",
  "Tuberculosis: Latent vs Active treatment regimens.",
  "Malaria prophylaxis and treatment options.",
  "Management of infective arthritis (Septic Joint).",
  "Syphilis: Stages and treatment (Primary, Secondary, Neuro).",
  "Treatment of Gonorrhea and Chlamydia co-infection.",
  "Infectious Mononucleosis: Diagnosis and complications.",
  "Zoonotic diseases: Rabies PEP protocols.",
  "Dengue Fever: Warning signs and management.",
  "Invasive Fungal Infections: Candida and Aspergillus.",
  "Infection control for MDR organisms (MRSA, VRE, ESBL).",
  "Adult immunization schedule (Pneumococcal, Zoster).",
  "Travel medicine: Vaccines and precautions.",
  "COVID-19: Current therapeutic guidelines.",

  // Nephrology & Urology
  "Management of chronic kidney disease (CKD) stages 1-3.",
  "Approach to the patient with hyponatremia.",
  "Management of hyperkalemia in emergency department.",
  "Acute Kidney Injury (AKI): Prerenal vs Intrinsic vs Postrenal.",
  "Nephrotic vs Nephritic Syndrome differences.",
  "Treatment of benign prostatic hyperplasia (BPH).",
  "Management of kidney stones <5mm vs >10mm.",
  "Workup for microscopic hematuria.",
  "Polycystic Kidney Disease: Management and complications.",
  "Glomerulonephritis: IgA Nephropathy diagnosis.",
  "Renal Tubular Acidosis (Types 1, 2, 4).",
  "Dialysis indications (AEIOU).",
  "Management of prostatitis: Acute vs Chronic.",
  "Erectile Dysfunction: Phosphodiesterase inhibitors.",
  "Testicular torsion: Acute management.",

  // Rheumatology & Immunology
  "Treatment of acute gout flares vs Urate lowering therapy.",
  "Rheumatoid Arthritis: DMARDs initiation.",
  "Systemic Lupus Erythematosus (SLE): Diagnostic criteria.",
  "Management of Giant Cell Arteritis (Temporal Arteritis).",
  "Fibromyalgia: Non-pharmacologic and pharmacologic management.",
  "Sjogren's Syndrome: Diagnosis and symptom management.",
  "Psoriatic Arthritis: Treatment options.",
  "Ankylosing Spondylitis: TNF inhibitors.",
  "Polymyalgia Rheumatica: Steroid tapering.",
  "Vasculitis overview: ANCA-associated.",
  "Systemic Sclerosis (Scleroderma): Management.",
  "Evaluation of positive ANA.",
  "Gout vs Pseudogout (CPPD).",
  "Reactive Arthritis (Reiter's).",
  "Behcet's Disease: Clinical features.",

  // Hematology & Oncology
  "Differential diagnosis of microcytic anemia.",
  "Workup for macrocytic anemia (B12 vs Folate).",
  "Management of Deep Vein Thrombosis (DVT).",
  "Anticoagulation reversal agents (Warfarin, DOACs).",
  "Sickle Cell Disease: Management of vaso-occlusive crisis.",
  "Thrombocytopenia workup (ITP vs TTP).",
  "Multiple Myeloma: CRAB criteria.",
  "Chronic Lymphocytic Leukemia (CLL): Watch and wait.",
  "Tumor Lysis Syndrome: Prophylaxis and treatment.",
  "Neutropenic fever in cancer patients.",
  "Breast Cancer screening guidelines.",
  "Prostate Cancer screening (PSA debate).",
  "Iron deficiency anemia: Oral vs IV iron.",
  "Hemophilia A vs B.",
  "Polycythemia Vera: Diagnosis.",

  // Pharmacology & Interactions
  "Drug interactions: CYP450 inhibitors and inducers.",
  "Serotonin Syndrome: Symptoms and management.",
  "Digoxin toxicity: ECG changes and reversal.",
  "Acetaminophen overdose: Rumack-Matthew nomogram.",
  "Warfarin interactions with antibiotics.",
  "Statins: Mechanism and management of myalgia.",
  "Beta-blocker overdose management.",
  "Calcium channel blocker overdose.",
  "Tricyclic Antidepressant (TCA) toxicity.",
  "Lithium toxicity and monitoring.",
  "Opioid conversion calculations (MME).",
  "Antibiotic side effects: Fluoroquinolones and tendons.",
  "Aminoglycoside nephrotoxicity and ototoxicity.",
  "Corticosteroid tapering scheudles.",
  "Anticholinergic burden in the elderly.",
  "Metformin and lactic acidosis risk.",
  "SGLT2 inhibitors: Benefits beyond diabetes.",
  "GLP-1 agonists: Side effect profile.",
  "Diuretic resistance mechanisms.",
  "Antiplatelet therapy: DAPT duration.",
  "DOACs dosing in renal failure.",
  "Vancomycin dosing and trough monitoring.",
  "Linezolid and serotonin syndrome risk.",
  "MAO inhibitors and tyramine reaction.",
  "Teratogenic drugs to avoid in pregnancy.",
  "Drugs causing QT prolongation.",
  "Checklist for prescribing in renal impairment.",
  "Pharmacology of sedation (Propofol vs Midazolam).",
  "Local anesthetic toxicity (LAST).",
  "Managing polypharmacy in geriatrics.",

  // Emergency & Trauma
  "ACLS guidelines for stable wide-complex tachycardia.",
  "Management of anaphylaxis: Epinephrine dosing.",
  "Sepsis bundles: 1-hour targets.",
  "Trauma: ABCDE primary survey.",
  "Glasgow Coma Scale (GCS) calculation.",
  "Burns: Parkland formula for fluid resuscitation.",
  "Management of acute poisoning (General approach).",
  "Carbon monoxide poisoning.",
  "Hypothermia management protocols.",
  "Heat stroke vs Heat exhaustion.",
  "Snake bite management.",
  "Dog and cat bite antibiotics.",
  "Head injury: Canadian CT Head Rule.",
  "C-spine clearance criteria (NEXUS).",
  "Tension pneumothorax decompression.",
  "Pericardiocentesis technique.",
  "Intraosseous access indications.",
  "Rapid Sequence Intubation (RSI) medications.",
  "Management of epistaxis.",
  "Eye emergencies: Chemical burn irrigation.",

  // Pediatrics
  "First-line antibiotics for acute otitis media in children.",
  "Pediatric immunization schedule.",
  "Management of febrile seizures.",
  "Croup: Dexamethasone and Epinephrine.",
  "Bronchiolitis: Supportive care guidelines.",
  "Kawasaki Disease: Diagnosis and treatment.",
  "Neonatal jaundice: Phototherapy thresholds.",
  "Pyloric stenosis: Electrolyte abnormalities.",
  "Intussusception: Diagnosis and reduction.",
  "Pediatric dehydration: Oral rehydration vs IV.",
  "Failure to thrive workup.",
  "Hand, Foot, and Mouth Disease.",
  "Streptococcal pharyngitis (Strep throat) scoring.",
  "Developmental milestones red flags.",
  "SIDS prevention guidelines.",

  // ObGyn
  "Clinical features and management of preeclampsia.",
  "Ectopic pregnancy: Methotrexate vs Surgery.",
  "Postpartum hemorrhage management.",
  "Contraception options and contraindications (MEC).",
  "Pelvic Inflammatory Disease (PID) treatment.",
  "Abnormal Uterine Bleeding (PALM-COEIN).",
  "Menopause management: HRT risks/benefits.",
  "Endometriosis diagnosis and medical management.",
  "Screening for cervical cancer (Pap smear).",
  "Management of Group B Strep in pregnancy.",

  // Psychiatry
  "Treatment options for Generalized Anxiety Disorder (GAD).",
  "Management of Major Depressive Disorder in adolescents.",
  "Management of alcohol withdrawal syndrome (CIWA).",
  "Bipolar Disorder: Lithium vs Valproate.",
  "Schizophrenia: First vs Second generation antipsychotics.",
  "Acute agitation management.",
  "Suicide risk assessment.",
  "Borderline Personality Disorder: DBT.",
  "PTSD: Pharmacotherapy and Psychotherapy.",
  "Eating disorders: Refeeding syndrome risk."
];

// Multilingual Question Pools
// Each pool contains a subset of translated high-yield questions
export const MULTILINGUAL_QUESTION_POOLS: Record<string, string[]> = {
  "Spanish": [
    "¿Cuáles son los tratamientos de primera línea para la hipertensión?",
    "Diagnóstico diferencial del dolor torácico agudo.",
    "Manejo de la cetoacidosis diabética.",
    "Tratamiento erradicador para H. pylori.",
    "Guías para el manejo del asma agudo.",
    "Criterios diagnósticos de sepsis (qSOFA vs SIRS).",
    "Tratamiento de la anafilaxia: Dosis de adrenalina.",
    "Manejo de la hemorragia posparto.",
    "Opciones terapéuticas para la ansiedad generalizada."
  ],
  "French": [
    "Quels sont les traitements de première intention pour l'hypertension ?",
    "Diagnostic différentiel de la douleur thoracique aiguë.",
    "Prise en charge de l'acidocétose diabétique.",
    "Traitement d'éradication de H. pylori.",
    "Lignes directrices pour la gestion de l'asthme aigu.",
    "Critères diagnostiques du sepsis (qSOFA vs SIRS).",
    "Traitement de l'anaphylaxie : Dosage de l'adrénaline.",
    "Prise en charge de l'hémorragie du post-partum.",
    "Options thérapeutiques pour l'anxiété généralisée."
  ],
  "German": [
    "Was sind die Erstlinientherapien bei Hypertonie?",
    "Differenzialdiagnose bei akuten Brustschmerzen.",
    "Management der diabetischen Ketoazidose.",
    "Eradikationstherapie bei H. pylori.",
    "Leitlinien zur Behandlung von akutem Asthma.",
    "Diagnosekriterien für Sepsis (qSOFA vs. SIRS).",
    "Behandlung von Anaphylaxie: Adrenalin-Dosierung.",
    "Management bei postpartaler Hämorrhagie.",
    "Therapieoptionen bei generalisierter Angststörung."
  ],
  "Portuguese": [
    "Quais são os tratamentos de primeira linha para hipertensão?",
    "Diagnóstico diferencial de dor torácica aguda.",
    "Manejo da cetoacidose diabética.",
    "Tratamento de erradicação para H. pylori.",
    "Diretrizes para o manejo da asma aguda.",
    "Critérios diagnósticos de sepse (qSOFA vs SIRS).",
    "Tratamento da anafilaxia: Dosagem de adrenalina.",
    "Manejo da hemorragia pós-parto.",
    "Opções terapêuticas para ansiedade generalizada."
  ],
  "Italian": [
    "Quali sono i trattamenti di prima linea per l'ipertensione?",
    "Diagnosi differenziale del dolore toracico acuto.",
    "Gestione della chetoacidosi diabetica.",
    "Terapia eradicante per H. pylori.",
    "Linee guida per la gestione dell'asma acuto.",
    "Criteri diagnostici per la sepsi (qSOFA vs SIRS).",
    "Trattamento dell'anafilassi: Dosaggio dell'adrenalina.",
    "Gestione dell'emorragia postpartum.",
    "Opzioni terapeutiche per l'ansia generalizzata."
  ],
  "Russian": [
    "Каковы методы лечения гипертонии первой линии?",
    "Дифференциальная диагностика острой боли в груди.",
    "Ведение диабетического кетоацидоза.",
    "Эрадикационная терапия H. pylori.",
    "Руководство по лечению острой астмы.",
    "Диагностические критерии сепсиса (qSOFA vs SIRS).",
    "Лечение анафилаксии: Дозировка адреналина.",
    "Ведение послеродового кровотечения.",
    "Варианты лечения генерализованного тревожного расстройства."
  ],
  "Chinese": [
    "高血压的一线治疗方案是什么？",
    "急性胸痛的鉴别诊断。",
    "糖尿病酮症酸中毒的处理。",
    "幽门螺杆菌根除治疗。",
    "急性哮喘的管理指南。",
    "脓毒症的诊断标准 (qSOFA vs SIRS)。",
    "过敏性休克的治疗：肾上腺素剂量。",
    "产后出血的处理。",
    "广泛性焦虑症的治疗选择。"
  ],
  "Japanese": [
    "高血圧の第一選択治療は何ですか？",
    "急性胸痛の鑑別診断。",
    "糖尿病性ケトアシドーシスの管理。",
    "ピロリ菌の除菌療法。",
    "急性喘息の管理ガイドライン。",
    "敗血症の診断基準 (qSOFA vs SIRS)。",
    "アナフィラキシーの治療：アドレナリンの投与量。",
    "分娩後出血の管理。",
    "全般性不安障害の治療選択肢。"
  ],
  "Arabic": [
    "ما هي علاجات الخط الأول لارتفاع ضغط الدم؟",
    "التشخيص التفريقي لألم الصدر الحاد.",
    "إدارة الحماض الكيتوني السكري.",
    "علاج استئصال الملوية البوابية.",
    "مبادئ توجيهية لإدارة الربو الحاد.",
    "معايير تشخيص الإنتان (qSOFA مقابل SIRS).",
    "علاج الحساسية المفرطة: جرعة الإبينفرين.",
    "إدارة نزيف ما بعد الولادة.",
    "خيارات العلاج لاضطراب القلق العام."
  ],
  "Hindi": [
    "उच्च रक्तचाप के लिए प्राथमिक उपचार क्या हैं?",
    "सीने में तेज दर्द का विभेदक निदान।",
    "डायबिटिक कीटोएसिडोसिस का प्रबंधन।",
    "एच. पाइलोरी के उन्मूलन के लिए उपचार।",
    "तीव्र अस्थमा के प्रबंधन के लिए दिशानिर्देश।",
    "सेप्सis के लिए निदान मानदंड (qSOFA बनाम SIRS).",
    "एनाफिलेक्सिस का उपचार: एपिनेफ्रीन खुराक।",
    "प्रसवोत्तर रक्तस्राव का प्रबंधन।",
    "सामान्यीकृत चिंता विकार के लिए उपचार विकल्प।"
  ]
};

export const getRandomQuestions = (count: number = 4, language: string = "English"): string[] => {
  // Check if we have a mapped pool for the language
  // We check mapping keys or try to match names roughly
  let pool = DEFAULT_QUESTION_POOL;

  // Simple key matching (e.g. "Spanish" -> "Spanish")
  // Also handle "Spanish (Latin America)" -> "Spanish"
  const langKey = Object.keys(MULTILINGUAL_QUESTION_POOLS).find(key => language.includes(key));

  if (langKey) {
    pool = MULTILINGUAL_QUESTION_POOLS[langKey];
  }

  // Shuffle and slice
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};