import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.join(process.cwd(), 'public/images');
const dataPath = path.join(process.cwd(), 'src/data/images.json');

// Ensure directories exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Initialize images.json if it doesn't exist
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
}

// GET - Read all images
export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const images = JSON.parse(data);
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ error: 'Failed to read images' }, { status: 500 });
  }
}

// POST - Upload and process image
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const editOptions = JSON.parse(formData.get('editOptions') || '{}');

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const extension = path.extname(file.name);
    const filename = `${originalName}_${timestamp}${extension}`;
    const filepath = path.join(imagesDir, filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image with Sharp
    let sharpImage = sharp(buffer);
    
    // Apply editing options
    if (editOptions.resize) {
      const { width, height } = editOptions.resize;
      sharpImage = sharpImage.resize(width, height, { fit: 'inside', withoutEnlargement: true });
    }

    if (editOptions.crop) {
      const { x, y, width, height } = editOptions.crop;
      sharpImage = sharpImage.extract({ left: Math.round(x), top: Math.round(y), width: Math.round(width), height: Math.round(height) });
    }

    if (editOptions.filters) {
      const { brightness, contrast, saturation, blur, sharpen } = editOptions.filters;
      
      if (brightness !== undefined && brightness !== 1) {
        sharpImage = sharpImage.modulate({ brightness });
      }
      
      if (contrast !== undefined && contrast !== 1) {
        sharpImage = sharpImage.linear(contrast, -(128 * contrast) + 128);
      }
      
      if (saturation !== undefined && saturation !== 1) {
        sharpImage = sharpImage.modulate({ saturation });
      }
      
      if (blur && blur > 0) {
        sharpImage = sharpImage.blur(blur);
      }
      
      if (sharpen && sharpen > 0) {
        sharpImage = sharpImage.sharpen({ sigma: sharpen });
      }
    }

    // Convert to JPEG for consistency and compression
    if (editOptions.quality) {
      sharpImage = sharpImage.jpeg({ quality: editOptions.quality });
    } else {
      sharpImage = sharpImage.jpeg({ quality: 85 });
    }

    // Save processed image
    await sharpImage.toFile(filepath);

    // Get image metadata
    const metadata = await sharp(filepath).metadata();

    // Create image record
    const imageRecord = {
      id: timestamp,
      filename,
      originalName: file.name,
      path: `/images/${filename}`,
      size: fs.statSync(filepath).size,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      uploadedAt: new Date().toISOString(),
      editOptions
    };

    // Update images.json
    const data = fs.readFileSync(dataPath, 'utf8');
    const images = JSON.parse(data);
    images.push(imageRecord);
    fs.writeFileSync(dataPath, JSON.stringify(images, null, 2));

    return NextResponse.json({ 
      success: true, 
      image: imageRecord 
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

// DELETE - Delete image
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Read current images
    const data = fs.readFileSync(dataPath, 'utf8');
    const images = JSON.parse(data);

    // Find image to delete
    const imageIndex = images.findIndex(img => img.id == imageId);
    if (imageIndex === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const imageToDelete = images[imageIndex];
    const filepath = path.join(imagesDir, imageToDelete.filename);

    // Delete file from filesystem
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Remove from images array
    images.splice(imageIndex, 1);

    // Update images.json
    fs.writeFileSync(dataPath, JSON.stringify(images, null, 2));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
