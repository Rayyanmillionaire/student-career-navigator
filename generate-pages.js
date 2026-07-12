const fs = require('fs');
const pages = ['internships', 'certifications', 'goals', 'productivity', 'analytics'];
pages.forEach(p => {
  fs.mkdirSync('src/app/(dashboard)/' + p, {recursive: true});
  fs.writeFileSync('src/app/(dashboard)/' + p + '/page.tsx', `export default function Page() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-3xl font-bold mb-4 capitalize">${p}</h1>
      <p className="text-muted-foreground">This feature is coming soon.</p>
    </div>
  );
}`);
});
console.log("Pages created.");
