"use client";
import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';

// Konfiguration
const FORMSPREE_ID = "mreoeaoz";
const CLOUDINARY_CLOUD_NAME = "drkele6gg";
const CLOUDINARY_UPLOAD_PRESET = "ah-aesthetic-forms";

// EmailJS Konfiguration (für Bestätigungs-E-Mail an Kundin)
const EMAILJS_SERVICE_ID = "service_cjnprwl";
const EMAILJS_TEMPLATE_ID = "template_r529kri";
const EMAILJS_PUBLIC_KEY = "ap3zsxj1pgoGQRSWQ";

const translations = {
  de: {
    title: "Botulinumtoxin-Behandlung",
    subtitle: "Aufklärung & Anamnese",
    practitioner: "Anna Hryshchenko • Ästhetische Medizin",
    sections: {
      personal: "Persönliche Daten",
      interests: "Behandlungsinteresse",
      anamnesis: "Gesundheitsfragebogen",
      info: "Behandlungsinformationen",
      consent: "Einverständniserklärung"
    },
    fields: {
      firstName: "Vorname",
      lastName: "Nachname",
      birthDate: "Geburtsdatum",
      address: "Adresse",
      phone: "Telefonnummer",
      email: "E-Mail",
      profession: "Beruf"
    },
    interests: {
      intro: "Für welche Behandlungen interessieren Sie sich?",
      hint: "(Unverbindliche Auswahl – wird im persönlichen Gespräch besprochen)",
      packagesTitle: "Behandlungspakete",
      packages: ["Zornesfalte + Stirn", "Oberes Gesicht (3 Zonen)", "Full Face", "Full Face + Hals"],
      areasTitle: "Einzelbehandlungen",
      areas: ["Zornesfalte", "Stirn", "Krähenfüße", "Kinnfalten", "Nasenfalten", "Lip Flip", "Brow Lift", "Nasenspitze", "Platysma/Hals", "Hyperhidrose (Schwitzen)"]
    },
    anamnesis: {
      intro: "Bitte beantworten Sie die folgenden Fragen zu Ihrer Gesundheit. Felder mit * sind Pflichtfelder.",
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
      q7info: "Dekompensiert = Blutzucker ist nicht gut eingestellt, häufige Entgleisungen",
      q8: "Haben Sie bekannte Allergien oder Unverträglichkeiten?",
      q8info: "Insbesondere: Botulinumtoxin, Medikamente, Latex (Handschuhe), Lebensmittel",
      q8placeholder: "Bitte alle bekannten Allergien und Unverträglichkeiten angeben...",
      q9: "Neigen Sie zu Keloidbildung?",
      q9info: "Wulstartige, überschießende Narbenbildung nach Verletzungen oder Operationen",
      q10: "Haben Sie nicht resorbierbare Implantate im Behandlungsbereich?",
      q10info: "Z.B. permanente Filler, Silikonimplantate im Gesicht",
      q11: "Nehmen Sie blutverdünnende Medikamente ein?",
      q11info: "Z.B. Aspirin, Marcumar, Xarelto, Eliquis, Ibuprofen, Omega-3 hochdosiert",
      q12: "Welche Medikamente nehmen Sie regelmäßig ein?",
      q12placeholder: "Bitte alle aktuellen Medikamente auflisten...",
      q13: "Hatten Sie bereits Botulinumtoxin-Behandlungen?",
      q13sub: "Wenn ja, wann war die letzte Behandlung?",
      q13placeholder: "Z.B. 'Ja, vor 6 Monaten' oder 'Nein, erste Behandlung'",
      q14: "Haben Sie noch offene Fragen?",
      q14hint: "Diese können wir gerne vor Ort direkt klären.",
      q14placeholder: "Optional: Ihre Fragen an uns...",
      yes: "Ja",
      no: "Nein",
      details: "Bitte Details angeben:",
      required: "Bitte beantworten Sie diese Frage"
    },
    info: {
      summaryTitle: "Zusammenfassung",
      summary: "Botulinumtoxin ist ein verschreibungspflichtiges Medikament, das gezielt in die Muskulatur injiziert wird, um mimische Falten zu glätten. Die Wirkung beginnt sofort auf molekularer Ebene. Erste sichtbare Ergebnisse zeigen sich bereits nach wenigen Tagen, das endgültige Ergebnis nach etwa zwei Wochen. Eine kostenlose Nachkorrektur ist zwischen der 2. und 3. Woche möglich. Die Wirkung hält je nach Lebensstil, Stoffwechsel und Gesundheitszustand etwa 3-4 Monate (bei manchen 2-8 Monate).",
      detailsTitle: "Ausführliche Informationen",
      howItWorks: "Wirkungsweise",
      howItWorksText: "Botulinumtoxin blockiert vorübergehend die Signalübertragung zwischen Nerven und Muskeln. Die Wirkung beginnt sofort nach der Injektion auf molekularer Ebene. Erste sichtbare Ergebnisse zeigen sich bereits nach wenigen Tagen, das endgültige Ergebnis nach etwa zwei Wochen. Wir streben ein natürliches Ergebnis an, bei dem Ihre Mimik erhalten bleibt.",
      areas: "Behandlungsbereiche",
      areasText: "• Zornesfalte (Glabella)\n• Stirnfalten\n• Krähenfüße\n• Kinnfalten\n• Nasenfalten\n• Lip Flip\n• Brow Lift\n• Anhebung der Nasenspitze\n• Platysma (Hals)\n• Hyperhidrose (übermäßiges Schwitzen)",
      procedure: "Ablauf der Behandlung",
      procedureText: "1. Persönliches Beratungsgespräch und Analyse\n2. Reinigung und Desinfektion der Haut\n3. Präzise Injektion mit feinen Nadeln\n4. Kurze Nachbeobachtung\n5. Pflegehinweise für zu Hause\n6. Follow-up-Termin in 14 Tagen vereinbaren",
      risks: "Mögliche Nebenwirkungen",
      risksText: "• Rötungen und kleine Schwellungen an den Einstichstellen (verschwinden meist innerhalb von Stunden)\n• Kleine Blutergüsse (selten, klingen nach wenigen Tagen ab)\n• Kopfschmerzen (selten, meist mild)\n• Asymmetrien (können bei der kostenlosen Nachkorrektur ausgeglichen werden)\n• Vorübergehend maskenhaftes Gefühl bei maximaler Wirkung (normalisiert sich)\n• Allergische Reaktionen (sehr selten)",
      correction: "Nachkorrektur",
      correctionText: "Jedes Gesicht und jede Anatomie ist einzigartig. Daher kann es vorkommen, dass nach zwei Wochen eine kleine Anpassung gewünscht ist. Ein natürliches Ergebnis und Ihre Zufriedenheit stehen für uns an erster Stelle – deshalb ist eine kostenlose Nachkorrektur zwischen der 2. und 3. Woche selbstverständlich inklusive.",
      aftercare: "Nachsorge",
      aftercareText: "• 4 Stunden aufrecht bleiben\n• 24 Stunden kein Sport, keine Sauna\n• 24-48 Stunden direkte Sonneneinstrahlung meiden\n• Behandelte Stellen nicht massieren\n• Kein Make-up für 4-6 Stunden\n• Kostenlose Nachkorrektur nach 14 Tagen möglich"
    },
    consent: {
      intro: "Bitte bestätigen Sie:",
      c1: "Ich habe die Informationen zur Botulinumtoxin-Behandlung vollständig gelesen und verstanden. Ich habe alle Fragen im Gesundheitsfragebogen wahrheitsgemäß beantwortet. Ich hatte die Möglichkeit, Fragen zu stellen. Ich willige in die Behandlung und die Speicherung meiner Daten ein.",
      signature: "Digitale Unterschrift",
      signatureHint: "Bitte unterschreiben Sie mit dem Finger oder der Maus:",
      signatureDate: "Datum der Unterschrift",
      date: "Datum",
      clear: "Löschen",
      submit: "Formular absenden",
      submitting: "Wird gesendet...",
      signatureRequired: "Bitte unterschreiben Sie das Formular",
      successTitle: "Vielen Dank!",
      successMessage: "Vielen Dank für das Ausfüllen des Formulars und Ihr Vertrauen."
    },
    progress: "Fortschritt",
    next: "Weiter",
    back: "Zurück",
    required: "* Pflichtfelder",
    pleaseComplete: "Bitte füllen Sie alle Pflichtfelder aus"
  },
  ua: {
    title: "Лікування ботулотоксином",
    subtitle: "Інформація та анамнез",
    practitioner: "Анна Гришченко • Естетична медицина",
    sections: {
      personal: "Особисті дані",
      interests: "Зацікавлення в лікуванні",
      anamnesis: "Анкета здоров'я",
      info: "Інформація про лікування",
      consent: "Згода на лікування"
    },
    fields: {
      firstName: "Ім'я",
      lastName: "Прізвище",
      birthDate: "Дата народження",
      address: "Адреса",
      phone: "Телефон",
      email: "Електронна пошта",
      profession: "Професія"
    },
    interests: {
      intro: "Які процедури вас цікавлять?",
      hint: "(Необов'язковий вибір – обговоримо особисто)",
      packagesTitle: "Пакети процедур",
      packages: ["Міжбрівна + лоб", "Верхня частина обличчя (3 зони)", "Full Face", "Full Face + шия"],
      areasTitle: "Окремі процедури",
      areas: ["Міжбрівна зморшка", "Лоб", "«Гусячі лапки»", "Зморшки на підборідді", "Носові зморшки", "Lip Flip", "Підйом брів", "Кінчик носа", "Платизма/шия", "Гіпергідроз"]
    },
    anamnesis: {
      intro: "Будь ласка, дайте відповіді на питання про ваше здоров'я. Поля з * обов'язкові.",
      q1: "Ви вагітні або годуєте груддю?",
      q2: "У вас є гострі інфекції або запальні захворювання?",
      q2info: "Напр., застуда, грип, гарячка, шкірні інфекції на обличчі",
      q3: "Чи страждаєте ви на неврологічні захворювання?",
      q3info: "Напр., епілепсія, міастенія, БАС, розсіяний склероз",
      q4: "У вас є автоімунні захворювання?",
      q4info: "Напр., вовчак, ревматоїдний артрит, Хашимото, хвороба Крона, псоріаз",
      q5: "Ви проходите онкологічне лікування?",
      q5info: "Лікування раку: хіміотерапія, променева терапія, імунотерапія",
      q6: "У вас є порушення згортання крові?",
      q6info: "Напр., гемофілія, хвороба Віллебранда, тромбоцитопенія",
      q7: "У вас декомпенсований діабет або важкі хронічні захворювання?",
      q7info: "Декомпенсований = рівень цукру погано контролюється",
      q8: "У вас є відомі алергії або непереносимість?",
      q8info: "Особливо: ботулотоксин, ліки, латекс (рукавички), продукти",
      q8placeholder: "Будь ласка, вкажіть усі відомі алергії...",
      q9: "Чи схильні ви до утворення келоїдів?",
      q9info: "Надмірне рубцювання після травм або операцій",
      q10: "У вас є нерозсмоктувані імплантати в зоні лікування?",
      q10info: "Напр., перманентні філери, силіконові імплантати на обличчі",
      q11: "Ви приймаєте препарати, що розріджують кров?",
      q11info: "Напр., аспірин, варфарин, ксарелто, ібупрофен, омега-3",
      q12: "Які ліки ви приймаєте регулярно?",
      q12placeholder: "Будь ласка, перелічіть усі поточні ліки...",
      q13: "Чи робили вам раніше ін'єкції ботулотоксину?",
      q13sub: "Якщо так, коли була остання процедура?",
      q13placeholder: "Напр., 'Так, 6 місяців тому' або 'Ні, перша процедура'",
      q14: "Чи є у вас ще питання?",
      q14hint: "Ми можемо обговорити їх особисто на прийомі.",
      q14placeholder: "Необов'язково: ваші питання до нас...",
      yes: "Так",
      no: "Ні",
      details: "Будь ласка, вкажіть деталі:",
      required: "Будь ласка, дайте відповідь"
    },
    info: {
      summaryTitle: "Короткий огляд",
      summary: "Ботулотоксин — це рецептурний препарат, який вводиться в м'язи для розгладження мімічних зморшок. Дія починається одразу на молекулярному рівні. Перші видимі результати з'являються вже через кілька днів, остаточний результат — приблизно через два тижні. Безкоштовна корекція можлива між 2-м і 3-м тижнем. Ефект триває 3-4 місяці (у деяких 2-8 місяців).",
      detailsTitle: "Детальна інформація",
      howItWorks: "Як це працює",
      howItWorksText: "Ботулотоксин тимчасово блокує передачу сигналів між нервами та м'язами. Дія починається одразу після ін'єкції. Перші видимі результати з'являються вже через кілька днів, остаточний результат — приблизно через два тижні. Ми прагнемо природного результату зі збереженням міміки.",
      areas: "Зони лікування",
      areasText: "• Міжбрівна зморшка\n• Зморшки на лобі\n• «Гусячі лапки»\n• Зморшки на підборідді\n• Носові зморшки\n• Lip Flip\n• Підйом брів\n• Підняття кінчика носа\n• Платизма (шия)\n• Гіпергідроз",
      procedure: "Процедура",
      procedureText: "1. Особиста консультація та аналіз\n2. Очищення та дезінфекція шкіри\n3. Точні ін'єкції тонкими голками\n4. Короткий період спостереження\n5. Інструкції з догляду\n6. Призначення контрольного візиту через 14 днів",
      risks: "Можливі побічні ефекти",
      risksText: "• Почервоніння та невеликі набряки (зникають за кілька годин)\n• Невеликі синці (рідко)\n• Головний біль (рідко, зазвичай легкий)\n• Асиметрія (можна виправити безкоштовно)\n• Тимчасове відчуття «маски» (нормалізується)\n• Алергічні реакції (дуже рідко)",
      correction: "Корекція",
      correctionText: "Кожне обличчя та анатомія унікальні. Тому може знадобитися невелике коригування через два тижні. Природний результат і ваше задоволення для нас на першому місці — тому безкоштовна корекція між 2-м і 3-м тижнем включена.",
      aftercare: "Післяпроцедурний догляд",
      aftercareText: "• Залишайтеся у вертикальному положенні 4 години\n• Без спорту та сауни 24 години\n• Уникайте прямих сонячних променів 24-48 годин\n• Не масажуйте оброблені ділянки\n• Без макіяжу 4-6 годин\n• Безкоштовна корекція через 14 днів"
    },
    consent: {
      intro: "Будь ласка, підтвердіть:",
      c1: "Я прочитав(ла) та зрозумів(ла) інформацію про лікування ботулотоксином. Я правдиво відповів(ла) на всі питання анкети здоров'я. Я мав(ла) можливість поставити питання. Я даю згоду на лікування та зберігання моїх даних.",
      signature: "Цифровий підпис",
      signatureHint: "Будь ласка, підпишіть пальцем або мишею:",
      signatureDate: "Дата підпису",
      date: "Дата",
      clear: "Очистити",
      submit: "Надіслати форму",
      submitting: "Надсилається...",
      signatureRequired: "Будь ласка, підпишіть форму",
      successTitle: "Дякуємо!",
      successMessage: "Дякуємо за заповнення форми та вашу довіру."
    },
    progress: "Прогрес",
    next: "Далі",
    back: "Назад",
    required: "* Обов'язкові поля",
    pleaseComplete: "Будь ласка, заповніть усі обов'язкові поля"
  },
  en: {
    title: "Botulinum Toxin Treatment",
    subtitle: "Information & Medical History",
    practitioner: "Anna Hryshchenko • Aesthetic Medicine",
    sections: {
      personal: "Personal Information",
      interests: "Treatment Interest",
      anamnesis: "Health Questionnaire",
      info: "Treatment Information",
      consent: "Consent Form"
    },
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      birthDate: "Date of Birth",
      address: "Address",
      phone: "Phone Number",
      email: "Email",
      profession: "Profession"
    },
    interests: {
      intro: "Which treatments are you interested in?",
      hint: "(Non-binding selection – will be discussed in person)",
      packagesTitle: "Treatment packages",
      packages: ["Frown lines + forehead", "Upper face (3 zones)", "Full Face", "Full Face + neck"],
      areasTitle: "Individual treatments",
      areas: ["Frown lines", "Forehead", "Crow's feet", "Chin wrinkles", "Nasal wrinkles", "Lip Flip", "Brow Lift", "Nose tip", "Platysma/neck", "Hyperhidrosis (sweating)"]
    },
    anamnesis: {
      intro: "Please answer the following questions about your health. Fields marked with * are required.",
      q1: "Are you pregnant or breastfeeding?",
      q2: "Do you have acute infections or inflammatory diseases?",
      q2info: "E.g., cold, flu, fever, skin infections on face",
      q3: "Do you suffer from neurological conditions?",
      q3info: "E.g., epilepsy, myasthenia gravis, ALS, multiple sclerosis",
      q4: "Do you have autoimmune diseases?",
      q4info: "E.g., lupus, rheumatoid arthritis, Hashimoto's, Crohn's disease, psoriasis",
      q5: "Are you undergoing oncological treatment?",
      q5info: "Cancer treatment such as chemotherapy, radiation, or immunotherapy",
      q6: "Do you have blood clotting disorders?",
      q6info: "E.g., hemophilia, von Willebrand disease, thrombocytopenia",
      q7: "Do you have decompensated diabetes or severe chronic diseases?",
      q7info: "Decompensated = blood sugar is not well controlled",
      q8: "Do you have known allergies or intolerances?",
      q8info: "Especially: botulinum toxin, medications, latex (gloves), foods",
      q8placeholder: "Please list all known allergies and intolerances...",
      q9: "Do you have a tendency to keloid formation?",
      q9info: "Raised, excessive scarring after injuries or surgeries",
      q10: "Do you have non-resorbable implants in the treatment area?",
      q10info: "E.g., permanent fillers, silicone implants in face",
      q11: "Are you taking blood-thinning medications?",
      q11info: "E.g., aspirin, warfarin, Xarelto, ibuprofen, high-dose omega-3",
      q12: "Which medications do you take regularly?",
      q12placeholder: "Please list all current medications...",
      q13: "Have you had botulinum toxin treatments before?",
      q13sub: "If yes, when was your last treatment?",
      q13placeholder: "E.g., 'Yes, 6 months ago' or 'No, first treatment'",
      q14: "Do you have any questions?",
      q14hint: "We can discuss them in person at your appointment.",
      q14placeholder: "Optional: Your questions for us...",
      yes: "Yes",
      no: "No",
      details: "Please provide details:",
      required: "Please answer this question"
    },
    info: {
      summaryTitle: "Summary",
      summary: "Botulinum toxin is a prescription medication precisely injected into muscles to smooth expression lines. The effect begins immediately at a molecular level. First visible results appear after a few days, with final results after about two weeks. A free touch-up is possible between weeks 2 and 3. The effect lasts approximately 3-4 months (2-8 months for some).",
      detailsTitle: "Detailed Information",
      howItWorks: "How It Works",
      howItWorksText: "Botulinum toxin temporarily blocks signal transmission between nerves and muscles. The effect begins immediately after injection at the molecular level. First visible results appear after a few days, with final results after about two weeks. We aim for a natural result that preserves your facial expressions.",
      areas: "Treatment Areas",
      areasText: "• Frown lines (Glabella)\n• Forehead lines\n• Crow's feet\n• Chin wrinkles\n• Nasal wrinkles\n• Lip Flip\n• Brow Lift\n• Nose tip lift\n• Platysma (neck)\n• Hyperhidrosis (excessive sweating)",
      procedure: "Treatment Procedure",
      procedureText: "1. Personal consultation and analysis\n2. Cleansing and disinfection of skin\n3. Precise injection with fine needles\n4. Brief observation period\n5. Aftercare instructions\n6. Schedule follow-up appointment in 14 days",
      risks: "Possible Side Effects",
      risksText: "• Redness and small swellings at injection sites (usually disappear within hours)\n• Small bruises (rare, fade within days)\n• Headaches (rare, usually mild)\n• Asymmetries (can be corrected at free follow-up)\n• Temporary mask-like feeling at peak effect (normalizes)\n• Allergic reactions (very rare)",
      correction: "Touch-up",
      correctionText: "Every face and anatomy is unique. Therefore, a small adjustment may be desired after two weeks. A natural result and your satisfaction are our top priority – that's why a free touch-up between weeks 2 and 3 is included.",
      aftercare: "Aftercare",
      aftercareText: "• Stay upright for 4 hours\n• No sports or sauna for 24 hours\n• Avoid direct sun exposure for 24-48 hours\n• Do not massage treated areas\n• No makeup for 4-6 hours\n• Free touch-up possible after 14 days"
    },
    consent: {
      intro: "Please confirm:",
      c1: "I have fully read and understood the information about botulinum toxin treatment. I have answered all questions in the health questionnaire truthfully. I had the opportunity to ask questions. I consent to the treatment and storage of my data.",
      signature: "Digital Signature",
      signatureHint: "Please sign with your finger or mouse:",
      signatureDate: "Date of signature",
      date: "Date",
      clear: "Clear",
      submit: "Submit Form",
      submitting: "Submitting...",
      signatureRequired: "Please sign the form",
      successTitle: "Thank you!",
      successMessage: "Thank you for completing the form and your trust."
    },
    progress: "Progress",
    next: "Next",
    back: "Back",
    required: "* Required fields",
    pleaseComplete: "Please complete all required fields"
  },
  ru: {
    title: "Лечение ботулотоксином",
    subtitle: "Информация и анамнез",
    practitioner: "Анна Гришченко • Эстетическая медицина",
    sections: {
      personal: "Личные данные",
      interests: "Интересующие процедуры",
      anamnesis: "Анкета здоровья",
      info: "Информация о лечении",
      consent: "Согласие на лечение"
    },
    fields: {
      firstName: "Имя",
      lastName: "Фамилия",
      birthDate: "Дата рождения",
      address: "Адрес",
      phone: "Телефон",
      email: "Электронная почта",
      profession: "Профессия"
    },
    interests: {
      intro: "Какие процедуры вас интересуют?",
      hint: "(Необязательный выбор – обсудим лично)",
      packagesTitle: "Пакеты процедур",
      packages: ["Межбровная + лоб", "Верхняя часть лица (3 зоны)", "Full Face", "Full Face + шея"],
      areasTitle: "Отдельные процедуры",
      areas: ["Межбровная морщина", "Лоб", "«Гусиные лапки»", "Морщины на подбородке", "Носовые морщины", "Lip Flip", "Подъём бровей", "Кончик носа", "Платизма/шея", "Гипергидроз"]
    },
    anamnesis: {
      intro: "Пожалуйста, ответьте на вопросы о вашем здоровье. Поля с * обязательны.",
      q1: "Вы беременны или кормите грудью?",
      q2: "У вас есть острые инфекции или воспалительные заболевания?",
      q2info: "Напр., простуда, грипп, температура, кожные инфекции на лице",
      q3: "Страдаете ли вы неврологическими заболеваниями?",
      q3info: "Напр., эпилепсия, миастения, БАС, рассеянный склероз",
      q4: "У вас есть аутоиммунные заболевания?",
      q4info: "Напр., волчанка, ревматоидный артрит, Хашимото, болезнь Крона, псориаз",
      q5: "Вы проходите онкологическое лечение?",
      q5info: "Лечение рака: химиотерапия, лучевая терапия, иммунотерапия",
      q6: "У вас есть нарушения свёртываемости крови?",
      q6info: "Напр., гемофилия, болезнь Виллебранда, тромбоцитопения",
      q7: "У вас декомпенсированный диабет или тяжёлые хронические заболевания?",
      q7info: "Декомпенсированный = уровень сахара плохо контролируется",
      q8: "У вас есть известные аллергии или непереносимость?",
      q8info: "Особенно: ботулотоксин, лекарства, латекс (перчатки), продукты",
      q8placeholder: "Пожалуйста, укажите все известные аллергии...",
      q9: "Склонны ли вы к образованию келоидов?",
      q9info: "Чрезмерное рубцевание после травм или операций",
      q10: "У вас есть нерассасывающиеся импланты в зоне лечения?",
      q10info: "Напр., перманентные филеры, силиконовые импланты на лице",
      q11: "Вы принимаете препараты, разжижающие кровь?",
      q11info: "Напр., аспирин, варфарин, ксарелто, ибупрофен, омега-3",
      q12: "Какие лекарства вы принимаете регулярно?",
      q12placeholder: "Пожалуйста, перечислите все текущие лекарства...",
      q13: "Делали ли вам ранее инъекции ботулотоксина?",
      q13sub: "Если да, когда была последняя процедура?",
      q13placeholder: "Напр., 'Да, 6 месяцев назад' или 'Нет, первая процедура'",
      q14: "Есть ли у вас вопросы?",
      q14hint: "Мы можем обсудить их лично на приёме.",
      q14placeholder: "Необязательно: ваши вопросы к нам...",
      yes: "Да",
      no: "Нет",
      details: "Пожалуйста, укажите детали:",
      required: "Пожалуйста, ответьте на вопрос"
    },
    info: {
      summaryTitle: "Краткий обзор",
      summary: "Ботулотоксин — это рецептурный препарат, который вводится в мышцы для разглаживания мимических морщин. Действие начинается сразу на молекулярном уровне. Первые видимые результаты появляются через несколько дней, окончательный результат — примерно через две недели. Бесплатная коррекция возможна между 2-й и 3-й неделей. Эффект длится 3-4 месяца (у некоторых 2-8 месяцев).",
      detailsTitle: "Подробная информация",
      howItWorks: "Как это работает",
      howItWorksText: "Ботулотоксин временно блокирует передачу сигналов между нервами и мышцами. Действие начинается сразу после инъекции. Первые видимые результаты появляются через несколько дней, окончательный результат — примерно через две недели. Мы стремимся к естественному результату с сохранением мимики.",
      areas: "Зоны лечения",
      areasText: "• Межбровная морщина\n• Морщины на лбу\n• «Гусиные лапки»\n• Морщины на подбородке\n• Носовые морщины\n• Lip Flip\n• Подъём бровей\n• Поднятие кончика носа\n• Платизма (шея)\n• Гипергидроз",
      procedure: "Процедура",
      procedureText: "1. Личная консультация и анализ\n2. Очищение и дезинфекция кожи\n3. Точные инъекции тонкими иглами\n4. Короткий период наблюдения\n5. Инструкции по уходу\n6. Назначение контрольного визита через 14 дней",
      risks: "Возможные побочные эффекты",
      risksText: "• Покраснение и небольшие отёки (исчезают за несколько часов)\n• Небольшие синяки (редко)\n• Головная боль (редко, обычно лёгкая)\n• Асимметрия (можно исправить бесплатно)\n• Временное ощущение «маски» (нормализуется)\n• Аллергические реакции (очень редко)",
      correction: "Коррекция",
      correctionText: "Каждое лицо и анатомия уникальны. Поэтому может потребоваться небольшая корректировка через две недели. Естественный результат и ваше удовлетворение для нас на первом месте — поэтому бесплатная коррекция между 2-й и 3-й неделей включена.",
      aftercare: "Послепроцедурный уход",
      aftercareText: "• Оставайтесь в вертикальном положении 4 часа\n• Без спорта и сауны 24 часа\n• Избегайте прямых солнечных лучей 24-48 часов\n• Не массируйте обработанные участки\n• Без макияжа 4-6 часов\n• Бесплатная коррекция через 14 дней"
    },
    consent: {
      intro: "Пожалуйста, подтвердите:",
      c1: "Я прочитал(а) и полностью понял(а) информацию о лечении ботулотоксином. Я правдиво ответил(а) на все вопросы анкеты здоровья. Я имел(а) возможность задать вопросы. Я даю согласие на лечение и хранение моих данных.",
      signature: "Цифровая подпись",
      signatureHint: "Пожалуйста, подпишите пальцем или мышью:",
      signatureDate: "Дата подписи",
      date: "Дата",
      clear: "Очистить",
      submit: "Отправить форму",
      submitting: "Отправляется...",
      signatureRequired: "Пожалуйста, подпишите форму",
      successTitle: "Спасибо!",
      successMessage: "Спасибо за заполнение формы и ваше доверие."
    },
    progress: "Прогресс",
    next: "Далее",
    back: "Назад",
    required: "* Обязательные поля",
    pleaseComplete: "Пожалуйста, заполните все обязательные поля"
  }
};

export default function BotoxIntakeForm() {
  const [lang, setLang] = useState('de');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', birthDate: '', address: '', phone: '', email: '', profession: '' },
    interests: [],
    anamnesis: { q8: '', q12: '', q13: '' },
    consent: false,
    signature: null
  });
  const [showDetails, setShowDetails] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // EmailJS laden
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
    };
    return () => document.body.removeChild(script);
  }, []);

  const t = translations[lang];
  const steps = ['personal', 'interests', 'anamnesis', 'info', 'consent'];

  const colors = {
    primary: '#6B5B4F',
    primaryLight: '#8B7B6F',
    bg: '#FDF9F7',
    bgCard: '#F5EBE6',
    accent: '#D4A89A',
    text: '#4A3F35',
    textLight: '#7A6F65',
    border: '#E5DDD8',
    error: '#C45C4A'
  };

  const updatePersonal = (field, value) => {
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const toggleInterest = (area) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(area) 
        ? prev.interests.filter(a => a !== area)
        : [...prev.interests, area]
    }));
  };

  const updateAnamnesis = (field, value) => {
    setFormData(prev => ({ ...prev, anamnesis: { ...prev.anamnesis, [field]: value } }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      ['firstName', 'lastName', 'birthDate', 'address', 'phone', 'email', 'profession'].forEach(f => {
        if (!formData.personal[f]) newErrors[f] = true;
      });
    }
    if (step === 2) {
      ['q1','q2','q3','q4','q5','q6','q7','q9','q10','q11'].forEach(q => {
        if (!formData.anamnesis[q]) newErrors[q] = true;
      });
      if (!formData.anamnesis.q8?.trim()) newErrors.q8 = true;
      if (!formData.anamnesis.q12?.trim()) newErrors.q12 = true;
      if (!formData.anamnesis.q13?.trim()) newErrors.q13 = true;
    }
    if (step === 4) {
      if (!formData.consent) newErrors.consent = true;
      if (!formData.signature) newErrors.signature = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(steps.length - 1, s + 1));
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const t = translations[lang];
    let y = 20;
    const lineHeight = 7;
    const marginLeft = 20;
    const pageWidth = 170;
    
    // Header
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('BOTULINUMTOXIN-BEHANDLUNG', marginLeft, y);
    y += 8;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text('Aufklärung & Anamnese', marginLeft, y);
    y += 6;
    pdf.setFontSize(10);
    pdf.text('Anna Hryshchenko • Ästhetische Medizin', marginLeft, y);
    y += 12;
    
    // Persönliche Daten
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('PERSÖNLICHE DATEN', marginLeft, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Name: ${formData.personal.firstName} ${formData.personal.lastName}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`Geburtsdatum: ${formData.personal.birthDate}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`Adresse: ${formData.personal.address}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`Telefon: ${formData.personal.phone}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`E-Mail: ${formData.personal.email}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`Beruf: ${formData.personal.profession}`, marginLeft, y);
    y += 12;
    
    // Behandlungsinteresse
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('BEHANDLUNGSINTERESSE', marginLeft, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const interests = formData.interests.length > 0 ? formData.interests.join(', ') : 'Keine Auswahl';
    const interestLines = pdf.splitTextToSize(interests, pageWidth);
    pdf.text(interestLines, marginLeft, y);
    y += interestLines.length * lineHeight + 8;
    
    // Anamnese
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('GESUNDHEITSFRAGEBOGEN', marginLeft, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    const questions = [
      { key: 'q1', text: 'Schwanger/Stillend' },
      { key: 'q2', text: 'Akute Infektionen' },
      { key: 'q3', text: 'Neurologische Erkrankungen' },
      { key: 'q4', text: 'Autoimmunerkrankungen' },
      { key: 'q5', text: 'Onkologische Behandlung' },
      { key: 'q6', text: 'Blutgerinnungsstörungen' },
      { key: 'q7', text: 'Diabetes/Chron. Erkrankungen' },
      { key: 'q9', text: 'Keloidneigung' },
      { key: 'q10', text: 'Implantate im Behandlungsbereich' },
      { key: 'q11', text: 'Blutverdünnende Medikamente' },
    ];
    
    questions.forEach(q => {
      const answer = formData.anamnesis[q.key] === 'yes' ? 'Ja' : formData.anamnesis[q.key] === 'no' ? 'Nein' : '-';
      const details = formData.anamnesis[q.key + '_details'] || '';
      pdf.text(`${q.text}: ${answer}${details ? ' (' + details + ')' : ''}`, marginLeft, y);
      y += lineHeight;
      if (y > 270) { pdf.addPage(); y = 20; }
    });
    
    y += 4;
    pdf.text(`Allergien: ${formData.anamnesis.q8 || '-'}`, marginLeft, y);
    y += lineHeight;
    const medLines = pdf.splitTextToSize(`Medikamente: ${formData.anamnesis.q12 || '-'}`, pageWidth);
    pdf.text(medLines, marginLeft, y);
    y += medLines.length * lineHeight;
    const prevLines = pdf.splitTextToSize(`Vorherige Behandlungen: ${formData.anamnesis.q13 || '-'}`, pageWidth);
    pdf.text(prevLines, marginLeft, y);
    y += prevLines.length * lineHeight;
    if (formData.anamnesis.q14) {
      const qLines = pdf.splitTextToSize(`Offene Fragen: ${formData.anamnesis.q14}`, pageWidth);
      pdf.text(qLines, marginLeft, y);
      y += qLines.length * lineHeight;
    }
    y += 8;
    
    if (y > 220) { pdf.addPage(); y = 20; }
    
    // Einverständnis
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('EINVERSTÄNDNISERKLÄRUNG', marginLeft, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('Hiermit bestätige ich:', marginLeft, y);
    y += lineHeight;
    const consentText = '• Ich habe die Informationen zur Behandlung gelesen und verstanden.\n• Ich habe alle Fragen wahrheitsgemäß beantwortet.\n• Ich willige in die Behandlung und Datenspeicherung ein.';
    const consentLines = pdf.splitTextToSize(consentText, pageWidth);
    pdf.text(consentLines, marginLeft, y);
    y += consentLines.length * lineHeight + 8;
    
    // Unterschrift
    pdf.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, marginLeft, y);
    y += lineHeight + 4;
    pdf.text('Unterschrift:', marginLeft, y);
    y += 4;
    
    if (formData.signature) {
      try {
        pdf.addImage(formData.signature, 'PNG', marginLeft, y, 60, 25);
      } catch (e) {
        console.error('Fehler beim Hinzufügen der Unterschrift:', e);
      }
    }
    
    return pdf;
  };

  const uploadPDFToCloudinary = async (pdfBlob) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', pdfBlob);
    formDataUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formDataUpload.append('resource_type', 'raw');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
      { method: 'POST', body: formDataUpload }
    );
    
    const data = await response.json();
    return data.secure_url;
  };

  const submitForm = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // PDF generieren
      const pdf = generatePDF();
      const pdfBlob = pdf.output('blob');
      
      // PDF zu Cloudinary hochladen
      let pdfUrl = '';
      try {
        pdfUrl = await uploadPDFToCloudinary(pdfBlob);
      } catch (e) {
        console.error('PDF Upload fehlgeschlagen:', e);
      }
      
      // Formulardaten für E-Mail
      const submitData = {
        name: `${formData.personal.firstName} ${formData.personal.lastName}`,
        email: formData.personal.email,
        telefon: formData.personal.phone,
        geburtsdatum: formData.personal.birthDate,
        adresse: formData.personal.address,
        beruf: formData.personal.profession,
        behandlungsinteresse: formData.interests.join(', ') || 'Keine Auswahl',
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
        formular_sprache: lang.toUpperCase()
      };
      
      // E-Mail über Formspree senden
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      if (response.ok) {
        // Bestätigungs-E-Mail an Kundin senden via EmailJS
        try {
          if (window.emailjs) {
            await window.emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_ID,
              {
                to_email: formData.personal.email,
                to_name: `${formData.personal.firstName} ${formData.personal.lastName}`,
              }
            );
          }
        } catch (emailError) {
          console.error('Bestätigungs-E-Mail fehlgeschlagen:', emailError);
          // Formular trotzdem als erfolgreich markieren
        }
        
        setSubmitted(true);
      } else {
        alert('Fehler beim Senden. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Senden. Bitte versuchen Sie es erneut.');
    }
    
    setIsSubmitting(false);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * scaleX;
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * scaleY;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * scaleX;
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * scaleY;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setFormData(prev => ({ ...prev, signature: canvasRef.current?.toDataURL() }));
      if (errors.signature) setErrors(prev => ({ ...prev, signature: false }));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(prev => ({ ...prev, signature: null }));
  };

  const InfoButton = ({ infoKey }) => (
    <button
      onClick={() => setExpandedInfo(expandedInfo === infoKey ? null : infoKey)}
      style={{
        marginLeft: '8px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        fontSize: '12px',
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        backgroundColor: expandedInfo === infoKey ? colors.primary : colors.bgCard,
        color: expandedInfo === infoKey ? '#fff' : colors.primary,
        border: `1px solid ${colors.border}`,
        cursor: 'pointer'
      }}
    >
      i
    </button>
  );

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: colors.text,
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: colors.error
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui, sans-serif', color: colors.text }}>
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: colors.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: `3px solid ${colors.accent}` }}>
            <span style={{ fontSize: '36px' }}>✓</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '500', color: colors.primary, marginBottom: '16px' }}>{t.consent.successTitle}</h2>
          <p style={{ fontSize: '16px', color: colors.textLight, lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>{t.consent.successMessage}</p>
          <p style={{ fontSize: '14px', color: colors.accent, marginTop: '24px' }}>{t.practitioner}</p>
        </div>
      ) : (
      <>
      <div style={{ textAlign: 'center', marginBottom: '24px', padding: '24px', background: `linear-gradient(135deg, ${colors.bgCard} 0%, ${colors.bg} 100%)`, borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          {['de', 'ua', 'en', 'ru'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: lang === l ? colors.primary : '#fff',
                color: lang === l ? '#fff' : colors.textLight
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', color: colors.primary, margin: '0 0 4px' }}>{t.title}</h1>
        <p style={{ color: colors.textLight, margin: '4px 0', fontSize: '14px' }}>{t.subtitle}</p>
        <p style={{ color: colors.accent, fontSize: '13px', margin: '8px 0 0' }}>{t.practitioner}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', padding: '0 8px' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '500',
              backgroundColor: i <= step ? colors.primary : colors.bgCard,
              color: i <= step ? '#fff' : colors.textLight,
              transition: 'all 0.3s'
            }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', margin: '0 8px', backgroundColor: i < step ? colors.primary : colors.border, transition: 'background-color 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ minHeight: '400px' }}>
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: colors.primary }}>{t.sections.personal}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.firstName} *</label>
                <input style={errors.firstName ? inputErrorStyle : inputStyle} value={formData.personal.firstName} onChange={e => updatePersonal('firstName', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.lastName} *</label>
                <input style={errors.lastName ? inputErrorStyle : inputStyle} value={formData.personal.lastName} onChange={e => updatePersonal('lastName', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.birthDate} *</label>
                <input type="date" style={errors.birthDate ? inputErrorStyle : inputStyle} value={formData.personal.birthDate} onChange={e => updatePersonal('birthDate', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.profession} *</label>
                <input style={errors.profession ? inputErrorStyle : inputStyle} value={formData.personal.profession} onChange={e => updatePersonal('profession', e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.address} *</label>
              <input style={errors.address ? inputErrorStyle : inputStyle} value={formData.personal.address} onChange={e => updatePersonal('address', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.phone} *</label>
                <input type="tel" style={errors.phone ? inputErrorStyle : inputStyle} value={formData.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.fields.email} *</label>
                <input type="email" style={errors.email ? inputErrorStyle : inputStyle} value={formData.personal.email} onChange={e => updatePersonal('email', e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: colors.textLight, marginTop: '16px' }}>{t.required}</p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: colors.primary }}>{t.sections.interests}</h2>
            <p style={{ color: colors.textLight, marginBottom: '20px', fontSize: '14px' }}>{t.interests.intro}<br/><span style={{ fontSize: '12px' }}>{t.interests.hint}</span></p>
            
            <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: colors.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.interests.packagesTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {t.interests.packages.map(pkg => (
                <label key={pkg} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.interests.includes(pkg) ? colors.bgCard : '#fff', border: `2px solid ${formData.interests.includes(pkg) ? colors.accent : colors.border}` }}>
                  <input type="checkbox" checked={formData.interests.includes(pkg)} onChange={() => toggleInterest(pkg)} style={{ width: '18px', height: '18px', accentColor: colors.primary }} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{pkg}</span>
                </label>
              ))}
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: colors.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.interests.areasTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {t.interests.areas.map(area => (
                <label key={area} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.interests.includes(area) ? colors.bgCard : '#fff', border: `1px solid ${formData.interests.includes(area) ? colors.accent : colors.border}` }}>
                  <input type="checkbox" checked={formData.interests.includes(area)} onChange={() => toggleInterest(area)} style={{ width: '18px', height: '18px', accentColor: colors.primary }} />
                  <span style={{ fontSize: '14px' }}>{area}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: colors.primary }}>{t.sections.anamnesis}</h2>
            <p style={{ color: colors.textLight, marginBottom: '20px', fontSize: '14px' }}>{t.anamnesis.intro}</p>
            
            {['q1','q2','q3','q4','q5','q6','q7','q9','q10','q11'].map((q, i) => (
              <div key={q} style={{ padding: '16px', backgroundColor: errors[q] ? '#FEF2F0' : colors.bgCard, borderRadius: '10px', marginBottom: '12px', border: errors[q] ? `1px solid ${colors.error}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '500', fontSize: '14px', flex: 1 }}>
                    {i + 1}. {t.anamnesis[q]} *
                    {t.anamnesis[q + 'info'] && <InfoButton infoKey={q} />}
                  </span>
                </div>
                {expandedInfo === q && t.anamnesis[q + 'info'] && (
                  <p style={{ fontSize: '12px', color: colors.textLight, marginBottom: '10px', padding: '8px 12px', backgroundColor: '#fff', borderRadius: '6px', borderLeft: `3px solid ${colors.accent}` }}>
                    {t.anamnesis[q + 'info']}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name={q} checked={formData.anamnesis[q] === 'yes'} onChange={() => updateAnamnesis(q, 'yes')} style={{ width: '18px', height: '18px', accentColor: colors.primary }} />
                    <span style={{ fontSize: '14px' }}>{t.anamnesis.yes}</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name={q} checked={formData.anamnesis[q] === 'no'} onChange={() => updateAnamnesis(q, 'no')} style={{ width: '18px', height: '18px', accentColor: colors.primary }} />
                    <span style={{ fontSize: '14px' }}>{t.anamnesis.no}</span>
                  </label>
                </div>
                {formData.anamnesis[q] === 'yes' && (
                  <input placeholder={t.anamnesis.details} style={{ ...inputStyle, marginTop: '10px' }} value={formData.anamnesis[q + '_details'] || ''} onChange={e => updateAnamnesis(q + '_details', e.target.value)} />
                )}
              </div>
            ))}

            <div style={{ padding: '16px', backgroundColor: errors.q8 ? '#FEF2F0' : colors.bgCard, borderRadius: '10px', marginBottom: '12px', border: errors.q8 ? `1px solid ${colors.error}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontWeight: '500', fontSize: '14px', flex: 1 }}>
                  11. {t.anamnesis.q8} *
                  <InfoButton infoKey="q8" />
                </span>
              </div>
              {expandedInfo === 'q8' && (
                <p style={{ fontSize: '12px', color: colors.textLight, marginBottom: '10px', padding: '8px 12px', backgroundColor: '#fff', borderRadius: '6px', borderLeft: `3px solid ${colors.accent}` }}>
                  {t.anamnesis.q8info}
                </p>
              )}
              <textarea placeholder={t.anamnesis.q8placeholder} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={formData.anamnesis.q8} onChange={e => updateAnamnesis('q8', e.target.value)} />
            </div>

            <div style={{ padding: '16px', backgroundColor: errors.q12 ? '#FEF2F0' : colors.bgCard, borderRadius: '10px', marginBottom: '12px', border: errors.q12 ? `1px solid ${colors.error}` : 'none' }}>
              <span style={{ fontWeight: '500', fontSize: '14px', display: 'block', marginBottom: '10px' }}>12. {t.anamnesis.q12} *</span>
              <textarea placeholder={t.anamnesis.q12placeholder} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={formData.anamnesis.q12} onChange={e => updateAnamnesis('q12', e.target.value)} />
            </div>

            <div style={{ padding: '16px', backgroundColor: errors.q13 ? '#FEF2F0' : colors.bgCard, borderRadius: '10px', marginBottom: '12px', border: errors.q13 ? `1px solid ${colors.error}` : 'none' }}>
              <span style={{ fontWeight: '500', fontSize: '14px', display: 'block', marginBottom: '4px' }}>13. {t.anamnesis.q13} *</span>
              <span style={{ fontSize: '12px', color: colors.textLight, display: 'block', marginBottom: '10px' }}>{t.anamnesis.q13sub}</span>
              <input placeholder={t.anamnesis.q13placeholder} style={inputStyle} value={formData.anamnesis.q13} onChange={e => updateAnamnesis('q13', e.target.value)} />
            </div>

            <div style={{ padding: '16px', backgroundColor: colors.bgCard, borderRadius: '10px', marginBottom: '12px', border: `1px dashed ${colors.border}` }}>
              <span style={{ fontWeight: '500', fontSize: '14px', display: 'block', marginBottom: '4px' }}>{t.anamnesis.q14}</span>
              <span style={{ fontSize: '12px', color: colors.textLight, display: 'block', marginBottom: '10px' }}>{t.anamnesis.q14hint}</span>
              <textarea placeholder={t.anamnesis.q14placeholder} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={formData.anamnesis.q14 || ''} onChange={e => updateAnamnesis('q14', e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: colors.primary }}>{t.sections.info}</h2>
            <div style={{ padding: '20px', backgroundColor: colors.bgCard, borderRadius: '12px', marginBottom: '16px', borderLeft: `4px solid ${colors.accent}` }}>
              <h3 style={{ fontWeight: '500', color: colors.primary, marginBottom: '10px', fontSize: '15px' }}>{t.info.summaryTitle}</h3>
              <p style={{ color: colors.text, lineHeight: '1.6', fontSize: '14px' }}>{t.info.summary}</p>
            </div>
            <button onClick={() => setShowDetails(!showDetails)} style={{ width: '100%', padding: '16px', textAlign: 'left', fontWeight: '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: '10px', border: `1px solid ${colors.border}`, cursor: 'pointer', color: colors.primary, fontSize: '15px' }}>
              {t.info.detailsTitle}
              <span style={{ fontSize: '20px', fontWeight: '300' }}>{showDetails ? '−' : '+'}</span>
            </button>
            {showDetails && (
              <div style={{ padding: '20px', borderLeft: `2px solid ${colors.border}`, marginLeft: '16px', marginTop: '16px' }}>
                {['howItWorks', 'areas', 'procedure', 'risks', 'correction', 'aftercare'].map(section => (
                  <div key={section} style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontWeight: '500', marginBottom: '8px', color: colors.primary, fontSize: '14px' }}>{t.info[section]}</h4>
                    <p style={{ color: colors.textLight, whiteSpace: 'pre-line', fontSize: '13px', lineHeight: '1.6' }}>{t.info[section + 'Text']}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: colors.primary }}>{t.sections.consent}</h2>
            <p style={{ color: colors.textLight, marginBottom: '20px', fontSize: '14px' }}>{t.consent.intro}</p>
            
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '20px', backgroundColor: errors.consent ? '#FEF2F0' : colors.bgCard, borderRadius: '12px', cursor: 'pointer', border: errors.consent ? `1px solid ${colors.error}` : `1px solid ${colors.border}`, marginBottom: '24px' }}>
              <input type="checkbox" checked={formData.consent} onChange={e => { setFormData(prev => ({ ...prev, consent: e.target.checked })); if (errors.consent) setErrors(prev => ({ ...prev, consent: false })); }} style={{ width: '22px', height: '22px', marginTop: '2px', accentColor: colors.primary, flexShrink: 0 }} />
              <span style={{ fontSize: '14px', lineHeight: '1.6' }}>{t.consent.c1}</span>
            </label>

            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontWeight: '500', marginBottom: '8px', fontSize: '15px', color: colors.primary }}>{t.consent.signature}</h3>
              <p style={{ fontSize: '13px', color: colors.textLight, marginBottom: '12px' }}>{t.consent.signatureHint}</p>
              <div style={{ border: `2px dashed ${errors.signature ? colors.error : colors.border}`, borderRadius: '12px', padding: '8px', backgroundColor: '#fff' }}>
                <canvas ref={canvasRef} width={560} height={150} style={{ width: '100%', height: '150px', touchAction: 'none', cursor: 'crosshair' }} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
              </div>
              {errors.signature && <p style={{ color: colors.error, fontSize: '12px', marginTop: '8px' }}>{t.consent.signatureRequired}</p>}
              <button onClick={clearSignature} style={{ marginTop: '8px', fontSize: '13px', color: colors.textLight, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>{t.consent.clear}</button>
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: colors.textLight }}>{t.consent.signatureDate}</label>
              <input type="date" style={inputStyle} defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: `1px solid ${colors.border}` }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: '500', border: 'none', cursor: step === 0 ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', color: step === 0 ? colors.border : colors.textLight, fontSize: '15px' }}>
          {t.back}
        </button>
        {step < steps.length - 1 ? (
          <button onClick={nextStep} style={{ padding: '12px 32px', backgroundColor: colors.primary, color: '#fff', borderRadius: '10px', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '15px', transition: 'background-color 0.2s' }}>
            {t.next}
          </button>
        ) : (
          <button onClick={submitForm} disabled={isSubmitting} style={{ padding: '12px 32px', borderRadius: '10px', fontWeight: '500', border: 'none', cursor: isSubmitting ? 'wait' : 'pointer', fontSize: '15px', backgroundColor: isSubmitting ? colors.textLight : colors.accent, color: '#fff', transition: 'background-color 0.2s' }}>
            {isSubmitting ? t.consent.submitting : t.consent.submit}
          </button>
        )}
      </div>
      </>
      )}
    </div>
  );
}
