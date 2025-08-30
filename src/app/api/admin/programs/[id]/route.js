import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/programs.json');

// DELETE - Delete a program by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const data = fs.readFileSync(dataPath, 'utf8');
    const programs = JSON.parse(data);

    const filteredPrograms = programs.filter(program => program.id !== parseInt(id));
    
    if (filteredPrograms.length === programs.length) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    fs.writeFileSync(dataPath, JSON.stringify(filteredPrograms, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}
