"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../lib/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

interface EditRecordModalProps {
  record: {
    id: string;
    plate_no: string;
    type: string;
    timestamp: Timestamp;
  };
  closeModal: () => void;
}

export default function EditRecordModal({
  record,
  closeModal,
}: EditRecordModalProps) {
  const [form, setForm] = useState({ plate_no: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      plate_no: record.plate_no,
      type: record.type,
    });
  }, [record]);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recordRef = doc(db, "records", record.id);
      await updateDoc(recordRef, {
        plate_no: form.plate_no,
        type: form.type,
        timestamp: new Date(), // Optional: update timestamp
      });

      toast.success("Record updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Failed to update record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      className="flex fixed justify-center items-center inset-0 bg-gray-500/50 z-50"
    >
      <form
        onSubmit={submitForm}
        className="bg-white rounded-lg w-full max-w-md border-t-4 border-blue-500 mx-2 shadow"
      >
        <div className="flex justify-between space-x-4 items-center border-b border-gray-500 rounded-t p-2">
          <h1 className="text-xl font-bold">Edit Record</h1>
          <i
            onClick={closeModal}
            className="fas fa-circle-xmark text-red-500 hover:opacity-50 hover:cursor-pointer"
          ></i>
        </div>

        <div className="space-y-4 mt-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plate Number
            </label>
            <input
              type="text"
              value={form.plate_no}
              onChange={(e) => setForm({ ...form, plate_no: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Enter plate number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type:
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
              required
            >
              <option value="">Select an option</option>
              <option value="check-in">Check-in</option>
              <option value="check-out">Check-out</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-500 bg-gray-100 p-2 rounded-b-xl">
          <button
            type="submit"
            className="px-4 py-2 text-blue-100 bg-blue-500 rounded hover:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
