"use client";
import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';

// Konfiguration
const FORMSPREE_ID = "mreoeaoz";
const CLOUDINARY_CLOUD_NAME = "drkele6gg";
const CLOUDINARY_UPLOAD_PRESET = "ah-aesthetic-forms";
const EMAILJS_SERVICE_ID = "service_cjnprwl";
const EMAILJS_TEMPLATE_ID = "template_r529kri";
const EMAILJS_PUBLIC_KEY = "ap3zsxj1pgoGQRSWQ";

const translations = {
  de: {
    title: "Ästhetische Medizin",
    subtitle: "Aufklärung & Anamnese",
    practitioner: "Anna Hryshchenko",
    selectTreatment: "Welche Behandlung(en) interessieren Sie?",
    selectTreatmentHint: "Bitte wählen Sie mindestens eine Option",
    treatments: {
      botox: "Botox",
      botoxDesc: "Faltenbehandlung mit Botulinumtoxin",
      lips: "Lippen",
      lipsDesc: "Lippenbehandlung mit Hyaluronsäure",
      skin: "Hautverbesserung",
      skinDesc: "Polynukleotide, Skinbooster, Mesotherapie"
    },
    sections: {
      treatment: "Behandlungsauswahl",
      interests: "Behandlungsinteresse",
      personal: "Persönliche Daten",
      anamnesis: "Gesundheitsfragebogen",
      info: "Behandlungsinformationen",
      consent: "Einverständniserklärung"
    },
    interests: {
      botoxTitle: "Botox - Behandlungsbereiche",
      botoxPackages: "Behandlungspakete",
      botoxPackagesList: ["Zornesfalte + Stirn", "Oberes Gesicht (3 Zonen)", "Full Face", "Full Face + Hals"],
      botoxAreas: "Einzelbehandlungen",
      botoxAreasList: ["Zornesfalte", "Stirn", "Krähenfüße", "Kinnfalten", "Nasenfalten", "Lip Flip", "Brow Lift", "Nasenspitze", "Platysma/Hals", "Hyperhidrose"],
      lipsTitle: "Lippen - Behandlungsoptionen",
      lipsList: ["Lippen-Vergrößerung", "Lippenkontur", "Asymmetrie-Korrektur", "Lippenfeuchtigkeit", "Hyaluronidase (Auflösung)"],
      skinTitle: "Hautverbesserung",
      skinTypes: "Behandlungsart",
      skinTypesList: ["Polynukleotide", "Skinbooster/Biorevitalisierung", "Mesotherapie"],
      skinZones: "Behandlungszonen",
      skinZonesList: ["Gesicht", "Augenbereich", "Hals + Dekolleté", "Hände", "Vulvabereich"],
      skinNote: "Hinweis: Für optimale Ergebnisse empfehlen wir 3-4 Behandlungen im Abstand von ca. 3 Wochen. Der genaue Abstand wird individuell besprochen."
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
      q8placeholder: "Bitte alle bekannten Allergien und Unverträglichkeiten angeben...",
      q9: "Neigen Sie zu Keloidbildung?",
      q9info: "Wulstartige, überschießende Narbenbildung nach Verletzungen",
      q10: "Haben Sie nicht resorbierbare Implantate im Behandlungsbereich?",
      q10info: "Z.B. permanente Filler, Silikonimplantate",
      q11: "Nehmen Sie blutverdünnende Medikamente ein?",
      q11info: "Z.B. Aspirin, Marcumar, Xarelto, Ibuprofen, Omega-3 hochdosiert",
      q12: "Neigen Sie zu Herpes?",
      q12info: "Lippenherpes kann durch Behandlungen im Lippenbereich reaktiviert werden",
      q13: "Welche Medikamente nehmen Sie regelmäßig ein?",
      q13placeholder: "Bitte alle aktuellen Medikamente auflisten...",
      q14: "Hatten Sie bereits ästhetische Behandlungen (Botox, Filler, etc.)?",
      q14sub: "Wenn ja, welche und wann zuletzt?",
      q14placeholder: "Z.B. 'Botox vor 6 Monaten' oder 'Keine'",
      q15: "Haben Sie noch offene Fragen?",
      q15hint: "Diese können wir gerne vor Ort direkt klären.",
      q15placeholder: "Optional: Ihre Fragen an uns...",
      yes: "Ja",
      no: "Nein",
      details: "Bitte Details angeben:"
    },
    info: {
      summaryTitle: "Zusammenfassung",
      botoxSummary: "Botulinumtoxin wird gezielt in die Muskulatur injiziert, um mimische Falten zu glätten. Die Wirkung beginnt sofort auf molekularer Ebene. Erste sichtbare Ergebnisse zeigen sich nach wenigen Tagen, das endgültige Ergebnis nach etwa zwei Wochen. Eine kostenlose Nachkorrektur ist zwischen der 2. und 3. Woche möglich. Die Wirkung hält etwa 3-4 Monate.",
      lipsSummary: "Hyaluronsäure ist ein natürlicher Bestandteil unserer Haut. Bei der Lippenbehandlung wird sie präzise injiziert, um Volumen aufzubauen, Konturen zu definieren oder Feuchtigkeit zu spenden. Das Ergebnis ist sofort sichtbar und hält 6-12 Monate. Eine kostenlose Nachkorrektur ist nach 14 Tagen möglich.",
      skinSummary: "Polynukleotide, Skinbooster und Mesotherapie verbessern die Hautqualität von innen heraus. Sie stimulieren die Kollagenproduktion und verbessern Hydration und Elastizität. Für optimale Ergebnisse empfehlen wir 3-4 Behandlungen im Abstand von ca. 3 Wochen.",
      aftercare: "Nachsorge (für alle Behandlungen)",
      aftercareText: "• 4 Stunden aufrecht bleiben\n• 24 Stunden kein Sport, keine Sauna\n• 24-48 Stunden direkte Sonneneinstrahlung meiden\n• Behandelte Stellen nicht massieren\n• Kein Make-up für 4-6 Stunden\n• Kostenlose Nachkorrektur nach 14 Tagen möglich"
    },
    consent: {
      intro: "Bitte bestätigen Sie:",
      c1: "Ich habe die Informationen zu den gewählten Behandlungen vollständig gelesen und verstanden. Ich habe alle Fragen im Gesundheitsfragebogen wahrheitsgemäß beantwortet. Ich hatte die Möglichkeit, Fragen zu stellen. Ich willige in die Behandlung und die Speicherung meiner Daten ein.",
      signature: "Digitale Unterschrift",
      signatureHint: "Bitte unterschreiben Sie mit dem Finger oder der Maus:",
      signatureDate: "Datum der Unterschrift",
      clear: "Löschen",
      submit: "Formular absenden",
      submitting: "Wird gesendet...",
      signatureRequired: "Bitte unterschreiben Sie das Formular",
      successTitle: "Vielen Dank!",
      successMessage: "Vielen Dank für das Ausfüllen des Formulars und Ihr Vertrauen."
    },
    next: "Weiter",
    back: "Zurück",
    required: "* Pflichtfelder",
    pleaseSelect: "Bitte wählen Sie mindestens eine Behandlung"
  },
  ua: {
    title: "Естетична медицина",
    subtitle: "Інформація та анамнез",
    practitioner: "Анна Гришченко",
    selectTreatment: "Які процедури вас цікавлять?",
    selectTreatmentHint: "Будь ласка, виберіть хоча б один варіант",
    treatments: {
      botox: "Ботокс",
      botoxDesc: "Лікування зморшок ботулотоксином",
      lips: "Губи",
      lipsDesc: "Процедури для губ з гіалуроновою кислотою",
      skin: "Покращення шкіри",
      skinDesc: "Полінуклеотиди, скінбустери, мезотерапія"
    },
    sections: {
      treatment: "Вибір процедури",
      interests: "Деталі процедури",
      personal: "Особисті дані",
      anamnesis: "Анкета здоров'я",
      info: "Інформація про процедури",
      consent: "Згода на лікування"
    },
    interests: {
      botoxTitle: "Ботокс - зони лікування",
      botoxPackages: "Пакети процедур",
      botoxPackagesList: ["Міжбрівна + лоб", "Верхня частина обличчя (3 зони)", "Full Face", "Full Face + шия"],
      botoxAreas: "Окремі процедури",
      botoxAreasList: ["Міжбрівна зморшка", "Лоб", "«Гусячі лапки»", "Підборіддя", "Ніс", "Lip Flip", "Підйом брів", "Кінчик носа", "Платизма/шия", "Гіпергідроз"],
      lipsTitle: "Губи - варіанти процедур",
      lipsList: ["Збільшення губ", "Контур губ", "Корекція асиметрії", "Зволоження губ", "Гіалуронідаза (розчинення)"],
      skinTitle: "Покращення шкіри",
      skinTypes: "Тип процедури",
      skinTypesList: ["Полінуклеотиди", "Скінбустер/Біоревіталізація", "Мезотерапія"],
      skinZones: "Зони лікування",
      skinZonesList: ["Обличчя", "Зона очей", "Шия + декольте", "Руки", "Зона вульви"],
      skinNote: "Примітка: Для оптимальних результатів рекомендуємо 3-4 процедури з інтервалом близько 3 тижнів."
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
    anamnesis: {
      intro: "Будь ласка, дайте відповіді на питання про ваше здоров'я.",
      q1: "Ви вагітні або годуєте груддю?",
      q2: "У вас є гострі інфекції або запальні захворювання?",
      q2info: "Напр., застуда, грип, гарячка, шкірні інфекції",
      q3: "Чи страждаєте ви на неврологічні захворювання?",
      q3info: "Напр., епілепсія, міастенія, розсіяний склероз",
      q4: "У вас є автоімунні захворювання?",
      q4info: "Напр., вовчак, ревматоїдний артрит, Хашимото, псоріаз",
      q5: "Ви проходите онкологічне лікування?",
      q5info: "Хіміотерапія, променева терапія, імунотерапія",
      q6: "У вас є порушення згортання крові?",
      q6info: "Напр., гемофілія, тромбоцитопенія",
      q7: "У вас декомпенсований діабет або важкі хронічні захворювання?",
      q7info: "Декомпенсований = рівень цукру погано контролюється",
      q8: "У вас є відомі алергії або непереносимість?",
      q8info: "Особливо: ботулотоксин, гіалуронова кислота, ліки, латекс",
      q8placeholder: "Будь ласка, вкажіть усі відомі алергії...",
      q9: "Чи схильні ви до утворення келоїдів?",
      q9info: "Надмірне рубцювання після травм",
      q10: "У вас є нерозсмоктувані імплантати в зоні лікування?",
      q10info: "Напр., перманентні філери, силіконові імплантати",
      q11: "Ви приймаєте препарати, що розріджують кров?",
      q11info: "Напр., аспірин, варфарин, ібупрофен, омега-3",
      q12: "Чи схильні ви до герпесу?",
      q12info: "Герпес на губах може активуватися після процедур",
      q13: "Які ліки ви приймаєте регулярно?",
      q13placeholder: "Будь ласка, перелічіть усі поточні ліки...",
      q14: "Чи робили вам раніше естетичні процедури?",
      q14sub: "Якщо так, які і коли останній раз?",
      q14placeholder: "Напр., 'Ботокс 6 місяців тому' або 'Ні'",
      q15: "Чи є у вас ще питання?",
      q15hint: "Ми можемо обговорити їх особисто.",
      q15placeholder: "Необов'язково: ваші питання...",
      yes: "Так",
      no: "Ні",
      details: "Будь ласка, вкажіть деталі:"
    },
    info: {
      summaryTitle: "Короткий огляд",
      botoxSummary: "Ботулотоксин вводиться в м'язи для розгладження мімічних зморшок. Перші результати видно через кілька днів, остаточний результат — через два тижні. Безкоштовна корекція можлива між 2-м і 3-м тижнем. Ефект триває 3-4 місяці.",
      lipsSummary: "Гіалуронова кислота — природний компонент шкіри. При процедурах для губ вона додає об'єм, визначає контур або зволожує. Результат видно одразу і триває 6-12 місяців. Безкоштовна корекція через 14 днів.",
      skinSummary: "Полінуклеотиди, скінбустери та мезотерапія покращують якість шкіри зсередини. Для оптимальних результатів рекомендуємо 3-4 процедури з інтервалом близько 3 тижнів.",
      aftercare: "Післяпроцедурний догляд",
      aftercareText: "• Залишайтеся вертикально 4 години\n• Без спорту та сауни 24 години\n• Уникайте сонця 24-48 годин\n• Не масажуйте оброблені ділянки\n• Без макіяжу 4-6 годин\n• Безкоштовна корекція через 14 днів"
    },
    consent: {
      intro: "Будь ласка, підтвердіть:",
      c1: "Я прочитав(ла) та зрозумів(ла) інформацію про обрані процедури. Я правдиво відповів(ла) на всі питання. Я даю згоду на лікування та зберігання даних.",
      signature: "Цифровий підпис",
      signatureHint: "Будь ласка, підпишіть пальцем або мишею:",
      signatureDate: "Дата підпису",
      clear: "Очистити",
      submit: "Надіслати форму",
      submitting: "Надсилається...",
      signatureRequired: "Будь ласка, підпишіть форму",
      successTitle: "Дякуємо!",
      successMessage: "Дякуємо за заповнення форми та вашу довіру."
    },
    next: "Далі",
    back: "Назад",
    required: "* Обов'язкові поля",
    pleaseSelect: "Будь ласка, виберіть хоча б одну процедуру"
  },
  en: {
    title: "Aesthetic Medicine",
    subtitle: "Information & Medical History",
    practitioner: "Anna Hryshchenko",
    selectTreatment: "Which treatment(s) are you interested in?",
    selectTreatmentHint: "Please select at least one option",
    treatments: {
      botox: "Botox",
      botoxDesc: "Wrinkle treatment with botulinum toxin",
      lips: "Lips",
      lipsDesc: "Lip treatment with hyaluronic acid",
      skin: "Skin Rejuvenation",
      skinDesc: "Polynucleotides, skinboosters, mesotherapy"
    },
    sections: {
      treatment: "Treatment Selection",
      interests: "Treatment Details",
      personal: "Personal Information",
      anamnesis: "Health Questionnaire",
      info: "Treatment Information",
      consent: "Consent Form"
    },
    interests: {
      botoxTitle: "Botox - Treatment Areas",
      botoxPackages: "Treatment Packages",
      botoxPackagesList: ["Frown lines + forehead", "Upper face (3 zones)", "Full Face", "Full Face + neck"],
      botoxAreas: "Individual Treatments",
      botoxAreasList: ["Frown lines", "Forehead", "Crow's feet", "Chin", "Nose", "Lip Flip", "Brow Lift", "Nose tip", "Platysma/neck", "Hyperhidrosis"],
      lipsTitle: "Lips - Treatment Options",
      lipsList: ["Lip enlargement", "Lip contour", "Asymmetry correction", "Lip hydration", "Hyaluronidase (dissolution)"],
      skinTitle: "Skin Rejuvenation",
      skinTypes: "Treatment Type",
      skinTypesList: ["Polynucleotides", "Skinbooster/Biorevitalization", "Mesotherapy"],
      skinZones: "Treatment Zones",
      skinZonesList: ["Face", "Eye area", "Neck + décolleté", "Hands", "Vulva area"],
      skinNote: "Note: For optimal results, we recommend 3-4 treatments at intervals of approx. 3 weeks."
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
    anamnesis: {
      intro: "Please answer the following questions about your health.",
      q1: "Are you pregnant or breastfeeding?",
      q2: "Do you have acute infections or inflammatory diseases?",
      q2info: "E.g., cold, flu, fever, skin infections",
      q3: "Do you suffer from neurological conditions?",
      q3info: "E.g., epilepsy, myasthenia gravis, multiple sclerosis",
      q4: "Do you have autoimmune diseases?",
      q4info: "E.g., lupus, rheumatoid arthritis, Hashimoto's, psoriasis",
      q5: "Are you undergoing oncological treatment?",
      q5info: "Chemotherapy, radiation, or immunotherapy",
      q6: "Do you have blood clotting disorders?",
      q6info: "E.g., hemophilia, thrombocytopenia",
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
      q11info: "E.g., aspirin, warfarin, ibuprofen, high-dose omega-3",
      q12: "Are you prone to herpes?",
      q12info: "Cold sores can be reactivated by lip treatments",
      q13: "Which medications do you take regularly?",
      q13placeholder: "Please list all current medications...",
      q14: "Have you had aesthetic treatments before?",
      q14sub: "If yes, which ones and when?",
      q14placeholder: "E.g., 'Botox 6 months ago' or 'None'",
      q15: "Do you have any questions?",
      q15hint: "We can discuss them in person.",
      q15placeholder: "Optional: Your questions...",
      yes: "Yes",
      no: "No",
      details: "Please provide details:"
    },
    info: {
      summaryTitle: "Summary",
      botoxSummary: "Botulinum toxin is injected into muscles to smooth expression lines. First results are visible after a few days, final results after about two weeks. A free touch-up is possible between weeks 2 and 3. The effect lasts about 3-4 months.",
      lipsSummary: "Hyaluronic acid is a natural component of our skin. In lip treatments, it adds volume, defines contours, or provides hydration. Results are immediately visible and last 6-12 months. Free touch-up after 14 days.",
      skinSummary: "Polynucleotides, skinboosters, and mesotherapy improve skin quality from within. For optimal results, we recommend 3-4 treatments at intervals of approx. 3 weeks.",
      aftercare: "Aftercare (for all treatments)",
      aftercareText: "• Stay upright for 4 hours\n• No sports or sauna for 24 hours\n• Avoid direct sun for 24-48 hours\n• Do not massage treated areas\n• No makeup for 4-6 hours\n• Free touch-up possible after 14 days"
    },
    consent: {
      intro: "Please confirm:",
      c1: "I have fully read and understood the information about the selected treatments. I have answered all health questions truthfully. I consent to the treatment and data storage.",
      signature: "Digital Signature",
      signatureHint: "Please sign with your finger or mouse:",
      signatureDate: "Date of signature",
      clear: "Clear",
      submit: "Submit Form",
      submitting: "Submitting...",
      signatureRequired: "Please sign the form",
      successTitle: "Thank you!",
      successMessage: "Thank you for completing the form and your trust."
    },
    next: "Next",
    back: "Back",
    required: "* Required fields",
    pleaseSelect: "Please select at least one treatment"
  },
  ru: {
    title: "Эстетическая медицина",
    subtitle: "Информация и анамнез",
    practitioner: "Анна Гришченко",
    selectTreatment: "Какие процедуры вас интересуют?",
    selectTreatmentHint: "Пожалуйста, выберите хотя бы один вариант",
    treatments: {
      botox: "Ботокс",
      botoxDesc: "Лечение морщин ботулотоксином",
      lips: "Губы",
      lipsDesc: "Процедуры для губ с гиалуроновой кислотой",
      skin: "Улучшение кожи",
      skinDesc: "Полинуклеотиды, скинбустеры, мезотерапия"
    },
    sections: {
      treatment: "Выбор процедуры",
      interests: "Детали процедуры",
      personal: "Личные данные",
      anamnesis: "Анкета здоровья",
      info: "Информация о процедурах",
      consent: "Согласие на лечение"
    },
    interests: {
      botoxTitle: "Ботокс - зоны лечения",
      botoxPackages: "Пакеты процедур",
      botoxPackagesList: ["Межбровная + лоб", "Верхняя часть лица (3 зоны)", "Full Face", "Full Face + шея"],
      botoxAreas: "Отдельные процедуры",
      botoxAreasList: ["Межбровная морщина", "Лоб", "«Гусиные лапки»", "Подбородок", "Нос", "Lip Flip", "Подъём бровей", "Кончик носа", "Платизма/шея", "Гипергидроз"],
      lipsTitle: "Губы - варианты процедур",
      lipsList: ["Увеличение губ", "Контур губ", "Коррекция асимметрии", "Увлажнение губ", "Гиалуронидаза (растворение)"],
      skinTitle: "Улучшение кожи",
      skinTypes: "Тип процедуры",
      skinTypesList: ["Полинуклеотиды", "Скинбустер/Биоревитализация", "Мезотерапия"],
      skinZones: "Зоны лечения",
      skinZonesList: ["Лицо", "Зона глаз", "Шея + декольте", "Руки", "Зона вульвы"],
      skinNote: "Примечание: Для оптимальных результатов рекомендуем 3-4 процедуры с интервалом около 3 недель."
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
    anamnesis: {
      intro: "Пожалуйста, ответьте на вопросы о вашем здоровье.",
      q1: "Вы беременны или кормите грудью?",
      q2: "У вас есть острые инфекции или воспалительные заболевания?",
      q2info: "Напр., простуда, грипп, температура, кожные инфекции",
      q3: "Страдаете ли вы неврологическими заболеваниями?",
      q3info: "Напр., эпилепсия, миастения, рассеянный склероз",
      q4: "У вас есть аутоиммунные заболевания?",
      q4info: "Напр., волчанка, ревматоидный артрит, Хашимото, псориаз",
      q5: "Вы проходите онкологическое лечение?",
      q5info: "Химиотерапия, лучевая терапия, иммунотерапия",
      q6: "У вас есть нарушения свёртываемости крови?",
      q6info: "Напр., гемофилия, тромбоцитопения",
      q7: "У вас декомпенсированный диабет или тяжёлые хронические заболевания?",
      q7info: "Декомпенсированный = уровень сахара плохо контролируется",
      q8: "У вас есть известные аллергии или непереносимость?",
      q8info: "Особенно: ботулотоксин, гиалуроновая кислота, лекарства, латекс",
      q8placeholder: "Пожалуйста, укажите все известные аллергии...",
      q9: "Склонны ли вы к образованию келоидов?",
      q9info: "Чрезмерное рубцевание после травм",
      q10: "У вас есть нерассасывающиеся импланты в зоне лечения?",
      q10info: "Напр., перманентные филеры, силиконовые импланты",
      q11: "Вы принимаете препараты, разжижающие кровь?",
      q11info: "Напр., аспирин, варфарин, ибупрофен, омега-3",
      q12: "Склонны ли вы к герпесу?",
      q12info: "Герпес на губах может активироваться после процедур",
      q13: "Какие лекарства вы принимаете регулярно?",
      q13placeholder: "Пожалуйста, перечислите все текущие лекарства...",
      q14: "Делали ли вам ранее эстетические процедуры?",
      q14sub: "Если да, какие и когда последний раз?",
      q14placeholder: "Напр., 'Ботокс 6 месяцев назад' или 'Нет'",
      q15: "Есть ли у вас вопросы?",
      q15hint: "Мы можем обсудить их лично.",
      q15placeholder: "Необязательно: ваши вопросы...",
      yes: "Да",
      no: "Нет",
      details: "Пожалуйста, укажите детали:"
    },
    info: {
      summaryTitle: "Краткий обзор",
      botoxSummary: "Ботулотоксин вводится в мышцы для разглаживания мимических морщин. Первые результаты видны через несколько дней, окончательный результат — через две недели. Бесплатная коррекция возможна между 2-й и 3-й неделей. Эффект длится 3-4 месяца.",
      lipsSummary: "Гиалуроновая кислота — естественный компонент кожи. При процедурах для губ она добавляет объём, определяет контур или увлажняет. Результат виден сразу и длится 6-12 месяцев. Бесплатная коррекция через 14 дней.",
      skinSummary: "Полинуклеотиды, скинбустеры и мезотерапия улучшают качество кожи изнутри. Для оптимальных результатов рекомендуем 3-4 процедуры с интервалом около 3 недель.",
      aftercare: "Послепроцедурный уход",
      aftercareText: "• Оставайтесь вертикально 4 часа\n• Без спорта и сауны 24 часа\n• Избегайте солнца 24-48 часов\n• Не массируйте обработанные участки\n• Без макияжа 4-6 часов\n• Бесплатная коррекция через 14 дней"
    },
    consent: {
      intro: "Пожалуйста, подтвердите:",
      c1: "Я прочитал(а) и понял(а) информацию о выбранных процедурах. Я правдиво ответил(а) на все вопросы. Я даю согласие на лечение и хранение данных.",
      signature: "Цифровая подпись",
      signatureHint: "Пожалуйста, подпишите пальцем или мышью:",
      signatureDate: "Дата подписи",
      clear: "Очистить",
      submit: "Отправить форму",
      submitting: "Отправляется...",
      signatureRequired: "Пожалуйста, подпишите форму",
      successTitle: "Спасибо!",
      successMessage: "Спасибо за заполнение формы и ваше доверие."
    },
    next: "Далее",
    back: "Назад",
    required: "* Обязательные поля",
    pleaseSelect: "Пожалуйста, выберите хотя бы одну процедуру"
  }
};

const langFlags = [
  { code: 'de', flag: '🇩🇪' },
  { code: 'ua', flag: '🇺🇦' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'ru', flag: '🇷🇺' }
];

export default function IntakeForm() {
  const [lang, setLang] = useState('de');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    selectedTreatments: [],
    botoxInterests: [],
    lipsInterests: [],
    skinTypes: [],
    skinZones: [],
    personal: { firstName: '', lastName: '', birthDate: '', address: '', phone: '', email: '', profession: '' },
    anamnesis: { q8: '', q13: '', q14: '' },
    consent: false,
    signature: null
  });
  const [expandedInfo, setExpandedInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => { window.emailjs.init(EMAILJS_PUBLIC_KEY); };
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const t = translations[lang];
  const steps = ['treatment', 'interests', 'personal', 'anamnesis', 'info', 'consent'];

  const colors = {
    primary: '#6B5B4F',
    bg: '#FDF9F7',
    bgCard: '#F5EBE6',
    accent: '#D4A89A',
    text: '#4A3F35',
    textLight: '#7A6F65',
    border: '#E5DDD8',
    error: '#C45C4A'
  };

  const toggleTreatment = (treatment) => {
    setFormData(prev => ({
      ...prev,
      selectedTreatments: prev.selectedTreatments.includes(treatment)
        ? prev.selectedTreatments.filter(t => t !== treatment)
        : [...prev.selectedTreatments, treatment]
    }));
    if (errors.treatments) setErrors(prev => ({ ...prev, treatments: false }));
  };

  const toggleInterest = (category, item) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const updatePersonal = (field, value) => {
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const updateAnamnesis = (field, value) => {
    setFormData(prev => ({ ...prev, anamnesis: { ...prev.anamnesis, [field]: value } }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0 && formData.selectedTreatments.length === 0) {
      newErrors.treatments = true;
    }
    if (step === 2) {
      ['firstName', 'lastName', 'birthDate', 'address', 'phone', 'email', 'profession'].forEach(f => {
        if (!formData.personal[f]) newErrors[f] = true;
      });
    }
    if (step === 3) {
      ['q1','q2','q3','q4','q5','q6','q7','q9','q10','q11','q12'].forEach(q => {
        if (!formData.anamnesis[q]) newErrors[q] = true;
      });
      if (!formData.anamnesis.q8?.trim()) newErrors.q8 = true;
      if (!formData.anamnesis.q13?.trim()) newErrors.q13 = true;
      if (!formData.anamnesis.q14?.trim()) newErrors.q14 = true;
    }
    if (step === 5) {
      if (!formData.consent) newErrors.consent = true;
      if (!formData.signature) newErrors.signature = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(steps.length - 1, s + 1)); };

  const generatePDF = () => {
    const pdf = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const marginLeft = 20;
    const pageWidth = 170;

    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('ÄSTHETISCHE MEDIZIN', marginLeft, y);
    y += 8;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text('Aufklärung & Anamnese', marginLeft, y);
    y += 6;
    pdf.setFontSize(10);
    pdf.text('Anna Hryshchenko', marginLeft, y);
    y += 12;

    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('GEWÄHLTE BEHANDLUNGEN', marginLeft, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(formData.selectedTreatments.join(', '), marginLeft, y);
    y += 10;

    if (formData.selectedTreatments.includes('botox') && formData.botoxInterests.length > 0) {
      pdf.text(`Botox-Bereiche: ${formData.botoxInterests.join(', ')}`, marginLeft, y);
      y += lineHeight;
    }
    if (formData.selectedTreatments.includes('lips') && formData.lipsInterests.length > 0) {
      pdf.text(`Lippen-Optionen: ${formData.lipsInterests.join(', ')}`, marginLeft, y);
      y += lineHeight;
    }
    if (formData.selectedTreatments.includes('skin')) {
      if (formData.skinTypes.length > 0) {
        pdf.text(`Hautverbesserung: ${formData.skinTypes.join(', ')}`, marginLeft, y);
        y += lineHeight;
      }
      if (formData.skinZones.length > 0) {
        pdf.text(`Zonen: ${formData.skinZones.join(', ')}`, marginLeft, y);
        y += lineHeight;
      }
    }
    y += 6;

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
      { key: 'q10', text: 'Implantate' },
      { key: 'q11', text: 'Blutverdünnende Medikamente' },
      { key: 'q12', text: 'Herpes-Neigung' },
    ];

    questions.forEach(q => {
      const answer = formData.anamnesis[q.key] === 'yes' ? 'Ja' : formData.anamnesis[q.key] === 'no' ? 'Nein' : '-';
      const details = formData.anamnesis[q.key + '_details'] || '';
      pdf.text(`${q.text}: ${answer}${details ? ' (' + details + ')' : ''}`, marginLeft, y);
      y += lineHeight;
      if (y > 270) { pdf.addPage(); y = 20; }
    });

    y += 4;
    const allergyLines = pdf.splitTextToSize(`Allergien: ${formData.anamnesis.q8 || '-'}`, pageWidth);
    pdf.text(allergyLines, marginLeft, y);
    y += allergyLines.length * lineHeight;
    const medLines = pdf.splitTextToSize(`Medikamente: ${formData.anamnesis.q13 || '-'}`, pageWidth);
    pdf.text(medLines, marginLeft, y);
    y += medLines.length * lineHeight;
    const prevLines = pdf.splitTextToSize(`Vorherige Behandlungen: ${formData.anamnesis.q14 || '-'}`, pageWidth);
    pdf.text(prevLines, marginLeft, y);
    y += prevLines.length * lineHeight;
    if (formData.anamnesis.q15) {
      const qLines = pdf.splitTextToSize(`Offene Fragen: ${formData.anamnesis.q15}`, pageWidth);
      pdf.text(qLines, marginLeft, y);
      y += qLines.length * lineHeight;
    }
    y += 8;

    if (y > 220) { pdf.addPage(); y = 20; }

    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('EINVERSTÄNDNISERKLÄRUNG', marginLeft, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, marginLeft, y);
    y += lineHeight + 4;
    pdf.text('Unterschrift:', marginLeft, y);
    y += 4;

    if (formData.signature) {
      try { pdf.addImage(formData.signature, 'PNG', marginLeft, y, 60, 25); } catch (e) { console.error(e); }
    }

    return pdf;
  };

  const uploadPDFToCloudinary = async (pdfBlob) => {
    const fd = new FormData();
    fd.append('file', pdfBlob);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    fd.append('resource_type', 'raw');
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, { method: 'POST', body: fd });
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
      try { pdfUrl = await uploadPDFToCloudinary(pdfBlob); } catch (e) { console.error('PDF Upload failed:', e); }

      const treatmentNames = formData.selectedTreatments.map(t => t === 'botox' ? 'Botox' : t === 'lips' ? 'Lippen' : 'Hautverbesserung').join(', ');

      const submitData = {
        name: `${formData.personal.firstName} ${formData.personal.lastName}`,
        email: formData.personal.email,
        telefon: formData.personal.phone,
        geburtsdatum: formData.personal.birthDate,
        adresse: formData.personal.address,
        beruf: formData.personal.profession,
        gewaehlte_behandlungen: treatmentNames,
        botox_bereiche: formData.botoxInterests.join(', ') || '-',
        lippen_optionen: formData.lipsInterests.join(', ') || '-',
        hautverbesserung_typen: formData.skinTypes.join(', ') || '-',
        hautverbesserung_zonen: formData.skinZones.join(', ') || '-',
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
        herpes: formData.anamnesis.q12 === 'yes' ? `Ja - ${formData.anamnesis.q12_details || ''}` : 'Nein',
        medikamente: formData.anamnesis.q13,
        vorherige_behandlungen: formData.anamnesis.q14,
        offene_fragen: formData.anamnesis.q15 || 'Keine',
        unterschrift_datum: new Date().toLocaleDateString('de-DE'),
        unterschrift_bild: formData.signature || 'Keine Unterschrift',
        pdf_dokument: pdfUrl || 'PDF Upload fehlgeschlagen',
        formular_sprache: lang.toUpperCase()
      };

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        try {
          if (window.emailjs) {
            await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
              to_email: formData.personal.email,
              to_name: `${formData.personal.firstName} ${formData.personal.lastName}`,
            });
          }
        } catch (emailError) { console.error('Confirmation email failed:', emailError); }
        setSubmitted(true);
      } else {
        alert('Fehler beim Senden. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Error:', error);
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
    <button onClick={() => setExpandedInfo(expandedInfo === infoKey ? null : infoKey)} style={{ marginLeft: '8px', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: expandedInfo === infoKey ? colors.primary : colors.bgCard, color: expandedInfo === infoKey ? '#fff' : colors.primary, border: `1px solid ${colors.border}`, cursor: 'pointer' }}>i</button>
  );

  const inputStyle = { width: '100%', padding: '12px 16px', border: `1px solid ${colors.border}`, borderRadius: '8px', backgroundColor: '#fff', color: colors.text, fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
  const inputErrorStyle = { ...inputStyle, borderColor: colors.error };
  const checkboxCardStyle = (selected, isPackage = false) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: selected ? colors.bgCard : '#fff', border: `${isPackage ? '2' : '1'}px solid ${selected ? colors.accent : colors.border}` });

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
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '24px', background: `linear-gradient(135deg, ${colors.bgCard} 0%, ${colors.bg} 100%)`, borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom:
