import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

export const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    products: [{ name: "" }],
  });
  const [editingLeadId, setEditingLeadId] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/leads/leads/");
      if (response.data) {
        setLeads(response.data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleProductChange = (index, value) => {
    const updatedProducts = [...formState.products];
    updatedProducts[index] = { name: value };
    setFormState({
      ...formState,
      products: updatedProducts,
    });
  };

  const addProductField = () => {
    setFormState({
      ...formState,
      products: [...formState.products, { name: "" }],
    });
  };

  const removeProductField = (index) => {
    const updatedProducts = formState.products.filter((_, i) => i !== index);
    setFormState({
      ...formState,
      products: updatedProducts,
    });
  };

  const createLead = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/leads/leads/", formState);
      if (response.data) {
        setLeads([...leads, response.data]);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  const editLead = (lead) => {
    setFormState(lead);
    setEditingLeadId(lead._id);
  };

  const updateLead = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5001/api/leads/leads/${editingLeadId}`, formState);
      if (response.data) {
        setLeads(leads.map((lead) => (lead._id === editingLeadId ? response.data : lead)));
        resetForm();
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const deleteLead = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/leads/leads/${id}`);
      setLeads(leads.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const resetForm = () => {
    setFormState({
      name: "",
      email: "",
      phone: "",
      products: [{ name: "" }],
    });
    setEditingLeadId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredLeads = Array.isArray(leads)
    ? leads
        .filter((lead) =>
          lead.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (sortOrder === "asc") {
            return a[sortField] > b[sortField] ? 1 : -1;
          } else {
            return a[sortField] < b[sortField] ? 1 : -1;
          }
        })
    : [];

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);


  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900">Lead Dashboard</h2>

      <div className="flex justify-center items-center w-full mb-6">
        <div className="w-full justify-center max-w-md">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <form
        onSubmit={editingLeadId ? updateLead : createLead}
        className="w-full max-w-md bg-white shadow-lg border border-gray-300 rounded-lg p-8 mb-6 space-y-4"
      >
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="phone"
          value={formState.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        {formState.products.map((product, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="text"
              value={product.name}
              onChange={(e) => handleProductChange(index, e.target.value)}
              placeholder="Product"
              required
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeProductField(index)}
                className="bg-red-500 text-white p-2 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addProductField}
          className="w-full bg-green-500 text-white p-3 rounded-lg mb-4"
        >
          Add Product
        </button>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg"
        >
          {editingLeadId ? "Update Lead" : "Create Lead"}
        </button>
      </form>

      <div className="w-full max-w-6xl overflow-x-auto bg-white shadow-lg border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-300"
              >
                Name
              </th>
              <th
                onClick={() => handleSort("email")}
                className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-300"
              >
                Email
              </th>
              <th
                onClick={() => handleSort("phone")}
                className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-300"
              >
                Phone
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Products
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead) => (
              <tr key={lead._id} className="border-b">
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{lead.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{lead.email}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{lead.phone}</td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  <ul>
                    {lead.products.map((product, index) => (
                      <li key={index}>{product.name}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-6 text-sm">
                  <button
                    onClick={() => editLead(lead)}
                    className="bg-yellow-500 text-white p-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="bg-red-500 text-white p-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * leadsPerPage >= filteredLeads.length}
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
