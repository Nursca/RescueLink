import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, Users, Scale, Leaf } from 'lucide-react';
import { ImpactStats } from '../types';

interface DashboardProps {
    stats: ImpactStats;
}

const data = [
  { name: 'Mon', meals: 400, co2: 240 },
  { name: 'Tue', meals: 300, co2: 139 },
  { name: 'Wed', meals: 200, co2: 980 },
  { name: 'Thu', meals: 278, co2: 390 },
  { name: 'Fri', meals: 189, co2: 480 },
  { name: 'Sat', meals: 239, co2: 380 },
  { name: 'Sun', meals: 349, co2: 430 },
];

const categoryData = [
    { name: 'Produce', value: 400 },
    { name: 'Bakery', value: 300 },
    { name: 'Dairy', value: 300 },
    { name: 'Prepared', value: 200 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; trend?: string }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
                <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
                    <dd>
                        <div className="text-2xl font-bold text-slate-900">{value}</div>
                        {trend && (
                             <p className="flex items-center text-xs text-emerald-600 font-medium mt-1">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                {trend} this week
                             </p>
                        )}
                    </dd>
                </dl>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Meals Recovered" value={stats.totalMealsSaved.toLocaleString()} icon={Users} color="bg-emerald-500" trend="12%" />
        <StatCard title="CO2 Avoided (kg)" value={stats.co2ReducedKg.toLocaleString()} icon={Leaf} color="bg-teal-500" trend="8%" />
        <StatCard title="Food Rescued (kg)" value={(stats.totalMealsSaved * 0.5).toLocaleString()} icon={Scale} color="bg-blue-500" trend="15%" />
        <StatCard title="Active Communities" value={stats.communitiesServed.toString()} icon={Users} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Impact Over Time</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="meals" stroke="#10b981" fillOpacity={1} fill="url(#colorMeals)" name="Meals" />
                        <Area type="monotone" dataKey="co2" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCo2)" name="CO2 Saved" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* Category Chart */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Rescued by Category</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                         <XAxis type="number" hide />
                         <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                         <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                         <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;