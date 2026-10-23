import React from 'react';
import { Student } from '../../types/erp';
import { NcertStemResourceHub } from './NcertStemResourceHub';

interface StudentArcadeProps {
  currentStudent: Student;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
  isScrolledDown?: boolean;
}

export const StudentArcade: React.FC<StudentArcadeProps> = ({
  currentStudent,
  handleAwardBonusXP,
  playUISound,
  showToast,
  isScrolledDown = false
}) => {
  return (
    <NcertStemResourceHub
      currentStudent={currentStudent}
      handleAwardBonusXP={handleAwardBonusXP}
      playUISound={playUISound}
      showToast={showToast}
      isScrolledDown={isScrolledDown}
    />
  );
};
