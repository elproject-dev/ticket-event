"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImagePlus, X } from "lucide-react";

export type PhotoItem = {
  id: string; // unique ID for sortable
  file: File | null;
  previewUrl: string | null;
  isExisting?: boolean; // true if it's from DB
};

interface PhotoGalleryDnDProps {
  initialPhotos: PhotoItem[]; // exactly 6 items
  onChange: (photos: PhotoItem[]) => void;
}

function SortablePhoto({ photo, index, onFileChange, onRemove }: { photo: PhotoItem, index: number, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const isMain = index === 0;
  const inputId = `photo-input-${photo.id}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative w-full aspect-video border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors rounded-none group cursor-grab active:cursor-grabbing ${
        isMain
          ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
          : "border-muted-foreground/25 bg-muted/30 hover:bg-muted/50"
      }`}
    >
      {photo.previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.previewUrl}
            alt={`Preview ${index}`}
            className="w-full h-full object-cover absolute inset-0 pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/80"
          >
            <X className="w-3 h-3" />
          </button>
          {isMain && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-none z-10 pointer-events-none">
              UTAMA
            </div>
          )}
          {!isMain && (
            <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-none z-10 pointer-events-none">
              {index}
            </div>
          )}
        </>
      ) : (
        <div
          className={`flex flex-col items-center justify-center pointer-events-none ${
            isMain ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <ImagePlus className={`mb-1 opacity-80 ${isMain ? "w-5 h-5" : "w-4 h-4"}`} />
          <span className={`font-bold text-center px-1 ${isMain ? "text-[9px]" : "text-[8px] font-medium"}`}>
            {isMain ? "FOTO UTAMA" : `Sub Foto ${index}`}
          </span>
        </div>
      )}

      {/* Hidden input to click */}
      <input
        type="file"
        id={inputId}
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      {/* Invisible overlay for click to upload without triggering drag */}
      {!photo.previewUrl && (
        <label
          htmlFor={inputId}
          className="absolute inset-0 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        ></label>
      )}
    </div>
  );
}

export default function PhotoGalleryDnD({ initialPhotos, onChange }: PhotoGalleryDnDProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);

  useEffect(() => {
    onChange(photos);
  }, [photos, onChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1920;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const compressedFile = new File([blob], fileName, {
                type: "image/webp",
              });
              const newUrl = URL.createObjectURL(compressedFile);
              setPhotos((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], file: compressedFile, previewUrl: newUrl, isExisting: false };
                return next;
              });
            }
          },
          "image/webp",
          0.8
        );
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
  };

  const handleRemove = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      // Generate a new ID so it acts as an empty slot again without keeping state
      next[index] = { id: `empty-${Date.now()}-${index}`, file: null, previewUrl: null, isExisting: false };
      return next;
    });
  };

  return (
    <DndContext
      id="photo-gallery-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-3">
        <SortableContext
          items={photos.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          {photos.map((photo, index) => (
            <SortablePhoto
              key={photo.id}
              photo={photo}
              index={index}
              onFileChange={(e) => handleFileChange(index, e)}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
