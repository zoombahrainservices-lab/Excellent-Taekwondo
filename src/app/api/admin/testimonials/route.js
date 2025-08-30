import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/testimonials.json');

// GET - Read all testimonials
export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const testimonials = JSON.parse(data);
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return NextResponse.json({ error: 'Failed to read testimonials' }, { status: 500 });
  }
}

// POST - Create or update a testimonial
export async function POST(request) {
  try {
    const testimonial = await request.json();
    const data = fs.readFileSync(dataPath, 'utf8');
    const testimonials = JSON.parse(data);

    if (testimonial.id) {
      // Update existing testimonial
      const index = testimonials.findIndex(t => t.id === testimonial.id);
      if (index !== -1) {
        testimonials[index] = { ...testimonials[index], ...testimonial };
      }
    } else {
      // Add new testimonial
      testimonial.id = Date.now();
      testimonials.push(testimonial);
    }

    fs.writeFileSync(dataPath, JSON.stringify(testimonials, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving testimonial:', error);
    return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
  }
}
