'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageEditor({ image, onSave, onCancel }) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);
  const [filters, setFilters] = useState({
    brightness: 1,
    contrast: 1,
    saturation: 1,
    blur: 0,
    sharpen: 0
  });
  const [quality, setQuality] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }, [aspect]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const generatePreview = useCallback(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness})
      contrast(${filters.contrast})
      saturate(${filters.saturation})
      blur(${filters.blur}px)
    `;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );
  }, [completedCrop, filters]);

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) {
      alert('Please select a crop area');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      
      // Convert image to file if it's not already
      if (image instanceof File) {
        formData.append('image', image);
      } else {
        // If it's a URL, we need to fetch and convert to blob
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: blob.type });
        formData.append('image', file);
      }

      const editOptions = {
        crop: {
          x: completedCrop.x * (imgRef.current.naturalWidth / imgRef.current.width),
          y: completedCrop.y * (imgRef.current.naturalHeight / imgRef.current.height),
          width: completedCrop.width * (imgRef.current.naturalWidth / imgRef.current.width),
          height: completedCrop.height * (imgRef.current.naturalHeight / imgRef.current.height)
        },
        filters,
        quality,
        resize: scale !== 1 ? {
          width: Math.round(imgRef.current.naturalWidth * scale),
          height: Math.round(imgRef.current.naturalHeight * scale)
        } : null
      };

      formData.append('editOptions', JSON.stringify(editOptions));

      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.image);
      } else {
        throw new Error('Failed to save image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Error saving image: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate preview when crop or filters change
  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Image Editor</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main editing area */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imageUrl}
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      maxHeight: '400px',
                      maxWidth: '100%'
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>

              {/* Preview */}
              {completedCrop && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Preview</h3>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      border: '1px solid #ccc',
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '200px'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                <select
                  value={aspect || ''}
                  onChange={(e) => setAspect(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Free</option>
                  <option value={1}>Square (1:1)</option>
                  <option value={16/9}>Widescreen (16:9)</option>
                  <option value={4/3}>Standard (4:3)</option>
                  <option value={3/2}>Photo (3:2)</option>
                </select>
              </div>

              {/* Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scale: {scale}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Rotate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotate: {rotate}°
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="15"
                  value={rotate}
                  onChange={(e) => setRotate(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Filters */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Filters</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brightness: {filters.brightness}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={filters.brightness}
                      onChange={(e) => handleFilterChange('brightness', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contrast: {filters.contrast}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={filters.contrast}
                      onChange={(e) => handleFilterChange('contrast', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Saturation: {filters.saturation}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={filters.saturation}
                      onChange={(e) => handleFilterChange('saturation', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blur: {filters.blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={filters.blur}
                      onChange={(e) => handleFilterChange('blur', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sharpen: {filters.sharpen}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={filters.sharpen}
                      onChange={(e) => handleFilterChange('sharpen', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setFilters({
                    brightness: 1,
                    contrast: 1,
                    saturation: 1,
                    blur: 0,
                    sharpen: 0
                  });
                  setScale(1);
                  setRotate(0);
                  setQuality(85);
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Save Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
