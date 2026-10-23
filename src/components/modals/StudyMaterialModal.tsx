import React from 'react';
import { StudyMaterial } from '../../types/erp';
import { StreamlineIcon } from '../common/StreamlineIcon';

interface StudyMaterialModalProps {
  readingMaterial: StudyMaterial | null;
  onClose: () => void;
  onCompleteReview: (material: StudyMaterial) => void;
}

export const StudyMaterialModal: React.FC<StudyMaterialModalProps> = ({
  readingMaterial,
  onClose,
  onCompleteReview
}) => {
  if (!readingMaterial) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#13221F]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] border border-[#D5CBB8] rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0E6B5E]">
              {readingMaterial.subject} • Section {readingMaterial.grade}
            </p>
            <h3 className="text-base font-semibold text-[#1C2A27] mt-1">{readingMaterial.title}</h3>
            <p className="text-xs text-[#686052]">Prepared by {readingMaterial.uploadedBy}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg border border-[#D5CBB8] hover:bg-[#F5F0E6] text-[#5A5346]">
            <StreamlineIcon name="close" className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 rounded-lg bg-[#F5F0E6] border border-[#DDD4C2] text-xs leading-relaxed text-[#2C3532]">
          {readingMaterial.content}
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onCompleteReview(readingMaterial)}
            className="px-4 py-2 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] font-medium text-xs"
          >
            Mark Reviewed (+30 XP)
          </button>
        </div>
      </div>
    </div>
  );
};
