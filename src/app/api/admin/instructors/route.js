import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/instructors.json');

// GET - Read all instructors
export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const instructors = JSON.parse(data);
    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error reading instructors:', error);
    return NextResponse.json({ error: 'Failed to read instructors' }, { status: 500 });
  }
}

// POST - Create or update an instructor
export async function POST(request) {
  try {
    const instructor = await request.json();
    const data = fs.readFileSync(dataPath, 'utf8');
    const instructors = JSON.parse(data);

    if (instructor.id) {
      // Update existing instructor
      const index = instructors.findIndex(i => i.id === instructor.id);
      if (index !== -1) {
        instructors[index] = { ...instructors[index], ...instructor };
      }
    } else {
      // Add new instructor
      instructor.id = Date.now();
      instructors.push(instructor);
    }

    fs.writeFileSync(dataPath, JSON.stringify(instructors, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving instructor:', error);
    return NextResponse.json({ error: 'Failed to save instructor' }, { status: 500 });
  }
}
