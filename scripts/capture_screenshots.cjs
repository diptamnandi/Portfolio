const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Read the projects list
// In a real scenario, you can parse the JS file or hardcode the URLs
const projects = [
  { id: 'omnicare', demo: '' },
  { id: 'ai-librarian', demo: 'https://ai-librarian.onrender.com' },
  { id: 'foodie-calorie-finder', demo: '' },
  { id: 'qr-attendance', demo: '' },
  { id: 'nutrichef', demo: '' },
  { id: 'weather-dashboard', demo: '' },
  { id: 'calendar-notes', demo: '' },
  { id: 'sushiman', demo: '' },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const outputDir = path.join(__dirname, '..', 'public', 'images', 'projects');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const project of projects) {
    if (!project.demo || !project.demo.startsWith('http')) {
      console.log(`Skipping ${project.id} - no valid demo URL`);
      continue;
    }

    console.log(`Capturing ${project.id}...`);
    const page = await context.newPage();
    
    try {
      await page.goto(project.demo, { waitUntil: 'networkidle', timeout: 30000 });
      // Wait a bit extra for animations
      await page.waitForTimeout(2000); 
      
      await page.screenshot({ 
        path: path.join(outputDir, `${project.id}.webp`),
        type: 'jpeg', // we use jpeg/png to convert to webp usually, but playwright supports webp? No, it doesn't support webp directly in older versions, but let's try standard jpeg and rename or just use playwright's internal buffer.
        // Actually playwright does NOT support 'webp' natively in all browsers. Let's use jpeg and name it .webp or just use jpeg.
        // For standard Playwright:
      });
      console.log(`Saved screenshot for ${project.id}`);
    } catch (e) {
      console.error(`Failed to capture ${project.id}:`, e.message);
    }
    await page.close();
  }

  await browser.close();
})();
