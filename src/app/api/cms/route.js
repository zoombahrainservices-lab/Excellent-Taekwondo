import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "src/data/cms-settings.json");

export async function GET() {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, "utf8");
      return NextResponse.json(JSON.parse(data));
    } else {
      // Return default settings if file doesn't exist
      const defaultSettings = {
        hero: {
          title: "Build Discipline, Confidence, and Fitness with Excellent Taekwondo",
          subtitle: "All ages and skill levels welcome. Join our supportive community and start your journey today.",
          primaryButtonText: "Book a Free Trial",
          secondaryButtonText: "View Programs",
          primaryButtonLink: "/contact",
          secondaryButtonLink: "/programs",
          backgroundImage: "/images/et1.jpg",
          imageScale: "0.85",
          imageOpacity: "opacity-70"
        },
        colors: {
          primary: "#D72638",
          secondary: "#FFD700",
          accent: "#FFD700",
          dark: "#0D1B2A",
          surface: "#2F3E46",
          background: "#FFFFFF",
          textPrimary: "#0D1B2A",
          textSecondary: "#2F3E46"
        },
        features: {
          title: "Why Choose Excellent Taekwondo?",
          subtitle: "Transform your life through martial arts with our comprehensive approach to physical and mental development.",
          showSection: true
        },
        programs: {
          title: "Our Programs",
          subtitle: "Choose the perfect class for your age and skill level",
          ctaTitle: "Ready to Start Your Journey?",
          ctaSubtitle: "Join thousands of students who have transformed their lives through martial arts. Book your free trial class today!",
          showSection: true
        },
        contact: {
          title: "Contact Us",
          subtitle: "Have questions or want to book a free trial? Send us a message and we'll get back to you shortly.",
          address: "123 Dojang Street, Your City",
          phone: "+1 (000) 000-0000",
          email: "info@example.com",
          whatsapp: "+10000000000"
        }
      };
      return NextResponse.json(defaultSettings);
    }
  } catch (error) {
    console.error("Error reading CMS settings:", error);
    return NextResponse.json({ error: "Failed to read settings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const settings = await request.json();
    
    // Ensure the directory exists
    const dir = path.dirname(settingsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the settings to file
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    
    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    console.error("Error saving CMS settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
