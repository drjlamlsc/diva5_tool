/* ============================================================
   DIVA-5 item bank — reconstructed from the official
   DIVA-5 Adult (Patient version) questionnaire.
   Each criterion has a main question plus example prompts
   for adulthood and childhood (age 5-12).
   ============================================================ */

const PART1 = [
  { code:'A1',
    q:'Do you often fail to give close attention to details, or do you make careless mistakes in your work or during other activities? (Childhood: in schoolwork or during other activities.)',
    adult:[
      'Works slowly to avoid mistakes',
      'Makes careless mistakes',
      'Work is inaccurate',
      'Does not read instructions carefully',
      'Too much time needed to complete detailed tasks',
      'Overlooks or misses details',
      'Gets easily bogged down by details',
      'Works too quickly and therefore makes mistakes'],
    child:[
      'Careless mistakes in schoolwork',
      'Mistakes made by not reading questions properly',
      'Leaves questions unanswered by not reading them properly',
      'Overlooks or misses details',
      'Work is inaccurate',
      'Others comment about careless work',
      'Not checking the answers in homework',
      'Too much time needed to complete detailed tasks'] },

  { code:'A2',
    q:'Do you have difficulty sustaining your attention in tasks? (Childhood: in play activities.)',
    adult:[
      'Not able to keep attention on tasks for long*',
      'Quickly distracted by own thoughts or associations',
      'Difficulty remaining focussed during lectures and/or conversations',
      'Finds it difficult to watch a film through to the end, or to read a book*',
      'Easily distracted by unrelated thoughts',
      '*Unless the subject is found to be really interesting (e.g. computer or hobby)'],
    child:[
      'Difficulty keeping attention on schoolwork',
      'Difficulty keeping attention on play*',
      'Difficulty remaining focussed during lectures and/or conversations',
      'Easily distracted',
      'Needing structure to avoid becoming distracted',
      'Quickly becomes bored with things*',
      'Asks questions about subjects that have already been discussed',
      'Difficulty concentrating*'] },

  { code:'A3',
    q:'Does it often seem as though you are not listening when you are spoken to directly?',
    adult:[
      'Afterwards, not knowing what a conversation was about',
      'Dreamy or preoccupied',
      'Difficulty concentrating on a conversation',
      'Often changing the subject of the conversation',
      'Others saying that your thoughts are somewhere else',
      'Mind seems elsewhere, even in the absence of any obvious distraction'],
    child:[
      'Not knowing what parents/teachers have said',
      'Dreamy or preoccupied',
      'Only listening during eye contact or when a voice is raised',
      'Mind seems elsewhere, even in the absence of any obvious distraction',
      'Often having to be addressed again',
      'Questions having to be repeated'] },

  { code:'A4',
    q:'Do you often not follow through on instructions and often fail to finish chores or duties in the workplace? (Childhood: in schoolwork.)',
    adult:[
      'Does things that are muddled up together without completing them',
      'Starts tasks but quickly loses focus and is easily sidetracked',
      'Needing a time limit to complete tasks',
      'Difficulty completing administrative tasks',
      'Difficulty following instructions from a manual'],
    child:[
      'Difficulty following instructions',
      'Difficulty with instructions involving more than one step',
      'Starts tasks but quickly loses focus and is easily sidetracked'] },

  { code:'A5',
    q:'Do you often find it difficult to organise tasks and activities?',
    adult:[
      'Difficulty keeping materials and belongings in order',
      'Difficulty with planning activities of daily life',
      'Difficulty managing sequential tasks',
      'House and/or workplace are disorganised',
      'Planning too many tasks or non-efficient planning',
      'Regularly booking things at the same time (double-booking)',
      'Arriving late',
      'Fails to meet deadlines',
      'Not able to use an agenda or diary consistently',
      'Inflexible because of the need to keep to schedules',
      'Poor sense and management of time',
      'Creating schedules but not using them',
      'Needing other people to structure things'],
    child:[
      'Difficulty keeping materials and belongings in order',
      'Difficulty being ready on time',
      'Messy room / desk and/or work',
      'Difficulty playing alone',
      'Difficulty planning tasks or homework',
      'Fails to meet deadlines',
      'Doing things in a muddled way',
      'Arriving late',
      'Poor sense of time',
      'Difficulty keeping himself/herself entertained'] },

  { code:'A6',
    q:'Do you often avoid (or dislike, or are reluctant to engage in) tasks that require sustained mental effort?',
    adult:[
      'Do the easiest or nicest things first of all',
      'Often postpone boring or difficult tasks',
      'Postpone tasks so that deadlines are missed',
      'Avoid monotonous work, such as administration',
      'Avoids preparing reports, completing forms, or reviewing lengthy papers',
      'Do not like reading due to mental effort',
      'Reads few books or does not feel like reading due to mental effort'],
    child:[
      'Avoidance of tasks that require a lot of concentration',
      'Avoidance of homework or has an aversion to this',
      'Often postpones boring or difficult tasks',
      'Aversion to school subjects that require a lot of concentration'] },

  { code:'A7',
    q:'Do you often lose things that are necessary for tasks or activities?',
    adult:[
      'Often leave things behind',
      'Loses paper for work',
      'Mislays tools, paperwork, eyeglasses, mobile telephones, wallet, keys, or agenda',
      'Gets in a panic if other people move things around',
      'Loses a lot of time searching for things',
      'Stores things away in the wrong place',
      'Loses notes, lists or telephone numbers'],
    child:[
      'Loses school materials, pencils, books or other items',
      'Mislays toys, clothing, or homework',
      'Gets in a panic if other people move things around',
      'Comments from parents and/or teachers about things being lost'] },

  { code:'A8',
    q:'Are you often easily distracted by extraneous stimuli?',
    adult:[
      'Difficulty shutting off from external stimuli',
      'Easily distracted by noises or events',
      'After being distracted, difficult to pick up the thread again',
      'Easily distracted by the conversations of others',
      'Difficulty in filtering and/or selecting information'],
    child:[
      'Easily distracted by noises or events',
      'After being distracted, has difficulty picking up the thread again',
      'In the classroom, often looking outside'] },

  { code:'A9',
    q:'Are you often forgetful in daily activities?',
    adult:[
      'Forgets appointments or other obligations',
      'Forgets keys, agenda etc.',
      'Needs frequent reminders for appointments',
      'Forgets to do chores or run errands',
      'Forgets to pay bills or to return calls',
      'Returning home to fetch forgotten things',
      'Rigid use of lists to make sure things aren’t forgotten',
      'Forgets to keep or look at daily agenda'],
    child:[
      'Forgets appointments or instructions',
      'Forgets to do chores or run errands',
      'Has to be frequently reminded of things',
      'Forgets to take things to school',
      'Half-way through a task, forgetting what has to be done',
      'Leaving things behind at school or at friends’ houses'] },
];

const PART2 = [
  { code:'H1',
    q:'Do you often fidget with or tap hands or feet, or do you often squirm in your seat?',
    adult:[
      'Difficulty sitting still',
      'Fidgeting with the legs',
      'Tapping with a pen or playing with something',
      'Fiddling with hair or biting nails',
      'Able to control restlessness, but feels stressed as a result'],
    child:[
      'Parents often said ‘sit still’ or similar',
      'Fidgets with the legs',
      'Tapping with a pen or playing with something',
      'Fiddling with hair or biting nails',
      'Able to control restlessness, but feels stressed as a result'] },

  { code:'H2',
    q:'Do you often leave your seat in situations where it is expected that you remain seated?',
    adult:[
      'Avoids symposiums, lectures, church etc.',
      'Prefers to walk around rather than sit',
      'Often leaves his/her place in the office or workplace',
      'Never sits still for long, always moving around',
      'Stressed owing to the difficulty of sitting still',
      'Makes excuses in order to be able to walk around'],
    child:[
      'Often stands up while eating or leaves his/her place in the classroom',
      'Finds it very difficult to stay seated at school or during meals',
      'Being told to remain seated',
      'Making excuses in order to walk around'] },

  { code:'H3',
    q:'Do you often feel restless? (Childhood: runs or climbs about in situations where it is inappropriate.)',
    adult:[
      'Feeling restless or agitated inside',
      'Finding it hard to relax',
      'Constantly having the feeling that you have to be doing something'],
    child:[
      'Feeling restless inside',
      'Always running around where it is inappropriate',
      'Climbing on furniture, or jumping on the sofa',
      'Climbing in trees'] },

  { code:'H4',
    q:'Do you often find it difficult to engage in leisure activities quietly? (Childhood: in play activities.)',
    adult:[
      'Talks during activities when this is not appropriate',
      'Becoming quickly too cocky in public',
      'Being loud in all kinds of situations',
      'Difficulty in speaking softly'],
    child:[
      'Being loud-spoken during play or in the classroom',
      'Unable to watch TV or films quietly',
      'Asked to be quieter or calm down',
      'Becoming quickly too cocky in public'] },

  { code:'H5',
    q:'Are you often ‘on the go’ or do you often act as if ‘driven by a motor’?',
    adult:[
      'Always busy doing something',
      'Is uncomfortable being still for extended time, e.g. in restaurants or meetings',
      'Has too much energy, always on the move',
      'Others find you restless or difficult to keep up with',
      'Stepping over own boundaries',
      'Finds it difficult to let things go, excessively driven'],
    child:[
      'Constantly busy',
      'Others find you restless or difficult to keep up with',
      'Is uncomfortable being still for extended time',
      'Excessively active at school and at home',
      'Has lots of energy',
      'Always on the go, excessively driven'] },

  { code:'H6',
    q:'Do you often talk excessively?',
    adult:[
      'So busy talking that other people find it tiring',
      'Known to be an incessant talker',
      'Tendency to talk too much',
      'Needing a lot of words to say something',
      'Finds it difficult to stop talking',
      'Not giving others room to interject during a conversation'],
    child:[
      'Known as a chatterbox',
      'Teachers and parents often ask you to be quiet',
      'Comments in school reports about talking too much',
      'Being punished for talking too much',
      'Keeping others from doing schoolwork by talking too much',
      'Not giving others room during a conversation'] },

  { code:'H7',
    q:'Do you often blurt out an answer before questions have been completed?',
    adult:[
      'Giving people answers before they have finished speaking',
      'Being a blabbermouth, saying what you think',
      'Saying things without thinking first',
      'Completing other people’s sentences'],
    child:[
      'Being tactless',
      'Being a blabbermouth, saying things without thinking first',
      'Wants to be the first to answer questions at school',
      'Blurts out an answer even if it is wrong',
      'Interrupts others before sentences are finished',
      'Difficulty waiting for turn during conversations'] },

  { code:'H8',
    q:'Do you often find it difficult to await your turn?',
    adult:[
      'Difficulty in patiently waiting in traffic / traffic jams',
      'Difficulty waiting in a queue, jumping the queue',
      'Being impatient',
      'Quickly starting relationships/jobs, and ending/leaving these because of impatience'],
    child:[
      'Always being the first to talk or act',
      'Becomes quickly impatient',
      'Crosses the road without looking',
      'Difficulty waiting turn in group activities',
      'Difficulty waiting turn in the classroom'] },

  { code:'H9',
    q:'Do you often interrupt or intrude on others?',
    adult:[
      'Being quick to interfere with others',
      'Intrudes on others',
      'Difficulty respecting the boundaries of others',
      'Having an opinion about everything and immediately expressing this',
      'Starts using people’s things without asking or permission'],
    child:[
      'Interrupts the conversation of others',
      'Reacts to everything',
      'Unable to wait',
      'Disturbs other people’s activities without being asked, or takes over their tasks',
      'Interrupts the games or activities of others',
      'Comments from others about interference'] },
];

/* Part 3 — Impairment domains (Criterion C) */
const DOMAINS_ADULT = [
  { key:'work', title:'Work / education', items:[
    'Tire quickly of a workplace',
    'Work below level of education',
    'Sickness benefits / disability benefit as a result of symptoms',
    'Did not complete education/training needed for work',
    'Pattern of many short-lasting jobs',
    'Difficulty with administrative work / planning',
    'Not achieving promotions',
    'Under-performing at work',
    'Left work following arguments or dismissal',
    'Limited impairment through compensation of high IQ',
    'Limited impairment through compensation of external structure'] },
  { key:'rel', title:'Relationships and/or family', items:[
    'Tire quickly of relationships',
    'Unequal partner relationship owing to symptoms',
    'Relationship problems, lots of arguments, lack of intimacy',
    'Impulsivity commencing / ending relationships',
    'Divorced owing to symptoms',
    'Problems with sexuality as a result of symptoms',
    'Problems with upbringing as a result of symptoms',
    'Difficulty with housekeeping and/or administration',
    'Financial problems or gambling',
    'Not daring to start a relationship'] },
  { key:'social', title:'Social contacts', items:[
    'Conflicts as a result of communication problems',
    'Low self-assertiveness as a result of negative experiences',
    'Difficulty maintaining social contacts',
    'Not being attentive (e.g. forget to send a card / empathising / phoning)',
    'Difficulty initiating social contacts'] },
  { key:'free', title:'Free time / hobby', items:[
    'Unable to relax properly during free time',
    'Injuries as a result of excessive sport',
    'Unable to finish a book or watch a film all the way through',
    'Having to play lots of sports in order to relax',
    'Being continually busy and therefore becoming overtired',
    'Tire quickly of hobbies',
    'Accidents / loss of driving licence as a result of reckless driving',
    'Sensation seeking and/or taking too many risks',
    'Contact with the police / the courts',
    'Binge eating'] },
  { key:'self', title:'Self-confidence / self-image', items:[
    'Negative self-image due to experience of failure',
    'Uncertainty through negative comments of others',
    'Fear of failure in terms of starting new things',
    'Excessive intense reaction to criticism',
    'Perfectionism',
    'Distressed by the symptoms of ADHD'] },
];

const DOMAINS_CHILD = [
  { key:'edu', title:'Education', items:[
    'Staying back (repeating classes) as a result of concentration problems',
    'Education not completed / rejected from school',
    'Took much longer to complete education than usual',
    'Difficulty doing homework',
    'Lower educational level than expected based on IQ',
    'Achieved education suited to IQ with a lot of effort',
    'Followed special education on account of symptoms',
    'Comments from teachers about behaviour or concentration',
    'Limited impairment through compensation of high IQ',
    'Limited impairment through compensation of external structure'] },
  { key:'family', title:'Family', items:[
    'Frequent punishment or hiding',
    'Frequent arguments with brothers or sisters',
    'Required structure from parents for longer than would normally be the case',
    'Little contact with family on account of conflicts'] },
  { key:'social', title:'Social contacts', items:[
    'Conflicts as a result of communication problems',
    'Low self-assertiveness as a result of negative experiences',
    'Difficulty maintaining social contacts',
    'Shut out by, or not being allowed to do things with a group',
    'Difficulty entering into social contacts',
    'Few friends',
    'Being teased',
    'Being a bully'] },
  { key:'free', title:'Free time / hobby', items:[
    'Having to play lots of sport to be able to relax',
    'Unable to finish a book or watch a film all the way through',
    'Unable to relax properly during free time',
    'Injuries as a result of excessive sport',
    'Tired quickly of hobbies',
    'Being continually busy and therefore becoming overtired',
    'Sensation seeking and/or taking too many risks',
    'Contact with the police / courts',
    'Increased number of accidents'] },
  { key:'self', title:'Self-confidence / self-image', items:[
    'Negative self-image due to experiences of failure',
    'Fear of failure in terms of starting new things',
    'Excessive intense reaction to criticism',
    'Perfectionism',
    'Uncertainty through negative comments of others'] },
];
