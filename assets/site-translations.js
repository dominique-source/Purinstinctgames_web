// Shared public commercial policy. Unknown supplements are deliberately null,
// never a free service or a public internal cost. No staffing ratio is inferred.
window.piSchoolCommercial = (() => {
  const policy = Object.freeze({ currency: 'CAD', regularRate: 25, pilotRate: 10,
    staffSupplement: null, travel: null, taxes: null });
  const limits = Object.freeze({ students: [1,999999], teachers: [0,999999], adults: [0,999999],
    indoors: [0,999999], outdoors: [0,999999], roles: [0,999999], zones: [1,5], hours: [1,999999], clinics: [1,999999] });
  function configuration(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const result = {};
    for (const [key,[min,max]] of Object.entries(limits)) {
      const value = raw[key];
      if (key === 'clinics' && (value === '' || value === null || value === undefined)) { result[key] = null; continue; }
      if (value === '' || value === null || value === undefined || typeof value === 'boolean') return null;
      const number = Number(value);
      if (!Number.isSafeInteger(number) || number < min || number > max) return null;
      result[key] = number;
    }
    return result.roles > result.teachers + result.adults ? null : result;
  }
  function estimate(students) {
    const valid = Number.isSafeInteger(students) && students >= 1 && students <= limits.students[1];
    return { base: valid ? students * policy.pilotRate : null, total: null,
      staffSupplement: policy.staffSupplement, travel: policy.travel,
      discount: Math.round((1-policy.pilotRate/policy.regularRate)*100) };
  }
  function formatMoney(value, language) {
    return new Intl.NumberFormat(language === 'en' ? 'en-CA' : 'fr-CA', {
      style:'currency', currency:policy.currency, currencyDisplay:'code', minimumFractionDigits:0, maximumFractionDigits:2,
    }).format(value);
  }
  function summary(raw, language) {
    const c = configuration(raw);
    if (!c) return '';
    const en = language === 'en';
    const labels = en ? ['Students','Teachers (total)','Other adults / volunteers (total)','Indoor play areas','Outdoor play areas','School adults available simultaneously','Open zones','Planned Games duration (hours)','Planned clinics (sessions)'] : ['Élèves','Enseignants (total)','Autres adultes / bénévoles (total)','Plateaux intérieurs','Plateaux extérieurs','Adultes de l’école disponibles simultanément','Zones ouvertes','Durée envisagée des Games (heures)','Cliniques envisagées (séances)'];
    const budget=estimate(c.students);
    return [(en ? 'School configuration — indicative proposal' : 'Configuration scolaire — proposition indicative'),
      ...Object.keys(limits).map((key,i)=>labels[i]+' : '+(c[key] === null ? (en ? 'To be confirmed' : 'À confirmer') : c[key])),
      (en ? 'Pilot program base : ' : 'Base du programme pilote : ')+formatMoney(budget.base,language),
      en ? 'Additional staffing: to be confirmed. Travel: additional, to be confirmed. Total: to be confirmed.' : 'Personnel supplémentaire : à confirmer. Déplacement : en sus, à confirmer. Total : à confirmer.',
      en ? 'Availability times, specialist roles and tax treatment remain to be confirmed.' : 'Créneaux de disponibilité, rôles spécialisés et traitement des taxes à confirmer.'
    ].join('\n');
  }
  function discountText(language) {
    const discount = estimate(null).discount;
    return language === 'en' ? `A ${discount}% commercial discount provided by PürInstinct, before travel expenses and supplements.` : `Une réduction commerciale de ${discount} % offerte par PürInstinct, avant déplacement et suppléments.`;
  }
  return Object.freeze({ policy, limits, configuration, estimate, formatMoney, summary, discountText });
})();

window.piTranslations = {
  "Terrain PürInstinct": "PürInstinct Field",
  "Les cinq zones et le terrain": "The five zones and the field",
  "Crée une ouverture à trois contre deux et passe vers la zone d’en-but.": "Create an opening three against two and pass toward the end zone.",
  "Explore les cinq zones et découvre comment elles se rejoignent sur le terrain.": "Explore the five zones and see how their skills come together on the field.",
  "Navigation principale": "Main navigation",
  "Pour les écoles": "For schools",
  "Les 5 zones": "The 5 zones",
  "L’Arène": "The Arena",
  "Le concept": "How it works",
  "App PürInstinct Games": "PürInstinct Games app",
  "À L’ÉCOLE": "AT SCHOOL",
  "Cinq zones pour développer tes habiletés.": "Five zones to develop your skills.",
  "Un terrain pour les mettre en pratique en match.": "One field to put them into practice in a match.",
  "Vue aérienne des cinq zones autour du terrain PürInstinct.": "Aerial view of the five zones around the PürInstinct field.",
  "Vitesse": "Speed",
  "Agilité": "Agility",
  "Habiletés des mains": "Hand Skills",
  "Habiletés des pieds": "Foot Skills",
  "Voir comment se déroulent les Games": "See how the Games work",
  "Les cinq zones": "The five zones",
  "Accélère sur une courte distance et apprends à relancer ton sprint.": "Accelerate over a short distance and learn to pick up speed again.",
  "Change de direction et garde ton équilibre en mouvement.": "Change direction and keep your balance on the move.",
  "Travaille la précision de tes passes et de tes réceptions.": "Practise passing and catching with precision.",
  "Travaille tes appuis et la précision de tes déplacements.": "Practise your footing and move with precision.",
  "Observe le jeu, anticipe et choisis la bonne action.": "Read the game, anticipate and choose the right move.",
  "Découvrir la zone →": "Explore the zone →",
  "De la découverte aux": "From discovery to the",
  "Conférence": "Talk",
  "Dominique Soucy présente le sport et lance le projet auprès des élèves.": "Dominique Soucy introduces the sport and kicks off the project with students.",
  "Cliniques": "Clinics",
  "Les élèves découvrent le jeu en pratiquant les habiletés dans les cinq zones.": "Students discover the game by practising skills in all five zones.",
  "Formation": "Training",
  "Les enseignants apprennent à animer les activités et à encadrer les zones.": "Teachers learn to lead the activities and supervise the zones.",
  "Les élèves mettent leurs habiletés en pratique dans les défis et les matchs.": "Students put their skills into practice in challenges and games.",
  "Configurez vos": "Set up your",
  "Configuration des Games": "Games configuration",
  "Élèves participants": "Participating students",
  "Enseignants disponibles": "Available teachers",
  "Autres adultes disponibles": "Other available adults",
  "Plateaux intérieurs": "Indoor spaces",
  "Plateaux extérieurs": "Outdoor spaces",
  "1 plateau = la surface d’un terrain de basketball": "1 space = the area of one basketball court",
  "Les plateaux mesurent l’espace disponible. Les zones sont les activités à encadrer.": "Spaces measure the available area. Zones are the activities that need supervision.",
  "Des élèves jouent avec un ballon noir PürInstinct sous la supervision de l’équipe.": "Students play with a black PürInstinct ball under the team’s supervision.",
  "élèves ·": "students ·",
  "adultes disponibles ·": "adults available ·",
  "plateaux": "spaces",
  "Voir et ajuster mon estimation": "View and adjust my estimate",
  "Ajustez votre": "Adjust your",
  "forfait": "package",
  "Modifier ma configuration": "Edit my configuration",
  "Réglages du forfait": "Package settings",
  "Postes couverts par votre école (postes)": "Roles covered by your school (roles)",
  "Zones ouvertes (zones)": "Open zones (zones)",
  "Durée des Games (heures)": "Games duration (hours)",
  "Cliniques (séances)": "Clinics (sessions)",
  "Estimation": "Estimate",
  "Estimation à confirmer": "Estimate to be confirmed",
  "Votre scénario doit être validé par l’équipe PürInstinct.": "The PürInstinct team will need to confirm your plan.",
  "Scénario de référence": "Reference scenario",
  "pour": "for",
  "élèves": "students",
  "par élève": "per student",
  "15 responsables de zones fournis par l’école et 5 intervenants PürInstinct pour 8 h.": "15 zone leaders from the school and 5 PürInstinct staff for 8 hours.",
  "PürInstinct Games à l’école": "PürInstinct Games at school",
  "Découvrez les cinq zones et configurez les Games pour votre école.": "Explore the five zones and configure the Games for your school.",
  "Les 5 zones de PürInstinct Games.": "The five zones of PürInstinct Games.",
  "Les 5 zones — PürInstinct Games": "The 5 zones — PürInstinct Games",
  "Les": "The",
  "5 zones": "5 zones",
  "Habiletés manuelles": "Hand skills",
  "Habiletés au pied": "Foot skills",
  "Accélère sur une courte distance.": "Accelerate over a short distance.",
  "Le défi.": "The challenge.",
  "En match.": "In a game.",
  "Fais un sprint de 40 m avec un départ adapté à ton niveau.": "Sprint 40 m from a starting position suited to your level.",
  "Démarque-toi ou rejoins la zone de but.": "Get open or reach the end zone.",
  "Change de direction en gardant ton équilibre.": "Change direction while keeping your balance.",
  "Évite les autres dans une arène de tag avec obstacles.": "Dodge other players in an obstacle-filled tag arena.",
  "Évite une touche et trouve un passage libre.": "Avoid a tag and find an open lane.",
  "Lance et attrape avec précision.": "Throw and catch accurately.",
  "Réagis à un lancer et vise une cible en équipe de trois.": "React to a throw and aim for a target in teams of three.",
  "Fais une passe précise ou réceptionne le ballon en mouvement.": "Make an accurate pass or catch the ball on the move.",
  "Pose tes pieds vite et au bon endroit.": "Place your feet quickly and accurately.",
  "En duel, touche les plaques qui s’allument, sans ballon.": "Go head to head and touch the pads as they light up, without a ball.",
  "Ajuste tes appuis pour repartir ou changer de direction.": "Adjust your footing to accelerate again or change direction.",
  "Observe le jeu et décide vite.": "Read the game and decide quickly.",
  "Joue un défi de stratégie 3 contre 3 avec ballon.": "Play a 3-on-3 strategy challenge with a ball.",
  "En match, lis les défenseurs et choisis quand avancer ou passer.": "Read the defenders and choose when to advance or pass.",
  "Les PürInstinct Games à ton école": "Bring PürInstinct Games to your school",
  "Tes élèves développent cinq habiletés dans cinq zones de défis, puis les mettent en pratique en match.": "Your students develop five skills in five challenge zones, then put them into practice in a game.",
  "On te montre comment ça se déroule et on voit ce qui pourrait convenir à ton école.": "We’ll show you how it works and explore what would suit your school.",
  "Des élèves écoutent leur coach sur le terrain": "Students listen to their coach on the field",
  "Réserver 20 minutes avec Dominique Soucy": "Book 20 minutes with Dominique Soucy",
  "Écrire à Dominique Soucy": "Contact Dominique Soucy",
  "Remplis le formulaire pour envoyer ton message à Dominique.": "Fill in the form to send Dominique a message.",
  "Nom": "Name",
  "École": "School",
  "Ville": "City",
  "Courriel": "Email",
  "Commentaires": "Comments",
  "Envoyer le message": "Send message",
  "Les 5 zones | PürInstinct Games": "The 5 zones | PürInstinct Games",
  "Pour les écoles | PürInstinct Games": "For schools | PürInstinct Games",
  "Le concept | PürInstinct Games": "How it works | PürInstinct Games",
  "PürInstinct Games — l'arène portable de 9 stations. Le sport à l'état Pur. Instinctif. Réserve ta session.": "PürInstinct Games — the portable nine-station arena. Experience the sport and book your session.",
  "PÜR ID — L'identité athlétique universelle | PürInstinct Games": "Pür ID — Your universal athletic identity | PürInstinct Games",
  "PÜR ID — L'identité athlétique universelle": "Pür ID — Your universal athletic identity",
  "PÜR ID — un score athlétique unique qui te suit partout. École, corporatif, festival, compétition nationale. Six instincts mesurés, une identité persistante.": "Pür ID — one athletic score that follows you from school and workplace events to festivals and national competitions. Six instincts, one lasting identity.",
  "Un score. Six instincts. Une identité qui te suit partout.": "One score. Six instincts. One identity that follows you everywhere.",
  "Voir le déroulement": "See how it works",
  "Fermer le panneau": "Close panel",
  "Explorer la zone →": "Explore the zone →",
  "Changer de direction. Réagir. Esquiver.": "Change direction. React. Dodge.",
  "Mains": "Hands",
  "Pieds": "Feet",
  "Terrain": "Field",
  "Voir le parcours scolaire": "See the school journey"
};

// School commercial strategy: exact-text entries for the existing FR/EN switcher.
window.piTranslations["Tarifs du programme scolaire"] = "School program rates";
Object.assign(window.piTranslations, {
  "Une expérience sportive complète, directement à votre école, sur plus d’un mois.": "A complete sports experience, delivered at your school over more than a month.",
  "Le budget global peut dépasser celui d’une activité scolaire ponctuelle. Il couvre un programme sur plusieurs semaines : préparation, formation, accompagnement et événement final.": "The overall budget may exceed that of a one-off school activity. It covers a multi-week program: preparation, training, support and a final event.",
  "Conférence de Dominique Soucy": "Dominique Soucy’s talk",
  "Présenter le sport et lancer le projet auprès des élèves.": "Introduce the sport and launch the project with students.",
  "Cliniques préparatoires": "Preparatory clinics",
  "Découvrir le jeu et développer les habiletés dans les cinq zones.": "Discover the game and develop skills across the five zones.",
  "Formation des enseignants": "Teacher training",
  "Préparer l’équipe enseignante à animer les activités et à encadrer les zones.": "Prepare teachers to lead activities and supervise the zones.",
  "Accompagnement et coordination": "Support and coordination",
  "Préparer le déroulement avec l’école et coordonner les Games.": "Plan the program with the school and coordinate the Games.",
  "Équipements et production": "Equipment and production",
  "Installer puis récupérer le matériel des Games. Les ballons pédagogiques restent à l’école.": "Set up and collect Games equipment. Teaching balls remain at the school.",
  "Événement final PürInstinct Games": "PürInstinct Games final event",
  "Mettre les habiletés en pratique dans les défis et les matchs.": "Put skills into practice through challenges and matches.",
  "Préparer": "Prepare",
  "Définir les besoins, les espaces, les ressources et le calendrier avec l’école.": "Define needs, spaces, resources and the schedule with the school.",
  "Former et accompagner": "Train and support",
  "Déployer la conférence, les cliniques et la formation des enseignants sur plusieurs semaines.": "Deliver the talk, clinics and teacher training over several weeks.",
  "Vivre les Games": "Experience the Games",
  "Réunir les élèves pour l’événement final, après la préparation.": "Bring students together for the final event following preparation.",
  "PürInstinct Games scolaires": "PürInstinct Games for schools",
  "Une expérience complète.": "A complete experience.",
  "Dans votre école.": "At your school.",
  "Le programme complet": "The complete program",
  "DJ, sonorisation et ambiance, administration et application font aussi partie des composantes déjà prévues dans la documentation.": "DJ, sound and atmosphere, administration and the app are also included among the components already set out in the documentation.",
  "Plus d’un mois. Un parcours préparé ensemble.": "More than a month. A journey planned together.",
  "Le calendrier et le nombre de séances sont convenus avec l’établissement.": "The schedule and number of sessions are agreed with the school.",
  "La valeur du programme": "The value of the program",
  "Tarif régulier": "Regular rate",
  "par élève": "per student",
  "L’expérience scolaire complète sur plusieurs semaines.": "The complete multi-week school experience.",
  "Cohorte pilote": "Pilot cohort",
  "Frais de déplacement en sus": "Travel expenses are additional",
  "Une réduction commerciale de 60 % accordée par PürInstinct, avant déplacement.": "A 60% commercial discount provided by PürInstinct, before travel expenses.",
  "Cette réduction n’est pas une subvention gouvernementale.": "This discount is not a government subsidy.",
  "Le nombre d’élèves, le calendrier et le périmètre de la formule sont à confirmer avec votre établissement.": "The number of students, schedule and scope of the package must be confirmed with your school.",
  "Deux voies pour financer votre participation": "Two ways to fund your participation",
  "Financer votre participation": "Funding your participation",
  "A · Financement direct": "A · Direct funding",
  "L’école finance sa participation": "The school funds its participation",
  "L’établissement assume les 10 $ par élève de la cohorte pilote et les frais de déplacement.": "The school pays the pilot cohort rate of $10 per student plus travel expenses.",
  "B · Financement externe": "B · External funding",
  "L’école mobilise des partenaires": "The school engages funding partners",
  "Subventions admissibles, fondation scolaire, commandites et partenaires peuvent contribuer à réduire la part déboursée par l’école.": "Eligible grants, the school foundation, sponsors and partners may help reduce the amount paid by the school.",
  "Les pistes se vérifient avec le centre de services scolaire et les organismes concernés. L’admissibilité et l’obtention de fonds ne sont pas garanties. Seules les contributions confirmées réduisent le montant à la charge de l’école.": "Funding options must be checked with the school service centre and relevant organizations. Eligibility and funding are not guaranteed. Only confirmed contributions reduce the amount payable by the school.",
  "Discutons de votre établissement": "Let’s discuss your school",
  "Demandez la documentation ou échangeons sur une formule adaptée à votre école.": "Request the documentation or discuss a package suited to your school.",
  "Demander la documentation": "Request the documentation",
  "Du tarif régulier à la cohorte pilote": "From the regular rate to the pilot cohort",
  "Discuter de ma formule": "Discuss my package",
  "Votre formule.": "Your package.",
  "Votre école.": "Your school.",
  "Ces réglages précisent vos besoins. Ils ne modifient pas automatiquement le tarif par élève de la cohorte pilote.": "These settings describe your needs. They do not automatically change the pilot cohort rate per student.",
  "Accompagnement et coordination, équipements et production, DJ et sonorisation complètent la conférence, les cliniques et la formation. Les ballons pédagogiques restent à l’école.": "Support and coordination, equipment and production, DJ and sound complement the talk, clinics and training. Teaching balls remain at the school.",
  "Exemple pour": "Example for",
  "Budget régulier": "Regular budget",
  "Budget cohorte pilote": "Pilot cohort budget",
  "Montants avant déplacement. Le financement externe ne change pas le prix du programme.": "Amounts exclude travel expenses. External funding does not change the program price.",
  "Une expérience sportive complète à l’école sur plus d’un mois. Tarif régulier : 25 $ par élève. Cohorte pilote : 10 $ par élève, frais de déplacement en sus.": "A complete school sports experience over more than a month. Regular rate: $25 per student. Pilot cohort: $10 per student, plus travel expenses.",
  "25 $": "$25",
  "10 $": "$10"
});

Object.assign(window.piTranslations, {
  "Les tarifs du programme": "Program rates",
  "Configurer les Games de mon école": "Configure the Games for my school",
  "Configurez les Games de votre école": "Configure the Games for your school",
  "Précisez vos élèves, vos installations et les adultes disponibles. Nous pourrons estimer les ressources nécessaires et préparer une proposition adaptée.": "Tell us about your students, facilities and available adults. We can assess the resources needed and prepare a tailored proposal.",
  "Autres adultes ou bénévoles disponibles": "Other available adults or volunteers",
  "Un plateau correspond à une surface approximativement équivalente à un terrain de basketball.": "A play area is approximately the size of a basketball court.",
  "Votre configuration et votre budget": "Your configuration and budget",
  "Adultes de l’école disponibles en même temps": "School adults available at the same time",
  "Durée envisagée des Games (heures)": "Planned Games duration (hours)",
  "Cliniques envisagées (séances)": "Planned clinics (sessions)",
  "Le total d’adultes, leur présence simultanée et leurs créneaux de disponibilité sont distincts. Les créneaux de chaque adulte seront précisés avec l’école.": "The total number of adults, their simultaneous presence and their availability times are different. Each adult’s availability will be confirmed with the school.",
  "Un bénévole ne remplace pas automatiquement un intervenant spécialisé. Les rôles seront confirmés avec vous.": "A volunteer does not automatically replace a specialist. Roles will be confirmed with you.",
  "Base du programme": "Program base",
  "Équivalent par élève — base du programme uniquement": "Per-student equivalent — program base only",
  "Personnel supplémentaire": "Additional staffing",
  "À confirmer selon les ressources": "To be confirmed based on resources",
  "Déplacement": "Travel",
  "À confirmer selon le lieu": "To be confirmed based on location",
  "Total à confirmer": "Total to be confirmed",
  "À confirmer": "To be confirmed",
  "Frais de déplacement en sus.": "Travel expenses are additional.",
  "Frais de déplacement à confirmer selon le lieu.": "Travel expenses to be confirmed based on location.",
  "Estimation indicative. Le montant final sera confirmé selon l’encadrement, les installations, le calendrier et les déplacements nécessaires.": "Indicative estimate. The final amount will be confirmed based on staffing, facilities, schedule and travel requirements.",
  "Traitement des taxes à confirmer dans la proposition.": "Tax treatment will be confirmed in the proposal.",
  "Le financement externe ne modifie pas le coût du programme. Aucune aide hypothétique n’est déduite.": "External funding does not change the program cost. No hypothetical funding is deducted.",
  "Demander une proposition avec cette configuration": "Request a proposal with this configuration",
  "Personnel supplémentaire selon les besoins d’encadrement.": "Additional staffing based on supervision requirements.",
  "Une réduction commerciale de 60 % offerte par PürInstinct, avant déplacement et suppléments.": "A 60% commercial discount provided by PürInstinct, before travel expenses and supplements.",
  "Le budget tient compte des ressources de votre école. Des frais supplémentaires peuvent s’appliquer lorsque PürInstinct fournit davantage de personnel.": "The budget takes your school’s resources into account. Additional charges may apply when PürInstinct provides more staff.",
  "L’établissement finance la base du programme, les frais de déplacement et les suppléments applicables confirmés.": "The school funds the program base, travel expenses and confirmed applicable supplements.",
  "Votre configuration à transmettre": "Your configuration to be sent",
  "Cette configuration sera jointe à votre message. Les montants restent indicatifs.": "This configuration will be included with your message. Amounts remain indicative.",
  "Accompagnement et coordination, équipements et production, DJ et sonorisation complètent la conférence, les cliniques et la formation. Les ballons pédagogiques restent à l’école. Le matériel des Games est récupéré après l’événement.": "Support and coordination, equipment and production, DJ and sound complement the talk, clinics and training. Teaching balls remain at the school. Games equipment is collected after the event."
});

Object.assign(window.piTranslations, {"Voir la base du programme":"View the program base"});

Object.assign(window.piTranslations, {"À préciser":"To be specified", "Le nombre de séances de cliniques sera confirmé avec l’école.":"The number of clinic sessions will be confirmed with the school."});

// School video copy, using the existing language mechanism.
Object.assign(window.piTranslations, {
  "Découvrez les PürInstinct Games": "Discover PürInstinct Games",
  "Une expérience sportive à votre école, avec préparation, formation et accompagnement jusqu’aux Games.": "A sports experience at your school, with preparation, training and support leading up to the Games.",
  "Lire la vidéo": "Play video",
  "Découvrir le programme scolaire": "Explore the school program",
  "Voir sur YouTube": "Watch on YouTube",
  "La lecture intégrée est indisponible. Utilisez le lien YouTube.": "Embedded playback is unavailable. Use the YouTube link."
});

Object.assign(window.piTranslations, {
  "Afficher la vidéo en plein écran": "Show the video fullscreen",
  "Plein écran": "Fullscreen",
  "Le plein écran est indisponible dans ce navigateur.": "Fullscreen is unavailable in this browser."
});

// Animated school offer — existing FR/EN system.
Object.assign(window.piTranslations, {
  "UNE EXPÉRIENCE COMPLÈTE": "A COMPLETE EXPERIENCE",
  "À L’ÉCOLE": "AT SCHOOL",
  "Plus d’un mois de préparation, de formation et d’accompagnement, jusqu’aux Games.": "More than a month of preparation, training and support, leading up to the Games.",
  "Le budget peut sembler important pour une école. Il couvre une expérience complète, directement dans votre établissement, sur plusieurs semaines.": "The budget may seem substantial for a school. It covers a complete experience at your school over several weeks.",
  "Des élèves jouent ensemble, accompagnés de l’équipe PürInstinct.": "Students play together with support from the PürInstinct team.",
  "CA · par élève": "CAD · per student",
  "Base de 10 $ CA par élève": "Base of CAD 10 per student",
  "60 % de réduction offerte par PürInstinct": "60% discount provided by PürInstinct",
  "Tarif régulier : 25 $ CA par élève. Cohorte pilote : base de 10 $ CA par élève. Une réduction commerciale de 60 % offerte par PürInstinct, avant déplacement et suppléments.": "Regular rate: CAD 25 per student. Pilot cohort: base of CAD 10 per student. A 60% commercial discount provided by PürInstinct, before travel expenses and supplements.",
  "Frais de déplacement en sus. Personnel supplémentaire selon les besoins d’encadrement.": "Travel expenses are additional. Additional staff based on supervision requirements.",
  "Composantes du programme": "Program components",
  "Conférence de Dominique Soucy": "Talk by Dominique Soucy",
  "Cliniques préparatoires": "Preparatory clinics",
  "Formation des enseignants": "Teacher training",
  "Accompagnement et coordination": "Support and coordination",
  "Équipements et production": "Equipment and production",
  "Games à l’école": "Games at school",
  "CONFIGUREZ VOTRE ÉCOLE": "CONFIGURE YOUR SCHOOL",
  "Diminuer": "Decrease",
  "Augmenter": "Increase",
  "Disponibilités et séances": "Availability and sessions",
  "adultes disponibles": "available adults",
  "plateaux": "playing areas",
  "Total": "Total",
  "Base par élève": "Base per student",
  "Les ressources saisies servent à préparer la proposition. Elles ne réduisent pas la base du programme.": "The resources entered help prepare your proposal. They do not reduce the program base.",
  "FINANCEMENT DIRECT": "DIRECT FUNDING",
  "FINANCEMENT EXTERNE": "EXTERNAL FUNDING",
  "L’école finance sa participation.": "The school funds its participation.",
  "Subventions admissibles · Fondations · Commandites · Partenaires": "Eligible grants · Foundations · Sponsors · Partners",
  "L’admissibilité et l’obtention de fonds ne sont pas garanties.": "Eligibility and funding are not guaranteed.",
  "Une aide externe peut réduire la contribution de l’école, sans changer le prix du programme. Seules les contributions confirmées réduisent le montant à la charge de l’école.": "External funding may reduce the school’s contribution without changing the program price. Only confirmed contributions reduce the amount payable by the school.",
  "DEMANDER MA PROPOSITION": "REQUEST MY PROPOSAL"
});

// Unified public discovery and contact, using the existing FR/EN mechanism.
Object.assign(window.piTranslations, {
  'Le programme':'The program',
  'Configurer mon école':'Configure my school',
  'Contact':'Contact',
  'Détails des zones':'Zone details',
  'Choisir une autre zone':'Choose another zone',
  'Mains':'Hands', 'Pieds':'Feet', 'Terrain':'Field',
  'Zone Vitesse : piste de sprint.':'Speed zone: sprint track.',
  'Zone Agilité : arène de déplacements.':'Agility zone: movement arena.',
  'Zone Habiletés des mains : défis de précision.':'Hand skills zone: precision challenges.',
  'Zone Habiletés des pieds : défis d’appuis.':'Foot skills zone: footwork challenges.',
  'Zone Game IQ : terrain de stratégie.':'Game IQ zone: strategy field.',
  'Le terrain PürInstinct réunit les cinq habiletés en match.':'The PürInstinct field brings all five skills together in a match.',
  'Parlons de votre école':'Let’s talk about your school',
  'Vos élèves développent cinq habiletés dans cinq zones. Découvrez comment les Games se déroulent et quelle formule pourrait convenir à votre école.':'Your students develop five skills across five zones. Discover how the Games work and which format could suit your school.',
  'Le formulaire permet de demander une rencontre. Dominique vous répondra pour convenir d’un moment.':'Use the form to request a meeting. Dominique will reply to agree on a time.'
});
Object.assign(window.piTranslations, {
 'Lire l’extrait':'Play clip',
 'La vidéo est indisponible. L’image de la zone reste affichée.':'The video is unavailable. The zone image remains available.'
});
