/* ============================================================
   Young DIVA-5 item bank — for children & adolescents (5–17).
   Same 18 DSM-5 ADHD criteria, assessed in the present day with
   age-appropriate examples split across two settings: HOME and
   SCHOOL/COLLEGE (DSM-5 requires symptoms in ≥2 settings).
   Examples adapted for young people from the DSM-5 criteria and
   the DIVA family of instruments — obtain the official Young
   DIVA-5 from the DIVA Foundation for the validated wording.
   ============================================================ */

const YPART1 = [
  { code:'A1',
    q:'Does the young person often fail to give close attention to details, or make careless mistakes?',
    home:[
      'Careless mistakes in homework or chores',
      'Rushes through tasks and misses details',
      'Work looks messy or inaccurate',
      'Skips steps when following instructions at home'],
    school:[
      'Careless mistakes in schoolwork or tests',
      'Does not read questions properly',
      'Overlooks details / leaves questions unanswered',
      'Teacher comments about careless work'] },

  { code:'A2',
    q:'Does the young person often have difficulty sustaining attention in tasks or play?',
    home:[
      'Cannot stay focused on homework or chores for long*',
      'Quickly distracted during tasks',
      'Difficulty watching a film or reading a book to the end*',
      'Jumps from one activity to another',
      '*Unless it is really interesting (e.g. games or a hobby)'],
    school:[
      'Difficulty keeping attention during lessons',
      'Easily distracted in class',
      'Difficulty staying focused during group work',
      'Needs structure to avoid drifting off'] },

  { code:'A3',
    q:'Does it often seem the young person is not listening when spoken to directly?',
    home:[
      'Seems not to listen when spoken to directly',
      'Dreamy or preoccupied',
      'Has to be addressed again / instructions repeated',
      'Mind seems elsewhere even without distraction'],
    school:[
      'Not knowing what the teacher just said',
      'Only listens with eye contact or a raised voice',
      'Often has to be called by name',
      'Questions have to be repeated'] },

  { code:'A4',
    q:'Does the young person often not follow through on instructions and fail to finish tasks?',
    home:[
      'Starts chores but does not finish them',
      'Easily sidetracked before completing tasks',
      'Difficulty following multi-step instructions',
      'Needs reminders to finish what was started'],
    school:[
      'Does not finish schoolwork or assignments',
      'Difficulty with instructions involving several steps',
      'Starts tasks but loses focus',
      'Hands work in incomplete'] },

  { code:'A5',
    q:'Does the young person often find it difficult to organise tasks and activities?',
    home:[
      'Messy room, desk or schoolbag',
      'Difficulty getting ready on time',
      'Poor sense of time',
      'Does things in a muddled way'],
    school:[
      'Difficulty planning homework or projects',
      'Difficulty keeping materials and belongings in order',
      'Fails to meet deadlines',
      'Arrives late or unprepared'] },

  { code:'A6',
    q:'Does the young person often avoid or dislike tasks that need sustained mental effort?',
    home:[
      'Avoids or dislikes homework',
      'Puts off boring or difficult tasks',
      'Does the easy or fun things first',
      'Reluctant to read because of the mental effort'],
    school:[
      'Aversion to subjects needing lots of concentration',
      'Avoids lengthy reading or writing tasks',
      'Postpones tasks until deadlines are missed',
      'Reluctant to engage in demanding classwork'] },

  { code:'A7',
    q:'Does the young person often lose things needed for tasks or activities?',
    home:[
      'Loses toys, clothing or belongings',
      'Misplaces phone, keys or homework',
      'Spends a lot of time searching for things',
      'Leaves things behind'],
    school:[
      'Loses school materials, pencils or books',
      'Forgets or loses homework and notes',
      'Mislays items needed for class',
      'Comments from teachers about lost things'] },

  { code:'A8',
    q:'Is the young person often easily distracted by extraneous stimuli?',
    home:[
      'Easily distracted by noises or events',
      'After being distracted, hard to pick up the thread',
      'Difficulty filtering out surrounding stimuli',
      'Distracted by what others are doing'],
    school:[
      'Easily distracted by classroom noise or events',
      'Often looking out of the window',
      'Distracted by other children',
      'Difficulty selecting what to focus on'] },

  { code:'A9',
    q:'Is the young person often forgetful in daily activities?',
    home:[
      'Forgets chores or errands',
      'Forgets to bring things that are needed',
      'Has to be frequently reminded',
      'Forgets appointments or instructions'],
    school:[
      'Forgets to bring or hand in homework',
      'Forgets to take things to school',
      'Half-way through a task, forgets what to do',
      'Forgets instructions or obligations'] },
];

const YPART2 = [
  { code:'H1',
    q:'Does the young person often fidget, tap hands or feet, or squirm in their seat?',
    home:[
      'Fidgets with hands or feet, squirms in seat',
      'Taps with a pen or plays with objects',
      'Fiddles with hair or bites nails',
      'Difficulty sitting still at meals'],
    school:[
      'Fidgets or squirms in seat during lessons',
      'Often told to "sit still"',
      'Plays with objects during class',
      'Restless when seated'] },

  { code:'H2',
    q:'Does the young person often leave their seat when expected to remain seated?',
    home:[
      'Gets up during meals',
      'Cannot stay seated for long',
      'Always moving around',
      'Makes excuses to get up'],
    school:[
      'Leaves seat in the classroom',
      'Difficulty staying seated during lessons',
      'Stands up or wanders when expected to sit',
      'Told to remain in seat'] },

  { code:'H3',
    q:'Does the young person often run about or climb when it is inappropriate (or feel restless)?',
    home:[
      'Runs or climbs when it is inappropriate',
      'Climbs on furniture, jumps on the sofa',
      'Feels restless inside',
      'Constantly on the move at home'],
    school:[
      'Runs about when they should be calm',
      'Restless and unable to settle',
      'Climbs or moves around the classroom',
      'Cannot stay calm in assembly'] },

  { code:'H4',
    q:'Does the young person often find it difficult to play or do leisure activities quietly?',
    home:[
      'Unable to play or watch TV quietly',
      'Loud during play',
      'Difficulty doing quiet activities',
      'Asked to be quieter or to calm down'],
    school:[
      'Loud during class or play',
      'Difficulty doing quiet tasks',
      'Disrupts quiet activities',
      'Asked repeatedly to calm down'] },

  { code:'H5',
    q:'Is the young person often "on the go" or acting as if "driven by a motor"?',
    home:[
      'Always busy, lots of energy',
      'Uncomfortable being still for long',
      'On the go from morning to night',
      'Others find it tiring to keep up'],
    school:[
      'Excessively active at school',
      'Cannot stay still during lessons',
      'Always on the move',
      'Hard for adults to keep up with'] },

  { code:'H6',
    q:'Does the young person often talk excessively?',
    home:[
      'Talks excessively',
      'Known as a chatterbox',
      'Finds it hard to stop talking',
      'Talks over others at home'],
    school:[
      'Talks too much in class',
      'Teachers ask the child to be quiet',
      'Comments in reports about talking too much',
      'Keeps others from working by talking'] },

  { code:'H7',
    q:'Does the young person often blurt out answers before questions are completed?',
    home:[
      'Blurts out answers or comments',
      'Says things without thinking first',
      'Completes other people’s sentences',
      'Tactless remarks'],
    school:[
      'Calls out answers before the question is finished',
      'Wants to be first to answer',
      'Blurts out an answer even if it is wrong',
      'Difficulty waiting to be asked'] },

  { code:'H8',
    q:'Does the young person often find it difficult to wait their turn?',
    home:[
      'Difficulty waiting for their turn',
      'Impatient',
      'Cannot wait in queues',
      'Acts before thinking'],
    school:[
      'Difficulty waiting turn in class or games',
      'Jumps the queue',
      'Becomes impatient quickly',
      'Always wants to go first'] },

  { code:'H9',
    q:'Does the young person often interrupt or intrude on others?',
    home:[
      'Interrupts conversations',
      'Intrudes on others’ activities',
      'Uses other people’s things without asking',
      'Difficulty respecting boundaries'],
    school:[
      'Interrupts others’ games or work',
      'Butts into conversations',
      'Takes over other children’s tasks',
      'Comments from others about interfering'] },
];

/* Young DIVA-5 impairment — five areas of everyday life (assessed currently) */
const YDOMAINS = [
  { key:'homeschool', title:'Home & school / college', items:[
    'Underachieving relative to ability',
    'Needs extra structure or support to cope',
    'Repeating a year / behind expected level',
    'Frequent teacher comments about behaviour or concentration',
    'Difficulty completing homework',
    'Disruptive behaviour at home or school',
    'Detentions / disciplinary measures',
    'Limited impairment through compensation of high IQ or external structure'] },
  { key:'family', title:'Relationships & family life', items:[
    'Frequent arguments or conflict at home',
    'Frequent punishment',
    'Difficulty getting on with siblings or parents',
    'Family needs to provide a lot of structure',
    'Strain on family relationships'] },
  { key:'social', title:'Social contacts', items:[
    'Difficulty making or keeping friends',
    'Few friends',
    'Being teased or bullied',
    'Being a bully',
    'Left out of group activities',
    'Conflicts arising from communication problems'] },
  { key:'free', title:'Free time & hobbies', items:[
    'Cannot settle to or finish activities',
    'Quickly tires of hobbies',
    'Constantly busy and becomes overtired',
    'Sensation-seeking or taking too many risks',
    'Accidents or injuries',
    'Unable to relax during free time'] },
  { key:'self', title:'Self-confidence & self-image', items:[
    'Negative self-image from repeated experiences of failure',
    'Low self-esteem from criticism',
    'Fear of failure / reluctant to try new things',
    'Excessive reaction to criticism',
    'Anxiety or distress related to the symptoms'] },
];
