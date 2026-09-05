"use client";
import { useState, useEffect } from "react";
import {
    fetchAdminUsers, createAdminUser, toggleAdminUserActive, deleteAdminUser,
    type AdminUserFull, type CreateUserPayload,
} from "@/lib/api/admin/users";

const ROLES = [
    { value: "SUPER_ADMIN", label: "Super Admin", color: "bg-red-100 text-red-700" },
    { value: "SALES_MANAGER", label: "Sales Manager", color: "bg-blue-100 text-blue-700" },
    { value: "SALES_EXECUTIVE", label: "Sales Executive", color: "bg-green-100 text-green-700" },
    { value: "CONTENT_MANAGER", label: "Content Manager", color: "bg-purple-100 text-purple-700" },
] as const;

const roleColor = (role: string) =>
    ROLES.find(r => r.value === role)?.color ?? "bg-gray-100 text-gray-600";
const roleLabel = (role: string) =>
    ROLES.find(r => r.value === role)?.label ?? role;

const EMPTY_FORM: CreateUserPayload = {
    fullName: "", email: "", password: "", role: "SALES_EXECUTIVE",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUserFull[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<CreateUserPayload>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminUserFull | null>(null);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            setUsers(await fetchAdminUsers());
        } catch {
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError("");
        setFormSuccess("");
        try {
            const created = await createAdminUser(form);
            setUsers(prev => [created, ...prev]);
            setForm(EMPTY_FORM);
            setShowForm(false);
            setFormSuccess("User created successfully.");
            setTimeout(() => setFormSuccess(""), 4000);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to create user.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            const updated = await toggleAdminUserActive(id);
            setUsers(prev => prev.map(u => u.id === id ? updated : u));
        } catch {
            alert("Failed to update user status.");
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setDeletingId(confirmDelete.id);
        try {
            await deleteAdminUser(confirmDelete.id);
            setUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
            setConfirmDelete(null);
        } catch {
            alert("Failed to delete user.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy">User Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {users.length} admin {users.length === 1 ? "user" : "users"}
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(f => !f); setFormError(""); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: "var(--navy)" }}
                >
                    <span className="text-lg leading-none">{showForm ? "✕" : "+"}</span>
                    {showForm ? "Cancel" : "Add User"}
                </button>
            </div>

            {/* Success banner */}
            {formSuccess && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                    ✓ {formSuccess}
                </div>
            )}

            {/* Create form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                    <h2 className="text-base font-semibold text-navy mb-5">Create New Admin User</h2>

                    {formError && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                            ⚠ {formError}
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                            <input
                                required value={form.fullName}
                                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                placeholder="e.g. Rahul Sharma"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
                            <input
                                required type="email" value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="rahul@thechoicecompany.in"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    required type={showPass ? "text" : "password"}
                                    value={form.password} minLength={8}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    placeholder="Min 8 characters"
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                                />
                                <button type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
                                    {showPass ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                            <select
                                value={form.role}
                                onChange={e => setForm(f => ({ ...f, role: e.target.value as CreateUserPayload["role"] }))}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                            >
                                {ROLES.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                            <button type="button"
                                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                                className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving}
                                className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50 transition-all"
                                style={{ background: "var(--navy)" }}>
                                {saving ? "Creating…" : "Create User"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* User list */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-500">{error}</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">👤</p>
                        <p className="font-medium">No users yet</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                {["User", "Role", "Status", "Last Login", "Actions"].map(h => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">

                                    {/* User */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                                style={{ background: "var(--navy)" }}>
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.fullName}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role */}
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${roleColor(user.role)}`}>
                                            {roleLabel(user.role)}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => handleToggle(user.id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all
                                                ${user.isActive
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                                            {user.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </td>

                                    {/* Last Login */}
                                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                                        {user.lastLogin
                                            ? new Date(user.lastLogin).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })
                                            : "Never"
                                        }
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => setConfirmDelete(user)}
                                            disabled={deletingId === user.id}
                                            className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline disabled:opacity-40 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete confirm modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                        <h3 className="text-base font-bold text-navy mb-2">Delete User?</h3>
                        <p className="text-sm text-gray-600 mb-5">
                            <span className="font-semibold">{confirmDelete.fullName}</span> ({confirmDelete.email}) will be permanently removed. This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={!!deletingId}
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 transition-colors">
                                {deletingId ? "Deleting…" : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}