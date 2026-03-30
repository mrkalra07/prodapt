import { useCallback, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Table from "../components/Table";
import { createHub, deleteHub, getHubs, updateHub } from "../api/hubApi";
import { useFetch } from "../hooks/useFetch";
import { formatDate } from "../utils/formatDate";

export default function HubManagement() {
  const fetchHubs = useCallback(() => getHubs(), []);
  const { data, loading, error, run } = useFetch(fetchHubs, true);
  const [form, setForm] = useState({ hub_name: "", city: "" });
  const [editingHubId, setEditingHubId] = useState("");
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setActionError("");

    try {
      if (editingHubId) {
        await updateHub(editingHubId, form);
        setMessage("Hub updated successfully.");
      } else {
        await createHub(form);
        setMessage("Hub created successfully.");
      }
      setForm({ hub_name: "", city: "" });
      setEditingHubId("");
      await run();
    } catch (err) {
      setActionError(err.response?.data?.detail || "Unable to save hub.");
    }
  }

  const rows = data?.hubs || [];

  const columns = [
    { key: "hub_name", label: "Hub Name" },
    { key: "city", label: "City" },
    {
      key: "created_at",
      label: "Created",
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "update",
      label: "Edit",
      render: (row) => (
        <button
          className="button button--ghost"
          type="button"
          onClick={() => {
            setMessage("");
            setActionError("");
            setEditingHubId(row.id);
            setForm({ hub_name: row.hub_name, city: row.city });
          }}
        >
          Edit Hub
        </button>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (row) => (
        <button
          className="button button--danger"
          type="button"
          onClick={async () => {
            setMessage("");
            setActionError("");

            try {
              await deleteHub(row.id);
              setMessage(`Deleted ${row.hub_name}.`);
              if (editingHubId === row.id) {
                setEditingHubId("");
                setForm({ hub_name: "", city: "" });
              }
              await run();
            } catch (err) {
              setActionError(err.response?.data?.detail || "Unable to delete hub.");
            }
          }}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <section className="card form-card">
        <p className="eyebrow">Admin Action</p>
        <h2>Hub Management</h2>
        <form className="form-grid form-grid--compact" onSubmit={handleSubmit}>
          <label>
            Hub name
            <input
              required
              value={form.hub_name}
              onChange={(event) => setForm({ ...form, hub_name: event.target.value })}
            />
          </label>

          <label>
            City
            <input
              required
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
            />
          </label>

          <div className="button-group">
            <button className="button" type="submit">
              {editingHubId ? "Update Hub" : "Add Hub"}
            </button>
            {editingHubId ? (
              <button
                className="button button--ghost"
                type="button"
                onClick={() => {
                  setEditingHubId("");
                  setForm({ hub_name: "", city: "" });
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
        {message ? <p className="success-text">{message}</p> : null}
        {error || actionError ? <p className="error-text">{actionError || error}</p> : null}
      </section>

      {loading ? <Loader /> : null}

      <section className="card">
        <Table columns={columns} rows={rows} emptyMessage="No hubs available." />
      </section>
    </Layout>
  );
}
