import React from 'react';
import type { JenisKendaraan } from '../types/parking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

interface VehicleBadgeProps {
  jenis: JenisKendaraan;
}

const VehicleBadge: React.FC<VehicleBadgeProps> = ({ jenis }) => {
  if (jenis === 'Motor') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-800 border border-pink-200">
        <span><FontAwesomeIcon icon={faMotorcycle} /></span> Motor
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
      <span><FontAwesomeIcon icon={faCarSide} /></span> Mobil
    </span>
  );
};

export default VehicleBadge;
