const Table = require("../models/Table");

// Checks whether a table is currently free to be assigned/reserved
const isTableAvailable = async (tableId) => {
  const table = await Table.findById(tableId);
  if (!table) throw new Error("Table not found");
  return table.status === "available";
};

const markTableOccupied = async (tableId) => {
  return Table.findByIdAndUpdate(tableId, { status: "occupied" }, { new: true });
};

const markTableReserved = async (tableId) => {
  return Table.findByIdAndUpdate(tableId, { status: "reserved" }, { new: true });
};

const markTableAvailable = async (tableId) => {
  return Table.findByIdAndUpdate(tableId, { status: "available" }, { new: true });
};

module.exports = {
  isTableAvailable,
  markTableOccupied,
  markTableReserved,
  markTableAvailable,
};
