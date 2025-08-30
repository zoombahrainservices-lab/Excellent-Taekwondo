import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/settings.json');

// Initialize settings.json if it doesn't exist
if (!fs.existsSync(dataPath)) {
  const defaultSettings = {
    heroTitle: 'Build Discipline, Confidence, and Fitness with Excellent Taekwondo',
    heroSubtitle: 'All ages and skill levels welcome. Join our supportive community and start your journey today.',
    primaryButtonText: 'Book a Free Trial',
    secondaryButtonText: 'View Programs',
    features: ['Discipline', 'Confidence', 'Fitness'],
    featureDescriptions: [
      'Practical skills and character development through structured training.',
      'Build self-assurance and mental strength.',
      'Improve physical conditioning and flexibility.'
    ],
    buttonPadding: 'px-6 py-3',
    buttonMargin: 'mt-8',
    sectionPadding: 'py-16',
    containerMaxWidth: 'max-w-7xl',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    heroImage: '/images/et1.jpg'
  };
  
  fs.writeFileSync(dataPath, JSON.stringify(defaultSettings, null, 2));
}

// GET - Read settings
export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const settings = JSON.parse(data);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

// POST - Update settings
export async function POST(request) {
  try {
    const settings = await request.json();
    
    fs.writeFileSync(dataPath, JSON.stringify(settings, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
