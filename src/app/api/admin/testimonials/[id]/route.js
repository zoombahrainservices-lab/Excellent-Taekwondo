import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/testimonials.json');

// DELETE - Delete a testimonial by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const data = fs.readFileSync(dataPath, 'utf8');
    const testimonials = JSON.parse(data);

    const filteredTestimonials = testimonials.filter(testimonial => testimonial.id !== parseInt(id));
    
    if (filteredTestimonials.length === testimonials.length) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    fs.writeFileSync(dataPath, JSON.stringify(filteredTestimonials, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
