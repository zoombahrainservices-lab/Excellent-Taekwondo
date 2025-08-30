import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/programs.json');

// GET - Read all programs
export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const programs = JSON.parse(data);
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error reading programs:', error);
    return NextResponse.json({ error: 'Failed to read programs' }, { status: 500 });
  }
}

// POST - Create or update a program
export async function POST(request) {
  try {
    const program = await request.json();
    const data = fs.readFileSync(dataPath, 'utf8');
    const programs = JSON.parse(data);

    if (program.id) {
      // Update existing program
      const index = programs.findIndex(p => p.id === program.id);
      if (index !== -1) {
        programs[index] = { ...programs[index], ...program };
      }
    } else {
      // Add new program
      program.id = Date.now();
      programs.push(program);
    }

    fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving program:', error);
    return NextResponse.json({ error: 'Failed to save program' }, { status: 500 });
  }
}
