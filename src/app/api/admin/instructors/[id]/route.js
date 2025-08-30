import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/instructors.json');

// DELETE - Delete an instructor by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const data = fs.readFileSync(dataPath, 'utf8');
    const instructors = JSON.parse(data);

    const filteredInstructors = instructors.filter(instructor => instructor.id !== parseInt(id));
    
    if (filteredInstructors.length === instructors.length) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
    }

    fs.writeFileSync(dataPath, JSON.stringify(filteredInstructors, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return NextResponse.json({ error: 'Failed to delete instructor' }, { status: 500 });
  }
}
