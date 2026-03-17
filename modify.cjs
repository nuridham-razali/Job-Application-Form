const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add disabled={isAdmin} to Field
content = content.replace(/<Field /g, '<Field disabled={isAdmin} ');

// Add disabled={isAdmin} to YesNoQuestion
content = content.replace(/<YesNoQuestion /g, '<YesNoQuestion disabled={isAdmin} ');

// For inputs inside map (familyMembers, education, experience)
content = content.replace(/<input type="text" placeholder="Nama \/ Name"/g, '<input disabled={isAdmin} type="text" placeholder="Nama / Name"');
content = content.replace(/<input type="text" placeholder="Hubungan \/ Relation"/g, '<input disabled={isAdmin} type="text" placeholder="Hubungan / Relation"');
content = content.replace(/<input type="text" placeholder="Umur \/ Age"/g, '<input disabled={isAdmin} type="text" placeholder="Umur / Age"');
content = content.replace(/<input type="text" placeholder="Tempat Kerja\/Belajar"/g, '<input disabled={isAdmin} type="text" placeholder="Tempat Kerja/Belajar"');

content = content.replace(/<input type="text" value=\{edu/g, '<input disabled={isAdmin} type="text" value={edu');
content = content.replace(/<input type="text" value=\{exp/g, '<input disabled={isAdmin} type="text" value={exp');
content = content.replace(/<input type="date" value=\{exp/g, '<input disabled={isAdmin} type="date" value={exp');

// For textareas
content = content.replace(/<textarea /g, '<textarea disabled={isAdmin} ');

// For select
content = content.replace(/<select name="startWork"/g, '<select disabled={isAdmin} name="startWork"');
content = content.replace(/<select name="noticePeriodUnit"/g, '<select disabled={isAdmin} name="noticePeriodUnit"');

// For checkboxes and radios
content = content.replace(/<input type="radio" name="startWork"/g, '<input disabled={isAdmin} type="radio" name="startWork"');
content = content.replace(/<input type="checkbox" required/g, '<input disabled={isAdmin} type="checkbox" required');

// For file input
content = content.replace(/<input type="file" accept="image\/\*"/g, '<input disabled={isAdmin} type="file" accept="image/*"');

// Hide add buttons
content = content.replace(/<button type="button" onClick=\{.*addArrayItem/g, '{!isAdmin && $&');
content = content.replace(/Tambah Keluarga \/ Add Family\n              <\/button>/g, 'Tambah Keluarga / Add Family\n              </button>}');
content = content.replace(/Tambah Pendidikan \/ Add Education\n              <\/button>/g, 'Tambah Pendidikan / Add Education\n              </button>}');
content = content.replace(/Tambah Pengalaman \/ Add Experience\n              <\/button>/g, 'Tambah Pengalaman / Add Experience\n              </button>}');

// Hide remove buttons
content = content.replace(/<button type="button" onClick=\{.*removeArrayItem/g, '{!isAdmin && $&');
content = content.replace(/<Trash2 className="w-4 h-4" \/>\n                    <\/button>\n                  \)}/g, '<Trash2 className="w-4 h-4" />\n                    </button>}\n                  )}');

fs.writeFileSync('src/App.tsx', content);
console.log('Done');
