import React, { useState, useEffect } from 'react';
import api from '@/api';
import Loader from '@/components/common/Loader';
import { FiUsers, FiShoppingBag, FiArchive, FiDollarSign } from 'react-icons/fi';

const StatCard = ({ title, value, icon, color }) => (
    <div className="glass-card p-6">
        <div className="flex items-center">
            <div className={`p-3 rounded-full mr-4 bg-${color}-500/20 text-${color}-400`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);


const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>

            {stats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Users" value={stats.totalUsers} icon={<FiUsers size={24} />} color="sky" />
                        <StatCard title="Total Shops" value={stats.totalShops} icon={<FiShoppingBag size={24} />} color="emerald" />
                        <StatCard title="Total Orders" value={stats.orderStats.total} icon={<FiArchive size={24} />} color="amber" />
                        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={<FiDollarSign size={24} />} color="rose" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4">Users by Role</h3>
                            <ul className="space-y-2">
                                {Object.entries(stats.usersByRole).map(([role, count]) => (
                                    <li key={role} className="flex justify-between">
                                        <span className="capitalize">{role}</span>
                                        <span className="font-mono bg-slate-800 px-2 rounded">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4">Shops by Status</h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between"><span>Verified</span><span className="font-mono bg-green-500/20 text-green-300 px-2 rounded">{stats.shops.verified}</span></li>
                                <li className="flex justify-between"><span>Unverified</span><span className="font-mono bg-yellow-500/20 text-yellow-300 px-2 rounded">{stats.shops.unverified}</span></li>
                            </ul>
                        </div>
                         <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4">Orders by Status</h3>
                            <ul className="space-y-2">
                                {Object.entries(stats.orderStats).filter(([key])=> key !== 'total').map(([status, count]) => (
                                    <li key={status} className="flex justify-between">
                                        <span className="capitalize">{status}</span>
                                        <span className="font-mono bg-slate-800 px-2 rounded">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboardPage;