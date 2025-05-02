"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Layout from "../layouts/layout";
import AddRecordModal from "../components/addrecordmodal";
import EditRecordModal from "../components/editrecordmodal";
import ConfirmDeleteRecordModal from "../components/confirmdeleterecordmodal";
import { toast } from "react-toastify";

interface RecordItem {
  id: string;
  plate_no: string;
  type: string;
  timestamp: Timestamp;
}

interface SelectedRecord {
  id: string;
  plate_no: string;
  type: string;
  timestamp: Timestamp;
}

export default function TablePage() {
  const [data, setData] = useState<RecordItem[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [order, setOrder] = useState("DESC");
  const [isOpenAddRecordModal, setIsOpenAddRecordModal] = useState(false);
  const [isOpenEditRecordModal, setIsOpenEditRecordModal] = useState(false);
  const [isOpenConfirmDeleteRecordModal, setIsOpenConfirmDeleteRecordModal] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(
    null
  );
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "records"),
      orderBy("timestamp", order === "ASC" ? "asc" : "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const records: RecordItem[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<RecordItem, "id">),
        }));
        setData(records);
      },
      (err) => {
        console.error("Error fetching records:", err);
      }
    );

    return () => unsubscribe();
  }, [order]);

  const filteredData = data.filter((item) => {
    const matchSearch = item.plate_no
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType = type ? item.type === type : true;
    return matchSearch && matchType;
  });

  const toggleAddVehicleModal = () => {
    setIsOpenAddRecordModal((prev) => !prev);
  };

  const toggleEditVehicleModal = (record: SelectedRecord) => {
    setSelectedRecord(record);
    setIsOpenEditRecordModal(true);
  };

  const toggleConfirmDeleteModal = (recordId: string) => {
    setSelectedRecordId(recordId);
    setIsOpenConfirmDeleteRecordModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedRecordId) return;

    try {
      await deleteDoc(doc(db, "records", selectedRecordId));
      toast.success("Record deleted successfully");
    } catch (err) {
      console.error("Error deleting record:", err);
      toast.error("Failed to delete record");
    } finally {
      setIsOpenConfirmDeleteRecordModal(false);
      setSelectedRecordId(null);
    }
  };

  return (
    <Layout>
      {isOpenAddRecordModal && <AddRecordModal />}
      {isOpenEditRecordModal && selectedRecord && (
        <EditRecordModal
          record={selectedRecord}
          closeModal={() => setIsOpenEditRecordModal(false)}
        />
      )}
      {isOpenConfirmDeleteRecordModal && selectedRecordId && (
        <ConfirmDeleteRecordModal
          recordId={selectedRecordId}
          message="Are you sure to delete this record?"
          closeModal={() => setIsOpenConfirmDeleteRecordModal(false)}
          onConfirm={handleDeleteConfirmed}
        />
      )}

      <div className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h1 className="text-xl font-bold w-full sm:w-auto">Records</h1>
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-500 px-2 py-1.5"
              placeholder="Search plate #"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-2 border border-gray-500 text-sm sm:text-base"
            >
              <option value="">All</option>
              <option value="check-in">Check-in</option>
              <option value="check-out">Check-out</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="px-4 py-2 border border-gray-500 text-sm sm:text-base"
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mb-2">
          <button
            onClick={toggleAddVehicleModal}
            className="px-4 py-2 text-blue-100 bg-blue-500 rounded hover:opacity-50"
          >
            Add Record
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="py-2 px-4 text-left">Plate Number</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Date & Time</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 border-b border-gray-200"
                >
                  <td className="py-2 px-4">{item.plate_no}</td>
                  <td
                    className={
                      item.type === "check-in"
                        ? "py-2 px-4 text-green-500"
                        : "py-2 px-4 text-red-500"
                    }
                  >
                    {item.type}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(item.timestamp.toDate()).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 space-x-4">
                    <i
                      className="fas fa-pencil text-yellow-500 hover:opacity-50 cursor-pointer"
                      onClick={() => toggleEditVehicleModal(item)}
                    ></i>
                    <i
                      className="fas fa-trash text-red-500 hover:opacity-50 cursor-pointer"
                      onClick={() => toggleConfirmDeleteModal(item.id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
