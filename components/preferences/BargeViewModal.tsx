import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface BargeViewModalProps {
  barge: any;
}

const BargeViewModal: React.FC<BargeViewModalProps> = ({ barge }) => {
  return (
    <div>
      <p className="text-sm mb-2">
        <span className="font-bold">Barge Name:</span>
        {barge?.name}
      </p>
      <p className="text-sm mb-2">
        <span className="font-bold">Barge Rooms:</span>
        {barge?.rooms}
      </p>
      <p className="text-sm mb-2">
        <span className="font-bold">Barge Location:</span>
        {barge?.barge_location}
      </p>
      <p className="text-sm mb-2">
        <span className="font-bold">Store Location:</span>
        {barge?.store_location}
      </p>
      <p className="text-sm mb-2">
        <span className="font-bold">Added By:</span>
        {barge?.user?.first_name} {barge?.user?.last_name}
      </p>
      <p className="text-sm mb-2">
        <span className="font-bold">Barge Status:</span>
        {barge?.status}
      </p>
      <p className="text-sm mb-2">
        <span className="font-bold">Barge Deck Level:</span>
        {barge?.deck_level}
      </p>
    </div>
  );
};

export default BargeViewModal;
