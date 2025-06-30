import React, { useState, useRef, useEffect } from 'react';
import { Award, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const PreviewCertif = ({ certificateData, isGenerated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleImageClick = () => {
    setIsModalOpen(true);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, zoom]);

  // Prevent context menu on image
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isGenerated ? 'Preview Certificate' : 'Preview'}
        </h2>
        {isGenerated && certificateData ? (
          <>
            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-2xl relative">
                {certificateData.previewUrl ? (
                  <div className="relative group">
                    <img
                      src={certificateData.previewUrl}
                      alt="Generated Certificate"
                      className="w-full rounded-xl border-2 border-black-200 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-red-300 hover:brightness-75"
                      onClick={handleImageClick}
                      onContextMenu={handleContextMenu}
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Loading preview...</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <table className="min-w-[350px] max-w-lg w-full mx-auto bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
                <tbody>
                  <tr className="even:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-100">Certificates ID</td>
                    <td className="py-2 px-4 border-b border-gray-100 font-mono">
                      {certificateData.id}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Participant Name</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.participantName}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Activity</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.activity}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Date Issued</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.dateIssued}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Examiner Name</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.examinerName}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Examiner Position</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.examinerPosition}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Company Code</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.companyCode}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to Generate</h3>
            <p className="text-gray-600">
              Fill in the form details and click "Generate Certificate" to create your professional certificate.
            </p>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300"
          onClick={handleCloseModal}
        >
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                aria-label="Zoom in"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                aria-label="Zoom out"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                aria-label="Reset zoom"
                title="Reset Zoom"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute bottom-4 left-4 z-20 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {Math.round(zoom * 100)}%
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 right-4 z-20 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {zoom > 1 ? 'Drag to pan' : 'Use controls to zoom'}
            </div>

            {/* Certificate Image */}
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                ref={imageRef}
                src={certificateData.previewUrl}
                alt="Certificate Full Size"
                className={`block select-none transition-transform duration-200 ${
                  zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
                }`}
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  width: zoom === 1 ? 'auto' : 'auto',
                  height: zoom === 1 ? '90vh' : 'auto'
                }}
                onMouseDown={handleMouseDown}
                onContextMenu={handleContextMenu}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewCertif;