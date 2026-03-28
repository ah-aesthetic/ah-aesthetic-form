"use client";
import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const FORMSPREE_ID = "mreoeaoz";
const CLOUDINARY_CLOUD_NAME = "drkele6gg";
const CLOUDINARY_UPLOAD_PRESET = "ah-aesthetic-forms";
const EMAILJS_SERVICE_ID = "service_cjnprwl";
const EMAILJS_TEMPLATE_ID = "template_r529kri";
const EMAILJS_PUBLIC_KEY = "ap3zsxj1pgoGQRSWQ";

const translations = {
  de: {
    langSelect: { title: "Willkommen", subtitle: "Bitte wählen Sie Ihre Sprache", continue: "Weiter" },
    title: "Ästhetische Behandlung",
    subtitle: "Aufklärung & Anamnese",
    practitioner: "Anna Hryshchenko • Ästhetische Medizin",
    treatmentSelect: {
      title: "Welche Behandlung interessiert Sie?",
      hint: "Unverbindliche Auswahl – wird im persönlichen Gespräch besprochen",
      botox: "Botulinumtoxin", botoxDesc: "Faltenbehandlung & Prävention",
      lips: "Lippen (Hyaluron)", lipsDesc: "Volumen, Kontur & Feuchtigkeit",
      skin: "Hautverbesserung", skinDesc: "Polynukleotide, Skinbooster, Mesotherapie"
    },
    sections: { language: "Sprache", treatment: "Behandlungsauswahl", interests: "Behandlungsdetails", personal: "Persönliche Daten", anamnesis: "Gesundheitsfragebogen", info: "Behandlungsinformationen", consent: "Einverständniserklärung" },
    interests: { title: "Wofür interessieren Sie sich?", hint: "Unverbindliche Auswahl – keine Buchung, nur zur Vorbereitung des Beratungsgesprächs" },
    fields: { firstName: "Vorname", lastName: "Nachname", birthDate: "Geburtsdatum", address: "Adresse", phone: "Telefonnummer", email: "E-Mail", profession: "Beruf" },
    botoxInterests: {
      packagesTitle: "Botox-Pakete",
      packages: ["Zornesfalte + Stirn", "Oberes Gesicht (3 Zonen)", "Full Face", "Full Face + Hals"],
      areasTitle: "Botox-Einzelbehandlungen",
      areas: ["Zornesfalte", "Stirn", "Krähenfüße", "Kinnfalten", "Nasenfalten", "Lip Flip", "Brow Lift", "Nasenspitze", "Platysma/Hals", "Hyperhidrose (Schwitzen)"]
    },
    lipsInterests: { title: "Lippen-Behandlungen", options: ["Lippen-Vergrößerung", "Asymmetrie-Korrektur", "Lippenfeuchtigkeit", "Hyaluronidase (Auflösung)"] },
    skinInterests: {
      treatmentsTitle: "Hautverbesserungs-Behandlungen",
      treatments: ["Polynukleotide", "Skinbooster/Biorevitalisierung", "Mesotherapie"],
      zonesTitle: "Behandlungszonen",
      zones: ["Gesicht", "Augenbereich", "Hals + Dekolleté", "Hände", "Vulvabereich"]
    },
    anamnesis: {
      intro: "Bitte beantworten Sie die folgenden Fragen zu Ihrer Gesundheit.",
      q1: "Sind Sie schwanger oder stillen Sie?",
      q2: "Haben Sie akute Infektionen oder entzündliche Erkrankungen?",
      q2info: "Z.B. Erkältung, Grippe, Fieber, Hautinfektionen im Gesichtsbereich",
      q3: "Leiden Sie an neurologischen Erkrankungen?",
      q3info: "Z.B. Epilepsie, Myasthenia gravis, ALS, Multiple Sklerose",
      q4: "Haben Sie Autoimmunerkrankungen?",
      q4info: "Z.B. Lupus, Rheumatoide Arthritis, Hashimoto, Morbus Crohn, Psoriasis",
      q5: "Befinden Sie sich in onkologischer Behandlung?",
      q5info: "Krebsbehandlung wie Chemotherapie, Bestrahlung oder Immuntherapie",
      q6: "Haben Sie Blutgerinnungsstörungen?",
      q6info: "Z.B. Hämophilie, Von-Willebrand-Syndrom, Thrombozytopenie",
      q7: "Leiden Sie an dekompensiertem Diabetes oder schweren chronischen Erkrankungen?",
      q7info: "Dekompensiert = Blutzucker ist nicht gut eingestellt",
      q8: "Haben Sie bekannte Allergien oder Unverträglichkeiten?",
      q8info: "Insbesondere: Botulinumtoxin, Hyaluronsäure, Medikamente, Latex, Lebensmittel",
      q8placeholder: "Bitte alle bekannten Allergien angeben...",
      q9: "Neigen Sie zu Keloidbildung?",
      q9info: "Wulstartige, überschießende Narbenbildung nach Verletzungen",
      q10: "Haben Sie nicht resorbierbare Implantate im Behandlungsbereich?",
      q10info: "Z.B. permanente Filler, Silikonimplantate im Gesicht",
      q11: "Nehmen Sie blutverdünnende Medikamente ein?",
      q11info: "Z.B. Aspirin, Marcumar, Xarelto, Eliquis, Ibuprofen",
      q12: "Welche Medikamente nehmen Sie regelmäßig ein?",
      q12placeholder: "Bitte alle aktuellen Medikamente auflisten...",
      q13: "Hatten Sie bereits ästhetische Injektionsbehandlungen?",
      q13sub: "Wenn ja, welche und wann?",
      q13placeholder: "Z.B. 'Botox vor 6 Monaten' oder 'Erste Behandlung'",
      q14: "Haben Sie noch offene Fragen?",
      q14hint: "Diese können wir gerne vor Ort klären.",
      q14placeholder: "Optional: Ihre Fragen an uns...",
      yes: "Ja", no: "Nein", details: "Bitte Details angeben:"
    },
    info: {
      summaryTitle: "Wichtige Hinweise",
      botoxTitle: "Botulinumtoxin",
      botoxSummary: "Botulinumtoxin blockiert vorübergehend die Signalübertragung zwischen Nerven und Muskeln. Erste sichtbare Ergebnisse nach wenigen Tagen, endgültiges Ergebnis nach zwei Wochen. Kostenlose Nachkorrektur zwischen 2. und 3. Woche möglich. Wirkdauer: ca. 3-4 Monate.",
      botoxDuration: "(In individuellen Fällen kann die Wirkdauer auch bis zu 8 Monate betragen – abhängig von Stoffwechsel, Muskelaktivität und Lebensstil.)",
      lipsTitle: "Lippen (Hyaluron)",
      lipsSummary: "Hyaluronsäure ist ein körpereigener Stoff, der Volumen und Feuchtigkeit spendet. Das Ergebnis ist sofort sichtbar, das endgültige Ergebnis zeigt sich nach Abschwellen (ca. 2 Wochen). Kostenlose Nachkorrektur möglich. Wirkdauer: ca. 6-12 Monate.",
      skinTitle: "Hautverbesserung",
      skinSummary: "Polynukleotide und Skinbooster regenerieren die Haut von innen. Für optimale Ergebnisse sind in der Regel 3-4 Sitzungen im Abstand von ca. 3 Wochen empfohlen. Der genaue Behandlungsplan wird individuell besprochen.",
      aftercareTitle: "Nachsorge",
      botoxAftercare: { title: "Nachsorge Botulinumtoxin", points: ["4 Stunden aufrecht bleiben", "24 Stunden kein Sport, keine Sauna", "Behandelte Stellen nicht massieren oder reiben", "Kein Make-up für 4-6 Stunden", "Kostenlose Nachkorrektur nach 14 Tagen möglich"] },
      lipsAftercare: { title: "Nachsorge Lippen", points: ["Bis zu 72 Stunden Schwellung und Blutergüsse möglich", "24 Stunden kein Sport, keine Sauna", "48 Stunden keinen Lippenstift oder Lipgloss", "Lippen nicht massieren (außer wenn empfohlen)", "Viel Wasser trinken für optimale Hydration", "Kostenlose Nachkorrektur nach 14 Tagen möglich"] },
      skinAftercare: { title: "Nachsorge Hautverbesserung", points: ["24 Stunden kein Make-up", "24-48 Stunden kein Sport, keine Sauna", "48 Stunden direkte Sonneneinstrahlung meiden", "Sanfte Hautpflege für 3-5 Tage", "Ausreichend Wasser trinken", "Nächste Sitzung nach ca. 3 Wochen"] }
    },
    consent: {
      intro: "Bitte bestätigen Sie:",
      c1: "Ich habe die Informationen zur Behandlung vollständig gelesen und verstanden. Ich habe alle Fragen wahrheitsgemäß beantwortet. Ich willige in die Behandlung und die Speicherung meiner Daten ein.",
      signature: "Digitale Unterschrift",
      signatureHint: "Bitte unterschreiben Sie mit dem Finger oder der Maus:",
      clear: "Löschen", submit: "Formular absenden", submitting: "Wird gesendet...",
      signatureRequired: "Bitte unterschreiben Sie das Formular",
      successTitle: "Vielen Dank!",
      successMessage: "Wir haben Ihre Anfrage erhalten und melden uns bald bei Ihnen."
    },
    next: "Weiter", back: "Zurück", required: "* Pflichtfelder", selectTreatment: "Bitte wählen Sie mindestens eine Behandlung"
  },
  ua: {
    langSelect: { title: "Ласкаво просимо", subtitle: "Будь ласка, виберіть мову", continue: "Далі" },
    title: "Естетичне лікування",
    subtitle: "Інформація та анамнез",
    practitioner: "Анна Гришченко • Естетична медицина",
    treatmentSelect: {
      title: "Яка процедура вас цікавить?",
      hint: "Необов'язковий вибір – обговоримо особисто",
      botox: "Ботулотоксин", botoxDesc: "Корекція та профілактика зморшок",
      lips: "Губи (гіалурон)", lipsDesc: "Об'єм, контур та зволоження",
      skin: "Покращення шкіри", skinDesc: "Полінуклеотиди, скінбустери, мезотерапія"
    },
    sections: { language: "Мова", treatment: "Вибір процедури", interests: "Деталі процедури", personal: "Особисті дані", anamnesis: "Анкета здоров'я", info: "Інформація про лікування", consent: "Згода на лікування" },
    interests: { title: "Що вас цікавить?", hint: "Необов'язковий вибір – не бронювання, лише для підготовки консультації" },
    fields: { firstName: "Ім'я", lastName: "Прізвище", birthDate: "Дата народження", address: "Адреса", phone: "Телефон", email: "Електронна пошта", profession: "Професія" },
    botoxInterests: {
      packagesTitle: "Пакети ботокс",
      packages: ["Міжбрівна + лоб", "Верхня частина обличчя (3 зони)", "Full Face", "Full Face + шия"],
      areasTitle: "Окремі зони ботокс",
      areas: ["Міжбрівна зморшка", "Лоб", "«Гусячі лапки»", "Зморшки підборіддя", "Носові зморшки", "Lip Flip", "Підйом брів", "Кінчик носа", "Платизма/шия", "Гіпергідроз"]
    },
    lipsInterests: { title: "Процедури для губ", options: ["Збільшення губ", "Корекція асиметрії", "Зволоження губ", "Гіалуронідаза (розчинення)"] },
    skinInterests: {
      treatmentsTitle: "Процедури покращення шкіри",
      treatments: ["Полінуклеотиди", "Скінбустер/біоревіталізація", "Мезотерапія"],
      zonesTitle: "Зони лікування",
      zones: ["Обличчя", "Зона очей", "Шия + декольте", "Руки", "Зона вульви"]
    },
    anamnesis: {
      intro: "Будь ласка, дайте відповіді на питання про ваше здоров'я.",
      q1: "Ви вагітні або годуєте груддю?",
      q2: "У вас є гострі інфекції або запальні захворювання?",
      q2info: "Напр., застуда, грип, гарячка, шкірні інфекції",
      q3: "Чи страждаєте ви на неврологічні захворювання?",
      q3info: "Напр., епілепсія, міастенія, БАС, розсіяний склероз",
      q4: "У вас є автоімунні захворювання?",
      q4info: "Напр., вовчак, ревматоїдний артрит, Хашимото",
      q5: "Ви проходите онкологічне лікування?",
      q5info: "Хіміотерапія, променева терапія, імунотерапія",
      q6: "У вас є порушення згортання крові?",
      q6info: "Напр., гемофілія, хвороба Віллебранда",
      q7: "У вас декомпенсований діабет або важкі хронічні захворювання?",
      q7info: "Декомпенсований = рівень цукру погано контролюється",
      q8: "У вас є відомі алергії або непереносимість?",
      q8info: "Особливо: ботулотоксин, гіалуронова кислота, ліки, латекс",
      q8placeholder: "Вкажіть усі відомі алергії...",
      q9: "Чи схильні ви до утворення келоїдів?",
      q9info: "Надмірне рубцювання після травм",
      q10: "У вас є нерозсмоктувані імплантати в зоні лікування?",
      q10info: "Напр., перманентні філери, силіконові імплантати",
      q11: "Ви приймаєте препарати, що розріджують кров?",
      q11info: "Напр., аспірин, варфарин, ксарелто, ібупрофен",
      q12: "Які ліки ви приймаєте регулярно?",
      q12placeholder: "Перелічіть усі поточні ліки...",
      q13: "Чи робили вам раніше естетичні ін'єкції?",
      q13sub: "Якщо так, які і коли?",
      q13placeholder: "Напр., 'Ботокс 6 місяців тому' або 'Перша процедура'",
      q14: "Чи є у вас ще питання?",
      q14hint: "Ми можемо обговорити їх на прийомі.",
      q14placeholder: "Необов'язково: ваші питання...",
      yes: "Так", no: "Ні", details: "Вкажіть деталі:"
    },
    info: {
      summaryTitle: "Важлива інформація",
      botoxTitle: "Ботулотоксин",
      botoxSummary: "Ботулотоксин тимчасово блокує передачу сигналів між нервами та м'язами. Перші результати через кілька днів, остаточний результат через два тижні. Безкоштовна корекція між 2-м і 3-м тижнем. Тривалість: 3-4 місяці.",
      botoxDuration: "(В індивідуальних випадках дія може тривати до 8 місяців – залежно від обміну речовин, м'язової активності та способу життя.)",
      lipsTitle: "Губи (гіалурон)",
      lipsSummary: "Гіалуронова кислота — природна речовина, що додає об'єм та зволоження. Результат видно одразу, остаточний — після зменшення набряку (2 тижні). Безкоштовна корекція можлива. Тривалість: 6-12 місяців.",
      skinTitle: "Покращення шкіри",
      skinSummary: "Полінуклеотиди та скінбустери регенерують шкіру зсередини. Для оптимальних результатів рекомендовано 3-4 сеанси з інтервалом ~3 тижні. План лікування обговорюється індивідуально.",
      aftercareTitle: "Догляд після процедури",
      botoxAftercare: { title: "Догляд після ботулотоксину", points: ["Залишайтеся вертикально 4 години", "Без спорту та сауни 24 години", "Не масажуйте оброблені ділянки", "Без макіяжу 4-6 годин", "Безкоштовна корекція через 14 днів"] },
      lipsAftercare: { title: "Догляд після губ", points: ["До 72 годин можливий набряк та синці", "Без спорту та сауни 24 години", "48 годин без помади та блиску", "Не масажуйте губи (якщо не рекомендовано)", "Пийте багато води", "Безкоштовна корекція через 14 днів"] },
      skinAftercare: { title: "Догляд після шкіри", points: ["24 години без макіяжу", "24-48 годин без спорту та сауни", "48 годин уникайте сонця", "М'який догляд за шкірою 3-5 днів", "Пийте достатньо води", "Наступний сеанс через ~3 тижні"] }
    },
    consent: {
      intro: "Будь ласка, підтвердіть:",
      c1: "Я прочитав(ла) та зрозумів(ла) інформацію про лікування. Я правдиво відповів(ла) на всі питання. Я даю згоду на лікування та зберігання моїх даних.",
      signature: "Цифровий підпис",
      signatureHint: "Підпишіть пальцем або мишею:",
      clear: "Очистити", submit: "Надіслати форму", submitting: "Надсилається...",
      signatureRequired: "Будь ласка, підпишіть форму",
      successTitle: "Дякуємо!",
      successMessage: "Ми отримали ваш запит і зв'яжемося з вами найближчим часом."
    },
    next: "Далі", back: "Назад", required: "* Обов'язкові поля", selectTreatment: "Виберіть хоча б одну процедуру"
  },
  en: {
    langSelect: { title: "Welcome", subtitle: "Please select your language", continue: "Continue" },
    title: "Aesthetic Treatment",
    subtitle: "Information & Medical History",
    practitioner: "Anna Hryshchenko • Aesthetic Medicine",
    treatmentSelect: {
      title: "Which treatment are you interested in?",
      hint: "Non-binding selection – will be discussed in person",
      botox: "Botulinum Toxin", botoxDesc: "Wrinkle treatment & prevention",
      lips: "Lips (Hyaluronic)", lipsDesc: "Volume, contour & hydration",
      skin: "Skin Rejuvenation", skinDesc: "Polynucleotides, skinboosters, mesotherapy"
    },
    sections: { language: "Language", treatment: "Treatment Selection", interests: "Treatment Details", personal: "Personal Information", anamnesis: "Health Questionnaire", info: "Treatment Information", consent: "Consent Form" },
    interests: { title: "What are you interested in?", hint: "Non-binding selection – not a booking, just to prepare for the consultation" },
    fields: { firstName: "First Name", lastName: "Last Name", birthDate: "Date of Birth", address: "Address", phone: "Phone Number", email: "Email", profession: "Profession" },
    botoxInterests: {
      packagesTitle: "Botox Packages",
      packages: ["Frown lines + forehead", "Upper face (3 zones)", "Full Face", "Full Face + neck"],
      areasTitle: "Individual Botox Treatments",
      areas: ["Frown lines", "Forehead", "Crow's feet", "Chin wrinkles", "Nasal wrinkles", "Lip Flip", "Brow Lift", "Nose tip", "Platysma/neck", "Hyperhidrosis"]
    },
    lipsInterests: { title: "Lip Treatments", options: ["Lip enlargement", "Asymmetry correction", "Lip hydration", "Hyaluronidase (dissolution)"] },
    skinInterests: {
      treatmentsTitle: "Skin Rejuvenation Treatments",
      treatments: ["Polynucleotides", "Skinbooster/Biorevitalization", "Mesotherapy"],
      zonesTitle: "Treatment Zones",
      zones: ["Face", "Eye area", "Neck + décolletage", "Hands", "Vulva area"]
    },
    anamnesis: {
      intro: "Please answer the following questions about your health.",
      q1: "Are you pregnant or breastfeeding?",
      q2: "Do you have acute infections or inflammatory diseases?",
      q2info: "E.g., cold, flu, fever, skin infections",
      q3: "Do you suffer from neurological conditions?",
      q3info: "E.g., epilepsy, myasthenia gravis, ALS, MS",
      q4: "Do you have autoimmune diseases?",
      q4info: "E.g., lupus, rheumatoid arthritis, Hashimoto's",
      q5: "Are you undergoing oncological treatment?",
      q5info: "Chemotherapy, radiation, immunotherapy",
      q6: "Do you have blood clotting disorders?",
      q6info: "E.g., hemophilia, von Willebrand disease",
      q7: "Do you have decompensated diabetes or severe chronic diseases?",
      q7info: "Decompensated = blood sugar not well controlled",
      q8: "Do you have known allergies or intolerances?",
      q8info: "Especially: botulinum toxin, hyaluronic acid, medications, latex",
      q8placeholder: "Please list all known allergies...",
      q9: "Do you have a tendency to keloid formation?",
      q9info: "Excessive scarring after injuries",
      q10: "Do you have non-resorbable implants in the treatment area?",
      q10info: "E.g., permanent fillers, silicone implants",
      q11: "Are you taking blood-thinning medications?",
      q11info: "E.g., aspirin, warfarin, Xarelto, ibuprofen",
      q12: "Which medications do you take regularly?",
      q12placeholder: "Please list all current medications...",
      q13: "Have you had aesthetic injection treatments before?",
      q13sub: "If yes, which and when?",
      q13placeholder: "E.g., 'Botox 6 months ago' or 'First treatment'",
      q14: "Do you have any questions?",
      q14hint: "We can discuss them at your appointment.",
      q14placeholder: "Optional: Your questions...",
      yes: "Yes", no: "No", details: "Please provide details:"
    },
    info: {
      summaryTitle: "Important Information",
      botoxTitle: "Botulinum Toxin",
      botoxSummary: "Botulinum toxin temporarily blocks nerve-muscle signal transmission. First results after a few days, final results after two weeks. Free touch-up between weeks 2-3. Duration: approx. 3-4 months.",
      botoxDuration: "(In individual cases, the effect can last up to 8 months – depending on metabolism, muscle activity, and lifestyle.)",
      lipsTitle: "Lips (Hyaluronic)",
      lipsSummary: "Hyaluronic acid is a natural substance that adds volume and hydration. Results are immediate, final results after swelling subsides (~2 weeks). Free touch-up possible. Duration: 6-12 months.",
      skinTitle: "Skin Rejuvenation",
      skinSummary: "Polynucleotides and skinboosters regenerate skin from within. For optimal results, 3-4 sessions at ~3-week intervals are recommended. The exact treatment plan is discussed individually.",
      aftercareTitle: "Aftercare",
      botoxAftercare: { title: "Botulinum Toxin Aftercare", points: ["Stay upright for 4 hours", "No sports or sauna for 24 hours", "Don't massage or rub treated areas", "No makeup for 4-6 hours", "Free touch-up possible after 14 days"] },
      lipsAftercare: { title: "Lip Aftercare", points: ["Swelling and bruising possible for up to 72 hours", "No sports or sauna for 24 hours", "No lipstick or lip gloss for 48 hours", "Don't massage lips (unless recommended)", "Drink plenty of water for optimal hydration", "Free touch-up possible after 14 days"] },
      skinAftercare: { title: "Skin Treatment Aftercare", points: ["No makeup for 24 hours", "No sports or sauna for 24-48 hours", "Avoid direct sun for 48 hours", "Gentle skincare for 3-5 days", "Drink enough water", "Next session after approx. 3 weeks"] }
    },
    consent: {
      intro: "Please confirm:",
      c1: "I have fully read and understood the treatment information. I have answered all questions truthfully. I consent to the treatment and storage of my data.",
      signature: "Digital Signature",
      signatureHint: "Please sign with your finger or mouse:",
      clear: "Clear", submit: "Submit Form", submitting: "Submitting...",
      signatureRequired: "Please sign the form",
      successTitle: "Thank you!",
      successMessage: "We have received your inquiry and will contact you soon."
    },
    next: "Next", back: "Back", required: "* Required fields", selectTreatment: "Please select at least one treatment"
  },
  ru: {
    langSelect: { title: "Добро пожаловать", subtitle: "Пожалуйста, выберите язык", continue: "Далее" },
    title: "Эстетическое лечение",
    subtitle: "Информация и анамнез",
    practitioner: "Анна Гришченко • Эстетическая медицина",
    treatmentSelect: {
      title: "Какая процедура вас интересует?",
      hint: "Необязательный выбор – обсудим лично",
      botox: "Ботулотоксин", botoxDesc: "Коррекция и профилактика морщин",
      lips: "Губы (гиалурон)", lipsDesc: "Объём, контур и увлажнение",
      skin: "Улучшение кожи", skinDesc: "Полинуклеотиды, скинбустеры, мезотерапия"
    },
    sections: { language: "Язык", treatment: "Выбор процедуры", interests: "Детали процедуры", personal: "Личные данные", anamnesis: "Анкета здоровья", info: "Информация о лечении", consent: "Согласие на лечение" },
    interests: { title: "Что вас интересует?", hint: "Необязательный выбор – не бронирование, только для подготовки консультации" },
    fields: { firstName: "Имя", lastName: "Фамилия", birthDate: "Дата рождения", address: "Адрес", phone: "Телефон", email: "Электронная почта", profession: "Профессия" },
    botoxInterests: {
      packagesTitle: "Пакеты ботокс",
      packages: ["Межбровная + лоб", "Верхняя часть лица (3 зоны)", "Full Face", "Full Face + шея"],
      areasTitle: "Отдельные зоны ботокс",
      areas: ["Межбровная морщина", "Лоб", "«Гусиные лапки»", "Морщины подбородка", "Носовые морщины", "Lip Flip", "Подъём бровей", "Кончик носа", "Платизма/шея", "Гипергидроз"]
    },
    lipsInterests: { title: "Процедуры для губ", options: ["Увеличение губ", "Коррекция асимметрии", "Увлажнение губ", "Гиалуронидаза (растворение)"] },
    skinInterests: {
      treatmentsTitle: "Процедуры улучшения кожи",
      treatments: ["Полинуклеотиды", "Скинбустер/биоревитализация", "Мезотерапия"],
      zonesTitle: "Зоны лечения",
      zones: ["Лицо", "Зона глаз", "Шея + декольте", "Руки", "Зона вульвы"]
    },
    anamnesis: {
      intro: "Пожалуйста, ответьте на вопросы о вашем здоровье.",
      q1: "Вы беременны или кормите грудью?",
      q2: "У вас есть острые инфекции или воспалительные заболевания?",
      q2info: "Напр., простуда, грипп, температура, кожные инфекции",
      q3: "Страдаете ли вы неврологическими заболеваниями?",
      q3info: "Напр., эпилепсия, миастения, БАС, рассеянный склероз",
      q4: "У вас есть аутоиммунные заболевания?",
      q4info: "Напр., волчанка, ревматоидный артрит, Хашимото",
      q5: "Вы проходите онкологическое лечение?",
      q5info: "Химиотерапия, лучевая терапия, иммунотерапия",
      q6: "У вас есть нарушения свёртываемости крови?",
      q6info: "Напр., гемофилия, болезнь Виллебранда",
      q7: "У вас декомпенсированный диабет или тяжёлые хронические заболевания?",
      q7info: "Декомпенсированный = уровень сахара плохо контролируется",
      q8: "У вас есть известные аллергии или непереносимость?",
      q8info: "Особенно: ботулотоксин, гиалуроновая кислота, лекарства, латекс",
      q8placeholder: "Укажите все известные аллергии...",
      q9: "Склонны ли вы к образованию келоидов?",
      q9info: "Чрезмерное рубцевание после травм",
      q10: "У вас есть нерассасывающиеся импланты в зоне лечения?",
      q10info: "Напр., перманентные филеры, силиконовые импланты",
      q11: "Вы принимаете препараты, разжижающие кровь?",
      q11info: "Напр., аспирин, варфарин, ксарелто, ибупрофен",
      q12: "Какие лекарства вы принимаете регулярно?",
      q12placeholder: "Перечислите все текущие лекарства...",
      q13: "Делали ли вам ранее эстетические инъекции?",
      q13sub: "Если да, какие и когда?",
      q13placeholder: "Напр., 'Ботокс 6 месяцев назад' или 'Первая процедура'",
      q14: "Есть ли у вас вопросы?",
      q14hint: "Мы можем обсудить их на приёме.",
      q14placeholder: "Необязательно: ваши вопросы...",
      yes: "Да", no: "Нет", details: "Укажите детали:"
    },
    info: {
      summaryTitle: "Важная информация",
      botoxTitle: "Ботулотоксин",
      botoxSummary: "Ботулотоксин временно блокирует передачу сигналов между нервами и мышцами. Первые результаты через несколько дней, окончательный результат через две недели. Бесплатная коррекция между 2-й и 3-й неделей. Длительность: 3-4 месяца.",
      botoxDuration: "(В индивидуальных случаях эффект может длиться до 8 месяцев – в зависимости от обмена веществ, мышечной активности и образа жизни.)",
      lipsTitle: "Губы (гиалурон)",
      lipsSummary: "Гиалуроновая кислота — природное вещество, добавляющее объём и увлажнение. Результат виден сразу, окончательный — после уменьшения отёка (2 недели). Бесплатная коррекция возможна. Длительность: 6-12 месяцев.",
      skinTitle: "Улучшение кожи",
      skinSummary: "Полинуклеотиды и скинбустеры регенерируют кожу изнутри. Для оптимальных результатов рекомендовано 3-4 сеанса с интервалом ~3 недели. План лечения обсуждается индивидуально.",
      aftercareTitle: "Уход после процедуры",
      botoxAftercare: { title: "Уход после ботулотоксина", points: ["Оставайтесь вертикально 4 часа", "Без спорта и сауны 24 часа", "Не массируйте обработанные участки", "Без макияжа 4-6 часов", "Бесплатная коррекция через 14 дней"] },
      lipsAftercare: { title: "Уход после губ", points: ["До 72 часов возможен отёк и синяки", "Без спорта и сауны 24 часа", "48 часов без помады и блеска", "Не массируйте губы (если не рекомендовано)", "Пейте много воды", "Бесплатная коррекция через 14 дней"] },
      skinAftercare: { title: "Уход после кожи", points: ["24 часа без макияжа", "24-48 часов без спорта и сауны", "48 часов избегайте солнца", "Мягкий уход за кожей 3-5 дней", "Пейте достаточно воды", "Следующий сеанс через ~3 недели"] }
    },
    consent: {
      intro: "Пожалуйста, подтвердите:",
      c1: "Я прочитал(а) и полностью понял(а) информацию о лечении. Я правдиво ответил(а) на все вопросы. Я даю согласие на лечение и хранение моих данных.",
      signature: "Цифровая подпись",
      signatureHint: "Подпишите пальцем или мышью:",
      clear: "Очистить", submit: "Отправить форму", submitting: "Отправляется...",
      signatureRequired: "Пожалуйста, подпишите форму",
      successTitle: "Спасибо!",
      successMessage: "Мы получили ваш запрос и свяжемся с вами в ближайшее время."
    },
    next: "Далее", back: "Назад", required: "* Обязательные поля", selectTreatment: "Выберите хотя бы одну процедуру"
  }
};

const langFlags = { de: '🇩🇪', ua: '🇺🇦', en: '🇬🇧', ru: '🇷🇺' };

export default function CombinedIntakeForm() {
  const [lang, setLang] = useState(null);
  const [step, setStep] = useState(0);
  const [treatments, setTreatments] = useState({ botox: false, lips: false, skin: false });
  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', birthDate: '', address: '', phone: '', email: '', profession: '' },
    botoxInterests: [], lipsInterests: [], skinTreatments: [], skinZones: [],
    anamnesis: { q8: '', q12: '', q13: '' },
    consent: false, signature: null
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => { window.emailjs?.init(EMAILJS_PUBLIC_KEY); };
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const t = lang ? translations[lang] : translations.de;
  const hasTreatment = treatments.botox || treatments.lips || treatments.skin;
  const steps = ['language', 'treatment', 'interests', 'personal', 'anamnesis', 'info', 'consent'];

  const colors = {
    primary: '#6B5B4F', primaryLight: '#8B7B6F', bg: '#FDF9F7', bgCard: '#F5EBE6',
    accent: '#D4A89A', text: '#4A3F35', textLight: '#7A6F65', border: '#E5DDD8', error: '#C45C4A'
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: `1px solid ${colors.border}`, borderRadius: '8px', backgroundColor: '#fff', color: colors.text, fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
  const inputErrorStyle = { ...inputStyle, borderColor: colors.error };

  const toggleTreatment = (key) => { setTreatments(prev => ({ ...prev, [key]: !prev[key] })); if (errors.treatment) setErrors(prev => ({ ...prev, treatment: false })); };
  const toggleInterest = (category, item) => { setFormData(prev => ({ ...prev, [category]: prev[category].includes(item) ? prev[category].filter(i => i !== item) : [...prev[category], item] })); };
  const updatePersonal = (field, value) => { setFormData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } })); if (errors[field]) setErrors(prev => ({ ...prev, [field]: false })); };
  const updateAnamnesis = (field, value) => { setFormData(prev => ({ ...prev, anamnesis: { ...prev.anamnesis, [field]: value } })); if (errors[field]) setErrors(prev => ({ ...prev, [field]: false })); };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0 && !lang) newErrors.lang = true;
    if (step === 1 && !hasTreatment) newErrors.treatment = true;
    if (step === 3) { ['firstName', 'lastName', 'birthDate', 'address', 'phone', 'email', 'profession'].forEach(f => { if (!formData.personal[f]) newErrors[f] = true; }); }
    if (step === 4) {
      ['q1','q2','q3','q4','q5','q6','q7','q9','q10','q11'].forEach(q => { if (!formData.anamnesis[q]) newErrors[q] = true; });
      if (!formData.anamnesis.q8?.trim()) newErrors.q8 = true;
      if (!formData.anamnesis.q12?.trim()) newErrors.q12 = true;
      if (!formData.anamnesis.q13?.trim()) newErrors.q13 = true;
    }
    if (step === 6) { if (!formData.consent) newErrors.consent = true; if (!formData.signature) newErrors.signature = true; }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(steps.length - 1, s + 1)); };
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const startDrawing = (e) => {
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d');
    ctx.strokeStyle = colors.primary; ctx.lineWidth = 2; ctx.lineCap = 'round';
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * scaleX;
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * scaleY;
    ctx.beginPath(); ctx.moveTo(x, y); setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return; e.preventDefault();
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * scaleX;
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * scaleY;
    ctx.lineTo(x, y); ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) { setIsDrawing(false); setFormData(prev => ({ ...prev, signature: canvasRef.current?.toDataURL() })); if (errors.signature) setErrors(prev => ({ ...prev, signature: false })); }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(prev => ({ ...prev, signature: null }));
  };

  const generatePDF = () => {
    const pdf = new jsPDF(); let y = 20; const lineHeight = 7; const marginLeft = 20; const pageWidth = 170;
    pdf.setFontSize(18); pdf.setFont(undefined, 'bold'); pdf.text('ÄSTHETISCHE BEHANDLUNG', marginLeft, y); y += 8;
    pdf.setFontSize(12); pdf.setFont(undefined, 'normal'); pdf.text('Aufklärung & Anamnese', marginLeft, y); y += 6;
    pdf.setFontSize(10); pdf.text('Anna Hryshchenko • Ästhetische Medizin', marginLeft, y); y += 12;
    
    pdf.setFontSize(12); pdf.setFont(undefined, 'bold'); pdf.text('GEWÄHLTE BEHANDLUNGEN', marginLeft, y); y += 8;
    pdf.setFontSize(10); pdf.setFont(undefined, 'normal');
    const selectedTreatments = [];
    if (treatments.botox) selectedTreatments.push('Botulinumtoxin');
    if (treatments.lips) selectedTreatments.push('Lippen (Hyaluron)');
    if (treatments.skin) selectedTreatments.push('Hautverbesserung');
    pdf.text(selectedTreatments.join(', '), marginLeft, y); y += 10;
    
    pdf.setFontSize(12); pdf.setFont(undefined, 'bold'); pdf.text('PERSÖNLICHE DATEN', marginLeft, y); y += 8;
    pdf.setFontSize(10); pdf.setFont(undefined, 'normal');
    pdf.text(`Name: ${formData.personal.firstName} ${formData.personal.lastName}`, marginLeft, y); y += lineHeight;
    pdf.text(`Geburtsdatum: ${formData.personal.birthDate}`, marginLeft, y); y += lineHeight;
    pdf.text(`Adresse: ${formData.personal.address}`, marginLeft, y); y += lineHeight;
    pdf.text(`Telefon: ${formData.personal.phone}`, marginLeft, y); y += lineHeight;
    pdf.text(`E-Mail: ${formData.personal.email}`, marginLeft, y); y += lineHeight;
    pdf.text(`Beruf: ${formData.personal.profession}`, marginLeft, y); y += 12;
    
    pdf.setFontSize(12); pdf.setFont(undefined, 'bold'); pdf.text('BEHANDLUNGSINTERESSE', marginLeft, y); y += 8;
    pdf.setFontSize(10); pdf.setFont(undefined, 'normal');
    if (treatments.botox && formData.botoxInterests.length > 0) { const lines = pdf.splitTextToSize(`Botox: ${formData.botoxInterests.join(', ')}`, pageWidth); pdf.text(lines, marginLeft, y); y += lines.length * lineHeight; }
    if (treatments.lips && formData.lipsInterests.length > 0) { const lines = pdf.splitTextToSize(`Lippen: ${formData.lipsInterests.join(', ')}`, pageWidth); pdf.text(lines, marginLeft, y); y += lines.length * lineHeight; }
    if (treatments.skin && (formData.skinTreatments.length > 0 || formData.skinZones.length > 0)) { const lines = pdf.splitTextToSize(`Haut: ${formData.skinTreatments.join(', ')} (Zonen: ${formData.skinZones.join(', ')})`, pageWidth); pdf.text(lines, marginLeft, y); y += lines.length * lineHeight; }
    y += 4;
    
    if (y > 200) { pdf.addPage(); y = 20; }
    pdf.setFontSize(12); pdf.setFont(undefined, 'bold'); pdf.text('GESUNDHEITSFRAGEBOGEN', marginLeft, y); y += 8;
    pdf.setFontSize(10); pdf.setFont(undefined, 'normal');
    const questions = [{ key: 'q1', text: 'Schwanger/Stillend' }, { key: 'q2', text: 'Akute Infektionen' }, { key: 'q3', text: 'Neurologische Erkrankungen' }, { key: 'q4', text: 'Autoimmunerkrankungen' }, { key: 'q5', text: 'Onkologische Behandlung' }, { key: 'q6', text: 'Blutgerinnungsstörungen' }, { key: 'q7', text: 'Diabetes/Chron. Erkrankungen' }, { key: 'q9', text: 'Keloidneigung' }, { key: 'q10', text: 'Implantate' }, { key: 'q11', text: 'Blutverdünnende Medikamente' }];
    questions.forEach(q => { const answer = formData.anamnesis[q.key] === 'yes' ? 'Ja' : formData.anamnesis[q.key] === 'no' ? 'Nein' : '-'; const details = formData.anamnesis[q.key + '_details'] || ''; pdf.text(`${q.text}: ${answer}${details ? ' (' + details + ')' : ''}`, marginLeft, y); y += lineHeight; if (y > 270) { pdf.addPage(); y = 20; } });
    y += 4;
    const allergyLines = pdf.splitTextToSize(`Allergien: ${formData.anamnesis.q8 || '-'}`, pageWidth); pdf.text(allergyLines, marginLeft, y); y += allergyLines.length * lineHeight;
    const medLines = pdf.splitTextToSize(`Medikamente: ${formData.anamnesis.q12 || '-'}`, pageWidth); pdf.text(medLines, marginLeft, y); y += medLines.length * lineHeight;
    const prevLines = pdf.splitTextToSize(`Vorherige Behandlungen: ${formData.anamnesis.q13 || '-'}`, pageWidth); pdf.text(prevLines, marginLeft, y); y += prevLines.length * lineHeight;
    if (formData.anamnesis.q14) { const qLines = pdf.splitTextToSize(`Offene Fragen: ${formData.anamnesis.q14}`, pageWidth); pdf.text(qLines, marginLeft, y); y += qLines.length * lineHeight; }
    y += 8;
    
    if (y > 220) { pdf.addPage(); y = 20; }
    pdf.setFontSize(12); pdf.setFont(undefined, 'bold'); pdf.text('EINVERSTÄNDNISERKLÄRUNG', marginLeft, y); y += 8;
    pdf.setFontSize(10); pdf.setFont(undefined, 'normal'); pdf.text('Hiermit bestätige ich:', marginLeft, y); y += lineHeight;
    const consentText = '• Ich habe die Informationen zur Behandlung gelesen und verstanden.\n• Ich habe alle Fragen wahrheitsgemäß beantwortet.\n• Ich willige in die Behandlung und Datenspeicherung ein.';
    const consentLines = pdf.splitTextToSize(consentText, pageWidth); pdf.text(consentLines, marginLeft, y); y += consentLines.length * lineHeight + 8;
    pdf.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, marginLeft, y); y += lineHeight + 4;
    pdf.text('Unterschrift:', marginLeft, y); y += 4;
    if (formData.signature) { try { pdf.addImage(formData.signature, 'PNG', marginLeft, y, 60, 25); } catch (e) { console.error('Fehler Unterschrift:', e); } }
    return pdf;
  };

  const uploadPDFToCloudinary = async (pdfBlob) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', pdfBlob);
    formDataUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formDataUpload.append('resource_type', 'raw');
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, { method: 'POST', body: formDataUpload });
    const data = await response.json();
    return data.secure_url;
  };

  const submitForm = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      const pdf = generatePDF();
      const pdfBlob = pdf.output('blob');
      let pdfUrl = '';
      try { pdfUrl = await uploadPDFToCloudinary(pdfBlob); } catch (e) { console.error('PDF Upload fehlgeschlagen:', e); }
      
      const selectedTreatments = [];
      if (treatments.botox) selectedTreatments.push('Botox');
      if (treatments.lips) selectedTreatments.push('Lippen');
      if (treatments.skin) selectedTreatments.push('Hautverbesserung');

      const submitData = {
        behandlungen: selectedTreatments.join(', '),
        name: `${formData.personal.firstName} ${formData.personal.lastName}`,
        email: formData.personal.email, telefon: formData.personal.phone,
        geburtsdatum: formData.personal.birthDate, adresse: formData.personal.address, beruf: formData.personal.profession,
        botox_interesse: formData.botoxInterests.join(', ') || '-',
        lippen_interesse: formData.lipsInterests.join(', ') || '-',
        haut_behandlungen: formData.skinTreatments.join(', ') || '-',
        haut_zonen: formData.skinZones.join(', ') || '-',
        schwanger_stillend: formData.anamnesis.q1 === 'yes' ? `Ja - ${formData.anamnesis.q1_details || ''}` : 'Nein',
        infektionen: formData.anamnesis.q2 === 'yes' ? `Ja - ${formData.anamnesis.q2_details || ''}` : 'Nein',
        neurologisch: formData.anamnesis.q3 === 'yes' ? `Ja - ${formData.anamnesis.q3_details || ''}` : 'Nein',
        autoimmun: formData.anamnesis.q4 === 'yes' ? `Ja - ${formData.anamnesis.q4_details || ''}` : 'Nein',
        onkologisch: formData.anamnesis.q5 === 'yes' ? `Ja - ${formData.anamnesis.q5_details || ''}` : 'Nein',
        blutgerinnung: formData.anamnesis.q6 === 'yes' ? `Ja - ${formData.anamnesis.q6_details || ''}` : 'Nein',
        diabetes_chronisch: formData.anamnesis.q7 === 'yes' ? `Ja - ${formData.anamnesis.q7_details || ''}` : 'Nein',
        allergien: formData.anamnesis.q8,
        keloid: formData.anamnesis.q9 === 'yes' ? `Ja - ${formData.anamnesis.q9_details || ''}` : 'Nein',
        implantate: formData.anamnesis.q10 === 'yes' ? `Ja - ${formData.anamnesis.q10_details || ''}` : 'Nein',
        blutverduenner: formData.anamnesis.q11 === 'yes' ? `Ja - ${formData.anamnesis.q11_details || ''}` : 'Nein',
        medikamente: formData.anamnesis.q12,
        vorherige_behandlungen: formData.anamnesis.q13,
        offene_fragen: formData.anamnesis.q14 || 'Keine',
        unterschrift_datum: new Date().toLocaleDateString('de-DE'),
        unterschrift_bild: formData.signature || 'Keine Unterschrift',
        pdf_dokument: pdfUrl || 'PDF Upload fehlgeschlagen',
        formular_sprache: lang?.toUpperCase()
      };
      
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submitData) });
      
      if (response.ok) {
        try { if (window.emailjs) { await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email: formData.personal.email, to_name: `${formData.personal.firstName} ${formData.personal.lastName}` }); } } catch (emailError) { console.error('Bestätigungs-E-Mail fehlgeschlagen:', emailError); }
        setSubmitted(true);
      } else { alert('Fehler beim Senden. Bitte versuchen Sie es erneut.'); }
    } catch (error) { console.error('Fehler:', error); alert('Fehler beim Senden.'); }
    setIsSubmitting(false);
  };

  const InfoButton = ({ infoKey }) => (<button onClick={() => setExpandedInfo(expandedInfo === infoKey ? null : infoKey)} style={{ marginLeft: '8px', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: expandedInfo === infoKey ? colors.primary : colors.bgCard, color: expandedInfo === infoKey ? '#fff' : colors.primary, border: `1px solid ${colors.border}` }}>i</button>);
  const TreatmentCard = ({ id, icon, label, desc, selected }) => (<div onClick={() => toggleTreatment(id)} style={{ padding: '20px', borderRadius: '12px', cursor: 'pointer', backgroundColor: selected ? colors.bgCard : '#fff', border: `2px solid ${selected ? colors.accent : colors.border}`, transition: 'all 0.2s', textAlign: 'center' }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div><div style={{ fontWeight: '600', color: colors.primary, marginBottom: '4px' }}>{label}</div><div style={{ fontSize: '12px', color: colors.textLight }}>{desc}</div></div>);
  const AftercareBox = ({ title, points, icon }) => (<div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: `1px solid ${colors.border}`, marginBottom: '12px' }}><h4 style={{ fontWeight: '600', color: colors.primary, marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><span>{icon}</span> {title}</h4><ul style={{ margin: 0, paddingLeft: '20px', color: colors.text, fontSize: '13px', lineHeight: '1.8' }}>{points.map((point, i) => <li key={i}>{point}</li>)}</ul></div>);

  if (submitted) {
    return (<div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui, sans-serif', textAlign: 'center', paddingTop: '60px' }}><div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: colors.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: `3px solid ${colors.accent}` }}><span style={{ fontSize: '36px' }}>✓</span></div><h2 style={{ fontSize: '24px', fontWeight: '500', color: colors.primary, marginBottom: '16px' }}>{t.consent.successTitle}</h2><p style={{ fontSize: '16px', color: colors.textLight, lineHeight: '1.6' }}>{t.consent.successMessage}</p><p style={{ fontSize: '14px', color: colors.accent, marginTop: '24px' }}>{t.practitioner}</p></div>);
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui, sans-serif', color: colors.text }}>
      {step === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ marginBottom: '32px' }}><h1 style={{ fontSize: '24px', fontWeight: '500', color: colors.primary, marginBottom: '8px' }}>{translations.de.langSelect.title}</h1><p style={{ color: colors.textLight, fontSize: '16px' }}>{translations.de.langSelect.subtitle}</p></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '300px', margin: '0 auto 32px' }}>{Object.entries(langFlags).map(([l, flag]) => (<button key={l} onClick={() => { setLang(l); setErrors({}); }} style={{ padding: '20px', borderRadius: '16px', fontSize: '48px', border: lang === l ? `3px solid ${colors.accent}` : `2px solid ${colors.border}`, backgroundColor: lang === l ? colors.bgCard : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>{flag}</button>))}</div>
          {errors.lang && <p style={{ color: colors.error, fontSize: '14px', marginBottom: '16px' }}>Bitte wählen Sie eine Sprache</p>}
          <button onClick={nextStep} style={{ padding: '14px 48px', backgroundColor: colors.primary, color: '#fff', borderRadius: '10px', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '16px' }}>{lang ? translations[lang].langSelect.continue : translations.de.langSelect.continue}</button>
          <p style={{ color: colors.accent, fontSize: '13px', marginTop: '32px' }}>{translations.de.practitioner}</p>
        </div>
      )}

      {step > 0 && (<>
        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px', background: `linear-gradient(135deg, ${colors.bgCard} 0%, ${colors.bg} 100%)`, borderRadius: '16px' }}><h1 style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', color: colors.primary, margin: '0 0 4px' }}>{t.title}</h1><p style={{ color: colors.textLight, margin: '4px 0', fontSize: '14px' }}>{t.subtitle}</p><p style={{ color: colors.accent, fontSize: '12px', margin: '8px 0 0' }}>{t.practitioner}</p></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', padding: '0 4px' }}>{steps.slice(1).map((s, i) => (<div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}><div style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '500', backgroundColor: i < step ? colors.primary : colors.bgCard, color: i < step ? '#fff' : colors.textLight }}>{i + 1}</div>{i < steps.length - 2 && <div style={{ flex: 1, height: '2px', margin: '0 4px', backgroundColor: i < step - 1 ? colors.primary : colors.border }} />}</div>))}</div>

        <div style={{ minHeight: '400px' }}>
          {step === 1 && (<div><h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: colors.primary }}>{t.treatmentSelect.title}</h2><p style={{ color: colors.textLight, marginBottom: '20px', fontSize: '14px' }}>{t.treatmentSelect.hint}</p>{errors.treatment && <p style={{ color: colors.error, fontSize: '13px', marginBottom: '12px' }}>{t.selectTreatment}</p>}<div style={{ display: 'grid', gap: '16px' }}><TreatmentCard id="botox" icon="💉" label={t.treatmentSelect.botox} desc={t.treatmentSelect.botoxDesc} selected={treatments.botox} /><TreatmentCard id="lips" icon="💋" label={t.treatmentSelect.lips} desc={t.treatmentSelect.lipsDesc} selected={treatments.lips} /><TreatmentCard id="skin" icon="✨" label={t.treatmentSelect.skin} desc={t.treatmentSelect.skinDesc} selected={treatments.skin} /></div></div>)}

          {step === 2 && (<div><h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: colors.primary }}>{t.interests.title}</h2><p style={{ color: colors.textLight, marginBottom: '20px', fontSize: '13px', padding: '12px', backgroundColor: colors.bgCard, borderRadius: '8px', borderLeft: `3px solid ${colors.accent}` }}>{t.interests.hint}</p>
            {treatments.botox && (<div style={{ marginBottom: '24px' }}><h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: colors.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>💉 {t.botoxInterests.packagesTitle}</h3><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>{t.botoxInterests.packages.map(pkg => (<label key={pkg} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.botoxInterests.includes(pkg) ? colors.bgCard : '#fff', border: `1px solid ${formData.botoxInterests.includes(pkg) ? colors.accent : colors.border}` }}><input type="checkbox" checked={formData.botoxInterests.includes(pkg)} onChange={() => toggleInterest('botoxInterests', pkg)} style={{ accentColor: colors.primary }} /><span style={{ fontSize: '13px' }}>{pkg}</span></label>))}</div><h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: colors.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.botoxInterests.areasTitle}</h3><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{t.botoxInterests.areas.map(area => (<label key={area} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.botoxInterests.includes(area) ? colors.bgCard : '#fff', border: `1px solid ${formData.botoxInterests.includes(area) ? colors.accent : colors.border}` }}><input type="checkbox" checked={formData.botoxInterests.includes(area)} onChange={() => toggleInterest('botoxInterests', area)} style={{ accentColor: colors.primary }} /><span style={{ fontSize: '13px' }}>{area}</span></label>))}</div></div>)}
            {treatments.lips && (<div style={{ marginBottom: '24px' }}><h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: colors.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>💋 {t.lipsInterests.title}</h3><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{t.lipsInterests.options.map(opt => (<label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.lipsInterests.includes(opt) ? colors.bgCard : '#fff', border: `1px solid ${formData.lipsInterests.includes(opt) ? colors.accent : colors.border}` }}><input type="checkbox" checked={formData.lipsInterests.includes(opt)} onChange={() => toggleInterest('lipsInterests', opt)} style={{ accentColor: colors.primary }} /><span style={{ fontSize: '13px' }}>{opt}</span></label>))}</div></div>)}
            {treatments.skin && (<div style={{ marginBottom: '24px' }}><h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: colors.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>✨ {t.skinInterests.treatmentsTitle}</h3><div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '16px' }}>{t.skinInterests.treatments.map(tr => (<label key={tr} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.skinTreatments.includes(tr) ? colors.bgCard : '#fff', border: `1px solid ${formData.skinTreatments.includes(tr) ? colors.accent : colors.border}` }}><input type="checkbox" checked={formData.skinTreatments.includes(tr)} onChange={() => toggleInterest('skinTreatments', tr)} style={{ accentColor: colors.primary }} /><span style={{ fontSize: '13px' }}>{tr}</span></label>))}</div><h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: colors.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.skinInterests.zonesTitle}</h3><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{t.skinInterests.zones.map(zone => (<label key={zone} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.skinZones.includes(zone) ? colors.bgCard : '#fff', border: `1px solid ${formData.skinZones.includes(zone) ? colors.accent : colors.border}` }}><input type="checkbox" checked={formData.skinZones.includes(zone)} onChange={() => toggleInterest('skinZones', zone)} style={{ accentColor: colors.primary }} /><span style={{ fontSize: '13px' }}>{zone}</span></label>))}</div></div>)}
          </div>)}

          {step === 3 && (<div><h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: colors.primary }}>{t.sections.personal}</h2><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}><div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.firstName} *</label><input style={errors.firstName ? inputErrorStyle : inputStyle} value={formData.personal.firstName} onChange={e => updatePersonal('firstName', e.target.value)} /></div><div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.lastName} *</label><input style={errors.lastName ? inputErrorStyle : inputStyle} value={formData.personal.lastName} onChange={e => updatePersonal('lastName', e.target.value)} /></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}><div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.birthDate} *</label><input type="date" style={errors.birthDate ? inputErrorStyle : inputStyle} value={formData.personal.birthDate} onChange={e => updatePersonal('birthDate', e.target.value)} /></div><div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.profession} *</label><input style={errors.profession ? inputErrorStyle : inputStyle} value={formData.personal.profession} onChange={e => updatePersonal('profession', e.target.value)} /></div></div><div style={{ marginTop: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.address} *</label><input style={errors.address ? inputErrorStyle : inputStyle} value={formData.personal.address} onChange={e => updatePersonal('address', e.target.value)} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}><div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.phone} *</label><input type="tel" style={errors.phone ? inputErrorStyle : inputStyle} value={formData.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} /></div><div><label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.email} *</label><input type="email" style={errors.email ? inputErrorStyle : inputStyle} value={formData.personal.email} onChange={e => updatePersonal('email', e.target.value)} /></div></div><p style={{ fontSize: '12px', color: colors.textLight, marginTop: '16px' }}>{t.required}</p></div>)}

          {step === 4 && (<div><h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: colors.primary }}>{t.sections.anamnesis}</h2><p style={{ color: colors.textLight, marginBottom: '20px', fontSize: '14px' }}>{t.anamnesis.intro}</p>
            {['q1','q2','q3','q4','q5','q6','q7','q9','q10','q11'].map((q, i) => (<div key={q} style={{ padding: '14px', backgroundColor: errors[q] ? '#FEF2F0' : colors.bgCard, borderRadius: '10px', marginBottom: '10px', border: errors[q] ? `1px solid ${colors.error}` : 'none' }}><div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}><span style={{ fontWeight: '500', fontSize: '14px', flex: 1 }}>{i + 1}. {t.anamnesis[q]} *{t.anamnesis[q + 'info'] && <InfoButton infoKey={q} />}</span></div>{expandedInfo === q && t.anamnesis[q + 'info'] && (<p style={{ fontSize: '12px', color: colors.textLight, marginBottom: '8px', padding: '8px', backgroundColor: '#fff', borderRadius: '6px', borderLeft: `3px solid ${colors.accent}` }}>{t.anamnesis[q + 'info']}</p>)}<div style={{ display: 'flex', gap: '16px' }}><label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="radio" name={q} checked={formData.anamnesis[q] === 'yes'} onChange={() => updateAnamnesis(q, 'yes')} style={{ accentColor: colors.primary }} /><span style={{ fontSize: '14px' }}>{t.anamnesis.yes}</span></label><label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="radio" name={q} checked={formData.anamnesis[q] === 'no'} onChange={() => updateAnamnesis(q, 'no')} style={{ accentColor: colors.primary }} /><span style={{ fontSize: '14px' }}>{t.anamnesis.no}</span></label></div>{formData.anamnesis[q] === 'yes' && (<input placeholder={t.anamnesis.details} style={{ ...inputStyle, marginTop: '8px' }} value={formData.anamnesis[q + '_details'] || ''} onChange={e => updateAnamnesis(q + '_details', e.target.value)} />)}</div>))}
            <div style={{ padding: '14px', backgroundColor: errors.q8 ? '#FEF2F0' : colors.bgCard, borderRadius: '10px', marginBottom: '10px' }}><span style={{ fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>11. {t.anamnesis.q8} *<InfoButton infoKey="q8" /></span>{expandedInfo === 'q8' && <p style={{ fontSize: '12px', color: colors.textLight, marginBottom: '8px', padding: '8px', backgroundColor: '#fff', borderRadius: '6px', borderLeft: `3px solid ${colors.accent}` }}>{t.anamnesis.q8info}</p>}<textarea placeholder={t.anamnesis.q8placeholder} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={formData.anamnesis.q8} onChange={e => updateAnamnesis('q8', e.target.value)} /></div>
            <div style={{ padding: '14px', backgroundColor: errors.q12 ? '#FEF2F0' : colors.bgCard, borderRadius: '10px', marginBottom: '10px' }}><span style={{ fontWeight: '500', fontSize: '14px', display: 'block', marginBottom: '8px' }}>12. {t.anamnesis.q12} *</span><textarea placeholder={t.anamnesis.q12placeholder} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={formData.anamnesis.q12} onChange={e => updateAnamnesis('q12', e.target.value)} /></div>
            <div style={{ padding: '14px', backgroundColor: errors.q13 ? '#FEF2F0' : colors.bgCard, borderRadius: '10px', marginBottom: '10px' }}><span style={{ fontWeight: '500', fontSize: '14px', display: 'block', marginBottom: '4px' }}>13. {t.anamnesis.q13} *</span><span style={{ fontSize: '12px', color: colors.textLight, display: 'block', marginBottom: '8px' }}>{t.anamnesis.q13sub}</span><input placeholder={t.anamnesis.q13placeholder} style={inputStyle} value={formData.anamnesis.q13} onChange={e => updateAnamnesis('q13', e.target.value)} /></div>
            <div style={{ padding: '14px', backgroundColor: colors.bgCard, borderRadius: '10px', border: `1px dashed ${colors.border}` }}><span style={{ fontWeight: '500', fontSize: '14px', display: 'block', marginBottom: '4px' }}>{t.anamnesis.q14}</span><span style={{ fontSize: '12px', color: colors.textLight, display: 'block', marginBottom: '8px' }}>{t.anamnesis.q14hint}</span><textarea placeholder={t.anamnesis.q14placeholder} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={formData.anamnesis.q14 || ''} onChange={e => updateAnamnesis('q14', e.target.value)} /></div>
          </div>)}

          {step === 5 && (<div><h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: colors.primary }}>{t.sections.info}</h2>
            {treatments.botox && (<div style={{ padding: '16px', backgroundColor: colors.bgCard, borderRadius: '12px', marginBottom: '12px', borderLeft: `4px solid ${colors.accent}` }}><h3 style={{ fontWeight: '600', color: colors.primary, marginBottom: '8px', fontSize: '14px' }}>💉 {t.info.botoxTitle}</h3><p style={{ color: colors.text, lineHeight: '1.5', fontSize: '13px' }}>{t.info.botoxSummary}</p><p style={{ color: colors.textLight, lineHeight: '1.5', fontSize: '12px', marginTop: '6px', fontStyle: 'italic' }}>{t.info.botoxDuration}</p></div>)}
            {treatments.lips && (<div style={{ padding: '16px', backgroundColor: colors.bgCard, borderRadius: '12px', marginBottom: '12px', borderLeft: `4px solid ${colors.accent}` }}><h3 style={{ fontWeight: '600', color: colors.primary, marginBottom: '8px', fontSize: '14px' }}>💋 {t.info.lipsTitle}</h3><p style={{ color: colors.text, lineHeight: '1.5', fontSize: '13px' }}>{t.info.lipsSummary}</p></div>)}
            {treatments.skin && (<div style={{ padding: '16px', backgroundColor: colors.bgCard, borderRadius: '12px', marginBottom: '12px', borderLeft: `4px solid ${colors.accent}` }}><h3 style={{ fontWeight: '600', color: colors.primary, marginBottom: '8px', fontSize: '14px' }}>✨ {t.info.skinTitle}</h3><p style={{ color: colors.text, lineHeight: '1.5', fontSize: '13px' }}>{t.info.skinSummary}</p></div>)}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.primary, marginTop: '24px', marginBottom: '16px' }}>{t.info.aftercareTitle}</h3>
            {treatments.botox && <AftercareBox title={t.info.botoxAftercare.title} points={t.info.botoxAftercare.points} icon="💉" />}
            {treatments.lips && <AftercareBox title={t.info.lipsAftercare.title} points={t.info.lipsAftercare.points} icon="💋" />}
            {treatments.skin && <AftercareBox title={t.info.skinAftercare.title} points={t.info.skinAftercare.points} icon="✨" />}
          </div>)}

          {step === 6 && (<div><h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: colors.primary }}>{t.sections.consent}</h2><p style={{ color: colors.textLight, marginBottom: '16px', fontSize: '14px' }}>{t.consent.intro}</p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: errors.consent ? '#FEF2F0' : colors.bgCard, borderRadius: '12px', cursor: 'pointer', border: errors.consent ? `1px solid ${colors.error}` : `1px solid ${colors.border}`, marginBottom: '24px' }}><input type="checkbox" checked={formData.consent} onChange={e => { setFormData(prev => ({ ...prev, consent: e.target.checked })); if (errors.consent) setErrors(prev => ({ ...prev, consent: false })); }} style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: colors.primary, flexShrink: 0 }} /><span style={{ fontSize: '13px', lineHeight: '1.5' }}>{t.consent.c1}</span></label>
            <div style={{ marginTop: '20px' }}><h3 style={{ fontWeight: '500', marginBottom: '6px', fontSize: '14px', color: colors.primary }}>{t.consent.signature}</h3><p style={{ fontSize: '12px', color: colors.textLight, marginBottom: '10px' }}>{t.consent.signatureHint}</p><div style={{ border: `2px dashed ${errors.signature ? colors.error : colors.border}`, borderRadius: '12px', padding: '6px', backgroundColor: '#fff' }}><canvas ref={canvasRef} width={560} height={140} style={{ width: '100%', height: '140px', touchAction: 'none', cursor: 'crosshair' }} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} /></div>{errors.signature && <p style={{ color: colors.error, fontSize: '12px', marginTop: '6px' }}>{t.consent.signatureRequired}</p>}<button onClick={clearSignature} style={{ marginTop: '6px', fontSize: '12px', color: colors.textLight, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>{t.consent.clear}</button></div>
          </div>)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: `1px solid ${colors.border}` }}>
          <button onClick={prevStep} style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: '500', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: colors.textLight, fontSize: '15px' }}>{t.back}</button>
          {step < steps.length - 1 ? (<button onClick={nextStep} style={{ padding: '12px 32px', backgroundColor: colors.primary, color: '#fff', borderRadius: '10px', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '15px' }}>{t.next}</button>) : (<button onClick={submitForm} disabled={isSubmitting} style={{ padding: '12px 32px', borderRadius: '10px', fontWeight: '500', border: 'none', cursor: isSubmitting ? 'wait' : 'pointer', fontSize: '15px', backgroundColor: isSubmitting ? colors.textLight : colors.accent, color: '#fff' }}>{isSubmitting ? t.consent.submitting : t.consent.submit}</button>)}
        </div>
      </>)}
    </div>
  );
}
